# Nano Banana 2.1 画像アセット生成・統合ガイド (Google Flow CLI)

本書は、Google Flow CLI（`gflow-cli`）を経由して **Nano Banana 2.1（`--model nano2`）** を活用し、Webノベルゲームやアドベンチャーゲームで使用する「キャラクター設定資料シート」「表情差分立ち絵」「漫画風コマ割り挿絵（パラパラ漫画演出）」「背景・UIアセット」を生成・加工・統合する最新の完全制作ガイドである。

---

## 1. ワークフロー概要

ゲーム素材の制作フローは、キャラクター設定の一貫性管理を核とした以下のパイプラインで構成される。

```
[1. キャラクターシート策定] ────> [2. 表情差分立ち絵生成 (i2i)] ────> [3. クロマキー透過] ────> [4. ゲーム組込]
三面図・表情集・配色パレット       --ref でシートを参照し一貫性担保    HSV色空間による透過PNG化    emotionごとの自動切替
(16:9, t2i)                     グリーンバック (#00FF00) (1:1)     (chromakey.py)             (character.js)

[5. 漫画風コマ割り挿絵生成] ─────────────────────────────────────────────────────────────> [6. パラパラ漫画演出]
マルチパネル・映画的構図 (16:9)                                                            cutSequence による
吹き出しなし (no speech bubbles)                                                          タップ送り・自動アニメ
```

---

## 2. 環境構築とCLI実行基盤

### 2.1 必要要件
* Python 3.10 以上（推奨: Python 3.11）
* `gflow-cli`（v0.84.0 以上）
* Google Flow アカウント（`gflow auth login` 認証済み）
* Pillow, numpy（透過処理用: `pip install Pillow numpy`）

### 2.2 PowerShell環境における最重要ルール（文字化け・例外回避）
Windows PowerShell 上で `gflow-cli` を実行する際、CLI内の Unicode 出力文字（`\u2014` 等）により `UnicodeEncodeError: 'cp932'` が発生することがある。**実行時は必ず先頭に `$env:PYTHONIOENCODING="utf-8";` を付与すること。**

```powershell
# PowerShell での実行テンプレート
$env:PYTHONIOENCODING="utf-8"; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
```

---

## 3. CLI実行コマンド仕様（v0.84+ 現行仕様）

旧構文（`gflow generate image`）ではなく、現行のサブコマンド `gflow image t2i` および `gflow image i2i` を使用する。

### 3.1 テキストからの新規生成 (`t2i: Text-to-Image`)
キャラクター設定シート、背景、漫画コマ割り挿絵などの新規生成に使用する。

```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "<PROMPT>" --model nano2 --aspect 16:9 -o "<OUTPUT_PATH>"
```

### 3.2 既存画像を参照した一貫性生成 (`i2i: Image-to-Image / Reference Image`)
**キャラクターシート等の既存画像を `--ref` オプションで渡すことで、同一人物の顔立ち・髪型・服装・配色を維持したまま、異なる表情やポーズの立ち絵を生成できる。**

```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image i2i "<PROMPT>" --ref "<REFERENCE_SHEET_PATH>" --model nano2 --aspect 1:1 -o "<OUTPUT_PATH>"
```

### 3.3 主要オプション一覧
| オプション | 説明 | 指定可能値 / 推奨値 |
| :--- | :--- | :--- |
| `PROMPT` | 描画指示テキスト（英語） | 画風、ポーズ、表情、ライティング、背景色を指定 |
| `--model` | 生成モデル | `nano2` (Nano Banana 2.1 推奨) |
| `--aspect` | アスペクト比 | `16:9` (シート・背景・コマ割り), `1:1` (立ち絵), `9:16`, `4:3`, `3:4` |
| `--ref` | 参照画像パス（`i2i` 専用） | キャラクターシート等のローカルファイルパス（自動アップロード） |
| `-o, --output` | 出力ファイルパス | 保存先のパス（`.jpg` または `.png`） |

---

## 4. 漫画風コマ割り画像の作り方（パラパラ漫画演出・劇中カット）

### 4.1 設計思想（MangaAgentsStudio-A 準拠）
セリフ（台詞）はゲームの会話ウィンドウ側で表示・再生するため、**画像内に文字吹き出しやテキストを直接描画させない（文字化け・フォント違和感を徹底排除する）**。
その代わり、映画的・漫画的な「マルチパネル（分割コマ）構図」「ズームアップと全景の対比」「緊迫したサイバーライティング」を1枚の絵の中に凝縮する。

### 4.2 コマ割り用 必須プロンプト構文
```text
Dynamic full color anime manga comic panel layout, split panels, cinematic composition,
[メインの事象・人物のアクション],
[第1パネル: 目元や計器のクローズアップ],
[第2パネル: 現場全景や劇的変化],
[サイバーパンク・サスペンスライティング: neon cyan and crimson alert lighting],
no speech bubbles, no dialogue text, clean composition
```

