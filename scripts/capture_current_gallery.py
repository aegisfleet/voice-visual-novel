import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/94223eee-d51e-4e66-ae51-a5538e59e685")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # モバイルビューポート (iPhone SE / 375x667)
    page_mobile = browser.new_page(viewport={"width": 375, "height": 667})
    page_mobile.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_mobile.evaluate("window.app.openGallery('yuta')")
    page_mobile.wait_for_timeout(500)
    page_mobile.screenshot(path=str(OUT / "current_mobile_gallery.png"))
    
    # PCビューポート (1200x800)
    page_pc = browser.new_page(viewport={"width": 1200, "height": 800})
    page_pc.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_pc.evaluate("window.app.openGallery('yuta')")
    page_pc.wait_for_timeout(500)
    page_pc.screenshot(path=str(OUT / "current_pc_gallery.png"))

    browser.close()

print("Current gallery screenshots captured successfully!")
