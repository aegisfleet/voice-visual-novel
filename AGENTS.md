# AGENTS.md - AIエージェント向け指示書

本リポジトリ（voice-visual-novel）で作業するすべてのAIエージェントは、以下のガイドラインおよびプロトコルを無条件で遵守してください。

## 必須参照ドキュメント
- [docs/novel-game-implementation-guidelines.md](docs/novel-game-implementation-guidelines.md)
  - Webノベルゲーム・ADVのUX、ゲームループ、ステート設計の必須要件定義書。
- [docs/agent-novel-game-dev-protocol.md](docs/agent-novel-game-dev-protocol.md)
  - AIエージェントが過去に引き起こした9大過誤の防止策と、2画面実機検証プロトコル。
- [docs/scenario-consistency-framework.md](docs/scenario-consistency-framework.md)
  - 「なぜなぜ分析」と「情報非対称性・ゲーム理論」に基づくシナリオの矛盾排除・専門用語比喩化・ステップ分散提示の汎用設計フレームワーク。シナリオ作成・改修時は必読。
- [docs/bgm-production-guide.md](docs/bgm-production-guide.md)
  - BGM の生成・差し替えを行う場合の標準手順（生成方針、記号解析によるループ継ぎ目の検証、Web Audio ギャップレス再生、受け入れチェックリスト）。BGM 作業時は必読。

## 最重要ルール
1. **可逆性の確保（詰み防止）**: 探索 ⇔ 立証の双方向遷移、ゲームオーバーからの現場再調査導線を絶対に断たないこと。
2. **前提条件ガード**: 証拠不足時に立証ボタンを表示させない。ロジック層でも二重にブロックすること。
3. **カタルシスの提供**: 立証成功時は必ず解決エピローグ会話劇を描き、理不尽な即BAD ENDを避けること。
4. **スマホレスポンシブ**: カットインや会話ノベルウィンドウは `position: fixed`、`100dvh`、`clamp()`、`env(safe-area-inset-bottom)` で制御し、幅360px〜380pxおよび動的URLバー環境で見切れさせないこと。
5. **ピン座標の重なりゼロ**: 探索ピンはユークリッド距離で20%以上離し、同一列（垂直同一直線）への重複配置を避けること。ピン幅は `width: max-content`、ラベルは `white-space: nowrap` と簡潔な名称で端部見切れや極細縦割れを防ぐこと。
6. **実機検証の完了条件**: コード変更後は必ずブラウザツールでPCおよびスマホの両画面をキャプチャ検証すること。
7. **静的解析・SonarQube品質基準の厳守（必須実行ゲート）**:
   - **自動検査コマンドの実行義務**: コード変更後は必ず `npm run check`（Biome 静的解析）および `npm run check:sonar`（`node tests/check_sonar_quality.js`：全作品横断 SonarQube 品質基準チェッカー）を実行し、エラー・警告が **0件** であることを確認してから作業完了とすること。
   - **認知複雑度（S3776: Cognitive Complexity）**: 関数の認知複雑度は 15 以下を絶対遵守。長大関数やコールバック多重ネストは単一責任の小メソッドに分離すること。
   - **安全な構文（S7773）**: `parseInt` ではなく `Number.parseInt` を使用すること。
   - **CSS詳細度（S9423）**: `!important` の使用は全面禁止（0件維持）。`.hidden` による非表示制御は `#hud.hidden, .hud.hidden` 等の複合セレクタで詳細度（Specificity）を確保し、単一要素に複数の上書きパッチセクションを追記しないこと。
   - **重複プロパティ禁止（S4656）**: 同一セレクタブロック内に `height: 100vh; height: 100dvh;` のような同名プロパティを重複記述しないこと（`100dvh` に統一）。
   - **コントラスト比（S7924）**: 背景色と文字色は WCAG AA 基準（4.5:1 以上、推奨 7:1〜10:1 以上）を確保すること。
   - **標準CSS（S1874）**: `word-break: break-word` 等の非推奨構文を避け、`overflow-wrap: break-word` 等の最新標準仕様を採用すること。
8. **LINE・iOS WKWebViewでの音声再生保証**:
   - **WebSpeech初期化誤爆の禁止**: `speechSynthesis` が利用できない環境でも、ユーザーの音声設定 `this.voiceEnabled` を `false` に書き換えて録音MP3ボイスまで停止させないこと。
   - **同期直接再生パイプラインの厳守**: 24kHz MPEG-2 MP3 に対する `decodeAudioData` の `EncodingError` や、非同期タスク跨ぎによる User Gesture Token（操作権限）の失効を避けるため、セリフ進行タップ時に同期的に `HTMLAudioElement.play()` を呼ぶ単一再利用 Audio 設計を維持すること。
   - **マナーモード回避導線の常設**: LINE内ブラウザの消音スイッチ（`ambient`）対策として、タイトル画面等に `?openExternalBrowser=1` を付与した Safari / 外部ブラウザ起動リンクを常設すること。
