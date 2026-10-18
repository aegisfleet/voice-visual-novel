"""
chromakey.py - グリーンバック画像を透過PNGに変換するツール
"""
import sys
import os
import argparse
from PIL import Image
import numpy as np

def remove_green_screen(input_path, output_path, sensitivity=30.0, smoothness=40.0, spill_factor=1.05):
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Green dominance metric
    max_rb = np.maximum(r, b)
    diff = g - max_rb

    # Alpha ramp
    alpha = np.clip(1.0 - (diff - sensitivity) / smoothness, 0.0, 1.0) * 255.0

    # Spill suppression
    data[:,:,1] = np.minimum(g, max_rb * spill_factor + 10.0)
    data[:,:,3] = alpha

    out_img = Image.fromarray(data.astype(np.uint8))
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    out_img.save(output_path, 'PNG')
    print(f"[OK] Processed {input_path} -> {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Chroma key green screen removal")
    parser.add_argument("input", help="Input image file")
    parser.add_argument("output", help="Output PNG file")
    args = parser.parse_args()

    remove_green_screen(args.input, args.output)
