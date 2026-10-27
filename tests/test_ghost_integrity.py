# -*- coding: utf-8 -*-
"""
GHOST PROTOCOL - 体験型インタラクティブノベル・全5章構成・証拠品画像・対話整合性テストスイート
---------------------------------------------------------------------------------
目的:
  - ghost/index.html のDOM構造検証（HUD、ノベル画面、タイムラインバー、選択肢パネル、小説リーダー、波形等）
  - ghost/js/scenario.js の全5章・プロローグ・エピローグ・全証拠品マスター・アセット実在性検証
  - 証拠品画像の重複ゼロ検証（SHAハッシュが全て異なること）
  - 体験型選択肢（全5章）の整合性検証
  - 会話および鑑識で指定された illustration / image ファイルの実在性検証
  - 全JavaScriptファイルの構文チェック（node -c）
"""

import hashlib
import json
import subprocess
import unittest
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
        encoding="utf-8",
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
        """主要画面（title, novel, ending）が存在すること"""
        self.assertIn('id="screen-title"', self.html_content)
        self.assertIn('id="screen-novel"', self.html_content)
        self.assertIn('id="screen-ending"', self.html_content)

    def test_chapter_timeline_and_novel_modal_present(self):
        """タイムラインバー、小説全文リーダーモーダルが存在すること"""
        self.assertIn('id="chapter-timeline-bar"', self.html_content)
        self.assertIn('id="btn-open-novel"', self.html_content)
        self.assertIn('id="modal-novel"', self.html_content)
        self.assertIn('id="modal-novel-body"', self.html_content)

    def test_interactive_choice_stage_present(self):
        """体験型選択肢ステージおよび設問が存在すること"""
        self.assertIn('id="choice-stage"', self.html_content)
        self.assertIn('id="choice-question"', self.html_content)
        self.assertIn('id="choice-options"', self.html_content)

    def test_voice_wave_indicator_present(self):
        """発話波形インジケーターが存在すること"""
        self.assertIn('id="voice-wave-indicator"', self.html_content)

    def test_dialogue_stage_present(self):
        """ノベルウィンドウおよびイラスト表示ステージが存在すること"""
        self.assertIn('id="novel-window"', self.html_content)
        self.assertIn('id="dialogue-illustration-stage"', self.html_content)
        self.assertIn('id="dialogue-illustration-img"', self.html_content)

    def test_evidence_modal_present(self):
        """鑑識ファイル手帳モーダルが存在すること"""
        self.assertIn('id="modal-evidence"', self.html_content)
        self.assertIn('id="modal-evidence-list"', self.html_content)

    def test_backlog_modal_present(self):
        """バックログモーダルが存在すること"""
        self.assertIn('id="modal-log"', self.html_content)
        self.assertIn('id="modal-log-list"', self.html_content)

    def test_line_external_notice_present(self):
        """マナーモード回避用のSafari/外部ブラウザ起動導線が存在すること"""
        self.assertIn('id="line-external-notice"', self.html_content)
        self.assertIn("openExternalBrowser=1", self.html_content)


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

    def test_prologue_and_epilogue_registered(self):
        """プロローグとエピローグが登録されていること"""
        self.assertIn("prologue", self.scenario)
        self.assertGreaterEqual(len(self.scenario["prologue"].get("dialogue", [])), 5)
        self.assertIn("epilogue", self.scenario)
        self.assertGreaterEqual(len(self.scenario["epilogue"].get("dialogue", [])), 5)

    def test_five_chapters_registered(self):
        """全5章の体験型ノベルシナリオが登録され、各章に導入・選択肢ステップ・解決パートが存在すること"""
        chapters = self.scenario.get("chapters", [])
        self.assertEqual(len(chapters), 5)
        for idx, ch in enumerate(chapters, start=1):
            self.assertEqual(ch.get("id"), idx)
            self.assertTrue(ch.get("title"))
            self.assertTrue(ch.get("date"))
            self.assertGreaterEqual(len(ch.get("introDialogue", [])), 3)
            # choiceSteps配列またはchoiceプロパティが存在すること
            choice_steps = ch.get("choiceSteps") or ([ch.get("choice")] if ch.get("choice") else [])
            self.assertGreaterEqual(len(choice_steps), 1)
            for step in choice_steps:
                self.assertGreaterEqual(len(step.get("options", [])), 2)
            self.assertGreaterEqual(len(ch.get("resolution", [])), 2)

    def test_tactic_choices_and_final_deduction_registered(self):
        """全5章に選択肢ステップ（作戦判断または鑑識）があり、Chapter 5に最終証拠連結フェーズが存在すること"""
        chapters = self.scenario.get("chapters", [])
        for ch in chapters:
            choice_steps = ch.get("choiceSteps") or []
            self.assertGreaterEqual(len(choice_steps), 1)
            has_correct = any(
                any(opt.get("isCorrect") for opt in step.get("options", []))
                for step in choice_steps
            )
            self.assertTrue(has_correct, f"Chapter {ch.get('id')} has no step with correct option")

        ch5 = chapters[4]
        self.assertIn("finalDeduction", ch5)
        steps = ch5["finalDeduction"].get("steps", [])
        self.assertGreaterEqual(len(steps), 3)
        for step in steps:
            self.assertTrue(step.get("question"))
            self.assertTrue(step.get("correctEvidenceId"))
            self.assertTrue(step.get("hint"))
            self.assertGreaterEqual(len(step.get("reaction", [])), 1)

    def test_all_evidence_registered(self):
        """現実の事件構造に基づく6件の核心フォレンジック証拠品が登録されていること"""
        evidence = self.scenario.get("evidence", {})
        self.assertEqual(len(evidence), 6)
        expected_ids = [
            "ad_demofastloss_log",
            "persistent_session_trap",
            "reverse_rdp_tsclient",
            "direct_compensation_matrix",
            "nco_three_walls_report",
            "canary_c2_origin",
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
        """証拠品画像にハッシュ重複が存在しないこと"""
        evidence = self.scenario.get("evidence", {})
        hashes = {}
        for ev_id, ev in evidence.items():
            img_path = GHOST_DIR / ev["image"]
            sha = hashlib.sha256(img_path.read_bytes()).hexdigest()
            self.assertNotIn(
                sha,
                hashes,
                f"Duplicate image hash detected between '{ev_id}' and '{hashes.get(sha)}'",
            )
            hashes[sha] = ev_id

    def test_dialogue_illustrations_exist(self):
        """会話および解決パートで指定された illustration が実在すること"""
        chapters = self.scenario.get("chapters", [])
        for ch in chapters:
            for line in ch.get("resolution", []):
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
            res = subprocess.run(["node", "-c", str(js_file)], capture_output=True, text=True)
            self.assertEqual(
                res.returncode, 0, f"Syntax error in {js_file.name}:\n{res.stderr}"
            )


class TestGhostGlossaryDecoration(unittest.TestCase):
    """用語解説ポップオーバー用マークアップ（decorateGlossaryTerms）のタグ破壊防止検証"""

    def test_glossary_decoration_no_tag_destruction(self):
        """FT4/FT5 と FT4 等の部分一致・多重置換でタグが破壊されないこと"""
        js_code = """
        const fs = require('fs');
        const code = fs.readFileSync('ghost/js/app.js', 'utf-8');
        // Extract TERM_GLOSSARY and decorateGlossaryTerms
        const vm = require('vm');
        const sandbox = {
          window: { addEventListener: () => {} },
          console,
          AudioManager: class {},
          document: { addEventListener: () => {} }
        };
        vm.createContext(sandbox);
        vm.runInContext(code + '; this.NovelApp = NovelApp;', sandbox);
        const testText = '判明しました！ FT4/FT5はWeb上でパスワードを変更しても、FT4単体やAD（Active Directory）でも安全です。';
        const result = sandbox.NovelApp.prototype.decorateGlossaryTerms(testText);
        console.log(JSON.stringify({ result }));
        """
        output = run_node(js_code)
        data = json.loads(output)
        res_text = data["result"]
        # タグ属性破壊（属性値にタグがネストされるなど）が一切ないこと
        self.assertNotIn('data-term="<span', res_text)
        self.assertNotIn('</span>/FT5', res_text)
        self.assertNotIn('</span>/FT5">', res_text)
        # spanタグの開閉数が完全に一致すること
        self.assertEqual(res_text.count('<span '), 3)
        self.assertEqual(res_text.count('</span>'), 3)
        # 期待される正しいタグが含まれていること
        self.assertIn('<span class="term-tip" data-term="FT4/FT5">FT4/FT5</span>', res_text)
        self.assertIn('<span class="term-tip" data-term="FT4">FT4</span>', res_text)
        self.assertIn(
            '<span class="term-tip" data-term="AD（Active Directory）">AD（Active Directory）</span>',
            res_text,
        )


if __name__ == "__main__":
    unittest.main()
