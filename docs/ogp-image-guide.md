# OGP画像・サイトアセット生成＆改変ガイド

本書は『VOICE VISUAL NOVELS』ポータルおよび『PROJECT EVE』で使用される **SNS用OGPバナー画像（1200×630px）** や **ファビコン・アプリアイコン群** の仕様、生成スクリプトの実行方法、および今後デザインやテキストを改変・カスタマイズする際の手順と注意点をまとめたドキュメントである。

---

## 1. アセット仕様一覧

| 種類 | 出力ファイルパス | 解像度 / 仕様 | 用途 |
| :--- | :--- | :--- | :--- |
| **ポータル公式OGP** | `assets/images/ogp-portal.png` | 1200 × 630 px (PNG) | ポータルサイト (`index.html`) のSNSシェア・Xカード |
| **PROJECT EVE公式OGP** | `assets/images/ogp-eve.png`<br>`eve/assets/ogp.png` | 1200 × 630 px (PNG) | EVE本編・小説・試聴室のSNSシェア・Xカード |
| **SVGファビコン** | `assets/icons/favicon.svg`<br>`favicon.svg` | ベクター (64×64 viewBox) | モダンブラウザタブ用（高精細・ダーク対応） |
| **マルチサイズICO** | `assets/icons/favicon.ico`<br>`favicon.ico` | 16/32/48 px 内包 | レガシーブラウザおよびルート自動参照用 |
| **Apple Touch Icon** | `assets/icons/apple-touch-icon.png`<br>`apple-touch-icon.png` | 180 × 180 px (PNG) | iOS Safari ホーム画面追加時アイコン |
| **PWA Web App Icon** | `assets/icons/icon-192.png`<br>`assets/icons/icon-512.png` | 192×192 / 512×512 px | Android / PWA インストール用アイコン |

---

## 2. 生成環境と必要なツール

アセットの生成は Python と画像処理ライブラリ **Pillow (PIL)** を用いて自動化されている。

* **動作環境**: Python 3.10 以上
* **必須ライブラリ**: `Pillow`
  ```bash
  pip install Pillow
  ```
* **使用フォント**:
  * **欧文タイトル・HUD**: Google Fonts 公式（リポジトリの `scripts/fonts/` に同梱）
    * `Orbitron-Black.ttf`（メインタイトル用）
    * `ChakraPetch-Bold.ttf`（HUDバッジ・タグ・URL用）
  * **日本語テキスト**: Windows標準の `C:/Windows/Fonts/meiryob.ttc`（メイリオ Bold）
    * ※太字ウェイトが明瞭で、ディスプレイ解像度を問わず極めて高い可読性を維持できる。

---

## 3. アセット生成の実行手順

リポジトリルートで以下のコマンドを実行するだけで、すべてのOGP画像およびファビコン群が一括で再生成・上書きされる。

```powershell
# PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
python scripts/generate_site_assets.py
```

### 実行時の出力例
```text
Created: D:\Work\voice-visual-novel\assets\icons\favicon.svg
Favicon files created successfully.
Generating refined OGP banners...
Successfully generated: D:\Work\voice-visual-novel\assets\images\ogp-portal.png
Successfully generated: D:\Work\voice-visual-novel\assets\images\ogp-eve.png
Copied to: D:\Work\voice-visual-novel\eve/assets\ogp.png
Done!
```

---

## 4. OGPデザイン改変・カスタマイズ手順

