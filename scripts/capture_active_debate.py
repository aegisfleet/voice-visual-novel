import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/9c55fd91-efac-4d6b-bc8a-5ed1b4fc07a1")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # PC立証ステージ本体
    page_pc = browser.new_page(viewport={"width": 1280, "height": 800})
    page_pc.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_pc.evaluate("""() => {
        window.app.state.addEvidence('hot_tv_box');
        window.app.state.addEvidence('creepy_pulse_packet');
        window.app.state.addEvidence('power_meter_pulse');
        window.app.startDebate();
        // 会話を即座に空にして立証UI本体を表示
        window.app.dialogueQueue = [];
        window.app.handleDialogueQueueEmpty();
    }""")
    page_pc.wait_for_timeout(600)
    page_pc.screenshot(path=str(OUT / "debate_stage_active_pc.png"))

    # モバイル立証ステージ本体
    page_sp = browser.new_page(viewport={"width": 375, "height": 667})
    page_sp.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_sp.evaluate("""() => {
        window.app.state.addEvidence('hot_tv_box');
        window.app.state.addEvidence('creepy_pulse_packet');
        window.app.state.addEvidence('power_meter_pulse');
        window.app.startDebate();
        // 会話を即座に空にして立証UI本体を表示
        window.app.dialogueQueue = [];
        window.app.handleDialogueQueueEmpty();
    }""")
    page_sp.wait_for_timeout(600)
    page_sp.screenshot(path=str(OUT / "debate_stage_active_mobile.png"))

    browser.close()

print("Active debate stage screenshots captured successfully!")
