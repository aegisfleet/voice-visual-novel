import os
import sys
import base64
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# UTF-8 出力を設定
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()
project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")

if not project_id:
    print("エラー: .env に GOOGLE_CLOUD_PROJECT を設定してください。")
    exit(1)

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

output_dir = Path("assets/audio")
output_dir.mkdir(parents=True, exist_ok=True)

BGM_TRACKS = [
    {
        "file": "bgm_title.mp3",
        "title": "メインタイトル＆プロローグ",
        "prompt": "A dark cyberpunk ambient synthwave instrumental track, slow pulsating analog synth bassline, futuristic city night, mysterious crime scene investigation tone, loopable, 90 BPM"
    },
    {
        "file": "bgm_investigation.mp3",
        "title": "現場捜査・推理パート",
        "prompt": "A subtle electronic investigation theme, minimal technological beats, ticking clock motif, focused crime scene deduction, noir cyber atmosphere, soft synth pads, loopable, 95 BPM"
    },
    {
        "file": "bgm_crisis.mp3",
        "title": "取調室・カウントダウン危機・対決",
        "prompt": "An intense high-stakes cyberpunk orchestral hybrid track, driving fast synth bass arpeggio, urgent cinematic tension, countdown alarm rhythm, courtroom showdown climax, 128 BPM"
    },
    {
        "file": "bgm_truth.mp3",
        "title": "真相解明・感動のトゥルーエンド",
        "prompt": "An emotional and hopeful cyberpunk cinematic piano theme with warm analog strings, gentle ambient synths, heartfelt and touching family resolution, bittersweet yet warm, loopable, 80 BPM"
    }
]

def main():
    print("==================================================")
    print("Vertex AI (Lyria 3): シーン別BGM一括生成")
    print("==================================================")

    for i, track in enumerate(BGM_TRACKS):
        filename = track["file"]
        title = track["title"]
        prompt = track["prompt"]
        final_path = output_dir / filename

        print(f"\n[{i+1}/{len(BGM_TRACKS)}] 生成中: {title} -> {filename}")

        try:
            inter = client.interactions.create(
                model="lyria-3-clip-preview",
                input=prompt
            )

            ac = inter.output_audio
            if ac and ac.data:
                raw_bytes = base64.b64decode(ac.data) if isinstance(ac.data, str) else ac.data
                with open(final_path, "wb") as f:
                    f.write(raw_bytes)
                print(f"-> 生成完了: {final_path} ({len(raw_bytes) / 1024:.1f} KB)")

                # 自然フェードアウト＆余韻インターバル加工
                try:
                    from process_fade_bgm import process_fade_out_bgm
                    temp_fade = output_dir / f"fade_{filename}"
                    process_fade_out_bgm(final_path, temp_fade, fade_out_sec=3.5, silence_tail_sec=1.5, fade_in_sec=0.5)
                    temp_fade.replace(final_path)
                    print(f"-> 自然フェードアウト加工完了: {filename}")
                except Exception as fade_err:
                    print(f"-> フェード加工警告 (元ファイルを維持): {fade_err}")
            else:
                print("-> 音声データが取得できませんでした")

        except Exception as e:
            print(f"-> 生成エラー: {e}")

    print("\n==================================================")
    print("BGM全4曲の生成が完了しました！")
    print("==================================================")

if __name__ == "__main__":
    main()
