# -*- coding: utf-8 -*-
"""
ひだまりベンチ占拠事件 (pome) - 1周完結シナリオ・SVGアニメーション・整合性テストスイート
----------------------------------------------------------------------------------
目的:
  - 主人公「パム」（オレンジセーブル＋黒マズル）のSVG造形およびシナリオ整合性検証
  - 対話シーンのセンターキャラクター配置、バックログ、AUTO/SKIP、立証ヒントUIのDOM構造検証
  - character.js の全9キャラクターSVG・表情・SVGパーツアニメーションクラスの検証
  - シナリオ全セリフのキャラクターコントローラーマッピング検証
  - 1周完結（全4問：表の事件解決＋裏の真実サプライズ解明）の進行・証拠ヒント整合性検証
"""

import json
import subprocess
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
POME_DIR = REPO_ROOT / "pome"


def run_node(code: str) -> str:
    """Node.jsスクリプトを実行して標準出力を取得"""
    res = subprocess.run(
        ["node", "-e", code],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
        encoding="utf-8",
    )
    if res.returncode != 0:
        raise RuntimeError(f"Node execution failed:\n{res.stderr}")
    return res.stdout.strip()


class TestPomeHtmlStructure(unittest.TestCase):
    """pome/index.html および style.css のDOM要素・品質規約整合性検証"""

    @classmethod
    def setUpClass(cls):
        html_path = POME_DIR / "index.html"
        css_path = POME_DIR / "css" / "style.css"
        cls.html_content = html_path.read_text(encoding="utf-8")
        cls.css_content = css_path.read_text(encoding="utf-8")

    def test_dialogue_stage_elements_present(self):
        """会話ステージおよびセンターキャラクター要素が存在すること"""
        self.assertIn('id="dialogue-backdrop"', self.html_content)
        self.assertIn('id="dialogue-stage"', self.html_content)
        self.assertIn('id="character-stage"', self.html_content)
        self.assertIn('id="emotion-bubble"', self.html_content)

    def test_novel_controls_elements_present(self):
        """会話コントロール（AUTO, SKIP, LOG）および話者アイコンが存在すること"""
        self.assertIn('id="btn-dialogue-auto"', self.html_content)
        self.assertIn('id="btn-dialogue-skip"', self.html_content)
        self.assertIn('id="btn-dialogue-log"', self.html_content)
        self.assertIn('id="dialogue-speaker-icon"', self.html_content)

    def test_modal_backlog_present(self):
        """会話バックログモーダル要素が存在すること"""
        self.assertIn('id="modal-backlog"', self.html_content)
        self.assertIn('id="modal-backlog-list"', self.html_content)
        self.assertIn('id="btn-close-backlog"', self.html_content)

    def test_character_script_included(self):
        """character.js が正しく読み込まれていること"""
        self.assertIn('<script src="js/character.js"></script>', self.html_content)

    def test_two_areas_and_beginner_ui_present(self):
        """2エリア探索UIおよび初心者向けヒント・探索復帰ボタンが存在すること"""
        self.assertIn('id="area-plaza"', self.html_content)
        self.assertIn('id="area-grove"', self.html_content)
        self.assertIn('id="btn-area-plaza"', self.html_content)
        self.assertIn('id="btn-area-grove"', self.html_content)
        self.assertIn('id="portal-to-grove"', self.html_content)
        self.assertIn('id="portal-to-plaza"', self.html_content)
        self.assertIn('id="spot_fountain"', self.html_content)
        self.assertIn('id="spot_secret_bush"', self.html_content)
        self.assertIn('id="debate-selected-hint"', self.html_content)
        self.assertIn('id="btn-back-to-explore"', self.html_content)

    def test_css_svg_animation_and_no_important(self):
        """style.css にSVGパーツアニメーションが定義され、!important や非推奨構文が含まれないこと"""
        self.assertNotIn("!important", self.css_content)
        self.assertNotIn("word-break: break-word", self.css_content)
        self.assertIn("@keyframes svg-tail-wag", self.css_content)
        self.assertIn("@keyframes svg-tail-tip-whip", self.css_content)
        self.assertIn("@keyframes svg-chest-breathe", self.css_content)
        self.assertIn("@keyframes svg-eye-blink", self.css_content)
        self.assertIn("@keyframes svg-eye-shimmer", self.css_content)
        self.assertIn("@keyframes svg-nose-sniff", self.css_content)
        self.assertIn("@keyframes svg-lip-sync", self.css_content)
        self.assertIn("@keyframes walker-leg-swing-a", self.css_content)
        self.assertIn("@keyframes walker-leg-swing-b", self.css_content)
        self.assertIn("walker-leg-a", self.html_content)
        self.assertIn("walker-leg-b", self.html_content)


