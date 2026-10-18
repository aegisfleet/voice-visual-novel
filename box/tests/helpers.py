# -*- coding: utf-8 -*-
"""
box/tests/helpers.py - BOX WORM テスト用共通ヘルパーモジュール
------------------------------------------------------------------
・ローカル静的サーバーの死活確認＆自動起動/停止
・Playwrightブラウザ＆ページの共通セットアップ
・画面キャプチャ出力先の自動管理
・ゲーム内セッションデータ注入ユーティリティ
"""
import os
import sys
import time
import socket
import subprocess
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
BOX_DIR = REPO_ROOT / "box"
TESTS_DIR = BOX_DIR / "tests"

# スクリーンショット出力ディレクトリ
DEFAULT_SCREENSHOTS_DIR = TESTS_DIR / "screenshots"
SCREENSHOTS_DIR = Path(os.environ.get("BOX_TEST_SCREENSHOTS_DIR", str(DEFAULT_SCREENSHOTS_DIR)))
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_PORT = 8080
BASE_URL = os.environ.get("BOX_TEST_URL", f"http://localhost:{DEFAULT_PORT}/box/index.html")
SAMPLES_URL = os.environ.get("BOX_TEST_SAMPLES_URL", f"http://localhost:{DEFAULT_PORT}/box/samples.html")


class LocalServerManager:
    """ローカル静的サーバー（http.server）の自動管理クラス"""
    def __init__(self, port=DEFAULT_PORT):
        self.port = port
        self.process = None

    def is_running(self) -> bool:
        try:
            with urlopen(f"http://localhost:{self.port}/box/index.html", timeout=1.5) as resp:
                return resp.status == 200
        except Exception:
            return False

    def ensure_server(self):
        if self.is_running():
            return
        # 起動していない場合、バックグラウンドで起動
        print(f"[LocalServerManager] ポート {self.port} でローカルサーバーを起動中...")
        self.process = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(self.port)],
            cwd=str(REPO_ROOT),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        for _ in range(30):
            time.sleep(0.2)
            if self.is_running():
                print(f"[LocalServerManager] サーバー起動完了: http://localhost:{self.port}")
                return
        raise RuntimeError(f"ローカルサーバーの起動に失敗しました (ポート {self.port})")

    def stop(self):
        if self.process:
            print("[LocalServerManager] テスト用サーバーを停止中...")
            try:
                self.process.terminate()
                self.process.wait(timeout=3)
            except Exception:
                try:
                    self.process.kill()
                except Exception:
                    pass
            self.process = None


def inject_session(page, session_data: dict):
    """ブラウザのlocalStorageにセッション進行データを注入してリロード"""
    import json
    script = f"""() => {{
        localStorage.setItem('box_worm_session_v1', JSON.stringify({json.dumps(session_data)}));
    }}"""
    page.evaluate(script)
    page.reload(wait_until="networkidle")


def clear_storage(page):
    """ストレージを初期化"""
    page.evaluate("""() => {
        localStorage.clear();
    }""")
    page.reload(wait_until="networkidle")
