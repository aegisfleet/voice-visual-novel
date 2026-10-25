// app.js - GHOST PROTOCOL 体験型インタラクティブノベル コントローラー

class NovelApp {
  constructor() {
    this.audio = new AudioManager();
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;
    this.characters = window.CHARACTER_DATA;

    this.dom = {};
    this.typingTimer = null;
    this.autoTimer = null;
    this.isTyping = false;
    this.isAutoActive = false;
    this.isSkipActive = false;
    this.currentDialogueQueue = [];
    this.queueIndex = 0;
    this.currentSpeaker = null;
    this.backlog = [];
    this.deductionStepIndex = 0;
    this.selectedDeductionEvidence = null;
    this.isFinalDeductionComplete = false;

    this.bindDomElements();
    this.initEventListeners();
    this.checkSavedSession();
  }

  // 1. DOM要素のバインド
  bindDomElements() {
    const get = (id) => document.getElementById(id);

    this.dom = {
      // HUD
      hud: get('hud'),
      hudLocationBadge: get('hud-location-badge'),
      hudLoopBadge: get('hud-loop-badge'),
      btnHudNovel: get('btn-hud-novel'),
      btnEvidenceBag: get('btn-evidence-bag'),
      evidenceCount: get('evidence-count'),
      btnToggleVoice: get('btn-toggle-voice'),
      btnToggleSe: get('btn-toggle-se'),
      btnToggleBgm: get('btn-toggle-bgm'),
      btnHudReturnTitle: get('btn-hud-return-title'),

      // タイトル画面
      screenTitle: get('screen-title'),
      btnStartGame: get('btn-start-game'),
      btnContinueGame: get('btn-continue-game'),
      btnOpenNovel: get('btn-open-novel'),
      btnOpenGallery: get('btn-open-gallery'),
      btnResetSave: get('btn-reset-save'),
      titleLoopInfo: get('title-loop-info'),
      titleClearBadge: get('title-clear-badge'),

      // ノベル画面
      screenNovel: get('screen-novel'),
      chapterTimelineBar: get('chapter-timeline-bar'),
      novelBg: get('novel-bg'),
      characterStage: get('character-stage'),
      characterSpriteBox: get('character-sprite-box'),
      dialogueIllustrationStage: get('dialogue-illustration-stage'),
      dialogueIllustrationImg: get('dialogue-illustration-img'),
      dialogueIllustrationCaption: get('dialogue-illustration-caption'),
      btnCloseIllustration: get('btn-close-illustration'),

      // 選択肢パネル
      choiceStage: get('choice-stage'),
      choiceBadge: get('choice-badge'),
      choiceQuestion: get('choice-question'),
      choiceOptions: get('choice-options'),

      // 会話ノベルウィンドウ
      novelWindow: get('novel-window'),
      dialogueSpeaker: get('dialogue-speaker'),
      voiceWaveIndicator: get('voice-wave-indicator'),
      dialogueText: get('dialogue-text'),
      dialoguePrompt: get('dialogue-prompt'),
      btnDialogueAuto: get('btn-dialogue-auto'),
      btnDialogueSkip: get('btn-dialogue-skip'),
      btnDialogueLog: get('btn-dialogue-log'),

      // カットイン
      overlayCutin: get('overlay-cutin'),
      cutinBox: get('cutin-box'),
      cutinSub: get('cutin-sub'),
      cutinText: get('cutin-text'),

      // エンディング画面
      screenEnding: get('screen-ending'),
      endingTitle: get('ending-title'),
      endingSub: get('ending-sub'),
      endingDesc: get('ending-desc'),
      endingUnlockedBanner: get('ending-unlocked-banner'),
      btnEndingNovel: get('btn-ending-novel'),
      btnEndingNext: get('btn-ending-next'),
      btnEndingGallery: get('btn-ending-gallery'),

      // モーダル
      modalLog: get('modal-log'),
      modalLogList: get('modal-log-list'),
      btnCloseLog: get('btn-close-log'),

      modalEvidence: get('modal-evidence'),
      modalEvidenceList: get('modal-evidence-list'),
      modalEvidenceDetail: get('modal-evidence-detail'),
      detailEvName: get('detail-ev-name'),
      detailEvType: get('detail-ev-type'),
      detailEvImg: get('detail-ev-img'),
      detailEvDesc: get('detail-ev-desc'),
      btnCloseEvidence: get('btn-close-evidence'),

      modalNovel: get('modal-novel'),
      modalNovelBody: get('modal-novel-body'),
      btnCloseNovel: get('btn-close-novel'),

      modalGallery: get('modal-gallery'),
      modalGalleryBody: get('modal-gallery-body'),
      btnCloseGallery: get('btn-close-gallery'),
    };
  }

