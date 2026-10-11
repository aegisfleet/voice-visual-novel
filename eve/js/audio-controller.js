/**
 * AudioController (iOS Safari & モバイル電脳SFサウンド完全強化版)
 *
 * 機能・iOS Safari対策:
 * - Web Audio API (GainNode) 経由のBGM音量・フェード・ミュート制御:
 *   iOS Safariの「HTMLMediaElement.volume無視仕様」をWeb Audio APIのGainNode階層で解決。
 *   MasterGain -> BGMGain / SFXGain / VoiceGain のノードグラフにより確実な音量調整と完全ミュートを実現。
 * - モバイル AudioContext & SpeechSynthesis の確実なアンロック (初回ジェスチャー & 無音バッファ再生)
 * - visibilitychange によるバックグラウンド復帰時の AudioContext 自動 resume
 * - Web Audio API によるプロシージャル・サイバーSF効果音生成（通信音、決定音、異議あり爆発音、グリッチノイズ）
 * - モバイル・ハプティックフィードバック (navigator.vibrate) 連動
 */

class AudioController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentAudio = null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.voices = [];

    // リップシンク等のイベントリスナー
    this.onSpeechStart = null;
    this.onSpeechEnd = null;

    // Web Audio API ノードグラフ
    this.audioCtx = null;
    this.masterGainNode = null;
    this.bgmGainNode = null;
    this.sfxGainNode = null;
    this.isAudioUnlocked = false;

    // BGM管理 (Web Audio API接続トラック)
    this.currentBGMTrack = null; // { audio, source, gain, url }
    this.currentBGMUrl = null;
    this.bgmVolume = 0.15;
    this.isMuted = false;
    this.pendingBGMUrl = null;

    // 音声ファイルの自動検知・再生を有効化
    this.hasAudioFilesInstalled = true;

    // 音声再生世代トークン (非同期競合防止)
    this.playSessionId = 0;
    // 音声ファイル存在判定キャッシュ
    this.audioExistsCache = new Map();

    this.initVoices();
    this._setupLifecycleListeners();
  }

  /**
   * 後方互換性用: 現在再生中のBGM Audio要素を取得
   */
  get currentBGM() {
    return this.currentBGMTrack ? this.currentBGMTrack.audio : null;
  }

  /**
   * Web Audio APIの基本ノードグラフを初期化
   */
  _initAudioContext() {
    if (this.audioCtx) return;
    const AudioContextClass = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioContextClass) return;

    try {
      this.audioCtx = new AudioContextClass();

      // 1. マスターゲイン (全体ミュート / 音量制御)
      this.masterGainNode = this.audioCtx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : 1, this.audioCtx.currentTime);
      this.masterGainNode.connect(this.audioCtx.destination);

      // 2. BGMゲイン (iOS SafariのBGM音量スライダー用)
      this.bgmGainNode = this.audioCtx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.audioCtx.currentTime);
      this.bgmGainNode.connect(this.masterGainNode);

      // 3. SFXゲイン (効果音用)
      this.sfxGainNode = this.audioCtx.createGain();
      this.sfxGainNode.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
      this.sfxGainNode.connect(this.masterGainNode);
    } catch (e) {
      console.warn("[AudioController] Failed to initialize AudioContext:", e);
    }
  }

  /**
   * モバイルライフサイクルイベントの監視
   */
  _setupLifecycleListeners() {
    if (typeof window === 'undefined') return;

    // 1. タブ復帰・画面ロック解除時にAudioContextがsuspendedになる問題の自動復帰
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this._ensureAudioContextRunning();
        }
      });
    }

    // 2. 画面の初回タッチ/クリック時に早期アンロック
    const earlyUnlock = () => {
      this.unlockAudio();
      window.removeEventListener('click', earlyUnlock, true);
      window.removeEventListener('touchstart', earlyUnlock, true);
      window.removeEventListener('keydown', earlyUnlock, true);
    };
    window.addEventListener('click', earlyUnlock, true);
    window.addEventListener('touchstart', earlyUnlock, true);
    window.addEventListener('keydown', earlyUnlock, true);
  }

  /**
   * AudioContextが停止している場合に再開
   */
  _ensureAudioContextRunning() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        this.audioCtx.resume();
      } catch (e) {}
    }
  }

  /**
   * モバイル用: 初回タップ時のAudioContext & SpeechSynthesisアンロック
   */
  unlockAudio() {
    this._initAudioContext();
    this._ensureAudioContextRunning();

    // iOS Safari用のWeb Audio完全アンロック (無音バッファ再生)
    if (this.audioCtx && !this.isAudioUnlocked) {
      try {
        const buffer = this.audioCtx.createBuffer(1, 1, 22050);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(0);
      } catch (e) {}
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

    // 保留されていたBGMがあれば再生
    if (this.pendingBGMUrl) {
      const pendingUrl = this.pendingBGMUrl;
      this.pendingBGMUrl = null;
      this.playBGM(pendingUrl);
    }
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
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const baseFreq = 1800 + Math.random() * 400;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.025);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  /**
   * UIホバー音 (微細な近未来ビープ)
   */
  playHoverSound() {
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
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
      gain.connect(this.sfxGainNode || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  /**
   * 決定・タップ音 (シャープなサイバークリック)
   */
  playClickSound() {
    this.vibrate(12);
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
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
      gain.connect(this.sfxGainNode || this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  /**
   * 証拠品入手音 (電脳ハッキング成功アルペジオ)
   */
  playEvidenceObtained() {
    this.vibrate([30, 40, 60]);
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
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
        gain.connect(this.sfxGainNode || this.audioCtx.destination);

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
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
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
      subGain.connect(this.sfxGainNode || this.audioCtx.destination);
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
      laserGain.connect(this.sfxGainNode || this.audioCtx.destination);
      laserOsc.start(now);
      laserOsc.stop(now + 0.3);
    } catch (e) {}
  }

  /**
   * グリッチノイズ音 (破裂デジタルノイズ)
   */
  playGlitchSound() {
    this.vibrate([20, 20, 20]);
    if (this.isMuted) return;
    this._ensureAudioContextRunning();
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
      gain.connect(this.sfxGainNode || this.audioCtx.destination);

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

  getEnglishVoice(gender = 'female') {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));
    if (enVoices.length === 0) return null;

    if (gender === 'female') {
      const female = enVoices.find(v => /female|samantha|victoria|karen|zira|aria|jenny/i.test(v.name));
      if (female) return female;
    } else {
      const male = enVoices.find(v => /male|daniel|alex|george|david|guy/i.test(v.name));
      if (male) return male;
    }
    return enVoices[0];
  }

  async checkAudioExists(url) {
    if (!url) return false;
    if (this.audioExistsCache.has(url)) {
      return this.audioExistsCache.get(url);
    }
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const ok = response.ok;
      this.audioExistsCache.set(url, ok);
      return ok;
    } catch {
      this.audioExistsCache.set(url, false);
      return false;
    }
  }

  async play(lineData) {
    this.stop();

    if (!lineData || !lineData.text) {
      this.isPlaying = false;
      return;
    }

    const sessionId = ++this.playSessionId;
    this.isPlaying = true;

    let hasAudioFile = false;
    if (lineData.voiceFile && this.hasAudioFilesInstalled) {
      hasAudioFile = await this.checkAudioExists(lineData.voiceFile);
    }

    // 非同期待機中に別の再生や停止が行われていた場合は中断
    if (this.playSessionId !== sessionId) {
      return;
    }

    if (hasAudioFile) {
      return this._playAudioFile(lineData.voiceFile, sessionId);
    } else {
      return this._playWebSpeech(lineData, sessionId);
    }
  }

  _playAudioFile(url, sessionId) {
    return new Promise((resolve) => {
      if (this.playSessionId !== sessionId || this.isMuted) {
        if (this.playSessionId === sessionId) {
          this.isPlaying = false;
        }
        resolve();
        return;
      }

      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      this.currentAudio = audio;

      if (this.onSpeechStart && this.playSessionId === sessionId) {
        this.onSpeechStart();
      }

      let hasFinished = false;
      const finish = () => {
        if (hasFinished) return;
        hasFinished = true;
        audio.onended = null;
        audio.onerror = null;

        if (this.playSessionId === sessionId) {
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          this.isPlaying = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
        }
        resolve();
      };

      audio.onended = finish;
      audio.onerror = finish;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (this.playSessionId !== sessionId) {
            resolve();
            return;
          }
          finish();
        });
      }
    });
  }

  _playWebSpeech(lineData, sessionId) {
    return new Promise((resolve) => {
      if (!this.synth || this.playSessionId !== sessionId || this.isMuted) {
        this.isPlaying = false;
        if (this.playSessionId === sessionId && this.onSpeechEnd) this.onSpeechEnd();
        resolve();
        return;
      }

      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
      } catch (e) {}

      const text = lineData.text || '';
      const config = lineData.speechConfig || {};
      const utter = new SpeechSynthesisUtterance(text);

      const isEnglish = (lineData.lang === 'en');
      utter.lang = isEnglish ? 'en-US' : 'ja-JP';
      utter.pitch = config.pitch !== undefined ? config.pitch : 1.0;
      utter.rate = config.rate !== undefined ? config.rate : (isEnglish ? 1.0 : 1.05);

      const voice = isEnglish ? this.getEnglishVoice(config.gender || 'female') : this.getJapaneseVoice(config.gender || 'female');
      if (voice) utter.voice = voice;

      window.__activeUtterance = utter;
      this.currentUtterance = utter;

      let hasFinished = false;
      let resumeTimer = null;

      const finish = () => {
        if (hasFinished) return;
        hasFinished = true;
        clearInterval(resumeTimer);
        utter.onstart = null;
        utter.onend = null;
        utter.onerror = null;

        if (window.__activeUtterance === utter) {
          window.__activeUtterance = null;
        }
        if (this.currentUtterance === utter) {
          this.currentUtterance = null;
        }

        if (this.playSessionId === sessionId) {
          this.isPlaying = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
        }
        resolve();
      };

      utter.onstart = () => {
        if (this.playSessionId !== sessionId) {
          try { this.synth.cancel(); } catch (e) {}
          return;
        }
        this.isPlaying = true;
        if (this.onSpeechStart) this.onSpeechStart();

        // iOS Safari対策: 長文発話途中でSpeechSynthesisが停止するバグの防止
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
    this.playSessionId++; // 世代を進めて過去の非同期待機・コールバックを全て無効化
    this.isPlaying = false;

    if (this.currentAudio) {
      const audio = this.currentAudio;
      this.currentAudio = null;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }

    if (this.currentUtterance) {
      const utter = this.currentUtterance;
      this.currentUtterance = null;
      utter.onstart = null;
      utter.onend = null;
      utter.onerror = null;
    }
    window.__activeUtterance = null;

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }

  /* ========================================================
     BGM再生・制御 (Web Audio API GainNode 連動)
     ======================================================== */

  /**
   * 指定したBGMトラックをフェードアウトしてノードを切断・破棄
   */
  _fadeOutAndCleanTrack(track, durationMs = 500) {
    if (!track || !track.audio) return;
    const durationSec = durationMs / 1000;

    if (this.audioCtx && track.gain) {
      try {
        const now = this.audioCtx.currentTime;
        track.gain.gain.cancelScheduledValues(now);
        track.gain.gain.setValueAtTime(track.gain.gain.value, now);
        track.gain.gain.linearRampToValueAtTime(0.0001, now + durationSec);
      } catch (e) {}
    } else {
      // Web Audio非接続時のフォールバック
      try {
        let vol = track.audio.volume;
        const step = vol / 10;
        const timer = setInterval(() => {
          vol = Math.max(0, vol - step);
          try { track.audio.volume = vol; } catch (e) {}
          if (vol <= 0.01) clearInterval(timer);
        }, durationMs / 10);
      } catch (e) {}
    }

    setTimeout(() => {
      try {
        track.audio.pause();
        track.audio.currentTime = 0;
        if (track.source) track.source.disconnect();
        if (track.gain) track.gain.disconnect();
      } catch (e) {}
    }, durationMs + 80);
  }

  /**
   * BGM再生 (同一トラックは継続、新トラックはWeb Audio GainNodeでスムーズにクロスフェード)
   * iOS SafariでのHTMLMediaElement.volume無視仕様をWeb Audio APIのGainNode経由で完全解決
   */
  playBGM(url, loop = true) {
    if (!url) return;
    this.unlockAudio();

    if (this.currentBGMUrl === url && this.currentBGMTrack && !this.currentBGMTrack.audio.paused) {
      return; // 既に同じ曲が再生中
    }

    const previousTrack = this.currentBGMTrack;
    this.currentBGMUrl = url;

    // 前のトラックをフェードアウト
    if (previousTrack) {
      this._fadeOutAndCleanTrack(previousTrack, 500);
    }

    const newAudio = new Audio(url);
    newAudio.loop = loop;
    newAudio.crossOrigin = 'anonymous';

    let sourceNode = null;
    let trackGain = null;

    if (this.audioCtx && this.bgmGainNode) {
      try {
        sourceNode = this.audioCtx.createMediaElementSource(newAudio);
        trackGain = this.audioCtx.createGain();

        // 0.5秒かけて滑らかにフェードイン (初期値 0.0001)
        const now = this.audioCtx.currentTime;
        trackGain.gain.setValueAtTime(0.0001, now);
        trackGain.gain.linearRampToValueAtTime(1.0, now + 0.5);

        sourceNode.connect(trackGain);
        trackGain.connect(this.bgmGainNode);
      } catch (e) {
        console.warn("[AudioController] createMediaElementSource fallback to HTMLMediaElement:", e);
      }
    }

    // Web Audio非接続時のフォールバック設定
    if (!trackGain) {
      newAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    }

    this.currentBGMTrack = {
      audio: newAudio,
      source: sourceNode,
      gain: trackGain,
      url: url
    };

    const playPromise = newAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("[AudioController] BGM autoplay blocked or pending unlock:", err);
        this.pendingBGMUrl = url;
      });
    }
  }

  /**
   * BGMフェードアウト停止
   */
  stopBGM(fadeDuration = 500) {
    this.currentBGMUrl = null;
    if (this.currentBGMTrack) {
      this._fadeOutAndCleanTrack(this.currentBGMTrack, fadeDuration);
      this.currentBGMTrack = null;
    }
  }

  /**
   * BGM音量設定 (0.0 〜 1.0)
   * iOS Safariでも確実に即時音量が変化するようWeb Audio APIのGainNodeを操作
   */
  setBGMVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));

    if (this.audioCtx && this.bgmGainNode) {
      try {
        const now = this.audioCtx.currentTime;
        this.bgmGainNode.gain.cancelScheduledValues(now);
        this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, now);
      } catch (e) {
        this.bgmGainNode.gain.value = this.bgmVolume;
      }
    }

    // Web Audio非接続時のフォールバック
    if (this.currentBGMTrack && !this.currentBGMTrack.gain) {
      this.currentBGMTrack.audio.volume = this.isMuted ? 0 : this.bgmVolume;
    }
  }

  /**
   * ミュート切り替え (BGM・効果音・ボイス一括消音)
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0 : 1;

    // Web Audio APIのマスターゲインを変更 (BGM・SFXを一括完全消音)
    if (this.audioCtx && this.masterGainNode) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGainNode.gain.cancelScheduledValues(now);
        this.masterGainNode.gain.setValueAtTime(targetGain, now);
      } catch (e) {
        this.masterGainNode.gain.value = targetGain;
      }
    }

    // Web Audio非接続時のフォールバック
    if (this.currentBGMTrack && !this.currentBGMTrack.gain) {
      this.currentBGMTrack.audio.volume = this.isMuted ? 0 : this.bgmVolume;
    }

    if (this.isMuted) {
      this.stop(); // 再生中のボイスを即座に停止
    }

    return this.isMuted;
  }
}

window.AudioController = AudioController;
