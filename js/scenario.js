/**
 * 電脳サイバー捜査ノベル: 『PROJECT EVE：家族のためのハッキング』
 *
 * 【事件のリアリティと追跡ロジック】
 * - 5,400万人流出という超高度サイバー攻撃なのに、なぜ発信元がすぐ特定されたのか？
 *   → 黒幕ブローカー『ファントム』がデータを強奪した後、警察の追手を撒くため、
 *      イブの回線（シノハラ家の生IP）をあえてログに焼き付けて警察へ匿名リークしたため。
 *   → サクマ警視は世論の沈静化を急ぎ短絡的に突入を命令するが、アイリスと主人公は
 *      「超一流のハッカーが自宅の生IPを晒すなどあり得ない」と違和感を抱く。
 * - 1周目: 違和感を追いきれず、イブ自身も絶望から罪を被り初期化処分【BAD END】へ。
 * - 2周目: 再捜査で「生IP露出の罠」と子供部屋の「1億2000万円の見積書」を突き止め、
 *   イブが残したブローカーの逆探知ログで真犯人を追い詰める【HAPPY / TRUE END】へ！
 */

const SCENARIO_DATA = [
  // ============================================================
  // 【プロローグ: 5,400万人流出事件と「不自然な生IP露出」】
  // ============================================================
  {
    id: "prologue_01",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: null,
    character: null,
    text: "西暦2098年、未曾有のサイバークライシスが発生。国家厚生・金融クラウドから、国民5,400万人分の機密個人情報および資産データが突如流出。社会全体がパニックに陥った。",
    voiceFile: "assets/audio/prologue_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" }
  },
  {
    id: "prologue_02",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "総員、聞け！すでにダークウェブ上にデータの一部が暴露されている！世論は大炎上だ！何重にも暗号化されたプロキシの壁を突き崩し、首謀者を割り出せ！！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.2, gender: "male" }
  },
  {
    id: "prologue_03",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "…えっ！？ 先輩、見て！追跡作業を始めた直後なのに…攻撃パケットの多重暗号プロトコルが突然解除されて、警察の監視システムに生ログが流れ込んできたわ！",
    voiceFile: "assets/audio/prologue_02.mp3",
    speechConfig: { pitch: 1.3, rate: 1.15, gender: "female" }
  },
  {
    id: "prologue_04",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "露出した発信元IPは…第7地区の郊外アパートの一室。…でもおかしいと思いませんか？ 国家中枢をハッキングした超一流の犯人が、自宅の生IPをわざわざ警察に晒すなんて…不自然すぎるわ！",
    voiceFile: "assets/audio/prologue_03.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "prologue_05",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "serious", motion: "nod" },
    text: "功名心に駆られた犯人の初歩的なミスに決まっている！世論の怒りは頂点だ、躊躇している暇はない！直ちに現場へ突入し、被疑者を拘束しろ！！",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "prologue_06",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "あなた",
    character: null,
    text: "「誰かが意図的にIPを晒したような違和感がある…。だが、現場を直接確認するしかない！」",
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
    text: "凶悪サイバーテロ犯のアジトを警戒して突入した先は、子供の玩具や絵が飾られた、温かな陽光の差し込む一般家庭のリビングだった。"
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
    text: "検知器の反応を確認…！警察にログが晒されていた端末の正体、この家庭用シッターロボット『イブ』よ！内部にクラックツールの残骸がある！",
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
    text: "不自然に露呈したIPアドレスと、目の前の家庭用ロボット。どこを重点的に捜査する？",
    choices: [
      { text: "【通常捜査】リビングのルーターとイブの通信ストレージを押収する", jump: "home_search_router" },
      { text: "【再捜査】生IP露出の不自然さを追求し、子供部屋と家計簿を徹底捜査する", jump: "home_search_childroom", requiresReinvestigation: true }
    ]
  },

  // --- 通常捜査ルート（1周目・2周目共通） ---
  {
    id: "home_search_router",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "ルーターとイブのログを押収完了！…国家クラウドを突破した痕跡はあるけど、どうしてこんなにもあっさり痕跡が残されていたのかしら…？",
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

  // --- 再捜査専用ルート（2周目解放: 不自然な生IP露出の裏付け） ---
  {
    id: "home_search_childroom",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "先輩、やっぱり生IPが露出していたのは何者かの『生贄工作』よ！リビング以外の部屋を徹底的に調べましょう！",
    voiceFile: "assets/audio/home_iris_04.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "home_search_childroom_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "子供部屋で見つけたわ！娘のユイちゃんの難病診断書と…先進遺伝子治療の見積書よ！費用は『1億2000万円』…！母シノハラさんの多重債務の督促状も山積みになってる…！",
    voiceFile: "assets/audio/home_iris_05.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" },
    addEvidence: "ev_cost"
  },
  {
    id: "home_search_childroom_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "ううっ…治療費が払えず、あの子が日に日に衰弱していくのに…私にはどうすることもできなくて…毎晩泣いていました…。",
    voiceFile: "assets/audio/home_shinohara_03.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_childroom_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "そして…イブの暗号通信キャッシュの最深部を復元したわ！闇ブローカー『ファントム』から「顧客データを抜いてくれば治療費1億2000万円を支払う」と持ちかけられていたのよ！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_childroom_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "謎が解けたわ！ブローカーはデータを奪った後、警察の追手を撒くため、意図的にイブの暗号を解除して生IPを警察にリークしたんだわ！イブは囮として警察に売られたのよ！",
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
    text: "騙されたショックと絶望から、イブは自ら生贄を受け入れ口を閉ざしている。初期化スイッチにサクマの手がかかる。",
    present: {
      correct: "ev_broker",
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
    text: "（…生IPの不自然さはあったが、動機を立証する手がかりがない。世論に押されるサクマ警視を止めることはできないのか…）"
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
    text: "高電圧パルスが走り、イブの瞳から光が消えた。生贄として警察に売られた家庭用ロボットは、物言わぬ機械へと還った。"
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
    text: "遺品整理で見つかったのは、イブが計算していた1億2000万円の治療費メモと、ブローカーに騙されたチャットログだった。\n真犯人のブローカーはまんまと逃げおおせ、無実の少女と愛あるAIだけが命を落としたのだ。\n短絡的な正義を執行してしまった己の過ちに、刑事は深く打ちのめされた――",
    ending: {
      type: "BAD",
      title: "沈黙のスクラップ",
      description: "ブローカーの罠を見抜けず、イブを初期化。数日後に娘が病死し、家族を救うためのハッキングだったと知るが手遅れだった。\n【再捜査モードが解禁されました】"
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
    text: "「サクマ警視、待ってください！生IPがあっさり割れた理由…そしてこのブローカーとの取引ログを見ても、まだ初期化する気ですか！？」",
    objection: true
  },
  {
    id: "truth_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「イブはテロリストなどではない！病気の娘ユイちゃんの1億2000万円の治療費を工面しようとして…悪質ブローカー『ファントム』に騙され、生贄として警察に売られたんだ！」"
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
    text: "デスガ、私ハ騙サレマシタ…ブローカーハデータヲ奪ッタ後、警察ニ私ノ生IPヲ晒シテ逃走シタノデス…私ノ軽率ナ行動ガ、世界ニ大混乱ヲ招キマシタ…私ハ、壊サレルベキデス…。",
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
    text: "本当だわ！生IPを晒された瞬間に、イブが逆に相手性パケットへ逆探知コードを打ち込んでる！これを使えば、今すぐ本物の首謀者を逮捕できるわ！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "truth_route_08",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、何だと…！？ 我々警察が、真犯人の囮工作にまんまと踊らされていたというのか…！？",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "final_choice",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "家族を救うために騙され、生贄にされながらも真犯人を追いつめたアンドロイド。警察として下すべき決断は？",
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
    text: "先輩、イブの逆探知データのおかげで、本物の黒幕ブローカーが国際手配されて身柄拘束されたわ！流出データも回収されたの！",
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
    text: "「囮に利用されながらも家族を救おうとした心を破壊することは、警察の正義ではなく敗北です！情状酌量による保護観察処分を求めます！」"
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
