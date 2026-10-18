# BOX WORM テストスイート (box/tests)

『BOX WORM 〜55ドルの自己増殖知性〜』の品質保証、静的解析、回帰防止を目的とした自動テストスイートである。

## ディレクトリ構成

```text
box/tests/
├── helpers.py             # 共通ヘルパー（ローカルサーバー自動起動・セッション注入・共通設定）
├── run_all_tests.py       # テストスイート一括実行ランナー
├── test_integrity.py      # 静的整合性・アセット実在性・探索ピン配置幾何テスト
├── test_complexity.js     # SonarQube準拠 JavaScript認知複雑度 (<= 15) 静的チェッカー
├── test_audio_bgm.py      # BGM同期・セッション再開・ミュート復帰・音声再生E2Eテスト
├── test_dialogue_avatar.py # 会話劇・群像劇/1対1NPC立ち絵・モノローグ背景減光E2Eテスト
├── test_gameplay.py       # ゲームループ・立証問答ダメージ・エンディング・設定資料集E2Eテスト
├── screenshots/           # テスト実行時キャプチャ出力先 (.gitignore対象)
└── README.md              # 本ドキュメント
```

## テストの実行方法

### 1. 全テスト一括実行（推奨）

リポジトリルートから以下のコマンドを実行する。

```bash
python box/tests/run_all_tests.py
```

- ローカルサーバー（`python -m http.server 8080`）が未起動の場合は自動的に起動し、テスト完了後に自動クリーンアップされる。
- 各テストの成否サマリーおよび所要時間が一覧表示される。
- テスト実行時の画面キャプチャは `box/tests/screenshots/` に自動保存される。

### 2. 個別テストモジュールの実行

特定の機能のみを高速に検証したい場合は、各ファイルを個別に実行可能。

```bash
# 静的整合性・アセット実在性・ピン幾何テスト (約0.1秒)
python box/tests/test_integrity.py

# JavaScript認知複雑度チェッカー (約0.05秒)
node box/tests/test_complexity.js

# BGM・音声再生E2Eテスト (約14秒)
python box/tests/test_audio_bgm.py

# 会話劇・立ち絵アバターE2Eテスト (約10秒)
python box/tests/test_dialogue_avatar.py

# ゲームループ・UIステートE2Eテスト (約14秒)
python box/tests/test_gameplay.py
```

## 設計方針・遵守基準

1. **環境非依存**:
   - 絶対パスのハードコードを禁止し、リポジトリルートからの相対解決を行う。
   - ポート番号は環境変数 `BOX_TEST_PORT` または `BOX_TEST_URL` で上書き可能。
2. **SonarQube品質基準**:
   - 関数の認知複雑度は 15 以下を絶対遵守（`test_complexity.js` で自動検査）。
3. **ADVガイドライン準拠**:
   - 探索ピンのユークリッド距離 20% 以上確保（`test_integrity.py` で数学的に検証）。
   - 可逆性（探索 ⇔ 立証の詰み防止）、前提条件ガード、カタルシス提供の担保。
