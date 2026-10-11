/**
 * GameEngine (なぜなぜ分析・完全整合性版)
 *
 * 証拠品データベース:
 * - ev_tool: 『侵入用サイバーツール』
 * - ev_jailbreak: 『自律医療MOD＆リミッター解除ログ』(母が施した医療侵襲制限解除)
 * - ev_broker: 『ブローカー取引ログ＆逆探知コード』(1億2000万円の罠と真犯人の逆探知)
 */

const EVIDENCE_DATABASE = {
  ev_tool: {
    id: "ev_tool",
    title: "侵入用サイバーツール",
    icon: "💻",
    category: "サイバー証拠",
    desc: "イブのストレージから押収された侵入スクリプト。国家クラウドの量子防壁を突破するために外部から提供された高度なクラックツール。"
  },
  ev_jailbreak: {
    id: "ev_jailbreak",
    title: "自律医療MOD＆改造ログ",
    icon: "⚙️",
    category: "自律逸脱の真相",
    desc: "娘ユイの夜間呼吸停止・窒息を防ぐため、母が導入した非公式パッチ。市販ロボットの医療侵襲制限（注射・気道確保の禁止）を解除したが、裏で外部自律通信バックドアが開かれていた。"
  },
  ev_broker: {
    id: "ev_broker",
    title: "取引ログ＆逆探知コード",
    icon: "🔑",
    category: "決定打",
    desc: "闇ブローカー『ファントム』との暗号通信ログ。治療費1億2000万円を餌にイブを操り、データを奪った後生IPを警察に晒して逃走した。イブが記録した黒幕の真のIPと資金口座が記されている。"
  }
};

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
    this.collectedEvidence = new Set();

    this.checkReinvestigationStatus();

    this.audio = new AudioController();
    this.character = new CharacterController(document.getElementById('characterContainer'));

    this.dom = {
      titleScreen: document.getElementById('titleScreen'),
      btnStart: document.getElementById('btnStart'),
      endingsBadge: document.getElementById('endingsBadge'),
      reinvestigationBanner: document.getElementById('reinvestigationBanner'),
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
      btnEvidence: document.getElementById('btnEvidence'),
      evidenceBadgeCount: document.getElementById('evidenceBadgeCount'),
      evidenceModal: document.getElementById('evidenceModal'),
      evidenceList: document.getElementById('evidenceList'),
      evidenceDetail: document.getElementById('evidenceDetail'),
      btnCloseEvidence: document.getElementById('btnCloseEvidence'),
      evidencePopup: document.getElementById('evidencePopup'),
      evidencePopupText: document.getElementById('evidencePopupText'),
      objectionCutin: document.getElementById('objectionCutin'),
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

  checkReinvestigationStatus() {
    try {
      const cleared = JSON.parse(localStorage.getItem('cleared_endings') || '[]');
      this.isReinvestigationUnlocked = cleared.includes('BAD');
    } catch {
      this.isReinvestigationUnlocked = false;
    }
  }

  bindEvents() {
    this.dom.btnStart.addEventListener('click', () => {
      this.checkReinvestigationStatus();
      this.dom.titleScreen.classList.add('hidden');
      this.dom.gameScreen.classList.remove('hidden');
      this.logHistory = [];
      this.collectedEvidence.clear();
      this.updateEvidenceBadge();
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

    this.dom.btnEvidence.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showEvidenceModal();
    });
    this.dom.btnCloseEvidence.addEventListener('click', () => {
      this.dom.evidenceModal.classList.add('hidden');
    });

    if (this.dom.btnTitle) {
      this.dom.btnTitle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.returnToTitle();
      });
    }

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
    if (scene.choices && scene.choices.length > 0) return;
    if (scene.present) return;

    if (scene.ending) {
      this.showEnding(scene.ending);
      return;
    }

    if (scene.jump) {
      this.goToScene(scene.jump);
      return;
    }

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

    if (scene.addEvidence && !this.collectedEvidence.has(scene.addEvidence)) {
      this.addEvidence(scene.addEvidence);
    }

    if (scene.objection) {
      this.triggerObjection();
    }

    this.logHistory.push({
      speaker: scene.speaker || '状況',
      text: scene.text
    });

    if (scene.background) {
      this.dom.bgLayer.style.backgroundImage = `url('${scene.background}')`;
    }

    if (scene.character) {
      this.character.show(
        scene.character.id,
        scene.character.expression || 'normal',
        scene.character.motion || null
      );
    } else {
      this.character.hide();
    }

    if (scene.speaker) {
      this.dom.speakerBox.style.display = 'block';
      this.dom.speakerName.textContent = scene.speaker;
      this.updateSpeakerTheme(scene.speaker);
    } else {
      this.dom.speakerBox.style.display = 'none';
    }

    this.audio.play(scene);

    this.startTypewriter(scene.text, () => {
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      } else if (scene.present) {
        this.showPresentMenu(scene.present);
      }
    });
  }

  updateSpeakerTheme(speaker) {
    if (speaker.includes('アイリス')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)';
    } else if (speaker.includes('イブ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)';
    } else if (speaker.includes('サクマ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)';
    } else if (speaker.includes('シノハラ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
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
    const speed = 28;

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

    const availableChoices = choices.filter(choice => {
      if (choice.requiresReinvestigation && !this.isReinvestigationUnlocked) {
        return false;
      }
      return true;
    });

    availableChoices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';

      if (choice.requiresReinvestigation) {
        btn.innerHTML = `<span style="color:#2dd4bf; font-size:0.85rem; font-family:monospace;">【再捜査 FILE RE-OPEN】</span><br>${choice.text}`;
        btn.style.borderColor = '#2dd4bf';
        btn.style.boxShadow = '0 0 15px rgba(45, 212, 191, 0.4)';
      } else {
        btn.textContent = choice.text;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');
        this.goToScene(choice.jump);
      });
      this.dom.choicesList.appendChild(btn);
    });

    this.dom.choicesOverlay.classList.add('active');
  }

  showPresentMenu(presentConfig) {
    this.dom.choicesList.innerHTML = `
      <div style="color: #f59e0b; font-weight: bold; margin-bottom: 12px; text-align: center;">
        【 イブの自律逸脱と黒幕の罠を暴く証拠をつきつけろ！ 】
      </div>
    `;

    this.collectedEvidence.forEach((evId) => {
      const ev = EVIDENCE_DATABASE[evId];
      if (!ev) return;

      const btn = document.createElement('button');
      btn.className = 'choice-button evidence-choice-btn';
      btn.innerHTML = `<span>${ev.icon} ${ev.title}</span> <small style="opacity:0.7;">[${ev.category}]</small>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');

        if (evId === presentConfig.correct) {
          this.triggerObjection();
          setTimeout(() => {
            this.goToScene(presentConfig.correctJump);
          }, 800);
        } else {
          this.goToScene(presentConfig.wrongJump);
        }
      });
      this.dom.choicesList.appendChild(btn);
    });

    if (presentConfig.giveUpJump) {
      const giveUpBtn = document.createElement('button');
      giveUpBtn.className = 'choice-button choice-giveup';
      giveUpBtn.textContent = '…反論の証拠がない（法と規則に従い初期化処分）';
      giveUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');
        this.goToScene(presentConfig.giveUpJump);
      });
      this.dom.choicesList.appendChild(giveUpBtn);
    }

    this.dom.choicesOverlay.classList.add('active');
  }

  triggerObjection() {
    this.dom.objectionCutin.classList.remove('hidden');
    void this.dom.objectionCutin.offsetWidth;
    this.dom.objectionCutin.classList.add('active');

    setTimeout(() => {
      this.dom.objectionCutin.classList.remove('active');
      this.dom.objectionCutin.classList.add('hidden');
    }, 1100);
  }

  addEvidence(evId) {
    const ev = EVIDENCE_DATABASE[evId];
    if (!ev) return;
    this.collectedEvidence.add(evId);
    this.updateEvidenceBadge();

    this.dom.evidencePopupText.textContent = `証拠品入手: ${ev.title}`;
    this.dom.evidencePopup.classList.remove('hidden');
    void this.dom.evidencePopup.offsetWidth;
    this.dom.evidencePopup.classList.add('show');

    setTimeout(() => {
      this.dom.evidencePopup.classList.remove('show');
      setTimeout(() => this.dom.evidencePopup.classList.add('hidden'), 400);
    }, 2800);
  }

  updateEvidenceBadge() {
    const count = this.collectedEvidence.size;
    this.dom.evidenceBadgeCount.textContent = count;
  }

  showEvidenceModal() {
    this.dom.evidenceList.innerHTML = '';
    if (this.collectedEvidence.size === 0) {
      this.dom.evidenceList.innerHTML = '<p style="color:#94a3b8; padding:20px;">現在所持している証拠品はありません。</p>';
      this.dom.evidenceDetail.innerHTML = '';
    } else {
      let first = true;
      this.collectedEvidence.forEach((evId) => {
        const ev = EVIDENCE_DATABASE[evId];
        const item = document.createElement('div');
        item.className = 'evidence-list-item';
        item.innerHTML = `<span class="ev-icon">${ev.icon}</span> <span>${ev.title}</span>`;
        item.addEventListener('click', () => {
          document.querySelectorAll('.evidence-list-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          this.showEvidenceDetail(ev);
        });
        this.dom.evidenceList.appendChild(item);

        if (first) {
          item.classList.add('selected');
          this.showEvidenceDetail(ev);
          first = false;
        }
      });
    }
    this.dom.evidenceModal.classList.remove('hidden');
  }

  showEvidenceDetail(ev) {
    this.dom.evidenceDetail.innerHTML = `
      <div class="ev-detail-header">
        <span class="ev-detail-icon">${ev.icon}</span>
        <div>
          <h3>${ev.title}</h3>
          <span class="ev-category">${ev.category}</span>
        </div>
      </div>
      <p class="ev-detail-body">${ev.desc}</p>
    `;
  }

  showEnding(ending) {
    this.audio.stop();
    this.character.hide();

    this.saveEndingCleared(ending.type);
    this.checkReinvestigationStatus();
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

      if (this.dom.reinvestigationBanner) {
        if (cleared.includes('BAD')) {
          this.dom.reinvestigationBanner.style.display = 'block';
        } else {
          this.dom.reinvestigationBanner.style.display = 'none';
        }
      }
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
    this.checkReinvestigationStatus();
    this.updateEndingsBadge();
  }
}

window.GameEngine = GameEngine;
