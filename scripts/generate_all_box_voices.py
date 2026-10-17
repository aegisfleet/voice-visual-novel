"""
scripts/generate_all_box_voices.py - BOX WORM 全シナリオ音声一括生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、ゲーム内全シナリオ（全253セリフ）の音声を生成し、
テンポ感の高い早口 MP3 (128kbps, atempo=1.18) として保存する。
一時 WAV ファイルは生成後に即時自動削除する。
"""
import os
import sys
import time
import json
import shutil
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

PROLOGUE_DIR = Path("box/assets/audio/prologue")

# ----------------------------------------------------
# キャラクターごとの統一基本スタイル定義 (一貫性の担保)
# ----------------------------------------------------
STYLE_NARRATOR = "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation"
STYLE_SHIBATA = "deep rough voice of an authoritative veteran Japanese police detective in his late 40s, stern, commanding, intimidating, cold and official, clear Japanese articulation"
STYLE_YUTA = "intellectual, thoughtful young Japanese male AI engineer in his early 20s, earnest, sincere, precise and logical, clear Japanese articulation"
STYLE_YUTA_MONOLOGUE = "quiet, introspective young Japanese male engineer thinking to himself in his inner voice, calm, analytical, subtle and sincere, clear Japanese articulation"
STYLE_AOI = "young Japanese college girl, higher cute pitch, sweet young university student, delicate and youthful, clear Japanese articulation"
STYLE_YAEGASHI = "elderly Japanese grandpa landlord in his 70s, raspy hoarse gravelly old man voice, weathered vocal cords, talkative hearty neighborhood elder, rustic, clear Japanese articulation"
STYLE_MIMI = "clear, articulate, gentle ethereal cyber girl, sweet, transparent, softly emotional, speaking clearly in Japanese with subtle digital warmth"

# ----------------------------------------------------
# 読み仮名・誤読補正辞書
# ----------------------------------------------------
PRONUNCIATION_FIXES = {
    "自室": "じしつ",
    "安小箱": "格安端末",
    "物々しい": "ものものしい",
    "甲高い": "かんだかい",
    "ArXiv": "アーカイブ",
    "Linux": "リナックス",
    "VLAN": "ブイラン",
    "WAN": "ワン",
    "CTロガー": "シーティーロガー",
    "TVボックス": "ティービーボックス",
    "Wi-Fi": "ワイファイ",
    "WiFi": "ワイファイ",
    "HDMI": "エイチディーエムアイ",
    "80℃": "80度",
    "85℃": "85度",
    "15W": "15ワット",
    "2.56秒": "2点56秒",
    "0.39": "0点39",
    "100%": "100パーセント",
}

def clean_and_fix_text(speaker: str, raw_text: str) -> str:
    text = raw_text.strip()
    
    # 括弧のクリーニング
    if text.startswith("（") and text.endswith("）"):
        text = text[1:-1].strip()
    elif text.startswith("「") and text.endswith("」"):
        text = text[1:-1].strip()
    
    # 【証言獲得】などの装飾
    text = text.replace("【証言獲得】", "証言獲得。")
    text = text.replace("【証拠獲得】", "証拠獲得。")

    for word, reading in PRONUNCIATION_FIXES.items():
        text = text.replace(word, reading)
        
    return text

def get_voice_and_style(speaker: str):
    if "ナレーション" in speaker:
        return "Fenrir", STYLE_NARRATOR
    elif "シバタ" in speaker or speaker == "？？？":
        return "Charon", STYLE_SHIBATA
    elif "心の声" in speaker:
        return "Iapetus", STYLE_YUTA_MONOLOGUE
    elif "ユウタ" in speaker:
        return "Iapetus", STYLE_YUTA
    elif "アオイ" in speaker:
        return "Leda", STYLE_AOI
    elif "ヤエガシ" in speaker:
        return "Algenib", STYLE_YAEGASHI
    elif "MIMI" in speaker or "電子の少女" in speaker or "電子の声" in speaker:
        return "Zephyr", STYLE_MIMI
    else:
        # デフォルトはナレーション
        return "Fenrir", STYLE_NARRATOR

def main():
    dialogues_path = Path("scripts/all_dialogues.json")
    if not dialogues_path.exists():
        print("エラー: scripts/all_dialogues.json が見つかりません。")
        sys.exit(1)

    with open(dialogues_path, "r", encoding="utf-8") as f:
        dialogues = json.load(f)

    total_count = len(dialogues)
    print(f"=== 全シナリオボイス一括生成開始 (全 {total_count} セリフ) ===")

    success_count = 0
    skipped_count = 0

    for idx, item in enumerate(dialogues, 1):
        line_id = item["id"]
        speaker = item.get("speaker", "ナレーション")
        raw_text = item.get("text", "")
        
        mp3_filename = f"{line_id}.mp3"
        mp3_path = OUTPUT_DIR / mp3_filename

        # すでに生成済みの場合はスキップ
        if mp3_path.exists() and mp3_path.stat().st_size > 1000:
            skipped_count += 1
            continue

        # プロローグの既存ファイルがあればコピーして流用
        if line_id.startswith("prologue_"):
            src_prologue = PROLOGUE_DIR / mp3_filename
            if src_prologue.exists() and src_prologue.stat().st_size > 1000:
                shutil.copy2(src_prologue, mp3_path)
                print(f"[{idx:03d}/{total_count}] {line_id}: 既存プロローグMP3からコピーしました。")
                success_count += 1
                continue

        voice_name, style_prompt = get_voice_and_style(speaker)
        tts_text = clean_and_fix_text(speaker, raw_text)

        print(f"[{idx:03d}/{total_count}] 生成中: {line_id} ({speaker} / {voice_name}) -> '{tts_text[:28]}...'")

        # リトライ処理
        max_retries = 3
        temp_wav_path = OUTPUT_DIR / f"{line_id}_temp.wav"

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
                    raise ValueError("音声データがレスポンスに含まれていません")

                # 一時 WAV に書き込み
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
                print(f"  -> MP3生成成功 ({mp3_size} bytes)", flush=True)
                success_count += 1
                # レートリミット対策で少し待機
                time.sleep(0.4)
                break

            except Exception as e:
                print(f"  警告: 試行 {attempt}/{max_retries} 失敗: {e}")
                if attempt == max_retries:
                    print(f"  エラー: {line_id} の生成に失敗しました。")
                else:
                    time.sleep(attempt * 1.5)

            finally:
                # 一時 WAV は即座に削除
                if temp_wav_path.exists():
                    try:
                        temp_wav_path.unlink()
                    except Exception:
                        pass

    print(f"\n=== 音声生成完了 ===")
    print(f"総台詞数: {total_count}")
    print(f"新規作成/コピー: {success_count}")
    print(f"スキップ（既存）: {skipped_count}")
    print(f"保存先: {OUTPUT_DIR.resolve()}")

if __name__ == "__main__":
    main()
