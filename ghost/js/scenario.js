// scenario.js - GHOST PROTOCOL 全5章インタラクティブノベルシナリオ＆真相レポートマスターデータ

window.SCENARIO_DATA = {
  meta: {
    title: 'GHOST PROTOCOL 〜26,739台の亡霊と能動的サイバー防御・発動第1号〜',
    version: '2026.10.30-novel-v8-bounty-revenge',
    description:
      '2026年10月VPS大規模サイバー侵害事件の光と影——窓口に黙殺された脆弱性報告者（バグハンター）の歪んだ報復と、企業の設計過失・後出し広報への批判、そして犯人が求めた「100万ドルの報奨金」が「100万ドルの犯人検挙懸賞金」へと反転する社会派サイバーサスペンス（第16報完全反映版）',
  },
  evidence: {
    ad_demofastloss_log: {
      id: 'ad_demofastloss_log',
      name: 'AD侵入痕跡・取引プロトコル生ログ',
      icon: '🔥',
      image: 'assets/evidence/ad_demofastloss.png',
      type: '【通信プロトコル鑑識】共通管理アカウント侵害・ミリ秒注文パラメータ',
      summary:
        '全26,739台共通の管理者アカウント設計の欠陥と、脆弱性実証デモ名『DEMOFASTLOSS』を刻んで口座残高を蒸発させた恐喝注文記録。',
      detail:
        '8月31日に取得された偽装ドメイン coronamgt-c2.net を起点にActive Directory管理プレーンが侵入された。全26,739台のVPSに「共通の管理者アカウント」が設定されていた致命的な基本設計の欠陥により、1箇所の突破で全サーバーのFT4/FT5認証情報が一網打尽に窃取された。注文コメントに刻まれた『DEMOFASTLOSS（高速損失デモ）』は、もともと犯人が数ヶ月前に企業の脆弱性窓口へ報告した際の概念実証（PoC）コードの関数名であり、報告を黙殺されたことへの当てつけとして本番環境で炸裂させたものだった。さらに企業側が第1報（10月21日）で「情報の悪用や流出は確認されていない」と早計な安全宣言を出したことでユーザーの警戒が遅れ、口座焼却被害が拡大した決定打の鑑識記録。',
    },
    persistent_session_trap: {
      id: 'persistent_session_trap',
      name: '取引通信ソケット監査票＆脅迫添付Excel',
      icon: '🌐',
      image: 'assets/evidence/persistent_session.png',
      type: '【セッション・偽旗鑑識】永続ソケット監査・脅迫メールメタデータ',
      summary:
        '後出し発表への不信を突いた分断工作メールの偽旗痕跡（工作表1）と、黙殺された発見者が多国籍シンジケートと手を組んだ証拠。',
      detail:
        '第1報の「悪用なし」から一転して第2報（10月22日）で「口座情報閲覧の可能性」を後出し発表したことで、SNSでは「小出し・隠蔽体質だ」と大炎上が発生。さらにパスワード変更後も不正取引が続いた原因は、FT4/FT5プロトコルが既存の確立済みTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り注文を受け続ける仕様にあった。また、企業の後出し広報への不信に付け込んで『Hacking Team (Dmitry Orlov)』が送ってきた集団訴訟煽動Excelの内部XMLには、中国語版KPS Office特有の『工作表1』が残存しており、窓口に無視されて逆上した脆弱性発見者が、大規模攻撃と資金洗浄のために中国語圏のダークウェブ恐喝ブローカーと結託した多国籍偽旗工作（False Flag）が暴かれた。',
    },
    reverse_rdp_tsclient: {
      id: 'reverse_rdp_tsclient',
      name: 'クライアント接続構成ファイル＆共有API証跡',
      icon: '💻',
      image: 'assets/evidence/reverse_rdp.png',
      type: '【エンドポイント構成鑑識】RDPリダイレクト設定・窓口通報38回黙殺の証跡',
      summary:
        '2019年からの接続用.rdp自動共有設定の放置と、社内警告および外部窓口への38回のバグバウンティ報告を黙殺した人災の記録。',
      detail:
        '2019年から配布されていた接続用 .rdp ファイル内に『drivestoredirect:s:*』が記述されていたため、ユーザーが自宅PCからVPSへリモート接続した瞬間、VPS側から被害者のCドライブが \\\\tsclient\\C として自動マウントされていた。社内ホワイトハッカー集団が事前に改善課題を指摘していただけでなく、数ヶ月前から外部のバグハンター（後の主犯）が脆弱性通報窓口へ「38回」にわたり危険性と報奨金（バグバウンティ）の要求を送っていたにもかかわらず、「バグバウンティ対象外・可用性優先」として1通も返信せず黙殺・放置していたことが発覚。マルウェアなしで自宅PCから4,352ファイルが吸い出された『リバースRDP』の物理的証明であり、企業の一顧だにしない対応が発見者を怪物（黒い亡霊）へ変貌させた構造的人災の証跡。',
    },
    direct_compensation_matrix: {
      id: 'direct_compensation_matrix',
      name: '顧客実損算定マトリクス＆API照会監査票',
      icon: '⚖️',
      image: 'assets/evidence/compensation_matrix.png',
      type: '【法理・制度監査証跡】直接補償・特別お見舞金・100万ドル逆転懸賞金と世論の賛否',
      summary:
        '犯人が執着した「100万ドルのバグバウンティ（報奨金）」を、犯人自身を狩る「100万ドルの検挙懸賞金」へと反転させたゲーム理論の証跡。',
      detail:
        '攻撃者の5,000万ドル（約80億円）要求に対し、企業側は『永久に支払ゼロ』を宣言。約款免責を超えて『不正取引実損の100%直接補償（Investor Password監査）＋一律見舞金5,000円＋新基盤半年無償移行』を断行し、交渉カードを失った犯人は「最初から俺の報告に払うべきだった正当なバグバウンティ（報奨金）の額だ」として要求額を100万ドルへと98%値下げした。これに対し企業は第12報で情報公開被害者への『特別お見舞金（上限300万円）』を打ち出すとともに、犯人が求めた同額の100万米ドルを『サイバー犯罪撲滅・懸賞金（3言語窓口）』として世界中の情報提供者に懸け、共犯シンジケートの裏切り（累計321件の密告）と放置チケット照合による犯人特定（第15・16報）へ結実させた。一方で「原因公表の遅れ」や「トップ個人のSNS発信」への批判も記録した両義的証跡。',
    },
    nco_three_walls_report: {
      id: 'nco_three_walls_report',
      name: '国家サイバー対処法理・要件適合性審査レポート',
      icon: '🏛️',
      image: 'assets/evidence/nco_alert.png',
      type: '【サイバー防衛法理証跡】能動的サイバー防御発動要件監査＆企業過失への戒告',
      summary:
        '企業の「AI飽和攻撃・国家防衛への責任転嫁」を厳しく戒めつつ、人質となった国民を救うため警職法6条の2で職権介入した法理レポート。',
      detail:
        '企業トップが個人SNS等で「AIによるサイバー飽和攻撃だ」「政府へ能動的サイバー防御を要請した」と発信し、世論から「自社のずさんな設計と警告・窓口通報無視による人災を国家防衛の問題にすり替えるな」と炎上。NCOは「国家の盾は企業の過失を免罪する道具ではない」と厳しく釘を刺した上で、国民への現在進行形の危害を止めるため3つの壁を突破した。①基幹インフラ15分野の壁→70社超の金融機関への波及と10月27日正午の『被害者 第1号』公開・毎日1人ずつのサラミ戦術を根拠に警察官職務執行法第6条の2で職権認知。②無同意通信取得の壁→被害企業による100%任意ログ提供で回避。③外国主権と偽旗工作の壁→真の発信源の100%特定を条件に認可。',
    },
    canary_c2_origin: {
      id: 'canary_c2_origin',
      name: 'ハニーポット端末・外部通信ビーコン記録',
      icon: '🎯',
      image: 'assets/evidence/c2_origin.png',
      type: '【真性C2逆探知ビーコン】逆探知ビーコン発火・放置バグ報告チケットとの一致証跡',
      summary:
        '「一度も使っていない」と証言された第1号公開データのツギハギ工作の解明と、真C2（91.240.118.174）および過去の脆弱性通報ログとの一致記録。',
      detail:
        '10月27日正午、攻撃者が『被害者 第1号』の個人情報を公開。直後に被害者本人がメディア取材に「サービスを一度も使ったことがない、内容もデタラメだ」と証言し、代表がブログで言及したことで「別サービスからの漏洩か」と大混乱が生じたが、鑑識により犯人が古い名簿断片とダミーデータをツギハギして水増し加工していた事実が判明。まさにそのデータ復号・加工の瞬間、ハニーポットから持ち帰らせていたダミーLogin Data内のカナリアトークンが発火し、多段プロキシの奥にある真のC2サーバー（91.240.118.174）を特定。10月28日午前4時の全脅迫サイト完全テイクダウン（第13報）と、過去の未処理バグ報告チケットとの照合による犯人特定・警察提出（第15報）へ直結した決定打。',
    },
  },
  items: {
    item_canary_usb: {
      id: 'item_canary_usb',
      name: '特殊鑑識USB・カナリアトークン仕込みデバイス',
      icon: '🔑',
      image: 'assets/items/item_canary_usb.png',
      type: '【追跡トラップ型鑑識デバイス】',
      summary: 'ハニーポット端末から \\\\tsclient\\C 逆流潜入させ、攻撃者を釣る囮データ格納USB。',
      detail:
        '金融機関へのRDP不正接続を逆利用し、攻撃者が「被害者 第1号」の個人情報を加工・公開しようとした瞬間にDNS/HTTP逆探知ビーコンを送信。多段偽装プロキシの背後にある真性C2（91.240.118.174）と過去のバグ報告者環境の接点を暴き出すトリガーとなった決定打デバイス。',
    },
    item_investor_key: {
      id: 'item_investor_key',
      name: 'Investor Password 監査キーカード',
      icon: '💳',
      image: 'assets/items/item_investor_key.png',
      type: '【客観的損害算定・暗号監査カード】',
      summary: '取引権限を持たず、ミリ秒単位の取引履歴のみを改ざん不可能に抽出する閲覧専用キー。',
      detail:
        '攻撃者による「80億円要求」に対し、企業側が約款免責を超えた直接補償を実施するにあたり、ユーザー申告とVPS侵入ログを突合してモラルハザードを防いだ救世主。この客観的算定により犯人は「本来貰うはずだったバグバウンティの額だ」として要求額を100万ドル（約1.6億円）へと98%値下げした。',
    },
    item_nco_directive: {
      id: 'item_nco_directive',
      name: '能動的サイバー防御・電子発動命令書（第001号：GHOST PROTOCOL）',
      icon: '📜',
      image: 'assets/items/item_nco_directive.png',
      type: '【国家サイバー防御・非公然執行権限】',
      summary:
        '警察官職務執行法第6条の2に基づく、史上初の非公然アクセス・消去措置『GHOST PROTOCOL』を認可する電子執行令書。',
      detail:
        '内閣官房国家サイバー統括室（NCO）および警察庁サイバー特別捜査隊による合同令書。「手の内を明かさない」原則により公式記録には一切残されない非公然の執行手順（コードネーム：GHOST PROTOCOL）として、3つの壁を突破し、国境を越えたC2攻撃インフラへの緊急無害化措置執行権限をケイ・アリアに委ねる最高機密アセット。',
    },
    item_cyber_bounty_portal: {
      id: 'item_cyber_bounty_portal',
      name: '100万米ドル懸賞金＆特別救済ポータル端末',
      icon: '🌐',
      image: 'assets/items/item_cyber_bounty_portal.png',
      type: '【3言語特設報奨金・特別救済キーアセット】',
      summary:
        '犯人が渇望した「100万ドルのバグバウンティ」を「100万ドルの犯人検挙懸賞金」へ反転させた専用端末。',
      detail:
        '日・英・中3言語で100万ドル懸賞金と上限300万円特別お見舞金を布告し、単独の発見者と金目当ての多国籍シンジケートの間に決定的な亀裂（囚人のジレンマ）を発生させた決定打アセット。開始6時間で113件（第14報）、翌日までに321件（第16報）の密告を回収し、社内ホワイトハッカーによる放置バグ報告チケット照合と合わせて犯人特定・警察提出（第15報）へと導いた。',
    },
  },
  prologue: {
    title: 'PROLOGUE: 2026年10月20日 23:45 — 予兆なき暗転',
    dialogue: [
      {
        speaker: 'narrator',
        text: '2026年10月20日、火曜日、深夜23時45分。',
        bgm: 'investigate',
        telop: '【2026.10.20 23:45 都内ケイ私設ラボ】',
        voiceUrl: 'assets/audio/prologue/prologue_01.mp3',
      },
      {
        speaker: 'narrator',
        text: '都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイの監視モニターが突如、断末魔のようなエラーログを吹き鳴らした。',
        sfx: 'alert',
        effect: 'alert-flash',
        voiceUrl: 'assets/audio/prologue/prologue_02.mp3',
      },
      {
        speaker: 'kei',
        text: '……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、全APIの異常切断アラートが連続で出ている……！？',
        sfx: 'glitch',
        voiceUrl: 'assets/audio/prologue/prologue_03.mp3',
      },
      {
        speaker: 'aria',
        emotion: 'alert',
        sprite: 'aria',
        text: 'マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました！',
        bgm: 'crisis',
        telop: '【EMERGENCY: 国内最大手ネオドットコム 全面RPC異常検知】',
        effect: 'glitch',
        voiceUrl: 'assets/audio/prologue/prologue_04.mp3',
      },
      {
        speaker: 'kei',
        text: '全インスタンスだと！？ あのクラウドは、全国数万人規模の個人トレーダーが24時間体制で金融自動売買（FT4/FT5）を動かしている国内屈指の巨大基盤だぞ！',
        voiceUrl: 'assets/audio/prologue/prologue_05.mp3',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい。稼働仮想マシン総数は26,739台……そのほぼすべてが管理ネットワークから次々と蒸発し、応答を喪失しつつあります！',
        sfx: 'alert',
        voiceUrl: 'assets/audio/prologue/prologue_06.mp3',
      },
      {
        speaker: 'narrator',
        text: 'その直後、ケイの私用スマートフォンが狂ったように震え出した。発信元は——クラウド運用本部CSIRT現場リーダーであり、大学時代からの親友、タカミヤ レン。',
        sfx: 'ring',
        voiceUrl: 'assets/audio/prologue/prologue_07.mp3',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『ケイ……！ 頼む、助けてくれ！ 現場のAD（Active Directory）管理プレーンが……全部乗っ取られた！』',
        effect: 'shake',
        telop: '【CRITICAL BREACH: AD管理プレーン完全掌握】',
        voiceUrl: 'assets/audio/prologue/prologue_08.mp3',
      },
      {
        speaker: 'kei',
        text: 'レン！？ 落ち着け、一体何が起きてるんだ！？',
        voiceUrl: 'assets/audio/prologue/prologue_09.mp3',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『深夜、管理基盤の深部に侵入された……！ 2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が……裏コマンドから次々と書き換えられている！』',
        voiceUrl: 'assets/audio/prologue/prologue_10.mp3',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『このまま夜が明ければ、数万人の顧客資産が全滅する……！ 我々は午前4時をもって、26,739台すべての【全回線切断・強制シャットダウン】を決断する！』',
        sfx: 'impact',
        voiceUrl: 'assets/audio/prologue/prologue_11.mp3',
      },
      {
        speaker: 'kei',
        text: '26,739台の全停止……！ 日本の金融インフラを揺るがす未曾有のインシデントになるぞ……！',
        voiceUrl: 'assets/audio/prologue/prologue_12.mp3',
      },
      {
        speaker: 'narrator',
        text: '深夜の死闘の末、運命の午前4時00分が訪れた。対策本部は苦渋の決断として、全仮想マシンの強制回線切断に踏み切った。',
        bgm: 'silence',
        sfx: 'impact',
        effect: 'blackout',
        telop: '【2026.10.21 04:00 全26,739台強制回線切断執行】',
        voiceUrl: 'assets/audio/prologue/prologue_13.mp3',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター、シャットダウンが執行されました。全サーバーが沈黙……ですが、不吉なデータを受信しました！',
        bgm: 'crisis',
        voiceUrl: 'assets/audio/prologue/prologue_14.mp3',
      },
      {
        speaker: 'kei',
        text: '……なんだ、このメッセージは？',
        voiceUrl: 'assets/audio/prologue/prologue_15.mp3',
      },
      {
        speaker: 'narrator',
        text: 'ブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。',
        sfx: 'glitch',
        effect: 'glitch',
        voiceUrl: 'assets/audio/prologue/prologue_16.mp3',
      },
      {
        speaker: 'kei',
        text: '全26,739台のVPSを物理遮断した直後に、この挑発メッセージ……敵の仕掛けはまだ終わっていない！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！',
        bgm: 'investigate',
        sfx: 'cutin',
        voiceUrl: 'assets/audio/prologue/prologue_17.mp3',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: '了解しました、マスター。沈黙した26,739台の背後に潜む『亡霊の通信規約（ゴースト・プロトコル）』——命を削る電脳戦争の幕開けです！',
        sfx: 'correct',
        voiceUrl: 'assets/audio/prologue/prologue_18.mp3',
      },
    ],
  },
  chapters: [
    {
      id: 1,
      number: 'CHAPTER 1',
      date: '10月21日 04:00',
      title: '26,739台の沈黙と『2秒で蒸発した400万円』',
      subtitle: '口座焼却型恐喝 DEMOFASTLOSS の罠',
      requiredEvidence: 'ad_demofastloss_log',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月21日、午前4時00分。国内大手GNOインターネットグループは、26,739台におよぶWindows VPSのネットワークを全面遮断し、全サーバーの緊急停止に踏み切った。',
          bgm: 'crisis',
          telop: '【10.21 04:00 全26,739台ネットワーク全面遮断】',
        },
        {
          speaker: 'narrator',
          text: 'しかし夜明けとともに、SNS上には全国のトレーダーたちの悲鳴と怒号が津波のように押し寄せた。「ふざけるな！ サーバー停止直前に勝手に見覚えのないハイレバ注文が乱発され、口座残高400万円が2秒でゼロになった！」「全財産が消えた、返せ！」',
          sfx: 'impact',
          effect: 'shake',
          telop: '【WARNING: 全国数千件の口座残高蒸発被害報告】',
          cutSequence: {
            id: 'seq_ch1_balance_drain',
            title: '口座残高超高速蒸発シークエンス',
            description: 'TRY/ZAR 850pps超高スプレッド即時往復注文による残高焼却の連続カット',
            intervalMs: 1800,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch1_cut1.jpg',
                sfx: 'alert',
                visualType: 'meter-high',
                caption: 'FT4注文端末: TRY/ZAR 850pps往復注文乱発 [残高: 4,000,000円]',
                visualDesc: 'BALANCE: ¥4,000,000 >> TRY/ZAR 50.0 LOTS BUY/SELL',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch1_cut2.jpg',
                sfx: 'glitch',
                visualType: 'meter-mid',
                caption: '残高激減: スプレッド手数料で残高が猛烈に市場へ蒸発 [残高: 1,420,000円]',
                visualDesc: 'BALANCE: ¥1,420,000 (-¥2,580,000 SPREAD DRAIN)',
              },
              {
                frame: 3,
                image: 'assets/sequences/ch1_cut3.jpg',
                sfx: 'impact',
                visualType: 'meter-zero',
                caption: '口座完全焼却: DEMOFASTLOSS刻印 [残高: 0円 / 強制ロスカット]',
                visualDesc: 'BALANCE: ¥0 [MARGIN CALL / COMMENT: DEMOFASTLOSS]',
              },
            ],
          },
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'ケイ、問い合わせ窓口が完全にパンクしている……！ 1時間で数千件の口座破綻報告だ。実は今朝の第1報で、法務と広報が「現時点で情報の悪用や個人情報の外部流出は確認されておりません」と発表してしまったんだ……！',
          sfx: 'alert',
        },
        {
          speaker: 'kei',
          text: 'なっ……！？ 調査も終わっていないのに「悪用は確認されていない」なんて安全宣言を出したのか！？ その第1報を信じて口座を放置したユーザーが今、次々と焼き払われているんだぞ！ しかもログを見れば、全26,739台のVPSに「共通の管理者アカウント」が使われているじゃないか！ 1箇所破られただけで2万6千台すべてが一網打尽になるなんて、クラウド設計の基本すら守られていないぞ！',
          sfx: 'impact',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '返す言葉もない……レガシーな一括管理設計のツケと、初動広報の矮小化が最悪の形で重なってしまった……！ ケイ、一体どこから鑑識のメスを入れればいいんだ！？',
        },
      ],
      choiceSteps: [
        {
          id: 'ch1_step1_target',
          type: 'tactic',
          badge: '⚡ TACTICAL DECISION / 初動作戦の決断',
          hintSummary:
            '口座から勝手にお金が消えています。まずは「自動売買ソフト（FT4）の中でどんな注文が出されたのか」直接記録を調べましょう！',
          question:
            '【初動作戦の判断】1時間で数千件に達した被害報告に対し、限られた時間の中でどこから鑑識のメスを入れるか？',
          cutinText: '作戦指令承認：FT4取引プロトコル生ログを抽出！',
          cutinSub: '⚡ NCO TACTICAL DIRECTIVE / 作戦指示承認',
          options: [
            {
              id: 'opt1_target_ft4',
              label: '自動売買ソフト（FT4）の「0.001秒単位の注文履歴」を直接調べる',
              description:
                '犯人がサーバー停止直前にどんな売買注文を出し、どうやって残高を減らしたのか記録を洗う。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: 'アリア、被害を受けた上位50口座のFT4取引プロトコルから、ミリ秒単位の注文パラメータをすべて抽出しろ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '承知しました！ 異常な注文テレメトリを捕捉しました……全口座で極めて特異なシグネチャが刻まれています！',
                },
              ],
            },
            {
              id: 'opt1_target_malware',
              label: 'サーバーOSのシステムログから、外部不正送金マルウェアの痕跡をスキャン',
              description: '一般的な金融型トロイの木馬（バンキング型マルウェア）の活動痕跡を探す。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '外部送金マルウェアは検出されなかった！ 調査に1時間を浪費し、SNSの炎上がさらに拡大した……！ 別のアプローチを選べ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '外部へ不正送金するバンキング型マルウェアが仕組まれていないか、OSログを洗ってくれ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '外部送金マルウェアは……ゼロです！ 攻撃者は送金など行っていません。調査時間を1時間ロスしてしまいました！',
                },
              ],
            },
            {
              id: 'opt1_target_weblogin',
              label: '証券会社Webポータルに対する不正ログイン試行ログの調査',
              description: 'ブラウザ経由でのパスワード総当たりやセッション乗っ取りを調べる。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'Webポータル経由のアクセスは皆無！ 調査空振りの間に被害報告がさらに1,200件拡大した……！ 別の調査対象を選べ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '証券会社のWeb画面にブルートフォースや二段階認証突破の形跡がないか照会しろ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'Webログイン試行はゼロ件です！ 攻撃者はWeb画面ではなく、端末内部から直接仕掛けています！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'takamiya',
              sprite: 'takamiya',
              text: '被害の傾向は掴めた……だが不可解すぎる！ 証券会社には本人名義出金制限と二段階認証がある。攻撃者は1円も出金できていない！ 金を盗めないのに、なぜ他人の口座をゼロにするんだ！？',
            },
            {
              speaker: 'kei',
              text: '出金できないのに残高が消える……？ アリア、抽出したFT4取引ログの生テレメトリをモニターに展開しろ！',
            },
          ],
        },
        {
          id: 'ch1_step2_log_decode',
          type: 'forensic',
          badge: '⚡ FORENSIC DEDUCTION / 生ログ解読の推理',
          hintSummary:
            'ログを見ると「外部への出金（OUTGOING_TRANSFER）は0円」なのに、手数料（SPREAD）が極めて高い通貨を0.1秒で何度も売り買いして400万円を0円にしています。犯人の狙いは？',
          question:
            '【生ログ解読の推理】攻撃者は1円も出金できないにもかかわらず、なぜこの異常な注文を繰り返したのか？',
          cutinText: '口座焼却の手口を看破！ 恐喝の構図を立証！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          logBox: {
            title: 'FT4 TRANSACTION LOG [EXTRACTED FROM INSTANCE #10482]',
            content:
              'TIMESTAMP: 2026-10-21 03:58:12.104\n通貨ペア: TRY/ZAR（マイナー通貨） | 手数料(スプレッド): 850 pps（通常の数百倍）\n注文内容: 50ロット購入 -> 0.1秒後に即売却（超高速の往復売買を連打）\n注文暗号: DEMOFASTLOSS | 外部への不正送金額: 0円\n口座残高: 4,000,000円 -> 0円（手数料負けによる消滅: -4,000,000円）',
          },
          options: [
            {
              id: 'opt1_decode_cross',
              label:
                '自己の別口座と相対取引（クロス取引）を成立させ、スプレッド越しに資金を吸い上げている',
              description: '薄商いの通貨で反対売買をぶつけ、利益を移転させているという仮説。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '流動性プロバイダ（LP）経由のECN市場のため、特定口座への直接付け替えは不可能だ！ 別の意図を推理せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '攻撃者が別口座で反対売買を待ち構え、資金を自己口座へ移転させたんじゃないか？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'いや、被害口座はすべてインターバンク市場に直結したECN口座だ！ 流動性プロバイダを介すため、特定口座へ資金を吸い上げることは構造的に不可能だ！',
                },
              ],
            },
            {
              id: 'opt1_decode_burn',
              label:
                'あえて「手数料が超高額な売買」を連打して口座残高を市場へ溶かし、怒った顧客を人質にして当社を脅迫しようとしている',
              description:
                '『DEMOFASTLOSS』により残高を即座に消滅させ、顧客の怒りをテコにインフラ企業を恐喝する手口。',
              isCorrect: true,
              rewardEvidence: 'ad_demofastloss_log',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'やっぱりだ……！ 高スプレッド通貨を0.1秒で高速往復売買させ、残高を手数料として瞬時に市場へ蒸発させている！ 送金ではなく『口座の焼却』だ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'ビンゴですマスター！ 出金制限を逆手に取り、顧客資産を人質（レバレッジ）に変えてインフラ企業を脅迫する構造です！',
                },
                {
                  speaker: 'kei',
                  text: 'だが待てよ……注文コメントに刻まれた『DEMOFASTLOSS（高速損失デモ）』という文字列。犯罪組織の署名にしては、まるで「脆弱性の概念実証（PoC）デモ」のような妙な名前だな……？',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'takamiya',
              sprite: 'takamiya',
              text: 'なんて残酷な……顧客の運用資金を人質にして焼き払ったというのか！ しかしこれで手口は暴かれた。至急、第2報でユーザーに対策を呼びかけるぞ！',
            },
          ],
        },
        {
          id: 'ch1_step3_trap',
          type: 'tactic',
          badge: '⚡ EMERGENCY DIRECTIVE / 緊急対応の決断',
          hintSummary:
            '被害が広がり続けています。原因の全貌解明には時間がかかりますが、今すぐ顧客自身に取ってもらえる最も安全な自衛策は何でしょうか？',
          question:
            '【緊急対応の決断】第2報として、26,739人のユーザーへどの初動対策を公式アナウンスするか？',
          cutinText: '第2報発令：全ユーザーへの緊急パスワード変更指示！',
          cutinSub: '⚡ INCIDENT RESPONSE ANNOUNCEMENT / 第2報発令',
          isFinalStep: true,
          options: [
            {
              id: 'opt1_trap_silent',
              label: '原因が完全特定できるまで事実公表を控え、サイレント調査を継続する',
              description: '風評被害を最小限に抑え、裏で原因特定とパッチ適用を完了させる。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'SNSのパニックが暴動化し、金融庁から即時公表の厳命が下った！ 沈黙は許されない！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '原因が完全特定できるまで公表を控え、水面下でサイレント調査を進めるべきだ。',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'だめだ！ すでにSNSで被害報告が爆発している！ 沈黙すれば隠蔽工作とみなされ金融庁から業務改善命令どころか業務停止命令が飛ぶぞ！',
                },
              ],
            },
            {
              id: 'opt1_trap_freeze',
              label:
                '国内外70社の全ブローカーに対し、無関係な一般口座を含む全顧客口座の無期限凍結を要請する',
              description: 'システム全体を一斉停止し、すべての資金移動と取引を物理的に封殺する。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '被害に遭っていない数百万人の口座まで止めることは金融市場への影響が大きすぎると各社から拒絶された！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '全ブローカーに要請し、無関係な一般口座も含めて全顧客口座を無期限凍結してはどうだ？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '無茶を言うな！ 被害のない正常な数百万口座まで止めたら金融市場が大混乱に陥る！ ブローカー各社から即座に拒絶された！',
                },
              ],
            },
            {
              id: 'opt1_trap_password',
              label: '全ユーザーに対し、金融取引口座のWebパスワードの即時変更を強く呼びかける',
              description: '侵入された認証情報を無力化し、これ以上の口座焼却を防ぐ王道の初動対応。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: '全ユーザーにパスワードの即時変更を呼びかけろ！ これでアカウントの不正操作は防げるはずだ！',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'よし、第2報として公式発表する！ これで最悪の事態は防げるはずだ！',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/ad_demofastloss.png',
          text: '核心鑑識データ『AD侵入痕跡・取引プロトコル生ログ』を取得しました。口座焼却の真相が完全に立証されました！',
          bgm: 'truth',
          sfx: 'evidence',
          telop: '【FORENSIC PROOF: DEMOFASTLOSS 口座焼却手口を立証】',
        },
        {
          speaker: 'takamiya',
          emotion: 'smile',
          sprite: 'takamiya',
          text: '10月22日昼、第2報のリリース完了！ 昨日の第1報を訂正して口座情報閲覧の可能性を公表し、全ユーザーへパスワードの即時変更を呼びかけた。これで今夜の不正取引は阻止できるはずだ……！',
        },
        {
          speaker: 'narrator',
          text: '安堵の息を漏らした瞬間、対策本部のホットラインがけたたましい警報音を鳴り響かせた。',
          bgm: 'silence',
          sfx: 'ring',
          effect: 'alert-flash',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '……な、なんだ！？ 攻撃者から対策室の直通シークレットチャットに、直筆の暗号化メッセージが届いた……！？',
          bgm: 'crisis',
          sfx: 'glitch',
          effect: 'glitch',
          telop: '【WARNING: 攻撃者から対策室へ暗号化チャット着信】',
        },
        {
          speaker: 'kei',
          text: 'メッセージの内容は何だ、レン！？',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '『無様な抵抗だ。数ヶ月前、俺が貴様らの脆弱性通報窓口に何十回この設計欠陥を報告してやったか覚えているか？ テンプレ返信ひとつ寄越さず、俺の報告をゴミ箱へ捨てて無視（ゴースト）したな』……！？',
          sfx: 'impact',
          effect: 'shake',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'さらに続きがあるぞ！ 『正規の窓口でバグバウンティ（脆弱性報奨金）すら払わず黙殺した代償は高くつく。第2報を出してユーザーにパスワード変更を呼びかけたところで、貴様らの無力さを全国に晒してやる』……だと！？',
          sfx: 'alert',
        },
        {
          speaker: 'kei',
          text: '脆弱性通報窓口に何十回も報告して無視された……！？ まさか犯人は、過去に報奨金（バグバウンティ）目当てで会社の窓口へ連絡していた発見者なのか！？ しかもパスワード変更が無駄だと言い切っている……一体何が起きようとしているんだ！？',
        },
      ],
    },
    {
      id: 2,
      number: 'CHAPTER 2',
      date: '10月22日 19:30',
      title: 'パスワード変更の死角と『Hacking Team』の分断工作',
      subtitle: 'FT4永続ソケットと中国語KPS偽旗工作',
      requiredEvidence: 'persistent_session_trap',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月22日昼の第2報発表から数時間が経過した同日夜19時30分。ユーザーによるパスワード変更が進み、「これで口座破壊は食い止められるはずだ」と対策室が祈るような思いで監視を続けていた矢先だった。',
          bgm: 'investigate',
          telop: '【10.22 19:30 第2報発表後の夜・監視体制】',
        },
        {
          speaker: 'narrator',
          text: 'SNSは前日を遥かに超える地獄絵図と化していた。「昨日の第1報では『悪用は確認されていない』と言い切ったくせに、今日の第2報で後出し発表か！」「しかも公式の指示通りパスワードを変えたのに、今夜も勝手に取引されて口座が全滅した！」「不都合な事実を小出しにして隠蔽するな！」',
          bgm: 'crisis',
          sfx: 'impact',
          effect: 'shake',
          telop: '【CRITICAL: 後出し発表への批判＆PW変更済み口座での被害再発】',
          cutSequence: {
            id: 'seq_ch2_socket_trap',
            title: '永続TCPソケット・認証バイパスシークエンス',
            description: 'Webパスワード変更後も既存ソケットが維持され注文が素通りする連続カット',
            intervalMs: 1800,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch2_cut1.jpg',
                sfx: 'click',
                visualType: 'socket-step1',
                caption:
                  '【STEP 1】ユーザーがWebポータル画面からパスワード変更を実行（DB更新完了）',
                visualDesc: 'WEB PORTAL: Password Updated [OK] -> Auth DB Synced',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch2_cut2.jpg',
                sfx: 'alert',
                visualType: 'socket-step2',
                caption:
                  '【STEP 2】しかしFT4サーバーと攻撃者間の既存TCPソケット（Port 443）は切断されず維持！',
                visualDesc: 'TCP SOCKET (Port 443): ESTABLISHED [NO SESSION KILL]',
              },
              {
                frame: 3,
                image: 'assets/sequences/ch2_cut3.jpg',
                sfx: 'glitch',
                visualType: 'socket-step3',
                caption:
                  '【STEP 3】攻撃者が繋ぎっぱなしの既存ソケットからDEMOFASTLOSS注文が素通り！',
                visualDesc: 'BYPASS AUTH >> ORDER: DEMOFASTLOSS EXECUTED!',
              },
            ],
          },
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'くそっ……！ 21日午前4時に全26,739台のVPSを完全停止させているんだぞ！？ 死んだはずのVPSから、なぜ外部の取引所に注文が通るんだ……！？ 電源を落とした2万6千台の亡霊（ゴースト）が勝手に取引しているとでもいうのか！？',
          sfx: 'alert',
        },
      ],
      choiceSteps: [
        {
          id: 'ch2_step1_socket',
          type: 'forensic',
          badge: '⚡ FORENSIC DEDUCTION / 技術的死角の特定',
          hintSummary:
            'スマホからパスワードを変えた人も被害に遭っています。Web画面のパスワードを変えても、「すでに繋がっている自動売買ソフトの通信パイプ」はどうなっているでしょうか？',
          question:
            '【技術的死角の特定】ユーザーが指示通りパスワードを変更したにもかかわらず、なぜ攻撃者は不正注文を通せたのか？',
          cutinText: 'FT4永続ソケット仕様を看破！ 認証の盲点を立証！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          options: [
            {
              id: 'opt2_socket_dbdelay',
              label: 'パスワード変更APIのデータベース同期遅延・レプリケーション障害を疑う',
              description:
                'DB反映にタイムラグがあり、古いパスワードが一時的に通用していたという仮説。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'DB同期遅延はわずか5ミリ秒。全パスワードは即座に更新されている！ 認証そのものの通信仕様を疑え！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'データベースのレプリケーション遅延で、新パスワードの反映が遅れているんじゃないか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '各クラスタのDB同期遅延を検証しました……遅延はわずか5ミリ秒以下です！ パスワードは全サーバーで即時更新されています！ 原因はDB遅延ではありません！',
                },
              ],
            },
            {
              id: 'opt2_socket_keylogger',
              label:
                '被害者の自宅PCがキーロガー（マルウェア）に感染し、変更後の新パスワードが窃取されている',
              description: 'クライアントPC側のマルウェア感染による認証情報の再漏洩を疑う。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'スマホからパスワード変更しただけの口座でも不正取引が発生しており、自宅PCからマルウェアは一切検出されていない！ プロトコル側の仕様を疑え！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '被害者の自宅PCにキーロガーが潜んでいて、変更後の新パスワードが再窃取されたのではないか？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'いや、スマホの4G回線からパスワード変更しただけの口座でも同様に不正注文が通っている！ それにセキュリティベンダーの調査でも、被害者のPCからキーロガーなどのマルウェアは一切検出されていないんだ！',
                },
              ],
            },
            {
              id: 'opt2_socket_tcp',
              label:
                'Webのパスワードを変えても、自動売買ソフトの「繋ぎっぱなしの通信回線（TCPソケット）」が切れていない仕様を疑う',
              description:
                '玄関の鍵（Webパスワード）を替えても、すでに家の中に居座っている泥棒（確立済み通信）を追い出さない限り注文が通ってしまう盲点。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: 'アリア、FT4/FT5の通信仕様書と既存ソケットのハンドシェイク状態を調べろ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '判明しました！ FT4/FT5はWeb上でパスワードを変更しても、既に確立されたTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り、既存セッションから自動売買コマンドを受け付け続けます！',
                },
                {
                  speaker: 'kei',
                  text: 'やっぱりだ！ VPS自体は停止していても、攻撃者はシャットダウン前に窃取した認証情報を使い、外部サーバーから各ブローカーのFT4取引サーバーへ直接TCPソケットを繋ぎっぱなしにしていたんだ！ 玄関の鍵（Webパスワード）を替えても、すでに居座っている『幽霊ソケット（Ghost Protocol）』を取引所側で強制切断（Session Kill）しない限り、死んだはずの口座から注文が通り続けていたんだ！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'takamiya',
              emotion: 'serious',
              sprite: 'takamiya',
              text: '全ブローカーに要請し、全セッション強制パージ（Session Kill）を発令した！ これで不正注文は完全に止まったぞ！',
            },
            {
              speaker: 'narrator',
              text: 'だがその直後、対策本部のモニターに緊急メールが着弾した。送信者はロシア系ハッカー集団を名乗る『Hacking Team (Dmitry Orlov)』。',
            },
            {
              speaker: 'aria',
              sprite: 'aria',
              text: 'メールの文面をモニターに投影します。『親愛なる被害者の皆様。貴方の損失は企業側の隠蔽と脆弱性のせいです。当社を相手取った集団訴訟を起こすなら、企業が隠蔽している証拠リストを無償で提供します』……完璧な分断工作です！',
            },
            {
              speaker: 'takamiya',
              emotion: 'panic',
              sprite: 'takamiya',
              text: 'くそっ……！ 被害の45%は金融庁無登録の海外FX業者（ApexTrading、IS8FX等）だ。被害者の怒りが会社へ集中し、集団訴訟の呼びかけがSNSで大拡散されている！ どうやってこの信用を突き崩すんだ！？',
            },
          ],
        },
        {
          id: 'ch2_step2_false_flag',
          type: 'forensic',
          badge: '⚡ FORENSIC DEDUCTION / 偽旗工作の看破',
          hintSummary:
            '犯人はロシア人「Dmitry」を名乗っていますが、添付されたExcelファイルの設計図（一番下の行）に、作られたソフトの言語設定が残っています！',
          question:
            '【偽旗工作の看破】ロシア人『Dmitry Orlov』を名乗る集団訴訟煽動メールの信用を突き崩す、ファイル内部の決定的な矛盾はどこか？',
          cutinText: '偽旗工作を完全論破！ 中国語KPS痕跡を特定！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          isFinalStep: true,
          logBox: {
            title: 'FORENSIC DUMP: LAWSUIT_EVIDENCE.XLSX (UNZIPPED XML)',
            content:
              'Sender: Dmitry Orlov <dmitry@hacking-team-ru.org>\nSMTP Relay: 185.220.101.44 (Tor Exit Node)\nFile Format: OpenXML Spreadsheet (.xlsx)\ndocProps/core.xml: <dc:creator>Dmitry_RU</dc:creator>\nxl/workbook.xml: <sheet name="工作表1" />  ※シートの初期名称',
          },
          options: [
            {
              id: 'opt2_ff_sender',
              label: '送信元メールアドレスとメタデータ作成者名（Dmitry_RU）の整合性',
              description: '自称ロシア人ハッカーのプロファイルと文面の一致を確認するアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '表層の送信者情報はいくらでも偽装可能だ！ 攻撃者の偽装に踊らされ、時間を浪費してしまった！ XMLの深層データを検証せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '送信元アドレスやXML作成者名がロシア人名義になっている点から、ロシア系組織と断定してはどうか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'だめですマスター！ 表層のメタデータは攻撃者がいくらでも偽装できます！ 表層の看板に惑わされてはいけません！',
                },
              ],
            },
            {
              id: 'opt2_ff_relay',
              label: 'Tor出口ノード（185.220.101.44）を経由したSMTPリレーIPアドレスの追跡',
              description:
                '送信元IPの地理位置を特定し、ロシア国内の通信網であるか検証するアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'Tor出口ノードのIPを追っても発信源は特定できない！ 敵の偽装工作のボロが出ているファイル内部の記述を見抜け！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'SMTPリレーIPの185.220.101.44を調査し、サーバーの物理位置から発信源を特定できないか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'このIPは公開されているTor出口ノードです！ 匿名化ネットワークを経由しているため、IPアドレスから発信国を特定することは不可能です！',
                },
              ],
            },
            {
              id: 'opt2_ff_worksheet',
              label: 'Excel内部に記録された初期シート名「工作表1」（中国語ソフトの痕跡）',
              description:
                'ロシア語版なら「Лист1」、日本語版なら「Sheet1」になるはずの箇所に、中国語版ソフト特有の「工作表1」が残っている矛盾を突く。',
              isCorrect: true,
              rewardEvidence: 'persistent_session_trap',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'アリア、内部XMLの xl/workbook.xml を見ろ！ シート名定義タグが「工作表1」になっているぞ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'ビンゴですマスター！ ロシア語版Officeなら「Лист1」、英語版なら「Sheet1」のはずです。「工作表」は中国語簡体字版KPS Office特有の自動付与シート名です！',
                },
                {
                  speaker: 'kei',
                  text: 'ロシア人を騙りながら、ファイル生成環境は中国語圏のオフィスソフト……多国籍の偽旗工作（False Flag）だ！',
                },
                {
                  speaker: 'kei',
                  text: 'しかも昨日のチャットの「窓口に何十回も報告したのに無視された」という個人的な怨嗟と、この『工作表1』を合わせると、敵の正体が見えてくるぞ。脆弱性を見つけて窓口に無視された『発見者（バグハンター）』が逆恨みし、2万6千台の同時攻撃と巨額のマネーロンダリングを実行するために、中国語圏のダークウェブ恐喝シンジケートに脆弱性を持ち込んで手を組んだんだ！',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'kei',
          text: 'レン、偽旗工作の決定打が掴めた。集団訴訟を煽るExcelの正体は中国語版オフィスの『工作表』だ。直ちにこの物証を公表し、敵の分断工作を無力化しろ！',
          bgm: 'truth',
        },
        {
          speaker: 'takamiya',
          emotion: 'smile',
          sprite: 'takamiya',
          text: '了解だ！ 偽旗工作の解析結果を公式リリースした。敵の煽動に乗せられていた被害者たちも冷静さを取り戻し、集団訴訟パニックは一気に沈静化したぞ！',
          sfx: 'correct',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/persistent_session.png',
          text: '核心鑑識データ『取引通信ソケット監査票＆脅迫添付Excel』を取得しました。永続ソケットと偽旗工作の真相が立証されました！',
          sfx: 'evidence',
          telop: '【FORENSIC PROOF: 永続ソケット死角＆KPS偽旗工作を立証】',
        },
        {
          speaker: 'narrator',
          text: 'その時、対策本部の巨大メインモニターが突如激しい砂嵐を走らせ、ある画面を映し出した。',
          bgm: 'silence',
          sfx: 'glitch',
          effect: 'glitch',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '……！？ な、なんだこれは……！？ 画面が勝手に切り替わった……？',
          bgm: 'crisis',
        },
        {
          speaker: 'kei',
          text: 'おい、待て……！ これはVPSの画面じゃないぞ！ ある被害者の【自宅PCのデスクトップ画面】だ……確定申告書、家族の写真、そしてChromeブラウザの個人情報フォルダーが……丸ごと映し出されている！？',
          sfx: 'impact',
          effect: 'alert-flash',
          telop: '【SHOCKING: モニターに被害者「自宅PC」の内部ファイルが露出】',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'な、なぜだ……！？ 被害者は自宅PCからVPSにリモート接続していただけのはずだ！ なぜクラウドの外にある【自宅PCの中身】が奪われているんだ……！？',
          effect: 'shake',
        },
        {
          speaker: 'kei',
          text: '侵入はクラウドにとどまっていなかった……！？ アリア、緊急鑑識を急げ！！',
        },
      ],
    },
    {
      id: 3,
      number: 'CHAPTER 3',
      date: '10月23日 15:00',
      title: 'クラウドから自宅PCへの逆流（\\\\tsclient\\C）',
      subtitle: 'リバースRDPの恐怖とカナリアの潜伏',
      requiredEvidence: 'reverse_rdp_tsclient',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月23日午後。事態はインフラの停止を超え、個人のプライバシー空間への全面侵食という戦慄のフェーズへ突入した。',
          bgm: 'crisis',
          telop: '【10.23 15:00 自宅PC侵食フェーズ突入】',
        },
        {
          speaker: 'narrator',
          text: '攻撃者から対策室とメディア宛てに『samples.zip』というアーカイブが送りつけられた。中身は被害者たちの「自宅PC」のデスクトップにあった確定申告書、家族写真、そしてChromeブラウザの暗号化パスワード保管ファイル『Login Data』。実に4,352ファイルが抜き取られ、10,891ファイルがリスト化されていた。',
          sfx: 'alert',
          effect: 'alert-flash',
          telop: '【WARNING: 被害者自宅PCから4,352ファイル流出確認】',
          cutSequence: {
            id: 'seq_ch3_reverse_rdp',
            title: 'リバースRDP（\\\\tsclient\\\\C）自動マウントシークエンス',
            description: '自宅PCからVPSに接続した瞬間、Cドライブが全自動共有される連続カット',
            intervalMs: 1600,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch3_cut1.jpg',
                sfx: 'click',
                caption: '自宅PCからリモートデスクトップ接続開始 [drivestoredirect:s:*]',
                visualDesc: 'Windowsの接続ダイアログと全ドライブ共有フラグ',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch3_cut2.jpg',
                sfx: 'alert',
                caption:
                  'クラウドVPS内部に自宅PCのCドライブが \\\\tsclient\\\\C として自動マウント',
                visualDesc: 'VPS側のエクスプローラーにクライアントのCドライブが出現',
              },
              {
                frame: 3,
                image: 'assets/sequences/ch3_cut3.jpg',
                sfx: 'glitch',
                caption: 'アンチウイルスを完全素通りして確定申告書とLogin Dataが自動吸出',
                visualDesc: '正規RDPパイプラインを悪用して4,352ファイルが吸い出されるアニメ',
              },
            ],
          },
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'ケイ、被害者の自宅PCからはマルウェアが一切検出されない。それなのに、なぜ自宅PCの確定申告書や家族写真、Login Dataが丸ごと抜き取られたのか皆目見当がつかない……！ 一体どんな手口で手元のPCへ侵入したんだ！？',
          bgm: 'investigate',
          sfx: 'impact',
        },
        {
          speaker: 'kei',
          text: '自宅PCからマルウェアが出ない……？ だとすれば、怪しいファイルを送り込んだのではなく、正規のリモートデスクトップ接続経路やデフォルトの構成設定そのものが悪用された可能性がある。配布されている接続設定ファイルを徹底的に洗うぞ！',
          sfx: 'cutin',
        },
      ],
      choiceSteps: [
        {
          id: 'ch3_step1_rdp_config',
          type: 'forensic',
          badge: '⚡ CONFIG AUDIT / 構成ファイル生鑑識',
          hintSummary:
            '自宅PCからサーバーへリモート接続する際の設定ファイルです。英語で「ドライブ（Cドライブ等）をすべて共有・転送する（redirect）」と書かれている行はどれでしょう？',
          question:
            '【構成ファイルの異常特定】マルウェアなしで自宅PCのCドライブを丸裸にした致命的な設定パラメータはどれか？',
          cutinText: 'リバースRDPの元凶を特定！ drivestoredirect:s:*！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          logBox: {
            title: 'NEODOTCOM_CONNECT.RDP [DEFAULT CONFIG SINCE 2019]',
            content:
              'screen mode id:i:2\nuse multimon:i:0\nadministrative session:i:1   （サーバー側の管理者画面モード）\ndrivestoredirect:s:*         （手元PCの全ドライブ[*]をサーバー側へ自動共有）\nredirectclipboard:i:1        （コピー＆ペーストの文字共有）\nprompt for credentials:i:1',
          },
          options: [
            {
              id: 'opt3_cfg_admin',
              label: 'administrative session:i:1',
              description: '接続先サーバーのセッション接続モードを指定する構成フラグ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'これはサーバー側のセッション種別指定であり、ローカルPCのファイル共有とは無関係だ！ ドライブ関連の設定を見極めろ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'administrative session:i:1 か？ 管理者セッションの強制フラグだが……',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'いいえマスター、これはVPSサーバー側のコンソール接続フラグです！ クライアント自宅PCのファイル共有とは無関係です！',
                },
              ],
            },
            {
              id: 'opt3_cfg_drives',
              label: 'drivestoredirect:s:* （手元のPCの全ドライブをサーバー側へ自動共有する設定）',
              description:
                'ローカル環境のリソース割り当て対象をワイルドカード（*）で指定する構成パラメータ。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: 'これだ……！ 『drivestoredirect:s:*』！ ローカルドライブの全自動リダイレクト共有設定！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'ビンゴです！ 自宅PCからVPSに接続した瞬間、VPS側から自宅PCの全ドライブが『\\\\tsclient\\C』として自動認識されていました！',
                },
                {
                  speaker: 'kei',
                  text: 'ウイルスを送り込んだんじゃない。Windows正規のリモート接続プロトコル（RDP: Remote Desktop Protocol）の自動共有設定を悪用し、アンチウイルスに影すら踏ませずCドライブへ逆流する『第2のゴースト・プロトコル（幽霊通信経路）』だ！ だからこそ痕跡ゼロで確定申告書やLogin Dataが吸い出されたんだ！',
                },
                {
                  speaker: 'takamiya',
                  emotion: 'panic',
                  sprite: 'takamiya',
                  text: '……っ！？ まさか、.rdp のドライブ共有設定か……！ ケイ、実は数ヶ月前、グループ傘下のセキュリティ専門会社に所属する社内ホワイトハッカー集団が、この設定と共通管理者アカウントの危険性を上層部に報告していたんだ！ だが「顧客に再設定させるな、自動売買の可用性（稼働継続）最優先だ」と先送りされていた……！',
                  sfx: 'impact',
                },
                {
                  speaker: 'takamiya',
                  emotion: 'panic',
                  sprite: 'takamiya',
                  text: 'それだけじゃない……！ 今、外部向けの『脆弱性通報窓口』の未処理アーカイブを検索したら、数ヶ月前から【38回】も同一の外部調査者から通報チケットが届いていた……！ 『共通管理者アカウントと .rdp の自動共有で2万6千台と自宅PCが丸ごと抜ける。バグバウンティ（報奨金）の対象として評価してほしい』と実証デモまで添えられていたのに、「対象外サービスにつき回答不要」のラベルが貼られて1通も返信せず放置されていたんだ……！',
                  sfx: 'alert',
                },
                {
                  speaker: 'kei',
                  text: '38回も窓口をノックしていたのか……！ あいつは最初、犯罪者としてじゃなく『発見者』として正当な評価とバグバウンティ（報奨金）を求めていたんだ。だが何十回真剣なレポートを送っても、企業側に一顧だにされず『存在しないもの（ゴースト）』としてゴミ箱へ捨てられた……その絶望と屈辱が、あいつを本物の黒い亡霊（恐喝犯）に変えてしまったんだ！',
                },
                {
                  speaker: 'kei',
                  text: 'レン、社内ホワイトハッカーの警告も、外部からの38回の通報も握り潰していたとなれば、これは経営判断と窓口の機能不全が招いた『100%の人災』だぞ！ 世間に知られれば猛批判は免れないが、隠せばさらに罪を重ねる。直ちにこの手口を公表し、全ユーザーに共有解除を呼びかけるぞ！',
                },
              ],
            },
            {
              id: 'opt3_cfg_clipboard',
              label: 'redirectclipboard:i:1',
              description:
                'ローカル環境とリモート環境間のデータ転送バッファを有効化する構成フラグ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'これはクリップボード（コピー＆ペースト）の共有フラグだ！ 4,352件のファイル大量流出の直接原因ではない！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'redirectclipboard:i:1 だろうか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'これはテキストや画像の一時コピー用フラグです！ 4,352件におよぶディレクトリ全体の自動探索・コピーの元凶ではありません！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'kei',
              text: '全本番VPSを停止させている今、攻撃者のリバースRDP手口を実証しておびき寄せるため、隔離サンドボックスに1台だけおとりVPSとハニーポット自宅PCを稼働させておいたんだが……唯一生きているサーバーを見つけた敵が、早速食いついてきたぞ！',
            },
            {
              speaker: 'aria',
              sprite: 'aria',
              text: 'マスターの読み通りです！ 今まさに攻撃者が、調査用ハニーポット端末のCドライブから『Login Data』をコピーしようとしています！',
            },
            {
              speaker: 'takamiya',
              emotion: 'panic',
              sprite: 'takamiya',
              text: 'な、なんだって！？ 転送完了まで残り15秒……！ すぐに回線をブチ切らないと、ハニーポット端末まで完全に掌握されるぞ！！',
            },
          ],
        },
        {
          id: 'ch3_step2_canary_decision',
          type: 'tactic',
          badge: '⚡ COUNTER-SURVEILLANCE / 迎撃トラップの決断',
          hintSummary:
            'ただ回線を切るだけでは、犯人の居場所を突き止める手がかりが消えてしまいます。「盗まれたファイルが犯人のアジトで開かれた瞬間」を狙うトラップを仕掛けましょう！',
          question:
            '【電脳迎撃の決断】ハニーポット端末からファイルを吸い出そうとしている攻撃者に対し、どう決断するか？',
          cutinText: '逆探知トラップ発動！ カナリアトークンを敵地へ潜伏！',
          cutinSub: '⚡ ACTIVE HONEYPOT DIRECTIVE / 逆探知トラップ執行',
          isFinalStep: true,
          options: [
            {
              id: 'opt3_canary_abort',
              label: '直ちにRDPセッションを強制切断し、ファイルの流出を阻止する！',
              description: '防衛を最優先し、これ以上のファイル窃取を物理的にシャットアウトする。',
              isCorrect: false,
              damagePenalty: 5,
              retryPrompt:
                '流出は防いだが、敵のC2サーバーを追跡する唯一の手がかりを完全に失ってしまった……！ あえてファイルを盗ませ、逆探知の罠を仕込むべきだ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '直ちに回線を切断しろ！ ファイルの流出を何としても阻止するんだ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'セッションを強制切断しました……ファイルの流出は防ぎましたが、多段プロキシの奥に潜む敵の真のC2サーバーを追跡する手がかりを完全に失ってしまいました……！ マスター、ここはあえて罠を仕掛けるべきです！',
                },
              ],
            },
            {
              id: 'opt3_canary_deploy',
              label:
                '切断するな！ ダミーのLogin Dataに逆探知用カナリアトークンを混入させ、あえて敵に持ち帰らせる！',
              description:
                '自前の解凍環境で開いた瞬間に外部ビーコンを発火させる毒入りファイルを掴ませる。',
              isCorrect: true,
              rewardEvidence: 'reverse_rdp_tsclient',
              reaction: [
                {
                  speaker: 'kei',
                  text: '切断するな！ 敵が見えない『幽霊のプロトコル』で抜いていくなら、その逆流パイプラインにこちら側の亡霊——解凍した瞬間に発火する逆探知用カナリアトークンを混入させ、あえて敵の本拠地へ持ち帰らせるんだ！',
                  sfx: 'beacon',
                },
                {
                  speaker: 'aria',
                  emotion: 'alert',
                  sprite: 'aria',
                  illustration: 'assets/items/item_canary_usb.png',
                  text: 'カナリアトークン混入完了！ 攻撃者が自前の攻撃サーバーでこのファイルを解凍した瞬間、偽装プロキシの背後にある真のC2サーバー座標が逆探知されます！',
                  telop: '【CANARY DEPLOYED: 逆探知ビーコン潜伏完了】',
                },
                {
                  speaker: 'takamiya',
                  emotion: 'smile',
                  sprite: 'takamiya',
                  text: 'リスクを冒して敵を罠にハメ返したのか……！ 頼もしすぎるぞケイ！ これでリバースRDPの全容を公表し、ユーザーに手動共有解除を周知できる！',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/reverse_rdp.png',
          text: '核心鑑識データ『クライアント接続構成ファイル＆共有API証跡』を取得しました。リバースRDPの真相が立証されました！',
          bgm: 'truth',
          sfx: 'evidence',
          telop: '【FORENSIC PROOF: drivestoredirect:s:* リバースRDP解明】',
        },
        {
          speaker: 'narrator',
          text: 'リバースRDPの解明により、社内には勝利の空気が漂いかけた。しかし——その時、社内のすべてのプリンターと内線電話が一斉に狂ったように動き始めた！',
          bgm: 'silence',
          sfx: 'impact',
          effect: 'shake',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'ひっ……！？ プリンターから、犯行声明が一斉に印刷されている……！？ 全国の報道機関にもFAXが一斉送信されたぞ！',
          bgm: 'crisis',
          sfx: 'alert',
          effect: 'alert-flash',
          telop: '【ALERT: 社内全プリンターから四重脅迫状が一斉印刷】',
        },
        {
          speaker: 'kei',
          text: '紙を寄越せ、なんて書いてある！？',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '【四重脅迫状】だ……！ 当社の『脆弱性通報窓口』に38回送信した画面のスクリーンショットまで添えられている！ 『何十回警告しても無視してバグバウンティ（報奨金）をケチった貴様らに、被害者を語る資格はない』と……！',
          sfx: 'impact',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '要求は4つだ！ ①国内外70社超の金融口座の破壊再開、②自宅PC個人情報のダークウェブ無制限公開、③窓口黙殺の証拠と内部システム構成の暴露、④経営陣が隠蔽している暗号資産【5,000万ドル（約80億円）】の支払い要求……！ タイムリミットは明日10月24日12時！ 1秒でも遅れれば、すべてを実行すると……！！',
          sfx: 'alert',
        },
        {
          speaker: 'kei',
          text: '窓口に無視された恨みを大義名分にして、共犯のシンジケートと一緒に80億円を毟り取る気か……！ いよいよ奴らが本気でこの会社と顧客の人生を潰しにかかってきたぞ……！！',
        },
      ],
    },
    {
      id: 4,
      number: 'CHAPTER 4',
      date: '10月24日 11:50',
      title: '四重脅迫への反撃：実損100%直接補償というゲーム理論',
      subtitle: '攻撃者への支払ゼロと閲覧専用Investor Password',
      requiredEvidence: 'direct_compensation_matrix',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月24日午前。四重脅迫のタイムリミットまで、あと数十分。',
          bgm: 'crisis',
          telop: '【10.24 11:50 四重脅迫タイムリミット寸前】',
        },
        {
          speaker: 'narrator',
          text: '役員会議室からは、机を叩く怒号と悲痛な叫びが廊下にまで響き渡っていた。「身代金を払うべきだ！」「いや、払ってもデータが消える保証はない！」「約款には『サイバー攻撃による損害は免責』と明記されている！ 免責を盾に突っぱねるべきだ！」',
          sfx: 'impact',
          effect: 'shake',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'ケイ、実は犯人は10月21日の最初期に、社長室宛ての極秘メールで暗号資産【5,000万ドル（約80億円）】を要求していたんだ！ 経営陣は公表すらできず抱え込んでいたが、昨日の四重脅迫状で社内とマスコミに暴露されて役員会は完全にパニックだ！ 80億円なんて払えるはずもない！',
          sfx: 'alert',
          telop: '【SHOCKING: 極秘要求額5,000万ドル（約80億円）露呈】',
        },
        {
          speaker: 'kei',
          text: '経営陣が隠していた80億円の要求が露呈したのか……！ 払えば会社は破産、突っぱねれば集団訴訟で倒産。敵の武器は「顧客を人質にした分断工作」だ。経営陣を説得するぞ！',
          bgm: 'investigate',
        },
      ],
      choiceSteps: [
        {
          id: 'ch4_step1_policy_debate',
          type: 'tactic',
          badge: '⚡ BOARDROOM DEBATE / 役員会ディベート：基本方針',
          hintSummary:
            '犯人に身代金を払っても裏切られ、免責で顧客を突き放せば会社は潰れます。「犯人には1円も払わず、被害に遭った顧客の損害だけを全額救う」第3の道を選びましょう！',
          question:
            '【経営方針の決断】「身代金支払い」か「約款免責による突っぱね」かで紛糾する役員会に対し、どの第3の道をぶつけるか？',
          cutinText: 'ゲーム理論的反撃！ 身代金ゼロ・実損100%直接補償！',
          cutinSub: '⚡ BOARDROOM STRATEGY DIRECTIVE / 経営判断承認',
          options: [
            {
              id: 'opt4_pol_ransom',
              label:
                '身代金を支払い、これ以上の口座破壊と顧客情報のダークウェブ暴露の停止を懇願する',
              description:
                '犯罪組織の要求を飲み、目前の四重恐喝被害を一時的に回避しようとする選択。',
              isCorrect: false,
              damagePenalty: 15,
              retryPrompt:
                '犯罪集団に金を払えば格好のカモにされ、更なる恐喝を呼ぶだけだ！ データ消去の保証もない！ 別の反撃手段を提示せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '身代金を支払って事態の沈静化を図るべきでは……？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'ダメだ！ 国際的なサイバー犯罪統計を見ろ、一度金を払った標的の80%が二重恐喝を受けている！ 犯罪者に金を渡しても、データを消す保証なんてどこにもない！',
                },
              ],
            },
            {
              id: 'opt4_pol_disclaimer',
              label: '約款の免責条項を盾に、補償を拒否して法務防衛に徹する',
              description:
                '規約通りの法的免責を主張し、企業としての金銭的支出をゼロに抑え込む選択。',
              isCorrect: false,
              damagePenalty: 15,
              retryPrompt:
                '免責で逃げれば70社超の金融機関から信用を失い、インフラ企業として即死する！ 顧客と会社を救う道を提示せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '約款に明記された免責条項を盾に、法務防衛を貫くべきでは……？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '顧客を見捨てれば、70社超の国内外金融機関から即座にAPIを切断されてインフラ企業として即死するぞ！ 被害者の怒りを放置すれば集団訴訟で会社は倒産だ！',
                },
              ],
            },
            {
              id: 'opt4_pol_direct_comp',
              label: '攻撃者への支払ゼロを宣言し、その原資で顧客の不正取引実損を100%直接補償する',
              description:
                '約款免責を自ら破棄し、企業の腹を括って攻撃者の人質レバレッジを根底から粉砕する。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: '犯人の5,000万ドル（約80億円）など完全黙殺しろ！ 約款の免責条項を破り捨て、被害者の不正取引損失を企業が100%直接補償し、身代金支払ゼロを全世界に宣言するんだ！',
                },
                {
                  speaker: 'takamiya',
                  emotion: 'serious',
                  sprite: 'takamiya',
                  text: '実損の100%直接補償……！ さらに全員への見舞金5,000円と新基盤半年間無償移行をつける！ これなら顧客と企業が再び一枚岩になり、攻撃者の分断工作は完全に破綻する！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'ゲーム理論に基づく最適解です！ 攻撃者が持っていた『被害者を人質にして企業を脅す』というレバレッジが完全に消滅しました！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'narrator',
              text: 'だがその瞬間、財務役員と法務役員が机を叩いて立ち上がった！',
            },
            {
              speaker: 'takamiya',
              sprite: 'takamiya',
              text: '『100%補償だと！？ 被害の45%は金融庁無登録の海外FX業者（ApexTrading、IS8FX等）だぞ！ 顧客が通常のトレードの負けまで不正取引だと嘘をついて請求してきたらどう見分けるんだ！？ 会社が破産するぞ！』と猛反発されている！',
            },
            {
              speaker: 'kei',
              text: 'モラルハザードを防ぐ客観的鑑識手段……！ レン、諦めるな、取引端末の通信プロトコルには必ずそのための安全弁が備わっている！',
            },
          ],
        },
        {
          id: 'ch4_step2_investor_password',
          type: 'forensic',
          badge: '⚡ AUDIT SCHEME / 客観損害算定の切り札',
          hintSummary:
            'スクリーンショットは簡単に偽造でき、海外業者は照会に応じてくれません。自動売買ソフト（FT4）に標準搭載されている「履歴の閲覧だけができる専用パスワード」を使いましょう！',
          question:
            '【客観損害算定の切り札】無登録業者を含む虚偽請求を防ぎ、改ざん不能な実損額のみを1円単位で立証する技術的スキームとは？',
          cutinText: 'Investor Password監査成立！ 役員会を完全説得！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          isFinalStep: true,
          options: [
            {
              id: 'opt4_inv_broker_inquiry',
              label: '海外FX業者各社へ公式照会状を送り、取引履歴データの代理開示を要請する',
              description: 'ブローカーの協力を仰ぎ、公式の売買明細を取り寄せるアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '金融庁無登録業者が日本企業や警察の要請に応じるはずがなく時間切れになる！ 顧客側から客観取得できる手段を選べ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '海外ブローカー各社に照会状を送り、公式ログを提供してもらっては？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '相手は無登録業者だぞ！ 日本の民間企業の照会に応じる法的義務などなく、返答を待つ間にタイムリミットが過ぎてしまう！',
                },
              ],
            },
            {
              id: 'opt4_inv_user_screenshot',
              label: '顧客から取引履歴画面のスクリーンショットおよび画面収録動画を提出させる',
              description: '画面キャプチャを一次証拠として損害額を算出するアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'ブラウザ検証ツール（F12）によるHTML改ざんで簡単に偽造できてしまう！ 改ざん不能な暗号化認証を選べ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '顧客から取引画面のスクリーンショットや録画動画を提出してもらおう！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '危険ですマスター！ ブラウザの開発者ツール（F12）でHTML数値を書き換える画像・動画の偽造を防げません！ 監査証拠として脆弱すぎます！',
                },
              ],
            },
            {
              id: 'opt4_inv_read_only',
              label:
                '自動売買ソフトの「閲覧専用パスワード（Investor Password）」を顧客から提出してもらい、サーバー侵入時刻の記録と照合する',
              description:
                'お金を動かす権限はないが、改ざん不可能な「取引所の公式な売買履歴」だけを直接読み取れる監査用パスワードを活用する。',
              isCorrect: true,
              rewardEvidence: 'direct_compensation_matrix',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'これだ！ FT4/FT5に標準搭載されている『閲覧専用パスワード（Investor Password）』を提供してもらおう！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  illustration: 'assets/items/item_investor_key.png',
                  text: '素晴らしい着眼点です！ Investor Passwordなら出金権限なしでサーバー側のミリ秒取引生ログのみを客観監査できます！ VPSの侵入時刻と突合すれば、1円の狂いもなく不正取引だけを特定可能です！',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '技術的裏付けが完全に取れた！ これなら取締役会も100%納得する！ 直ちに第4報として全世界へ公式発表するぞ！！',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'takamiya',
          emotion: 'serious',
          sprite: 'takamiya',
          text: '11時50分、第4報リリース完了！ 『攻撃者への支払ゼロ、不正取引実損の100%直接補償、全員への一律5,000円のお見舞金、新基盤半年無償移行』を発表した！ だが……同時にグループのオーナー代表が個人ブログとSNSで「実は社内ホワイトハッカーから事前に指摘されていたが可用性を優先して遅れた」「これはAIによるサイバー飽和攻撃であり政府に能動的サイバー防御を要請した」と発信してしまい、ネットが大炎上している……！',
          bgm: 'truth',
          sfx: 'alert',
          telop: '【第4報発表: 100%直接補償断行＆代表ブログ発信でSNS賛否大炎上】',
        },
        {
          speaker: 'kei',
          text: 'SNSのタイムラインを見てみろ。『ホワイトハッカーの事前警告を無視した完全な人災を、AI飽和攻撃や国家防衛の問題にすり替えるな！』『5,000円のお見舞金や補償で殴って、肝心の技術的侵入原因（Root Cause）の説明から逃げる気か！』とエンジニアやユーザーから猛批判が噴出している。当然の批判だ、企業の過失は補償金だけでは消えない。',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/compensation_matrix.png',
          text: 'ですがマスター、世論の厳しい批判を浴びつつも、ゲーム理論上の効果は劇的です！ 被害者が求めた実損補償を企業が100%引き受けたことで、攻撃者が握っていた『顧客の損失を人質にして企業を脅す』という交渉カードは完全に消滅しました！ 核心鑑識データ『顧客実損算定マトリクス＆API照会監査票』を取得しました！',
          sfx: 'evidence',
        },
        {
          speaker: 'narrator',
          text: 'その刹那、対策本部のメインモニターが激しく点滅し、攻撃者からの新たな緊急メッセージが突き刺さった。',
          sfx: 'glitch',
          effect: 'glitch',
        },
        {
          speaker: 'takamiya',
          emotion: 'smile',
          sprite: 'takamiya',
          text: 'ケイ、信じられない事態が起きた！ 5,000万ドルの要求を完全黙殺され、顧客への直接補償で人質を奪われた攻撃者が……パニックを起こして自ら要求額を【100万ドル（約1.6億円）】へと98%もダンピング（値下げ）してきたぞ！！',
          sfx: 'alert',
          telop: '【PRICE COLLAPSE: 要求額5,000万ドル→100万ドルへ98%値下げ】',
          cutSequence: {
            id: 'seq_ch4_ransom_collapse',
            title: '第4報・SNS賛否大炎上と身代金98%価格崩壊シークエンス',
            description:
              '代表ブログ釈明への批判炎上と、100%直接補償による犯人の98%値下げの連続カット',
            intervalMs: 1600,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch4_cut1.jpg',
                sfx: 'alert',
                caption:
                  '【第4報＆代表ブログ炎上】100%補償発表の一方、「事前警告軽視・AI攻撃すり替え」に批判殺到',
                visualDesc:
                  '補償発表速報と「人災をAIのせいにするな」「原因公表が先だ」と炎上するSNS',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch4_cut2.jpg',
                sfx: 'victory',
                caption:
                  '【レバレッジ消滅】実損100%補償により、犯人が握っていた金融口座の人質価値が消滅',
                visualDesc: '崩れ落ちる犯人の恐喝レバレッジ概念図',
              },
              {
                frame: 3,
                image: 'assets/sequences/ch4_cut3.jpg',
                sfx: 'glitch',
                caption:
                  '【5,000万ドル→100万ドル】焦った犯人が要求額を98%大幅値下げし27日正午へ再設定',
                visualDesc: '犯行サイト上の要求額が80億円から1.6億円へ書き換わる様子',
              },
            ],
          },
        },
        {
          speaker: 'kei',
          text: '80億円から1.6億円への価格崩壊……！ 完全に奴らの交渉レバレッジが崩壊した証拠だ！ ゲーム理論の完全勝利だな。',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'だがケイ、値下げ要求のメッセージに犯人の激しい怨念が綴られている……！ 『ふざけるな！ 顧客に何十億円も直接補償する金があるなら、なぜ最初から俺の38回の脆弱性報告に報奨金（バグバウンティ）を払わなかった！？』',
          sfx: 'alert',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: '『俺が何晩も徹夜して見つけた26,739台の致命的欠陥だ！ 5,000万ドルとは言わない、俺が発見者として正当に受け取るはずだったバグバウンティ【100万ドル（約1.6億円）】だけでいい！ 10月27日正午までに俺の評価額である100万ドルを払わなければ、シャットダウン直前にリバースRDP経由で全26,739台の自宅PCへ潜伏させた【時限発火型ランサムウェア】を一斉起爆し、全国のPCを文房具に変えてやる』……！！',
          bgm: 'crisis',
          sfx: 'impact',
          effect: 'alert-flash',
          telop: '【FINAL DEADLINE: 10月27日正午 26,739台PC破壊予告】',
        },
        {
          speaker: 'kei',
          text: '『俺が正当に受け取るはずだった報奨金100万ドル』か……。あいつが本当に欲しかったのは80億円の大金じゃない。自分の技術と発見を正当に評価し、相応のバグバウンティを払ってくれるはずだった企業からの『承認』だったんだな。',
        },
        {
          speaker: 'kei',
          text: 'だが、だからといって無関係な26,739人の顧客の財産と日常を人質に取った瞬間、そいつはもう技術者じゃない。ただの卑劣な恐喝犯だ！ 正規RDP経由ならマルウェアが潜伏している恐れもゼロじゃない。全国へ社員を飛ばして顧客PCを物理回収し、潜伏の真偽を徹夜で鑑識するぞ！',
        },
      ],
    },
    {
      id: 5,
      number: 'CHAPTER 5',
      date: '10月27日 11:50〜19:10',
      title: '能動的サイバー防御「発動第1号」と100万ドル逆転懸賞金',
      subtitle: '運命の正午・カナリア逆探知と「囚人のジレンマ」包囲網',
      requiredEvidence: 'canary_c2_origin',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月27日、火曜日、午前11時50分。攻撃者が突きつけてきた100万ドルの支払期限——10月27日正午まで、残された時間はわずか10分。',
          bgm: 'crisis',
          telop: '【10.27 11:50 支払期限まで残り10分】',
        },
        {
          speaker: 'narrator',
          text: 'GNOグループの社員は全国各地を飛び回って顧客の自宅PCを物理回収し、ホワイトハッカーチームが徹夜でバイナリ解析を続けていた。',
        },
        {
          speaker: 'takamiya',
          emotion: 'serious',
          sprite: 'takamiya',
          text: 'ケイ、全国から物理回収した顧客PCの鑑識結果が出た……！ 潜伏ランサムウェアは【検出ゼロ】だ！ 犯人が言っていた「シャットダウン前に時限マルウェアを送り込んだ」というのは、パニックを煽るための完全なブラフ（ハッタリ）だったんだ！！',
          sfx: 'evidence',
          bgm: 'investigate',
        },
        {
          speaker: 'kei',
          text: 'やっぱりそうか！ 敵は身代金値下げの焦りから、存在しないランサムウェアで脅しをかけていたに過ぎない！ タカミヤ、直ちにこの事実を公表しろ！',
        },
        {
          speaker: 'takamiya',
          emotion: 'smile',
          sprite: 'takamiya',
          text: '了解だ！ 午前9時58分の第8報で「12時前に念のためPCの電源コードを抜くよう」呼びかけていたが、今11時59分の【第9報】で「潜伏マルウェア検出ゼロ、万一被害が出ても新品PCを無償提供する」と電撃リリースした！ これで世間のパニックは完全に食い止めたぞ！',
          telop: '【第9報リリース: 潜伏マルウェア検出ゼロ＆新品PC無償保証】',
        },
        {
          speaker: 'narrator',
          text: 'その時、暗号化セキュア回線に突如、政府専用の最優先プロトコルが割り込んできた。国家サイバー統括室（NCO）のクロダ統括官とミオ分析官だ。',
          sfx: 'ring',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: 'ナギサ君、タカミヤ君。本題に入る前に一つ釘を刺しておく。貴社のオーナー代表が個人SNSで「AIによるサイバー飽和攻撃だ、政府に能動的サイバー防御を要請した」と発信し、世論から「自社のずさんな共通管理者設計と事前警告無視による人災を、国家防衛の問題にすり替えるな」と猛批判を浴びているな。',
        },
        {
          speaker: 'kuroda',
          emotion: 'sharp',
          sprite: 'kuroda',
          text: '勘違いするなよ。国家の盾は、一企業のガバナンス不全や設計過失を免罪するための道具ではない！ 我々が動くのは貴社のメンツを守るためではなく、今この瞬間に人質にされている26,739人の国民を守るためだ！',
          sfx: 'impact',
        },
        {
          speaker: 'mio',
          emotion: 'focused',
          sprite: 'mio',
          text: 'はい……！ 敵のランサム予告がブラフだったとしても、4,352件の実データは依然として敵の手にあります。2026年10月1日に施行された『能動的サイバー防御法（サイバー対処能力強化法）』を発動して敵の司令塔を無害化したいところですが……現行法には【制度上の3つの壁】が存在します。',
        },
        {
          speaker: 'narrator',
          text: 'その刹那——壁のデジタル時計が非情にも『12:00:00』を刻んだ！',
          bgm: 'silence',
          sfx: 'impact',
          effect: 'alert-flash',
          telop: '【2026.10.27 12:00 運命の正午到来】',
        },
        {
          speaker: 'narrator',
          text: '全国のPCに異変はなし！ ランサムウェアは1件も起動しなかった。しかし直後、攻撃者の犯行サイト『coronamng.store』が更新された！',
          bgm: 'crisis',
          sfx: 'glitch',
          effect: 'glitch',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'ひっ……！？ 犯人が逆上して、犯行サイトにデータをアップロードした！ 『身代金を払わなかった見せしめに【被害者 第1号】の実名・個人情報を公開する。明日正午には第2号、明後日は第3号と、毎日正午に1人ずつ全員の人生を晒し上げてやる』……！！',
          sfx: 'alert',
          telop: '【CRITICAL: 犯人サイトで「被害者 第1号」公開＆不可解な証言で混乱】',
        },
        {
          speaker: 'takamiya',
          emotion: 'panic',
          sprite: 'takamiya',
          text: 'しかも、さらに異常な混乱が起きている！ 晒された『被害者 第1号』の本人がメディアの緊急取材に「そんなFX用VPSサービスなど一度も使ったことがない！ 書かれている内容もデタラメだ！」と証言したんだ！ それなのにうちの代表が個人ブログでその人物の情報に言及したせいで、「なぜ未利用者の情報が混ざっているんだ！？ 別サービスからの漏洩を隠しているんじゃないか！？」とSNSが大パニックになっているぞ！',
          effect: 'shake',
        },
        {
          speaker: 'narrator',
          text: 'だが——まさにその瞬間だった！！',
          sfx: 'impact',
          cutSequence: {
            id: 'seq_ch5_canary_strike',
            title: '運命の正午・「第1号」ツギハギ加工と逆探知カナリア発火シークエンス',
            description:
              '12:00の第1号公開に伴う敵アジトでのデータ復号・加工と逆探知ビーコン発火の連続カット',
            intervalMs: 1500,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch5_cut1.jpg',
                sfx: 'alert',
                caption:
                  '【12:00:00】犯人が「被害者 第1号」を公開するも、本人が「未利用・デタラメ」と証言し大混乱',
                visualDesc:
                  '犯行サイト coronamng.store の公開画面と「一度も使っていない」と報じるメディア速報',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch5_cut2.jpg',
                sfx: 'glitch',
                caption:
                  '【復号フック作動】犯人が別名簿とダミーLogin Dataをツギハギ加工した瞬間に罠が作動',
                visualDesc: '攻撃者PC端末で実行されるデータ合成・SQLite復号プロセス画面',
              },
              {
                frame: 3,
                image: 'assets/sequences/ch5_cut3.jpg',
                sfx: 'beacon',
                caption: '【カナリア発火】Tor/SOCKS5多段プロキシをバイパスして逆探知ビーコンが飛翔',
                visualDesc: 'オランダ・ルーマニアの踏み台を突き破り放たれる追跡パケットの光',
              },
              {
                frame: 4,
                image: 'assets/sequences/ch5_cut4.jpg',
                sfx: 'impact',
                caption: '【真C2ロックオン】フランクフルト真C2【91.240.118.174】と保管庫を特定',
                visualDesc: '世界地図上のドイツデータセンターDC-4が赤くロックオンされるレーダー',
              },
            ],
          },
        },
        {
          speaker: 'aria',
          emotion: 'alert',
          sprite: 'aria',
          text: 'マスター！！ 謎が解けました！ 攻撃者は脅迫のハッタリを効かせるため、古い別名簿の断片と私たちがハニーポットから掴ませたダミーデータをツギハギして、実在しない架空の被害者——いわば『幽霊（ゴースト）の第1号』を捏造していました！ そして自前のアジトでダミーLogin Dataを復号・加工した瞬間、仕込んでいた【逆探知用カナリアトークン】が発火し、DNS/HTTPコールバックが着弾しました！！',
          sfx: 'beacon',
        },
        {
          speaker: 'kei',
          text: 'ツギハギ工作の瞬間にカナリアが喰らいついたか！ だが代表が個人ブログで不用意に反応したせいで世論の不信は極限に達している。クロダ統括官、これ以上の混乱と明日正午の『第2号』公開を止めるため、今すぐ法理を突破して敵のサーバーを叩くぞ！',
        },
      ],
      choiceSteps: [
        {
          id: 'ch5_step1_legal_walls',
          type: 'tactic',
          badge: '⚡ LEGAL DEFENSE / 国家サイバー対処法理の構築',
          hintSummary:
            '通常の令状発行には数日かかり、明日の被害者晒しに間に合いません。「企業自らがログを全面提供し、差し迫った危機に対する警察の緊急権限を発動させる」道を選びましょう！',
          question:
            '【法理の突破】被害者第1号が晒され、明日正午に第2号が予告された現在進行形の現行犯危害に対し、基幹インフラ15分野限定の壁および通信の秘密の壁をどう突破するか？',
          cutinText: '警職法6条の2と100%任意ログ提供！ 法の壁を突破！',
          cutinSub: '⚡ LEGAL AUTHORIZATION ESTABLISHED / 法理論拠承認',
          options: [
            {
              id: 'opt5_law_unauthorized_access',
              label: '不正アクセス禁止法の被害届を警察に提出し、司法判断に基づく通常捜査令状を待つ',
              description:
                '刑事訴訟法の原則に則り、裁判所の捜査令状発付を待ってから対処するアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '通常令状の発付には数日かかる！ 明日正午の「被害者 第2号」公開に間に合わない！ 警察官職務執行法等の緊急職権法理を構築せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '不正アクセス禁止法で被害届を出し、裁判所の捜査令状を待つべきでは？',
                },
                {
                  speaker: 'kuroda',
                  sprite: 'kuroda',
                  text: '甘い！ 通常令状の発付には数日を要する！ 明日正午には「被害者 第2号」が晒され、毎日国民の尊厳が破壊されていくんだ！ そんな猶予はない！',
                },
              ],
            },
            {
              id: 'opt5_law_police_duties',
              label:
                '民間企業の100%任意ログ提供で通信の秘密をクリアし、現実に発生した第1号公開と第2号予告（重大危害）を根拠に警職法6条の2による職権認知を成立させる',
              description:
                '被害企業の完全合意で通信の秘密侵害を回避し、現行犯の重大危害を根拠に警察庁が職権介入。',
              isCorrect: true,
              rewardEvidence: 'nco_three_walls_report',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'クロダ統括官、企業側はすべての侵入ログと通信パケットを100%任意提出します！ これで通信の秘密侵害の懸念は完全にクリアされます！',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: 'さらに今正午に第1号の実名が晒され、明日正午に第2号が晒されるサラミ戦術は、個人の生活とプライバシーに対する明白かつ現在進行形の重大危害です！ 警察官職務執行法第6条の2に基づく職権認知要件を完全に満たしています！',
                },
                {
                  speaker: 'kuroda',
                  sprite: 'kuroda',
                  text: '……見事な法理論拠だ！ これで制度上の第1の壁（基幹インフラ外）と第2の壁（無同意通信取得）は完全に打ち破られた！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'kuroda',
              sprite: 'kuroda',
              text: 'だが最後に立ち塞がる第3の壁……外国主権と『真の発信源特定』だ！ 敵は多段プロキシの奥に隠れており、誤爆すれば外交上の重大問題になる！ 発火したカナリアのログから、真のC2を100%特定せよ！',
            },
            {
              speaker: 'kei',
              text: '了解だ！ アリア、発火したカナリアトークンの逆探知生テレメトリを直ちに展開しろ！',
            },
          ],
        },
        {
          id: 'ch5_step2_canary_beacon',
          type: 'forensic',
          badge: '⚡ BEACON TELEMETRY / 逆探知ビーコン解析',
          hintSummary:
            'A（オランダ）とB（ルーマニア）は犯人が足跡を隠すために経由した「中継地点（Relay / Bridge）」です。ダミーファイルが実際に開かれた「直接の実行元（Direct Source）」のIPを選びましょう！',
          question:
            '【真C2特定の立証】解凍されたダミーLogin Dataから発火した逆探知ログを解析し、多段プロキシの背後に潜む真の司令塔と晒しサイト保管庫をどこに特定するか？',
          cutinText: '逆探知成功！ 多段プロキシを突破し真C2を捕捉！',
          cutinSub: '⚡ CRITICAL TRACE ESTABLISHED / 真発信源特定',
          logBox: {
            title: 'BEACON TELEMETRY: CANARY TOKEN CALLBACK HIT',
            content:
              'Reverse Callback: [CRITICAL HIT]\n中継地点 A: 45.154.255.89 (オランダ) [Tor 匿名中継ノード]\n中継地点 B: 185.220.101.5 (ルーマニア) [SOCKS5 踏み台プロキシ]\n直接のファイル開封・実行元: 91.240.118.174 (ドイツ・フランクフルト DC-4)\n発動イベント: ダミーのLogin Dataが解凍・復号された瞬間に発信\nPayload Auth Token: 26739_LEAK_SITE_HOST',
          },
          options: [
            {
              id: 'opt5_c2_node_a',
              label: '45.154.255.89 (Amsterdam, NL) を真のC2として標的指定する',
              description: 'ビーコンログの最上段に記録されたアムステルダムの通信ノード。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'ログをよく見ろ！ それは [Tor Relay] と記載された単なる中継ノードだ！ 無関係な海外サーバーを攻撃すれば国際問題になる！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'オランダのアムステルダムにある 45.154.255.89 が攻撃拠点ではないか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: '違いますマスター！ ログの右端を見てください、[Tor Relay] つまり表層の匿名中継ノードです！ そこを叩いても無関係な海外拠点を巻き込むだけです！',
                },
              ],
            },
            {
              id: 'opt5_c2_node_b',
              label: '185.220.101.5 (Bucharest, RO) を真のC2として標的指定する',
              description: '以前の脅迫メールでも観測された185.220.101系のルーマニア通信ノード。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                'それは [SOCKS5 Bridge] と記された踏み台プロキシだ！ ダミーファイルが実際に復号・実行された Direct Source のIPを見抜け！',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'ルーマニアの 185.220.101.5 はどうだ？ 以前の脅迫メールでも使われていたIP帯だぞ！',
                },
                {
                  speaker: 'aria',
                  emotion: 'alert',
                  sprite: 'aria',
                  text: 'いいえマスター！ そこは [SOCKS5 Bridge] とある通り、2段目の踏み台プロキシです！ 実際にSQLite復号フックを発火させた実行元は別にあります！',
                },
              ],
            },
            {
              id: 'opt5_c2_direct',
              label: '91.240.118.174（ドイツ・フランクフルトの直接実行元サーバー）を標的指定する',
              description: 'ログ中段に記録されたフランクフルトのデータセンター拠点。',
              isCorrect: true,
              rewardEvidence: 'canary_c2_origin',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'アリア、SQLite復号フックを直接発火させたIP『91.240.118.174』を見ろ！ これが多段プロキシの裏にある真のC2サーバー、そして「被害者 第1号」を晒しているリークサイトの実体だ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'ビンゴですマスター！ オランダやルーマニアのプロキシを完全にバイパスし、攻撃者が自前でダミーLogin Dataを開いた真の実行元IPと、全盗難データ保管庫の物理サーバーを完全に捕捉しました！！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'narrator',
              text: '10月27日午後から夕刻にかけて、NCOと警察庁が国際連携によるテイクダウン準備を進める一方、企業側は第10報・第11報を発令し、犯行サイトへのアクセス警告と二次拡散者への法的措置を打ち出した。しかし——。',
              telop: '【10.27 15:00〜18:30 第10報・第11報発令と二次拡散の攻防】',
            },
            {
              speaker: 'takamiya',
              emotion: 'panic',
              sprite: 'takamiya',
              text: 'ケイ！ 真のC2は捕捉できたが、犯人がミラーサイトを次々と立ち上げ、SNSの拡散屋を使って晒しデータを広めようとしているぞ！ 第10報・第11報でサイトへのアクセス警告と拡散者への刑事告訴を出し、代表も個人SNSで特定の拡散アカウントを名指しで警告したが……ネットでは「公式窓口ではなく社長個人のSNSで一般人を威圧するな」「強気なパフォーマンスで犯人を挑発したせいで晒されたんじゃないか」と逆に大炎上している……！',
              sfx: 'alert',
            },
            {
              speaker: 'takamiya',
              emotion: 'serious',
              sprite: 'takamiya',
              text: 'さらに19時を回り、犯人はその炎上を見てあざ笑い、『毎日1人ずつ晒されたくなければ、値下げした100万米ドル（約1.5億円）を今すぐ払え』と執拗に脅迫を続けている！',
            },
            {
              speaker: 'kuroda',
              sprite: 'kuroda',
              text: 'トップ個人のSNS発信に依存した危機管理広報の危うさは後で厳しく総括してもらうとして……これよりNCOと警察庁でC2サーバーとミラーサイトのテイクダウン承認手続に入る。だが匿名化された多国籍の実行犯組織そのものを自壊させるには、民間側からの決定的な『劇薬』が必要だ！',
            },
            {
              speaker: 'kei',
              text: 'ああ。世論から「劇場型だ」と叩かれようとも、今ここで犯人の思い通りにさせれば26,739人の被害者が本当に傷つく。敵が要求してきた『100万米ドル』と、22日の集団訴訟煽動メールの鑑識で暴いた『中国語環境（工作表1）を使う多国籍の烏合の衆』という弱点を突き、奴らの組織を内部から引き裂く究極のカウンターを撃つぞ！',
            },
          ],
        },
        {
          id: 'ch5_step3_cyber_bounty',
          type: 'tactic',
          badge: '⚡ ULTIMATE COUNTER / 100万ドル逆転懸賞金と特別救済',
          hintSummary:
            '犯人には1円も払わず、晒された被害者には手厚い「特別お見舞金」を出して守りましょう。さらに犯人が要求した「100万米ドル」をそのまま「犯人を捕まえる懸賞金」として3言語で世界中の情報提供者に懸ければ、世論で賛否を浴びようとも敵組織は仲間割れを起こします！',
          question:
            '【最終反撃の決断】100万米ドルを要求し毎日1人ずつ個人情報を晒すと脅す多国籍犯行グループに対し、人質価値を消し去り敵組織を内部崩壊させる究極のカウンター施策はどれか？',
          cutinText: '逆転の100万ドル懸賞金！ 敵組織に囚人のジレンマ発動！',
          cutinSub: '⚡ CYBERCRIME BOUNTY DIRECTIVE / 100万ドル懸賞金創設',
          isFinalStep: true,
          options: [
            {
              id: 'opt5_bounty_pay',
              label:
                '値下げされた100万米ドル（約1.5億円）を秘密裏に支払い、公開データの削除を取引する',
              description:
                '80億円から98%値下がりしたため、手打ち金として支払って早期幕引きを図る。',
              isCorrect: false,
              damagePenalty: 15,
              retryPrompt:
                '犯罪者に1円でも払えば「脅せば払う企業」として世界中のハッカーの標的になり、データ消去の保証もない！ 要求額を逆手に取る反撃を選べ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '1.5億円まで下がったなら、秘密裏に支払ってデータを消してもらえないか？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '絶対にダメだ！ 犯罪組織に金を渡せば更なる攻撃の資金源になり、約束を守る保証などゼロだ！ 『要求には永久に応じない』のが我々の鉄則だぞ！',
                },
              ],
            },
            {
              id: 'opt5_bounty_silent',
              label:
                'NCOによるサーバー消去のみに頼り、企業側は被害者への追加補償や声明を出さず沈黙を守る',
              description:
                'これ以上の刺激を避け、政府機関の裏工作だけで静かに事態が収束するのを待つ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '政府の措置は非公表だ！ 企業側が晒し被害者の救済や拡散者への法的措置、犯人追及の姿勢を示さなければ、世論の不安と二次拡散は止まらない！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '企業側はこれ以上動かず、NCOの非公然措置だけで静かに収束するのを待とうか？',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'それではダメですマスター！ 政府の措置は公表されないため、企業側が晒し被害者の救済と犯人追及の強い意志を示さなければ、SNSでの二次拡散と不安を抑え込めません！',
                },
              ],
            },
            {
              id: 'opt5_bounty_strike',
              label:
                '晒し被害者へ「上限300万円の特別お見舞金」を支給し、犯人が要求した同額の「100万米ドル」を犯人検挙の『懸賞金（日・英・中3言語）』として全世界に懸ける！',
              description:
                '「脅迫者には永久に1円も払わないが、犯人を売った情報提供者には100万ドルを払う」と宣言し、多国籍犯の内部に裏切り（囚人のジレンマ）を誘発する。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: '犯人は『俺が正当に受け取るはずだった100万ドルのバグバウンティ（報奨金）を払え』と叫んでいたな。……いいだろう、望み通り【100万米ドルのバウンティ（報奨金）】を用意してやる！',
                  sfx: 'victory',
                },
                {
                  speaker: 'kei',
                  text: 'ただし、犯人には永久に1セントも払わない！ 情報が公開された被害者には別枠で1公開につき『上限300万円の特別お見舞金』を支給して守り抜き、奴が渇望した『100万米ドル（約1.5億円）』はそのまま、一線を越えた犯人自身を特定・検挙するための『サイバー犯罪撲滅・懸賞金（Cybercrime Bounty）』として世界中の情報提供者に懸ける！',
                },
                {
                  speaker: 'takamiya',
                  emotion: 'serious',
                  sprite: 'takamiya',
                  text: '19時10分、第12報として緊急リリース完了だ！ 基本情報1万円、金融・認証1.5万円、機微情報2.5万円を合算して最大300万円の特別お見舞金……！ だがケイ、SNSでは「個人のプライバシーに1万円や2万5千円と細かい値札をつけるのか」「技術的な侵入原因の報告書も出さずに1.5億円の懸賞金で劇場型ショーにするな」と厳しい批判も出ているぞ……！',
                },
                {
                  speaker: 'kei',
                  text: 'その批判は甘んじて受けろ、レン！ 企業としてのガバナンス不全や原因開示の遅れに対する批判は当然の報いだ。だが今この瞬間、発見者と多国籍シンジケートの急ごしらえの同盟を内部から引き裂き、明日正午の『第2号』公開を止めるには、この劇薬を撃つしかない！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  text: 'はい！ 孤独な復讐心で暴走している主犯（脆弱性の発見者）に対し、金目当てで手を組んだ中国語オフィス（工作表1）の多国籍シンジケートには義理も忠誠もありません！ 【日本語・英語・中国語の3言語】で『主犯を売れば1.5億円が手に入り、黙っていれば仲間に売られて逮捕される』と突きつければ、究極の【囚人のジレンマ】で敵組織は必ず自壊します！',
                  telop:
                    '【10.27 19:10 第12報発表: 特別お見舞金上限300万円＆懸賞金100万米ドル創設】',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/c2_origin.png',
          text: '核心鑑識データ『ハニーポット端末・外部通信ビーコン記録』を取得しました！ 全6つの鑑識が手元に揃いました！',
          bgm: 'truth',
          sfx: 'evidence',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: '見事だナギサ君、タカミヤ君！ 民間側の『上限300万円の特別お見舞金』と『100万米ドルの逆転懸賞金』、そして国家側の『3つの壁を突破する全物証』が完璧に揃った！',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: '外務大臣協議およびサイバー通信情報監理委員会に対する【完全無欠の証拠連結（FINAL DEDUCTION）】を直ちに構築し、無害化措置の承認を勝ち取るぞ！',
        },
        {
          speaker: 'kei',
          text: '了解だ！ 集めた全鑑識カードを手元に展開しろ、アリア！ 最後のパズルを完成させる！',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          text: '了解しましたマスター！ 【FINAL DEDUCTION: 最終証拠連結システム】を展開します！',
        },
      ],
      finalDeduction: {
        steps: [
          {
            stepNumber: 1,
            title: 'STEP 1: 制度上の壁の突破',
            question:
              '【法的根拠の立証】民間直接申請がなく基幹インフラ15分野に縛られる壁を突破し、正午に発生した「第1号」公開と明日の「第2号」予告に対し国家機関が職権介入するための法理論拠を示す証拠を提示せよ！',
            correctEvidenceId: 'nco_three_walls_report',
            hint: '行政や警察が職権で動くための法律要件と、民間任意ログ提供を整理した鑑識レポートがあるはずだ！',
            reaction: [
              {
                speaker: 'kei',
                text: 'これを見てください、統括官！ 『国家サイバー対処法理・要件適合性審査レポート』です！',
              },
              {
                speaker: 'kei',
                text: '被害企業の100%任意ログ提供により通信の秘密侵害を回避し、正午に発生した実名晒しと毎日1人ずつのサラミ予告という明白な重大危害を根拠に、警職法6条の2による職権認知を成立させます！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                text: '見事だ……！ 法の壁は完全に打ち破られた！ だが次は侵入経路の物理的遮断だ！',
              },
            ],
          },
          {
            stepNumber: 2,
            title: 'STEP 2: 侵入経路の物理的遮断',
            question:
              '【物理的侵害ルートの立証】なぜ攻撃者はマルウェアなしで被害者の自宅PCから4,352ファイルを吸い出し、「第1号」を晒すことができたのか？ 物理的接続設定の証拠を提示せよ！',
            correctEvidenceId: 'reverse_rdp_tsclient',
            hint: '被害者の自宅PCからファイルが奪われ、個人情報が晒される元凶となった物理的接続設定の証拠を探せ！',
            reaction: [
              {
                speaker: 'kei',
                text: '接続構成に潜んでいた『クライアント接続構成ファイル＆共有API証跡』です！',
              },
              {
                speaker: 'kei',
                text: 'drivestoredirect:s:* の記述により、ユーザーがVPSに接続した瞬間、VPS側から自宅PCのCドライブが全自動共有されていた！ 敵はこのリバースRDPのパイプラインを使って個人情報を吸い出しました！',
              },
              {
                speaker: 'mio',
                emotion: 'focused',
                sprite: 'mio',
                text: '接続パイプラインの構造を完全に特定！ 各プロバイダへ緊急パッチと共有遮断フィルタを展開、さらに同等性能の新品PC無償保証で二次被害を完全封殺します！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                text: 'よし！ そして最後に残る最大の謎……多段プロキシの奥に潜む真の発信源を特定し、晒しサイトと保管庫を消滅させる決定打を出せ！',
              },
            ],
          },
          {
            stepNumber: 3,
            title: 'STEP 3: 真C2特定と無害化措置の執行',
            question:
              '【最終決定打の立証】多段偽装プロキシの奥に潜む真の発信源を暴き、正午に晒された「第1号」を消去し「第2号」以降の公開を永久に阻止するための最終決定打となる証拠を提示せよ！',
            correctEvidenceId: 'canary_c2_origin',
            hint: '多段プロキシの裏にある真のC2サーバー座標をピンポイントで捉えた逆探知テレメトリはどこにある！？',
            reaction: [
              {
                speaker: 'kei',
                text: 'これが最後の決定打だ！ あの逆流潜入調査でハニーポットに仕込んだ【ハニーポット端末・外部通信ビーコン記録】！',
              },
              {
                speaker: 'aria',
                emotion: 'alert',
                sprite: 'aria',
                illustration: 'assets/evidence/c2_origin.png',
                text: '攻撃者が正午に第1号を晒すためデータを解凍した瞬間、カナリア逆探知ビーコンが発火！ 真のC2サーバーIPアドレス【91.240.118.174】および、リークサイトと全盗難データ保管庫をピンポイントで捕捉しました！！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                illustration: 'assets/items/item_nco_directive.png',
                text: '全証拠の連結を確認！ 外務大臣協議・サイバー通信情報監理委員会の緊急承認を受理した！ 政府は『手の内を明かさない』原則に基づき、本措置の発動を公には一切認めない。歴史の表舞台には決して記録されない、史上初の非公然アクセス・無害化執行手順——作戦コード『GHOST PROTOCOL（ゴースト・プロトコル）』をこれより発動する！！',
                telop: '【OPERATION: GHOST PROTOCOL 発動承認】',
              },
              {
                speaker: 'kei',
                text: '通信プロトコルの亡霊（ゴースト）を使って26,739人を脅迫した奴らを、記録に残らない国家の非公然プロトコル『GHOST PROTOCOL』で音もなく葬り去る……！ アリア、無害化パケットを撃ち込め！！',
              },
              {
                speaker: 'narrator',
                text: '暗黒の電脳空間で、非公然無害化プログラム『GHOST PROTOCOL』が光の矢となって放たれた。犯行本拠地のストレージは次々とパージされ、国際連携による全ミラーサイトのテイクダウン包囲網が一斉に発動した！',
                sfx: 'victory',
                effect: 'glitch',
              },
            ],
          },
        ],
      },
    },
  ],
  epilogue: {
    title: 'EPILOGUE: 10月28日〜29日 — 報奨金のアイロニーと38通目の鎮魂歌',
    dialogue: [
      {
        speaker: 'narrator',
        text: '2026年10月28日、水曜日、午前4時00分。10月21日午前4時の「26,739台VPS全停止」から、ちょうど丸7日が経過した運命の時刻。',
        bgm: 'truth',
        telop: '【2026.10.28 04:00 犯行サイト全面テイクダウン完遂】',
      },
      {
        speaker: 'narrator',
        text: 'ドイツ・フランクフルトのC2拠点に展開されていた犯行サイトと盗難データ保管庫は完全に消去・無害化され、国内外の関係機関との連携によりミラーサイトを含む全ドメインの完全停止（テイクダウン）が確認された。',
        sfx: 'correct',
      },
      {
        speaker: 'takamiya',
        emotion: 'smile',
        sprite: 'takamiya',
        text: '1週間前の午前4時は絶望の中で26,739台の電源を落としたが……1週間後の午前4時、ついに奴らの脅迫サイトを完全に沈黙させたぞ！ 第13報として全国へリリース完了だ！',
      },
      {
        speaker: 'mio',
        emotion: 'focused',
        sprite: 'mio',
        text: 'さらに凄いことになっています！ 10月28日正午に日・英・中の3言語でオープンした『総額100万米ドル・サイバー犯罪撲滅懸賞金』の専用窓口ですが……！',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター！ 開設からわずか6時間で【113件】（第14報）、そして翌10月29日夕刻（第16報）には累計【321件もの有力情報】が国内外から殺到しました！ 100万ドルの懸賞金に目が眩んだ共犯ブローカーたちが、我先にと主犯の身元や暗号資産の送金経路を売り渡しています！',
        sfx: 'victory',
        telop: '【第14報〜第16報: 懸賞金窓口に321件殺到＆共犯組織が完全自壊】',
        cutSequence: {
          id: 'seq_ch5_bounty_dilemma',
          title: '100万米ドル懸賞金・囚人のジレンマ自壊シークエンス',
          description:
            '3言語ポータル公開、午前4時全脅迫サイトテイクダウン、321件密告殺到の連続カット',
          intervalMs: 1800,
          cuts: [
            {
              frame: 1,
              image: 'assets/sequences/ch5_bounty_cut1.jpg',
              sfx: 'alert',
              caption:
                '【第12報布告】日・英・中3言語での100万ドル懸賞金ポータル公開とネット世論の激震',
              visualDesc: '1,000,000 USD BOUNTY画面とSNS賛否の激しいセンチメントグラフ',
            },
            {
              frame: 2,
              image: 'assets/sequences/ch5_bounty_cut2.jpg',
              sfx: 'impact',
              caption: '【10/28 04:00 第13報】全脅迫サイト完全テイクダウンとドメイン強制停止',
              visualDesc: '404 DOMAIN SUSPENDED / SERVER TERMINATED の赤いテイクダウン宣告画面',
            },
            {
              frame: 3,
              image: 'assets/sequences/ch5_bounty_cut3.jpg',
              sfx: 'beacon',
              caption:
                '【第14〜16報・囚人のジレンマ】窓口に321件の有力密告が殺到し犯人特定情報を警察へ提出',
              visualDesc: '世界中から集約される追跡情報ログと放置チケット突合による犯人特定画面',
            },
          ],
        },
      },
      {
        speaker: 'takamiya',
        emotion: 'serious',
        sprite: 'takamiya',
        text: 'そして10月29日、ついに決定打が繋がった（第15報）……！ 懸賞金窓口のタレコミと、うちの社内ホワイトハッカーチームの独自調査——あの放置されていた【38件の脆弱性通報チケット】の添付データを突合したんだ！',
        sfx: 'evidence',
        telop: '【第15報: 社内ホワイトハッカー調査と窓口情報から犯人特定情報を警察へ提出】',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい！ 数ヶ月前に窓口へ送られてきた1通目のバグ報告チケットに添付されていた概念実証（PoC）スクリプトを解析したところ、今回の口座焼却と全く同じ関数名『DEMOFASTLOSS』、同一のコンパイラ署名、そして今回のカナリア逆探知で浮上した主犯のテスト環境IPおよび報奨金受取用ウォレットアドレスが100%一致しました！',
      },
      {
        speaker: 'mio',
        emotion: 'focused',
        sprite: 'mio',
        text: '提出された特定情報に基づき、警察庁および国際捜査網が不正アクセス禁止法違反容疑等で主犯と共犯ブローカーの検挙・国際手配へ動いています！ 完全なる包囲網の完成です！',
      },
      {
        speaker: 'takamiya',
        emotion: 'serious',
        sprite: 'takamiya',
        text: '……なあケイ。これが数ヶ月前、あいつが最初に窓口へ送ってきた1通目のレポートだ。この時はまだ脅迫の言葉なんて一言もなかった。『このままでは2万6千人のユーザーの資産が危険に晒されます。修正案と実証コードを添えるので確認してください』と、最初は純粋な技術者として手を差し伸べていたんだ……。',
      },
      {
        speaker: 'takamiya',
        emotion: 'serious',
        sprite: 'takamiya',
        text: 'もし俺たちの会社が、その1通目にたった一言『報告ありがとう、すぐ直す』と返して正当なバグバウンティ（報奨金）を払っていれば……あいつは犯罪者にならずに済んだのかもしれないな。',
      },
      {
        speaker: 'kei',
        text: '……ああ。渾身の技術と善意の警告を、顔も見えない企業の窓口に38回もゴミ箱へ捨てられ、『存在しないもの（ゴースト）』として扱われた孤独と絶望は、同じエンジニアとして痛いほど分かる。企業の傲慢と怠慢が、一人の優秀な技術者を闇へ突き落とした事実は決して消えない。',
      },
      {
        speaker: 'kei',
        text: 'だがなレン、どんなに理不尽に無視されようと、その怒りを無関係な26,739人の顧客に向け、他人の財産と人生を焼き払った瞬間に、あいつが誇っていたはずの技術の魂は死んだんだ。',
      },
      {
        speaker: 'kei',
        text: 'あいつが渇望した『100万ドルの報奨金（Bug Bounty）』は、皮肉にも共犯者に裏切られ、自分自身を檻へ送る『100万ドルの懸賞金（Cybercrime Bounty）』となって返ってきた——それが一線を越えた亡霊の末路だ。',
      },
      {
        speaker: 'kuroda',
        emotion: 'sharp',
        sprite: 'kuroda',
        text: 'その通りだナギサ君。政府は『手の内を明かさない』原則に基づき、非公然無害化措置『GHOST PROTOCOL』の発動を永遠に公表しない。……だがタカミヤ君、国家の亡霊が消したのは「敵のサーバー」だけだ。貴社が免罪されたとは夢にも思うなよ。',
      },
      {
        speaker: 'kuroda',
        sprite: 'kuroda',
        text: '全26,739台共通の管理者アカウント設計、2019年からのRDPドライブ共有設定放置、傘下ホワイトハッカーの事前警告と外部からの38回の脆弱性通報の黙殺、そして第1報の矮小化発表とトップ個人のSNS発信による混乱……金融庁・個人情報保護委員会・総務省による行政調査とガバナンス責任の追及は、これからが本番だ。',
      },
      {
        speaker: 'kei',
        text: '統括官の言う通りだ、レン。これを『100万ドルの懸賞金で悪党を倒した企業の英雄的勝利』なんて美談にして終わらせるなよ。企業の過失や、38回の警告を亡霊（なかったこと）にした罪まで消して逃げることは許されない。本当の戦いは、都合の悪い技術的侵入原因（Root Cause）を1ミリも隠さず天下に開示することから始まるんだ。',
      },
      {
        speaker: 'takamiya',
        emotion: 'serious',
        sprite: 'takamiya',
        text: '……ああ、胸に刻むよケイ。トップのパフォーマンスや金銭補償の裏に隠れず、俺たちが犯した設計上の過ちも、善意の脆弱性報告を無視し続けた窓口の罪も、すべて第三者検証報告書として世の中に晒す。二度と技術者の警告を『亡霊』にしない——それが26,739人のユーザーと、闇に堕ちたあいつに対する、俺たちの本当の償いだ。',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: '攻撃者のサーバーは沈黙し、321件の包囲網と1通目のレポートがすべての真相を結びました。そして残された企業と社会には、痛みを伴う再出発の朝が訪れようとしていますね、マスター。',
        sfx: 'victory',
      },
      {
        speaker: 'narrator',
        text: '黙殺された38通の警告から始まり、26,739台の沈黙へと至った電脳金融戦争は、報奨金を巡る痛烈なアイロニーと企業ガバナンスへの重い問いを残して、その幕を閉じたのである。',
        telop: '【GHOST PROTOCOL: MISSION COMPLETE】',
      },
    ],
  },
  novelFullText: `
# GHOST PROTOCOL 〜26,739台の亡霊と能動的サイバー防御・発動第1号〜
## 著・監修：VOICE VISUAL NOVEL 電脳鑑識プロジェクト

---

### 【プロローグ：2026年10月20日 23:45 — 予兆なき暗転】

2026年10月20日、火曜日、深夜23時45分。
都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイのプライベート監視モニターが、突如として断末魔のようなエラーログを吹き鳴らした。
「……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、全APIの異常切断アラートが連続で出ている……！？」
自律電脳エージェントのアリアが緊急テレメトリを展開する。
「マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました。稼働総数、推定26,739台。ほぼすべてが管理ネットワークから蒸発し、応答を喪失しつつあります！」
あのクラウドは、全国数万人規模の個人トレーダーが24時間体制で金融自動売買（FT4/FT5）を動かしている国内屈指の巨大基盤だ。
その直後、大学時代からの無二の親友であり、現場CSIRTリーダーのタカミヤ レンから悲痛な着信が入る。
『現場のAD（Active Directory）管理プレーンが全部乗っ取られた……！ 2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が裏コマンドから次々と書き換えられている！ このまま夜が明ければ数万人の顧客資産が全滅する……！ 我々は午前4時をもって、26,739台すべての【全回線切断・強制シャットダウン】を決断する！』
深夜の死闘の末、運命の午前4時00分が訪れた。対策本部は苦渋の決断として、非常停止ボタンを押し込み、全サーバーが沈黙した。
だがブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが冷ややかに浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。
「全26,739台のVPSを物理遮断した直後に、この挑発メッセージ……敵の仕掛けはまだ終わっていない！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！」
「了解しました、マスター。沈黙した26,739台の背後に潜む『亡霊の通信規約（ゴースト・プロトコル）』——命を削る電脳戦争の幕開けです！」
ここに、日本の金融・インフラ史上最大の電脳サスペンスが幕を開けた。

---

### 【Chapter 1：10月21日 04:00 — 26,739台の沈黙と『2秒で蒸発した400万円』】

10月21日午前4時00分、国内大手GNOインターネットグループは、26,739台におよぶWindows VPSのネットワークを全面遮断し、全サーバーの緊急停止に踏み切った。
しかし夜明けとともに、SNS上には全国のトレーダーたちの悲鳴と怒号が津波のように押し寄せた。
「ふざけるな！ サーバー停止直前に勝手に見覚えのないハイレバ注文が乱発され、口座残高400万円が2秒でゼロになった！」
「全財産が消えた、返せ！」
問い合わせ窓口は完全にパンクし、1時間で数千件の口座破綻報告が殺到する。
しかも事態を悪化させたのは、企業側の初動広報の失敗と基本設計の欠陥だった。法務・広報部門が調査完了前に出した第1報で「現時点で情報の悪用や個人情報の外部流出は確認されておりません」と早計な安全宣言を出してしまったせいで、多くのユーザーが油断して口座を放置していたのだ。さらに全26,739台のVPSに「共通の管理者アカウント」が設定されていたため、AD管理プレーン1箇所の突破で全サーバーが一網打尽にされていた。
外部エンジニアであるケイは「不都合な事実を矮小化する初動広報が一番被害を広げるんだ！ しかも2万6千台に共通管理者アカウントを使うなんてクラウド設計の基本すら守られていないぞ！」と厳しく追及しつつ、取引端末FT4の内部プロトコルからミリ秒単位の注文生テレメトリを直接抽出した。
抽出された生ログが、戦慄の事実を物語っていた。
流動性の極めて低い超マイナー通貨ペア『TRY/ZAR（トルコリラ/南アフリカランド）』、スプレッドは実に850pps。その極小市場に対し、わずか0.1秒の超短時間で往復売買が叩き込まれていた。そして注文コメント欄に刻まれていたのは——『DEMOFASTLOSS』という攻撃者のシグネチャ。
金融機関には厳格な本人名義出金制限と二段階認証があるため、攻撃者は1円も自己の口座へ出金できない。ケイとアリアはその恐るべき意図を看破した。
「送金ではなく『口座の焼却』だ！ 出金制限を逆手に取り、顧客資産を高スプレッドの手数料として市場へ蒸発させ、怒り狂う数万人の顧客を人質（レバレッジ）に変えてインフラ企業を恐喝する手口だ！ だが『DEMOFASTLOSS（高速損失デモ）』という名前は、まるで脆弱性の実証デモ（PoC）のようで妙だぞ……」
対策本部は10月22日昼、前日の第1報を訂正して「第2報：口座情報閲覧の可能性の公表と、全ユーザーへの金融取引Webパスワード即時変更要請」をアナウンスした。
だが安堵の息を漏らした瞬間、対策本部のシークレットチャットに攻撃者から直筆の暗号化メッセージが届く。
《無様な抵抗だ。数ヶ月前、俺が貴様らの脆弱性通報窓口に何十回この設計欠陥を報告してやったか覚えているか？ テンプレ返信ひとつ寄越さず、俺の報告をゴミ箱へ捨てて無視（ゴースト）したな。正規の窓口でバグバウンティ（脆弱性報奨金）すら払わず黙殺した代償は高くつく。第2報でパスワード変更を呼びかけたところで、貴様らの無力さを全国に晒してやる》。敵はこちらの手の内を完全に先読みしていた。

---

### 【Chapter 2：10月22日 19:30 — パスワード変更の死角と『Hacking Team』の分断工作】

10月22日昼の第2報発表から数時間が経過した同日夜19時30分。
SNSは前日を遥かに超える地獄絵図と化していた。
「昨日の第1報では『悪用は確認されていない』と言い切ったくせに、今日の第2報で『口座情報閲覧の可能性』を後出し発表か！ 小出しにして隠蔽するな！」
「しかも公式の指示通りパスワードを変えたのに、今夜も勝手に取引されて口座が全滅した！」
企業の小出し・後出し発表に対する激しい不信感が渦巻く中、攻撃者『Hacking Team (Dmitry Orlov)』から被害者たちへ直接、丁寧な日本語で「企業が隠蔽している証拠を提供する。集団訴訟を起こせ」という懐柔メールが届き、被害者と企業を切り離す分断工作が急速に進む。
ケイたちは生バイナリと通信プロトコルを緊急解剖し、2つの決定打を暴き出した。
第1に、金融取引端末FT4/FT5はWeb上でパスワードを変更しても、既に確立されたTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り、既存セッションから自動売買コマンドを受け付け続けるというプロトコル仕様の盲点——すなわち、電源を落としたはずのVPSや変更後のパスワードをすり抜けて生き続ける『幽霊ソケット（第1のゴースト・プロトコル）』だった。全ブローカーへの「全セッション強制パージ（Session Kill）」発令により、不正注文は完全に鎮火された。
第2に、攻撃者が送りつけてきた集団訴訟煽動Excelファイルの内部XMLをバイナリ解剖。ロシア語版Office特有の「Лист1」や英語版の「Sheet1」ではなく、中国語簡体字版KPS Office特有の自動付与シート名『工作表1』が残存していた事実を特定。脆弱性を見つけて窓口に無視された「発見者（バグハンター）」が逆恨みし、2万6千台の同時攻撃と巨額資金洗浄のために中国語圏のダークウェブ恐喝シンジケートと手を組んだ多国籍偽旗工作（False Flag）を物証で粉砕した。
だがその刹那、対策本部の巨大メインモニターが激しい砂嵐を走らせ、ある被害者の【自宅PCのデスクトップ画面】が突如映し出された。
確定申告書、家族の写真、そしてChromeブラウザの暗号化パスワード保管フォルダーが丸見えになっていた。
なぜクラウドの外にある自宅PCが抜かれているのか……！？

---

### 【Chapter 3：10月23日 15:00 — クラウドから自宅PCへの逆流（\\\\tsclient\\C）】

10月23日午後。攻撃者から対策室とメディア宛てに『samples.zip』というアーカイブが送りつけられた。被害者たちの「自宅PC」から確定申告書やChromeの暗号化パスワード保管ファイル『Login Data』など、実に4,352ファイルが抜き取られ、10,891ファイルがリスト化されていた。
だが、被害者の自宅PCからはマルウェアが一切検出されない。
ケイは2019年から配布されていた公式の接続用設定ファイル『NEODOTCOM_CONNECT.RDP』を生鑑識し、内部に潜んでいた致命的な一行パラメータを発見する。
『drivestoredirect:s:*』——。
自宅PCからVPSへリモートデスクトップ接続した瞬間、VPS側から自宅PCの全ドライブが『\\\\tsclient\\C』として自動共有・認識されていたのだ。マルウェアを一切使わず、正規のRDP（Remote Desktop Protocol）パイプラインを悪用してアンチウイルスを完全回避し中身を吸い上げる『リバースRDP（第2のゴースト・プロトコル）』の戦慄。
その瞬間、タカミヤが青ざめて告白した。
「……実は数ヶ月前、グループ傘下のセキュリティ専門会社に所属する社内ホワイトハッカー集団が、この設定と共通管理者アカウントの危険性を上層部に報告していたが、『自動売買の可用性（稼働継続）最優先だ』と先送りされていた……！ それだけじゃない、外部向けの『脆弱性通報窓口』の未処理アーカイブを調べたら、数ヶ月前から【38回】も同一の外部調査者から通報とバグバウンティ（報奨金）の要求が届いていたのに、『対象外サービスにつき回答不要』として1通も返信せず放置されていたんだ……！」
ケイは唇を噛み締めて断じた。
「あいつは最初、犯罪者としてじゃなく『発見者』として正当な評価とバグバウンティを求めて窓口をノックしていたんだ。だが38回真剣なレポートを送っても、企業側に『存在しないもの（ゴースト）』としてゴミ箱へ捨てられた絶望と屈辱が、あいつを本物の黒い亡霊（恐喝犯）に変えてしまった！ 社内警告も外部通報も握り潰していたとなれば、これは100%の人災だぞ！」

全本番VPSが停止中の中、隔離サンドボックスに1台だけ用意していたおとりVPSとハニーポット自宅PCに敵が食いついてきた。ケイはダミーのLogin Data内に、解凍した瞬間に発火する逆探知用カナリアトークンを混入させ、あえて敵に持ち帰らせた。
その直後、社内の全プリンターから「脆弱性通報窓口へ38回送信した画面のスクリーンショット」付きの【四重脅迫状】が一斉印刷され、経営陣が極秘に隠蔽していた暗号資産【5,000万ドル（約80億円）】の支払い要求が社内とマスコミへ一斉暴露されたのである！

---

### 【Chapter 4：10月24日 11:50 — 四重脅迫への反撃：実損100%直接補償というゲーム理論とSNS大炎上】

10月24日午前。10月21日の最初期メールで犯人が要求していた【5,000万ドル（約80億円）】が露呈し、役員会はパニックに陥っていた。
ケイはゲーム理論に基づく決断を提示した。
「犯人の5,000万ドルなど完全黙殺しろ！ 『攻撃者への支払ゼロ』を宣言し、約款免責を超えて『不正取引による実現損失の100%直接補償（Investor Password監査）＋一律見舞金5,000円＋新基盤半年無償移行』を断行するんだ！」
11時50分、第4報リリース完了。しかし同時に、グループのオーナー代表が個人ブログとSNSで「実は社内ホワイトハッカーから事前に指摘されていたが可用性を優先して遅れた」「これはAIによるサイバー飽和攻撃であり政府に能動的サイバー防御を要請した」と発信したため、ネット上は大炎上となった。
「ホワイトハッカーの警告を無視した完全な人災を、AI飽和攻撃や国家防衛の問題にすり替えるな！」「5,000円のお見舞金や補償金で殴って、技術的な侵入原因（Root Cause）の説明から逃げる気か！」と批判が殺到する。
だが世論の猛批判を浴びつつも、企業が顧客の実損を100%補償したことで、攻撃者が握っていた「顧客の損失を人質にして企業を脅す」交渉レバレッジは完全に消滅した。
追い詰められた犯人は激しい怨念とともに要求額を自ら【100万ドル（約1.6億円）】へと98%も大幅ダンピング（値下げ）し、《顧客に何十億円も補償する金があるなら、なぜ最初から俺の38回の脆弱性報告に報奨金を払わなかった！？ 5,000万ドルとは言わない、俺が発見者として正当に受け取るはずだったバグバウンティ【100万ドル】だけでいい！ 10月27日正午までに払わなければ、全26,739台の自宅PCへ潜伏させた時限ランサムウェアを一斉起爆する》と最後通牒を叩きつけてきた！
ケイは犯人の歪んだ渇望を見抜いた。「あいつが本当に欲しかったのは80億円じゃない。自分の技術と発見を正当に評価してくれるはずだった企業からの『承認（バグバウンティ）』だったんだ。だが、無関係な26,739人の顧客を人質に取った瞬間、そいつはもう技術者じゃない！」

---

### 【Chapter 5：10月27日 11:50〜19:10 — 能動的サイバー防御「発動第1号」と100万ドル逆転懸賞金】

10月27日午前11時50分。社員が全国を飛び回って物理回収した顧客PCの徹夜解析により、潜伏ランサムウェアは【検出ゼロ（完全なブラフ）】と判明。第8報（電源コード抜去要請）に続き、11時59分の第9報で「マルウェア検出ゼロ・万一被害が出ても同等性能の新品PCを無償提供する」と発表し、パニックを封じ込めた。
そこへ国家サイバー統括室（NCO）のクロダ統括官が介入し、冷徹に釘を刺した。
「貴社の代表がSNSで『AI飽和攻撃だ、政府に能動的サイバー防御を要請した』と発信し、責任転嫁だと大炎上しているな。勘違いするなよ。国家の盾は一企業のガバナンス不全や設計過失を免罪するための道具ではない！ 我々が動くのは人質にされた26,739人の国民を守るためだ！」

そして正午『12:00:00』。ランサムウェアの発動は全国でゼロ件だった。
しかし逆上した犯人は犯行サイト『coronamng.store』を更新し、【被害者 第1号】の実名・個人情報を公開して「毎日正午に1人ずつ晒し上げる（サラミ戦術）」と宣言！
しかも直後、メディア取材に対し『被害者 第1号』の本人が「そんなVPSサービスなど一度も使ったことがない、内容もデタラメだ！」と証言。さらに企業代表が個人ブログでその人物の情報に言及してしまったことで、「なぜ未利用者の情報が混ざっているのか！？ 別サービスからの漏洩を隠しているのではないか！？」とSNSは不信と混乱の極致に達した。
だがアリアの緊急鑑識により、犯人がハッタリを効かせるため古い別名簿の断片とダミーデータをツギハギ合成していたことが判明。そしてまさにそのデータ復号・加工の瞬間、ハニーポットから持ち帰らせていたダミーLogin Data内の【逆探知用カナリアトークン】が発火！ オランダとルーマニアの多段プロキシを突き破り、ドイツ・フランクフルトの真の実行元IPアドレス【91.240.118.174】をピンポイントで捕捉した。

さらにミラーサイトを立ち上げて「俺の正当な報奨金である100万米ドルを払え」と迫る犯行グループに対し、第10報・第11報でアクセス警告と二次拡散者への法的措置を発令。代表が個人SNSで特定アカウントを名指し警告したことで「公私混同のガバナンス不全だ」「犯人を挑発して劇場型犯罪にしている」とさらなる批判を浴びる中、ケイとタカミヤは敵組織を内部から引き裂く最後の劇薬（第12報）を撃ち込んだ。
情報が公開された被害者には別枠で1公開につき【上限300万円の特別お見舞金】（基本情報1万円・金融認証1.5万円・機微情報2.5万円の合算）を支給して人質価値を消し去り、犯人が「俺の正当なバグバウンティだ」と執着した『100万米ドル（約1.5億円）』をそのまま犯人自身を特定・検挙するための【サイバー犯罪撲滅・懸賞金（Cybercrime Bounty）】として、中国語オフィス（工作表1）の多国籍共犯グループに合わせて【日・英・中の3言語】で全世界に懸けたのだ！
孤独な恨みで暴走する主犯（発見者）に対し、金目当てで手を組んだシンジケートの共犯者たちに義理はない。「主犯を売れば1.5億円、黙っていれば仲間に売られて逮捕される」という究極の『囚人のジレンマ』を突きつけた。
そして民間企業の100%任意ログ提供と警職法6条の2（明白な重大危害の職権認知）、カナリア逆探知による真C2特定により能動的サイバー防御の「3つの壁」を突破。政府が「手の内を明かさない」原則に基づき公的記録に一切残さない史上初の非公然アクセス・無害化執行手順——作戦コード『GHOST PROTOCOL（第3のゴースト・プロトコル）』が発令され、NCOと警察庁サイバー特捜隊による無害化措置が執行された！

---

### 【エピローグ：10月28日〜29日 — 報奨金のアイロニーと38通目の鎮魂歌】

2026年10月28日、水曜日、午前4時00分。
10月21日午前4時の「26,739台VPS全停止」から、ちょうど丸7日が経過した運命の時刻。
ドイツ・フランクフルトのC2拠点に展開されていた犯行公開サイトと盗難データ保管庫は『GHOST PROTOCOL』によって音もなく消去・無害化され、国内外の関係機関との連携によってミラーサイトを含む全ドメインの停止（テイクダウン）が確認された（第13報）。
さらに10月28日正午に日・英・中の3言語で開設された『総額100万米ドル・サイバー犯罪撲滅懸賞金』の専用窓口には、開設からわずか6時間で【113件】（第14報）、翌10月29日夕刻（第16報）には累計【321件】もの有力な内部告発・追跡情報が殺到し、懸賞金に目が眩んだ共犯ブローカーたちが主犯の身元や送金経路を次々と売り渡した。
そして10月29日、ついに決定打が繋がった（第15報）。社内ホワイトハッカーチームが、かつて窓口で放置されていた【38件の脆弱性通報チケット】の添付PoC（概念実証）スクリプトを再鑑識した結果、1通目のレポートに記されていた関数名『DEMOFASTLOSS』、コンパイラ署名、テスト環境IP、報奨金受取用ウォレットアドレスが今回のカナリア逆探知ログと100%一致。犯人特定につながる決定的な証拠が警察および関係機関へと提出された。

タカミヤは、数ヶ月前に犯人が最初に窓口へ送ってきていた1通目のレポートを見つめて呟いた。
「……この時はまだ、脅迫の言葉なんて一言もなかった。『このままでは2万6千人のユーザーの資産が危険に晒されます。修正案と実証コードを添えるので確認してください』と、最初は純粋な技術者として手を差し伸べていたんだ。もし俺たちの会社が、その1通目にたった一言『報告ありがとう、すぐ直す』と返して正当なバグバウンティを払っていれば……あいつは犯罪者にならずに済んだのかもしれないな」
ケイは静かに、しかし毅然と答えた。
「……ああ。渾身の技術と善意の警告を、顔も見えない企業の窓口に38回もゴミ箱へ捨てられ、『存在しないもの（ゴースト）』として扱われた孤独と絶望は、同じエンジニアとして痛いほど分かる。企業の傲慢と怠慢が、一人の優秀な技術者を闇へ突き落とした事実は決して消えない。だがなレン、どんなに理不尽に無視されようと、その怒りを無関係な26,739人の顧客に向け、他人の財産と人生を焼き払った瞬間に、あいつが誇っていたはずの技術の魂は死んだんだ。あいつが渇望した『100万ドルの報奨金（Bug Bounty）』が、自分自身を檻へ送る『100万ドルの懸賞金（Cybercrime Bounty）』となって返ってきた——それが一線を越えた亡霊の末路だ」
クロダ統括官もまた、厳しく釘を刺した。
「国家の亡霊が消したのは『敵のサーバー』だけだ。全26,739台共通の管理者アカウント設計、2019年からのRDP共有設定放置、傘下ホワイトハッカーの事前警告と外部からの38回の脆弱性通報の黙殺、そして第1報の矮小化発表とトップ個人のSNS発信による混乱……行政調査とガバナンス責任の追及は、これからが本番だ」
タカミヤは唇を噛み締め、深く頭を下げた。
「……ああ、胸に刻むよケイ。俺たちが犯した設計上の過ちも、善意の脆弱性報告を無視し続けた窓口の罪も、すべて第三者検証報告書として世の中に晒す。二度と技術者の警告を『亡霊』にしない——それが26,739人のユーザーと、闇に堕ちたあいつに対する、俺たちの本当の償いだ」
黙殺された38通の警告から始まり、26,739台の沈黙へと至った電脳金融戦争は、報奨金を巡る痛烈なアイロニーと企業ガバナンスへの重い問いを残して、その幕を閉じたのである。
`,
};
