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
    this.bgmTracks = {
      title: 'assets/audio/bgm_title.mp3',
      investigate: 'assets/audio/bgm_investigation.mp3',
      crisis: 'assets/audio/bgm_crisis.mp3',
      truth: 'assets/audio/bgm_truth.mp3',
    };
    this.currentUtterance = null;
    this.voiceAudio = typeof Audio !== 'undefined' ? new Audio() : null;
    if (this.voiceAudio) this.voiceAudio.preload = 'auto';
    this.isAudioUnlocked = false;
    this.wasBgmPlayingBeforeHide = false;
    this.playSessionId = 0;

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
    if (this.isAudioUnlocked) return;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.isAudioUnlocked = true;
  }

  pauseAll() {
    this.stopVoice();
    if (this.currentBgmTrack?.audio && !this.currentBgmTrack.audio.paused) {
      this.wasBgmPlayingBeforeHide = true;
      try {
        this.currentBgmTrack.audio.pause();
      } catch (_e) {}
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
      this.wasBgmPlayingBeforeHide = false;
    }
  }

  // BGMの再生（MP3再生 & 失敗時フォールバック）
  playBgm(mode = 'title') {
    this.currentBgmMode = mode;
    if (!this.bgmEnabled) return;

    if (this.currentBgmTrack && this.currentBgmTrack.mode === mode) {
      if (this.currentBgmTrack.audio?.paused) {
        this.currentBgmTrack.audio.play().catch(() => {});
      }
      return;
    }

    this.stopBgm();
    const url = this.bgmTracks[mode];
    if (!url) return;

    try {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.bgmVolume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((_err) => {
          // 自動再生制限時は次回タップで再生
        });
      }
      this.currentBgmTrack = { audio, mode, url };
    } catch (e) {
      console.warn('BGM play failed:', e);
    }
  }

  stopBgm() {
    if (this.currentBgmTrack?.audio) {
      try {
        this.currentBgmTrack.audio.pause();
        this.currentBgmTrack.audio.currentTime = 0;
      } catch (_e) {}
      this.currentBgmTrack = null;
    }
  }

  setBgmVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.currentBgmTrack?.audio) {
      this.currentBgmTrack.audio.volume = this.bgmVolume;
    }
  }

  // Web Speech API によるセリフ発話
  speak(text, charData = null) {
    if (!this.voiceEnabled) return;
    this.stopVoice();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const cleanText = text
        .replace(/\[.*?\]/g, '')
        .replace(/[（(].*?[）)]/g, '')
        .trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = charData?.ttsRate || 1.0;
      utterance.pitch = charData?.ttsPitch || 1.0;
      utterance.volume = 1.0;

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
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

  // Web Audio API によるサイバーSE生成
  playSe(type) {
    if (!this.seEnabled) return;
    this.unlockAudio();
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
        default:
          this.synthesizeClick();
      }
    } catch (e) {
      console.warn('SE playback error:', e);
    }
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
}

window.audioManager = new AudioManager();
