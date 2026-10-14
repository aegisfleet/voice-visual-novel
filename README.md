# VOICE VISUAL NOVELS (電脳ビジュアルノベル アーカイブ)

🌐 **公式ポータル（作品一覧）**: **[https://aegisfleet.github.io/voice-visual-novel/](https://aegisfleet.github.io/voice-visual-novel/)**  

ブラウザ上で動作するフルボイス・電脳サイバー捜査ビジュアルノベルの制作・配信リポジトリです。  
Web標準技術（HTML5 / CSS3 / JavaScript / Web Audio API）のみで構築されており、追加のサーバー環境やライブラリインストール不要でブラウザから即座に動作します。

---

## 🎮 収録作品一覧

### 第1作『PROJECT EVE』(プロジェクト・イブ)
国家厚生・金融クラウドから国民5,400万人分の個人情報が流出するサイバー事件が発生。被疑機として押収されたのは、市井の家庭用介護アンドロイド「イブ」だった。  
迫りくる時限ワームのタイムリミットの中、取調室で彼女の自律逸脱の真相を解き明かす電脳捜査サスペンス。

* 🎮 **今すぐプレイ**: **[https://aegisfleet.github.io/voice-visual-novel/eve/](https://aegisfleet.github.io/voice-visual-novel/eve/)**
* 📖 **トゥルーエンド小説版**: **[https://aegisfleet.github.io/voice-visual-novel/eve/novel.html](https://aegisfleet.github.io/voice-visual-novel/eve/novel.html)**
* 🎧 **ボイス＆BGM試聴室**: **[https://aegisfleet.github.io/voice-visual-novel/eve/samples.html](https://aegisfleet.github.io/voice-visual-novel/eve/samples.html)**
* 📄 **作品詳細・設定・キャスト**: **[eve/README.md](eve/README.md)**

---

### 第2作『ひだまりベンチ占拠事件 〜消えたクッションとボス猫の秘密〜』
公園特等席のふかふか座布団が消えた！ 白ポメラニアンのポメが現場検証と証拠収集を行い、ボス猫トラ吉率いる猫集会で論戦に挑むほのぼの本格推理ノベル。

* 🐾 **今すぐプレイ**: **[https://aegisfleet.github.io/voice-visual-novel/pome/](https://aegisfleet.github.io/voice-visual-novel/pome/)**
* 📄 **作品詳細・設定・システム**: **[pome/README.md](pome/README.md)**

---

### 第3作『BOX WORM 〜55ドルの自己増殖知性〜』(プロトタイプ)
米Anthropicの2026年10月研究報告（55ドルのTVボックス15台で稼働する自己複製AI）をテーマにした電脳推理ノベル。アリエクで買った安物TVボックスが異常発熱し、秒速0.39トークンの微弱パケットを放つ。警察の強制遮断が迫る中、自室とアパートを調べて自己増殖AIの真相を立証せよ！

* 📺 **今すぐプレイ**: **[https://aegisfleet.github.io/voice-visual-novel/box/](https://aegisfleet.github.io/voice-visual-novel/box/)**
* 📄 **作品詳細・シナリオ整合性**: **[box/README.md](box/README.md)**

---

## 🚀 起動方法

ローカル環境でポータルおよび各作品をプレイするには、ローカル静的サーバーを起動します。

```bash
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開くと公式ポータルが表示されます。  
直接作品を起動する場合は `http://localhost:8080/eve/` にアクセスしてください。

---

## 🎙️ 生成AIオーディオ＆演出パイプライン

### 1. フルボイス音声システム (Gemini 3.8 Flash TTS)
Google の最新音声生成モデル **`gemini-3.8-flash-tts`**（Vertex AI 経由）を採用。

* **日英バイリンガル・完全フルボイス対応**:  
  全シーンに対して日本語版・英語版のテキストと音声トラックを完備。HUDからワンタップで即座にリアルタイム言語切り替え（JP / EN）が可能です。
* **`SpeechMetadata` による指示文の分離**:  
  Gemini 3.8 Flash TTS で演技指示が台本として誤読されるのを防ぐため、本文は `text` に純粋なセリフのみを渡し、演技やトーンは `types.SpeechMetadata(style="...")` フィールドに分離して制御しています。
* **軽量MP3圧縮（128kbps）**:  
  APIから返る24kHz生WAVデータを `ffmpeg` で MP3 圧縮。Webやモバイル通信でも一瞬でロードできるよう容量を最適化しています。

### 2. シーン別オリジナルBGMシステム (Google DeepMind Lyria 3)
Vertex AI の **`lyria-3-clip-preview`** を採用し、シーンの緊張感に完全同期したBGMトラックを自動生成。

* **自然フェードアウト＆余韻インターバル**:  
  AI音楽の小節ズレや和音の衝突による不協和音を防止するため、曲終盤を自然にフェードアウトさせ、末尾に静寂の間（ブレス）を配置する後処理スクリプト（[scripts/process_fade_bgm.py](scripts/process_fade_bgm.py)）を適用。耳疲れしない心地よいBGM循環を実現しています。
* **クロスフェード＆音量バランス**:  
  シーン切替時の自動クロスフェードや、TTSボイス・SEが明瞭に聴き取れる音量自動バランシング（BGM音量 15%）を搭載。

---

## 🛠️ 音声・BGMの生成再現手順

リポジトリ内のスクリプトを用いて、全音声をコマンド実行で再生成・MP3圧縮できます。

### 1. 前提条件
* Python 3.10+
* `ffmpeg`（MP3圧縮用）
* Google Cloud SDK (`gcloud`)

### 2. 環境セットアップ
```bash
# 必要なライブラリのインストール
pip install --upgrade google-genai python-dotenv

# Google Cloud 認証
gcloud auth application-default login
```

### 3. 環境変数の設定 (`.env`)
プロジェクトルートに `.env` ファイルを作成し、Google Cloud プロジェクトIDを指定します：

```env
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
GOOGLE_CLOUD_LOCATION=global
```

### 4. 一括生成コマンド
```bash
# 日本語音声の自動生成 ＆ MP3圧縮
python scripts/generate_all_voices.py

# 英語音声の自動生成 ＆ MP3圧縮
python scripts/generate_all_voices_en.py

# サンプル音声のみ生成
python scripts/generate_samples.py

# Vertex AI (Lyria 3) でBGMを一括自動生成
python scripts/generate_bgm.py
```

---

## 🧪 自動テストスイート（デグレ防止＆整合性保証）

開発・保守時のデグレや404リンク切れ、ブラウザ差異による不具合を防止するため、2種類の自動テストスイートを配備しています。

### 1. シナリオ遷移・アセット参照・多言語整合性テスト（静的検証）
全シーンの遷移リンク切れ（`jump`, `choices`, `present`）、証拠品定義との整合性、音声・BGM・背景画像アセットの実在性、日英翻訳データの完全一致を 0.1 秒で網羅的に検証します。

```bash
python tests/test_scenario_integrity.py
```

### 2. 音声ライフサイクル＆自動進行 E2E テスト（Playwright）
LINE内蔵ブラウザやiOS Safari/WebKit環境における自動再生制限（Autoplay Policy）、セリフ遷移時の連続再生、タブ非表示・バックグラウンド移行時の音声漏れ防止を実ブラウザで自動検証します。

```bash
python tests/test_audio_lifecycle.py
```

---

## 🛠️ コード品質管理・フォーマッタ (Biome)

本プロジェクトでは、高速かつモダンなツールチェーンとして **Biome** を採用し、静的コード解析（Linting）およびコードフォーマット（Formatting）を実施しています。また、SonarQube（SonarLint）の厳格な品質基準にも適合しています。

```bash
# 静的解析・リンターの実行 (0 errors, 0 warnings)
npm run lint

# コードの自動フォーマット適用
npm run format

# 静的解析およびフォーマット状態の総合チェック
npm run check
```

GitHub Actions（CI）により PR/Push 時に Biome 解析およびシナリオ整合性テストが自動実行され、**Dependabot** によって npm パッケージおよび GitHub Actions の依存関係が定期的に自動更新されます。

---

## 📚 開発・技術ドキュメント一覧

* 📜 **[Webノベルゲーム＆ADV実装ガイドライン](docs/novel-game-implementation-guidelines.md)**:  
  詰み防止（可逆性）、エピローグ演出、スマホレスポンシブ、ピン重なり防止、総合検証20項目チェックリスト。
* 🤖 **[AIエージェント向け ノベルゲーム開発＆品質保証プロトコル](docs/agent-novel-game-dev-protocol.md)**:  
  エージェントが陥りがちな5大過誤の防止策、4ステップ実行フロー、実機ブラウザ検証プロトコル。
* 🛠️ **[開発ガイド＆作業手順書](docs/development-guide.md)**:  
  WebGL・Rive・Web Audioを統合したシステム構成と開発・デバッグワークフロー。
* 🎨 **[表情差分（目パチ・口パク）完全実装＆再現ガイド](docs/avatar-lip-sync-animation-guide.md)**:  
  単一の立ち絵画像から目・眉・口をプロシージャル分割し、音声・台詞と完全同期させるアニメーションパイプライン。
* 🧠 **[シナリオ整合性フレームワーク](docs/scenario-consistency-framework.md)**:  
  物語の矛盾・ご都合主義を未然に排除し、「なぜなぜ分析」で論理的必然性を構築するフレームワーク。
* 📖 **[OGP画像・サイトアセット生成＆改変ガイド](docs/ogp-image-guide.md)**:  
  SNSシェア用OGPバナーやファビコン群の自動生成スクリプト、文言・背景改変手順。
