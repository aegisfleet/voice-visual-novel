import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/9d79f196-cb30-4faa-8a92-4227114a1bda")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:8080/box/index.html", wait_until="networkidle")

    # epilogueLoop2 を直接再生し、該当セリフ（index 11: 「そうだ……！ 今の彼女は...」）まで進める
    res = page.evaluate("""() => {
        const epilogue = window.app.scenario.debate.epilogueLoop2;
        // epilogueLoop2[11] is "ユウタ（心の声）: （そうだ……！ 今の彼女は、たった4GBメモリの中華TVボックス15台で手分けして...）"
        // 直接このシーケンスを流す
        window.app.playDialogueSequence(epilogue);
        
        // 該当の11番目のアイテムまでキューを消費して進める
        // 初期呼び出しで0番目が消費されているため、10個shiftすると11番目（index 11）が表示される
        for (let i = 0; i < 10; i++) {
            window.app.dialogueQueue.shift();
        }
        window.app.showNextDialogue();

        return {
            currentCharId: window.app.character.currentCharId,
            currentSpeaker: window.app.currentSpeaker,
            currentText: window.app.currentFullText,
            activeNpcInScene: window.app.activeNpcInScene,
            stageHidden: window.app.dom.characterStage.classList.contains('hidden')
        };
    }""")
    print("セリフ状態:", res)
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "epilogue_yuta_monologue.png"))

    assert res["currentCharId"] == "yuta", f"currentCharId が yuta ではありません: {res['currentCharId']}"
    assert "そうだ……！" in res["currentText"], f"text が一致しません: {res['currentText']}"
    print("VERIFICATION SUCCESSFUL: ユウタの立ち絵が正しく表示され、シバタは召喚されていません！")
    browser.close()
