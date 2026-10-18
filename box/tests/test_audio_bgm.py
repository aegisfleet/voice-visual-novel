# -*- coding: utf-8 -*-
"""
box/tests/test_audio_bgm.py - BGMおよび音声再生パイプラインの統合E2Eテスト
------------------------------------------------------------------
・タイトル画面での初期BGM
・「前回の続きから再開」でのBGM即時同期（立証フェーズ -> tension, 探索フェーズ -> explore）
・立証 ⇔ 探索 往復遷移時のBGM切り替え
・BGMトグル（ミュート/ミュート解除時のモード保持）
・オーディオアンロック状態の検証
"""
import unittest
from playwright.sync_api import sync_playwright
from helpers import LocalServerManager, BASE_URL, SCREENSHOTS_DIR, inject_session, clear_storage


class TestBoxAudioAndBgm(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server_mgr = LocalServerManager()
        cls.server_mgr.ensure_server()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server_mgr.stop()

    def test_title_bgm_initialization(self):
        """タイトル画面でtitleモードのBGMが設定されること"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")
        clear_storage(page)

        bgm_info = page.evaluate("() => ({ mode: window.app.audio.currentBgmMode })")
        self.assertEqual(bgm_info["mode"], "title")
        page.screenshot(path=str(SCREENSHOTS_DIR / "test_title_bgm.png"))
        page.close()

    def test_resume_debate_bgm_synchronization(self):
        """立証フェーズのセッションから再開した際、tension BGMが即時再生されること (PC & Mobile)"""
        session_data = {
            "currentLoop": 1,
            "activePhase": "debate",
            "currentArea": "room",
            "currentDebateStep": 0,
            "life": 3,
            "collectedEvidence": ["creepy_pulse_packet", "power_meter_pulse", "tv_box_thermal"],
            "inspectedSpots": ["spot_tvbox", "spot_router", "spot_powermeter"],
            "talkedNpcs": ["npc_yaegashi", "npc_aoi"],
            "savedAt": 1234567890
        }

        # 1. PC環境
        page_pc = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page_pc.goto(BASE_URL, wait_until="networkidle")
        inject_session(page_pc, session_data)

        page_pc.click("#btn-continue-game")
        page_pc.wait_for_timeout(400)

        bgm_pc = page_pc.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
        self.assertEqual(bgm_pc["mode"], "tension", "立証再開時のBGMモードが tension ではありません")
        self.assertIn("bgm_crisis.mp3", bgm_pc["track"] or "", "立証再開時のBGMトラックが bgm_crisis.mp3 ではありません")
        page_pc.screenshot(path=str(SCREENSHOTS_DIR / "test_resume_debate_pc.png"))
        page_pc.close()

        # 2. モバイル環境 (375x667)
        page_sp = self.browser.new_page(viewport={"width": 375, "height": 667})
        page_sp.goto(BASE_URL, wait_until="networkidle")
        inject_session(page_sp, session_data)

        page_sp.click("#btn-continue-game")
        page_sp.wait_for_timeout(400)

        bgm_sp = page_sp.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
        self.assertEqual(bgm_sp["mode"], "tension")
        self.assertIn("bgm_crisis.mp3", bgm_sp["track"] or "")
        page_sp.screenshot(path=str(SCREENSHOTS_DIR / "test_resume_debate_sp.png"))
        page_sp.close()

    def test_resume_explore_bgm_synchronization(self):
        """探索フェーズのセッションから再開した際、explore BGMが即時再生されること"""
        session_data = {
            "currentLoop": 1,
            "activePhase": "explore",
            "currentArea": "corridor",
            "currentDebateStep": 0,
            "life": 3,
            "collectedEvidence": ["tv_box_thermal"],
            "inspectedSpots": ["spot_tvbox"],
            "talkedNpcs": [],
            "savedAt": 1234567890
        }
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")
        inject_session(page, session_data)

        page.click("#btn-continue-game")
        page.wait_for_timeout(400)

        bgm_explore = page.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
        self.assertEqual(bgm_explore["mode"], "explore")
        self.assertIn("bgm_investigation.mp3", bgm_explore["track"] or "")
        page.screenshot(path=str(SCREENSHOTS_DIR / "test_resume_explore_pc.png"))
        page.close()

    def test_reversible_transition_bgm(self):
        """立証フェーズから現場再調査へ戻り、再び立証へ挑む双方向遷移でBGMが正確に切り替わること"""
        session_data = {
            "currentLoop": 1,
            "activePhase": "debate",
            "currentArea": "room",
            "currentDebateStep": 0,
            "life": 3,
            "collectedEvidence": ["creepy_pulse_packet", "power_meter_pulse", "tv_box_thermal"],
            "inspectedSpots": ["spot_tvbox", "spot_router", "spot_powermeter"],
            "talkedNpcs": ["npc_yaegashi", "npc_aoi"],
            "savedAt": 1234567890
        }
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")
        inject_session(page, session_data)

        page.click("#btn-continue-game")
        page.wait_for_timeout(300)

        # 現場再調査へ戻る
        page.evaluate("document.getElementById('btn-debate-back').click()")
        page.wait_for_timeout(300)
        bgm_back = page.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
        self.assertEqual(bgm_back["mode"], "explore")
        self.assertIn("bgm_investigation.mp3", bgm_back["track"] or "")

        # 再度立証へ挑む
        page.evaluate("document.getElementById('btn-go-to-debate').click()")
        page.wait_for_timeout(300)
        bgm_reenter = page.evaluate("() => ({ mode: window.app.audio.currentBgmMode, track: window.app.audio.currentBgmTrack?.url })")
        self.assertEqual(bgm_reenter["mode"], "tension")
        self.assertIn("bgm_crisis.mp3", bgm_reenter["track"] or "")
        page.close()

    def test_bgm_toggle_mode_preservation(self):
        """BGMをミュート・解除した際に直前の再生モードが正しく復帰すること"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")
        inject_session(page, {
            "currentLoop": 1,
            "activePhase": "debate",
            "currentArea": "room",
            "collectedEvidence": ["creepy_pulse_packet", "power_meter_pulse", "tv_box_thermal"],
            "inspectedSpots": ["desk_setup", "tv_box_array"],
            "talkedNpcs": ["shibata"],
            "currentDebateStep": 0,
            "life": 3,
        })
        page.click("#btn-continue-game")
        page.wait_for_timeout(300)

        # 立証画面が表示されていること (BGMモード: tension)
        current_mode = page.evaluate("() => window.app.audio.currentBgmMode")
        self.assertEqual(current_mode, "tension")

        # BGM OFF
        page.evaluate("window.app.dom.btnToggleBgm.click()")
        page.wait_for_timeout(100)
        is_enabled = page.evaluate("() => window.app.audio.bgmEnabled")
        self.assertFalse(is_enabled)

        # BGM ON
        page.evaluate("window.app.dom.btnToggleBgm.click()")
        page.wait_for_timeout(100)
        res = page.evaluate("() => ({ enabled: window.app.audio.bgmEnabled, mode: window.app.audio.currentBgmMode })")
        self.assertTrue(res["enabled"])
        self.assertEqual(res["mode"], "tension")
        page.close()


if __name__ == "__main__":
    unittest.main()
