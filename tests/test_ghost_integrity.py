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
from xml.etree import ElementTree

REPO_ROOT = Path(__file__).resolve().parent.parent
GHOST_DIR = REPO_ROOT / "ghost"
BASE_URL = "https://aegisfleet.github.io/voice-visual-novel"


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

    def test_post_clear_extras_and_audio_settings_are_separated(self):
        """小説・資料アーカイブをクリア後特典にし、音響設定を開始前から利用できること"""
        extras_start = self.html_content.index('id="title-extras"')
        extras_end = self.html_content.index("</section>", extras_start)
        settings_position = self.html_content.index('id="btn-title-settings"')
        self.assertIn('id="title-extras-locked"', self.html_content)
        self.assertIn('id="btn-open-novel"', self.html_content[extras_start:extras_end])
        self.assertIn('id="btn-open-gallery"', self.html_content[extras_start:extras_end])
        self.assertNotIn('id="btn-title-settings"', self.html_content[extras_start:extras_end])

    def test_line_external_notice_present(self):
        """マナーモード回避用のSafari/外部ブラウザ起動導線が存在すること"""
        self.assertIn('id="line-external-notice"', self.html_content)
        self.assertIn("openExternalBrowser=1", self.html_content)

    def test_portal_navigation_is_available_from_title_and_ending(self):
        """全作品でタイトル画面、エンディング画面からポータルへ戻れること"""
        title_start = self.html_content.index('id="screen-title"')
        title_end = self.html_content.index('id="screen-novel"')
        ending_start = self.html_content.index('id="screen-ending"')
        ending_end = self.html_content.index('id="overlay-cutin"')
        self.assertIn('href="../index.html" id="portal-link-title"', self.html_content[title_start:title_end])
        self.assertIn('href="../index.html" id="portal-link-ending"', self.html_content[ending_start:ending_end])

        eve_html = (REPO_ROOT / "eve" / "index.html").read_text(encoding="utf-8")
        box_html = (REPO_ROOT / "box" / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="portalLink" href="../"', eve_html)
        self.assertIn('href="../index.html" class="portal-link-btn"', box_html)
        self.assertIn('href="../index.html" class="btn-subtle btn-link-plate"', box_html)

    def test_title_and_ending_have_social_share_and_copy_actions(self):
        """タイトルとエンディングの共有・URLコピー操作が共通スクリプトへ接続されていること"""
        title_start = self.html_content.index('id="screen-title"')
        title_end = self.html_content.index('id="screen-novel"')
        ending_start = self.html_content.index('id="screen-ending"')
        ending_end = self.html_content.index('id="overlay-cutin"')
        title = self.html_content[title_start:title_end]
        ending = self.html_content[ending_start:ending_end]

        self.assertIn('class="title-nav-bar"', title)
        self.assertIn('data-share-action="x"', title)
        self.assertIn('data-share-action="copy"', title)
        self.assertIn('class="ending-share-bar"', ending)
        self.assertIn('data-share-action="x"', ending)
        self.assertIn('data-share-action="copy"', ending)
        self.assertIn('../assets/js/share.js', self.html_content)


class TestGhostPublishingMetadata(unittest.TestCase):
    """GHOSTポータル掲載・アクセス解析・SNS共有メタデータの検証"""

    @classmethod
    def setUpClass(cls):
        cls.portal_html = (REPO_ROOT / "index.html").read_text(encoding="utf-8")
        cls.game_html = (GHOST_DIR / "index.html").read_text(encoding="utf-8")
        cls.sitemap = ElementTree.parse(REPO_ROOT / "sitemap.xml")

    def test_portal_lists_ghost_game(self):
        """ポータルカード・構造化データ・フッターからゲームへ移動できること"""
        self.assertIn('id="cardGhost"', self.portal_html)
        self.assertIn('id="btnPlayGhost"', self.portal_html)
        self.assertIn('href="ghost/"', self.portal_html)
        self.assertIn(f'"url": "{BASE_URL}/ghost/"', self.portal_html)
        self.assertIn('3 TITLES AVAILABLE', self.portal_html)

    def test_game_uses_shared_google_analytics_property(self):
        """他作品と同じGoogle Analyticsプロパティを使うこと"""
        self.assertIn("googletagmanager.com/gtag/js?id=G-YLW887GX7D", self.game_html)
        self.assertIn("gtag('config', 'G-YLW887GX7D')", self.game_html)

    def test_game_ogp_image_is_a_real_jpeg(self):
        """OGP画像URLの拡張子・実ファイル形式・画像寸法が一致すること"""
        image_path = GHOST_DIR / "assets" / "images" / "ogp-ghost.jpg"
        self.assertTrue(image_path.is_file())
        self.assertEqual(image_path.read_bytes()[:3], b"\xff\xd8\xff")
        self.assertIn(f'"og:image" content="{BASE_URL}/ghost/assets/images/ogp-ghost.jpg"', self.game_html)
        self.assertIn(f'"twitter:image" content="{BASE_URL}/ghost/assets/images/ogp-ghost.jpg"', self.game_html)
        self.assertIn('name="twitter:card" content="summary_large_image"', self.game_html)
        self.assertIn('property="og:image:width" content="1376"', self.game_html)
        self.assertIn('property="og:image:height" content="768"', self.game_html)

    def test_game_is_listed_in_sitemap(self):
        """公開したゲームの正規URLがサイトマップに登録されること"""
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locations = [
            node.text
            for node in self.sitemap.findall(".//sm:loc", namespace)
        ]
        self.assertIn(f"{BASE_URL}/ghost/", locations)


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

    def test_disclaimer_is_a_separate_opening_line(self):
        """免責説明が既存シナリオIDをずらさない独立した冒頭セリフであること"""
        disclaimer = self.scenario.get("disclaimer", {})
        self.assertEqual(disclaimer.get("speaker"), "narrator")
        self.assertIn("実在の人物・企業・団体・サービスとは一切関係ありません", disclaimer.get("text", ""))
        self.assertEqual(disclaimer.get("voiceUrl"), "assets/audio/voice/disclaimer_01.mp3")

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
            hints = step.get("hints", [])
            self.assertGreaterEqual(len(hints), 3)
            self.assertEqual(len(hints), len(set(hints)))
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


class TestGhostAutoChoiceContinuity(unittest.TestCase):
    """AUTO中に選択肢・最終立証へ入ってもAUTO設定が解除されないこと（回帰防止）"""

    @classmethod
    def setUpClass(cls):
        cls.app_js = (GHOST_DIR / "js" / "app.js").read_text(encoding="utf-8")

    def method_body(self, name: str, next_marker: str) -> str:
        start = self.app_js.index(f"  {name}(")
        end = self.app_js.index(next_marker, start)
        return self.app_js[start:end]

    def test_show_choice_pauses_auto_without_disabling_it(self):
        """選択肢表示は自動送りだけを止め、AUTOのON/OFF設定を落とさないこと"""
        body = self.method_body("showChoice", "\n  setupChoiceHeader")
        self.assertIn("this.pauseAutoAdvance();", body)
        self.assertNotIn("this.stopAuto();", body)

    def test_final_deduction_pauses_auto_without_disabling_it(self):
        """最終証拠連結の証拠選択中もAUTO設定を保持すること"""
        body = self.method_body("startFinalDeduction", "\n  renderDeductionStep")
        self.assertIn("this.pauseAutoAdvance();", body)
        self.assertNotIn("this.stopAuto();", body)

    def test_pause_auto_advance_keeps_active_flag(self):
        """pauseAutoAdvance がタイマーだけを止め、isAutoActive を変更しないこと"""
        body = self.method_body("pauseAutoAdvance", "\n  toggleSkip")
        self.assertIn("clearTimeout(this.autoTimer)", body)
        self.assertNotIn("this.isAutoActive = false", body)
        self.assertNotIn("classList.remove('active')", body)


if __name__ == "__main__":
    unittest.main()
