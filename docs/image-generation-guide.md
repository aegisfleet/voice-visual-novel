# Nano Banana 2.1 画像アセット生成・統合ガイド (Google Flow CLI)

本書は、Google Flow CLI（`gflow`）を経由して **Nano Banana 2.1（`--model nano2`）** を活用し、ノベルゲームで使用するキャラクター立ち絵、アイテムスプライト、シネマティック背景画像を生成・加工・ゲームへ組み込む全手順をまとめた実践的ドキュメントである。

---

## 1. ワークフロー概要

ゲーム素材の制作フローは以下の3段階で構成される。

```
[1. gflow CLI] ────> [2. chromakey.py] ────> [3. ゲーム組込]
Nano Banana 2.1       HSV色空間での自動透過    CSS/JSでの配置
・グリーンバック立ち絵   エッジ平滑化処理        キャラクター立ち絵
・背景アート (16:9)    透過PNG出力            探索ピン・証拠品
・アイテムスプライト
```

---

## 2. 環境構築とセットアップ

### 2.1 必要要件
* Python 3.10 以上（推奨: Python 3.11）
* Google Flow アカウント

### 2.2 Google Flow CLI のインストール
CLIツール `gflow-cli` をインストールまたは最新版にアップデートする。

```powershell
# PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
pip install -U gflow-cli
```

### 2.3 認証（ログイン）
Googleアカウントで認証を行う。ブラウザが自動的に立ち上がり、トークンが保存される。

```powershell
# ログイン
gflow auth login

# 認証ステータスの確認
gflow auth status
```

ステータスが `Logged in as: <メールアドレス>` となっていれば準備完了である。

### 2.4 画像処理ツールの依存関係
クロマキー透過処理スクリプト（`box/tools/chromakey.py`）用に Pillow と numpy をインストールする。

```powershell
pip install Pillow numpy
```

---

## 3. CLI実行コマンド仕様

`gflow generate image` コマンドで `--model nano2` を指定することで、最新の **Nano Banana 2.1** エンジンが呼び出される。

```powershell
# 基本構文
gflow generate image "<プロンプト>" --model nano2 --output "<出力ファイルパス>"
```

### パラメータ解説
| 引数 / オプション | 説明 | 推奨値 / 備考 |
| :--- | :--- | :--- |
| `PROMPT` | 描画指示テキスト（英語推奨） | 構図、画風、背景色（立ち絵の場合はグリーンバック）を明確に指示 |
| `--model` | 使用するAIモデル | `nano2`（Nano Banana 2.1） |
| `--output` | 出力ファイル名・パス | `.png` または `.jpg` |

---

## 4. プロンプト設計テクニック

### 4.1 キャラクター立ち絵（クロマキー透過用）
キャラクターを背景から綺麗に切り抜くため、以下のキーワードをプロンプトの末尾に必ず付与する。

> **必須キーワード**:
> `standing pose, waist-up portrait, facing viewer, anime visual novel style, high detail, masterpiece, isolated on a solid uniform chroma key bright green background (#00FF00), completely flat clean background, no green reflection on body`

* **ポイント**: 単に `green background` と書くのではなく、`solid uniform chroma key bright green background` と指定することで、グラデーションや影の混入を防ぐことができる。

### 4.2 背景画像（16:9 シネマティックアート）
ゲーム画面をリッチに彩る背景アートを生成する際の指定方法。

> **必須キーワード**:
> `visual novel background, anime background art, highly detailed, Makoto Shinkai style lighting, cinematic composition, widescreen, atmospheric cyberpunk lighting`

### 4.3 アイテム・小物スプライト
探索ピンや証拠手帳で使用するアイテム画像。

> **必須キーワード**:
> `isolated object, studio lighting, product shot, front view, clean edges, isolated on a solid uniform pure bright green background (#00FF00)`

---

## 5. 本作（BOX WORM）での生成実績プロンプト集

本作のキャラクター・背景・アイテムはすべて以下のプロンプトにより Nano Banana 2.1 で生成された。

### 5.1 キャラクター立ち絵

#### ① ユウタ（主人公・若手エンジニア）
```powershell
gflow generate image "An anime young Japanese man in his early 20s, dark messy short hair, wearing glasses, black hoodie over a navy t-shirt, headphones around neck, slight worried expression, standing pose, waist-up portrait, anime visual novel style, high detail, masterpiece, isolated on a solid uniform chroma key bright green background (#00FF00), completely flat clean background, no green reflection on body" --model nano2 --output "box/assets/characters/raw_yuta.png"
```

