import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
ICONS_DIR = os.path.join(ASSETS_DIR, "icons")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")

os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

# 1. SVG Faviconの作成
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f3ff"/>
      <stop offset="50%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#00f3ff"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 背景ダークサークル/ヘキサゴン -->
  <rect width="64" height="64" rx="14" fill="#030712"/>
  <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="url(#cyberGrad)" stroke-width="1.5" stroke-opacity="0.4"/>
  
  <!-- 外枠ヘキサゴン -->
  <polygon points="32,8 53,20 53,44 32,56 11,44 11,20" 
           fill="rgba(15, 23, 42, 0.8)" 
           stroke="url(#cyberGrad)" 
           stroke-width="2.5" 
           filter="url(#neonGlow)"/>
           
  <!-- サイバーグリッド線 -->
  <line x1="32" y1="8" x2="32" y2="22" stroke="#00f3ff" stroke-width="1.2" stroke-opacity="0.7"/>
  <line x1="11" y1="44" x2="23" y2="38" stroke="#2dd4bf" stroke-width="1.2" stroke-opacity="0.7"/>
  <line x1="53" y1="44" x2="41" y2="38" stroke="#c084fc" stroke-width="1.2" stroke-opacity="0.7"/>
  
  <!-- 中央のシャープなV字（VOICE & VISUAL） -->
  <path d="M22,23 L32,43 L42,23 L36,23 L32,32 L28,23 Z" 
        fill="url(#cyberGrad)" 
        filter="url(#neonGlow)"/>
        
  <!-- 中央のAIコアポイント -->
  <circle cx="32" cy="22" r="3.5" fill="#ffffff" filter="url(#neonGlow)"/>
  <circle cx="32" cy="22" r="1.8" fill="#00f3ff"/>
  
  <!-- コーナーのサイバーアクセントドット -->
  <circle cx="32" cy="51" r="1.5" fill="#00f3ff"/>
  <circle cx="16" cy="23" r="1.5" fill="#2dd4bf"/>
  <circle cx="48" cy="23" r="1.5" fill="#c084fc"/>
