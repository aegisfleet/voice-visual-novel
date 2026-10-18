import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("scratch/screenshots_monologue_verify")
OUT.mkdir(parents=True, exist_ok=True)
BASE_URL = "http://localhost:8080/box/index.html"

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # ----------------------------------------------------
        # 1. PC 画面検証 (1280x800)
        # ----------------------------------------------------
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.goto(BASE_URL, wait_until="networkidle")
        
        # クリックしてオーディオアンロック
        await page.mouse.click(100, 100)
        await page.wait_for_timeout(300)

        # アンロック状態の検証
        unlock_info = await page.evaluate("""() => {
            const a = window.audioMgr;
            return {
                isAudioUnlocked: a.isAudioUnlocked,
                isVoiceAudioUnlocked: a.isVoiceAudioUnlocked,
                hasVoiceAudio: Boolean(a.voiceAudio)
            };
        }""")
        print(f"[PC] オーディオアンロック状態: {unlock_info}")
        assert unlock_info["isAudioUnlocked"] is True, "AudioContextがアンロックされていません"
        assert unlock_info["isVoiceAudioUnlocked"] is True, "ボイスAudio要素がアンロックされていません"
        assert unlock_info["hasVoiceAudio"] is True, "voiceAudio要素が初期化されていません"

        # 会話シーン（アオイ発言 -> ユウタ心の声）の検証
        await page.evaluate("""() => {
            window.app.playDialogueSequence([
                {
                    speaker: '隣人アオイ',
                    emotion: 'panic',
                    text: '「ユウタさん……うちのアパート、何か恐ろしい事件に巻き込まれてるんですか……？」',
                    voiceUrl: 'assets/audio/voice/npc_aoi_intro_02.mp3'
                },
                {
                    speaker: 'ユウタ（心の声）',
                    emotion: 'shock',
                    text: '（隣の202号室のアオイさんだ。不安そうにドアの隙間から廊下の様子を伺っている……昨夜の異変について聞いてみよう）',
                    voiceUrl: 'assets/audio/voice/npc_aoi_intro_01.mp3'
                }
            ]);
        }""")
        await page.wait_for_timeout(500)

        # 1行目: アオイが発話中
        aoi_speaking_state = await page.evaluate("""() => {
            const img = document.querySelector('.char-sprite-img');
            return {
                speaker: window.app.currentSpeaker,
                charId: window.app.character.currentCharId,
                isDimmed: img ? img.classList.contains('is-dimmed') : null,
                isMonologueBg: img ? img.classList.contains('is-monologue-bg') : null,
                isSpeaking: img ? img.classList.contains('is-speaking') : null
            };
        }""")
        print(f"[PC 1行目: アオイ発話] 立ち絵ステータス: {aoi_speaking_state}")
        assert aoi_speaking_state["charId"] == "aoi", "アオイの立ち絵が表示されていません"
        assert aoi_speaking_state["isDimmed"] is False, "NPC発話中に減光されています"
        assert aoi_speaking_state["isMonologueBg"] is False, "NPC発話中にモノローグ背景化されています"

        await page.screenshot(path=str(OUT / "1_npc_speaking_pc.png"))
        print(" -> 1_npc_speaking_pc.png 保存完了")

        # 2行目へ進める: ユウタ（心の声）
        await page.evaluate("""() => {
            window.app.showNextDialogue();
        }""")
        await page.wait_for_timeout(500)

        monologue_state = await page.evaluate("""() => {
            const img = document.querySelector('.char-sprite-img');
            const speakerEl = document.querySelector('#dialogue-speaker');
            const novelWin = document.querySelector('#novel-window');
            return {
                speaker: window.app.currentSpeaker,
                charId: window.app.character.currentCharId,
                isDimmed: img ? img.classList.contains('is-dimmed') : null,
                isMonologueBg: img ? img.classList.contains('is-monologue-bg') : null,
                isSpeaking: img ? img.classList.contains('is-speaking') : null,
                speakerHtml: speakerEl ? speakerEl.innerHTML : '',
                hasMonologueClass: novelWin ? novelWin.classList.contains('is-monologue') : false
            };
        }""")
        print(f"[PC 2行目: ユウタ心の声] 立ち絵＆ウィンドウステータス: {monologue_state}")
        assert monologue_state["charId"] == "aoi", "心の声時に向かい合っているNPC立ち絵が維持されていません"
        assert monologue_state["isDimmed"] is True, "心の声時にNPC立ち絵が減光されていません"
        assert monologue_state["isMonologueBg"] is True, "心の声時にNPC立ち絵がis-monologue-bgになっていません"
        assert monologue_state["isSpeaking"] is False, "心の声なのにNPC立ち絵にis-speakingが付与されています！"
        assert monologue_state["hasMonologueClass"] is True, "ノベルウィンドウにis-monologueクラスが付与されていません"
        assert "speaker-thought-tag" in monologue_state["speakerHtml"], "スピーカー表示に心の声タグが存在しません"

        await page.screenshot(path=str(OUT / "2_monologue_thought_pc.png"))
        print(" -> 2_monologue_thought_pc.png 保存完了")

        # ----------------------------------------------------
        # 2. スマホ 画面検証 (390x844 iPhone 14 / モダンモバイル)
        # ----------------------------------------------------
        await page.set_viewport_size({"width": 390, "height": 844})
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(OUT / "3_monologue_thought_mobile.png"))
        print(" -> 3_monologue_thought_mobile.png 保存完了")

        # 1行目（NPC発話）に戻してスマホ表示もキャプチャ
        await page.evaluate("""() => {
            window.app.playDialogueSequence([
                {
                    speaker: '隣人アオイ',
                    emotion: 'panic',
                    text: '「ユウタさん……うちのアパート、何か恐ろしい事件に巻き込まれてるんですか……？」',
                    voiceUrl: 'assets/audio/voice/npc_aoi_intro_02.mp3'
                }
            ]);
        }""")
        await page.wait_for_timeout(500)
        await page.screenshot(path=str(OUT / "4_npc_speaking_mobile.png"))
        print(" -> 4_npc_speaking_mobile.png 保存完了")

        await browser.close()

    print("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(verify())