#### ② シバタ捜査官（警視庁サイバー犯罪対策課）
```powershell
gflow generate image "A stern Japanese male cybercrime police detective in his late 40s, sharp intelligent eyes behind silver rimmed glasses, slicked back hair with slight gray streaks, wearing a tailored dark navy suit and dark trench coat with a sharp crimson necktie, calm intimidating aura, waist-up portrait, anime visual novel character art, highly detailed, clean lines, isolated on a solid uniform pure bright green background (#00FF00), no shadows on background, no green reflections on clothes" --model nano2 --output "box/assets/characters/raw_shibata.png"
```

#### ③ 隣人アオイ（202号室住人）
```powershell
gflow generate image "A cute friendly Japanese young woman in her early 20s, medium length soft wavy brown hair, wearing a cozy lavender cardigan over a white blouse, gentle anxious facial expression, holding hands near chest nervously, waist-up portrait, modern anime visual novel character sprite, high quality, soft studio lighting, isolated on a solid uniform pure bright chroma key green background (#00FF00), flat clean background, no green spill on hair or clothing" --model nano2 --output "box/assets/characters/raw_aoi.png"
```

#### ④ 大家のヤエガシ（メゾン・サクラ管理人）
```powershell
gflow generate image "A genial friendly Japanese elderly landlord in his late 60s, gentle smiling face with crow's feet and neat mustache, wearing utility vest over a beige work shirt, dependable elderly character, waist-up portrait, anime visual novel sprite, high detail, isolated on a solid uniform pure bright green background (#00FF00), completely flat background, no green shadows" --model nano2 --output "box/assets/characters/raw_yaegashi.png"
```

#### ⑤ MIMI（TVボックスに宿った自己増殖電脳知性）
```powershell
gflow generate image "A mysterious and ethereal digital cyber AI girl entity, translucent glowing teal and cyan holographic appearance, floating in digital matrix space, delicate futuristic android features, faint glowing cybernetic lines on skin, floating data particles, waist-up visual novel character sprite, masterpiece, isolated on a solid uniform pure bright green background (#00FF00), clean edges for chroma key cutout" --model nano2 --output "box/assets/characters/raw_mimi.png"
```

---

### 5.2 背景アート

#### ① 201号室（ユウタの自室・ワンルーム）
```powershell
gflow generate image "Anime visual novel background, an authentic cozy Tokyo studio apartment room at dusk, messy desk with multiple computer monitors displaying code and glowing network activity graphs, cables running neatly, a cheap black TV box glowing with a small cyan LED next to a television, bed in the corner, urban evening view through window, neon purple and teal moody cyber ambient lighting, highly detailed anime background art, Makoto Shinkai aesthetic" --model nano2 --output "box/assets/backgrounds/bg_room.jpg"
```

#### ② アパート共用部・外廊下
```powershell
gflow generate image "Anime visual novel background, the outdoor corridor walkway of an old Japanese apartment building at night, rows of green apartment doors with room number plates (201, 202), industrial electrical conduit pipes, communal smart electric meter boxes with blinking red and green status lights, handrail overlooking quiet Tokyo residential city night lights, cool fluorescent light overhead casting moody shadows, cinematic anime background, realistic urban textures, high resolution" --model nano2 --output "box/assets/backgrounds/bg_corridor.jpg"
```

#### ③ 玄関口・立証対決
```powershell
gflow generate image "Anime visual novel background, dramatic confrontation view inside an apartment entrance genkan doorway facing the open door, sharp dramatic backlighting from hallway, cyber investigative atmosphere, tense thriller composition, cinematic anime background art, high resolution, dark moody tones with red and cyan accent highlights" --model nano2 --output "box/assets/backgrounds/bg_debate.jpg"
```

#### ④ タイトル画面（15台メッシュ電脳アート）
```powershell
gflow generate image "Cinematic title visual novel illustration, 15 small black IoT TV boxes connected by glowing cyan neural network data threads forming an emergent digital mind in the shape of a subtle digital ghost silhouette, dark cybernetic room, 0.39 tokens per second telemetry graphs, glowing cables, Ghost in the Shell inspired digital life emergence, high resolution 8k anime art, breathtaking cinematic masterpiece" --model nano2 --output "box/assets/backgrounds/bg_title.jpg"
```

---

### 5.3 アイテムスプライト

#### 55ドル TVボックス
```powershell
gflow generate image "A small sleek generic matte black IoT TV streaming box device, front angled 3/4 perspective, subtle blue status power LED dot glowing, ventilation slits on side, HDMI port visible on rear edge, clean modern industrial hardware design, studio product photo, isolated on a solid uniform pure bright chroma key green background (#00FF00), crisp sharp edges, no green reflection on black plastic" --model nano2 --output "box/assets/items/raw_tv_box.png"
```

---

## 6. クロマキー透過ツール (`box/tools/chromakey.py`) の使い方

