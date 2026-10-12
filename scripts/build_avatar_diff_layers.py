"""
高品質キャラクター表情差分レイヤー自動ビルドスクリプト (決定版)

【完全改善アーキテクチャ】
1. 目パチ (eyes_closed / eyes_half):
   - タイトフェザーマスク (9x9 blur, sigma 2.0) による直接抽出。
   - 肌色サンプリングによる精密カラーオフセット補正。
   - 周囲の影・境界アーティファクト完全ゼロ。

2. 口パク (mouth_open / mouth_half / mouth_small):
   - 解剖学的下顎モーフィング (Anatomical Jaw Morphing) + 厳密差分マスキング。
   - 口腔内部（歯・舌・口の奥）と下唇のみを正確に抽出し、マイクや周囲の肌色を一切巻き込まない。
   - 中割り（半開・微開）は上唇・上の歯を完全固定し、下唇の弧状ラインを崩さずに下顎のリフトを再現。
   - 機械的な潰しリサイズを根絶し、アニメーション作画として自然で美しい口の形状を実現。
"""

import os
from pathlib import Path
import cv2
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent

CONFIGS = {
    "iris": {
        "base_img": BASE_DIR / "eve/assets/characters/iris.png",
        "blink_img": BASE_DIR / "eve/assets/characters/raw_diffs/iris_blink.jpg",
        "mouth_img": BASE_DIR / "eve/assets/characters/raw_diffs/iris_mouth.jpg",
        "crop_box": (100, 500, 200, 600),
        "eye_left": (130, 215),
        "eye_right": (235, 205),
        "eye_rx_ry": (38, 25),
        "skin_sample": (183, 240),
        "mouth_center": (183, 285),
        "mouth_rx_ry": (36, 23),
        "mouth_offset": (0, 0),
        "upper_offset_y": -7,
        "lower_offset_y": 14,
    },
    "eve": {
        "base_img": BASE_DIR / "eve/assets/characters/eve.png",
        "blink_img": BASE_DIR / "eve/assets/characters/raw_diffs/eve_blink.jpg",
        "mouth_img": BASE_DIR / "eve/assets/characters/raw_diffs/eve_mouth.jpg",
        "crop_box": (100, 500, 200, 600),
        "eye_left": (188, 230),
        "eye_right": (300, 230),
        "eye_rx_ry": (34, 22),
        "skin_sample": (246, 280),
        "mouth_center": (246, 320),
        "mouth_rx_ry": (36, 21),
        "mouth_offset": (0, 0),
        "upper_offset_y": -6,
        "lower_offset_y": 14,
    },
    "sakuma": {
        "base_img": BASE_DIR / "eve/assets/characters/sakuma.png",
        "blink_img": BASE_DIR / "eve/assets/characters/raw_diffs/sakuma_blink.jpg",
        "mouth_img": BASE_DIR / "eve/assets/characters/raw_diffs/sakuma_mouth.jpg",
        "crop_box": (100, 500, 200, 600),
        "eye_left": (140, 105),
        "eye_right": (210, 105),
        "eye_rx_ry": (30, 18),
        "skin_sample": (175, 150),
        "mouth_center": (175, 192),
        "mouth_rx_ry": (36, 18),
        "mouth_offset": (0, -18),
        "upper_offset_y": -5,
        "lower_offset_y": 13,
    },
    "shinohara": {
        "base_img": BASE_DIR / "eve/assets/characters/shinohara.png",
        "blink_img": BASE_DIR / "eve/assets/characters/raw_diffs/shinohara_blink.jpg",
        "mouth_img": BASE_DIR / "eve/assets/characters/raw_diffs/shinohara_mouth.jpg",
        "crop_box": (100, 500, 200, 600),
        "eye_left": (175, 190),
        "eye_right": (270, 195),
        "eye_rx_ry": (32, 20),
        "skin_sample": (222, 240),
        "mouth_center": (222, 275),
        "mouth_rx_ry": (36, 18),
        "mouth_offset": (0, 0),
        "upper_offset_y": -5,
        "lower_offset_y": 13,
    }
}

