/**
 * AudioController (モバイル＆電脳SFサウンド完全強化版)
 *
 * 機能:
 * - 音声ファイル & Web Speech API フルボイス
 * - モバイル AudioContext & SpeechSynthesis の確実なアンロック
 * - Web Audio API によるプロシージャル・サイバーSF効果音生成（通信音、決定音、異議あり爆発音、グリッチノイズ）
 * - モバイル・ハプティックフィードバック (navigator.vibrate) 連動
 */

class AudioController {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentAudio = null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.voices = [];

    // リップシンク等のイベントリスナー
    this.onSpeechStart = null;
    this.onSpeechEnd = null;

    // Web Audio API コンテキスト
    this.audioCtx = null;
    this.isAudioUnlocked = false;

    this.initVoices();
  }

  /**
   * モバイル用: 初回タップ時のAudioContextアンロック
   */
  unlockAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Web Speech APIの無音ダミー発話でiOS/Androidの音声ロックを解除
    if (this.synth && !this.isAudioUnlocked) {
      try {
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        this.synth.speak(dummy);
      } catch (e) {}
    }

    this.isAudioUnlocked = true;
  }

  /**
   * モバイル触覚フィードバック (Haptics)
   */
  vibrate(pattern = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  /* ========================================================
     Web Audio API: プロシージャル・サイバーSF効果音
     ======================================================== */

  /**
   * 文字タイピング音 (サイバーデコード音)
   */
  playTypeSound() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 微小なランダム周波数で有機的なサイバー感
      const baseFreq = 1800 + Math.random() * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.025);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  /**
   * UIホバー音 (微細な近未来ビープ)
   */
  playHoverSound() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  /**
   * 決定・タップ音 (シャープなサイバークリック)
   */
  playClickSound() {
    this.vibrate(12);
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  /**
   * 証拠品入手音 (電脳ハッキング成功アルペジオ)
   */
  playEvidenceObtained() {
    this.vibrate([30, 40, 60]);
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const notes = [587.33, 880.00, 1174.66, 1760.00]; // D5, A5, D6, A6

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch (e) {}
  }

  /**
   * 異議あり！/ 机バン 衝撃音 (ヘビーサブベース ＋ レーザー衝撃波)
   */
  playObjectionImpact() {
    this.vibrate([100, 50, 150]);
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;

      // 1. サブベース爆発
      const subOsc = this.audioCtx.createOscillator();
      const subGain = this.audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      subOsc.connect(subGain);
      subGain.connect(this.audioCtx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // 2. ディストーションレーザー
      const laserOsc = this.audioCtx.createOscillator();
      const laserGain = this.audioCtx.createGain();
      laserOsc.type = 'sawtooth';
      laserOsc.frequency.setValueAtTime(900, now);
      laserOsc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

      laserGain.gain.setValueAtTime(0.25, now);
      laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      laserOsc.connect(laserGain);
      laserGain.connect(this.audioCtx.destination);
      laserOsc.start(now);
      laserOsc.stop(now + 0.3);
    } catch (e) {}
  }

  /**
   * グリッチノイズ音 (破裂デジタルノイズ)
   */
  playGlitchSound() {
    this.vibrate([20, 20, 20]);
    if (!this.audioCtx) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.12;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      whiteNoise.start();
    } catch (e) {}
  }

  /* ========================================================
     フルボイス再生 (Web Speech API / 音声ファイル)
     ======================================================== */

  initVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };
    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  getJapaneseVoice(gender = 'female') {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    const jaVoices = this.voices.filter(v => v.lang.startsWith('ja'));
    if (jaVoices.length === 0) return null;

    if (gender === 'female') {
      const female = jaVoices.find(v => /female|kyoko|otoya|nanami|ayumi|haruka|sayaka|mei/i.test(v.name));
      if (female) return female;
    }
    return jaVoices[0];
  }

  async checkAudioExists(url) {
    if (!url) return false;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async play(lineData) {
    this.stop();

    if (!lineData || !lineData.text) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;

    let hasAudioFile = false;
    if (lineData.voiceFile && this.hasAudioFilesInstalled) {
      hasAudioFile = await this.checkAudioExists(lineData.voiceFile);
    }

    if (hasAudioFile) {
      return this._playAudioFile(lineData.voiceFile);
    } else {
      return this._playWebSpeech(lineData);
    }
  }

  _playAudioFile(url) {
    return new Promise((resolve) => {
      this.currentAudio = new Audio(url);

      if (this.onSpeechStart) this.onSpeechStart();

      const finish = () => {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        if (this.onSpeechEnd) this.onSpeechEnd();
        resolve();
      };

      this.currentAudio.onended = finish;
      this.currentAudio.onerror = finish;

      this.currentAudio.play().catch(() => {
        finish();
      });
    });
  }

  _playWebSpeech(lineData) {
    return new Promise((resolve) => {
      if (!this.synth) {
        this.isPlaying = false;
        if (this.onSpeechEnd) this.onSpeechEnd();
        resolve();
      }

      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
      } catch (e) {}

      const text = lineData.text || '';
      const config = lineData.speechConfig || {};
      const utter = new SpeechSynthesisUtterance(text);

      utter.lang = 'ja-JP';
      utter.pitch = config.pitch !== undefined ? config.pitch : 1.1;
      utter.rate = config.rate !== undefined ? config.rate : 1.05;

      const voice = this.getJapaneseVoice(config.gender || 'female');
      if (voice) utter.voice = voice;

      window.__activeUtterance = utter;
      this.currentUtterance = utter;

      let hasFinished = false;
      let resumeTimer = null;

      const finish = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearInterval(resumeTimer);
        window.__activeUtterance = null;
        this.currentUtterance = null;
        this.isPlaying = false;
        if (this.onSpeechEnd) this.onSpeechEnd();
        resolve();
      };

      utter.onstart = () => {
        this.isPlaying = true;
        if (this.onSpeechStart) this.onSpeechStart();

        clearInterval(resumeTimer);
        resumeTimer = setInterval(() => {
          if (this.synth && this.synth.speaking && !hasFinished) {
            try { this.synth.resume(); } catch (e) {}
          } else {
            clearInterval(resumeTimer);
          }
        }, 3000);
      };

      utter.onend = finish;
      utter.onerror = finish;

      try {
        this.synth.speak(utter);
      } catch (err) {
        finish();
      }
    });
  }

  stop() {
    this.isPlaying = false;
    window.__activeUtterance = null;
    this.currentUtterance = null;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }
}

window.AudioController = AudioController;
