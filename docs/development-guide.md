# PROJECT EVE: 開発ガイド ＆ 作業手順書

本書は『PROJECT EVE：家族のためのハッキング』の技術アーキテクチャ、アセット追加パイプライン、および次回作業時の手順をまとめたドキュメントである。

---

## 1. システム構成とアーキテクチャ

本作はWeb標準技術（HTML5 / CSS3 / Vanilla JS / WebGL / Web Audio API / Web Speech API）に、**Riveランタイム**および**WebGLシェーダーパイプライン**を共存させたモバイルファースト・サイバーノベルゲームである。

```
voice-visual-novel/
├── index.html                   # メインHTML（モバイルサイバーHUDレイアウト、Canvas定義）
├── css/
│   └── style.css                # モバイルファースト・サイバーパンクHUDスタイルシート
├── js/
│   ├── webgl-fx.js              # リアルタイムWebGLシェーダー（走査線、グリッチ、色収差、ホログラム波）
│   ├── rive-manager.js          # Rive Web Runtime連携 ＆ プロシージャルHUDスキャナー
│   ├── audio-controller.js      # Web Audio効果音シンセ、フルボイス、モバイルアンロック、ハプティクス
│   ├── character-controller.js  # キャラクター立ち絵レンダラー（透過PNG / SVG、ジャイロ追従、表情・呼吸）
│   ├── scenario.js              # シナリオデータ（シーン定義、分岐、証拠品、モーション指定）
│   └── game-engine.js           # ゲームループ制御、テキスト進行、選択肢、つきつけ、モーダル統括
├── assets/
│   ├── backgrounds/             # 美麗背景画像（.jpg / .svg）
│   └── characters/              # クロマキー透過キャラクター立ち絵（.png）
└── docs/
    ├── development-guide.md              # 本書（開発手順書）
    ├── avatar-lip-sync-animation-guide.md # 表情差分（目パチ・口パク）完全実装＆再現ガイド
    └── scenario-consistency-framework.md # シナリオ整合性フレームワーク
```

### コア技術の役割分担
| モジュール | 主な役割 |
| :--- | :--- |
| **WebGLCyberFX** (`webgl-fx.js`) | 画面全体のサイバーCRT走査線、被疑AI（イブ）登場時のホログラム走査波、衝撃時のリアルタイムグリッチ＆色収差・画面シェイク |
| **RiveManager** (`rive-manager.js`) | Rive Web Runtime (`@rive-app/canvas`) を統括。画面上部のサイバーHUDスキャナーをリアルタイム描画し警戒度（SECURE / WARNING / CRITICAL）を表示 |
| **CharacterController** (`character-controller.js`) | クロマキー透過PNG立ち絵とSVGレンダラーのハイブリッド表示。スマートフォンの傾き（ジャイロ）やタッチ追従、呼吸・リップシンク・モーション制御 |
| **AudioController** (`audio-controller.js`) | Web Audio APIによるプロシージャル効果音（サイバータイピング音、決定音、異議あり爆発音、ハッキングジングル）、バイブレーション連動、Web Speech APIフルボイス |
| **GameEngine** (`game-engine.js`) | 周回フラグ管理（BAD END後に再捜査モード解放）、証拠品データベース、つきつけ（対立）ロジック、親指操作に最適化したモーダル制御 |

---

## 2. 開発環境の起動とデバッグ手順

### ローカルサーバーの起動
PythonまたはNode.jsで静的サーバーを起動する。
```powershell
# PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
python -m http.server 8080
```

### ブラウザでのデバッグ確認
1. ブラウザで `http://localhost:8080` を開く。
2. **F12キー（デベロッパーツール）** を開き、デバイスツールバーを有効化して「スマートフォン縦画面（iPhone 14 / Pixel 7 等、390×844px）」に設定する。
3. 以下の確認を行う：
   - タイトル画面の背景およびロゴ表示
   - 「事件の捜査を開始する」タップ時の音声アンロックおよび画面遷移
   - 会話進行（画面タップ送り、文字タイピング音）
   - キャラクター立ち絵の透過状態（黒枠や矩形アーティファクトがないこと）
   - ダイアログボックスに縦スクロールバーが表示されないこと
   - ログ（LOG）および証拠品手帳モーダルの開閉（ヘッダー「◀ 戻る」および下部「閉じる」）
   - 取調室での「証拠品つきつけ」および「あきらめる」選択肢の遷移

---

## 3. キャラクター立ち絵の追加・透過処理パイプライン

本作の立ち絵アセット（`assets/characters/*.png`）は、**純色背景（グリーンバックまたはマゼンタバック）の画像を生成し、Pythonスクリプトでクロマキー透過処理を行って完全透明PNGを生成する**パイプラインを採用している。

