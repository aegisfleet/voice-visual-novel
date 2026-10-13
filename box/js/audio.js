// audio.js - Web Audio API による効果音・サイバーBGM生成 & Web Speech API による音声読み上げ (BOX WORM)

class AudioManager {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
    this.bgmGain = null;
    this.bgmTimer = null;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.currentBgmMode = 'ambient'; // ambient | tension | truth

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
      this.selectedVoice = voices.find(v => v.lang.startsWith('ja')) || voices[0] || null;
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  // セリフ読み上げ
  speak(speaker, text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;

    this.stopSpeech();

    const cleanText = text
      .replace(/[（）()「」『』]/g, ' ')
      .replace(/[・…ー〜]/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // キャラクターごとの声質調整
    if (speaker.includes('ユウタ') || speaker.includes('主人公')) {
      utterance.pitch = 1.05; // 青年、自然なトーン
      utterance.rate = 1.1;
    } else if (speaker.includes('シバタ')) {
      utterance.pitch = 0.72; // 重厚で威圧的なベテラン捜査官
      utterance.rate = 0.95;
    } else if (speaker.includes('アオイ')) {
      utterance.pitch = 1.25; // 明るく少し不安げな隣人の女子大生
      utterance.rate = 1.12;
    } else if (speaker.includes('ヤエガシ') || speaker.includes('大家')) {
      utterance.pitch = 0.85; // 落ち着いた中古電器屋の親父
      utterance.rate = 1.0;
    } else if (speaker.includes('MIMI') || speaker.includes('TVボックス') || speaker.includes('知性')) {
      utterance.pitch = 1.15; // 感情を抑えた静謐なAIボイス、極めてゆっくり
      utterance.rate = 0.8;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
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
      this.stopSpeech();
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

  // 証拠発見 / ひらめき音
  playFound() {
    if (!this.seEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.07);
      osc.stop(this.ctx.currentTime + idx * 0.07 + 0.25);
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

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
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
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 低音インパクト
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.4);

    // 高音金属クラッシュ
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
    noiseGain.gain.setValueAtTime(0.25, now);
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

  // ----------------------------------------------------
  // Web Audio API によるサイバーBGM自動生成
  // ----------------------------------------------------

  startBgm(mode = 'ambient') {
    if (!this.bgmEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.stopBgm();
    this.currentBgmMode = mode;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // モードに応じたコード進行と音階
    // ambient: 静かなサイバー空間 (Cm9 -> Abmaj7 -> Fm9 -> G7)
    // tension: 緊迫の立証対決 (Fm -> Ddim -> Bbm -> C7)
    // truth: 真相・感動 (Eb -> Bb/D -> Cm -> Ab)
    let progression;
    if (mode === 'tension') {
      progression = [
        [174.61, 207.65, 261.63, 349.23], // Fm
        [146.83, 174.61, 207.65, 293.66], // Ddim
        [116.54, 138.59, 174.61, 233.08], // Bbm
        [130.81, 164.81, 196.00, 261.63]  // C7
      ];
    } else if (mode === 'truth') {
      progression = [
        [155.56, 196.00, 233.08, 311.13], // Eb
        [146.83, 174.61, 220.00, 293.66], // Bb/D
        [130.81, 155.56, 196.00, 261.63], // Cm
        [103.83, 130.81, 155.56, 207.65]  // Ab
      ];
    } else {
      progression = [
        [130.81, 155.56, 196.00, 293.66], // Cm9
        [103.83, 130.81, 155.56, 261.63], // Abmaj7
        [87.31,  103.83, 130.81, 220.00], // Fm9
        [98.00,  123.47, 146.83, 246.94]  // G7
      ];
    }

    let chordIdx = 0;
    let step = 0;
    const tempo = mode === 'tension' ? 220 : 380; // ms per step

    this.bgmTimer = setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running' || !this.bgmGain) return;

      const chord = progression[chordIdx];
      const freq = chord[step % chord.length];

      // アルペジオ用オシレーター
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = mode === 'tension' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const duration = (tempo / 1000) * 1.8;
      noteGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);

      step++;
      if (step % 8 === 0) {
        chordIdx = (chordIdx + 1) % progression.length;
      }
    }, tempo);
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        if (this.bgmGain) {
          this.bgmGain.disconnect();
          this.bgmGain = null;
        }
      }, 250);
    }
  }
}

window.audioMgr = new AudioManager();
