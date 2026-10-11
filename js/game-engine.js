/**
 * GameEngine (逆転裁判風 捜査・査問会システム拡張版)
 * - 証拠品（Evidence）の収集・手帳閲覧システム
 * - 査問会での証拠品「つきつける（PRESENT）」機能
 * - 「異議あり！（OBJECTION!）」演出
 * - マルチエンディング & 5キャラクター対応
 */

const EVIDENCE_DATABASE = {
  ev_log: {
    id: "ev_log",
    title: "偽装されたアクセスログ",
    icon: "📄",
    category: "電脳証拠",
    desc: "AIイブのアカウントで実行されているが、送信元MACアドレスは開発フロアの物理端末。イブ本体の中枢からのアクセスではない。"
  },
  ev_target: {
    id: "ev_target",
    title: "保護対象の個人情報データ",
    icon: "📁",
    category: "機密データ",
    desc: "人事部シノハラの重病の娘『ユイ』の医療カルテと戸籍。闇金融の債権回収用として、ブラックリストに組み込まれていた。"
  },
  ev_contract: {
    id: "ev_contract",
    title: "裏取引の暗号契約書",
    icon: "🔑",
    category: "決定打",
    desc: "サクマ部長の秘密電子署名が付与された売却契約書。顧客と社員の機密データをダークウェブへ横流しするスキームが記されている。"
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

  bindEvents() {
    this.dom.btnStart.addEventListener('click', () => {
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

    // 証拠品手帳ボタン
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
    if (scene.present) return; // つきつける選択待ち

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

    // 証拠品獲得判定
    if (scene.addEvidence && !this.collectedEvidence.has(scene.addEvidence)) {
      this.addEvidence(scene.addEvidence);
    }

    // 異議あり！演出トリガー
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
    } else if (speaker.includes('キリシマ')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)';
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
    const speed = 30;

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

  /* --- 逆転裁判風 証拠品をつきつけるメニュー --- */
  showPresentMenu(presentConfig) {
    this.dom.choicesList.innerHTML = `
      <div style="color: #f59e0b; font-weight: bold; margin-bottom: 12px; text-align: center;">
        【 証言の矛盾を暴け！ つきつける証拠品を選べ 】
      </div>
    `;

    // 獲得済み証拠品をつきつける選択肢として展開
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
          // 正解！異議あり演出を経て正解ルートへ
          this.triggerObjection();
          setTimeout(() => {
            this.goToScene(presentConfig.correctJump);
          }, 800);
        } else {
          // 不正解
          this.goToScene(presentConfig.wrongJump);
        }
      });
      this.dom.choicesList.appendChild(btn);
    });

    // 諦める / 何もつきつけない選択肢
    if (presentConfig.giveUpJump) {
      const giveUpBtn = document.createElement('button');
      giveUpBtn.className = 'choice-button choice-giveup';
      giveUpBtn.textContent = '…反論の証拠が思い当たらない（引き下がる）';
      giveUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.choicesOverlay.classList.remove('active');
        this.goToScene(presentConfig.giveUpJump);
      });
      this.dom.choicesList.appendChild(giveUpBtn);
    }

    this.dom.choicesOverlay.classList.add('active');
  }

  /* --- 異議あり！（OBJECTION!）演出 --- */
  triggerObjection() {
    this.dom.objectionCutin.classList.remove('hidden');
    void this.dom.objectionCutin.offsetWidth;
    this.dom.objectionCutin.classList.add('active');

    setTimeout(() => {
      this.dom.objectionCutin.classList.remove('active');
      this.dom.objectionCutin.classList.add('hidden');
    }, 1100);
  }

  /* --- 証拠品手帳 --- */
  addEvidence(evId) {
    const ev = EVIDENCE_DATABASE[evId];
    if (!ev) return;
    this.collectedEvidence.add(evId);
    this.updateEvidenceBadge();

    // 獲得ポップアップ
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