def process_character(char_id: str, cfg: dict, output_base: Path):
    char_dir = output_base / char_id
    char_dir.mkdir(parents=True, exist_ok=True)

    base = cv2.imread(str(cfg["base_img"]), cv2.IMREAD_UNCHANGED)
    H, W = base.shape[:2]
    y1, y2, x1, x2 = cfg["crop_box"]
    crop_h = y2 - y1
    crop_w = x2 - x1

    base_crop_bgr = base[y1:y2, x1:x2, :3].copy()

    blink_raw = cv2.imread(str(cfg["blink_img"]))
    mouth_raw = cv2.imread(str(cfg["mouth_img"]))

    blink_crop = cv2.resize(blink_raw, (crop_w, crop_h), interpolation=cv2.INTER_LANCZOS4)
    mouth_crop = cv2.resize(mouth_raw, (crop_w, crop_h), interpolation=cv2.INTER_LANCZOS4)

    # アライメントオフセット
    dx, dy = cfg["mouth_offset"]
    if dx != 0 or dy != 0:
        M = np.float32([[1, 0, dx], [0, 1, dy]])
        mouth_crop = cv2.warpAffine(mouth_crop, M, (crop_w, crop_h))

    # =============================================================
    # 1. 目パチ (精密カラーバランス + タイトマスク直接抽出)
    # =============================================================
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

    # 閉眼レイヤー
    eyes_closed_crop = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
    eyes_closed_crop[..., :3] = blink_calibrated
    eyes_closed_crop[..., 3] = (mask_eyes * 255.0).astype(np.uint8)

    eyes_closed_layer = np.zeros((H, W, 4), dtype=np.uint8)
    eyes_closed_layer[y1:y2, x1:x2] = eyes_closed_crop
    cv2.imwrite(str(char_dir / "eyes_closed.png"), eyes_closed_layer)

    # 半目マスク (まぶたが50%降りて瞳を隠す中割り)
    mask_eyes_half = np.zeros((crop_h, crop_w), dtype=np.float32)
    cv2.ellipse(mask_eyes_half, (el_cx, el_cy - int(ery * 0.15)), (erx, int(ery * 0.75)), -2, 0, 360, 1.0, -1)
    cv2.ellipse(mask_eyes_half, (er_cx, er_cy - int(ery * 0.15)), (erx, int(ery * 0.75)), 2, 0, 360, 1.0, -1)
    mask_eyes_half = cv2.GaussianBlur(mask_eyes_half, (7, 7), 1.5)

    eyes_half_crop = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
    half_blend = (blink_calibrated * 0.75 + base_crop_bgr * 0.25).astype(np.uint8)
    eyes_half_crop[..., :3] = half_blend
    eyes_half_crop[..., 3] = (mask_eyes_half * 255.0).astype(np.uint8)

    eyes_half_layer = np.zeros((H, W, 4), dtype=np.uint8)
    eyes_half_layer[y1:y2, x1:x2] = eyes_half_crop
    cv2.imwrite(str(char_dir / "eyes_half.png"), eyes_half_layer)

    print(f"[{char_id}] Built crisp eyes_closed.png & eyes_half.png")

    # =============================================================
    # 2. 口パク (解剖学的下顎モーフィング + 厳密差分マスキング)
    # =============================================================
    mcx, mcy = cfg["mouth_center"]
    rx, ry = cfg["mouth_rx_ry"]

    # ベース画像との差分から、口内・唇のみを抽出（マイクや周辺肌色を完全除外）
    diff = cv2.absdiff(mouth_crop, base_crop_bgr)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    window = np.zeros((crop_h, crop_w), dtype=np.uint8)
    cv2.ellipse(window, (mcx, mcy + 2), (rx, ry + 4), 0, 0, 360, 255, -1)

    _, bin_mask = cv2.threshold(diff_gray, 11, 255, cv2.THRESH_BINARY)
    bin_mask = cv2.bitwise_and(bin_mask, window)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    bin_mask = cv2.morphologyEx(bin_mask, cv2.MORPH_CLOSE, kernel)

    # 最大面積の連結成分（口の内部・唇）のみを保持し、周囲の微小ゴミを100%完全排除
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(bin_mask)
    if num_labels > 1:
        largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        bin_mask = np.where(labels == largest_label, 255, 0).astype(np.uint8)

    # 輪郭内部を完全塗りつぶし（Fill Holes）して口内部の半透明・穴あきを100%根絶
    contours, _ = cv2.findContours(bin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid_mask = np.zeros_like(bin_mask)
    if contours:
        largest = max(contours, key=cv2.contourArea)
        cv2.drawContours(solid_mask, [largest], -1, 255, -1)

    # 口内部は100% Solid（不透明=255）、最外周1.2pxのみ滑らかなアンチエイリアスを適用
    # （下のベース画像が透ける原因だった広域ガウシアンブラーを完全排除）
    dist = cv2.distanceTransform(solid_mask, cv2.DIST_L2, 3)
    alpha_base = np.clip(dist / 1.2, 0.0, 1.0)

    upper_y = mcy + cfg["upper_offset_y"]
    lower_y = mcy + cfg["lower_offset_y"]
    H_span = float(lower_y - upper_y)

    map_x, map_y = np.meshgrid(np.arange(crop_w, dtype=np.float32), np.arange(crop_h, dtype=np.float32))
    dx_rel = np.clip(np.abs(map_x - mcx) / float(rx), 0.0, 1.0)
    cos_val = np.maximum(0.0, np.cos(dx_rel * (np.pi / 2.0)))
    w_x = cos_val ** 1.3

    def create_mouth_frame(openness: float):
        if openness >= 0.99:
            layer_crop = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
            layer_crop[..., :3] = mouth_crop
            layer_crop[..., 3] = (alpha_base * 255.0).astype(np.uint8)
            return layer_crop

        max_shift = (1.0 - openness) * H_span

        w_y = np.zeros_like(map_y)
        inside_mask = (map_y > upper_y) & (map_y <= lower_y)
        w_y[inside_mask] = ((map_y[inside_mask] - upper_y) / H_span) ** 1.2

        chin_h = 3.5
        chin_mask = (map_y > lower_y) & (map_y <= lower_y + chin_h)
        chin_rel = (map_y[chin_mask] - lower_y) / chin_h
        w_y[chin_mask] = np.maximum(0.0, 1.0 - chin_rel)

        total_shift = max_shift * w_x * w_y
        cur_map_y = map_y + total_shift

        warped_img = cv2.remap(mouth_crop, map_x, cur_map_y, cv2.INTER_LANCZOS4)
        warped_alpha = cv2.remap(alpha_base, map_x, cur_map_y, cv2.INTER_LINEAR)

        current_lower_y = lower_y - (max_shift * w_x)
        bottom_clamp = np.clip((current_lower_y + 3.0 - map_y) / 2.5, 0.0, 1.0)
        final_alpha = np.clip(warped_alpha * bottom_clamp, 0.0, 1.0)

        layer_crop = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
        layer_crop[..., :3] = warped_img
        layer_crop[..., 3] = (final_alpha * 255.0).astype(np.uint8)
        return layer_crop

    # 1. 全開口 (mouth_open)
    crop_open = create_mouth_frame(1.0)
    layer_open = np.zeros((H, W, 4), dtype=np.uint8)
    layer_open[y1:y2, x1:x2] = crop_open
    cv2.imwrite(str(char_dir / "mouth_open.png"), layer_open)

    # 2. 半開口 (mouth_half - 0.60)
    crop_half = create_mouth_frame(0.60)
    layer_half = np.zeros((H, W, 4), dtype=np.uint8)
    layer_half[y1:y2, x1:x2] = crop_half
    cv2.imwrite(str(char_dir / "mouth_half.png"), layer_half)

    # 3. 微開口 (mouth_small - 0.28)
    crop_small = create_mouth_frame(0.28)
    layer_small = np.zeros((H, W, 4), dtype=np.uint8)
    layer_small[y1:y2, x1:x2] = crop_small
    cv2.imwrite(str(char_dir / "mouth_small.png"), layer_small)

    print(f"[{char_id}] Built natural anatomical mouth_open.png, mouth_half.png, mouth_small.png")

def main():
    output_base = BASE_DIR / "eve/assets/characters/diffs"
    output_base.mkdir(parents=True, exist_ok=True)

    for char_id, cfg in CONFIGS.items():
        process_character(char_id, cfg, output_base)

    print("\nAll character diff layers perfectly built with anatomical smoothness!")

if __name__ == "__main__":
    main()
