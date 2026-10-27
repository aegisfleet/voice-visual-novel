// scenario.js - GHOST PROTOCOL 全5章インタラクティブノベルシナリオ＆真相レポートマスターデータ

window.SCENARIO_DATA = {
  meta: {
    title: 'GHOST PROTOCOL 〜26,739台の亡霊と能動的サイバー防御・発動第1号〜',
    version: '2026.10.27-novel-v5-directives',
    description:
      '2026年10月VPS大規模サイバー侵害事件と能動的サイバー防御発動第1号を追体験する長編体験型ビジュアルノベル（10月27日最新事実反映版）',
  },
  evidence: {
    ad_demofastloss_log: {
      id: 'ad_demofastloss_log',
      name: 'AD侵入痕跡・取引プロトコル生ログ',
      icon: '🔥',
      image: 'assets/evidence/ad_demofastloss.png',
      type: '【通信プロトコル鑑識】AD基盤侵害・ミリ秒注文パラメータ',
      summary:
        '出金制限を逆手に取り、高スプレッド通貨の即時往復売買で口座残高を蒸発させた恐喝注文テレメトリ。',
      detail:
        '8月31日に取得された偽装ドメイン coronamgt-c2.net を起点にActive Directory管理プレーンが侵入され、26,739台のVPSに保管されていたFT4/FT5（世界標準の金融自動売買端末）の認証情報が窃取された。金融機関には本人名義口座への出金制限とWeb二段階認証があるため攻撃者は直接出金できない。そのため超高スプレッドの即時往復注文（DEMOFASTLOSS）で顧客資産を意図的に焼き払い、インフラ企業への身代金要求の人質に変えた決定打の鑑識記録。',
    },
    persistent_session_trap: {
      id: 'persistent_session_trap',
      name: '取引通信ソケット監査票＆脅迫添付Excel',
      icon: '🌐',
      image: 'assets/evidence/persistent_session.png',
      type: '【セッション・偽旗鑑識】永続ソケット監査・脅迫メールメタデータ',
      summary:
        'パスワード変更後も維持されるTCP接続仕様と、内部XMLに偽旗工作の痕跡を残した脅迫ファイル。',
      detail:
        '第2報でユーザーにパスワード変更を求めた後も不正取引が続いた原因は、FT4/FT5プロトコルが既存の確立済みTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り注文を受け続ける仕様にあった。また、ロシア系を騙る攻撃者『Hacking Team (Dmitry Orlov)』が被害者懐柔のために送ってきた集団訴訟煽動Excelの内部XMLには、中国語版KPS Office特有の『工作表』というシート名が残存しており、多国籍偽旗工作（False Flag）が暴かれた。',
    },
    reverse_rdp_tsclient: {
      id: 'reverse_rdp_tsclient',
      name: 'クライアント接続構成ファイル＆共有API証跡',
      icon: '💻',
      image: 'assets/evidence/reverse_rdp.png',
      type: '【エンドポイント構成鑑識】RDPリダイレクト設定・ローカル共有監査',
      summary:
        '接続用.rdpファイルの自動共有設定により、クラウドVPS側へ自宅PCの全ドライブが露出した痕跡。',
      detail:
        '2019年から配布されていた接続用 .rdp ファイル内に『drivestoredirect:s:*』が記述されていたため、ユーザーが自宅PCからVPSへリモート接続した瞬間、VPS側から被害者のCドライブが \\\\tsclient\\C として自動マウントされていた。実は社内ホワイトハッカー集団や現場CSIRTが事前にこの設定の危険性を報告していたが、金融自動売買の「可用性最優先」により改修が後手に回っていた痛恨の事実が判明。マルウェアなしで被害者自宅PCから確定申告書やブラウザの Login Data（4,352ファイルコピー・10,891ファイルリスト化）が吸い出された『リバースRDP』の物理的・技術的証明。',
    },
    direct_compensation_matrix: {
      id: 'direct_compensation_matrix',
      name: '顧客実損算定マトリクス＆API照会監査票',
      icon: '⚖️',
      image: 'assets/evidence/compensation_matrix.png',
      type: '【法理・制度監査証跡】ゲーム理論的反撃・Investor Password監査',
      summary:
        '約款免責を超えた100%直接補償方針と、閲覧専用パスワードによる客観的損害算定スキーム。',
      detail:
        '攻撃者は10月21日の最初期メールで暗号資産5,000万ドル（約80億円）を要求。これに対し企業側は身代金を完全黙殺し、『支払ゼロ』を宣言。約款の免責条項を超えて『不正取引による実現損失の100%直接補償＋見舞金5,000円＋新基盤6ヶ月無償移行』を断行した。これにより人質レバレッジを失った犯人は焦燥に駆られ、要求額を自ら100万ドル（約1.6億円）へと98%も大幅ダンピング（値下げ）。損害額はFT4/FT5の閲覧専用パスワード（Investor Password）とVPS不正アクセス時刻を突合することで、モラルハザードを防ぎ客観的算定を完遂した。',
    },
    nco_three_walls_report: {
      id: 'nco_three_walls_report',
      name: '国家サイバー対処法理・要件適合性審査レポート',
      icon: '🏛️',
      image: 'assets/evidence/nco_alert.png',
      type: '【サイバー防衛法理証跡】能動的サイバー防御発動要件監査レポート',
      summary:
        'サイバー対処能力強化法における要件の壁と、民間任意ログ提供および警職法に基づく突破法理。',
      detail:
        '①基幹インフラ15分野の壁（民間直接申請不可）→70社超の金融機関への波及と、10月27日正午の『被害者 第1号』実名公開および毎日正午の順次晒し宣言（サラミ戦術）による明白な重大危害を根拠に警察官職務執行法第6条の2で職権認知。②2027年秋まで未施行の無同意通信取得の壁→民間被害企業による100%任意ログ提供により通信の秘密侵害を回避。③外国主権と偽旗工作の壁→誤爆を防ぐため真の発信源の100%特定を要求。現在進行形の現行犯権利侵害を前に、史上初となる『能動的サイバー防御・措置要請』が正式成立した。',
    },
    canary_c2_origin: {
      id: 'canary_c2_origin',
      name: 'ハニーポット端末・外部通信ビーコン記録',
      icon: '🎯',
      image: 'assets/evidence/c2_origin.png',
      type: '【真性C2逆探知ビーコン】逆探知ビーコン発火・外部通信テレメトリ',
      summary:
        'ハニーポット端末の重要ファイル内に潜伏させたカナリアが発火し、偽装プロキシの背後を捉えた追跡記録。',
      detail:
        'ハニーポット端末への \\\\tsclient\\C 逆流潜入調査時、ダミーLogin Data内に仕込まれた特殊なカナリアトークン（Canary Token）。10月27日正午、攻撃者が『被害者 第1号』の個人情報を晒すため自前の攻撃インフラでデータを復号・加工した瞬間、逆探知ビーコンが発火。多段プロキシの奥に隠されていた真のC2サーバー（91.240.118.174）と、公開サイト・データ加工拠点をピンポイントで特定した決定打。',
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
        '金融機関へのRDP不正接続を逆利用し、攻撃者が「被害者 第1号」の個人情報を加工・公開しようとした瞬間にDNS/HTTP逆探知ビーコンを送信。多段偽装プロキシの背後にある真性C2（91.240.118.174）を暴き出すトリガーとなった決定打デバイス。',
    },
    item_investor_key: {
      id: 'item_investor_key',
      name: 'Investor Password 監査キーカード',
      icon: '💳',
      image: 'assets/items/item_investor_key.png',
      type: '【客観的損害算定・暗号監査カード】',
      summary: '取引権限を持たず、ミリ秒単位の取引履歴のみを改ざん不可能に抽出する閲覧専用キー。',
      detail:
        '攻撃者による「80億円要求」に対し、企業側が約款免責を超えた直接補償を実施するにあたり、ユーザー申告とVPS侵入ログを突合してモラルハザードを防いだ救世主。この客観的算定により身代金要求は1.6億円へと98%暴落した。',
    },
    item_nco_directive: {
      id: 'item_nco_directive',
      name: '能動的サイバー防御・電子発動命令書（第001号）',
      icon: '📜',
      image: 'assets/items/item_nco_directive.png',
      type: '【国家サイバー防御執行権限】',
      summary:
        '警察官職務執行法第6条の2に基づく、史上初のアクセス・消去等措置を認可する電子執行令書。',
      detail:
        '内閣官房国家サイバー統括室（NCO）および警察庁サイバー特別捜査隊による合同令書。民間直接申請の壁、通信の秘密の壁、外国主権と偽旗工作の壁を突破し、国境を越えたC2攻撃インフラへの緊急無害化措置執行権限をケイ・アリアに委ねる最高機密アセット。',
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
      },
      {
        speaker: 'narrator',
        text: '都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイの監視モニターが突如、断末魔のようなエラーログを吹き鳴らした。',
        sfx: 'alert',
        effect: 'alert-flash',
      },
      {
        speaker: 'kei',
        text: '……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、全APIの異常切断アラートが連続で出ている……！？',
        sfx: 'glitch',
      },
      {
        speaker: 'aria',
        emotion: 'alert',
        sprite: 'aria',
        text: 'マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました！',
        bgm: 'crisis',
        telop: '【EMERGENCY: 国内最大手ネオドットコム 全面RPC異常検知】',
        effect: 'glitch',
      },
      {
        speaker: 'kei',
        text: '全インスタンスだと！？ あのクラウドは、全国数万人規模の個人トレーダーが24時間体制で金融自動売買（FT4/FT5）を動かしている国内屈指の巨大基盤だぞ！',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい。稼働仮想マシン総数は26,739台……そのほぼすべてが管理ネットワークから次々と蒸発し、応答を喪失しつつあります！',
        sfx: 'alert',
      },
      {
        speaker: 'narrator',
        text: 'その直後、ケイの私用スマートフォンが狂ったように震え出した。発信元は——クラウド運用本部CSIRT現場リーダーであり、大学時代からの親友、タカミヤ レン。',
        sfx: 'ring',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『ケイ……！ 頼む、助けてくれ！ 現場のAD（Active Directory）管理プレーンが……全部乗っ取られた！』',
        effect: 'shake',
        telop: '【CRITICAL BREACH: AD管理プレーン完全掌握】',
      },
      {
        speaker: 'kei',
        text: 'レン！？ 落ち着け、一体何が起きてるんだ！？',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『深夜、管理基盤の深部に侵入された……！ 2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が……裏コマンドから次々と書き換えられている！』',
      },
      {
        speaker: 'takamiya',
        emotion: 'panic',
        sprite: 'takamiya',
        text: '『このまま夜が明ければ、数万人の顧客資産が全滅する……！ 我々は午前4時をもって、26,739台すべての【全回線切断・強制シャットダウン】を決断する！』',
        sfx: 'impact',
      },
      {
        speaker: 'kei',
        text: '26,739台の全停止……！ 日本の金融インフラを揺るがす未曾有のインシデントになるぞ……！',
      },
      {
        speaker: 'narrator',
        text: '深夜の死闘の末、運命の午前4時00分が訪れた。対策本部は苦渋の決断として、全仮想マシンの強制回線切断に踏み切った。',
        bgm: 'silence',
        sfx: 'impact',
        effect: 'blackout',
        telop: '【2026.10.21 04:00 全26,739台強制回線切断執行】',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター、シャットダウンが執行されました。全サーバーが沈黙……ですが、不吉なデータを受信しました！',
        bgm: 'crisis',
      },
      {
        speaker: 'kei',
        text: '……なんだ、このメッセージは？',
      },
      {
        speaker: 'narrator',
        text: 'ブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。',
        sfx: 'glitch',
        effect: 'glitch',
      },
      {
        speaker: 'kei',
        text: '敵はこちらを嘲笑っている……！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！',
        bgm: 'investigate',
        sfx: 'cutin',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: '了解しました、マスター。26,739台の亡霊（ゴースト）との、命を削る電脳戦争の幕開けです——！',
        sfx: 'correct',
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
          sprite: 'takamiya',
          text: 'ケイ、問い合わせ窓口が完全にパンクしている……！ 1時間で数千件の口座破綻報告だ。一体どこから手を付ければいいんだ！？',
          sfx: 'alert',
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
          sprite: 'takamiya',
          text: '第2報のリリース完了！ これで今夜の不正取引は阻止できるはずだ……！',
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
          sprite: 'takamiya',
          text: '『無様な抵抗だ。第2報を出してユーザーにパスワード変更を呼びかけてみろ。貴様らの無力さを全国に晒してやる』……だと！？ なぜ我々がパスワード変更を呼びかけたことを知っているんだ！？',
          sfx: 'impact',
          effect: 'shake',
        },
        {
          speaker: 'kei',
          text: '敵はこちらの手の内を完全に読んでいる……！ 一体何が起きようとしているんだ……！？',
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
          text: '第2報の緊急発表から一日が経過した10月22日夜。ユーザーによるパスワード変更が進み、「これで口座破壊は食い止められるはずだ」と対策室に安堵の空気が漂っていた。',
          bgm: 'investigate',
          telop: '【10.22 19:30 第2報発表から24時間経過】',
        },
        {
          speaker: 'narrator',
          text: 'だがそのわずか数時間後、SNSは前日を遥かに超える地獄絵図と化していた。「ふざけるな！ 公式の指示通りパスワードを変えたのに、今夜も勝手に取引されて口座が全滅した！」「会社が嘘をついている！ パスワード変更なんて意味がない！」',
          bgm: 'crisis',
          sfx: 'impact',
          effect: 'shake',
          telop: '【CRITICAL: パスワード変更済みの口座で不正取引が再発】',
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
          text: 'くそっ……！ 21日午前4時に全26,739台のVPSを完全停止させているんだぞ！？ VPSが動いていないのに、なぜ外部の取引所に注文が通るんだ……！？ パスワード変更が反映されていないのか！？',
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
                  text: 'やっぱりだ！ VPS自体は停止していても、攻撃者はシャットダウン前に窃取した認証情報を使い、攻撃者自身の外部サーバーから各ブローカーのFT4取引サーバーへ直接TCPソケットを繋ぎっぱなしにしていたんだ！ この確立済みセッションを取引所側で強制切断（Session Kill）させない限り、注文は通り続けていたんだ！',
                },
              ],
            },
          ],
          nextDialogue: [
            {
              speaker: 'takamiya',
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
                  text: 'ロシア人を騙りながら、ファイル生成環境は中国語圏のオフィスソフト……多国籍の偽旗工作（False Flag）だ！ 敵の分断工作を客観的物証で粉砕できる！',
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
          emotion: 'panic',
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
            title: 'リバースRDP（\\\\tsclient\\\\C）自動マウントシークエンス（パラパラ漫画演出）',
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
                  text: '正規のRDPパイプラインだから、自宅PCのウイルス対策ソフトを完全に素通りして確定申告書やChromeのLogin Dataが吸い出されたんだ！',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '……っ！？ まさか、.rdp のドライブ共有設定か……！ ケイ、実は数ヶ月前、社内のホワイトハッカー集団がこの設定の危険性を上層部に報告していたんだ！ だが「顧客に再設定させるな、自動売買の可用性最優先だ」と却下され、改修が後回しにされていた……！ 防げたはずの危機だったのに……！ 我々現場の痛恨の極みだ……！',
                  sfx: 'impact',
                },
                {
                  speaker: 'kei',
                  text: '社内警告が握り潰されていたのか……！ だがタカミヤ、過去の悔恨に囚われている暇はない！ この手口を直ちに公表し、全ユーザーに共有解除を呼びかけるぞ！',
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
                  text: '切断するな！ ダミーのLogin Dataの中に、解凍した瞬間に発火する逆探知用カナリアトークンを混入させろ！ あえて敵に持ち帰らせるんだ！',
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
          sprite: 'takamiya',
          text: '【四重脅迫状】だ……！ ①国内外70社超の金融口座の破壊再開、②自宅PC個人情報のダークウェブ無制限公開、③内部システム構成の暴露、④経営陣が隠蔽している暗号資産【5,000万ドル（約80億円）】の支払い要求……！ タイムリミットは明日10月24日12時！ 1秒でも遅れれば、すべてを実行すると……！！',
          sfx: 'impact',
        },
        {
          speaker: 'kei',
          text: '四重脅迫……！ いよいよ奴らが本気でこの会社と顧客の人生を潰しにかかってきたぞ……！！',
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
          sprite: 'takamiya',
          text: '11時50分、第4報リリース完了！ 『攻撃者への支払ゼロ、不正取引実損の100%直接補償、見舞金支給、新基盤無償移行』……ネットの空気が一変した！ 『企業の覚悟が凄い』『攻撃者に屈するな』と、応援の声が殺到している！',
          bgm: 'truth',
          sfx: 'victory',
          telop: '【第4報発表: 支払ゼロ・実損100%直接補償断行】',
        },
        {
          speaker: 'kei',
          text: '完璧だ。これで攻撃者の人質レバレッジは消滅した。だが……プライドを粉々に砕かれた攻撃者が、このまま引き下がるはずがない。',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/compensation_matrix.png',
          text: '核心鑑識データ『顧客実損算定マトリクス＆API照会監査票』を取得しました。四重脅迫無力化の論拠が立証されました！',
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
          sprite: 'takamiya',
          text: 'ケイ、信じられない事態が起きた！ 5,000万ドルの要求を完全黙殺され、顧客への直接補償で人質を奪われた攻撃者が……パニックを起こして自ら要求額を【100万ドル（約1.6億円）】へと98%もダンピング（値下げ）してきたぞ！！',
          sfx: 'alert',
          telop: '【PRICE COLLAPSE: 要求額5,000万ドル→100万ドルへ98%値下げ】',
          cutSequence: {
            id: 'seq_ch4_ransom_collapse',
            title: '身代金要求98%価格崩壊シークエンス（パラパラ漫画演出）',
            description: '第4報により人質を失った犯人が焦燥し、自ら98%値下げする連続カット',
            intervalMs: 1600,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch4_cut1.jpg',
                sfx: 'victory',
                caption: '【第4報発表】身代金支払ゼロ＆不正取引実損100%直接補償を公式宣言',
                visualDesc: 'ニュース速報テロップと称賛に沸くSNSのタイムライン',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch4_cut2.jpg',
                sfx: 'alert',
                caption: '【レバレッジ消滅】顧客と企業が結束し、犯人が握っていた人質が完全消滅',
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
          sprite: 'takamiya',
          text: 'だが……プライドをズタズタにされた犯人が、血文字の最後通牒を叩きつけてきた！ 『期限は10月27日正午！ 10月21日の全VPSシャットダウン直前に、リバースRDP経由で全26,739台の自宅PC深部へ【10月27日正午に一斉起動する時限発火型ランサムウェア】をすでに潜伏配備させた。100万ドルを支払わなければ一斉起爆し、全国のPCを完全破壊して文房具に変えてやる』……！！',
          bgm: 'crisis',
          sfx: 'impact',
          effect: 'alert-flash',
          telop: '【FINAL DEADLINE: 10月27日正午 26,739台PC破壊予告】',
        },
        {
          speaker: 'kei',
          text: '10月21日の停止直前に時限マルウェアを送り込んだと主張しているのか……！ 正規RDPのパイプライン経由ならアンチウイルスをすり抜けて潜伏している恐れが否定できない。全国へ社員を飛ばして顧客PCを物理回収し、潜伏の真偽を徹夜で鑑識する必要があるぞ！',
        },
      ],
    },
    {
      id: 5,
      number: 'CHAPTER 5',
      date: '10月27日 11:50〜12:20',
      title: '能動的サイバー防御「発動第1号」と3つの壁の突破',
      subtitle: '運命の正午・カナリアの逆探知と無害化措置',
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
          emotion: 'panic',
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
          emotion: 'panic',
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
          text: 'ナギサ君、タカミヤ君。状況は把握している。敵のランサム予告がブラフだったとしても、手元にある4,352件の確定申告書やLogin Dataなどの実データは依然として敵の手にある。正午になれば何が起きるか分からない。',
        },
        {
          speaker: 'mio',
          sprite: 'mio',
          text: 'はい……！ 2026年10月1日に施行された『能動的サイバー防御法（サイバー対処能力強化法）』を発動し、敵の司令塔へ非公然アクセス・無害化措置を撃ち込みたいところですが……現行法には【制度上の3つの壁】が存在します。',
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
          sprite: 'takamiya',
          text: 'ひっ……！？ 犯人が逆上して、犯行サイトにデータをアップロードした！ 『身代金を払わなかった見せしめに【被害者 第1号】の実名・確定申告書を公開する。明日正午には第2号、明後日は第3号と、毎日正午に1人ずつ全員の人生を晒し上げてやる』……！！',
          sfx: 'alert',
          telop: '【CRITICAL: 犯人サイトで「被害者 第1号」実名・申告書公開】',
        },
        {
          speaker: 'narrator',
          text: 'だが——まさにその瞬間だった！！',
          sfx: 'impact',
          cutSequence: {
            id: 'seq_ch5_canary_strike',
            title: '運命の正午・逆探知カナリアトークン発火シークエンス（パラパラ漫画演出）',
            description:
              '12:00の第1号公開に伴う敵アジトでのデータ復号と逆探知ビーコン発火の連続カット',
            intervalMs: 1500,
            cuts: [
              {
                frame: 1,
                image: 'assets/sequences/ch5_cut1.jpg',
                sfx: 'alert',
                caption: '【12:00:00】ランサム不発に逆上した犯人が「被害者 第1号」公開作業を開始',
                visualDesc: '犯行サイト coronamng.store にアップロードされる確定申告書',
              },
              {
                frame: 2,
                image: 'assets/sequences/ch5_cut2.jpg',
                sfx: 'glitch',
                caption: '【復号フック作動】犯人のアジトでダミーLogin DataのSQLite復号フックが作動',
                visualDesc: '攻撃者PC端末で実行されるデータ加工プロセス画面',
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
          text: 'マスター！！ 敵が「被害者 第1号」を公開するために自前のアジトでデータを復号・加工した瞬間、あのダミーLogin Dataに仕込んだ【逆探知用カナリアトークン】が発火しました！！ DNS/HTTP逆探知コールバックが着弾しました！！',
          sfx: 'beacon',
        },
        {
          speaker: 'kei',
          text: 'カナリアが喰らいついたか……！ だがクロダ統括官、能動的サイバー防御を発動するには、今この瞬間を捉えて法理を突破しなければならない！',
        },
      ],
      choiceSteps: [
        {
          id: 'ch5_step1_legal_walls',
          type: 'forensic',
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
          isFinalStep: true,
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
                {
                  speaker: 'kei',
                  text: 'あの時、リスクを冒してカナリアを仕込ませた甲斐があったな……！ これで最後のピースが揃った！',
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
          text: '見事だナギサ君、タカミヤ君！ これで第1・第2・第3の壁を突破するすべての物証が揃った！',
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
                text: '全証拠の連結を確認！ 外務大臣協議・サイバー通信情報監理委員会の緊急承認を受理！ これより警察庁サイバー特捜隊およびNCOによる『特定妨害工作通信のアクセス・消去等措置（無害化措置）』を正式執行せよ！！',
              },
              {
                speaker: 'narrator',
                text: '暗黒の電脳空間で、無害化プログラムが光の矢となって放たれた。犯行サイトは即座にブラックアウトし、保管されていた全盗難データは一瞬にして完全消去されたのである！',
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
    title: 'EPILOGUE: 10月27日 13:30 — 白昼の反撃と完全なる鎮火',
    dialogue: [
      {
        speaker: 'narrator',
        text: '2026年10月27日、火曜日、午後13時30分。',
        bgm: 'truth',
        telop: '【2026.10.27 13:30 完全鎮火】',
      },
      {
        speaker: 'narrator',
        text: 'ドイツ・フランクフルトのC2サーバー内に展開されていた犯行公開サイトと盗難データ保管庫は、NCOと警察庁特捜隊の非公然アクセス措置により、痕跡ひとつ残さず完全に消去・無害化された。正午に晒された『被害者 第1号』のページも即座に消滅し、予告されていた『第2号』以降の公開は永久に阻止された。',
        sfx: 'correct',
        telop: '【VICTORY: 被害者第2号以降の晒しを永久封殺】',
      },
      {
        speaker: 'takamiya',
        emotion: 'serious',
        sprite: 'takamiya',
        text: '……終わったのか。身代金を1円も払わず、自宅PCの破壊も防ぎ、個人情報の拡散も完全に食い止めたんだな。',
      },
      {
        speaker: 'kuroda',
        emotion: 'sharp',
        sprite: 'kuroda',
        text: 'うむ。政府は『手の内を明かさない』原則に基づき、今回の能動的サイバー防御の発動を公表することはない。だが君たちが守ったのは、26,739人の日常と、この国の電脳空間の尊厳だ。',
      },
      {
        speaker: 'mio',
        sprite: 'mio',
        text: 'ケイさん、アリアさん、タカミヤさん。本当にありがとうございました……！',
      },
      {
        speaker: 'kei',
        text: '2026年10月1日に施行されたばかりの能動的サイバー防御法が、民間のフォレンジックと連携して初めて真の防壁として機能した。だが2027年秋の本格法改正に向けて、官民連携の課題は山積みだ。俺たちの戦いは、まだ始まったばかりだな。',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい、マスター！ 亡霊（ゴースト）たちは完全に消え去り、澄み渡る秋の青空が広がっています！',
        sfx: 'victory',
      },
      {
        speaker: 'narrator',
        text: '窓の外を見上げると、東京の街並みの上に抜けるような青空が広がっていた。26,739台の沈黙から始まった足掛け8日間の電脳金融戦争は、ここに完全なる勝利で幕を閉じたのである。',
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
「敵はこちらを嘲笑っている……！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！」
「了解しました、マスター。26,739台の亡霊（ゴースト）との、命を削る電脳戦争の幕開けです——！」
ここに、日本の金融・インフラ史上最大の電脳サスペンスが幕を開けた。

---

### 【Chapter 1：10月21日 04:00 — 26,739台の沈黙と『2秒で蒸発した400万円』】

10月21日午前4時00分、国内大手GNOインターネットグループは、26,739台におよぶWindows VPSのネットワークを全面遮断し、全サーバーの緊急停止に踏み切った。
しかし夜明けとともに、SNS上には全国のトレーダーたちの悲鳴と怒号が津波のように押し寄せた。
「ふざけるな！ サーバー停止直前に勝手に見覚えのないハイレバ注文が乱発され、口座残高400万円が2秒でゼロになった！」
「全財産が消えた、返せ！」
問い合わせ窓口は完全にパンクし、1時間で数千件の口座破綻報告が殺到する。
ケイは初動作戦として、外部送金マルウェアやWebポータルへの不正ログインといった偽の手がかりを即座に排除。取引端末FT4の内部プロトコルから、ミリ秒単位の注文生テレメトリを直接抽出した。
抽出された生ログが、戦慄の事実を物語っていた。
流動性の極めて低い超マイナー通貨ペア『TRY/ZAR（トルコリラ/南アフリカランド）』、スプレッドは実に850pps。その極小市場に対し、わずか0.1秒の超短時間で往復売買が叩き込まれていた。そして注文コメント欄に刻まれていたのは——『DEMOFASTLOSS』という攻撃者のシグネチャ。
だが不可解だった。金融機関には厳格な本人名義出金制限と二段階認証がある。攻撃者は1円も自己の口座へ出金できない。金を盗めないのに、なぜ他人の口座をゼロにするのか？
ケイとアリアはその恐るべき意図を看破した。
「送金ではなく『口座の焼却』だ！ 出金制限を逆手に取り、顧客資産を高スプレッドの手数料として市場へ蒸発させ、怒り狂う数万人の顧客を人質（レバレッジ）に変えてインフラ企業を恐喝する手口だ！」
第4世代の金融口座焼却型恐喝が暴かれた。
対策本部は初動対応として「第2報：全ユーザーへの金融取引Webパスワード即時変更要請」をアナウンス。これでアカウントの不正操作は防げるはずだった。
だが安堵の息を漏らした瞬間、対策本部のシークレットチャットに攻撃者から直筆の暗号化メッセージが届く。
《無様な抵抗だ。第2報を出してユーザーにパスワード変更を呼びかけてみろ。貴様らの無力さを全国に晒してやる》。敵はこちらの手の内を完全に先読みしていた。

---

### 【Chapter 2：10月22日 19:30 — パスワード変更の死角と『Hacking Team』の分断工作】

第2報の緊急発表から一日が経過した10月22日夜。
全ユーザーによるパスワード変更が進み、「これで口座破壊は食い止められるはずだ」と対策室に安堵の空気が漂っていた。
だがその夜、SNSは前日を遥かに超える地獄絵図と化していた。
「ふざけるな！ 公式の指示通りパスワードを変えたのに、今夜も勝手に取引されて口座が全滅した！」
「会社が嘘をついている！ パスワード変更なんて意味がない！」
ネットは企業の隠蔽を疑って大炎上した。
さらに攻撃者『Hacking Team (Dmitry Orlov)』から被害者たちへ直接、丁寧な日本語で「企業が隠蔽している証拠を提供する。集団訴訟を起こせ」という懐柔メールが届き、被害者と企業を切り離す分断工作が急速に進む。
ケイたちは二次被害防止のアナウンスを打つと同時に、生バイナリと通信プロトコルを緊急解剖。データベース同期遅延や自宅PCのキーロガー感染といった偽説を退け、2つの決定打を暴き出した。
第1に、金融取引端末FT4/FT5はWeb上でパスワードを変更しても、既に確立されたTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り、既存セッションから自動売買コマンドを受け付け続けるというプロトコル仕様の盲点。全ブローカーへの「全セッション強制パージ（Session Kill）」発令により、不正注文は完全に鎮火された。
第2に、攻撃者が送りつけてきた集団訴訟煽動Excelファイルの内部XMLをバイナリ解剖。ロシア語版Office特有の「Лист1」や英語版の「Sheet1」ではなく、中国語簡体字版KPS Office特有の自動付与シート名『工作表』が残存していた事実を特定。ロシア系ハッカーを騙る多国籍の偽旗工作（False Flag）を物証で粉砕し、集団訴訟パニックを一気に沈静化させた。
だがその刹那、対策本部の巨大メインモニターが激しい砂嵐を走らせ、ある被害者の【自宅PCのデスクトップ画面】が突如映し出された。
確定申告書、家族の写真、そしてChromeブラウザの暗号化パスワード保管フォルダーが丸見えになっていた。
なぜクラウドの外にある自宅PCが抜かれているのか……！？

---

### 【Chapter 3：10月23日 15:00 — クラウドから自宅PCへの逆流（\\\\tsclient\\C）】

10月23日午後。事態はインフラの停止を超え、一般個人のプライバシー空間への全面侵食という戦慄の領域へ突入した。
攻撃者から対策室とメディア宛てに『samples.zip』というアーカイブが送りつけられた。被害者たちの「自宅PC」から確定申告書やChromeの暗号化パスワード保管ファイル『Login Data』など、実に4,352ファイルが抜き取られ、10,891ファイルがリスト化されていた。
だが、被害者の自宅PCからはマルウェアが一切検出されない。
タカミヤは困惑と焦燥で顔を歪めた。
「ケイ、被害者の自宅PCからはマルウェアが一切出ない。それなのに、なぜ自宅PCの重要ファイルが丸ごと抜き取られたのか皆目見当がつかない……！ 一体どんな手口で手元のPCへ侵入したんだ！？」
ケイは冷静に状況を分析した。
「自宅PCからマルウェアが出ないなら、怪しいファイルを持ち込ませたのではなく、正規のリモートデスクトップ接続設定そのものが悪用された可能性がある。配布されている接続設定ファイルを徹底的に洗うぞ！」
ケイは2019年から配布されていた公式の接続用設定ファイル『NEODOTCOM_CONNECT.RDP』を生鑑識した。
そして、内部に潜んでいた致命的な一行パラメータを発見する。
『drivestoredirect:s:*』——。
自宅PCからVPSへリモートデスクトップ接続した瞬間、VPS側から自宅PCの全ドライブが『\\\\tsclient\\C』として自動共有・認識されていたのだ。正規のRDPパイプラインを悪用し、アンチウイルスを完全回避して中身を吸い上げる「リバースRDP」の戦慄。
その瞬間、タカミヤがハッとして青ざめた。
「……っ！？ まさか、.rdp のドライブ共有設定か……！ ケイ、実は数ヶ月前、社内のホワイトハッカー集団がこの設定の危険性を上層部に報告していたんだ！ だが『顧客に再設定させるな、自動売買の可用性最優先だ』と却下され、改修が後回しにされていた……！ 防げたはずの危機だったのに……！ 我々現場の痛恨の極みだ……！」
ケイはタカミヤの肩を叩いた。
「社内警告が握り潰されていたのか……！ だがタカミヤ、過去の悔恨に囚われている暇はない！ この手口を直ちに公表し、全ユーザーに共有解除を呼びかけるぞ！」

全本番VPSが停止中の中、リバースRDPの手口を実証しておびき寄せるため、隔離サンドボックスに1台だけ用意していたおとりVPSとハニーポット自宅PCに、唯一生きているサーバーを見つけた敵が早速食いついてきた。
アリアが叫んだ。
「マスター！ 緊急警告です！！ 今まさに攻撃者が、調査用ハニーポット端末のCドライブから『Login Data』をコピーしようとしています！」
転送完了まで残り15秒。ケイは鋭く制止した。
「切断するな！ ダミーのLogin Data内に、解凍した瞬間に発火する逆探知用カナリアトークンを混入させろ！ あえて敵に持ち帰らせるんだ！」
毒入りのファイルを掴ませ、敵の懐へ電脳トラップを潜伏させた。
その直後、社内のすべてのプリンターと内線電話が一斉に狂ったように動き出し、全国の報道機関へFAXが一斉送信される。
【四重脅迫状】の着弾——。①国内外70社超の金融口座破壊再開、②自宅PC個人情報のダークウェブ無制限公開、③内部システム構成暴露、④経営陣が極秘に隠蔽していた暗号資産【5,000万ドル（約80億円）】の支払い要求が、社内とマスコミへ一斉暴露されたのである！

---

### 【Chapter 4：10月24日 11:50 — 四重脅迫への反撃：実損100%直接補償というゲーム理論】

10月24日午前。四重脅迫のタイムリミットまで、あと数十分。
役員会議室では怒号と悲痛な叫びが飛び交っていた。
実は犯人は10月21日の最初期メールで、社長室宛ての極秘メールとして暗号資産【5,000万ドル（約80億円）】という天文学的な身代金を要求していたことが露呈する。経営陣は公表すらできず抱え込んでいたが、昨日の四重脅迫状で社内とマスコミに暴露されて役員会は完全にパニックに陥っていた。
ケイはゲーム理論に基づく歴史的決断を提示した。
「犯人の5,000万ドル（約80億円）など完全黙殺しろ！ 『攻撃者への支払ゼロ』を宣言し、その資金で約款免責を超えて『不正取引による実現損失の100%直接補償＋見舞金5,000円＋新基盤半年無償移行』を断行するんだ！」
さらに損害額の算定にあたり、FT4/FT5の標準機能である「閲覧専用パスワード（Investor Password）」を採用。出金権限を排した閲覧キーでブローカー生ログを取得し、VPS侵害タイムスタンプと1対1でミリ秒完全一致検証。モラルハザードを完全に排除した客観算定スキームを構築した。
11時50分、第4報リリース完了。「企業の覚悟が凄い」「攻撃者に屈するな」と世論は一変。顧客と企業が強固に結束したことで、攻撃者が握っていた人質レバレッジは完全崩壊した。
その直後、パニックを起こした攻撃者から信じがたいメッセージが着信する。
5,000万ドルの要求を完全黙殺されレバレッジを失った犯人は、要求額を自ら【100万ドル（約1.6億円）】へと98%も大幅ダンピング（値下げ）してきたのだ！
ケイは「80億円から1.6億円への価格崩壊……ゲーム理論の完全勝利だ」と確信した。
だが追い詰められた犯人は血文字の最後通牒を叩きつけてきた。
《期限は10月27日正午！ 10月21日の全VPSシャットダウン直前に、リバースRDP経由で全26,739台の自宅PC深部へ【10月27日正午に一斉起動する時限発火型ランサムウェア】をすでに潜伏配備させた。100万ドルを支払わなければ一斉起爆し、全国のPCを完全破壊して文房具に変えてやる》！
正規RDP経由ならアンチウイルスをすり抜けて潜伏している恐れがある。全国へ社員を飛ばして顧客PCを物理回収し、潜伏の真偽を徹夜で鑑識する必要が生まれた。国家規模の無差別サイバーテロの阻止へ向け、運命の10月27日正午への秒読みが始まった！

---

### 【Chapter 5：10月27日 11:50〜12:20 — 能動的サイバー防御「発動第1号」と3つの壁】

10月27日午前11時50分。攻撃者が突きつけてきた100万ドルの支払期限——10月27日正午まで、残された時間はわずか10分。
GNOグループの社員は全国各地を飛び回って顧客の自宅PCを物理回収し、ホワイトハッカーチームが徹夜でバイナリ解析を続けていた。
VPSは停止している。もし27日正午にPCが一斉暗号化されるとしたら、停止前に送り込まれた時限爆弾式の潜伏ランサムウェアが存在する場合のみ。だが物理回収端末の解析結果は……検出ゼロ！ 敵のランサムウェア予告は、電源を切らせてパニックを煽るための完全なブラフ（ハッタリ）だと看破された！
対策本部は午前9時58分の第8報で「12:00になる前にPCの電源コードを抜いて電源を落とすよう」緊急アナウンスを発令しつつ、正午直前の11時59分の第9報で「マルウェア検出ゼロ・万一被害が出ても同等性能の新品PCを無償提供する」と電撃発表。パニックの芽を完全に摘み取った。
その時、暗号化回線で国家サイバー統括室（NCO）のクロダ統括官とミオ分析官が緊急介入。
2026年10月1日に施行されたばかりの『能動的サイバー防御法（サイバー対処能力強化法）』を発動し、敵の司令塔へ非公然アクセス・無害化措置を撃ち込みたいところだが、現行法には【制度上の3つの壁】が存在した。
① 基幹インフラ15分野限定の壁（民間直接申請不可）
② 2027年秋まで未施行の無同意通信取得の壁
③ 外国主権と真の発信源特定の壁（誤爆厳禁）

そして壁のデジタル時計が非情にも『10月27日 12時00分』を告げた。
ランサムウェアの発動は全国でゼロ件！ やはり敵の予告は完全なブラフだった。
しかし、1円も取れず逆上した攻撃者の犯行サイト『coronamng.store』が更新される！
「身代金不応諾により個人情報の公開を開始する。まずは【被害者 第1号】だ。毎日正午に1人ずつ、数年かけて全員の人生を晒し上げてやる」——！ 被害者の実名と確定申告書が晒し上げられた！
だが、その刹那だった。
敵が「被害者 第1号」を公開するために自前のアジトでデータを復号・加工した瞬間、あのダミーLogin Data内に仕込まれていた【逆探知用カナリアトークン】が劇的に発火したのだ！！
着弾した生テレメトリには、オランダのTor Relay（45.154.255.89）とルーマニアのSOCKS5 Bridge（185.220.101.5）を完全に突き破り、ドイツ・フランクフルトの真の実行元IPアドレス【91.240.118.174】と、晒しサイトサーバー・全流出データ保管庫がピンポイントで捕捉されていた。

12時05分、ケイとタカミヤはクロダ統括官に対し論証を叩きつける。
「PC破壊はブラフだったが、現実に国民の個人情報が晒され、明日正午に第2号が晒される現在進行形の現行犯重大危害が発生した！ 民間企業の100%任意ログ提供で通信の秘密をクリアし、警職法6条の2に基づく職権認知要件は完全に充足された！」
第1・第2の壁は完全に突破された。
そしてカナリア逆探知によって真の発信源が100%立証されたことで、第3の壁も瓦解した。
全証拠の連結を認めたクロダ統括官の号令のもと、外務大臣協議・サイバー通信情報監理委員会の緊急承認を受理。警察庁サイバー特捜隊およびNCOによる史上初の「特定妨害工作通信のアクセス・消去等措置（無害化措置）」が、暗黒の電脳空間へ光の矢となって放たれた！
犯行サイトは即座にブラックアウトし、保管されていた全盗難データは一瞬にして完全消去されたのである！

---

### 【エピローグ：10月27日 13:30 — 白昼の反撃と完全なる鎮火】

2026年10月27日、火曜日、午後13時30分。
ドイツ・フランクフルトのC2サーバー内に展開されていた犯行公開サイトと盗難データ保管庫は、NCOと警察庁特捜隊の非公然アクセス措置により、痕跡ひとつ残さず完全に消去・無害化された。正午に晒された『被害者 第1号』のページも即座に消滅し、予告されていた『第2号』以降の公開は永久に阻止された。
26,739台の一般家庭PCから、破壊と暴露の危機が完全に消え去った。
「身代金を1円も払わず、PCの破壊も防ぎ、個人情報の拡散も完全に食い止めたんだな」
タカミヤの呟きに、クロダ統括官が静かに頷いた。
「うむ。政府は『手の内を明かさない』原則に基づき、今回の能動的サイバー防御の発動を公表することはない。だが君たちが守ったのは、26,739人の日常と、この国の電脳空間の尊厳だ」
「2026年10月1日に施行されたばかりの能動的サイバー防御法が、民間のフォレンジックと連携して初めて真の防壁として機能した。だが2027年秋の本格法改正に向けて、官民連携の課題は山積みだ。俺たちの戦いは、まだ始まったばかりだな」
「はい、マスター！ 亡霊（ゴースト）たちは完全に消え去り、澄み渡る秋の青空が広がっています！」
窓の外を見上げると、東京の街並みの上に抜けるような青空が広がっていた。
26,739台の沈黙から始まった足掛け8日間の電脳金融戦争は、ここに完全なる勝利で幕を閉じたのである。
`,
};
