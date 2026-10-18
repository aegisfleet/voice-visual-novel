# -*- coding: utf-8 -*-
"""
Generate English voices for all 65 scenes using Gemini 3.8 Flash TTS
Compresses output to MP3 (128kbps) using ffmpeg.
"""

import os
import sys
import time
import tempfile
import subprocess
from pathlib import Path

# Add script dir and repo root to sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))

# Reconfigure stdout/stderr to UTF-8 for Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
from google import genai
from google.genai import types

try:
    from english_translations import ENGLISH_SCENES
except ImportError:
    from eve.scripts.english_translations import ENGLISH_SCENES

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

output_dir = REPO_ROOT / "eve/assets/audio/en"
output_dir.mkdir(parents=True, exist_ok=True)

def generate_scene_voice(scene, index, total, force=False):
    scene_id = scene["id"]
    speaker = scene["speakerEn"] or "Narrator"
    voice_name = scene["voice"]
    style = scene["style"]
    text = scene["textEn"]
    final_path = output_dir / f"{scene_id}.mp3"

    if final_path.exists() and not force:
        print(f"[{index+1}/{total}] スキップ (既存): {final_path.name}")
        return True

    print(f"\n[{index+1}/{total}] 生成中: [{speaker}] ({voice_name}) -> {final_path.name}")
    short_text = text[:50] + "..." if len(text) > 50 else text
    print(f"セリフ: \"{short_text}\"")

    max_retries = 3
    for attempt in range(max_retries):
        try:
            resp = client.models.generate_content(
                model="gemini-3.8-flash-tts",
                contents=types.Content(
                    role="user",
                    parts=[
                        types.Part(
                            text=text,
                            speech_metadata=types.SpeechMetadata(style=style)
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

            audio_bytes = resp.candidates[0].content.parts[0].inline_data.data

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
                tmp_wav_path = tmp_wav.name
                tmp_wav.write(audio_bytes)

            try:
                cmd = [
                    "ffmpeg", "-y", "-i", tmp_wav_path,
                    "-codec:a", "libmp3lame",
                    "-b:a", "128k",
                    str(final_path)
                ]
                subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
                print(f"-> 完了: {final_path.name} ({final_path.stat().st_size / 1024:.1f} KB)")
                return True
            finally:
                if os.path.exists(tmp_wav_path):
                    os.remove(tmp_wav_path)

        except Exception as e:
            print(f"-> リトライ {attempt+1}/{max_retries} エラー ({scene_id}): {e}")
            time.sleep(2)

    return False

def main():
    force = "--force" in sys.argv
    only_azuma = "--azuma" in sys.argv
    target_scenes = None

    if "--scenes" in sys.argv:
        idx = sys.argv.index("--scenes")
        if idx + 1 < len(sys.argv):
            target_scenes = set(sys.argv[idx + 1].split(","))

    azuma_scene_ids = {
        "prologue_06", "home_search_interrogate", "home_search_childroom",
        "bad_route_01", "truth_route_01", "truth_route_02", "truth_route_02_b",
        "truth_route_06", "truth_route_11", "truth_route_12"
    }

    if only_azuma:
        target_scenes = azuma_scene_ids
        force = True

    scenes_to_run = [
        s for s in ENGLISH_SCENES
        if not target_scenes or s["id"] in target_scenes
    ]

    total = len(scenes_to_run)
    print("==================================================")
    print(f"Vertex AI: 英語音声 対象 {total} シーン ボイス生成開始")
    print(f"モデル: gemini-3.8-flash-tts, 出力先: {output_dir}")
    if target_scenes:
        print(f"指定シーン: {sorted(list(target_scenes))}")
    print("==================================================")

    success_count = 0
    fail_count = 0

    for i, scene in enumerate(scenes_to_run):
        success = generate_scene_voice(scene, i, total, force=force)
        if success:
            success_count += 1
        else:
            fail_count += 1
        time.sleep(0.5)

    print("\n==================================================")
    print(f"英語ボイス生成完了！ 成功: {success_count}/{total}, 失敗: {fail_count}")
    print("==================================================")

if __name__ == "__main__":
    main()
