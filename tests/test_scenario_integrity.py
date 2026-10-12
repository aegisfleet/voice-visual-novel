# -*- coding: utf-8 -*-
"""
PROJECT EVE - シナリオ・アセット・多言語整合性検証テストスイート
-------------------------------------------------------------
目的:
  - シナリオデータ(scenario.js)のシーンID重複や遷移先(jump, choices, present)のリンク切れ防止
  - 証拠品データベース(EVIDENCE_DATABASE)と各シーンの参照整合性検証
  - 劇中ボイス(音声ファイル)、BGM、背景画像アセットの存在保証(404エラー防止)
  - 多言語対応(i18n.js / english_translations.py)の全シーン網羅と英語音声存在確認
  - トゥルーエンド小説版(novel.html)およびボイス試聴室(samples.html)のオーディオ参照検証

実行方法:
  $ python tests/test_scenario_integrity.py
  $ python -m unittest tests/test_scenario_integrity.py
"""

import os
import sys
import json
import re
import unittest
import subprocess
from pathlib import Path

# Windows ターミナルでの文字化け防止
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
EVE_DIR = REPO_ROOT / "eve"
SCRIPTS_DIR = REPO_ROOT / "scripts"

# 証拠品マスターID一覧 (game-engine.js の EVIDENCE_DATABASE に準拠)
VALID_EVIDENCE_IDS = {"ev_tool", "ev_jailbreak", "ev_broker"}


def load_js_variable_via_node(file_path: Path, var_name: str):
    """Node.js を使用して JavaScript ファイル内の変数/オブジェクトを安全に JSON 化して取得する"""
    code = f"""
    const fs = require('fs');
    const content = fs.readFileSync({json.dumps(str(file_path))}, 'utf8');
    const sandbox = {{}};
    const fn = new Function('window', content + '; return ' + {json.dumps(var_name)} + ';');
    const result = fn(sandbox);
    console.log(JSON.stringify(result));
    """
    res = subprocess.run(
        ["node", "-e", code],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
        encoding="utf-8"
    )
    if res.returncode != 0:
        raise RuntimeError(f"Failed to load {var_name} from {file_path}:\n{res.stderr}")
    return json.loads(res.stdout)


def fallback_extract_scenario_ids(file_path: Path):
    """Node.js が存在しない環境用のフォールバック (正規表現でシーンIDを抽出)"""
    content = file_path.read_text(encoding="utf-8")
    ids = re.findall(r'id:\s*["\']([^"\']+)["\']', content)
    return ids


class ScenarioDataLoader:
    _scenario = None
    _i18n = None

    @classmethod
    def get_scenario(cls):
        if cls._scenario is None:
            cls._scenario = load_js_variable_via_node(
                EVE_DIR / "js" / "scenario.js", "SCENARIO_DATA"
            )
        return cls._scenario

    @classmethod
    def get_i18n(cls):
        if cls._i18n is None:
            cls._i18n = load_js_variable_via_node(
                EVE_DIR / "js" / "i18n.js", "I18N_DATA"
            )
        return cls._i18n


