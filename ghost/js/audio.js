// audio.js - Web Audio API による効果音・BGM再生 & Web Speech API 音声合成 (GHOST SCHEMA)

class AudioManager {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
    this.bgmVolume = 0.35;
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

    this.seTracks = {
      cutin: 'assets/audio/sfx_cutin.mp3',
      evidence: 'assets/audio/sfx_evidence.mp3',
      correct: 'assets/audio/sfx_evidence_a.mp3',
      evidence_a: 'assets/audio/sfx_evidence_a.mp3',
      victory: 'assets/audio/sfx_evidence_b.mp3',
      evidence_b: 'assets/audio/sfx_evidence_b.mp3',
    };

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
    }
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

  // BGMの再生（Web Audioでギャップレス再生 & 失敗時はHTMLAudioへ）
  playBgm(mode = 'title') {
    this.currentBgmMode = mode;
    if (mode === 'silence' || mode === 'stop') {
      this.stopBgm();
      return;
    }
    if (!this.bgmEnabled) return;

    const current = this.currentBgmTrack;
    if (current?.mode === mode) {
      if (current.audio?.paused) {
        current.audio.play().catch(() => {});
      } else if (current.kind === 'webaudio') {
        this.resumeContext();
      }
      return;
    }

    this.stopBgm();
    const url = this.bgmTracks[mode];
    if (!url) return;

    const track = {
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

  cleanSpeechText(text) {
    if (!text) return '';
    return text
      .replace(/\[.*?\]/g, '')
      .replace(/[（(].*?[）)]/g, '')
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
    utterance.volume = 1.0;
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
        audio.volume = 0.7;
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
        case 'evidence':
          this.synthesizeEvidence();
          break;
        case 'cutin':
          this.synthesizeCutin();
          break;
        case 'correct':
          this.synthesizeCorrect();
          break;
        case 'damage':
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

  synthesizeAlert() {
    const now = this.ctx.currentTime;
    [0, 0.12].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1760, t + 0.05);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  synthesizeGlitch() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(1200, now + 0.03);
    osc.frequency.setValueAtTime(320, now + 0.06);
    osc.frequency.setValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  synthesizeImpact() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  synthesizeRing() {
    const now = this.ctx.currentTime;
    [400, 450].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  synthesizeBeacon() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  synthesizeClick() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  synthesizeEvidence() {
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  }

  synthesizeCutin() {
    const now = this.ctx.currentTime;
    // 重厚なインパクト＋サイバーホーン
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  synthesizeCorrect() {
    const now = this.ctx.currentTime;
    const chords = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }

  synthesizeDamage() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.25);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  synthesizeGameover() {
    const now = this.ctx.currentTime;
    const notes = [329.63, 293.66, 261.63, 196.0]; // E4, D4, C4, G3
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.18;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  synthesizeVictory() {
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.5, d: 0.4 },
    ];
    let time = now;
    fanfare.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);
      gain.gain.setValueAtTime(0.22, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + n.d);
      time += n.d * 0.85;
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
