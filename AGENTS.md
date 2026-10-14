# AGENTS.md - AIエージェント向け指示書

本リポジトリ（voice-visual-novel）で作業するすべてのAIエージェントは、以下のガイドラインおよびプロトコルを無条件で遵守してください。

## 必須参照ドキュメント
- [docs/novel-game-implementation-guidelines.md](file:///d:/Work/voice-visual-novel/docs/novel-game-implementation-guidelines.md)
  - Webノベルゲーム・ADVのUX、ゲームループ、ステート設計の必須要件定義書。
- [docs/agent-novel-game-dev-protocol.md](file:///d:/Work/voice-visual-novel/docs/agent-novel-game-dev-protocol.md)
  - AIエージェントが過去に引き起こした5大過誤の防止策と、2画面実機検証プロトコル。

## 最重要ルール
1. **可逆性の確保（詰み防止）**: 探索 ⇔ 立証の双方向遷移、ゲームオーバーからの現場再調査導線を絶対に断たないこと。
2. **前提条件ガード**: 証拠不足時に立証ボタンを表示させない。ロジック層でも二重にブロックすること。
3. **カタルシスの提供**: 立証成功時は必ず解決エピローグ会話劇を描き、理不尽な即BAD ENDを避けること。
4. **スマホレスポンシブ**: カットインやダイアログは `clamp()` と `max-width` で制御し、幅380px以下で見切れさせないこと。
5. **ピン座標の重なりゼロ**: 探索ピンはユークリッド距離で20%以上離して配置すること。
6. **実機検証の完了条件**: コード変更後は必ずブラウザツールでPCおよびスマホの両画面をキャプチャ検証すること。
