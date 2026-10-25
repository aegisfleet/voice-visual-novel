// app.js - 体験型長編電脳サスペンスノベル ゲームループ・UI制御コントローラー (GHOST PROTOCOL)

const CHAPTER_SHORT_TITLES = {
  1: '第1章: 口座焼却',
  2: '第2章: 亡霊接続',
  3: '第3章: 逆流RDP',
  4: '第4章: 直接補償',
  5: '第5章: 発動第1号',
};

class GameApp {
  constructor() {
    this.state = window.gameState;
    this.audio = window.audioManager;
    this.scenario = window.SCENARIO_DATA;
    this.characters = window.CHARACTER_DATA;

    this.currentScreen = 'title';
    this.currentArea = 'desk';
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
    this.lastActiveNpcChar = null;
    this.currentNovelTab = 'all';

    this.initDomElements();
    this.bindEvents();
    this.checkInitialState();
  }

  initDomElements() {
    this.dom = {
      hud: document.getElementById('hud'),
      hudLocationBadge: document.getElementById('hud-location-badge'),
      hudLoopBadge: document.getElementById('hud-loop-badge'),
      hudLifeContainer: document.getElementById('hud-life-container'),
      hudHearts: document.getElementById('hud-hearts'),
      btnHudGotoDebate: document.getElementById('btn-hud-goto-debate'),
      btnHudBackToExplore: document.getElementById('btn-hud-back-to-explore'),
      btnHudNovel: document.getElementById('btn-hud-novel'),
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
      btnOpenNovel: document.getElementById('btn-open-novel'),
      btnOpenGallery: document.getElementById('btn-open-gallery'),
      btnResetSave: document.getElementById('btn-reset-save'),

      chapterTimelineBar: document.getElementById('chapter-timeline-bar'),
      btnReplayChapterStory: document.getElementById('btn-replay-chapter-story'),
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
      debateSpeakerLabel: document.querySelector('.speech-speaker-label'),
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
      btnEndingNovel: document.getElementById('btn-ending-novel'),
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

      modalNovel: document.getElementById('modal-novel'),
      backdropNovel: document.getElementById('backdrop-novel'),
      btnCloseNovel: document.getElementById('btn-close-novel'),
      novelChapterTabs: document.getElementById('novel-chapter-tabs'),
      modalNovelBody: document.getElementById('modal-novel-body'),

      modalBacklog: document.getElementById('modal-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),

      modalGallery: document.getElementById('modal-gallery'),
      backdropGallery: document.getElementById('backdrop-gallery'),
      btnCloseGallery: document.getElementById('btn-close-gallery'),
    };

    if (this.dom.voiceWaveIndicator && !this.dom.voiceWaveIndicator.hasChildNodes()) {
      this.dom.voiceWaveIndicator.innerHTML =
        '<span class="voice-wave-bar"></span><span class="voice-wave-bar"></span><span class="voice-wave-bar"></span>';
    }
  }

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

    this.dom.btnOpenNovel?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.openNovelModal('all');
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
    this.dom.btnReplayChapterStory?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.playChapterIntro(this.state.currentChapter);
    });

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

    this.dom.btnEndingNovel?.addEventListener('click', () => {
      this.audio.playSe('click');
      this.openNovelModal('all');
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

    this.dom.btnHudNovel?.addEventListener('click', () => this.openNovelModal('all'));
    this.dom.btnCloseNovel?.addEventListener('click', () => this.closeNovelModal());
    this.dom.backdropNovel?.addEventListener('click', () => this.closeNovelModal());

    this.dom.btnCloseBacklog?.addEventListener('click', () => this.closeBacklogModal());
    this.dom.backdropBacklog?.addEventListener('click', () => this.closeBacklogModal());

    this.dom.btnCloseGallery?.addEventListener('click', () => this.closeGalleryModal());
    this.dom.backdropGallery?.addEventListener('click', () => this.closeGalleryModal());
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (this.handleModalShortcuts(e.key)) return;
    if (this.handleDialogueShortcuts(e)) return;
    if (this.handleAreaShortcuts(e)) return;
    this.handleDebateShortcuts(e);
  }

  handleModalShortcuts(key) {
    const lower = key.toLowerCase();
    if (lower === 'escape' || lower === 'b') {
      this.handleBackShortcut();
      return true;
    }
    const actions = {
      e: () => this.toggleEvidenceModal(),
      n: () => this.toggleNovelModal(),
      l: () => this.toggleBacklogModal(),
    };
    if (actions[lower]) {
      actions[lower]();
      return true;
    }
    return false;
  }

  handleDialogueShortcuts(e) {
    if (
      (e.key === ' ' || e.key === 'Enter') &&
      !this.dom.dialogueStage?.classList.contains('hidden')
    ) {
      e.preventDefault();
      this.advanceDialogue();
      return true;
    }
    return false;
  }

  isModalOrDialogueOpen() {
    return Boolean(
      !this.dom.dialogueStage?.classList.contains('hidden') ||
        !this.dom.modalEvidence?.classList.contains('hidden') ||
        !this.dom.modalNovel?.classList.contains('hidden') ||
        !this.dom.modalBacklog?.classList.contains('hidden') ||
        !this.dom.modalGallery?.classList.contains('hidden'),
    );
  }

  handleAreaShortcuts(e) {
    if (this.isModalOrDialogueOpen() || this.currentScreen !== 'explore') return false;
    if (e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextArea = this.currentArea === 'desk' ? 'living' : 'desk';
      this.switchArea(nextArea);
      return true;
    }
    return false;
  }

  handleDebateShortcuts(e) {
    if (this.isModalOrDialogueOpen() || this.currentScreen !== 'debate') return;
    if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
      e.preventDefault();
      const index = Number.parseInt(e.key, 10) - 1;
      this.selectEvidenceByIndex(index);
    }
  }

  selectEvidenceByIndex(index) {
    const list = Array.from(this.state.collectedEvidence);
    if (index >= 0 && index < list.length) {
      this.selectDebateEvidence(list[index]);
    }
  }

  isElementOpen(el) {
    return Boolean(el && !el.classList.contains('hidden'));
  }

  handleBackShortcut() {
    const modalClosers = [
      [this.dom.modalNovel, () => this.closeNovelModal()],
      [this.dom.modalEvidence, () => this.closeEvidenceModal()],
      [this.dom.modalBacklog, () => this.closeBacklogModal()],
      [this.dom.modalGallery, () => this.closeGalleryModal()],
    ];
    for (const [modalEl, closeFn] of modalClosers) {
      if (this.isElementOpen(modalEl)) {
        closeFn();
        return;
      }
    }
    if (this.currentScreen === 'debate') {
      this.backToExploration();
    }
  }

  checkInitialState() {
    this.updateAudioButtonStates();
    this.updateTitleScreenUI();
    this.audio.playBgm('title');
  }

  updateTitleScreenUI() {
    const isCleared = this.state.isGameCleared();

    if (this.dom.titleLoopInfo) {
      this.dom.titleLoopInfo.innerHTML = isCleared
        ? '<span class="loop-tag true-tag">🏆 ALL 5 CHAPTERS CLEARED</span> <span class="loop-text">能動的サイバー防御「公表なき発動第1号」達成</span>'
        : '<span class="loop-tag phase1-tag">⚡ 全5章・長編体験型ノベル</span> <span class="loop-text">26,739台のVPS停止・Reverse RDP・直接補償・発動第1号の真相</span>';
    }

    if (this.dom.titleClearBadge) {
      this.dom.titleClearBadge.classList.toggle('hidden', !isCleared);
    }

    if (this.dom.btnContinueGame) {
      this.dom.btnContinueGame.classList.toggle('hidden', !this.state.hasSavedSession());
    }
  }

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

    this.applyScreenTransition(screenName);
  }

  applyScreenTransition(screenName) {
    if (screenName === 'title') {
      this.dom.screenTitle?.classList.add('active');
      this.dom.hud?.classList.add('hidden');
      this.audio.playBgm('title');
      this.updateTitleScreenUI();
      return;
    }

    this.dom.hud?.classList.remove('hidden');
    if (screenName === 'explore') {
      this.dom.screenExplore?.classList.add('active');
      this.dom.btnHudBackToExplore?.classList.add('hidden');
      this.dom.hudLifeContainer?.classList.add('hidden');
      this.audio.playBgm('investigate');
      this.updateExploreUI();
    } else if (screenName === 'debate') {
      this.dom.screenDebate?.classList.add('active');
      this.dom.btnHudBackToExplore?.classList.remove('hidden');
      this.dom.btnHudGotoDebate?.classList.add('hidden');
      this.dom.hudLifeContainer?.classList.remove('hidden');
      this.audio.playBgm('crisis');
      this.updateDebateUI();
    } else if (screenName === 'ending') {
      this.dom.screenEnding?.classList.add('active');
      this.dom.btnHudBackToExplore?.classList.add('hidden');
      this.dom.btnHudGotoDebate?.classList.add('hidden');
      this.dom.hudLifeContainer?.classList.add('hidden');
    }
  }

  getChapterData(chapterNum) {
    const chapters = this.scenario.chapters || [];
    return chapters.find((c) => c.id === chapterNum) || chapters[0] || null;
  }

  getPreferredAreaForChapter(chapterNum) {
    const livingSpots = this.scenario.exploreSpots.living || [];
    const hasUninspectedInLiving = livingSpots.some(
      (s) => s.chapter === chapterNum && !this.state.isSpotInspected(s.id),
    );
    if (hasUninspectedInLiving) return 'living';

    const deskSpots = this.scenario.exploreSpots.desk || [];
    const hasUninspectedInDesk = deskSpots.some(
      (s) => s.chapter === chapterNum && !this.state.isSpotInspected(s.id),
    );
    if (hasUninspectedInDesk) return 'desk';

    return chapterNum === 2 || chapterNum === 4 ? 'living' : 'desk';
  }

  startNewInvestigation() {
    this.state.resetTransientState();
    this.state.currentChapter = 1;
    this.currentArea = 'desk';
    this.showScreen('explore');
    this.switchArea('desk');

    const ch1 = this.getChapterData(1);
    const introSeq = [...(this.scenario.prologue || []), ...(ch1?.introDialogue || [])];
    this.playDialogueSequence(introSeq, () => {
      this.state.saveSessionProgress('explore');
    });
  }

  playChapterIntro(chapterNum, onDone = null) {
    const ch = this.getChapterData(chapterNum);
    if (!ch || !ch.introDialogue) {
      if (onDone) onDone();
      return;
    }
    this.playDialogueSequence(ch.introDialogue, () => {
      this.state.saveSessionProgress('explore');
      if (onDone) onDone();
    });
  }

  selectChapter(chapterNum, playIntro = false) {
    this.state.currentChapter = chapterNum;
    this.state.unlockChapter(chapterNum);
    const targetArea = this.getPreferredAreaForChapter(chapterNum);
    this.switchArea(targetArea);
    this.updateExploreUI();
    if (playIntro) {
      this.playChapterIntro(chapterNum);
    }
  }

  resumeSavedSession() {
    const data = this.state.loadSessionProgress();
    if (!data) {
      this.startNewInvestigation();
      return;
    }
    this.currentArea = data.currentArea || this.getPreferredAreaForChapter(this.state.currentChapter);
    if (data.activePhase === 'debate') {
      this.prepareDebateListForCurrentState();
      this.showScreen('debate');
      this.renderDebateQuestion();
    } else {
      this.showScreen('explore');
      this.switchArea(this.currentArea);
    }
  }

  returnToTitle() {
    this.stopDialogueTimers();
    this.audio.stopVoice();
    this.lastActiveNpcChar = null;
    if (this.dom.characterSpriteBox) {
      this.dom.characterSpriteBox.innerHTML = '';
    }
    if (this.dom.voiceWaveIndicator) {
      this.dom.voiceWaveIndicator.classList.add('hidden');
    }
    this.dom.dialogueStage?.classList.add('hidden');
    this.showScreen('title');
  }

  backToExploration() {
    this.state.recoverLife();
    this.showScreen('explore');
    this.renderExplorePins();
    this.state.saveSessionProgress('explore');
  }

  switchArea(areaName) {
    this.audio.playSe('click');
    this.currentArea = areaName;
    const isDesk = areaName === 'desk';
    this.dom.btnAreaDesk?.classList.toggle('active', isDesk);
    this.dom.btnAreaLiving?.classList.toggle('active', !isDesk);
    this.dom.areaDesk?.classList.toggle('hidden', !isDesk);
    this.dom.areaLiving?.classList.toggle('hidden', isDesk);

    if (this.dom.hudLocationBadge) {
      this.dom.hudLocationBadge.textContent = isDesk
        ? 'アリアの鑑識端末 (Secure VM)'
        : '対策室＆NCO緊急聴聞モニター';
    }
    this.renderExplorePins();
    this.state.saveSessionProgress('explore');
  }

  renderChapterTimeline() {
    if (!this.dom.chapterTimelineBar) return;
    this.dom.chapterTimelineBar.innerHTML = '';
    const currentCh = this.state.currentChapter;

    for (let ch = 1; ch <= 5; ch++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isCleared = this.state.isChapterCleared(ch);
      const isActive = ch === currentCh;
      btn.className = this.getChapterPillClass(isActive, isCleared);
      const prefix = isCleared ? '✓ ' : '';
      btn.textContent = `${prefix}${CHAPTER_SHORT_TITLES[ch]}`;
      btn.addEventListener('click', () => {
        this.audio.playSe('click');
        this.selectChapter(ch, true);
      });
      this.dom.chapterTimelineBar.appendChild(btn);
    }
  }

  getChapterPillClass(isActive, isCleared) {
    const classes = ['chapter-pill', 'is-unlocked'];
    if (isCleared) classes.push('is-cleared');
    if (isActive) classes.push('is-active');
    return classes.join(' ');
  }

  renderExplorePins() {
    const areaEl = this.currentArea === 'desk' ? this.dom.areaDesk : this.dom.areaLiving;
    if (!areaEl) return;
    areaEl.innerHTML = '';

    const spots = this.scenario.exploreSpots[this.currentArea] || [];
    spots.forEach((spot) => {
      const pinBtn = this.createExplorePinElement(spot);
      areaEl.appendChild(pinBtn);
    });

    this.updateExploreUI();
  }

  getExplorePinClasses(isInspected, isChapterTarget) {
    const base = isInspected ? 'explore-pin inspected' : 'explore-pin new';
    return isChapterTarget ? `${base} is-chapter-target` : base;
  }

  appendPinBadgeIfNeeded(iconWrap, spot, isInspected, isChapterTarget) {
    if (isInspected) return;
    const badgeSpan = document.createElement('span');
    badgeSpan.className = isChapterTarget ? 'pin-status-badge target-badge' : 'pin-status-badge';
    badgeSpan.textContent = isChapterTarget ? `第${spot.chapter}章` : 'NEW';
    iconWrap.appendChild(badgeSpan);
  }

  createExplorePinElement(spot) {
    const isInspected = this.state.isSpotInspected(spot.id);
    const isChapterTarget = spot.chapter === this.state.currentChapter && !isInspected;

    const pinBtn = document.createElement('button');
    pinBtn.type = 'button';
    pinBtn.className = this.getExplorePinClasses(isInspected, isChapterTarget);
    pinBtn.style.left = `${spot.coords.x}%`;
    pinBtn.style.top = `${spot.coords.y}%`;
    pinBtn.setAttribute('aria-label', spot.name);

    const iconWrap = document.createElement('div');
    iconWrap.className = 'pin-icon-wrap';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'pin-icon';
    iconSpan.textContent = spot.icon;
    iconWrap.appendChild(iconSpan);
    this.appendPinBadgeIfNeeded(iconWrap, spot, isInspected, isChapterTarget);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'pin-label';
    labelSpan.textContent = spot.name;

    pinBtn.appendChild(iconWrap);
    pinBtn.appendChild(labelSpan);
    pinBtn.addEventListener('click', () => this.handleSpotClick(spot));
    return pinBtn;
  }

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

  showEvidenceNotification(evidence) {
    if (!evidence) return;
    const notificationSeq = [
      {
        speaker: 'narrator',
        text: `【鑑識ファイル入手】『${evidence.name}』をデータベースに記録した！\n${evidence.easyExplain || ''}`,
        illustration: evidence.image,
        caption: evidence.summary,
      },
    ];
    this.playDialogueSequence(notificationSeq);
  }

  renderSingleAreaTabBadge(btn, titleText, spots) {
    if (!btn) return;
    const remaining = spots.filter((s) => !this.state.isSpotInspected(s.id)).length;
    const badgeClass = remaining === 0 ? 'is-complete' : 'has-remaining';
    const badgeText = remaining === 0 ? '✓ 完了' : `残り ${remaining}`;
    btn.innerHTML = `${titleText} <span class="area-tab-badge ${badgeClass}">${badgeText}</span>`;
  }

  updateAreaBadges() {
    this.renderSingleAreaTabBadge(
      this.dom.btnAreaDesk,
      '🛡️ アリアの鑑識端末 (VM)',
      this.scenario.exploreSpots.desk || [],
    );
    this.renderSingleAreaTabBadge(
      this.dom.btnAreaLiving,
      '📡 対策室＆NCO聴聞モニター',
      this.scenario.exploreSpots.living || [],
    );
  }

  updateExploreUI() {
    const collectedCount = this.state.collectedEvidence.size;
    const currentCh = this.state.currentChapter;
    const canEnter = this.state.canEnterDebate();

    if (this.dom.evidenceCount) {
      this.dom.evidenceCount.textContent = collectedCount;
    }

    if (this.dom.evidenceNeededCounter) {
      this.dom.evidenceNeededCounter.textContent = `第${currentCh}章 / 全5章 (鑑識: ${collectedCount} / 6)`;
    }

    if (this.dom.hudLoopBadge) {
      const shortTitle = CHAPTER_SHORT_TITLES[currentCh] || `CHAPTER ${currentCh}`;
      this.dom.hudLoopBadge.innerHTML = `<span class="phase-title">${shortTitle}</span><span class="phase-desc-text"> (鑑識 ${collectedCount}/6)</span>`;
    }

    this.renderChapterTimeline();
    this.updateAreaBadges();
    this.updateExploreDebateButtons(canEnter, currentCh);
  }

  updateExploreDebateButtons(canEnter, currentCh) {
    if (canEnter) {
      this.dom.btnGoToDebate?.classList.remove('hidden');
      this.dom.btnGoToDebate?.removeAttribute('disabled');
      this.dom.btnHudGotoDebate?.classList.remove('hidden');
      this.dom.btnHudGotoDebate?.removeAttribute('disabled');
      this.updateReadyStatusText(currentCh);
    } else {
      this.dom.btnGoToDebate?.classList.add('hidden');
      this.dom.btnGoToDebate?.setAttribute('disabled', 'true');
      this.dom.btnHudGotoDebate?.classList.add('hidden');
      this.dom.btnHudGotoDebate?.setAttribute('disabled', 'true');
      this.updatePendingStatusText(currentCh);
    }
  }

  updateReadyStatusText(currentCh) {
    if (!this.dom.exploreStatusText) return;
    this.dom.exploreStatusText.textContent =
      currentCh < 5
        ? `【第${currentCh}章の鑑識完了】下のボタンから第${currentCh}章の謎を解明し、次の章の物語へ進もう！`
        : '【全鑑識データ収集完了】最終NCO聴聞へ進み、能動的サイバー防御「3つの壁」を突破せよ！';
  }

  updatePendingStatusText(currentCh) {
    if (!this.dom.exploreStatusText) return;
    const targetAreaLabel =
      currentCh === 2 || currentCh === 4 ? '対策室＆NCO聴聞モニター' : 'アリアの鑑識端末 (VM)';
    this.dom.exploreStatusText.textContent = `【第${currentCh}章】『${targetAreaLabel}』にある第${currentCh}章のスポットを調査して鑑識ファイルを入手しよう`;
  }

  prepareDebateListForCurrentState() {
    const allDebates = this.scenario.debates || [];
    const currentCh = this.state.currentChapter;

    if (this.state.hasAllCriticalEvidence() && this.state.clearedChapters.size === 0) {
      this.activeDebateList = allDebates;
      return;
    }

    const chapterDebates = allDebates.filter((d) => d.chapter === currentCh);
    this.activeDebateList = chapterDebates.length > 0 ? chapterDebates : allDebates;
  }

  startDebate() {
    if (!this.state.canEnterDebate()) {
      this.audio.playSe('damage');
      alert(
        `【鑑識データ不足】第${this.state.currentChapter}章の真相解明に進むには、この章の鑑識スポットを調査してください！`,
      );
      return;
    }

    this.stopDialogueTimers();
    this.dom.dialogueStage?.classList.add('hidden');
    this.audio.playSe('cutin');
    this.prepareDebateListForCurrentState();
    this.state.currentDebateStep = 0;
    this.state.recoverLife();
    this.showScreen('debate');
    this.renderDebateQuestion();
    this.state.saveSessionProgress('debate');
  }

  renderOpponentHeader(opponentData) {
    if (this.dom.debateOpponentAvatar) {
      this.dom.debateOpponentAvatar.innerHTML = `<img src="${opponentData.sprite}" alt="${opponentData.name}" class="opponent-portrait-img" />`;
    }
    if (this.dom.debateSpeakerLabel) {
      this.dom.debateSpeakerLabel.textContent = opponentData.name;
      this.dom.debateSpeakerLabel.style.color = opponentData.color || '#f97316';
    }
  }

  renderDebateOpponentBox(debateItem) {
    const opponentData = this.characters[debateItem.opponent] || this.characters.kuroda;
    this.renderOpponentHeader(opponentData);
    const speechText = debateItem.speech || debateItem.opponentSpeech || '';
    if (this.dom.debateOpponentSpeech) {
      this.dom.debateOpponentSpeech.textContent = speechText;
    }
    if (this.dom.debateHintText) {
      this.dom.debateHintText.textContent = debateItem.hint;
    }
    this.audio.speak(speechText, opponentData);
  }

  renderDebateQuestion() {
    const step = this.state.currentDebateStep;
    const debateItem = this.activeDebateList[step];
    if (!debateItem) {
      this.handleDebateSequenceCompleted();
      return;
    }

    const totalSteps = this.activeDebateList.length;
    if (this.dom.debateTurnLabel) {
      this.dom.debateTurnLabel.textContent =
        debateItem.turnLabel || `問答 ${step + 1} / ${totalSteps}`;
    }

    this.updateHeartsUI();
    this.renderDebateOpponentBox(debateItem);
    this.renderDebateEvidenceGrid();
    this.selectedEvidenceId = null;
    this.updateSelectedEvidencePreview();
  }

  replayDebateQuestionVoice() {
    const step = this.state.currentDebateStep;
    const debateItem = this.activeDebateList[step];
    if (debateItem) {
      const opponentData = this.characters[debateItem.opponent] || this.characters.kuroda;
      const speechText = debateItem.speech || debateItem.opponentSpeech || '';
      this.audio.speak(speechText, opponentData);
    }
  }

  updateHeartsUI() {
    if (!this.dom.hudHearts) return;
    let heartsHtml = '';
    for (let i = 0; i < 3; i++) {
      heartsHtml +=
        i < this.state.life
          ? '<span class="heart active" title="ライフ残">♥</span>'
          : '<span class="heart lost" title="ライフ消失">♡</span>';
    }
    this.dom.hudHearts.innerHTML = heartsHtml;
    this.dom.hudHearts.setAttribute('aria-label', `残りライフ ${this.state.life} / 3`);
  }

  renderDebateEvidenceGrid() {
    if (!this.dom.debateEvidenceList) return;
    this.dom.debateEvidenceList.innerHTML = '';

    const collectedIds = Array.from(this.state.collectedEvidence);
    collectedIds.forEach((id, idx) => {
      const ev = this.scenario.evidence[id];
      if (!ev) return;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'debate-evidence-card';
      card.dataset.evidenceId = id;

      card.innerHTML = `
        <span class="card-num-badge" title="キーボード[${idx + 1}]で選択">${idx + 1}</span>
        <span class="card-icon">${ev.icon}</span>
        <div class="card-text">
          <span class="card-name">${ev.name}</span>
          ${ev.easyExplain ? `<span class="card-easy-explain">${ev.easyExplain}</span>` : ''}
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
      c.classList.toggle('selected', c.dataset.evidenceId === evidenceId);
    });

    this.updateSelectedEvidencePreview();
  }

  updateSelectedEvidencePreview() {
    if (!this.dom.selectedEvidencePreview || !this.dom.btnPresentEvidence) return;

    if (!this.selectedEvidenceId) {
      this.dom.selectedEvidencePreview.innerHTML =
        '<span class="placeholder-text">提示する鑑識ファイルを一覧から選択してください</span>';
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
            ${ev.easyExplain ? `<span class="preview-easy-explain">${ev.easyExplain}</span>` : ''}
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

  onDebateCorrect(debateItem) {
    const cutinText = debateItem.correctCutin || '客観的反証があります！';
    this.triggerCutin(cutinText, () => {
      this.audio.playSe('correct');
      const successSeq = debateItem.correctDialogue || debateItem.successDialogue || [];
      this.playDialogueSequence(successSeq, () => {
        this.state.currentDebateStep += 1;
        this.state.saveSessionProgress('debate');
        if (this.state.currentDebateStep >= this.activeDebateList.length) {
          this.handleDebateSequenceCompleted(debateItem);
        } else {
          this.renderDebateQuestion();
        }
      });
    });
  }

  handleDebateSequenceCompleted(lastDebateItem = null) {
    const solvedChapter = lastDebateItem?.chapter || this.state.currentChapter;
    this.state.markChapterCleared(solvedChapter);

    const isFinalHearingDone = solvedChapter >= 5 || lastDebateItem?.step === 5;
    if (isFinalHearingDone) {
      this.onDebateSuccessAll();
      return;
    }

    const nextChapter = solvedChapter + 1;
    this.state.currentChapter = nextChapter;
    const nextArea = this.getPreferredAreaForChapter(nextChapter);
    this.showScreen('explore');
    this.switchArea(nextArea);
    this.playChapterIntro(nextChapter);
  }

  onDebateWrong(debateItem) {
    this.audio.playSe('damage');
    const remainingLife = this.state.decreaseLife();
    this.updateHeartsUI();

    const failureSeq = this.buildWrongFeedbackSequence(debateItem);
    this.playDialogueSequence(failureSeq, () => {
      if (remainingLife <= 0) {
        this.onGameOver();
      } else {
        this.renderDebateQuestion();
      }
    });
  }

  buildWrongFeedbackSequence(debateItem) {
    const seq = [];
    if (debateItem.wrongFeedback) {
      if (debateItem.wrongFeedback.speaker && debateItem.wrongFeedback.text) {
        seq.push({
          speaker: debateItem.wrongFeedback.speaker,
          text: debateItem.wrongFeedback.text,
        });
      }
      if (debateItem.wrongFeedback.hintDialogue) {
        seq.push({
          speaker: debateItem.wrongFeedback.hintDialogue.speaker,
          text: debateItem.wrongFeedback.hintDialogue.text,
        });
      }
    } else if (debateItem.failureDialogue) {
      seq.push(...debateItem.failureDialogue);
    }
    return seq;
  }

  triggerCutin(text, callback) {
    this.audio.playSe('cutin');
    if (!this.dom.overlayCutin || !this.dom.cutinText) {
      if (callback) callback();
      return;
    }
    this.dom.cutinText.textContent = text;
    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.remove('active');
    void this.dom.overlayCutin.offsetWidth;
    this.dom.overlayCutin.classList.add('active');

    setTimeout(() => {
      this.dom.overlayCutin?.classList.remove('active');
      this.dom.overlayCutin?.classList.add('hidden');
      if (callback) callback();
    }, 1100);
  }

  onDebateSuccessAll() {
    this.audio.playSe('victory');
    this.state.markTrueEndCleared();
    const epilogueSeq = this.scenario.epilogue || this.scenario.dialogues?.epilogue || [];

    this.playDialogueSequence(epilogueSeq, () => {
      this.showEnding('trueEnd');
      this.state.clearSessionProgress();
    });
  }

  onGameOver() {
    this.audio.playSe('gameover');
    this.showEnding('gameover');
  }

  showEnding(type) {
    const endingData = this.scenario.endings[type] || this.scenario.endings.trueEnd;
    this.showScreen('ending');

    if (type === 'trueEnd') {
      this.audio.playBgm('truth');
    }

    if (this.dom.endingIcon) this.dom.endingIcon.textContent = endingData.icon;
    if (this.dom.endingTitle) this.dom.endingTitle.textContent = endingData.title;
    if (this.dom.endingSub) this.dom.endingSub.textContent = endingData.sub;
    if (this.dom.endingDesc) this.dom.endingDesc.textContent = endingData.desc;

    this.updateEndingBannersAndButtons(type, endingData);
  }

  updateEndingBannersAndButtons(type, endingData) {
    if (this.dom.endingUnlockedBanner) {
      if (endingData.unlockedBanner) {
        this.dom.endingUnlockedBanner.textContent = endingData.unlockedBanner;
        this.dom.endingUnlockedBanner.classList.remove('hidden');
      } else {
        this.dom.endingUnlockedBanner.classList.add('hidden');
      }
    }

    if (this.dom.btnEndingExploreAgain) {
      this.dom.btnEndingExploreAgain.classList.toggle('hidden', type !== 'gameover');
    }
  }

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

  advanceDialogue() {
    if (this.isTyping) {
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
    const speakerKey = item.speaker;
    const char = this.characters[speakerKey] || {
      name: speakerKey,
      color: '#f8fafc',
      sprite: null,
    };

    const isMonologue = this.isMonologueLine(item.text, speakerKey);
    this.updateDialogueSpeakerHeader(char, speakerKey, isMonologue);
    this.updateCharacterSprite(char, speakerKey, isMonologue);
    this.updateIllustration(item);
    this.backlog.push({ speaker: char.name, text: item.text });

    if (!this.isSkipActive && !isMonologue) {
      this.audio.speak(item.text, char);
    } else {
      this.audio.stopVoice();
    }

    this.startTypewriter(item.text, isMonologue);
  }

  isMonologueLine(text, speakerKey) {
    return (
      Boolean(text.startsWith('（') && text.endsWith('）')) ||
      text.includes('（……') ||
      speakerKey.includes('思考') ||
      speakerKey.includes('心の声')
    );
  }

  updateDialogueSpeakerHeader(char, speakerKey, isMonologue) {
    if (!this.dom.dialogueSpeaker) return;
    if (speakerKey === 'kei' && isMonologue) {
      this.dom.dialogueSpeaker.innerHTML = `${char.name} <span class="speaker-thought-tag">💭 心の声</span>`;
    } else {
      this.dom.dialogueSpeaker.textContent = char.name;
    }
    this.dom.dialogueSpeaker.style.color = char.color || '#00f3ff';
  }

  shouldShowDimmedPreviousNpc(speakerKey) {
    const isPlayerOrNarrator = speakerKey === 'kei' || speakerKey === 'narrator';
    return Boolean(isPlayerOrNarrator && this.lastActiveNpcChar?.sprite);
  }

  updateCharacterSprite(char, speakerKey, isMonologue = false) {
    if (!this.dom.characterStage || !this.dom.characterSpriteBox) return;

    if (char.sprite) {
      this.lastActiveNpcChar = char;
      this.dom.characterStage.classList.remove('hidden');
      this.dom.characterSpriteBox.innerHTML = `<img src="${char.sprite}" alt="${char.name}" class="char-sprite-img" />`;
      return;
    }

    if (this.shouldShowDimmedPreviousNpc(speakerKey)) {
      this.dom.characterStage.classList.remove('hidden');
      const dimClass = isMonologue ? 'is-monologue-bg' : 'is-dimmed';
      this.dom.characterSpriteBox.innerHTML = `<img src="${this.lastActiveNpcChar.sprite}" alt="${this.lastActiveNpcChar.name}" class="char-sprite-img ${dimClass}" />`;
      return;
    }

    this.dom.characterStage.classList.add('hidden');
    this.dom.characterSpriteBox.innerHTML = '';
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

  startTypewriter(text, isMonologue = false) {
    this.isTyping = true;
    if (!this.dom.dialogueText) return;
    this.dom.dialogueText.textContent = '';
    let index = 0;
    const speed = this.isSkipActive ? 6 : 22;

    if (this.dom.voiceWaveIndicator) {
      const showWave = !isMonologue && !this.isSkipActive;
      this.dom.voiceWaveIndicator.classList.toggle('hidden', !showWave);
    }

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
    this.dom.voiceWaveIndicator?.classList.add('hidden');
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  setupAutoAdvance() {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    if (!this.isAutoActive && !this.isSkipActive) return;

    const delay = this.isSkipActive ? 110 : 2000;
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
    this.lastActiveNpcChar = null;
    if (this.dom.characterSpriteBox) {
      this.dom.characterSpriteBox.innerHTML = '';
    }
    this.dom.voiceWaveIndicator?.classList.add('hidden');
    if (this.onDialogueComplete) {
      const cb = this.onDialogueComplete;
      this.onDialogueComplete = null;
      cb();
    }
  }

  toggleAutoMode() {
    this.isAutoActive = !this.isAutoActive;
    if (!this.dom.btnDialogueAuto) return;
    this.dom.btnDialogueAuto.classList.toggle('active', this.isAutoActive);
    if (this.isAutoActive) {
      this.isSkipActive = false;
      this.dom.btnDialogueSkip?.classList.remove('active');
      if (!this.isTyping) this.setupAutoAdvance();
    } else if (this.autoTimer) {
      clearTimeout(this.autoTimer);
    }
  }

  toggleSkipMode() {
    this.isSkipActive = !this.isSkipActive;
    if (!this.dom.btnDialogueSkip) return;
    this.dom.btnDialogueSkip.classList.toggle('active', this.isSkipActive);
    if (this.isSkipActive) {
      this.audio.stopVoice();
      this.isAutoActive = false;
      this.dom.btnDialogueAuto?.classList.remove('active');
      this.stopTypewriter();
      this.advanceDialogue();
    } else if (this.autoTimer) {
      clearTimeout(this.autoTimer);
    }
  }

  openEvidenceModal() {
    this.audio.playSe('click');
    if (!this.dom.modalEvidence || !this.dom.modalEvidenceList) return;
    this.dom.modalEvidenceList.innerHTML = '';

    const collected = Array.from(this.state.collectedEvidence);
    if (collected.length === 0) {
      this.dom.modalEvidenceList.innerHTML =
        '<div class="empty-hint">現在収集した鑑識ファイルはありません。各章のスポットを調査してください。</div>';
    } else {
      collected.forEach((id) => {
        const ev = this.scenario.evidence[id];
        if (ev) {
          this.dom.modalEvidenceList.appendChild(this.createEvidenceModalCard(ev));
        }
      });
    }

    this.dom.modalEvidence.classList.remove('hidden');
  }

  createEvidenceModalCard(ev) {
    const itemEl = document.createElement('div');
    itemEl.className = 'evidence-modal-card';
    itemEl.innerHTML = `
      <div class="card-left">
        <span class="card-modal-icon">${ev.icon}</span>
        <span class="card-modal-type">${ev.type}</span>
        ${ev.image ? `<img src="${ev.image}" alt="${ev.name}" class="card-modal-thumb" />` : ''}
      </div>
      <div class="card-right">
        <strong class="card-modal-title">${ev.name}</strong>
        ${ev.easyExplain ? `<div class="card-modal-easy">${ev.easyExplain}</div>` : ''}
        <p class="card-modal-desc">${ev.detail}</p>
      </div>
    `;
    return itemEl;
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

  // 全編小説＆事件真相レポートモーダル
  openNovelModal(tabKey = 'all') {
    this.audio.playSe('click');
    if (!this.dom.modalNovel) return;
    this.currentNovelTab = tabKey;
    this.renderNovelTabs();
    this.renderNovelBody(tabKey);
    this.dom.modalNovel.classList.remove('hidden');
  }

  closeNovelModal() {
    this.dom.modalNovel?.classList.add('hidden');
  }

  toggleNovelModal() {
    if (this.dom.modalNovel?.classList.contains('hidden')) {
      this.openNovelModal('all');
    } else {
      this.closeNovelModal();
    }
  }

  renderNovelTabs() {
    if (!this.dom.novelChapterTabs) return;
    this.dom.novelChapterTabs.innerHTML = '';
    const tabs = [
      { key: 'all', label: '📚 全編通読' },
      { key: 'ch1', label: '第1章: 口座焼却' },
      { key: 'ch2', label: '第2章: 亡霊接続' },
      { key: 'ch3', label: '第3章: 逆流RDP' },
      { key: 'ch4', label: '第4章: 直接補償' },
      { key: 'ch5', label: '第5章・終章: 発動第1号' },
    ];

    tabs.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `novel-tab-btn ${this.currentNovelTab === t.key ? 'active' : ''}`;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        this.audio.playSe('click');
        this.openNovelModal(t.key);
      });
      this.dom.novelChapterTabs.appendChild(btn);
    });
  }

  getTargetNovelChapters(tabKey) {
    const chapters = this.scenario.chapters || [];
    if (tabKey === 'all') return chapters;
    return chapters.filter((c) => `ch${c.id}` === tabKey);
  }

  renderNovelBody(tabKey) {
    if (!this.dom.modalNovelBody) return;
    this.dom.modalNovelBody.innerHTML = '';

    if (tabKey === 'all' || tabKey === 'ch1') {
      this.dom.modalNovelBody.appendChild(
        this.createNovelSectionElement(
          'PROLOGUE',
          'プロローグ：2026年10月1日・新しい盾と悪夢の幕開け',
          this.scenario.prologue || [],
        ),
      );
    }

    this.getTargetNovelChapters(tabKey).forEach((ch) => {
      this.appendChapterNovelSections(ch);
    });

    if (tabKey === 'all' || tabKey === 'ch5') {
      this.dom.modalNovelBody.appendChild(
        this.createNovelSectionElement(
          'EPILOGUE',
          'エピローグ：公表なき無害化と、夜明けのアーキテクチャ',
          this.scenario.epilogue || [],
        ),
      );
    }
    this.dom.modalNovelBody.scrollTop = 0;
  }

  appendChapterNovelSections(ch) {
    const allSpots = [
      ...(this.scenario.exploreSpots.desk || []),
      ...(this.scenario.exploreSpots.living || []),
    ].filter((s) => s.chapter === ch.id);

    const allDebates = (this.scenario.debates || []).filter((d) => d.chapter === ch.id);
    const lines = [...(ch.introDialogue || [])];

    allSpots.forEach((s) => {
      lines.push(...(s.dialogue || []));
    });
    allDebates.forEach((d) => {
      lines.push(...(d.correctDialogue || []));
    });

    const secEl = this.createNovelSectionElement(ch.code, `${ch.title} (${ch.date})`, lines);
    allSpots.forEach((s) => {
      const ev = this.scenario.evidence[s.evidenceId];
      if (ev) {
        const callout = document.createElement('div');
        callout.className = 'novel-truth-callout';
        callout.innerHTML = `<strong>${ev.icon} ${ev.name}</strong><div>${ev.detail}</div>`;
        secEl.appendChild(callout);
      }
    });
    this.dom.modalNovelBody.appendChild(secEl);
  }

  createNovelSectionElement(code, title, lines) {
    const wrap = document.createElement('article');
    wrap.className = 'novel-section-block';
    wrap.innerHTML = `
      <div class="novel-section-header">
        <span class="novel-section-code">${code}</span>
        <h4 class="novel-section-title">${title}</h4>
      </div>
    `;
    lines.forEach((line) => {
      wrap.appendChild(this.createNovelLineElement(line));
    });
    return wrap;
  }

  createNovelLineElement(line) {
    const p = document.createElement('div');
    if (line.speaker === 'narrator') {
      p.className = 'novel-line-row novel-line-narrator';
      p.textContent = line.text;
      return p;
    }
    const char = this.characters[line.speaker] || { name: line.speaker, color: '#38bdf8' };
    p.className = 'novel-line-row';
    p.innerHTML = `<span class="novel-line-speaker" style="color:${char.color || '#38bdf8'}">${char.name}:</span><span>${line.text}</span>`;
    return p;
  }

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

  openGalleryModal() {
    this.audio.playSe('click');
    this.dom.modalGallery?.classList.remove('hidden');
  }

  closeGalleryModal() {
    this.dom.modalGallery?.classList.add('hidden');
  }

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
    this.updateAudioToggleButton(this.dom.btnToggleVoice, this.state.voiceEnabled, {
      onLabel: ' 音声: ON',
      offLabel: ' 音声: OFF',
      onTitle: '音声合成: ON',
      offTitle: '音声合成: OFF',
    });
    this.updateAudioToggleButton(this.dom.btnToggleSe, this.state.seEnabled, {
      onLabel: ' SE: ON',
      offLabel: ' SE: OFF',
      onTitle: '効果音 (SE): ON',
      offTitle: '効果音 (SE): OFF',
    });
    this.updateAudioToggleButton(this.dom.btnToggleBgm, this.state.bgmEnabled, {
      onLabel: ' BGM: ON',
      offLabel: ' BGM: OFF',
      onTitle: 'BGM音楽: ON',
      offTitle: 'BGM音楽: OFF',
    });
  }

  updateAudioToggleButton(btn, enabled, labels) {
    if (!btn) return;
    btn.classList.toggle('active', Boolean(enabled));
    const lbl = btn.querySelector('.hud-audio-label');
    if (lbl) {
      lbl.textContent = enabled ? labels.onLabel : labels.offLabel;
    }
    btn.title = enabled ? labels.onTitle : labels.offTitle;
  }

  handleResetSaveData() {
    if (confirm('【確認】セーブデータを完全に初期化し、第1章からやり直しますか？')) {
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
