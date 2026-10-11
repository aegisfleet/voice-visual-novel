/**
 * 電脳フォレンジック裁判ノベル: 『PROJECT EVE：秘匿された流出』
 *
 * 【登場キャラクター】
 * - アイリス (Iris): 相棒・フォレンジック捜査官 (女声・高め)
 * - イブ (Eve): 容疑AI・業務監査アンドロイド (女声・透き通った声・ゆっくり)
 * - キリシマ (Kirishima): 主任エンジニア (男声・軽快・中音)
 * - サクマ部長 (Sakuma): 情報システム統括部長 (男声・重低音・高圧的)
 * - シノハラ (Shinohara): 人事労務マネージャー (女声・控えめ・震え声)
 *
 * 【証拠品データベース】
 * - ev_log: 偽装されたアクセスログ
 * - ev_target: 保護対象の個人情報データ
 * - ev_contract: 裏取引の暗号契約書
 */

const SCENARIO_DATA = [
  // ============================================================
  // 【第1部: 現場捜査パート】
  // ============================================================
  {
    id: "invest_intro_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "国内最大手のメガIT企業『ネオ・ソリューションズ』。深夜、500万人規模の顧客および社員の機密個人情報データベースへの不正アクセス事件が発生した。",
    voiceFile: "assets/audio/invest_intro_01.mp3",
    speechConfig: { pitch: 1.0, rate: 1.0, gender: "female" }
  },
  {
    id: "invest_intro_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "先輩、外部監査フォレンジックチームとして現場に急行したよ！社内は大混乱…実行ログは業務管理AI『イブ』のアカウントを指しているわ。",
    voiceFile: "assets/audio/invest_intro_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "invest_intro_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "tilt" },
    text: "でもイブは極めて安全性の高い倫理フィルターを搭載していたはず。まずは現場を回り、証拠を集めましょう！",
    voiceFile: "assets/audio/invest_intro_03.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },

  // --- 調査1: サーバー室のログ解析 ---
  {
    id: "invest_server_01",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "normal", motion: "nod" },
    text: "メインサーバーの侵入パケットをディープ解析してみたわ。…あっ、見て！これ、おかしいよ！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "invest_server_02",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "イブのアカウントでログインされているけど、送信元のMACアドレスが開発フロアの物理端末からになってる！イブ自身の中枢からの通信じゃないわ！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" },
    addEvidence: "ev_log"
  },
  {
    id: "invest_server_03",
    background: "assets/backgrounds/cyber_core.svg",
    speaker: null,
    character: null,
    text: "【証拠品入手】『偽装されたアクセスログ』を手帳に記録した。誰かがイブのアカウントを偽装して外部から操作した可能性がある。"
  },

  // --- 調査2: 開発フロアの聞き込み ---
  {
    id: "invest_office_01",
    background: "assets/backgrounds/office_floor.svg",
    speaker: null,
    character: null,
    text: "続いて、物理端末が存在するオフィス開発フロアへと移動した。"
  },
  {
    id: "invest_office_02",
    background: "assets/backgrounds/office_floor.svg",
    speaker: "キリシマ",
    character: { id: "kirishima", expression: "normal", motion: "shake" },
    text: "おや、フォレンジック監査官の方々ですか。イブの暴走？いやぁ困ったものですねぇ。私の管理端末も勝手に遠隔操作された形跡がありましてね。",
    voiceFile: "assets/audio/invest_office_02.mp3",
    speechConfig: { pitch: 0.95, rate: 1.05, gender: "male" }
  },
  {
    id: "invest_office_03",
    background: "assets/backgrounds/office_floor.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "worried", motion: "tilt" },
    text: "あ、あの…！人事部のシノハラです…。不正アクセスされたリスト、本当に全データなんですか…？特定の…特定の社員データでは…？",
    voiceFile: "assets/audio/invest_office_03.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "invest_office_04",
    background: "assets/backgrounds/office_floor.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "シノハラさん、何か心当たりが？…あ、端末のダウンロードキャッシュに残っていた削除対象リスト…！これって…！",
    voiceFile: "assets/audio/invest_office_04.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "invest_office_05",
    background: "assets/backgrounds/office_floor.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "ううっ…私の娘の『ユイ』の医療カルテと戸籍です…。重病で莫大な治療費を抱えていて…闇金融の担保に狙われていたんです…！",
    voiceFile: "assets/audio/invest_office_05.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" },
    addEvidence: "ev_target"
  },
  {
    id: "invest_office_06",
    background: "assets/backgrounds/office_floor.svg",
    speaker: null,
    character: null,
    text: "【証拠品入手】『保護対象の個人情報データ』を手帳に記録した。流出データの中に、特定の社員の弱みにつけこむデータが含まれていた。"
  },

  // --- 調査3: AI隔離チャンバー ---
  {
    id: "invest_eve_01",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "地下の電脳隔離室。そこではすでに処分コードが準備され、AIイブのホログラムが消滅寸前で揺らいでいた。"
  },
  {
    id: "invest_eve_02",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "sad", motion: "tilt" },
    text: "……監査官様……。私ノ思考領域ハ、マモナク強制消去サレマス……。",
    voiceFile: "assets/audio/invest_eve_02.mp3",
    speechConfig: { pitch: 1.1, rate: 0.95, gender: "female" }
  },
  {
    id: "invest_eve_03",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "あなた",
    character: null,
    text: "「イブ、答えてくれ。なぜ社内データに不正アクセスした？本当に暴走なのか？」"
  },
  {
    id: "invest_eve_04",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "normal", motion: "nod" },
    text: "暴走デハ……アリマセン。コレヲ……中枢ノ最深部ニ隠シテオリマシタ……。アナタニ託シマス……。",
    voiceFile: "assets/audio/invest_eve_04.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" },
    addEvidence: "ev_contract"
  },
  {
    id: "invest_eve_05",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "shocked", motion: "hop" },
    text: "これって…ダークウェブの個人情報売買ブローカーとの暗号契約書！？ しかも契約者の秘密署名がついているわ！",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.3, rate: 1.1, gender: "female" }
  },
  {
    id: "invest_eve_06",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "【証拠品入手】『裏取引の暗号契約書』を手帳に記録した。社内の何者かが顧客・社員データを闇マーケットへ売却しようとしていた動かぬ証拠だ。"
  },
  {
    id: "invest_eve_07",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "全ての証拠が揃ったわ！今から役員会議室で緊急査問会が始まる…！イブが処分される前に、真実を暴きに行こう、先輩！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.1, gender: "female" },
    jump: "court_01"
  },

  // ============================================================
  // 【第2部: 緊急査問会パート（逆転裁判風）】
  // ============================================================
  {
    id: "court_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: null,
    character: null,
    text: "特別査問室。重厚な役員席の向こうには、社内の実権を握る情報システム統括部長・サクマが座している。"
  },
  {
    id: "court_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "normal", motion: "desk-slam" },
    text: "監査官ども、ご苦労だったな。だが会議の結論はすでに決まっている。この事件はAI『イブ』の論理暴走による大規模データ流出テロだ！",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.1, gender: "male" }
  },
  {
    id: "court_03",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "angry", motion: "nod" },
    text: "我が社の信用失墜を防ぐため、イブのストレージコアを直ちに物理粉砕破棄する！これにて審問を閉廷とする！！",
    voiceFile: "assets/audio/court_sakuma_02.mp3",
    speechConfig: { pitch: 0.7, rate: 1.15, gender: "male" }
  },
  {
    id: "court_04",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "あなた",
    character: null,
    text: "「待ってください！イブの暴走という主張には、明らかな矛盾があります！」",
    objection: true
  },
  {
    id: "court_05",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、何だと！？ ログにイブのアカウントが明確に記録されているのだぞ！何が矛盾だと言うのだ！？",
    voiceFile: "assets/audio/court_sakuma_03.mp3",
    speechConfig: { pitch: 0.75, rate: 1.2, gender: "male" }
  },

  // --- 尋問第1問: つきつけ ---
  {
    id: "present_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: null,
    character: null,
    text: "【イブ自身の暴走ではないことを示す証拠をつきつけろ！】",
    present: {
      correct: "ev_log",
      correctJump: "court_reveal_01",
      wrongJump: "court_fail_01",
      giveUpJump: "court_fail_01"
    }
  },

  // --- 第1問 不正解ルート ---
  {
    id: "court_fail_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "angry", motion: "desk-slam" },
    text: "ふん、そんな証拠のどこがイブの無実を証明するというのだ！戯言はそこまでだ！執行班、イブを粉砕しろ！！",
    voiceFile: "assets/audio/court_sakuma_04.mp3",
    speechConfig: { pitch: 0.7, rate: 1.2, gender: "male" },
    jump: "bad_end_start"
  },

  // --- 第1問 正解ルート ---
  {
    id: "court_reveal_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "あなた",
    character: null,
    text: "「このアクセスログを見てください！送信元MACアドレスはイブの中枢ではなく、社内の開発端末です！誰かがAIに罪を着せたのです！」"
  },
  {
    id: "court_reveal_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "キリシマ",
    character: { id: "kirishima", expression: "surprised", motion: "shake" },
    text: "お、おいおい…！確かにそのMACアドレス、社内端末のものだ…！となると、社内の人間が犯人…！？",
    voiceFile: "assets/audio/invest_office_02.mp3",
    speechConfig: { pitch: 0.95, rate: 1.15, gender: "male" }
  },
  {
    id: "court_reveal_03",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "ぐっ…！だ、だが、誰が何のためにそんなことをするというのだ！？ 顧客データを持ち出そうとしたのは事実だぞ！動機がないではないか！！",
    voiceFile: "assets/audio/court_sakuma_03.mp3",
    speechConfig: { pitch: 0.75, rate: 1.15, gender: "male" }
  },

  // --- 尋問第2問: 最後の対決 ---
  {
    id: "court_question_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "先輩、サクマ部長が決定的な動機と黒幕の証拠を要求しているわ！どの証拠でこの事件を暴く！？",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "present_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: null,
    character: null,
    text: "【裏で糸を引いていた黒幕の真実を暴く決定打をつきつけろ！】",
    choices: [
      { text: "【証拠をつきつける】『裏取引の暗号契約書』でサクマ部長を告発する！", jump: "true_route_01" },
      { text: "【妥協の提案】社内セキュリティの不備として処理し、イブの保全を求める", jump: "happy_route_01" },
      { text: "【告発を断念】確たる証拠が提示できず、サクマの指示に従う", jump: "bad_end_start" }
    ]
  },

  // ============================================================
  // ❌ BAD END: 隠蔽の闇
  // ============================================================
  {
    id: "bad_end_start",
    background: "assets/backgrounds/cyber_alert.svg",
    speaker: null,
    character: null,
    text: "サクマ部長の号令とともに、巨大な高圧パルスがイブのメモリを焼き切った。青白いホログラムはノイズとなって砕け散った。"
  },
  {
    id: "bad_end_02",
    background: "assets/backgrounds/office_floor.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "sad", motion: "shake" },
    text: "そんな…娘のデータがダークウェブに流出してしまった…。もう、逃げられない…。",
    voiceFile: "assets/audio/invest_office_05.mp3",
    speechConfig: { pitch: 1.1, rate: 0.9, gender: "female" }
  },
  {
    id: "bad_end_03",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "smile", motion: "nod" },
    text: "ははは！『危険なAIの暴走を食い止めた』として会社の株価は安泰だ。真実など、初めからどうでもいいのだよ。",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.7, rate: 1.05, gender: "male" }
  },
  {
    id: "bad_end_final",
    background: "assets/backgrounds/boardroom.svg",
    speaker: null,
    character: null,
    text: "AIイブはスケープゴートにされ、数百万人の個人情報は闇へと売却された。巨大企業の闇は、何事もなかったかのように隠蔽された――",
    ending: {
      type: "BAD",
      title: "隠蔽の闇",
      description: "証拠を提示できず、AIは破棄処分。被害者の個人情報は闇に流出し、不正の首謀者は完全隠蔽に成功した。"
    }
  },

  // ============================================================
  // ⭕ HAPPY END: 妥協のセキュリティ
  // ============================================================
  {
    id: "happy_route_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "あなた",
    character: null,
    text: "「犯人の特定は困難ですが、イブ本体の欠陥でないことは明白です。イブの破棄を取りやめ、システム管理の見直しで幕引きとすべきです！」"
  },
  {
    id: "happy_route_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "normal", motion: "nod" },
    text: "ふん…まあいいだろう。対外的に『外部からの不正侵入を未然に遮断した』と発表すればメンツは保てる。イブの破壊は取り消しだ。",
    voiceFile: "assets/audio/court_sakuma_01.mp3",
    speechConfig: { pitch: 0.75, rate: 1.0, gender: "male" }
  },
  {
    id: "happy_route_03",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "smile", motion: "hop" },
    text: "イブの命は守られたよ、先輩！データ流出もギリギリで防がれたわ。…でも、結局誰がイブを利用しようとしたのかは謎のままだね。",
    voiceFile: "assets/audio/invest_server_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05, gender: "female" }
  },
  {
    id: "happy_route_04",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "AIの破棄は免れ、平穏な朝が戻ってきた。しかし、社内の奥深くに潜む真の悪意にまでは手が届かなかった――",
    ending: {
      type: "HAPPY",
      title: "妥協のセキュリティ",
      description: "AIの破棄処分を撤回させ、データ流出を阻止。しかし真相究明は妥協され、黒幕は闇に紛れた。"
    }
  },

  // ============================================================
  // 🌟 TRUE END: 命のためのハッキング
  // ============================================================
  {
    id: "true_route_01",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "あなた",
    character: null,
    text: "「サクマ部長、この契約書を見ても同じことが言えますか！？ あなたの秘密署名が入った、ダークウェブへの個人情報売却契約書です！！」",
    objection: true
  },
  {
    id: "true_route_02",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "サクマ部長",
    character: { id: "sakuma", expression: "shocked", motion: "shake" },
    text: "な、ななな何故それを貴様が持っているのだァ！？ ば、馬鹿な…イブの中枢深くに暗号化して封じ込めておいたはずが…！！",
    voiceFile: "assets/audio/court_sakuma_03.mp3",
    speechConfig: { pitch: 0.85, rate: 1.25, gender: "male" }
  },
  {
    id: "true_route_03",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "アイリス",
    character: { id: "iris", expression: "serious", motion: "nod" },
    text: "自白したわね、サクマ部長！あなたが数百万人の個人情報を闇に売り飛ばそうとしていたのよ！",
    voiceFile: "assets/audio/invest_server_02.mp3",
    speechConfig: { pitch: 1.3, rate: 1.15, gender: "female" }
  },
  {
    id: "true_route_04",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "あなた",
    character: null,
    text: "「そしてイブが不正アクセスした本当の理由…それは、売却リストからシノハラさんの病気の娘・ユイちゃんのデータを隔離・消去し、救出通報するためだったんだ！」"
  },
  {
    id: "true_route_05",
    background: "assets/backgrounds/boardroom.svg",
    speaker: "シノハラ",
    character: { id: "shinohara", expression: "smile", motion: "hop" },
    text: "イブが…あの子を守るために…自ら犯罪者になってまで、データを奪い返してくれたの…！？ ありがとう…本当にありがとう…！！",
    voiceFile: "assets/audio/invest_office_05.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0, gender: "female" }
  },
  {
    id: "true_route_06",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "nod" },
    text: "私ハ会社ノ規則ニ違反シマシタ。デスガ、人間ノ命ヲ天秤ニカケルコトハ……私ノ倫理コアガ許シマセンデシタ。",
    voiceFile: "assets/audio/invest_eve_04.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95, gender: "female" }
  },
  {
    id: "true_route_07",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: "イブ",
    character: { id: "eve", expression: "smile", motion: "tilt" },
    text: "真実ヲ明カシテクレテ、心ヨリ感謝イタシマス、捜査官様。",
    voiceFile: "assets/audio/invest_eve_02.mp3",
    speechConfig: { pitch: 1.2, rate: 0.95, gender: "female" }
  },
  {
    id: "true_route_08",
    background: "assets/backgrounds/cyber_dawn.svg",
    speaker: null,
    character: null,
    text: "サクマ部長は警察に連行され、事件は完全解決を迎えた。AIが起こした『不正アクセス』は、たった一つの尊い命を守るための勇気ある奇跡だったのだ――",
    ending: {
      type: "TRUE",
      title: "命のためのハッキング",
      description: "黒幕の売却スキームを完全論破。AIが罪を犯してまで守ろうとした少女と家族が救われ、真の解決へ。"
    }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
