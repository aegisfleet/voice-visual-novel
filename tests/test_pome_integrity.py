# -*- coding: utf-8 -*-
"""
ひだまりベンチ占拠事件 (pome) - 対話シーン・キャラクター演出・整合性テストスイート
----------------------------------------------------------------------------------
目的:
  - 対話シーンのeveスタイル拡張（センターキャラクター配置、バックログ、AUTO/SKIP）のDOM構造検証
  - character.js の全キャラクターSVG・表情・モーション生成の検証
  - シナリオ全セリフ（120行以上）のキャラクターコントローラーマッピング検証
  - 立証パートおよびNPC選択肢の証拠品ID整合性検証
"""

import unittest
import json
import subprocess
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
        encoding="utf-8"
    )
    if res.returncode != 0:
        raise RuntimeError(f"Node execution failed:\n{res.stderr}")
    return res.stdout.strip()


class TestPomeHtmlStructure(unittest.TestCase):
    """pome/index.html のDOM要素整合性検証"""

    @classmethod
    def setUpClass(cls):
        html_path = POME_DIR / "index.html"
        cls.html_content = html_path.read_text(encoding="utf-8")

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

    def test_two_areas_elements_present(self):
        """公園が2つのエリア（ひだまり広場、ケヤキの森）に分かれ、行き来用UIが存在すること"""
        self.assertIn('id="area-plaza"', self.html_content)
        self.assertIn('id="area-grove"', self.html_content)
        self.assertIn('id="btn-area-plaza"', self.html_content)
        self.assertIn('id="btn-area-grove"', self.html_content)
        self.assertIn('id="portal-to-grove"', self.html_content)
        self.assertIn('id="portal-to-plaza"', self.html_content)
        self.assertIn('id="spot_fountain"', self.html_content)


class TestPomeCharacterController(unittest.TestCase):
    """pome/js/character.js のSVG描画と表情マッピング検証"""

    def test_character_svg_rendering(self):
        """主要キャラクター全員のSVGが正常に生成されること"""
        code = """
        const fs = require('fs');
        const charJs = fs.readFileSync('pome/js/character.js', 'utf8');
        const win = {};
        new Function('window', charJs)(win);
        const Ctrl = win.PomeCharacterController;
        const mockStage = { innerHTML: '', classList: { remove: ()=>{}, add: ()=>{} }, querySelector: ()=>null };
        const mockBubble = { textContent: '', className: '', classList: { remove: ()=>{}, add: ()=>{} } };
        const ctrl = new Ctrl(mockStage, mockBubble);

        const expectedChars = ['pome', 'torakichi', 'caretaker', 'poppo', 'kuro', 'squirrel', 'kittens'];
        const results = {};
        expectedChars.forEach(id => {
          const html = ctrl.renderCharacterHtml(id);
          results[id] = html.includes('<svg');
        });
        console.log(JSON.stringify(results));
        """
        output = run_node(code)
        results = json.loads(output)
        for char_id, has_svg in results.items():
            self.assertTrue(has_svg, f"Character {char_id} should render valid SVG")

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
            classList: { remove: ()=>{}, add: ()=>{} }, 
            querySelector: ()=>({ style: {} }), 
            querySelectorAll: ()=>[] 
          }) 
        };
        const mockBubble = { textContent: '', className: '', classList: { remove: ()=>{}, add: ()=>{} } };
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
    """pome/js/scenario.js の立証・証拠品整合性検証"""

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

    def test_evidence_keys(self):
        """証拠品マスタに正解・囮・真実の証拠が存在すること"""
        ev = self.scenario["evidence"]
        self.assertIn("cotton_micro", ev)
        self.assertIn("caretaker_alibi", ev)
        self.assertIn("tree_nest", ev)
        self.assertIn("kitten_ribbon", ev)

    def test_debate_step_evidence_links(self):
        """立証パートの各ステップの正解証拠IDがマスタに存在すること"""
        ev = self.scenario["evidence"]
        for step in self.scenario["debate"]["steps"]:
            self.assertIn(step["correctEvidenceId"], ev)
            if "alternativeCorrectEvidenceId" in step:
                self.assertIn(step["alternativeCorrectEvidenceId"], ev)

        self.assertIn(self.scenario["debate"]["secretStep"]["correctEvidenceId"], ev)


if __name__ == "__main__":
    unittest.main()
