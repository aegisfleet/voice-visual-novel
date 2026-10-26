// scenario.js - GHOST PROTOCOL 全5章インタラクティブノベルシナリオ＆真相レポートマスターデータ

window.SCENARIO_DATA = {
  meta: {
    title: 'GHOST PROTOCOL 〜26,739台の亡霊と能動的サイバー防御・発動第1号〜',
    version: '2026.10.25-novel-v3',
    description:
      '2026年10月VPS大規模サイバー侵害事件と能動的サイバー防御発動第1号を追体験する長編体験型ビジュアルノベル',
  },
  evidence: {
    ad_demofastloss_log: {
      id: 'ad_demofastloss_log',
      name: 'AD侵入痕跡・取引プロトコル生ログ',
      icon: '🔥',
      image: 'assets/evidence/sinkhole.jpg',
      type: '【Chapter 1 核心鑑識】AD基盤侵害・ミリ秒注文パラメータ',
      summary:
        '出金制限を逆手に取り、高スプレッド通貨の即時往復売買で口座残高を蒸発させた恐喝注文テレメトリ。',
      detail:
        '8月31日に取得された偽装ドメイン coronamgt-c2.net を起点にActive Directory管理プレーンが侵入され、26,739台のVPSに保管されていたFT4/FT5（世界標準の金融自動売買端末）の認証情報が窃取された。金融機関には本人名義口座への出金制限とWeb二段階認証があるため攻撃者は直接出金できない。そのため超高スプレッドの即時往復注文（DEMOFASTLOSS）で顧客資産を意図的に焼き払い、インフラ企業への身代金要求の人質に変えた決定打の鑑識記録。',
    },
    persistent_session_trap: {
      id: 'persistent_session_trap',
      name: '取引通信ソケット監査票＆脅迫添付Excel',
      icon: '🌐',
      image: 'assets/evidence/cdn_network.png',
      type: '【Chapter 2 核心鑑識】永続ソケット監査・脅迫メールメタデータ',
      summary:
        'パスワード変更後も維持されるTCP接続仕様と、内部XMLに偽旗工作の痕跡を残した脅迫ファイル。',
      detail:
        '第2報でユーザーにパスワード変更を求めた後も不正取引が続いた原因は、FT4/FT5プロトコルが既存の確立済みTCP接続（ソケット）をサーバー側で強制切断（Session Kill）しない限り注文を受け続ける仕様にあった。また、ロシア系を騙る攻撃者『Hacking Team (Dmitry Orlov)』が被害者懐柔のために送ってきた集団訴訟煽動Excelの内部XMLには、中国語版KPS Office特有の『工作表』というシート名が残存しており、多国籍偽旗工作（False Flag）が暴かれた。',
    },
    reverse_rdp_tsclient: {
      id: 'reverse_rdp_tsclient',
      name: 'クライアント接続構成ファイル＆共有API証跡',
      icon: '💻',
      image: 'assets/evidence/honeypot.jpg',
      type: '【Chapter 3 核心鑑識】RDPリダイレクト設定・ローカル共有監査',
      summary:
        '接続用.rdpファイルの自動共有設定により、クラウドVPS側へ自宅PCの全ドライブが露出した痕跡。',
      detail:
        '2019年から配布されていた接続用 .rdp ファイル内に『drivestoredirect:s:*』が記述されていたため、ユーザーが自宅PCからVPSへリモート接続した瞬間、VPS側から被害者のCドライブが \\\\tsclient\\C として自動マウントされていた。マルウェアなしで被害者自宅PCから確定申告書やブラウザの Login Data（4,352ファイルコピー・10,891ファイルリスト化）が吸い出された『リバースRDP』の物理的・技術的証明。',
    },
    direct_compensation_matrix: {
      id: 'direct_compensation_matrix',
      name: '顧客実損算定マトリクス＆API照会監査票',
      icon: '⚖️',
      image: 'assets/evidence/active_memory.jpg',
      type: '【Chapter 4 核心鑑識】ゲーム理論的反撃・Investor Password監査',
      summary:
        '約款免責を超えた100%直接補償方針と、閲覧専用パスワードによる客観的損害算定スキーム。',
      detail:
        '攻撃者による『四重恐喝（口座破壊・自宅PC暴露・ランサムウェア・内部情報公開）』に対し、企業側は『攻撃者への支払ゼロ』を宣言。約款の免責条項を超えて『不正取引による実現損失の100%直接補償＋見舞金5,000円＋新基盤6ヶ月無償移行』を断行した。これにより攻撃者の人質レバレッジ（被害者を煽る分断工作）は完全に崩壊。損害額はFT4/FT5の閲覧専用パスワード（Investor Password）とVPS不正アクセス時刻を突合することで、モラルハザードを防ぎ客観的算定を完遂した。',
    },
    nco_three_walls_report: {
      id: 'nco_three_walls_report',
      name: '国家サイバー対処法理・要件適合性審査レポート',
      icon: '🏛️',
      image: 'assets/evidence/nco_alert.png',
      type: '【Chapter 5 核心鑑識】能動的サイバー防御発動要件監査レポート',
      summary:
        'サイバー対処能力強化法における要件の壁と、民間任意ログ提供および警職法に基づく突破法理。',
      detail:
        '①基幹インフラ15分野の壁（民間直接申請不可）→70社超の金融機関への波及と個人資産への重大危害を根拠に警察官職務執行法第6条の2で職権認知。②2027年秋まで未施行の無同意通信取得の壁→民間被害企業による100%任意ログ提供により通信の秘密侵害を回避。③外国主権と偽旗工作の壁→誤爆を防ぐため真の発信源の100%特定を要求。これら3つの壁をクリアすることで、史上初となる『能動的サイバー防御・措置要請』が正式成立した。',
    },
    canary_c2_origin: {
      id: 'canary_c2_origin',
      name: 'ハニーポット端末・外部通信ビーコン記録',
      icon: '🎯',
      image: 'assets/evidence/c2_origin.png',
      type: '【Chapter 5 核心鑑識】逆探知ビーコン発火・外部通信テレメトリ',
      summary:
        'ハニーポット端末の重要ファイル内に潜伏させたカナリアが発火し、偽装プロキシの背後を捉えた追跡記録。',
      detail:
        'Chapter 3の \\\\tsclient\\C 逆流調査時、ハニーポット端末のダミーLogin Data内に仕込まれた特殊なカナリアトークン（Canary Token）。攻撃者が自前の攻撃インフラで解凍・照会した瞬間、逆探知ビーコンが発火。多段プロキシの奥に隠されていた真のC2サーバー（185.220.101.xx）と、26,739台の自宅PCへ送信予定だったランサムウェア配信キューをピンポイントで特定した決定打。',
    },
  },
  prologue: {
    title: 'PROLOGUE: 2026年10月19日 23:45 — 予兆なき暗転',
    dialogue: [
      {
        speaker: 'narrator',
        text: '2026年10月19日、月曜日、深夜23時45分。',
      },
      {
        speaker: 'narrator',
        text: '都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイの監視モニターが突如、断末魔のようなエラーログを吹き鳴らした。',
      },
      {
        speaker: 'kei',
        text: '……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、全APIの異常切断アラートが連続で出ている……！？',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました！',
      },
      {
        speaker: 'kei',
        text: '全インスタンスだと！？ あのクラウドは、全国数万人規模の個人トレーダーが24時間体制で金融自動売買（FT4/FT5）を動かしている国内屈指の巨大基盤だぞ！',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい。稼働仮想マシン総数は26,739台……そのほぼすべてが管理ネットワークから次々と蒸発し、応答を喪失しつつあります！',
      },
      {
        speaker: 'narrator',
        text: 'その直後、ケイの私用スマートフォンが狂ったように震え出した。発信元は——クラウド運用本部CSIRT現場リーダーであり、大学時代からの親友、タカミヤ レン。',
      },
      {
        speaker: 'takamiya',
        sprite: 'takamiya',
        text: '『ケイ……！ 頼む、助けてくれ！ 現場のAD（Active Directory）管理プレーンが……全部乗っ取られた！』',
      },
      {
        speaker: 'kei',
        text: 'レン！？ 落ち着け、一体何が起きてるんだ！？',
      },
      {
        speaker: 'takamiya',
        sprite: 'takamiya',
        text: '『深夜、管理基盤の深部に侵入された……！ 2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が……裏コマンドから次々と書き換えられている！』',
      },
      {
        speaker: 'takamiya',
        sprite: 'takamiya',
        text: '『このまま夜が明ければ、数万人の顧客資産が全滅する……！ 我々は午前4時をもって、26,739台すべての【全回線切断・強制シャットダウン】を決断する！』',
      },
      {
        speaker: 'kei',
        text: '26,739台の全停止……！ 日本の金融インフラを揺るがす未曾有のインシデントになるぞ……！',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'マスター、シャットダウンが執行されました。全サーバーが沈黙……ですが、不吉なデータを受信しました！',
      },
      {
        speaker: 'kei',
        text: '……なんだ、このメッセージは？',
      },
      {
        speaker: 'narrator',
        text: 'ブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。',
      },
      {
        speaker: 'kei',
        text: '敵はこちらを嘲笑っている……！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: '了解しました、マスター。26,739台の亡霊（ゴースト）との、命を削る6日間の電脳戦争の幕開けです——！',
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
        },
        {
          speaker: 'narrator',
          text: 'しかし夜明けとともに、SNS上には全国のトレーダーたちの悲鳴と怒号が津波のように押し寄せた。「ふざけるな！ サーバー停止直前に勝手に見覚えのないハイレバ注文が乱発され、口座残高400万円が2秒でゼロになった！」「全財産が消えた、返せ！」',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'ケイ、問い合わせ窓口が完全にパンクしている……！ 1時間で数千件の口座破綻報告だ。一体どこから手を付ければいいんだ！？',
        },
      ],
      choiceSteps: [
        {
          id: 'ch1_step1_target',
          type: 'tactic',
          badge: '⚡ TACTICAL DECISION / 初動作戦の決断',
          question:
            '【初動作戦の判断】1時間で数千件に達した被害報告に対し、限られた時間の中でどこから鑑識のメスを入れるか？',
          cutinText: '作戦指令承認：FT4取引プロトコル生ログを抽出！',
          cutinSub: '⚡ NCO TACTICAL DIRECTIVE / 作戦指示承認',
          options: [
            {
              id: 'opt1_target_ft4',
              label: '取引端末FT4のミリ秒注文履歴と通信パラメータの精査',
              description:
                '口座タイプや銘柄を問わず、直前に叩き込まれた全注文テレメトリを直接洗う。',
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
          question:
            '【生ログ解読の推理】攻撃者は1円も出金できないにもかかわらず、なぜこの異常な注文を繰り返したのか？',
          cutinText: '口座焼却の手口を看破！ 恐喝の構図を立証！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          logBox: {
            title: 'FT4 TRANSACTION LOG [EXTRACTED FROM INSTANCE #10482]',
            content:
              'TIMESTAMP: 2026-10-21 03:58:12.104\nPAIR: TRY/ZAR (Turkish Lira / S.African Rand) | SPREAD: 850 pps\nACTION: BUY 50.0 LOTS -> INSTANT CLOSE (HoldTime: 0.1s)\nACTION: SELL 50.0 LOTS -> INSTANT CLOSE (HoldTime: 0.1s)\nCOMMENT: DEMOFASTLOSS | OUTGOING_TRANSFER: 0.00 JPY\nACCOUNT_BALANCE: 4,000,000 JPY -> 0 JPY (LOSS BY SPREAD: 4,000,000 JPY)',
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
                '超高スプレッド通貨の高速往復売買で残高を手数料として市場へ蒸発させ、顧客を人質にして当社を脅迫しようとしている',
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
                  illustration: 'assets/evidence/sinkhole.jpg',
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
          question:
            '【緊急対応の決断】第2報として、26,739人のユーザーへどの初動対策を公式アナウンスするか？',
          cutinText: '第2報発令：全ユーザーへの緊急パスワード変更指示！',
          cutinSub: '⚡ INCIDENT RESPONSE ANNOUNCEMENT / 第2報発令',
          isFinalStep: true,
          options: [
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
          illustration: 'assets/evidence/sinkhole.jpg',
          text: '核心鑑識データ『AD侵入痕跡・取引プロトコル生ログ』を取得しました。第1章の真実が立証されました！',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '第2報のリリース完了！ これで今夜の不正取引は阻止できるはずだ……！',
        },
        {
          speaker: 'narrator',
          text: '安堵の息を漏らした瞬間、対策本部のホットラインがけたたましい警報音を鳴り響かせた。',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '……な、なんだ！？ 攻撃者から対策室の直通シークレットチャットに、直筆の暗号化メッセージが届いた……！？',
        },
        {
          speaker: 'kei',
          text: 'メッセージの内容は何だ、レン！？',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '『無様な抵抗だ。第2報を出してユーザーにパスワード変更を呼びかけてみろ。貴様らの無力さを全国に晒してやる』……だと！？ なぜ我々がパスワード変更を呼びかけたことを知っているんだ！？',
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
          text: '10月22日夜。企業側は第2報を緊急発表し、ユーザーに対して直ちに金融取引口座のパスワードを変更するよう強く呼びかけた。「これで口座破壊は食い止められるはずだ」。対策室に漂った安堵の空気。',
        },
        {
          speaker: 'narrator',
          text: 'だがそのわずか数時間後、SNSは前日を遥かに超える地獄絵図と化していた。「ふざけるな！ 公式の指示通りパスワードを変えたのに、今夜も勝手に取引されて口座が全滅した！」「会社が嘘をついている！ パスワード変更なんて意味がない！」',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'くそっ……！ なぜだ……！ パスワード変更が反映されていないのか！？ 俺たちのせいでまた被害者が……！',
        },
      ],
      choiceSteps: [
        {
          id: 'ch2_step1_socket',
          type: 'forensic',
          badge: '⚡ FORENSIC DEDUCTION / 技術的死角の特定',
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
              id: 'opt2_socket_tcp',
              label: 'Web認証とFT4取引専用TCPソケットのセッション維持仕様を突合する',
              description:
                'Webパスワードが変わっても、既存接続が切断されないプロトコルの死角を検証。',
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
                  text: 'やっぱりだ！ Webパスワードを変えても、攻撃者が繋ぎっぱなしにしているセッションを強制切断しない限り、注文は通り続けていたんだ！',
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
              sprite: 'takamiya',
              text: 'くそっ……！ 被害の45%は金融庁無登録の海外FX業者（ApexTrading、IS8FX等）だ。被害者の怒りが会社へ集中し、集団訴訟の呼びかけがSNSで大拡散されている！ どうやってこの信用を突き崩すんだ！？',
            },
          ],
        },
        {
          id: 'ch2_step2_false_flag',
          type: 'forensic',
          badge: '⚡ FORENSIC DECISION / 偽旗工作の看破',
          question:
            '【偽旗工作の看破】ロシア人『Dmitry Orlov』を名乗る集団訴訟煽動メールの信用を客観的物証でどう突き崩すか？',
          cutinText: '偽旗工作を完全論破！ 中国語KPS痕跡を特定！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          isFinalStep: true,
          options: [
            {
              id: 'opt2_ff_warning',
              label: '海外FX業者が金融庁無登録業者であることを理由に、法務から法的警告を出す',
              description: '無登録業者の利用規約違反を盾に、集団訴訟の正当性を否定するアプローチ。',
              isCorrect: false,
              damagePenalty: 10,
              retryPrompt:
                '逆効果だ！ 被害者から『無登録業者のせいにして企業が責任逃れをしている』と猛反発を受け炎上ゲージが増加した！ 物証で語れ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '海外FX業者は金融庁無登録だ。法務から公式に警告を出し、訴訟の不当性を主張してはどうか？',
                },
                {
                  speaker: 'takamiya',
                  sprite: 'takamiya',
                  text: '逆効果だ！ 被害者たちから『会社が責任逃れのために被害者を脅迫している』とSNSで猛反発を受け、炎上がさらに激化してしまった！',
                },
              ],
            },
            {
              id: 'opt2_ff_metadata',
              label:
                '添付された証拠Excel（.xlsx）をZIP解凍し、workbook.xml のシート定義メタデータを洗う',
              description:
                'ファイル生成環境の深部XMLをバイナリ解剖し、作成者の真のOS・言語環境を特定。',
              isCorrect: true,
              rewardEvidence: 'persistent_session_trap',
              reaction: [
                {
                  speaker: 'kei',
                  text: 'アリア、ロシア人を名乗る攻撃者が添付してきた『集団訴訟用証拠Excel』をZIP解凍し、内部XMLメタデータを全解剖しろ！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  illustration: 'assets/evidence/cdn_network.png',
                  text: '内部XMLから決定的な痕跡を抽出しました！ デフォルトのシート名がロシア語ではなく、中国語簡体字版KPS Office特有の『工作表』となっています！',
                },
                {
                  speaker: 'kei',
                  text: '中国語版オフィスソフトの痕跡……！ ロシアのハッカー集団を装った多国籍の偽旗工作（False Flag）だ！ 敵の分断工作を客観的物証で粉砕できる！',
                },
              ],
            },
          ],
        },
      ],
      resolution: [
        {
          speaker: 'kei',
          text: 'レン、証拠は揃った。パスワード変更が効かないのはFT4/FT5の永続ソケット仕様だ。全ブローカーに既存セッションの強制切断を要請しろ！',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'すぐ手配する！ そしてロシア人を装った偽旗工作の正体も暴かれた……これで敵の分断工作に反撃できる！',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/cdn_network.png',
          text: '核心鑑識データ『取引通信ソケット監査票＆脅迫添付Excel』を取得しました。第2章の真実が立証されました！',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '全セッション強制パージの実行により、不正注文は完全に停止した……！ ケイ、お前のおかげで最悪の炎上を止められたぞ！',
        },
        {
          speaker: 'narrator',
          text: 'その時、対策本部の巨大メインモニターが突如激しい砂嵐を走らせ、ある画面を映し出した。',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '……！？ な、なんだこれは……！？ 画面が勝手に切り替わった……？',
        },
        {
          speaker: 'kei',
          text: 'おい、待て……！ これはVPSの画面じゃないぞ！ ある被害者の【自宅PCのデスクトップ画面】だ……確定申告書、家族の写真、そしてChromeブラウザの個人情報フォルダーが……丸ごと映し出されている！？',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'な、なぜだ……！？ 被害者は自宅PCからVPSにリモート接続していただけのはずだ！ なぜクラウドの外にある【自宅PCの中身】が奪われているんだ……！？',
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
        },
        {
          speaker: 'narrator',
          text: '攻撃者から対策室とメディア宛てに『samples.zip』というアーカイブが送りつけられた。中身は被害者たちの「自宅PC」のデスクトップにあった確定申告書、家族写真、そしてChromeブラウザの暗号化パスワード保管ファイル『Login Data』。実に4,352ファイルが抜き取られ、10,891ファイルがリスト化されていた。',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'ケイ、被害者の自宅PCからはマルウェアが一切出ない。一体どこに突破口があるんだ！？',
        },
      ],
      choiceSteps: [
        {
          id: 'ch3_step1_rdp_config',
          type: 'forensic',
          badge: '⚡ CONFIG AUDIT / 構成ファイル生鑑識',
          question:
            '【構成ファイルの異常特定】マルウェアなしで自宅PCのCドライブを丸裸にした致命的な設定パラメータはどれか？',
          cutinText: 'リバースRDPの元凶を特定！ drivestoredirect:s:*！',
          cutinSub: '⚡ FORENSIC PROOF ESTABLISHED / 電脳鑑識立証',
          logBox: {
            title: 'NEODOTCOM_CONNECT.RDP [DEFAULT CONFIG SINCE 2019]',
            content:
              'screen mode id:i:2\nuse multimon:i:0\nadministrative session:i:1\ndrivestoredirect:s:*\nredirectclipboard:i:1\nprompt for credentials:i:1',
          },
          options: [
            {
              id: 'opt3_cfg_admin',
              label: 'administrative session:i:1',
              description: 'サーバーへの管理者コンソールセッション接続を要求するパラメータ。',
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
              label: 'drivestoredirect:s:*',
              description:
                'クライアント端末のすべての接続ドライブをサーバー側へ自動マウントするパラメータ。',
              isCorrect: true,
              reaction: [
                {
                  speaker: 'kei',
                  text: 'これだ……！ 『drivestoredirect:s:*』！ ローカルドライブの全自動リダイレクト共有設定！',
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  illustration: 'assets/evidence/honeypot.jpg',
                  text: 'ビンゴです！ 自宅PCからVPSに接続した瞬間、VPS側から自宅PCの全ドライブが『\\\\tsclient\\C』として自動認識されていました！',
                },
                {
                  speaker: 'kei',
                  text: '正規のRDPパイプラインだから、自宅PCのウイルス対策ソフトを完全に素通りして確定申告書やChromeのLogin Dataが吸い出されたんだ！',
                },
              ],
            },
            {
              id: 'opt3_cfg_clipboard',
              label: 'redirectclipboard:i:1',
              description: 'リモート端末とローカル端末の間でクリップボードを共有するパラメータ。',
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
              speaker: 'aria',
              sprite: 'aria',
              text: 'マスター！ 緊急警告です！！ 今まさに攻撃者が、調査用ハニーポット端末のCドライブから『Login Data』をコピーしようとしています！',
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
                },
                {
                  speaker: 'aria',
                  sprite: 'aria',
                  illustration: 'assets/evidence/honeypot.jpg',
                  text: 'カナリアトークン混入完了！ 攻撃者が自前の攻撃サーバーでこのファイルを解凍した瞬間、偽装プロキシの背後にある真のC2サーバー座標が逆探知されます！',
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
          illustration: 'assets/evidence/honeypot.jpg',
          text: '核心鑑識データ『クライアント接続構成ファイル＆共有API証跡』を取得しました。第3章の真実が立証されました！',
        },
        {
          speaker: 'narrator',
          text: 'リバースRDPの解明により、社内には勝利の空気が漂いかけた。しかし——その時、社内のすべてのプリンターと内線電話が一斉に狂ったように動き始めた！',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'ひっ……！？ プリンターから、犯行声明が一斉に印刷されている……！？ 全国の報道機関にもFAXが一斉送信されたぞ！',
        },
        {
          speaker: 'kei',
          text: '紙を寄越せ、なんて書いてある！？',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '【四重脅迫状】だ……！ ①国内外70社超の金融口座の破壊再開、②自宅PC個人情報のダークウェブ無制限公開、③内部システム構成の暴露、④数百万ドルの身代金要求……！ タイムリミットは明日10月24日12時！ 1秒でも遅れれば、すべてを実行すると……！！',
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
        },
        {
          speaker: 'narrator',
          text: '役員会議室からは、机を叩く怒号と悲痛な叫びが廊下にまで響き渡っていた。「身代金を払うべきだ！」「いや、払ってもデータが消える保証はない！」「約款には『サイバー攻撃による損害は免責』と明記されている！ 免責を盾に突っぱねるべきだ！」',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'ケイ、このままじゃ社内が空中分解する……！ 経営陣をどう説得すればいいんだ！？',
        },
      ],
      choiceSteps: [
        {
          id: 'ch4_step1_policy_debate',
          type: 'tactic',
          badge: '⚡ BOARDROOM DEBATE / 役員会ディベート：基本方針',
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
                  text: '約款の免責条項を破り捨てろ！ 被害者の不正取引損失を企業が100%直接補償し、身代金支払ゼロを全世界に宣言するんだ！',
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
                'FT4/FT5の『閲覧専用パスワード（Investor Password）』を顧客から提出させ、サーバー生履歴とVPS侵入時刻をミリ秒突合する',
              description:
                '出金権限を排した閲覧専用キーでブローカー生ログを取得し、VPS侵害タイムスタンプと完全一致検証。',
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
                  illustration: 'assets/evidence/active_memory.jpg',
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
        },
        {
          speaker: 'kei',
          text: '完璧だ。これで攻撃者の人質レバレッジは消滅した。だが……プライドを粉々に砕かれた攻撃者が、このまま引き下がるはずがない。',
        },
        {
          speaker: 'aria',
          sprite: 'aria',
          illustration: 'assets/evidence/active_memory.jpg',
          text: '核心鑑識データ『顧客実損算定マトリクス＆API照会監査票』を取得しました。第4章の真実が立証されました！',
        },
        {
          speaker: 'narrator',
          text: 'その刹那、対策本部の全通信端末が不吉な赤色点滅を開始し、モニターいっぱいに血塗られたようなメッセージが焼き付けられた。',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: '攻撃者からのダイレクトメッセージだ……！ 『よくも恥をかかせてくれたな。ならば最後のショーだ。10月27日12時までに100万ドルを支払わなければ、リバースRDPで掌握済みの【26,739台の自宅PCへ一斉にランサムウェアを投下】し、全家庭のPCを完全破壊して文房具に変えてやる』……だと！？',
        },
        {
          speaker: 'takamiya',
          sprite: 'takamiya',
          text: 'な、なんだって……！？ 2万6千台の自宅PCへの一斉無差別ランサムウェア投下……！？ そんなことされたら、全国の家庭と個人資産が壊滅するぞ……！！',
        },
        {
          speaker: 'kei',
          text: 'もはや一企業のインシデントじゃない……国家規模の凶悪サイバーテロだ！ だが、どうやってこのテロを止める……！？',
        },
      ],
    },
    {
      id: 5,
      number: 'CHAPTER 5',
      date: '10月24日 22:00〜未明',
      title: '能動的サイバー防御「発動第1号」と3つの壁の突破',
      subtitle: '法理の迷宮とカナリアの奇襲',
      requiredEvidence: 'canary_c2_origin',
      introDialogue: [
        {
          speaker: 'narrator',
          text: '10月24日深夜22時。26,739台の自宅PC破壊予告のタイムリミットまで、残された時間はわずか。',
        },
        {
          speaker: 'kei',
          text: '2万6千台の一般家庭PCへのランサムウェア一斉投下……この規模の攻撃を実行されたら、被害総額は数百億円に達する。一企業の防御の限界を完全に超えている！',
        },
        {
          speaker: 'narrator',
          text: 'その時、暗号化セキュア回線に突如、政府専用の最優先プロトコルが割り込んできた。画面に映し出されたのは、国家サイバー統括室（NCO）のクロダ統括官とミオ分析官。',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: 'ナギサ君、タカミヤ君。状況は把握している。2026年10月1日に施行された『能動的サイバー防御法（サイバー対処能力強化法）』を発動し、敵の司令塔へ非公然アクセス・無害化措置を撃ち込みたいところだが……現行法には【制度上の3つの壁】が存在する。',
        },
      ],
      choiceSteps: [
        {
          id: 'ch5_step1_legal_walls',
          type: 'forensic',
          badge: '⚡ LEGAL DEFENSE / 国家サイバー対処法理の構築',
          question:
            '【法理の突破】基幹インフラ15分野限定の壁、および2027年秋まで未施行の無同意通信取得の壁をどう突破するか？',
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
                '通常令状の取得には数日かかる！ 明日正午の26,739台破壊テロに間に合わない！ 警察官職務執行法等の緊急職権法理を構築せよ！',
              reaction: [
                {
                  speaker: 'kei',
                  text: '不正アクセス禁止法で被害届を出し、裁判所の捜査令状を待つべきでは？',
                },
                {
                  speaker: 'kuroda',
                  sprite: 'kuroda',
                  text: '甘い！ 通常令状の発付には数日を要する！ 明日正午の26,739台一斉ランサムウェア投下まで残り数時間だ。そんな猶予はない！',
                },
              ],
            },
            {
              id: 'opt5_law_police_duties',
              label:
                '民間企業の100%任意ログ提供で通信の秘密をクリアし、警職法6条の2（重大危害防止）による職権認知を成立させる',
              description:
                '被害企業の完全合意で通信の秘密侵害を回避し、個人の生命・財産への明白な危害を根拠に警察庁が職権介入。',
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
                  text: 'さらに2万6千人の自宅PC破壊予告は、個人の財産と生活に対する明白かつ重大な危害です！ 警察官職務執行法第6条の2に基づく職権認知要件を完全に満たしています！',
                },
                {
                  speaker: 'kuroda',
                  sprite: 'kuroda',
                  text: '……見事な法理論拠だ！ これで制度上の第1の壁（基幹インフラ外）と第2の壁（無同意通信取得）は完全に打ち破られた！',
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
          illustration: 'assets/evidence/nco_alert.png',
          text: '核心鑑識データ『国家サイバー対処法理・要件適合性審査レポート』を取得しました！',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: 'だが最後に立ち塞がる最大の壁……外国主権と『真の発信源特定』だ！ 誤ったサーバーを攻撃すれば外交上の重大問題になる！',
        },
        {
          speaker: 'kuroda',
          sprite: 'kuroda',
          text: '能動的サイバー防御を発動するには、サイバー通信情報監理委員会と外務大臣協議に対する【完全無欠の証拠連結（ロジックチェーン）】が必須だ！',
        },
        {
          speaker: 'kei',
          text: '望むところだ……！ アリア、これまで集めた全鑑識ファイルを手元に展開しろ！ 最後のパズルを完成させる！',
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
              '【法的根拠の立証】民間直接申請がなく基幹インフラ15分野に縛られる壁を突破し、国家機関が職権介入するための法理論拠を示す証拠を提示せよ！',
            correctEvidenceId: 'nco_three_walls_report',
            hint: '行政や警察が職権で動くための法律要件と、民間任意ログ提供を整理した鑑識レポートがあるはずだ！',
            reaction: [
              {
                speaker: 'kei',
                text: 'これを見てください、統括官！ 『国家サイバー対処法理・要件適合性審査レポート』です！',
              },
              {
                speaker: 'kei',
                text: '被害企業の100%任意ログ提供により通信の秘密侵害を回避し、さらに26,739人の個人財産への重大危害を根拠に、警職法6条の2による職権認知を成立させます！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                text: '見事だ……！ 法の壁は完全に打ち破られた！ だが次は攻撃ルートの物理的遮断だ！',
              },
            ],
          },
          {
            stepNumber: 2,
            title: 'STEP 2: 侵入経路の物理的遮断',
            question:
              '【物理的侵害ルートの立証】なぜ攻撃者はマルウェアなしで被害者の自宅PCを掌握できたのか？ 26,739台への無差別ランサムウェア投下を可能にした物理的接続設定の証拠を提示せよ！',
            correctEvidenceId: 'reverse_rdp_tsclient',
            hint: '被害者の自宅PCからファイルが奪われ、ランサムウェアが送り込まれようとしている物理的接続設定の証拠を探せ！',
            reaction: [
              {
                speaker: 'kei',
                text: '接続構成に潜んでいた『クライアント接続構成ファイル＆共有API証跡』です！',
              },
              {
                speaker: 'kei',
                text: 'drivestoredirect:s:* の記述により、ユーザーがVPSに接続した瞬間、VPS側から自宅PCのCドライブが全自動共有されていた！ 敵はこのリバースRDPのパイプラインを使ってランサムウェアを一斉配信する気です！',
              },
              {
                speaker: 'mio',
                sprite: 'mio',
                text: '接続パイプラインの構造を完全に特定！ 各プロバイダへ緊急パッチと共有遮断フィルタを同時展開します！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                text: 'よし！ そして最後に残る最大の謎……多段プロキシの奥に潜む真の発信源を特定する決定打を出せ！',
              },
            ],
          },
          {
            stepNumber: 3,
            title: 'STEP 3: 真C2特定と無害化措置の執行',
            question:
              '【最終決定打の立証】多段偽装プロキシの奥に潜む真の発信源を暴き、秒読み段階に入ったランサムウェア配信キューを完全消去するための最終決定打となる証拠を提示せよ！',
            correctEvidenceId: 'canary_c2_origin',
            hint: '多段プロキシの裏にある真のC2サーバー座標をピンポイントで捉えた逆探知テレメトリはどこにある！？',
            reaction: [
              {
                speaker: 'kei',
                text: 'これが最後の決定打だ！ Chapter 3でハニーポットに仕込んだ【ハニーポット端末・外部通信ビーコン記録】！',
              },
              {
                speaker: 'aria',
                sprite: 'aria',
                illustration: 'assets/evidence/c2_origin.png',
                text: 'マスターが自らリスクを取って敵に持ち帰らせたダミーLogin Dataが、攻撃者のアジトで解凍されました！ カナリア逆探知ビーコンが発火！ 真のC2サーバーIPアドレス【185.220.101.xx】および、26,739件のランサムウェア配信キューをピンポイントで捕捉しました！！',
              },
              {
                speaker: 'kuroda',
                sprite: 'kuroda',
                text: '全証拠の連結を確認！ 外務大臣協議・サイバー通信情報監理委員会の緊急承認を受理！ これより警察庁サイバー特捜隊およびNCOによる『特定妨害工作通信のアクセス・消去等措置（無害化措置）』を正式執行せよ！！',
              },
              {
                speaker: 'narrator',
                text: '暗黒の電脳空間で、無害化プログラムが光の矢となって放たれた。秒読みを刻んでいたランサムウェア配信キューは、一瞬にして完全消去されたのである！',
              },
            ],
          },
        ],
      },
    },
  ],
  epilogue: {
    title: 'EPILOGUE: 10月25日 04:30 — 静寂の反撃と夜明け',
    dialogue: [
      {
        speaker: 'narrator',
        text: '10月25日、午前4時30分。',
      },
      {
        speaker: 'narrator',
        text: '海外のC2サーバー内に展開されていた26,739件のランサムウェア配信キューと盗難データは、NCOと警察庁特捜隊の非公然アクセス措置により、痕跡ひとつ残さず完全に消去・無害化された。',
      },
      {
        speaker: 'takamiya',
        sprite: 'takamiya',
        text: '……終わったのか。26,739台の自宅PCから、ランサムウェアの危機が完全に消え去ったんだな。',
      },
      {
        speaker: 'kuroda',
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
        text: 'インシデントはこれで沈静化したが、2027年秋の本格法改正に向けて、官民連携の課題は山積みだ。俺たちの仕事は、まだ始まったばかりだな。',
      },
      {
        speaker: 'aria',
        sprite: 'aria',
        text: 'はい、マスター！ 亡霊（ゴースト）たちは去り、新しい朝がやってきます。',
      },
      {
        speaker: 'narrator',
        text: 'カーテンを開けると、東京の空が白み始めていた。26,739台の沈黙から始まった6日間の電脳金融戦争は、ここに静かなる勝利で幕を閉じたのである。',
      },
    ],
  },
  novelFullText: `
# GHOST PROTOCOL 〜26,739台の亡霊と能動的サイバー防御・発動第1号〜
## 著・監修：VOICE VISUAL NOVEL 電脳鑑識プロジェクト

---

### 【プロローグ：2026年10月19日 23:45 — 予兆なき暗転】

2026年10月19日、月曜日、深夜23時45分。
都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイのプライベート監視モニターが、断末魔のような警告音を吹き鳴らした。
「……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、API切断のアラートが連続で出ている……？」
自律電脳エージェントのアリアが緊急画面を展開した。
「マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました。稼働総数、推定26,739台。ほぼすべてがネットワークから蒸発し、応答を喪失しつつあります」
その直後、大学時代からの無二の親友であり、現場CSIRTリーダーのタカミヤ レンから悲痛な電話が入る。
「現場のAD（Active Directory）管理プレーンが全部乗っ取られた。2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が書き換えられている。我々は午前4時をもって、26,739台すべての強制シャットダウンを決断する……！」
午前4時、非常停止ボタンが押され、全サーバーが沈黙した。だがブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。
ここに、日本の金融・インフラ史上最大の電脳サスペンスが幕を開けた。

---

### 【Chapter 1：10月21日 04:00 — 26,739台の沈黙と『2秒で蒸発した400万円』】

10月21日午前4時、26,739台のWindows VPSが一斉に沈黙した。
ネット上には「サーバー停止直前に注文が乱発され、口座残高400万円が2秒でゼロになった」「全財産が消えた、返せ」というトレーダーの悲鳴と怒号が溢れる。
ケイたちは初動作戦として、被害口座の取引履歴から通貨ペアの偏りを徹底抽出。全口座で極めてスプレッドの広い超マイナー通貨ペアが狙われている事実を暴いた。
だが金融機関には厳格な本人名義出金制限と二段階認証がある。攻撃者は1円も自分の口座へ出金できない。金を盗めないのに、なぜ他人の口座をゼロにするのか？
アリアとケイは取引ログをミリ秒単位で徹底解析した。
注文コメント欄に刻まれていたのは『DEMOFASTLOSS』という攻撃者のシグネチャ。
流動性の極めて低い高スプレッド通貨ペアで、0.1秒間隔の超高速往復売買を繰り返すことで、口座残高を手数料として市場へ蒸発させていたのだ。
「資金を出金できないからこそ、顧客資産を焼き払って人質にし、インフラ企業を脅迫する」という第4世代の金融口座焼却型恐喝が看破された。
だが安堵した瞬間、対策本部のホットラインに攻撃者から暗号化メッセージが届く。《無様な抵抗だ。第2報を出してユーザーにパスワード変更を呼びかけてみろ。貴様らの無力さを全国に晒してやる》。敵はこちらの手の内を完全に先読みしていた。

---

### 【Chapter 2：10月22日 19:30 — パスワード変更の死角と『Hacking Team』の分断工作】

第2報でユーザーにパスワード変更を求めた直後、またしても「パスワードを変えたのに今夜も勝手に取引されて口座が溶かされた」という報告が相次ぎ、ネットは企業の隠蔽を疑って大炎上した。
さらに攻撃者『Hacking Team (Dmitry Orlov)』から被害者へ直接、丁寧な日本語で「企業が隠蔽している証拠を提供する。集団訴訟を起こせ」という懐柔メールが届く。
ケイたちは二次被害防止のアナウンスを打つと同時に、生バイナリを緊急解剖。2つの技術的真相を暴いた。
第1に、金融取引端末FT4/FT5はWeb上でパスワードを変えても、既存の確立済みTCPソケットを強制切断（Session Kill）しない限り注文を受け続けるという仕様の罠。
第2に、攻撃者が送ってきたExcelファイルの内部XMLには、中国語版KPS Office特有の『工作表』というシート名が残存しており、ロシア系を騙る多国籍の偽旗工作（False Flag）が暴かれた。
全セッションの強制パージにより不正注文を鎮火させた瞬間、対策本部のメインモニターに、ある被害者の【自宅PCのデスクトップ画面】が突如映し出された。なぜクラウドの外にある自宅PCが抜かれているのか……！？

---

### 【Chapter 3：10月23日 15:00 — クラウドから自宅PCへの逆流（\\\\tsclient\\C）】

攻撃者から『samples.zip』が送りつけられた。中身は被害者の「自宅PC」の確定申告書やChromeブラウザの暗号化パスワード保管ファイル『Login Data』だった。4,352ファイルがコピーされ、10,891ファイルがリスト化されていた。
だが自宅PCからはマルウェアが一切検出されない。
原因は、2019年から配布されていた接続用『.rdp』ファイルにあった。
ファイル内に『drivestoredirect:s:*』が記述されていたため、自宅PCからVPSへリモート接続した瞬間、VPS側から被害者のCドライブが『\\\\tsclient\\C』として丸見えになっていたのだ。
マルウェアを使わずに自宅PCを丸裸にする「リバースRDP」。
アリアは機転を利かせ、ハニーポット自宅PCのダミーLogin Data内に「逆探知用カナリアトークン」を密かに仕込んだ。
その直後、攻撃者から全メディアと対策室へ【四重脅迫状】が叩きつけられる！ 金融口座破壊の再開、自宅PC情報のダークウェブ公開、内部構成暴露、身代金要求。タイムリミットは翌日正午！

---

### 【Chapter 4：10月24日 11:50 — 四重脅迫への反撃：実損100%直接補償というゲーム理論】

タイムリミットまで数十分。約款には「サイバー攻撃免責」とあり、役員会は怒号に包まれる。
突っぱねれば集団訴訟で会社は倒産、身代金を払っても破滅。
ケイはゲーム理論に基づく歴史的決断を提示した。
「攻撃者への支払ゼロ」を宣言し、約款を超えて「不正取引による実現損失の100%直接補償＋見舞金5,000円＋半年無償移行」を断行する。
さらにFT4/FT5の「閲覧専用パスワード（Investor Password）」とVPS不正アクセス時刻を突合することで、モラルハザードを防ぐ客観的損害査定を完遂。
顧客と企業が再び一体となったことで、攻撃者が持っていた人質レバレッジは完全に崩壊した。
だが狂乱した攻撃者から血文字のような最後通牒が届く。《10月27日12時までに100万ドル払わなければ、リバースRDPで掌握した26,739台の自宅PCへ一斉にランサムウェアを投下し完全破壊する》。国家規模のサイバーテロへエスカレートした！

---

### 【Chapter 5：10月24日 22:00〜未明 — 能動的サイバー防御「発動第1号」と3つの壁】

26,739台の自宅PC破壊予告まで数時間。
国家サイバー統括室のクロダ統括官とミオ分析官が緊急介入するが、2026年10月1日施行の「能動的サイバー防御法」には制度上の3つの壁（民間直接申請不可、無同意通信取得制限、真発信源特定の壁）が存在した。
ケイたちはこれまで手に入れた6つの鑑識証拠を結集し、最後の推論連結（FINAL DEDUCTION）を挑む。
第1に、企業の100%任意ログ提供と警職法6条の2（重大危害防止）による職権認知を立証して制度の壁を突破。
第2に、リバースRDP（drivestoredirect:s:*）の接続経路を暴いて物理パイプラインを遮断。
第3に、アリアが仕掛けていた「カナリア逆探知ビーコン」が敵の解凍によって奇跡的に発火し、真のC2サーバーIP（185.220.101.xx）とランサムウェア配信キューを捕捉！
全証拠の連結を認めたクロダ統括官の号令のもと、警察庁特捜隊とNCOによる史上初の「非公然アクセス・無害化措置」が秒読み段階で断行された。

---

### 【エピローグ：10月25日 04:30 — 静寂の反撃と夜明け】

海外C2のランサムウェア配信キューは完全に消去され、26,739台の日常は守られた。
政府は「手の内を明かさない」原則のもと発動を公表しない。
だが夜明けの空を見上げるエンジニアたちの胸には、見えない盾となって国家の危機を跳ね返した静かな誇りが刻まれていた。
`,
};
