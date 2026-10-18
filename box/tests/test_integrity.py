# -*- coding: utf-8 -*-
"""
box/tests/test_integrity.py - BOX WORM 静的整合性テストスイート
------------------------------------------------------------------
・box/index.html のDOM構造整合性（会話ステージ、画像ビューアー、証拠手帳、LINE外部誘導）
・box/js/audio.js の単一Audio再利用・同期直接再生パイプライン検証
・box/js/scenario.js の全証拠品マスター・アセット実在性検証
・探索ピンのユークリッド距離20%以上離散配置検証（AGENT PROTOCOLルール5）
"""
import unittest
import math
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
BOX_DIR = REPO_ROOT / "box"


def run_node(code: str) -> str:
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

    def test_line_notice_present(self):
        """LINE等アプリ内ブラウザ用外部ブラウザ起動導線が存在すること"""
        self.assertIn('id="line-external-notice"', self.html_content)
        self.assertIn('id="btn-line-external-open"', self.html_content)
        self.assertIn('openExternalBrowser=1', self.html_content)


class TestBoxAudioPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        audio_path = BOX_DIR / "js" / "audio.js"
        cls.audio_content = audio_path.read_text(encoding="utf-8")

    def test_audio_reuses_single_element(self):
        """LINE内ブラウザ/iOS Safari用に単一Audio要素(this.voiceAudio)が用意されていること"""
        self.assertIn("this.voiceAudio", self.audio_content)
        self.assertIn("this.executeDirectVoicePlay", self.audio_content)

    def test_no_create_media_element_source(self):
        """WebKitの無音化バグを引き起こすcreateMediaElementSourceが使用されていないこと"""
        self.assertNotIn("createMediaElementSource", self.audio_content)

    def test_sync_play_voice_file(self):
        """playVoiceFileが非同期待機を行わず同期的にAudioを再生すること"""
        self.assertNotIn("decodeAudioData", self.audio_content)


class TestBoxScenarioAndAssets(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        code = """
        const fs = require('fs');
        const code = fs.readFileSync('box/js/scenario.js', 'utf8');
        const sandbox = {};
        const fn = new Function('window', code + '; return window.SCENARIO_DATA;');
        const data = fn(sandbox);
        console.log(JSON.stringify({
            spots: data.spots,
            evidence: data.evidence,
            npcs: data.npcs,
            debateStepsL1: data.debate.stepsLoop1,
            debateStepsL2: data.debate.stepsLoop2
        }));
        """
        import json
        raw = run_node(code)
        cls.data = json.loads(raw)

    def test_evidence_assets_exist(self):
        """全証拠品画像・ダイアグラムが実在すること"""
        for ev_id, ev in self.data["evidence"].items():
            img_path = BOX_DIR / ev["image"]
            self.assertTrue(img_path.exists(), f"証拠品画像が見つかりません: {img_path} (ID: {ev_id})")

    def test_spot_coordinates_separated_by_20_percent(self):
        """同一エリア内の探索ピンがユークリッド距離20%以上離れていること (AGENT PROTOCOLルール5)"""
        spots_by_area = {}
        for s in self.data["spots"]:
            spots_by_area.setdefault(s["area"], []).append(s)

        for area, spots in spots_by_area.items():
            for i in range(len(spots)):
                for j in range(i + 1, len(spots)):
                    p1, p2 = spots[i]["coords"], spots[j]["coords"]
                    dist = math.sqrt((p1["x"] - p2["x"])**2 + (p1["y"] - p2["y"])**2)
                    self.assertGreaterEqual(
                        dist, 20.0,
                        f"エリア '{area}' のピン '{spots[i]['name']}' と '{spots[j]['name']}' の距離が近すぎます ({dist:.1f}% < 20%)"
                    )


if __name__ == "__main__":
    unittest.main()
