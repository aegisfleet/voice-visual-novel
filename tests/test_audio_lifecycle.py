"""
VOICE VISUAL NOVELS - 音声再生・AUTO進行・ライフサイクル自動E2Eテストスイート

目的:
- LINE内蔵ブラウザやiOS Safari/WebKit環境における自動再生制限（Autoplay Policy）
- バックグラウンド移行（タブ非表示・ブラウザ終了・トーク画面復帰）時の音声漏れ
- セリフ遷移時の連続再生と連鎖スキップ暴走
上記の不具合が再発（デグレ）しないことを自動検証する。

実行方法:
  python tests/test_audio_lifecycle.py
"""

import asyncio
import os
import socket
import subprocess
import sys
import time
from playwright.async_api import async_playwright

TEST_PORT = 8899
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


async def wait_server_ready(url, timeout=10.0):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection(("127.0.0.1", TEST_PORT), timeout=0.5):
                return True
        except (OSError, ConnectionRefusedError):
            await asyncio.sleep(0.2)
    return False


async def run_tests():
    print("=" * 60)
    print("VOICE VISUAL NOVELS - 音声・ライフサイクル自動E2Eテスト開始")
    print("=" * 60)

    # 1. ローカルテスト用HTTPサーバーの自動起動
    print(f"[1/5] ローカルHTTPサーバーを起動中 (ポート: {TEST_PORT})...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(TEST_PORT), "--directory", WORKSPACE_ROOT],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    try:
        ready = await wait_server_ready(BASE_URL)
        if not ready:
            raise RuntimeError(f"ローカルサーバーの起動に失敗しました (ポート {TEST_PORT})")
        print(" -> サーバー起動完了")

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()

            # -----------------------------------------------------------
            # TEST 1: 小説の連続朗読再生とセリフ遷移テスト
            # -----------------------------------------------------------
            print("\n[2/5] テスト1: 小説の連続朗読再生とセリフ間遷移を検証中...")
            page_novel = await context.new_page()
            await page_novel.goto(f"{BASE_URL}/eve/novel.html")
            await page_novel.wait_for_timeout(1000)

            # 後半セリフ（28番）の個別再生
            dialogues = await page_novel.query_selector_all(".dialogue-block")
            assert len(dialogues) > 0, "小説のセリフブロックが取得できません"
            btn_voice = await dialogues[28].query_selector(".btn-voice")
            await btn_voice.click()
            await page_novel.wait_for_timeout(500)

            # 連続再生ボタンをクリック
            await page_novel.click("#btnPlayAll")
            await page_novel.wait_for_timeout(500)

            # 音声を終了直前へ早送りし、次のセリフへの遷移を誘発
            await page_novel.evaluate("""() => {
                if (sharedVoiceAudio) {
                    sharedVoiceAudio.currentTime = sharedVoiceAudio.duration - 0.2;
                }
            }""")
            await page_novel.wait_for_timeout(1000)

            state_trans = await page_novel.evaluate("""() => {
                return {
                    curIdx: currentDialogueIndex,
                    isPlayingAll: isPlayingAll,
                    audioPaused: sharedVoiceAudio ? sharedVoiceAudio.paused : null
                };
            }""")
            print(f" -> 遷移後ステータス: {state_trans}")
            assert state_trans["curIdx"] == 29, f"29番へ遷移すべきですが {state_trans['curIdx']} です"
            assert state_trans["isPlayingAll"] is True, "連続再生フラグが維持されていません"
            assert state_trans["audioPaused"] is False, "次のセリフの音声が再生されていません"
            print(" -> PASS: 小説の連続再生・セリフ間遷移は正常です")

            # -----------------------------------------------------------
            # TEST 2: Autoplay制限時の連鎖スキップ防止（安全停止ガード）テスト
            # -----------------------------------------------------------
            print("\n[3/5] テスト2: Autoplay制限時の連鎖スキップ防止安全ガードを検証中...")
            # 意図的にNotAllowedErrorを発生させる
            await page_novel.evaluate("""() => {
                sharedVoiceAudio.play = () => {
                    const err = new Error("play() failed because user didn't interact.");
                    err.name = "NotAllowedError";
                    return Promise.reject(err);
                };
                if (sharedVoiceAudio.onended) sharedVoiceAudio.onended();
            }""")
            await page_novel.wait_for_timeout(1000)

            state_guard = await page_novel.evaluate("""() => {
                return {
                    isPlayingAll: isPlayingAll,
                    btnText: document.getElementById('btnPlayAll').textContent
                };
            }""")
            print(f" -> ガード発動時ステータス: {state_guard}")
            assert state_guard["isPlayingAll"] is False, "自動再生制限時に連続再生が停止していません"
            assert "再開" in state_guard["btnText"] or "Resume" in state_guard["btnText"], "再開待機ボタンになっていません"
            print(" -> PASS: Autoplay制限時の安全停止ガードは正常に機能しています")

            # -----------------------------------------------------------
            # TEST 3: ゲーム本編のAUTOシナリオ進行テスト
            # -----------------------------------------------------------
            print("\n[4/5] テスト3: ゲーム本編のAUTOシナリオ進行とボイス継続再生を検証中...")
            page_game = await context.new_page()
            await page_game.goto(f"{BASE_URL}/eve/index.html")
            await page_game.wait_for_timeout(1000)

            # スタートボタンをクリック
            await page_game.click("#btnStart")
            await page_game.wait_for_timeout(1000)

            # タイピングを即時完了
            await page_game.evaluate("""() => {
                if (window.game && window.game.isTextTyping) {
                    window.game.completeTyping();
                }
            }""")

            initial_scene = await page_game.evaluate("() => window.game.currentSceneId")
            assert initial_scene == "prologue_01", f"初期シーンが不正です: {initial_scene}"

            # 音声終了を発火させてAUTO進行
            await page_game.evaluate("""() => {
                const va = window.game.audio.voiceAudio;
                if (va && va.onended) va.onended();
            }""")
            await page_game.wait_for_timeout(1500)

            advanced_state = await page_game.evaluate("""() => {
                const g = window.game;
                return {
                    sceneId: g.currentSceneId,
                    isAuto: g.isAutoMode,
                    voicePlaying: g.audio.isPlaying,
                    voicePaused: g.audio.voiceAudio ? g.audio.voiceAudio.paused : null
                };
            }""")
            print(f" -> AUTO進行後ステータス: {advanced_state}")
            assert advanced_state["sceneId"] == "prologue_02", f"次のシーンへAUTO進行していません: {advanced_state['sceneId']}"
            assert advanced_state["isAuto"] is True, "AUTOモードが維持されていません"
            assert advanced_state["voicePlaying"] is True, "次シーンのボイスが再生されていません"
            print(" -> PASS: ゲーム本編のAUTO進行およびボイス継続再生は正常です")

            # -----------------------------------------------------------
            # TEST 4: ブラウザ終了・非表示時の音声・タイマー即時停止テスト
            # -----------------------------------------------------------
            print("\n[5/5] テスト4: ブラウザ非表示・終了（LINE内ブラウザ）時の即時停止を検証中...")
            # 1. ゲーム本編の非表示化
            await page_game.evaluate("""() => {
                Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                window.dispatchEvent(new Event('pagehide'));
            }""")
            await page_game.wait_for_timeout(500)

            game_hide_state = await page_game.evaluate("""() => {
                const g = window.game;
                return {
                    isAuto: g.isAutoMode,
                    autoTimer: g.autoTimer,
                    voicePlaying: g.audio.isPlaying,
                    voicePaused: g.audio.voiceAudio ? g.audio.voiceAudio.paused : null,
                    bgmPaused: g.audio.currentBGMTrack && g.audio.currentBGMTrack.audio ? g.audio.currentBGMTrack.audio.paused : null
                };
            }""")
            print(f" -> ゲーム本編 非表示時ステータス: {game_hide_state}")
            assert game_hide_state["isAuto"] is False, "非表示時にAUTOモードが停止していません"
            assert game_hide_state["autoTimer"] is None, "非表示時にautoTimerが破棄されていません"
            assert game_hide_state["voicePlaying"] is False, "非表示時にボイスフラグが停止していません"
            assert game_hide_state["voicePaused"] is True, "非表示時にボイスAudioがpauseされていません"
            assert game_hide_state["bgmPaused"] is True, "非表示時にBGMがpauseされていません"

            # 2. 小説ページの非表示化
            await page_novel.evaluate("""() => {
                // 連続再生を再開
                startPlayAll(0);
            }""")
            await page_novel.wait_for_timeout(300)
            await page_novel.evaluate("""() => {
                Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                window.dispatchEvent(new Event('pagehide'));
            }""")
            await page_novel.wait_for_timeout(500)

            novel_hide_state = await page_novel.evaluate("""() => {
                return {
                    isPlayingAll: isPlayingAll,
                    audioPaused: sharedVoiceAudio ? sharedVoiceAudio.paused : null,
                    timer: sequenceTimer
                };
            }""")
            print(f" -> 小説ページ 非表示時ステータス: {novel_hide_state}")
            assert novel_hide_state["isPlayingAll"] is False, "非表示時に朗読が停止していません"
            assert novel_hide_state["audioPaused"] is True, "非表示時に朗読Audioがpauseされていません"
            assert novel_hide_state["timer"] is None, "非表示時に朗読タイマーが破棄されていません"
            print(" -> PASS: バックグラウンド移行時の全タイマー・音声即時停止は正常に機能しています")

            # 3. BOX WORM（box/index.html）の早期アンロック＆LINE内ブラウザ非表示化テスト
            print("\n[BOX WORM] LINE内ブラウザ早期アンロック＆非表示時即時停止テストを検証中...")
            page_box = await browser.new_page(viewport={"width": 390, "height": 844})
            await page_box.goto(f"{BASE_URL}/box/")
            await page_box.mouse.click(100, 100)
            await page_box.wait_for_timeout(300)

            box_unlock = await page_box.evaluate("""() => {
                const a = window.audioMgr;
                return { isAudioUnlocked: a.isAudioUnlocked, isSpeechUnlocked: a.isSpeechUnlocked };
            }""")
            assert box_unlock["isAudioUnlocked"] is True, "BOX WORMのAudioContextがアンロックされていません"

            # BGM開始＆会話AUTO開始
            await page_box.evaluate("""() => {
                window.audioMgr.startBgm('explore');
                window.app.playDialogueSequence([
                    { speaker: 'ユウタ', text: 'テストセリフ1' }
                ]);
            }""")
            await page_box.wait_for_timeout(400)

            # 非表示イベント
            await page_box.evaluate("""() => {
                Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                window.dispatchEvent(new Event('pagehide'));
            }""")
            await page_box.wait_for_timeout(400)

            box_hide_state = await page_box.evaluate("""() => {
                const a = window.audioMgr;
                const app = window.app;
                return {
                    bgmPaused: a.currentBgmTrack ? a.currentBgmTrack.audio.paused : true,
                    wasBgmPlaying: a.wasBgmPlayingBeforeHide,
                    isAuto: app.isAutoMode,
                    autoTimer: app.autoTimer
                };
            }""")
            print(f" -> BOX WORM 非表示時ステータス: {box_hide_state}")
            assert box_hide_state["bgmPaused"] is True, "BOX WORM非表示時にBGMが停止していません"
            assert box_hide_state["wasBgmPlaying"] is True, "BOX WORM非表示時にwasBgmPlayingBeforeHideが記録されていません"
            assert box_hide_state["isAuto"] is False, "BOX WORM非表示時にAUTOモードが停止していません"
            assert box_hide_state["autoTimer"] is None, "BOX WORM非表示時にautoTimerが破棄されていません"
            print(" -> PASS: BOX WORMのLINE内ブラウザ終了・非表示時停止は正常に機能しています")

            await browser.close()

    finally:
        print("\n[完了処理] ローカルHTTPサーバーを停止中...")
        server_process.terminate()
        try:
            server_process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            server_process.kill()
        print(" -> サーバー停止完了")

    print("\n" + "=" * 60)
    print("すべての自動E2Eテストが正常に合格（PASS）しました！")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_tests())
