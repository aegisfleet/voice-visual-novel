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
    this.isAutoMode = true;
    this.autoTimer = null;
    this.lastAdvanceTime = 0;
    this.logHistory = [];
    this.collectedEvidence = new Set();

    // 言語設定 (デフォルト: ja、localStorage で保持)
    this.currentLang = localStorage.getItem('project_eve_lang') || 'ja';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.currentLang;
      if (document.body) {
        document.body.classList.toggle('lang-en', this.currentLang === 'en');
        document.body.classList.toggle('lang-ja', this.currentLang === 'ja');
      }
    }

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
      bgContainer: document.getElementById('bgContainer'),
      bgLayerA: document.getElementById('bgLayerA'),
      bgLayerB: document.getElementById('bgLayerB'),
      bgLayer: document.getElementById('bgLayerA') || document.getElementById('bgLayer'),
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
      btnSound: document.getElementById('btnSound'),
      evidenceModal: document.getElementById('evidenceModal'),
      evidenceList: document.getElementById('evidenceList'),
      evidenceDetail: document.getElementById('evidenceDetail'),
      btnCloseEvidence: document.getElementById('btnCloseEvidence'),
      btnBackEvidence: document.getElementById('btnBackEvidence'),
      evidencePopup: document.getElementById('evidencePopup'),
      evidencePopupBadge: document.getElementById('evidencePopupBadge'),
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
      endingExtraActions: document.getElementById('endingExtraActions'),
      btnReturnTitle: document.getElementById('btnReturnTitle'),
      extraSection: document.getElementById('extraSection'),
      extraLocked: document.getElementById('extraLocked'),
      extraUnlocked: document.getElementById('extraUnlocked'),

      // 言語切替 & 多言語対応用DOM要素
      btnLangJa: document.getElementById('btnLangJa'),
      btnLangEn: document.getElementById('btnLangEn'),
      btnLangHud: document.getElementById('btnLangHud'),
      titleSub: document.getElementById('titleSub'),
      startNotice: document.getElementById('startNotice'),
      portalLink: document.getElementById('portalLink'),
      extraBanner: document.getElementById('extraBanner'),
      btnExtraSamples: document.getElementById('btnExtraSamples'),
      btnExtraNovel: document.getElementById('btnExtraNovel'),
      evidenceModalTitle: document.getElementById('evidenceModalTitle'),
      logModalTitle: document.getElementById('logModalTitle'),
      endingExtraAnnounce: document.getElementById('endingExtraAnnounce'),
      btnEndingExtraNovel: document.getElementById('btnEndingExtraNovel'),
      btnEndingExtraSamples: document.getElementById('btnEndingExtraSamples')
    };

    this.updateEndingsBadge();
    this.updateUILanguage();
    this.bindEvents();
    this.setupAudioSync();
    if (this.dom.btnAuto) {
      this.dom.btnAuto.classList.toggle('active', this.isAutoMode);
    }

    // 背景レイヤー状態管理 (デュアルバッファ ＆ チラつき防止)
    this.activeBgLayer = 'A';
    this.currentBackgroundUrl = null;
    this.preloadBackgrounds();
  }

  /* ========================================================
     背景管理 ＆ デュアルバッファ・クロスフェード
     ======================================================== */
  preloadBackgrounds() {
    const bgList = new Set();
    if (this.scenario) {
      this.scenario.forEach(s => {
        if (s.background) bgList.add(s.background);
      });
    }
    bgList.add('assets/backgrounds/title_bg.jpg');

    // 最初のシーンの背景画像
    const firstBg = (this.scenario && this.scenario[0] && this.scenario[0].background) 
      ? this.scenario[0].background 
      : null;

    bgList.forEach(url => {
      const img = new Image();
      img.src = url;
      if (typeof img.decode === 'function') {
        img.decode().then(() => {
          if (url === firstBg && this.dom.bgLayerA && !this.dom.bgLayerA.style.backgroundImage) {
            this.dom.bgLayerA.style.backgroundImage = `url('${url}')`;
            this.currentBackgroundUrl = url;
          }
        }).catch(() => {
          if (url === firstBg && this.dom.bgLayerA && !this.dom.bgLayerA.style.backgroundImage) {
            this.dom.bgLayerA.style.backgroundImage = `url('${url}')`;
            this.currentBackgroundUrl = url;
          }
        });
      } else {
        img.onload = () => {
          if (url === firstBg && this.dom.bgLayerA && !this.dom.bgLayerA.style.backgroundImage) {
            this.dom.bgLayerA.style.backgroundImage = `url('${url}')`;
            this.currentBackgroundUrl = url;
          }
        };
      }
    });

    // decode非対応環境や同期フォールバック
    if (firstBg && this.dom.bgLayerA && !this.dom.bgLayerA.style.backgroundImage) {
      this.dom.bgLayerA.style.backgroundImage = `url('${firstBg}')`;
      this.currentBackgroundUrl = firstBg;
    }
  }

  changeBackground(newUrl) {
    if (!newUrl) return;
    // 同一背景画像ならDOM更新をスキップ（無駄な再描画とWebKitのチラつきを防止）
    if (this.currentBackgroundUrl === newUrl) return;

    this.currentBackgroundUrl = newUrl;

    const activeEl = (this.activeBgLayer === 'A') ? this.dom.bgLayerA : this.dom.bgLayerB;
    const inactiveEl = (this.activeBgLayer === 'A') ? this.dom.bgLayerB : this.dom.bgLayerA;

    if (!activeEl || !inactiveEl) {
      if (this.dom.bgLayer) this.dom.bgLayer.style.backgroundImage = `url('${newUrl}')`;
      return;
    }

    // 初回（まだアクティブレイヤーに背景が何もない場合）
    if (!activeEl.style.backgroundImage) {
      activeEl.style.backgroundImage = `url('${newUrl}')`;
      activeEl.classList.add('active');
      return;
    }

    // 非アクティブ側のレイヤーに新しい背景画像をセット
    inactiveEl.style.backgroundImage = `url('${newUrl}')`;

    const applyCrossFade = () => {
      // 非アクティブ側をフェードイン、現在のアクティブ側をフェードアウト
      inactiveEl.classList.add('active');
      activeEl.classList.remove('active');
      this.activeBgLayer = (this.activeBgLayer === 'A') ? 'B' : 'A';
    };

    // 画像がGPUテクスチャにデコードされた後にクロスフェードを実行
    const img = new Image();
    img.src = newUrl;
    if (typeof img.decode === 'function') {
      img.decode().then(applyCrossFade).catch(applyCrossFade);
    } else if (img.complete) {
      applyCrossFade();
    } else {
      img.onload = applyCrossFade;
      img.onerror = applyCrossFade;
    }
  }

  /* ========================================================
     多言語 (i18n) ヘルパーメソッド
     ======================================================== */
  getSceneText(scene) {
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.scenes[scene.id]) {
      return window.I18N_DATA.scenes[scene.id].textEn || scene.text;
    }
    return scene.text;
  }

  getSceneSpeaker(scene) {
    if (!scene.speaker) return null;
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.scenes[scene.id]) {
      return window.I18N_DATA.scenes[scene.id].speakerEn || scene.speaker;
    }
    return scene.speaker;
  }

  getSceneVoice(scene) {
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.scenes[scene.id]) {
      return window.I18N_DATA.scenes[scene.id].voiceFileEn || scene.voiceFile;
    }
    return scene.voiceFile;
  }

  getEvidence(evId) {
    const raw = EVIDENCE_DATABASE[evId];
    if (!raw) return null;
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.evidence[evId]) {
      const en = window.I18N_DATA.evidence[evId];
      return {
        id: evId,
        icon: raw.icon,
        title: en.titleEn || raw.title,
        category: en.categoryEn || raw.category,
        desc: en.descEn || raw.desc
      };
    }
    return raw;
  }

  getChoiceText(choice, sceneId, index) {
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.choices[sceneId]) {
      const list = window.I18N_DATA.choices[sceneId];
      if (list && list[index] && list[index].textEn) {
        return list[index].textEn;
      }
    }
    return choice.text;
  }

  getEndingData(ending) {
    if (!ending) return null;
    if (this.currentLang === 'en' && typeof window !== 'undefined' && window.I18N_DATA && window.I18N_DATA.endings[ending.type]) {
      const en = window.I18N_DATA.endings[ending.type];
      return {
        type: ending.type,
        title: en.titleEn || ending.title,
        description: en.descriptionEn || ending.description
      };
    }
    return ending;
  }

  setLanguage(lang) {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    try {
      localStorage.setItem('project_eve_lang', lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      if (document.body) {
        document.body.classList.toggle('lang-en', lang === 'en');
        document.body.classList.toggle('lang-ja', lang === 'ja');
      }
    }

    this.updateUILanguage();

    // ゲーム画面が表示中なら、現在のシーン表示および音声を即座に更新
    if (this.currentSceneId && !this.dom.gameScreen.classList.contains('hidden')) {
      const currentEntry = this.scenarioMap.get(this.currentSceneId);
      if (currentEntry) {
        const scene = currentEntry.scene;
        const newText = this.getSceneText(scene);
        const newSpeaker = this.getSceneSpeaker(scene);
        const newVoiceFile = this.getSceneVoice(scene);

        // 話者
        if (newSpeaker) {
          this.dom.speakerBox.style.display = 'block';
          this.dom.speakerName.textContent = newSpeaker;
          this.updateSpeakerTheme(scene.speaker || newSpeaker);
        } else {
          this.dom.speakerBox.style.display = 'none';
        }

        // 選択肢表示中なら再描画
        const isChoicesOpen = this.dom.choicesOverlay.classList.contains('active');
        if (isChoicesOpen) {
          if (scene.choices && scene.choices.length > 0) {
            this.showChoices(scene.choices);
          } else if (scene.present) {
            this.showPresentMenu(scene.present);
          }
        }

        // テキスト更新
        if (this.isTextTyping) {
          this.startTypewriter(newText, this.typingOnComplete);
        } else {
          this.dom.messageText.textContent = newText;
          this.currentFullText = newText;
        }

        // 音声の切り替え (選択肢選択中でなければ、新言語の音声で再再生)
        if (!isChoicesOpen) {
          this.audio.stop();
          this.audio.play({
            ...scene,
            text: newText,
            voiceFile: newVoiceFile,
            lang: this.currentLang
          });
        }
      }
    }

    // ログモーダルが表示中なら現在の言語で即座に再描画
    if (this.dom.logModal && !this.dom.logModal.classList.contains('hidden')) {
      this.showLog();
    }

    // 証拠品モーダルが表示中なら現在の言語で即座に再描画
    if (this.dom.evidenceModal && !this.dom.evidenceModal.classList.contains('hidden')) {
      this.showEvidenceModal();
    }

    // エンディングモーダルが表示中なら現在の言語で即座に再描画
    if (this.currentEnding && this.dom.endingModal && !this.dom.endingModal.classList.contains('hidden')) {
      const endingData = this.getEndingData(this.currentEnding);
      this.dom.endingTitle.textContent = endingData.title;
      this.dom.endingDesc.textContent = endingData.description;
    }
  }

  toggleLanguage() {
    const nextLang = (this.currentLang === 'ja') ? 'en' : 'ja';
    this.setLanguage(nextLang);
  }

  updateUILanguage() {
    const isEn = (this.currentLang === 'en');
    const t = (typeof window !== 'undefined' && window.I18N_DATA) ? (window.I18N_DATA.ui[this.currentLang] || window.I18N_DATA.ui.ja) : null;
    if (!t) return;

    // 言語ボタン状態
    if (document.body) {
      document.body.classList.toggle('lang-en', isEn);
      document.body.classList.toggle('lang-ja', !isEn);
    }
    if (this.dom.btnLangJa) this.dom.btnLangJa.classList.toggle('active', !isEn);
    if (this.dom.btnLangEn) this.dom.btnLangEn.classList.toggle('active', isEn);
    if (this.dom.btnLangHud) this.dom.btnLangHud.textContent = isEn ? 'JP' : 'EN';

    // タイトル画面
    if (this.dom.titleSub) this.dom.titleSub.textContent = t.titleSub;
    if (this.dom.btnStart) {
      const btnText = this.dom.btnStart.querySelector('.btn-text');
      if (btnText) btnText.textContent = t.startBtn;
    }
    if (this.dom.startNotice) this.dom.startNotice.innerHTML = t.startNotice;
    if (this.dom.portalLink) this.dom.portalLink.textContent = t.portalLink;
    if (this.dom.reinvestigationBanner) this.dom.reinvestigationBanner.innerHTML = t.reinvestBanner;
    if (this.dom.extraLocked) this.dom.extraLocked.textContent = t.extraLocked;
    if (this.dom.extraBanner) this.dom.extraBanner.textContent = t.extraUnlocked;
    if (this.dom.btnExtraSamples) this.dom.btnExtraSamples.textContent = t.btnExtraSamples;
    if (this.dom.btnExtraNovel) this.dom.btnExtraNovel.textContent = t.btnExtraNovel;

    // HUD
    if (this.dom.btnEvidence) {
      const lbl = this.dom.btnEvidence.querySelector('.btn-label');
      if (lbl) lbl.textContent = t.btnEvidence;
    }

    // モーダル
    if (this.dom.evidenceModalTitle) this.dom.evidenceModalTitle.textContent = t.evidenceArchiveTitle;
    if (this.dom.btnBackEvidence) this.dom.btnBackEvidence.textContent = t.btnBack;
    if (this.dom.btnCloseEvidence) this.dom.btnCloseEvidence.textContent = t.btnClose;
    if (this.dom.logModalTitle) this.dom.logModalTitle.textContent = t.logTitle;
    if (this.dom.btnBackLog) this.dom.btnBackLog.textContent = t.btnBack;
    if (this.dom.btnCloseLog) this.dom.btnCloseLog.textContent = t.btnClose;
    if (this.dom.btnReturnTitle) this.dom.btnReturnTitle.textContent = t.btnReturnTitle;
    if (this.dom.endingExtraAnnounce) this.dom.endingExtraAnnounce.textContent = t.endingExtraAnnounce;
    if (this.dom.btnEndingExtraNovel) this.dom.btnEndingExtraNovel.textContent = t.endingExtraNovel;
    if (this.dom.btnEndingExtraSamples) this.dom.btnEndingExtraSamples.textContent = t.endingExtraSamples;

    // バッジ
    this.updateEndingsBadge();
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
    // 言語切替 (JP / EN)
    if (this.dom.btnLangJa) {
      this.dom.btnLangJa.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.setLanguage('ja');
      });
    }
    if (this.dom.btnLangEn) {
      this.dom.btnLangEn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.setLanguage('en');
      });
    }
    if (this.dom.btnLangHud) {
      this.dom.btnLangHud.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClickSound();
        this.toggleLanguage();
      });
    }

    // サウンド切替 (BGM/SE ミュート)
    if (this.dom.btnSound) {
      this.dom.btnSound.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMuted = this.audio.toggleMute();
        this.dom.btnSound.textContent = isMuted ? '🔇' : '🔊';
        this.dom.btnSound.classList.toggle('muted', isMuted);
      });
    }

    // タイトル開始 (モバイル音声アンロック ＆ BGM開始)
    this.dom.btnStart.addEventListener('click', () => {
      this.audio.unlockAudio();
      this.audio.playClickSound();
      this.audio.playBGM("assets/audio/bgm_title.mp3");
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
      this.audio.unlockAudio();
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
        } else if (!this.dom.gameScreen.classList.contains('hidden') && !this.dom.choicesOverlay.classList.contains('active')) {
          this.handleUserAdvance();
        }
      }
    });

    // モバイル/LINE内蔵ブラウザ閉じる・非表示時のAUTO即時停止
    const handleHide = () => {
      this.pauseAutoMode();
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          handleHide();
        }
      });
    }
    window.addEventListener('pagehide', handleHide);
    window.addEventListener('beforeunload', handleHide);
  }

  /**
   * 画面非表示・ブラウザ終了時のAUTOモードおよび全音声の即時完全停止
   */
  pauseAutoMode() {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;

    if (this.isAutoMode) {
      this.isAutoMode = false;
      if (this.dom.btnAuto) {
        this.dom.btnAuto.classList.remove('active');
      }
    }

    if (this.isTextTyping) {
      this.completeTyping();
    }

    if (this.audio) {
      this.audio.stop();
      if (typeof this.audio.pauseAll === 'function') {
        this.audio.pauseAll();
      }
    }
  }

  setupAudioSync() {
    this.audio.onSpeechStart = () => {
      if (this.currentSceneId && !this.dom.gameScreen.classList.contains('hidden')) {
        this.character.setTalking(true);
      }
    };

    this.audio.onSpeechEnd = () => {
      this.character.setTalking(false);
      if (this.currentSceneId && !this.dom.gameScreen.classList.contains('hidden')) {
        this.checkAutoAdvance(true);
      }
    };

    // 音声波形・音量リアルタイムフレーム同期 (口パク & 息継ぎ目パチ)
    this.audio.onAudioFrame = (volume, isSilence, silenceDuration) => {
      if (this.character && typeof this.character.onAudioFrame === 'function') {
        this.character.onAudioFrame(volume, isSilence, silenceDuration);
      }
    };
  }

  checkAutoAdvance(fromSpeechEnd = false) {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
    if (!this.isAutoMode) return;

    // タイトル画面表示中またはゲーム画面非表示の場合は自動進行を即座に停止
    if (!this.currentSceneId || !this.dom.gameScreen || this.dom.gameScreen.classList.contains('hidden')) {
      return;
    }

    if (this.isTextTyping || this.audio.isPlaying) return;

    const currentEntry = this.scenarioMap.get(this.currentSceneId);
    if (!currentEntry) return;
    const scene = currentEntry.scene;

    if ((scene.choices && scene.choices.length > 0) || scene.present || scene.ending) return;

    let readingDelay = 600;
    if (!fromSpeechEnd) {
      const curText = this.getSceneText(scene) || '';
      const textLen = curText.length;
      readingDelay = (this.currentLang === 'en')
        ? Math.min(3600, Math.max(1600, textLen * 28))
        : Math.min(3000, Math.max(1400, textLen * 40));
    }

    this.autoTimer = setTimeout(() => {
      if (this.isAutoMode && !this.isTextTyping && !this.audio.isPlaying && this.currentSceneId && !this.dom.gameScreen.classList.contains('hidden')) {
        this.advanceNext();
      }
    }, readingDelay);
  }

  handleUserAdvance() {
    if (!this.currentSceneId || !this.dom.gameScreen || this.dom.gameScreen.classList.contains('hidden')) {
      return;
    }

    // 連続タップによる短時間の多重進行を防止（180ms デバウンス）
    const now = Date.now();
    if (this.lastAdvanceTime && (now - this.lastAdvanceTime < 180)) {
      return;
    }
    this.lastAdvanceTime = now;

    clearTimeout(this.autoTimer);
    this.autoTimer = null;

    if (this.isTextTyping) {
      this.completeTyping();
    } else {
      this.advanceNext();
    }
  }

  advanceNext() {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;

    if (!this.currentSceneId || !this.dom.gameScreen || this.dom.gameScreen.classList.contains('hidden')) {
      return;
    }

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
    // 直前の音声を即座に安全停止
    this.audio.stop();

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
    const text = this.getSceneText(scene);
    const speaker = this.getSceneSpeaker(scene);
    const voiceFile = this.getSceneVoice(scene);

    // ログ記録
    this.logHistory.push({
      sceneId: scene.id,
      scene: scene,
      speaker: speaker,
      text: text
    });

    // BGM切り替え (Lyria 3 生成音源)
    if (scene.bgm) {
      this.audio.playBGM(scene.bgm);
    } else if (scene.bgm === null || scene.bgm === 'stop') {
      this.audio.stopBGM();
    }

    // 背景切り替え (デュアルバッファ・クロスフェード)
    if (scene.background) {
      this.changeBackground(scene.background);
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
    if (speaker) {
      this.dom.speakerBox.style.display = 'block';
      this.dom.speakerName.textContent = speaker;
      this.updateSpeakerTheme(scene.speaker || speaker);
    } else {
      this.dom.speakerBox.style.display = 'none';
    }

    // 音声再生 (言語に応じた音声ファイルまたはWeb Speech)
    this.audio.play({
      ...scene,
      text: text,
      voiceFile: voiceFile,
      lang: this.currentLang
    });

    // テキストタイピング開始
    this.startTypewriter(text, () => {
      if (scene.choices && scene.choices.length > 0) {
        this.showChoices(scene.choices);
      } else if (scene.present) {
        this.showPresentMenu(scene.present);
      }
    });
  }

  updateSpeakerTheme(speaker) {
    if (!speaker) return;
    const s = speaker.toLowerCase();
    if (speaker.includes('アイリス') || s.includes('iris')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)';
    } else if (speaker.includes('イブ') || s.includes('eve')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)';
    } else if (speaker.includes('サクマ') || s.includes('sakuma')) {
      this.dom.speakerBox.style.background = 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)';
    } else if (speaker.includes('シノハラ') || s.includes('shinohara')) {
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
      this.dom.messageText.scrollTop = 0;
    }
    this.dom.nextIndicator.style.opacity = '1';
    if (this.typingOnComplete) {
      const cb = this.typingOnComplete;
      this.typingOnComplete = null;
      cb();
    }
    // 音声再生中なら音声終了(onSpeechEnd)で自動進行するため、非再生時のみ読了タイマーをセット
    if (!this.audio.isPlaying) {
      this.checkAutoAdvance();
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

    const reinvestTagText = (this.currentLang === 'en') ? '[FILE RE-OPEN]' : '【再捜査 FILE RE-OPEN】';

    availableChoices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';

      const choiceText = this.getChoiceText(choice, this.currentSceneId, index);

      if (choice.requiresReinvestigation) {
        btn.innerHTML = `<span class="reinvest-tag">${reinvestTagText}</span><br>${choiceText}`;
        btn.classList.add('reinvest-choice');
      } else {
        btn.textContent = choiceText;
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
    const t = (typeof window !== 'undefined' && window.I18N_DATA) ? (window.I18N_DATA.ui[this.currentLang] || window.I18N_DATA.ui.ja) : null;
    const bannerText = t ? t.presentBanner : '⚡ 【証拠品をつきつけて真実を立証せよ！】 ⚡';
    const giveUpText = t ? t.giveUpBtnText : '⚠️ 「……サクマ警視を止める客観的証拠はない」（初期化を容認）';

    this.dom.choicesList.innerHTML = `
      <div class="present-banner">
        ${bannerText}
      </div>
    `;

    const successJump = presentConfig.correctJump || presentConfig.onSuccess;
    const failJump = presentConfig.wrongJump || presentConfig.onFailure;
    const giveUpJump = presentConfig.giveUpJump || failJump;

    // 所持している証拠品ボタン
    this.collectedEvidence.forEach((evId) => {
      const ev = this.getEvidence(evId);
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
        ${giveUpText}
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
    const ev = this.getEvidence(evId);
    if (!ev) return;

    this.collectedEvidence.add(evId);
    this.updateEvidenceBadge();
    this.audio.playEvidenceObtained();

    if (this.fx) {
      this.fx.triggerFlash([0.0, 0.95, 1.0], 0.6, 300);
    }

    const isEn = (this.currentLang === 'en');
    const badgeText = isEn ? 'EVIDENCE OBTAINED' : '証拠品入手';
    if (this.dom.evidencePopupBadge) {
      this.dom.evidencePopupBadge.textContent = badgeText;
      this.dom.evidencePopupText.textContent = ev.title;
    } else {
      const prefix = isEn ? 'Evidence Obtained: ' : '証拠品入手: ';
      this.dom.evidencePopupText.textContent = `${prefix}${ev.title}`;
    }
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
    const isEn = (this.currentLang === 'en');
    if (this.collectedEvidence.size === 0) {
      const emptyMsg = isEn ? 'No evidence currently in possession.' : '現在所持している証拠品はありません。';
      this.dom.evidenceList.innerHTML = `<p class="empty-notice">${emptyMsg}</p>`;
      this.dom.evidenceDetail.innerHTML = '';
    } else {
      let first = true;
      this.collectedEvidence.forEach((evId) => {
        const ev = this.getEvidence(evId);
        if (!ev) return;
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
    this.currentEnding = ending;
    this.audio.stop();
    this.character.hide();

    this.saveEndingCleared(ending.type);
    this.checkReinvestigationStatus();
    this.updateEndingsBadge();

    const endingData = this.getEndingData(ending);

    this.dom.endingType.textContent = `${ending.type} END`;
    this.dom.endingType.className = `ending-type-badge ending-${ending.type.toLowerCase()}`;
    this.dom.endingTitle.textContent = endingData.title;
    this.dom.endingDesc.textContent = endingData.description;

    // TRUE END達成時の特典表示切り替え
    if (this.dom.endingExtraActions) {
      this.dom.endingExtraActions.style.display = (ending.type === 'TRUE') ? 'block' : 'none';
    }

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
      const isEn = (this.currentLang === 'en');
      const bad = cleared.includes('BAD') ? 'cleared' : '';
      const trueEnd = cleared.includes('TRUE') ? 'cleared' : '';

      const badStatus = cleared.includes('BAD') ? (isEn ? 'Cleared' : '達成済') : (isEn ? 'Incomplete' : '未達成');
      const trueStatus = cleared.includes('TRUE') ? (isEn ? 'Cleared' : '達成済') : (isEn ? 'Incomplete' : '未達成');

      this.dom.endingsBadge.innerHTML = `
        <span class="badge-item ${bad}">❌ BAD END: ${badStatus}</span>
        <span class="badge-item ${trueEnd}">🌟 TRUE END: ${trueStatus}</span>
      `;

      if (this.dom.reinvestigationBanner) {
        if (cleared.includes('BAD')) {
          this.dom.reinvestigationBanner.style.display = 'block';
        } else {
          this.dom.reinvestigationBanner.style.display = 'none';
        }
      }

      // TRUE ENDクリア後のおまけ（EXTRA）解放判定
      if (this.dom.extraLocked && this.dom.extraUnlocked) {
        if (cleared.includes('TRUE')) {
          this.dom.extraLocked.style.display = 'none';
          this.dom.extraUnlocked.style.display = 'block';
        } else {
          this.dom.extraLocked.style.display = 'block';
          this.dom.extraUnlocked.style.display = 'none';
        }
      }
    } catch {}
  }

  getLogItem(entry) {
    const scene = entry.scene || (entry.sceneId ? this.scenarioMap.get(entry.sceneId)?.scene : null);
    if (scene) {
      const spk = this.getSceneSpeaker(scene);
      const txt = this.getSceneText(scene);
      const defaultSpeaker = (this.currentLang === 'en') ? 'Scene' : '状況';
      return {
        speaker: spk || defaultSpeaker,
        text: txt
      };
    }
    return {
      speaker: entry.speaker || ((this.currentLang === 'en') ? 'Scene' : '状況'),
      text: entry.text || ''
    };
  }

  showLog() {
    this.dom.logContent.innerHTML = this.logHistory.map(entry => {
      const item = this.getLogItem(entry);
      return `
        <div class="log-item">
          <div class="log-speaker">${item.speaker}</div>
          <div class="log-text">${item.text}</div>
        </div>
      `;
    }).join('');
    this.dom.logModal.classList.remove('hidden');
    this.dom.logContent.scrollTop = this.dom.logContent.scrollHeight;
  }

  returnToTitle() {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
    clearInterval(this.typewriterTimer);
    this.typewriterTimer = null;
    this.isTextTyping = false;
    this.currentSceneId = null;

    this.audio.stop();
    this.audio.playBGM("assets/audio/bgm_title.mp3");

    this.character.hide();
    this.character.setTalking(false);

    this.dom.gameScreen.classList.add('hidden');
    this.dom.endingModal.classList.add('hidden');
    this.dom.choicesOverlay.classList.remove('active');
    this.dom.evidenceModal.classList.add('hidden');
    this.dom.logModal.classList.add('hidden');

    if (this.dom.evidencePopup) {
      this.dom.evidencePopup.classList.remove('show');
      this.dom.evidencePopup.classList.add('hidden');
    }
    if (this.dom.objectionCutin) {
      this.dom.objectionCutin.classList.remove('play');
      this.dom.objectionCutin.classList.add('hidden');
    }
    if (this.fx) {
      this.fx.setHologramMode(false);
    }

    this.dom.titleScreen.classList.remove('hidden');
    this.checkReinvestigationStatus();
    this.updateEndingsBadge();

    // 次回ゲーム開始時の背景表示に備えて第1シーン背景を事前準備
    this.currentBackgroundUrl = null;
    const firstBg = (this.scenario && this.scenario[0] && this.scenario[0].background) ? this.scenario[0].background : null;
    if (firstBg && this.dom.bgLayerA) {
      this.dom.bgLayerA.style.backgroundImage = `url('${firstBg}')`;
      this.dom.bgLayerA.classList.add('active');
      if (this.dom.bgLayerB) {
        this.dom.bgLayerB.classList.remove('active');
        this.dom.bgLayerB.style.backgroundImage = '';
      }
      this.activeBgLayer = 'A';
      this.currentBackgroundUrl = firstBg;
    }
  }
}

window.GameEngine = GameEngine;
