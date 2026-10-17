"""
scripts/verify_gallery_scroll.py
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/5154917e-6705-49f5-92ee-939e3a53b2c2")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 850})
    page.goto("http://localhost:8080/box/index.html?v=20261017_rev58", wait_until="networkidle")

    # ユウタ
    page.evaluate("window.app.openGallery('yuta')")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "verify_scroll_yuta.png"))

    # アオイ
    page.evaluate("window.app.renderGalleryContent('aoi')")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "verify_scroll_aoi.png"))

    # ヤエガシ
    page.evaluate("window.app.renderGalleryContent('yaegashi')")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "verify_scroll_yaegashi.png"))

    # MIMI
    page.evaluate("window.app.renderGalleryContent('mimi')")
    page.wait_for_timeout(300)
    page.evaluate("document.querySelector('.gallery-body').scrollTop = 9999")
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "verify_scroll_mimi.png"))

    browser.close()
print("All scroll screenshots captured successfully!")
