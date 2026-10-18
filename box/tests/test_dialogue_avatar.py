# -*- coding: utf-8 -*-
"""
box/tests/test_dialogue_avatar.py - 会話劇およびキャラクター立ち絵レンダラーの統合E2Eテスト
------------------------------------------------------------------
・群像劇エピローグでの立ち絵整合性検証（シバタの誤召喚防止＆ユウタ立ち絵表示）
・探索パートの一対一NPC対話における立ち絵維持＆モノローグ減光
・ナレーション時の立ち絵ステージ非表示
・発話者と立ち絵スプライト画像の同期
"""
import unittest
from playwright.sync_api import sync_playwright
from helpers import LocalServerManager, BASE_URL, SCREENSHOTS_DIR, clear_storage


class TestBoxDialogueAndAvatar(unittest.TestCase):
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

    def test_epilogue_loop2_avatar_sequence(self):
        """2周目エピローグ群像劇において、退場したシバタが主人公思考時に誤召喚されないこと"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # epilogueLoop2 を再生し、index 11 (ユウタ思考: 「そうだ……！ 今の彼女は...」) まで進める
        res = page.evaluate("""() => {
            const epilogue = window.app.scenario.debate.epilogueLoop2;
            window.app.playDialogueSequence(epilogue);

            // 11番目の台詞までキューを進める
            for (let i = 0; i < 10; i++) {
                window.app.dialogueQueue.shift();
            }
            window.app.showNextDialogue();

            return {
                currentCharId: window.app.character.currentCharId,
                currentSpeaker: window.app.currentSpeaker,
                currentText: window.app.currentFullText,
                activeNpcInScene: window.app.activeNpcInScene
            };
        }""")

        self.assertEqual(res["currentCharId"], "yuta", "ユウタの思考時に立ち絵がyutaになっていません (シバタが召喚されていないこと)")
        self.assertIn("そうだ……！", res["currentText"])
        self.assertFalse(res["activeNpcInScene"], "群像劇ではactiveNpcInSceneがfalseであること")
        page.screenshot(path=str(SCREENSHOTS_DIR / "test_epilogue_yuta_avatar.png"))
        page.close()

    def test_npc_dialogue_avatar_and_monologue_dimming(self):
        """一対一NPC対話において相手NPCが表示され、ユウタの心の声時に相手NPCが背景減光されること"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        # アオイとの会話をシミュレート (1行目: アオイ発言, 2行目: ユウタ心の声)
        page.evaluate("""() => {
            window.app.playDialogueSequence([
                {
                    speaker: '隣人アオイ',
                    emotion: 'panic',
                    text: '「ユウタさん……うちのアパート、何か恐ろしい事件に巻き込まれてるんですか……？」'
                },
                {
                    speaker: 'ユウタ（心の声）',
                    emotion: 'shock',
                    text: '（隣の202号室のアオイさんだ。不安そうにドアの隙間から廊下の様子を伺っている……昨夜の異変について聞いてみよう）'
                }
            ], null, true, 'aoi');
        }""")
        page.wait_for_timeout(300)

        # 1行目: アオイが表示されていること
        state_1 = page.evaluate("""() => ({
            charId: window.app.character.currentCharId,
            isDimmed: Boolean(document.querySelector('.char-sprite-img.is-dimmed'))
        })""")
        self.assertEqual(state_1["charId"], "aoi")
        self.assertFalse(state_1["isDimmed"])

        # 次のセリフへ進む (ユウタ心の声)
        page.evaluate("""() => {
            window.app.finishTyping();
            window.app.handleDialogueProceed();
        }""")
        page.wait_for_timeout(300)

        # 2行目: アオイが維持されたまま、is-dimmed および is-monologue-bg で減光されていること
        state_2 = page.evaluate("""() => ({
            charId: window.app.character.currentCharId,
            isDimmed: Boolean(document.querySelector('.char-sprite-img.is-dimmed')),
            isMonologueBg: Boolean(document.querySelector('.char-sprite-img.is-monologue-bg'))
        })""")
        self.assertEqual(state_2["charId"], "aoi", "対話相手のアオイが維持されていること")
        self.assertTrue(state_2["isDimmed"], "ユウタ思考時に相手NPCが減光されていること")
        self.assertTrue(state_2["isMonologueBg"], "モノローグ背景用スタイルが適用されていること")

        page.screenshot(path=str(SCREENSHOTS_DIR / "test_npc_monologue_dimming.png"))
        page.close()

    def test_narration_hides_character_stage(self):
        """ナレーション時に立ち絵ステージが非表示になること"""
        page = self.browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL, wait_until="networkidle")

        page.evaluate("""() => {
            window.app.playDialogueSequence([
                { speaker: 'ナレーション', text: 'シバタ捜査官は静かに拳銃を収め、部下たちを引き連れてアパートの玄関を後にした。' }
            ]);
        }""")
        page.wait_for_timeout(300)

        is_hidden = page.evaluate("""() => {
            const stage = window.app.dom.characterStage;
            return stage ? stage.classList.contains('hidden') : true;
        }""")
        self.assertTrue(is_hidden, "ナレーション時に立ち絵ステージが非表示(hidden)であること")
        page.close()


if __name__ == "__main__":
    unittest.main()
