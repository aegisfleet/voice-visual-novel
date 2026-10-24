// app.js - ゲームループ・UI制御コントローラー (GHOST SCHEMA)

class GameApp {
  constructor() {
    this.state = window.gameState;
    this.audio = window.audioManager;
    this.scenario = window.SCENARIO_DATA;
    this.characters = window.CHARACTER_DATA;

    this.currentScreen = 'title'; // title | explore | debate | ending
    this.currentArea = 'desk'; // desk | living
    this.dialogueQueue = [];
    this.currentDialogueIndex = -1;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.autoTimer = null;
    this.isAutoActive = false;
    this.isSkipActive = false;
    this.backlog = [];
    this.selectedEvidenceId = null;
    this.activeDebateList = [];

    this.initDomElements();
    this.bindEvents();
    this.checkInitialState();
  }

  // DOM要素のキャッシュ取得
  initDomElements() {
    this.dom = {
      hud: document.getElementById('hud'),
      hudLocationBadge: document.getElementById('hud-location-badge'),
      hudLoopBadge: document.getElementById('hud-loop-badge'),
      hudLifeContainer: document.getElementById('hud-life-container'),
      hudHearts: document.getElementById('hud-hearts'),
      btnHudGotoDebate: document.getElementById('btn-hud-goto-debate'),
      btnHudBackToExplore: document.getElementById('btn-hud-back-to-explore'),
      btnEvidenceBag: document.getElementById('btn-evidence-bag'),
      evidenceCount: document.getElementById('evidence-count'),
      btnToggleVoice: document.getElementById('btn-toggle-voice'),
      btnToggleSe: document.getElementById('btn-toggle-se'),
      btnToggleBgm: document.getElementById('btn-toggle-bgm'),
      btnHudReturnTitle: document.getElementById('btn-hud-return-title'),

      screenTitle: document.getElementById('screen-title'),
      screenExplore: document.getElementById('screen-explore'),
      screenDebate: document.getElementById('screen-debate'),
      screenEnding: document.getElementById('screen-ending'),

      titleLoopInfo: document.getElementById('title-loop-info'),
      titleClearBadge: document.getElementById('title-clear-badge'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnContinueGame: document.getElementById('btn-continue-game'),
      btnOpenGallery: document.getElementById('btn-open-gallery'),
      btnResetSave: document.getElementById('btn-reset-save'),

      btnAreaDesk: document.getElementById('btn-area-desk'),
      btnAreaLiving: document.getElementById('btn-area-living'),
      areaDesk: document.getElementById('area-desk'),
      areaLiving: document.getElementById('area-living'),
      exploreStatusText: document.getElementById('explore-status-text'),
      evidenceNeededCounter: document.getElementById('evidence-needed-counter'),
      btnGoToDebate: document.getElementById('btn-go-to-debate'),

      debateTurnLabel: document.getElementById('debate-turn-label'),
      btnDebateBack: document.getElementById('btn-debate-back'),
      debateOpponentAvatar: document.getElementById('debate-opponent-avatar'),
      debateOpponentSpeech: document.getElementById('debate-opponent-speech'),
      btnReplayDebateVoice: document.getElementById('btn-replay-debate-voice'),
      debateHintText: document.getElementById('debate-hint-text'),
      selectedEvidencePreview: document.getElementById('selected-evidence-preview'),
      debateEvidenceList: document.getElementById('debate-evidence-list'),
      btnPresentEvidence: document.getElementById('btn-present-evidence'),

      endingIcon: document.getElementById('ending-icon'),
      endingTitle: document.getElementById('ending-title'),
      endingSub: document.getElementById('ending-sub'),
      endingUnlockedBanner: document.getElementById('ending-unlocked-banner'),
      endingDesc: document.getElementById('ending-desc'),
      btnEndingNext: document.getElementById('btn-ending-next'),
      btnEndingExploreAgain: document.getElementById('btn-ending-explore-again'),
      btnEndingGallery: document.getElementById('btn-ending-gallery'),

      dialogueStage: document.getElementById('dialogue-stage'),
      dialogueBackdrop: document.getElementById('dialogue-backdrop'),
      characterStage: document.getElementById('character-stage'),
      characterSpriteBox: document.getElementById('character-sprite-box'),
      dialogueIllustrationStage: document.getElementById('dialogue-illustration-stage'),
      dialogueIllustrationImg: document.getElementById('dialogue-illustration-img'),
      dialogueIllustrationCaption: document.getElementById('dialogue-illustration-caption'),
      btnCloseIllustration: document.getElementById('btn-close-illustration'),
      dialogueSpeaker: document.getElementById('dialogue-speaker'),
      voiceWaveIndicator: document.getElementById('voice-wave-indicator'),
      btnDialogueAuto: document.getElementById('btn-dialogue-auto'),
      btnDialogueSkip: document.getElementById('btn-dialogue-skip'),
      btnDialogueLog: document.getElementById('btn-dialogue-log'),
      dialogueText: document.getElementById('dialogue-text'),
      dialoguePrompt: document.getElementById('dialogue-prompt'),

      overlayCutin: document.getElementById('overlay-cutin'),
      cutinText: document.getElementById('cutin-text'),

      modalEvidence: document.getElementById('modal-evidence'),
      backdropEvidence: document.getElementById('backdrop-evidence'),
      btnCloseEvidence: document.getElementById('btn-close-evidence'),
      modalEvidenceList: document.getElementById('modal-evidence-list'),

      modalBacklog: document.getElementById('modal-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),

      modalGallery: document.getElementById('modal-gallery'),
      backdropGallery: document.getElementById('backdrop-gallery'),
      btnCloseGallery: document.getElementById('btn-close-gallery'),
    };
  }

  // イベントリスナーの登録
  bindEvents() {
    this.bindTitleEvents();
    this.bindExploreEvents();
    this.bindDebateEvents();
    this.bindDialogueEvents();
    this.bindModalEvents();
    this.bindKeyboardShortcuts();
  }

  bindTitleEvents() {
    this.dom.btnStartGame?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.startNewInvestigation();
    });

    this.dom.btnContinueGame?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.resumeSavedSession();
    });

    this.dom.btnOpenGallery?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.openGalleryModal();
    });

    this.dom.btnResetSave?.addEventListener('click', () => {
      this.handleResetSaveData();
    });

    this.dom.btnToggleVoice?.addEventListener('click', () => this.toggleVoice());
    this.dom.btnToggleSe?.addEventListener('click', () => this.toggleSe());
    this.dom.btnToggleBgm?.addEventListener('click', () => this.toggleBgm());

    this.dom.btnHudReturnTitle?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.returnToTitle();
    });
  }

  bindExploreEvents() {
    this.dom.btnAreaDesk?.addEventListener('click', () => this.switchArea('desk'));
    this.dom.btnAreaLiving?.addEventListener('click', () => this.switchArea('living'));

    this.dom.btnGoToDebate?.addEventListener('click', () => this.startDebate());
    this.dom.btnHudGotoDebate?.addEventListener('click', () => this.startDebate());
    this.dom.btnHudBackToExplore?.addEventListener('click', () => this.backToExploration());
  }

  bindDebateEvents() {
    this.dom.btnDebateBack?.addEventListener('click', () => this.backToExploration());

    this.dom.btnPresentEvidence?.addEventListener('click', () => {
      if (this.selectedEvidenceId) {
        this.presentEvidence(this.selectedEvidenceId);
      }
    });

    this.dom.btnReplayDebateVoice?.addEventListener('click', () => {
      this.replayDebateQuestionVoice();
    });

    this.dom.btnEndingNext?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.returnToTitle();
    });

    this.dom.btnEndingExploreAgain?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.backToExploration();
    });

    this.dom.btnEndingGallery?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.openGalleryModal();
    });
  }

  bindDialogueEvents() {
    this.dom.dialogueStage?.addEventListener('click', (e) => {
      if (e.target.closest('.dialogue-ctrls') || e.target.closest('#dialogue-illustration-stage')) {
        return;
      }
      this.advanceDialogue();
    });

    this.dom.btnDialogueAuto?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAutoMode();
    });

    this.dom.btnDialogueSkip?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSkipMode();
    });

    this.dom.btnDialogueLog?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openBacklogModal();
    });

    this.dom.btnCloseIllustration?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.dialogueIllustrationStage?.classList.add('hidden');
    });
  }

  bindModalEvents() {
    this.dom.btnEvidenceBag?.addEventListener('click', () => this.openEvidenceModal());
    this.dom.btnCloseEvidence?.addEventListener('click', () => this.closeEvidenceModal());
    this.dom.backdropEvidence?.addEventListener('click', () => this.closeEvidenceModal());

    this.dom.btnCloseBacklog?.addEventListener('click', () => this.closeBacklogModal());
    this.dom.backdropBacklog?.addEventListener('click', () => this.closeBacklogModal());

    this.dom.btnCloseGallery?.addEventListener('click', () => this.closeGalleryModal());
    this.dom.backdropGallery?.addEventListener('click', () => this.closeGalleryModal());
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        this.handleBackShortcut();
      } else if (e.key === 'e' || e.key === 'E') {
        this.toggleEvidenceModal();
      } else if (e.key === 'l' || e.key === 'L') {
        this.toggleBacklogModal();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!this.dom.dialogueStage?.classList.contains('hidden')) {
          e.preventDefault();
          this.advanceDialogue();
        }
      }
    });
  }

  handleBackShortcut() {
    if (!this.dom.modalEvidence?.classList.contains('hidden')) {
      this.closeEvidenceModal();
    } else if (!this.dom.modalBacklog?.classList.contains('hidden')) {
      this.closeBacklogModal();
    } else if (!this.dom.modalGallery?.classList.contains('hidden')) {
      this.closeGalleryModal();
    } else if (this.currentScreen === 'debate') {
      this.backToExploration();
    }
  }

  // 初期ステートおよびタイトル画面表示のチェック
  checkInitialState() {
    this.updateAudioButtonStates();
    this.updateTitleScreenUI();
    this.audio.playBgm('title');
  }

  updateTitleScreenUI() {
    const isCleared1 = this.state.isClearedFirstLoop();
    const isClearedTrue = this.state.isClearedTrueEnd();

    if (this.dom.titleLoopInfo) {
      if (isClearedTrue) {
        this.dom.titleLoopInfo.innerHTML =
          '<span class="loop-tag true-tag">🏆 TRUE END CLEAR</span> <span class="loop-text">共生プロトコル締結済：全事件解決</span>';
      } else if (isCleared1) {
        this.dom.titleLoopInfo.innerHTML =
          '<span class="loop-tag phase2-tag">⚡ PHASE 2 DEEP TRACE</span> <span class="loop-text">深層解決編解放中：10万台のストームを阻止せよ</span>';
      } else {
        this.dom.titleLoopInfo.innerHTML =
          '<span class="loop-tag phase1-tag">⚡ PHASE 1</span> <span class="loop-text">第一幕：潔白の立証 〜システムプロンプトの罠〜</span>';
      }
    }

    if (this.dom.titleClearBadge) {
      if (isClearedTrue) {
        this.dom.titleClearBadge.classList.remove('hidden');
      } else {
        this.dom.titleClearBadge.classList.add('hidden');
      }
    }

    if (this.dom.btnContinueGame) {
      if (this.state.hasSavedSession()) {
        this.dom.btnContinueGame.classList.remove('hidden');
      } else {
        this.dom.btnContinueGame.classList.add('hidden');
      }
    }
  }

  // 画面の切り替え
  showScreen(screenName) {
    this.currentScreen = screenName;
    const screens = [
      this.dom.screenTitle,
      this.dom.screenExplore,
      this.dom.screenDebate,
      this.dom.screenEnding,
    ];
    screens.forEach((s) => {
      s?.classList.remove('active');
    });

    switch (screenName) {
      case 'title':
        this.dom.screenTitle?.classList.add('active');
        this.dom.hud?.classList.add('hidden');
        this.audio.playBgm('title');
        this.updateTitleScreenUI();
        break;
      case 'explore':
        this.dom.screenExplore?.classList.add('active');
        this.dom.hud?.classList.remove('hidden');
        this.dom.btnHudBackToExplore?.classList.add('hidden');
        this.dom.hudLifeContainer?.classList.add('hidden');
        this.audio.playBgm('investigate');
        this.updateExploreUI();
        break;
      case 'debate':
        this.dom.screenDebate?.classList.add('active');
        this.dom.hud?.classList.remove('hidden');
        this.dom.btnHudBackToExplore?.classList.remove('hidden');
        this.dom.btnHudGotoDebate?.classList.add('hidden');
        this.dom.hudLifeContainer?.classList.remove('hidden');
        this.audio.playBgm('crisis');
        this.updateDebateUI();
        break;
      case 'ending':
        this.dom.screenEnding?.classList.add('active');
        this.dom.hud?.classList.remove('hidden');
        this.dom.btnHudBackToExplore?.classList.add('hidden');
        this.dom.btnHudGotoDebate?.classList.add('hidden');
        this.dom.hudLifeContainer?.classList.add('hidden');
        break;
    }
  }

  // 新規調査スタート
  startNewInvestigation() {
    this.state.resetTransientState();
    this.currentArea = 'desk';
    this.showScreen('explore');
    this.renderExplorePins();
    this.playDialogueSequence(this.scenario.prologue, () => {
      this.state.saveSessionProgress('explore');
    });
  }

  // セッション復元
  resumeSavedSession() {
    const data = this.state.loadSessionProgress();
    if (!data) {
      this.startNewInvestigation();
      return;
    }
    this.currentArea = data.currentArea || 'desk';
    if (data.activePhase === 'debate') {
      this.showScreen('debate');
      this.renderDebateQuestion();
    } else {
      this.showScreen('explore');
      this.renderExplorePins();
    }
  }

  // タイトルへ戻る
  returnToTitle() {
    this.stopDialogueTimers();
    this.dom.dialogueStage?.classList.add('hidden');
    this.showScreen('title');
  }

  // 探索画面に戻る（可逆性の担保）
  backToExploration() {
    this.state.recoverLife();
    this.showScreen('explore');
    this.renderExplorePins();
    this.state.saveSessionProgress('explore');
  }

  // エリア切り替え（自室 ⇔ 玄関）
  switchArea(areaName) {
    this.audio.playSe('click');
    this.currentArea = areaName;
    if (areaName === 'desk') {
      this.dom.btnAreaDesk?.classList.add('active');
      this.dom.btnAreaLiving?.classList.remove('active');
      this.dom.areaDesk?.classList.remove('hidden');
      this.dom.areaLiving?.classList.add('hidden');
      if (this.dom.hudLocationBadge) this.dom.hudLocationBadge.textContent = '自室デスク周り';
    } else {
      this.dom.btnAreaDesk?.classList.remove('active');
      this.dom.btnAreaLiving?.classList.add('active');
      this.dom.areaDesk?.classList.add('hidden');
      this.dom.areaLiving?.classList.remove('hidden');
      if (this.dom.hudLocationBadge) this.dom.hudLocationBadge.textContent = 'リビング・玄関側';
    }
    this.renderExplorePins();
    this.state.saveSessionProgress('explore');
  }

  // 探索ピンの生成（ガイドライン：ユークリッド距離20%以上、同一直線重複ゼロ）
  renderExplorePins() {
    const areaEl = this.currentArea === 'desk' ? this.dom.areaDesk : this.dom.areaLiving;
    if (!areaEl) return;
    areaEl.innerHTML = '';

    const spots = this.scenario.exploreSpots[this.currentArea] || [];
    const currentLoop = this.state.currentLoop;

    spots.forEach((spot) => {
      if (spot.requiredLoop > currentLoop) return;

      const isInspected = this.state.isSpotInspected(spot.id);
      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.className = `explore-pin ${isInspected ? 'inspected' : 'new'}`;
      pinBtn.style.left = `${spot.coords.x}%`;
      pinBtn.style.top = `${spot.coords.y}%`;
      pinBtn.setAttribute('aria-label', spot.name);

      const iconWrap = document.createElement('div');
      iconWrap.className = 'pin-icon-wrap';

      const iconSpan = document.createElement('span');
      iconSpan.className = 'pin-icon';
      iconSpan.textContent = spot.icon;
      iconWrap.appendChild(iconSpan);

      if (!isInspected) {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'pin-status-badge';
        badgeSpan.textContent = 'NEW';
        iconWrap.appendChild(badgeSpan);
      }

      const labelSpan = document.createElement('span');
      labelSpan.className = 'pin-label';
      labelSpan.textContent = spot.name;

      pinBtn.appendChild(iconWrap);
      pinBtn.appendChild(labelSpan);

      pinBtn.addEventListener('click', () => {
        this.handleSpotClick(spot);
      });

      areaEl.appendChild(pinBtn);
    });

    this.updateExploreUI();
  }

  // 探索スポットクリック処理
  handleSpotClick(spot) {
    this.audio.playSe('click');
    this.state.markSpotInspected(spot.id);

    let acquired = false;
    if (spot.evidenceId) {
      acquired = this.state.addEvidence(spot.evidenceId);
      if (acquired) {
        this.audio.playSe('evidence');
      }
    }

    this.renderExplorePins();

    this.playDialogueSequence(spot.dialogue, () => {
      if (acquired) {
        const ev = this.scenario.evidence[spot.evidenceId];
        this.showEvidenceNotification(ev);
      }
      this.updateExploreUI();
      this.state.saveSessionProgress('explore');
    });
  }

  // 証拠獲得通知
  showEvidenceNotification(evidence) {
    if (!evidence) return;
    const notificationSeq = [
      {
        speaker: 'ナレーション',
        text: `【証拠品入手】『${evidence.name}』を電脳鑑識データベースに記録した！`,
        illustration: evidence.image,
        caption: evidence.summary,
      },
    ];
    this.playDialogueSequence(notificationSeq);
  }

  // 探索画面UIと前提条件ガードの更新
  updateExploreUI() {
    const requiredEvidence = this.state.currentLoop === 1 ? 3 : 3;
    const collectedCount = this.state.collectedEvidence.size;

    if (this.dom.evidenceCount) {
      this.dom.evidenceCount.textContent = collectedCount;
    }

    if (this.dom.evidenceNeededCounter) {
      this.dom.evidenceNeededCounter.textContent = `${Math.min(collectedCount, requiredEvidence)} / ${requiredEvidence}`;
    }

    if (this.dom.hudLoopBadge) {
      if (this.state.currentLoop === 2) {
        this.dom.hudLoopBadge.innerHTML =
          '<span class="phase-title">Phase 2</span><span class="phase-desc-text">: 深層真実立証</span>';
      } else {
        this.dom.hudLoopBadge.innerHTML =
          '<span class="phase-title">Phase 1</span><span class="phase-desc-text">: 潔白の立証</span>';
      }
    }

    // 前提条件ガード：証拠が揃うまでボタンを非表示かつ非活性にする
    const hasEnoughEvidence = collectedCount >= requiredEvidence;
    if (hasEnoughEvidence) {
      this.dom.btnGoToDebate?.classList.remove('hidden');
      this.dom.btnGoToDebate?.removeAttribute('disabled');
      this.dom.btnHudGotoDebate?.classList.remove('hidden');
      this.dom.btnHudGotoDebate?.removeAttribute('disabled');
      if (this.dom.exploreStatusText) {
        this.dom.exploreStatusText.textContent =
          '立証に必要な鑑識データが揃った！ 執行官に反証せよ！';
      }
    } else {
      this.dom.btnGoToDebate?.classList.add('hidden');
      this.dom.btnGoToDebate?.setAttribute('disabled', 'true');
      this.dom.btnHudGotoDebate?.classList.add('hidden');
      this.dom.btnHudGotoDebate?.setAttribute('disabled', 'true');
      if (this.dom.exploreStatusText) {
        this.dom.exploreStatusText.textContent =
          '自室や機器を調査し、潔白を示す客観鑑識データを集めよう';
      }
    }
  }

  // 立証パート（論戦）の開始（二重安全ガード）
  startDebate() {
    const requiredEvidence = this.state.currentLoop === 1 ? 3 : 3;
    if (this.state.collectedEvidence.size < requiredEvidence) {
      this.audio.playSe('damage');
      alert(
        '【証拠不足】相手に反証するには、十分な鑑識データが必要です！ 現場を調査してください。',
      );
      return;
    }

    this.audio.playSe('cutin');
    this.state.currentDebateStep = 0;
    this.state.recoverLife();
    this.activeDebateList =
      this.state.currentLoop === 1 ? this.scenario.debate.phase1 : this.scenario.debate.phase2;
    this.showScreen('debate');
    this.renderDebateQuestion();
    this.state.saveSessionProgress('debate');
  }

  // 立証問答の描画
  renderDebateQuestion() {
    const step = this.state.currentDebateStep;
    const debateItem = this.activeDebateList[step];
    if (!debateItem) {
      this.onDebateSuccessAll();
      return;
    }

    const totalSteps = this.activeDebateList.length;
    if (this.dom.debateTurnLabel) {
      this.dom.debateTurnLabel.textContent = `問答 ${step + 1} / ${totalSteps}`;
    }

    this.updateHeartsUI();

    // 相手の立ち絵と主張
    const opponentData = this.characters[debateItem.opponent] || this.characters.kuroda;
    if (this.dom.debateOpponentAvatar) {
      this.dom.debateOpponentAvatar.innerHTML = `<img src="${opponentData.sprite}" alt="${opponentData.name}" class="opponent-portrait-img" />`;
    }

    if (this.dom.debateOpponentSpeech) {
      this.dom.debateOpponentSpeech.textContent = debateItem.speech;
    }

    if (this.dom.debateHintText) {
      this.dom.debateHintText.textContent = debateItem.hint;
    }

    // 主張ボイス発話
    this.audio.speak(debateItem.speech, opponentData);

    // 証拠一覧の描画
    this.renderDebateEvidenceGrid();
    this.selectedEvidenceId = null;
    this.updateSelectedEvidencePreview();
  }

  replayDebateQuestionVoice() {
    const step = this.state.currentDebateStep;
    const debateItem = this.activeDebateList[step];
    if (debateItem) {
      const opponentData = this.characters[debateItem.opponent] || this.characters.kuroda;
      this.audio.speak(debateItem.speech, opponentData);
    }
  }

  updateHeartsUI() {
    if (!this.dom.hudHearts) return;
    let heartsHtml = '';
    for (let i = 0; i < 3; i++) {
      if (i < this.state.life) {
        heartsHtml += '<span class="heart active" title="ライフ残">♥</span>';
      } else {
        heartsHtml += '<span class="heart lost" title="ライフ消失">♡</span>';
      }
    }
    this.dom.hudHearts.innerHTML = heartsHtml;
    this.dom.hudHearts.setAttribute('aria-label', `残りライフ ${this.state.life} / 3`);
  }

  renderDebateEvidenceGrid() {
    if (!this.dom.debateEvidenceList) return;
    this.dom.debateEvidenceList.innerHTML = '';

    const collectedIds = Array.from(this.state.collectedEvidence);
    collectedIds.forEach((id) => {
      const ev = this.scenario.evidence[id];
      if (!ev) return;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'debate-evidence-card';
      card.dataset.evidenceId = id;

      card.innerHTML = `
        <span class="card-icon">${ev.icon}</span>
        <div class="card-text">
          <span class="card-name">${ev.name}</span>
          <span class="card-type">${ev.type}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.selectDebateEvidence(id);
      });

      this.dom.debateEvidenceList.appendChild(card);
    });
  }

  selectDebateEvidence(evidenceId) {
    this.audio.playSe('click');
    this.selectedEvidenceId = evidenceId;

    const cards = this.dom.debateEvidenceList?.querySelectorAll('.debate-evidence-card');
    cards?.forEach((c) => {
      if (c.dataset.evidenceId === evidenceId) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    this.updateSelectedEvidencePreview();
  }

  updateSelectedEvidencePreview() {
    if (!this.dom.selectedEvidencePreview || !this.dom.btnPresentEvidence) return;

    if (!this.selectedEvidenceId) {
      this.dom.selectedEvidencePreview.innerHTML =
        '<span class="placeholder-text">提示する鑑識データを手帳から選択してください</span>';
      this.dom.btnPresentEvidence.setAttribute('disabled', 'true');
      return;
    }

    const ev = this.scenario.evidence[this.selectedEvidenceId];
    if (ev) {
      this.dom.selectedEvidencePreview.innerHTML = `
        <div class="preview-active-wrap">
          <span class="preview-icon">${ev.icon}</span>
          <div class="preview-info">
            <strong class="preview-title">${ev.name}</strong>
            <p class="preview-summary">${ev.summary}</p>
          </div>
        </div>
      `;
      this.dom.btnPresentEvidence.removeAttribute('disabled');
    }
  }

  updateDebateUI() {
    this.renderDebateQuestion();
  }

  // 証拠提示の実行
  presentEvidence(evidenceId = this.selectedEvidenceId) {
    if (!evidenceId) return;
    const step = this.state.currentDebateStep;
    const debateItem = this.activeDebateList[step];
    if (!debateItem) return;

    if (evidenceId === debateItem.correctEvidenceId) {
      this.onDebateCorrect(debateItem);
    } else {
      this.onDebateWrong(debateItem);
    }
  }

  // 正解時の処理
  onDebateCorrect(debateItem) {
    this.triggerCutin('客観的反証があります！', () => {
      this.audio.playSe('correct');
      this.playDialogueSequence(debateItem.successDialogue, () => {
        this.state.currentDebateStep += 1;
        this.state.saveSessionProgress('debate');
        if (this.state.currentDebateStep >= this.activeDebateList.length) {
          this.onDebateSuccessAll();
        } else {
          this.renderDebateQuestion();
        }
      });
    });
  }

  // 不正解時の処理
  onDebateWrong(debateItem) {
    this.audio.playSe('damage');
    const remainingLife = this.state.decreaseLife();
    this.updateHeartsUI();

    this.playDialogueSequence(debateItem.failureDialogue, () => {
      if (remainingLife <= 0) {
        this.onGameOver();
      } else {
        this.renderDebateQuestion();
      }
    });
  }

  // 異議ありカットイン演出（リフロー再トリガー必須）
  triggerCutin(text, callback) {
    this.audio.playSe('cutin');
    if (!this.dom.overlayCutin || !this.dom.cutinText) {
      if (callback) callback();
      return;
    }
    this.dom.cutinText.textContent = text;
    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.remove('active');
    void this.dom.overlayCutin.offsetWidth; // リフロー強制
    this.dom.overlayCutin.classList.add('active');

    setTimeout(() => {
      this.dom.overlayCutin?.classList.remove('active');
      this.dom.overlayCutin?.classList.add('hidden');
      if (callback) callback();
    }, 1100);
  }

  // 全問正解：エピローグ会話劇へ
  onDebateSuccessAll() {
    this.audio.playSe('victory');
    const isLoop1 = this.state.currentLoop === 1;
    const epilogueSeq = isLoop1 ? this.scenario.epilogueLoop1 : this.scenario.epiloguePhase2;

    this.playDialogueSequence(epilogueSeq, () => {
      if (isLoop1) {
        this.state.markLoop1Cleared();
        this.showEnding('normal');
      } else {
        this.state.markTrueEndCleared();
        this.showEnding('trueEnd');
      }
      this.state.clearSessionProgress();
    });
  }

  // ゲームオーバー時の処理
  onGameOver() {
    this.audio.playSe('gameover');
    this.showEnding('gameover');
  }

  // エンディング画面表示
  showEnding(type) {
    const endingData = this.scenario.endings[type] || this.scenario.endings.normal;
    this.showScreen('ending');

    if (type === 'trueEnd') {
      this.audio.playBgm('truth');
    }

    if (this.dom.endingIcon) this.dom.endingIcon.textContent = endingData.icon;
    if (this.dom.endingTitle) this.dom.endingTitle.textContent = endingData.title;
    if (this.dom.endingSub) this.dom.endingSub.textContent = endingData.sub;
    if (this.dom.endingDesc) this.dom.endingDesc.textContent = endingData.desc;

    if (this.dom.endingUnlockedBanner) {
      if (endingData.unlockedBanner) {
        this.dom.endingUnlockedBanner.textContent = endingData.unlockedBanner;
        this.dom.endingUnlockedBanner.classList.remove('hidden');
      } else {
        this.dom.endingUnlockedBanner.classList.add('hidden');
      }
    }

    if (this.dom.btnEndingExploreAgain) {
      if (type === 'gameover') {
        this.dom.btnEndingExploreAgain.classList.remove('hidden');
      } else {
        this.dom.btnEndingExploreAgain.classList.add('hidden');
      }
    }
  }

  // 会話シーケンス再生エンジン
  playDialogueSequence(sequence, onComplete = null) {
    if (!sequence || sequence.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    this.stopDialogueTimers();
    this.dialogueQueue = [...sequence];
    this.currentDialogueIndex = -1;
    this.onDialogueComplete = onComplete;
    this.dom.dialogueStage?.classList.remove('hidden');
    this.advanceDialogue();
  }

  // 会話テキストの進行
  advanceDialogue() {
    if (this.isTyping) {
      // タイピング中のタップ：即座に全文表示
      this.stopTypewriter();
      const currentItem = this.dialogueQueue[this.currentDialogueIndex];
      if (currentItem && this.dom.dialogueText) {
        this.dom.dialogueText.textContent = currentItem.text;
      }
      this.dom.dialoguePrompt?.classList.remove('hidden');
      this.setupAutoAdvance();
      return;
    }

    this.currentDialogueIndex += 1;
    if (this.currentDialogueIndex >= this.dialogueQueue.length) {
      this.finishDialogueSequence();
      return;
    }

    const item = this.dialogueQueue[this.currentDialogueIndex];
    this.renderDialogueItem(item);
  }

  renderDialogueItem(item) {
    this.dom.dialoguePrompt?.classList.add('hidden');
    const char = this.characters[item.speaker] || {
      name: item.speaker,
      color: '#f8fafc',
      sprite: null,
    };

    if (this.dom.dialogueSpeaker) {
      this.dom.dialogueSpeaker.textContent = char.name;
      this.dom.dialogueSpeaker.style.color = char.color || '#00f3ff';
    }

    // 立ち絵表示
    this.updateCharacterSprite(char);

    // イラスト・イメージ図表示
    this.updateIllustration(item);

    // バックログへ追加
    this.backlog.push({ speaker: char.name, text: item.text });

    // 音声読み上げ
    this.audio.speak(item.text, char);

    // タイプライター表示
    this.startTypewriter(item.text);
  }

  updateCharacterSprite(char) {
    if (!this.dom.characterStage || !this.dom.characterSpriteBox) return;
    if (char.sprite) {
      this.dom.characterStage.classList.remove('hidden');
      this.dom.characterSpriteBox.innerHTML = `<img src="${char.sprite}" alt="${char.name}" class="char-sprite-img" />`;
    } else {
      this.dom.characterStage.classList.add('hidden');
      this.dom.characterSpriteBox.innerHTML = '';
    }
  }

  updateIllustration(item) {
    if (!this.dom.dialogueIllustrationStage) return;
    if (item.illustration && this.dom.dialogueIllustrationImg) {
      this.dom.dialogueIllustrationImg.src = item.illustration;
      if (this.dom.dialogueIllustrationCaption) {
        this.dom.dialogueIllustrationCaption.textContent = item.caption || '';
      }
      this.dom.dialogueIllustrationStage.classList.remove('hidden');
    } else {
      this.dom.dialogueIllustrationStage.classList.add('hidden');
    }
  }

  startTypewriter(text) {
    this.isTyping = true;
    if (!this.dom.dialogueText) return;
    this.dom.dialogueText.textContent = '';
    let index = 0;
    const speed = this.isSkipActive ? 6 : 24;

    this.typewriterTimer = setInterval(() => {
      index += 1;
      this.dom.dialogueText.textContent = text.slice(0, index);
      if (index >= text.length) {
        this.stopTypewriter();
        this.dom.dialoguePrompt?.classList.remove('hidden');
        this.setupAutoAdvance();
      }
    }, speed);
  }

  stopTypewriter() {
    this.isTyping = false;
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  setupAutoAdvance() {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    if (!this.isAutoActive && !this.isSkipActive) return;

    const delay = this.isSkipActive ? 120 : 2000;
    this.autoTimer = setTimeout(() => {
      this.advanceDialogue();
    }, delay);
  }

  stopDialogueTimers() {
    this.stopTypewriter();
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  finishDialogueSequence() {
    this.stopDialogueTimers();
    this.dom.dialogueStage?.classList.add('hidden');
    if (this.onDialogueComplete) {
      const cb = this.onDialogueComplete;
      this.onDialogueComplete = null;
      cb();
    }
  }

  toggleAutoMode() {
    this.isAutoActive = !this.isAutoActive;
    if (this.dom.btnDialogueAuto) {
      if (this.isAutoActive) {
        this.dom.btnDialogueAuto.classList.add('active');
        this.isSkipActive = false;
        this.dom.btnDialogueSkip?.classList.remove('active');
        if (!this.isTyping) this.setupAutoAdvance();
      } else {
        this.dom.btnDialogueAuto.classList.remove('active');
        if (this.autoTimer) clearTimeout(this.autoTimer);
      }
    }
  }

  toggleSkipMode() {
    this.isSkipActive = !this.isSkipActive;
    if (this.dom.btnDialogueSkip) {
      if (this.isSkipActive) {
        this.dom.btnDialogueSkip.classList.add('active');
        this.isAutoActive = false;
        this.dom.btnDialogueAuto?.classList.remove('active');
        if (this.isTyping) {
          this.stopTypewriter();
          this.advanceDialogue();
        } else {
          this.advanceDialogue();
        }
      } else {
        this.dom.btnDialogueSkip.classList.remove('active');
        if (this.autoTimer) clearTimeout(this.autoTimer);
      }
    }
  }

  // 証拠手帳モーダル
  openEvidenceModal() {
    this.audio.playSe('click');
    if (!this.dom.modalEvidence || !this.dom.modalEvidenceList) return;
    this.dom.modalEvidenceList.innerHTML = '';

    const collected = Array.from(this.state.collectedEvidence);
    if (collected.length === 0) {
      this.dom.modalEvidenceList.innerHTML =
        '<div class="empty-hint">現在収集した証拠はありません。部屋を調査してください。</div>';
    } else {
      collected.forEach((id) => {
        const ev = this.scenario.evidence[id];
        if (!ev) return;
        const itemEl = document.createElement('div');
        itemEl.className = 'evidence-modal-card';
        itemEl.innerHTML = `
          <div class="card-left">
            <span class="card-modal-icon">${ev.icon}</span>
            <span class="card-modal-type">${ev.type}</span>
          </div>
          <div class="card-right">
            <strong class="card-modal-title">${ev.name}</strong>
            <p class="card-modal-desc">${ev.detail}</p>
          </div>
        `;
        this.dom.modalEvidenceList.appendChild(itemEl);
      });
    }

    this.dom.modalEvidence.classList.remove('hidden');
  }

  closeEvidenceModal() {
    this.dom.modalEvidence?.classList.add('hidden');
  }

  toggleEvidenceModal() {
    if (this.dom.modalEvidence?.classList.contains('hidden')) {
      this.openEvidenceModal();
    } else {
      this.closeEvidenceModal();
    }
  }

  // バックログモーダル
  openBacklogModal() {
    this.audio.playSe('click');
    if (!this.dom.modalBacklog || !this.dom.modalBacklogList) return;
    this.dom.modalBacklogList.innerHTML = '';

    this.backlog.forEach((log) => {
      const row = document.createElement('div');
      row.className = 'backlog-item';
      row.innerHTML = `
        <span class="backlog-speaker">${log.speaker}:</span>
        <span class="backlog-text">${log.text}</span>
      `;
      this.dom.modalBacklogList.appendChild(row);
    });

    this.dom.modalBacklog.classList.remove('hidden');
    this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
  }

  closeBacklogModal() {
    this.dom.modalBacklog?.classList.add('hidden');
  }

  toggleBacklogModal() {
    if (this.dom.modalBacklog?.classList.contains('hidden')) {
      this.openBacklogModal();
    } else {
      this.closeBacklogModal();
    }
  }

  // 機密設定資料集モーダル
  openGalleryModal() {
    this.audio.playSe('click');
    this.dom.modalGallery?.classList.remove('hidden');
  }

  closeGalleryModal() {
    this.dom.modalGallery?.classList.add('hidden');
  }

  // オーディオ設定トグル
  toggleVoice() {
    this.state.voiceEnabled = !this.state.voiceEnabled;
    this.audio.voiceEnabled = this.state.voiceEnabled;
    this.state.savePersistentState();
    this.updateAudioButtonStates();
    if (!this.state.voiceEnabled) this.audio.stopVoice();
  }

  toggleSe() {
    this.state.seEnabled = !this.state.seEnabled;
    this.audio.seEnabled = this.state.seEnabled;
    this.state.savePersistentState();
    this.updateAudioButtonStates();
    if (this.state.seEnabled) this.audio.playSe('click');
  }

  toggleBgm() {
    this.state.bgmEnabled = !this.state.bgmEnabled;
    this.audio.bgmEnabled = this.state.bgmEnabled;
    this.state.savePersistentState();
    this.updateAudioButtonStates();
    if (this.state.bgmEnabled) {
      this.audio.playBgm(this.currentScreen === 'debate' ? 'crisis' : 'title');
    } else {
      this.audio.stopBgm();
    }
  }

  updateAudioButtonStates() {
    if (this.dom.btnToggleVoice) {
      this.dom.btnToggleVoice.className = `hud-btn hud-audio-btn ${this.state.voiceEnabled ? 'active' : ''}`;
      this.dom.btnToggleVoice.innerHTML = `🔊 音声: ${this.state.voiceEnabled ? 'ON' : 'OFF'}`;
    }
    if (this.dom.btnToggleSe) {
      this.dom.btnToggleSe.className = `hud-btn hud-audio-btn ${this.state.seEnabled ? 'active' : ''}`;
      this.dom.btnToggleSe.innerHTML = `⚡ SE: ${this.state.seEnabled ? 'ON' : 'OFF'}`;
    }
    if (this.dom.btnToggleBgm) {
      this.dom.btnToggleBgm.className = `hud-btn hud-audio-btn ${this.state.bgmEnabled ? 'active' : ''}`;
      this.dom.btnToggleBgm.innerHTML = `🎵 BGM: ${this.state.bgmEnabled ? 'ON' : 'OFF'}`;
    }
  }

  handleResetSaveData() {
    if (confirm('【確認】セーブデータを完全に初期化しますか？')) {
      this.audio.playSe('damage');
      this.state.resetAllData();
      this.updateTitleScreenUI();
      alert('セーブデータを初期化しました。');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GameApp();
});
