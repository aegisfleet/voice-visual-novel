import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")
FONTS_DIR = os.path.join(BASE_DIR, "scripts", "fonts")

os.makedirs(IMAGES_DIR, exist_ok=True)

# 1. フォント設定
FONT_ORBITRON = os.path.join(FONTS_DIR, "Orbitron-Black.ttf")
FONT_CHAKRA = os.path.join(FONTS_DIR, "ChakraPetch-Bold.ttf")
FONT_JP_BOLD = "C:/Windows/Fonts/meiryob.ttc"
FONT_JP_REG = "C:/Windows/Fonts/meiryo.ttc"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception as e:
        print(f"Font load error ({path}): {e}")
        return ImageFont.load_default()

font_orbitron_huge = get_font(FONT_ORBITRON, 58)
font_chakra_badge = get_font(FONT_CHAKRA, 14)
font_chakra_tag = get_font(FONT_CHAKRA, 13)
font_chakra_url = get_font(FONT_CHAKRA, 15)

font_jp_sub = get_font(FONT_JP_BOLD, 26)
font_jp_lead = get_font(FONT_JP_BOLD, 18)
font_jp_tag = get_font(FONT_JP_BOLD, 13)

def draw_glass_pill(img, box, radius, fill_color, border_color, border_width=1):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle(box, radius=radius, fill=fill_color, outline=border_color, width=border_width)
    return Image.alpha_composite(img, overlay)

