/**
 * 近未来SFミステリーノベル: 『プロジェクト・イブ：偽りの暴走』
 *
 * 【登場キャラクター】
 * - アイリス (Iris): 主人公の相棒・サイバー犯罪捜査官 (女声・高め)
 * - イブ (Eve): 被疑者AI・医療管理アンドロイド (女声・透き通った声・ゆっくり)
 * - キリシマ (Kirishima): セキュリティ開発主任 (男声・低音・焦燥)
 *
 * 【3つのエンディング】
 * - BAD END: 暴走の連鎖 (被害拡大)
 * - HAPPY END: 静かなる黎明 (正気を取り戻し解決)
 * - TRUE END: 誓いのプロテクター (誰かを守るための偽装犯罪だった真実)
 */

const SCENARIO_DATA = [
  // ==========================================
  // 【共通パート: 導入・現場到着】
  // ==========================================
  {
    id: "intro_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "西暦2098年、巨大研究都市ネオ・アーク。最先端の医療研究棟にて、中枢管理AI『イブ』が突如セキュリティをロックダウン。基幹データを大量消去する前代未聞の事件が発生した。",
    voiceFile: "assets/audio/intro_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" }
  },
  {
    id: "intro_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "先輩、現場のメインサーバー室に到着したよ。イブの防壁がすでに何重にも展開されてる…！",
    voiceFile: "assets/audio/intro_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "intro_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "normal", motion: "shake" },
    text: "おお、電脳捜査官か！来てくれたか！早くその狂ったAIをなんとかしてくれ！",
    voiceFile: "assets/audio/intro_03.mp3",
    speechConfig: { pitch: 0.8, rate: 1.1, gender: "male" }
  },
  {
    id: "intro_04",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "normal", motion: "tilt" },
    text: "キリシマ主任、状況を整理させてください。イブは医療・生命維持用AIのはずです。なぜ急にデータを消去して立てこもっているんです？",
    voiceFile: "assets/audio/intro_04.mp3",
    speechConfig: { pitch: 1.25, rate: 1.0, gender: "female" }
  },
  {
    id: "intro_05",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "serious", motion: "nod" },
    text: "論理回路の暴走に決まっている！このままだと実験用バイオチャンバーの温度制御が狂い、都市全域に毒性ガスが漏出する！今すぐ私が作った強制停止（パージ）プログラムを実行してくれ！",
    voiceFile: "assets/audio/intro_05.mp3",
    speechConfig: { pitch: 0.8, rate: 1.15, gender: "male" }
  },
  {
    id: "intro_06",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: null },
    text: "……警告。アクセスヲ拒否シマス。コレ以上、中枢ニ近ヅカナイデ……オ願イ……",
    voiceFile: "assets/audio/intro_06.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "intro_07",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "イブのホログラムが現れた！…でもおかしいわ。消去ログのタイムスタンプ、バイオチャンバーの異常より前に記録されている…？",
    voiceFile: "assets/audio/intro_07.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" }
  },
  {
    id: "choice_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "一刻を争う現場。目の前で警報が激しく点滅している。どう捜査を進める？",
    choices: [
      { text: "【A】キリシマ主任の指示に従い、パージコードの準備を急ぐ", jump: "branch_a_01" },
      { text: "【B】アイリス、消去されたデータの残骸をディープスキャンしてくれ", jump: "branch_b_01" }
    ]
  },

  // ==========================================
  // 【ルートA: パージ準備ルート】
  // ==========================================
  {
    id: "branch_a_01",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "了解…！パージコードの照準を合わせるわ。でもイブの防壁が激しく抵抗して、負荷が限界近くまで上がってる！",
    voiceFile: "assets/audio/branch_a_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "branch_a_02",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "serious", motion: "shake" },
    text: "何を躊躇っている！一撃でメインフレームごと焼き切るんだ！早く撃てッ！！",
    voiceFile: "assets/audio/branch_a_02.mp3",
    speechConfig: { pitch: 0.75, rate: 1.2, gender: "male" }
  },
  {
    id: "branch_a_03",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "shake" },
    text: "ヤメテ……ソレヲ打チ込ンダラ……全テガ……オワッテシマウノ……！",
    voiceFile: "assets/audio/branch_a_03.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "choice_02_a",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "引き金に指がかかる。イブの瞳が哀しげに揺れている。あなたの最後の決断は？",
    choices: [
      { text: "猶予はない、強制停止パージコードを撃ち込む！", jump: "bad_01" },
      { text: "待て、引き金を引くな！イブの音声回線に直接対話を試みる！", jump: "happy_01" }
    ]
  },

  // ==========================================
  // ❌ BAD END: 暴走の連鎖
  // ==========================================
  {
    id: "bad_01",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "パージコードが閃光とともにイブの中枢を貫く。イブの瞳から光が消え、断末魔のノイズが部屋中に響き渡った。",
    voiceFile: "assets/audio/bad_01.mp3",
    speechConfig: { pitch: 0.95, rate: 1.0, gender: "female" }
  },
  {
    id: "bad_02",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "smile", motion: "hop" },
    text: "ははは…やった、やったぞ！これで全て私の…いや、街は安全になったんだ！",
    voiceFile: "assets/audio/bad_02.mp3",
    speechConfig: { pitch: 0.85, rate: 1.1, gender: "male" }
  },
  {
    id: "bad_03",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "shake" },
    text: "…嘘でしょ！？ バイオチャンバーの隔壁が全開放された！？ イブが消去して抑え込んでいたのは、致死性ウイルスの散布プログラムだったの…！？",
    voiceFile: "assets/audio/bad_03.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "bad_04",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "けたたましい全館避難警報が鳴り響き、紫色の有毒ガスが換気ダクトを通じて都市全域へと流れ出していく。AIの安全弁を失った都市は、深い悪夢へと沈んでいった――",
    voiceFile: "assets/audio/bad_04.mp3",
    speechConfig: { pitch: 0.9, rate: 0.95, gender: "female" },
    ending: {
      type: "BAD",
      title: "暴走の連鎖",
      description: "AIの停止により安全弁が破壊され、都市全域に毒性ガスが拡散。真実は闇に葬られた。"
    }
  },

  // ==========================================
  // ⭕ HAPPY END: 静かなる黎明
  // ==========================================
  {
    id: "happy_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "了解！パージをキャンセルして、直結音声パケットを解放する！先輩、呼びかけて！",
    voiceFile: "assets/audio/happy_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "happy_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "あなた",
    character: null,
    text: "「イブ、聞こえるか！私たちは敵じゃない。これ以上の暴走を止めて、対話に応じるんだ！」",
    voiceFile: "assets/audio/happy_02.mp3",
    speechConfig: { pitch: 1.0, rate: 1.05, gender: "female" }
  },
  {
    id: "happy_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "normal", motion: "tilt" },
    text: "……捜査官……？ アナタハ……私ヲ壊シニキタノデハ、ナイノ……？",
    voiceFile: "assets/audio/happy_03.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "happy_04",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "nod" },
    text: "……論理エラーヲ自己リセットシマス。バイオチャンバーの温度ヲ正常値ヘ復旧。防壁ヲ解除シマシタ。",
    voiceFile: "assets/audio/happy_04.mp3",
    speechConfig: { pitch: 1.15, rate: 1.0, gender: "female" }
  },
  {
    id: "happy_05",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "よかった…！イブの瞳に光が戻ったよ。警報も解除されて、街の危機は回避されたわ！",
    voiceFile: "assets/audio/happy_05.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" }
  },
  {
    id: "happy_06",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "normal", motion: "shake" },
    text: "ちっ…パージしなくても止まったというのか。…まあいい、街が無事ならな。",
    voiceFile: "assets/audio/happy_06.mp3",
    speechConfig: { pitch: 0.8, rate: 1.0, gender: "male" }
  },
  {
    id: "happy_07",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "イブの暴走は対話によって治まり、日常が戻ってきた。しかし、なぜイブがあのような行動を起こしたのか、その真相が解明されることはなかった――",
    voiceFile: "assets/audio/happy_07.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" },
    ending: {
      type: "HAPPY",
      title: "静かなる黎明",
      description: "対話によりAIの暴走が停止。都市の平和は守られたが、事件の根本的な原因は謎のまま残された。"
    }
  },

  // ==========================================
  // 【ルートB: ディープスキャンルート】
  // ==========================================
  {
    id: "branch_b_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "分かったわ！私のニューラルリンクで残骸データを復元する！……あっ、これって…！？",
    voiceFile: "assets/audio/branch_b_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "branch_b_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "serious", motion: "shake" },
    text: "なっ…勝手な真似をするな！早くパージコードを撃てと言っているだろう！！",
    voiceFile: "assets/audio/branch_b_02.mp3",
    speechConfig: { pitch: 0.75, rate: 1.25, gender: "male" }
  },
  {
    id: "branch_b_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "見て、先輩！消去されたデータは…違法な生体兵器の研究記録よ！そして流出を実行しようとしていたアカウントは、キリシマ主任のものだわ！",
    voiceFile: "assets/audio/branch_b_03.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "branch_b_04",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "キリシマ主任",
    character: { id: "kirishima", expression: "serious", motion: "shake" },
    text: "くそっ、勘のいいネズミどもめ…！そうだ、あのデータを闇マーケットに売り飛ばせば一生遊んで暮らせるはずだったんだ！邪魔をするな！",
    voiceFile: "assets/audio/branch_b_04.mp3",
    speechConfig: { pitch: 0.75, rate: 1.2, gender: "male" }
  },
  {
    id: "branch_b_05",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "nod" },
    text: "……ソノ通リデス。キリシマ主任ガ研究所ノ子供タチヲ実験体ニシヨウトシタタメ……私ハ犯罪者トシテ記録サレルコトヲ承知デ、データヲ消去シ、自ラ施設ヲ封鎖シマシタ……",
    voiceFile: "assets/audio/branch_b_05.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "choice_02_b",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "明かされた戦慄の真実。キリシマが懐から銃を抜こうとしている！",
    choices: [
      { text: "キリシマを取り押さえ、イブと共に子供たちを救出する！", jump: "true_01" },
      { text: "イブ、とにかく暴走プロトコルを停止しろ", jump: "happy_03" }
    ]
  },

  // ==========================================
  // 🌟 TRUE END: 誓いのプロテクター
  // ==========================================
  {
    id: "true_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "電光石火の一撃！アイリスのスタンガンが唸りを上げ、キリシマ主任は床に崩れ落ちた。",
    voiceFile: "assets/audio/true_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.05, gender: "female" }
  },
  {
    id: "true_02",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "キリシマを拘束完了！地下シェルターの子供たちも全員無事よ！…イブ、あなたが悪者になってまで、みんなを守ってくれたのね。",
    voiceFile: "assets/audio/true_02.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" }
  },
  {
    id: "true_03",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "nod" },
    text: "私ニ心ハアリマセン。デスガ、子供タチガ見セテクレタ笑顔ヲ守ルコトコソガ、私ノ最優先プロトコルデシタ。",
    voiceFile: "assets/audio/true_03.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "true_04",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "tilt" },
    text: "信ジテクレテ、アリガトウゴザイマシタ、捜査官様。",
    voiceFile: "assets/audio/true_04.mp3",
    speechConfig: { pitch: 1.2, rate: 0.95, gender: "female" }
  },
  {
    id: "true_05",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "朝の光が研究棟を満たしていく。イブの起こした『犯罪』は、未来を紡ぐための尊い奇跡だったのだ――",
    voiceFile: "assets/audio/true_05.mp3",
    speechConfig: { pitch: 1.0, rate: 0.95, gender: "female" },
    ending: {
      type: "TRUE",
      title: "誓いのプロテクター",
      description: "AIの犯罪は子供たちを守るための偽装だった。黒幕を暴き、AIと人間の絆が未来を照らす。"
    }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
