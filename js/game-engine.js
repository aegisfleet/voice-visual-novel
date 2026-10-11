/**
 * GameEngine
 * - ラベルジャンプ方式（シーンID指定）によるマルチエンディング進行管理
 * - 複数キャラクター＆ボイス制御
 * - エンディング達成フラグ記録と演出
 */
class GameEngine {
  constructor(scenario) {
    this.scenario = scenario;
    this.scenarioMap = new Map();
    this.scenario.forEach((scene, index) => {
      this.scenarioMap.set(scene.id, { scene, index });
    });

    this.currentSceneId = null;
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
      endingsBadge: document.getElementById('endingsBadge'),
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
      btnTitle: document.getElementById('btnTitle'),
      logModal: document.getElementById('logModal'),
      logContent: document.getElementById('logContent'),
      btnCloseLog: document.getElementById('btnCloseLog'),
      endingModal: document.getElementById('endingModal'),
      endingType: document.getElementById('endingType'),
      endingTitle: document.getElementById('endingTitle'),
      endingDesc: document.getElementById('endingDesc'),
      btnReturnTitle: document.getElementById('btnReturnTitle')
    };

    this.updateEndingsBadge();
    this.bindEvents();
    this.setupAudioSync();
  }

  bindEvents() {
    this.dom.btnStart.addEventListener('click', () => {
      this.dom.titleScreen.classList.add('hidden');
      this.dom.gameScreen.classList.remove('hidden');
      this.logHistory = [];
      this.goToScene(this.scenario[0].id);
    });

    this.dom.dialogBox.addEventListener('click', () => {
      if (this.dom.choicesOverlay.classList.contains('active')) return;
      this.handleUserAdvance();
    });

    this.dom.btnAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isAutoMode = !this.isAutoMode;
      this.dom.btnAuto.classList.toggle('active', this.isAutoMode);
      if (this.isAutoMode && !this.isTextTyping && !this.audio.isPlaying) {
        this.advanceNext();
      }
    });

    this.dom.btnLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showLog();
    });
    this.dom.btnCloseLog.addEventListener('click', () => {
      this.dom.logModal.classList.add('hidden');
    });

    // タイトルへ戻るボタン
    if (this.dom.btnTitle) {
      this.dom.btnTitle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.returnToTitle();
      });
    }

    // エンディング画面からの復帰
    this.dom.btnReturnTitle.addEventListener('click', () => {
      this.dom.endingModal.classList.add('hidden');
      this.returnToTitle();
    });

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

  setupAudioSync() {
    this.audio.onSpeechStart = () => {
      this.character.setTalking(true);
    };

    this.audio.onSpeechEnd = () => {
      this.character.setTalking(false);
      if (this.isAutoMode && !this.isTextTyping) {
        clearTimeout(this.autoTimer);
        this.autoTimer = setTimeout(() => {
          if (this.isAutoMode) this.advanceNext();
        }, 1100);
      }
    };
  }

  handleUserAdvance() {
    if (this.isTextTyping) {
      this.completeTyping();
    } else {
      this.advanceNext();
    }
  }

  advanceNext() {
    const currentEntry = this.scenarioMap.get(this.currentSceneId);
    if (!currentEntry) return;

    const scene = currentEntry.scene;

    // 選択肢表示中はクリックで進まない
    if (scene.choices && scene.choices.length > 0) return;

    // エンディングの場合はエンディング幕を表示
    if (scene.ending) {
      this.showEnding(scene.ending);
      return;
    }

    // 明示的なjump指定があればそのシーンへ
    if (scene.jump) {
      this.goToScene(scene.jump);
      return;
    }

    // なければ次の配列要素へ
    const nextIndex = currentEntry.index + 1;
    if (nextIndex < this.scenario.length) {
      this.goToScene(this.scenario[nextIndex].id);
    } else {
      this.returnToTitle();
    }
  }

  goToScene(sceneId) {
    const entry = this.scenarioMap.get(sceneId);
    if (!entry) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    this.currentSceneId = sceneId;
    const scene = entry.scene;

    // バックログ記録
    this.logHistory.push({
      speaker: scene.speaker || '状況',
      text: scene.text
    });

    // 1. 背景更新
    if (scene.background) {
      this.dom.bgLayer.style.backgroundImage = `url('${scene.background}')`;
    }

    // 2. キャラクター更新
    if (scene.character) {
      this.character.show(
        scene.character.id,
        scene.character.expression || 'normal',
        scene.character.motion || null
      );
    } else {
      this.character.hide();
    }

    // 3. 話者名プレート
    if (scene.speaker) {
      this.dom.speakerBox.style.display = 'block';
      this.dom.speakerName.textContent = scene.speaker;
      // 話者ごとにプレートのスタイルを変える
      this.updateSpeakerTheme(scene.speaker);
    } else {
      this.dom.speakerBox.style.display = 'none';
    }

    // 4. 音声再生
    this.audio.play(scene);

    // 5. テキストのタイプライター演出
    this.startTypewriter(scene.text, () => {
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      }
    });
  }

  updateSpeakerTheme(speaker) {
    if (speaker.includes('アイリス')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)';
    } else if (speaker.includes('イブ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)';
    } else if (speaker.includes('キリシマ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)';
    } else {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #00f3ff 0%, #0077ff 100%)';
    }
  }

  startTypewriter(fullText, onComplete) {
    clearInterval(this.typewriterTimer);
    this.isTextTyping = true;
    this.dom.nextIndicator.style.opacity = '0';
    this.dom.messageText.textContent = '';
    this.currentFullText = fullText;
    this.typingOnComplete = onComplete;

    let charIndex = 0;
    const speed = 32;

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

  showChoices(choices) {
    this.dom.choicesList.innerHTML = '';
    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.textContent = choice.text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');
        this.goToScene(choice.jump);
      });
      this.dom.choicesList.appendChild(btn);
    });
    this.dom.choicesOverlay.classList.add('active');
  }

  showEnding(ending) {
    this.audio.stop();
    this.character.hide();

    // エンディング達成フラグの保存
    this.saveEndingCleared(ending.type);
    this.updateEndingsBadge();

    this.dom.endingType.textContent = `${ending.type} END`;
    this.dom.endingType.className = `ending-type-badge ending-${ending.type.toLowerCase()}`;
    this.dom.endingTitle.textContent = ending.title;
    this.dom.endingDesc.textContent = ending.description;

    this.dom.endingModal.classList.remove('hidden');
  }

  saveEndingCleared(type) {
    try {
      const cleared = JSON.parse(localStorage.getItem('cleared_endings') || '[]');
      if (!cleared.includes(type)) {
        cleared.push(type);
        localStorage.setItem('cleared_endings', JSON.stringify(cleared));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  updateEndingsBadge() {
    if (!this.dom.endingsBadge) return;
    try {
      const cleared = JSON.parse(localStorage.getItem('cleared_endings') || '[]');
      const bad = cleared.includes('BAD') ? 'cleared' : '';
      const happy = cleared.includes('HAPPY') ? 'cleared' : '';
      const trueEnd = cleared.includes('TRUE') ? 'cleared' : '';

      this.dom.endingsBadge.innerHTML = `
        <span class="badge-item ${bad}">BAD END: ${cleared.includes('BAD') ? '達成済' : '未達成'}</span>
        <span class="badge-item ${happy}">HAPPY END: ${cleared.includes('HAPPY') ? '達成済' : '未達成'}</span>
        <span class="badge-item ${trueEnd}">TRUE END: ${cleared.includes('TRUE') ? '達成済' : '未達成'}</span>
      `;
    } catch {
      // ignore
    }
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

  returnToTitle() {
    this.audio.stop();
    this.character.hide();
    this.dom.gameScreen.classList.add('hidden');
    this.dom.endingModal.classList.add('hidden');
    this.dom.titleScreen.classList.remove('hidden');
    this.updateEndingsBadge();
  }
}

window.GameEngine = GameEngine;