### 手順
1. **立ち絵画像の生成**:
   - 緑色以外のキャラクター（アイリス、サクマ、シノハラ等）：**グリーンバック（純緑 `#00FF00`）** で生成。
   - 緑色系パーツを持つキャラクター（イブ等）：**マゼンタバック（純ピンク `#FF00FF`）** で生成。
2. **クロマキー透過スクリプトの実行**:
   下記のPythonスクリプトを実行し、背景を完全にアルファ0（透明）にして `assets/characters/` へ書き出す。

```python
# tools/chroma_key.py またはワンライナー実行例
from PIL import Image
import numpy as np

def chroma_green(src_path, dest_path):
    img = Image.open(src_path).convert('RGBA')
    data = np.array(img, dtype=np.float32)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]
    
    diff = g - np.maximum(r, b)
    tolerance = 50.0
    smoothness = 30.0
    alpha = np.clip(1.0 - (diff - (tolerance - smoothness)) / smoothness, 0.0, 1.0)
    
    # デスピル（緑の反射を除去）
    data[:, :, 1] = np.where(diff > 0, np.maximum(r, b) * 0.95 + g * 0.05, g)
    data[:, :, 3] = (alpha * 255.0)
    Image.fromarray(data.astype(np.uint8), mode='RGBA').save(dest_path, format='PNG')
```

---

## 3.5 キャラクター表情差分（目パチ・口パク）と音声連動リップシンク

1枚のベース立ち絵に、目パチ（2枚）および口パク（3枚）の部分差分レイヤーを重ね合わせ、Web Audio API のリアルタイム周波数解析によって発話音声の波形・音量と同期させる軽量アニメーションシステムである。

- **自動ビルドスクリプト**: `scripts/build_avatar_diff_layers.py`
  - 輪郭内部の完全塗りつぶし（Fill Holes）＋最外周1.2pxアンチエイリアスによる **完全不透明マスク（Solid Alpha 100%）** 生成
  - 上唇固定・下顎リフトによる **解剖学的モーフィング（Anatomical Morphing）** 中割り生成
- **最重要原則**:
  1. ベース画像（平常時）は必ず「閉口・開眼」にする（開口ベースの上に小さい口を乗せると歯が二重になるため）。
  2. 口差分レイヤーの CSS は `transition: none !important;` で即時切り替えにする（透過クロスフェードによる下の画像の透けを根絶）。
  3. 最大音量持続時は音節フラップ変調（秒間約3.3拍）とデバウンス（90ms）で有機的なリズムを付与する。

> 📖 **詳細な仕様・再現手順・完全なコード**:
> [`docs/avatar-lip-sync-animation-guide.md`](file:///d:/Work/voice-visual-novel/docs/avatar-lip-sync-animation-guide.md) を参照のこと。

---

## 4. シナリオ・演出の拡張手順

シナリオデータは `js/scenario.js` の `SCENARIO_DATA` 配列で定義されている。

### 主な演出プロパティ
- `background`: 背景画像パス（例: `"assets/backgrounds/cyber_hq.jpg"`）
- `character`: `{ id: "eve", expression: "shocked", motion: "hop" }`
  - `expression`: `"normal"`, `"smile"`, `"shocked"`, `"angry"`, `"sad"`, `"serious"`
  - `motion`: `"nod"`, `"hop"`, `"tilt"`, `"shake"`, `"desk-slam"`（机バン）
- `objection`: `true` に設定すると「異議あり！」の全画面カットイン、白色閃光、WebGLグリッチ、衝撃音が自動連動。
- `addEvidence`: 入手する証拠品ID（`"ev_tool"`, `"ev_jailbreak"`, `"ev_broker"`）
- `present`: 証拠品つきつけ設定
  ```javascript
  present: {
    correct: "ev_broker",           // 正解の証拠品ID
    correctJump: "truth_route_01",   // 正解時のジャンプ先シーンID
    wrongJump: "bad_route_01",       // 不正解時のジャンプ先シーンID
    giveUpJump: "bad_route_01"       // 「あきらめる」選択時のジャンプ先シーンID
  }
  ```

---

## 5. 次回作業時の推奨タスク（ロードマップ）

1. **表情差分の拡充**:
   - 各キャラクター（アイリス、イブ、サクマ、シノハラ）の表情別立ち絵（笑顔、怒り、驚き、哀しみ）のパーツ切り替え対応。
2. **残りの背景アセットの差し替え**:
   - `assets/backgrounds/room_day.svg`（子供部屋）や `cyber_alert.svg`（警報）の高解像度イラスト化。
3. **BGM / 環境音（アンビエント）の実装**:
   - 取調室の冷徹なドローン音、サイバー本部のタイピング環境音、クライマックスの緊迫BGMの追加。
4. **外部Riveファイル（`.riv`）アセットの本格制作**:
   - Riveエディタで作成したサイバーHUDメーターやキャラクターベクターアニメーションを `RiveManager` 経由で完全ロード。
