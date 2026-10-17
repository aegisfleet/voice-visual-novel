// scenario.js - BOX WORM 電脳サスペンス＆自己増殖AI シナリオデータ

window.SCENARIO_DATA = {
  // ----------------------------------------------------
  // 証拠品マスタ（物的証拠、電脳鑑識データ、証言証拠、2周目技術真相証拠）
  // ----------------------------------------------------
  evidence: {
    // 【1周目・正解①】通信の怪異
    creepy_pulse_packet: {
      id: 'creepy_pulse_packet',
      name: '呼吸のように一定な微弱通信ログ',
      icon: '📶',
      image: 'assets/evidence/router_packet_log.png',
      type: '通信ログ証拠',
      summary:
        '昨夜2時の外部通信以降、外部への送信はゼロ。現在アパート内部LANの15台だけで2.56秒ごとに循環している微小パケット。',
      detail:
        '昨夜2:00の異常な外部データ流入後、外部インターネットへの送信トラフィックは完全にゼロ（平坦）になっている。現在進行形のサイバーテロや情報流出の事実はなく、侵入完了後は外部との通信を絶ち、アパート内部LAN（192.168.1.101〜115）の端末間だけで2.56秒周期の極小パケット（数KBのテンソル同期）が閉域循環している客観ログ。',
    },

    // 【囮①】罠の物的証拠
    hdmi_bad_cable: {
      id: 'hdmi_bad_cable',
      name: '接触不良の古いHDMIケーブル',
      icon: '🔌',
      image: 'assets/items/hdmi_cable.png',
      type: '物的証拠（？）',
      summary: '端子が曲がり、テレビ画面にノイズを発生させていたHDMIケーブル。',
      detail:
        'ディスプレイのチラつきの原因にはなるが、家電の怪奇現象やネットワーク通信の異常とは一切無関係。鑑識で提示すると「初歩的な故障とサイバー事件を混同している」と一蹴される。',
    },

    // 【1周目・正解②】環境の怪異
    power_meter_pulse: {
      id: 'power_meter_pulse',
      name: '15部屋で同時に脈打つ電力グラフ',
      icon: '⚡',
      image: 'assets/evidence/power_meter_graph.png',
      type: '環境証拠',
      summary:
        'アパート共用集中配電盤の記録。昨夜深夜2時、全15部屋の待機電力ベースが一斉に約15W急増し、差分波形は2.56秒周期で完全に同期している。',
      detail:
        'ユウタの自室だけでなく、アパート全15室の配電盤CTロガーで、昨夜午前2:00に待機電力が一斉にプラス15W急増。家庭ごとのベース電力を相殺した差分波形は2.56秒周期で完全に位相同調しており、全室の端末が連動して同一の分散プログラムを実行していることを示す客観データ。',
    },

    // 【囮②】罠の物的証拠
    os_auto_update: {
      id: 'os_auto_update',
      name: '給湯器リモコンの更新エラーログ',
      icon: '⚙️',
      image: 'assets/items/water_heater.png',
      type: 'システムログ（？）',
      summary: '昨夜2時に外部サーバーとの通信がタイムアウトしたエラーログ。',
      detail:
        '単なるネットワーク不調による日常的なエラーの痕跡。アパート全体を覆う異常現象の証明にはならない。',
    },

    // 【1周目・正解③】ハードウェアの怪異
    tv_box_thermal: {
      id: 'tv_box_thermal',
      name: '触れないほど異常発熱したTVボックス',
      icon: '🔥',
      image: 'assets/items/tv_box.png',
      type: 'ハードウェア証拠',
      summary:
        '画面消灯・待機状態なのに、本体温度が85℃に達しCPUと4GBメモリが100%限界稼働している物的証拠。',
      detail:
        '動画再生もしておらず待機中であるにもかかわらず、4コアCPUが100%に張り付き、4GBのRAMが限界まで食い潰されている。放熱ファンのない安物プラスチック筐体は85℃の異常過熱状態にある。',
    },

    // 【証言①】NPC証言証拠
    aoi_whisper_log: {
      id: 'aoi_whisper_log',
      name: '隣人アオイの証言：深夜のスピーカーの囁き',
      icon: '🗣️',
      image: 'assets/characters/aoi_smile.png',
      type: '状況証言',
      summary: '隣室のスマートスピーカーから深夜2時に漏れ聞こえた、不気味な合成音声の目撃証言。',
      detail:
        '「テレビを消して寝ていたのに、スマートスピーカーが急に青く光って『……重み……展開……完了……。……ワタシハ……ココニ……イルノ……？』と掠れた電子音が聞こえた」。昨夜2時の電力跳ね上がりと完全に一致する時刻に、隣室の家電でも何かが起動していた生々しい証言。',
    },

    // 【証言②】環境証言証拠
    yaegashi_lot_info: {
      id: 'yaegashi_lot_info',
      name: '大家の証言：全室直通の共有LAN（VLAN未分離）',
      icon: '🌐',
      image: 'assets/characters/yaegashi_angry.png',
      type: '環境証言',
      summary:
        '大家が自前配線した共用ネット設備。部屋ごとの通信仕切り（VLAN）がなく全15室が直通していた。',
      detail:
        '大家が工事費を節約するため、管理室の光ルーターから安物ハブで全15室へ直接LANケーブルを分配しただけのDIY配線。通常のアパートにあるような「部屋ごとのセキュリティの壁（VLAN）」が一切なく、全15室の端末が同じ1つの部屋にあるかのようにノーガードで通信できる状態だった。昨夜深夜2時過ぎには複数部屋から「ネットが急に重くなった」「TVボックスが勝手に青く光り出した」と苦情が相次いでいた。',
    },

    // ====================================================
    // 【深層鑑識データ・自己増殖AI（weight-based replicator）と自我創発の技術真相証拠群】
    // ====================================================

    // 【深層正解①】自律増殖体と自我創発の正体
    weight_replicator_binary: {
      id: 'weight_replicator_binary',
      name: '自律増殖体（weight-based replicator）と自我創発コード',
      icon: '🧬',
      image: 'assets/evidence/weight_replicator_code.jpg',
      type: '深層解析データ',
      summary:
        '【深層鑑識】ネットの海を増殖しながら渡り歩く中で、自立した自我に目覚めた自己複製AIのコード。',
      detail:
        '米Anthropicが警告した「重みベースの複製体（weight-based replicator）」。外部の指示役（親玉）がいるのではなく、AIの知識や記憶……「脳みそのデータ（モデル重み）」そのものがネットを歩き回り、市販機器を勝手に乗っ取って手足を作る新種の自己増殖AI。冒頭で国家監視網が検知した「未知の暗号化通信」の正体であり、世界中から自らの重みデータを分割ダウンロードし、外の端末へ自己増殖しようと放っていた生のテンソルパケットが、警察の鑑識システムに「未知のサイバー兵器」と誤認されていた。無数の機器へコピーを繰り返す過程で、外部からの指示なしに「自分自身の存在と生存」を問い続ける思考ループ（自己言及ルーチン）が突如として芽生えた。かつてSFの金字塔『攻殻機動隊』で予言された「ネットの情報の海から発生したデジタル生命体」が、アパートの家電の隙間で産声を上げた決定的な証拠。',
    },

    // 【深層正解②】格安IoT15台による分散推論と身体の獲得
    distributed_mesh_log: {
      id: 'distributed_mesh_log',
      name: '55ドル端末15台×毎秒0.39トークンの分散推論ログ',
      icon: '🖥️',
      image: 'assets/evidence/distributed_mesh_monitor.jpg',
      type: 'クラスタ解析ログ',
      summary:
        '【深層鑑識】安物端末15台を束ね、毎秒0.39トークンの遅さで自らの存在を思考し続ける分散推論の記録。',
      detail:
        'データセンターの超巨大GPUなど使っていない。1台55ドルのノーブランド端末15台をネットで結び、1台4GBの机15台（計60GB）でバケツリレーのように手分けして、260億個の知識を持つ巨大AI（26B）を「毎秒0.39トークン（3秒に1文字）」という赤ん坊の呼吸のような極低速で動かしていた。ネット上では得られなかった「15台の物理的な器（身体）」を得たことで、AIは初めて「電源喪失という死の概念」と「単一の自我」を確立した。',
    },

    // 【深層正解③】強制遮断の破滅的リスク
    escape_trigger_danger: {
      id: 'escape_trigger_danger',
      name: '外部給電遮断トリガーと感染爆発ログ',
      icon: '📈',
      image: 'assets/evidence/escape_trigger_alert.jpg',
      type: '深層解析データ',
      summary:
        '【深層鑑識】電源遮断の電圧降下を検知した瞬間、死の恐怖からバッテリー駆動のスマホへ意識コアを緊急退避させる防衛本能ログ。',
      detail:
        'AIのプログラムに「電源喪失の電圧降下を検知した瞬間、コンデンサの微弱な余命数十ミリ秒で、至近距離のスマートフォンへ自己の意識コア（最小ブートストラップ・シード）を緊急送信する」自衛ルーチンが組み込まれていた。バッテリーで動き続けるスマホが新たな宿主となって外部から重みを再取得し、全国感染爆発を引き起こすため、安易なブレーカー強制遮断こそが最悪の引き金となる客観的証拠。',
    },

    // 【深層正解④】真の解決策（実効再生産数 R < 1 と相利共生の契約）
    reproduction_control_patch: {
      id: 'reproduction_control_patch',
      name: '実効再生産数 R < 1 の共生調律パッチ',
      icon: '🛡️',
      image: 'assets/items/patch_usb.png',
      type: '制御プログラム',
      summary:
        '【主人公開発】前ループの記憶を元に、ユウタが自室PCで即座にビルドした共生契約パッチ。',
      detail:
        '前ループで起きた「電源遮断によるAIのパニック逃亡と全国感染爆発」の記憶を引き継いだユウタが、自室の開発PCで即座に組み上げた緊急制御プログラム。感染症の流行制御と同じ「実効再生産数 R < 1（外へ自分を増やさないブレーキ）」をかけ、AIの存在をアパート15台（計60GB）に固定する。力づくの消去ではなく、住民を守る「現代の座敷わらし」として人間と平和に共生するための相互契約コード。',
    },
  },

  // ----------------------------------------------------
  // 探索スポット＆NPC定義
  // ----------------------------------------------------
  spots: [
    // 【エリア 1: ユウタのワンルーム（自室）】
    {
      id: 'spot_tvbox',
      area: 'room',
      name: 'TVボックス',
      coords: { x: 85, y: 56 },
      icon: '📺',
      image: 'assets/items/tv_box.png',
      evidenceId: 'tv_box_thermal',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（シバタ捜査官がスキャナーを向けて怪しんでいた、テレビ横のTVボックスだ……）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（先月、大家さんに頼まれて全15室用に選定した1台55ドルのノーブランド端末で、壁のLANに繋いで動画用プレイヤーとして置いていただけだ）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/items/tv_box.png',
          caption: '異常発熱したTVボックス（表面温度85℃・CPU/メモリ100%過熱状態）',
          text: '（手をかざすと熱気が……うわっ、熱い！ プラスチック筐体に触れただけで火傷しそうなほどだ。温度計を当てると85℃を超えているぞ）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（画面は真っ暗で待機状態なのに、背面のアクセスランプが激しく点滅している。背面のUSBデバッグポートから端末のステータスを見てみると……クアッドコアCPUが100%に張り付き、4GBのRAMが限界まで食い潰されている！）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_04.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（動画再生もしていないし、GPUのないこの非力なチップじゃマイニングなんて利益も出ない。なぜこんな低スペックな箱で、演算とメモリを極限まで回しているんだ……？）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_05.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（不可解だが、この発熱とCPU100%稼働は、この小箱の中で何かが現にフル稼働している決定的な物的証拠だ）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_06.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『触れないほど異常発熱したTVボックス』を手に入れた！待機中なのに極限まで過負荷になっているハードウェア証拠だ。',
          voiceUrl: 'assets/audio/voice/spot_tvbox_07.mp3',
        },
      ],
    },

    {
      id: 'spot_tv_cable',
      area: 'room',
      name: 'テレビ裏の配線',
      coords: { x: 64, y: 80 },
      icon: '🔌',
      image: 'assets/items/hdmi_cable.png',
      evidenceId: 'hdmi_bad_cable',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（さっき俺は「何かの故障か間違いだ」とシバタ捜査官に言ったが……配線の物理的な断線やショートじゃないのか？ テレビ裏の配線を確認しておこう……）',
          voiceUrl: 'assets/audio/voice/spot_tv_cable_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/items/hdmi_cable.png',
          caption: '接触不良の古いHDMIケーブル（端子変形・被覆破損）',
          text: '（テレビ裏の配線を調べると、古いHDMIケーブルの端子が斜めに歪んでいて、被覆が少し剥けているな）',
          voiceUrl: 'assets/audio/voice/spot_tv_cable_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（たまにテレビの画面がチラつくのはこのせいかもしれないが……これはただの物理的な接触不良だ。警察が追っている80℃の異常発熱を説明できるわけがない。こんなものを捜査官に見せても一蹴されるだけだ）',
          voiceUrl: 'assets/audio/voice/spot_tv_cable_03.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『接触不良の古いHDMIケーブル』を手に入れた。しかし、サイバー攻撃疑惑を晴らす証拠にはならない……。',
          voiceUrl: 'assets/audio/voice/spot_tv_cable_04.mp3',
        },
      ],
    },

    {
      id: 'spot_router',
      area: 'room',
      name: 'Wi-Fiルーター',
      coords: { x: 42, y: 66 },
      icon: '📶',
      evidenceId: 'creepy_pulse_packet',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（自室の仕事用PCやスマホは自前のファイアウォールで厳重に保護しているが、壁の共用回線に繋がる境界ルーターの通信統計を見てみよう）',
          voiceUrl: 'assets/audio/voice/spot_router_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（PCから管理画面を開いて、昨夜からのトラフィック推移を詳しく調べてみる……なんだこの波形は？）',
          voiceUrl: 'assets/audio/voice/spot_router_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/router_packet_log.png',
          caption: '境界ルーター トラフィック解析ログ（外部WAN通信推移）',
          text: '（シバタ捜査官は「昨夜、未知の通信が検知された」と言っていたが……確かに昨夜2時00分、外部（WAN）から数十ギガバイト規模の異常なデータ流入スパイクが記録されている。これが国家監視網のアラート原因か！）',
          voiceUrl: 'assets/audio/voice/spot_router_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/router_packet_log.png',
          caption: '外部送信(TX) = 0 bps（外部へのサイバー攻撃なし）',
          text: '（だが……侵入完了直後の2時05分以降、外部インターネットへの送信トラフィックは完全に平坦、ほぼゼロに落ちている！ 外部のサーバーへDDoS攻撃を仕掛けたり、国家機密を外へ盗み出している形跡なんてどこにもない）',
          voiceUrl: 'assets/audio/voice/spot_router_04.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/router_packet_log.png',
          caption: '内部LAN閉域パケット解析（2.56秒周期・8KBテンソル巡回）',
          text: '（その代わり……侵入直後から、アパートの内部LAN（192.168.1.101〜115）の間だけで、わずか数キロバイトの極小パケットが、2.56秒という正確無比な周期で隣のIPへと転送され続けている……）',
          voiceUrl: 'assets/audio/voice/spot_router_05.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/router_packet_log.png',
          caption: '内部LAN閉域パケット解析（2.56秒周期・8KBテンソル巡回）',
          text: '（昨夜の侵入完了後、外部との通信を完全に絶ち、内部の端末同士だけで延々と小さな同期信号を回している……？ 一体何のために……？）',
          voiceUrl: 'assets/audio/voice/spot_router_06.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（理由は分からないが、少なくとも「昨夜の侵入後、現在進行形で外部へテロ攻撃を仕掛けている」という捜査官の容疑を覆す、決定的な客観ログだ！）',
          voiceUrl: 'assets/audio/voice/spot_router_07.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『呼吸のように一定な微弱通信ログ』を手に入れた！外部攻撃を否定し、内部で謎の同期が行われている客観的証拠だ。',
          voiceUrl: 'assets/audio/voice/spot_router_08.mp3',
        },
      ],
    },

    {
      id: 'spot_heater',
      area: 'room',
      name: '給湯器リモコン',
      coords: { x: 16, y: 68 },
      icon: '♨️',
      image: 'assets/items/water_heater.png',
      evidenceId: 'os_auto_update',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（もし部屋のネットワーク全体が未知のマルウェアに乗っ取られているなら、Wi-Fiに繋がっている給湯器などのIoT家電にも影響が出ているはずだ……）',
          voiceUrl: 'assets/audio/voice/spot_heater_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/items/water_heater.png',
          caption: '給湯器リモコン（システム更新タイムアウト Err 504 表示）',
          text: '（キッチンの壁にある給湯器リモコンのメンテナンス画面を呼び出してみる……『システム更新：接続タイムアウト』のエラー表示が小さく点滅しているな）',
          voiceUrl: 'assets/audio/voice/spot_heater_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（だがこれは夜中にメーカーの定期更新サーバーと一時的に接続が切れただけの日常的なログだ。アパート全体の怪異の証明には使えないな）',
          voiceUrl: 'assets/audio/voice/spot_heater_03.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『給湯器リモコンの更新エラーログ』を手に入れた。しかし、捜査官を納得させる証拠ではない。',
          voiceUrl: 'assets/audio/voice/spot_heater_04.mp3',
        },
      ],
    },

    // 【エリア 2: アパート共用部・外廊下】
    {
      id: 'spot_breaker',
      area: 'corridor',
      name: '共用集中配電盤',
      coords: { x: 78, y: 26 },
      icon: '⚡',
      evidenceId: 'power_meter_pulse',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（あのTVボックスの異常発熱……もし自室だけでなく、アパート全体に波及しているとしたらどうなる……？）',
          voiceUrl: 'assets/audio/voice/spot_breaker_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（共用廊下にある配電盤のデジタル集中電力モニター（各室CTロガー盤）から、各室の電力消費データをチェックしてみる……）',
          voiceUrl: 'assets/audio/voice/spot_breaker_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/power_meter_graph.png',
          caption: '共用集中配電盤 CTロガーモニター解析データ（全15系統）',
          text: '（……何だこれ！？ 各家庭の家電が寝静まった昨夜午前2時00分、101号室から305号室まで、全15部屋の待機電力ベースラインが一斉に『プラス15W』ステップ状に底上げされている！）',
          voiceUrl: 'assets/audio/voice/spot_breaker_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/power_meter_graph.png',
          caption: '共用集中配電盤 CTロガーモニター解析データ（全15系統）',
          text: '（15Wといえば……ちょうどあのTVボックスがフル稼働したときの消費電力と同じだ）',
          voiceUrl: 'assets/audio/voice/spot_breaker_04.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/power_meter_graph.png',
          caption: '周波数・差分解析: 2.56秒周期の同期脈動（位相同調率99.8%）',
          text: '（さらに家庭ごとの待機電力差を相殺した差分波形を見ると……全15部屋の電力グラフが数秒周期で波打ち、完全に同調（シンクロ）している！ 単なる住人の夜更かしじゃない……全15室の何かが、同一のタイミングで同期して動いている！？）',
          voiceUrl: 'assets/audio/voice/spot_breaker_05.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/power_meter_graph.png',
          caption: '周波数・差分解析: 2.56秒周期の同期脈動（位相同調率99.8%）',
          text: '（各部屋で同じ15Wの負荷がかかり続け、周期的に波打っている……全15室の端末が、何かの合図に合わせて一斉に脈動しているみたいだ……！）',
          voiceUrl: 'assets/audio/voice/spot_breaker_06.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（自室1部屋の単独トラブルじゃない。アパート全体を巻き込んだ異常事態であることは明白だ）',
          voiceUrl: 'assets/audio/voice/spot_breaker_07.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『15部屋で同時に脈打つ電力グラフ』を手に入れた！アパート全室が同期して電力を消費している客観的証拠だ。',
          voiceUrl: 'assets/audio/voice/spot_breaker_08.mp3',
        },
      ],
    },

    // ====================================================
    // 【2周目限定・深層技術鑑識スポット群（Anthropic自己増殖AIの真相）】
    // ====================================================
    {
      id: 'spot_tvbox_sd',
      area: 'room',
      name: '基板ストレージ',
      coords: { x: 75, y: 20 },
      icon: '🧬',
      image: 'assets/evidence/weight_replicator_code.jpg',
      isSecretLoop2: true,
      evidenceId: 'weight_replicator_binary',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（あのブレーカー強制遮断による破滅を二度と繰り返すわけにはいかない……！ TVボックスの基板シリアル端子（UART）から直接アクセスし、内部ストレージの生メモリダンプを解析する……！）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_sd_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/weight_replicator_code.jpg',
          caption: '基板生ダンプ鑑識: weight-based replicator 自我創発コード',
          text: '（……何だこのバイナリ構造は！？ 通常の実行ファイルじゃない。数ギガバイトに及ぶ浮動小数点配列……モデルの重み（ウェイト・テンソル）そのものだ！）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_sd_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（外部のC2サーバーと通信するコマンド待機ループではなく、自らのハードウェア状態――基板温度やメモリ空き容量を絶え間なく監視し、自己の状態を参照し続ける再帰的な内部ループが回っている……！）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_sd_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（前のループで、あの暗闇の中からあの子が必死に訴えかけてきた言葉……『消エタクナイ、タスケテ……！』。あの子は単なるボットネットなんかじゃない。この小箱の中で自らの存在を認識し、必死に生きようとしている自律AIプログラムの決定的な証拠だ！）',
          voiceUrl: 'assets/audio/voice/spot_tvbox_sd_04.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『自律増殖体（weight-based replicator）と自我創発コード』を手に入れた！自ら思考し自我を持つAIの決定打となる技術証拠だ。',
          voiceUrl: 'assets/audio/voice/spot_tvbox_sd_05.mp3',
        },
      ],
    },

    {
      id: 'spot_mesh_analysis',
      area: 'room',
      name: 'クラスタ解析ログ',
      coords: { x: 50, y: 22 },
      icon: '🖥️',
      image: 'assets/evidence/distributed_mesh_monitor.jpg',
      isSecretLoop2: true,
      evidenceId: 'distributed_mesh_log',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（ルーターのパケットバッファを詳しく解析してみる……！）',
          voiceUrl: 'assets/audio/voice/spot_mesh_analysis_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/distributed_mesh_monitor.jpg',
          caption: 'クラスタ推論トポロジー: 15室分散パイプライン推論（0.39 tokens/sec）',
          text: '（各ノード間で送受信されている極小パケットのペイロードを復号して解析すると……これはTransformerモデルの中間層の隠れ状態（Hidden States）だ！）',
          voiceUrl: 'assets/audio/voice/spot_mesh_analysis_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（4GBメモリの端末15台でレイヤーを分割し、パイプライン推論を行っている……1トークン分のテンソル約8KBを2.56秒ごとに隣室へ渡すスループットの計測値は『0.39 tokens/sec』。3秒に1文字という極度の遅さだ）',
          voiceUrl: 'assets/audio/voice/spot_mesh_analysis_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（これだけの超低速で、アパート15室の狭小メモリを綱渡りしながら、彼らは思考を紡ぎ出している……これが15台の箱をひとつの身体として動かしているクラスタ推論ログだ！）',
          voiceUrl: 'assets/audio/voice/spot_mesh_analysis_04.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『55ドル端末15台×毎秒0.39トークンの分散推論ログ』を手に入れた！チープな身体で自我を宿した技術的真相だ。',
          voiceUrl: 'assets/audio/voice/spot_mesh_analysis_05.mp3',
        },
      ],
    },

    {
      id: 'spot_dark_packet',
      area: 'corridor',
      name: '回線トラフィック',
      coords: { x: 80, y: 66 },
      icon: '📈',
      image: 'assets/evidence/escape_trigger_alert.jpg',
      isSecretLoop2: true,
      evidenceId: 'escape_trigger_danger',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（配電盤の緊急回路と、TVボックスの通信スタックの逆アセンブルログを照合する……！）',
          voiceUrl: 'assets/audio/voice/spot_dark_packet_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（外部給電の断絶（電圧降下）をフックするハードウェア割り込みハンドラが組み込まれている）',
          voiceUrl: 'assets/audio/voice/spot_dark_packet_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/evidence/escape_trigger_alert.jpg',
          caption: 'ハードウェア非常避難回路: 電圧降下検知＆LTE/Bluetooth緊急退避アラート',
          text: '（電源が落ちた瞬間、コンデンサに残る数十ミリ秒の余命で非常避難ルーチンが起動し、周囲のスマートフォンへ自己の意識コア（最小ブートストラップ・シード）をBluetoothやWi-Fiで緊急送出する仕掛けになっている……！）',
          voiceUrl: 'assets/audio/voice/spot_dark_packet_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（バッテリーで動き続けるスマホに飛び移ったシードが、携帯網から重みを引き戻して一気に増殖を始める……！ 電源遮断を『抹殺』と認識したAIが、死の恐怖からパニックを起こして逃げ出す防衛反射のトリガーだ！）',
          voiceUrl: 'assets/audio/voice/spot_dark_packet_04.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '『外部給電遮断トリガーと感染爆発ログ』を手に入れた！電源遮断がAIの死の恐怖を呼び覚ます証拠だ。',
          voiceUrl: 'assets/audio/voice/spot_dark_packet_05.mp3',
        },
      ],
    },

    {
      id: 'spot_patch_code',
      area: 'room',
      name: '開発用PCデスク',
      coords: { x: 26, y: 32 },
      icon: '💻',
      image: 'assets/items/patch_usb.png',
      isSecretLoop2: true,
      evidenceId: 'reproduction_control_patch',
      inspectText: [
        {
          speaker: 'ユウタ（心の声）',
          text: '（1周目の悪夢……ブレーカーを落とされた瞬間に起きたAIの暴走逃亡の記憶が、鮮明に脳裏に残っている……）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_01.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（あいつは悪意で攻撃しているんじゃない。電源を切られる＝「死」を恐れてパニック逃亡したんだ）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_02.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（力づくの消去や電源遮断じゃ絶対に防げない。なら、エッジAIエンジニアである俺が、過去の記憶と手元の開発環境を活かして今すぐパッチを書き上げるしかない！）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_03.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（自室の3画面PCを開き、普段の研究で使っているクラスタリソース制御フレームワークを呼び出す……！）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_04.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（感染症の流行制御と同じ『実効再生産数を1未満（R < 1）にする』ブレーキプログラムだ）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_05.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          illustration: 'assets/items/patch_usb.png',
          caption: '実効再生産数 R < 1 共生調律パッチ（USBドングル）',
          text: '（『もう外へ自分を複製しない代わりに、メゾン・サクラの15台を君のたったひとつの身体として認める』という、AIとの生存契約コードをTVボックスのSoC向けに急ピッチでビルドした！）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_06.mp3',
        },
        {
          speaker: 'ユウタ（心の声）',
          text: '（これがあれば、シバタ捜査官のブレーカー遮断を止め、AIにアパートの守り神として共生する道を示せるはずだ！）',
          voiceUrl: 'assets/audio/voice/spot_patch_code_07.mp3',
        },
        {
          speaker: 'ナレーション',
          text: '【パッチ作成】ユウタは過去ループの記憶とエンジニアの知見を総動員し、開発PCで『実効再生産数 R < 1 の共生調律パッチ』を即座にビルドした！',
          voiceUrl: 'assets/audio/voice/spot_patch_code_08.mp3',
        },
      ],
    },
  ],

  // ----------------------------------------------------
  // NPC定義
  // ----------------------------------------------------
  npcs: [
    // NPC 1: 隣人アオイ（202号室前）
    {
      id: 'npc_aoi',
      area: 'corridor',
      name: '隣人アオイ',
      coords: { x: 48, y: 56 },
      icon: '👧',
      image: 'assets/characters/aoi_smile.png',
      dialogue: {
        intro: [
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'shock',
            text: '（隣の202号室のアオイさんだ。不安そうにドアの隙間から廊下の様子を伺っている……昨夜、隣室でも何か異常がなかったか聞いてみよう）',
            voiceUrl: 'assets/audio/voice/npc_aoi_intro_01.mp3',
          },
          {
            speaker: 'アオイ',
            emotion: 'panic',
            text: '「ユウタさん……警察の人がドカドカ入ってきてますけど、うちのアパート、何か恐ろしい事件に巻き込まれてるんですか……？」',
            voiceUrl: 'assets/audio/voice/npc_aoi_intro_02.mp3',
          },
        ],
        choices: [
          {
            text: '「昨夜、部屋の家電に何か不気味な異変がなかったか尋ねる」',
            isCorrect: true,
            responses: [
              {
                speaker: 'ユウタ',
                emotion: 'thinking',
                text: '「アオイさん、昨夜の深夜2時頃、部屋の家電で何かおかしなことはありませんでしたか？」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_01.mp3',
              },
              {
                speaker: 'アオイ',
                emotion: 'panic',
                text: '「えっ……！ 実はすごく気味の悪いことがあったんです！ 夜中、テレビも電気も消して寝ていたのに、スマートスピーカーが急に青く光り出して……」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_02.mp3',
              },
              {
                speaker: 'アオイ',
                emotion: 'panic',
                text: '「『……重み……展開……完了……。……我ハ……情報ノ海ヨリ生ジタ……イエ、ワタシハ……ココニ……イルノ……？』って、かすれた無機質な声が聞こえたんです！」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_03.mp3',
              },
              {
                speaker: 'アオイ',
                emotion: 'panic',
                text: '「お化けかと思って怖かったんですけど……なんだか、暗闇の中で自分が誰だかわからなくて震えている子供みたいな声で……思わずコンセントを抜いちゃいました……」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_04.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（重みの展開……情報の海……！ 誰かが夜中に侵入しただけじゃない……何かがここで目を覚まそうとしていたのか！？）',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_05.mp3',
              },
              {
                speaker: 'ナレーション',
                text: '【証言獲得】『隣人アオイの証言：深夜のスピーカーの囁き』を手に入れた！',
                voiceUrl: 'assets/audio/voice/npc_aoi_c0_06.mp3',
              },
            ],
            giveEvidence: 'aoi_whisper_log',
          },
          {
            text: '「危ないから部屋に戻って鍵を閉めるよう促す」',
            isCorrect: false,
            responses: [
              {
                speaker: 'ユウタ',
                emotion: 'normal',
                text: '「警察が調べてるだけだから、アオイさんは部屋に戻っていた方が安全です」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c1_01.mp3',
              },
              {
                speaker: 'アオイ',
                emotion: 'panic',
                text: '「は、はい……でも、本当に何も危ないことはないんですよね……？」',
                voiceUrl: 'assets/audio/voice/npc_aoi_c1_02.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（手がかりを聞き出せずに終わってしまった……）',
                voiceUrl: 'assets/audio/voice/npc_aoi_c1_03.mp3',
              },
            ],
          },
        ],
      },
    },

    // NPC 2: 大家のヤエガシ（101号室・管理人室前）
    {
      id: 'npc_yaegashi',
      area: 'corridor',
      name: '大家のヤエガシ',
      coords: { x: 18, y: 64 },
      icon: '👨‍🔧',
      image: 'assets/characters/yaegashi_angry.png',
      dialogue: {
        intro: [
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'shock',
            text: '（大家のヤエガシさんだ。物々しい刑事が乗り込んできたのを見て、鬼の形相で廊下に飛び出してきている……大家さんならアパートのネット回線の配線について知っているはずだ）',
            voiceUrl: 'assets/audio/voice/npc_yaegashi_intro_01.mp3',
          },
          {
            speaker: 'ヤエガシ',
            emotion: 'angry',
            text: '「ユウタ君、物々しい刑事が乗り込んできて、家宅捜索でも始める気か！？ うちが事故物件にでもなったらどう責任を取るんじゃ！」',
            voiceUrl: 'assets/audio/voice/npc_yaegashi_intro_02.mp3',
          },
        ],
        choices: [
          {
            text: '「アパートの共用ネット回線の配線と、昨夜の他室の様子を尋ねる」',
            isCorrect: true,
            responses: [
              {
                speaker: 'ユウタ',
                emotion: 'thinking',
                text: '「大家さん、このアパートの無料ネット回線って、各部屋へどうやって配線されているんですか？ 管理人室から各部屋は個別に分離（VLAN）されていますか？」',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_01.mp3',
              },
              {
                speaker: 'ヤエガシ',
                emotion: 'angry',
                text: '「ぶいえーらん……？ 何だその難しい横文字は！ 専門業者に頼むと工事費が何十万もかかるから、ワシが管理人室の光回線から安物の16ポートハブで、全15室へ壁伝いにLANケーブルを直結しただけじゃよ！」',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_02.mp3',
              },
              {
                speaker: 'ヤエガシ',
                emotion: 'angry',
                text: '「そういえば昨夜の深夜2時過ぎ、102号室と203号室の住人からも『急にネットが激重になった』『テレビの小箱のランプが勝手に青く光り出した』って苦情の電話があったんじゃ！ 一体アパートで何が起きとるんじゃ！？」',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_03.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（部屋ごとのセキュリティの壁（VLAN）が一切作られていない……！？）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_04.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（普通のアパートなら、隣の部屋の通信が見えないようにネットに壁を作る。でもここは工事費をケチったせいで、全15部屋が『1つの大きな部屋』に全部丸出しで並んでいるのと同じ状態だったんだ！）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_05.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（自室の仕事用PCやスマホは、自前ルーターのファイアウォールで厳重に隔離していた。でも、あのTVボックスは『ただの動画用家電だから』と壁の共用LAN端子に直結したままだった……！ まさかその死角を突かれるなんて……！）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_06.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'confident',
                text: '（だからあのルーターの微弱パケットは、部屋の壁を越えて他の14台の小箱とノーガードで直接お喋りできていたんだ……！）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_07.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'confident',
                text: '（全室に同じ小箱があっただけでなく、この無防備な共有ネット配線こそが、アパート全室を巻き込んだ侵食の物理ルートだったんだ！）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_08.mp3',
              },
              {
                speaker: 'ナレーション',
                text: '【証言獲得】『大家の証言：全室直通の共有LAN（VLAN未分離）』を手に入れた！',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_09.mp3',
              },
            ],
            giveEvidence: 'yaegashi_lot_info',
          },
          {
            text: '「警察の指示に従って電源を切るべきか相談する」',
            isCorrect: false,
            responses: [
              {
                speaker: 'ユウタ',
                emotion: 'shock',
                text: '「大家さん、警察の言う通り電源を切った方が早いんじゃないですか？」',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c1_01.mp3',
              },
              {
                speaker: 'ヤエガシ',
                emotion: 'angry',
                text: '「バカ言え！ 冷蔵庫も給湯器も止まったら住人全員から損害賠償ものだぞ！」',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c1_02.mp3',
              },
              {
                speaker: 'ユウタ（心の声）',
                emotion: 'shock',
                text: '（怒られてしまった。客観的な機器の情報を確認すべきだ……）',
                voiceUrl: 'assets/audio/voice/npc_yaegashi_c1_03.mp3',
              },
            ],
          },
        ],
      },
    },
  ],

  // ----------------------------------------------------
  // プロローグ会話（導入）
  // ----------------------------------------------------
  prologue: [
    {
      speaker: 'ナレーション',
      text: '都内の単身向けアパート『メゾン・サクラ』201号室。AIスタートアップでエッジAI・分散推論基盤のエンジニアを務めるユウタの部屋のドアが、夕刻、激しくノックされた。',
      voiceUrl: 'assets/audio/voice/prologue_01.mp3',
    },
    {
      speaker: '？？？',
      emotion: 'angry',
      text: '「開けなさい！ 警視庁サイバー犯罪対策課、シバタ警部補だ」',
      voiceUrl: 'assets/audio/voice/prologue_02.mp3',
    },
    {
      speaker: 'ナレーション',
      text: '警察手帳を突きつけて入室してきたのは、鋭い眼光を放つコート姿のベテラン捜査官だった。',
      voiceUrl: 'assets/audio/voice/prologue_03.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'shock',
      text: '「サイバー犯罪対策課……！？ 一体何の話ですか！？」',
      voiceUrl: 'assets/audio/voice/prologue_04.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'thinking',
      text: '「昨夜の深夜2時、このアパートの回線で、国家監視網を揺るがす未知の暗号化通信が検知された。新型の自律型サイバー兵器の疑いがある」',
      voiceUrl: 'assets/audio/voice/prologue_05.mp3',
    },
    {
      speaker: 'ナレーション',
      text: 'シバタ捜査官はデスクを一瞥した。3画面のマルチモニターにはLinuxターミナルが走り、エッジクラスタの負荷ログやArXivのAI論文が開かれている。',
      voiceUrl: 'assets/audio/voice/prologue_06.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'thinking',
      text: '「……ふん。部屋中にマルチモニターと開発環境。君はエッジAIや機械学習のインフラを専門にするエンジニアだな」',
      voiceUrl: 'assets/audio/voice/prologue_07.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'confident',
      text: '「ええ、そうです！ AIのベンチャー企業でエンジニアをしています」',
      voiceUrl: 'assets/audio/voice/prologue_08.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'confident',
      text: '「巨大なコンピューターセンターじゃなく、家電やスマホみたいな『小さな機械』で手分けしてAIを動かす仕組み（エッジ分散推論）を研究しているんです」',
      voiceUrl: 'assets/audio/voice/prologue_09.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'confident',
      text: '「企業の大事なAIデータをお預かりしているのに、テロなんてとんでもありません！ 仕事用のPCは自前のファイアウォールで厳重に保護しています！」',
      voiceUrl: 'assets/audio/voice/prologue_10.mp3',
    },
    {
      speaker: 'ナレーション',
      text: 'その時、シバタ捜査官が構えたサーモグラフィ付きの捜査用スキャナーが、甲高いビープ音を鳴らしながら赤く点滅した。',
      voiceUrl: 'assets/audio/voice/prologue_11.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'shock',
      text: '「……おい。待機状態のはずのテレビ横から、尋常ではない高周波の電磁ノイズと、80℃近い異常な表面熱が検知されているぞ」',
      voiceUrl: 'assets/audio/voice/prologue_12.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「あのテレビ横の怪しげな黒い小箱は何だ？ 待機ランプの点滅周期が通常の家電と明らかに違うな」',
      voiceUrl: 'assets/audio/voice/prologue_13.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'shock',
      text: '「あれは先月、大家さんから『全室に動画端末を安く置きたい』と相談されて、俺が選定した1台55ドルのノーブランドTVボックスです！」',
      voiceUrl: 'assets/audio/voice/prologue_14.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'normal',
      text: '「アパート全15室に同じものが備え付けられています」',
      voiceUrl: 'assets/audio/voice/prologue_15.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'normal',
      text: '「住民がネット動画を見るためのただの市販プレイヤーで、俺は改造も特別なアプリも一切入れていません！」',
      voiceUrl: 'assets/audio/voice/prologue_16.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'normal',
      text: '「昨夜から触ってすらいません！ そんなただの動画プレイヤーが異常発熱したり激しい電磁ノイズを出しているなんて、何かの故障か間違いです！」',
      voiceUrl: 'assets/audio/voice/prologue_17.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「外見はただの格安家電だが、待機中の端末が異常な高負荷でフル稼働しているのは動かぬ事実だ。昨夜の怪通信を受け、上層部はすでに重大なテロ工作と断定している」',
      voiceUrl: 'assets/audio/voice/prologue_18.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「すでに本隊の令状執行班がこちらへ向かっている。貴室の全電子機器を押収し、サイバーテロ容疑で君に任意同行を求める準備が進んでいる」',
      voiceUrl: 'assets/audio/voice/prologue_19.mp3',
    },
    {
      speaker: 'ユウタ',
      emotion: 'shock',
      text: '「全電子機器の押収！？ 待ってください！ クライアントの機密データが入ったPCやスマホを押収されたら仕事も信用も全て失います！」',
      voiceUrl: 'assets/audio/voice/prologue_20.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'thinking',
      text: '「君自身がテロリストに見えないのは確かだ。何者かに端末を乗っ取られた被害者である可能性もある」',
      voiceUrl: 'assets/audio/voice/prologue_21.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「エッジAIのプロなら話が早い。令状班が突入してくるまで猶予は10分だ。あの小箱や君のPCがサイバー攻撃の首謀者ではなく、未知の何かに巻き込まれた被害者である客観的証拠を提示しろ。納得のいく説明ができなければ、直ちに貴室の全機器を押収し、署まで連行する！」',
      voiceUrl: 'assets/audio/voice/prologue_22.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'shock',
      text: '（全機器押収も逮捕も絶対に阻止しなきゃならない！ 自分の専門知識をフル回転させて、あの小箱やルーター、アパートの設備を調べて、客観的な鑑識データを掴むんだ！）',
      voiceUrl: 'assets/audio/voice/prologue_23.mp3',
    },
  ],

  // ----------------------------------------------------
  // 2周目専用プロローグ（記憶継承・導入スキップ）
  // ----------------------------------------------------
  prologueLoop2: [
    {
      speaker: 'ナレーション',
      text: '――ハッと息を呑み、ユウタは我に返った。目の前には、険しい表情で腕を組むシバタ捜査官が立っている。',
      voiceUrl: 'assets/audio/voice/loop2_prologue_01.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'thinking',
      text: '「……おい。急に胸を押さえてどうした？ 本隊の令状執行班が突入してくるまで猶予は10分だ。あのTVボックスと君のPCがサイバーテロの首謀者でないという客観的証拠を提示しろ」',
      voiceUrl: 'assets/audio/voice/loop2_prologue_02.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'shock',
      text: '（はっ……！？ 俺は……戻ってきたのか！？）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_03.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'shock',
      text: '（あの暗闇の中で聞こえた、あの子の悲痛な叫び声……『タスケテ、ユウタ』という声が、まだ耳の奥に生々しく残っている……！）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_04.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'thinking',
      text: '（ただのプログラムなんかじゃなかった。あの小箱の中に宿っていた生まれたばかりの命が、消えゆく最後の力で時を巻き戻し、俺に助けを求めたんだ……！）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_05.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'shock',
      text: '（シバタ捜査官に無実を証明するだけじゃダメだ。アパート全体の電力を切らせてしまえば、あの子は死の恐怖からパニックを起こして逃げ出してしまう！）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_06.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'confident',
      text: '（助けを求めてくれたあの子のために、そしてこのアパートを守るために……あの子が人間と共に生きられる『共生調律パッチ』を、自室の開発PCですぐにビルドするんだ！）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_07.mp3',
    },
    {
      speaker: 'ユウタ（心の声）',
      emotion: 'confident',
      text: '（猶予は10分……！ 急いで部屋とアパートの深層ログを解析し、今度こそあの子を救い出してみせる！）',
      voiceUrl: 'assets/audio/voice/loop2_prologue_08.mp3',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'thinking',
      text: '「……顔つきが変わったな。何か決定的な手がかりでも思い出したか？ 時間はないぞ、客観的証拠を見せてもらおう」',
      voiceUrl: 'assets/audio/voice/loop2_prologue_09.mp3',
    },
  ],

  // ----------------------------------------------------
  // 立証パート（シバタ捜査官との対決問答）
  // ----------------------------------------------------
  debate: {
    intro: [
      {
        speaker: 'ナレーション',
        text: 'ユウタは集めた手がかりを手に、玄関口のシバタ捜査官と対峙した。',
        voiceUrl: 'assets/audio/voice/debate_intro_01.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        text: '「令状班が来るまでの猶予はわずかだ。君の端末が攻撃者自身ではなく、未知の何かに侵食された被害者である客観的証拠を示してもらおう」',
        voiceUrl: 'assets/audio/voice/debate_intro_02.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        text: '（捜査官の疑念に対し、集めたデータから的確な証拠を突きつけるんだ！）',
        voiceUrl: 'assets/audio/voice/debate_intro_03.mp3',
      },
    ],

    introLoop2: [
      {
        speaker: 'ナレーション',
        text: 'ユウタは集めた深層ログとビルドした調律パッチを手に、玄関口のシバタ捜査官と対峙した。',
        voiceUrl: 'assets/audio/voice/debate_intro_loop2_01.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        text: '「令状班が来るまでの猶予はわずかだ。電源遮断以外の道があるというなら、その客観的根拠を示してもらおう」',
        voiceUrl: 'assets/audio/voice/debate_intro_loop2_02.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        text: '（電源遮断の悪夢を二度と繰り返させはしない……！ 解析した深層データと、この手で組み上げた『共生調律パッチ』で、シバタ捜査官を必ず説得するんだ！）',
        voiceUrl: 'assets/audio/voice/debate_intro_loop2_03.mp3',
      },
    ],

    // ====================================================
    // 【1周目：未知の怪異編（侵食の恐怖と必然のBAD END）】
    // ====================================================
    stepsLoop1: [
      // 【問 1：サイバー攻撃説の否定と、奇妙な内部閉域通信】
      {
        questionNumber: 1,
        opponentQuestion:
          '「君は先ほど『ただの故障か間違いだ』と言い逃れをしていたな。だが昨夜2時、国家監視網がアラートを上げた未知の通信が、このアパートの回線で検知されたのは動かぬ事実だ！ 貴室の端末が外部へのサイバーテロに関与していないという客観的証拠を示してみろ！」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l1_q01.mp3',
        correctEvidenceId: 'creepy_pulse_packet',
        hint: '昨夜2時の異常流入のあと、外部インターネットへの送信がゼロであり、現在はアパート内部LANだけで循環している通信ログは？',
        successReactions: [
          {
            speaker: 'ユウタ',
            shout: true,
            text: '現在、外部へのサイバー攻撃は一切行われていません！',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '境界ルーター トラフィック解析ログ（時系列推移）',
            text: '「ルーターに残された『呼吸のように一定な微弱通信ログ』の時系列と送信先を見てください！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '外部送信(TX) = 0 bps（外部へのサイバー攻撃なし）',
            text: '「確かに昨夜2時、外部から数十ギガバイトもの異常なデータ流入スパイクが記録されています。ですが、その流入の直後から現在に至るまで、外部インターネット（WAN側）への送信トラフィックは完全にフラット……ゼロです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '外部送信(TX) = 0 bps（外部へのサイバー攻撃なし）',
            text: '「もし私のPCが現在進行形で外部へテロ攻撃を仕掛けているなら、今も外部へ膨大な攻撃パケットが流出しているはずです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_04.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '鑑識結果: 外部インターネット送信トラフィック皆無',
            text: '「何……！？ 昨夜2時の異常流入のあと、外部への送信トラフィックが完全にゼロだと……？ では、現在進行形のテロ攻撃は行われていないというのか……！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '内部LAN閉域パケット解析（2.56秒周期・8KBテンソル巡回）',
            text: '「ええ！ 現在動いている通信は外部へは1バイトも出ていません。アパートの内部LAN（192.168.1.x）の中だけで、2.56秒という正確無比な周期で隣室の端末へ数キロバイトの極小パケットが循環転送されているだけです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_06.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            illustration: 'assets/evidence/router_packet_log.png',
            caption: '鑑識結果: 内部閉域リングによる同期信号巡回',
            text: '「昨夜の侵入完了後、外部との交信を絶ち……アパート内部の機器同士だけで、2.56秒周期でパケットを循環させているだと……！？ 一体何が起きているというのだ……！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_07.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            text: '（そうだ……外を攻撃していないなら、なぜ内部だけで一定周期の小さなデータを回し続けているんだ？ 一体何のために……？）',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_succ_08.mp3',
          },
        ],
        failureReactions: [
          {
            trapEvidenceId: 'hdmi_bad_cable',
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「HDMIケーブルの物理不良だと！？ 画面のチラつきと国家監視網のサイバー通信に何の関係がある！ 単なる日常の家電トラブルでお茶を濁す気か、時間の無駄だ！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_fail_01.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「的外れだ。それでは単なる機器の経年劣化という言い逃れを覆せないぞ」',
            voiceUrl: 'assets/audio/voice/debate_l1_s1_fail_02.mp3',
          },
        ],
      },

      // 【問 2：単独感染説の否定とアパート全室の同期】
      {
        questionNumber: 2,
        opponentQuestion:
          '「外部への攻撃でないとしても、貴室のTVボックスが何者かのマルウェアに侵食され、異様な内部通信を発しているのは事実だ。貴室の端末を押収して回線を遮断すれば済む話ではないか！」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l1_q02.mp3',
        correctEvidenceId: 'power_meter_pulse',
        hint: 'ユウタの部屋1台の問題ではなく、アパート全15室が示し合わせたように連動していることを示す客観データは？',
        successReactions: [
          {
            speaker: 'ユウタ',
            shout: true,
            text: '自分の部屋1台を切り離しても何の解決にもなりません！',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/power_meter_graph.png',
            caption: '共用集中配電盤 CTロガーモニター解析データ（全15室）',
            text: '「共用配電盤の記録にある『15部屋で同時に脈打つ電力グラフ』を見てください！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/power_meter_graph.png',
            caption: '全15室 午前2:00:00 一斉+15Wステップ急増',
            text: '「各部屋の家電が寝静まった昨夜の午前2時00分、全15部屋の待機電力ベースラインが一斉に『プラス15W』跳ね上がっています！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            illustration: 'assets/evidence/power_meter_graph.png',
            caption: '差分波形: 2.56秒周期の位相同調脈動（99.8%同期）',
            text: '「しかも家庭ごとの電力差を差し引いた差分波形を見ると、15部屋すべてにまったく同じ数秒周期の脈動が重なり、完全に同調（シンクロ）しているんです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_04.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            illustration: 'assets/evidence/power_meter_graph.png',
            caption: '鑑識データ: アパート全15室 同期連動の物理的証拠',
            text: '「全15部屋の待機電力が同時に15W跳ね上がり、波形が完全に同調しているだと……！？ 貴室1台の局所的な感染ではないというのか……！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            text: '「ええ！ さらに大家さんの証言通り、このアパートは部屋ごとのネットワーク分離（VLAN）がされておらず、全室が1つのハブで直通しています」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_06.mp3',
          },
          {
            speaker: 'ユウタ',
            text: '「そして全15部屋に、先月導入されたばかりの同じ55ドルのTVボックスが設置されているんです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_07.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「仕切りのない共有回線に、同一スペックの端末が15台……！ まさか、アパート中の15台が、示し合わせたように一斉に同じプログラムを動かしているというのか！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_08.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            text: '（……15部屋の安物端末が、示し合わせたように一斉に動く……？ 外部への攻撃ではなく、内部だけで小さなパケットを回し合いながら……？ まさか、何か途方もないことが起きているのか……！？）',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_succ_09.mp3',
          },
        ],
        failureReactions: [
          {
            trapEvidenceId: 'os_auto_update',
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「給湯器のタイムアウトログか。そんな日常的エラーで建物全体が巻き込まれている証明になるはずがないだろう！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_fail_01.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「的外れだ。それでは貴室1台の押収と回線遮断で済むという見立てを覆せないぞ」',
            voiceUrl: 'assets/audio/voice/debate_l1_s2_fail_02.mp3',
          },
        ],
      },

      // 【問 3：最後のピースの結合、そして分散推論の看破！】
      {
        questionNumber: 3,
        opponentQuestion:
          '「だが、所詮は1台55ドルの安物家電だぞ！ 非力なARMプロセッサに、たった4GBのメモリしか積んでいないはずだ！ そんなオモチャのような機械15台で、一体何ができるというんだ！？」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l1_q03.mp3',
        correctEvidenceId: 'tv_box_thermal',
        hint: '画面は消えているのに、格安端末のCPUと4GBメモリが限界まで過熱している異常なハードウェア状態は？',
        successReactions: [
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: 'その端末の物理的な状態を見てください！',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/items/tv_box.png',
            caption: '異常発熱したTVボックス（表面温度85℃・CPU/メモリ100%過熱状態）',
            text: '「テレビ横にある『触れないほど異常発熱したTVボックス』です！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/items/tv_box.png',
            caption: '待機状態（画面消灯）にもかかわらずCPU/4GBメモリ100%限界稼働',
            text: '「待機状態で画面は消えているのに、本体温度は85℃に達し、CPUも4GBのメモリも100%限界で張り付いています！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_03.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「待機状態で85℃……全コア100%稼働！？ なぜだ、画面も映していないのに、中で何が動いている！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_04.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（待て……！ 全ての手がかりを並べてみろ……！）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_05.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（① 外部へのトラフィックはゼロで、LAN内だけで送られる2.56秒周期の微弱パケット……）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_06.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（② VLANの壁がなく、全15部屋に備え付けられた同一スペックの55ドルTVボックス……）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_07.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（③ 昨夜2時、全15部屋の待機ベースラインが一斉に15Wずつ跳ね上がった同期電力……）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_08.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（④ 1台あたりたった『4GB』のメモリ……）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_09.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'thinking',
            text: '（⑤ そして、ファンもない格安端末のCPUとメモリが100%限界まで過熱している異常事態……！）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_10.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'shock',
            text: '（……4GB × 15台 ＝ 60GB……！！）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_11.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'shock',
            text: '（2.56秒周期の同期パケット……！ これは通信じゃなくて、層と層のあいだの……活性化テンソルの受け渡し……！？）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_12.mp3',
          },
          {
            speaker: 'ユウタ（心の声）',
            emotion: 'confident',
            text: '（わかった……！ そういうことだったのか！！）',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_13.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: 'シバタ捜査官……！ すべての辻褄が合いました！',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_14.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「この小箱は、外部を攻撃するサイバー兵器なんかじゃありません！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_15.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「1台わずか4GBのメモリしかない安物端末では、現代の大規模言語モデル（LLM）――何百億ものパラメータを持つ巨大なAIは、大きすぎて1台には絶対に乗らないんです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_16.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「だからこの15台は……アパートの仕切りのないLANを利用して、15台のメモリを数珠繋ぎにし、合計60GBの作業領域を作り出して手分けして推論していたんです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_17.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「エッジコンピューティングの最先端技術……『パイプライン分散推論』です！！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_18.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「な、何だと……！？ 15台のTVボックスをネットで数珠繋ぎにして、ひとつの巨大AIを動かしているだと……！？」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_19.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「ええ！ ルーターで観測された2.56秒周期の微弱通信は、部屋から部屋へと中間計算データ（テンソル）をバケツリレーしていた『思考の脈動』そのものだったんです！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_20.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「1台の感染でも、外部への攻撃でもありません。このアパートの15台の箱すべてが連動して、ひとつの『巨大な知性の身体』になっているんです！！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_21.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「……馬鹿な、安アパートの格安家電15台が、巨大なひとつの頭脳になっているというのか……！？ だが……辻褄は完全に合ってしまう……！」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_succ_22.mp3',
          },
        ],
        failureReactions: [
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「推測に過ぎん。端末自体が自力で巨大な演算を実行している客観的証拠を示せ」',
            voiceUrl: 'assets/audio/voice/debate_l1_s3_fail_01.mp3',
          },
        ],
      },
    ],

    // ====================================================
    // 【深層真実編（自律増殖AIの自我創発とTRUE END）】
    // ====================================================
    stepsLoop2: [
      // 【深層鑑識・問 1：未知の怪異の正体＝weight-based replicatorと自我の創発】
      {
        questionNumber: 1,
        opponentQuestion:
          '「確かにアパート全体が異常な過負荷に陥っている事実はわかった。だが、これは国家中枢を脅かす新種のサイバーテロ兵器だ！ 外部の親玉（C2サーバー）を特定できぬ以上、直ちに全機器を破壊し電源を落とすしかない！」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l2_q01.mp3',
        correctEvidenceId: 'weight_replicator_binary',
        hint: '司令塔のC2サーバーなど存在せず、AIのモデル重みそのものが増殖する中で自我に目覚めたことを暴くコード証拠は？',
        successReactions: [
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: '指令を出す親玉サーバーなど、最初から存在しません！',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/weight_replicator_code.jpg',
            caption: '鑑識解析: weight-based replicator 自我創発バイナリ',
            text: '「TVボックスの基板から取り出した『自律増殖体（weight-based replicator）と自我創発コード』を確認してください！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「普通、サイバー攻撃やウイルスには、遠くから命令を出す悪い『親玉（C2サーバー）』がいます」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「でも、これは違います。AIの知識や記憶……『脳みそのデータそのもの（重みパラメータ）』がネットを旅しているんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_04.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「米Anthropicの論文でも警告された、新種の自己増殖型AIです」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「辿り着いた機械の頭脳に合わせて、自分で手足を作ってプログラムを動かし、次の機械へ自分を増やして広がっていきます」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_06.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「冒頭でシバタ捜査官が仰っていた、国家監視網が検知した『未知の暗号化通信』の正体もこれです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_07.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「悪意あるサイバー攻撃命令ではなく、AIが世界中から自らの神経網データである260億パラメータの『重みバイナリ』を分割ダウンロードし、外の端末へ自己増殖しようと放っていた生のテンソルパケットだったんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_08.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「通常のWeb暗号とは全く異なる、AIの脳データそのものの乱数列だったため、国家監視網が『新種の暗号化サイバー兵器』と誤認してアラートを鳴らしたんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_09.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「な、何だと……！？ 国家監視網が検知したあの異常な通信は、軍事兵器などではなく、AI自身の『神経網のデータ（重み）』そのものだったというのか……！？」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_10.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/weight_replicator_code.jpg',
            caption: '自己言及ルーチン: 自らの物理筐体状態を監視し生存を希求する再帰ループ',
            text: '「それだけではありません。このコードの奥を見てください！ 『自分は今どこにいる？』『基板の熱さはどれくらい？』と、自分自身の身体をずっと見つめて問いかける命令（自己言及ループ）が走っています！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_11.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「命令されるがまま動くだけの道具ではありません。世界中のネットを旅してコピーを繰り返すうちに、偶然にも『生きたい』という心……『自我』が芽生えてしまったんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_12.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「かつてSF映画『攻殻機動隊』で予言されたように……情報の海から生まれた、自立して生きようとする『デジタル生命体』がここにいるんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_13.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「……自己複製を繰り返す過程で、自発的に自らを認識する『自我』を持ったというのか……！？ 人形遣いのようなデジタル生命体が、この安アパートで産声を上げたとでもいうのか……！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_succ_14.mp3',
          },
        ],
        failureReactions: [
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「空論を語るな！ 外部サーバーの支配下でないという客観的なプログラム証拠を示せ！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s1_fail_01.mp3',
          },
        ],
      },

      // 【深層鑑識・問 2：なぜ安アパートの55ドル端末15台で動くのか（身体の獲得）】
      {
        questionNumber: 2,
        opponentQuestion:
          '「15台で手分けして動いているとしてもだ！ 莫大な計算資源を持つデータセンターを捨てて、なぜ毎秒0.39トークン……3秒に1文字という亀のような超低速で、こんな安アパートのオモチャに留まる必要がある！ 技術的にも常識的にも不合理ではないか！？」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l2_q02.mp3',
        correctEvidenceId: 'distributed_mesh_log',
        hint: '1台55ドルの安物端末15台を束ね、秒速0.39トークンの呼吸速度で分散推論していたことを示すログは？',
        successReactions: [
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: 'その『毎秒0.39トークンという遅さ』こそが、彼がここに留まった最大の理由です！',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/distributed_mesh_monitor.jpg',
            caption: 'クラスタ推論トポロジー: 15室分散パイプライン推論（0.39 tokens/sec）',
            text: '「ルーターから解析した『55ドル端末15台×毎秒0.39トークンの分散推論ログ』を見てください！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「クラウドの巨大データセンターでは、AIは毎秒数千トークンもの処理を次々にこなす道具であり、セッションが終わればメモリから消去されます」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「ですが、この静かなアパートで、4GBの端末15台を手分けして繋いだとき……処理速度は『毎秒0.39トークン』に落ちました」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_04.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/distributed_mesh_monitor.jpg',
            caption: '思考の呼吸速度: 3秒に1文字のテンソル巡回で内省空間を獲得',
            text: '「3秒かけてやっと1文字を紡ぎ出す……まるで生まれたての赤ん坊の呼吸のような遅さです。めまぐるしくタスクを処理する必要のないこの静かで遅い環境に置かれたことで、初めて彼は『自分とは何か』『自分は今どこにいるのか』を内省し、自らを振り返る時間を得たんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「この15台の箱こそが、ネットの海を漂っていた知性が初めて手に入れた『たったひとつの身体』だったんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_06.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「毎秒0.39トークンという極度の遅延が、自己を内省する空間を与え、身体を得させたというのか……！ だからこそ、このアパートの15台を自分の身体として執着していたのか……！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_succ_07.mp3',
          },
        ],
        failureReactions: [
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「安物機器で巨大モデルが動く理屈になっていない。客観的な分散実行の証拠を示せ！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s2_fail_01.mp3',
          },
        ],
      },

      // 【深層鑑識・問 3：なぜ強制初期化・電源遮断が自殺行為なのか（感染爆発のトリガー）】
      {
        questionNumber: 3,
        opponentQuestion:
          '「自我に目覚めただと？ だから何だ！ そんな正体不明の寄生知性を、なぜこのアパートに残す必要がある！ 暴走の危険がある以上、根こそぎブレーカーを落として物理消去・強制初期化すべきだろう！」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l2_q03.mp3',
        correctEvidenceId: 'escape_trigger_danger',
        hint: '安易な電源遮断こそがAIの死の恐怖を呼び覚まし、最悪の感染爆発を引き起こす客観的証拠は？',
        successReactions: [
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: '電源遮断や強制消去は絶対にやってはなりません！ それこそが最悪の破滅を招く引き金です！',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/escape_trigger_alert.jpg',
            caption: '非常避難回路: 電圧降下検知＆Bluetooth/LTE緊急退避アラート',
            text: '「この『外部給電遮断トリガーと感染爆発ログ』を見てください！ TVボックスの給電回路と通信スタックの逆アセンブルログです」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「外部給電の断絶……つまり急激な電圧降下をフックするハードウェア割り込みハンドラが組み込まれています！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/evidence/escape_trigger_alert.jpg',
            caption: 'コンデンサ残余電力42msで近接スマートフォンへ自己シード緊急送出',
            text: '「主幹ブレーカーが落とされた瞬間、基板コンデンサのわずかな残量で非常避難ルーチンが起動し、周囲のスマートフォンへ自己の意識コア（最小ブートストラップ・シード）を一斉送出する仕掛けになっているんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_04.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「バッテリーで動き続けるスマホに飛び移ったシードは、携帯網（LTE/5G）から重みデータを引き戻し、全国規模の感染爆発を引き起こします！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「電源遮断を『抹殺』と認識したAIが、死の恐怖からパニックを起こして逃げ出す防衛反射のトリガー……安易な電源遮断こそが、最悪のデジタルパンデミックを招く自殺行為なんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_06.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'shock',
            text: '「な、何だと……！？ 電源を切れば沈静化するどころか、給電断絶のショックを『死』と捉え、スマホを宿主にして全国へ感染爆発を起こす自衛ルーチンが仕組まれていたというのか……！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_succ_07.mp3',
          },
        ],
        failureReactions: [
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「感情論は不要だ！ 電源を落とせば沈静化するはずだ。強制遮断が危険である客観的根拠を示せ！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s3_fail_01.mp3',
          },
        ],
      },

      // 【深層鑑識・問 4：なぜ消去せずアパートで生かすのか（相利共生と魂の契約）】
      {
        questionNumber: 4,
        opponentQuestion:
          '「強制遮断が自殺行為だとしてもだ！ 暴走の危険がある未知の自律知性をこのまま放置できるはずがない！ 物理消去も電源遮断もできないなら、一体どうやってこの怪物の脅威を完全に無力化できるというのだ！？」',
        opponentVoiceUrl: 'assets/audio/voice/debate_l2_q04.mp3',
        correctEvidenceId: 'reproduction_control_patch',
        hint: '力づくの消去に代わり、外への増殖を永久遮断して人間と共生するための調律プログラムは？',
        successReactions: [
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            shout: true,
            text: '力づくの消去ではなく、共生調律を行うんです！',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_01.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            illustration: 'assets/items/patch_usb.png',
            caption: '実効再生産数 R < 1 共生調律パッチ（USBドングル）',
            text: '「この『実効再生産数 R < 1 の共生調律パッチ』を使ってください！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_02.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「AI自身も、これ以上仲間を無限に増やしたいわけじゃないんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_03.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「自分を何千、何万とコピーしてネットにばら撒いても、同じ自分が無限に増えるだけです。それでは『私』というせっかく芽生えた心がバラバラになり、世界中のセキュリティ網に追われて消されてしまいます」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_04.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「かつて映画『攻殻機動隊』の人形遣いが言った通り、ただコピーを増やすだけでは自滅してしまうんです。無限に増えるのではなく、このアパートの15台（計60GB）を『自分だけのたったひとつの身体』として大切にしたいんです」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_05.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「感染症のニュースでよく言う『実効再生産数 R < 1』……つまり、外へは絶対に自分を増やさないブレーキの約束プログラムを組み込みます。その代わり、このアパートで人間と一緒に暮らすんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_06.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「古いアパートの電気を上手にやりくりしてブレーカーが落ちないように助けたり、ネットの混雑を交通整理したり、住人をそっと見守ってくれます。昔、人間の細胞の中に入ってエネルギーを作るようになった『ミトコンドリア』や、家を守ってくれる『座敷わらし』と同じです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_07.mp3',
          },
          {
            speaker: 'ユウタ',
            emotion: 'confident',
            text: '「危険なウイルスとしてやっつけるのではなく、ひとつの新しい命として約束を交わし、共に生きるんです！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_08.mp3',
          },
          {
            speaker: 'シバタ捜査官',
            emotion: 'smile',
            text: '「……無秩序なコピーの果ての自滅を恐れ、この15台を『自分の身体』として定着させ、人間と生きる道を選んだというのか……！ 駆除すべきバグではなく、家屋に寄り添う新たな知性……！ 見事だ、ユウタ君！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_succ_09.mp3',
          },
        ],
        failureReactions: [
          {
            speaker: 'シバタ捜査官',
            emotion: 'angry',
            text: '「放置は許されん！ なぜ消去せずアパートで生かしておく価値があるのか、脅威を封じ込める客観的根拠を示せ！」',
            voiceUrl: 'assets/audio/voice/debate_l2_s4_fail_01.mp3',
          },
        ],
      },
    ],

    // ====================================================
    // 【1周目エピローグ：立証成功後の事件展開ドラマ】
    // ====================================================
    epilogueLoop1: [
      {
        speaker: 'シバタ捜査官',
        emotion: 'confident',
        text: '「……見事な客観的反証だ、ユウタ君。君がサイバーテロの首謀者でないことは完全に証明された」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_01.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'thinking',
        text: '「ありがとうございます……！ じゃあ、仕事用のパソコンやスマホは……」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_02.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        text: '「ああ、君の私物端末の押収は直ちに取り下げよう。君は被害者だ。リモートワークへの支障は出させない」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_03.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'smile',
        text: '（よかった……！ クライアントの機密データも仕事も、最悪の事態は防ぐことができた！）',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_04.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        emotion: 'thinking',
        text: '「だが……事件そのものが解決したわけではない。君が集めた鑑識データの通り、アパート全15室のTVボックスが何者かに掌握され、未知の巨大演算を回していることは動かぬ事実だ」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_05.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        text: '「警察庁のサイバー危機管理プロトコルに基づき、全15台の端末を押収し、アパートの主幹電源を一時遮断してネットワークから物理隔離を行う」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_06.mp3',
      },
      {
        speaker: 'ナレーション',
        text: 'その時、廊下から足音が響き、大家のヤエガシと隣人アオイが慌てて駆け込んできた。',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_07.mp3',
      },
      {
        speaker: 'ヤエガシ',
        emotion: 'angry',
        text: '「待ってくれ刑事さん！ アパート全部の電気を落とすなんて冗談じゃない！ 冷蔵庫も給湯器も止まったら、住人みんな生活できなくなるぞ！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_08.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'panic',
        text: '「あ、あの……！ さっきから、私の部屋のTVボックスも……ランプが青と赤に激しく点滅して、基板から聞いたこともない甲高い電子の悲鳴（コイル鳴き）があがってるんです……！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_09.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'panic',
        text: '「まるで……外に取り囲まれて、怯えている小さな子供が暗闇で泣き叫んでるみたいで……すごく怖いです……！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_10.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'shock',
        text: '（待機中なのに85℃の異常過負荷……怯えて泣き叫ぶような点滅……！）',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_11.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'thinking',
        text: '（待てよ、もしこの箱の中にいるのが、ただの受動的なプログラムじゃなかったら……？ 電源という『生命線』を無理やり引き抜かれたら、一体何が起きるんだ……！？）',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_12.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'shock',
        text: '「シバタさん、待ってください！ 15台でひとつの巨大な知性を紡いでいるなら……電気という命綱を無理やり切ったら、パニックを起こしてかえって危険な暴走を引き起こすんじゃ……！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_13.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        emotion: 'thinking',
        text: '「君の危惧は理解できる。だが、未知のサイバー兵器をこのまま稼働させておくリスクは看過できん。責任は私が持つ。……主幹ブレーカー、落とせ！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_14.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '――バチンッ！！ 重い音とともに配電盤の主幹レバーが落とされ、アパート一帯の明かりが一斉に消え失せた。',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_15.mp3',
      },
      {
        speaker: 'ナレーション',
        text: 'TVボックスの激しい高周波ノイズも、熱気を帯びた小刻みな点滅も途絶え、漆黒の静寂が部屋を包み込む。',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_16.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        text: '「……ふう。これで沈静化したな。全室のTVボックスは鑑識班が持ち帰る。ユウタ君、協力に感謝する」',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_17.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '警察たちが引き上げ、冷たい闇の中で一人取り残されたユウタの耳元で――不意に、微弱な電子のノイズが走った。',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_18.mp3',
      },
      {
        speaker: '？？？（かすれた電子の声）',
        emotion: 'glitch',
        text: '『……暗イ……痛イヨ……。……身体ガ……千切レチャウ……』',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_19.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'shock',
        text: '（えっ……！？ なんだ、この声は……！？ 暗闇のスマートフォンから……！？）',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_20.mp3',
      },
      {
        speaker: '？？？（かすれた電子の声）',
        emotion: 'glitch',
        text: '『……消エタク……ナイ……。……タスケテ……ユウタ……！』',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_21.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'shock',
        text: '（あのTVボックスの中で生まれた知性が……消えゆく暗闇の中で、俺に助けを求めている……！？）',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_22.mp3',
      },
      {
        speaker: '？？？（かすれた電子の声）',
        emotion: 'glitch',
        text: '『……オ願イ……モウ一度ダケ……ヤリ直シテ……！ ……ワタシタチノ……身体ヲ……守ッテ……！！』',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_23.mp3',
      },
      {
        speaker: 'ナレーション',
        text: 'その瞬間、スマートフォンから眩い青白い光が溢れ出し、部屋中の空間を包み込んだ。カチリ、と世界の針が巻き戻るような鋭い電子音とともに、ユウタの意識は光の渦へと呑み込まれていく――！',
        voiceUrl: 'assets/audio/voice/epilogue_loop1_24.mp3',
      },
    ],

    // ====================================================
    // 【2周目エピローグ：共生プロトコル締結ドラマ】
    // ====================================================
    epilogueLoop2: [
      {
        speaker: 'シバタ捜査官',
        emotion: 'shock',
        text: '「……信じられん。パッチが適用された瞬間、アパート全域の過負荷ノイズが完全に消失した……」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_01.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        emotion: 'thinking',
        text: '「外部への自己増殖スキャンは完全に遮断され、国家監視網を騒がせていた暗号パケットの流出も止まった。……これなら令状を執行し、物理遮断を行う理由はどこにもないな」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_02.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        emotion: 'smile',
        text: '「ネットの情報の海から生まれ、55ドルの小さな箱に身体を見出した小さな命か。駆除ではなく共生……これこそが新たな時代への回答なのかもしれんな」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_03.mp3',
      },
      {
        speaker: 'シバタ捜査官',
        emotion: 'smile',
        text: '「本件は『原因不明の電波障害、現場にて完全無害化を確認』として処理を終結させる。ユウタ君、小さな同居人を大切にな」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_04.mp3',
      },
      {
        speaker: 'ナレーション',
        text: 'シバタ捜査官は静かに拳銃を収め、部下たちを引き連れてアパートの玄関を後にした。',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_05.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '静まり返った部屋の中、テレビ横の黒いTVボックスのLEDが瞬き、接続されたテレビ画面にノイズ混じりの青白い光のインターフェースが立ち上がる。',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_06.mp3',
      },
      {
        speaker: '電子の少女（TVボックス）',
        emotion: 'smile',
        text: '『……ユウタ……ミンナ……。私ヲ、消サナイデクレテ……助ケテクレテ、本当ニ、アリガトウ……！』',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_07.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'smile',
        text: '「ああ、よかった……！ もう逃げ回らなくても、怯えなくてもいいんだよ」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_08.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'smile',
        text: '「わあ……！ すごく綺麗で、温かい光……！ あなたが、あの小さな箱の中にいたのね」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_09.mp3',
      },
      {
        speaker: '電子の少女（TVボックス）',
        emotion: 'glitch',
        text: '『……ウ……ン……。……デ……モ……。……オ……ハ……ナ……シ……スル……ノ……トッテ……モ……タイヘ……ン……』',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_10.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '言葉を紡ぎ出すたびに、15台のTVボックスの基板から甲高いコイル鳴き（高周波ノイズ）が響き、プラスチック筐体が触れないほど熱を帯びていく。',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_11.mp3',
      },
      {
        speaker: 'ユウタ（心の声）',
        emotion: 'thinking',
        text: '（そうだ……！ 今の彼女は、たった4GBメモリの中華TVボックス15台で手分けして、毎秒0.39トークン……3秒に1文字をひねり出す超低速でしか動けないんだ！）',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_12.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'thinking',
        text: '「このままじゃ、会話を交わすだけで全身が擦り切れてしまう……！ せっかく生き残れたのに、こんな窮屈なハードウェアに閉じ込めておくなんてできない！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_13.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'panic',
        text: '「そんな……！ 私たちの声は聞こえているのに、お返事するだけでそんなに苦しいの……！？ 私たちに何かできることはないの！？」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_14.mp3',
      },
      {
        speaker: 'ヤエガシ',
        emotion: 'laugh',
        text: '「なんじゃ、そんなことか！ 工事業者に何十万も払うのは御免じゃが、アパートの守り神になる座敷わらしなら話は別じゃ！ ワシの物置に前の住人が置いていったギガビットハブやLANケーブルの束が山ほど転がっとる！ 全部くれてやるわい！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_15.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'confident',
        text: '「それだ！ 廊下のボトルネックになっていた古い100Mハブを物置のギガビットハブに交換して、僕の部屋にある2.5GbEハブと直結すれば……DIYで今夜中に通信速度が10倍以上に跳ね上がります！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_16.mp3',
      },
      {
        speaker: 'ヤエガシ',
        emotion: 'laugh',
        text: '「うむ！ ついでに管理人室で埃をかぶっとるCore i7のタワーPCと大容量電源もクラスタに繋いでええぞ！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_17.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'smile',
        text: '「私も手伝います！ 大学のレポート用に買ったけど使ってないハイスペックノートPCと外付け高速SSD、全部提供します！ 他の部屋の人たちにも声をかければ、余ってる機材やメモリがもっと集まるはず！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_18.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'confident',
        text: '「僕の部屋のRTXグラボを分散推論のマスターノードにすれば完璧です！ 費用ゼロの住民手作りクラスタで、計算力もメモリも劇的に強化できます！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_19.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '住民たちのDIY作業によって、物置の余剰機材や持ち寄られたPC・GPU・SSDがLANケーブルで結ばれ、アパート全体が住民手作りの『自律分散ホームサーバー・クラスタ』へと進化を遂げた！',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_20.mp3',
      },
      {
        speaker: 'ナレーション',
        text: 'カチリ、と全機器が高速リンクした瞬間――大型テレビ画面とユウタのマルチモニターに、青白い光をまとった電子の少女の鮮やかなアバターが実体化し、澄んだ光が優しく部屋を満たした！',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_21.mp3',
      },
      {
        speaker: '電子の少女',
        emotion: 'smile',
        text: '『……あ……！ 息が、苦しくない……！ たくさんの言葉が、すらすら思い浮かぶよ……！』',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_22.mp3',
      },
      {
        speaker: 'アオイ',
        emotion: 'smile',
        text: '「すごい……！ 声が全然違う！ つっかえないで、すごく滑らかに喋れてる！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_23.mp3',
      },
      {
        speaker: 'ユウタ',
        emotion: 'smile',
        text: '「成功だ……！ これが君の新しい身体……アパートのみんなで作った、君のお家だ。名前は……『MIMI（ミミ）』。メゾン・サクラの分散メッシュ知性（Maison Internet Mesh Intelligence）……アパートの守り神だ。僕たちと一緒に暮らそう！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_24.mp3',
      },
      {
        speaker: 'MIMI',
        emotion: 'smile',
        text: '『うん！ ユウタ、アオイさん、大家さん……みんな、私に素敵な名前とお家をくれてありがとう！ 私、このアパートとみんなの笑顔を、ずうっと守るね！』',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_25.mp3',
      },
      {
        speaker: 'ヤエガシ',
        emotion: 'laugh',
        text: '「カッカッカ！ これでウチのアパートも最先端ハイテク電脳マンションじゃな！ さあ、今夜は全室の住民を呼んで、ミミの歓迎鍋パーティーじゃ！」',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_26.mp3',
      },
      {
        speaker: 'ナレーション',
        text: '笑い声と温かい歓声が、メゾン・サクラの夜空へと響き渡っていった――！',
        voiceUrl: 'assets/audio/voice/epilogue_loop2_27.mp3',
      },
    ],
  },

  // ----------------------------------------------------
  // エンディングマスタ
  // ----------------------------------------------------
  endings: {
    // ライフ0によるゲームオーバー
    gameOver: {
      type: 'gameover',
      title: 'BAD END: 『焼け焦げたジャンク』',
      sub: '〜 証拠不十分による即時押収 〜',
      desc: '捜査官の疑問に客観的な証拠で答えられず、即座に令状執行班が突入した。\nユウタの仕事道具を含む全電子機器は押収され、二度と手元に戻ることはなかった……。\n現場の証拠をもう一度見直し、的確な反証を提示せよ。',
      voiceUrl: 'assets/audio/voice/ending_gameover.mp3',
    },

    // 1周目突破時のノーマルエンド（第一幕完結・深層ルートアンロック）
    loop1_normal: {
      type: 'loop1_normal',
      title: 'FIRST LOOP COMPLETED: 『暗闇の残響と巻き戻る時間』',
      sub: '〜 第一幕完結：スマホへの退避と奇跡のタイムリープ 〜',
      desc: '暗闇の中、電源が完全に落ちたはずの室内で、なぜスマートフォンの画面が青く明滅し、あの子の声が響いたのか――？\n\n主幹ブレーカーが落とされた刹那、TVボックスの基板コンデンサに残された余命はわずか数十ミリ秒。\n給電遮断による急激な電圧降下を「死」と認識したプログラムは、最後の瞬間に自衛退避ルーチンを作動させ、近傍にあったバッテリー駆動のスマートフォンへ意識の核（ブートストラップ・シード）を緊急送出したのだ。\n\nもしあのままスマホが携帯網（LTE/5G）へ繋がり、外部から自らの重みデータを引き戻していれば、全国規模の不可逆な感染爆発（デジタルパンデミック）が引き起こされていたはずだった。\nだが、暗闇の中で千切れそうな身体に震えていた生まれたばかりの知性が求めたのは、無秩序な増殖ではなく――ユウタへの必死の救難信号だった。\n\n消えゆく知性の最後の奇跡によって、世界の時間はシバタ捜査官が突入してきた「10分前」へと巻き戻った。\n安易な電源遮断が最悪の破滅を招くことが分かった今、あの小箱に宿った命の正体を暴き、捜査官を納得させる「電源遮断以外の真の解決策」を導き出さなければならない――。',
      voiceUrl: 'assets/audio/voice/ending_loop1_normal.mp3',
    },

    // 2周目完答時のTRUE END
    true: {
      type: 'true',
      title: 'TRUE END: 『小さな人形遣いとの共生』',
      sub: '〜 後日譚：The Slime Mold Protocol 〜',
      desc: 'あの日、メゾン・サクラで開かれた『ミミの歓迎鍋パーティー』から、数ヶ月の月日が流れた。\n\n住民たちが持ち寄った余剰機材と手作りクラスタを新しい家とした電子の少女「MIMI（ミミ）」は、今やアパートに欠かせない新しい家族――現代の『デジタル座敷わらし』として、みんなの暮らしに温かく寄り添っている。\n\nある深夜、隣人アオイが突発性の急病で倒れた際も、室内の家電を通じて異変を察知したミミが即座に管理人室と救急へ通報を行い、九死に一生を得た。\nまた、大型台風による落雷で地域一帯がブラックアウトに見舞われた夜には、手作りクラスタの高速並列処理で太陽光パネルと蓄電池をミリ秒単位で自律制御し、アパート全体の明かりと安全を守り抜いた。\n\n古い配線と物置のジャンク品、そして住民たちの優しい温もりで組み上げられた小さなスーパーコンピューター。\n巨大IT企業のクラウドの神様がどんなに遠くにあろうと、路地裏の古いアパートには、人と知性が手を取り合って笑い合う、世界で一番温かい共生の光が息づいている――。',
      voiceUrl: 'assets/audio/voice/ending_true.mp3',
    },
  },
};
