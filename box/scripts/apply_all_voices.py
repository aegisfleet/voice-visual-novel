"""
scripts/apply_all_voices.py - 全セリフに voiceUrl を付与するスクリプト
scripts/all_dialogues.json の全253件のセリフに対し、
box/js/scenario.js 内の各セリフオブジェクトへ
`voiceUrl: 'assets/audio/voice/{id}.mp3'`
を確実に付与・更新する。
"""
import re
import json
from pathlib import Path

def main():
    repo_root = Path(__file__).resolve().parent.parent.parent
    scenario_path = repo_root / "box/js/scenario.js"
    dialogues_path = Path(__file__).parent / "all_dialogues.json"

    with open(dialogues_path, "r", encoding="utf-8") as f:
        dialogues = json.load(f)

    with open(scenario_path, "r", encoding="utf-8") as f:
        content = f.read()

    applied_count = 0
    missing_count = 0

    for item in dialogues:
        line_id = item["id"]
        raw_text = item["text"]
        voice_url = f"assets/audio/voice/{line_id}.mp3"

        escaped_text = re.escape(raw_text)
        pattern = re.compile(
            r"([ \t]*text:\s*['\"]" + escaped_text + r"['\"],?\n?)(?:[ \t]*voiceUrl:\s*['\"][^'\"]*['\"],?\n?)?",
            re.MULTILINE
        )

        match = pattern.search(content)
        if match:
            matched_str = match.group(1)
            indent = " " * (len(matched_str) - len(matched_str.lstrip()))
            if not indent:
                indent = "      "

            escaped_val = raw_text.replace("'", "\\'")
            replacement = f"{indent}text: '{escaped_val}',\n{indent}voiceUrl: '{voice_url}',\n"

            content = content[:match.start()] + replacement + content[match.end():]
            applied_count += 1
        else:
            print(f"未検出: {line_id} -> {raw_text[:30]}")
            missing_count += 1

    with open(scenario_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"=== 反映結果 ===")
    print(f"総件数: {len(dialogues)}")
    print(f"正常付与: {applied_count}")
    print(f"未検出: {missing_count}")

if __name__ == "__main__":
    main()
