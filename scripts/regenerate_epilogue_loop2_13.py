"""
scripts/regenerate_epilogue_loop2_13.py - epilogue_loop2_13 音声再生成スクリプト
「擦り切れてしまう」の誤読（「そりきれて」）を「すりきれてしまう」に補正して再生成する。
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

STYLE_YUTA = "intellectual, thoughtful young Japanese male AI engineer in his early 20s, earnest, sincere, precise and logical, clear Japanese articulation"

# ユウタ発言：epilogue_loop2_13
# 元テキスト: 「このままじゃ、会話を交わすだけで全身が擦り切れてしまう……！ せっかく生き残れたのに、こんな窮屈なハードウェアに閉じ込めておくなんてできない！」
# 補正テキスト: 「このままじゃ、会話を交わすだけで全身がすりきれてしまう……！ せっかく生き残れたのに、こんな窮屈なハードウェアに閉じ込めておくなんてできない！」
raw_text = "このままじゃ、会話を交わすだけで全身がすりきれてしまう……！ せっかく生き残れたのに、こんな窮屈なハードウェアに閉じ込めておくなんてできない！"
line_id = "epilogue_loop2_13"
voice_name = "Iapetus"

temp_wav_path = OUTPUT_DIR / f"{line_id}_temp.wav"
mp3_path = OUTPUT_DIR / f"{line_id}.mp3"

print(f"=== {line_id} 音声再生成開始 ===")
print(f"話者: ユウタ ({voice_name})")
print(f"TTSテキスト: {raw_text}")

try:
    response = client.models.generate_content(
        model="gemini-3.8-flash-tts",
        contents=types.Content(
            role="user",
            parts=[
                types.Part(
                    text=raw_text,
                    speech_metadata=types.SpeechMetadata(style=STYLE_YUTA)
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
        raise ValueError("音声データがレスポンスに含まれていません")

    with open(temp_wav_path, "wb") as f_wav:
        f_wav.write(audio_data)

    # FFmpeg で atempo=1.18 高速化 & 128kbps MP3 変換
    cmd = [
        "ffmpeg", "-y",
        "-i", str(temp_wav_path),
        "-filter:a", "atempo=1.18",
        "-codec:a", "libmp3lame",
        "-b:a", "128k",
        str(mp3_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    mp3_size = mp3_path.stat().st_size
    print(f"-> MP3再生成成功: {mp3_path} ({mp3_size} bytes)")

except Exception as e:
    print(f"エラー: {e}")
    sys.exit(1)
finally:
    if temp_wav_path.exists():
        try:
            temp_wav_path.unlink()
        except Exception:
            pass

print("=== 再生成完了 ===")
