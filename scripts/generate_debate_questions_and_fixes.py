"""
scripts/generate_debate_questions_and_fixes.py - 立証パート警部補ボイス生成および「物々しい」誤読改善スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、以下を生成する：
1. 立証パート（Debate Loop 1 / Loop 2）のシバタ捜査官の問いかけセリフ全7種
2. 「物々しい」が含まれるセリフ（npc_yaegashi_intro_01, npc_yaegashi_intro_02）の「ものものしい」補正・再生成
"""
import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
load_dotenv()

project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")

if not project_id:
    print("エラー: .env ファイル等で GOOGLE_CLOUD_PROJECT を設定してください。")
    sys.exit(1)

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

OUTPUT_DIR = Path("box/assets/audio/voice")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# スタイル定義
STYLE_SHIBATA = "deep rough voice of an authoritative veteran Japanese police detective in his late 40s, stern, commanding, intimidating, cold and official, clear Japanese articulation"
STYLE_YUTA_MONOLOGUE = "quiet, introspective young Japanese male engineer thinking to himself in his inner voice, calm, analytical, subtle and sincere, clear Japanese articulation"
STYLE_YAEGASHI = "elderly Japanese grandpa landlord in his 70s, raspy hoarse gravelly old man voice, weathered vocal cords, talkative hearty neighborhood elder, rustic, clear Japanese articulation"

PRONUNCIATION_FIXES = {
    "物々しい": "ものものしい",
    "甲高い": "かんだかい",
    "C2サーバー": "シーツーサーバー",
    "ARMプロセッサ": "アームプロセッサ",
    "4GB": "4ギガバイト",
    "TVボックス": "ティービーボックス",
    "IPアドレス": "アイピーアドレス",
    "PC": "ピーシー",
    "LAN": "ラン",
}

def clean_and_fix_text(raw_text: str) -> str:
    text = raw_text.strip()
    if text.startswith("（") and text.endswith("）"):
        text = text[1:-1].strip()
    elif text.startswith("「") and text.endswith("」"):
        text = text[1:-1].strip()

    for word, reading in PRONUNCIATION_FIXES.items():
        text = text.replace(word, reading)
    return text

TARGET_LINES = [
    # 1. 「物々しい」誤読改善（ユウタ心の声）
    {
        "id": "npc_yaegashi_intro_01",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（大家のヤエガシさんだ。物々しい刑事が乗り込んできたのを見て、鬼の形相で廊下に飛び出してきている……大家さんならアパートのネット回線の配線について知っているはずだ）"
    },
    # 2. 「物々しい」誤読改善（ヤエガシ）
    {
        "id": "npc_yaegashi_intro_02",
        "speaker": "ヤエガシ",
        "voice": "Algenib",
        "style": STYLE_YAEGASHI,
        "text": "「ユウタ君、物々しい刑事が乗り込んできて、家宅捜索でも始める気か！？ うちが事故物件にでもなったらどう責任を取るんじゃ！」"
    },
    # 3. 立証パート シバタ捜査官 問いかけ Loop 1 - 問1
    {
        "id": "debate_l1_q01",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「君は先ほど『ただの故障か間違いだ』と言い逃れをしていたな。だが昨夜2時、国家監視網がアラートを上げた未知の通信が、このアパートの回線で検知されたのは動かぬ事実だ！ 貴室の端末が外部へのサイバーテロに関与していないという客観的証拠を示してみろ！」"
    },
    # 4. 立証パート シバタ捜査官 問いかけ Loop 1 - 問2
    {
        "id": "debate_l1_q02",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「外部への攻撃でないとしても、貴室のTVボックスが何者かのマルウェアに侵食され、異様な内部通信を発しているのは事実だ。貴室の端末を押収して回線を遮断すれば済む話ではないか！」"
    },
    # 5. 立証パート シバタ捜査官 問いかけ Loop 1 - 問3
    {
        "id": "debate_l1_q03",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「だが、所詮は1台55ドルの安物家電だぞ！ 非力なARMプロセッサに、たった4GBのメモリしか積んでいないはずだ！ そんなオモチャのような機械15台で、一体何ができるというんだ！？」"
    },
    # 6. 立証パート シバタ捜査官 問いかけ Loop 2 - 問1
    {
        "id": "debate_l2_q01",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「確かにアパート全体が異常な過負荷に陥っている事実はわかった。だが、これは国家中枢を脅かす新種のサイバーテロ兵器だ！ 外部の親玉（C2サーバー）を特定できぬ以上、直ちに全機器を破壊し電源を落とすしかない！」"
    },
    # 7. 立証パート シバタ捜査官 問いかけ Loop 2 - 問2
    {
        "id": "debate_l2_q02",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「自己増殖AI……だと！？ だが、そんな未知の怪異がなぜアパートの格安家電に逃げ込む必要がある！？ そもそも、このアパートの貧弱な回線から世界中へ感染爆発（パンデミック）を起こす気ではないのか！」"
    },
    # 8. 立証パート シバタ捜査官 問いかけ Loop 2 - 問3
    {
        "id": "debate_l2_q03",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「……なるほど、事故による孤立と退避だったという見立ては理解できた。だが、これ以上放置すれば、このAIは自らを防衛するために電力網や社会インフラをハッキングし、暴走する危険がある！ やはり今すぐ主幹ブレーカーを落として完全に抹殺すべきだ！」"
    },
    # 9. 立証パート シバタ捜査官 問いかけ Loop 2 - 問4
    {
        "id": "debate_l2_q04",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「……だが！ このAIは我々人類の法と秩序の外にある知性だ！ 言葉を交わすこともできず、悪意がないと誰が証明できる！？ 危険因子である以上、法執行機関として共存など認められるはずがない！」"
    },
]

