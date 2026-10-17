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
    this.currentVoiceAudio = null; // 再生中のMP3 Audio要素
    this.currentVoiceAbortController = null; // ロード中の中断用 AbortController
    this.pendingBgmMode = null; // 自動再生制限時の保留中BGMモード

    this.initSpeech();
  }

  // AudioContext の初期化 (ユーザー操作時に呼出)
  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.ctx.destination);
    }
  }

  // Web Speech API の初期化
  initSpeech() {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser.');
      this.voiceEnabled = false;
      return;
    }

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

  // MP3音声ファイルのロード＆再生（スキップ完全防御・Abort対応）
  async playVoiceFile(url, options = {}) {
    // 二重チェック: スキップ中・音声無効ならHTTPリクエストを一切発行せずに即座に終了
    if (this.isSkipActive || options.isSkip || !this.voiceEnabled || !url) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopVoice();

    const controller = new AbortController();
    this.currentVoiceAbortController = controller;

    try {
      this.ensureContext();

      const audio = new Audio();
      this.currentVoiceAudio = audio;

      audio.onended = () => {
        if (this.currentVoiceAudio === audio) {
          this.currentVoiceAudio = null;
        }
        if (options.onEnd) options.onEnd();
      };

      audio.onerror = (e) => {
        if (this.isSkipActive || controller.signal.aborted) return;
        console.warn(`[Audio] Failed to load voice file: ${url}`, e);
        if (options.onEnd) options.onEnd();
        // MP3取得失敗時はブラウザのWeb Speech APIへフォールバック
        if (options.speaker && options.text) {
          this.speakSpeechSynthesis(options.speaker, options.text, options);
        }
      };

      // 直前にスキップが押されていたら通信を完全破棄
      if (this.isSkipActive || controller.signal.aborted) {
        audio.removeAttribute('src');
        audio.load();
        this.currentVoiceAudio = null;
        if (options.onEnd) options.onEnd();
        return;
      }

      audio.src = url;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('[Audio] playVoiceFile aborted/interrupted:', err.message);
          }
          if (options.onEnd) options.onEnd();
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.warn('[Audio] Voice loading error:', err);
      }
      if (options.onEnd) options.onEnd();
    }
  }

  // 音声が現在再生中かどうかを判定
  isVoicePlaying() {
    const isAudioPlaying = Boolean(
      this.currentVoiceAudio && !this.currentVoiceAudio.paused && !this.currentVoiceAudio.ended,
    );
    const isSpeechActive =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      window.speechSynthesis.speaking;
    return isAudioPlaying || isSpeechActive;
  }

  // 読み上げ停止（MP3通信＆Audio要素＆WebSpeechの完全停止・切断）
  stopVoice() {
    this.stopSpeech();

    if (this.currentVoiceAbortController) {
      try {
        this.currentVoiceAbortController.abort();
      } catch (_e) {}
      this.currentVoiceAbortController = null;
    }

    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.removeAttribute('src'); // 通信バッファリング停止
        this.currentVoiceAudio.load(); // 接続を即時解放
      } catch (_e) {}
      this.currentVoiceAudio = null;
    }
  }

  // 従来のWeb Speech API読み上げ
  speakSpeechSynthesis(speaker, text, options = {}) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.stopSpeech();

    const cleanText = text
      .replace(/[（）()「」『』]/g, ' ')
      .replace(/[・…ー〜]/g, ' ')
      .trim();

    if (!cleanText) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      if (options.onEnd) options.onEnd();
    };

    // キャラクターごとの声質調整
    const profile = this.getVoiceProfile(speaker);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

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
    gain.connect(this.ctx.destination);

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
      { freq: 1661.22, delay: 0.065, duration: 0.4, gain: 0.10 },
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
      gain.connect(this.ctx.destination);

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
    gain.connect(this.ctx.destination);

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
    subGain.connect(this.ctx.destination);
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
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
  }

  // ショック音（間違い・動揺）
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
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 不正解・警告音（playShockのエイリアス）
  playWrong() {
    this.playShock();
  }

  // ----------------------------------------------------
  // Google DeepMind Lyria 3 生成音源によるBGM再生システム
  // (Web Audio API スムーズクロスフェード & シームレスループ)
  // ----------------------------------------------------

  // ユーザー操作によるオーディオアンロック & 保留中BGM再開
  unlockAudio() {
    this.ensureContext();
    if (this.pendingBgmMode && this.bgmEnabled) {
      const mode = this.pendingBgmMode;
      this.pendingBgmMode = null;
      this.startBgm(mode);
    }
  }

  startBgm(mode = 'ambient') {
    this.currentBgmMode = mode;
    if (!this.bgmEnabled) return;

    const url = this.bgmTracks[mode] || this.bgmTracks.ambient;
    if (!url) return;

    this.ensureContext();

    // 既に同一URLのBGMが再生中の場合は再ロードせず継続
    if (
      this.currentBgmTrack &&
      this.currentBgmTrack.url === url &&
      !this.currentBgmTrack.audio.paused
    ) {
      return;
    }

    const previousTrack = this.currentBgmTrack;
    if (previousTrack) {
      this._fadeOutAndCleanTrack(previousTrack, 1.0);
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.001; // フェードイン開始初期音量

    let sourceNode = null;
    let trackGain = null;

    if (this.ctx && this.bgmMasterGain) {
      try {
        sourceNode = this.ctx.createMediaElementSource(audio);
        trackGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        trackGain.gain.setValueAtTime(0.0001, now);
        trackGain.gain.linearRampToValueAtTime(1.0, now + 1.2);

        sourceNode.connect(trackGain);
        trackGain.connect(this.bgmMasterGain);
      } catch (err) {
        console.warn('[AudioManager] Web Audio connection fallback to HTMLAudioElement:', err);
      }
    }

    // HTMLAudioElement側のスムーズフェードイン (Web Audio非接続時のフォールバック兼用)
    const targetVol = this.bgmVolume;
    const fadeSteps = 12;
    const stepInterval = 1200 / fadeSteps;
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

    const trackObj = {
      audio,
      source: sourceNode,
      gain: trackGain,
      url,
      mode,
    };
    this.currentBgmTrack = trackObj;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[AudioManager] BGM autoplay waiting for user interaction:', err);
        this.pendingBgmMode = mode;
      });
    }
  }

  _fadeOutAndCleanTrack(track, fadeSec = 0.8) {
    if (!track) return;
    const { audio, gain, source } = track;

    if (gain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
      } catch (_e) {
        // ignore
      }
    }

    // HTMLAudioElement自体の音量もフェードアウト
    const startVol = audio.volume;
    const steps = 8;
    const stepTime = (fadeSec * 1000) / steps;
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

    setTimeout(
      () => {
        try {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
        } catch (_e) {
          // ignore
        }
        if (source) {
          try {
            source.disconnect();
          } catch (_e) {}
        }
        if (gain) {
          try {
            gain.disconnect();
          } catch (_e) {}
        }
      },
      Math.max(100, Math.floor(fadeSec * 1000) + 50),
    );
  }

  stopBgm(fadeSec = 0.8) {
    if (this.currentBgmTrack) {
      this._fadeOutAndCleanTrack(this.currentBgmTrack, fadeSec);
      this.currentBgmTrack = null;
    }
  }
}

window.audioMgr = new AudioManager();