class TestPomeCharacterController(unittest.TestCase):
    """pome/js/character.js の全SVG描画・パム造形・アニメーション構造検証"""

    def test_character_svg_rendering(self):
        """全9キャラクターのSVGおよびパムの黒マズル・高精細グラデーション・アニメーションパーツが正常に生成されること"""
        code = """
        const fs = require('fs');
        const charJs = fs.readFileSync('pome/js/character.js', 'utf8');
        const win = {};
        new Function('window', charJs)(win);
        const Ctrl = win.PomeCharacterController;
        const mockStage = { innerHTML: '', classList: { remove: ()=>{}, add: ()=>{} }, querySelector: ()=>null };
        const mockBubble = { innerHTML: '', textContent: '', className: '', classList: { remove: ()=>{}, add: ()=>{} } };
        const ctrl = new Ctrl(mockStage, mockBubble);

        const expectedChars = ['pome', 'torakichi', 'caretaker', 'poppo', 'kuro', 'squirrel', 'mike', 'kittens', 'owner'];
        const results = {};
        expectedChars.forEach(id => {
          const html = ctrl.renderCharacterHtml(id);
          results[id] = {
            hasSvg: html.includes('<svg'),
            hasDefs: html.includes('<defs>'),
            hasHead: html.includes('svg-head'),
            hasMouth: html.includes('svg-mouth')
          };
        });
        const pamHtml = ctrl.renderCharacterHtml('pome');
        results.pamFeatures = {
          hasBlackMuzzle: pamHtml.includes('pam-black-muzzle'),
          hasTail: pamHtml.includes('svg-tail') && pamHtml.includes('svg-tail-tip'),
          hasChestFluff: pamHtml.includes('svg-chest-fluff'),
          hasNose: pamHtml.includes('svg-nose'),
          hasEars: pamHtml.includes('svg-ear-l') && pamHtml.includes('svg-ear-r'),
          hasBlink: pamHtml.includes('svg-eyes-blink') && pamHtml.includes('svg-eye-shine')
        };
        console.log(JSON.stringify(results));
        """
        output = run_node(code)
        results = json.loads(output)
        for char_id in ["pome", "torakichi", "caretaker", "poppo", "kuro", "squirrel", "mike", "kittens", "owner"]:
            self.assertTrue(results[char_id]["hasSvg"], f"Character {char_id} should render valid SVG")
            self.assertTrue(results[char_id]["hasDefs"], f"Character {char_id} should include SVG gradient defs")
            self.assertTrue(results[char_id]["hasHead"], f"Character {char_id} should have svg-head group")
            self.assertTrue(results[char_id]["hasMouth"], f"Character {char_id} should have svg-mouth group")

        self.assertTrue(results["pamFeatures"]["hasBlackMuzzle"])
        self.assertTrue(results["pamFeatures"]["hasTail"])
        self.assertTrue(results["pamFeatures"]["hasChestFluff"])
        self.assertTrue(results["pamFeatures"]["hasNose"])
        self.assertTrue(results["pamFeatures"]["hasEars"])
        self.assertTrue(results["pamFeatures"]["hasBlink"])

    def test_all_scenario_dialogues_coverage(self):
        """シナリオ全行が例外なくキャラクターおよび表情へマッピングされること"""
        code = """
        const fs = require('fs');
        const charJs = fs.readFileSync('pome/js/character.js', 'utf8');
        const scenJs = fs.readFileSync('pome/js/scenario.js', 'utf8');
        const win = {};
        new Function('window', charJs + '; ' + scenJs)(win);
        const Ctrl = win.PomeCharacterController;
        const scenario = win.SCENARIO_DATA;

        const mockStage = {
          innerHTML: '',
          classList: { remove: ()=>{}, add: ()=>{} },
          querySelector: ()=>({
            style: {},
            dataset: {},
            classList: { remove: ()=>{}, add: ()=>{} },
            querySelector: ()=>({ style: {} }),
            querySelectorAll: ()=>[]
          })
        };
        const mockBubble = { innerHTML: '', textContent: '', className: '', classList: { remove: ()=>{}, add: ()=>{} } };
        const ctrl = new Ctrl(mockStage, mockBubble);

        let count = 0;
        function testQueue(list) {
          list.forEach(d => {
            ctrl.showForDialogue(d);
            count++;
          });
        }

        testQueue(scenario.prologue);
        scenario.spots.forEach(s => testQueue(s.inspectText));
        scenario.npcs.forEach(n => {
          testQueue(n.dialogue.intro);
          n.dialogue.choices.forEach(c => testQueue(c.responses));
        });
        testQueue(scenario.debate.intro);
        scenario.debate.steps.forEach(st => {
          testQueue(st.successReactions);
          testQueue(st.failureReactions);
        });
        Object.values(scenario.endings).forEach(list => testQueue(list));

        console.log(JSON.stringify({ total: count }));
        """
        output = run_node(code)
        data = json.loads(output)
        self.assertGreater(data["total"], 100, "Scenario should contain over 100 dialogue lines")


