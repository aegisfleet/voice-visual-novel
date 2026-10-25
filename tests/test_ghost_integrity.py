# -*- coding: utf-8 -*-
"""
GHOST PROTOCOL - シナリオ・証拠品画像・対話イラスト・ピン座標・整合性テストスイート
---------------------------------------------------------------------------------
目的:
  - ghost/index.html のDOM構造検証（波形インジケーター、エリア切替、立証画面、証拠モーダル等）
  - ghost/js/scenario.js の全証拠品マスター・アセット実在性検証
  - 証拠品画像の重複ゼロ検証（SHAハッシュが全て異なること）
  - 立証パート全4問の決定打証拠品整合性検証（詰み防止）
  - 探索ピンのユークリッド距離20%以上離散配置検証（AGENT PROTOCOLルール5）
  - 会話および立証パートで指定された illustration / image ファイルの実在性検証
  - 全JavaScriptファイルの構文チェック（node -c）
"""

import unittest
import json
import math
import hashlib
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
GHOST_DIR = REPO_ROOT / "ghost"


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


class TestGhostHtmlStructure(unittest.TestCase):
    """ghost/index.html のDOM要素整合性検証"""

    @classmethod
    def setUpClass(cls):
        html_path = GHOST_DIR / "index.html"
        cls.html_content = html_path.read_text(encoding="utf-8")

    def test_screens_present(self):
        """主要画面（title, explore, debate, ending）が存在すること"""
        self.assertIn('id="screen-title"', self.html_content)
        self.assertIn('id="screen-explore"', self.html_content)
        self.assertIn('id="screen-debate"', self.html_content)
        self.assertIn('id="screen-ending"', self.html_content)

    def test_voice_wave_indicator_present(self):
        """発話波形インジケーターが存在すること"""
        self.assertIn('id="voice-wave-indicator"', self.html_content)

    def test_area_buttons_present(self):
        """探索エリア切替ボタンが存在すること"""
        self.assertIn('id="btn-area-desk"', self.html_content)
        self.assertIn('id="btn-area-living"', self.html_content)

    def test_dialogue_stage_present(self):
        """会話ステージおよびイラスト表示ステージが存在すること"""
        self.assertIn('id="dialogue-stage"', self.html_content)
        self.assertIn('id="dialogue-illustration-stage"', self.html_content)
        self.assertIn('id="dialogue-illustration-img"', self.html_content)

    def test_evidence_modal_present(self):
        """証拠手帳モーダルが存在すること"""
        self.assertIn('id="modal-evidence"', self.html_content)
        self.assertIn('id="modal-evidence-list"', self.html_content)

    def test_line_external_notice_present(self):
        """マナーモード回避用のSafari/外部ブラウザ起動導線が存在すること"""
        self.assertIn('id="line-external-notice"', self.html_content)
        self.assertIn('openExternalBrowser=1', self.html_content)


class TestGhostAudioPipeline(unittest.TestCase):
    """ghost/js/audio.js の効果音MP3連携・フォールバック・ガード検証"""

    @classmethod
    def setUpClass(cls):
        audio_path = GHOST_DIR / "js" / "audio.js"
        cls.audio_content = audio_path.read_text(encoding="utf-8")

    def test_se_tracks_defined(self):
        """効果音MP3トラックマップが定義されていること"""
        self.assertIn("this.seTracks", self.audio_content)
        self.assertIn("sfx_cutin.mp3", self.audio_content)
        self.assertIn("sfx_evidence.mp3", self.audio_content)

    def test_early_unlock_present(self):
        """ボイス専用Audio要素の先行アンロック処理が存在すること"""
        self.assertIn("this.voiceAudio", self.audio_content)
        self.assertIn("isVoiceAudioUnlocked", self.audio_content)

    def test_skip_mode_guard_present(self):
        """SKIPモード中に音声読み上げを抑止するガードが存在すること"""
        self.assertIn("isSkipActive", self.audio_content)


