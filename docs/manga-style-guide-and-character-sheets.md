# GHOST PROTOCOL 漫画風ビジュアルスタイルガイド＆キャラクターリファレンス仕様書
（MangaAgentsStudio-A 準拠マスター定義書）

本ドキュメントは、[MangaAgentsStudio-A](https://github.com/potechitakusan/MangaAgentsStudio-A) の作画・演出・設定一貫性フレームワークに準拠し、『GHOST PROTOCOL』における全画像アセット（マルチカット挿絵、証拠品カード、重要アイテム、背景美術、キービジュアル）の統一感を保証するためのマスター設計書である。

---

## 1. 作品統合作画スタイル（Master Art Style Directive）

本作のグラフィックは、キャラクターシート（`sheet_kei.jpg`, `sheet_aria.jpg`, `sheet_takamiya.jpg` 等）が確立した**「現代日本アニメ・本格サイバーパンク劇画漫画（Anime & Manga Noir Style）」**に完全統一する。実写風・3D CG・西洋アメコミ調を排し、以下のルールを徹底する。

### ① 基本作画・線画ルール（Line Art & Shading）
- **完全フルカラー作画（Vibrant Full Color Anime & Manga Cel Coloring）**:
  白黒・モノクロ・グレースケールを排し、美麗なアニメ塗り・フルカラー劇画（カラーWebtoon・アニメーション本編作画調）で統一する。
- **クリーンで力強いインク主線（Clean & Crisp Ink Outlines）**:
  輪郭線・メカ・UIフレームに至るまで、精緻なペン入れ（Gペン・丸ペン調のシャープなインクライン）を保持する。
- **フルカラー・セルシェーディングと彩色スクリーントーン（Colorful Cel Shading & Color Halftone Aesthetics）**:
  明確な明暗境界を持つアニメ塗り（Cel Shading）、要所にフルカラーのカラーハーフトーンやスピード線、光彩エフェクトを付与する。
- **ハイコントラスト・サイバーノワール色彩設計（Rich Cyber-Noir Color Palette）**:
  深みのあるダークネイビー/チャコールの影と、鮮烈に発光するシアン・エメラルド・オレンジ・クリムゾンレッドのサイバーネオン光を対比させ、圧倒的なサスペンス・臨場感を演出する。

### ② 漫画的演出技法（Manga Cinematic Techniques）
- **劇的アングルとコマ割り構図（Dynamic Manga Framing & Dutch Angles）**:
  V01〜V14（`MangaAgentsStudio-A` 演出指針）に基づき、極端なクローズアップ（目元・指先・ミリ秒メーター）、斜め煽り（Low-angle dramatic shot）、緊迫のスプリットスクリーン（対比分割コマ）を採用。
- **効果線・集中線（Focus Lines & Speedlines）**:
  ミリ秒単位の残高蒸発やカナリアビーコン発火、テイクダウンの瞬間など、情報の緊迫度に応じて漫画的集中線・スピード線を効果的に配置する。
- **情報と図版の可読性（Visual Readability）**:
  重要な数値（400万円、26,739台、91.240.118.174、1,000,000 USD、113件等）やエラーコードが読者の視線誘導の中心に配置されるよう画面設計を行う。

---

## 2. 登場人物マスターキャラクターリファレンス（Character Sheets）

全登場人物の外見・キーアイテム・カラーパレットを固定し、カットインや群像劇シーンでの整合性を厳密に保持する。

```
                    【GHOST PROTOCOL 主要キャラクター対比表】
┌─────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ ナギサ ケイ │   アリア (ARIA)  │ タカミヤ レン   │  クロダ統括官   │   ミオ分析官    │
│  (主人公)   │   (電脳鑑識AI)  │   (CSIRT現場)   │   (NCO指揮官)   │   (通信情報)    │
├─────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ 黒髪スクエア│ 発光シアンツイン│ アッシュブラウン│ 白髪混オールバッ│ ラベンダーボブ  │
│ 眼鏡・テック│ テール・バイザー│ タクティカル    │ ク・高級スーツ  │ 丸眼鏡・大型    │
│ ジャケット  │ サイバースーツ  │ ベスト・白シャツ│ ゴールドピン    │ ヘッドホン      │
│ #38bdf8     │ #00f3ff         │ #4ade80         │ #f97316         │ #c084fc         │
└─────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 1. ナギサ ケイ (Kei Nagisa)
- **シート画像**: `ghost/assets/characters/sheets/sheet_kei.jpg`
- **特徴**: 27歳。黒髪短髪、シャープな黒縁スクエア眼鏡。ダークスレート（暗灰緑）のミリタリーテックジャケット、黒タートルネック、黒スリムパンツ、スマートウォッチ。
- **キャラクター性**: 冷静沈着、鋭い観察眼、論理的思考。
- **シンボルカラー**: シアンブルー (`#38bdf8`)

### 2. アリア (ARIA)
- **シート画像**: `ghost/assets/characters/sheets/sheet_aria.jpg`
- **特徴**: 発光するアクアブルーのロングツインテール（毛先がデジタルピクセルに霧散）。半透明ホログラムバイザー、白・黒・ネオンシアンのサイバースーツ。
- **キャラクター性**: 超高速解析、論理的かつ忠実、感情の芽生え。
- **シンボルカラー**: ネオンシアン (`#00f3ff`)

### 3. タカミヤ レン (Ren Takamiya)
- **シート画像**: `ghost/assets/characters/sheets/sheet_takamiya.jpg`
- **特徴**: 27歳。アッシュブラウンの無造作ヘア。ネイビーの多ポケット・タクティカルベスト、腕まくりした白シャツ、首掛け社員証IDカード、ダークカーゴパンツ。
- **キャラクター性**: 熱血、仲間思い、自責と悔恨を乗り越える強い意志。
- **シンボルカラー**: ライトグリーン (`#4ade80`)

### 4. クロダ統括官 (Commander Kuroda)
- **シート画像**: `ghost/assets/characters/sheets/sheet_kuroda.jpg`
- **特徴**: 52歳。威厳ある白髪混じりのオールバック、鋭い眼光。仕立ての良いダークチャコールスリーピーススーツ、襟元に国家サイバー統括室のゴールド記章ピン。
- **キャラクター性**: 厳格、法秩序の守護者、現場の覚悟を見届けて職権を発動する大人の包容力。
- **シンボルカラー**: オレンジ (`#f97316`)

### 5. ミオ分析官 (Analyst Mio)
- **シート画像**: `ghost/assets/characters/sheets/sheet_mio.jpg`
- **特徴**: 24歳。淡いラベンダーパープルのボブカット、シルバーの丸眼鏡、首掛けの大型ワイヤレスヘッドホン。オーバーサイズのニットカーディガン。
- **キャラクター性**: マイペースな電脳天才少女、凄腕パケット解析官。
- **シンボルカラー**: パープル (`#c084fc`)

---

## 3. アセットカテゴリ別 漫画風プロンプト生成プロトコル

### ① マルチカット挿絵（Sequences: 全19枚）
- **アスペクト比**: 16:9 (`--aspect 16:9`)
- **共通スタイル接頭辞**:
  `Masterpiece Japanese manga and anime style, dramatic manga panel cut, clean ink line art, cel shading, high contrast noir cyberpunk lighting, intense suspense, dynamic angle, screentone shading, sharp outlines, detailed background art`
- **否定プロンプト**:
  `3d render, western comic style, photorealistic human, realistic photo, blurry, bad anatomy, deformed line, lowres`

### ② 証拠品カード（Evidence: 全6枚）
- **アスペクト比**: 1:1 (`--aspect 1:1`)
- **共通スタイル接頭辞**:
  `Masterpiece Japanese manga forensic evidence card, cyber investigation prop illustration, detailed anime line art, crisp technical blueprint and cyber crime logs, high-tech holographic overlay, bold manga ink contours, crisp UI text`

### ③ 重要アイテム（Items: 全4枚）
- **アスペクト比**: 1:1 (`--aspect 1:1`)
- **共通スタイル接頭辞**:
  `Masterpiece Japanese manga key item asset card, iconic cyber device, sci-fi forensic gadget, clean Japanese anime line art, isometric perspective, high contrast cel shading, metallic screentone, neon accents`

### ④ 背景美術（Backgrounds: 全2枚）
- **アスペクト比**: 16:9 (`--aspect 16:9`)
- **共通スタイル接頭辞**:
  `Masterpiece Japanese anime background art, detailed manga sci-fi scenery, crisp architectural line art, cinematic cyberpunk room, dramatic rim lighting, cel shaded atmosphere`

### ⑤ メインキービジュアル（Keyvisual: 全2枚）
- **アスペクト比**: 16:9 (`--aspect 16:9`)
- **共通スタイル接頭辞**:
  `Masterpiece manga cover art, dynamic anime full-color spread, Kei Nagisa with glasses in foreground, holographic Aria projecting data streams, Ren Takamiya in tactical vest, massive cyber incident command center, intense climax composition, bold ink lines, dramatic cel shading`