* **`Dynamic full color anime manga comic panel layout, split panels`**:
  漫画特有の斜めコマ割りや上下分割コマをAIに指示する。
* **`no speech bubbles, no dialogue text, clean composition`**:
  吹き出し（speech bubble）の発生を強力に抑止する必須ネガティブ指示。
* **`--aspect 16:9`**:
  横長ワイド画面により、複数のコマがダイナミックに配置されやすくなる。

### 4.3 劇中カット生成実績例（『GHOST PROTOCOL』）

#### ① Chapter 1: 口座残高蒸発シークエンス（高速注文とチャート急落）
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Dynamic full color anime manga comic panel layout, split panels, dramatic cyberpunk anime style, close-up of panicked trader eyes sweating, multiple monitors displaying rapid automated sell orders TRY/ZAR 850pps, falling financial chart, red emergency lights in server room, cinematic anime art, no speech bubbles, clean composition" --model nano2 --aspect 16:9 -o "ghost/assets/sequences/ch1_cut1.jpg"
```

#### ② Chapter 2: 永続ソケットバイパス（暗闇のハッカー端末）
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Dynamic full color anime manga comic panel layout, split panels, dramatic cyberpunk thriller anime style, unauthorized trade execution bypassing authentication, hooded hacker in dark room laughing at terminal screen, code streaming on multi-monitors, exchange server receiving spoofed high-speed sell orders, financial chart crashing into red abyss, dramatic neon cyan and red lighting, cinematic anime art, no speech bubbles, clean composition" --model nano2 --aspect 16:9 -o "ghost/assets/sequences/ch2_cut3.jpg"
```

#### ③ Chapter 3: リバースRDP（アンチウイルス素通りデータ流出）
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Dynamic full color anime manga comic panel layout, split panels, cyberpunk anime style, antivirus green shield showing safe status, while tax documents and Chrome Login Data files are exfiltrated into zip file, cyber theft, neon green and red lighting, no speech bubbles" --model nano2 --aspect 16:9 -o "ghost/assets/sequences/ch3_cut3.jpg"
```

#### ④ Chapter 5: 逆探知カナリア発火（真C2ロックオン）
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Dynamic full color anime manga comic panel layout, split panels, dramatic cyberpunk anime style, command center hologram radar locking onto Frankfurt Germany datacenter, IP 91.240.118.174 displayed in bright red crosshair target, Commander Kuroda pointing forward commanding operation, decisive cyber lock on, neon cyber anime art, no speech bubbles" --model nano2 --aspect 16:9 -o "ghost/assets/sequences/ch5_cut4.jpg"
```

---

## 5. キャラクター設定資料シート（三面図・表情集）の作り方

### 5.1 キャラクターシートの構成要素
各キャラクターのビジュアル同一性を維持するため、以下の要素を1枚に収めたモデルシートを最初に生成する。
1. **全身三面図**: 正面（Front view）、斜め（Three-quarter view）、背面（Back view）
2. **表情バリエーション**: 平常（Calm/Analytical）、危機・焦燥（Panicked/Alert）、決意・笑顔（Determined/Smile）
3. **衣装・小物のディテール線画**: メガネ、IDバッジ、ヘッドセット、スーツ襟章など
4. **カラーパレットスウォッチ**: 髪色、肌色、服色のカラーサンプル

### 5.2 キャラクターシート用 プロンプト構文
```text
Official anime character model sheet of [名前], [年齢・性別・職業・属性],
[固有の髪型・髪色], [瞳の色・目元の特徴], [眼鏡やアクセサリ],
[固有の服装・ジャケット・インナー・パンツ],
full body front view, three-quarter view, multiple facial expressions (analyzing, calm, shocked),
costume sketches, color swatches, clean light gray background, consistent anime concept art, no text
```

### 5.3 設定シート生成実績例（『GHOST PROTOCOL』）

#### ① ナギサ ケイ (渚 慧) / 27歳男性・主人公・独立系エンジニア
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Official anime character model sheet of Nagisa Kei, 27-year-old male Japanese cybersecurity engineer, thin square rimmed glasses, sharp intelligent dark eyes, short messy jet black hair, wearing black turtleneck and dark slate technical jacket, smartwatch, full body front view, three-quarter view, multiple facial expressions (analyzing, calm, shocked), costume sketches, color swatches, clean background, consistent anime concept art, no text" --model nano2 --aspect 16:9 -o "ghost/assets/characters/sheets/sheet_kei.jpg"
```

#### ② タカミヤ レン (高宮 蓮) / 27歳男性・CSIRT現場リーダー
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Official anime character model sheet of Takamiya Ren, 27-year-old male Japanese CSIRT emergency leader, dark brown medium hair with subtle ash green highlights, warm amber eyes, passionate expression, wearing rolled-up white dress shirt, navy blue operator tactical vest, lanyard ID badge necklace, full body front view, three-quarter view, multiple facial expressions (passionate, determined, panicked), costume sketches, color swatches, clean background, consistent anime concept art, no text" --model nano2 --aspect 16:9 -o "ghost/assets/characters/sheets/sheet_takamiya.jpg"
```

