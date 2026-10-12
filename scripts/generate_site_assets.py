import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
ICONS_DIR = os.path.join(ASSETS_DIR, "icons")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")
FONTS_DIR = os.path.join(BASE_DIR, "scripts", "fonts")

os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(FONTS_DIR, exist_ok=True)

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

font_orbitron_huge = get_font(FONT_ORBITRON, 56)
font_orbitron_large = get_font(FONT_ORBITRON, 46)
font_chakra_badge = get_font(FONT_CHAKRA, 14)
font_chakra_tag = get_font(FONT_CHAKRA, 13)
font_chakra_url = get_font(FONT_CHAKRA, 15)

font_jp_title = get_font(FONT_JP_BOLD, 26)
font_jp_lead = get_font(FONT_JP_BOLD, 21)
font_jp_body_bold = get_font(FONT_JP_BOLD, 17)
font_jp_body = get_font(FONT_JP_REG, 17)
font_jp_tag = get_font(FONT_JP_BOLD, 13)
font_jp_badge = get_font(FONT_JP_BOLD, 16)

# 半透明の角丸長方形を安全に合成するヘルパー関数
def draw_glass_pill(img, box, radius, fill_color, border_color, border_width=1):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle(box, radius=radius, fill=fill_color, outline=border_color, width=border_width)
    return Image.alpha_composite(img, overlay)


