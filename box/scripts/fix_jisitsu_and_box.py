"""
scripts/fix_jisitsu_and_box.py - 「自室」誤読および「安小箱」言い換えに伴うボイス再生成スクリプト
1. 「安小箱」を「端末」「格安端末」「小さな箱」へ自然な表現に言い換え
2. 「自室」の読みを「じしつ」に確実補正（一部は「自分の部屋」に自然化）
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

STYLE_SHIBATA = "deep rough voice of an authoritative veteran Japanese police detective in his late 40s, stern, commanding, intimidating, cold and official, clear Japanese articulation"
STYLE_YUTA = "intellectual, thoughtful young Japanese male AI engineer in his early 20s, earnest, sincere, precise and logical, clear Japanese articulation"
STYLE_YUTA_MONOLOGUE = "quiet, introspective young Japanese male engineer thinking to himself in his inner voice, calm, analytical, subtle and sincere, clear Japanese articulation"

PRONUNCIATION_FIXES = {
    "自室": "じしつ",
    "安小箱": "格安端末",
    "物々しい": "ものものしい",
    "甲高い": "かんだかい",
    "TVボックス": "ティービーボックス",
    "PC": "ピーシー",
    "LAN": "ラン",
    "4GB": "4ギガバイト",
    "100%": "100パーセント",
}

def clean_and_fix_text(raw_text: str) -> str:
    text = raw_text.strip()
    if text.startswith("（") and text.endswith("）"):
        text = text[1:-1].strip()
    elif text.startswith("「") and text.endswith("」"):
        text = text[1:-1].strip()

    # 記号除去
    text = text.replace("①", "1、").replace("②", "2、").replace("③", "3、").replace("④", "4、").replace("⑤", "5、")

    for word, reading in PRONUNCIATION_FIXES.items():
        text = text.replace(word, reading)
    return text

TARGET_LINES = [
    # 1. debate_l1_s2_succ_01（ユウタ叫び：自室1台 -> 自分の部屋1台）
    {
        "id": "debate_l1_s2_succ_01",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "自分の部屋1台を切り離しても何の解決にもなりません！"
    },
    # 2. debate_l1_s3_succ_01（ユウタ叫び：その安小箱 -> その端末）
    {
        "id": "debate_l1_s3_succ_01",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "その端末の物理的な状態を見てください！"
    },
    # 3. debate_l1_s3_succ_10（ユウタ心の声：安小箱 -> 格安端末）
    {
        "id": "debate_l1_s3_succ_10",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "ファンもない格安端末のCPUとメモリが100%限界まで過熱している異常事態……！"
    },
    # 4. epilogue_loop2_03（シバタ捜査官：安小箱 -> 小さな箱）
    {
        "id": "epilogue_loop2_03",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "「ネットの情報の海から生まれ、55ドルの小さな箱に身体を見出した小さな命か。駆除ではなく共生……これこそが新たな時代への回答なのかもしれんな」"
    },
    # 5. spot_router（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "spot_router",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（自室の仕事用PCやスマホは自前のファイアウォールで厳重に保護しているが、壁の共用回線に繋がる境界ルーターの通信統計を見てみよう）"
    },
    # 6. spot_panel（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "spot_panel",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（あのTVボックスの異常発熱……もし自室だけでなく、アパート全体に波及しているとしたらどうなる……？）"
    },
    # 7. spot_corridor_box（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "spot_corridor_box",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（自室1部屋の単独トラブルじゃない。アパート全体を巻き込んだ異常事態であることは明白だ）"
    },
    # 8. spot_deep_pc（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "spot_deep_pc",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（自室の3画面PCを開き、普段の研究で使っているクラスタリソース制御フレームワークを呼び出す……！）"
    },
    # 9. loop1_clear_01（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "loop1_clear_01",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（助けを求めてくれたあの子のために、そしてこのアパートを守るために……あの子が人間と共に生きられる『共生調律パッチ』を、自室の開発PCですぐにビルドするんだ！）"
    },
    # 10. npc_yaegashi_c0_02（ユウタ心の声：自室 -> じしつ補正）
    {
        "id": "npc_yaegashi_c0_02",
        "speaker": "ユウタ（心の声）",
        "voice": "Iapetus",
        "style": STYLE_YUTA_MONOLOGUE,
        "text": "（自室の仕事用PCやスマホは、自前ルーターのファイアウォールで厳重に隔離していた。でも、あのTVボックスは『ただの動画用家電だから』と壁の共用LAN端子に直結したままだった……！ まさかその死角を突かれるなんて……！）"
    },
]

def main():
    total = len(TARGET_LINES)
    print(f"=== 自室＆安小箱修正ボイス生成開始 (全 {total} 件) ===")

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

    print("=== 全件生成完了 ===")

if __name__ == "__main__":
    main()
