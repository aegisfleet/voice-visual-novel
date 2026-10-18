# -*- coding: utf-8 -*-
"""
box/tests/run_all_tests.py - BOX WORM テストスイート一括実行ランナー
------------------------------------------------------------------
以下の全テストを順次実行し、結果をまとめてレポートする:
1. 静的整合性テスト (test_integrity.py)
2. JavaScript認知複雑度チェッカー (test_complexity.js)
3. BGM・音声ライフサイクルE2Eテスト (test_audio_bgm.py)
4. 会話劇・キャラクター立ち絵E2Eテスト (test_dialogue_avatar.py)
5. ゲームループ・UIステートE2Eテスト (test_gameplay.py)
"""
import sys
import time
import subprocess
from pathlib import Path
from helpers import LocalServerManager, SCREENSHOTS_DIR

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
TESTS_DIR = Path(__file__).resolve().parent

sys.stdout.reconfigure(encoding="utf-8")


def run_command(cmd, desc):
    print(f"\n==================================================")
    print(f"▶ 実行中: {desc}")
    print(f"  コマンド: {' '.join(cmd)}")
    print(f"==================================================")
    start_time = time.time()
    res = subprocess.run(cmd, cwd=str(REPO_ROOT), text=True, encoding="utf-8")
    elapsed = time.time() - start_time
    passed = res.returncode == 0
    status = "SUCCESS" if passed else "FAILED"
    print(f"[{status}] 所要時間: {elapsed:.2f}秒 (Exit Code: {res.returncode})")
    return passed, elapsed


def main():
    print("##################################################")
    print("#  BOX WORM テストスイート一括実行                #")
    print(f"#  スクリーンショット保存先: {SCREENSHOTS_DIR}")
    print("##################################################")

    # サーバー起動確認
    server_mgr = LocalServerManager()
    server_mgr.ensure_server()

    tests = [
        ([sys.executable, str(TESTS_DIR / "test_integrity.py")], "静的整合性・アセット・ピン距離テスト"),
        (["node", str(TESTS_DIR / "test_complexity.js")], "JavaScript認知複雑度(<=15)チェッカー"),
        ([sys.executable, str(TESTS_DIR / "test_audio_bgm.py")], "BGM・音声再生パイプラインE2Eテスト"),
        ([sys.executable, str(TESTS_DIR / "test_dialogue_avatar.py")], "会話劇・キャラクター立ち絵E2Eテスト"),
        ([sys.executable, str(TESTS_DIR / "test_gameplay.py")], "ゲームループ・UIステートE2Eテスト"),
    ]

    results = []
    total_start = time.time()

    for cmd, desc in tests:
        passed, elapsed = run_command(cmd, desc)
        results.append((desc, passed, elapsed))

    total_elapsed = time.time() - total_start

    print("\n\n" + "#" * 60)
    print("#  テスト実行結果サマリー")
    print("#" * 60)
    all_passed = True
    for desc, passed, elapsed in results:
        status_str = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"{status_str} | {desc.ljust(40)} ({elapsed:.2f}s)")

    print("-" * 60)
    print(f"総所要時間: {total_elapsed:.2f}秒")
    print(f"スクリーンショット保存先: {SCREENSHOTS_DIR.resolve()}")
    if all_passed:
        print("🎉 全テストが正常に合格しました！")
        sys.exit(0)
    else:
        print("❌ 一部のテストが失敗しました。")
        sys.exit(1)


if __name__ == "__main__":
    main()