</svg>'''

svg_path = os.path.join(ICONS_DIR, "favicon.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)
print(f"Created: {svg_path}")

# ルート直下にも favicon.svg を配置
with open(os.path.join(BASE_DIR, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

# 2. 高解像度アプリアイコン PNG (512x512) をPillowで直接描画
def create_base_icon(size=512):
    img = Image.new("RGBA", (size, size), (3, 7, 18, 255))
    draw = ImageDraw.Draw(img)
    scale = size / 64.0
    
    # 背景の丸角ボックス
    corner_r = int(14 * scale)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_r, fill=(3, 7, 18, 255))
    draw.rounded_rectangle([int(2 * scale), int(2 * scale), size - 1 - int(2 * scale), size - 1 - int(2 * scale)], 
                           radius=int(12 * scale), outline=(0, 243, 255, 100), width=max(1, int(1.5 * scale)))
    
    # 六角形の頂点
    cx, cy = size / 2.0, size / 2.0
    r = 24.0 * scale
    hex_points = []
    for i in range(6):
        angle_deg = 60 * i - 30
        rad = math.radians(angle_deg)
        hex_points.append((cx + r * math.cos(rad), cy + r * math.sin(rad)))
    
    # 内側塗りつぶし
    draw.polygon(hex_points, fill=(15, 23, 42, 230), outline=(0, 243, 255, 255))
    
    # 太い境界線
    border_w = max(2, int(2.5 * scale))
    draw.polygon(hex_points, outline=(0, 243, 255, 255), width=border_w)
    
    # サイバーアクセント線
    draw.line([(cx, int(8 * scale)), (cx, int(22 * scale))], fill=(0, 243, 255, 200), width=max(1, int(1.5 * scale)))
    draw.line([(int(11 * scale), int(44 * scale)), (int(23 * scale), int(38 * scale))], fill=(45, 212, 191, 200), width=max(1, int(1.5 * scale)))
    draw.line([(int(53 * scale), int(44 * scale)), (int(41 * scale), int(38 * scale))], fill=(192, 132, 252, 200), width=max(1, int(1.5 * scale)))
    
    # V字シェイプ
    v_points = [
        (int(22 * scale), int(23 * scale)),
        (int(32 * scale), int(43 * scale)),
        (int(42 * scale), int(23 * scale)),
        (int(36 * scale), int(23 * scale)),
        (int(32 * scale), int(32 * scale)),
        (int(28 * scale), int(23 * scale))
    ]
    draw.polygon(v_points, fill=(0, 243, 255, 255), outline=(45, 212, 191, 255))
    
    # コアドット
    core_cx, core_cy = int(32 * scale), int(22 * scale)
    glow_r = int(4 * scale)
    draw.ellipse([core_cx - glow_r, core_cy - glow_r, core_cx + glow_r, core_cy + glow_r], fill=(0, 243, 255, 255))
    inner_r = int(2 * scale)
    draw.ellipse([core_cx - inner_r, core_cy - inner_r, core_cx + inner_r, core_cy + inner_r], fill=(255, 255, 255, 255))
    
    # サブドット
    for px, py, color in [(32, 51, (0, 243, 255)), (16, 23, (45, 212, 191)), (48, 23, (192, 132, 252))]:
        dr = max(2, int(2 * scale))
        draw.ellipse([int(px * scale) - dr, int(py * scale) - dr, int(px * scale) + dr, int(py * scale) + dr], fill=color)
        
    return img

icon_512 = create_base_icon(512)
icon_512.save(os.path.join(ICONS_DIR, "icon-512.png"))

icon_192 = icon_512.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save(os.path.join(ICONS_DIR, "icon-192.png"))

apple_icon = icon_512.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save(os.path.join(ICONS_DIR, "apple-touch-icon.png"))
apple_icon.save(os.path.join(BASE_DIR, "apple-touch-icon.png"))

icon_32 = icon_512.resize((32, 32), Image.Resampling.LANCZOS)
icon_32.save(os.path.join(ICONS_DIR, "favicon-32x32.png"))

icon_16 = icon_512.resize((16, 16), Image.Resampling.LANCZOS)
icon_16.save(os.path.join(ICONS_DIR, "favicon-16x16.png"))

# ルートのマルチサイズ favicon.ico
icon_48 = icon_512.resize((48, 48), Image.Resampling.LANCZOS)
icon_48.save(os.path.join(BASE_DIR, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
icon_48.save(os.path.join(ICONS_DIR, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

print("Favicon files created successfully.")

# 3. OGP 画像の作成 (1200x630)
def get_font(font_name, size):
    font_path = os.path.join("C:/Windows/Fonts", font_name)
    if os.path.exists(font_path):
        try:
            return ImageFont.truetype(font_path, size)
        except Exception:
            pass
    return ImageFont.load_default()

font_title = get_font("arialbd.ttf", 52)
font_title_jp = get_font("meiryob.ttc", 44)
font_subtitle = get_font("meiryo.ttc", 26)
font_badge = get_font("consolab.ttf", 20)
font_small = get_font("meiryo.ttc", 18)

# 3-A. ポータル用OGPバナー (assets/images/ogp-portal.png)
def create_portal_ogp():
    W, H = 1200, 630
    # 背景画像の読み込みとリサイズ・クロップ
    bg_src = os.path.join(BASE_DIR, "eve/assets/backgrounds/cyber_core.jpg")
    if os.path.exists(bg_src):
        bg = Image.open(bg_src).convert("RGBA")
        # 1200x630 をカバーするようにアスペクト比維持で拡大
        bw, bh = bg.size
        ratio = max(W / bw, H / bh)
        new_w, new_h = int(bw * ratio), int(bh * ratio)
        bg = bg.resize((new_w, new_h), Image.Resampling.LANCZOS)
        # 中央クロップ
        left = (new_w - W) // 2
        top = (new_h - H) // 2
        base = bg.crop((left, top, left + W, top + H))
    else:
        base = Image.new("RGBA", (W, H), (10, 15, 29, 255))
        
    # ダークサイバーオーバーレイ (グラデーション)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # 左側を濃くして文字を読みやすく、全体にダークベール
    for x in range(W):
        alpha = int(180 + 60 * (1.0 - (x / W)))
        ov_draw.line([(x, 0), (x, H)], fill=(3, 7, 18, alpha))
        
    base = Image.alpha_composite(base, overlay)
    
    # キャラクタースプライト（右側にイブを配置）
    eve_char_path = os.path.join(BASE_DIR, "eve/assets/characters/eve.png")
    if os.path.exists(eve_char_path):
        char_img = Image.open(eve_char_path).convert("RGBA")
        cw, ch = char_img.size
        target_h = int(H * 1.05)
        target_w = int(cw * (target_h / ch))
        char_img = char_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        # 右下に配置
        char_x = W - target_w + 40
        char_y = H - target_h + 30
        
        # グロー付きで合成
        char_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        char_layer.paste(char_img, (char_x, char_y), char_img)
        base = Image.alpha_composite(base, char_layer)

    draw = ImageDraw.Draw(base)
    
    # サイバー外枠フレーム
    draw.rectangle([20, 20, W - 20, H - 20], outline=(0, 243, 255, 120), width=2)
    draw.rectangle([24, 24, W - 24, H - 24], outline=(45, 212, 191, 60), width=1)
    
    # 四隅のサイバーアクセントL字
    corner_len = 30
    for cx, cy in [(20, 20), (W - 20, 20), (20, H - 20), (W - 20, H - 20)]:
        dx = 1 if cx == 20 else -1
        dy = 1 if cy == 20 else -1
        draw.line([(cx, cy), (cx + corner_len * dx, cy)], fill=(0, 243, 255, 255), width=4)
        draw.line([(cx, cy), (cx, cy + corner_len * dy)], fill=(0, 243, 255, 255), width=4)

    # 上部バッジ
    badge_text = "● CYBER FORENSICS // OFFICIAL PORTAL"
    draw.rounded_rectangle([60, 60, 480, 102], radius=20, fill=(15, 23, 42, 220), outline=(45, 212, 191, 200), width=1)
    draw.text((80, 72), badge_text, font=font_badge, fill=(45, 212, 191, 255))

    # メインタイトル
    draw.text((60, 130), "VOICE VISUAL NOVELS", font=font_title, fill=(255, 255, 255, 255))
    
    # ネオンアンダーライン
    draw.line([(60, 200), (620, 200)], fill=(0, 243, 255, 220), width=3)
    draw.line([(620, 200), (680, 200)], fill=(192, 132, 252, 180), width=3)
    
    # 日本語キャッチコピー
    draw.text((60, 225), "AIフルボイス・電脳捜査ノベル アーカイブ", font=font_title_jp, fill=(0, 243, 255, 255))
    
    # 掲載作品＆特徴タグ
    draw.text((60, 310), "◆ 掲載第1作: 『PROJECT EVE: 家族のためのハッキング』", font=font_subtitle, fill=(241, 245, 249, 255))
    draw.text((60, 355), "◆ 全編フルボイス × Web Audio API 立体音響システム", font=font_subtitle, fill=(148, 163, 184, 255))
    draw.text((60, 400), "◆ インストール不要 / PC・スマホのブラウザですぐにプレイ", font=font_subtitle, fill=(148, 163, 184, 255))
    
    # 下部スペックタグ
    tags = ["HTML5 / WebGL", "FULL VOICE", "BRANCHING STORY", "100% FREE"]
    tag_x = 60
    for tag in tags:
        tw = int(draw.textlength(tag, font=font_badge)) + 24
        draw.rounded_rectangle([tag_x, 480, tag_x + tw, 516], radius=6, fill=(15, 23, 42, 230), outline=(0, 243, 255, 140), width=1)
        draw.text((tag_x + 12, 488), tag, font=font_badge, fill=(0, 243, 255, 240))
        tag_x += tw + 14
        
    # URLクレジット
    draw.text((60, 560), "https://aegisfleet.github.io/voice-visual-novel/", font=font_small, fill=(100, 116, 139, 255))
    
    out_path = os.path.join(IMAGES_DIR, "ogp-portal.png")
    base.convert("RGB").save(out_path, quality=92)
    print(f"Created: {out_path}")

# 3-B. PROJECT EVE用OGPバナー (assets/images/ogp-eve.png)
def create_eve_ogp():
    W, H = 1200, 630
    bg_src = os.path.join(BASE_DIR, "eve/assets/backgrounds/title_bg.jpg")
    if os.path.exists(bg_src):
        bg = Image.open(bg_src).convert("RGBA")
        bw, bh = bg.size
        ratio = max(W / bw, H / bh)
        new_w, new_h = int(bw * ratio), int(bh * ratio)
        bg = bg.resize((new_w, new_h), Image.Resampling.LANCZOS)
        left = (new_w - W) // 2
        top = (new_h - H) // 2
        base = bg.crop((left, top, left + W, top + H))
    else:
        base = Image.new("RGBA", (W, H), (15, 23, 42, 255))
        
    # 暗幕オーバーレイ（下部と左部を暗くしてタイポグラフィを際立たせる）
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    for y in range(H):
        alpha = int(120 + 100 * (y / H))
        ov_draw.line([(0, y), (W, y)], fill=(3, 7, 18, alpha))
    for x in range(int(W * 0.7)):
        alpha = int(100 * (1.0 - (x / (W * 0.7))))
        ov_draw.line([(x, 0), (x, H)], fill=(3, 7, 18, alpha))
        
    base = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(base)
    
    # サイバー外枠フレーム
    draw.rectangle([20, 20, W - 20, H - 20], outline=(0, 243, 255, 140), width=2)
    
    # 四隅のサイバーアクセント
    corner_len = 30
    for cx, cy in [(20, 20), (W - 20, 20), (20, H - 20), (W - 20, H - 20)]:
        dx = 1 if cx == 20 else -1
        dy = 1 if cy == 20 else -1
        draw.line([(cx, cy), (cx + corner_len * dx, cy)], fill=(0, 243, 255, 255), width=4)
        draw.line([(cx, cy), (cx, cy + corner_len * dy)], fill=(0, 243, 255, 255), width=4)

    # バッジ
    draw.rounded_rectangle([60, 50, 490, 92], radius=20, fill=(15, 23, 42, 230), outline=(0, 243, 255, 200), width=1)
    draw.text((80, 62), "● AI FULL VOICE CYBER NOVEL", font=font_badge, fill=(0, 243, 255, 255))
    
    # タイトル
    draw.text((60, 115), "PROJECT EVE", font=font_title, fill=(255, 255, 255, 255))
    draw.text((60, 185), "〜 家族のためのハッキング 〜", font=font_title_jp, fill=(0, 243, 255, 255))
    
    # あらすじ・キャッチコピー
    draw.text((60, 275), "国民5400万人の個人情報流出事件。", font=font_subtitle, fill=(241, 245, 249, 255))
    draw.text((60, 318), "国家中枢を脅かす被疑者は――1台の家庭用少女型ロボットだった。", font=font_subtitle, fill=(241, 245, 249, 255))
    draw.text((60, 365), "電子証拠を分析し、自律逸脱の深層論理を暴け。", font=font_subtitle, fill=(45, 212, 191, 255))
    
    # ギミック告知バッジ
    draw.rounded_rectangle([60, 440, 560, 490], radius=8, fill=(192, 132, 252, 40), outline=(192, 132, 252, 220), width=1)
    draw.text((80, 452), "★ 伏線回収・周回再捜査ギミック搭載 (マルチエンディング)", font=get_font("meiryob.ttc", 20), fill=(216, 180, 254, 255))

    # 下部情報
    draw.text((60, 545), "ブラウザで今すぐ無料プレイ | インストール不要", font=font_subtitle, fill=(241, 245, 249, 255))
    draw.text((60, 580), "https://aegisfleet.github.io/voice-visual-novel/eve/", font=font_small, fill=(148, 163, 184, 255))
    
    out_path = os.path.join(IMAGES_DIR, "ogp-eve.png")
    base.convert("RGB").save(out_path, quality=92)
    print(f"Created: {out_path}")
    
    # eveディレクトリ下にも ogp.png としてコピー配置
    eve_img_dir = os.path.join(BASE_DIR, "eve/assets")
    base.convert("RGB").save(os.path.join(eve_img_dir, "ogp.png"), quality=92)

create_portal_ogp()
create_eve_ogp()
print("All assets successfully generated!")
