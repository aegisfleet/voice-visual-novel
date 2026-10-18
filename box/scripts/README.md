# BOX WORM アセット・音声生成スクリプト (box/scripts)

『BOX WORM 〜55ドルの自己増殖知性〜』専用のアセット生成、音声合成（Google Gemini 3.8 Flash TTS / Vertex AI）、BGM生成、およびテキスト反映用スクリプト群である。

## スクリプト一覧

| スクリプト名 | 種別 | 説明 |
| :--- | :--- | :--- |
| `all_dialogues.json` | データ | BOX WORM 全セリフデータ（話者・セリフ・感情・ID） |
| `apply_all_voices.py` | 反映 | `all_dialogues.json` に基づき `box/js/scenario.js` へ `voiceUrl` を一括付与・更新 |
| `apply_prologue_voices.py` | 反映 | プロローグ（シバタ捜査官の分割セリフ統合等）のセリフ更新反映 |
| `generate_all_box_voices.py` | 音声生成 | Vertex AI (Gemini 3.8 Flash TTS) による全シナリオキャラクターボイス一括生成 |
| `generate_box_prologue.py` | 音声生成 | プロローグシーン専用ボイス生成 |
| `generate_box_samples.py` | 音声生成 | 試聴室（`samples.html`）およびギャラリー用サンプルボイス生成 |
| `generate_debate_questions_and_fixes.py` | 音声生成 | 立証パート（シバタ捜査官の問答全7種等）のボイス生成 |
| `generate_ending_voices.py` | 音声生成 | エンディング（BAD/第一幕クリア/TRUE）ナレーション音声生成 |
| `fix_jisitsu_and_box.py` | 音声生成 | 「自室（じしつ）」等の読み仮名補正・ボイス再生成 |
| `fix_yaegashi_c0_02.py` | 音声生成 | ヤエガシ大家のネットワーク説明ボイス再生成 |
| `generate_piron_sfx.py` | 効果音 | シンセ波形合成による「ピロン♪」証拠取得・正解チャイム音（MP3）生成 |
| `speedup_prologue_voices.py` | 音声加工 | プロローグ音声のピッチ維持倍速加工（ffmpeg atempo） |
| `generate_box_bgm.py` | 音楽生成 | Lyria 3 による BOX WORM シーン別BGM生成 |
| `generate_box_ogp.py` | 画像生成 | BOX WORM 公式OGPバナー画像（1200x630）生成 |
| `make_composite_card_thumb.py` | 画像生成 | 部屋背景とユウタ立ち絵を合成した作品カードサムネイル生成 |
| `chromakey.py` | 画像加工 | グリーンバック画像を透過PNGに変換するクロマキーツール |
| `check_image_refs.py` | 点検 | HTML/JS/CSS内の画像ファイル参照パス一覧抽出 |