# 2. ポータル用OGPバナー (1200x630) の生成
def render_portal_ogp():
    W, H = 1200, 630
    base = Image.new("RGBA", (W, H), (3, 7, 18, 255))
    
    # 背景画像（サイバーコア）
    bg_path = os.path.join(BASE_DIR, "eve/assets/backgrounds/cyber_core.jpg")
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert("RGBA")
        bw, bh = bg.size
        ratio = max(W / bw, H / bh)
        nw, nh = int(bw * ratio), int(bh * ratio)
        bg = bg.resize((nw, nh), Image.Resampling.LANCZOS)
        left = (nw - W) // 2
        top = (nh - H) // 2
        bg = bg.crop((left, top, left + W, top + H))
        
        dimmer = Image.new("RGBA", (W, H), (3, 7, 18, 140))
        bg = Image.alpha_composite(bg, dimmer)
        base = Image.alpha_composite(base, bg)

    # サイバーグリッド
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W, 40):
        grid_draw.line([(x, 0), (x, H)], fill=(0, 243, 255, 12))
    for y in range(0, H, 40):
        grid_draw.line([(0, y), (W, y)], fill=(0, 243, 255, 12))
    base = Image.alpha_composite(base, grid_layer)

    # 左側〜中央への滑らかなディープダークグラデーション
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    veil_draw = ImageDraw.Draw(veil)
    for x in range(W):
        if x < 620:
            alpha = 245
        elif x < 1050:
            t = (x - 620) / 430.0
            alpha = int(245 * (1.0 - t * 0.85))
        else:
            alpha = int(245 * 0.15 * max(0.0, 1.0 - (x - 1050) / 150.0))
        veil_draw.line([(x, 0), (x, H)], fill=(3, 7, 18, alpha))
    base = Image.alpha_composite(base, veil)

    # 右側キャラクター（イブ）
    char_path = os.path.join(BASE_DIR, "eve/assets/characters/eve.png")
    if os.path.exists(char_path):
        char_img = Image.open(char_path).convert("RGBA")
        cw, ch = char_img.size
        target_h = 620
        target_w = int(cw * (target_h / ch))
        char_img = char_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # ネオングロー
        glow_mask = char_img.split()[3].filter(ImageFilter.GaussianBlur(25))
        glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow_color = Image.new("RGBA", (target_w, target_h), (0, 243, 255, 100))
        glow_layer.paste(glow_color, (W - target_w + 10, H - target_h + 10), glow_mask)
        base = Image.alpha_composite(base, glow_layer)
        
        # キャラクター本体
        char_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        char_layer.paste(char_img, (W - target_w + 10, H - target_h + 10), char_img)
        
        # 足元フェード
        fade_mask = Image.new("L", (W, H), 255)
        fade_draw = ImageDraw.Draw(fade_mask)
        for y in range(H - 50, H):
            fa = int(255 * (1.0 - (y - (H - 50)) / 50.0))
            fade_draw.line([(0, y), (W, y)], fill=fa)
        char_layer.putalpha(Image.composite(char_layer.split()[3], Image.new("L", (W, H), 0), fade_mask))
        base = Image.alpha_composite(base, char_layer)

    # --- 左側UIのレンダリング ---
    startX = 65

    # 1. 上部HUDバッジ
    badge_label = "OFFICIAL PORTAL // CYBER FORENSICS"
    temp_draw = ImageDraw.Draw(base)
    badge_w = int(temp_draw.textlength(badge_label, font=font_chakra_badge)) + 40
    badge_h = 32
    base = draw_glass_pill(base, [startX, 50, startX + badge_w, 50 + badge_h], 16, 
                           (15, 23, 42, 220), (45, 212, 191, 220), border_width=1)
    
    draw = ImageDraw.Draw(base)
    # バッジの発光ドット
    draw.ellipse([startX + 14, 62, startX + 22, 70], fill=(45, 212, 191, 255))
    draw.text((startX + 28, 56), badge_label, font=font_chakra_badge, fill=(45, 212, 191, 255))

    # 2. メインタイトル
    draw.text((startX, 100), "VOICE VISUAL", font=font_orbitron_huge, fill=(255, 255, 255, 255))
    draw.text((startX, 160), "NOVELS", font=font_orbitron_huge, fill=(0, 243, 255, 255))

    # ネオンアンダーライン
    line_w = 460
    for lx in range(line_w):
        r = lx / float(line_w)
        c = (int(0 + r * 192), int(243 - r * 111), int(255 - r * 3), int(220 * (1.0 - r * 0.4)))
        draw.line([(startX + lx, 232), (startX + lx, 234)], fill=c)

    # 3. 日本語サブタイトル
    draw.text((startX, 248), "AIフルボイス・電脳捜査ノベル アーカイブ", font=font_jp_title, fill=(241, 245, 249, 255))

    # 4. 特徴リスト (アイコンは幾何学サイバーシェイプ)
    features = [
        ("◆", "第1作: 『PROJECT EVE: 家族のためのハッキング』 配信中", (255, 255, 255), True),
        (">>", "全編フルボイス × Web Audio 立体音響シネマティック演出", (226, 232, 240), False),
        (">>", "インストール不要 / PC・スマホのブラウザですぐに遊べる", (226, 232, 240), False),
    ]
    curY = 302
    for symbol, text, color, is_bold in features:
        # サイバー小アイコンプレート
        base = draw_glass_pill(base, [startX, curY, startX + 28, curY + 28], 6, 
                               (15, 23, 42, 200), (0, 243, 255, 120), border_width=1)
        draw = ImageDraw.Draw(base)
        sw = int(draw.textlength(symbol, font=font_chakra_badge))
        draw.text((startX + 14 - sw // 2, curY + 5), symbol, font=font_chakra_badge, fill=(0, 243, 255, 255))
        
        f_use = font_jp_body_bold if is_bold else font_jp_body
        draw.text((startX + 38, curY + 3), text, font=f_use, fill=color)
        curY += 38

    # 5. スペシャルタグ行
    tags = [
        ("HTML5 / WebGL", False),
        ("FULL VOICE", False),
        ("周回再捜査ギミック", True),
        ("100% FREE", False)
    ]
    tagX = startX
    tagY = 445
    for tag_str, is_highlight in tags:
        t_font = font_jp_tag if any(ord(c) > 127 for c in tag_str) else font_chakra_tag
        tw = int(draw.textlength(tag_str, font=t_font)) + 24
        th = 32
        if is_highlight:
            base = draw_glass_pill(base, [tagX, tagY, tagX + tw, tagY + th], 6, 
                                   (192, 132, 252, 40), (192, 132, 252, 220), border_width=1)
            draw = ImageDraw.Draw(base)
            draw.text((tagX + 12, tagY + 7), tag_str, font=t_font, fill=(233, 213, 255, 255))
        else:
            base = draw_glass_pill(base, [tagX, tagY, tagX + tw, tagY + th], 6, 
                                   (15, 23, 42, 220), (0, 243, 255, 140), border_width=1)
            draw = ImageDraw.Draw(base)
            draw.text((tagX + 12, tagY + 7), tag_str, font=t_font, fill=(0, 243, 255, 255))
        tagX += tw + 12

    # 6. 下部URLクレジット
    draw.text((startX, 545), "https://aegisfleet.github.io/voice-visual-novel/", 
              font=font_chakra_url, fill=(148, 163, 184, 255))

    # 7. 外周極細サイバーフレーム
    draw.rounded_rectangle([12, 12, W - 12, H - 12], radius=10, outline=(0, 243, 255, 80), width=1)
    
    out_path = os.path.join(IMAGES_DIR, "ogp-portal.png")
    base.convert("RGB").save(out_path, quality=95)
    print(f"Successfully generated: {out_path}")


# 3. PROJECT EVE用OGPバナー (1200x630) の生成
def render_eve_ogp():
    W, H = 1200, 630
    base = Image.new("RGBA", (W, H), (3, 7, 18, 255))

    # 背景画像（サイバー対策本部HQ）
    bg_path = os.path.join(BASE_DIR, "eve/assets/backgrounds/cyber_hq.jpg")
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert("RGBA")
        bw, bh = bg.size
        ratio = max(W / bw, H / bh)
        nw, nh = int(bw * ratio), int(bh * ratio)
        bg = bg.resize((nw, nh), Image.Resampling.LANCZOS)
        left = (nw - W) // 2
        top = (nh - H) // 2
        bg = bg.crop((left, top, left + W, top + H))
        
        dimmer = Image.new("RGBA", (W, H), (3, 7, 18, 120))
        bg = Image.alpha_composite(bg, dimmer)
        base = Image.alpha_composite(base, bg)

    # サイバーグリッド
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W, 40):
        grid_draw.line([(x, 0), (x, H)], fill=(0, 243, 255, 12))
    for y in range(0, H, 40):
        grid_draw.line([(0, y), (W, y)], fill=(0, 243, 255, 12))
    base = Image.alpha_composite(base, grid_layer)

    # 左側〜中央への滑らかなディープダークグラデーション
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    veil_draw = ImageDraw.Draw(veil)
    for x in range(W):
        if x < 620:
            alpha = 245
        elif x < 1050:
            t = (x - 620) / 430.0
            alpha = int(245 * (1.0 - t * 0.85))
        else:
            alpha = int(245 * 0.15 * max(0.0, 1.0 - (x - 1050) / 150.0))
        veil_draw.line([(x, 0), (x, H)], fill=(3, 7, 18, alpha))
    base = Image.alpha_composite(base, veil)

    # 右側キャラクター（イブ立ち絵）
    char_path = os.path.join(BASE_DIR, "eve/assets/characters/eve.png")
    if os.path.exists(char_path):
        char_img = Image.open(char_path).convert("RGBA")
        cw, ch = char_img.size
        target_h = 620
        target_w = int(cw * (target_h / ch))
        char_img = char_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        glow_mask = char_img.split()[3].filter(ImageFilter.GaussianBlur(25))
        glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow_color = Image.new("RGBA", (target_w, target_h), (0, 243, 255, 100))
        glow_layer.paste(glow_color, (W - target_w + 10, H - target_h + 10), glow_mask)
        base = Image.alpha_composite(base, glow_layer)
        
        char_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        char_layer.paste(char_img, (W - target_w + 10, H - target_h + 10), char_img)
        
        fade_mask = Image.new("L", (W, H), 255)
        fade_draw = ImageDraw.Draw(fade_mask)
        for y in range(H - 50, H):
            fa = int(255 * (1.0 - (y - (H - 50)) / 50.0))
            fade_draw.line([(0, y), (W, y)], fill=fa)
        char_layer.putalpha(Image.composite(char_layer.split()[3], Image.new("L", (W, H), 0), fade_mask))
        base = Image.alpha_composite(base, char_layer)

    startX = 65

    # 1. 上部HUDバッジ
    badge_label = "AI FULL VOICE // CYBER FORENSICS ADV"
    temp_draw = ImageDraw.Draw(base)
    badge_w = int(temp_draw.textlength(badge_label, font=font_chakra_badge)) + 40
    badge_h = 32
    base = draw_glass_pill(base, [startX, 48, startX + badge_w, 48 + badge_h], 16, 
                           (15, 23, 42, 220), (0, 243, 255, 220), border_width=1)
    
    draw = ImageDraw.Draw(base)
    draw.ellipse([startX + 14, 60, startX + 22, 68], fill=(0, 243, 255, 255))
    draw.text((startX + 28, 54), badge_label, font=font_chakra_badge, fill=(0, 243, 255, 255))

    # 2. メインタイトル
    draw.text((startX, 94), "PROJECT EVE", font=font_orbitron_huge, fill=(255, 255, 255, 255))
    draw.text((startX, 158), "〜 家族のためのハッキング 〜", font=font_jp_title, fill=(45, 212, 191, 255))

    # アンダーライン
    line_w = 460
    for lx in range(line_w):
        r = lx / float(line_w)
        c = (int(0 + r * 45), int(243 - r * 31), int(255 - r * 64), int(220 * (1.0 - r * 0.4)))
        draw.line([(startX + lx, 204), (startX + lx, 206)], fill=c)

    # 3. あらすじリード文
    draw.text((startX, 224), "国家中枢から国民5,400万人の個人情報流出事件。", font=font_jp_lead, fill=(255, 255, 255, 255))
    draw.text((startX, 258), "被疑者は――1台の家庭用少女型ロボットだった。", font=font_jp_lead, fill=(0, 243, 255, 255))
    
    draw.text((startX, 302), "電子証拠を分析し、自律逸脱の深層論理を解明せよ。", font=font_jp_body_bold, fill=(226, 232, 240, 255))
    draw.text((startX, 330), "全編フルボイス × マルチエンディング電脳サイバー捜査。", font=font_jp_body, fill=(148, 163, 184, 255))

    # 4. ギミックバナー（パープルネオン）
    gimmick_label = "[FILE RE-OPEN] 伏線回収・周回再捜査ギミック搭載！"
    gw = int(draw.textlength(gimmick_label, font=font_jp_badge)) + 30
    gh = 38
    base = draw_glass_pill(base, [startX, 376, startX + gw, 376 + gh], 8, 
                           (20, 15, 35, 230), (192, 132, 252, 220), border_width=1)
    
    draw = ImageDraw.Draw(base)
    # 左側のパープルアクセントバー
    draw.rectangle([startX, 376, startX + 5, 376 + gh], fill=(192, 132, 252, 255))
    draw.text((startX + 18, 384), gimmick_label, font=font_jp_badge, fill=(233, 213, 255, 255))

    # 5. タグ行
    eve_tags = ["AI FULL VOICE", "BROWSER FREE PLAY", "MULTI ENDING", "NO INSTALL"]
    tagX = startX
    tagY = 445
    for tag_str in eve_tags:
        tw = int(draw.textlength(tag_str, font=font_chakra_tag)) + 24
        th = 32
        base = draw_glass_pill(base, [tagX, tagY, tagX + tw, tagY + th], 6, 
                               (15, 23, 42, 220), (0, 243, 255, 140), border_width=1)
        draw = ImageDraw.Draw(base)
        draw.text((tagX + 12, tagY + 7), tag_str, font=font_chakra_tag, fill=(0, 243, 255, 255))
        tagX += tw + 12

    # 6. 下部URLクレジット
    draw.text((startX, 545), "https://aegisfleet.github.io/voice-visual-novel/eve/", 
              font=font_chakra_url, fill=(148, 163, 184, 255))

    # 7. 外周極細フレーム
    draw.rounded_rectangle([12, 12, W - 12, H - 12], radius=10, outline=(0, 243, 255, 80), width=1)

    out_path = os.path.join(IMAGES_DIR, "ogp-eve.png")
    base.convert("RGB").save(out_path, quality=95)
    print(f"Successfully generated: {out_path}")
    
    eve_assets_copy = os.path.join(BASE_DIR, "eve/assets", "ogp.png")
    base.convert("RGB").save(eve_assets_copy, quality=95)
    print(f"Copied to: {eve_assets_copy}")

if __name__ == "__main__":
    print("Generating refined OGP banners...")
    render_portal_ogp()
    render_eve_ogp()
    print("Done!")
