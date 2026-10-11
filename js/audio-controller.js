/**
 * AudioController
 * - 音声ファイル (将来のTTS生成物) と ブラウザ標準Web Speech API のハイブリッド再生コントローラ
 * - 再生中のリップシンク（口パク）イベント発行
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

    this.initVoices();
  }

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

  /**
   * 日本語ボイスの取得（見つからなければデフォルト）
   */
  getJapaneseVoice(gender = 'female') {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    const jaVoices = this.voices.filter(v => v.lang.startsWith('ja'));
    if (jaVoices.length === 0) return null;

    // 性別等のヒントがあれば優先検索
    if (gender === 'female') {
      const female = jaVoices.find(v => /female|kyoko|otoya|nanami|ayumi|haruka|sayaka|mei/i.test(v.name));
      if (female) return female;
    }
    return jaVoices[0];
  }

  /**
   * 音声ファイルの存在確認（HEADリクエスト）
   */
  async checkAudioExists(url) {
    if (!url) return false;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * セリフの音声を再生する
   * @param {Object} lineData - { text, voiceFile, speechConfig: { pitch, rate, gender } }
   * @returns {Promise<void>}
   */
  async play(lineData) {
    this.stop();

    if (!lineData || !lineData.text) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;

    // 1. 本番用TTS音声ファイルが存在するか確認（存在フラグ等で最適化）
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

  /**
   * 音声ファイルを再生
   */
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

  /**
   * ブラウザの音声読み上げ (Web Speech API) で再生
   */
  _playWebSpeech(lineData) {
    return new Promise((resolve) => {
      if (!this.synth) {
        this.isPlaying = false;
        if (this.onSpeechEnd) this.onSpeechEnd();
        resolve();
        return;
      }

      // Chrome等でspeechSynthesisがpausedのまま固まる現象を解消
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
      } catch (e) {
        console.warn(e);
      }

      const text = lineData.text || '';
      const config = lineData.speechConfig || {};
      const utter = new SpeechSynthesisUtterance(text);

      utter.lang = 'ja-JP';
      utter.pitch = config.pitch !== undefined ? config.pitch : 1.1;
      utter.rate = config.rate !== undefined ? config.rate : 1.05;

      const voice = this.getJapaneseVoice(config.gender || 'female');
      if (voice) utter.voice = voice;

      // ChromeのGC対策: グローバル参照に保持して発話中の強制切断を防ぐ
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

        // 長文時のChrome自動ポーズ防止
        clearInterval(resumeTimer);
        resumeTimer = setInterval(() => {
          if (this.synth && this.synth.speaking && !hasFinished) {
            try { this.synth.resume(); } catch (e) {}
          } else {
            clearInterval(resumeTimer);
          }
        }, 4000);
      };

      utter.onend = finish;
      utter.onerror = finish;

      try {
        this.synth.speak(utter);
      } catch (err) {
        console.error('Speech synthesis error:', err);
        finish();
      }
    });
  }

  /**
   * 再生停止
   */
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