class TestGhostScenarioAndAssets(unittest.TestCase):
    """ghost/js/scenario.js のシナリオデータとアセットの整合性検証"""

    @classmethod
    def setUpClass(cls):
        code = """
        const fs = require('fs');
        const code = fs.readFileSync('ghost/js/scenario.js', 'utf8');
        const sandbox = {};
        const fn = new Function('window', code + '; return window.SCENARIO_DATA;');
        const scenario = fn(sandbox);
        console.log(JSON.stringify(scenario));
        """
        raw_json = run_node(code)
        cls.scenario = json.loads(raw_json)

    def test_all_evidence_registered(self):
        """6件の証拠品（決定打4件＋状況把握データ2件）が登録されていること"""
        evidence = self.scenario.get("evidence", {})
        self.assertEqual(len(evidence), 6)
        expected_ids = [
            "sinkhole_route",
            "honeypot_log",
            "active_memory_ren",
            "nco_envelope_alert",
            "hospital_icu_status",
            "c2_target_ip",
        ]
        for ev_id in expected_ids:
            self.assertIn(ev_id, evidence)
            self.assertEqual(evidence[ev_id].get("id"), ev_id)

    def test_all_evidence_images_exist(self):
        """全証拠品の画像ファイルが実在し、一定サイズ以上であること"""
        evidence = self.scenario.get("evidence", {})
        for ev_id, ev in evidence.items():
            img_rel = ev.get("image")
            self.assertTrue(img_rel, f"Evidence '{ev_id}' missing image property")
            img_path = GHOST_DIR / img_rel
            self.assertTrue(img_path.exists(), f"Image file not found: {img_path}")
            self.assertGreater(img_path.stat().st_size, 1000, f"Image file too small: {img_path}")

    def test_evidence_images_no_duplicates(self):
        """証拠品画像にハッシュ重複が存在しないこと（課題6検証）"""
        evidence = self.scenario.get("evidence", {})
        hashes = {}
        for ev_id, ev in evidence.items():
            img_path = GHOST_DIR / ev["image"]
            sha = hashlib.sha256(img_path.read_bytes()).hexdigest()
            self.assertNotIn(
                sha,
                hashes,
                f"Duplicate image hash detected between '{ev_id}' and '{hashes.get(sha)}'"
            )
            hashes[sha] = ev_id

    def test_debate_four_questions_critical_evidence(self):
        """立証全4問の正解証拠品が決定打4点に合致していること（詰み防止）"""
        debates = self.scenario.get("debates", [])
        self.assertEqual(len(debates), 4, "debates must have exactly 4 questions")

        expected_correct = [
            "sinkhole_route",
            "honeypot_log",
            "active_memory_ren",
            "c2_target_ip",
        ]
        for idx, (expected_id, debate) in enumerate(zip(expected_correct, debates)):
            actual_id = debate.get("correctEvidenceId")
            self.assertEqual(
                actual_id,
                expected_id,
                f"Question {idx + 1} expected '{expected_id}', got '{actual_id}'"
            )

    def test_pin_distances_rule5(self):
        """探索ピンのユークリッド距離が20%以上離れていること（AGENT PROTOCOLルール5）"""
        explore_spots = self.scenario.get("exploreSpots", {})
        for area, spots in explore_spots.items():
            self.assertGreaterEqual(len(spots), 2, f"Area '{area}' has too few spots")
            for i in range(len(spots)):
                for j in range(i + 1, len(spots)):
                    p1 = spots[i]["coords"]
                    p2 = spots[j]["coords"]
                    dist = math.hypot(p1["x"] - p2["x"], p1["y"] - p2["y"])
                    self.assertGreaterEqual(
                        dist,
                        19.5,
                        f"Area '{area}' pins '{spots[i]['name']}' and '{spots[j]['name']}' are too close ({dist:.1f}% < 20%)"
                    )

    def test_dialogue_illustrations_exist(self):
        """探索スポットおよび会話で指定された illustration が実在すること"""
        explore_spots = self.scenario.get("exploreSpots", {})
        for area, spots in explore_spots.items():
            for spot in spots:
                for line in spot.get("dialogue", []):
                    if "illustration" in line:
                        img_path = GHOST_DIR / line["illustration"]
                        self.assertTrue(img_path.exists(), f"Illustration not found: {img_path}")


class TestGhostJsSyntax(unittest.TestCase):
    """ghost/js/ 配下のJavaScript構文チェック (node -c)"""

    def test_js_syntax_all(self):
        js_dir = GHOST_DIR / "js"
        js_files = list(js_dir.glob("*.js"))
        self.assertGreaterEqual(len(js_files), 5)
        for js_file in js_files:
            res = subprocess.run(
                ["node", "-c", str(js_file)],
                capture_output=True,
                text=True
            )
            self.assertEqual(
                res.returncode,
                0,
                f"Syntax error in {js_file.name}:\n{res.stderr}"
            )


if __name__ == "__main__":
    unittest.main()
