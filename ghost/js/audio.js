// audio.js - Web Audio API による効果音・BGM再生 & Web Speech API 音声合成 (GHOST SCHEMA)

class AudioManager {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
    this.voiceVolume = 1.0;
    this.seVolume = 0.7;
    this.bgmVolume = 0.2;
    this.currentBgmMode = 'title'; // title | investigate | crisis | truth
    this.currentBgmTrack = null;
    this.bgmBuffers = new Map();
    this.bgmBufferLoads = new Map();
    this.bgmSessionId = 0;
    this.bgmTracks = {
      title: 'assets/audio/bgm_title.mp3',
      investigate: 'assets/audio/bgm_investigation.mp3',
      crisis: 'assets/audio/bgm_crisis.mp3',
      truth: 'assets/audio/bgm_truth.mp3',
    };
    this.currentUtterance = null;
    this.voiceAudio = typeof Audio !== 'undefined' ? new Audio() : null;
    if (this.voiceAudio) this.voiceAudio.preload = 'auto';
    this.isVoiceAudioUnlocked = false;
    this.isAudioUnlocked = false;
    this.wasBgmPlayingBeforeHide = false;
    this.playSessionId = 0;

    // GHOST PROTOCOL 専用サイバーSE: box流用を廃止し、超高音質・ゼロ遅延のサイバーシンセエンジンへ完全移行 (sfx_cutin.mp3 / sfx_evidence.mp3 等の旧トラックをWeb Audio合成へ統合)
    this.seTracks = {};

