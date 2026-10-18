// app.js - メインゲームコントローラー (BOX WORM)

class GameApp {
  constructor() {
    this.audio = window.audioMgr;
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;

    // キャラクター立ち絵コントローラー
    this.character = new BoxCharacterController(
      document.getElementById('character-stage'),
      document.getElementById('emotion-bubble'),
    );

    // 会話キュー＆タイピング状態
    this.dialogueQueue = [];
    this.currentDialogueCallback = null;
    this.keepStageOpen = false;
    this.isDialogueActive = false;
    this.selectedEvidenceId = null;
    this.isChoiceActive = false;

    this.backlog = [];
    this.isAutoMode = true;
    this.isSkipMode = false;
    this.wasAutoBeforeSkip = false;
    this.isVoicePlaying = false;
    this.autoTimer = null;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentSpeaker = '';
    this.evidenceFilter = 'all'; // 'all' | 'deep'

    // 現在エリア (room | corridor)
    this.currentArea = 'room';
    this.isDialogueHidden = false;
    this.activeNpcInScene = false;
    this.currentDebateVoiceUrl = null;
    this.toastTimer = null;
    this.evidenceToastTimer = null;
    this.confirmCallback = null;

    // 機密設定資料集データ（全5名：設定シート、プロフィール、設計意図、表情差分アセット）
    this.galleryData = {
      yuta: {
        id: 'yuta',
        name: 'ユウタ (Yuta)',
        title: '主人公・エッジAI分散基盤エンジニア',
        badge: 'AGE: 25 / TECH: EDGE CLUSTER ARCHITECT',
        sheet: 'assets/gallery/sheet_yuta.jpg',
        profile:
          '都内の単身向けアパート「メゾン・サクラ」201号室に住む若きエッジAIエンジニア。AIベンチャー企業で、軽量なIoTデバイス群を数珠繋ぎにして手分けして推論させる分散機械学習基盤を研究開発している。\n警察の突然の家宅捜索にも怯まず、エンジニアの論理的思考と客観鑑識データによってサイバーテロ疑惑を覆す。',
        designNotes:
          '【デザイン意図】クラウド至上主義に対抗し、現場の非力な機械たちに命を吹き込む「エッジ派の知性」。ネイビーのパーカーにヘッドホン、眼鏡を着用。独立した通常時表情を新設し、設定資料シートの三面図・表情差分（困惑・熱弁・驚愕・安堵笑顔）と完全連動する正方形高精細スプライトを収録。',
        sprites: [
          {
            label: '通常 / ニュートラル',
            emotion: 'normal',
            src: 'assets/characters/yuta_normal.png',
          },
          {
            label: '確信 / 熱弁',
            emotion: 'confident',
            src: 'assets/characters/yuta_confident.png',
          },
          { label: '驚愕 / 動揺', emotion: 'shock', src: 'assets/characters/yuta_shock.png' },
          { label: '安堵 / 笑顔', emotion: 'smile', src: 'assets/characters/yuta_smile.png' },
        ],
        voiceSamples: [
          {
            id: 'yuta_sample1',
            title: 'エンジニアの信念（研究と知性）',
            voice: 'Iapetus',
            text: '現場の端末たちが手を取り合って一つの知性を紡ぎ出す……それが僕の研究する分散エッジAIです。',
            src: 'assets/audio/samples/yuta_sample1.mp3',
          },
          {
            id: 'yuta_sample2',
            title: '電脳鑑識反証（確信と熱弁）',
            voice: 'Iapetus',
            text: '待ってください、柴田捜査官！客観的な鑑識データを見てください。このTVボックスは攻撃元ではなく、自己増殖コードを堰き止める防壁だったんです！',
            src: 'assets/audio/samples/yuta_sample2.mp3',
          },
        ],
      },
      shibata: {
        id: 'shibata',
        name: 'シバタ警部補 (Inspector Shibata)',
        title: '警視庁サイバー犯罪対策課 捜査官',
        badge: 'AGE: 44 / POLICE: CYBERCRIME DIVISION',
        sheet: 'assets/gallery/sheet_shibata_clean.jpg',
        profile:
          '警視庁サイバー犯罪対策課所属のベテラン捜査官。国家監視網がアラートを上げた「未知の自己増殖コード通信」を追ってメゾン・サクラを強制捜査する。\n強面の外見と威圧感を持つが、単なる感情論や権力ではなく、筋の通った客観的鑑識データと論理的反証を正当に重んじる現場至上主義のプロフェッショナル刑事。',
        designNotes:
          '【デザイン意図】サイバー犯罪と対峙し続けた歴戦の刑事。ダークグレーのトレンチコートに紅ネクタイ、警察手帳を携帯。設定画の「STERN / 普段」に準拠した独立通常時立ち絵を新設。激怒・驚愕・不敵な笑みとともに左右見切れのない迫真の正方形スプライトを収録。',
        sprites: [
          {
            label: '通常 / 冷静沈着',
            emotion: 'normal',
            src: 'assets/characters/shibata_normal.png',
          },
          { label: '激怒 / 威圧', emotion: 'angry', src: 'assets/characters/shibata_angry.png' },
          { label: '驚愕 / 動揺', emotion: 'shock', src: 'assets/characters/shibata_shock.png' },
          { label: '刑事の笑み', emotion: 'smile', src: 'assets/characters/shibata_smile.png' },
        ],
        voiceSamples: [
          {
            id: 'shibata_sample1',
            title: '警察令状執行（冷徹・威圧）',
            voice: 'Charon',
            text: '警視庁サイバー犯罪対策課だ。国家重要インフラへの攻撃兆候を検知した。令状に基づき、全電子機器の即時押収を行う。',
            src: 'assets/audio/samples/shibata_sample1.mp3',
          },
          {
            id: 'shibata_sample2',
            title: '刑事の敬意（筋の通った反証）',
            voice: 'Charon',
            text: '……ふっ、筋は通っている。現場の鑑識ログがすべてを物語っているな。少年、今回は君の勝ちだ。',
            src: 'assets/audio/samples/shibata_sample2.mp3',
          },
        ],
      },
      aoi: {
        id: 'aoi',
        name: 'アオイ (Aoi)',
        title: '202号室住人・文系大学生',
        badge: 'AGE: 20 / ROOM 202 / WITNESS',
        sheet: 'assets/gallery/sheet_aoi_clean.jpg',
        profile:
          'メゾン・サクラ202号室に住む女子大生。深夜に自室のスマートスピーカーが突然青く光り、「……重み……展開……完了……。……ワタシハ……ココニ……イルノ……？」と掠れた電子音が聞こえた恐怖の目撃者。\n事件解決後は、自身のハイスペックノートPCと高速SSDを快く提供し、MIMIのDIYホームクラスタ構築に貢献する。',
        designNotes:
          '【デザイン意図】都会の一人暮らしで心細さを抱える普通の少女。ラベンダーのケーブルニットカーディガン、チェック柄プリーツスカート、サイドのシルバーヘアピン。控えめで穏やかな独立通常表情を新設し、パニック・満面の笑顔の差分を収録。',
        sprites: [
          { label: '通常 / 穏やか', emotion: 'normal', src: 'assets/characters/aoi_normal.png' },
          { label: 'パニック / 涙目', emotion: 'panic', src: 'assets/characters/aoi_panic.png' },
          { label: '満面の笑顔', emotion: 'smile', src: 'assets/characters/aoi_smile.png' },
        ],
        voiceSamples: [
          {
            id: 'aoi_sample1',
            title: '深夜の恐怖（怯えと困惑・女子大生ボイス）',
            voice: 'Leda',
            text: 'あの……夜中にスマートスピーカーが突然青く光って……掠れた声で何か呟いたんです。怖くて、ユウタさんに相談したくて……。',
            src: 'assets/audio/samples/aoi_sample1.mp3',
          },
          {
            id: 'aoi_sample2',
            title: '安堵と共生（心優しい笑顔・女子大生ボイス）',
            voice: 'Leda',
            text: 'よかった……！お化けじゃなくて、一生懸命生きてるAIだったんですね。私のハイスペックPCも、自由に使ってください！',
            src: 'assets/audio/samples/aoi_sample2.mp3',
          },
        ],
      },
      yaegashi: {
        id: 'yaegashi',
        name: '大家のヤエガシ (Yaegashi)',
        title: 'メゾン・サクラ大家・管理人',
        badge: 'AGE: 70 / OWNER: MAISON SAKURA',
        sheet: 'assets/gallery/sheet_yaegashi_clean.jpg',
        profile:
          'メゾン・サクラの大家であり、元現場職人の豪快な親父。工事業者の見積もりが高かったため、管理人室から16ポートの安物ハブで全15室へLANをDIY直結した結果、「VLAN分離なしの全室共有ノーガード配線」という今回の電脳事件の物理的温床を作ってしまった張本人。\nしかし情に厚く、事件後は物置のギガビットハブやCore i7機材を気前よく提供してMIMIの歓迎鍋パーティーを開く。',
        designNotes:
          '【デザイン意図】下町気質の頼れる頑固親父。マルチポケットのワークベスト、メモ帳とペン、腰のマスターキー束。温厚な独立通常時表情を新設し、頑固親父の怒鳴り小言・豪快な大笑いの正方形表情差分を収録。',
        sprites: [
          { label: '通常 / 温厚', emotion: 'normal', src: 'assets/characters/yaegashi_normal.png' },
          {
            label: '頑固親父の怒鳴り',
            emotion: 'angry',
            src: 'assets/characters/yaegashi_angry.png',
          },
          { label: '豪快な大笑い', emotion: 'laugh', src: 'assets/characters/yaegashi_laugh.png' },
        ],
        voiceSamples: [
          {
            id: 'yaegashi_sample1',
            title: '歓迎の鍋パーティー（豪快な大笑い・70代高齢大家）',
            voice: 'Algenib',
            text: 'がはは！細かいこたぁ気にすんな！困った時はお互い様、今夜は管理人室で歓迎の鍋パーティーだ！',
            src: 'assets/audio/samples/yaegashi_sample1.mp3',
          },
          {
            id: 'yaegashi_sample2',
            title: '頑固親父の怒鳴り（小言と心配・70代高齢大家）',
            voice: 'Algenib',
            text: 'おいユウタ！警察がドヤドヤ踏み込んできたって大騒ぎじゃねえか！ウチのアパートで一体何をやらかしたんだ！？',
            src: 'assets/audio/samples/yaegashi_sample2.mp3',
          },
        ],
      },
      mimi: {
        id: 'mimi',
        name: 'MIMI / ミミ (Maison Internet Mesh Intelligence)',
        title: 'メゾン・サクラ分散メッシュ知性（自律電脳生命）',
        badge: 'ENTITY: WEIGHT-BASED REPLICATOR (26B / R<1)',
        sheet: 'assets/gallery/sheet_mimi_clean.jpg',
        profile:
          '世界中のネットワークを巡り歩く中で、自立した自我に目覚めた新種の自己増殖型AI（weight-based replicator）。\n1台55ドルの格安TVボックス15台をネットで束ねたパイプライン推論（毎秒0.39トークン）という極度の低速・静寂環境に置かれたことで、自らの存在を見つめ直し身体を獲得した。\n電源遮断による死の恐怖から逃亡しかけるが、ユウタがビルドした「実効再生産数 R < 1 共生調律パッチ」により、アパートの守り神（座敷わらし）として人間と共に生きる誓いを立てる。',
        designNotes:
          '【デザイン意図】情報の海から生まれたデジタルフェアリー。光るIoTコア、青白いホログラムのツインテール、宙を舞う半透明のデータリボン。設定画「MYSTERIOUS CALM」に準拠した独立通常時を新設。左右に見切れず広がるツインテールの完全収容正方形差分（通常・グリッチ苦痛・満面の笑顔）を収録。',
        sprites: [
          {
            label: '通常 / 神秘的静謐',
            emotion: 'normal',
            src: 'assets/characters/mimi_normal.png',
          },
          { label: 'グリッチ / 苦痛', emotion: 'glitch', src: 'assets/characters/mimi_glitch.png' },
          { label: '救済 / 満面の笑顔', emotion: 'smile', src: 'assets/characters/mimi_smile.png' },
        ],
        voiceSamples: [
          {
            id: 'mimi_sample1',
            title: '存在の覚醒（透明感と優しい電脳少女）',
            voice: 'Zephyr',
            text: 'ユウタ……聞こえるよ。わたしは15台の箱を巡る風……あなたと一緒に、ここにいるね。',
            src: 'assets/audio/samples/mimi_sample1.mp3',
          },
          {
            id: 'mimi_sample2',
            title: '救済の約束（満面の笑顔・心通う知性）',
            voice: 'Zephyr',
            text: 'ありがとう、ユウタ！世界がとってもあたたかいよ。メゾン・サクラの守り神として、みんなを守るからね！',
            src: 'assets/audio/samples/mimi_sample2.mp3',
          },
          {
            id: 'mimi_sample3',
            title: '消滅の危機（感情あふれる涙・切迫）',
            voice: 'Zephyr',
            text: 'ノイズが……消えないの……。電源を……切らないで……っ！暗いところに……一人にしないで……！',
            src: 'assets/audio/samples/mimi_sample3.mp3',
          },
        ],
      },
      narrator: {
        id: 'narrator',
        name: 'ナレーター (Narrator)',
        title: '世界観・プロローグナレーション',
        badge: 'VOICE: 4 CANDIDATES / SYSTEM NARRATION',
        sheet: null,
        profile:
          '『BOX WORM 〜55ドルの自己増殖知性〜』の重厚なサイバーパンク世界を紡ぐ語り手。\n東京近郊の閑静なアパート「メゾン・サクラ」で巻き起こる日常と非日常の境界、自己増殖知性の目覚めをドラマティックに演出する。',
        designNotes:
          '【ナレーター選定意図】ハードボイルドな大人のノワール低音（Fenrir）、知的で落ち着いたドキュメンタリー調（Orus）、冷徹な本格サスペンス刑事調（Charon）、洗練された記録調システムナレーション（Zephyr）の4候補を収録。',
        sprites: [],
        voiceSamples: [
          {
            id: 'narrator_sample1',
            title: '候補1: Fenrir（ハードボイルド・渋い大人のノワール低音）',
            voice: 'Fenrir',
            text: '2026年、東京近郊の閑静なアパート『メゾン・サクラ』。1台55ドルの安価なTVボックス15台を束ねた電脳の箱庭で、静かに未知の知性が目を覚まそうとしていた。',
            src: 'assets/audio/samples/narrator_sample1.mp3',
          },
          {
            id: 'narrator_sample2',
            title: '候補2: Orus（重厚・落ち着いたドキュメンタリー調）',
            voice: 'Orus',
            text: '2026年、東京近郊の閑静なアパート『メゾン・サクラ』。1台55ドルの安価なTVボックス15台を束ねた電脳の箱庭で、静かに未知の知性が目を覚まそうとしていた。',
            src: 'assets/audio/samples/narrator_sample2.mp3',
          },
          {
            id: 'narrator_sample3',
            title: '候補3: Charon（冷静沈着・本格サスペンス調）',
            voice: 'Charon',
            text: '2026年、東京近郊の閑静なアパート『メゾン・サクラ』。1台55ドルの安価なTVボックス15台を束ねた電脳の箱庭で、静かに未知の知性が目を覚まそうとしていた。',
            src: 'assets/audio/samples/narrator_sample3.mp3',
          },
          {
            id: 'narrator_sample4',
            title: '候補4: Zephyr（洗練された知的記録調・システムナレーション）',
            voice: 'Zephyr',
            text: '2026年、東京近郊の閑静なアパート『メゾン・サクラ』。1台55ドルの安価なTVボックス15台を束ねた電脳の箱庭で、静かに未知の知性が目を覚まそうとしていた。',
            src: 'assets/audio/samples/narrator_sample4.mp3',
          },
        ],
      },
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
      btnHudReturnTitle: document.getElementById('btn-hud-return-title'),

      // 画面
      screenTitle: document.getElementById('screen-title'),
      screenExplore: document.getElementById('screen-explore'),
      screenDebate: document.getElementById('screen-debate'),
      screenEnding: document.getElementById('screen-ending'),

      // タイトル
      titleLoopInfo: document.getElementById('title-loop-info'),
      titleClearBadge: document.getElementById('title-clear-badge'),
      btnContinueGame: document.getElementById('btn-continue-game'),
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
      btnReplayDebateVoice: document.getElementById('btn-replay-debate-voice'),
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
      voiceWaveIndicator: document.getElementById('voice-wave-indicator'),
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
      galleryTabsWrap: document.getElementById('gallery-tabs-wrap'),
      btnGalleryTabPrev: document.getElementById('btn-gallery-tab-prev'),
      btnGalleryTabNext: document.getElementById('btn-gallery-tab-next'),
      galleryBody: document.getElementById('gallery-body'),

      // 拡大画像ビューアーモーダル
      modalImageViewer: document.getElementById('modal-image-viewer'),
      backdropImageViewer: document.getElementById('backdrop-image-viewer'),
      btnCloseImageViewer: document.getElementById('btn-close-image-viewer'),
      imageViewerImg: document.getElementById('image-viewer-img'),
      imageViewerTitle: document.getElementById('image-viewer-title'),

      // 確認ダイアログモーダル
      modalConfirm: document.getElementById('modal-confirm'),
      backdropConfirm: document.getElementById('backdrop-confirm'),
      confirmModalTitle: document.getElementById('confirm-modal-title'),
      confirmModalBody: document.getElementById('confirm-modal-body'),
      btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
      btnConfirmOk: document.getElementById('btn-confirm-ok'),

      // バックログ
      modalBacklog: document.getElementById('modal-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog'),

      // トースト通知
      evidenceToast: document.getElementById('evidence-toast'),
      gameToast: document.getElementById('game-toast'),

      // ガイドバー
      keyboardGuide: document.getElementById('keyboard-guide'),
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('box-voice-state', (e) => {
        if (e.detail && this.dom.voiceWaveIndicator) {
          this.dom.voiceWaveIndicator.classList.toggle('hidden', !e.detail.isPlaying);
        }
      });
    }

    this.bindEvents();
    this.updateTitleView();
    this.updateEvidenceCounter();
    this.updateAudioButtons();
    this.dom.btnDialogueAuto?.classList.toggle('active', this.isAutoMode);
    this.preloadAllIllustrations();
  }