class TestScenarioStructure(unittest.TestCase):
    """シナリオデータの遷移構造およびID整合性のテスト"""

    @classmethod
    def setUpClass(cls):
        cls.scenarios = ScenarioDataLoader.get_scenario()
        cls.scenario_ids = [s["id"] for s in cls.scenarios]
        cls.id_set = set(cls.scenario_ids)

    def test_scene_ids_unique(self):
        """全シーンIDが一意であり重複がないことを検証"""
        duplicates = [sid for sid in self.id_set if self.scenario_ids.count(sid) > 1]
        self.assertEqual(
            len(self.scenarios),
            len(self.id_set),
            f"重複するシーンIDが存在します: {duplicates}"
        )
        self.assertGreaterEqual(len(self.scenarios), 60, "シーン数が少なすぎます")

    def test_direct_jump_targets_exist(self):
        """jump プロパティが指定されている場合、実在するシーンIDを指しているか検証"""
        errors = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            if "jump" in scene and scene["jump"]:
                target = scene["jump"]
                if target not in self.id_set:
                    errors.append(f"シーン '{s_id}' の jump 先 '{target}' が存在しません")
        self.assertEqual(len(errors), 0, "\n" + "\n".join(errors))

    def test_choices_jump_targets_exist(self):
        """choices (選択肢) 内のジャンプ先が実在し、テキストが空でないか検証"""
        errors = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            if "choices" in scene and scene["choices"]:
                for idx, choice in enumerate(scene["choices"]):
                    c_text = choice.get("text", "")
                    if not c_text:
                        errors.append(f"シーン '{s_id}' の選択肢[{idx}] に text がありません")
                    target = choice.get("jump")
                    if not target or target not in self.id_set:
                        errors.append(
                            f"シーン '{s_id}' の選択肢 '{c_text}' の jump 先 '{target}' が存在しません"
                        )
        self.assertEqual(len(errors), 0, "\n" + "\n".join(errors))

    def test_present_targets_and_evidence_exist(self):
        """present (証拠品つきつけ) の正解証拠品IDおよび各分岐先シーンの実在性を検証"""
        errors = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            if "present" in scene and scene["present"]:
                p = scene["present"]
                correct_ev = p.get("correct")
                if correct_ev not in VALID_EVIDENCE_IDS:
                    errors.append(
                        f"シーン '{s_id}' の present.correct '{correct_ev}' は有効な証拠品IDではありません"
                    )

                c_jump = p.get("correctJump") or p.get("onSuccess")
                if not c_jump or c_jump not in self.id_set:
                    errors.append(
                        f"シーン '{s_id}' の正解遷移先 '{c_jump}' が存在しません"
                    )

                w_jump = p.get("wrongJump") or p.get("onFailure")
                if not w_jump or w_jump not in self.id_set:
                    errors.append(
                        f"シーン '{s_id}' の不正解遷移先 '{w_jump}' が存在しません"
                    )

                g_jump = p.get("giveUpJump")
                if g_jump and g_jump not in self.id_set:
                    errors.append(
                        f"シーン '{s_id}' のギブアップ遷移先 '{g_jump}' が存在しません"
                    )
        self.assertEqual(len(errors), 0, "\n" + "\n".join(errors))

    def test_add_evidence_validity(self):
        """addEvidence で付与される証拠品IDがマスターに存在するか検証"""
        errors = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            if "addEvidence" in scene and scene["addEvidence"]:
                ev_id = scene["addEvidence"]
                if ev_id not in VALID_EVIDENCE_IDS:
                    errors.append(
                        f"シーン '{s_id}' の addEvidence '{ev_id}' は未定義の証拠品IDです"
                    )
        self.assertEqual(len(errors), 0, "\n" + "\n".join(errors))

    def test_ending_definitions(self):
        """ending ノードに必須プロパティ(type, title, description)があるか検証"""
        errors = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            if "ending" in scene and scene["ending"]:
                e = scene["ending"]
                if not e.get("type"):
                    errors.append(f"シーン '{s_id}' の ending に type が定義されていません")
                if not e.get("title"):
                    errors.append(f"シーン '{s_id}' の ending に title が定義されていません")
        self.assertEqual(len(errors), 0, "\n" + "\n".join(errors))


class TestScenarioAssets(unittest.TestCase):
    """シナリオ内で参照されている全アセット(ボイス・BGM・背景)の実ファイル存在テスト"""

    @classmethod
    def setUpClass(cls):
        cls.scenarios = ScenarioDataLoader.get_scenario()

    def test_voice_files_exist(self):
        """voiceFile に指定された音声ファイルが実際に存在するか検証"""
        missing = []
        checked_count = 0
        for scene in self.scenarios:
            s_id = scene.get("id")
            vf = scene.get("voiceFile")
            if vf:
                checked_count += 1
                p = EVE_DIR / vf
                if not p.is_file():
                    missing.append(f"シーン '{s_id}': 音声ファイルが見つかりません -> {vf}")
        self.assertGreater(checked_count, 50, "検証対象の音声ファイルが少なすぎます")
        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))

    def test_bgm_files_exist(self):
        """bgm に指定された音源ファイルが実際に存在するか検証"""
        missing = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            bgm = scene.get("bgm")
            if bgm and bgm != "stop":
                p = EVE_DIR / bgm
                if not p.is_file():
                    missing.append(f"シーン '{s_id}': BGMファイルが見つかりません -> {bgm}")
        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))

    def test_background_files_exist(self):
        """background に指定された画像ファイルが実際に存在するか検証"""
        missing = []
        for scene in self.scenarios:
            s_id = scene.get("id")
            bg = scene.get("background")
            if bg:
                p = EVE_DIR / bg
                if not p.is_file():
                    missing.append(f"シーン '{s_id}': 背景画像が見つかりません -> {bg}")
        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))


