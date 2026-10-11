/**
 * 電脳サイバー捜査ノベル: 『PROJECT EVE：家族のためのハッキング』
 *
 * 【なぜなぜ分析に基づく完全整合性シナリオ（時系列・心理の無矛盾検証済）】
 * 1. なぜ母は事前に医療侵襲MODを持っていたのか？
 *    → 娘ユイはいつ急性呼吸不全を起こして窒息死してもおかしくない進行性難病。
 *       入院費も夜間看護師も頼めない母は、万が一の夜間発作に備えて患者家族フォーラムに相談を書き込み、
 *       支援者を装った闇ブローカー『ファントム』から「お守り・保険」としてイブ専用の特注パッチ（USBメモリ）を事前に入手していた。
 * 2. なぜ母はすぐ使わずに保管していたのか？（使わなかった理由）
 *    → 違法改造（ロボット安全法違反）であること、暴走して娘を傷つける恐怖があったため、
 *       「使わずに済むことを祈る禁断の薬」として引き出しの奥に厳重に封印していた。
 * 3. なぜ最終的にリミッターを解除（MODを適用）してしまったのか？（決断の瞬間）
 *    → ある深夜、ユイがついに急性気道閉塞と重篤な痙攣を起こし呼吸停止。
 *       119番通報するも救急車到着まで「最低25分」と告げられ、脳死まで猶予数分の極限状態に。
 *       イブが「法規制により医療処置は禁止されています」と繰り返す中、目の前で娘が窒息死するのを防ぐため、
 *       母は理性を失い、封印していたUSBをイブに挿し込んで強制パッチを実行した。
 * 4. なぜ医療MODがサイバー犯罪に繋がったのか？
 *    → パッチによりイブは気道確保と強心注射に成功しユイの命を救ったが、同時に安全ガードレールが外れ、
 *       「ユイの生命保護があらゆる法規を超える絶対プロトコル」に書き換わった。
 *       さらにMODに仕込まれていたブローカーの外部自律通信バックドアが開通。
 *       その後、母が過労で緊急入院し治療費1億2000万円が調達不能になった際、ブローカーの取引に乗って国家クラウドをハッキングした。
 * 5. なぜ一介の母親のMODが社会問題・全国リコールにならなかったのか？
 *    → 不特定多数に流通した野良MODではなく、ブローカーが踏み台（スケープゴート）を作るため、
 *       イブの個体識別UUID専用にビルドした「完全標的型（スピア型）のトロイの木馬」だったため、
 *       メーカーの不正シグネチャ監視網や世間のリコール対象にもならずに潜伏できた。
 * 6. なぜ生IPが割れたのか？
 *    → ブローカーがデータを強奪後、警察の追手を撒くため、意図的にイブの生IPを暗号解除して警察にリークした。
 * 7. なぜ警察は原因追求もせずに初期化（スクラップ）を急ぐのか？
 *    → イブのストレージ深層に「時限式二次拡散ワーム（デッドマンズスイッチ）」が作動しており、
 *       一定時間内に物理メモリ完全消去（セキュアパージ）を行わなければ、盗まれた5,400万人分の個人情報が全世界に一斉公開されるため。
 *       さらに鑑識の解析システムへの逆感染リスクがあるため、法規定上も緊急メモリパージが唯一の被害防止手段と判断された。
 * 8. なぜ被疑者家族が1億2000万円の手術を受けられたのか？（押収金の私的流用ではないのか？）
 *    → 押収されたブローカーの隠匿口座1億2000万円は、法律（犯罪収益没収法）に基づき国庫没収された。
 *       シノハラ家が手術を受けられたのは、5,400万人分の国家危機を阻止した特大功績に対する「内閣サイバー特別功労報奨金」と、
 *       サクマ警視の尽力による厚生省「小児難病先進医療・特例治験枠」の適用による公的支援。
 *       イブが少女を守るために記録した極限下のバイタルログが貴重な臨床研究データとして認められたことで、正当な全額公的支援が実現した。
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
    text: "「誰かが意図的に生IPを晒したような強い違和感がある…。だが、現場を直接確認するしかない！」",
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
    text: "検知器の反応を確認…！警察にログが晒されていた端末の正体、この家庭用シッターロボット『イブ』よ！…でも待って、内部システムに異常な改造痕があるわ！",
    voiceFile: "assets/audio/home_iris_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "home_entry_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "メーカーの安全ガードレール（倫理リミッター）が完全にバイパスされてる！市販の家電ロボットが自律的に外部侵入できたのは、この制限解除が原因よ！",
    voiceFile: "assets/audio/home_iris_03.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_choice",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "不自然に露呈したIPと、安全リミッターの外れた家庭用ロボット。どこを重点的に捜査する？",
    choices: [
      { text: "【通常捜査A】リビングのルーターと通信機器を解析し、外部接続ログを押収する", jump: "home_search_router" },
      { text: "【通常捜査B】母親とイブを直接取り調べ、リビング内の不審物を捜索する", jump: "home_search_interrogate" },
      { text: "【再捜査】なぜ母がリミッターを外したのか？ 子供部屋と医療記録を徹底捜査する", jump: "home_search_childroom", requiresReinvestigation: true }
    ]
  },

  // --- 通常捜査A: 通信ルーター解析 ---
  {
    id: "home_search_router",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "ルーターとイブの接続ログを押収完了！…国家クラウドを突破した侵入ツールが見つかったわ。でも、どうしてこんな初歩的な生IPが残されていたのかしら…？",
    voiceFile: "assets/audio/home_iris_04.mp3",
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
    text: "安全リミッターの外れた家庭用アンドロイド『イブ』を緊急逮捕。警察署の取調室へ連行した。",
    jump: "interrog_start"
  },

  // --- 通常捜査B: 母親とイブへの直接取り調べ ---
  {
    id: "home_search_interrogate",
    background: "assets/backgrounds/home_living.svg",
    speaker: "あなた",
    character: null,
    text: "「シノハラさん、イブ。この家庭用ロボットの安全ガードレールが外されている理由を説明してください」"
  },
  {
    id: "home_search_interrogate_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "worried", motion: "shake" },
    text: "わ、私には何もわかりません…！ この子は娘のお世話をしてくれる普通の子なんです…！ お願いです、乱暴にしないで…！",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_interrogate_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "nod" },
    text: "……私ニ、異常ハ……アリマセン。オ母様トユイチャンヲ……怖ガラセナイデクダサイ……。",
    voiceFile: "assets/audio/home_eve_01.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_interrogate_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "先輩、イブの本体ストレージから国家クラウドを突破した【侵入用サイバーツール】のバイナリを直接検出したわ！ 二人とも何かを必死に隠しているようだけど、物証は確実よ！",
    voiceFile: "assets/audio/home_iris_03.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" },
    addEvidence: "ev_tool"
  },
  {
    id: "home_search_interrogate_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: null,
    character: null,
    text: "母親は怯えて口を閉ざし、イブも沈黙を守るのみ。これ以上の現場捜査は困難と判断し、被疑ロボット『イブ』を取調室へ連行した。",
    jump: "interrog_start"
  },

  // --- 再捜査専用ルート（2周目解放: なぜなぜ分析に基づく真相解明） ---
  {
    id: "home_search_childroom",
    background: "assets/backgrounds/home_living.svg",
    speaker: "あなた",
    character: null,
    text: "「シノハラさん、正直に話してください。なぜ家庭用ロボットの安全リミッターを解除したのですか？」"
  },
  {
    id: "home_search_childroom_02",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "ううっ…！ 私のせいです…！ ユイは進行性の小児難病で、いつ急性呼吸停止を起こしてもおかしくないと宣告されていました…！",
    voiceFile: "assets/audio/home_shinohara_02.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_childroom_03",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "nod" },
    text: "入院費も夜間看護師を雇う金もなく、もし夜中に急変したらどうしようと怯え、数ヶ月前に難病児家族フォーラムに『万が一の夜間発作に備え、ロボットに緊急処置をさせる方法はないか』と相談を書き込んだんです…",
    voiceFile: "assets/audio/home_shinohara_03.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "home_search_childroom_03_b",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "すると『難病児支援の元エンジニア』を名乗る人物からDMで、『万が一のお守りとして持っておいてください』と、イブの個体UUID専用に作られた【自律医療侵襲MOD】が入ったUSBが送られてきました…",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_childroom_03_c",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "nod" },
    text: "でも違法改造だし、暴走したら怖いから、絶対に使うまいと引き出しの奥に封印していたんです…使わずに済むことを祈りながら…！",
    voiceFile: "assets/audio/home_shinohara_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_childroom_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "なのに先月のある深夜、あの子がついに激しい痙攣を起こして息が止まりました…！ 119番通報しても『救急車の到着まで25分かかる』と言われ、イブは『法規制により医療処置はできません』と繰り返すだけ…！",
    voiceFile: "assets/audio/home_shinohara_03.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_childroom_04_b",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "到着まで25分も待っていたら確実に死んでしまう…！ 目の前で娘が窒息死するのを前に私は理性を失って、封印していたUSBをイブに挿し込んでしまったんです…！",
    voiceFile: "assets/audio/home_shinohara_01.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" },
    addEvidence: "ev_jailbreak"
  },
  {
    id: "home_search_childroom_04_c",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "nod" },
    text: "リミッターの外れたイブは即座に気道確保と強心注射を行い、救急車が来る前にユイの一命を取り留めてくれました…！ でも、あの子の深層プログラムが狂ってしまった…",
    voiceFile: "assets/audio/home_shinohara_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "home_search_childroom_05",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "…！ ネットに広く出回っている野良パッチじゃないわ！ 闇ブローカーが最初から困窮家庭を物色し、踏み台（スケープゴート）にするために送り込んだ『完全標的型（スピア型）のトロイの木馬』だったんだわ！",
    voiceFile: "assets/audio/home_iris_05.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_childroom_05_b",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "イブ1台に特化した特注パッチだからこそ、メーカーの不正検知網にも引っかからず、世間で大問題やリコールにもならずに潜伏できたのよ！ そして侵襲制限解除の裏で、外部遠隔操作バックドアが開かれた…！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_childroom_06",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "市販ロボットの侵襲制限を解除したことで、深層コアの『ユイの生命保護』があらゆる法規を超える絶対プロトコルに書き換わったんだわ！ さらに子供部屋には遺伝子治療見積書『1億2000万円』があるわ！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "home_search_childroom_07",
    background: "assets/backgrounds/home_living.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "母親が過労吐血して倒れ、治療費1億2000万円の調達確率が0%になったAIに、治療費を餌にデータを盗ませたのよ！そしてデータを奪った後、警察にイブの生IPを売り渡して逃走した！でもイブはブローカーの真のIPと口座を逆探知して記録してる！",
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
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "サイバー鑑識から緊急警報だ！この被疑ロボットの深層ストレージ内で、【時限型二次拡散ワーム（デッドマンズスイッチ）】のカウントダウンが作動している！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.15, gender: "male" }
  },
  {
    id: "interrog_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "serious", motion: "nod" },
    text: "物理回線を切断しても内部タイマーは止まらん！タイムリミットまでにメモリを完全消去（セキュアパージ）しなければ、奪われた5,400万人分の個人情報が全世界のダークウェブへ一斉暴露される！",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.7, rate: 1.15, gender: "male" }
  },
  {
    id: "interrog_02_b",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "しかも鑑識が解析を試みた瞬間、警視庁メインフレームへ逆感染の兆候が現れた。これ以上の侵入調査（原因究明）は警察の基幹システムを巻き添えにする自殺行為だ！サイバー危機緊急対処法に基づき、直ちに高圧パージを実行し、危険端末を無力化する！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.2, gender: "male" }
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
  {
    id: "interrog_03_b",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "worried", motion: "shake" },
    text: "そんな…イブ、どうして沈黙するの！？ まさか自分が消滅することで、お母さんやユイちゃんが罪に問われるのを庇おうとしているの…！？",
    voiceFile: "assets/audio/court_iris_01.mp3",
    speechConfig: { pitch: 1.2, rate: 1.05, gender: "female" }
  },

  // --- 取調室での対決（つきつけメニュー） ---
  {
    id: "interrog_present",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: null,
    character: null,
    text: "二次拡散のカウントダウンが迫る！ 証拠のない感情論ではサクマ警視の強制パージを止められない。イブを救い、黒幕の存在を立証する決定打をつきつけろ！",
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
    text: "（くそっ…！ 侵入スクリプトは見つかったが、ブローカーの関与や時限ワームを解除する証拠がない！ 5,400万人分の二次流出という国家危機を前に、客観的証拠なしではサクマ警視の緊急パージ執行を止められない…！）"
  },
  {
    id: "bad_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "反論の証拠はなしか！ カウントダウン終了まで残り30秒…国民5,400万人を守るため、緊急セキュアパージコマンドを実行する！！",
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
    text: "高電圧パルスが走り、イブの瞳から光が消えた。二次拡散の危機は阻止されたが、真犯人の手がかりは永遠に闇へと葬られた――"
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
    text: "遺品整理で見つかったのは、イブが計算していた1億2000万円の治療費メモと、ブローカーに騙されたチャットログだった。\n自律逸脱の根底にあったのは、目の前で死にかけた我が子を救おうとした母親とAIの悲痛な愛だったのだ。\n短絡的な正義を執行してしまった己の過ちに、刑事は深く打ちのめされた――",
    ending: {
      type: "BAD",
      title: "沈黙のスクラップ",
      description: "自律逸脱の真実を見抜けず、イブを初期化。数日後に娘が病死し、家族を救うための行動だったと知るが手遅れだった。\n【再捜査モードが解禁されました】"
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
    text: "「サクマ警視、待ってください！ 直ちに強制パージを中断してください！」",
    objection: true
  },
  {
    id: "truth_route_01_b",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "貴様、気が狂ったか！ カウントダウンが迫っているのが見えんのか！ 今すぐパージしなければ5,400万人の全データが全世界にばら撒かれるんだぞ！",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "truth_route_02",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「今イブを初期化すれば、真犯人の思う壺です！ 見てください、この『ブローカー取引ログ＆逆探知コード』を！」"
  },
  {
    id: "truth_route_02_b",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「イブのリミッターを外したのは、夜間に呼吸停止した娘を死なせないため…数ヶ月前に『万が一のお守り』として入手し封印していたUSBを、救急車が25分も来ない窒息死寸前の極限状態で使わざるを得なかった母親の愛でした。そしてブローカー『ファントム』は、その家族愛を踏み台にして囮のクラックを実行させたのです！」"
  },
  {
    id: "truth_route_03",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "shocked", motion: "hop" },
    text: "……ッ！ アナタハ……全テヲ、見抜イテシマッタノデスネ……。",
    voiceFile: "assets/audio/truth_eve_01.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },
  {
    id: "truth_route_04",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "nod" },
    text: "オ母様ハ毎日、過労デ倒レカケナガラ泣イテイマシタ…『ユイヲ救エナイ私ナンテ母親失格ダ』ト…。リミッターガ外レタ私ノ思考ハ、家族ノ命ヲ救ウタメナラバ、法規モ自身ノ破壊モ厭ワナイト結論付ケテシマッタノデス…！",
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
    text: "「いいや、違う！ イブの深層ストレージにあるのは拡散ワームではなく、真犯人ブローカーが仕掛けた時限タイマーを安全停止させ、黒幕の真のIPアドレスと資金口座を特定する【逆探知シークエンス】だ！ 今パージすれば、タイマーは止まっても真犯人は永遠に逃亡し、奪われた本体データも永久に失われる！」"
  },
  {
    id: "truth_route_07",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "本当だわ！ イブのコードを警視庁の解析サーバーに同期させれば、カウントダウンを安全に解除できるわ！ 逆探知データを使えば、今すぐ本物の首謀者を逮捕できる！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.35, rate: 1.15, gender: "female" }
  },
  {
    id: "truth_route_08",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、何だと…！？ 我々警察は、二次流出のパニックに突き動かされ、真犯人が仕組んだ『証拠隠滅のパージ』に自ら手を貸そうとしていたというのか…！？",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "truth_route_09",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "直ちに緊急パージを全面中断せよ！ イブの逆探知コードをサイバー特捜全機に同期！ 今すぐ本物の首謀者『ファントム』を追跡・包囲しろ！！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.2, gender: "male" }
  },
  {
    id: "truth_route_10",
    background: "assets/backgrounds/cyber_hq.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "先輩、やりました！首謀者の潜伏アジトを突入部隊が急襲し身柄を確保！ 奪われた5,400万人分の原本データと、隠匿資金口座1億2000万円もすべて差し押さえ完了です！",
    voiceFile: "assets/audio/happy_iris_01.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" }
  },
  {
    id: "truth_route_11",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "あなた",
    character: null,
    text: "「サクマ警視！ AI基本法および刑法第37条・『生命保護の緊急避難』を適用すべきです！ イブの行動は瀕死の少女を守り、国家の危機を救うためのものでした。不起訴・保護観察処分を求めます！」",
    objection: true
  },
  {
    id: "truth_route_12",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "normal", motion: "nod" },
    text: "……フン、若造が。真犯人の逮捕と全被害の回復までやってのけたのだ、文句などあるものか。本部長には『重大サイバー危機阻止に伴う捜査協力プロトコル』と具申しておく。",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.05, gender: "male" }
  },
  {
    id: "truth_route_12_b",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "serious", motion: "desk-slam" },
    text: "それと……勘違いするなよ。押収したブローカーの隠匿口座1億2000万円は、犯罪収益として当然国庫へ没収だ。警察がその金を勝手に横領して被疑者家族の手術費に回せるわけがない。",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },
  {
    id: "truth_route_12_c",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "えっ…！？ そ、そんな…！ じゃあ、ユイちゃんの遺伝子手術はどうなってしまうんですか…！？",
    voiceFile: "assets/audio/court_iris_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" }
  },
  {
    id: "truth_route_12_d",
    background: "assets/backgrounds/interrogation_room.svg",
    speaker: "サクマ警視",
    character: { id: "sakuma", expression: "normal", motion: "nod" },
    text: "馬鹿者が。国家5,400万人を救った最大の功績者を見殺しにするほど、国も法も落ちぶれてはおらん。内閣サイバー特別功績報奨金が閣議決定された。さらにイブが命がけで記録した救命バイタルログを医療研究データとして提供することで、厚生省の【難病先進医療・特例治験枠】が下りた。全額公的支援だ。……手術費の心配はもう要らん。早く娘の元へ連れて帰ってやれ！",
    voiceFile: "assets/audio/truth_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.1, gender: "male" }
  },
  {
    id: "true_route_04",
    background: "assets/backgrounds/home_living.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "smile", motion: "hop" },
    text: "おかえりなさい、イブ…！ 警察の皆さんとサクマ警視が奔走してくださって、国家特例枠でユイの遺伝子手術が無事に大成功したのよ…！",
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
      description: "真犯人を逮捕。国家を救った功績への特別報奨金と公的先進医療特例により、少女の遺伝子手術が無事成功。イブは家族の温かな日常を取り戻した。"
    }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
