import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/94223eee-d51e-4e66-ae51-a5538e59e685")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. モバイル画面 (375x667) - 初期状態 (ユウタ)
    page_mobile = browser.new_page(viewport={"width": 375, "height": 667})
    page_mobile.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_mobile.evaluate("window.app.openGallery('yuta')")
    page_mobile.wait_for_timeout(400)
    page_mobile.screenshot(path=str(OUT / "improved_mobile_yuta.png"))

    # 2. モバイル画面 (375x667) - 右送りボタンクリック後
    page_mobile.click("#btn-gallery-tab-next")
    page_mobile.wait_for_timeout(400)
    page_mobile.screenshot(path=str(OUT / "improved_mobile_scrolled.png"))

    # 3. モバイル画面 (375x667) - ナレーター選択時 (末尾)
    page_mobile.evaluate("window.app.renderGalleryContent('narrator')")
    page_mobile.wait_for_timeout(400)
    page_mobile.screenshot(path=str(OUT / "improved_mobile_narrator.png"))

    # 4. 小型モバイル (360x640) - 大家のヤエガシ選択時
    page_small = browser.new_page(viewport={"width": 360, "height": 640})
    page_small.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_small.evaluate("window.app.openGallery('yaegashi')")
    page_small.wait_for_timeout(400)
    page_small.screenshot(path=str(OUT / "improved_mobile_360_yaegashi.png"))

    # 5. PC画面 (1200x800) - ユウタ
    page_pc = browser.new_page(viewport={"width": 1200, "height": 800})
    page_pc.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_pc.evaluate("window.app.openGallery('yuta')")
    page_pc.wait_for_timeout(400)
    page_pc.screenshot(path=str(OUT / "improved_pc_yuta.png"))

    browser.close()

print("All improved gallery screenshots captured successfully!")
