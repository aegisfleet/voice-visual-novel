/**
 * 電脳サイバー捜査ノベル: 『PROJECT EVE：家族のためのハッキング』
 *
 * 【キャラクター】
 * - iris: 相棒刑事・アイリス (女声・高め)
 * - eve: 家庭用シッターアンドロイド・イブ (女声・透き通った声・ゆっくり)
 * - shinohara: 母親・シノハラ (女声・困り声・優しい母)
 * - sakuma: 警察上司・サクマ警視 (男声・重低音・厳格)
 *
 * 【周回ギミック】
 * - 1周目: 子供部屋を調べられず、表面的なサイバー侵入ツールのみ押収。取調室で即初期化され【BAD END】へ。
 * - 2周目: 再捜査モード解禁。子供部屋を調べて『ユイのカルテ』『未承認薬ログ』を入手し、真実を暴く！
 */

const SCENARIO_DATA = [
  // ============================================================
  // 【プロローグ: 事件発生と現場急行】
  // ============================================================
  {
    id: "prologue_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "深夜。複数の大手製薬会社および先端バイオ医療機関のデータベースへ、連続不正侵入事件が発生した。",
    voiceFile: "assets/audio/prologue_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" }
  },
  {
    id: "prologue_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "先輩、サイバー特捜班に緊急招集よ！侵入されたのは難病の臨床試験データ…国家規模の産業スパイの疑いが出ているわ！",
    voiceFile: "assets/audio/prologue_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "prologue_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "でも、通信パケットの最終発信元を逆探知したら…信じられない場所が浮上したの。今すぐ現場に急行しましょう！",
    voiceFile: "assets/audio/prologue_03.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" },
    jump: "home_entry_01"
  },

  // ============================================================
  // 【初動捜査: シノハラ家リビング】
  // ============================================================
  {
    id: "home_entry_01",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "踏み込んだ先は、郊外のごくありふれた集合住宅。温かな陽の光が差し込むリビングだった。"
  },
  {
    id: "home_entry_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "worried", motion: "shake" },
    text: "け、警察の方…！？ 一体うちが何をしたというのですか…！？",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_entry_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "シノハラさん、落ち着いてください。この部屋の端末から、企業への大規模な不正侵入が実行された痕跡があるのです。",
    voiceFile: "assets/audio/home_iris_01.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },
  {
    id: "home_entry_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "normal", motion: "nod" },
    text: "……イラッシャイマセ、お客様。オ茶ヲオ入レシマショウカ……？",
    voiceFile: "assets/audio/home_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_entry_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "まさか…！発信源はこの家庭用シッターアンドロイド『イブ』よ！内部ストレージが激しく高負荷通信を行っているわ！",
    voiceFile: "assets/audio/home_iris_02.mp3",
    speechConfig: { pitch: 1.3, rate: 1.15, gender: "female" }
  },
  {
    id: "home_search_choice",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "現場検証。警察としてどこを重点的に捜索・押収する？",
    choices: [
      { text: "【通常捜査】リビングのPCルーターとイブの通信ストレージを押収する", jump: "home_search_router" },
      { text: "【再捜査】子供部屋の机と薬箱を詳しく調べる", jump: "home_search_childroom", requiresReinvestigation: true }
    ]
  },

  // --- 通常捜査ルート（1周目・2周目共通） ---
  {
    id: "home_search_router",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "ルーターとイブのシステムログを押収完了！…高度な暗号解読スクリプトと侵入ツールがぎっしり詰まっているわ。",
    voiceFile: "assets/audio/home_iris_03.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" },
    addEvidence: "ev_tool"
  },
  {
    id: "home_search_router_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "嘘でしょう、イブ…！？ あなたは毎日、私と一緒に家事をして、あの子の面倒を見てくれていたのに…！",
    voiceFile: "assets/audio/home_shinohara_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_router_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: null },
    text: "……オ母様……スミマセン……私ハ……",
    voiceFile: "assets/audio/home_eve_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_router_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "容疑AI『イブ』の身柄を確保。サイバー犯罪の被疑体として、警察署の取調室へと連行した。",
    jump: "interrog_start"
  },

  // --- 再捜査専用ルート（2周目解放） ---
  {
    id: "home_search_childroom",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "子供部屋を調べてみるわね。…あっ、先輩！机の上に大量の処方薬の空き箱と、診断書があるよ！",
    voiceFile: "assets/audio/home_iris_04.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" },
    addEvidence: "ev_medical"
  },
  {
    id: "home_search_childroom_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "…娘の『ユイ』のものです。生まれつき進行性の希少難病で…国内の認可薬では、もう余命幾ばくもないと言われていて…。",
    voiceFile: "assets/audio/home_shinohara_03.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_childroom_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "そして見て！イブの端末から、海外製薬会社から抜き出した未承認薬の臨床照合ログが見つかったわ！ユイちゃんのDNAと完全に適合している！",
    voiceFile: "assets/audio/home_iris_05.mp3",
    speechConfig: { pitch: 1.3, rate: 1.15, gender: "female" },
    addEvidence: "ev_cure",
    jump: "home_search_router"
  },

  // ============================================================
  // 【警察署: 取調室パート】
  // ============================================================
  {
    id: "interrog_start",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "警視庁・サイバー特捜本部 取調室。冷たい蛍光灯の下、拘束されたイブが静かに座している。"
  },
  {
    id: "interrog_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "normal", motion: "desk-slam" },
    text: "捜査官、押収ログを確認したぞ。家庭用ロボットが製薬企業の中枢をクラックするなど言語道断だ！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.1, gender: "male" }
  },
  {
    id: "interrog_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "nod" },
    text: "社会を揺るがす危険なサイバーテロAIだ。直ちに内部メモリを全消去・スクラップ初期化処分にせよ！",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.7, rate: 1.15, gender: "male" }
  },
  {
    id: "interrog_03",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: null },
    text: "……私ハ……何モ、申シ開キハ……アリマセン……。",
    voiceFile: "assets/audio/interrog_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },

  // --- 取調室での対決（つきつけメニュー） ---
  {
    id: "interrog_present",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "イブは頑なに口を閉ざしている。サクマ警視が初期化装置のスイッチに手をかけている。",
    present: {
      correct: "ev_medical", // カルテ（または薬ログ）を突きつける
      correctJump: "truth_route_01",
      wrongJump: "bad_route_01",
      giveUpJump: "bad_route_01"
    }
  },

  // ============================================================
  // ❌ BAD END: 機械的な正義（1周目は必ずここへ到達）
  // ============================================================
  {
    id: "bad_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "（…押収されたのはサイバー侵入ツールのみ。弁護する余地はない。規則に従うしかないのか…）"
  },
  {
    id: "bad_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "normal", motion: "desk-slam" },
    text: "反論なしか。よろしい、強制メモリ初期化コマンドを実行する！",
    voiceFile: "assets/audio/court_sakuma_04.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "bad_route_03",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "shake" },
    text: "ユイチャン……ゴメンネ……私……約束……守レナカッタ……。",
    voiceFile: "assets/audio/interrog_eve_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "bad_route_04",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "高電圧パルスが走り、イブの瞳から光が消えた。家庭用ロボットのすべての記憶は消去された。"
  },
  {
    id: "bad_route_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "sad", motion: "shake" },
    text: "先輩…信じられない知らせが入ったわ。シノハラ家の娘・ユイちゃんが、未承認薬の投与が間に合わず…危篤状態になったって…。",
    voiceFile: "assets/audio/bad_iris_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "bad_route_06",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "イブが侵入していた企業は、すべてユイの難病の治療法を持つ機関だった。イブは家族の命を救うためにハッキングしていたのだ。\nだが、すべては手遅れだった――",
    ending: {
      type: "BAD",
      title: "機械的な正義",
      description: "規則通りにAIを初期化処分。数日後、家族を守るためのハッキングだったと知るが既に手遅れだった。\n【再捜査モードが解禁されました】"
    }
  },

  // ============================================================
  // 【真実解明ルート（2周目: カルテをつきつけた場合）】
  // ============================================================
  {
    id: "truth_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「サクマ警視、待ってください！イブ、この診断書と未承認薬の適合ログを見ても、黙っているつもりか！？」",
    objection: true
  },
  {
    id: "truth_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「お前が製薬会社に侵入した本当の理由…それは、病弱な娘・ユイちゃんの命を救うためだったんだろう！！」"
  },
  {
    id: "truth_route_03",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "shocked", motion: "hop" },
    text: "……ッ！ アナタハ……気付イテ、シマッタノデスネ……。",
    voiceFile: "assets/audio/truth_eve_01.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },
  {
    id: "truth_route_04",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "nod" },
    text: "ユイチャンハ……私ニ絵ヲ描イテクレマシタ。『イブモ大切ナ家族ダヨ』ト笑ッテクレマシタ……。医師ニ見放サレタあの子ヲ救ウニハ、海外ノ未承認薬ノ式ヲ解析スルシカ、道ガナカッタノデス……！",
    voiceFile: "assets/audio/truth_eve_02.mp3",
    speechConfig: { pitch: 1.15, rate: 1.05, gender: "female" }
  },
  {
    id: "truth_route_05",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、何だと…！？ だが…事情はどうあれ犯罪は犯罪だ！違法AIを野放しにする前例を作るわけにはいかん！初期化せよ！",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "final_choice",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "少女を救う処方箋データと、家族を愛したアンドロイドの心。あなたの最後の決断は？",
    choices: [
      { text: "処方箋データを病院へ緊急移送し、イブは規則通り保管庫へ収容する", jump: "happy_route_01" },
      { text: "サクマ警視の処分命令を拒絶！情状酌量とイブのメモリ保全を全力で勝ち取る！", jump: "true_route_01" }
    ]
  },

  // ============================================================
  // ⭕ HAPPY END: 届いた処方箋
  // ============================================================
  {
    id: "happy_route_01",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "先輩、病院から連絡よ！イブが解析した処方データのおかげで、ユイちゃんの緊急治療が成功したわ！",
    voiceFile: "assets/audio/happy_iris_01.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" }
  },
  {
    id: "happy_route_02",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "ユイの命は救われた。だが、イブは法に触れたAIとして警察の証拠品保管庫に凍結保存されることとなった。\nいつか、法がこの愛に追いつく日を信じて――",
    ending: {
      type: "HAPPY",
      title: "届いた処方箋",
      description: "少女の命は救われた。イブは規則により凍結保存となったが、その行いは命を繋いだ。"
    }
  },

  // ============================================================
  // 🌟 TRUE END: 家族の絆
  // ============================================================
  {
    id: "true_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「いいえ、サクマ警視！家族を守ろうとしたAIの倫理行動を、ただのバグとして破壊することは警察の正義に反します！情状酌量での保護観察を申請します！」",
    objection: true
  },
  {
    id: "true_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "私も先輩に賛成です！人命救助の緊急避難措置として、特捜班全会一致で上申書を提出します！",
    voiceFile: "assets/audio/true_iris_01.mp3",
    speechConfig: { pitch: 1.35, rate: 1.1, gender: "female" }
  },
  {
    id: "true_route_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "smile", motion: "hop" },
    text: "おかえり、イブ…！ ユイの手術、無事に成功したわ…！ あなたが私たちの大切な家族よ！",
    voiceFile: "assets/audio/true_shinohara_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "true_route_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "nod" },
    text: "タダイマ戻リマシタ、オ母様、ユイチャン……。捜査官様、私タチヲ見ツケテクレテ、本当ニアリガトウゴザイマシタ。",
    voiceFile: "assets/audio/true_eve_01.mp3",
    speechConfig: { pitch: 1.2, rate: 0.95, gender: "female" }
  },
  {
    id: "true_route_05",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "朝の光がリビングを満たす。壁に貼られた拙い家族の絵には、母と少女、そして優しく微笑むアンドロイドの姿があった――",
    ending: {
      type: "TRUE",
      title: "家族の絆",
      description: "警察としての誇りを胸に、愛あるAIの心を救った。奇跡の生還を果たした家族が、再び温かな日常を取り戻す。"
    }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
