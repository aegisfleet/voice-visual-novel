# プロジェクト共通スクリプト (scripts/)

リポジトリ共通およびポータルサイト向けのアセット生成スクリプトを格納している。
各ゲーム固有の音声生成・画像生成・検証テストスクリプトは、それぞれの作品ディレクトリ配下に整理されている。

## ディレクトリ構成

- **`box/` (BOX WORM)**:
  - `box/scripts/`: 音声合成（Gemini 3.8 Flash TTS）、BGM、OGP、サムネイル生成スクリプト
  - `box/tests/`: 静的解析、認知複雑度検査、E2Eテストスイート
- **`eve/` (PROJECT EVE)**:
  - `eve/scripts/`: 日英全ボイス合成、多言語i18n生成、BGM生成・加工、表情差分自動生成
- **`scripts/` (ポータル・共通)**:
  - `generate_site_assets.py`: ポータルサイト（`index.html`）公式OGPバナー、ファビコン、アプリアイコン生成
  - `fonts/`: バナー生成用フォントファイル群（Orbitron, Chakra Petch等）
