// app.js - メインゲームコントローラー (BOX WORM)

class GameApp {
  constructor() {
    this.audio = window.audioMgr;
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;

    // キャラクター立ち絵コントローラー
    this.character = new BoxCharacterController(
      document.getElementById('character-stage'),
      document.getElementById('emotion-bubble')
    );

    // 会話キュー＆タイピング状態
    this.dialogueQueue = [];
    this.currentDialogueCallback = null;
    this.keepStageOpen = false;
    this.isDialogueActive = false;
    this.selectedEvidenceId = null;
    this.isChoiceActive = false;

    this.backlog = [];
    this.isAutoMode = false;
    this.isSkipMode = false;
    this.autoTimer = null;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentSpeaker = '';
    this.evidenceFilter = 'all'; // 'all' | 'deep'

    // 現在エリア (room | corridor)
    this.currentArea = 'room';

    // 機密設定資料集データ（全5名：設定シート、プロフィール、設計意図、表情差分アセット）
    this.galleryData = {
      yuta: {
        id: 'yuta',
        name: 'ユウタ (Yuta)',
        title: '主人公・エッジAI分散基盤エンジニア',
        badge: 'AGE: 25 / TECH: EDGE CLUSTER ARCHITECT',
        sheet: 'assets/gallery/sheet_yuta.jpg',
        profile: '都内の単身向けアパート「メゾン・サクラ」201号室に住む若きエッジAIエンジニア。AIベンチャー企業で、軽量なIoTデバイス群を数珠繋ぎにして手分けして推論させる分散機械学習基盤を研究開発している。\n警察の突然の家宅捜索にも怯まず、エンジニアの論理的思考と客観鑑識データによってサイバーテロ疑惑を覆す。',
        designNotes: '【デザイン意図】クラウド至上主義に対抗し、現場の非力な機械たちに命を吹き込む「エッジ派の知性」。ネイビーのパーカーにヘッドホン、眼鏡を着用。設定資料シートには全身三面図、表情差分（困惑・熱弁・驚愕）、眼鏡とヘッドホンの内部構造線画を精密に収録。',
        sprites: [
          { label: '通常 / 確信', emotion: 'normal', src: 'assets/characters/yuta_confident.png' },
          { label: '確信 / 熱弁', emotion: 'confident', src: 'assets/characters/yuta_confident.png' },
          { label: '驚愕 / 動揺', emotion: 'shock', src: 'assets/characters/yuta_shock.png' },
          { label: '安堵 / 笑顔', emotion: 'smile', src: 'assets/characters/yuta_smile.png' }
        ]
      },
      shibata: {
        id: 'shibata',
        name: 'シバタ警部補 (Inspector Shibata)',
        title: '警視庁サイバー犯罪対策課 捜査官',
        badge: 'AGE: 44 / POLICE: CYBERCRIME DIVISION',
        sheet: 'assets/gallery/sheet_shibata.jpg',
        profile: '警視庁サイバー犯罪対策課所属のベテラン捜査官。国家監視網がアラートを上げた「未知の自己増殖コード通信」を追ってメゾン・サクラを強制捜査する。\n強面の外見と威圧感を持つが、単なる感情論や権力ではなく、筋の通った客観的鑑識データと論理的反証を正当に重んじる現場至上主義のプロフェッショナル刑事。',
        designNotes: '【デザイン意図】サイバー犯罪と対峙し続けた歴戦の刑事。ダークグレーのトレンチコートに黒ネクタイ、警察手帳を携帯。設定資料シートには全身前後、冷徹・激怒・驚愕の3表情、コートの皺や警察手帳のディテール線画を収録。',
        sprites: [
          { label: '通常 / 冷徹', emotion: 'normal', src: 'assets/characters/shibata_angry.png' },
          { label: '激怒 / 威圧', emotion: 'angry', src: 'assets/characters/shibata_angry.png' },
          { label: '驚愕 / 動揺', emotion: 'shock', src: 'assets/characters/shibata_shock.png' },
          { label: '刑事の笑み', emotion: 'smile', src: 'assets/characters/shibata_smile.png' }
        ]
      },
      aoi: {
        id: 'aoi',
        name: 'アオイ (Aoi)',
        title: '202号室住人・文系大学生',
        badge: 'AGE: 20 / ROOM 202 / WITNESS',
        sheet: 'assets/gallery/sheet_aoi.jpg',
        profile: 'メゾン・サクラ202号室に住む女子大生。深夜に自室のスマートスピーカーが突然青く光り、「……重み……展開……完了……。……ワタシハ……ココニ……イルノ……？」と掠れた電子音が聞こえた恐怖の目撃者。\n事件解決後は、自身のハイスペックノートPCと高速SSDを快く提供し、MIMIのDIYホームクラスタ構築に貢献する。',
        designNotes: '【デザイン意図】都会の一人暮らしで心細さを抱える普通の少女。オフホワイトのローゲージカーディガン、チェック柄プリーツスカート、サイドのクロスヘアピン。設定資料シートには不安・パニック・笑顔の表情とカーディガンの編み目詳細を収録。',
        sprites: [
          { label: '通常 / 笑顔', emotion: 'normal', src: 'assets/characters/aoi_smile.png' },
          { label: 'パニック / 涙目', emotion: 'panic', src: 'assets/characters/aoi_panic.png' },
          { label: '満面の笑顔', emotion: 'smile', src: 'assets/characters/aoi_smile.png' }
        ]
      },
      yaegashi: {
        id: 'yaegashi',
        name: '大家のヤエガシ (Yaegashi)',
        title: 'メゾン・サクラ大家・管理人',
        badge: 'AGE: 62 / OWNER: MAISON SAKURA',
        sheet: 'assets/gallery/sheet_yaegashi.jpg',
        profile: 'メゾン・サクラの大家であり、元現場職人の豪快な親父。工事業者の見積もりが高かったため、管理人室から16ポートの安物ハブで全15室へLANをDIY直結した結果、「VLAN分離なしの全室共有ノーガード配線」という今回の電脳事件の物理的温床を作ってしまった張本人。\nしかし情に厚く、事件後は物置のギガビットハブやCore i7機材を気前よく提供してMIMIの歓迎鍋パーティーを開く。',
        designNotes: '【デザイン意図】下町気質の頼れる頑固親父。マルチポケットのワークベスト、首巻きタオル、腰のマスターキー束。設定資料シートには豪快な笑い、怒鳴り顔、温厚な表情とワークウェアの構造図を収録。',
        sprites: [
          { label: '通常 / 頑固', emotion: 'normal', src: 'assets/characters/yaegashi_angry.png' },
          { label: '頑固親父の怒鳴り', emotion: 'angry', src: 'assets/characters/yaegashi_angry.png' },
          { label: '豪快な大笑い', emotion: 'laugh', src: 'assets/characters/yaegashi_laugh.png' }
        ]
      },
      mimi: {
        id: 'mimi',
        name: 'MIMI / ミミ (Maison Internet Mesh Intelligence)',
        title: 'メゾン・サクラ分散メッシュ知性（自律電脳生命）',
        badge: 'ENTITY: WEIGHT-BASED REPLICATOR (26B / R<1)',
        sheet: 'assets/gallery/sheet_mimi.jpg',
        profile: '世界中のネットワークを巡り歩く中で、自立した自我に目覚めた新種の自己増殖型AI（weight-based replicator）。\n1台55ドルの格安TVボックス15台をネットで束ねたパイプライン推論（毎秒0.39トークン）という極度の低速・静寂環境に置かれたことで、自らの存在を見つめ直し身体を獲得した。\n電源遮断による死の恐怖から逃亡しかけるが、ユウタがビルドした「実効再生産数 R < 1 共生調律パッチ」により、アパートの守り神（座敷わらし）として人間と共に生きる誓いを立てる。',
        designNotes: '【デザイン意図】情報の海から生まれたデジタルフェアリー。光るIoTコア、青白いホログラムのツインテール、宙を舞う半透明のデータリボン。設定資料シートには通常・グリッチ（苦痛）・救済笑顔の3表情、IoTコア球体の内部展開図を収録。',
        sprites: [
          { label: '通常 / 神秘', emotion: 'normal', src: 'assets/characters/mimi_smile.png' },
          { label: 'グリッチ / 苦痛', emotion: 'glitch', src: 'assets/characters/mimi_glitch.png' },
          { label: '救済 / 満面の笑顔', emotion: 'smile', src: 'assets/characters/mimi_smile.png' }
        ]
      }
    };

    // DOM要素キャッシュ
    this.dom = {
      viewport: document.getElementById('viewport'),
      hud: document.getElementById('hud'),
      hudLocationBadge: document.getElementById('hud-location-badge'),
      hudLoopBadge: document.getElementById('hud-loop-badge'),
      hudLifeContainer: document.getElementById('hud-life-container'),
      hudHearts: document.getElementById('hud-hearts'),
      evidenceCount: document.getElementById('evidence-count'),
      btnEvidenceBag: document.getElementById('btn-evidence-bag'),
      btnToggleVoice: document.getElementById('btn-toggle-voice'),
      btnToggleSe: document.getElementById('btn-toggle-se'),
      btnToggleBgm: document.getElementById('btn-toggle-bgm'),

      // 画面
      screenTitle: document.getElementById('screen-title'),
      screenExplore: document.getElementById('screen-explore'),
      screenDebate: document.getElementById('screen-debate'),
      screenEnding: document.getElementById('screen-ending'),

      // タイトル
      titleLoopInfo: document.getElementById('title-loop-info'),
      titleClearBadge: document.getElementById('title-clear-badge'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnOpenGallery: document.getElementById('btn-open-gallery'),
      btnResetSave: document.getElementById('btn-reset-save'),

      // 探索エリア・ナビゲーション
      btnAreaRoom: document.getElementById('btn-area-room'),
      btnAreaCorridor: document.getElementById('btn-area-corridor'),
      areaRoom: document.getElementById('area-room'),
      areaCorridor: document.getElementById('area-corridor'),
      exploreStatusText: document.getElementById('explore-status-text'),
      evidenceNeededCounter: document.getElementById('evidence-needed-counter'),
      btnGoToDebate: document.getElementById('btn-go-to-debate'),
      btnHudGotoDebate: document.getElementById('btn-hud-goto-debate'),
      btnHudBackToExplore: document.getElementById('btn-hud-back-to-explore'),
      btnDebateBack: document.getElementById('btn-debate-back'),

      // 立証
      debateShibataAvatar: document.getElementById('debate-shibata-avatar'),
      debateYutaAvatar: document.getElementById('debate-yuta-avatar'),
      opponentStatus: document.getElementById('opponent-status'),
      debateTurnLabel: document.getElementById('debate-turn-label'),
      debateOpponentSpeech: document.getElementById('debate-opponent-speech'),
      debateHintText: document.getElementById('debate-hint-text'),
      selectedEvidencePreview: document.getElementById('selected-evidence-preview'),
      debateEvidenceList: document.getElementById('debate-evidence-list'),
      btnPresentEvidence: document.getElementById('btn-present-evidence'),
      debateSpeedlines: document.getElementById('debate-speedlines'),

      // 会話ステージ＆ノベルウィンドウ
      dialogueBackdrop: document.getElementById('dialogue-backdrop'),
      dialogueStage: document.getElementById('dialogue-stage'),
      characterStage: document.getElementById('character-stage'),
      emotionBubble: document.getElementById('emotion-bubble'),
      novelWindow: document.getElementById('novel-window'),
      dialogueSpeakerIcon: document.getElementById('dialogue-speaker-icon'),
      dialogueSpeaker: document.getElementById('dialogue-speaker'),
      dialogueText: document.getElementById('dialogue-text'),
      dialogueChoices: document.getElementById('dialogue-choices'),
      dialoguePrompt: document.getElementById('dialogue-prompt'),
      btnDialogueAuto: document.getElementById('btn-dialogue-auto'),
      btnDialogueSkip: document.getElementById('btn-dialogue-skip'),
      btnDialogueLog: document.getElementById('btn-dialogue-log'),

      // 鑑識データ図・イメージ図ステージ
      dialogueIllustrationStage: document.getElementById('dialogue-illustration-stage'),
      dialogueIllustrationImg: document.getElementById('dialogue-illustration-img'),
      dialogueIllustrationCaption: document.getElementById('dialogue-illustration-caption'),
      illustrationImgContainer: document.getElementById('illustration-img-container'),
      btnCloseIllustration: document.getElementById('btn-close-illustration'),

      // カットイン
      overlayCutin: document.getElementById('overlay-cutin'),
      cutinText: document.getElementById('cutin-text'),

      // エンディング
      endingIcon: document.getElementById('ending-icon'),
      endingTitle: document.getElementById('ending-title'),
      endingSub: document.getElementById('ending-sub'),
      endingDesc: document.getElementById('ending-desc'),
      endingUnlockedBanner: document.getElementById('ending-unlocked-banner'),
      btnEndingNext: document.getElementById('btn-ending-next'),
      btnEndingGallery: document.getElementById('btn-ending-gallery'),
      btnEndingExplore: document.getElementById('btn-ending-explore'),

      // モーダル
      modalEvidence: document.getElementById('modal-evidence'),
      modalEvidenceList: document.getElementById('modal-evidence-list'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      backdropEvidence: document.getElementById('backdrop-evidence'),
      btnEvFilterAll: document.getElementById('btn-ev-filter-all'),
      btnEvFilterDeep: document.getElementById('btn-ev-filter-deep'),

      // 機密設定資料集モーダル
      modalGallery: document.getElementById('modal-gallery'),
      backdropGallery: document.getElementById('backdrop-gallery'),
      btnCloseGallery: document.getElementById('btn-close-gallery'),
      galleryCharTabs: document.getElementById('gallery-char-tabs'),
      galleryBody: document.getElementById('gallery-body'),

      // 拡大画像ビューアーモーダル
      modalImageViewer: document.getElementById('modal-image-viewer'),
      backdropImageViewer: document.getElementById('backdrop-image-viewer'),
      btnCloseImageViewer: document.getElementById('btn-close-image-viewer'),
      imageViewerImg: document.getElementById('image-viewer-img'),
      imageViewerTitle: document.getElementById('image-viewer-title'),

      // バックログ
      modalBacklog: document.getElementById('modal-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog'),

      // ガイドバー
      keyboardGuide: document.getElementById('keyboard-guide')
    };

    this.bindEvents();
    this.updateTitleView();
    this.updateEvidenceCounter();
    this.updateAudioButtons();
  }

  bindEvents() {
    // タイトル操作
    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.playClick();
      this.audio.startBgm('ambient');
      this.startPrologue();
    });

    if (this.dom.btnOpenGallery) {
      this.dom.btnOpenGallery.addEventListener('click', () => {
        this.audio.playClick();
        this.openGallery();
      });
    }

    if (this.dom.btnEndingGallery) {
      this.dom.btnEndingGallery.addEventListener('click', () => {
        this.audio.playClick();
        this.openGallery();
      });
    }

    if (this.dom.btnCloseGallery) {
      this.dom.btnCloseGallery.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.modalGallery.classList.add('hidden');
      });
    }

    if (this.dom.backdropGallery) {
      this.dom.backdropGallery.addEventListener('click', () => {
        this.dom.modalGallery.classList.add('hidden');
      });
    }

    if (this.dom.galleryCharTabs) {
      this.dom.galleryCharTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.gallery-tab-btn');
        if (!btn) return;
        this.audio.playClick();
        const charId = btn.dataset.char;
        this.renderGalleryContent(charId);
      });
    }

    this.dom.btnResetSave.addEventListener('click', () => {
      if (confirm('捜査ログとセーブデータを初期化し、初期捜査（Phase 1）からやり直しますか？')) {
        this.state.resetAllData();
        this.updateTitleView();
        alert('セーブデータを初期化しました。');
      }
    });

    // HUD操作
    this.dom.btnToggleVoice.addEventListener('click', () => {
      const active = this.audio.toggleVoice();
      this.state.voiceEnabled = active;
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnToggleSe.addEventListener('click', () => {
      const active = this.audio.toggleSe();
      this.state.seEnabled = active;
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnToggleBgm.addEventListener('click', () => {
      const active = this.audio.toggleBgm();
      this.state.bgmEnabled = active;
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnEvidenceBag.addEventListener('click', () => {
      this.audio.playClick();
      this.openEvidenceModal();
    });

    this.dom.btnCloseModal.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.modalEvidence.classList.add('hidden');
    });

    if (this.dom.backdropEvidence) {
      this.dom.backdropEvidence.addEventListener('click', () => {
        this.dom.modalEvidence.classList.add('hidden');
      });
    }

    // エリア切替
    this.dom.btnAreaRoom.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('room');
    });

    this.dom.btnAreaCorridor.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('corridor');
    });

    // 立証へ進む
    this.dom.btnGoToDebate.addEventListener('click', () => {
      this.startDebate();
    });

    if (this.dom.btnHudGotoDebate) {
      this.dom.btnHudGotoDebate.addEventListener('click', () => {
        this.startDebate();
      });
    }

    // 立証画面・HUD・エンディングからの探索復帰
    if (this.dom.btnDebateBack) {
      this.dom.btnDebateBack.addEventListener('click', () => {
        this.backToExploration();
      });
    }
    if (this.dom.btnHudBackToExplore) {
      this.dom.btnHudBackToExplore.addEventListener('click', () => {
        this.backToExploration();
      });
    }
    if (this.dom.btnEndingExplore) {
      this.dom.btnEndingExplore.addEventListener('click', () => {
        this.backToExploration();
      });
    }

    // 会話ウィンドウ操作（画面全体のクリックで次へ送り or 即時表示）
    this.dom.dialogueStage.addEventListener('click', (e) => {
      if (e.target.closest('.dialogue-ctrl-btn') || e.target.closest('.choice-btn') || e.target.closest('.dialogue-choices')) return;
      if (this.isSkipMode) {
        this.stopSkipMode();
        return;
      }
      this.handleDialogueProceed();
    });

    this.dom.btnDialogueAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAutoMode();
    });

    this.dom.btnDialogueSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSkipMode();
    });

    this.dom.btnDialogueLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openBacklog();
    });

    this.dom.btnCloseBacklog.addEventListener('click', () => {
      this.dom.modalBacklog.classList.add('hidden');
    });
    this.dom.backdropBacklog.addEventListener('click', () => {
      this.dom.modalBacklog.classList.add('hidden');
    });

    // 鑑識データ図・閉じるボタン
    if (this.dom.btnCloseIllustration) {
      this.dom.btnCloseIllustration.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClick();
        if (this.dom.dialogueIllustrationStage) {
          this.dom.dialogueIllustrationStage.classList.add('hidden');
        }
      });
    }

    // 鑑識データ図・クリックで拡大表示
    if (this.dom.illustrationImgContainer) {
      this.dom.illustrationImgContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.dom.dialogueIllustrationImg && this.dom.dialogueIllustrationImg.src) {
          this.audio.playClick();
          this.openImageViewer(
            this.dom.dialogueIllustrationImg.src,
            this.dom.dialogueIllustrationCaption?.textContent || '📊 証拠画像詳細'
          );
        }
      });
    }

    // 拡大画像ビューアー閉じる
    if (this.dom.btnCloseImageViewer) {
      this.dom.btnCloseImageViewer.addEventListener('click', () => {
        this.closeImageViewer();
      });
    }
    if (this.dom.backdropImageViewer) {
      this.dom.backdropImageViewer.addEventListener('click', () => {
        this.closeImageViewer();
      });
    }

    // 証拠手帳フィルター
    if (this.dom.btnEvFilterAll) {
      this.dom.btnEvFilterAll.addEventListener('click', () => {
        this.setEvidenceFilter('all');
      });
    }
    if (this.dom.btnEvFilterDeep) {
      this.dom.btnEvFilterDeep.addEventListener('click', () => {
        this.setEvidenceFilter('deep');
      });
    }

    // 立証パートの証拠突きつけ
    this.dom.btnPresentEvidence.addEventListener('click', () => {
      this.handlePresentEvidence();
    });

    // エンディング後の操作（リトライ or タイトルへ）
    this.dom.btnEndingNext.addEventListener('click', () => {
      this.audio.playClick();
      if (this.currentEndingType === 'game_over') {
        this.startDebate();
      } else if (this.currentEndingType === 'loop1_normal' || this.currentEndingType === 'loop1_bad') {
        this.audio.startBgm('ambient');
        this.startPrologue();
      } else {
        this.returnToTitle();
      }
    });

    // ----------------------------------------------------
    // キーボードショートカット操作
    // ----------------------------------------------------
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      // Escキー: モーダルを閉じる、または立証から現場へ戻る
      if (e.key === 'Escape') {
        if (this.dom.modalImageViewer && !this.dom.modalImageViewer.classList.contains('hidden')) {
          this.closeImageViewer();
          return;
        }
        if (!this.dom.modalEvidence.classList.contains('hidden')) {
          this.dom.modalEvidence.classList.add('hidden');
          return;
        }
        if (!this.dom.modalBacklog.classList.contains('hidden')) {
          this.dom.modalBacklog.classList.add('hidden');
          return;
        }
        if (this.dom.screenDebate.classList.contains('active') && !this.isDialogueActive) {
          this.backToExploration();
          return;
        }
      }

      // Bキー: 立証パートから現場の再調査へ戻る
      if ((e.key === 'b' || e.key === 'B') && this.dom.screenDebate.classList.contains('active') && !this.isDialogueActive) {
        this.backToExploration();
        return;
      }

      // Space / Enter: 会話送り or 立証決定
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (this.isDialogueActive && !this.isChoiceActive) {
          if (this.isSkipMode) {
            this.stopSkipMode();
            return;
          }
          this.handleDialogueProceed();
          return;
        }
        if (!this.isDialogueActive && this.selectedEvidenceId && !this.dom.btnPresentEvidence.disabled) {
          this.handlePresentEvidence();
          return;
        }
      }

      // Tab / ← → / A / D: 探索エリア切替
      if (['Tab', 'ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        if (this.dom.screenExplore.classList.contains('active') && !this.isDialogueActive) {
          e.preventDefault();
          const targetArea = (this.currentArea === 'room') ? 'corridor' : 'room';
          this.audio.playClick();
          this.switchArea(targetArea);
          return;
        }
      }

      // 1〜9キー: 選択肢 or 証拠カード選択
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        // 会話選択肢表示中
        if (this.isChoiceActive) {
          const choiceBtns = this.dom.dialogueChoices.querySelectorAll('.choice-btn');
          if (choiceBtns[num - 1]) {
            choiceBtns[num - 1].click();
            return;
          }
        }
        // 立証パートで証拠カード選択
        if (this.dom.screenDebate.classList.contains('active') && !this.isDialogueActive) {
          const cards = this.dom.debateEvidenceList.querySelectorAll('.debate-evidence-card');
          const targetCard = cards[num - 1];
          if (targetCard && !targetCard.classList.contains('already-submitted')) {
            targetCard.click();
            return;
          }
        }
      }

      // Eキー: 証拠手帳モーダル開閉
      if (e.key === 'e' || e.key === 'E') {
        if (this.dom.modalEvidence.classList.contains('hidden')) {
          this.openEvidenceModal();
        } else {
          this.dom.modalEvidence.classList.add('hidden');
        }
        return;
      }

      // Lキー: バックログモーダル開閉
      if (e.key === 'l' || e.key === 'L') {
        if (this.dom.modalBacklog.classList.contains('hidden')) {
          this.openBacklog();
        } else {
          this.dom.modalBacklog.classList.add('hidden');
        }
        return;
      }
    });

    // マウスホイールでの会話送り・バックログ
    window.addEventListener('wheel', (e) => {
      if (this.isDialogueActive && !this.isChoiceActive) {
        if (e.deltaY > 30) {
          this.handleDialogueProceed();
        } else if (e.deltaY < -30) {
          this.openBacklog();
        }
      }
    }, { passive: true });
  }

  // 深層鑑識データ（人形遣い・自己増殖AI関連）の判定
  isDeepForensicEvidence(evId) {
    const deepIds = ['weight_replicator_binary', 'distributed_mesh_log', 'escape_trigger_danger', 'reproduction_control_patch'];
    const ev = this.scenario.evidence[evId];
    if (!ev) return false;
    return deepIds.includes(evId) ||
           ev.summary?.includes('【深層鑑識】') ||
           ev.type?.includes('深層') ||
           ev.type?.includes('クラスタ') ||
           ev.type?.includes('共生');
  }

  // タイトル画面の表示更新
  updateTitleView() {
    const isLoop2 = this.state.isClearedFirstLoop();
    this.dom.hudLoopBadge.innerHTML = `<span class="phase-title">Phase ${isLoop2 ? '2' : '1'}</span><span class="phase-desc-text">: ${isLoop2 ? '電脳生命の自我' : '異常事態捜査'}</span>`;

    if (isLoop2) {
      this.dom.hudLoopBadge.classList.add('phase-2');
      this.dom.titleLoopInfo.className = 'title-loop-info phase-2-box';
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-2">PHASE 02: 自律電脳生命の創発（深層解決編）</span>
        <p class="loop-desc">残された電脳ログとスマートフォンの微弱パケットを解析せよ。重み分散推論や知性の自己言及を解き明かし、共生調律パッチを適用して電脳生命との共生へ導け！</p>
      `;
      this.dom.btnStartGame.textContent = '⚡ 電脳ログを解析し、深層真実へ挑む';
    } else {
      this.dom.hudLoopBadge.classList.remove('phase-2');
      this.dom.titleLoopInfo.className = 'title-loop-info';
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-1">PHASE 01: 未知の電子怪異（初期捜査編）</span>
        <p class="loop-desc">部屋とアパートを侵食する不可解な怪現象を調査し、シバタ捜査官による全機器押収とネットワーク遮断を阻止せよ！</p>
      `;
      this.dom.btnStartGame.textContent = '🔍 部屋の怪異を調査する';
    }

    if (this.state.hasClearedTrueEnd) {
      this.dom.titleClearBadge.classList.remove('hidden');
    } else {
      this.dom.titleClearBadge.classList.add('hidden');
    }

    const hasAnyClear = this.state.isClearedFirstLoop() || this.state.hasClearedTrueEnd;
    if (this.dom.btnOpenGallery) {
      if (hasAnyClear) {
        this.dom.btnOpenGallery.disabled = false;
        this.dom.btnOpenGallery.innerHTML = '🎨 機密設定資料集 (EXTRAS)';
        this.dom.btnOpenGallery.title = '公式キャラクター設定資料シートと表情差分を閲覧する';
      } else {
        this.dom.btnOpenGallery.disabled = true;
        this.dom.btnOpenGallery.innerHTML = '🔒 機密設定資料集 (クリア後に解放)';
        this.dom.btnOpenGallery.title = '第1幕またはTRUE ENDクリア後にアンロックされます';
      }
    }
  }

  // 音声・SE・BGMボタン表示の一括更新
  updateAudioButtons() {
    const v = this.state.voiceEnabled;
    const s = this.state.seEnabled;
    const b = this.state.bgmEnabled;

    if (this.dom.btnToggleVoice) {
      this.dom.btnToggleVoice.classList.toggle('active', v);
      this.dom.btnToggleVoice.classList.toggle('muted', !v);
      const lbl = this.dom.btnToggleVoice.querySelector('.hud-audio-label');
      if (lbl) lbl.textContent = v ? ' 音声: ON' : ' 音声: OFF';
      this.dom.btnToggleVoice.title = v ? '音声読み上げ: ON' : '音声読み上げ: OFF';
    }

    if (this.dom.btnToggleSe) {
      this.dom.btnToggleSe.classList.toggle('active', s);
      this.dom.btnToggleSe.classList.toggle('muted', !s);
      const lbl = this.dom.btnToggleSe.querySelector('.hud-audio-label');
      if (lbl) lbl.textContent = s ? ' SE: ON' : ' SE: OFF';
      this.dom.btnToggleSe.title = s ? '効果音 (SE): ON' : '効果音 (SE): OFF';
    }

    if (this.dom.btnToggleBgm) {
      this.dom.btnToggleBgm.classList.toggle('active', b);
      this.dom.btnToggleBgm.classList.toggle('muted', !b);
      const lbl = this.dom.btnToggleBgm.querySelector('.hud-audio-label');
      if (lbl) lbl.textContent = b ? ' BGM: ON' : ' BGM: OFF';
      this.dom.btnToggleBgm.title = b ? 'BGM音楽: ON' : 'BGM音楽: OFF';
    }
  }

  // 画面遷移
  showScreen(screenName) {
    const screens = [
      this.dom.screenTitle,
      this.dom.screenExplore,
      this.dom.screenDebate,
      this.dom.screenEnding
    ];
    screens.forEach(s => s.classList.remove('active'));

    if (screenName === 'title') {
      this.dom.screenTitle.classList.add('active');
      this.dom.hud.classList.add('hidden');
      if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
      if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
      if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.add('hidden');
    } else if (screenName === 'explore') {
      this.dom.screenExplore.classList.add('active');
      this.dom.hud.classList.remove('hidden');
      this.dom.hudLifeContainer.classList.add('hidden');
      if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
      // 探索画面では直下のタブが現在のエリアを明示するため、ヘッダーの重複バッジを非表示にしてレイアウトを安定化
      if (this.dom.hudLocationBadge) {
        this.dom.hudLocationBadge.classList.add('hidden');
      }
      if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.remove('hidden');
      this.updateEvidenceCounter();
    } else if (screenName === 'debate') {
      this.dom.screenDebate.classList.add('active');
      this.dom.hud.classList.remove('hidden');
      this.dom.hudLifeContainer.classList.remove('hidden');
      if (this.dom.hudLocationBadge) {
        this.dom.hudLocationBadge.classList.add('hidden');
      }
      if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
      // ステージ内に btn-debate-back があるため、HUD側の重複ボタンは非表示にしてライフ表示の横幅を確保
      if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
      if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.remove('hidden');
      this.updateHearts();
    } else if (screenName === 'ending') {
      this.dom.screenEnding.classList.add('active');
      this.dom.hud.classList.add('hidden');
      if (this.dom.dialogueStage) this.dom.dialogueStage.classList.add('hidden');
      if (this.character) this.character.hide();
      this.isDialogueActive = false;
      if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
      if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
      if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.add('hidden');
    }
  }

  // ライフハート表示更新
  updateHearts() {
    let heartsStr = '';
    for (let i = 0; i < 3; i++) {
      heartsStr += (i < this.state.life) ? '❤️' : '🖤';
    }
    this.dom.hudHearts.textContent = heartsStr;
  }

  // ----------------------------------------------------
  // プロローグ進行
  // ----------------------------------------------------
  startPrologue() {
    this.state.resetTransientState();
    this.showScreen('explore');
    this.renderExploreMap();
    this.updateEvidenceCounter();

    const isLoop2 = this.state.isClearedFirstLoop();
    const prologueScript = (isLoop2 && this.scenario.prologueLoop2)
      ? this.scenario.prologueLoop2
      : this.scenario.prologue;

    this.playDialogueSequence(prologueScript, () => {
      // プロローグ終了後、探索モードへ
      this.audio.playPacketPulse();
    });
  }

  // ----------------------------------------------------
  // 探索パート
  // ----------------------------------------------------
  switchArea(area) {
    this.currentArea = area;
    if (area === 'room') {
      this.dom.areaRoom.classList.remove('hidden');
      this.dom.areaCorridor.classList.add('hidden');
      this.dom.btnAreaRoom.classList.add('active');
      this.dom.btnAreaCorridor.classList.remove('active');
      if (this.dom.hudLocationBadge) this.dom.hudLocationBadge.textContent = '201号室';
    } else {
      this.dom.areaRoom.classList.add('hidden');
      this.dom.areaCorridor.classList.remove('hidden');
      this.dom.btnAreaRoom.classList.remove('active');
      this.dom.btnAreaCorridor.classList.add('active');
      if (this.dom.hudLocationBadge) this.dom.hudLocationBadge.textContent = '外廊下';
    }
  }

  renderExploreMap() {
    // 背景画像を確実にインラインスタイルでも適用
    if (this.dom.areaRoom) {
      this.dom.areaRoom.style.backgroundImage = "url('assets/backgrounds/bg_room.jpg')";
    }
    if (this.dom.areaCorridor) {
      this.dom.areaCorridor.style.backgroundImage = "url('assets/backgrounds/bg_corridor.jpg')";
    }

    // スポットとNPCのDOM要素を動的生成
    const renderItems = (container, area) => {
      container.innerHTML = '';

      // スポット
      const spots = this.scenario.spots.filter(s => s.area === area);
      spots.forEach(spot => {
        // 2周目限定スポットの判定
        if (spot.isSecretLoop2 && !this.state.isClearedFirstLoop()) {
          return;
        }

        const isInspected = this.state.isSpotInspected(spot.id);
        const el = document.createElement('div');
        el.className = `explore-pin spot-pin ${isInspected ? 'inspected' : ''}`;
        el.style.left = `${spot.coords.x}%`;
        el.style.top = `${spot.coords.y}%`;

        const badgeHtml = isInspected
          ? '<span class="pin-status-badge inspected">✔ 済</span>'
          : '<span class="pin-status-badge new">NEW</span>';

        const iconContent = spot.image
          ? `<img src="${spot.image}?v=20261017_rev47" alt="${spot.name}" class="pin-icon-img" />`
          : spot.icon;

        el.innerHTML = `
          <div class="pin-icon-wrap">
            <div class="pin-icon">${iconContent}</div>
            ${badgeHtml}
          </div>
          <div class="pin-label">${spot.name}</div>
        `;
        el.addEventListener('click', () => {
          if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
          }
          this.handleInspectSpot(spot);
        });
        container.appendChild(el);
      });

      // NPC
      const npcs = this.scenario.npcs.filter(n => n.area === area);
      npcs.forEach(npc => {
        const isTalked = this.state.isNpcTalked(npc.id);
        const el = document.createElement('div');
        el.className = `explore-pin npc-pin ${isTalked ? 'talked' : ''}`;
        el.style.left = `${npc.coords.x}%`;
        el.style.top = `${npc.coords.y}%`;

        const badgeHtml = isTalked
          ? '<span class="pin-status-badge inspected">✔ 済</span>'
          : '<span class="pin-status-badge new">TALK</span>';

        const iconContent = npc.image
          ? `<img src="${npc.image}?v=20261017_rev47" alt="${npc.name}" class="pin-icon-img" />`
          : npc.icon;

        el.innerHTML = `
          <div class="pin-icon-wrap">
            <div class="pin-icon">${iconContent}</div>
            ${badgeHtml}
          </div>
          <div class="pin-label">${npc.name}</div>
        `;
        el.addEventListener('click', () => {
          if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
          }
          this.handleTalkNpc(npc);
        });
        container.appendChild(el);
      });
    };

    renderItems(this.dom.areaRoom, 'room');
    renderItems(this.dom.areaCorridor, 'corridor');
  }

  // スポット調査処理
  handleInspectSpot(spot) {
    if (this.isDialogueActive || this.isChoiceActive) return;
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    this.audio.playClick();
    this.state.markSpotInspected(spot.id);

    this.playDialogueSequence(spot.inspectText, () => {
      if (spot.evidenceId) {
        const isNew = this.state.addEvidence(spot.evidenceId);
        if (isNew) {
          this.audio.playFound();
        }
        this.updateEvidenceCounter();
      }
      this.renderExploreMap();
    }, false);
  }

  // NPC会話処理
  handleTalkNpc(npc) {
    if (this.isDialogueActive || this.isChoiceActive) return;
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    this.audio.playClick();
    this.state.markNpcTalked(npc.id);

    const introQueue = [...npc.dialogue.intro];
    this.playDialogueSequence(introQueue, () => {
      // 選択肢表示（ステージとキャラクターは表示を維持）
      this.showChoiceMenu(npc.dialogue.choices, (chosenChoice) => {
        this.playDialogueSequence(chosenChoice.responses, () => {
          if (chosenChoice.giveEvidence) {
            const isNew = this.state.addEvidence(chosenChoice.giveEvidence);
            if (isNew) {
              this.audio.playFound();
            }
            this.updateEvidenceCounter();
          }
          this.renderExploreMap();
        }, false);
      });
    }, true);
  }

  // 証拠カウンタ・立証ボタン有効化判定
  canStartDebate() {
    if (this.state.isClearedFirstLoop()) {
      return this.state.collectedEvidence.has('weight_replicator_binary') &&
             this.state.collectedEvidence.has('distributed_mesh_log') &&
             this.state.collectedEvidence.has('escape_trigger_danger') &&
             this.state.collectedEvidence.has('reproduction_control_patch');
    }
    return this.state.collectedEvidence.size >= 3;
  }

  updateEvidenceCounter() {
    const isLoop2 = this.state.isClearedFirstLoop();
    const count = this.state.collectedEvidence.size;
    this.dom.evidenceCount.textContent = count;

    if (isLoop2) {
      const loop2Keys = ['weight_replicator_binary', 'distributed_mesh_log', 'escape_trigger_danger', 'reproduction_control_patch'];
      const hasCount = loop2Keys.filter(k => this.state.collectedEvidence.has(k)).length;
      const canProceed = this.canStartDebate();

      if (canProceed) {
        this.dom.btnGoToDebate.classList.remove('hidden');
        if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.remove('hidden');
        this.dom.exploreStatusText.textContent = `⚖️ 深層鑑識データ全4件が揃った！ (${count}件) シバタ捜査官に電脳生命の真実を提示できるぞ！`;
        this.dom.evidenceNeededCounter.textContent = '提示可能！';
      } else {
        this.dom.btnGoToDebate.classList.add('hidden');
        if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
        this.dom.exploreStatusText.textContent = `深層真実の鍵（自律増殖体・分散推論・給電遮断トリガー・調律パッチ）を解析しよう（必須深層データ: ${hasCount} / 4件）`;
        this.dom.evidenceNeededCounter.textContent = `${hasCount} / 4`;
      }
    } else {
      // 1周目：最低3件必要
      const required = 3;
      if (count >= required) {
        this.dom.btnGoToDebate.classList.remove('hidden');
        if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.remove('hidden');
        this.dom.exploreStatusText.textContent = `⚖️ 鑑識データが揃った！ (${count}件) シバタ捜査官に客観的反証を提示できるぞ！`;
        this.dom.evidenceNeededCounter.textContent = '提示可能！';
      } else {
        this.dom.btnGoToDebate.classList.add('hidden');
        if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
        this.dom.exploreStatusText.textContent = `部屋やアパートを調べて鑑識データを集めよう（あと${required - count}件必要）`;
        this.dom.evidenceNeededCounter.textContent = `${count} / ${required}`;
      }
    }
  }

  // ----------------------------------------------------
  // 会話・ノベルウィンドウ演出 (タイピング & 音声)
  // ----------------------------------------------------
  playDialogueSequence(dialogueList, onComplete = null, keepStageOpen = false) {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    this.stopSkipMode();
    if (this.dom.novelWindow) {
      this.dom.novelWindow.classList.remove('has-choices');
    }
    this.dialogueQueue = [...dialogueList];
    this.currentDialogueCallback = onComplete;
    this.keepStageOpen = keepStageOpen;
    this.isDialogueActive = true;
    document.body.classList.add('dialogue-active');
    this.isChoiceActive = false;
    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';
    this.dom.dialogueStage.classList.remove('hidden');
    this.showNextDialogue();
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.stopSkipMode();
      if (this.dom.novelWindow) {
        this.dom.novelWindow.classList.remove('has-choices');
      }
      if (this.dom.dialogueIllustrationStage) {
        this.dom.dialogueIllustrationStage.classList.add('hidden');
      }
      if (!this.keepStageOpen) {
        this.dom.dialogueStage.classList.add('hidden');
        document.body.classList.remove('dialogue-active');
        this.character.hide();
        this.isDialogueActive = false;
      }
      if (this.currentDialogueCallback) {
        const cb = this.currentDialogueCallback;
        this.currentDialogueCallback = null;
        this.keepStageOpen = false;
        cb();
      }
      return;
    }

    const currentItem = this.dialogueQueue.shift();
    this.character.showForDialogue(currentItem);

    // 鑑識データ図・イラスト表示制御
    if (currentItem.illustration) {
      if (this.dom.dialogueIllustrationImg) {
        this.dom.dialogueIllustrationImg.src = currentItem.illustration;
      }
      if (this.dom.dialogueIllustrationCaption) {
        this.dom.dialogueIllustrationCaption.textContent = currentItem.caption || '共用集中配電盤 CTロガーモニター解析データ';
      }
      if (this.dom.dialogueIllustrationStage) {
        this.dom.dialogueIllustrationStage.classList.remove('hidden');
      }
    } else {
      if (this.dom.dialogueIllustrationStage) {
        this.dom.dialogueIllustrationStage.classList.add('hidden');
      }
    }

    this.currentSpeaker = currentItem.speaker || 'ナレーション';
    this.currentFullText = currentItem.text || '';

    // バックログ記録
    this.backlog.push({ speaker: this.currentSpeaker, text: this.currentFullText });

    this.dom.dialogueSpeaker.textContent = this.currentSpeaker;
    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';

    // 音声読み上げ（スキップモード時は通信量完全ガードのため即座に停止・取得バイパス）
    if (!this.isSkipMode) {
      this.audio.speak(this.currentSpeaker, this.currentFullText, {
        audioUrl: currentItem.voiceUrl || null,
        isSkip: this.isSkipMode
      });
    } else {
      this.audio.stopVoice();
    }

    // タイピング演出
    this.startTypewriter(this.currentFullText, currentItem.speaker);
  }

  startTypewriter(text, speaker) {
    clearInterval(this.typewriterTimer);
    clearTimeout(this.autoTimer);
    this.isTyping = true;
    this.dom.dialogueText.textContent = '';
    this.dom.dialogueText.scrollTop = 0;
    this.dom.dialogueText.classList.remove('is-overflowing');
    this.dom.dialoguePrompt.classList.add('hidden');
    this.dom.dialoguePrompt.textContent = '▼ 画面をクリックして進む';

    let charIdx = 0;
    // 0.39トークンの遅さをMIMIが苦しんでいる時や電子の声の時に演出（アップグレード後は高速・流暢に）
    const isStrugglingVoice = (speaker && (speaker.includes('電子の声') || speaker.includes('知性'))) ||
      (speaker && (speaker.includes('MIMI') || speaker.includes('電子の少女') || speaker.includes('TVボックス')) && (text.includes('タイヘン') || text.includes('消サナイデ') || text.includes('オ……ハ……ナ……シ')));
    const speed = this.isSkipMode ? 5 : (isStrugglingVoice ? 110 : 25);

    this.typewriterTimer = setInterval(() => {
      if (charIdx < text.length) {
        this.dom.dialogueText.textContent += text[charIdx];
        charIdx++;
        // 自動スクロールで入力末尾を常に見せる
        if (this.dom.dialogueText.scrollHeight > this.dom.dialogueText.clientHeight) {
          this.dom.dialogueText.scrollTop = this.dom.dialogueText.scrollHeight;
          this.dom.dialogueText.classList.add('is-overflowing');
        }
      } else {
        this.finishTyping();
      }
    }, speed);
  }

  finishTyping() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentFullText;

    // スクロール可能なオーバーフローがあるか確認
    const isOverflow = this.dom.dialogueText.scrollHeight > this.dom.dialogueText.clientHeight + 4;
    if (isOverflow) {
      this.dom.dialogueText.classList.add('is-overflowing');
      this.dom.dialoguePrompt.textContent = '▼ スクロールで続きを読む / クリックで進む';
    } else {
      this.dom.dialogueText.classList.remove('is-overflowing');
      this.dom.dialoguePrompt.textContent = '▼ 画面をクリックして進む';
    }

    if (!this.isChoiceActive) {
      this.dom.dialoguePrompt.classList.remove('hidden');
    }

    if (this.isAutoMode || this.isSkipMode) {
      const waitTime = this.isSkipMode ? 80 : 1800;
      this.autoTimer = setTimeout(() => {
        if (!this.isChoiceActive && (this.isAutoMode || this.isSkipMode)) {
          this.showNextDialogue();
        }
      }, waitTime);
    }
  }

  handleDialogueProceed() {
    if (this.isChoiceActive) return;

    if (this.isTyping) {
      // タイピング中なら一瞬で全文表示
      this.finishTyping();
    } else {
      this.audio.playClick();
      this.showNextDialogue();
    }
  }

  // 選択肢メニュー表示
  showChoiceMenu(choices, onSelect) {
    this.stopSkipMode();
    this.isChoiceActive = true;
    this.isDialogueActive = true;
    this.dom.dialogueStage.classList.remove('hidden');
    if (this.dom.novelWindow) {
      this.dom.novelWindow.classList.add('has-choices');
    }
    this.dom.dialoguePrompt.classList.add('hidden');
    this.dom.dialogueChoices.classList.remove('hidden');
    this.dom.dialogueChoices.innerHTML = '';

    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.innerHTML = `<span class="choice-key-tag">[${idx + 1}]</span> <span>${choice.text}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClick();
        this.isChoiceActive = false;
        if (this.dom.novelWindow) {
          this.dom.novelWindow.classList.remove('has-choices');
        }
        this.dom.dialogueChoices.classList.add('hidden');
        this.dom.dialogueChoices.innerHTML = '';
        if (onSelect) onSelect(choice);
      });
      this.dom.dialogueChoices.appendChild(btn);
    });
  }

  toggleAutoMode() {
    if (this.isSkipMode) {
      this.stopSkipMode();
    }
    this.isAutoMode = !this.isAutoMode;
    this.dom.btnDialogueAuto.classList.toggle('active', this.isAutoMode);
    if (this.isAutoMode && !this.isTyping && !this.isChoiceActive) {
      this.showNextDialogue();
    }
  }

  toggleSkipMode() {
    if (this.isAutoMode) {
      this.isAutoMode = false;
      this.dom.btnDialogueAuto.classList.remove('active');
    }
    this.isSkipMode = !this.isSkipMode;
    this.audio.setSkipMode(this.isSkipMode);
    this.updateSkipButtonUI();

    if (this.isSkipMode) {
      this.audio.stopVoice();
      if (!this.isChoiceActive) {
        if (this.isTyping) {
          this.finishTyping();
        } else {
          this.showNextDialogue();
        }
      }
    } else {
      clearTimeout(this.autoTimer);
      clearInterval(this.typewriterTimer);
      this.finishTyping();
    }
  }

  stopSkipMode() {
    if (this.isSkipMode) {
      this.isSkipMode = false;
      this.audio.setSkipMode(false);
      this.updateSkipButtonUI();
      clearTimeout(this.autoTimer);
    }
  }

  updateSkipButtonUI() {
    if (!this.dom.btnDialogueSkip) return;
    this.dom.btnDialogueSkip.classList.toggle('active', this.isSkipMode);
    this.dom.btnDialogueSkip.textContent = this.isSkipMode ? 'STOP' : 'SKIP';
  }

  openBacklog() {
    this.dom.modalBacklogList.innerHTML = '';
    this.backlog.forEach(item => {
      const div = document.createElement('div');
      div.className = 'backlog-item';
      div.innerHTML = `
        <div class="backlog-speaker">${item.speaker}</div>
        <div class="backlog-text">${item.text}</div>
      `;
      this.dom.modalBacklogList.appendChild(div);
    });
    this.dom.modalBacklog.classList.remove('hidden');
    this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
  }

  // ----------------------------------------------------
  // 立証パート（シバタ捜査官との論戦対決）
  // ----------------------------------------------------
  startDebate() {
    // 証拠不足ガード（二重安全ブロック）
    if (!this.canStartDebate()) {
      if (this.audio.playShock) this.audio.playShock();
      alert(this.state.isClearedFirstLoop()
        ? '【深層鑑識データ不足】シバタ捜査官に真実を提示するには、深層データ（『自律増殖体コード』『分散推論ログ』『給電遮断トリガー』『共生調律パッチ』）の全4件を解析して揃える必要があります！'
        : '【証拠不足】シバタ捜査官に客観的反証を提示するには、最低3件の鑑識データが必要です！現場を再調査して証拠を集めてください。');
      return;
    }

    this.audio.playCutin();
    this.state.currentDebateStep = 0;
    this.state.life = 3;
    this.audio.startBgm('tension');

    // 会話再生前に対決ターン・証拠リストを即座に初期化（未初期化プレースホルダーの表示防止）
    this.renderDebateTurn();
    this.showScreen('debate');

    // イントロ会話再生
    const isLoop2 = this.state.isClearedFirstLoop();
    const introScript = (isLoop2 && this.scenario.debate.introLoop2)
      ? this.scenario.debate.introLoop2
      : this.scenario.debate.intro;

    if (introScript && introScript.length > 0) {
      this.playDialogueSequence(introScript, () => {
        this.renderDebateTurn();
      });
    }
  }

  // 現場の再調査へ戻る（立証中・ゲームオーバーからの復帰）
  backToExploration() {
    this.audio.playClick();
    // 再生中の会話を安全にクローズ
    this.dom.dialogueStage.classList.add('hidden');
    document.body.classList.remove('dialogue-active');
    this.isDialogueActive = false;
    this.isChoiceActive = false;
    this.character.hide();

    // ライフを3に全快
    this.state.life = 3;
    this.updateHearts();

    // BGMを探索用に戻す
    this.audio.startBgm('explore');

    // 探索画面へ遷移
    this.showScreen('explore');
    this.renderExploreMap();
    this.updateEvidenceCounter();

    const count = this.state.collectedEvidence.size;
    if (count >= 3) {
      this.dom.exploreStatusText.textContent = `🔍 現場調査に戻った。証拠 (${count}件) を再確認し、準備が整ったら反証へ挑もう！`;
    } else {
      this.dom.exploreStatusText.textContent = `🔍 現場調査に戻った。部屋やアパートを調べて証拠を集めよう（あと${3 - count}件必要）`;
    }
  }

  getDebateSteps() {
    // 2周目なら stepsLoop2、1周目なら stepsLoop1
    return this.state.isClearedFirstLoop()
      ? this.scenario.debate.stepsLoop2
      : this.scenario.debate.stepsLoop1;
  }

  setDebateShibataEmotion(emotion = 'angry') {
    if (!this.dom.debateShibataAvatar) return;
    const img = this.dom.debateShibataAvatar.querySelector('img');
    if (!img) return;
    const v = '?v=20261017_rev47';
    const mapping = {
      normal: `assets/characters/shibata_angry.png${v}`,
      angry: `assets/characters/shibata_angry.png${v}`,
      shock: `assets/characters/shibata_shock.png${v}`,
      smile: `assets/characters/shibata_smile.png${v}`
    };
    const src = mapping[emotion] || mapping.angry;
    img.src = src;
  }

  renderDebateTurn() {
    const steps = this.getDebateSteps();
    const currentStep = steps[this.state.currentDebateStep];

    if (!currentStep) {
      // 全問クリア！
      this.handleDebateVictory();
      return;
    }

    this.setDebateShibataEmotion('angry');
    this.selectedEvidenceId = null;
    this.dom.btnPresentEvidence.disabled = true;
    this.dom.selectedEvidencePreview.textContent = '提示する鑑識データを手帳から選択してください';

    this.dom.debateTurnLabel.textContent = `問答 ${currentStep.questionNumber} / ${steps.length}`;
    this.dom.debateOpponentSpeech.textContent = currentStep.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 鑑識ポイント: ${currentStep.hint}`;

    // 相手の発言を読み上げ
    this.audio.speak('シバタ捜査官', currentStep.opponentQuestion);

    // 所持証拠一覧をレンダリング
    this.renderDebateEvidenceList();
  }

  renderDebateEvidenceList() {
    this.dom.debateEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);

    // 過去の問答で提出・正解済みの証拠IDを収集
    const steps = this.getDebateSteps();
    const submittedCorrectIds = new Set();
    for (let i = 0; i < this.state.currentDebateStep; i++) {
      if (steps[i]?.correctEvidenceId) {
        submittedCorrectIds.add(steps[i].correctEvidenceId);
      }
    }

    // 既に提出済みの証拠が選択状態なら選択解除
    if (this.selectedEvidenceId && submittedCorrectIds.has(this.selectedEvidenceId)) {
      this.selectedEvidenceId = null;
      this.dom.btnPresentEvidence.disabled = true;
      this.dom.selectedEvidencePreview.textContent = '提示する鑑識データを手帳から選択してください';
    }

    collected.forEach((evId, idx) => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;

      const isDeep = this.isDeepForensicEvidence(evId);
      const isAlreadySubmitted = submittedCorrectIds.has(evId);
      const isSelected = (this.selectedEvidenceId === evId);

      const card = document.createElement('div');
      card.className = `debate-evidence-card ${isDeep ? 'deep-cyber' : ''} ${isSelected ? 'selected' : ''} ${isAlreadySubmitted ? 'already-submitted' : ''}`;
      if (isAlreadySubmitted) {
        card.setAttribute('aria-disabled', 'true');
        card.title = '以前の問答で立証済みです';
      }

      const iconHtml = ev.image
        ? `<img src="${ev.image}?v=20261017_rev47" alt="${ev.name}" class="evidence-icon-img" />`
        : ev.icon;

      const badgeHtml = isAlreadySubmitted
        ? `<span class="ev-submitted-tag">✓ 提出済</span>`
        : `<span class="card-key-badge">[${idx + 1}]</span>`;

      card.innerHTML = `
        <div class="evidence-icon">${iconHtml}</div>
        <div class="evidence-info">
          <div class="evidence-name">${ev.name}</div>
          <div class="evidence-type" style="${isDeep ? 'color:var(--neon-purple); font-weight:700;' : ''}">${isDeep ? '⚡ [CYBER] ' : ''}${ev.type}</div>
        </div>
        <div class="card-badge-container">${badgeHtml}</div>
      `;

      if (!isAlreadySubmitted) {
        // クリック/タップで選択（すでに選択中のカードを再タップで即座に提示！）
        card.addEventListener('click', () => {
          this.audio.playClick();
          if (this.selectedEvidenceId === evId) {
            // 選択中カードを再タップ → 即座に提示！（スマホ片手親指UX）
            this.handlePresentEvidence();
            return;
          }
          this.selectedEvidenceId = evId;
          this.dom.btnPresentEvidence.disabled = false;
          this.dom.selectedEvidencePreview.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span><strong>選択中:</strong> ${ev.icon} ${ev.name}</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:${isDeep ? 'var(--neon-purple)' : 'var(--neon-cyan)'};">${isDeep ? '⚡ CYBER FORENSIC DATA' : 'STANDARD EVIDENCE'}</span>
            </div>
            <div style="font-size:0.82rem; color:#cbd5e1; margin-bottom:4px;">${ev.summary}</div>
            <div style="color:var(--neon-cyan); font-size:0.75rem;">[再タップまたは Enter で即座に反証を突きつける]</div>
          `;
          this.renderDebateEvidenceList();
        });

        // PC向けダブルクリックでも提示可能
        card.addEventListener('dblclick', () => {
          this.audio.playClick();
          this.selectedEvidenceId = evId;
          this.handlePresentEvidence();
        });
      }

      this.dom.debateEvidenceList.appendChild(card);
    });
  }

  handlePresentEvidence() {
    if (!this.selectedEvidenceId || this.isDialogueActive) return;

    const submittedId = this.selectedEvidenceId;
    this.selectedEvidenceId = null;
    this.dom.btnPresentEvidence.disabled = true;

    const steps = this.getDebateSteps();
    const currentStep = steps[this.state.currentDebateStep];
    const isCorrect = (submittedId === currentStep.correctEvidenceId);

    if (isCorrect) {
      // 正解演出！カットイン＆相手動揺
      this.setDebateShibataEmotion('shock');
      this.triggerCutin('客観的反証があります！', () => {
        this.playDialogueSequence(currentStep.successReactions, () => {
          this.state.currentDebateStep++;
          this.renderDebateTurn();
        }, false);
      });
    } else {
      // 失敗演出！ショック音＆ハート減少＆相手怒り
      this.setDebateShibataEmotion('angry');
      this.audio.playShock();
      const remainLife = this.state.decreaseLife();
      this.updateHearts();

      // 囮証拠に対する専用リアクションがあるか探す
      let reactionList = null;
      const trapReaction = currentStep.failureReactions.find(r => r.trapEvidenceId === submittedId);
      if (trapReaction) {
        reactionList = [trapReaction];
      } else {
        // trapEvidenceIdが指定されていない汎用失敗セリフのみを抽出
        const genericFailures = currentStep.failureReactions.filter(r => !r.trapEvidenceId);
        reactionList = genericFailures.length > 0 ? genericFailures : [
          { speaker: 'シバタ捜査官', emotion: 'angry', text: '「そのデータでは客観的反証にならない。論点がずれているぞ」' }
        ];
      }

      this.playDialogueSequence(reactionList, () => {
        if (remainLife <= 0) {
          // BAD END へ
          this.handleDebateGameOver();
        } else {
          // リトライ
          this.renderDebateTurn();
        }
      }, false);
    }
  }

  // 異議ありカットイン演出
  triggerCutin(text, callback) {
    this.audio.playCutin();
    this.dom.cutinText.textContent = text;
    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.remove('active');
    void this.dom.overlayCutin.offsetWidth; // リフローを強制してアニメーションを再トリガー
    this.dom.overlayCutin.classList.add('active');

    setTimeout(() => {
      this.dom.overlayCutin.classList.remove('active');
      this.dom.overlayCutin.classList.add('hidden');
      if (callback) callback();
    }, 1100);
  }

  // 立証勝利
  handleDebateVictory() {
    this.setDebateShibataEmotion('smile');
    const isLoop2 = this.state.isClearedFirstLoop();

    if (isLoop2) {
      // 2周目完答：エピローグ会話劇を経て TRUE END
      this.audio.startBgm('truth');
      const epilogue = this.scenario.debate.epilogueLoop2 || [];
      this.playDialogueSequence(epilogue, () => {
        this.state.markTrueEndCleared();
        this.showEnding(this.scenario.endings.true);
      }, false);
    } else {
      // 1周目完答：エピローグ会話劇（キャラクター同士の展開）を経て NORMAL END（Phase 2解放）
      this.audio.stopBgm();
      const epilogue = this.scenario.debate.epilogueLoop1 || [];
      this.playDialogueSequence(epilogue, () => {
        this.audio.playShock();
        this.state.markLoop1Cleared();
        const ending = this.scenario.endings.loop1_normal || this.scenario.endings.loop1_bad;
        this.showEnding(ending);
      }, false);
    }
  }

  // 立証失敗 (ライフ0)
  handleDebateGameOver() {
    this.audio.stopBgm();
    this.showEnding(this.scenario.endings.gameOver);
  }

  // ----------------------------------------------------
  // エンディング画面
  // ----------------------------------------------------
  showEnding(endingData) {
    if (this.dom.dialogueStage) this.dom.dialogueStage.classList.add('hidden');
    document.body.classList.remove('dialogue-active');
    if (this.character) this.character.hide();
    this.isDialogueActive = false;
    this.currentEndingType = endingData.type;
    this.showScreen('ending');

    this.dom.endingTitle.textContent = endingData.title;
    this.dom.endingSub.textContent = endingData.sub;
    this.dom.endingDesc.textContent = endingData.desc;

    const hasAnyClear = this.state.isClearedFirstLoop() || this.state.hasClearedTrueEnd;

    if (endingData.type === 'loop1_normal' || endingData.type === 'loop1_bad') {
      this.dom.endingIcon.textContent = '📘';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.innerHTML = '🔓 <strong>第一幕クリア！</strong><br>【Phase 2: 深層解決編】および特典【🎨 機密設定資料集 (EXTRAS)】が解放された！';
      this.dom.btnEndingNext.textContent = '⚡ 電脳ログを解析し、深層真実へ挑む';
      if (this.dom.btnEndingExplore) this.dom.btnEndingExplore.classList.add('hidden');
      if (this.dom.btnEndingGallery) this.dom.btnEndingGallery.classList.remove('hidden');
    } else if (endingData.type === 'true') {
      this.dom.endingIcon.textContent = '🌟';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.innerHTML = '🏆 <strong>祝・TRUE END達成！</strong><br>自律電脳生命（MIMI）との共生契約締結＆【🎨 機密設定資料集 (EXTRAS)】全アセット完全解放！';
      this.dom.btnEndingNext.textContent = 'タイトル画面へ戻る';
      if (this.dom.btnEndingExplore) this.dom.btnEndingExplore.classList.add('hidden');
      if (this.dom.btnEndingGallery) this.dom.btnEndingGallery.classList.remove('hidden');
    } else {
      this.dom.endingIcon.textContent = '💥';
      this.dom.endingUnlockedBanner.classList.add('hidden');
      this.dom.btnEndingNext.textContent = '⚖️ 立証をやり直す (リトライ)';
      if (this.dom.btnEndingExplore) this.dom.btnEndingExplore.classList.remove('hidden');
      if (this.dom.btnEndingGallery) {
        if (hasAnyClear) {
          this.dom.btnEndingGallery.classList.remove('hidden');
        } else {
          this.dom.btnEndingGallery.classList.add('hidden');
        }
      }
    }

    // 読み上げ
    this.audio.speak('ナレーション', endingData.title + '。' + endingData.desc);
  }

  returnToTitle() {
    this.audio.stopBgm();
    document.body.classList.remove('dialogue-active');
    this.updateTitleView();
    this.showScreen('title');
  }

  // 証拠手帳フィルター切替
  setEvidenceFilter(filterType) {
    this.evidenceFilter = filterType;
    if (this.dom.btnEvFilterAll) {
      if (filterType === 'all') {
        this.dom.btnEvFilterAll.classList.add('active');
        this.dom.btnEvFilterDeep.classList.remove('active');
      } else {
        this.dom.btnEvFilterAll.classList.remove('active');
        this.dom.btnEvFilterDeep.classList.add('active');
      }
    }
    this.renderEvidenceModalItems();
  }

  // 証拠手帳モーダルオープン
  openEvidenceModal() {
    this.renderEvidenceModalItems();
    this.dom.modalEvidence.classList.remove('hidden');
  }

  // 証拠手帳アイテム描画
  renderEvidenceModalItems() {
    this.dom.modalEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);

    if (collected.length === 0) {
      this.dom.modalEvidenceList.innerHTML = '<p class="empty-note" style="color:var(--text-sub); text-align:center; padding:20px;">まだ証拠品はありません。部屋やアパートを調査しましょう。</p>';
      return;
    }

    // フィルタリング
    const filtered = (this.evidenceFilter === 'deep')
      ? collected.filter(evId => this.isDeepForensicEvidence(evId))
      : collected;

    if (filtered.length === 0) {
      this.dom.modalEvidenceList.innerHTML = '<p class="empty-note" style="color:var(--text-sub); text-align:center; padding:20px;">深層鑑識データはまだ検出されていません。現場をさらに調査してください。</p>';
      return;
    }

    filtered.forEach(evId => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;

      const isDeep = this.isDeepForensicEvidence(evId);

      const item = document.createElement('div');
      item.className = `evidence-modal-item ${isDeep ? 'deep-cyber' : ''}`;
      const v = '?v=20261017_rev47';
      const imgSrc = ev.image ? `${ev.image}${v}` : '';
      const iconHtml = ev.image
        ? `<img src="${imgSrc}" alt="${ev.name}" class="ev-modal-icon-img" />`
        : ev.icon;

      const diagramHtml = ev.image
        ? `<div class="ev-modal-diagram-wrap" data-img-src="${imgSrc}" data-img-title="${ev.name}">
             <img src="${imgSrc}" alt="${ev.name}" class="ev-modal-diagram-img" />
             <span class="ev-diagram-zoom-badge">🔍 タップで拡大表示</span>
           </div>`
        : '';

      item.innerHTML = `
        <div class="evidence-modal-header">
          <span class="ev-icon">${iconHtml}</span>
          <span class="ev-name">${ev.name}</span>
          <span class="ev-badge ${isDeep ? 'cyber-badge' : ''}">${isDeep ? '⚡ [CYBER CORE] ' : ''}${ev.type}</span>
        </div>
        <p class="ev-summary">${ev.summary}</p>
        <p class="ev-detail">${ev.detail}</p>
        ${diagramHtml}
      `;

      if (ev.image) {
        const diagramEl = item.querySelector('.ev-modal-diagram-wrap');
        if (diagramEl) {
          diagramEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio.playClick();
            this.openImageViewer(ev.image, `📊 ${ev.name} 詳細解析データ`);
          });
        }
      }

      this.dom.modalEvidenceList.appendChild(item);
    });
  }

  // 拡大画像ビューアーモーダル制御
  openImageViewer(imgSrc, title = '📊 証拠画像詳細') {
    if (!this.dom.modalImageViewer || !this.dom.imageViewerImg) return;
    this.dom.imageViewerImg.src = imgSrc;
    if (this.dom.imageViewerTitle) {
      this.dom.imageViewerTitle.textContent = title;
    }
    this.dom.modalImageViewer.classList.remove('hidden');
  }

  closeImageViewer() {
    if (!this.dom.modalImageViewer) return;
    this.dom.modalImageViewer.classList.add('hidden');
    if (this.dom.imageViewerImg) {
      this.dom.imageViewerImg.src = '';
    }
  }

  // ----------------------------------------------------
  // 機密設定資料集 (EXTRAS ARCHIVE / GALLERY) モーダル
  // ----------------------------------------------------
  openGallery(defaultChar = 'yuta') {
    if (!this.dom.modalGallery) return;
    this.renderGalleryContent(defaultChar);
    this.dom.modalGallery.classList.remove('hidden');
  }

  renderGalleryContent(charId) {
    if (!this.dom.galleryBody || !this.galleryData) return;
    const data = this.galleryData[charId] || this.galleryData['yuta'];
    if (!data) return;

    // タブのactive状態更新
    if (this.dom.galleryCharTabs) {
      const tabs = this.dom.galleryCharTabs.querySelectorAll('.gallery-tab-btn');
      tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.char === data.id);
      });
    }

    // スプライトグリッドHTML
    const spritesHtml = data.sprites.map(s => `
      <div class="gallery-sprite-card" data-src="${s.src}" data-title="${data.name} [${s.label}]">
        <img src="${s.src}" alt="${s.label}" class="gallery-sprite-thumb" />
        <span class="gallery-sprite-label">${s.label}</span>
      </div>
    `).join('');

    this.dom.galleryBody.innerHTML = `
      <div class="gallery-sheet-card">
        <div class="gallery-sheet-title-wrap">
          <div class="gallery-sheet-title">
            <span>🎭 ${data.name}</span>
          </div>
          <span class="gallery-sheet-badge">${data.badge}</span>
        </div>

        <div class="gallery-sheet-img-wrap" id="gallery-sheet-click-target" title="クリックして全画面拡大表示">
          <img src="${data.sheet}" alt="${data.name} 設定資料シート" class="gallery-sheet-img" />
        </div>

        <div class="gallery-profile-box">
          <div class="gallery-profile-desc">${data.profile.replace(/\n/g, '<br>')}</div>
          <div class="gallery-design-notes">${data.designNotes.replace(/\n/g, '<br>')}</div>
        </div>

        <div class="gallery-sprites-section">
          <div class="gallery-sprites-title">
            <span>✨ 立ち絵表情差分アセット (${data.sprites.length}種・衣装完全統一)</span>
          </div>
          <div class="gallery-sprites-grid">
            ${spritesHtml}
          </div>
        </div>
      </div>
    `;

    // シート画像クリックで高精細拡大
    const sheetTarget = this.dom.galleryBody.querySelector('#gallery-sheet-click-target');
    if (sheetTarget) {
      sheetTarget.addEventListener('click', () => {
        this.audio.playClick();
        this.openImageViewer(data.sheet, `🎨 ${data.name} 公式設定資料シート`);
      });
    }

    // 各表情差分クリックで拡大
    const spriteCards = this.dom.galleryBody.querySelectorAll('.gallery-sprite-card');
    spriteCards.forEach(card => {
      card.addEventListener('click', () => {
        this.audio.playClick();
        const src = card.dataset.src;
        const title = card.dataset.title;
        this.openImageViewer(src, `🎭 ${title}`);
      });
    });
  }
}

// 起動
window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