    this.initSpeech();
    this.setupLifecycleListeners();
    this.setupEarlyUnlock();
  }

  // 画面初回操作時のオーディオアンロック
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

  // モバイルライフサイクル（画面切り替え・バックグラウンド）対応
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

  initSpeech() {
    if (typeof window === 'undefined') return;
    // 重要ルール: WebSpeech非対応でも voiceEnabled を false に誤爆してはならない
    if ('speechSynthesis' in window) {
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.findJapaneseVoice();
      }
      this.findJapaneseVoice();
    }
  }

  findJapaneseVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
      this.selectedVoice = jaVoice || null;
      return this.selectedVoice;
    } catch (_e) {
      return null;
    }
  }

  initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.setupMasterNodes();
    }
  }

  setupMasterNodes() {
    if (!this.ctx) return;
    try {
      this.seCompressor = this.ctx.createDynamicsCompressor();
      this.seCompressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.seCompressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.seCompressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.seCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.seCompressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.seMasterGain = this.ctx.createGain();
      this.seMasterGain.gain.setValueAtTime(this.seVolume, this.ctx.currentTime);

      this.seCompressor.connect(this.seMasterGain);
      this.seMasterGain.connect(this.ctx.destination);
    } catch (_e) {
      this.seCompressor = null;
      this.seMasterGain = null;
    }
  }

  getSeDestination() {
    return this.seCompressor || this.ctx.destination;
  }

  unlockAudio() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.isAudioUnlocked) return;

    // LINE内ブラウザ / iOS Safari用: ボイス専用Audio要素の先行アンロック (無音WAV)
    if (this.voiceAudio && !this.isVoiceAudioUnlocked) {
      this.voiceAudio.src =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      const p = this.voiceAudio.play();
      if (p !== undefined) {
        p.then(() => {
          this.voiceAudio.pause();
          this.voiceAudio.currentTime = 0;
        }).catch(() => {});
      }
      this.isVoiceAudioUnlocked = true;
    }

    this.isAudioUnlocked = true;
  }

  pauseAll() {
    this.stopVoice();
    const track = this.currentBgmTrack;
    if (track?.audio && !track.audio.paused) {
      this.wasBgmPlayingBeforeHide = true;
      try {
        track.audio.pause();
      } catch (_e) {}
    } else if (track?.source && !track.isStopped) {
      // Web Audio版BGMはこの後のAudioContext停止で一緒に止まる
      this.wasBgmPlayingBeforeHide = true;
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  resumeAll() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.wasBgmPlayingBeforeHide && this.bgmEnabled && this.currentBgmTrack?.audio) {
      this.currentBgmTrack.audio.play().catch(() => {});
    }
    if (this.wasBgmPlayingBeforeHide && this.bgmEnabled && this.currentBgmTrack) {
      this.wasBgmPlayingBeforeHide = false;
    }
  }

  resumeContext() {
    this.initContext();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx || null;
  }

  isCurrentBgmTrack(track) {
    return this.currentBgmTrack === track && track.sessionId === this.bgmSessionId;
  }

  decodeBgmAudio(encoded) {
    return new Promise((resolve, reject) => {
      let pending;
      try {
        pending = this.ctx.decodeAudioData(encoded.slice(0), resolve, reject);
      } catch (error) {
        reject(error);
        return;
      }
      if (pending?.then) pending.then(resolve, reject);
    });
  }

  loadBgmBuffer(url) {
    if (this.bgmBuffers.has(url)) {
      return Promise.resolve(this.bgmBuffers.get(url));
    }
    if (this.bgmBufferLoads.has(url)) {
      return this.bgmBufferLoads.get(url);
    }

    const loadPromise = (async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`BGM load failed: ${response.status}`);
      }
      const buffer = await this.decodeBgmAudio(await response.arrayBuffer());
      this.bgmBuffers.set(url, buffer);
      return buffer;
    })();

    this.bgmBufferLoads.set(url, loadPromise);
    const clearLoad = () => {
      if (this.bgmBufferLoads.get(url) === loadPromise) {
        this.bgmBufferLoads.delete(url);
      }
    };
    loadPromise.then(clearLoad, clearLoad);
    return loadPromise;
  }

  startWebBgm(track, buffer) {
    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    source.buffer = buffer;
    // HTMLAudioElementのloopに頼らず、デコード済みバッファを
    // サンプル単位で繰り返すことでループ境界の無音区間をなくす。
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = buffer.duration;
    gainNode.gain.value = this.bgmVolume;
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    track.kind = 'webaudio';
    track.buffer = buffer;
    track.source = source;
    track.gainNode = gainNode;
    track.isStopped = false;
    try {
      source.start();
    } catch (error) {
      this.stopBgmTrack(track);
      throw error;
    }
  }

  async playWebBgm(track) {
    const buffer = await this.loadBgmBuffer(track.url);
    if (!this.isCurrentBgmTrack(track) || !this.bgmEnabled) return;
    this.startWebBgm(track, buffer);
  }

  playHtmlBgm(track) {
    try {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.bgmVolume;
      track.kind = 'html';
      track.audio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((_err) => {
          // 自動再生制限時は次回タップで再生
        });
      }
    } catch (error) {
      console.warn('BGM play failed:', error);
    }
  }

  resumeSameBgmTrack(current) {
    if (current.audio?.paused) {
      current.audio.play().catch(() => {});
    } else if (current.kind === 'webaudio') {
      this.resumeContext();
    }
  }

  createBgmTrackState(mode, url) {
    return {
      audio: null,
      buffer: null,
      gainNode: null,
      isStopped: false,
      kind: 'loading',
      mode,
      sessionId: this.bgmSessionId,
      source: null,
      url,
    };
  }

  // BGMの再生（Web Audioでギャップレス再生 & 失敗時はHTMLAudioへ）
  playBgm(mode = 'title') {
    this.currentBgmMode = mode;
    if (mode === 'silence' || mode === 'stop') {
      this.stopBgm();
      return;
    }
    if (!this.bgmEnabled) return;

    if (this.currentBgmTrack?.mode === mode) {
      this.resumeSameBgmTrack(this.currentBgmTrack);
      return;
    }

    this.stopBgm();
    const url = this.bgmTracks[mode];
    if (!url) return;

    const track = this.createBgmTrackState(mode, url);
    this.currentBgmTrack = track;

    if (!this.resumeContext()) {
      this.playHtmlBgm(track);
      return;
    }

    this.playWebBgm(track).catch((error) => {
      if (!this.isCurrentBgmTrack(track)) return;
      console.warn('Web Audio BGM failed; falling back to HTMLAudio:', error);
      this.playHtmlBgm(track);
    });
  }

  stopBgmTrack(track) {
    track.isStopped = true;
    if (track.source) {
      try {
        track.source.stop();
      } catch (_e) {}
      try {
        track.source.disconnect();
      } catch (_e) {}
    }
    if (track.gainNode) {
      try {
        track.gainNode.disconnect();
      } catch (_e) {}
    }
    if (track.audio) {
      try {
        track.audio.pause();
        track.audio.currentTime = 0;
      } catch (_e) {}
    }
  }

  stopBgm() {
    this.bgmSessionId++;
    const track = this.currentBgmTrack;
    this.currentBgmTrack = null;
    if (track) this.stopBgmTrack(track);
  }

  setBgmVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.currentBgmTrack?.gainNode) {
      this.currentBgmTrack.gainNode.gain.value = this.bgmVolume;
    }
    if (this.currentBgmTrack?.audio) {
      this.currentBgmTrack.audio.volume = this.bgmVolume;
    }
  }

  setSeVolume(volume) {
    this.seVolume = Math.max(0, Math.min(1, volume));
    if (this.seMasterGain?.gain && this.ctx) {
      try {
        this.seMasterGain.gain.setValueAtTime(this.seVolume, this.ctx.currentTime);
      } catch (_e) {
        this.seMasterGain.gain.value = this.seVolume;
      }
    }
  }

  setVoiceVolume(volume) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
    if (this.voiceAudio) {
      this.voiceAudio.volume = this.voiceVolume;
    }
  }

  cleanSpeechText(text) {
    if (!text) return '';
    return text
      .replace(/\[.*?\]/g, '')
      .replace(/[（(].*?[）)]/g, '')
      .replace(/\\\\tsclient\\\\C/gi, 'ティーエスクライアント・シードライブ')
      .replace(/\\tsclient\\C/gi, 'ティーエスクライアント・シードライブ')
      .replace(/drivestoredirect:s:\*/gi, 'ドライブ・ストア・ダイレクト')
      .replace(/FT4\/FT5/g, 'エフティーフォー・エフティーファイブ')
      .replace(/FT4/g, 'エフティーフォー')
      .replace(/DEMOFASTLOSS/g, 'デモ・ファスト・ロス')
      .replace(/coronamng\.store/g, 'コロナマネージ・ドット・ストア')
      .replace(/GHOST PROTOCOL/gi, 'ゴースト・プロトコル')
      .replace(/Session Kill/gi, 'セッション・キル')
      .replace(/False Flag/gi, 'フォールス・フラッグ')
      .replace(/Root Cause/gi, 'ルート・コーズ')
      .replace(/Login Data/g, 'ログインデータ')
      .replace(/Investor Password/g, 'インベスター・パスワード')
      .replace(/CSIRT/g, 'シーサート')
      .replace(/KPS/g, 'ケーピーエス')
      .replace(/NCO/g, 'エヌシーオー')
      .replace(/C2/g, 'シーツー')
      .replace(/850\s*pps/gi, '850ピップス')
      .replace(/[《》【】「」『』]/g, ' ')
      .replace(/……+/g, '、')
      .replace(/——+/g, '、')
      .trim();
  }

  createSpeechUtterance(cleanText, charData, onEndCallback) {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = charData?.ttsRate || 1.0;
    utterance.pitch = charData?.ttsPitch || 1.0;
    utterance.volume = this.voiceVolume;
    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };
    return utterance;
  }

  // Web Speech API によるセリフ発話 (終了コールバック対応)
  speak(text, charData = null, onEndCallback = null) {
    const isSpeechAvailable =
      this.voiceEnabled &&
      !window.gameApp?.isSkipActive &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window;

    if (!isSpeechAvailable) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stopVoice();

    const cleanText = this.cleanSpeechText(text);
    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      const utterance = this.createSpeechUtterance(cleanText, charData, onEndCallback);
      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_e) {}
    }
    this.currentUtterance = null;
  }

  // 効果音再生（MP3優先 ＆ Web Audio API オシレーターフォールバック連携）
  playSe(type) {
    if (!this.seEnabled) return;
    this.unlockAudio();

    // 1. MP3音源が存在する場合は優先して再生
    const trackUrl = this.seTracks?.[type];
    if (trackUrl) {
      try {
        const audio = new Audio(trackUrl);
        audio.volume = Math.max(0, Math.min(1, this.seVolume * 0.7));
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((_err) => {
            // 自動再生制限等で失敗した場合はシンセフォールバック
            this.playSynthSe(type);
          });
          return;
        }
      } catch (_e) {
        // フォールバック
      }
    }

    // 2. MP3未指定または例外時はオシレーターシンセで再生
    this.playSynthSe(type);
  }

  // Web Audio API によるサイバーSE合成フォールバック
  playSynthSe(type) {
    this.initContext();
    if (!this.ctx) return;

    try {
      switch (type) {
        case 'click':
          this.synthesizeClick();
          break;
        case 'type':
          this.synthesizeTypeBlip();
          break;
        case 'frame':
          this.synthesizeFrameStep();
          break;
        case 'evidence':
          this.synthesizeEvidence();
          break;
        case 'cutin':
          this.synthesizeCutin();
          break;
        case 'correct':
        case 'evidence_a':
          this.synthesizeCorrect();
          break;
        case 'damage':
        case 'evidence_b':
          this.synthesizeDamage();
          break;
        case 'gameover':
          this.synthesizeGameover();
          break;
        case 'victory':
          this.synthesizeVictory();
          break;
        case 'alert':
          this.synthesizeAlert();
          break;
        case 'glitch':
          this.synthesizeGlitch();
          break;
        case 'impact':
          this.synthesizeImpact();
          break;
        case 'ring':
          this.synthesizeRing();
          break;
        case 'beacon':
          this.synthesizeBeacon();
          break;
        default:
          this.synthesizeClick();
      }
    } catch (e) {
      console.warn('SE playback error:', e);
    }
  }

  // -------------------------------------------------------------
  // サイバーサスペンス専用 Web Audio 合成エンジン（GHOST PROTOCOL 音響設計）
  // -------------------------------------------------------------

  playTone(options) {
    if (!this.ctx || !this.seEnabled) return;
    const {
      type = 'sine',
      freq = 440,
      targetFreq = null,
      rampTime = 0.1,
      gain = 0.15,
      decay = 0.15,
      delay = 0,
    } = options;

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (targetFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, targetFreq), t + rampTime);
    }

    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    osc.connect(g);
    g.connect(this.getSeDestination());

    osc.start(t);
    osc.stop(t + decay);
  }

  // UIタップ音: 耳に刺さらない超短尺サイバークリック（12ms）
  synthesizeClick() {
    this.playTone({
      type: 'sine',
      freq: 1400,
      targetFreq: 700,
      rampTime: 0.012,
      gain: 0.08,
      decay: 0.015,
    });
    this.playTone({ type: 'sine', freq: 2800, gain: 0.03, decay: 0.005 });
  }

  // コマ送り・スライド音: ソフトな電子スワイプ
  synthesizeFrameStep() {
    this.playTone({
      type: 'triangle',
      freq: 450,
      targetFreq: 180,
      rampTime: 0.04,
      gain: 0.1,
      decay: 0.05,
    });
    this.playTone({
      type: 'sine',
      freq: 900,
      targetFreq: 400,
      rampTime: 0.03,
      gain: 0.04,
      decay: 0.04,
    });
  }

  // 文字送り音: ターミナルの心地よい微小パルス
  synthesizeTypeBlip(pitch = 1.0) {
    const baseFreq = 2000 * pitch;
    this.playTone({ type: 'sine', freq: baseFreq, gain: 0.02, decay: 0.014 });
  }

  // 緊急アラート: AD侵入・RPC全面異常の緊迫パルス（映画の軍事サイバー警報）
  synthesizeAlert() {
    [0, 0.11].forEach((delay) => {
      this.playTone({
        type: 'sawtooth',
        freq: 980,
        targetFreq: 1960,
        rampTime: 0.06,
        gain: 0.12,
        decay: 0.09,
        delay,
      });
      this.playTone({ type: 'sine', freq: 1960, gain: 0.08, decay: 0.09, delay });
    });
  }

  // 通信妨害・グリッチ: 歯切れのよいスタイリッシュなスタッター
  synthesizeGlitch() {
    [
      { freq: 120, delay: 0.0 },
      { freq: 740, delay: 0.03 },
      { freq: 310, delay: 0.06 },
    ].forEach((p) => {
      this.playTone({ type: 'square', freq: p.freq, gain: 0.09, decay: 0.025, delay: p.delay });
    });
  }

  // 画面激震・急展開: 深いサブベース・シネマティックブーム
  synthesizeImpact() {
    this.playTone({
      type: 'sine',
      freq: 110,
      targetFreq: 30,
      rampTime: 0.35,
      gain: 0.35,
      decay: 0.38,
    });
    this.playTone({
      type: 'triangle',
      freq: 180,
      targetFreq: 45,
      rampTime: 0.15,
      gain: 0.15,
      decay: 0.2,
    });
  }

  // 緊急電話・ホットライン着信: セキュア通信コール
  synthesizeRing() {
    [0, 0.18].forEach((delay) => {
      this.playTone({ type: 'sine', freq: 750, gain: 0.1, decay: 0.12, delay });
      this.playTone({ type: 'sine', freq: 850, gain: 0.1, decay: 0.12, delay });
    });
  }

  // カナリア逆探知ビーコン: 鋭い高周波ソナーピン＋エコー（真性C2特定）
  synthesizeBeacon() {
    this.playTone({
      type: 'sine',
      freq: 2400,
      targetFreq: 2600,
      rampTime: 0.08,
      gain: 0.18,
      decay: 0.22,
    });
    this.playTone({ type: 'sine', freq: 1800, gain: 0.08, decay: 0.25, delay: 0.08 });
  }

  // 決定的証拠入手: ホログラムUI展開・クリスタルデータ取得アルペジオ
  synthesizeEvidence() {
    const notes = [659.25, 987.77, 1318.51, 1661.22]; // E5, B5, E6, G#6
    notes.forEach((freq, idx) => {
      this.playTone({ type: 'sine', freq, gain: 0.14, decay: 0.32, delay: idx * 0.06 });
      this.playTone({
        type: 'triangle',
        freq: freq * 2,
        gain: 0.04,
        decay: 0.18,
        delay: idx * 0.06,
      });
    });
  }

  // 真実暴きカットイン: サブベース＋急上昇サイバーライザー＋頂点打撃スタブ
  synthesizeCutin() {
    // 1. サブベースドロップ
    this.playTone({
      type: 'sine',
      freq: 140,
      targetFreq: 38,
      rampTime: 0.35,
      gain: 0.32,
      decay: 0.4,
    });
    // 2. サイバー急上昇ライザー
    this.playTone({
      type: 'sawtooth',
      freq: 220,
      targetFreq: 1400,
      rampTime: 0.13,
      gain: 0.15,
      decay: 0.16,
    });
    // 3. 頂点インパクトスタブ
    this.playTone({ type: 'triangle', freq: 880, gain: 0.22, decay: 0.25, delay: 0.12 });
  }

  // 立証成功・矛盾打破: 煌めくサイバー承認チャイム
  synthesizeCorrect() {
    const chord = [880.0, 1108.73, 1318.51, 1760.0]; // A5, C#6, E6, A6
    chord.forEach((freq, idx) => {
      this.playTone({ type: 'sine', freq, gain: 0.12, decay: 0.45, delay: idx * 0.04 });
    });
    this.playTone({
      type: 'sine',
      freq: 220,
      targetFreq: 110,
      rampTime: 0.2,
      gain: 0.15,
      decay: 0.3,
    });
  }

  // 立証失敗・アクセス拒絶: 不協和音低音バズ＋拒絶音
  synthesizeDamage() {
    this.playTone({
      type: 'sawtooth',
      freq: 90,
      targetFreq: 50,
      rampTime: 0.25,
      gain: 0.25,
      decay: 0.28,
    });
    this.playTone({
      type: 'square',
      freq: 135,
      targetFreq: 60,
      rampTime: 0.2,
      gain: 0.15,
      decay: 0.25,
    });
  }

  // 能動的防衛完遂・解決: 壮大なシネマティック・サイバーレゾナンス
  synthesizeVictory() {
    const progression = [
      { notes: [293.66, 440.0, 587.33], delay: 0.0 }, // D4, A4, D5
      { notes: [369.99, 554.37, 739.99], delay: 0.14 }, // F#4, C#5, F#5
      { notes: [440.0, 659.25, 880.0, 1174.66], delay: 0.28 }, // A4, E5, A5, D6
    ];
    progression.forEach((step) => {
      step.notes.forEach((freq) => {
        this.playTone({ type: 'sine', freq, gain: 0.13, decay: 0.65, delay: step.delay });
        this.playTone({
          type: 'triangle',
          freq: freq * 0.5,
          gain: 0.08,
          decay: 0.5,
          delay: step.delay,
        });
      });
    });
  }

  // ゲームオーバー: 降下するダークサイバーハーモニー
  synthesizeGameover() {
    const notes = [329.63, 277.18, 220.0, 164.81]; // E4, C#4, A3, E3
    notes.forEach((freq, idx) => {
      this.playTone({ type: 'sawtooth', freq, gain: 0.14, decay: 0.35, delay: idx * 0.16 });
    });
  }

  // 便利ラッパーメソッド
  playCutin() {
    this.playSe('cutin');
  }

  playEvidence() {
    this.playSe('evidence');
  }

  playCorrect() {
    this.playSe('correct');
  }

  playVictory() {
    this.playSe('victory');
  }

  playWrong() {
    this.playSe('damage');
  }
}

window.audioManager = new AudioManager();
