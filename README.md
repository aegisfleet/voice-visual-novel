# Voice Visual Novel Prototype (ブラウザ対応 フル音声ノベルゲーム)

ブラウザ上で動作するフルボイス・テキストノベルゲームのプロトタイプ基盤です。  
Web標準技術（HTML5 / CSS3 / JavaScript / Web Speech API）のみで構築されており、追加のサーバー環境やライブラリインストール不要でブラウザから即座に動作します。

---

## 💡 プロジェクトの趣旨・特徴

1. **プロトタイプ段階での音声読み上げ (Web Speech API)**
   - 音声ファイルが用意されていない状態でも、ブラウザ内蔵の音声合成（`SpeechSynthesis`）を利用してフルボイスでセリフを読み上げます。
   - キャラクターごとにピッチ（声の高さ）やレート（話速）を柔軟に調整できます。

2. **後からのTTS音声（mp3/wav等）へのシームレスな差し替え設計**
   - 音声再生管理モジュール（`AudioController`）が、セリフに指定された音声ファイルの実在を自動判定します。
   - `assets/audio/` に音声ファイルが配置されていれば**そのファイルを優先再生**し、存在しなければ**Web Speech APIへ自動フォールバック**します。
   - これにより、コード本体やシナリオ定義を書き換えることなく、TTS音声が準備できたセリフから順次リッチな本番音声に移行できます。

3. **Live2Dライクな表現力（擬似Live2D機構）**
   - **アイドリング（呼吸モーション）**: アイドル中に身体や髪が呼吸に合わせて滑らかに伸縮・上下動します。
   - **自動まばたき**: 数秒ごとに自然な瞬きを自動実行。
   - **音声連動リップシンク**: Web Speech API読み上げ時、およびTTS音声再生時に、音声の長さに同期してリアルタイムに口パクを実行します。
   - **感情・モーションリアクション**: 笑顔、驚き、照れなどの表情差分と、うなずく（nod）、跳ねる（hop）、首をかしげる（tilt）などのリアクションモーション。
   - **マウス追従**: マウスカーソルの位置に応じて瞳と頭部が追従します。

4. **背景とキャラクターの完全独立レイヤー構造**
   - 背景画像とキャラクター立ち絵は独立したCSSレイヤーで管理されており、シーンに応じた背景フェード切り替えや立ち絵の移動・切り替えが容易です。

---

## 📁 ディレクトリ構成

```text
voice-visual-novel/
├── index.html                  # ゲーム起動エントリーポイント
├── css/
│   └── style.css               # ノベルUI & Live2D風CSSアニメーション定義
├── js/
│   ├── audio-controller.js     # 音声管理（TTS再生 + Web Speech API自動フォールバック + リップシンク通知）
│   ├── character-controller.js # キャラクター立ち絵・Live2D風モーション・表情制御
│   ├── scenario.js             # シナリオデータ（セリフ、表情、音声パス、分岐設定）
│   └── game-engine.js          # ゲーム進行エンジン（文字送り、オート、ログ、クリック進行）
└── assets/
    ├── backgrounds/            # 背景画像 (room_day.svg, sunset.svg)
    ├── characters/             # キャラクター用画像素材
    └── audio/                  # TTS生成音声ファイル配置場所 (scene_01.mp3, ...)
```

---

## 🚀 動作確認・起動方法

Web Speech APIおよび音声自動再生のブラウザセキュリティ（Autoplay Policy）要件を満たすため、静的Webサーバー経由で開くことを推奨します。

### Pythonの簡易サーバーで起動する場合
```bash
cd /root/voice-visual-novel
python3 -m http.server 8080
```
ブラウザで `http://localhost:8080` を開きます。

---

## 🎙️ TTS音声ファイルへの差し替え手順

1. VOICEVOX、COEIROINK、ElevenLabs、Style-Bert-VITS2 などのTTSエンジンで音声を生成します。
2. 生成した音声ファイルを `assets/audio/` 配下に配置します（例: `scene_01.mp3`）。
3. `js/scenario.js` 内の該当セリフの `voiceFile` パスと一致していることを確認します。
   ```javascript
   {
     id: "scene_01",
     speaker: "アイリス",
     text: "こんにちは！...",
     voiceFile: "assets/audio/scene_01.mp3", // ← ファイルが存在すれば自動的にこちらが再生されます
     speechConfig: { pitch: 1.25, rate: 1.05 } // ファイルが無い時のフォールバック設定
   }
   ```
4. ブラウザをリロードすると、配置されたファイルが優先して再生され、リップシンクも自動的に同期します。

---

## 🎨 本格Live2D（Cubism SDK）への拡張について

本プロトタイプは軽量・依存ゼロで動作するSVG/CSSベースの擬似Live2Dを採用していますが、公式のLive2Dモデル（`.model3.json`）を導入する場合も、設計を壊さず組み込み可能です。

1. **PixiJS + pixi-live2d-display の導入**:
   - `index.html` に PixiJS と `pixi-live2d-display` をCDN等から読み込みます。
2. **CharacterController の差し替え**:
   - `js/character-controller.js` 内のレンダリング部を、Live2Dモデルの読み込みと `model.motion('Tap')` などの呼び出しに差し替えます。
   - `audio-controller.js` の `onSpeechStart` / `onSpeechEnd` イベントと連動して `model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', value)` を操作することで、完全なCubismリップシンクが実現できます。
