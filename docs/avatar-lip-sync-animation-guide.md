# キャラクター表情差分アニメーション（目パチ・口パク）完全実装＆再現ガイド

本書は、1枚のベース立ち絵と軽量な表情差分レイヤー（目・口）を組み合わせ、Web Audio API によるリアルタイム音声解析と同期して自然な表情アニメーション（目パチ・波形連動リップシンク）を実現するための**完全実装ガイド＆技術仕様書**である。

Live2D や Spine などの外部ランタイム・ヘビーなSDKを一切使用せず、**Vanilla JS + CSS3 + Web Audio API（HTML5標準技術）** だけで動作し、スマートフォン環境でも60fpsの超軽量描画と極小アセット容量を実現する。

---

## 目次
1. [アーキテクチャ概要と設計思想](#1-アーキテクチャ概要と設計思想)
2. [アセット仕様と最重要ルール（二重像の根絶）](#2-アセット仕様と最重要ルール二重像の根絶)
3. [差分レイヤー自動生成パイプライン（Python/OpenCV）](#3-差分レイヤー自動生成パイプラインpythonopencv)
4. [DOM構造とCSSスタイリング（トランジション制御）](#4-dom構造とcssスタイリングトランジション制御)
5. [Web Audio API による波形連動リップシンク＆目パチ制御](#5-web-audio-api-による波形連動リップシンク目パチ制御)
6. [オーディオ世代管理とゲームエンジン連携](#6-オーディオ世代管理とゲームエンジン連携)
7. [新規プロジェクト導入手順（Step-by-Step）](#7-新規プロジェクト導入手順step-by-step)
8. [トラブルシューティング＆チェックリスト](#8-トラブルシューティングチェックリスト)

---

## 1. アーキテクチャ概要と設計思想

```
┌────────────────────────────────────────────────────────┐
│                   立ち絵コンテナ (.char-container)        │
│                                                        │
│  [Z: 1] ベース立ち絵 (base.png)                          │
│         - 平常時の立ち絵（★口は閉口、目は開眼）          │
│                                                        │
│  [Z: 2] 目パチ差分レイヤー (.char-eyes-layer)            │
│         - eyes_closed.png / eyes_half.png              │
│         - 滑らかな瞬き用 (transition: opacity 0.035s)    │
│                                                        │
│  [Z: 3] 口パク差分レイヤー (.char-mouth-layer)           │
│         - mouth_open.png / mouth_half.png / mouth_small│
│         - ★即時切り替え (transition: none !important)   │
└────────────────────────────────────────────────────────┘
                           ▲
                           │ リアルタイム同期制御
┌──────────────────────────┴─────────────────────────────┐
│ CharacterController (JS) & AudioController (Web Audio) │
│ - AnalyserNode (FFT) でリアルタイム音量解析 (EMA平滑化) │
│ - 音節フラップ変調 (3.3Hz) ＆ 90msデバウンス制御       │
│ - 文節の息継ぎ・発話終了連動の自然なまばたきトリガー     │
└────────────────────────────────────────────────────────┘
```

### なぜこの方式を採用するのか
1. **圧倒的な軽量性**: 各キャラクターの差分画像は目・口の小領域のみを透過PNG化（1ファイル数KB〜数十KB）。
2. **座標ズレの物理的ゼロ保証**: 差分レイヤーをベース画像と同一キャンバス解像度（同位置配置）で出力するため、CSSのパーセント配置やピクセル指定のズレが原理的に発生しない。
3. **完全な音声同期**: 事前のリップシンクデータ作成（音素アライメント）が不要。再生中の音声ファイルの波形から動的に口を開閉させるため、ボイスファイルの追加・差し替えに即座に対応可能。

---

## 2. アセット仕様と最重要ルール（二重像の根絶）

本手法を実装するにあたり、**最も陥りやすい不具合（違和感・ゴースト・透過）** を防ぐための3大原則である。

### 原則①: ベース立ち絵は必ず「閉口・開眼」にする
- **失敗例**:
  ベース画像自体が「歯を大きく見せた笑顔（開口状態）」の場合、発話中に口の開きが小さい中割り差分（`mouth_half` や `mouth_small`）を重ねた際、ベース画像の元の白い歯や下唇が差分の外側にはみ出て**口の中に歯が二重に見える怪奇現象**が発生する。
- **正解**:
  ベース立ち絵（平常時）は必ず**「口を閉じた自然な表情（真顔または閉じた微笑み）」**にする。
  平常時はベース画像を表示し、発話時のみ上に開口差分を重ねることで、下の口線は常に開いた口の中に完全に隠蔽される。

```
【正しいレイヤー関係】
発話中 (開口差分) :   ╭──────╮  (大きな口)
                       │ 口腔 │
ベース画像 (閉口) :    ──────   (1本の閉口線) ← 開いた口の中に完全に隠れる！
```

### 原則②: 口差分マスクは内部 100% Solid（不透明）にする
- **失敗例**:
  境界を馴染ませようとしてマスク全体にガウシアンブラーをかけると、口の内部（歯・舌）のアルファ値が 50〜200 程度の半透明になり、**舌の後ろに下のベース画像の白い歯や肌が透けて見える**。
- **正解**:
  輪郭内部を完全塗りつぶし（Fill Holes）し、内部は **100% Solid（Alpha 255）** とする。
  半透明にするのは**最外周 1.2px の輪郭エッジのみ（距離変換によるアンチエイリアス）**に限定する。

### 原則③: 口パクレイヤーの CSS transition は即時（none）にする
- **失敗例**:
  `.char-diff-layer` に `transition: opacity 0.035s;` などのフェードを入れると、60〜100msごとに切り替わる口パクの最中に半透明クロスフェードが発生し、常に下の画像が透けてブレンドされてしまう。
- **正解**:
  目パチには柔らかなフェード（35ms）を残し、口パク（`.char-mouth-layer`）は必ず **`transition: none !important;`** でセル画アニメーションのように即時切り替えを行う。

---

## 3. 差分レイヤー自動生成パイプライン（Python/OpenCV）

手作業での切り抜きは工数が膨大になり、肌色境界のズレが生じる。
以下の Python スクリプト（`scripts/build_avatar_diff_layers.py`）により、元画像から**数学的・解剖学的に自然な差分レイヤー**を全自動生成する。

### スクリプトのアルゴリズム
1. **目パチ生成**:
   - 肌色サンプリングによる精密カラーオフセット補正（元画像間の微妙な色味・照明差をゼロにする）。
   - 閉眼画像から目をタイト楕円マスクで抽出。
   - 上まぶたの楕円を縮小・下方シフトさせた中割り「半目（`eyes_half.png`）」をプロシージャル合成。
2. **口パク生成（解剖学的下顎モーフィング）**:
   - 開口画像から差分二値化＋最大連結成分抽出で口領域を特定。
   - 内部穴埋め（Fill Holes）＋最外周 1.2px アンチエイリアスで完全ソリッドマスク作成。
   - **下顎リフトモーフィング**: 上唇・上の歯は位置を完全固定し、下唇および口腔下部のみを上方向にコサインカーブで自然に縮小して、中割り「半開口（`mouth_half.png`）」および「微開口（`mouth_small.png`）」を生成。機械的な縮小リサイズと異なり、上唇が歪まない。

### 生成スクリプト実装

```python
"""
build_avatar_diff_layers.py
キャラクター表情差分レイヤー自動生成スクリプト
"""
import os
from pathlib import Path
import cv2
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent

# キャラクター設定
CONFIGS = {
    "iris": {
        "base_img": BASE_DIR / "assets/characters/iris.png",
        "blink_img": BASE_DIR / "assets/characters/raw_diffs/iris_blink.jpg",
        "mouth_img": BASE_DIR / "assets/characters/raw_diffs/iris_mouth.jpg",
        "crop_box": (100, 500, 200, 600), # 顔領域クロップ (y1, y2, x1, x2)
        "eye_left": (130, 215),            # 左目中心 (x, y)
        "eye_right": (235, 205),           # 右目中心 (x, y)
        "eye_rx_ry": (38, 25),             # 目マスク半径 (rx, ry)
        "skin_sample": (183, 240),         # 肌色サンプリング座標
        "mouth_center": (183, 285),        # 口中心 (x, y)
        "mouth_rx_ry": (36, 23),           # 口探索半径 (rx, ry)
        "upper_offset_y": -7,              # 上唇固定オフセット
        "lower_offset_y": 14,              # 下顎可動オフセット
    }
}

def process_character(char_id: str, cfg: dict, output_base: Path):
    char_dir = output_base / char_id
    char_dir.mkdir(parents=True, exist_ok=True)

    base = cv2.imread(str(cfg["base_img"]), cv2.IMREAD_UNCHANGED)
    H, W = base.shape[:2]
    y1, y2, x1, x2 = cfg["crop_box"]
    crop_h, crop_w = y2 - y1, x2 - x1

    base_crop_bgr = base[y1:y2, x1:x2, :3].copy()
    blink_raw = cv2.imread(str(cfg["blink_img"]))
    mouth_raw = cv2.imread(str(cfg["mouth_img"]))

    blink_crop = cv2.resize(blink_raw, (crop_w, crop_h), interpolation=cv2.INTER_LANCZOS4)
    mouth_crop = cv2.resize(mouth_raw, (crop_w, crop_h), interpolation=cv2.INTER_LANCZOS4)

    # -------------------------------------------------------------
    # 1. 目パチ (カラーキャリブレーション + タイトマスク)
    # -------------------------------------------------------------
    sx, sy = cfg["skin_sample"]
    skin_base = base_crop_bgr[sy, sx, :3].astype(np.float32)
    skin_blink = blink_crop[sy, sx, :3].astype(np.float32)
    color_offset = skin_base - skin_blink
    blink_calibrated = np.clip(blink_crop.astype(np.float32) + color_offset, 0, 255).astype(np.uint8)

    el_cx, el_cy = cfg["eye_left"]
    er_cx, er_cy = cfg["eye_right"]
    erx, ery = cfg["eye_rx_ry"]

    # 閉眼マスク
    mask_eyes = np.zeros((crop_h, crop_w), dtype=np.float32)
    cv2.ellipse(mask_eyes, (el_cx, el_cy), (erx, ery), -2, 0, 360, 1.0, -1)
    cv2.ellipse(mask_eyes, (er_cx, er_cy), (erx, ery), 2, 0, 360, 1.0, -1)
    mask_eyes = cv2.GaussianBlur(mask_eyes, (9, 9), 2.0)

    eyes_closed_layer = np.zeros((H, W, 4), dtype=np.uint8)
    eyes_closed_layer[y1:y2, x1:x2, :3] = blink_calibrated
    eyes_closed_layer[y1:y2, x1:x2, 3] = (mask_eyes * 255.0).astype(np.uint8)
    cv2.imwrite(str(char_dir / "eyes_closed.png"), eyes_closed_layer)

    # 半目マスク (まぶたが降りる中割り)
    mask_eyes_half = np.zeros((crop_h, crop_w), dtype=np.float32)
    cv2.ellipse(mask_eyes_half, (el_cx, el_cy - int(ery * 0.15)), (erx, int(ery * 0.75)), -2, 0, 360, 1.0, -1)
    cv2.ellipse(mask_eyes_half, (er_cx, er_cy - int(ery * 0.15)), (erx, int(ery * 0.75)), 2, 0, 360, 1.0, -1)
    mask_eyes_half = cv2.GaussianBlur(mask_eyes_half, (7, 7), 1.5)

    eyes_half_layer = np.zeros((H, W, 4), dtype=np.uint8)
    eyes_half_layer[y1:y2, x1:x2, :3] = blink_calibrated
    eyes_half_layer[y1:y2, x1:x2, 3] = (mask_eyes_half * 255.0).astype(np.uint8)
    cv2.imwrite(str(char_dir / "eyes_half.png"), eyes_half_layer)

    # -------------------------------------------------------------
    # 2. 口パク (完全ソリッドマスク + 解剖学的モーフィング)
    # -------------------------------------------------------------
    mcx, mcy = cfg["mouth_center"]
    rx, ry = cfg["mouth_rx_ry"]

    diff = cv2.absdiff(mouth_crop, base_crop_bgr)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    window = np.zeros((crop_h, crop_w), dtype=np.uint8)
    cv2.ellipse(window, (mcx, mcy + 2), (rx, ry + 4), 0, 0, 360, 255, -1)

    _, bin_mask = cv2.threshold(diff_gray, 11, 255, cv2.THRESH_BINARY)
    bin_mask = cv2.bitwise_and(bin_mask, window)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    bin_mask = cv2.morphologyEx(bin_mask, cv2.MORPH_CLOSE, kernel)

    # 最大連結成分（口・唇）のみ抽出
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(bin_mask)
    if num_labels > 1:
        largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        bin_mask = np.where(labels == largest_label, 255, 0).astype(np.uint8)

    # 内部を100%塗りつぶし（Fill Holes）
    contours, _ = cv2.findContours(bin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid_mask = np.zeros_like(bin_mask)
    if contours:
        largest = max(contours, key=cv2.contourArea)
        cv2.drawContours(solid_mask, [largest], -1, 255, -1)

    # 口内部は完全不透明(255)、最外周1.2pxのみアンチエイリアス
    dist = cv2.distanceTransform(solid_mask, cv2.DIST_L2, 3)
    alpha_base = np.clip(dist / 1.2, 0.0, 1.0)

    upper_y = mcy + cfg["upper_offset_y"]
    lower_y = mcy + cfg["lower_offset_y"]
    H_span = float(lower_y - upper_y)

    map_x, map_y = np.meshgrid(np.arange(crop_w, dtype=np.float32), np.arange(crop_h, dtype=np.float32))
    dx_rel = np.clip(np.abs(map_x - mcx) / float(rx), 0.0, 1.0)
    w_x = np.maximum(0.0, np.cos(dx_rel * (np.pi / 2.0))) ** 1.3

    def create_mouth_frame(openness: float):
        if openness >= 0.99:
            layer = np.zeros((H, W, 4), dtype=np.uint8)
            layer[y1:y2, x1:x2, :3] = mouth_crop
            layer[y1:y2, x1:x2, 3] = (alpha_base * 255.0).astype(np.uint8)
            return layer

        max_shift = (1.0 - openness) * H_span
        w_y = np.zeros_like(map_y)
        inside_mask = (map_y > upper_y) & (map_y <= lower_y)
        w_y[inside_mask] = ((map_y[inside_mask] - upper_y) / H_span) ** 1.2

        chin_h = 3.5
        chin_mask = (map_y > lower_y) & (map_y <= lower_y + chin_h)
        chin_rel = (map_y[chin_mask] - lower_y) / chin_h
        w_y[chin_mask] = np.maximum(0.0, 1.0 - chin_rel)

        cur_map_y = map_y + (max_shift * w_x * w_y)
        warped_img = cv2.remap(mouth_crop, map_x, cur_map_y, cv2.INTER_LANCZOS4)
        warped_alpha = cv2.remap(alpha_base, map_x, cur_map_y, cv2.INTER_LINEAR)

        current_lower_y = lower_y - (max_shift * w_x)
        bottom_clamp = np.clip((current_lower_y + 3.0 - map_y) / 2.5, 0.0, 1.0)
        final_alpha = np.clip(warped_alpha * bottom_clamp, 0.0, 1.0)

        layer = np.zeros((H, W, 4), dtype=np.uint8)
        layer[y1:y2, x1:x2, :3] = warped_img
        layer[y1:y2, x1:x2, 3] = (final_alpha * 255.0).astype(np.uint8)
        return layer

    # 3段階フレームの書き出し
    cv2.imwrite(str(char_dir / "mouth_open.png"), create_mouth_frame(1.0))
    cv2.imwrite(str(char_dir / "mouth_half.png"), create_mouth_frame(0.60))
    cv2.imwrite(str(char_dir / "mouth_small.png"), create_mouth_frame(0.28))
```

---

## 4. DOM構造とCSSスタイリング（トランジション制御）

### HTML構造
```html
<div id="character-container" class="char-container">
  <div class="char-layers-wrapper">
    <!-- ベース立ち絵 (平常時はこれのみ表示) -->
    <img class="char-layer-base" src="assets/characters/iris.png" alt="character base" />

    <!-- 目パチ差分レイヤー -->
    <img class="char-diff-layer char-eyes-layer eyes-closed" src="assets/characters/diffs/iris/eyes_closed.png" />
    <img class="char-diff-layer char-eyes-layer eyes-half" src="assets/characters/diffs/iris/eyes_half.png" />

    <!-- 口パク差分レイヤー -->
    <img class="char-diff-layer char-mouth-layer mouth-open" src="assets/characters/diffs/iris/mouth_open.png" />
    <img class="char-diff-layer char-mouth-layer mouth-half" src="assets/characters/diffs/iris/mouth_half.png" />
    <img class="char-diff-layer char-mouth-layer mouth-small" src="assets/characters/diffs/iris/mouth_small.png" />
  </div>
</div>
```

### CSS定義 (`style.css`)
```css
/* キャラクターコンテナ */
.char-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 90vh;
  pointer-events: none;
}

.char-layers-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ベース画像 */
.char-layer-base {
  position: relative;
  height: 100%;
  width: auto;
  z-index: 1;
}

/* 差分レイヤー共通 */
.char-diff-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* 表示アクティブ状態 */
.char-diff-layer.active {
  opacity: 1;
  visibility: visible;
}

/* 目パチ: まばたきの柔らかなフェード */
.char-eyes-layer {
  z-index: 2;
  transition: opacity 0.035s linear;
  will-change: opacity;
}

/* 口パク: ★半透明ゴースト・二重像を根絶する即時切り替え */
.char-mouth-layer {
  z-index: 3;
  transition: none !important;
  will-change: opacity;
}
```

---

## 5. Web Audio API による波形連動リップシンク＆目パチ制御

### 1. 音声解析エンジン（`AudioController`）
Web Audio API の `AnalyserNode` を使用し、リアルタイム（`requestAnimationFrame`）で再生中の音声を周波数解析する。

```javascript
class AudioController {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.freqData = null;
    this.analysisRafId = null;
    this.onAudioFrame = null; // コールバック: (volume, isSilent, timestamp) => void
  }

  _initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.2; // 素早い立ち上がり
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  _startVoiceAnalysis(sessionId) {
    this._stopVoiceAnalysis();
    this._initAudioContext();

    const loop = (timestamp) => {
      if (this.playSessionId !== sessionId || !this.isPlaying) return;

      this.analyser.getByteFrequencyData(this.freqData);

      // 人間の声の主要周波数帯域 (約 250Hz ~ 3.5kHz: bin 3 ~ 42) を重点抽出
      let sum = 0;
      const startBin = 3;
      const endBin = Math.min(42, this.freqData.length);
      for (let i = startBin; i < endBin; i++) {
        sum += this.freqData[i];
      }
      const rawVolume = (endBin > startBin) ? (sum / (endBin - startBin)) / 255.0 : 0;

      // リスナーへ通知
      if (typeof this.onAudioFrame === 'function') {
        this.onAudioFrame(rawVolume, rawVolume < 0.035, timestamp);
      }

      this.analysisRafId = requestAnimationFrame(loop);
    };

    this.analysisRafId = requestAnimationFrame(loop);
  }

  _stopVoiceAnalysis() {
    if (this.analysisRafId) {
      cancelAnimationFrame(this.analysisRafId);
      this.analysisRafId = null;
    }
    if (typeof this.onAudioFrame === 'function') {
      this.onAudioFrame(0, true, performance.now());
    }
  }
}
```

### 2. 表情コントローラー（`CharacterController`）
音量解析値を受け取り、**指数平滑化・音節フラップ変調・デバウンス判定**を経て口レイヤーを切り替える。

```javascript
class CharacterController {
  constructor(containerElement) {
    this.container = containerElement;
    this.isTalking = false;
    this.isAudioDriven = false;
    this.audioSmoothVolume = 0.0;
    this.currentMouthStage = 0; // 0: 閉口, 1: 微開, 2: 半開, 3: 全開
    this.lastMouthStageChangeTime = 0;
    this.hasBlinkedInCurrentPause = false;
  }

  // AudioController からのフレーム通知を受信
  handleAudioFrame(rawVolume, isSilent, timestamp) {
    if (!this.isTalking) {
      this.setMouthStage(0);
      return;
    }

    // 1. 指数移動平均 (EMA) による平滑化
    // 立ち上がりは俊敏(0.70)、立ち下がりは余韻を残す(0.35)
    const factor = (rawVolume > this.audioSmoothVolume) ? 0.70 : 0.35;
    this.audioSmoothVolume += (rawVolume - this.audioSmoothVolume) * factor;

    // 2. 音節フラップ変調 (Syllable Flap Modulation)
    // 大声・長音時でも口が開きっぱなしにならず、秒間約3.3拍（周期300ms）で有機的に開閉
    const flapCycle = Math.sin((timestamp / 300) * Math.PI * 2);
    let targetStage = 0;

    if (this.audioSmoothVolume > 0.065) {
      if (this.audioSmoothVolume > 0.38) {
        // 最大音量帯: フラップの底でも半開(2)を維持し、山で全開(3)
        targetStage = (flapCycle < -0.30) ? 2 : 3;
      } else if (this.audioSmoothVolume > 0.16) {
        // 中音量帯: 微開(1)と半開(2)を有機的に往復
        targetStage = (flapCycle < 0) ? 1 : 2;
      } else {
        // 微小音量帯: 微開(1)
        targetStage = 1;
      }
    } else {
      targetStage = 0; // 無音・子音休止
    }

    // 3. テンポ最適化デバウンス（最低保持時間 90ms）
    // 1秒間に何十回も激しくパタパタする痙攣現象を完全に防止
    if (targetStage !== this.currentMouthStage) {
      if (timestamp - this.lastMouthStageChangeTime >= 90) {
        this.setMouthStage(targetStage);
        this.lastMouthStageChangeTime = timestamp;
      }
    }

    // 4. 息継ぎ・セリフ休止連動の自然な目パチ (Pause-Triggered Blink)
    if (isSilent || this.audioSmoothVolume < 0.05) {
      if (!this.hasBlinkedInCurrentPause && (timestamp - this.lastBlinkTime > 1800)) {
        this.triggerBlink();
        this.hasBlinkedInCurrentPause = true;
      }
    } else {
      this.hasBlinkedInCurrentPause = false; // 発話再開でリセット
    }
  }

  // 口レイヤーの表示切り替え
  setMouthStage(stage) {
    this.currentMouthStage = stage;
    const layers = {
      open: this.container.querySelector('.mouth-open'),
      half: this.container.querySelector('.mouth-half'),
      small: this.container.querySelector('.mouth-small')
    };

    // 全非表示リセット（stage 0 はベース画像の閉口を表示）
    Object.values(layers).forEach(el => el && el.classList.remove('active'));

    if (stage === 3 && layers.open) layers.open.classList.add('active');
    else if (stage === 2 && layers.half) layers.half.classList.add('active');
    else if (stage === 1 && layers.small) layers.small.classList.add('active');
  }

  // まばたき（中割り半目を経由する自然な3段階アニメーション）
  triggerBlink() {
    this.lastBlinkTime = performance.now();
    const half = this.container.querySelector('.eyes-half');
    const closed = this.container.querySelector('.eyes-closed');
    if (!half || !closed) return;

    // 半目 (30ms) -> 全閉じ (70ms) -> 半目 (35ms) -> 開眼
    half.classList.add('active');
    setTimeout(() => {
      half.classList.remove('active');
      closed.classList.add('active');
      setTimeout(() => {
        closed.classList.remove('active');
        half.classList.add('active');
        setTimeout(() => {
          half.classList.remove('active');
        }, 35);
      }, 70);
    }, 30);
  }
}
```

---

## 6. オーディオ世代管理とゲームエンジン連携

ノベルゲーム特有の「早送りタップ」「スキップ」「日/英 言語切替」「タイトル画面への即時離脱」において、**音の二重再生・別シーン音声の漏れ・口パクの暴走**を完全遮断するためのセッション世代管理パターンである。

### `playSessionId` による世代管理
```javascript
play(scene) {
  // 1. 世代を進めて過去の非同期コールバックや待機タイマーを即座に無効化
  const sessionId = ++this.playSessionId;
  this.stop();

  const audio = new Audio(scene.voiceFile);
  this.currentAudio = audio;
  this.isPlaying = true;

  audio.play().then(() => {
    // 再生完了が許可された時点で、ユーザーが既にスキップしていないか検証
    if (this.playSessionId !== sessionId) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    this._startVoiceAnalysis(sessionId);
  }).catch(() => {
    // モバイル自動再生ブロック時はタイピング同期の擬似口パクへフォールバック
    this._startFallbackMouthSync();
  });

  audio.onended = () => {
    if (this.playSessionId === sessionId) {
      this.stop();
      if (this.onSpeechEnd) this.onSpeechEnd();
    }
  };
}

stop() {
  this.playSessionId++;
  this.isPlaying = false;
  this._stopVoiceAnalysis();
  if (this.currentAudio) {
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.currentAudio = null;
  }
}
```

---

## 7. 新規プロジェクト導入手順（Step-by-Step）

他の作品で本システムをゼロから組み込む際の手順書である。

### Step 1: 元画像の準備
1キャラにつき以下の3枚の画像を用意する：
1. **ベース立ち絵 (`char.png`)**: 口を閉じた平常時の透過PNG。
2. **閉眼画像 (`char_blink.jpg`)**: 目を閉じた顔画像（解像度・縦横比は異なっていても可）。
3. **開口画像 (`char_mouth.jpg`)**: 口を大きく開けた顔画像。

> **推奨**: ベース画像の口元が最初から開口している場合、画像編集ソフトまたは OpenCV ポアソン合成で `blink_img` の閉口部分を移植し、**平常時を必ず「閉口」にしておく**。

### Step 2: 座標測定とスクリプト実行
1. 画像ビューアで顔領域のバウンディングボックス（`crop_box`）、目中心（`eye_left`, `eye_right`）、口中心（`mouth_center`）を測定する。
2. `scripts/build_avatar_diff_layers.py` の `CONFIGS` に設定値を追加する。
3. スクリプトを実行し、`assets/characters/diffs/<char_id>/` に差分PNGを出力する。
   ```powershell
   python scripts/build_avatar_diff_layers.py
   ```

### Step 3: CSS & JavaScript のインポート
1. [第4章のCSS](#4-dom構造とcssスタイリングトランジション制御) をプロジェクトの `style.css` に追加。
2. [第5章のJS](#5-web-audio-api-による波形連動リップシンク目パチ制御) の `AudioController` と `CharacterController` を組み込む。
3. メインエンジンで `audio.onAudioFrame` を `character.handleAudioFrame` に接続する：
   ```javascript
   this.audio.onAudioFrame = (vol, isSilent, timestamp) => {
     this.character.handleAudioFrame(vol, isSilent, timestamp);
   };
   ```

---

## 8. トラブルシューティング＆チェックリスト

| 症状 | 主な原因 | 解決策 |
| :--- | :--- | :--- |
| **口の中に白い歯が二重に見える / 下の唇の線がはみ出る** | ベース画像が「開口笑顔」になっている | ベース画像の口を閉じた微笑みに修正する（[原則①](#原則①-ベース立ち絵は必ず閉口開眼にする)） |
| **舌の後ろに下の画像が透けて見える** | マスクにガウシアンブラーがかかり内部が半透明になっている | 輪郭を穴埋めし、内部を100% Solid Alphaにする（[原則②](#原則②-口差分マスクは内部-100-solid不透明にする)） |
| **口パクが切り替わる瞬間に一瞬ボヤける・ブレンドする** | CSSの `.char-mouth-layer` に透過フェードが入っている | `transition: none !important;` を指定する（[原則③](#原則③-口パクレイヤーの-css-transition-は即時noneにする)） |
| **口が痙攣するように激しく高速でチラつく** | デバウンスが入っていない / 音量閾値のヒステリシス不足 | `timestamp - lastTime >= 90`（最低90ms保持）を導入する |
| **大声のセリフで口が全開のまま固まる** | 音量閾値のみで判定し、音節リズムが考慮されていない | `Math.sin((timestamp / 300) * PI * 2)` による音節フラップ変調を入れる |
| **タップで早送りした時に前のボイスの口パクが続く** | 非同期再生とセッション世代管理の不一致 | `playSessionId++` で過去世代のアニメーションループを破棄する |
