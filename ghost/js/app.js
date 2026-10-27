// 専門用語ミニ辞典（一般向け噛み砕き解説）
const TERM_GLOSSARY = {
  'FT4/FT5': '世界中の個人投資家が利用しているFX（外国為替）の自動売買ソフト（モデル：MT4/MT5）。',
  FT4: '世界中の個人投資家が利用しているFX（外国為替）の自動売買ソフト。',
  VPS: 'ネット上に借りる「仮想のWindowsパソコン」。24時間自動で株やFXの取引をするために使われる。',
  'AD（Active Directory）': '何万台ものサーバーのIDやパスワードを一括管理する「司令塔サーバー」。',
  'Active Directory': '何万台ものサーバーのIDやパスワードを一括管理する「司令塔サーバー」。',
  スプレッド: '通貨を買値と売値で往復売買した際に発生する「取引手数料（価格差）」のこと。',
  DEMOFASTLOSS: '犯人が残した注文暗号。「デモのように一瞬で残高を溶かす（Fast Loss）」という意味。',
  TCPソケット: '一度ログインが通った後に維持される「通信の専用パイプ（繋ぎっぱなしの電話回線）」。',
  偽旗工作:
    '自分の正体を隠すため、わざと別の国のハッカーのふりをして捜査を攪乱する工作（False Flag）。',
  リバースRDP:
    '本来は手元のPCからサーバーを操作するリモート接続機能を悪用し、逆にサーバー側から手元のPCの中身を覗き見る手口。',
  カナリアトークン:
    '盗まれたファイルが犯人のアジトで開かれた瞬間に、犯人の現在地をこっそり通知する「逆探知用の発信機」。',
  'Investor Password':
    '取引や出金は一切できず、「過去の売買履歴の閲覧だけ」ができる監査用パスワード。',
  C2サーバー: '攻撃者が遠隔地からウイルスや犯行サイトを操るための「秘密の司令塔サーバー」。',
  能動的サイバー防御:
    '2026年10月施行の新法。重大なサイバー攻撃に対し、国の機関が犯人のサーバーへ侵入してデータを無害化（消去）できる制度。',
  警職法6条の2:
    '国民の生命や財産に差し迫った重大な危険があるとき、警察が緊急で実力行使できる法律。',
};