デザインや文言を変更する場合は、[`scripts/generate_site_assets.py`](file:///d:/Work/voice-visual-novel/scripts/generate_site_assets.py) 内の該当箇所を編集する。

### 4.1 テキスト・キャッチコピーの変更
スクリプト内の各関数（`render_portal_ogp` / `render_eve_ogp`）にあるテキスト変数を書き換える。

* **バッジテキスト**:
  ```python
  badge_label = "AI FULL VOICE // CYBER FORENSICS ADV"
  ```
* **メインタイトル / サブタイトル**:
  ```python
  draw.text((startX, 94), "PROJECT EVE", font=font_orbitron_huge, fill=(255, 255, 255, 255))
  draw.text((startX, 158), "〜 家族のためのハッキング 〜", font=font_jp_title, fill=(45, 212, 191, 255))
  ```
* **あらすじ・リード文**:
  ```python
  draw.text((startX, 224), "国家中枢から国民5,400万人の個人情報流出事件。", font=font_jp_lead, fill=(255, 255, 255, 255))
  draw.text((startX, 258), "被疑者は――1台の家庭用少女型ロボットだった。", font=font_jp_lead, fill=(0, 243, 255, 255))
  ```
* **タグの追加・変更**:
  ```python
  eve_tags = ["AI FULL VOICE", "BROWSER FREE PLAY", "MULTI ENDING", "NO INSTALL"]
  ```

### 4.2 背景画像の変更
* `bg_path` に指定する画像ファイルパスを変更する。
* **推奨背景**:
  * ポータル用: `eve/assets/backgrounds/cyber_core.jpg`
  * PROJECT EVE用: `eve/assets/backgrounds/cyber_hq.jpg`
* **注意**: ゲームプレイ中のスクリーンショットをそのまま使うと、画面上部のUIアイコン（早送り・ログ・設定ボタン）が写り込んでしまう場合がある。UIを含まない純粋な背景アセット（背景画像単体）を使用すること。

### 4.3 キャラクター立ち絵の変更
* `char_path` に透過PNG立ち絵（`eve/assets/characters/eve.png` 等）を指定する。
* **配置ルール**:
  * 目安の高さ: `target_h = 620`（キャンバス高さ 630px の内、上下に収まる黄金比）
  * キャラクター背後には `ImageFilter.GaussianBlur(25)` によるネオングローを敷くことで、ダーク背景からの浮き上がり・立体感を演出する。
  * 足元には `fade_mask` によるグラデーションフェードアウトを施し、キャンバス下端で唐突に画像が途切れないよう処理する。

---

## 5. レイアウト崩れを防ぐデザイン原則（Tips）

1. **文字とキャラクターの領域完全分離**
   * キャンバス左側（x: 0〜620px）をテキスト・HUD領域、右側（x: 750〜1200px）をキャラクター領域として明確にゾーニングする。
   * 中央付近（x: 620〜1050px）には滑らかなディープダークグラデーション（`veil`）を敷き、背景の光がテキストに干渉して文字が読めなくなる現象を100%防止する。

2. **外枠フレームとキャラクターの干渉防止**
   * 太い枠線や内側枠を引くと、キャラクターの頭が突き抜けたり首・肩に線が重なって不自然になる。
   * 外枠はキャンバス外周の極細線（1px・角丸10px）にとどめ、キャラクターの上には枠線を引かない。

3. **Unicode絵文字（豆腐 □）の排除**
   * WindowsフォントやGoogle Fontsにはカラー絵文字（🎙️, ⚡, 🔓, 🌐 など）のグリフが含まれておらず、画像描画時に四角い豆腐（□）として文字化けする。
   * アイコンには `◆`, `>>`, `[!]`, `★` などの共通記号、英数文字列、または `draw_glass_pill` / `draw.ellipse` によるベクターHUDプレートを使用する。

4. **半透明ピルプレートの描画には `draw_glass_pill` を使う**
   * Pillowの `draw.rounded_rectangle` で透過色（RGBAのアルファ値）を指定すると、背景ピクセルを意図せず上書きしてベタ塗り四角になってしまうことがある。
   * スクリプト内で定義されている `draw_glass_pill()` ヘルパー関数を経由し、独立した透過レイヤーを作成して `Image.alpha_composite` で合成すること。

---

## 6. 公開後のSNSカード確認方法

変更したOGP画像をコミット＆プッシュした後、以下の公式バリデーター等で表示結果を即座に確認・キャッシュクリアできる。

1. **X (Twitter) カードバリデーター / 投稿テスト**:
   * ツイート作成画面にサイトURLを入力してプレビューを確認する。
2. **Facebook シェアデバッガー**:
   * [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
   * URLを入力して「もう一度スクレイピング」を押すことで、最新のOGP画像を強制再取得可能。
3. **ラッコツールズ OGP確認**:
   * [https://rakko.tools/tools/9/](https://rakko.tools/tools/9/)
   * X / Facebook / LINE での表示イメージを一覧でシミュレーション可能。
