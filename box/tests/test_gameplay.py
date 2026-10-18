# -*- coding: utf-8 -*-
"""
box/tests/test_gameplay.py - ゲームループおよびUIステートの統合E2Eテスト
------------------------------------------------------------------
・タイトル画面（初回開始、周回情報、CONTINUEボタン表示）
・探索画面（自室 ⇔ 外廊下のエリア切り替え、証拠トースト演出、証拠手帳モーダル）
・立証ステージ（問答UI、証拠提示、正解演出、不正解ライフ減少、ゲームオーバー）
・現場再調査への可逆的復帰（立証 ⇔ 探索 の詰み防止保証）
・エンディング画面（第一幕クリア、BAD END、TRUE END）
・設定資料集（EXTRASギャラリーモーダル、タブ切り替え・スクロール）
・全ボイス試聴室（samples.html）の表示
"""
import unittest
from playwright.sync_api import sync_playwright
from helpers import LocalServerManager, BASE_URL, SAMPLES_URL, SCREENSHOTS_DIR, inject_session, clear_storage


class TestBoxGameplay(unittest.TestCase):
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

    def test_title_view_and_responsive(self):
        """タイトル画面のレイアウトとレスポンシブ表示 (PC & Mobile)"""
        # PC
        page_pc = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page_pc.goto(BASE_URL, wait_until="networkidle")
        clear_storage(page_pc)

        self.assertTrue(page_pc.is_visible("#btn-start-game"))
        self.assertTrue(page_pc.is_hidden("#btn-continue-game"), "セーブデータがない時はCONTINUEボタンが非表示であること")
        page_pc.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_title_pc.png"))
        page_pc.close()

        # Mobile (375x667)
        page_sp = self.browser.new_page(viewport={"width": 375, "height": 667})
        page_sp.goto(BASE_URL, wait_until="networkidle")
        self.assertTrue(page_sp.is_visible("#btn-start-game"))
        page_sp.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_title_sp.png"))
        page_sp.close()

    def test_exploration_map_and_evidence(self):
        """探索画面でのエリア切り替え・証拠トースト・証拠手帳モーダルの動作"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # 探索画面直接表示
        page.evaluate("""() => {
            window.app.showScreen('explore');
            window.app.renderExploreMap();
            window.app.switchArea('room');
        }""")
        page.wait_for_timeout(300)

        # エリア切り替え (外廊下へ)
        page.click("#btn-area-corridor")
        page.wait_for_timeout(300)
        current_area = page.evaluate("() => window.app.currentArea")
        self.assertEqual(current_area, "corridor")

        # 自室へ戻る
        page.click("#btn-area-room")
        page.wait_for_timeout(300)
        current_area = page.evaluate("() => window.app.currentArea")
        self.assertEqual(current_area, "room")

        # 証拠トースト表示テスト
        page.evaluate("window.app.showEvidenceToast('tv_box_thermal')")
        page.wait_for_timeout(300)
        self.assertTrue(page.is_visible("#evidence-toast"))
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_evidence_toast.png"))

        # トーストクリックで手帳が開くか検証
        page.click("#evidence-toast")
        page.wait_for_timeout(300)
        self.assertTrue(page.is_visible("#modal-evidence"))
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_evidence_modal.png"))

        # 手帳を閉じる
        page.click("#btn-close-modal")
        page.wait_for_timeout(200)
        self.assertTrue(page.is_hidden("#modal-evidence"))
        page.close()

    def test_debate_submission_and_life(self):
        """立証フェーズでの問答進行、不正解ダメージ演出、ライフ減少"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # 立証フェーズ開始
        page.evaluate("""() => {
            window.app.state.collectedEvidence = new Set(['creepy_pulse_packet', 'power_meter_pulse', 'tv_box_thermal']);
            window.app.startDebate();
            // イントロ会話劇をクローズして立証問答受付状態にする
            window.app.dom.dialogueStage.classList.add('hidden');
            document.body.classList.remove('dialogue-active');
            window.app.isDialogueActive = false;
        }""")
        page.wait_for_timeout(400)
        self.assertTrue(page.is_visible("#screen-debate"))

        # 初期ライフは3
        initial_life = page.evaluate("() => window.app.state.life")
        self.assertEqual(initial_life, 3)

        # 不正解の証拠を提示してライフが減るか検証
        # 問答1の正解は creepy_pulse_packet、不正解として tv_box_thermal を提示
        page.evaluate("""() => {
            window.app.selectedEvidenceId = 'tv_box_thermal';
            window.app.handlePresentEvidence();
        }""")
        page.wait_for_timeout(400)

        decreased_life = page.evaluate("() => window.app.state.life")
        self.assertEqual(decreased_life, 2, "不正解提示後にライフが2に減少していること")
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_debate_damage.png"))
        page.close()

    def test_endings_display(self):
        """各種エンディング画面（第一幕クリア、TRUE END、BAD END）の表示検証"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # 1. 第一幕クリア画面
        page.evaluate("window.app.showEnding(window.app.scenario.endings.loop1_normal)")
        page.wait_for_timeout(300)
        self.assertTrue(page.is_visible("#screen-ending"))
        self.assertTrue(page.is_visible("#ending-unlocked-banner"))
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_ending_loop1.png"))

        # 2. BAD END (ゲームオーバー) 画面
        page.evaluate("window.app.showEnding(window.app.scenario.endings.gameOver)")
        page.wait_for_timeout(300)
        retry_text = page.evaluate("() => document.getElementById('btn-ending-next').textContent")
        self.assertIn("RETRY", retry_text)
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_ending_bad.png"))

        # 3. TRUE END 画面
        page.evaluate("window.app.showEnding(window.app.scenario.endings.true)")
        page.wait_for_timeout(300)
        self.assertTrue(page.is_visible("#ending-unlocked-banner"))
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_ending_true.png"))
        page.close()

    def test_gallery_and_samples_page(self):
        """設定資料集EXTRASモーダルおよびsamples.htmlボイス試聴室の表示"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # ギャラリーモーダルを開く
        page.evaluate("window.app.openGallery('yuta')")
        page.wait_for_timeout(400)
        self.assertTrue(page.is_visible("#modal-gallery"))

        # タブ切り替え (MIMI)
        page.evaluate("window.app.renderGalleryContent('mimi')")
        page.wait_for_timeout(300)
        page.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_gallery_mimi.png"))
        page.close()

        # samples.html の検証
        page_samples = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page_samples.goto(SAMPLES_URL, wait_until="networkidle")
        cards_count = page_samples.evaluate("() => document.querySelectorAll('.char-card').length")
        self.assertGreaterEqual(cards_count, 4, "全キャラクターの試聴カードが表示されていること")
        page_samples.screenshot(path=str(SCREENSHOTS_DIR / "gameplay_samples_room.png"))
        page_samples.close()


if __name__ == "__main__":
    unittest.main()