class TestPomeScenarioIntegrity(unittest.TestCase):
    """pome/js/scenario.js および state.js の1周完結・全4問構成・ヒント整合性検証"""

    @classmethod
    def setUpClass(cls):
        code = """
        const fs = require('fs');
        const scenJs = fs.readFileSync('pome/js/scenario.js', 'utf8');
        const stateJs = fs.readFileSync('pome/js/state.js', 'utf8');
        const win = {};
        const mockStorage = { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} };
        new Function('window', 'localStorage', scenJs + '; ' + stateJs)(win, mockStorage);
        const st = win.gameState;
        const readyInitially = st.isReadyForDebate();
        st.addEvidence('cotton_micro');
        st.addEvidence('caretaker_alibi');
        st.addEvidence('tree_nest');
        const readyWithThree = st.isReadyForDebate();
        st.addEvidence('kitten_ribbon');
        const readyWithAllFour = st.isReadyForDebate();
        console.log(JSON.stringify({
          scenario: win.SCENARIO_DATA,
          readyInitially,
          readyWithThree,
          readyWithAllFour
        }));
        """
        data = json.loads(run_node(code))
        cls.scenario = data["scenario"]
        cls.state_checks = data

    def test_evidence_keys_and_hints(self):
        """全10種の証拠品が保持され、すべてに初心者向け hintText が存在すること"""
        ev = self.scenario["evidence"]
        expected_ids = [
            "cotton_micro",
            "dog_bone",
            "flower_footprint",
            "flower_big_hole",
            "caretaker_alibi",
            "tree_nest",
            "poppo_eyewitness",
            "tennis_ball",
            "fish_bone",
            "kitten_ribbon",
        ]
        for eid in expected_ids:
            self.assertIn(eid, ev)
            self.assertTrue(ev[eid].get("hintText"), f"Evidence {eid} must have beginner-friendly hintText")

    def test_protagonist_named_pam(self):
        """プロローグおよびシナリオ内で主人公が「パム」として登場すること"""
        prologue_speakers = [line["speaker"] for line in self.scenario["prologue"]]
        self.assertIn("パム（心の声）", prologue_speakers)

    def test_single_playthrough_four_debate_steps(self):
        """1周完結の全4問構成（表の解決1〜3＋裏の真実解明4）が定義され、証拠リンクが正しいこと"""
        ev = self.scenario["evidence"]
        steps = self.scenario["debate"]["steps"]
        self.assertEqual(len(steps), 4, "Debate should have 4 steps in a single playthrough")
        for step in steps:
            self.assertIn(step["correctEvidenceId"], ev)
            self.assertTrue(step.get("retryGuide"))
            if "alternativeCorrectEvidenceId" in step:
                self.assertIn(step["alternativeCorrectEvidenceId"], ev)

        self.assertEqual(steps[3]["correctEvidenceId"], "kitten_ribbon")
        self.assertFalse(self.state_checks["readyInitially"])
        self.assertFalse(self.state_checks["readyWithThree"])
        self.assertTrue(self.state_checks["readyWithAllFour"])


if __name__ == "__main__":
    unittest.main()