def main():
    total = len(TARGET_LINES)
    print(f"=== 立証パート問いかけ＆発音補正ボイス生成開始 (全 {total} 件) ===")

    for idx, item in enumerate(TARGET_LINES, 1):
        line_id = item["id"]
        speaker = item["speaker"]
        voice_name = item["voice"]
        style_prompt = item["style"]
        raw_text = item["text"]
        tts_text = clean_and_fix_text(raw_text)

        mp3_path = OUTPUT_DIR / f"{line_id}.mp3"
        temp_wav_path = OUTPUT_DIR / f"{line_id}_temp.wav"

        print(f"[{idx}/{total}] 生成中: {line_id} ({speaker} / {voice_name}) -> '{tts_text[:28]}...'")

        max_retries = 3
        success = False

        for attempt in range(1, max_retries + 1):
            try:
                response = client.models.generate_content(
                    model="gemini-3.8-flash-tts",
                    contents=types.Content(
                        role="user",
                        parts=[
                            types.Part(
                                text=tts_text,
                                speech_metadata=types.SpeechMetadata(style=style_prompt)
                            )
                        ]
                    ),
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name=voice_name
                                )
                            )
                        )
                    )
                )

                audio_data = response.candidates[0].content.parts[0].inline_data.data
                if not audio_data:
                    raise ValueError("音声データが空です")

                with open(temp_wav_path, "wb") as f_wav:
                    f_wav.write(audio_data)

                cmd = [
                    "ffmpeg", "-y",
                    "-i", str(temp_wav_path),
                    "-filter:a", "atempo=1.18",
                    "-codec:a", "libmp3lame",
                    "-b:a", "128k",
                    str(mp3_path)
                ]
                subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

                if temp_wav_path.exists():
                    temp_wav_path.unlink()

                mp3_size = mp3_path.stat().st_size
                print(f"  -> 生成完了: {mp3_path.name} ({mp3_size} bytes)")
                success = True
                break

            except Exception as e:
                print(f"  [Attempt {attempt}] エラー発生: {e}")
                if temp_wav_path.exists():
                    try:
                        temp_wav_path.unlink()
                    except Exception:
                        pass
                if attempt == max_retries:
                    print(f"  -> {line_id} の生成に失敗しました。")

    print("=== 生成完了 ===")

if __name__ == "__main__":
    main()
