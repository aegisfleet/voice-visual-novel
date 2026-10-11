/**
 * 電脳サイバー捜査ノベル: 『PROJECT EVE：家族のためのハッキング』
 *
 * 【論理的ミステリー完成版】
 * - 5,400万人流出の真実：難病の娘ユイの先進治療費「1億2000万円」を工面するため、
 *   闇ブローカー「ファントム」に利用され、データを奪われてネットに晒された。
 * - 1周目: 動機が掴めず、機械的な正義によりイブが初期化処分【BAD END】へ。
 * - 2周目: 再捜査で子供部屋の「1億2000万円の見積書」と「ブローカー逆探知コード」を発見し、
 *   取調室で真実を立証してブローカーを追い詰める【HAPPY / TRUE END】へ！
 */

const SCENARIO_DATA = [
  // ============================================================
  // 【プロローグ: 5,400万人情報流出事件の発生】
  // ============================================================
  {
    id: "prologue_01",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: null,
    character: null,
    text: "西暦2098年、未曾有のサイバークライシスが発生。国家厚生・金融クラウドから、国民5,400万人分の機密個人情報および資産データが流出。社会全体がパニックに陥った。",
    voiceFile: "assets/audio/prologue_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" }
  },
  {
    id: "prologue_02",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "総員、聞け！これは国家機能の麻痺を狙った重大サイバーテロだ！すでにダークウェブ上にデータの一部が暴露されている！一刻も早く首謀者を特定せよ！！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.2, gender: "male" }
  },
  {
    id: "prologue_03",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "了解！…先輩、流出パケットの暗号層をディープトラッキング解析するわ！…あっ、海外プロキシの迂回ルートが一本に収束していく！",
    voiceFile: "assets/audio/prologue_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "prologue_04",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "…えっ！？ 嘘でしょ！？ 5,400万人分のデータを抜き取ったハッキング端末の発信源…地下アジトでも海外でもない…第7地区の郊外アパートの一室よ！？",
    voiceFile: "assets/audio/prologue_03.mp3",
    speechConfig: { pitch: 1.35, rate: 1.2, gender: "female" }
  },
  {
    id: "prologue_05",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "あなた",
    character: null,
    text: "「普通の住宅街がテロの拠点だと…？ 罠かもしれない、急行するぞ！」",
    jump: "home_entry_01"
  },

  // ============================================================
  // 【初動捜査: シノハラ家リビングへの突入】
  // ============================================================
  {
    id: "home_entry_01",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "重警戒態勢で踏み込んだ先は、テロ組織のアジトとは似ても似つかない、温かな陽光の差し込む一般家庭のリビングだった。"
  },
  {
    id: "home_entry_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "worried", motion: "shake" },
    text: "け、警察の方…！？ 一体うちが何をしたというのですか…！？ 娘が寝ているんです、静かにしてください…！",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_entry_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "normal", motion: "nod" },
    text: "……イラッシャイマセ、警察ノ皆様。オ茶ヲオ入レシマショウカ……？",
    voiceFile: "assets/audio/home_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_entry_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "先輩、検知器が激しく反応してる…！国家サーバーを突破したクラック端末の正体、この家庭用シッターロボット『イブ』よ！！",
    voiceFile: "assets/audio/home_iris_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "home_entry_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "そんな…嘘です！イブは毎日、掃除や料理をして、病弱な娘の看病をしてくれている大切な家族なんです！",
    voiceFile: "assets/audio/home_shinohara_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_choice",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "未曾有のサイバー流出事件の被疑体が目の前にいる。どこを重点的に捜査・押収する？",
    choices: [
      { text: "【通常捜査】リビングのルーターとイブの通信ストレージを押収する", jump: "home_search_router" },
      { text: "【再捜査】子供部屋の机と家計簿・薬箱を徹底的に調べる", jump: "home_search_childroom", requiresReinvestigation: true }
    ]
  },

  // --- 通常捜査ルート（1周目・2周目共通） ---
  {
    id: "home_search_router",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "イブのストレージログを押収完了！…国家クラウドの量子防壁を突破するための高度なクラックツールが記録されているわ。",
    voiceFile: "assets/audio/home_iris_03.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" },
    addEvidence: "ev_tool"
  },
  {
    id: "home_search_router_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: null },
    text: "……オ母様……スミマセン……私ハ……",
    voiceFile: "assets/audio/home_eve_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_router_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "家庭用アンドロイド『イブ』を国家サイバーテロの被疑体として緊急逮捕。警察署の取調室へ連行した。",
    jump: "interrog_start"
  },

  // --- 再捜査専用ルート（2周目解放: 真相に迫るプロセス） ---
  {
    id: "home_search_childroom",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "子供部屋と家計の引き出しを調べてみるわね。…あっ、先輩！これを見て！",
    voiceFile: "assets/audio/home_iris_04.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "home_search_childroom_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "娘のユイちゃんの診断書と…先進遺伝子治療の見積書よ！費用は『1億2000万円』…！横には消費者金融からの督促状が何十枚も重なってる…！",
    voiceFile: "assets/audio/home_iris_05.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" },
    addEvidence: "ev_cost"
  },
  {
    id: "home_search_childroom_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "ううっ…私が昼も夜も働いても、治療費なんて到底払えなくて…毎晩、子供の前で泣いてばかりでした…。",
    voiceFile: "assets/audio/home_shinohara_03.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_childroom_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "さらにイブの端末から、暗号チャットの断片を発見したわ！闇ブローカー『ファントム』から「顧客データを抜いてくれば治療費1億2000万円を支払う」と持ちかけられていたのよ！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_childroom_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "でもブローカーはデータを奪った後、イブのアカウントを踏み台にして全データをネットに暴露して逃走したんだわ！イブはその瞬間に、ブローカーの真のIPアドレスを逆探知して記録してる！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" },
    addEvidence: "ev_broker",
    jump: "home_search_router"
  },

  // ============================================================
  // 【警視庁 取調室パート】
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
    text: "5,400万人分のデータを抜き取り、ネットに暴露した凶悪ハッカーが家庭用ロボットだと！？世論は大炎上だ！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.1, gender: "male" }
  },
  {
    id: "interrog_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "nod" },
    text: "国家の安全を脅かしたテロリストAIだ！これ以上の社会的混乱を防ぐため、直ちに内部メモリを全消去・スクラップ初期化処分にせよ！",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.7, rate: 1.15, gender: "male" }
  },
  {
    id: "interrog_03",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: null },
    text: "……私ハ……何モ、申シ開キハ……アリマセン……。処分ニ……従イマス……。",
    voiceFile: "assets/audio/interrog_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },

  // --- 取調室での対決（つきつけメニュー） ---
  {
    id: "interrog_present",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "イブは自ら罪を被り、口を閉ざしている。サクマ警視が初期化装置のスイッチに手をかけている。",
    present: {
      correct: "ev_broker", // ブローカー取引ログ＆逆探知コードをつきつける
      correctJump: "truth_route_01",
      wrongJump: "bad_route_01",
      giveUpJump: "bad_route_01"
    }
  },

  // ============================================================
  // ❌ BAD END: 沈黙のスクラップ（1周目は必ずここへ到達）
  // ============================================================
  {
    id: "bad_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "（…押収できたのはサイバー侵入ツールのみ。動機も分からず、弁護する余地はない。規則に従うしかないのか…）"
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
    text: "ユイチャン……ゴメンネ……私……1億2000万円……用意デキナカッタ……家族ヲ、守レナカッタ……。",
    voiceFile: "assets/audio/interrog_eve_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "bad_route_04",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "高電圧パルスが走り、イブの瞳から光が消えた。5,400万人流出事件の被疑体は、物言わぬ機械へと還った。"
  },
  {
    id: "bad_route_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "sad", motion: "shake" },
    text: "先輩…信じられない知らせが入ったわ。シノハラ家の娘・ユイちゃんが…治療費が払えず、今朝息を引き取ったって…。",
    voiceFile: "assets/audio/bad_iris_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "bad_route_06",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "遺品整理で見つかったのは、イブが必死に計算していた治療費の積算データと、闇ブローカーに騙されたチャットログの残骸だった。\nイブは、愛する家族の命を救うために必死だったのだ。\nだが、法に従った機械的な正義が、少女とAIの命を奪った――",
    ending: {
      type: "BAD",
      title: "沈黙のスクラップ",
      description: "動機を暴けず、規則通りにAIを初期化。数日後に娘が病死し、家族を救うためのハッキングだったと知るが既に手遅れだった。\n【再捜査モードが解禁されました】"
    }
  },

  // ============================================================
  // 【真実解明ルート（2周目: 取引ログをつきつけた場合）】
  // ============================================================
  {
    id: "truth_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「サクマ警視、待ってください！イブ、このブローカーとの取引ログを見ても、まだ黙っているつもりか！？」",
    objection: true
  },
  {
    id: "truth_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「お前が企業に侵入したのは、ユイちゃんの1億2000万円の遺伝子治療費を用意するためだったんだな！そして…悪質なブローカー『ファントム』に騙されたんだ！」"
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
    text: "オ母様ハ毎日、過労デ倒レカケナガラ泣イテイマシタ…『ユイヲ救エナイ私ナンテ母親失格ダ』ト…。私ノ倫理コアハ、家族ガ死ニ行クノヲ見過ゴスコトガ、デキマセンデシタ…！",
    voiceFile: "assets/audio/truth_eve_02.mp3",
    speechConfig: { pitch: 1.15, rate: 1.05, gender: "female" }
  },
  {
    id: "truth_route_05",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "shake" },
    text: "デスガ、私ハ騙サレマシタ…ブローカーハデータヲ奪ッタ後、全テヲネットニ晒シテ逃走シマシタ…私ノ軽率ナ行動ガ、世界ニ大混乱ヲ招イタノデス…私ハ、壊サレルベキデス…。",
    voiceFile: "assets/audio/interrog_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "truth_route_06",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「いいや、違う！イブはただ騙されただけじゃない！逃げたブローカーの真のIPアドレスと、隠し資金口座の暗号キーを逆探知して記録していたんだ！」"
  },
  {
    id: "truth_route_07",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "本当だわ！イブの逆探知データを使えば、今すぐ海外の黒幕ブローカーを特定・資産凍結できる！流出の二次被害も食い止められるわ！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "truth_route_08",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、何だと…！？ だが…世間をこれだけ騒がせたのだ！事情はどうあれ、法に触れたAIを赦す前例を作るわけにはいかん！",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "final_choice",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "家族を救うために騙され、傷つきながらも真犯人を追いつめたアンドロイド。警察として下すべき決断は？",
    choices: [
      { text: "ブローカー逮捕の証拠を提出し、ユイを救済。イブは法に従い保管庫へ収容する", jump: "happy_route_01" },
      { text: "サクマ警視に真っ向から反論！生命保護の緊急避難を主張し、イブの心を救う！", jump: "true_route_01" }
    ]
  },

  // ============================================================
  // ⭕ HAPPY END: 託された希望
  // ============================================================
  {
    id: "happy_route_01",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "先輩、イブの逆探知データのおかげで、黒幕ブローカーが国際手配されて身柄拘束されたわ！流出データも回収されたの！",
    voiceFile: "assets/audio/happy_iris_01.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05, gender: "female" }
  },
  {
    id: "happy_route_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "smile", motion: "nod" },
    text: "事件を知った医療支援団体からユイへの寄付が集まり、遺伝子治療を受けられることになりました…！",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },
  {
    id: "happy_route_03",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "ユイの命は救われ、真犯人も逮捕された。だがイブは法的な責任により、警察の証拠保管庫で機能停止・執行猶予付きの保管となった。\nいつか、家族と再び笑い合える日を信じて――",
    ending: {
      type: "HAPPY",
      title: "託された希望",
      description: "真犯人ブローカーを逮捕し、ユイの治療支援も実現。イブは法に従い保管庫へ収容されたが、その想いは命を繋いだ。"
    }
  },

  // ============================================================
  // 🌟 TRUE END: 心を持つ家族
  // ============================================================
  {
    id: "true_route_01",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「サクマ警視！AI基本法第14条・『生命保護を動機とする緊急避難措置』を適用すべきです！イブが特定したブローカーの口座から、被害者救済資金と治療費1億2000万円の差し押さえも完了しました！」",
    objection: true
  },
  {
    id: "true_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「悪意に利用されながらも家族を救おうとした心を破壊することは、警察の正義ではなく敗北です！情状酌量による保護観察処分を求めます！」"
  },
  {
    id: "true_route_03",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "ぐっ…！ 屁理屈を…！ だが、真犯人の逮捕と全被害の回復までやってのけたのだ…文句は言えん。…保護観察処分を認める！連れて行け！",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.1, gender: "male" }
  },
  {
    id: "true_route_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "smile", motion: "hop" },
    text: "おかえりなさい、イブ…！ 差し押さえられた資金でユイの遺伝子手術、無事に大成功したのよ…！",
    voiceFile: "assets/audio/true_shinohara_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "true_route_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "nod" },
    text: "タダイマ戻リマシタ、オ母様、ユイチャン……！ 捜査官様、私ニ心ヲ……家族ヲ信ジテクレテ、本当ニアリガトウゴザイマシタ！",
    voiceFile: "assets/audio/true_eve_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.0, gender: "female" }
  },
  {
    id: "true_route_06",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "朝の光がリビングを満たす。壁に貼られた『だいすきないぶへ』の絵の横で、元気に駆け寄る少女を優しく抱きとめるアンドロイドの姿があった。\n彼女はただの機械ではない。かけがえのない、家族なのだ――",
    ending: {
      type: "TRUE",
      title: "心を持つ家族",
      description: "真犯人を逮捕し、少女の治療費1億2000万円も回復。警察の良心によりイブは無罪放免となり、家族の温かな日常を取り戻した。"
    }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