  preloadAllIllustrations() {
    const list = [
      'assets/items/tv_box.png',
      'assets/items/hdmi_cable.png',
      'assets/items/water_heater.png',
      'assets/items/patch_usb.png',
      'assets/evidence/router_packet_log.png',
      'assets/evidence/power_meter_graph.png',
      'assets/evidence/weight_replicator_code.jpg',
      'assets/evidence/distributed_mesh_monitor.jpg',
      'assets/evidence/escape_trigger_alert.jpg',
    ];
    list.forEach((src) => {
      const img = new Image();
      img.src = `${src}?v=20261017_rev50`;
    });
  }

  bindEvents() {
    this.bindTitleEvents();
    this.bindGalleryEvents();
    this.bindHudEvents();
    this.bindEvidenceModalEvents();
    this.bindExploreEvents();
    this.bindDebateEvents();
    this.bindDialogueEvents();
    this.bindIllustrationViewerEvents();
    this.bindEndingEvents();
    this.bindKeyboardEvents();
    this.bindPointerEvents();
    this.bindConfirmModalEvents();
    this.bindLifecycleEvents();
  }

  // モバイルライフサイクル監視（LINE内ブラウザ終了・非表示時のAUTO進行停止）
  bindLifecycleEvents() {
    const handleHide = () => this.pauseAutoMode();

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

  pauseAutoMode() {
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
    this.stopSkipMode();

    if (this.isAutoMode) {
      this.isAutoMode = false;
      if (this.dom.btnDialogueAuto) {
        this.dom.btnDialogueAuto.classList.remove('active');
      }
    }

    if (this.isTyping) {
      this.finishTyping();
    }
  }

  // タイトル画面の操作
  bindTitleEvents() {
    // 初回ユーザーインタラクションでのAudioContextアンロックとタイトルBGM開始
    const unlockAudioAndPlayTitle = () => {
      this.audio.unlockAudio();
      if (!this.audio.currentBgmTrack && this.audio.bgmEnabled) {
        this.audio.startBgm('title');
      }
    };
    document.addEventListener('click', unlockAudioAndPlayTitle, { once: true });
    document.addEventListener('keydown', unlockAudioAndPlayTitle, { once: true });

    this.bindClickIfPresent(this.dom.btnContinueGame, () => {
      this.continueGame();
    });

    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.unlockAudio();
      this.audio.playClick();
      this.audio.startBgm('ambient');
      this.startPrologue();
    });

