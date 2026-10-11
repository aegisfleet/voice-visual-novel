/**
 * シナリオデータ定義
 *
 * 各ステップの設定項目:
 * - background: 背景画像のURL
 * - speaker: 話者名（nullまたは空文字ならナレーション）
 * - text: セリフ／テキスト本文
 * - character: 立ち絵の設定 (visible, expression: normal/smile/surprised/shy, motion: nod/hop/tilt/shake)
 * - voiceFile: 将来配置するTTS音声ファイルへのパス (assets/audio/...)
 * - speechConfig: Web Speech APIのフォールバック設定 (pitch: 音の高さ, rate: 話速)
 * - choices: プレイヤーの選択肢分岐 (オプション)
 */
const SCENARIO_DATA = [
  {
    id: "scene_01",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "smile",
      motion: "hop"
    },
    text: "こんにちは！ブラウザで動くフルボイスノベルゲームのプロトタイプへようこそ！",
    voiceFile: "assets/audio/scene_01.mp3",
    speechConfig: { pitch: 1.25, rate: 1.05 }
  },
  {
    id: "scene_02",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "normal",
      motion: "tilt"
    },
    text: "いま私の声が聞こえているかな？これはブラウザ標準の音声合成で読み上げているんだよ。",
    voiceFile: "assets/audio/scene_02.mp3",
    speechConfig: { pitch: 1.25, rate: 1.0 }
  },
  {
    id: "scene_03",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "smile",
      motion: "nod"
    },
    text: "あとからassets/audio/フォルダに本番のTTS音声ファイルを置くだけで、自動でそっちに切り替わる設計になっているの！",
    voiceFile: "assets/audio/scene_03.mp3",
    speechConfig: { pitch: 1.2, rate: 1.05 }
  },
  {
    id: "scene_04",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "surprised",
      motion: "hop"
    },
    text: "そして見てみて！私が喋っている間、口パクが音声に合わせて動いて、呼吸やまばたきもしてるでしょ？",
    voiceFile: "assets/audio/scene_04.mp3",
    speechConfig: { pitch: 1.35, rate: 1.1 }
  },
  {
    id: "scene_05",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "shy",
      motion: "tilt"
    },
    text: "マウスを動かすと、私の視線や顔も少しだけついていくよ…ふふ、見つめられると照れちゃうな。",
    voiceFile: "assets/audio/scene_05.mp3",
    speechConfig: { pitch: 1.15, rate: 0.95 }
  },
  {
    id: "scene_06",
    background: "assets/backgrounds/room_day.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "normal",
      motion: "nod"
    },
    text: "ねえ、これから夕方の景色に移動してみない？",
    voiceFile: "assets/audio/scene_06.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0 },
    choices: [
      { text: "夕方を見に行こう！", nextIndex: 6 },
      { text: "もう一度最初から説明を聞く", nextIndex: 0 }
    ]
  },
  {
    id: "scene_07",
    background: "assets/backgrounds/sunset.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "smile",
      motion: "nod"
    },
    text: "わあ、綺麗な夕焼け空！背景画像とキャラクターのレイヤーが分かれているから、背景もスムーズに切り替えられるんだ。",
    voiceFile: "assets/audio/scene_07.mp3",
    speechConfig: { pitch: 1.2, rate: 1.0 }
  },
  {
    id: "scene_08",
    background: "assets/backgrounds/sunset.svg",
    speaker: "アイリス",
    character: {
      visible: true,
      expression: "smile",
      motion: "hop"
    },
    text: "この仕組みを使えば、完全なフルボイスの本格ノベルゲームが作れそうだね！応援してるよ！",
    voiceFile: "assets/audio/scene_08.mp3",
    speechConfig: { pitch: 1.3, rate: 1.05 }
  }
];

window.SCENARIO_DATA = SCENARIO_DATA;
