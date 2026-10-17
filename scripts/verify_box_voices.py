"""
scripts/verify_box_voices.py - BOX WORM ボイス試聴UIの実機検証スクリプト
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_DIR = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/5154917e-6705-49f5-92ee-939e3a53b2c2")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. 独立試聴室 (samples.html) の検証 (PC)
        page_pc = browser.new_page(viewport={"width": 1280, "height": 900})
        page_pc.goto("http://localhost:8080/box/samples.html", wait_until="networkidle")
        page_pc.screenshot(path=str(OUTPUT_DIR / "verify_samples_v2_pc.png"), full_page=True)
        print("Captured verify_samples_v2_pc.png")

        # 2. 独立試聴室 (samples.html) の検証 (Mobile)
        page_mobile = browser.new_page(viewport={"width": 390, "height": 844})
        page_mobile.goto("http://localhost:8080/box/samples.html", wait_until="networkidle")
        page_mobile.screenshot(path=str(OUTPUT_DIR / "verify_samples_v2_mobile.png"), full_page=False)
        print("Captured verify_samples_v2_mobile.png")

        # 3. ゲーム本編 (index.html) の設定資料集モーダルの検証
        page_game = browser.new_page(viewport={"width": 1200, "height": 850})
        page_game.goto("http://localhost:8080/box/index.html?v=20261017_rev59", wait_until="networkidle")

        # ナレータータブの表示
        page_game.evaluate("window.app.openGallery('narrator')")
        page_game.wait_for_timeout(400)
        page_game.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
        page_game.wait_for_timeout(300)
        page_game.screenshot(path=str(OUTPUT_DIR / "verify_gallery_narrator.png"))
        print("Captured verify_gallery_narrator.png")

        # MIMIタブの表示
        page_game.evaluate("window.app.renderGalleryContent('mimi')")
        page_game.wait_for_timeout(400)
        page_game.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
        page_game.wait_for_timeout(300)
        page_game.screenshot(path=str(OUTPUT_DIR / "verify_gallery_mimi_v2.png"))
        print("Captured verify_gallery_mimi_v2.png")

        browser.close()

if __name__ == "__main__":
    main()
