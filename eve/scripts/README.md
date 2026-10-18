# PROJECT EVE アセット・音声生成スクリプト (eve/scripts)

『PROJECT EVE 〜家族のためのハッキング〜』専用のアセット生成、音声合成（Google Gemini 3.8 Flash TTS / Vertex AI）、BGM生成・加工、および多言語化（i18n）スクリプト群である。

## スクリプト一覧

| スクリプト名 | 種別 | 説明 |
| :--- | :--- | :--- |
| `english_translations.py` | データ | EVE 全65シーンの英訳セリフ、話者メタデータ、選択肢・証拠・エンディング対訳辞書 |
| `generate_all_voices.py` | 音声生成 | Vertex AI (Gemini 3.8 Flash TTS) による日本語全シーンボイス一括生成 |
| `generate_all_voices_en.py` | 音声生成 | Vertex AI (Gemini 3.8 Flash TTS) による英語全シーンボイス一括生成 |
| `generate_samples.py` | 音声生成 | 各キャラクター（イブ、サクマ警視、シノハラ等）の試聴室用ボイス生成 |
| `generate_narrator_samples.py` | 音声生成 | ナレーター声優候補（Orus, Puck, Fenrir, Zephyr等）の試聴用音声生成 |
| `generate_i18n_js.py` | 反映 | `english_translations.py` から `eve/js/i18n.js` を自動生成 |
| `generate_bgm.py` | 音楽生成 | Lyria 3 による EVE シーン別BGM生成 |
| `make_seamless_loop.py` | 音楽加工 | 等パワークロスフェードによる完全シームレスループBGM加工 |
| `process_fade_bgm.py` | 音楽加工 | BGM末尾の自然なフェードアウトと静寂インターバル付与加工 |
| `build_avatar_diff_layers.py` | 画像加工 | 解剖学的下顎モーフィング・差分マスキングによる表情差分（目パチ・口パク）自動生成 |
