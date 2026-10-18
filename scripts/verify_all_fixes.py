import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/9c55fd91-efac-4d6b-bc8a-5ed1b4fc07a1")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. ルート index.html (ポータル) 検証
    # PC
    page_portal_pc = browser.new_page(viewport={"width": 1280, "height": 800})
    page_portal_pc.goto("http://localhost:8080/index.html", wait_until="networkidle")
    page_portal_pc.screenshot(path=str(OUT / "portal_pc.png"), full_page=True)
    
    # モバイル
    page_portal_sp = browser.new_page(viewport={"width": 375, "height": 667})
    page_portal_sp.goto("http://localhost:8080/index.html", wait_until="networkidle")
    page_portal_sp.screenshot(path=str(OUT / "portal_mobile.png"), full_page=True)
    
    # 2. BOX WORM 探索画面・ピンレティクル・トースト検証
    # PC
    page_game_pc = browser.new_page(viewport={"width": 1280, "height": 800})
    page_game_pc.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    # 探索画面直接表示
    page_game_pc.evaluate("""() => {
        window.app.showScreen('explore');
        window.app.renderExploreMap();
        window.app.updateEvidenceCounter();
    }""")
    page_game_pc.wait_for_timeout(500)
    page_game_pc.screenshot(path=str(OUT / "game_explore_pc.png"))
    
    # トースト表示テスト
    page_game_pc.evaluate("window.app.showEvidenceToast('tv_box_thermal')")
    page_game_pc.wait_for_timeout(300)
    page_game_pc.screenshot(path=str(OUT / "game_toast_pc.png"))
    
    # トーストクリックで手帳が開くか
    page_game_pc.click("#evidence-toast")
    page_game_pc.wait_for_timeout(300)
    page_game_pc.screenshot(path=str(OUT / "game_evidence_modal_pc.png"))
    page_game_pc.evaluate("window.app.closeEvidenceModal()")
    
    # モバイルでの探索ピン（NEWバッジと回転レティクルの分離確認）
    page_game_sp = browser.new_page(viewport={"width": 375, "height": 667})
    page_game_sp.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    page_game_sp.evaluate("""() => {
        window.app.showScreen('explore');
        window.app.renderExploreMap();
        window.app.updateEvidenceCounter();
    }""")
    page_game_sp.wait_for_timeout(500)
    page_game_sp.screenshot(path=str(OUT / "game_explore_mobile.png"))
    
    # モバイルでのトースト
    page_game_sp.evaluate("window.app.showEvidenceToast('tv_box_thermal')")
    page_game_sp.wait_for_timeout(300)
    page_game_sp.screenshot(path=str(OUT / "game_toast_mobile.png"))

    # 3. 立証ステージ（bg_debate.jpg背景と四隅レティクル）
    page_game_pc.evaluate("window.app.startDebate()")
    page_game_pc.wait_for_timeout(500)
    page_game_pc.screenshot(path=str(OUT / "game_debate_pc.png"))
    
    page_game_sp.evaluate("window.app.startDebate()")
    page_game_sp.wait_for_timeout(500)
    page_game_sp.screenshot(path=str(OUT / "game_debate_mobile.png"))
    
    # 4. モノローグ時の四隅レティクル確認
    page_game_pc.evaluate("""() => {
        window.app.playDialogueSequence([
            { speaker: 'ユウタ', text: '（……この通信ログ、何かおかしいぞ。）', monologue: true }
        ]);
    }""")
    page_game_pc.wait_for_timeout(300)
    page_game_pc.screenshot(path=str(OUT / "game_monologue_pc.png"))

    # 5. エンディング画面（第一幕クリア時、bad時）のボタン2段組検証
    # 第一幕クリア
    page_game_pc.evaluate("window.app.showEnding(window.app.scenario.endings.loop1_normal)")
    page_game_pc.wait_for_timeout(300)
    page_game_pc.screenshot(path=str(OUT / "ending_loop1_pc.png"))
    
    # モバイルでの第一幕クリア
    page_game_sp.evaluate("window.app.showEnding(window.app.scenario.endings.loop1_normal)")
    page_game_sp.wait_for_timeout(300)
    page_game_sp.screenshot(path=str(OUT / "ending_loop1_mobile.png"))
    
    # BAD END 時のオートセーブ検証
    page_game_pc.evaluate("window.app.showEnding(window.app.scenario.endings.gameOver)")
    page_game_pc.wait_for_timeout(300)
    session = page_game_pc.evaluate("window.app.state.loadSessionProgress()")
    print("BAD END Autosave Session:", session)
    page_game_pc.screenshot(path=str(OUT / "ending_bad_pc.png"))
    
    # タイトル画面に戻って CONTINUE ボタンの分母確認（周回後）
    # 2周目フラグをONにしてセッション保存
    page_game_pc.evaluate("""() => {
        window.app.state.currentLoop = 2;
        window.app.state.currentDebateStep = 3;
        window.app.state.saveSessionProgress('debate');
        window.app.returnToTitle();
    }""")
    page_game_pc.wait_for_timeout(300)
    continue_btn_text = page_game_pc.evaluate("document.getElementById('btn-continue-game').innerText")
    print("Continue Button Text (Loop 2 Step 4):", repr(continue_btn_text))
    page_game_pc.screenshot(path=str(OUT / "title_continue_loop2_pc.png"))

    browser.close()

print("All screenshots and verification tests finished successfully!")