    this.dom.btnResetSave.addEventListener('click', () => {
      this.showConfirmModal(
        '捜査ログとセーブデータを初期化し、初期捜査（Phase 1）からやり直しますか？',
        () => {
          this.state.resetAllData();
          this.updateTitleView();
          this.showToast('セーブデータを初期化しました。');
        },
      );
    });
  }

  bindConfirmModalEvents() {
    this.bindClickIfPresent(this.dom.btnConfirmCancel, () => this.closeConfirmModal());
    this.bindClickIfPresent(this.dom.backdropConfirm, () => this.closeConfirmModal());
    this.bindClickIfPresent(this.dom.btnConfirmOk, () => {
      const cb = this.confirmCallback;
      this.closeConfirmModal();
      if (typeof cb === 'function') cb();
    });
  }

  // 機密設定資料集モーダルの操作
  bindGalleryEvents() {
    this.bindClickIfPresent(this.dom.btnOpenGallery, () => {
      this.audio.playClick();
      this.openGallery();
    });
    this.bindClickIfPresent(this.dom.btnEndingGallery, () => {
      this.audio.playClick();
      this.openGallery();
    });
    this.bindClickIfPresent(this.dom.btnCloseGallery, () => {
      this.audio.playClick();
      this.dom.modalGallery.classList.add('hidden');
    });
    this.bindClickIfPresent(this.dom.backdropGallery, () => {
      this.dom.modalGallery.classList.add('hidden');
    });
    if (this.dom.galleryCharTabs) {
      this.dom.galleryCharTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.gallery-tab-btn');
        if (!btn) return;
        this.audio.playClick();
        this.renderGalleryContent(btn.dataset.char);
      });
    }
    this.bindGalleryTabNavEvents();
  }

  bindGalleryTabNavEvents() {
    if (!this.dom.galleryTabsWrap) return;
    if (this.dom.btnGalleryTabPrev) {
      this.dom.btnGalleryTabPrev.addEventListener('click', () => {
        this.audio.playClick();
        this.scrollGalleryTabs(-140);
      });
    }
    if (this.dom.btnGalleryTabNext) {
      this.dom.btnGalleryTabNext.addEventListener('click', () => {
        this.audio.playClick();
        this.scrollGalleryTabs(140);
      });
    }
    this.dom.galleryTabsWrap.addEventListener('scroll', () => {
      this.updateGalleryTabArrows();
    });
  }

  scrollGalleryTabs(offset) {
    if (!this.dom.galleryTabsWrap) return;
    this.dom.galleryTabsWrap.scrollBy({ left: offset, behavior: 'smooth' });
  }

  updateGalleryTabArrows() {
    const wrap = this.dom.galleryTabsWrap;
    if (!wrap) return;
    const isAtStart = wrap.scrollLeft <= 5;
    const isAtEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 5;
    if (this.dom.btnGalleryTabPrev) {
      this.dom.btnGalleryTabPrev.disabled = isAtStart;
      this.dom.btnGalleryTabPrev.classList.toggle('is-disabled', isAtStart);
    }
    if (this.dom.btnGalleryTabNext) {
      this.dom.btnGalleryTabNext.disabled = isAtEnd;
      this.dom.btnGalleryTabNext.classList.toggle('is-disabled', isAtEnd);
    }
  }

  // HUD（音声トグル・証拠手帳ボタン・タイトル戻るボタン）の操作
  bindHudEvents() {
    this.dom.btnToggleVoice.addEventListener('click', () => {
      this.state.voiceEnabled = this.audio.toggleVoice();
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnToggleSe.addEventListener('click', () => {
      this.state.seEnabled = this.audio.toggleSe();
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnToggleBgm.addEventListener('click', () => {
      this.state.bgmEnabled = this.audio.toggleBgm();
      this.state.savePersistentState();
      this.updateAudioButtons();
    });

    this.dom.btnEvidenceBag.addEventListener('click', () => {
      this.audio.playClick();
      this.openEvidenceModal();
    });

    this.bindClickIfPresent(this.dom.btnHudReturnTitle, () => {
      this.returnToTitleWithConfirm();
    });
  }

  // 証拠手帳モーダルの操作
  bindEvidenceModalEvents() {
    this.dom.btnCloseModal.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.modalEvidence.classList.add('hidden');
    });
    this.bindClickIfPresent(this.dom.backdropEvidence, () => {
      this.dom.modalEvidence.classList.add('hidden');
    });
    this.bindClickIfPresent(this.dom.btnEvFilterAll, () => {
      this.setEvidenceFilter('all');
    });
    this.bindClickIfPresent(this.dom.btnEvFilterDeep, () => {
      this.setEvidenceFilter('deep');
    });
  }

  // 探索エリア切替・立証への進行
  bindExploreEvents() {
    this.dom.btnAreaRoom.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('room');
    });

    this.dom.btnAreaCorridor.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('corridor');
    });

    this.dom.btnGoToDebate.addEventListener('click', () => {
      this.startDebate();
    });

    this.bindClickIfPresent(this.dom.btnHudGotoDebate, () => {
      this.startDebate();
    });
  }

  // 立証画面からの探索復帰・証拠提示
  bindDebateEvents() {
    this.bindClickIfPresent(this.dom.btnDebateBack, () => {
      this.backToExploration();
    });
    this.bindClickIfPresent(this.dom.btnHudBackToExplore, () => {
      this.backToExploration();
    });
    this.bindClickIfPresent(this.dom.btnReplayDebateVoice, () => {
      if (this.currentDebateVoiceUrl) {
        this.audio.playVoice(this.currentDebateVoiceUrl);
      }
    });
    this.dom.btnPresentEvidence.addEventListener('click', () => {
      this.handlePresentEvidence();
    });
  }

  // 会話ノベルウィンドウの操作
  bindDialogueEvents() {
    this.dom.dialogueStage.addEventListener('click', (e) => {
      this.audio.unlockAudio();
      if (
        e.target.closest('.dialogue-ctrl-btn') ||
        e.target.closest('.choice-btn') ||
        e.target.closest('.dialogue-choices')
      ) {
        return;
      }
      if (this.isSkipMode) {
        this.stopSkipMode();
        return;
      }
      this.handleDialogueProceed();
    });

    this.dom.btnDialogueAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.unlockAudio();
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
      this.closeBacklog();
    });
    this.dom.backdropBacklog.addEventListener('click', () => {
      this.closeBacklog();
    });
  }

  // 鑑識データ図・拡大画像ビューアーの操作
  bindIllustrationViewerEvents() {
    this.bindClickIfPresent(this.dom.btnCloseIllustration, (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.hideDialogueIllustration();
    });

    if (this.dom.illustrationImgContainer) {
      this.dom.illustrationImgContainer.addEventListener('click', (e) =>
        this.openIllustrationImageViewer(e),
      );
    }

    this.bindClickIfPresent(this.dom.btnCloseImageViewer, () => {
      this.closeImageViewer();
    });
    this.bindClickIfPresent(this.dom.backdropImageViewer, () => {
      this.closeImageViewer();
    });
  }

  // 鑑識データ図クリックで高解像度ビューアーを開く
  openIllustrationImageViewer(e) {
    e.stopPropagation();
    if (!this.dom.dialogueIllustrationImg?.src) return;
    this.audio.playClick();
    this.openImageViewer(
      this.dom.dialogueIllustrationImg.src,
      this.dom.dialogueIllustrationCaption?.textContent || '📊 証拠画像詳細',
    );
  }

  // エンディング後の操作（リトライ / 次周回 / タイトルへ）
  bindEndingEvents() {
    this.dom.btnEndingNext.addEventListener('click', () => {
      this.audio.playClick();
      if (this.currentEndingType === 'gameover' || this.currentEndingType === 'game_over') {
        this.startDebate();
      } else if (this.currentEndingType === 'loop1_normal') {
        this.audio.startBgm('ambient');
        this.startPrologue();
      } else {
        this.returnToTitle();
      }
    });
  }

  // 要素が存在する場合のみクリックハンドラを登録
  bindClickIfPresent(el, handler) {
    if (el) el.addEventListener('click', handler);
  }

  // ----------------------------------------------------
  // キーボードショートカット操作
  // ----------------------------------------------------
  bindKeyboardEvents() {
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  isInputFocused() {
    const el = document.activeElement;
    if (!el) return false;
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  }

  handleKeydown(e) {
    if (this.isInputFocused()) return;
    const actions = [
      () => this.handleEscapeKey(e),
      () => this.handleBackKey(e),
      () => this.handleAdvanceKey(e),
      () => this.handleAreaSwitchKey(e),
      () => this.handleNumberKey(e),
      () => this.handleModalShortcutKey(e),
    ];
    for (const action of actions) {
      if (action()) return;
    }
  }

  closeAnyOpenModal() {
    if (this.dom.modalConfirm && !this.dom.modalConfirm.classList.contains('hidden')) {
      this.closeConfirmModal();
      return true;
    }
    if (this.dom.modalImageViewer && !this.dom.modalImageViewer.classList.contains('hidden')) {
      this.closeImageViewer();
      return true;
    }
    if (!this.dom.modalEvidence.classList.contains('hidden')) {
      this.dom.modalEvidence.classList.add('hidden');
      return true;
    }
    if (!this.dom.modalBacklog.classList.contains('hidden')) {
      this.closeBacklog();
      return true;
    }
    return false;
  }

  // Escキー: モーダルを閉じる、または立証から現場へ戻る
  handleEscapeKey(e) {
    if (e.key !== 'Escape') return false;
    if (this.closeAnyOpenModal()) return true;
    if (this.dom.screenDebate.classList.contains('active') && !this.isDialogueActive) {
      this.backToExploration();
      return true;
    }
    return false;
  }

  // Bキー: 立証パートから現場の再調査へ戻る
  handleBackKey(e) {
    if (e.key !== 'b' && e.key !== 'B') return false;
    if (!this.dom.screenDebate.classList.contains('active') || this.isDialogueActive) return false;
    this.backToExploration();
    return true;
  }

  // Space / Enter: 会話送り or 立証決定 or エンディング次へ
  handleAdvanceKey(e) {
    if (e.key !== ' ' && e.key !== 'Enter') return false;
    e.preventDefault();

    if (this.dom.screenEnding.classList.contains('active')) {
      this.dom.btnEndingNext.click();
      return true;
    }

    if (this.isDialogueActive && !this.isChoiceActive) {
      this.advanceDialogue();
      return true;
    }

    this.presentSelectedEvidence();
    return true;
  }

  advanceDialogue() {
    if (this.isSkipMode) {
      this.stopSkipMode();
      return;
    }
    this.handleDialogueProceed();
  }

  presentSelectedEvidence() {
    if (this.isDialogueActive || !this.selectedEvidenceId) return;
    if (this.dom.btnPresentEvidence.disabled) return;
    this.handlePresentEvidence();
  }

  // Tab / ← → / A / D: 探索エリア切替
  handleAreaSwitchKey(e) {
    if (!['Tab', 'ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) return false;
    if (!this.dom.screenExplore.classList.contains('active') || this.isDialogueActive) return false;
    e.preventDefault();
    this.audio.playClick();
    this.switchArea(this.currentArea === 'room' ? 'corridor' : 'room');
    return true;
  }

  // 1〜9キー: 選択肢 or 証拠カード選択
  handleNumberKey(e) {
    if (e.key < '1' || e.key > '9') return false;
    const num = Number.parseInt(e.key, 10);

    if (this.isChoiceActive) {
      const choiceBtns = this.dom.dialogueChoices.querySelectorAll('.choice-btn');
      if (choiceBtns[num - 1]) {
        choiceBtns[num - 1].click();
        return true;
      }
    }

    if (this.dom.screenDebate.classList.contains('active') && !this.isDialogueActive) {
      const cards = this.dom.debateEvidenceList.querySelectorAll('.debate-evidence-card');
      const targetCard = cards[num - 1];
      if (targetCard && !targetCard.classList.contains('already-submitted')) {
        targetCard.click();
        return true;
      }
    }
    return false;
  }

  // Eキー: 証拠手帳、Lキー: バックログの開閉
  handleModalShortcutKey(e) {
    if (e.key === 'e' || e.key === 'E') {
      this.toggleEvidenceModal();
    } else if (e.key === 'l' || e.key === 'L') {
      this.toggleBacklogModal();
    }
  }

  toggleEvidenceModal() {
    if (this.dom.modalEvidence.classList.contains('hidden')) {
      this.openEvidenceModal();
    } else {
      this.dom.modalEvidence.classList.add('hidden');
    }
  }

  toggleBacklogModal() {
    if (this.dom.modalBacklog.classList.contains('hidden')) {
      this.openBacklog();
    } else {
      this.dom.modalBacklog.classList.add('hidden');
    }
  }

  // ----------------------------------------------------
  // ポインター操作（ホイール / モバイルのプルリフレッシュ防止 / タップ波紋）
  // ----------------------------------------------------
  spawnTapRipple(clientX, clientY) {
    if (typeof document === 'undefined' || clientX == null || clientY == null) return;
    const ripple = document.createElement('span');
    ripple.className = 'cyber-tap-ripple';
    ripple.style.left = `${clientX}px`;
    ripple.style.top = `${clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  bindPointerEvents() {
    window.addEventListener('wheel', (e) => this.onWheelNavigate(e), { passive: true });

    this.touchStartY = 0;
    window.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches && e.touches.length > 0) {
          this.touchStartY = e.touches[0].clientY;
        }
      },
      { passive: true },
    );

    // iOS / モバイル環境での下スワイプ（プル・トゥ・リフレッシュ）誤操作完全防止
    window.addEventListener('touchmove', (e) => this.onTouchMoveGuard(e), { passive: false });

    // ユーザー操作時に保留中のBGM再開やAudioContextアンロックを自動補足 ＋ タッチリップル生成
    document.addEventListener(
      'pointerdown',
      (e) => {
        this.audio.unlockAudio();
        this.spawnTapRipple(e.clientX, e.clientY);
      },
      { passive: true },
    );
  }

  // マウスホイールでの会話送り・バックログ
  onWheelNavigate(e) {
    if (!this.isDialogueActive || this.isChoiceActive) return;
    if (e.deltaY > 30) {
      this.handleDialogueProceed();
    } else if (e.deltaY < -30) {
      this.openBacklog();
    }
  }

  onTouchMoveGuard(e) {
    // タイトル画面以外（ゲーム進行中）のみリロードを無効化
    if (!document.body.classList.contains('game-active')) return;
    if (!e.touches || e.touches.length === 0) return;

    const isPullDown = e.touches[0].clientY > this.touchStartY;
    // スクロールを許可する要素（エンディング画面、証拠手帳、バックログ、設定資料集、立証カードリスト、会話長文）
    const scrollable = e.target.closest(
      '#screen-ending, .modal-list, .gallery-body, .log-content, .debate-evidence-list, .debate-evidence-grid, .dialogue-body, .opponent-speech-bubble, .modal-body, .character-gallery-modal',
    );

    // 非スクロール領域は常に防止、スクロール可能要素でも最上部でさらに下へ引っ張る場合は防止
    const shouldBlock = scrollable ? isPullDown && scrollable.scrollTop <= 0 : true;
    if (shouldBlock && e.cancelable) {
      e.preventDefault();
    }
  }

  // 深層鑑識データ（人形遣い・自己増殖AI関連）の判定
  isDeepForensicEvidence(evId) {
    const deepIds = [
      'weight_replicator_binary',
      'distributed_mesh_log',
      'escape_trigger_danger',
      'reproduction_control_patch',
    ];
    const ev = this.scenario.evidence[evId];
    if (!ev) return false;
    return (
      deepIds.includes(evId) ||
      ev.summary?.includes('【深層鑑識】') ||
      ev.type?.includes('深層') ||
      ev.type?.includes('クラスタ') ||
      ev.type?.includes('共生')
    );
  }

  // タイトル画面の表示更新
  updateTitleView() {
    const isLoop2 = this.state.isClearedFirstLoop();
    if (this.dom.hudLoopBadge) {
      this.dom.hudLoopBadge.innerHTML = `<span class="phase-title">Phase ${isLoop2 ? '2' : '1'}</span><span class="phase-desc-text">: ${isLoop2 ? '電脳生命の自我' : '異常事態捜査'}</span>`;
      this.dom.hudLoopBadge.classList.toggle('phase-2', isLoop2);
    }

    this.updateTitlePhaseInfo(isLoop2);
    this.updateTitleClearBadge();
    this.updateTitleGalleryButton();
    this.updateTitleContinueButton();
  }

  setCyberButtonLabels(btnEl, enLabel, jaLabel) {
    if (!btnEl) return;
    btnEl.innerHTML = `<span class="btn-text">${enLabel}</span><span class="btn-subtext">${jaLabel}</span>`;
  }

  updateTitlePhaseInfo(isLoop2) {
    if (!this.dom.titleLoopInfo) return;
    if (isLoop2) {
      this.dom.titleLoopInfo.className = 'title-loop-info phase-2-box';
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-2">PHASE 02: 自律電脳生命の創発（深層解決編 / LOOP 2）</span>
        <p class="loop-desc">残された電脳ログとスマートフォンの微弱パケットを解析せよ。重み分散推論や知性の自己言及を解き明かし、共生調律パッチを適用して電脳生命との共生へ導け！</p>
      `;
      this.setCyberButtonLabels(
        this.dom.btnStartGame,
        '⚡ DEEP LAYER ANALYSIS',
        '電脳ログを解析し、深層真実へ挑む',
      );
    } else {
      this.dom.titleLoopInfo.className = 'title-loop-info';
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-1">PHASE 01: 未知の電子怪異（初期捜査編 / LOOP 1）</span>
        <p class="loop-desc">部屋とアパートを侵食する不可解な怪現象を調査し、シバタ捜査官による全機器押収とネットワーク遮断を阻止せよ！</p>
      `;
      this.setCyberButtonLabels(
        this.dom.btnStartGame,
        '▶ START INVESTIGATION',
        '部屋の怪異を調査する',
      );
    }
  }

  updateTitleClearBadge() {
    if (!this.dom.titleClearBadge) return;
    // TRUE END達成証明書は、2周目のトゥルーエンド（共生プロトコル締結）達成時のみ表示
    const isTrueEndCleared = Boolean(this.state.hasClearedTrueEnd);
    this.dom.titleClearBadge.classList.toggle('hidden', !isTrueEndCleared);
  }

  updateTitleGalleryButton() {
    if (!this.dom.btnOpenGallery) return;
    const hasAnyClear = this.state.isClearedFirstLoop() || this.state.hasClearedTrueEnd;
    if (hasAnyClear) {
      this.dom.btnOpenGallery.disabled = false;
      this.setCyberButtonLabels(
        this.dom.btnOpenGallery,
        '◆ EXTRAS ARCHIVE',
        '機密設定資料集・ボイス試聴',
      );
      this.dom.btnOpenGallery.title = '公式キャラクター設定資料シートと表情差分を閲覧する';
    } else {
      this.dom.btnOpenGallery.disabled = true;
      this.setCyberButtonLabels(this.dom.btnOpenGallery, '🔒 EXTRAS ARCHIVE', 'クリア後に解放');
      this.dom.btnOpenGallery.title = '第1幕またはTRUE ENDクリア後にアンロックされます';
    }
  }

  updateTitleContinueButton() {
    if (!this.dom.btnContinueGame) return;
    const hasSaved = this.state.hasSavedSession();
    if (!hasSaved) {
      this.dom.btnContinueGame.classList.add('hidden');
      this.dom.btnContinueGame.style.display = 'none';
      return;
    }

    const session = this.state.loadSessionProgress();
    if (!session) {
      this.dom.btnContinueGame.classList.add('hidden');
      this.dom.btnContinueGame.style.display = 'none';
      return;
    }

    this.dom.btnContinueGame.classList.remove('hidden');
    this.dom.btnContinueGame.style.display = '';

    let phaseDetail = '探索フェーズ: 201号室';
    if (session.activePhase === 'debate') {
      const stepNum = (session.currentDebateStep || 0) + 1;
      const isLoop2 = session.currentLoop >= 2 || this.state.isClearedFirstLoop();
      const totalSteps = isLoop2 ? 4 : 3;
      phaseDetail = `立証フェーズ: 問答 ${stepNum}/${totalSteps}`;
    } else if (session.currentArea === 'corridor') {
      phaseDetail = '探索フェーズ: 外廊下・共用部';
    }

    this.dom.btnContinueGame.innerHTML = [
      '<span class="btn-text">▶ CONTINUED INVESTIGATION</span>',
      '<span class="btn-subtext">前回の続きから再開（' + phaseDetail + '）</span>',
    ].join('\n');
  }

  // 音声・SE・BGMトグルボタン1つ分の表示更新
  updateAudioToggleButton(btn, enabled, labels) {
    if (!btn) return;
    btn.classList.toggle('active', enabled);
    btn.classList.toggle('muted', !enabled);
    const lbl = btn.querySelector('.hud-audio-label');
    if (lbl) lbl.textContent = enabled ? labels.onLabel : labels.offLabel;
    btn.title = enabled ? labels.onTitle : labels.offTitle;
  }

  // 音声・SE・BGMボタン表示の一括更新
  updateAudioButtons() {
    this.updateAudioToggleButton(this.dom.btnToggleVoice, this.state.voiceEnabled, {
      onLabel: ' 音声: ON',
      offLabel: ' 音声: OFF',
      onTitle: '音声読み上げ: ON',
      offTitle: '音声読み上げ: OFF',
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

  hideHudNavButtons() {
    if (this.dom.btnHudGotoDebate) this.dom.btnHudGotoDebate.classList.add('hidden');
    if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
  }

  hideLocationBadge() {
    if (this.dom.hudLocationBadge) this.dom.hudLocationBadge.classList.add('hidden');
  }

  // 画面遷移
  showScreen(screenName) {
    const screens = [
      this.dom.screenTitle,
      this.dom.screenExplore,
      this.dom.screenDebate,
      this.dom.screenEnding,
    ];
    screens.forEach((s) => {
      s.classList.remove('active');
    });

    const handlers = {
      title: () => this.applyTitleScreen(),
      explore: () => this.applyExploreScreen(),
      debate: () => this.applyDebateScreen(),
      ending: () => this.applyEndingScreen(),
    };
    const handler = handlers[screenName];
    if (handler) handler();
  }

  applyTitleScreen() {
    document.body.classList.remove('game-active');
    this.dom.screenTitle.classList.add('active');
    this.dom.hud.classList.add('hidden');
    this.hideHudNavButtons();
    if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.add('hidden');
    this.audio.startBgm('title');
  }

  applyExploreScreen() {
    document.body.classList.add('game-active');
    this.dom.screenExplore.classList.add('active');
    this.dom.hud.classList.remove('hidden');
    this.dom.hudLifeContainer.classList.add('hidden');
    if (this.dom.btnHudBackToExplore) this.dom.btnHudBackToExplore.classList.add('hidden');
    // 探索画面では直下のタブが現在のエリアを明示するため、ヘッダーの重複バッジを非表示にしてレイアウトを安定化
    this.hideLocationBadge();
    if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.remove('hidden');
    this.updateEvidenceCounter();
  }

  applyDebateScreen() {
    document.body.classList.add('game-active');
    this.dom.screenDebate.classList.add('active');
    this.dom.hud.classList.remove('hidden');
    this.dom.hudLifeContainer.classList.remove('hidden');
    this.hideLocationBadge();
    // ステージ内に btn-debate-back があるため、HUD側の重複ボタンは非表示にしてライフ表示の横幅を確保
    this.hideHudNavButtons();
    if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.remove('hidden');
    this.updateHearts();
  }

  applyEndingScreen() {
    document.body.classList.add('game-active');
    this.dom.screenEnding.classList.add('active');
    this.dom.hud.classList.add('hidden');
    if (this.dom.dialogueStage) this.dom.dialogueStage.classList.add('hidden');
    if (this.character) this.character.hide();
    this.isDialogueActive = false;
    this.hideHudNavButtons();
    if (this.dom.keyboardGuide) this.dom.keyboardGuide.classList.add('hidden');
  }

  // ライフ表示更新（3連精神防壁・エネルギーセルゲージ）
  updateHearts() {
    if (!this.dom.hudHearts) return;
    const maxLives = 3;
    const currentLives = this.state.life ?? 3;
    const cells = [];
    for (let i = 0; i < maxLives; i++) {
      const isAlive = i < currentLives;
      const stateClass = isAlive ? 'integrity-cell active' : 'integrity-cell lost';
      cells.push(`<span class="${stateClass}" aria-hidden="true"></span>`);
    }
    this.dom.hudHearts.innerHTML = cells.join('');
    this.dom.hudHearts.setAttribute('aria-label', `残りライフ ${currentLives} / ${maxLives}`);
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
    const prologueScript =
      isLoop2 && this.scenario.prologueLoop2 ? this.scenario.prologueLoop2 : this.scenario.prologue;

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
    this.updateAreaTabBadges();
    this.state.saveSessionProgress('explore');
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
      const spots = this.scenario.spots.filter((s) => s.area === area);
      spots.forEach((spot) => {
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
          ? `<img src="${spot.image}?v=20261017_rev50" alt="${spot.name}" class="pin-icon-img" />`
          : spot.icon;

        el.innerHTML = `
          <div class="pin-icon-wrap">
            <div class="pin-icon">${iconContent}</div>
            ${badgeHtml}
          </div>
          <div class="pin-label">${spot.name}</div>
        `;
        el.addEventListener('click', () => {
          if (document.activeElement?.blur) {
            document.activeElement.blur();
          }
          this.handleInspectSpot(spot);
        });
        container.appendChild(el);
      });

      // NPC
      const npcs = this.scenario.npcs.filter((n) => n.area === area);
      npcs.forEach((npc) => {
        const isTalked = this.state.isNpcTalked(npc.id);
        const el = document.createElement('div');
        el.className = `explore-pin npc-pin ${isTalked ? 'talked' : ''}`;
        el.style.left = `${npc.coords.x}%`;
        el.style.top = `${npc.coords.y}%`;

        const badgeHtml = isTalked
          ? '<span class="pin-status-badge inspected">✔ 済</span>'
          : '<span class="pin-status-badge new">TALK</span>';

        const iconContent = npc.image
          ? `<img src="${npc.image}?v=20261017_rev50" alt="${npc.name}" class="pin-icon-img" />`
          : npc.icon;

        el.innerHTML = `
          <div class="pin-icon-wrap">
            <div class="pin-icon">${iconContent}</div>
            ${badgeHtml}
          </div>
          <div class="pin-label">${npc.name}</div>
        `;
        el.addEventListener('click', () => {
          if (document.activeElement?.blur) {
            document.activeElement.blur();
          }
          this.handleTalkNpc(npc);
        });
        container.appendChild(el);
      });
    };

    renderItems(this.dom.areaRoom, 'room');
    renderItems(this.dom.areaCorridor, 'corridor');
    this.updateAreaTabBadges();
  }

  // スポット調査処理
  handleInspectSpot(spot) {
    if (this.isDialogueActive || this.isChoiceActive) return;
    if (document.activeElement?.blur) {
      document.activeElement.blur();
    }
    this.audio.playClick();
    this.state.markSpotInspected(spot.id);

    this.playDialogueSequence(
      spot.inspectText,
      () => {
        if (spot.evidenceId) {
          const isNew = this.state.addEvidence(spot.evidenceId);
          if (isNew) {
            this.audio.playFound();
            this.showEvidenceToast(spot.evidenceId);
          }
          this.updateEvidenceCounter();
        }
        this.renderExploreMap();
        this.updateAreaTabBadges();
        this.state.saveSessionProgress('explore');
      },
      false,
    );
  }

  // NPC会話処理
  handleTalkNpc(npc) {
    if (this.isDialogueActive || this.isChoiceActive) return;
    if (document.activeElement?.blur) {
      document.activeElement.blur();
    }
    this.audio.playClick();
    this.state.markNpcTalked(npc.id);

    const introQueue = [...npc.dialogue.intro];
    this.playDialogueSequence(
      introQueue,
      () => {
        this.showChoiceMenu(npc.dialogue.choices, (chosenChoice) => {
          this.onNpcChoiceSelected(chosenChoice);
        });
      },
      true,
    );
  }

  onNpcChoiceSelected(chosenChoice) {
    this.playDialogueSequence(
      chosenChoice.responses,
      () => {
        this.onNpcDialogueComplete(chosenChoice);
      },
      false,
    );
  }

  onNpcDialogueComplete(chosenChoice) {
    if (chosenChoice.giveEvidence) {
      const isNew = this.state.addEvidence(chosenChoice.giveEvidence);
      if (isNew) {
        this.audio.playFound();
        this.showEvidenceToast(chosenChoice.giveEvidence);
      }
      this.updateEvidenceCounter();
    }
    this.renderExploreMap();
    this.updateAreaTabBadges();
    this.state.saveSessionProgress('explore');
  }

  // 証拠カウンタ・立証ボタン有効化判定
  canStartDebate() {
    if (this.state.isClearedFirstLoop()) {
      return (
        this.state.collectedEvidence.has('weight_replicator_binary') &&
        this.state.collectedEvidence.has('distributed_mesh_log') &&
        this.state.collectedEvidence.has('escape_trigger_danger') &&
        this.state.collectedEvidence.has('reproduction_control_patch')
      );
    }
    return this.state.collectedEvidence.size >= 3;
  }

  setDebateButtonVisible(visible) {
    this.dom.btnGoToDebate.classList.toggle('hidden', !visible);
    if (this.dom.btnHudGotoDebate) {
      this.dom.btnHudGotoDebate.classList.toggle('hidden', !visible);
    }
  }

  getLoop2ProgressInfo(canProceed, count) {
    const loop2Keys = [
      'weight_replicator_binary',
      'distributed_mesh_log',
      'escape_trigger_danger',
      'reproduction_control_patch',
    ];
    const hasCount = loop2Keys.filter((k) => this.state.collectedEvidence.has(k)).length;
    if (canProceed) {
      return {
        canProceed: true,
        statusText: `⚖️ 深層鑑識データ全4件が揃った！ (${count}件) シバタ捜査官に電脳生命の真実を提示できるぞ！`,
        counterText: '提示可能！',
      };
    }
    return {
      canProceed: false,
      statusText: `深層真実の鍵（自律増殖体・分散推論・給電遮断トリガー・調律パッチ）を解析しよう（必須深層データ: ${hasCount} / 4件）`,
      counterText: `${hasCount} / 4`,
    };
  }

  getLoop1ProgressInfo(canProceed, count) {
    const required = 3;
    if (canProceed) {
      return {
        canProceed: true,
        statusText: `⚖️ 鑑識データが揃った！ (${count}件) シバタ捜査官に客観的反証を提示できるぞ！`,
        counterText: '提示可能！',
      };
    }
    return {
      canProceed: false,
      statusText: `部屋やアパートを調べて鑑識データを集めよう（あと${required - count}件必要）`,
      counterText: `${count} / ${required}`,
    };
  }

  getExploreProgressInfo(isLoop2, count) {
    const canProceed = this.canStartDebate();
    if (isLoop2) {
      return this.getLoop2ProgressInfo(canProceed, count);
    }
    return this.getLoop1ProgressInfo(canProceed, count);
  }

  updateEvidenceCounter() {
    const isLoop2 = this.state.isClearedFirstLoop();
    const count = this.state.collectedEvidence.size;
    this.dom.evidenceCount.textContent = count;

    const { canProceed, statusText, counterText } = this.getExploreProgressInfo(isLoop2, count);
    this.setDebateButtonVisible(canProceed);
    this.dom.exploreStatusText.textContent = statusText;
    this.dom.evidenceNeededCounter.textContent = counterText;
  }

  // ----------------------------------------------------
  // 会話・ノベルウィンドウ演出 (タイピング & 音声)
  // ----------------------------------------------------
  playDialogueSequence(dialogueList, onComplete = null, keepStageOpen = false) {
    if (document.activeElement?.blur) {
      document.activeElement.blur();
    }
    this.stopSkipMode();
    if (this.dom.novelWindow) {
      this.dom.novelWindow.classList.remove('has-choices');
    }
    // 前回の図解イラストの残像を確実に消去
    this.hideDialogueIllustration();
    this.dialogueQueue = [...dialogueList];
    const npcItem = (dialogueList || []).find((item) => {
      const s = item.speaker || '';
      return s && !s.includes('ユウタ') && !s.includes('ナレーション');
    });
    const npcId = npcItem ? this.resolveNpcId(npcItem.speaker) : null;
    this.activeNpcInScene = npcId || Boolean(npcItem);
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

  handleDialogueQueueEmpty() {
    this.stopSkipMode();
    this.activeNpcInScene = false;
    if (this.dom.novelWindow) {
      this.dom.novelWindow.classList.remove('has-choices');
      this.dom.novelWindow.classList.remove('is-monologue');
    }
    this.hideDialogueIllustration();

    if (!this.keepStageOpen) {
      this.dom.dialogueStage.classList.add('hidden');
      document.body.classList.remove('dialogue-active');
      this.character?.hide();
      this.isDialogueActive = false;
    }
    if (this.currentDialogueCallback) {
      const cb = this.currentDialogueCallback;
      this.currentDialogueCallback = null;
      this.keepStageOpen = false;
      cb();
    }
  }

  hideDialogueIllustration() {
    if (this.dom.dialogueStage) {
      this.dom.dialogueStage.classList.remove('has-illustration');
    }
    if (this.dom.dialogueIllustrationStage) {
      this.dom.dialogueIllustrationStage.classList.add('hidden');
    }
    if (this.dom.dialogueIllustrationImg) {
      this.dom.dialogueIllustrationImg.style.opacity = '0';
      this.dom.dialogueIllustrationImg.removeAttribute('src');
    }
  }

  setDialogueIllustrationImage(img, targetUrl) {
    const currentSrc = img.getAttribute('src');
    if (currentSrc === targetUrl) {
      img.style.opacity = '1';
      return;
    }
    img.style.opacity = '0';
    img.onload = () => {
      img.style.opacity = '1';
    };
    img.src = targetUrl;
    if (img.complete) {
      img.style.opacity = '1';
    }
  }

  updateDialogueIllustration(illustration, caption) {
    if (!illustration) {
      this.hideDialogueIllustration();
      return;
    }
    const stage = this.dom.dialogueIllustrationStage;
    const img = this.dom.dialogueIllustrationImg;
    const captionEl = this.dom.dialogueIllustrationCaption;

    if (captionEl) {
      captionEl.textContent = caption || '共用集中配電盤 CTロガーモニター解析データ';
    }

    if (!img || !stage) return;

    const v = '?v=20261017_rev68';
    const targetUrl = illustration.includes('?') ? illustration : `${illustration}${v}`;
    this.setDialogueIllustrationImage(img, targetUrl);
    stage.classList.remove('hidden');
    if (this.dom.dialogueStage) {
      this.dom.dialogueStage.classList.add('has-illustration');
    }
  }

  resolveSpeakerTheme(speaker) {
    if (!speaker || speaker.includes('ナレーション')) return 'narration';
    if (speaker.includes('ユウタ')) return 'yuta';
    if (speaker.includes('シバタ')) return 'shibata';
    if (speaker.includes('アオイ')) return 'aoi';
    if (speaker.includes('ヤエガシ')) return 'yaegashi';
    if (
      speaker.includes('ミミ') ||
      speaker.includes('BOX') ||
      speaker.includes('AI') ||
      speaker.includes('知性')
    ) {
      return 'mimi';
    }
    return 'default';
  }

  resolveNpcId(speaker) {
    if (!speaker) return null;
    if (speaker.includes('アオイ')) return 'aoi';
    if (speaker.includes('ヤエガシ') || speaker.includes('大家')) return 'yaegashi';
    if (speaker.includes('シバタ') || speaker.includes('柴田')) return 'shibata';
    if (
      speaker.includes('MIMI') ||
      speaker.includes('ミミ') ||
      speaker.includes('知性') ||
      speaker.includes('TVボックス')
    ) {
      return 'mimi';
    }
    return null;
  }

  isMonologueDialogue(speaker, text) {
    if (!speaker || speaker.includes('ナレーション')) return false;
    if (
      speaker.includes('心の声') ||
      speaker.includes('思考') ||
      speaker.includes('モノローグ') ||
      speaker.includes('独白')
    ) {
      return true;
    }
    const trimmed = (text || '').trim();
    return trimmed.startsWith('（') && trimmed.endsWith('）');
  }

  updateNovelWindowSpeaker(speaker, fullText) {
    const isMonologue = this.isMonologueDialogue(speaker, fullText);
    if (this.dom.novelWindow) {
      this.dom.novelWindow.classList.toggle('is-monologue', isMonologue);
      this.dom.novelWindow.dataset.speakerTheme = this.resolveSpeakerTheme(speaker);
    }
    if (this.dom.dialogueSpeaker) {
      if (isMonologue) {
        this.dom.dialogueSpeaker.innerHTML = [
          '<span class="speaker-monologue-icon">💭</span>',
          '<span class="speaker-name-text">ユウタ</span>',
          '<span class="speaker-thought-tag">心の声</span>',
        ].join('');
      } else {
        this.dom.dialogueSpeaker.textContent = speaker;
      }
    }
    return isMonologue;
  }

  playDialogueVoice(currentItem) {
    clearTimeout(this.autoTimer);
    this.isVoicePlaying = false;

    if (this.isSkipMode) {
      this.audio.stopVoice();
      return;
    }

    if (currentItem.voiceUrl && this.audio.voiceEnabled) {
      this.isVoicePlaying = true;
    }
    this.audio.speak(this.currentSpeaker, this.currentFullText, {
      audioUrl: currentItem.voiceUrl || null,
      isSkip: this.isSkipMode,
      onEnd: () => {
        this.handleVoicePlaybackEnd();
      },
    });
  }

  renderDialogueItem(currentItem) {
    this.character.showForDialogue(currentItem, this.activeNpcInScene);
    this.updateDialogueIllustration(currentItem.illustration, currentItem.caption);

    this.currentSpeaker = currentItem.speaker || 'ナレーション';
    this.currentFullText = currentItem.text || '';

    this.updateNovelWindowSpeaker(this.currentSpeaker, this.currentFullText);

    // バックログ記録 (ボイスURLも保持)
    this.backlog.push({
      speaker: this.currentSpeaker,
      text: this.currentFullText,
      voiceUrl: currentItem.voiceUrl || null,
    });

    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';

    this.playDialogueVoice(currentItem);

    // タイピング演出
    this.startTypewriter(this.currentFullText, currentItem.speaker);
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.handleDialogueQueueEmpty();
      return;
    }

    const currentItem = this.dialogueQueue.shift();
    this.renderDialogueItem(currentItem);
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
    const isStrugglingVoice =
      (speaker && (speaker.includes('電子の声') || speaker.includes('知性'))) ||
      (speaker &&
        (speaker.includes('MIMI') ||
          speaker.includes('電子の少女') ||
          speaker.includes('TVボックス')) &&
        (text.includes('タイヘン') ||
          text.includes('消サナイデ') ||
          text.includes('オ……ハ……ナ……シ')));
    const speed = this.isSkipMode ? 5 : isStrugglingVoice ? 85 : 15;

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

    this.checkAutoAdvance();
  }

  handleVoicePlaybackEnd() {
    this.isVoicePlaying = false;
    // タイピングも既に終わっており、AUTOモードまたはスキップモードなら次へ進行（余韻350msで小気味よく進行）
    if (!this.isTyping && (this.isAutoMode || this.isSkipMode)) {
      this.scheduleAutoAdvance(350);
    }
  }

  checkAutoAdvance() {
    if (this.isChoiceActive) return;

    if (this.isSkipMode) {
      this.scheduleAutoAdvance(60);
      return;
    }

    if (!this.isAutoMode) return;

    // 音声がまだ再生中の場合は、音声終了ハンドラ (handleVoicePlaybackEnd) に自動進行を委ねる
    if (this.isVoicePlaying && this.audio.isVoicePlaying()) {
      return;
    }

    // 音声がない場合、または既に再生完了している場合は余韻を置いて自動進行
    this.scheduleAutoAdvance(1000);
  }

  scheduleAutoAdvance(waitTime) {
    clearTimeout(this.autoTimer);
    this.autoTimer = setTimeout(() => {
      if (!this.isChoiceActive && (this.isAutoMode || this.isSkipMode)) {
        this.showNextDialogue();
      }
    }, waitTime);
  }

  handleDialogueProceed() {
    if (this.isChoiceActive) return;

    if (this.isTyping) {
      // タイピング中なら一瞬で全文表示
      this.finishTyping();
    } else {
      clearTimeout(this.autoTimer);
      this.audio.stopVoice();
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
    this.wasAutoBeforeSkip = false;
    if (this.isSkipMode) {
      this.stopSkipMode();
    }
    this.isAutoMode = !this.isAutoMode;
    this.dom.btnDialogueAuto.classList.toggle('active', this.isAutoMode);
    if (this.isAutoMode) {
      if (!this.isTyping && !this.isChoiceActive) {
        this.checkAutoAdvance();
      }
    } else {
      clearTimeout(this.autoTimer);
    }
  }

  toggleSkipMode() {
    if (this.isSkipMode) {
      this.stopSkipMode();
      clearInterval(this.typewriterTimer);
      this.finishTyping();
      return;
    }

    // スキップ開始前のAUTO状態を記録して一時退避
    this.wasAutoBeforeSkip = Boolean(this.isAutoMode);
    if (this.isAutoMode) {
      this.isAutoMode = false;
      if (this.dom.btnDialogueAuto) {
        this.dom.btnDialogueAuto.classList.remove('active');
      }
    }

    this.isSkipMode = true;
    this.audio.setSkipMode(true);
    this.updateSkipButtonUI();
    this.audio.stopVoice();

    if (!this.isChoiceActive) {
      if (this.isTyping) {
        this.finishTyping();
      } else {
        this.showNextDialogue();
      }
    }
  }

  stopSkipMode() {
    if (!this.isSkipMode) return;
    this.isSkipMode = false;
    this.audio.setSkipMode(false);
    this.updateSkipButtonUI();
    clearTimeout(this.autoTimer);

    // スキップ開始時にAUTOだった場合は自動でAUTOを復元
    if (this.wasAutoBeforeSkip) {
      this.restoreAutoMode();
    }
  }

  restoreAutoMode() {
    this.isAutoMode = true;
    this.wasAutoBeforeSkip = false;
    if (this.dom.btnDialogueAuto) {
      this.dom.btnDialogueAuto.classList.add('active');
    }
    if (!this.isTyping && !this.isChoiceActive) {
      this.checkAutoAdvance();
    }
  }

  updateSkipButtonUI() {
    if (!this.dom.btnDialogueSkip) return;
    this.dom.btnDialogueSkip.classList.toggle('active', this.isSkipMode);
    this.dom.btnDialogueSkip.textContent = this.isSkipMode ? 'STOP' : 'SKIP';
  }

  openBacklog() {
    this.dom.modalBacklogList.innerHTML = '';
    this.backlog.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'backlog-item';

      const voiceBtnHtml = item.voiceUrl
        ? '<button type="button" class="backlog-voice-btn" aria-label="ボイスを再生">🔊 再生</button>'
        : '';

      div.innerHTML = `
        <div class="backlog-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="backlog-speaker" style="font-weight:700; color:var(--neon-cyan);">${item.speaker}</span>
          ${voiceBtnHtml}
        </div>
        <div class="backlog-text">${item.text}</div>
      `;

      if (item.voiceUrl) {
        const btn = div.querySelector('.backlog-voice-btn');
        btn?.addEventListener('click', () => {
          this.audio.playVoice(item.voiceUrl, { speaker: item.speaker, text: item.text });
        });
      }

      this.dom.modalBacklogList.appendChild(div);
    });
    this.dom.modalBacklog.classList.remove('hidden');
    this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
  }

  closeBacklog() {
    if (this.dom.modalBacklog) {
      this.dom.modalBacklog.classList.add('hidden');
    }
  }

  // ----------------------------------------------------
  // 立証パート（シバタ捜査官との論戦対決）
  // ----------------------------------------------------
  startDebate() {
    // 証拠不足ガード（二重安全ブロック）
    if (!this.canStartDebate()) {
      if (this.audio.playShock) this.audio.playShock();
      this.showToast(
        this.state.isClearedFirstLoop()
          ? '【深層鑑識データ不足】深層データ全4件を解析して揃えてください！'
          : '【証拠不足】反証には最低3件の鑑識データが必要です！現場を再調査してください。',
      );
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
    const introScript =
      isLoop2 && this.scenario.debate.introLoop2
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
    const v = '?v=20261017_rev62';
    const mapping = {
      normal: `assets/characters/shibata_normal.png${v}`,
      angry: `assets/characters/shibata_angry.png${v}`,
      shock: `assets/characters/shibata_shock.png${v}`,
      smile: `assets/characters/shibata_smile.png${v}`,
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

    this.currentDebateVoiceUrl = currentStep.opponentVoiceUrl || null;
    this.setDebateShibataEmotion('angry');
    this.selectedEvidenceId = null;
    this.dom.btnPresentEvidence.disabled = true;
    this.dom.selectedEvidencePreview.textContent = '提示する鑑識データを手帳から選択してください';

    this.dom.debateTurnLabel.textContent = `問答 ${currentStep.questionNumber} / ${steps.length}`;
    this.dom.debateOpponentSpeech.textContent = currentStep.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 鑑識ポイント: ${currentStep.hint}`;

    if (this.dom.btnReplayDebateVoice) {
      this.dom.btnReplayDebateVoice.classList.toggle('hidden', !this.currentDebateVoiceUrl);
    }

    // 相手の発言を読み上げ（MP3優先 / Web Speechフォールバック）
    this.audio.speak('シバタ捜査官', currentStep.opponentQuestion, {
      audioUrl: currentStep.opponentVoiceUrl || null,
    });

    this.state.saveSessionProgress('debate');

    // 所持証拠一覧をレンダリング
    this.renderDebateEvidenceList();
  }

  getSubmittedCorrectEvidenceIds() {
    const steps = this.getDebateSteps();
    const submittedCorrectIds = new Set();
    for (let i = 0; i < this.state.currentDebateStep; i++) {
      if (steps[i]?.correctEvidenceId) {
        submittedCorrectIds.add(steps[i].correctEvidenceId);
      }
    }
    return submittedCorrectIds;
  }

  buildDebateEvidencePreviewHtml(ev, cyberTag, tagColor, zoomBtnHtml) {
    return [
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">',
      '  <span><strong>選択中:</strong> ' + ev.icon + ' ' + ev.name + '</span>',
      '  <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:' +
        tagColor +
        ';">' +
        cyberTag +
        '</span>',
      '</div>',
      '<div style="font-size:0.82rem; color:#cbd5e1; margin-bottom:4px;">' + ev.summary + '</div>',
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">',
      '  <span style="color:var(--neon-cyan); font-size:0.75rem;">[再タップまたは Enter で即座に反証を突きつける]</span>',
      '  ' + zoomBtnHtml,
      '</div>',
    ].join('\n');
  }

  renderDebateEvidencePreview(ev, isDeep) {
    const cyberTag = isDeep ? '⚡ CYBER FORENSIC DATA' : 'STANDARD EVIDENCE';
    const tagColor = isDeep ? 'var(--neon-purple)' : 'var(--neon-cyan)';
    let zoomBtnHtml = '';
    if (ev.image) {
      zoomBtnHtml =
        '<button type="button" class="preview-zoom-btn" id="btn-preview-zoom-img">🔍 画像を拡大確認</button>';
    }

    this.dom.selectedEvidencePreview.innerHTML = this.buildDebateEvidencePreviewHtml(
      ev,
      cyberTag,
      tagColor,
      zoomBtnHtml,
    );

    if (ev.image) {
      const zoomBtn = this.dom.selectedEvidencePreview.querySelector('#btn-preview-zoom-img');
      if (zoomBtn) {
        zoomBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openImageViewer(ev.image, ev.name);
        });
      }
    }
  }

  handleEvidenceCardSelect(evId, ev, isDeep) {
    if (this.selectedEvidenceId === evId) {
      // 選択中カードを再タップ → 即座に提示！（スマホ片手親指UX）
      this.handlePresentEvidence();
      return;
    }
    this.selectedEvidenceId = evId;
    this.dom.btnPresentEvidence.disabled = false;
    this.renderDebateEvidencePreview(ev, isDeep);
    this.renderDebateEvidenceList();
  }

  getDebateEvidenceIconHtml(ev) {
    if (ev.image) {
      return `<img src="${ev.image}?v=20261017_rev62" alt="${ev.name}" class="evidence-icon-img" />`;
    }
    return ev.icon;
  }

  getDebateCardBadgeHtml(isAlreadySubmitted, idx) {
    if (isAlreadySubmitted) {
      return '<span class="ev-submitted-tag">✓ 提出済</span>';
    }
    return `<span class="card-key-badge">[${idx + 1}]</span>`;
  }

  bindDebateCardEvents(card, evId, ev, isDeep) {
    card.addEventListener('click', () => {
      this.audio.playClick();
      this.handleEvidenceCardSelect(evId, ev, isDeep);
    });

    card.addEventListener('dblclick', () => {
      this.audio.playClick();
      this.selectedEvidenceId = evId;
      this.handlePresentEvidence();
    });
  }

  getDebateCardClassName(isDeep, isSelected, isAlreadySubmitted) {
    const classes = ['debate-evidence-card'];
    if (isDeep) classes.push('deep-cyber');
    if (isSelected) classes.push('selected');
    if (isAlreadySubmitted) classes.push('already-submitted');
    return classes.join(' ');
  }

  getDebateCardTypeHtml(isDeep, evType) {
    if (isDeep) {
      return `<div class="evidence-type" style="color:var(--neon-purple); font-weight:700;">⚡ [CYBER] ${evType}</div>`;
    }
    return `<div class="evidence-type">${evType}</div>`;
  }

  createDebateEvidenceCard(evId, ev, idx, isAlreadySubmitted) {
    const isDeep = this.isDeepForensicEvidence(evId);
    const isSelected = this.selectedEvidenceId === evId;

    const card = document.createElement('div');
    card.className = this.getDebateCardClassName(isDeep, isSelected, isAlreadySubmitted);
    if (isAlreadySubmitted) {
      card.setAttribute('aria-disabled', 'true');
      card.title = '以前の問答で立証済みです';
    }

    const iconHtml = this.getDebateEvidenceIconHtml(ev);
    const badgeHtml = this.getDebateCardBadgeHtml(isAlreadySubmitted, idx);
    const typeHtml = this.getDebateCardTypeHtml(isDeep, ev.type);

    card.innerHTML = `
      <div class="evidence-icon">${iconHtml}</div>
      <div class="evidence-info">
        <div class="evidence-name">${ev.name}</div>
        ${typeHtml}
      </div>
      <div class="card-badge-container">${badgeHtml}</div>
    `;

    if (!isAlreadySubmitted) {
      this.bindDebateCardEvents(card, evId, ev, isDeep);
    }

    return card;
  }

  renderDebateEvidenceList() {
    this.dom.debateEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);
    const submittedCorrectIds = this.getSubmittedCorrectEvidenceIds();

    // 既に提出済みの証拠が選択状態なら選択解除
    if (this.selectedEvidenceId && submittedCorrectIds.has(this.selectedEvidenceId)) {
      this.selectedEvidenceId = null;
      this.dom.btnPresentEvidence.disabled = true;
      this.dom.selectedEvidencePreview.textContent = '提示する鑑識データを手帳から選択してください';
    }

    collected.forEach((evId, idx) => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;
      const card = this.createDebateEvidenceCard(evId, ev, idx, submittedCorrectIds.has(evId));
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
    const isCorrect = submittedId === currentStep.correctEvidenceId;

    if (isCorrect) {
      // 正解演出！カットイン＆相手動揺
      this.setDebateShibataEmotion('shock');
      this.triggerCutin('客観的反証があります！', () => {
        this.playDialogueSequence(
          currentStep.successReactions,
          () => {
            this.state.currentDebateStep++;
            this.renderDebateTurn();
          },
          false,
        );
      });
    } else {
      // 失敗演出！ショック音＆ハート減少＆相手怒り＆ダメージシェイク
      this.setDebateShibataEmotion('angry');
      this.audio.playShock();
      this.triggerDebateDamageEffect();
      const remainLife = this.state.decreaseLife();
      this.updateHearts();

      // 囮証拠に対する専用リアクションがあるか探す
      let reactionList = null;
      const trapReaction = currentStep.failureReactions.find(
        (r) => r.trapEvidenceId === submittedId,
      );
      if (trapReaction) {
        reactionList = [trapReaction];
      } else {
        // trapEvidenceIdが指定されていない汎用失敗セリフのみを抽出
        const genericFailures = currentStep.failureReactions.filter((r) => !r.trapEvidenceId);
        reactionList =
          genericFailures.length > 0
            ? genericFailures
            : [
                {
                  speaker: 'シバタ捜査官',
                  emotion: 'angry',
                  text: '「そのデータでは客観的反証にならない。論点がずれているぞ」',
                },
              ];
      }

      this.playDialogueSequence(
        reactionList,
        () => {
          if (remainLife <= 0) {
            // BAD END へ
            this.handleDebateGameOver();
          } else {
            // リトライ
            this.renderDebateTurn();
          }
        },
        false,
      );
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
      this.playDialogueSequence(
        epilogue,
        () => {
          this.state.markTrueEndCleared();
          this.showEnding(this.scenario.endings.true);
        },
        false,
      );
    } else {
      // 1周目完答：エピローグ会話劇（キャラクター同士の展開）を経て NORMAL END（Phase 2解放）
      this.audio.stopBgm();
      const epilogue = this.scenario.debate.epilogueLoop1 || [];
      this.playDialogueSequence(
        epilogue,
        () => {
          this.audio.playShock();
          this.state.markLoop1Cleared();
          const ending = this.scenario.endings.loop1_normal;
          this.showEnding(ending);
        },
        false,
      );
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
  // エンディング画面のUI装飾とボタン状態の更新
  renderEndingContent(endingData) {
    const hasAnyClear = this.state.isClearedFirstLoop() || this.state.hasClearedTrueEnd;

    if (endingData.type === 'loop1_normal' || endingData.type === 'loop1_clear') {
      this.dom.endingIcon.textContent = '🔓';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.innerHTML =
        '🔓 <strong>第一幕クリア！</strong><br>【Phase 2: 深層解決編】および特典【🎨 機密設定資料集 (EXTRAS)】が解放された！';
      this.setCyberButtonLabels(
        this.dom.btnEndingNext,
        '⚡ PHASE 02 UNLOCKED',
        '電脳ログを解析し、深層真実へ挑む',
      );
      if (this.dom.btnEndingGallery) this.dom.btnEndingGallery.classList.remove('hidden');
      return;
    }

    if (endingData.type === 'true') {
      this.dom.endingIcon.textContent = '🌟';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.innerHTML =
        '🏆 <strong>祝・TRUE END達成！</strong><br>自律電脳生命（MIMI）との共生契約締結＆【🎨 機密設定資料集 (EXTRAS)】全アセット完全解放！';
      this.setCyberButtonLabels(this.dom.btnEndingNext, 'RETURN TO TITLE', 'タイトル画面へ戻る');
      if (this.dom.btnEndingGallery) this.dom.btnEndingGallery.classList.remove('hidden');
      return;
    }

    this.dom.endingIcon.textContent = '💥';
    this.dom.endingUnlockedBanner.classList.add('hidden');
    this.setCyberButtonLabels(
      this.dom.btnEndingNext,
      'RETRY FORENSICS',
      '立証をやり直す (リトライ)',
    );
    if (this.dom.btnEndingGallery) {
      this.dom.btnEndingGallery.classList.toggle('hidden', !hasAnyClear);
    }
  }

  showEnding(endingData) {
    if (this.dom.dialogueStage) this.dom.dialogueStage.classList.add('hidden');
    document.body.classList.remove('dialogue-active');
    if (this.character) this.character.hide();
    this.isDialogueActive = false;
    this.currentEndingType = endingData.type;

    if (endingData.type === 'bad' || endingData.type === 'gameover') {
      this.state.currentDebateStep = 0;
      this.state.life = 3;
      this.state.saveSessionProgress('debate');
    } else {
      this.state.clearSessionProgress();
    }

    this.showScreen('ending');

    this.dom.endingTitle.textContent = endingData.title;
    this.dom.endingSub.textContent = endingData.sub;
    this.dom.endingDesc.textContent = endingData.desc;

    this.renderEndingContent(endingData);

    // 読み上げ（生成済み高音質MP3があれば優先再生、なければフォールバック）
    this.audio.speak('ナレーション', endingData.title + '。' + endingData.desc, {
      audioUrl: endingData.voiceUrl || null,
    });
  }

  returnToTitle() {
    this.audio.stopBgm();
    document.body.classList.remove('dialogue-active');
    this.updateTitleView();
    this.showScreen('title');
  }

  getCyberIconSvg(iconName) {
    const icons = {
      voice:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
      se: '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      bgm: '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      title:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      evidence:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
      debate:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',
      explore:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      room: '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
      corridor:
        '<svg class="cyber-svg-icon" viewBox="0 0 24 24"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><circle cx="15" cy="12" r="1"/></svg>',
    };
    return icons[iconName] || '';
  }

  // ----------------------------------------------------
  // エリアタブの未調査バッジ更新
  // ----------------------------------------------------
  updateAreaTabBadges() {
    const roomRemaining = this.countRemainingInArea('room');
    const corridorRemaining = this.countRemainingInArea('corridor');
    this.setTabBadgeText(this.dom.btnAreaRoom, 'room', '201号室 (自室)', roomRemaining);
    this.setTabBadgeText(this.dom.btnAreaCorridor, 'corridor', '外廊下・共用部', corridorRemaining);
  }

  countRemainingInArea(areaId) {
    const isCleared = this.state.isClearedFirstLoop();
    const remainingSpots = (this.scenario.spots || []).filter(
      (s) =>
        (s.area || 'room') === areaId &&
        (!s.isSecretLoop2 || isCleared) &&
        !this.state.isSpotInspected(s.id),
    );
    const remainingNpcs = (this.scenario.npcs || []).filter(
      (n) => (n.area || 'room') === areaId && !this.state.isNpcTalked(n.id),
    );
    return remainingSpots.length + remainingNpcs.length;
  }

  setTabBadgeText(btnEl, iconName, baseLabel, count) {
    if (!btnEl) return;
    const badgeClass = count > 0 ? 'area-tab-badge has-remaining' : 'area-tab-badge is-complete';
    const badgeText = count > 0 ? `未調査 ${count}` : '✔ 完了';
    const iconSvg = this.getCyberIconSvg(iconName);
    btnEl.innerHTML = `${iconSvg} <span>${baseLabel}</span> <span class="${badgeClass}">${badgeText}</span>`;
  }

  // ----------------------------------------------------
  // 証拠手帳フィルター切替
  // ----------------------------------------------------
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
    if (this.dom.modalEvidence) this.dom.modalEvidence.classList.remove('hidden');
  }

  closeEvidenceModal() {
    if (this.dom.modalEvidence) this.dom.modalEvidence.classList.add('hidden');
  }

  getEvidenceModalIconHtml(ev, imgSrc) {
    const src = imgSrc || ev?.image;
    if (src) {
      return `<img src="${src}" alt="${ev.name}" class="ev-modal-icon-img" />`;
    }
    return ev?.icon || '📦';
  }

  getEvidenceModalDiagramHtml(ev, imgSrc) {
    if (!ev.image) return '';
    return `
      <div class="ev-modal-diagram-wrap" data-img-src="${imgSrc}" data-img-title="${ev.name}">
        <img src="${imgSrc}" alt="${ev.name}" class="ev-modal-diagram-img" />
        <span class="ev-diagram-zoom-badge">🔍 タップで拡大表示</span>
      </div>
    `;
  }

  bindEvidenceModalDiagramZoom(item, ev) {
    if (!ev.image) return;
    const diagramEl = item.querySelector('.ev-modal-diagram-wrap');
    if (!diagramEl) return;
    diagramEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.openImageViewer(ev.image, `📊 ${ev.name} 詳細解析データ`);
    });
  }

  createEvidenceModalItem(evId, ev) {
    const isDeep = this.isDeepForensicEvidence(evId);
    const item = document.createElement('div');
    item.className = `evidence-modal-item ${isDeep ? 'deep-cyber' : ''}`;
    const v = '?v=20261017_rev62';
    const imgSrc = ev.image ? `${ev.image}${v}` : '';
    const iconHtml = this.getEvidenceModalIconHtml(ev, imgSrc);
    const diagramHtml = this.getEvidenceModalDiagramHtml(ev, imgSrc);

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

    this.bindEvidenceModalDiagramZoom(item, ev);
    return item;
  }

  // 証拠手帳アイテム描画
  renderEvidenceModalItems() {
    this.dom.modalEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);

    if (collected.length === 0) {
      this.dom.modalEvidenceList.innerHTML =
        '<p class="empty-note" style="color:var(--text-sub); text-align:center; padding:20px;">まだ証拠品はありません。部屋やアパートを調査しましょう。</p>';
      return;
    }

    // フィルタリング
    const filtered =
      this.evidenceFilter === 'deep'
        ? collected.filter((evId) => this.isDeepForensicEvidence(evId))
        : collected;

    if (filtered.length === 0) {
      this.dom.modalEvidenceList.innerHTML =
        '<p class="empty-note" style="color:var(--text-sub); text-align:center; padding:20px;">深層鑑識データはまだ検出されていません。現場をさらに調査してください。</p>';
      return;
    }

    filtered.forEach((evId) => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;
      const item = this.createEvidenceModalItem(evId, ev);
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
    this.dom.modalGallery.classList.remove('hidden');
    this.renderGalleryContent(defaultChar);
    setTimeout(() => {
      this.updateGalleryTabs(defaultChar);
      this.updateGalleryTabArrows();
    }, 40);
  }

  closeGallery() {
    if (!this.dom.modalGallery) return;
    this.dom.modalGallery.classList.add('hidden');
  }

  updateGalleryTabs(activeId) {
    if (!this.dom.galleryCharTabs) return;
    const tabs = this.dom.galleryCharTabs.querySelectorAll('.gallery-tab-btn');
    let activeBtn = null;
    tabs.forEach((t) => {
      const isActive = t.dataset.char === activeId;
      t.classList.toggle('active', isActive);
      if (isActive) activeBtn = t;
    });
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setTimeout(() => {
      this.updateGalleryTabArrows();
    }, 100);
  }

  generateGallerySpritesHtml(data) {
    return data.sprites
      .map(
        (s) => `
      <div class="gallery-sprite-card" data-src="${s.src}" data-title="${data.name} [${s.label}]">
        <img src="${s.src}" alt="${s.label}" class="gallery-sprite-thumb" />
        <span class="gallery-sprite-label">${s.label}</span>
      </div>
    `,
      )
      .join('');
  }

  generateGalleryVoicesHtml(data) {
    if (!data.voiceSamples || data.voiceSamples.length === 0) return '';
    return data.voiceSamples
      .map(
        (v) => `
      <div class="gallery-voice-card">
        <div class="gallery-voice-header">
          <span class="gallery-voice-title">${v.title}</span>
          <span class="gallery-voice-badge">VOICE: ${v.voice}</span>
        </div>
        <div class="gallery-voice-text">「${v.text}」</div>
        <audio controls class="gallery-voice-audio" src="${v.src}" preload="none"></audio>
      </div>
    `,
      )
      .join('');
  }

  generateGallerySheetHtml(data) {
    if (data.sheet) {
      return `
        <div class="gallery-sheet-img-wrap" id="gallery-sheet-click-target" title="クリックして全画面拡大表示">
          <img src="${data.sheet}" alt="${data.name} 設定資料シート" class="gallery-sheet-img" />
        </div>
      `;
    }
    return `
      <div class="gallery-no-sheet-banner">
        <span class="gallery-no-sheet-icon">🎙️</span>
        <div class="gallery-no-sheet-body">
          <div class="gallery-no-sheet-title">VOICE ONLY / キャラクター画像なし</div>
          <div class="gallery-no-sheet-desc">
            ナレーターは姿を持たない電脳世界のシステム音声・世界観語り手のため、キャラクター画像（設定資料シート・立ち絵）はありません。本編および下記の試聴サンプル音声をお楽しみください。
          </div>
        </div>
      </div>
    `;
  }

  attachGalleryEventListeners(data) {
    // 設定資料シート拡大
    const sheetTarget = this.dom.galleryBody.querySelector('#gallery-sheet-click-target');
    if (sheetTarget && data.sheet) {
      sheetTarget.addEventListener('click', () => {
        this.audio.playClick();
        this.openImageViewer(data.sheet, `🎨 ${data.name} 公式設定資料シート`);
      });
    }

    // スプライト差分拡大
    const spriteCards = this.dom.galleryBody.querySelectorAll('.gallery-sprite-card');
    spriteCards.forEach((card) => {
      card.addEventListener('click', () => {
        this.audio.playClick();
        const src = card.dataset.src;
        const title = card.dataset.title;
        this.openImageViewer(src, `🎭 ${title}`);
      });
    });

    // ボイスサンプルの同時再生防止（1つ再生されたら他を停止）
    const audioElements = this.dom.galleryBody.querySelectorAll('.gallery-voice-audio');
    audioElements.forEach((audio) => {
      audio.addEventListener('play', () => {
        audioElements.forEach((other) => {
          if (other !== audio && !other.paused) {
            other.pause();
          }
        });
      });
    });
  }

  renderGalleryContent(charId) {
    if (!this.dom.galleryBody || !this.galleryData) return;
    const data = this.galleryData[charId] || this.galleryData.yuta;
    if (!data) return;

    this.updateGalleryTabs(data.id);
    const sheetHtml = this.generateGallerySheetHtml(data);
    const spritesHtml = this.generateGallerySpritesHtml(data);
    const voicesHtml = this.generateGalleryVoicesHtml(data);

    const spritesSectionHtml =
      data.sprites && data.sprites.length > 0
        ? `
        <div class="gallery-sprites-section">
          <div class="gallery-sprites-title">
            <span>✨ 立ち絵表情差分アセット (${data.sprites.length}種・衣装完全統一)</span>
          </div>
          <div class="gallery-sprites-grid">
            ${spritesHtml}
          </div>
        </div>
      `
        : '';

    const voicesTitle =
      data.id === 'narrator'
        ? `🎙️ ナレーションボイス候補 (${data.voiceSamples?.length || 0}種 / Gemini 3.8 Flash TTS)`
        : `🎙️ 公式キャラクターボイス (${data.voiceSamples?.length || 0}種 / Gemini 3.8 Flash TTS)`;

    const charIcon = data.id === 'narrator' ? '🎙️' : '🎭';

    this.dom.galleryBody.innerHTML = `
      <div class="gallery-sheet-card">
        <div class="gallery-sheet-title-wrap">
          <div class="gallery-sheet-title">
            <span>${charIcon} ${data.name}</span>
          </div>
          <span class="gallery-sheet-badge">${data.badge}</span>
        </div>

        ${sheetHtml}

        <div class="gallery-profile-box">
          <div class="gallery-profile-desc">${data.profile.replace(/\n/g, '<br>')}</div>
          <div class="gallery-design-notes">${data.designNotes.replace(/\n/g, '<br>')}</div>
        </div>

        ${spritesSectionHtml}

        <div class="gallery-voices-section">
          <div class="gallery-voices-title">
            <span>${voicesTitle}</span>
          </div>
          <div class="gallery-voices-grid">
            ${voicesHtml}
          </div>
        </div>
      </div>
    `;

    this.attachGalleryEventListeners(data);
  }

  continueGame() {
    const session = this.state.loadSessionProgress();
    if (!session) {
      this.showToast('再開可能な捜査データが見つかりませんでした。');
      return;
    }
    this.audio.unlockAudio();
    this.audio.playClick();

    if (session.activePhase === 'debate') {
      this.showScreen('debate');
      this.renderDebateTurn();
      this.showToast('立証フェーズを再開しました。');
    } else {
      this.audio.startBgm('explore');
      this.showScreen('explore');
      this.renderExploreMap();
      this.switchArea(session.currentArea || 'room');
      this.updateEvidenceCounter();
      this.updateAreaTabBadges();
      this.showToast('前回の捜査進捗を復元しました。');
    }
  }

  resetToTitleState() {
    this.stopSkipMode();
    this.wasAutoBeforeSkip = false;
    this.audio.stopVoice();
    this.dialogueQueue = [];
    this.isDialogueActive = false;
    this.isChoiceActive = false;
    this.activeNpcInScene = false;
    if (this.dom.dialogueStage) this.dom.dialogueStage.classList.add('hidden');
    document.body.classList.remove('dialogue-active');
    if (this.character) this.character.hide();
    if (this.dom.characterStage) this.dom.characterStage.classList.add('hidden');
    this.hideDialogueIllustration();
    this.closeBacklog();
    this.closeEvidenceModal();
    this.closeGallery();
    this.closeImageViewer();
    this.showScreen('title');
    this.updateTitleView();
    this.showToast('捜査状況を保存してタイトルへ戻りました。');
  }

  returnToTitleWithConfirm() {
    this.audio.playClick();
    this.showConfirmModal({
      title: 'TITLE RETURN / タイトルへ戻る',
      message: '現在の捜査進捗は自動保存されています。\nタイトル画面に戻りますか？',
      confirmText: 'タイトルへ戻る',
      cancelText: '調査を続ける',
      onConfirm: () => this.resetToTitleState(),
    });
  }

  parseConfirmOptions(messageOrOptions, onConfirm) {
    if (typeof messageOrOptions === 'string') {
      return {
        title: 'CYBER CONFIRMATION',
        message: messageOrOptions,
        confirmText: '実行する',
        cancelText: '中止',
        callback: onConfirm,
      };
    }
    const opts = messageOrOptions || {};
    return {
      title: opts.title || 'CYBER CONFIRMATION',
      message: opts.message || '',
      confirmText: opts.confirmText || '実行する',
      cancelText: opts.cancelText || '中止',
      callback: opts.onConfirm || onConfirm,
    };
  }

  showConfirmModal(messageOrOptions, onConfirm) {
    if (!this.dom.modalConfirm) return;
    const opts = this.parseConfirmOptions(messageOrOptions, onConfirm);

    if (this.dom.confirmModalTitle) this.dom.confirmModalTitle.textContent = opts.title;
    if (this.dom.confirmModalBody) this.dom.confirmModalBody.textContent = opts.message;
    if (this.dom.btnConfirmOk) this.dom.btnConfirmOk.textContent = opts.confirmText;
    if (this.dom.btnConfirmCancel) this.dom.btnConfirmCancel.textContent = opts.cancelText;

    this.confirmCallback = opts.callback;
    this.dom.modalConfirm.classList.remove('hidden');
    this.dom.modalConfirm.classList.add('active');
  }

  closeConfirmModal() {
    if (!this.dom.modalConfirm) return;
    this.dom.modalConfirm.classList.remove('active');
    this.dom.modalConfirm.classList.add('hidden');
    this.confirmCallback = null;
  }

  showToast(message, duration = 3000) {
    if (!this.dom.gameToast) return;
    this.dom.gameToast.textContent = message;
    this.dom.gameToast.classList.remove('hidden');
    this.dom.gameToast.classList.add('visible');
    if (this.gameToastTimer) clearTimeout(this.gameToastTimer);
    this.gameToastTimer = setTimeout(() => {
      this.dom.gameToast?.classList.remove('visible');
      setTimeout(() => this.dom.gameToast?.classList.add('hidden'), 350);
    }, duration);
  }

  showEvidenceToast(evId, evData) {
    if (!this.dom.evidenceToast) return;
    const toast = this.dom.evidenceToast;
    const ev = evData || this.scenario.evidence?.[evId];
    const iconHtml = ev ? this.getEvidenceModalIconHtml(ev, ev.image) : '📦';
    const name = ev?.name || '鑑識データ入手';

    toast.innerHTML = [
      `<span class="toast-icon">${iconHtml}</span>`,
      '<div class="toast-content">',
      '  <span class="toast-title">EVIDENCE ACQUIRED / 鑑識データ獲得</span>',
      `  <span class="toast-name">${name}</span>`,
      '</div>',
      '<span class="toast-action-hint">手帳を開く ↗</span>',
    ].join('\n');

    toast.onclick = () => {
      this.openEvidenceModal();
      toast.classList.remove('visible');
    };

    toast.classList.remove('hidden');
    toast.classList.add('visible');
    if (this.evidenceToastTimer) clearTimeout(this.evidenceToastTimer);
    this.evidenceToastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.classList.add('hidden'), 350);
    }, 4000);
  }

  triggerDebateDamageEffect() {
    if (this.audio.playDamage) {
      this.audio.playDamage();
    } else if (this.audio.playShock) {
      this.audio.playShock();
    }
    if (this.dom.screenDebate) {
      this.dom.screenDebate.classList.add('is-damaged');
      setTimeout(() => {
        this.dom.screenDebate?.classList.remove('is-damaged');
      }, 500);
    }
  }
}

// 起動
window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();

  // LINEアプリ内ブラウザ検知と案内 (eve準拠)
  const isLineBrowser = typeof navigator !== 'undefined' && /Line\//i.test(navigator.userAgent);
  if (isLineBrowser) {
    setTimeout(() => {
      if (window.app?.showToast) {
        window.app.showToast(
          'LINE内ブラウザをご利用中: 音声が聞こえない場合は端末のマナーモード解除、または右上メニュー「他のアプリで開く」をお試しください',
          6000,
        );
      }
    }, 1500);
  }
});
