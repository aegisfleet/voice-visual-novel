# -*- coding: utf-8 -*-
"""
ひだまりベンチ占拠事件 (pome) - 対話シーン・キャラクターSVGアニメーション・整合性テストスイート
----------------------------------------------------------------------------------
目的:
  - 主人公「パム」（オレンジセーブル＋黒マズル）のSVG造形およびシナリオ整合性検証
  - 対話シーンのセンターキャラクター配置、バックログ、AUTO/SKIP、立証ヒントUIのDOM構造検証
  - character.js の全9キャラクターSVG・表情・SVGパーツアニメーションクラスの検証
  - シナリオ全セリフのキャラクターコントローラーマッピング検証
  - 立証パートおよび全証拠品（囮証拠含む）のヒント（hintText）整合性検証
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
        self.assertIn('id="debate-selected-hint"', self.html_content)
        self.assertIn('id="btn-back-to-explore"', self.html_content)

    def test_css_svg_animation_and_no_important(self):
        """style.css にSVGパーツアニメーションが定義され、!important が含まれないこと"""
        self.assertNotIn("!important", self.css_content)
        self.assertIn("@keyframes svg-tail-wag", self.css_content)
        self.assertIn("@keyframes svg-eye-blink", self.css_content)
        self.assertIn("@keyframes svg-lip-sync", self.css_content)


class TestPomeCharacterController(unittest.TestCase):
    """pome/js/character.js の全SVG描画・パム造形・アニメーション構造検証"""

    def test_character_svg_rendering(self):
        """全9キャラクターのSVGおよびパムの黒マズル・アニメーションパーツが正常に生成されること"""
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
            hasHead: html.includes('svg-head'),
            hasMouth: html.includes('svg-mouth')
          };
        });
        const pamHtml = ctrl.renderCharacterHtml('pome');
        results.pamFeatures = {
          hasBlackMuzzle: pamHtml.includes('pam-black-muzzle'),
          hasTail: pamHtml.includes('svg-tail'),
          hasEars: pamHtml.includes('svg-ear-l') && pamHtml.includes('svg-ear-r'),
          hasBlink: pamHtml.includes('svg-eyes-blink')
        };
        console.log(JSON.stringify(results));
        """
        output = run_node(code)
        results = json.loads(output)
        for char_id in ["pome", "torakichi", "caretaker", "poppo", "kuro", "squirrel", "mike", "kittens", "owner"]:
            self.assertTrue(results[char_id]["hasSvg"], f"Character {char_id} should render valid SVG")
            self.assertTrue(results[char_id]["hasHead"], f"Character {char_id} should have svg-head group")
            self.assertTrue(results[char_id]["hasMouth"], f"Character {char_id} should have svg-mouth group")

        self.assertTrue(results["pamFeatures"]["hasBlackMuzzle"])
        self.assertTrue(results["pamFeatures"]["hasTail"])
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
        testQueue(scenario.debate.secretStep.successReactions);
        Object.values(scenario.endings).forEach(list => testQueue(list));

        console.log(JSON.stringify({ total: count }));
        """
        output = run_node(code)
        data = json.loads(output)
        self.assertGreater(data["total"], 100, "Scenario should contain over 100 dialogue lines")


class TestPomeScenarioIntegrity(unittest.TestCase):
    """pome/js/scenario.js の主人公パム呼称・立証・全証拠品ヒント整合性検証"""

    @classmethod
    def setUpClass(cls):
        code = """
        const fs = require('fs');
        const scenJs = fs.readFileSync('pome/js/scenario.js', 'utf8');
        const win = {};
        new Function('window', scenJs)(win);
        console.log(JSON.stringify(win.SCENARIO_DATA));
        """
        cls.scenario = json.loads(run_node(code))

    def test_evidence_keys_and_hints(self):
        """全10種の証拠品（正解・囮・真実）が保持され、すべてに初心者向け hintText が存在すること"""
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

    def test_debate_step_evidence_links(self):
        """立証パートの各ステップの正解証拠IDおよびリトライガイドが存在すること"""
        ev = self.scenario["evidence"]
        for step in self.scenario["debate"]["steps"]:
            self.assertIn(step["correctEvidenceId"], ev)
            self.assertTrue(step.get("retryGuide"))
            if "alternativeCorrectEvidenceId" in step:
                self.assertIn(step["alternativeCorrectEvidenceId"], ev)

        self.assertIn(self.scenario["debate"]["secretStep"]["correctEvidenceId"], ev)


if __name__ == "__main__":
    unittest.main()