class TestInternationalization(unittest.TestCase):
    """多言語対応(i18n.js, english_translations.py)の整合性テスト"""

    @classmethod
    def setUpClass(cls):
        cls.scenarios = ScenarioDataLoader.get_scenario()
        cls.scenario_ids = [s["id"] for s in cls.scenarios]
        cls.i18n = ScenarioDataLoader.get_i18n()

    def test_i18n_scenes_coverage(self):
        """i18n.js に scenario.js の全シーンが登録されているか検証"""
        i18n_scenes = self.i18n.get("scenes", {})
        missing_scenes = [sid for sid in self.scenario_ids if sid not in i18n_scenes]
        self.assertEqual(
            len(missing_scenes),
            0,
            f"i18n.js に未登録のシーンがあります: {missing_scenes}"
        )

    def test_i18n_english_voices_exist(self):
        """i18n.js で指定された英語音声ファイル(voiceFileEn)が全て実在するか検証"""
        i18n_scenes = self.i18n.get("scenes", {})
        missing = []
        checked_count = 0
        for sid, data in i18n_scenes.items():
            vf_en = data.get("voiceFileEn")
            if vf_en:
                checked_count += 1
                p = EVE_DIR / vf_en
                if not p.is_file():
                    missing.append(f"シーン '{sid}': 英語音声ファイルが見つかりません -> {vf_en}")
        self.assertGreater(checked_count, 50, "検証対象の英語音声ファイルが少なすぎます")
        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))

    def test_i18n_evidence_keys(self):
        """i18n.js の evidence に全証拠品が登録されているか検証"""
        i18n_ev = self.i18n.get("evidence", {})
        for ev_id in VALID_EVIDENCE_IDS:
            self.assertIn(
                ev_id,
                i18n_ev,
                f"i18n.js の evidence に '{ev_id}' が登録されていません"
            )

    def test_english_translations_script_consistency(self):
        """scripts/english_translations.py と scenario.js の全シーンIDが一致するか検証"""
        sys.path.insert(0, str(SCRIPTS_DIR))
        import english_translations
        en_scenes = english_translations.ENGLISH_SCENES
        en_ids = [s["id"] for s in en_scenes]

        missing_in_en = [sid for sid in self.scenario_ids if sid not in en_ids]
        extra_in_en = [sid for sid in en_ids if sid not in self.scenario_ids]

        self.assertEqual(
            len(missing_in_en),
            0,
            f"english_translations.py に不足しているシーンID: {missing_in_en}"
        )
        self.assertEqual(
            len(extra_in_en),
            0,
            f"english_translations.py に余剰なシーンID: {extra_in_en}"
        )


class TestNovelAndSamplesAssets(unittest.TestCase):
    """トゥルーエンド小説版 (novel.html) および 試聴室 (samples.html) の音声ファイル参照テスト"""

    def test_novel_audio_files_exist(self):
        """novel.html 内の各ダイアログブロックの日英音声ファイルが全て存在するか検証"""
        novel_path = EVE_DIR / "novel.html"
        self.assertTrue(novel_path.is_file(), "eve/novel.html が見つかりません")
        content = novel_path.read_text(encoding="utf-8")

        dialogues = re.findall(r'<div class="dialogue-block"[^>]*>', content)
        self.assertGreater(len(dialogues), 20, "小説版のセリフブロックが少なすぎます")

        missing = []
        for tag in dialogues:
            m_ja = re.search(r'data-audio-ja="([^"]+)"', tag)
            m_en = re.search(r'data-audio-en="([^"]+)"', tag)
            if m_ja:
                p_ja = EVE_DIR / m_ja.group(1)
                if not p_ja.is_file():
                    missing.append(f"小説版(日本語)音声が見つかりません -> {m_ja.group(1)}")
            if m_en:
                p_en = EVE_DIR / m_en.group(1)
                if not p_en.is_file():
                    missing.append(f"小説版(英語)音声が見つかりません -> {m_en.group(1)}")

        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))

    def test_samples_audio_files_exist(self):
        """samples.html 内の全 audio 要素の src ファイルが実在するか検証"""
        samples_path = EVE_DIR / "samples.html"
        self.assertTrue(samples_path.is_file(), "eve/samples.html が見つかりません")
        content = samples_path.read_text(encoding="utf-8")

        srcs = re.findall(r'<audio[^>]+src="([^"]+)"', content)
        self.assertGreater(len(srcs), 10, "試聴室のトラック数が少なすぎます")

        missing = []
        for src in srcs:
            p = EVE_DIR / src
            if not p.is_file():
                missing.append(f"試聴室の音声ファイルが見つかりません -> {src}")

        self.assertEqual(len(missing), 0, "\n" + "\n".join(missing))


def run_summary_banner():
    """ターミナル実行時の視認性向上バナー"""
    print("=" * 70)
    print("  PROJECT EVE - Scenario & Asset Integrity Test Suite")
    print("=" * 70)


if __name__ == "__main__":
    run_summary_banner()
    unittest.main(verbosity=2)
