# -*- coding: utf-8 -*-
"""
GHOST PROTOCOL - 全シナリオ音声（収録MP3）整合性テストスイート
---------------------------------------------------------------------------------
目的:
  - ghost/scripts/all_dialogues.json の全セリフに音声ファイルが存在すること
  - ghost/js/voice-manifest.js が全セリフを speaker::text キーで解決できること
  - 音声ファイルが有効なMP3であり、極端に短い・空のファイルが無いこと
  - マニフェストとシナリオ本文の不整合（本文変更によるキー欠落）を検出すること
  - ゲーム側の再生導線（voice-manifest.js の読み込み順、resolveVoiceUrl）が維持されていること
"""

import json
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
GHOST_DIR = REPO_ROOT / "ghost"
DIALOGUES_PATH = GHOST_DIR / "scripts" / "all_dialogues.json"
MANIFEST_PATH = GHOST_DIR / "js" / "voice-manifest.js"
MIN_BYTES = 1000

MP3_FRAME_SYNC = re.compile(rb"[\xff][\xfb\xf3\xf2\xfa\xe3]")


def read_manifest() -> dict:
    """voice-manifest.js から window.GHOST_VOICE_MANIFEST のJSON部分を取り出す。"""
    content = MANIFEST_PATH.read_text(encoding="utf-8")
    start = content.index("{", content.index("window.GHOST_VOICE_MANIFEST"))
    end = content.rindex("}") + 1
    return json.loads(content[start:end])


def is_valid_mp3(path: Path) -> bool:
    head = path.read_bytes()[:4096]
    return head[:3] == b"ID3" or MP3_FRAME_SYNC.search(head) is not None


class TestGhostVoiceCoverage(unittest.TestCase):
    """全セリフと生成音声ファイルの網羅性検証"""

    @classmethod
    def setUpClass(cls):
        cls.dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
        cls.manifest = read_manifest()

    def test_dialogue_catalog_is_complete(self):
        """全221セリフがカタログに登録され、IDが一意であること"""
        self.assertEqual(len(self.dialogues), 221)
        ids = [entry["id"] for entry in self.dialogues]
        self.assertEqual(len(ids), len(set(ids)), "重複したセリフIDが存在します")

    def test_dialogue_keys_are_unique(self):
        """マニフェストキー（speaker::text）が全セリフで一意であること"""
        keys = [f"{entry['speaker']}::{entry['text']}" for entry in self.dialogues]
        duplicates = {key for key in keys if keys.count(key) > 1}
        self.assertEqual(duplicates, set(), f"重複キー: {sorted(duplicates)[:3]}")

    def test_every_line_has_audio_file(self):
        """全セリフの音声ファイルが実在し、一定サイズ以上であること"""
        missing = []
        too_small = []
        for entry in self.dialogues:
            path = GHOST_DIR / entry["file"]
            if not path.exists():
                missing.append(entry["id"])
            elif path.stat().st_size <= MIN_BYTES:
                too_small.append(f"{entry['id']} ({path.stat().st_size} bytes)")
        self.assertEqual(missing, [], f"音声ファイル未生成: {missing[:10]} (全{len(missing)}件)")
        self.assertEqual(too_small, [], f"音声ファイルが小さすぎます: {too_small[:10]}")

    def test_every_line_resolves_from_manifest(self):
        """全セリフがマニフェスト経由で音声URLを解決できること"""
        unresolved = []
        for entry in self.dialogues:
            key = f"{entry['speaker']}::{entry['text']}"
            if self.manifest.get(key) != entry["file"]:
                unresolved.append(entry["id"])
        self.assertEqual(unresolved, [], f"マニフェスト未解決: {unresolved[:10]} (全{len(unresolved)}件)")

    def test_manifest_has_no_stale_entries(self):
        """マニフェストにシナリオと対応しない残留エントリが無いこと"""
        valid_keys = {f"{entry['speaker']}::{entry['text']}" for entry in self.dialogues}
        stale = [key for key in self.manifest if key not in valid_keys]
        self.assertEqual(stale, [], f"古いマニフェスト項目: {stale[:3]}")

    def test_audio_files_are_valid_mp3(self):
        """全音声ファイルがMP3として解釈可能なヘッダを持つこと"""
        broken = []
        for entry in self.dialogues:
            path = GHOST_DIR / entry["file"]
            if path.exists() and not is_valid_mp3(path):
                broken.append(entry["id"])
        self.assertEqual(broken, [], f"MP3ヘッダ不正: {broken[:10]}")

    def test_voice_files_are_not_shared_between_lines(self):
        """生成済み音声ファイルが複数セリフで使い回されていないこと（プロローグ既存分を除く）"""
        owners: dict[str, list[str]] = {}
        for entry in self.dialogues:
            if not entry["file"].startswith("assets/audio/voice/"):
                continue
            owners.setdefault(entry["file"], []).append(entry["id"])
        shared = {path: ids for path, ids in owners.items() if len(ids) > 1}
        self.assertEqual(shared, {}, f"音声ファイルの共有: {shared}")


class TestGhostVoiceWiring(unittest.TestCase):
    """ゲーム側の音声再生導線（読み込み順・解決関数）の検証"""

    @classmethod
    def setUpClass(cls):
        cls.html = (GHOST_DIR / "index.html").read_text(encoding="utf-8")
        cls.app_js = (GHOST_DIR / "js" / "app.js").read_text(encoding="utf-8")
        cls.manifest_js = MANIFEST_PATH.read_text(encoding="utf-8")

    def test_manifest_script_loaded_before_app(self):
        """voice-manifest.js が scenario.js の後、app.js の前に読み込まれること"""
        self.assertIn("js/voice-manifest.js", self.html)
        self.assertLess(
            self.html.index("js/scenario.js"),
            self.html.index("js/voice-manifest.js"),
            "voice-manifest.js は scenario.js より後に読み込む必要があります",
        )
        self.assertLess(
            self.html.index("js/voice-manifest.js"),
            self.html.index("js/app.js"),
            "voice-manifest.js は app.js より先に読み込む必要があります",
        )

    def test_manifest_defines_global(self):
        """マニフェストが window.GHOST_VOICE_MANIFEST を定義していること"""
        self.assertIn("window.GHOST_VOICE_MANIFEST", self.manifest_js)

    def test_resolve_voice_url_prefers_direct_then_manifest(self):
        """resolveVoiceUrl が直接指定を優先し、無ければマニフェストを参照すること"""
        self.assertIn("resolveVoiceUrl(item)", self.app_js)
        self.assertIn("window.GHOST_VOICE_MANIFEST", self.app_js)
        self.assertIn("this.resolveVoiceUrl(item)", self.app_js)


if __name__ == "__main__":
    unittest.main()
