import os
import re
import json
import subprocess
import tempfile
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")

if not project_id:
    print("エラー: .env ファイル等で GOOGLE_CLOUD_PROJECT を設定してください。")
    exit(1)

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

output_dir = Path("eve/assets/audio") if Path("eve").exists() else Path("assets/audio")
output_dir.mkdir(parents=True, exist_ok=True)
output_dirs = [output_dir]

# 話者ごとのボイス ＆ SpeechMetadata スタイル設定
VOICE_PROFILES = {
    "イブ": {
        "voice": "Leda",
        "style": "delicate, gentle, sweet young girl, soft, natural, heartfelt, sincere"
    },
    "サクマ警視": {
        "voice": "Charon",
        "style": "deep rough voice, aged veteran detective, authoritative, loud and commanding"
    },
    "シノハラ": {
        "voice": "Aoede",
        "style": "desperate, terrified, trembling voice, tearful mother pleading for her child's life"
    },
    "アイリス": {
        "voice": "Zephyr",
        "style": "bright, energetic, intelligent young female analyst, articulate, expressive"
    },
    "あなた": {
        "voice": "Puck",
        "style": "confident, passionate young cyber investigator, investigation drama, clear and determined"
    },
    "default": {
        "voice": "Puck",
        "style": "clear, crisp, intelligent, composed young narrator, engaging cyberpunk story"
    }
}

def extract_scenes():
    scenario_path = Path("eve/js/scenario.js") if Path("eve/js/scenario.js").exists() else Path("js/scenario.js")
    with open(scenario_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'const\s+SCENARIO_DATA\s*=\s*\[(.*?)\];\s*(?:window\.|$)', content, re.DOTALL)
    if not match:
        raise ValueError("SCENARIO_DATA が見つかりませんでした")

    body = match.group(1)
    raw_objects = []
    depth = 0
    start_idx = None

    for i, char in enumerate(body):
        if char == '{':
            if depth == 0:
                start_idx = i
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0 and start_idx is not None:
                raw_objects.append(body[start_idx:i+1])
                start_idx = None

    scenes = []
    for obj_str in raw_objects:
        id_m = re.search(r'id:\s*"([^"]+)"', obj_str)
        if not id_m:
            continue
        scene_id = id_m.group(1)

        spk_m = re.search(r'speaker:\s*("([^"]+)"|null)', obj_str)
        speaker = spk_m.group(2) if spk_m and spk_m.group(2) else None

        txt_m = re.search(r'text:\s*"([^"]+)"', obj_str)
        text_val = txt_m.group(1) if txt_m else ""

        scenes.append({
            "id": scene_id,
            "speaker": speaker,
            "text": text_val,
            "file": f"{scene_id}.mp3"
        })

    return scenes

def generate_voice(scene, index, total):
    scene_id = scene["id"]
    speaker = scene["speaker"]
    text = scene["text"]
    filename = scene["file"]
    final_path = output_dir / filename

    profile = VOICE_PROFILES.get(speaker, VOICE_PROFILES["default"])
    voice_name = profile["voice"]
    style = profile["style"]

    print(f"\n[{index+1}/{total}] 生成中: [{speaker or 'ナレーション'}] ({voice_name}) -> {filename}")
    # セリフが長い場合は先頭40文字を表示
    short_text = text[:40] + "..." if len(text) > 40 else text
    print(f"セリフ: 「{short_text}」")

    # SpeechMetadata方式で純粋なテキストのみを合成
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

    # 一時WAVファイルから ffmpeg で 128kbps MP3 に圧縮
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
        tmp_wav_path = tmp_wav.name
        tmp_wav.write(audio_bytes)

    try:
        for out_d in output_dirs:
            target_mp3 = out_d / filename
            cmd = [
                "ffmpeg", "-y", "-i", tmp_wav_path,
                "-codec:a", "libmp3lame",
                "-b:a", "128k",
                str(target_mp3)
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            print(f"-> 完了: {target_mp3} ({target_mp3.stat().st_size / 1024:.1f} KB)")
    finally:
        if os.path.exists(tmp_wav_path):
            os.remove(tmp_wav_path)

def main():
    scenes = extract_scenes()
    total = len(scenes)

    import sys
    narrator_only = "--narrator-only" in sys.argv
    azuma_only = "--azuma" in sys.argv

    if azuma_only:
        scenes = [s for s in scenes if s["speaker"] == "あなた"]
        total = len(scenes)
        print("==================================================")
        print(f"Vertex AI: アズマ捜査官（あなた）のみ ({total} シーン) 再生成開始")
        print("==================================================")
    elif narrator_only:
        scenes = [s for s in scenes if not s["speaker"]]
        total = len(scenes)
        print("==================================================")
        print(f"Vertex AI: ナレーターのみ ({total} シーン) 再生成開始")
        print("==================================================")
    else:
        print("==================================================")
        print(f"Vertex AI: 全シナリオ ({total} シーン) フルボイス一括生成開始")
        print("==================================================")

    # イブの正式採用ボイス (sample_eve_leda.wav) を sample_eve.wav にもコピー
    leda_sample = output_dir / "samples" / "sample_eve_leda.wav"
    main_eve_sample = output_dir / "samples" / "sample_eve.wav"
    if leda_sample.exists():
        with open(leda_sample, "rb") as src, open(main_eve_sample, "wb") as dst:
            dst.write(src.read())
        print(f"イブのメインサンプルに Leda を適用: {main_eve_sample}")

    # ナレーターの正式採用ボイス (sample_narrator_puck.wav) を sample_narrator.wav にもコピー
    narrator_puck_sample = output_dir / "samples" / "sample_narrator_puck.wav"
    main_narrator_sample = output_dir / "samples" / "sample_narrator.wav"
    if narrator_puck_sample.exists():
        with open(narrator_puck_sample, "rb") as src, open(main_narrator_sample, "wb") as dst:
            dst.write(src.read())
        print(f"ナレーターのメインサンプルに Puck を適用: {main_narrator_sample}")

    success_count = 0
    fail_count = 0

    for i, scene in enumerate(scenes):
        try:
            generate_voice(scene, i, total)
            success_count += 1
        except Exception as e:
            print(f"-> エラー発生 ({scene['id']}): {e}")
            fail_count += 1

    print("\n==================================================")
    print(f"全セリフ生成完了！ 成功: {success_count}/{total}, 失敗: {fail_count}")
    print("==================================================")

if __name__ == "__main__":
    main()