#### ③ アリア (ARIA) / 自律型電脳鑑識AI・少女型ホログラム
```powershell
$env:PYTHONIOENCODING="utf-8"; gflow image t2i "Official anime character model sheet of ARIA, autonomous cyber forensic AI agent girl holographic avatar, glowing cyan blue twintails hair with digital particles, glowing blue digital eye irises, translucent cyber visor, wearing futuristic white and navy bodysuit with glowing cyan data circuits, full body front view, three-quarter view, multiple expressions (analytical, alert, gentle smile), cyber visor sketches, color swatches, clean background, consistent anime concept art, no text" --model nano2 --aspect 16:9 -o "ghost/assets/characters/sheets/sheet_aria.jpg"
```

---

## 6. キャラクターシートを参照した表情差分立ち絵の生成手順

### 6.1 フロー概要
1. 先に生成した `ghost/assets/characters/sheets/sheet_{charId}.jpg` を `--ref` 引数に指定する。
2. 背景を単一グリーンバック（`#00FF00`）に指定する。
3. `gflow image i2i` を実行してRAW画像（JPEG）を出力する。
4. クロマキー透過スクリプト（`chromakey.py`）を実行して透過PNG（`{charId}_{emotion}.png`）を生成する。

### 6.2 実行例：タカミヤの焦燥・パニック表情（`panic`）立ち絵
```powershell
# 1. シートを参照してグリーンバック画像を生成
$env:PYTHONIOENCODING="utf-8"; gflow image i2i "Waist-up anime character portrait of Takamiya Ren, severe panicking expression, sweating, wide open eyes, open mouth shouting in distress, wearing rolled-up white dress shirt and navy tactical vest with lanyard badge, isolated on a solid uniform pure bright chroma key green background (#00FF00), completely flat background, no shadows on background, no green spill on hair or clothes" --ref "ghost/assets/characters/sheets/sheet_takamiya.jpg" --model nano2 --aspect 1:1 -o "scratch/raw_takamiya_panic.jpg"

# 2. 自動クロマキー透過
python box/scripts/chromakey.py "scratch/raw_takamiya_panic.jpg" "ghost/assets/characters/takamiya_panic.png"
```

### 6.3 感情（Emotion）の命名規則
| 表情キー (`emotion`) | 想定シーン・感情 | プロンプト指示キーワード |
| :--- | :--- | :--- |
| `normal` | 通常・冷静な説明・待機 | `calm confident expression, composed look, slight smile` |
| `serious` | 真剣・作戦決断・睨み | `serious intense gaze, sharp focused eyes, tight lips` |
| `panic` / `shock` | 危機・想定外の事態・焦燥 | `panicked expression, sweating, wide shocked eyes, shouting` |
| `smile` / `relieved` | 安堵・事件解決・信頼 | `warm relieved smile, gentle happy expression, soft eyes` |

---

## 7. ゲームコード（JS/CSS）との統合仕様

### 7.1 `character.js` の表情差分データ定義
```javascript
window.CHARACTER_DATA = {
  takamiya: {
    id: 'takamiya',
    name: 'タカミヤ レン (高宮 蓮)',
    color: '#4ade80',
    sprite: 'assets/characters/takamiya.png', // デフォルト立ち絵
    sheet: 'assets/characters/sheets/sheet_takamiya.jpg', // 設定資料シート
    sprites: {
      normal: 'assets/characters/takamiya_normal.png',
      panic: 'assets/characters/takamiya_panic.png',
      serious: 'assets/characters/takamiya_serious.png',
      smile: 'assets/characters/takamiya_smile.png',
    },
  },
  // ...
};
```

### 7.2 `scenario.js` でのセリフ指定
```javascript
{
  speaker: 'takamiya',
  sprite: 'takamiya',
  emotion: 'panic', // 表情差分キーを指定
  text: 'ケイ、問い合わせ窓口が完全にパンクしている……！ 1時間で数千件の口座破綻報告だ。一体どこから手を付ければいいんだ！？',
  sfx: 'alert',
}
```

### 7.3 `app.js` での表情動的切り替え
`updateCharacterSprite(spriteId, emotion)` において、`this.characters[spriteId]?.sprites?.[emotion] || this.characters[spriteId]?.sprite` を選択して `img.src` をスムーズに切り替える。同一キャラで表情のみ変化した場合は、立ち絵DOMを破棄せずフェードトランジションで表情を滑らかに更新する。