def render_box_ogp():
    W, H = 1200, 630
    base = Image.new("RGBA", (W, H), (3, 7, 18, 255))
    
    # 背景画像（タイトル背景: TVボックス群とニューラルネットワーク）
    bg_path = os.path.join(BASE_DIR, "box/assets/backgrounds/bg_title.jpg")
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert("RGBA")
        bw, bh = bg.size
        ratio = max(W / bw, H / bh)
        nw, nh = int(bw * ratio), int(bh * ratio)
        bg = bg.resize((nw, nh), Image.Resampling.LANCZOS)
        left = (nw - W) // 2
        top = (nh - H) // 2
        bg = bg.crop((left, top, left + W, top + H))
        
        dimmer = Image.new("RGBA", (W, H), (3, 7, 18, 100))
        bg = Image.alpha_composite(bg, dimmer)
        base = Image.alpha_composite(base, bg)

    # サイバーグリッド
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W, 40):
        grid_draw.line([(x, 0), (x, H)], fill=(0, 243, 255, 14))
    for y in range(0, H, 40):
        grid_draw.line([(0, y), (W, y)], fill=(0, 243, 255, 14))
    base = Image.alpha_composite(base, grid_layer)

    # 左側〜中央への滑らかなディープダークグラデーション（テキスト可読性確保）
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    veil_draw = ImageDraw.Draw(veil)
    for x in range(W):
        if x < 600:
            alpha = 248
        elif x < 950:
            t = (x - 600) / 350.0
            alpha = int(248 * (1.0 - t * 0.82))
        else:
            alpha = int(248 * 0.18 * max(0.0, 1.0 - (x - 950) / 250.0))
        veil_draw.line([(x, 0), (x, H)], fill=(3, 7, 18, alpha))
    base = Image.alpha_composite(base, veil)

    # 右側キャラクター合成（背景に半透明ミミ、手前にユウタ）
    mimi_path = os.path.join(BASE_DIR, "box/assets/characters/mimi_normal.png")
    if os.path.exists(mimi_path):
        mimi = Image.open(mimi_path).convert("RGBA")
        mw, mh = mimi.size
        target_mh = 560
        target_mw = int(mw * (target_mh / mh))
        mimi = mimi.resize((target_mw, target_mh), Image.Resampling.LANCZOS)
        
        # ミミを神秘的な半透明・シアン発光調にする
        r, g, b, a = mimi.split()
        a = a.point(lambda p: int(p * 0.55))
        mimi.putalpha(a)
        
        # 配置（ユウタの背後・右寄り）
        mimi_x = W - target_mw - 20
        mimi_y = 40
        base.paste(mimi, (mimi_x, mimi_y), mimi)

    yuta_path = os.path.join(BASE_DIR, "box/assets/characters/yuta_confident.png")
    if os.path.exists(yuta_path):
        yuta = Image.open(yuta_path).convert("RGBA")
        yw, yh = yuta.size
        target_yh = 620
        target_yw = int(yw * (target_yh / yh))
        yuta = yuta.resize((target_yw, target_yh), Image.Resampling.LANCZOS)
        
        # ユウタ配置（右端寄り、下端揃え）
        yuta_x = W - target_yw + 30
        yuta_y = H - target_yh + 20
        base.paste(yuta, (yuta_x, yuta_y), yuta)

    # テキスト描画レイヤー
    draw = ImageDraw.Draw(base)
    startX = 75

    # 1. プラットフォームバッジ
    badge_text = "VOICE VISUAL NOVELS  //  2026 FRONTIER AI REPLICATOR PROJECT"
    bw = int(draw.textlength(badge_text, font=font_chakra_badge)) + 24
    base = draw_glass_pill(base, [startX, 68, startX + bw, 98], 6, 
                           (15, 23, 42, 230), (0, 243, 255, 180), border_width=1)
    draw = ImageDraw.Draw(base)
    draw.text((startX + 12, 75), badge_text, font=font_chakra_badge, fill=(0, 243, 255, 255))

    # 2. メインタイトル (BOX WORM) - ネオングロウ効果
    title_text = "BOX WORM"
    titleY = 125
    # グロウ（複数回ブラー風オフセット描画）
    for ox, oy, alpha in [(-2, 0, 40), (2, 0, 40), (0, -2, 40), (0, 2, 40), (-3, -3, 25), (3, 3, 25)]:
        draw.text((startX + ox, titleY + oy), title_text, font=font_orbitron_huge, fill=(0, 243, 255, alpha))
    draw.text((startX, titleY), title_text, font=font_orbitron_huge, fill=(240, 249, 255, 255))

    # 3. サブタイトル
    sub_text = "〜 55ドルの自己増殖知性 〜"
    subY = 205
    for ox, oy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        draw.text((startX + ox, subY + oy), sub_text, font=font_jp_sub, fill=(0, 243, 255, 60))
    draw.text((startX, subY), sub_text, font=font_jp_sub, fill=(56, 189, 248, 255))

    # 4. キャッチコピー＆説明文
    leadY = 270
    draw.text((startX, leadY), "安アパートのチープなTVボックス群から創発した、自律する小さな命。", 
              font=font_jp_lead, fill=(241, 245, 249, 255))
    draw.text((startX, leadY + 34), "警察の強制遮断が迫る中、客観的電脳鑑識データで真相を立証せよ！", 
              font=font_jp_lead, fill=(203, 213, 225, 255))

    # 5. 特徴タグピル
    tags = [
        ("● 公開中 (PLAYABLE)", True),
        ("全編フルボイス (全253セリフ)", False),
        ("現場鑑識＆論戦立証", False),
        ("二部構成 / TRUE END", False),
    ]
    tagX = startX
    tagY = 385
    for tag_str, is_highlight in tags:
        t_font = font_jp_tag
        tw = int(draw.textlength(tag_str, font=t_font)) + 24
        th = 32
        if is_highlight:
            base = draw_glass_pill(base, [tagX, tagY, tagX + tw, tagY + th], 6, 
                                   (14, 165, 233, 40), (56, 189, 248, 230), border_width=1)
            draw = ImageDraw.Draw(base)
            draw.text((tagX + 12, tagY + 7), tag_str, font=t_font, fill=(186, 230, 253, 255))
        else:
            base = draw_glass_pill(base, [tagX, tagY, tagX + tw, tagY + th], 6, 
                                   (15, 23, 42, 220), (0, 243, 255, 140), border_width=1)
            draw = ImageDraw.Draw(base)
            draw.text((tagX + 12, tagY + 7), tag_str, font=t_font, fill=(0, 243, 255, 255))
        tagX += tw + 12

    # 6. 下部URLクレジット
    draw.text((startX, 545), "https://aegisfleet.github.io/voice-visual-novel/box/", 
              font=font_chakra_url, fill=(148, 163, 184, 255))

    # 7. 外周極細サイバーフレーム＆四隅L字レティクル
    draw.rounded_rectangle([14, 14, W - 14, H - 14], radius=12, outline=(0, 243, 255, 70), width=1)
    
    # 四隅L字レティクル
    reticle_len = 20
    corners = [
        ((14, 14), (14 + reticle_len, 14), (14, 14 + reticle_len)), # top-left
        ((W - 14, 14), (W - 14 - reticle_len, 14), (W - 14, 14 + reticle_len)), # top-right
        ((14, H - 14), (14 + reticle_len, H - 14), (14, H - 14 - reticle_len)), # bottom-left
        ((W - 14, H - 14), (W - 14 - reticle_len, H - 14), (W - 14, H - 14 - reticle_len)), # bottom-right
    ]
    for c, h_pt, v_pt in corners:
        draw.line([c, h_pt], fill=(0, 243, 255, 230), width=2)
        draw.line([c, v_pt], fill=(0, 243, 255, 230), width=2)

    # 8. 保存（assets/images/ogp-box.png および box/assets/images/ogp-box.png）
    out_path1 = os.path.join(IMAGES_DIR, "ogp-box.png")
    base.convert("RGB").save(out_path1, quality=95)
    print(f"Successfully generated: {out_path1}")

    box_images_dir = os.path.join(BASE_DIR, "box", "assets", "images")
    os.makedirs(box_images_dir, exist_ok=True)
    out_path2 = os.path.join(box_images_dir, "ogp-box.png")
    base.convert("RGB").save(out_path2, quality=95)
    print(f"Successfully generated: {out_path2}")

if __name__ == "__main__":
    render_box_ogp()