  // 2. イベントリスナー登録
  initEventListeners() {
    this.initTitleEventListeners();
    this.initDialogueEventListeners();
    this.initModalEventListeners();
    this.initAudioEventListeners();
    this.setupKeyboardShortcuts();
  }

  initTitleEventListeners() {
    this.dom.btnStartGame?.addEventListener('click', () => this.handleStartGame());
    this.dom.btnContinueGame?.addEventListener('click', () => this.handleContinueGame());
    this.dom.btnResetSave?.addEventListener('click', () => this.handleResetSave());
    this.dom.btnHudReturnTitle?.addEventListener('click', () => this.returnToTitle());
    this.dom.btnEndingNext?.addEventListener('click', () => this.returnToTitle());
  }

  initDialogueEventListeners() {
    // 画面全体（またはノベルウィンドウ）のクリックでセリフ進行
    this.dom.screenNovel?.addEventListener('click', (e) => {
      if (this.shouldIgnoreNovelClick(e.target)) return;
      this.advanceDialogue();
    });

    this.dom.btnDialogueAuto?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAuto();
    });
    this.dom.btnDialogueSkip?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSkip();
    });
    this.dom.btnDialogueLog?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openLogModal();
    });
    this.dom.btnCloseIllustration?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideIllustration();
    });

    // タイムラインバーのチャプター直接選択
    this.dom.chapterTimelineBar?.addEventListener('click', (e) => {
      e.stopPropagation();
      const stepEl = e.target.closest('.timeline-step');
      if (!stepEl?.dataset.chapterId) return;
      const chapterId = Number.parseInt(stepEl.dataset.chapterId, 10);
      if (!Number.isNaN(chapterId)) {
        this.handleTimelineStepClick(chapterId);
      }
    });
  }

  shouldIgnoreNovelClick(target) {
    return Boolean(
      target.closest('.dialogue-ctrl-btn') ||
        target.closest('#chapter-timeline-bar') ||
        target.closest('#dialogue-illustration-stage') ||
        target.closest('#choice-stage') ||
        target.closest('.modal') ||
        target.closest('#hud'),
    );
  }

  handleTimelineStepClick(chapterId) {
    if (this.state.isChapterCleared(chapterId) || this.state.currentChapter >= chapterId) {
      this.stopAuto();
      this.stopSkip();
      this.stopVoicePlayback();
      this.audio.playSe('click');
      this.loadChapter(chapterId);
    }
  }

  initModalEventListeners() {
    this.dom.btnHudNovel?.addEventListener('click', () => this.openNovelModal());
    this.dom.btnOpenNovel?.addEventListener('click', () => this.openNovelModal());
    this.dom.btnEndingNovel?.addEventListener('click', () => this.openNovelModal());

    this.dom.btnEvidenceBag?.addEventListener('click', () => this.openEvidenceModal());
    this.dom.btnOpenGallery?.addEventListener('click', () => this.openGalleryModal());
    this.dom.btnEndingGallery?.addEventListener('click', () => this.openGalleryModal());

    this.dom.btnCloseLog?.addEventListener('click', () => this.closeModal(this.dom.modalLog));
    this.dom.btnCloseEvidence?.addEventListener('click', () =>
      this.closeModal(this.dom.modalEvidence),
    );
    this.dom.btnCloseNovel?.addEventListener('click', () => this.closeModal(this.dom.modalNovel));
    this.dom.btnCloseGallery?.addEventListener('click', () =>
      this.closeModal(this.dom.modalGallery),
    );

    // モーダルの背景（backdrop）タップで閉じる
    [this.dom.modalLog, this.dom.modalEvidence, this.dom.modalNovel, this.dom.modalGallery].forEach(
      (m) => {
        m?.addEventListener('click', (e) => {
          if (e.target === m) this.closeModal(m);
        });
      },
    );
  }

  initAudioEventListeners() {
    this.dom.btnToggleVoice?.addEventListener('click', () => this.toggleVoice());
    this.dom.btnToggleSe?.addEventListener('click', () => this.toggleSe());
    this.dom.btnToggleBgm?.addEventListener('click', () => this.toggleBgm());
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          this.advanceDialogue();
          break;
        case 'a':
        case 'A':
          this.toggleAuto();
          break;
        case 's':
        case 'S':
          this.toggleSkip();
          break;
        case 'l':
        case 'L':
          this.openLogModal();
          break;
        case 'n':
        case 'N':
          this.openNovelModal();
          break;
        case 'e':
        case 'E':
          this.openEvidenceModal();
          break;
        case 'Escape':
          this.closeAllModals();
          break;
      }
    });
  }

  // 3. タイトル＆セッション管理
  checkSavedSession() {
    if (this.state.isGameCleared()) {
      this.dom.titleClearBadge?.classList.remove('hidden');
    }
    if (this.state.hasSavedSession()) {
      this.dom.btnContinueGame?.classList.remove('hidden');
    }
    this.updateAudioButtons();
  }

  handleStartGame() {
    this.deductionStepIndex = 0;
    this.selectedDeductionEvidence = null;
    this.isFinalDeductionComplete = false;
    this.state.resetTransientState();
    this.state.clearSessionProgress();
    this.audio.playBgm('investigate');
    this.switchScreen('novel');
    this.loadChapter(0);
  }

  handleContinueGame() {
    const session = this.state.loadSessionProgress();
    if (!session) {
      this.handleStartGame();
      return;
    }
    this.audio.playBgm('investigate');
    this.switchScreen('novel');
    this.loadChapter(this.state.currentChapter, true);
  }

  handleResetSave() {
    if (window.confirm('すべての進行状況とセーブデータを初期化しますか？')) {
      this.state.resetAllData();
      window.location.reload();
    }
  }

  returnToTitle() {
    this.stopAuto();
    this.stopSkip();
    this.audio.stopVoice();
    this.audio.playBgm('title');
    this.switchScreen('title');
    this.checkSavedSession();
  }

  switchScreen(screenName) {
    this.dom.screenTitle?.classList.remove('active');
    this.dom.screenNovel?.classList.remove('active');
    this.dom.screenEnding?.classList.remove('active');

    if (screenName === 'title') {
      this.dom.screenTitle?.classList.add('active');
      this.dom.hud?.classList.add('hidden');
    } else if (screenName === 'novel') {
      this.dom.screenNovel?.classList.add('active');
      this.dom.hud?.classList.remove('hidden');
    } else if (screenName === 'ending') {
      this.dom.screenEnding?.classList.add('active');
      this.dom.hud?.classList.remove('hidden');
    }
  }

  // 4. チャプター進行とエピソード制御
  loadChapter(chapterNum, isResuming = false) {
    this.state.currentChapter = chapterNum;
    this.updateTimelineBar();
    this.updateEvidenceHud();

    if (chapterNum === 0) {
      // プロローグ
      this.currentDialogueQueue = [...this.scenario.prologue.dialogue];
      this.queueIndex = isResuming ? this.state.currentLineIndex : 0;
      this.updateHudBadge('PROLOGUE', '予兆なき暗転');
      this.renderCurrentLine();
      return;
    }

    if (chapterNum >= 1 && chapterNum <= 5) {
      const chapterData = this.scenario.chapters.find((c) => c.id === chapterNum);
      if (!chapterData) return;
      this.currentChapterData = chapterData;
      this.updateHudBadge(chapterData.number, chapterData.title);

      // チャプターの導入ダイアログ
      this.currentDialogueQueue = [...chapterData.introDialogue];
      this.queueIndex = isResuming ? this.state.currentLineIndex : 0;
      this.renderCurrentLine();
      return;
    }

    if (chapterNum === 6) {
      // エピローグ
      this.currentDialogueQueue = [...this.scenario.epilogue.dialogue];
      this.queueIndex = isResuming ? this.state.currentLineIndex : 0;
      this.updateHudBadge('EPILOGUE', '静寂の反撃と夜明け');
      this.renderCurrentLine();
    }
  }

  updateHudBadge(title, desc) {
    if (!this.dom.hudLoopBadge) return;
    this.dom.hudLoopBadge.innerHTML = `<span class="phase-title">${title}</span><span class="phase-desc-text">: ${desc}</span>`;
  }

  updateTimelineBar() {
    if (!this.dom.chapterTimelineBar) return;
    const chapters = this.scenario.chapters;
    let html = '';
    chapters.forEach((ch) => {
      const isActive = this.state.currentChapter === ch.id;
      const isCleared = this.state.isChapterCleared(ch.id);
      let cls = 'timeline-step';
      if (isActive) cls += ' active';
      if (isCleared) cls += ' cleared';
      html += `<span class="${cls}" data-chapter-id="${ch.id}" title="${ch.number} ${ch.title} (クリックで移動)">${ch.number}: ${ch.date}</span>`;
    });
    this.dom.chapterTimelineBar.innerHTML = html;
  }

  updateEvidenceHud() {
    if (this.dom.evidenceCount) {
      this.dom.evidenceCount.textContent = this.state.collectedEvidence.size;
    }
  }

  // 5. ダイアログレンダリング
  renderCurrentLine() {
    if (this.queueIndex >= this.currentDialogueQueue.length) {
      this.handleEndOfQueue();
      return;
    }

    const item = this.currentDialogueQueue[this.queueIndex];
    this.state.currentLineIndex = this.queueIndex;
    this.state.saveSessionProgress();

    this.updateSpeaker(item.speaker);
    this.updateCharacterSprite(item.sprite || (item.speaker !== 'narrator' ? item.speaker : null));
    this.handleLineIllustration(item.illustration);
    this.startTyping(item.text, item.speaker);
    this.addToBacklog(item.speaker, item.text);
  }

  updateSpeaker(speakerId) {
    const char = this.characters[speakerId] || { name: speakerId, color: '#f8fafc' };
    this.currentSpeaker = char;
    if (this.dom.dialogueSpeaker) {
      this.dom.dialogueSpeaker.textContent = char.name;
      this.dom.dialogueSpeaker.style.color = char.color || '#00f3ff';
    }
  }

  updateCharacterSprite(spriteId) {
    if (!this.dom.characterSpriteBox) return;
    if (!spriteId || spriteId === 'narrator' || spriteId === 'kei') {
      this.dom.characterSpriteBox.innerHTML = '';
      return;
    }
    const char = this.characters[spriteId];
    if (char?.sprite) {
      this.dom.characterSpriteBox.innerHTML = `<img src="${char.sprite}" alt="${char.name}">`;
    }
  }

  handleLineIllustration(imgSrc) {
    if (imgSrc) {
      this.showIllustration(imgSrc);
    } else {
      this.hideIllustration();
    }
  }

  showIllustration(src, caption = '') {
    if (!this.dom.dialogueIllustrationStage) return;
    if (this.dom.dialogueIllustrationImg) {
      this.dom.dialogueIllustrationImg.src = src;
    }
    if (this.dom.dialogueIllustrationCaption) {
      this.dom.dialogueIllustrationCaption.textContent = caption;
    }
    this.dom.dialogueIllustrationStage.classList.remove('hidden');
    this.audio.playEvidence();
  }

  hideIllustration() {
    this.dom.dialogueIllustrationStage?.classList.add('hidden');
  }

  startTyping(text, speakerId) {
    this.clearTypingTimer();
    this.isTyping = true;
    this.fullText = text;
    this.charIndex = 0;
    if (this.dom.dialogueText) this.dom.dialogueText.textContent = '';
    this.dom.dialoguePrompt?.classList.add('hidden');

    if (!this.isSkipActive) {
      this.speakText(text, speakerId);
    }

    if (this.isSkipActive) {
      this.finishTyping();
      this.scheduleNextLine(80);
      return;
    }

    const typeStep = () => {
      if (this.charIndex < this.fullText.length) {
        if (this.dom.dialogueText) {
          this.dom.dialogueText.textContent += this.fullText[this.charIndex];
        }
        this.charIndex += 1;
        this.typingTimer = setTimeout(typeStep, 20);
      } else {
        this.finishTyping();
      }
    };
    typeStep();
  }

  finishTyping() {
    this.clearTypingTimer();
    this.isTyping = false;
    if (this.dom.dialogueText) this.dom.dialogueText.textContent = this.fullText;
    this.dom.dialoguePrompt?.classList.remove('hidden');

    if (this.isAutoActive && !this.isSkipActive) {
      const delay = Math.max(1600, this.fullText.length * 65);
      this.scheduleNextLine(delay);
    }
  }

  clearTypingTimer() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  advanceDialogue() {
    if (this.isTyping) {
      this.finishTyping();
      return;
    }
    this.stopVoicePlayback();
    this.queueIndex += 1;
    this.renderCurrentLine();
  }

  scheduleNextLine(ms) {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    this.autoTimer = setTimeout(() => {
      this.advanceDialogue();
    }, ms);
  }

  speakText(text, speakerId) {
    const char = this.characters[speakerId] || this.characters.narrator;
    this.dom.voiceWaveIndicator?.classList.remove('hidden');
    this.audio.speak(text, char, () => {
      this.dom.voiceWaveIndicator?.classList.add('hidden');
    });
  }

  stopVoicePlayback() {
    this.audio.stopVoice();
    this.dom.voiceWaveIndicator?.classList.add('hidden');
  }

  addToBacklog(speakerId, text) {
    const char = this.characters[speakerId] || { name: speakerId };
    this.backlog.push({ speaker: char.name, text });
  }

  // 6. キュー終了処理＆体験型選択肢
  handleEndOfQueue() {
    const chapterNum = this.state.currentChapter;

    if (chapterNum === 0) {
      // プロローグ終了 -> Chapter 1 へ
      this.loadChapter(1);
      return;
    }

    if (chapterNum >= 1 && chapterNum <= 5) {
      this.handleChapterProgress(chapterNum);
      return;
    }

    if (chapterNum === 6) {
      // エピローグ終了 -> エンディング画面へ
      this.showEnding();
    }
  }

  handleChapterProgress(chapterNum) {
    const chapterData = this.currentChapterData;
    if (!chapterData) return;

    // 1. 中盤の作戦判断選択肢 (tacticChoice)
    if (chapterData.tacticChoice && !this.hasChosenForChapter(chapterData.tacticChoice.id)) {
      this.showChoice(chapterData.tacticChoice, 'tactic');
      return;
    }

    // 2. 終盤の核心鑑識選択肢 (choice)
    if (chapterData.choice && !this.hasChosenForChapter(chapterData.choice.id)) {
      this.showChoice(chapterData.choice, 'forensic');
      return;
    }

    // 3. Chapter 5 最終証拠連結フェーズ (finalDeduction)
    if (chapterNum === 5 && chapterData.finalDeduction && !this.isFinalDeductionComplete) {
      this.startFinalDeduction(chapterData.finalDeduction);
      return;
    }

    this.completeChapter(chapterNum);
  }

  hasChosenForChapter(choiceId) {
    return Boolean(this.state.selectedChoices[choiceId]);
  }

  showChoice(choiceData, type = 'forensic') {
    this.stopAuto();
    this.stopSkip();
    this.stopVoicePlayback();

    if (!this.dom.choiceStage) return;
    if (this.dom.choiceBadge) {
      this.dom.choiceBadge.textContent =
        choiceData.badge ||
        (type === 'tactic'
          ? '⚡ TACTICAL DECISION / 作戦判断'
          : '⚡ FORENSIC DECISION / 鑑識の決断');
    }
    this.dom.choiceQuestion.textContent = choiceData.question;
    this.dom.choiceOptions.innerHTML = '';

    choiceData.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.innerHTML = `
        <span class="choice-btn-label">${opt.label}</span>
        <span class="choice-btn-desc">${opt.description}</span>
      `;
      btn.addEventListener('click', () => this.handleOptionSelected(choiceData, opt, type));
      this.dom.choiceOptions.appendChild(btn);
    });

    this.dom.choiceStage.classList.remove('hidden');
  }

  handleOptionSelected(choiceData, option, type = 'forensic') {
    this.dom.choiceStage?.classList.add('hidden');
    this.state.recordChoice(choiceData.id, option.id);

    if (type === 'tactic') {
      this.handleTacticOptionSelected(option);
    } else {
      this.handleForensicOptionSelected(option);
    }
  }

  handleTacticOptionSelected(option) {
    this.audio.playSe('evidence_a');
    this.triggerCutin(
      '作戦指令承認：直ちに電脳措置を発動！',
      '⚡ NCO TACTICAL DIRECTIVE / 作戦指示承認',
      'tactic',
    );
    const reaction = option.reaction || [];
    const mid = this.currentChapterData?.midDialogue || [];
    this.currentDialogueQueue = [...reaction, ...mid];
    this.queueIndex = 0;
    setTimeout(() => this.renderCurrentLine(), 800);
  }

  handleForensicOptionSelected(option) {
    this.triggerCutin(
      '欺瞞工作を論破！ 侵入痕跡・因果関係立証！',
      '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
      'forensic',
    );
    this.audio.playCutin();

    const reaction = option.reaction || [];
    const resolution = this.currentChapterData?.resolution || [];
    this.currentDialogueQueue = [...reaction, ...resolution];
    this.queueIndex = 0;

    if (this.currentChapterData?.requiredEvidence) {
      this.state.addEvidence(this.currentChapterData.requiredEvidence);
      this.updateEvidenceHud();
    }

    setTimeout(() => this.renderCurrentLine(), 800);
  }

  // 6.1 最終証拠連結 (FINAL DEDUCTION) コントローラー
  startFinalDeduction(deductionData) {
    this.finalDeductionData = deductionData;
    this.stopAuto();
    this.stopSkip();
    this.stopVoicePlayback();
    this.renderDeductionStep();
  }

  renderDeductionStep() {
    if (!this.finalDeductionData || !this.dom.choiceStage) return;
    const steps = this.finalDeductionData.steps;
    if (this.deductionStepIndex >= steps.length) {
      this.isFinalDeductionComplete = true;
      this.completeChapter(5);
      return;
    }

    const step = steps[this.deductionStepIndex];
    this.selectedDeductionEvidence = null;

    if (this.dom.choiceBadge) {
      this.dom.choiceBadge.textContent = '⚡ FINAL DEDUCTION / 最終証拠連結作戦';
    }
    this.dom.choiceQuestion.innerHTML = `<span class="deduction-step-badge">STEP ${step.stepNumber} / ${steps.length}</span> ${step.question}`;
    this.dom.choiceOptions.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'deduction-evidence-grid';

    const evidenceList = Object.values(this.scenario.evidence);
    evidenceList.forEach((ev) => {
      const card = document.createElement('div');
      card.className = 'deduction-card';
      card.dataset.evId = ev.id;
      card.innerHTML = `
        <div class="deduction-card-header">
          <span class="deduction-card-icon">${ev.icon}</span>
          <span class="deduction-card-title">${ev.name}</span>
        </div>
        <div class="deduction-card-desc">${ev.summary}</div>
      `;
      card.addEventListener('click', () => this.handleDeductionEvidenceSelect(grid, card, ev.id));
      grid.appendChild(card);
    });

    this.dom.choiceOptions.appendChild(grid);

    const actionDiv = document.createElement('div');
    actionDiv.className = 'deduction-actions';
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn-deduction-submit';
    submitBtn.id = 'btn-deduction-submit';
    submitBtn.textContent = '⚡ この証拠を突きつける！';
    submitBtn.disabled = true;
    submitBtn.addEventListener('click', () => this.submitDeductionAnswer(step));
    actionDiv.appendChild(submitBtn);
    this.dom.choiceOptions.appendChild(actionDiv);

    this.dom.choiceStage.classList.remove('hidden');
  }

  handleDeductionEvidenceSelect(grid, card, evId) {
    grid.querySelectorAll('.deduction-card').forEach((c) => {
      c.classList.remove('selected');
    });
    card.classList.add('selected');
    this.selectedDeductionEvidence = evId;
    const submitBtn = document.getElementById('btn-deduction-submit');
    if (submitBtn) submitBtn.disabled = false;
    this.audio.playSe('evidence_a');
  }

  submitDeductionAnswer(step) {
    if (!this.selectedDeductionEvidence) return;

    if (this.selectedDeductionEvidence === step.correctEvidenceId) {
      this.handleDeductionSuccess(step);
    } else {
      this.handleDeductionIncorrect(step);
    }
  }

  handleDeductionSuccess(step) {
    this.dom.choiceStage?.classList.add('hidden');
    this.triggerCutin(
      '全証拠連結完了！ 能動的サイバー防御発動承認！',
      '⚡ ACTIVE CYBER DEFENSE AUTHORIZED / 発動第1号要請',
      'gold',
    );
    this.audio.playCutin();

    this.deductionStepIndex += 1;
    this.currentDialogueQueue = [...step.reaction];
    this.queueIndex = 0;

    const isLastStep = this.deductionStepIndex >= this.finalDeductionData.steps.length;
    if (isLastStep) {
      this.state.addEvidence('canary_c2_origin');
      this.isFinalDeductionComplete = true;
    }

    setTimeout(() => {
      this.renderCurrentLine();
    }, 800);
  }

  handleDeductionIncorrect(step) {
    this.audio.playSe('evidence_b');
    let hintBanner = this.dom.choiceOptions?.querySelector('.deduction-hint-banner');
    if (!hintBanner) {
      hintBanner = document.createElement('div');
      hintBanner.className = 'deduction-hint-banner';
      this.dom.choiceOptions.insertBefore(hintBanner, this.dom.choiceOptions.firstChild);
    }
    hintBanner.textContent = `❌ 不正解です！ 【ヒント】${step.hint}`;
  }

  triggerCutin(
    text = '欺瞞工作を論破！ 侵入痕跡・因果関係立証！',
    subText = '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
    type = 'forensic',
  ) {
    if (!this.dom.overlayCutin) return;
    if (this.dom.cutinSub) this.dom.cutinSub.textContent = subText;
    if (this.dom.cutinText) this.dom.cutinText.textContent = text;
    if (this.dom.cutinBox) {
      this.dom.cutinBox.className = `cutin-box ${type}`;
    }

    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.remove('active');
    void this.dom.overlayCutin.offsetWidth; // 強制リフロー
    this.dom.overlayCutin.classList.add('active');

    setTimeout(() => {
      this.dom.overlayCutin?.classList.remove('active');
      this.dom.overlayCutin?.classList.add('hidden');
    }, 1800);
  }

  completeChapter(chapterNum) {
    this.state.markChapterCleared(chapterNum);
    this.updateTimelineBar();
    if (chapterNum < 5) {
      this.loadChapter(chapterNum + 1);
    } else {
      this.loadChapter(6); // エピローグへ
    }
  }

  showEnding() {
    this.state.markGameCleared();
    this.stopAuto();
    this.stopSkip();
    this.audio.playBgm('truth');
    this.switchScreen('ending');

    if (this.dom.endingTitle) {
      this.dom.endingTitle.textContent = 'TRUE END: 静寂の反撃と夜明け';
    }
    if (this.dom.endingSub) {
      this.dom.endingSub.textContent =
        '能動的サイバー防御「公表なき発動第1号」達成・26,739台の救出';
    }
    if (this.dom.endingDesc) {
      this.dom.endingDesc.textContent =
        '四重恐喝の無力化、リバースRDPの看破、そしてカナリアトークンによる真C2の特定と非公然無害化措置の完遂。26,739人の日常と資産は守り抜かれた。';
    }
    this.dom.endingUnlockedBanner?.classList.remove('hidden');
    if (this.dom.endingUnlockedBanner) {
      this.dom.endingUnlockedBanner.textContent =
        '🏆 全5章・完全制覇達成！ 全編小説＆深層解説レポートが全解禁されました。';
    }
  }

  // 7. AUTO / SKIP コントロール
  toggleAuto() {
    this.isAutoActive = !this.isAutoActive;
    if (this.isAutoActive) {
      this.isSkipActive = false;
      this.dom.btnDialogueAuto?.classList.add('active');
      this.dom.btnDialogueSkip?.classList.remove('active');
      if (!this.isTyping) this.advanceDialogue();
    } else {
      this.stopAuto();
    }
  }

  stopAuto() {
    this.isAutoActive = false;
    this.dom.btnDialogueAuto?.classList.remove('active');
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  toggleSkip() {
    this.isSkipActive = !this.isSkipActive;
    if (this.isSkipActive) {
      this.isAutoActive = false;
      this.dom.btnDialogueSkip?.classList.add('active');
      this.dom.btnDialogueAuto?.classList.remove('active');
      this.advanceDialogue();
    } else {
      this.stopSkip();
    }
  }

  stopSkip() {
    this.isSkipActive = false;
    this.dom.btnDialogueSkip?.classList.remove('active');
  }

  // 8. モーダル制御
  openLogModal() {
    this.stopAuto();
    this.renderBacklog();
    this.openModal(this.dom.modalLog);
  }

  renderBacklog() {
    if (!this.dom.modalLogList) return;
    this.dom.modalLogList.innerHTML = '';
    this.backlog.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'log-item';
      el.innerHTML = `
        <div class="log-speaker">${item.speaker}</div>
        <div class="log-text">${item.text}</div>
      `;
      this.dom.modalLogList.appendChild(el);
    });
    this.dom.modalLogList.scrollTop = this.dom.modalLogList.scrollHeight;
  }

  openEvidenceModal() {
    this.stopAuto();
    this.renderEvidenceList();
    this.openModal(this.dom.modalEvidence);
  }

  renderEvidenceList() {
    if (!this.dom.modalEvidenceList) return;
    this.dom.modalEvidenceList.innerHTML = '';
    const allEvidence = Object.values(this.scenario.evidence);

    allEvidence.forEach((ev) => {
      const isUnlocked = this.state.hasEvidence(ev.id);
      const card = document.createElement('div');
      card.className = `evidence-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="evidence-icon">${isUnlocked ? ev.icon : '🔒'}</div>
        <div class="evidence-card-info">
          <div class="evidence-card-name">${isUnlocked ? ev.name : '未解析の鑑識データ'}</div>
          <div class="evidence-card-type">${isUnlocked ? ev.type : 'LOCKED'}</div>
        </div>
      `;
      if (isUnlocked) {
        card.addEventListener('click', () => this.showEvidenceDetail(ev));
      }
      this.dom.modalEvidenceList.appendChild(card);
    });
  }

  showEvidenceDetail(ev) {
    if (!this.dom.modalEvidenceDetail) return;
    this.dom.detailEvName.textContent = ev.name;
    this.dom.detailEvType.textContent = ev.type;
    this.dom.detailEvImg.src = ev.image;
    this.dom.detailEvDesc.textContent = `${ev.summary}\n\n【詳細フォレンジック鑑識】\n${ev.detail}`;
    this.dom.modalEvidenceDetail.classList.remove('hidden');
  }

  openNovelModal() {
    this.stopAuto();
    if (this.dom.modalNovelBody) {
      this.dom.modalNovelBody.innerHTML = this.formatMarkdown(this.scenario.novelFullText);
    }
    this.openModal(this.dom.modalNovel);
  }

  openGalleryModal() {
    this.stopAuto();
    if (this.dom.modalGalleryBody) {
      this.dom.modalGalleryBody.innerHTML = this.renderGalleryArchive();
    }
    this.openModal(this.dom.modalGallery);
  }

  renderGalleryArchive() {
    let html = `<h3>⚡ GHOST PROTOCOL 機密フォレンジック設定資料</h3><div class="gallery-grid">`;
    Object.values(this.scenario.evidence).forEach((ev) => {
      const unlocked = this.state.hasEvidence(ev.id) || this.state.isGameCleared();
      html += `
        <div class="gallery-card">
          <h4>${ev.icon} ${unlocked ? ev.name : '機密ファイル (未解禁)'}</h4>
          <p class="badge">${ev.type}</p>
          <img src="${ev.image}" alt="${ev.name}" class="gallery-img">
          <p class="gallery-text">${unlocked ? ev.detail : '全5章を制覇して閲覧権限を獲得してください。'}</p>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  formatMarkdown(mdText) {
    if (!mdText) return '';
    return mdText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^---$/gim, '<hr>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  openModal(modalEl) {
    modalEl?.classList.remove('hidden');
  }

  closeModal(modalEl) {
    modalEl?.classList.add('hidden');
  }

  closeAllModals() {
    this.closeModal(this.dom.modalLog);
    this.closeModal(this.dom.modalEvidence);
    this.closeModal(this.dom.modalNovel);
    this.closeModal(this.dom.modalGallery);
    this.hideIllustration();
  }

  // 9. オーディオトグル
  toggleVoice() {
    this.audio.voiceEnabled = !this.audio.voiceEnabled;
    this.state.voiceEnabled = this.audio.voiceEnabled;
    this.state.savePersistentState();
    this.updateAudioButtons();
  }

  toggleSe() {
    this.audio.seEnabled = !this.audio.seEnabled;
    this.state.seEnabled = this.audio.seEnabled;
    this.state.savePersistentState();
    this.updateAudioButtons();
  }

  toggleBgm() {
    this.audio.bgmEnabled = !this.audio.bgmEnabled;
    this.state.bgmEnabled = this.audio.bgmEnabled;
    this.state.savePersistentState();
    if (!this.audio.bgmEnabled) {
      this.audio.stopBgm();
    } else {
      this.audio.playBgm(
        this.dom.screenNovel?.classList.contains('active') ? 'investigate' : 'title',
      );
    }
    this.updateAudioButtons();
  }

  updateAudioButtons() {
    this.dom.btnToggleVoice?.classList.toggle('active', this.audio.voiceEnabled);
    this.dom.btnToggleSe?.classList.toggle('active', this.audio.seEnabled);
    this.dom.btnToggleBgm?.classList.toggle('active', this.audio.bgmEnabled);
  }
}

// アプリケーション起動
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new NovelApp();
});
