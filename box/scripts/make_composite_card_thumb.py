import os
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
bg_path = os.path.join(BASE_DIR, "box/assets/backgrounds/bg_room.jpg")
yuta_path = os.path.join(BASE_DIR, "box/assets/characters/yuta_confident.png")
out_dir = os.path.join(BASE_DIR, "box/assets/images")
os.makedirs(out_dir, exist_ok=True)

# 640x360 (16:9) のカード用比率
W, H = 640, 360

bg = Image.open(bg_path).convert("RGBA")
bw, bh = bg.size
ratio = max(W / bw, H / bh)
nw, nh = int(bw * ratio), int(bh * ratio)
bg = bg.resize((nw, nh), Image.Resampling.LANCZOS)
# 右側のマルチモニターが入るようにクロップ
left = int(nw - W) // 2
top = int(nh - H) // 2
bg = bg.crop((left, top, left + W, top + H))

# ユウタ立ち絵を左側または右側に合成
yuta = Image.open(yuta_path).convert("RGBA")
yw, yh = yuta.size
# ユウタを適度なサイズに（高さ340px）
target_yh = 340
target_yw = int(yw * (target_yh / yh))
yuta = yuta.resize((target_yw, target_yh), Image.Resampling.LANCZOS)

# 左側のベッド寄りにユウタを配置（右側のモニターとTVボックスを隠さないように）
comp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
comp = Image.alpha_composite(comp, bg)

# ユウタの影
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
shadow_d = ImageDraw.Draw(shadow)
yuta_x = 30
yuta_y = H - target_yh + 20
shadow.paste(Image.new("RGBA", (target_yw, target_yh), (0, 0, 0, 140)), (yuta_x + 5, yuta_y + 5), yuta)
shadow = shadow.filter(ImageFilter.GaussianBlur(10))
comp = Image.alpha_composite(comp, shadow)

# ユウタ本体
comp.paste(yuta, (yuta_x, yuta_y), yuta)

# 薄いサイバービネット
vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(vignette)
for i in range(15):
    alpha = int(120 * (1 - i / 15))
    vd.rectangle([i, i, W - i, H - i], outline=(3, 7, 18, alpha))
comp = Image.alpha_composite(comp, vignette)

out_file = os.path.join(out_dir, "card_thumb_composite.jpg")
comp.convert("RGB").save(out_file, quality=95)
print(f"Generated: {out_file}")
