/**
 * GameEngine
 * ノベルゲームのメイン進行管理
 */
class GameEngine {
  constructor(scenario) {
    this.scenario = scenario;
    this.currentIndex = 0;
    this.isTextTyping = false;
    this.typewriterTimer = null;
    this.isAutoMode = false;
    this.autoTimer = null;
    this.logHistory = [];

    // モジュール
    this.audio = new AudioController();
    this.character = new CharacterController(document.getElementById('characterContainer'));

    // DOM要素
    this.dom = {
      titleScreen: document.getElementById('titleScreen'),
      btnStart: document.getElementById('btnStart'),
      gameScreen: document.getElementById('gameScreen'),
      bgLayer: document.getElementById('bgLayer'),
      speakerName: document.getElementById('speakerName'),
      speakerBox: document.getElementById('speakerBox'),
      messageText: document.getElementById('messageText'),
      dialogBox: document.getElementById('dialogBox'),
      choicesOverlay: document.getElementById('choicesOverlay'),
      choicesList: document.getElementById('choicesList'),
      nextIndicator: document.getElementById('nextIndicator'),
      btnAuto: document.getElementById('btnAuto'),
      btnLog: document.getElementById('btnLog'),
      logModal: document.getElementById('logModal'),
      logContent: document.getElementById('logContent'),
      btnCloseLog: document.getElementById('btnCloseLog')
    };

    this.bindEvents();
    this.setupAudioSync();
  }

  bindEvents() {
    // タイトル画面スタート（ユーザー操作によるAudio再生権限取得）
    this.dom.btnStart.addEventListener('click', () => {
      this.dom.titleScreen.classList.add('hidden');
      this.dom.gameScreen.classList.remove('hidden');
      this.showScene(0);
    });

    // ダイアログクリック（テキスト送り / 完了）
    this.dom.dialogBox.addEventListener('click', (e) => {
      // 選択肢表示中やボタンクリック時は除外
      if (this.dom.choicesOverlay.classList.contains('active')) return;
      this.handleUserAdvance();
    });

    // オートモード切替
    this.dom.btnAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isAutoMode = !this.isAutoMode;
      this.dom.btnAuto.classList.toggle('active', this.isAutoMode);
      if (this.isAutoMode && !this.isTextTyping && !this.audio.isPlaying) {
        this.nextScene();
      }
    });

    // バックログ開閉
    this.dom.btnLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showLog();
    });
    this.dom.btnCloseLog.addEventListener('click', () => {
      this.dom.logModal.classList.add('hidden');
    });

    // スペースキー / Enterキーでも進行
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (!this.dom.titleScreen.classList.contains('hidden')) {
          this.dom.btnStart.click();
        } else if (!this.dom.choicesOverlay.classList.contains('active')) {
          this.handleUserAdvance();
        }
      }
    });
  }

  /**
   * 音声とリップシンクの同期リスナー
   */
  setupAudioSync() {
    this.audio.onSpeechStart = () => {
      this.character.setTalking(true);
    };

    this.audio.onSpeechEnd = () => {
      this.character.setTalking(false);

      // オートモード時は音声終了後に少し待って次へ
      if (this.isAutoMode && !this.isTextTyping) {
        clearTimeout(this.autoTimer);
        this.autoTimer = setTimeout(() => {
          if (this.isAutoMode) this.nextScene();
        }, 1200);
      }
    };
  }

  /**
   * クリック時の処理
   */
  handleUserAdvance() {
    if (this.isTextTyping) {
      // 文字送り中なら全文を一気に表示
      this.completeTyping();
    } else {
      // 次のシーンへ
      this.nextScene();
    }
  }

  /**
   * 指定インデックスのシーンを表示
   */
  async showScene(index) {
    if (index >= this.scenario.length) {
      // エンディング
      this.showEnding();
      return;
    }

    this.currentIndex = index;
    const scene = this.scenario[index];

    // バックログに追加
    this.logHistory.push({
      speaker: scene.speaker || 'ナレーション',
      text: scene.text
    });

    // 1. 背景の更新
    if (scene.background) {
      this.updateBackground(scene.background);
    }

    // 2. キャラクターの更新
    if (scene.character) {
      if (scene.character.visible) {
        this.character.container.style.opacity = '1';
        this.character.setExpression(scene.character.expression || 'normal');
        if (scene.character.motion) {
          this.character.playMotion(scene.character.motion);
        }
      } else {
        this.character.container.style.opacity = '0';
      }
    }

    // 3. 話者名の更新
    if (scene.speaker) {
      this.dom.speakerBox.style.display = 'block';
      this.dom.speakerName.textContent = scene.speaker;
    } else {
      this.dom.speakerBox.style.display = 'none';
    }

    // 4. 音声の再生
    this.audio.play(scene);

    // 5. テキストのタイプライター演出
    this.startTypewriter(scene.text, () => {
      // 選択肢がある場合は表示
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      }
    });
  }

  updateBackground(bgUrl) {
    this.dom.bgLayer.style.backgroundImage = `url('${bgUrl}')`;
  }

  startTypewriter(fullText, onComplete) {
    clearInterval(this.typewriterTimer);
    this.isTextTyping = true;
    this.dom.nextIndicator.style.opacity = '0';
    this.dom.messageText.textContent = '';
    this.currentFullText = fullText;
    this.typingOnComplete = onComplete;

    let charIndex = 0;
    const speed = 35; // 1文字あたりのミリ秒

    this.typewriterTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        this.dom.messageText.textContent += fullText[charIndex];
        charIndex++;
      } else {
        this.completeTyping();
      }
    }, speed);
  }

  completeTyping() {
    clearInterval(this.typewriterTimer);
    this.isTextTyping = false;
    this.dom.messageText.textContent = this.currentFullText;
    this.dom.nextIndicator.style.opacity = '1';
    if (this.typingOnComplete) {
      const cb = this.typingOnComplete;
      this.typingOnComplete = null;
      cb();
    }
  }

  nextScene() {
    const scene = this.scenario[this.currentIndex];
    // 選択肢表示中は次へ進まない
    if (scene && scene.choices && scene.choices.length > 0) {
      return;
    }
    this.showScene(this.currentIndex + 1);
  }

  showChoices(choices) {
    this.dom.choicesList.innerHTML = '';
    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.textContent = choice.text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');
        this.showScene(choice.nextIndex);
      });
      this.dom.choicesList.appendChild(btn);
    });
    this.dom.choicesOverlay.classList.add('active');
  }

  showLog() {
    this.dom.logContent.innerHTML = this.logHistory.map(entry => `
      <div class="log-item">
        <div class="log-speaker">${entry.speaker}</div>
        <div class="log-text">${entry.text}</div>
      </div>
    `).join('');
    this.dom.logModal.classList.remove('hidden');
  }

  showEnding() {
    this.audio.stop();
    this.dom.speakerBox.style.display = 'none';
    this.dom.messageText.textContent = '【プロトタイプ終了】お疲れ様でした！最初からやり直すには画面をクリックしてください。';
    this.currentIndex = -1;
  }
}

window.GameEngine = GameEngine;
