/**
 * GameEngine (モバイルファースト・WebGL ＆ Rive統合サイバーノベル)
 *
 * 証拠品データベース:
 * - ev_tool: 『侵入用サイバーツール』
 * - ev_jailbreak: 『自律医療MOD＆改造ログ』
 * - ev_broker: 『取引ログ＆逆探知コード』
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
    desc: "難病の娘の急変に怯え、事前に万が一の保険として入手し封印していたスピア型特注MOD。救急車が25分来ない窒息死寸前の夜、母が理性を失って適用した。侵襲制限（注射・気道確保）を解除したが、裏で外部遠隔操作バックドアが開かれていた。"
  },
  ev_broker: {
    id: "ev_broker",
    title: "取引ログ＆逆探知コード",
    icon: "🔑",
    category: "決定打",
    desc: "闇ブローカー『ファントム』との暗号通信ログ。時限二次拡散タイマーを安全停止させる解除キーと、黒幕の真のIPアドレス・資金口座が記録されている。イブを初期化すれば永遠に失われる決定打。"
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

    // WebGL シェーダー演出エンジン
    const webglCanvas = document.getElementById('webglCanvas');
    this.fx = webglCanvas ? new WebGLCyberFX(webglCanvas) : null;

    // Rive HUD エンジン
    const riveCanvas = document.getElementById('riveHudCanvas');
    this.rive = riveCanvas ? new RiveManager(riveCanvas) : null;

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
      btnBackEvidence: document.getElementById('btnBackEvidence'),
      evidencePopup: document.getElementById('evidencePopup'),
      evidencePopupText: document.getElementById('evidencePopupText'),
      objectionCutin: document.getElementById('objectionCutin'),
      logModal: document.getElementById('logModal'),
      logContent: document.getElementById('logContent'),
      btnCloseLog: document.getElementById('btnCloseLog'),
      btnBackLog: document.getElementById('btnBackLog'),
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
    // タイトル開始 (モバイル音声アンロック)
    this.dom.btnStart.addEventListener('click', () => {
      this.audio.unlockAudio();
      this.audio.playClickSound();
      if (this.fx) this.fx.triggerFlash([0.0, 0.95, 1.0], 0.7, 300);

      this.checkReinvestigationStatus();
      this.dom.titleScreen.classList.add('hidden');
      this.dom.gameScreen.classList.remove('hidden');
      this.logHistory = [];
      this.collectedEvidence.clear();
      this.updateEvidenceBadge();
      this.goToScene(this.scenario[0].id);
    });

    // モバイル全画面タップで進行 (操作パネルや選択肢、モーダル除外)
    this.dom.gameScreen.addEventListener('click', (e) => {
      if (e.target.closest('.controls-bar') ||
          e.target.closest('.choices-overlay') ||
          e.target.closest('.evidence-modal') ||
          e.target.closest('.log-modal') ||
          e.target.closest('.ending-modal')) {
        return;
      }
      if (this.dom.choicesOverlay.classList.contains('active')) return;
      this.handleUserAdvance();
    });

    // AUTO トグル
    this.dom.btnAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClickSound();
      this.isAutoMode = !this.isAutoMode;
      this.dom.btnAuto.classList.toggle('active', this.isAutoMode);
      if (this.isAutoMode) {
        this.checkAutoAdvance();
      } else {
        clearTimeout(this.autoTimer);
      }
    });

    // ログモーダル
    this.dom.btnLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClickSound();
      this.showLog();
    });
    const closeLogAction = () => {
      this.audio.playClickSound();
      this.dom.logModal.classList.add('hidden');
    };
    if (this.dom.btnCloseLog) this.dom.btnCloseLog.addEventListener('click', closeLogAction);
    if (this.dom.btnBackLog) this.dom.btnBackLog.addEventListener('click', closeLogAction);
    this.dom.logModal.addEventListener('click', (e) => {
      if (e.target === this.dom.logModal) closeLogAction();
    });

    // 証拠品手帳モーダル
    this.dom.btnEvidence.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClickSound();
      this.showEvidenceModal();
    });
    const closeEvidenceAction = () => {
      this.audio.playClickSound();
      this.dom.evidenceModal.classList.add('hidden');
    };
    if (this.dom.btnCloseEvidence) this.dom.btnCloseEvidence.addEventListener('click', closeEvidenceAction);
    if (this.dom.btnBackEvidence) this.dom.btnBackEvidence.addEventListener('click', closeEvidenceAction);
    this.dom.evidenceModal.addEventListener('click', (e) => {
      if (e.target === this.dom.evidenceModal) closeEvidenceAction();
    });

    // タイトルへ戻る
    if (this.dom.btnTitle) {
      this.dom.btnTitle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.returnToTitle();
      });
    }

    this.dom.btnReturnTitle.addEventListener('click', () => {
      this.audio.playClickSound();
      this.dom.endingModal.classList.add('hidden');
      this.returnToTitle();
    });

    // キーボード操作 (PC用)
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
      this.checkAutoAdvance(true);
    };
  }

  checkAutoAdvance(fromSpeechEnd = false) {
    clearTimeout(this.autoTimer);
    if (!this.isAutoMode) return;

    if (this.isTextTyping || this.audio.isPlaying) return;

    const currentEntry = this.scenarioMap.get(this.currentSceneId);
    if (!currentEntry) return;
    const scene = currentEntry.scene;

    if ((scene.choices && scene.choices.length > 0) || scene.present || scene.ending) return;

    let readingDelay = 600;
    if (!fromSpeechEnd) {
      const textLen = (scene.text || '').length;
      readingDelay = Math.min(3000, Math.max(1400, textLen * 40));
    }

    this.autoTimer = setTimeout(() => {
      if (this.isAutoMode && !this.isTextTyping && !this.audio.isPlaying) {
        this.advanceNext();
      }
    }, readingDelay);
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
    clearTimeout(this.autoTimer);
    const entry = this.scenarioMap.get(sceneId);
    if (!entry) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    this.currentSceneId = sceneId;
    const scene = entry.scene;

    // 証拠品入手
    if (scene.addEvidence && !this.collectedEvidence.has(scene.addEvidence)) {
      this.addEvidence(scene.addEvidence);
    }

    // 異議あり！演出
    if (scene.objection) {
      this.triggerObjection();
    }

    // ログ記録
    this.logHistory.push({
      speaker: scene.speaker || '状況',
      text: scene.text
    });

    // 背景切り替え
    if (scene.background) {
      this.dom.bgLayer.style.backgroundImage = `url('${scene.background}')`;
    }

    // キャラクター切り替え & モーション連動
    if (scene.character) {
      const charId = scene.character.id;
      const motion = scene.character.motion || null;

      this.character.show(
        charId,
        scene.character.expression || 'normal',
        motion
      );

      // WebGLホログラムモード (イブ登場時)
      if (this.fx) {
        if (charId === 'eve') {
          this.fx.setHologramMode(true, 0.8);
        } else {
          this.fx.setHologramMode(false);
        }

        // モーション連動シェイク
        if (motion === 'desk-slam') {
          this.fx.triggerShake(14, 450);
          this.audio.playObjectionImpact();
        } else if (motion === 'hop') {
          this.fx.triggerShake(4, 250);
        }
      }

      // Rive HUDアラートレベル連動
      if (this.rive) {
        if (scene.character.expression === 'angry') {
          this.rive.setAlertLevel('critical');
        } else if (scene.character.expression === 'shocked') {
          this.rive.setAlertLevel('warning');
        } else {
          this.rive.setAlertLevel('normal');
        }
      }
    } else {
      this.character.hide();
      if (this.fx) this.fx.setHologramMode(false);
    }

    // 話者表示
    if (scene.speaker) {
      this.dom.speakerBox.style.display = 'block';
      this.dom.speakerName.textContent = scene.speaker;
      this.updateSpeakerTheme(scene.speaker);
    } else {
      this.dom.speakerBox.style.display = 'none';
    }

    // 音声再生
    this.audio.play(scene);

    // テキストタイピング開始
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
    if (this.dom.messageText) this.dom.messageText.scrollTop = 0;
    this.currentFullText = fullText;
    this.typingOnComplete = onComplete;

    let charIndex = 0;
    const speed = 25;

    this.typewriterTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        this.dom.messageText.textContent += fullText[charIndex];
        
        // 3文字に1回サイバータイプ音を再生
        if (charIndex % 3 === 0) {
          this.audio.playTypeSound();
        }

        charIndex++;
        if (this.dom.messageText) {
          this.dom.messageText.scrollTop = this.dom.messageText.scrollHeight;
        }
      } else {
        this.completeTyping();
      }
    }, speed);
  }

  completeTyping() {
    clearInterval(this.typewriterTimer);
    this.isTextTyping = false;
    this.dom.messageText.textContent = this.currentFullText;
    if (this.dom.messageText) {
      this.dom.messageText.scrollTop = this.dom.messageText.scrollHeight;
    }
    this.dom.nextIndicator.style.opacity = '1';
    if (this.typingOnComplete) {
      const cb = this.typingOnComplete;
      this.typingOnComplete = null;
      cb();
    }
    this.checkAutoAdvance();
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
        btn.innerHTML = `<span class="reinvest-tag">【再捜査 FILE RE-OPEN】</span><br>${choice.text}`;
        btn.classList.add('reinvest-choice');
      } else {
        btn.textContent = choice.text;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.dom.choicesOverlay.classList.remove('active');
        this.goToScene(choice.jump);
      });
      this.dom.choicesList.appendChild(btn);
    });

    this.dom.choicesOverlay.classList.add('active');
  }

  showPresentMenu(presentConfig) {
    this.dom.choicesList.innerHTML = `
      <div class="present-banner">
        ⚡ 【証拠品をつきつけて真実を立証せよ！】 ⚡
      </div>
    `;

    const successJump = presentConfig.correctJump || presentConfig.onSuccess;
    const failJump = presentConfig.wrongJump || presentConfig.onFailure;
    const giveUpJump = presentConfig.giveUpJump || failJump;

    // 所持している証拠品ボタン
    this.collectedEvidence.forEach((evId) => {
      const ev = EVIDENCE_DATABASE[evId];
      if (!ev) return;

      const btn = document.createElement('button');
      btn.className = 'choice-button present-item';
      btn.innerHTML = `
        <span class="present-icon">${ev.icon}</span>
        <div class="present-info">
          <strong>${ev.title}</strong>
          <small>${ev.category}</small>
        </div>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.dom.choicesOverlay.classList.remove('active');

        if (evId === presentConfig.correct) {
          this.triggerObjection();
          setTimeout(() => {
            this.goToScene(successJump);
          }, 1100);
        } else {
          if (this.fx) this.fx.triggerGlitch(0.6, 350);
          this.audio.playGlitchSound();
          this.goToScene(failJump);
        }
      });

      this.dom.choicesList.appendChild(btn);
    });

    // 「証拠はない…（反論をあきらめる）」ボタン（1周目および未所持時の必須選択肢）
    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'choice-button give-up-item';
    giveUpBtn.style.borderStyle = 'dashed';
    giveUpBtn.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    giveUpBtn.innerHTML = `
      <div style="text-align: center; color: #fca5a5; font-size: 0.92rem; padding: 4px;">
        ⚠️ 「……サクマ警視を止める客観的証拠はない」（初期化を容認）
      </div>
    `;
    giveUpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClickSound();
      this.dom.choicesOverlay.classList.remove('active');
      this.goToScene(giveUpJump);
    });
    this.dom.choicesList.appendChild(giveUpBtn);

    this.dom.choicesOverlay.classList.add('active');
  }

  triggerObjection() {
    this.audio.playObjectionImpact();

    if (this.fx) {
      this.fx.triggerFlash([1.0, 0.1, 0.2], 1.0, 500);
      this.fx.triggerGlitch(0.9, 600);
      this.fx.triggerShake(16, 500);
    }

    if (this.rive) {
      this.rive.setAlertLevel('critical');
    }

    this.dom.objectionCutin.classList.remove('hidden');
    void this.dom.objectionCutin.offsetWidth;
    this.dom.objectionCutin.classList.add('play');

    setTimeout(() => {
      this.dom.objectionCutin.classList.remove('play');
      this.dom.objectionCutin.classList.add('hidden');
    }, 1200);
  }

  addEvidence(evId) {
    const ev = EVIDENCE_DATABASE[evId];
    if (!ev) return;

    this.collectedEvidence.add(evId);
    this.updateEvidenceBadge();
    this.audio.playEvidenceObtained();

    if (this.fx) {
      this.fx.triggerFlash([0.0, 0.95, 1.0], 0.6, 300);
    }

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
      this.dom.evidenceList.innerHTML = '<p class="empty-notice">現在所持している証拠品はありません。</p>';
      this.dom.evidenceDetail.innerHTML = '';
    } else {
      let first = true;
      this.collectedEvidence.forEach((evId) => {
        const ev = EVIDENCE_DATABASE[evId];
        const item = document.createElement('div');
        item.className = 'evidence-list-item';
        item.innerHTML = `<span class="ev-icon">${ev.icon}</span> <span>${ev.title}</span>`;
        item.addEventListener('click', () => {
          this.audio.playClickSound();
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
      <div class="ev-detail-card" id="evCard">
        <div class="ev-detail-header">
          <span class="ev-detail-icon">${ev.icon}</span>
          <div>
            <h3>${ev.title}</h3>
            <span class="ev-category">${ev.category}</span>
          </div>
        </div>
        <p class="ev-detail-body">${ev.desc}</p>
        <div class="ev-security-badge">SECURITY LEVEL: TOP SECRET</div>
      </div>
    `;

    // 証拠品カードの3Dチルト効果 (PCマウス & スマホタッチ)
    const card = document.getElementById('evCard');
    if (card) {
      const applyCardTilt = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        const tiltX = -(y / (rect.height / 2)) * 14;
        const tiltY = (x / (rect.width / 2)) * 14;
        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      };

      card.addEventListener('mousemove', (e) => applyCardTilt(e.clientX, e.clientY));
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });

      card.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          applyCardTilt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
      card.addEventListener('touchend', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
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

    if (this.fx) {
      if (ending.type === 'TRUE') {
        this.fx.triggerFlash([0.0, 0.95, 1.0], 0.8, 600);
      } else {
        this.fx.triggerFlash([0.8, 0.1, 0.2], 0.8, 600);
        this.fx.triggerGlitch(0.8, 800);
      }
    }

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
      const trueEnd = cleared.includes('TRUE') ? 'cleared' : '';

      this.dom.endingsBadge.innerHTML = `
        <span class="badge-item ${bad}">❌ BAD END: ${cleared.includes('BAD') ? '達成済' : '未達成'}</span>
        <span class="badge-item ${trueEnd}">🌟 TRUE END: ${cleared.includes('TRUE') ? '達成済' : '未達成'}</span>
      `;

      if (this.dom.reinvestigationBanner) {
        if (cleared.includes('BAD')) {
          this.dom.reinvestigationBanner.style.display = 'block';
        } else {
          this.dom.reinvestigationBanner.style.display = 'none';
        }
      }
    } catch {}
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