// 用語を文字数の長い順にソートして単一パス正規表現を事前コンパイル（FT4/FT5 と FT4 等の多重置換タグ破壊を完全防止）
const GLOSSARY_TERMS_SORTED = Object.keys(TERM_GLOSSARY).sort((a, b) => b.length - a.length);
const GLOSSARY_REGEX = new RegExp(
  `(${GLOSSARY_TERMS_SORTED.map((t) => t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('|')})`,
  'g',
);

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
    this.pendingRetryChoice = null;

    this.bindDomElements();
    this.initEventListeners();
    this.applyInitialAudioSettings();
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
      hudDefenseMeter: get('hud-defense-meter'),
      hudDefenseVal: get('hud-defense-val'),
      btnHudNovel: get('btn-hud-novel'),
      btnEvidenceBag: get('btn-evidence-bag'),
      evidenceCount: get('evidence-count'),
      btnToggleVoice: get('btn-toggle-voice'),
      btnToggleSe: get('btn-toggle-se'),
      btnToggleBgm: get('btn-toggle-bgm'),
      btnHudSettings: get('btn-hud-settings'),
      btnHudReturnTitle: get('btn-hud-return-title'),

      // タイトル画面
      screenTitle: get('screen-title'),
      btnStartGame: get('btn-start-game'),
      btnContinueGame: get('btn-continue-game'),
      btnOpenNovel: get('btn-open-novel'),
      btnOpenGallery: get('btn-open-gallery'),
      btnTitleSettings: get('btn-title-settings'),
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

      // シネマティックテロップ＆マルチカットシークエンス
      cinematicTelop: get('cinematic-telop'),
      cinematicTelopText: get('cinematic-telop-text'),
      cutSequenceStage: get('cut-sequence-stage'),
      sequenceTitle: get('sequence-title'),
      btnCloseSequence: get('btn-close-sequence'),
      sequenceFrameImg: get('sequence-frame-img'),
      sequenceFrameBadge: get('sequence-frame-badge'),
      sequenceFrameStep: get('sequence-frame-step'),
      sequenceFrameVisualDesc: get('sequence-frame-visual-desc'),
      sequenceProgressFill: get('sequence-progress-fill'),
      sequenceCaption: get('sequence-caption'),

      // 選択肢パネル
      choiceStage: get('choice-stage'),
      choiceBadge: get('choice-badge'),
      choiceQuestion: get('choice-question'),
      choiceLogContainer: get('choice-log-container'),
      choiceLogTitle: get('choice-log-title'),
      choiceLogContent: get('choice-log-content'),
      choiceRetryBanner: get('choice-retry-banner'),
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
      endingRankBadge: get('ending-rank-badge'),
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

      // 音響設定モーダル
      modalSettings: get('modal-settings'),
      btnCloseSettings: get('btn-close-settings'),
      btnConfirmSettings: get('btn-confirm-settings'),
      btnResetAudio: get('btn-reset-audio'),
      sliderBgmVolume: get('slider-bgm-volume'),
      sliderSeVolume: get('slider-se-volume'),
      sliderVoiceVolume: get('slider-voice-volume'),
      valBgmVolume: get('val-bgm-volume'),
      valSeVolume: get('val-se-volume'),
      valVoiceVolume: get('val-voice-volume'),
      btnSettingsToggleBgm: get('btn-settings-toggle-bgm'),
      btnSettingsToggleSe: get('btn-settings-toggle-se'),
      btnSettingsToggleVoice: get('btn-settings-toggle-voice'),
      settingsBgmStatus: get('settings-bgm-status'),
      settingsSeStatus: get('settings-se-status'),
      settingsVoiceStatus: get('settings-voice-status'),
      btnTestSe: get('btn-test-se'),
      btnTestVoice: get('btn-test-voice'),
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
    this.dom.btnCloseSequence?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeCutSequence();
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
        target.closest('#cut-sequence-stage') ||
        target.closest('#choice-stage') ||
        target.closest('.modal') ||
        target.closest('#hud'),
    );
  }

  handleTimelineStepClick(chapterId) {
    const isUnlocked =
      chapterId === 0 ||
      this.state.isChapterCleared(chapterId) ||
      chapterId <= (this.state.maxUnlockedChapter || 1) ||
      this.state.currentChapter >= chapterId;
    if (!isUnlocked) return;

    this.stopAuto();
    this.stopSkip();
    this.stopVoicePlayback();
    this.closeCutSequence();
    this.hideIllustration();
    this.dom.choiceStage?.classList.add('hidden');
    this.dom.novelWindow?.classList.remove('choice-mode-hidden');

    if (chapterId === 0) {
      this.audio.playSe('click');
      this.loadChapter(0);
      return;
    }

    // 該当チャプターの選択済みフラグをリセットして選択肢を再体験できるようにする
    const chData = this.scenario.chapters.find((c) => c.id === chapterId);
    if (chData?.choiceSteps) {
      chData.choiceSteps.forEach((step) => {
        delete this.state.selectedChoices[step.id];
      });
    }
    if (chapterId === 5) {
      this.deductionStepIndex = 0;
      this.isFinalDeductionComplete = false;
    }

    this.audio.playSe('click');
    this.loadChapter(chapterId);
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

    this.dom.btnHudSettings?.addEventListener('click', () => this.openSettingsModal());
    this.dom.btnTitleSettings?.addEventListener('click', () => this.openSettingsModal());
    this.dom.btnCloseSettings?.addEventListener('click', () => this.closeSettingsModal());
    this.dom.btnConfirmSettings?.addEventListener('click', () => this.closeSettingsModal());

    // モーダルの背景（backdrop）タップで閉じる
    [
      this.dom.modalLog,
      this.dom.modalEvidence,
      this.dom.modalNovel,
      this.dom.modalGallery,
      this.dom.modalSettings,
    ].forEach((m) => {
      m?.addEventListener('click', (e) => {
        if (e.target === m) this.closeModal(m);
      });
    });
  }

  initAudioEventListeners() {
    this.dom.btnToggleVoice?.addEventListener('click', () => this.toggleVoice());
    this.dom.btnToggleSe?.addEventListener('click', () => this.toggleSe());
    this.dom.btnToggleBgm?.addEventListener('click', () => this.toggleBgm());

    this.initVolumeSliderListeners();
    this.initSettingsControlListeners();
  }

  initVolumeSliderListeners() {
    this.dom.sliderBgmVolume?.addEventListener('input', (e) => {
      const val = Number.parseInt(e.target.value, 10) / 100;
      this.audio.setBgmVolume(val);
      this.state.bgmVolume = this.audio.bgmVolume;
      if (this.dom.valBgmVolume) {
        this.dom.valBgmVolume.textContent = `${Math.round(val * 100)}%`;
      }
      this.state.savePersistentState();
    });

    this.dom.sliderSeVolume?.addEventListener('input', (e) => {
      const val = Number.parseInt(e.target.value, 10) / 100;
      this.audio.setSeVolume(val);
      this.state.seVolume = this.audio.seVolume;
      if (this.dom.valSeVolume) {
        this.dom.valSeVolume.textContent = `${Math.round(val * 100)}%`;
      }
      this.state.savePersistentState();
    });
    this.dom.sliderSeVolume?.addEventListener('change', () => {
      this.audio.playSe('click');
    });

    this.dom.sliderVoiceVolume?.addEventListener('input', (e) => {
      const val = Number.parseInt(e.target.value, 10) / 100;
      this.audio.setVoiceVolume(val);
      this.state.voiceVolume = this.audio.voiceVolume;
      if (this.dom.valVoiceVolume) {
        this.dom.valVoiceVolume.textContent = `${Math.round(val * 100)}%`;
      }
      this.state.savePersistentState();
    });
  }

  initSettingsControlListeners() {
    this.dom.btnSettingsToggleBgm?.addEventListener('click', () => this.toggleBgm());
    this.dom.btnSettingsToggleSe?.addEventListener('click', () => this.toggleSe());
    this.dom.btnSettingsToggleVoice?.addEventListener('click', () => this.toggleVoice());

    this.dom.btnTestSe?.addEventListener('click', () => {
      this.audio.playSe('click');
    });
    this.dom.btnTestVoice?.addEventListener('click', () => {
      this.audio.speak('音響出力テスト完了。感度良好です。');
    });

    this.dom.btnResetAudio?.addEventListener('click', () => {
      this.resetAudioSettings();
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  isAnyModalOpen() {
    return [
      this.dom.modalLog,
      this.dom.modalEvidence,
      this.dom.modalNovel,
      this.dom.modalGallery,
      this.dom.modalSettings,
    ].some((m) => m && !m.classList.contains('hidden'));
  }

  handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      this.closeAllModals();
      return;
    }
    if (this.isAnyModalOpen()) return;

    // ノベル画面以外（タイトルやエンディング）では進行ショートカットを無効化
    if (!this.dom.screenNovel?.classList.contains('active')) return;

    const isChoiceOpen = Boolean(
      this.dom.choiceStage && !this.dom.choiceStage.classList.contains('hidden'),
    );
    if (isChoiceOpen) {
      this.handleChoiceKeydown(e.key);
      return;
    }

    this.handleDialogueKeydown(e);
  }

  handleChoiceKeydown(key) {
    if (!['1', '2', '3'].includes(key)) return;
    const idx = Number.parseInt(key, 10) - 1;
    const btns = this.dom.choiceOptions?.querySelectorAll('.choice-btn');
    if (btns?.[idx]) btns[idx].click();
  }

  handleDialogueKeydown(e) {
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
      case 'c':
      case 'C':
        this.toggleSettingsModal();
        break;
    }
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
    this.checkInAppBrowserNotice();
    this.initTermPopover();
  }

  checkInAppBrowserNotice() {
    const noticeEl = document.getElementById('line-external-notice');
    if (!noticeEl) return;
    const ua = navigator.userAgent || '';
    const isInApp = /Line\/|FBAN|FBAV|Instagram|Twitter/i.test(ua);
    noticeEl.classList.toggle('hidden', !isInApp);
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
    this.audio.playBgm(this.state.currentBgmMode || 'investigate');
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
    this.currentSpriteId = null; // 章切替時に立ち絵キャッシュをリセット
    this.updateTimelineBar();
    this.updateEvidenceHud();
    this.updateDefenseHud();
    this.updateChapterBackground(chapterNum);

    if (chapterNum === 0) {
      this.loadPrologue(isResuming);
    } else if (chapterNum >= 1 && chapterNum <= 5) {
      this.loadStandardChapter(chapterNum, isResuming);
    } else if (chapterNum === 6) {
      this.loadEpilogue(isResuming);
    }
  }

  loadPrologue(isResuming) {
    this.currentDialogueQueue = [...this.scenario.prologue.dialogue];
    this.queueIndex = isResuming ? this.state.currentLineIndex : 0;
    this.updateHudBadge('PROLOGUE', '予兆なき暗転');
    if (!isResuming) {
      this.showChapterTitleCard(
        'PROLOGUE',
        '2026.10.20 23:45',
        '予兆なき暗転と2万6千台の亡霊',
        () => this.renderCurrentLine(),
      );
    } else {
      this.renderCurrentLine();
    }
  }

  loadStandardChapter(chapterNum, isResuming) {
    const chapterData = this.scenario.chapters.find((c) => c.id === chapterNum);
    if (!chapterData) return;
    this.currentChapterData = chapterData;
    this.updateHudBadge(chapterData.number, chapterData.title);

    if (!isResuming) {
      this.state.currentPhase = 'intro';
      this.currentDialogueQueue = [...chapterData.introDialogue];
      this.queueIndex = 0;
      this.showChapterTitleCard(
        chapterData.number,
        chapterData.date,
        chapterData.title,
        () => this.renderCurrentLine(),
        chapterData.subtitle,
      );
      return;
    }

    // 再開時：保存されたフェーズと選択済み状態から正しい会話キューを復元
    const steps = this.getChapterChoiceSteps(chapterData);
    const allChoicesDone = steps.every((s) => this.hasChosenForChapter(s.id));

    if (this.state.currentPhase === 'resolution' || allChoicesDone) {
      this.state.currentPhase = 'resolution';
      this.currentDialogueQueue = [...(chapterData.resolution || [])];
    } else {
      this.state.currentPhase = 'intro';
      this.currentDialogueQueue = [...chapterData.introDialogue];
    }
    this.queueIndex = Math.min(
      this.state.currentLineIndex || 0,
      Math.max(0, this.currentDialogueQueue.length - 1),
    );
    this.renderCurrentLine();
  }

  loadEpilogue(isResuming) {
    this.currentDialogueQueue = [...this.scenario.epilogue.dialogue];
    this.queueIndex = isResuming ? this.state.currentLineIndex : 0;
    this.updateHudBadge('EPILOGUE', '白昼の反撃と完全なる鎮火');
    if (!isResuming) {
      this.showChapterTitleCard('EPILOGUE', '2026.10.27 13:30', '白昼の反撃と完全なる鎮火', () =>
        this.renderCurrentLine(),
      );
    } else {
      this.renderCurrentLine();
    }
  }

  // チャプターに応じた背景とライティングの自動切り替え
  updateChapterBackground(chapterNum) {
    if (!this.dom.novelBg) return;
    this.dom.novelBg.className = 'novel-bg';
    if (chapterNum === 5) {
      this.dom.novelBg.classList.add('bg-nco');
    } else if (chapterNum === 6) {
      this.dom.novelBg.classList.add('bg-nco', 'bg-daylight');
    } else if (chapterNum === 4) {
      this.dom.novelBg.classList.add('bg-terminal', 'bg-boardroom');
    } else {
      this.dom.novelBg.classList.add('bg-terminal');
    }
  }

  // 章開始時のシネマティック・アイキャッチ（幕間タイトル演出）
  showChapterTitleCard(numberText, dateText, titleText, onComplete, subText = '') {
    this.audio.playSe('impact');
    this.triggerCutin(
      `${titleText}${subText ? `\n— ${subText} —` : ''}`,
      `⚡ ${numberText} // ${dateText}`,
      numberText === 'EPILOGUE' ? 'gold' : 'forensic',
      1600,
    );
    clearTimeout(this.chapterCardTimer);
    this.chapterCardTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1650);
  }

  updateHudBadge(title, desc) {
    if (!this.dom.hudLoopBadge) return;
    this.dom.hudLoopBadge.title = desc ? `${title}: ${desc}` : title;
    this.dom.hudLoopBadge.innerHTML = `<span class="phase-title">${title}</span><span class="phase-desc-text">: ${desc}</span>`;
  }

  updateTimelineBar() {
    if (!this.dom.chapterTimelineBar) return;
    const items = [
      { id: 0, label: 'PROLOGUE', sub: '10/20 23:45', title: '予兆なき暗転' },
      { id: 1, label: 'CH.1', sub: '10/21 04:00', title: '26,739台の沈黙' },
      { id: 2, label: 'CH.2', sub: '10/22 19:30', title: '永続ソケットの死角' },
      { id: 3, label: 'CH.3', sub: '10/23 15:00', title: 'リバースRDPの逆流' },
      { id: 4, label: 'CH.4', sub: '10/24 11:50', title: '100%直接補償の決断' },
      { id: 5, label: 'CH.5', sub: '10/27 12:00', title: '能動的サイバー防御' },
    ];

    let html = '';
    items.forEach((item) => {
      const isActive =
        this.state.currentChapter === item.id || (this.state.currentChapter === 6 && item.id === 5);
      const isCleared =
        item.id === 0
          ? this.state.currentChapter > 0 || this.state.isGameCleared()
          : this.state.isChapterCleared(item.id);
      const isUnlocked =
        item.id === 0 ||
        isCleared ||
        item.id <= (this.state.maxUnlockedChapter || 1) ||
        this.state.currentChapter >= item.id;

      let cls = 'timeline-step';
      if (isActive) cls += ' active';
      if (isCleared) cls += ' cleared';
      if (!isUnlocked) cls += ' locked';

      const lockIcon = !isUnlocked ? '🔒 ' : '';
      html += `<span class="${cls}" data-chapter-id="${item.id}" title="${item.label}: ${item.title}">${lockIcon}${item.label} <small style="opacity:0.8">(${item.sub})</small></span>`;
    });
    this.dom.chapterTimelineBar.innerHTML = html;

    requestAnimationFrame(() => {
      const activeEl = this.dom.chapterTimelineBar?.querySelector('.timeline-step.active');
      activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  }

  updateEvidenceHud() {
    if (this.dom.evidenceCount) {
      this.dom.evidenceCount.textContent = this.state.collectedEvidence.size;
    }
    if (this.dom.btnEvidenceBag) {
      this.dom.btnEvidenceBag.classList.remove('hud-pop-anim');
      void this.dom.btnEvidenceBag.offsetWidth;
      this.dom.btnEvidenceBag.classList.add('hud-pop-anim');
    }
  }

  updateDefenseHud() {
    const rate = this.state.defenseRate;
    if (this.dom.hudDefenseVal) {
      this.dom.hudDefenseVal.textContent = `${rate}%`;
    }
    if (this.dom.hudDefenseMeter) {
      this.dom.hudDefenseMeter.classList.remove('warning', 'danger', 'hud-pop-anim');
      void this.dom.hudDefenseMeter.offsetWidth;
      this.dom.hudDefenseMeter.classList.add('hud-pop-anim');
      if (rate < 60) {
        this.dom.hudDefenseMeter.classList.add('danger');
      } else if (rate < 80) {
        this.dom.hudDefenseMeter.classList.add('warning');
      }
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
    this.updateCharacterSprite(
      item.sprite || (item.speaker !== 'narrator' ? item.speaker : null),
      item.emotion || 'normal',
    );
    this.handleLineIllustration(item.illustration);
    this.applyDialogueDirectives(item);
    this.startTyping(item.text, item.speaker);
    this.addToBacklog(item.speaker, item.text);
  }

  // 演出ディレクティブ（BGM・SE・エフェクト・テロップ・マルチカットシークエンス）の適用
  applyDialogueDirectives(item) {
    if (!item) return;

    // 1. BGM切り替え (crisis / investigate / truth / title / silence / stop)
    if (item.bgm) {
      this.state.currentBgmMode = item.bgm;
      this.audio.playBgm(item.bgm);
    }

    // 2. 効果音SE (alert / glitch / impact / ring / beacon / cutin / evidence / correct / victory 等)
    const seType = item.sfx || item.se;
    if (seType) {
      this.audio.playSe(seType);
    }

    // 3. 画面演出エフェクト (glitch / alert-flash / shake / blackout)
    if (item.effect) {
      this.triggerScreenEffect(item.effect);
    }

    // 4. シネマティック緊急テロップ（図解やパラパラ漫画がある行では上部テロップを出さず、ポップアップに集中させる）
    if (item.telop && !item.cutSequence && !item.illustration) {
      this.showCinematicTelop(item.telop);
    } else if (item.cutSequence || item.illustration) {
      this.dom.cinematicTelop?.classList.add('hidden');
    }

    // 5. インラインカットイン
    if (item.cutin) {
      this.triggerCutin(item.cutin.text, item.cutin.sub);
    }

    // 6. マルチカット・アニメーションシークエンス（パラパラ漫画演出）
    if (item.cutSequence) {
      this.startCutSequence(item.cutSequence);
    }
  }

  triggerScreenEffect(effectName) {
    const target = this.dom.screenNovel || document.body;
    const cls = `effect-${effectName}`;
    target.classList.remove(cls);
    void target.offsetWidth; // リフロー強制（ガイドライン規約）
    target.classList.add(cls);
    setTimeout(() => {
      target.classList.remove(cls);
    }, 600);
  }

  showCinematicTelop(telop) {
    if (!this.dom.cinematicTelop || !this.dom.cinematicTelopText) return;
    const text = typeof telop === 'string' ? telop : telop.text;
    this.dom.cinematicTelopText.textContent = text;
    this.dom.cinematicTelop.classList.remove('hidden');
    clearTimeout(this.telopTimer);
    this.telopTimer = setTimeout(() => {
      this.dom.cinematicTelop?.classList.add('hidden');
    }, 3200);
  }

  startCutSequence(sequence) {
    if (!this.dom.cutSequenceStage || !sequence) return;
    // パラパラ漫画が出る時は、上部のトーストが邪魔にならないよう自動で消す
    this.dom.cinematicTelop?.classList.add('hidden');
    this.dom.screenNovel?.classList.add('popup-open');
    this.currentCutSequence = sequence;
    this.currentCutIndex = 0;
    if (this.dom.sequenceTitle) {
      this.dom.sequenceTitle.textContent = sequence.title || 'MULTI-CUT SEQUENCE';
    }
    this.dom.cutSequenceStage.classList.remove('hidden');

    // カード本体をタップすると手動でも次のコマへ進められるようにする
    const frameBox = document.getElementById('sequence-frame-box');
    if (frameBox && !frameBox.dataset.boundClick) {
      frameBox.dataset.boundClick = 'true';
      frameBox.style.cursor = 'pointer';
      frameBox.title = 'タップで次のコマへ進む';
      frameBox.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.currentCutSequence) return;
        if (this.currentCutIndex + 1 < this.currentCutSequence.cuts.length) {
          this.currentCutIndex += 1;
          this.renderCutFrame();
        } else {
          this.closeCutSequence();
        }
      });
    }

    this.renderCutFrame();
  }

  renderCutFrame() {
    const seq = this.currentCutSequence;
    if (!seq?.cuts || this.currentCutIndex >= seq.cuts.length) {
      return;
    }
    const cut = seq.cuts[this.currentCutIndex];
    const total = seq.cuts.length;

    this.audio.playSe(cut.sfx || 'frame');
    this.updateCutFrameProgress(this.currentCutIndex, total);
    this.triggerCutFrameTransition();
    this.renderCutFrameImage(cut);
    this.renderCutFrameHud(cut, total);
    this.scheduleCutFrameTimer(cut, seq, total);
  }

  updateCutFrameProgress(currentIndex, total) {
    if (this.dom.sequenceProgressFill) {
      const pct = Math.round(((currentIndex + 1) / total) * 100);
      this.dom.sequenceProgressFill.style.width = `${pct}%`;
    }
  }

  triggerCutFrameTransition() {
    const frameBox = document.getElementById('sequence-frame-box');
    if (frameBox) {
      frameBox.classList.remove('cut-frame-transition');
      void frameBox.offsetWidth;
      frameBox.classList.add('cut-frame-transition');
    }
  }

  renderCutFrameImage(cut) {
    const fallbackImg = this.currentChapterData?.requiredEvidence
      ? this.scenario.evidence[this.currentChapterData.requiredEvidence]?.image
      : null;
    const imgSrc = cut.image || fallbackImg;
    const placeholder = document.getElementById('sequence-frame-placeholder');

    if (imgSrc && this.dom.sequenceFrameImg) {
      this.dom.sequenceFrameImg.src = imgSrc;
      this.dom.sequenceFrameImg.classList.remove('hidden');
      placeholder?.classList.add('hidden');
      this.dom.sequenceFrameBadge?.classList.remove('hidden');
    } else {
      this.dom.sequenceFrameImg?.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      this.dom.sequenceFrameBadge?.classList.add('hidden');
    }
  }

  renderCutFrameHud(cut, total) {
    if (this.dom.sequenceFrameStep) {
      this.dom.sequenceFrameStep.textContent = `FRAME 0${cut.frame} / 0${total}`;
    }
    if (this.dom.sequenceFrameVisualDesc) {
      this.dom.sequenceFrameVisualDesc.innerHTML = `
        <div class="cut-hud-step">FRAME 0${cut.frame} / 0${total} <span class="cut-tap-hint">[TAP TO NEXT ▶]</span></div>
        <div class="cut-hud-main">${cut.visualDesc || ''}</div>
      `;
    }
    if (this.dom.sequenceCaption) {
      this.dom.sequenceCaption.textContent = cut.caption || '';
    }
  }

  scheduleCutFrameTimer(cut, seq, total) {
    clearTimeout(this.cutSequenceTimer);
    const interval = cut.durationMs || seq.intervalMs || 1800;
    if (this.currentCutIndex + 1 < total) {
      this.cutSequenceTimer = setTimeout(() => {
        this.currentCutIndex++;
        this.renderCutFrame();
      }, interval);
    } else {
      this.cutSequenceTimer = setTimeout(() => {
        this.closeCutSequence();
      }, 3200);
    }
  }

  closeCutSequence() {
    clearTimeout(this.cutSequenceTimer);
    this.currentCutSequence = null;
    this.currentCutIndex = 0;
    this.dom.cutSequenceStage?.classList.add('hidden');
    if (this.dom.dialogueIllustrationStage?.classList.contains('hidden')) {
      this.dom.screenNovel?.classList.remove('popup-open');
    }
  }

  updateSpeaker(speakerId) {
    const char = this.characters[speakerId] || { name: speakerId, color: '#f8fafc' };
    this.currentSpeaker = char;
    if (this.dom.dialogueSpeaker) {
      this.dom.dialogueSpeaker.textContent = char.name;
      this.dom.dialogueSpeaker.style.color = char.color || '#00f3ff';
    }

    // スピーカー名の左横にキャラクターの顔アイコン（ケイを含む）を表示
    const wrap = this.dom.dialogueSpeaker?.parentElement;
    if (wrap) {
      let avatarEl = wrap.querySelector('.speaker-avatar-thumb');
      const avatarSrc = char.sprites?.normal || char.sprite;
      if (avatarSrc) {
        if (!avatarEl) {
          avatarEl = document.createElement('img');
          avatarEl.className = 'speaker-avatar-thumb';
          wrap.insertBefore(avatarEl, this.dom.dialogueSpeaker);
        }
        avatarEl.src = avatarSrc;
        avatarEl.alt = char.name;
        avatarEl.classList.remove('hidden');
      } else if (avatarEl) {
        avatarEl.classList.add('hidden');
      }
    }
  }

  updateCharacterSprite(spriteId, emotion = 'normal') {
    if (!this.dom.characterSpriteBox) return;
    const currentImg = this.dom.characterSpriteBox.querySelector('img');

    // 主人公（ケイ）またはナレーションの発話時は、現在の会話相手を消さずに少し暗くして残す
    if (!spriteId || spriteId === 'narrator' || spriteId === 'kei') {
      if (currentImg) {
        currentImg.classList.remove('sprite-talk-bounce');
        currentImg.classList.add('sprite-dimmed');
      }
      return;
    }

    const char = this.characters[spriteId];
    if (!char) return;
    const targetSrc = char.sprites?.[emotion] || char.sprites?.normal || char.sprite;
    if (!targetSrc) return;

    const isSameChar = this.currentSpriteId === spriteId;
    const isSameSrc = currentImg?.getAttribute('src')?.includes(targetSrc);

    if (isSameChar && isSameSrc && currentImg) {
      currentImg.classList.remove('sprite-dimmed', 'sprite-talk-bounce');
      void currentImg.offsetWidth;
      currentImg.classList.add('sprite-talk-bounce');
      return;
    }

    this.currentSpriteId = spriteId;
    this.currentEmotion = emotion;

    if (isSameChar && currentImg) {
      currentImg.src = targetSrc;
      currentImg.classList.remove('sprite-dimmed', 'sprite-talk-bounce');
      void currentImg.offsetWidth;
      currentImg.classList.add('sprite-talk-bounce');
    } else {
      this.dom.characterSpriteBox.innerHTML = `<img src="${targetSrc}" alt="${char.name}" class="sprite-enter">`;
    }
  }

  handleLineIllustration(imgSrc) {
    if (imgSrc) {
      const item = this.currentDialogueQueue[this.queueIndex];
      const matchedEv = Object.values(this.scenario.evidence || {}).find((e) => e.image === imgSrc);
      const matchedItem = Object.values(this.scenario.items || {}).find((i) => i.image === imgSrc);
      const caption =
        matchedEv?.name || matchedItem?.name || (typeof item?.telop === 'string' ? item.telop : '');
      this.showIllustration(imgSrc, caption);
    } else {
      this.hideIllustration();
    }
  }

  showIllustration(src, caption = '') {
    if (!this.dom.dialogueIllustrationStage) return;
    this.dom.cinematicTelop?.classList.add('hidden'); // 上部トーストとの重なりを防止
    this.dom.screenNovel?.classList.add('popup-open');
    if (this.dom.dialogueIllustrationImg) {
      this.dom.dialogueIllustrationImg.src = src;
    }
    if (this.dom.dialogueIllustrationCaption) {
      this.dom.dialogueIllustrationCaption.textContent = caption;
      this.dom.dialogueIllustrationCaption.classList.toggle('hidden', !caption);
    }
    this.dom.dialogueIllustrationStage.classList.remove('hidden');
    this.audio.playEvidence();
  }

  hideIllustration() {
    this.dom.dialogueIllustrationStage?.classList.add('hidden');
    if (this.dom.cutSequenceStage?.classList.contains('hidden')) {
      this.dom.screenNovel?.classList.remove('popup-open');
    }
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

    const charPitch = this.characters[speakerId]?.ttsPitch || 1.0;
    const typeStep = () => {
      if (this.charIndex < this.fullText.length) {
        if (this.dom.dialogueText) {
          this.dom.dialogueText.textContent += this.fullText[this.charIndex];
        }
        // 3文字に1回、心地よい極小のデジタルタイプ音を鳴らす（ボイスOFF時またはナレーション時）
        if (this.charIndex % 3 === 0 && !this.audio.voiceEnabled) {
          this.audio.synthesizeTypeBlip?.(charPitch);
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
    if (this.dom.dialogueText) {
      this.dom.dialogueText.innerHTML = this.decorateGlossaryTerms(this.fullText);
    }
    this.dom.dialoguePrompt?.classList.remove('hidden');

    if (this.isAutoActive && !this.isSkipActive) {
      const delay = Math.max(1600, this.fullText.length * 65);
      this.scheduleNextLine(delay);
    }
  }

  decorateGlossaryTerms(text) {
    if (!text) return '';
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(
      GLOSSARY_REGEX,
      (match) => `<span class="term-tip" data-term="${match}">${match}</span>`,
    );
  }

  positionTermPopover(pop, target) {
    const term = target.dataset.term;
    const desc = TERM_GLOSSARY[term];
    if (!desc) return;
    pop.innerHTML = `<div class="term-popover-title">🔰 用語解説：${term}</div><div>${desc}</div>`;
    pop.classList.remove('hidden');
    const rect = target.getBoundingClientRect();
    const top = Math.max(12, rect.top - pop.offsetHeight - 10);
    const left = Math.min(window.innerWidth - pop.offsetWidth - 12, Math.max(12, rect.left));
    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }

  initTermPopover() {
    if (document.getElementById('term-popover')) return;
    const pop = document.createElement('div');
    pop.id = 'term-popover';
    pop.className = 'hidden';
    document.body.appendChild(pop);

    const hideTip = () => pop.classList.add('hidden');

    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('.term-tip');
      if (t) this.positionTermPopover(pop, t);
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.term-tip')) hideTip();
    });
    document.addEventListener(
      'click',
      (e) => {
        const t = e.target.closest('.term-tip');
        if (!t) {
          hideTip();
          return;
        }
        e.stopPropagation();
        this.positionTermPopover(pop, t);
        clearTimeout(this.tipTimer);
        this.tipTimer = setTimeout(hideTip, 3500);
      },
      true,
    );
  }

  clearTypingTimer() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  advanceDialogue() {
    // 1. カットイン（章アイキャッチ等）表示中は誤クリック進行をブロック
    if (this.dom.overlayCutin && !this.dom.overlayCutin.classList.contains('hidden')) {
      return;
    }

    // 2. 文字タイピング中は全文即時表示
    if (this.isTyping) {
      this.finishTyping();
      return;
    }

    // 3. パラパラ漫画（cutSequence）が表示中でまだ次のコマがある場合は、まず次のコマへ進める
    if (
      this.currentCutSequence &&
      this.dom.cutSequenceStage &&
      !this.dom.cutSequenceStage.classList.contains('hidden')
    ) {
      if (this.currentCutIndex + 1 < this.currentCutSequence.cuts.length) {
        this.currentCutIndex += 1;
        this.renderCutFrame();
        return;
      }
      this.closeCutSequence();
    }

    this.stopVoicePlayback();
    this.queueIndex += 1;
    this.renderCurrentLine();
  }

  scheduleNextLine(ms) {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    this.autoTimer = setTimeout(() => {
      const pop = document.getElementById('term-popover');
      if (pop && !pop.classList.contains('hidden')) {
        this.scheduleNextLine(1200);
        return;
      }
      this.advanceDialogue();
    }, ms);
  }

  speakText(text, speakerId) {
    clearTimeout(this.voiceWaveFallbackTimer);
    if (!this.audio.voiceEnabled) {
      this.dom.voiceWaveIndicator?.classList.add('hidden');
      return;
    }
    const char = this.characters[speakerId] || this.characters.narrator;
    this.dom.voiceWaveIndicator?.classList.remove('hidden');

    // Web Speech API の onend 未発火バグ対策：文字数に応じた最大時間で確実に波形を消す
    const maxDuration = Math.min(12000, Math.max(2000, (text?.length || 10) * 150));
    this.voiceWaveFallbackTimer = setTimeout(() => {
      this.dom.voiceWaveIndicator?.classList.add('hidden');
    }, maxDuration);

    this.audio.speak(text, char, () => {
      clearTimeout(this.voiceWaveFallbackTimer);
      this.dom.voiceWaveIndicator?.classList.add('hidden');
    });
  }

  stopVoicePlayback() {
    clearTimeout(this.voiceWaveFallbackTimer);
    this.audio.stopVoice();
    this.dom.voiceWaveIndicator?.classList.add('hidden');
  }

  addToBacklog(speakerId, text) {
    const char = this.characters[speakerId] || { name: speakerId };
    this.backlog.push({ speaker: char.name, text });
  }

  // 6. キュー終了処理＆体験型選択肢
  handleEndOfQueue() {
    if (this.pendingRetryChoice) {
      const retry = this.pendingRetryChoice;
      this.pendingRetryChoice = null;
      this.showChoice(retry.choiceData, retry.type, retry.retryPrompt);
      return;
    }

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

  getChapterChoiceSteps(chapterData) {
    if (Array.isArray(chapterData.choiceSteps)) {
      return chapterData.choiceSteps;
    }
    const steps = [];
    if (chapterData.tacticChoice) {
      steps.push({ ...chapterData.tacticChoice, type: 'tactic' });
    }
    if (chapterData.choice) {
      steps.push({ ...chapterData.choice, type: 'forensic' });
    }
    return steps;
  }

  handleChapterProgress(chapterNum) {
    const chapterData = this.currentChapterData;
    if (!chapterData) return;

    const steps = this.getChapterChoiceSteps(chapterData);
    const nextStep = steps.find((s) => !this.hasChosenForChapter(s.id));
    if (nextStep) {
      this.showChoice(nextStep, nextStep.type || 'forensic');
      return;
    }

    // Chapter 5 最終証拠連結フェーズ (finalDeduction)
    if (chapterNum === 5 && chapterData.finalDeduction && !this.isFinalDeductionComplete) {
      this.startFinalDeduction(chapterData.finalDeduction);
      return;
    }

    this.completeChapter(chapterNum);
  }

  hasChosenForChapter(choiceId) {
    return Boolean(this.state.selectedChoices[choiceId]);
  }

  showChoice(choiceData, type = 'forensic', retryMessage = null) {
    this.stopAuto();
    this.stopSkip();
    this.stopVoicePlayback();
    this.closeCutSequence();
    this.hideIllustration();

    if (!this.dom.choiceStage) return;
    this.dom.novelWindow?.classList.add('choice-mode-hidden');
    this.setupChoiceHeader(choiceData, type);
    this.setupChoiceLogBox(choiceData);
    this.setupChoiceRetryBanner(retryMessage);
    this.renderChoiceOptions(choiceData, type);

    this.dom.choiceStage.classList.remove('hidden');
    const cardEl = this.dom.choiceStage.querySelector('.choice-modal-card');
    if (cardEl) cardEl.scrollTop = 0;
  }

  setupChoiceHeader(choiceData, type) {
    if (this.dom.choiceBadge) {
      this.dom.choiceBadge.textContent =
        choiceData.badge ||
        (type === 'tactic'
          ? '⚡ TACTICAL DECISION / 作戦判断'
          : '⚡ FORENSIC DECISION / 鑑識の決断');
    }
    if (this.dom.choiceQuestion) {
      this.dom.choiceQuestion.textContent = choiceData.question;
    }
    const hintEl = document.getElementById('choice-aria-hint');
    if (hintEl) {
      if (choiceData.hintSummary) {
        hintEl.innerHTML = `💡 <strong>アリアのナビ：</strong>${choiceData.hintSummary}`;
        hintEl.classList.remove('hidden');
      } else {
        hintEl.classList.add('hidden');
      }
    }
  }

  setupChoiceLogBox(choiceData) {
    if (choiceData.logBox && this.dom.choiceLogContainer) {
      if (this.dom.choiceLogTitle) {
        this.dom.choiceLogTitle.textContent = choiceData.logBox.title || 'FORENSIC TELEMETRY';
      }
      if (this.dom.choiceLogContent) {
        const raw = choiceData.logBox.content || '';
        const escaped = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // 鑑識の決定打となるキーワードをハイライト強調
        this.dom.choiceLogContent.innerHTML = escaped.replace(
          /(DEMOFASTLOSS|850 pps|工作表1|drivestoredirect:s:\*|91\.240\.118\.174|\[CRITICAL HIT\])/g,
          '<span class="log-highlight-key">$1</span>',
        );
      }
      this.dom.choiceLogContainer.classList.remove('hidden');
    } else {
      this.dom.choiceLogContainer?.classList.add('hidden');
    }
  }

  setupChoiceRetryBanner(retryMessage) {
    if (retryMessage && this.dom.choiceRetryBanner) {
      this.dom.choiceRetryBanner.textContent = retryMessage;
      this.dom.choiceRetryBanner.classList.remove('hidden');
    } else {
      this.dom.choiceRetryBanner?.classList.add('hidden');
    }
  }

  renderChoiceOptions(choiceData, type) {
    if (!this.dom.choiceOptions) return;
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
  }

  handleOptionSelected(choiceData, option, type = 'forensic') {
    this.dom.choiceStage?.classList.add('hidden');
    this.dom.novelWindow?.classList.remove('choice-mode-hidden');

    if (option.isCorrect === false) {
      this.handleIncorrectOption(choiceData, option, type);
      return;
    }

    this.pendingRetryChoice = null;
    this.state.recordChoice(choiceData.id, option.id);
    this.applyOptionReward(choiceData, option);

    if (type === 'tactic') {
      this.handleTacticOptionSelected(choiceData, option);
    } else {
      this.handleForensicOptionSelected(choiceData, option);
    }
  }

  applyOptionReward(choiceData, option) {
    const rewardEv =
      option?.rewardEvidence ||
      choiceData?.rewardEvidence ||
      (choiceData?.isFinalStep ? this.currentChapterData?.requiredEvidence : null);
    if (rewardEv) {
      this.state.addEvidence(rewardEv);
      this.updateEvidenceHud();
    }
  }

  handleIncorrectOption(choiceData, option, type) {
    const penalty = option.damagePenalty || 10;
    this.state.applyDefensePenalty(penalty);
    this.updateDefenseHud();
    this.audio.playSe('evidence_b');

    this.pendingRetryChoice = {
      choiceData,
      type,
      retryPrompt:
        option.retryPrompt || `❌ 調査空振り：残存資産防衛率 -${penalty}%！ 別のアプローチを選べ！`,
    };

    const reaction = option.reaction || [
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター、その仮説では異常を立証できません！ 調査時間を空費してしまいました！',
      },
    ];
    this.currentDialogueQueue = [...reaction];
    this.queueIndex = 0;
    setTimeout(() => this.renderCurrentLine(), 200);
  }

  handleTacticOptionSelected(choiceData, option) {
    this.audio.playSe('evidence_a');
    this.triggerCutin(
      choiceData.cutinText || '作戦指令承認：直ちに電脳措置を発動！',
      choiceData.cutinSub || '⚡ NCO TACTICAL DIRECTIVE / 作戦指示承認',
      'tactic',
    );
    const reaction = option.reaction || [];
    const nextDialogue = choiceData.nextDialogue || this.currentChapterData?.midDialogue || [];
    this.currentDialogueQueue = [...reaction, ...nextDialogue];
    this.queueIndex = 0;
    setTimeout(() => this.renderCurrentLine(), 800);
  }

  handleForensicOptionSelected(choiceData, option) {
    this.state.currentPhase = 'resolution';
    this.triggerCutin(
      choiceData.cutinText || '欺瞞工作を論破！ 侵入痕跡・因果関係立証！',
      choiceData.cutinSub || '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
      'forensic',
    );
    this.audio.playCutin();

    const reaction = option.reaction || [];
    const nextDialogue = choiceData.nextDialogue || this.currentChapterData?.resolution || [];
    this.currentDialogueQueue = [...reaction, ...nextDialogue];
    this.queueIndex = 0;

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

    const usedIds = this.finalDeductionData.steps
      .slice(0, this.deductionStepIndex)
      .map((s) => s.correctEvidenceId);

    const evidenceList = Object.values(this.scenario.evidence);
    evidenceList.forEach((ev) => {
      const isUsed = usedIds.includes(ev.id);
      const card = document.createElement('div');
      card.className = `deduction-card ${isUsed ? 'already-linked' : ''}`;
      card.dataset.evId = ev.id;
      card.innerHTML = `
        <div class="deduction-card-header">
          <span class="deduction-card-icon">${ev.icon}</span>
          <span class="deduction-card-title">${ev.name}</span>
          ${isUsed ? '<span class="deduction-linked-badge">✓ 立証済</span>' : ''}
        </div>
        <div class="deduction-card-desc">${ev.summary}</div>
      `;
      if (!isUsed) {
        card.addEventListener('click', () => this.handleDeductionEvidenceSelect(grid, card, ev.id));
      }
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

    this.dom.novelWindow?.classList.add('choice-mode-hidden');
    this.dom.choiceStage.classList.remove('hidden');
    const cardEl = this.dom.choiceStage.querySelector('.choice-modal-card');
    if (cardEl) cardEl.scrollTop = 0;
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
    this.dom.novelWindow?.classList.remove('choice-mode-hidden');

    this.deductionStepIndex += 1;
    const totalSteps = this.finalDeductionData.steps.length;
    const isLastStep = this.deductionStepIndex >= totalSteps;

    if (isLastStep) {
      this.triggerCutin(
        '全証拠連結完了！ 能動的サイバー防御発動承認！',
        '⚡ ACTIVE CYBER DEFENSE AUTHORIZED / 発動第1号承認',
        'gold',
      );
      this.state.addEvidence('canary_c2_origin');
      this.isFinalDeductionComplete = true;
    } else {
      this.triggerCutin(
        `証拠連結 STEP ${step.stepNumber} 立証完了！`,
        `⚡ DEDUCTION PHASE ${step.stepNumber}/${totalSteps} CLEARED`,
        'forensic',
      );
    }
    this.audio.playCutin();

    this.currentDialogueQueue = [...step.reaction];
    this.queueIndex = 0;

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
    durationMs = 1800,
  ) {
    if (!this.dom.overlayCutin) return;
    if (this.dom.cutinSub) this.dom.cutinSub.textContent = subText;
    if (this.dom.cutinText) this.dom.cutinText.textContent = text;
    if (this.dom.cutinBox) {
      this.dom.cutinBox.className = `cutin-box ${type}`;
    }

    clearTimeout(this.cutinHideTimer);
    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.remove('active');
    void this.dom.overlayCutin.offsetWidth; // 強制リフロー
    this.dom.overlayCutin.classList.add('active');

    this.cutinHideTimer = setTimeout(() => {
      this.dom.overlayCutin?.classList.remove('active');
      this.dom.overlayCutin?.classList.add('hidden');
    }, durationMs);
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

    const rankInfo = this.state.getDefenseRank();

    if (this.dom.endingRankBadge) {
      this.dom.endingRankBadge.className = `ending-rank-badge rank-${rankInfo.rank.toLowerCase()}`;
      this.dom.endingRankBadge.innerHTML = `
        <div class="rank-char">${rankInfo.rank}</div>
        <div class="rank-title">${rankInfo.title}</div>
        <div class="rank-defense">残存資産防衛率: <strong>${this.state.defenseRate}%</strong></div>
      `;
      this.dom.endingRankBadge.classList.remove('hidden');
    }

    if (this.dom.endingTitle) {
      this.dom.endingTitle.textContent = `TRUE END: 白昼の反撃と完全なる鎮火 [${rankInfo.rank} RANK]`;
    }
    if (this.dom.endingSub) {
      this.dom.endingSub.textContent =
        '能動的サイバー防御「公表なき発動第1号」達成・26,739人の尊厳と資産の救出';
    }
    if (this.dom.endingDesc) {
      this.dom.endingDesc.textContent = `${rankInfo.desc} 5,000万ドル要求の黙殺と100%直接補償による価格崩壊、潜伏ランサムのブラフ看破、そして10月27日正午の『被害者 第1号』公開と同時に発火したカナリア逆探知と非公然無害化措置の完遂。第2号以降の晒しは永久に封殺され、26,739人の日常は守り抜かれた。`;
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
        card.addEventListener('click', () => {
          this.dom.modalEvidenceList?.querySelectorAll('.evidence-card').forEach((c) => {
            c.classList.remove('selected');
          });
          card.classList.add('selected');
          this.showEvidenceDetail(ev);
        });
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
    // スマホでも詳細パネルが開いたことが即座に分かるよう自動スクロール
    requestAnimationFrame(() => {
      this.dom.modalEvidenceDetail?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
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
    return `
      <div class="gallery-archive-container">
        ${this.renderCharacterSheetsSection()}
        ${this.renderKeyItemsSection()}
        ${this.renderEvidenceArchiveSection()}
      </div>
    `;
  }

  renderCharacterSheetsSection() {
    const chars = Object.values(window.CHARACTER_DATA || {}).filter((c) => c.sheet);
    let html = `
      <div class="gallery-section-header">
        <h3 class="gallery-section-title">👥 登場人物キャラクター設定資料（三面図・表情集）</h3>
        <p class="gallery-section-desc">本作の主要登場人物の公式デザインシート（正面・側面・表情差分・装飾ディテール・カラーパレット）</p>
      </div>
      <div class="gallery-grid character-sheets-grid">
    `;

    chars.forEach((c) => {
      let spritesHtml = '';
      if (c.spritesList && c.spritesList.length > 0) {
        spritesHtml = `
          <div class="sheet-sprites-section">
            <div class="sheet-sprites-title">🎭 表情差分アセット</div>
            <div class="sheet-sprites-grid">
              ${c.spritesList
                .map(
                  (s) => `
                <a href="${s.src}" target="_blank" rel="noopener" class="sheet-sprite-card" title="${c.name} [${s.label}] 原寸表示">
                  <img src="${s.src}" alt="${s.label}" class="sheet-sprite-thumb" loading="lazy">
                  <span class="sheet-sprite-label">${s.label}</span>
                </a>
              `,
                )
                .join('')}
            </div>
          </div>
        `;
      }

      html += `
        <div class="gallery-card character-sheet-card">
          <div class="sheet-card-header">
            <span class="sheet-badge" style="border-color:${c.color}; color:${c.color}">OFFICIAL SHEET</span>
            <h4 class="sheet-name">${c.name}</h4>
          </div>
          <p class="sheet-role">${c.role}</p>
          <a href="${c.sheet}" target="_blank" rel="noopener" class="sheet-img-wrap" title="クリックして高解像度で確認">
            <img src="${c.sheet}" alt="${c.name} 設定資料" class="gallery-img sheet-img" loading="lazy">
            <span class="sheet-zoom-hint">🔍 クリックで原寸拡大</span>
          </a>
          <p class="gallery-text sheet-desc">${c.profile || ''}</p>
          ${spritesHtml}
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  renderKeyItemsSection() {
    const items = Object.values(this.scenario.items || {});
    if (items.length === 0) return '';

    const unlockMap = {
      item_canary_usb: this.state.hasEvidence('reverse_rdp_tsclient') || this.state.isGameCleared(),
      item_investor_key:
        this.state.hasEvidence('direct_compensation_matrix') || this.state.isGameCleared(),
      item_nco_directive: this.state.isGameCleared(),
    };

    let html = `
      <div class="gallery-section-header" style="margin-top: 36px;">
        <h3 class="gallery-section-title">🗝️ 重要押収・執行アイテム（KEY ASSETS）</h3>
        <p class="gallery-section-desc">作中で反撃の起点となった物理デバイス・電子執行令書・暗号監査キー</p>
      </div>
      <div class="gallery-grid key-items-grid">
    `;

    items.forEach((item) => {
      const unlocked = Boolean(unlockMap[item.id]);
      html += `
        <div class="gallery-card item-card">
          <div class="sheet-card-header">
            <span class="sheet-badge item-badge">${unlocked ? 'KEY ITEM' : 'CLASSIFIED'}</span>
            <h4 class="sheet-name">${unlocked ? `${item.icon} ${item.name}` : '🔒 機密指定アセット (未解禁)'}</h4>
          </div>
          <p class="sheet-role item-type-label">${unlocked ? item.type : '【閲覧権限ロック中】'}</p>
          <div class="sheet-img-wrap item-img-wrap">
            <img src="${item.image}" alt="${item.name}" class="gallery-img item-img ${unlocked ? '' : 'locked-mask'}" loading="lazy">
          </div>
          <p class="gallery-text item-summary" style="font-weight: 600; color: #a5f3fc; margin: 8px 0 4px 0;">
            ${unlocked ? item.summary : 'ストーリーを進めて該当章をクリアすると解禁されます。'}
          </p>
          <p class="gallery-text item-detail">${unlocked ? item.detail : ''}</p>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  renderEvidenceArchiveSection() {
    let html = `
      <div class="gallery-section-header" style="margin-top: 32px;">
        <h3 class="gallery-section-title">⚡ GHOST PROTOCOL 機密フォレンジック証拠資料</h3>
        <p class="gallery-section-desc">捜査過程で押収・解読された核心鑑識ファイル</p>
      </div>
      <div class="gallery-grid">
    `;

    Object.values(this.scenario.evidence || {}).forEach((ev) => {
      const unlocked = this.state.hasEvidence(ev.id) || this.state.isGameCleared();
      html += `
        <div class="gallery-card">
          <h4>${ev.icon} ${unlocked ? ev.name : '機密ファイル (未解禁)'}</h4>
          <p class="badge">${ev.type}</p>
          <img src="${ev.image}" alt="${ev.name}" class="gallery-img ${unlocked ? '' : 'locked-mask'}" loading="lazy">
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
      .trim()
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (/^### (.*$)/.test(trimmed)) return `<h3>${trimmed.replace(/^### /, '')}</h3>`;
        if (/^## (.*$)/.test(trimmed)) return `<h2>${trimmed.replace(/^## /, '')}</h2>`;
        if (/^# (.*$)/.test(trimmed)) return `<h1>${trimmed.replace(/^# /, '')}</h1>`;
        if (/^---+$/.test(trimmed)) return '<hr>';
        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join('\n');
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
    this.closeModal(this.dom.modalSettings);
    this.hideIllustration();
  }

  // 9. オーディオ設定＆トグル
  applyInitialAudioSettings() {
    this.audio.voiceEnabled = this.state.voiceEnabled;
    this.audio.seEnabled = this.state.seEnabled;
    this.audio.bgmEnabled = this.state.bgmEnabled;
    this.audio.setVoiceVolume(this.state.voiceVolume ?? 1.0);
    this.audio.setSeVolume(this.state.seVolume ?? 0.7);
    this.audio.setBgmVolume(this.state.bgmVolume ?? 0.2);
    this.syncAudioSettingsUI();
  }

  openSettingsModal() {
    this.syncAudioSettingsUI();
    this.openModal(this.dom.modalSettings);
    this.audio.playSe('click');
  }

  closeSettingsModal() {
    this.closeModal(this.dom.modalSettings);
    this.audio.playSe('click');
  }

  toggleSettingsModal() {
    if (this.dom.modalSettings?.classList.contains('hidden')) {
      this.openSettingsModal();
    } else {
      this.closeSettingsModal();
    }
  }

  syncSingleAudioSlider(sliderEl, badgeEl, volume) {
    const percent = Math.round((volume ?? 0) * 100);
    if (sliderEl) sliderEl.value = percent;
    if (badgeEl) badgeEl.textContent = `${percent}%`;
  }

  syncSingleMuteBtn(btnEl, statusEl, enabled) {
    if (!btnEl) return;
    btnEl.classList.toggle('muted', !enabled);
    btnEl.title = enabled ? 'クリックしてミュート' : 'クリックして解除';
    if (statusEl) {
      statusEl.textContent = enabled ? 'ON' : 'OFF';
    }
  }

  syncAudioSettingsUI() {
    this.syncSingleAudioSlider(
      this.dom.sliderBgmVolume,
      this.dom.valBgmVolume,
      this.audio.bgmVolume,
    );
    this.syncSingleAudioSlider(this.dom.sliderSeVolume, this.dom.valSeVolume, this.audio.seVolume);
    this.syncSingleAudioSlider(
      this.dom.sliderVoiceVolume,
      this.dom.valVoiceVolume,
      this.audio.voiceVolume,
    );

    this.syncSingleMuteBtn(
      this.dom.btnSettingsToggleBgm,
      this.dom.settingsBgmStatus,
      this.audio.bgmEnabled,
    );
    this.syncSingleMuteBtn(
      this.dom.btnSettingsToggleSe,
      this.dom.settingsSeStatus,
      this.audio.seEnabled,
    );
    this.syncSingleMuteBtn(
      this.dom.btnSettingsToggleVoice,
      this.dom.settingsVoiceStatus,
      this.audio.voiceEnabled,
    );

    this.updateAudioButtons();
  }

  resetAudioSettings() {
    this.audio.setBgmVolume(0.2);
    this.audio.setSeVolume(0.7);
    this.audio.setVoiceVolume(1.0);
    this.audio.bgmEnabled = true;
    this.audio.seEnabled = true;
    this.audio.voiceEnabled = true;

    this.state.bgmVolume = 0.2;
    this.state.seVolume = 0.7;
    this.state.voiceVolume = 1.0;
    this.state.bgmEnabled = true;
    this.state.seEnabled = true;
    this.state.voiceEnabled = true;
    this.state.savePersistentState();

    this.syncAudioSettingsUI();
    this.audio.playSe('correct');
  }

  toggleVoice() {
    this.audio.voiceEnabled = !this.audio.voiceEnabled;
    this.state.voiceEnabled = this.audio.voiceEnabled;
    this.state.savePersistentState();
    this.syncAudioSettingsUI();
  }

  toggleSe() {
    this.audio.seEnabled = !this.audio.seEnabled;
    this.state.seEnabled = this.audio.seEnabled;
    this.state.savePersistentState();
    this.syncAudioSettingsUI();
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
    this.syncAudioSettingsUI();
  }

  updateSingleAudioBtn(btn, enabled, iconOn, iconOff, labelText) {
    if (!btn) return;
    btn.classList.toggle('active', enabled);
    btn.style.opacity = enabled ? '1' : '0.55';
    btn.title = `${labelText}: ${enabled ? 'ON' : 'OFF'}`;
    const iconEl = btn.querySelector('.hud-btn-icon');
    const labelEl = btn.querySelector('.hud-audio-label');
    if (iconEl) iconEl.textContent = enabled ? iconOn : iconOff;
    if (labelEl) labelEl.textContent = ` ${labelText}: ${enabled ? 'ON' : 'OFF'}`;
  }

  updateAudioButtons() {
    this.updateSingleAudioBtn(this.dom.btnToggleVoice, this.audio.voiceEnabled, '🔊', '🔇', '音声');
    this.updateSingleAudioBtn(this.dom.btnToggleSe, this.audio.seEnabled, '⚡', '🔕', 'SE');
    this.updateSingleAudioBtn(this.dom.btnToggleBgm, this.audio.bgmEnabled, '🎵', '🔇', 'BGM');
  }
}

// アプリケーション起動
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new NovelApp();
});
