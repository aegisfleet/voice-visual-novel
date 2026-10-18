import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

sys.stdout.reconfigure(encoding="utf-8")
load_dotenv()

project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

STYLE_YAEGASHI = "elderly Japanese grandpa landlord in his 70s, raspy hoarse gravelly old man voice, weathered vocal cords, talkative hearty neighborhood elder, rustic, clear Japanese articulation"

# 読み仮名補正
text = "ぶいえーらん……？ 何だその難しい横文字は！ 専門業者に頼むと工事費が何十万もかかるから、ワシが管理人室の光回線から安物の16ポートハブで、全15室へ壁伝いにLANケーブルを直結しただけじゃよ！"
# LAN -> ラン
text = text.replace("LAN", "ラン")

temp_wav = Path("box/assets/audio/voice/npc_yaegashi_c0_02_temp.wav")
mp3_path = Path("box/assets/audio/voice/npc_yaegashi_c0_02.mp3")

print(f"Generating voice for npc_yaegashi_c0_02 with text: {text}")

response = client.models.generate_content(
    model="gemini-3.8-flash-tts",
    contents=types.Content(
        role="user",
        parts=[
            types.Part(
                text=text,
                speech_metadata=types.SpeechMetadata(style=STYLE_YAEGASHI)
            )
        ]
    ),
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Algenib"
                )
            )
        )
    )
)

audio_data = response.candidates[0].content.parts[0].inline_data.data
with open(temp_wav, "wb") as f:
    f.write(audio_data)

cmd = [
    "ffmpeg", "-y",
    "-i", str(temp_wav),
    "-filter:a", "atempo=1.18",
    "-codec:a", "libmp3lame",
    "-b:a", "128k",
    str(mp3_path)
]
subprocess.run(cmd, check=True)
if temp_wav.exists():
    temp_wav.unlink()

print("Successfully regenerated npc_yaegashi_c0_02.mp3!")
