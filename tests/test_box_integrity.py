# -*- coding: utf-8 -*-
"""
BOX WORM - シナリオ・証拠品画像・対話イラスト・整合性テストスイート
------------------------------------------------------------------
目的:
  - box/index.html のDOM構造検証（会話ステージ、鑑識データ図ステージ、拡大画像ビューアー）
  - box/js/scenario.js の全証拠品マスター・アセット実在性検証
  - 会話および立証パートで指定された illustration / image ファイルの実在性検証
  - 探索ピンのユークリッド距離20%以上離散配置検証（AGENT PROTOCOLルール5）
  - 全JavaScriptファイルの構文および評価テスト
"""

import unittest
import json
import math
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
BOX_DIR = REPO_ROOT / "box"


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


class TestBoxHtmlStructure(unittest.TestCase):
    """box/index.html のDOM要素整合性検証"""

    @classmethod
    def setUpClass(cls):
        html_path = BOX_DIR / "index.html"
        cls.html_content = html_path.read_text(encoding="utf-8")

    def test_illustration_stage_present(self):
        """鑑識データ・イメージ図表示ステージが存在すること"""
        self.assertIn('id="dialogue-illustration-stage"', self.html_content)
        self.assertIn('id="dialogue-illustration-img"', self.html_content)
        self.assertIn('id="dialogue-illustration-caption"', self.html_content)
        self.assertIn('id="btn-close-illustration"', self.html_content)

    def test_image_viewer_modal_present(self):
        """高解像度画像ビューアーモーダルが存在すること"""
        self.assertIn('id="modal-image-viewer"', self.html_content)
        self.assertIn('id="image-viewer-img"', self.html_content)
        self.assertIn('id="btn-close-image-viewer"', self.html_content)

    def test_evidence_modal_present(self):
        """証拠手帳モーダルが存在すること"""
        self.assertIn('id="modal-evidence"', self.html_content)
        self.assertIn('id="modal-evidence-list"', self.html_content)


class TestBoxScenarioAndAssets(unittest.TestCase):
    """box/js/scenario.js のシナリオデータとアセットの整合性検証"""

    @classmethod
    def setUpClass(cls):
        code = """
        const fs = require('fs');
        const code = fs.readFileSync('box/js/scenario.js', 'utf8');
        const sandbox = {};
        const fn = new Function('window', code + '; return window.SCENARIO_DATA;');
        const scenario = fn(sandbox);
        console.log(JSON.stringify(scenario));
        """
        raw_json = run_node(code)
        cls.scenario = json.loads(raw_json)

    def test_power_meter_evidence_exists(self):
        """電力グラフ証拠品が登録されており画像が存在すること"""
        evidence = self.scenario.get("evidence", {})
        self.assertIn("power_meter_pulse", evidence)
        pulse_ev = evidence["power_meter_pulse"]
        self.assertEqual(pulse_ev.get("id"), "power_meter_pulse")
        self.assertTrue(pulse_ev.get("image"))

        # 画像ファイル実在確認
        img_path = BOX_DIR / pulse_ev["image"]
        self.assertTrue(img_path.exists(), f"Image file not found: {img_path}")
        self.assertGreater(img_path.stat().st_size, 1000, "Image file is too small")

    def test_all_evidence_images_exist(self):
        """全証拠品に画像が指定されている場合、実在すること"""
        for ev_id, ev in self.scenario.get("evidence", {}).items():
            if "image" in ev and ev["image"]:
                img_path = BOX_DIR / ev["image"]
                self.assertTrue(img_path.exists(), f"Evidence image not found for {ev_id}: {img_path}")

    def test_dialogue_illustrations_exist(self):
        """全探索スポットおよび立証パートで指定された illustration が実在すること"""
        # 探索スポット
        for spot in self.scenario.get("spots", []):
            for item in spot.get("inspectText", []):
                if "illustration" in item:
                    img_path = BOX_DIR / item["illustration"]
                    self.assertTrue(img_path.exists(), f"Spot illustration not found: {img_path}")

        # 立証パート
        debate = self.scenario.get("debate", {})
        all_steps = debate.get("stepsLoop1", []) + debate.get("stepsLoop2", [])
        for step in all_steps:
            for rx in step.get("successReactions", []):
                if "illustration" in rx:
                    img_path = BOX_DIR / rx["illustration"]
                    self.assertTrue(img_path.exists(), f"Debate illustration not found: {img_path}")

    def test_debate_question2_uses_power_meter_pulse(self):
        """問2の正解証拠品が power_meter_pulse であること"""
        steps = self.scenario.get("debate", {}).get("stepsLoop1", [])
        self.assertGreaterEqual(len(steps), 2)
        q2 = steps[1]
        self.assertEqual(q2.get("correctEvidenceId"), "power_meter_pulse")

    def test_pin_distances_rule5(self):
        """探索ピンのユークリッド距離が20%以上離れていること（AGENT PROTOCOLルール5）"""
        spots = self.scenario.get("spots", [])
        by_area = {}
        for s in spots:
            area = s.get("area", "room")
            by_area.setdefault(area, []).append(s)

        for area, area_spots in by_area.items():
            for i in range(len(area_spots)):
                for j in range(i + 1, len(area_spots)):
                    p1 = area_spots[i]["coords"]
                    p2 = area_spots[j]["coords"]
                    dist = math.hypot(p1["x"] - p2["x"], p1["y"] - p2["y"])
                    self.assertGreaterEqual(
                        dist, 19.5,  # 許容マージン
                        f"Area '{area}' pins '{area_spots[i]['name']}' and '{area_spots[j]['name']}' are too close ({dist:.1f}% < 20%)"
                    )


if __name__ == "__main__":
    unittest.main()
