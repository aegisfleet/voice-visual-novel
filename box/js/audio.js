// audio.js - Web Audio API による効果音・サイバーBGM生成 & Web Speech API による音声読み上げ (BOX WORM)

class AudioManager {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
    this.bgmVolume = 0.35; // ノベルゲーム背景音として最適なミキシングバランス
    this.currentBgmMode = 'title'; // title | ambient | explore | tension | truth
    this.currentBgmTrack = null; // { audio, source, gain, url, mode }
    this.bgmMasterGain = null;
    this.bgmTracks = {
      title: 'assets/audio/bgm_title.mp3',
      ambient: 'assets/audio/bgm_investigation.mp3',
      explore: 'assets/audio/bgm_investigation.mp3',
      tension: 'assets/audio/bgm_crisis.mp3',
      truth: 'assets/audio/bgm_truth.mp3',
    };
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.isSkipActive = false; // スキップモード追従フラグ（通信量完全ガード用）
    this.masterGainNode = null; // 全体マスターゲイン
    this.bgmMasterGain = null; // BGM用ゲイン
    this.voiceGainNode = null; // ボイス用ゲイン (Web Audio API接続用)
    this.sfxGainNode = null; // 効果音用ゲイン
    this.voiceAudio = typeof Audio !== 'undefined' ? new Audio() : null; // LINE内ブラウザ/iOS Safari自動再生対策・単一再利用Audio要素
    if (this.voiceAudio) this.voiceAudio.preload = 'auto';
    this.currentVoiceAudio = null; // 再生中Audio要素
    this.isVoiceAudioUnlocked = false; // ボイスAudioアンロック済みフラグ
    this.pendingBgmMode = null; // 自動再生制限時の保留中BGMモード
    this.isAudioUnlocked = false; // オーディオアンロック済みフラグ
    this.isSpeechUnlocked = false; // WebSpeechアンロック済みフラグ
    this.wasBgmPlayingBeforeHide = false; // 画面非表示前のBGM再生状態退避
    this.playSessionId = 0; // 音声再生世代カウンタ (競合・中断防止)

