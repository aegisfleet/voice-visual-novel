import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/9d79f196-cb30-4faa-8a92-4227114a1bda")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ---------------------------------------------------------
    # テスト1: 立証フェーズ再開時のBGM検証 (PC)
    # ---------------------------------------------------------
    page_pc = browser.new_page(viewport={"width": 1280, "height": 800})
    page_pc.goto("http://localhost:8080/box/index.html", wait_until="networkidle")

    # セッションデータ（立証フェーズ中）を注入してリロード
    page_pc.evaluate("""() => {
        const session = {
            currentLoop: 1,
            activePhase: 'debate',
            currentArea: 'room',
            currentDebateStep: 0,
            life: 3,
            collectedEvidence: ['creepy_pulse_packet', 'power_meter_pulse', 'tv_box_thermal'],
            inspectedSpots: ['spot_tvbox', 'spot_router', 'spot_powermeter'],
            talkedNpcs: ['npc_yaegashi', 'npc_aoi'],
            savedAt: Date.now()
        };
        localStorage.setItem('box_worm_session_v1', JSON.stringify(session));
    }""")
    page_pc.reload(wait_until="networkidle")

    # タイトル画面でタイトルBGMが鳴っていることを確認
    bgm_title = page_pc.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[PC] タイトル画面初期BGM:", bgm_title)

    # 「前回の続きから再開」をクリック
    page_pc.click("#btn-continue-game")
    page_pc.wait_for_timeout(500)

    # 立証画面でのBGMモードとトラックを検証
    bgm_debate = page_pc.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[PC] 立証フェーズ再開後BGM:", bgm_debate)
    assert bgm_debate["mode"] == "tension", f"BGMモードが tension ではありません: {bgm_debate}"
    assert "bgm_crisis.mp3" in (bgm_debate["track"] or ""), f"BGMトラックが crisis ではありません: {bgm_debate}"

    # PC立証画面キャプチャ
    page_pc.screenshot(path=str(OUT / "debate_resume_pc.png"))

    # ---------------------------------------------------------
    # テスト2: 立証フェーズ再開時のBGM検証 (スマホ)
    # ---------------------------------------------------------
    page_sp = browser.new_page(viewport={"width": 375, "height": 667})
    page_sp.goto("http://localhost:8080/box/index.html", wait_until="networkidle")

    # セッションデータ（立証フェーズ中）を注入してリロード
    page_sp.evaluate("""() => {
        const session = {
            currentLoop: 1,
            activePhase: 'debate',
            currentArea: 'room',
            currentDebateStep: 1,
            life: 2,
            collectedEvidence: ['creepy_pulse_packet', 'power_meter_pulse', 'tv_box_thermal'],
            inspectedSpots: ['spot_tvbox', 'spot_router', 'spot_powermeter'],
            talkedNpcs: ['npc_yaegashi', 'npc_aoi'],
            savedAt: Date.now()
        };
        localStorage.setItem('box_worm_session_v1', JSON.stringify(session));
    }""")
    page_sp.reload(wait_until="networkidle")

    # スマホで「前回の続きから再開」をクリック
    page_sp.click("#btn-continue-game")
    page_sp.wait_for_timeout(500)

    bgm_debate_sp = page_sp.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[SP] 立証フェーズ再開後BGM:", bgm_debate_sp)
    assert bgm_debate_sp["mode"] == "tension", f"SP BGMモードが tension ではありません: {bgm_debate_sp}"
    assert "bgm_crisis.mp3" in (bgm_debate_sp["track"] or ""), f"SP BGMトラックが crisis ではありません: {bgm_debate_sp}"

    # スマホ立証画面キャプチャ
    page_sp.screenshot(path=str(OUT / "debate_resume_sp.png"))

    # ---------------------------------------------------------
    # テスト3: 探索フェーズ再開時のBGM検証 (PC)
    # ---------------------------------------------------------
    page_explore = browser.new_page(viewport={"width": 1280, "height": 800})
    page_explore.goto("http://localhost:8080/box/index.html", wait_until="networkidle")

    page_explore.evaluate("""() => {
        const session = {
            currentLoop: 1,
            activePhase: 'explore',
            currentArea: 'corridor',
            currentDebateStep: 0,
            life: 3,
            collectedEvidence: ['tv_box_thermal'],
            inspectedSpots: ['spot_tvbox'],
            talkedNpcs: [],
            savedAt: Date.now()
        };
        localStorage.setItem('box_worm_session_v1', JSON.stringify(session));
    }""")
    page_explore.reload(wait_until="networkidle")

    page_explore.click("#btn-continue-game")
    page_explore.wait_for_timeout(500)

    bgm_explore = page_explore.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[PC] 探索フェーズ再開後BGM:", bgm_explore)
    assert bgm_explore["mode"] == "explore", f"探索再開BGMモードが explore ではありません: {bgm_explore}"
    assert "bgm_investigation.mp3" in (bgm_explore["track"] or ""), f"探索再開BGMトラックが investigation ではありません: {bgm_explore}"

    # ---------------------------------------------------------
    # テスト4: 立証から探索へ戻り、再び立証へ進む遷移のBGM検証
    # ---------------------------------------------------------
    page_pc.evaluate("document.getElementById('btn-debate-back').click()")
    page_pc.wait_for_timeout(300)
    bgm_back = page_pc.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[PC] 現場再調査復帰後BGM:", bgm_back)
    assert bgm_back["mode"] == "explore", f"復帰BGMが explore ではありません: {bgm_back}"

    # 再度立証へ進む
    page_pc.evaluate("document.getElementById('btn-go-to-debate').click()")
    page_pc.wait_for_timeout(300)
    bgm_reenter = page_pc.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
    print("[PC] 再度立証突入後BGM:", bgm_reenter)
    assert bgm_reenter["mode"] == "tension", f"再突入BGMが tension ではありません: {bgm_reenter}"

    print("ALL TESTS PASSED SUCCESSFULLY!")
    browser.close()