グリーンバック画像から緑色背景を高精度に検出し、キャラクターのフチを滑らかに保ちながら透過PNGへ変換するPythonスクリプト。

### 6.1 実行方法
```powershell
# 基本実行: 単一ファイルの透過処理
python box/tools/chromakey.py box/assets/characters/raw_yuta.png box/assets/characters/yuta.png

# パラメータ調整を伴う実行（緑色の許容範囲・スムーズネス指定）
python box/tools/chromakey.py box/assets/items/raw_tv_box.png box/assets/items/tv_box.png --hue-low 35 --hue-high 85 --smoothness 15
```

### 6.2 主なオプション
* `--hue-low`: 検出する緑色色相の下限（デフォルト: `35`）
* `--hue-high`: 検出する緑色色相の上限（デフォルト: `85`）
* `--sat-min`: 検出する彩度の最小値（デフォルト: `60`）
* `--val-min`: 検出する明度の最小値（デフォルト: `50`）
* `--smoothness`: フチのアルファフェザー幅（デフォルト: `12`）

---

## 7. ゲームへの組み込み手順

生成した画像は、ゲームの各コンポーネントに以下のように配備・登録する。

### 7.1 ディレクトリ配置
```
box/assets/
├── characters/
│   ├── yuta.png       # ユウタ立ち絵 (透過PNG)
│   ├── shibata.png    # シバタ捜査官 (透過PNG)
│   ├── aoi.png        # 隣人アオイ (透過PNG)
│   ├── yaegashi.png   # 大家ヤエガシ (透過PNG)
│   └── mimi.png       # MIMI (透過PNG)
├── backgrounds/
│   ├── bg_title.jpg    # タイトル画面背景
│   ├── bg_room.jpg     # 201号室 (自室)
│   ├── bg_corridor.jpg # 外廊下・共用部
│   └── bg_debate.jpg   # 玄関口・立証対決
└── items/
    └── tv_box.png     # 55ドルTVボックス (透過PNG)
```

### 7.2 キャラクターコントローラーへの登録 (`box/js/character.js`)
```javascript
renderCharacterHtml(charId) {
  const assetMap = {
    yuta: 'assets/characters/yuta.png',
    shibata: 'assets/characters/shibata.png',
    aoi: 'assets/characters/aoi.png',
    yaegashi: 'assets/characters/yaegashi.png',
    mimi: 'assets/characters/mimi.png'
  };

  const imgSrc = assetMap[charId];
  if (!imgSrc) return '';

  return `
    <div class="char-avatar char-wrapper-${charId} emotion-normal">
      <img class="char-sprite-img char-img-${charId}" src="${imgSrc}" alt="${charId}" />
    </div>
  `;
}
```

### 7.3 探索スポット・NPC・証拠品への登録 (`box/js/scenario.js`)
```javascript
// スポット
{
  id: 'spot_tvbox',
  name: 'テレビ横の黒い小箱（TVボックス）',
  coords: { x: 91, y: 62 },
  icon: '📺',
  image: 'assets/items/tv_box.png', // ピン表示用サムネイル
  evidenceId: 'tv_box_thermal',
  ...
}

// NPC
{
  id: 'npc_aoi',
  name: '隣室の住人アオイ',
  coords: { x: 56, y: 56 },
  icon: '👧',
  image: 'assets/characters/aoi.png', // ピン表示用顔アイコン
  ...
}

// 証拠手帳
tv_box_thermal: {
  id: 'tv_box_thermal',
  name: '触れないほど異常発熱したTVボックス',
  icon: '🔥',
  image: 'assets/items/tv_box.png', // 証拠カードサムネイル
  ...
}
```

### 7.4 キャッシュ対策（`box/index.html`）
ブラウザ（特に Chrome や Edge）が以前のCSSやJSファイルをキャッシュして新画像が表示されない現象を防ぐため、アセット更新時はリビジョンパラメータを付与する。

```html
<link rel="stylesheet" href="css/style.css?v=20261014_rev3">
<script src="js/character.js?v=20261014_rev3"></script>
<script src="js/scenario.js?v=20261014_rev3"></script>
<script src="js/app.js?v=20261014_rev3"></script>
```

---

## 8. まとめ

* **Nano Banana 2.1**（`--model nano2`）は、繊細なアニメテイストのキャラクター表現やサイバーパンク調のシネマティックライティングにおいて極めて高い描画品質を発揮する。
* **グリーンバック指定** と **自動クロマキースクリプト** の連携により、余白透過PNGの制作を1コマンドで完結できる。
* 今後新しいキャラクターやアイテムを追加する際も、本ガイドのプロンプト構文とスクリプトを再利用することで、同一の世界観・画風を維持したまま素材を量産可能である。