    this.initSpeech();
    this.setupLifecycleListeners();
    this.setupEarlyUnlock();
  }

  // モバイルライフサイクルイベントの監視 (LINE内ブラウザ等でのバックグラウンド音声漏れ完全防止)
  setupLifecycleListeners() {
    if (typeof window === 'undefined') return;

    const handleHide = () => this.pauseAll();
    const handleShow = () => this.resumeAll();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          handleHide();
        } else if (document.visibilityState === 'visible') {
          handleShow();
        }
      });
    }

    window.addEventListener('pagehide', handleHide);
    window.addEventListener('beforeunload', handleHide);
  }

  // 画面初回タッチ/クリック時の早期アンロック (LINE内ブラウザAutoplay制限の完全突破・touchend対応)
  setupEarlyUnlock() {
    if (typeof window === 'undefined') return;

    const earlyUnlock = () => {
      this.unlockAudio();
      window.removeEventListener('click', earlyUnlock, true);
      window.removeEventListener('touchstart', earlyUnlock, true);
      window.removeEventListener('touchend', earlyUnlock, true);
      window.removeEventListener('keydown', earlyUnlock, true);
    };

    window.addEventListener('click', earlyUnlock, true);
    window.addEventListener('touchstart', earlyUnlock, true);
    window.addEventListener('touchend', earlyUnlock, true);
    window.addEventListener('keydown', earlyUnlock, true);
  }

  pauseCurrentBgm() {
    if (this.currentBgmTrack?.audio && !this.currentBgmTrack.audio.paused) {
      this.wasBgmPlayingBeforeHide = true;
      try {
        this.currentBgmTrack.audio.pause();
      } catch (_e) {}
    }
  }

  suspendAudioContext() {
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch (_e) {}
    }
  }

  // 画面非表示・ブラウザ終了（LINE内ブラウザ「×」含む）時の全音声即時停止
  pauseAll() {
    this.stopVoice();
    this.pauseCurrentBgm();
    this.suspendAudioContext();
  }

  // 画面復帰時の音声再開
  resumeAll() {
    this.ensureContext();

    if (this.wasBgmPlayingBeforeHide && this.currentBgmTrack?.audio && this.bgmEnabled) {
      const playPromise = this.currentBgmTrack.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[AudioManager] BGM resume failed:', err);
        });
      }
    }
    this.wasBgmPlayingBeforeHide = false;
  }

  // ボイス再生状態の通知
  dispatchVoiceState(isPlaying, speaker = '') {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('box-voice-state', {
          detail: { isPlaying: Boolean(isPlaying), speaker },
        }),
      );
    }
  }

  initContextDestination() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initGainNodes() {
    if (!this.ctx) return;
    if (!this.masterGainNode) {
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }
    if (!this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.masterGainNode);
    }
    if (!this.voiceGainNode) {
      this.voiceGainNode = this.ctx.createGain();
      this.voiceGainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.voiceGainNode.connect(this.masterGainNode);
    }
    if (!this.sfxGainNode) {
      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGainNode.connect(this.masterGainNode);
    }
  }

  // AudioContext の初期化 (ユーザー操作時に呼出・eve準拠の統合ノードグラフ)
  ensureContext() {
    this.initContextDestination();
    this.initGainNodes();
  }

  // Web Speech API の初期化
  initSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.speechSynthesisAvailable = false;
      return;
    }
    this.speechSynthesisAvailable = true;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // 日本語の音声を優先選択
      this.selectedVoice = voices.find((v) => v.lang.startsWith('ja')) || voices[0] || null;
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  // スキップ状態の同期（スキップ開始時は即座に音声ロード＆再生を完全遮断）
  setSkipMode(isSkip) {
    this.isSkipActive = !!isSkip;
    if (this.isSkipActive) {
      this.stopVoice();
    }
  }

  // セリフ読み上げ（MP3優先 / Web Speech APIフォールバック対応）
  speak(speaker, text, options = {}) {
    // スキップ中・音声無効時はリクエストや再生を完全にガード（通信量0を保証）
    if (this.isSkipActive || options.isSkip || !this.voiceEnabled) {
      this.stopVoice();
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopVoice();

    // 将来のTTS MP3音声URLが指定されている場合（オンデマンド再生）
    if (options.audioUrl) {
      this.playVoiceFile(options.audioUrl, { speaker, text, ...options });
      return;
    }

    // Web Speech API による合成音声
    this.speakSpeechSynthesis(speaker, text, options);
  }

  // 単独ボイス再生ヘルパー
  playVoice(url, options = {}) {
    return this.playVoiceFile(url, options);
  }

  handleVoiceEnded(audio, options, sessionId) {
    if (this.playSessionId !== sessionId) return;
    if (this.currentVoiceAudio === audio) {
      this.currentVoiceAudio = null;
    }
    this.dispatchVoiceState(false);
    if (options.onEnd) options.onEnd();
  }

  handleVoiceLoadError(url, options, sessionId, error) {
    if (this.playSessionId !== sessionId) return;
    this.dispatchVoiceState(false);
    if (this.isSkipActive) return;
    console.warn(`[Audio] Failed to load voice file: ${url}`, error);
    if (options.speaker && options.text) {
      this.speakSpeechSynthesis(options.speaker, options.text, options);
    } else if (options.onEnd) {
      options.onEnd();
    }
  }

  handleVoicePlaySuccess(audio, options, sessionId) {
    if (this.playSessionId !== sessionId || this.isSkipActive) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_e) {}
      return;
    }
    this.dispatchVoiceState(true, options.speaker || '');
  }

  handleVoicePlayFailure(err, options, sessionId) {
    if (this.playSessionId !== sessionId) return;
    this.dispatchVoiceState(false);
    if (err.name !== 'AbortError') {
      console.warn('[Audio] playVoiceFile aborted/interrupted:', err.message);
      if (options.speaker && options.text) {
        this.speakSpeechSynthesis(options.speaker, options.text, options);
        return;
      }
    }
    if (options.onEnd) options.onEnd();
  }

  // ネイティブ HTMLAudioElement による同期ボイス再生（WebKitのUser Gestureを一切失わず直接鳴動・MPEG-2 24kHz完全対応）
  executeDirectVoicePlay(audio, url, options, sessionId) {
    audio.onended = () => this.handleVoiceEnded(audio, options, sessionId);
    audio.onerror = (e) => this.handleVoiceLoadError(url, options, sessionId, e);

    audio.src = url;
    try {
      audio.currentTime = 0;
    } catch (_e) {}

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => this.handleVoicePlaySuccess(audio, options, sessionId))
        .catch((err) => this.handleVoicePlayFailure(err, options, sessionId));
    }
  }

  isVoicePlaybackBlocked(url, options) {
    if (this.isSkipActive || options.isSkip) return true;
    if (!this.voiceEnabled || !url) return true;
    return false;
  }

  // MP3音声ファイルのロード＆再生（単一Audio要素再利用・同期的直接再生・LINE内ブラウザ完全適合）
  playVoiceFile(url, options = {}) {
    if (this.isVoicePlaybackBlocked(url, options)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopVoice();

    const sessionId = ++this.playSessionId;
    this.ensureContext();

    // LINE内ブラウザ/iOS Safari対策: アンロック済みの単一Audio要素を再利用
    if (!this.voiceAudio && typeof Audio !== 'undefined') {
      try {
        this.voiceAudio = new Audio();
        this.voiceAudio.preload = 'auto';
      } catch (_e) {}
    }

    const audio = this.voiceAudio || new Audio();
    this.currentVoiceAudio = audio;

    this.executeDirectVoicePlay(audio, url, options, sessionId);
  }

  // 音声が現在再生中かどうかを判定
  isVoicePlaying() {
    const isAudioPlaying = Boolean(
      this.currentVoiceAudio && !this.currentVoiceAudio.paused && !this.currentVoiceAudio.ended,
    );
    const isSpeechActive = Boolean(
      typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis?.speaking,
    );
    return isAudioPlaying || isSpeechActive;
  }

  // 読み上げ停止（Audio要素＆WebSpeechの完全停止・世代進行による過去コールバック遮断）
  stopVoice() {
    this.playSessionId++; // 世代を進めて過去の非同期待機やPromise解決コールバックをすべて無効化
    this.stopSpeech();

    if (this.currentVoiceAudio) {
      const audio = this.currentVoiceAudio;
      this.currentVoiceAudio = null;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_e) {}
    }
    this.dispatchVoiceState(false);
  }

  cleanSpeechText(text) {
    if (!text) return '';
    return text
      .replace(/[（）()「」『』]/g, ' ')
      .replace(/[・…ー〜]/g, ' ')
      .trim();
  }

  setupSpeechUtterance(cleanText, speaker, options) {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      this.dispatchVoiceState(true, speaker);
    };
    utterance.onend = () => {
      this.dispatchVoiceState(false);
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      this.dispatchVoiceState(false);
      if (options.onEnd) options.onEnd();
    };

    const profile = this.getVoiceProfile(speaker);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    return utterance;
  }

  // 従来のWeb Speech API読み上げ
  speakSpeechSynthesis(speaker, text, options = {}) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopSpeech();

    const cleanText = this.cleanSpeechText(text);
    if (!cleanText) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = this.setupSpeechUtterance(cleanText, speaker, options);
    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // Web Speech 用のキャラクター音声プロファイル
  getVoiceProfile(speaker) {
    if (speaker.includes('ユウタ') || speaker.includes('主人公')) {
      return { pitch: 1.05, rate: 1.1 };
    }
    if (speaker.includes('シバタ')) {
      return { pitch: 0.72, rate: 0.95 };
    }
    if (speaker.includes('アオイ')) {
      return { pitch: 1.25, rate: 1.12 };
    }
    if (speaker.includes('ヤエガシ') || speaker.includes('大家')) {
      return { pitch: 0.85, rate: 1.0 };
    }
    if (
      speaker.includes('MIMI') ||
      speaker.includes('ミミ') ||
      speaker.includes('TVボックス') ||
      speaker.includes('知性')
    ) {
      return { pitch: 1.15, rate: 0.8 };
    }
    return { pitch: 1.0, rate: 1.05 };
  }

  // 読み上げ停止
  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // 音声ON/OFF切り替え
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopVoice();
    }
    return this.voiceEnabled;
  }

  toggleSe() {
    this.seEnabled = !this.seEnabled;
    return this.seEnabled;
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    if (!this.bgmEnabled) {
      this.stopBgm();
    } else {
      this.startBgm(this.currentBgmMode);
    }
    return this.bgmEnabled;
  }

  // ----------------------------------------------------
  // シンセサイザー効果音 (Web Audio API)
  // ----------------------------------------------------

  // クリック / UI操作音
  playClick() {
    if (!this.seEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode || this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 証拠発見 / ひらめき音（パターンB: 爽やかピロリン♪）
  playFound() {
    if (!this.seEnabled) return;
    this.ensureContext();

    try {
      const audio = new Audio('assets/audio/sfx_evidence.mp3?v=20261018_rev82');
      audio.volume = 0.45;
      audio.play().catch(() => this._playSynthFound());
    } catch (_e) {
      this._playSynthFound();
    }
  }

  _playSynthFound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // パターンB: E6 (1318.51Hz) -> G#6 (1661.22Hz) -> B6 (1975.53Hz) のセレスタ・アルペジオ
    const notes = [
      { freq: 1318.51, delay: 0, duration: 0.35, gain: 0.08 },
      { freq: 1661.22, delay: 0.065, duration: 0.4, gain: 0.1 },
      { freq: 1975.53, delay: 0.13, duration: 0.6, gain: 0.12 },
    ];
    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.delay);

      gain.gain.setValueAtTime(0, now + note.delay);
      gain.gain.linearRampToValueAtTime(note.gain, now + note.delay + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.delay + note.duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);

      osc.start(now + note.delay);
      osc.stop(now + note.delay + note.duration);
    });
  }

  // パケット通信音 / 電子音
  playPacketPulse() {
    if (!this.seEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode || this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // 激突・カットイン音（論破・異議あり）
  playCutin() {
    if (!this.seEnabled) return;
    this.ensureContext();

    try {
      const audio = new Audio('assets/audio/sfx_cutin.mp3?v=20261018_rev82');
      audio.volume = 0.45;
      audio.play().catch(() => this._playSynthCutin());
    } catch (_e) {
      this._playSynthCutin();
    }
  }

  _playSynthCutin() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 低音インパクト（音量を控えめに調整）
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    subGain.gain.setValueAtTime(0.18, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGainNode || this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.4);

    // 高音金属クラッシュ（音量を控えめに調整）
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGainNode || this.ctx.destination);

    noise.start(now);
  }

  // ショック・ダメージ音（間違い・動揺・ライフ減少）
  playShock() {
    if (!this.seEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGainNode || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 不正解・警告音（playShockのエイリアス）
  playWrong() {
    this.playShock();
  }

  // ダメージ演出音（playShockのエイリアス）
  playDamage() {
    this.playShock();
  }

  // ----------------------------------------------------
  // Google DeepMind Lyria 3 生成音源によるBGM再生システム
  // (Web Audio API スムーズクロスフェード & シームレスループ)
  // ----------------------------------------------------

  unlockWebAudio() {
    if (this.ctx && !this.isAudioUnlocked) {
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch (_e) {}
    }
  }

  unlockVoiceAudio() {
    // 後方互換用: Web Audio API (AudioBuffer) 移行により単一Audioの事前無音ロードは不要
    this.isVoiceAudioUnlocked = true;
  }

  unlockSpeechSynthesis() {
    if ('speechSynthesis' in window && !this.isSpeechUnlocked) {
      try {
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
      } catch (_e) {}
      this.isSpeechUnlocked = true;
    }
  }

  // ユーザー操作によるオーディオアンロック & 保留中BGM再開 (LINE内ブラウザ完全対応)
  unlockAudio() {
    this.ensureContext();
    this.unlockWebAudio();
    this.unlockVoiceAudio();
    this.unlockSpeechSynthesis();
    this.isAudioUnlocked = true;

    if (this.pendingBgmMode && this.bgmEnabled) {
      const mode = this.pendingBgmMode;
      this.pendingBgmMode = null;
      this.startBgm(mode);
    }
  }

  fadeInAudio(audio, targetVol, durationMs = 1200) {
    const fadeSteps = 12;
    const stepInterval = durationMs / fadeSteps;
    let stepCount = 0;
    const inTimer = setInterval(() => {
      stepCount++;
      if (stepCount >= fadeSteps) {
        clearInterval(inTimer);
        try {
          audio.volume = targetVol;
        } catch (_e) {}
      } else {
        try {
          audio.volume = (stepCount / fadeSteps) * targetVol;
        } catch (_e) {}
      }
    }, stepInterval);
  }

  isBgmAlreadyPlaying(url) {
    return Boolean(
      this.currentBgmTrack &&
        this.currentBgmTrack.url === url &&
        !this.currentBgmTrack.audio.paused,
    );
  }

  createAndPlayBgmTrack(url, mode) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.001; // フェードイン開始初期音量

    this.fadeInAudio(audio, this.bgmVolume);

    this.currentBgmTrack = { audio, url, mode };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[AudioManager] BGM autoplay waiting for user interaction:', err);
        this.pendingBgmMode = mode;
      });
    }
  }

  startBgm(mode = 'ambient') {
    this.currentBgmMode = mode;
    if (!this.bgmEnabled) return;

    const url = this.bgmTracks[mode] || this.bgmTracks.ambient;
    if (!url) return;

    this.ensureContext();

    if (this.isBgmAlreadyPlaying(url)) return;

    if (this.currentBgmTrack) {
      this._fadeOutAndCleanTrack(this.currentBgmTrack, 1.0);
    }

    this.createAndPlayBgmTrack(url, mode);
  }

  _applyFadeOutSteps(audio, startVol, steps, stepTime) {
    let currentStep = 0;
    const fadeTimer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(fadeTimer);
        try {
          audio.volume = 0;
        } catch (_e) {}
      } else {
        try {
          audio.volume = Math.max(0, startVol * (1 - currentStep / steps));
        } catch (_e) {}
      }
    }, stepTime);
  }

  _scheduleAudioTeardown(audio, delayMs) {
    setTimeout(() => {
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch (_e) {}
    }, delayMs);
  }

  _fadeOutAndCleanTrack(track, fadeSec = 0.8) {
    if (!track) return;
    const { audio } = track;

    const startVol = audio.volume;
    const steps = 8;
    const stepTime = (fadeSec * 1000) / steps;
    this._applyFadeOutSteps(audio, startVol, steps, stepTime);

    const delayMs = Math.max(100, Math.floor(fadeSec * 1000) + 50);
    this._scheduleAudioTeardown(audio, delayMs);
  }

  stopBgm(fadeSec = 0.8) {
    if (this.currentBgmTrack) {
      this._fadeOutAndCleanTrack(this.currentBgmTrack, fadeSec);
      this.currentBgmTrack = null;
    }
  }
}

window.audioMgr = new AudioManager();
