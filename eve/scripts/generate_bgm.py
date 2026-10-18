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

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))

output_dir = REPO_ROOT / "assets/audio"
output_dir.mkdir(parents=True, exist_ok=True)

BGM_TRACKS = [
    {
        "file": "bgm_title.mp3",
        "title": "メインタイトル＆プロローグ",
        "prompt": "A harmonious and atmospheric cyberpunk noir ambient music, warm analog synth pads, clean beautiful minor key chord progression, gentle emotional electronic melody, peaceful yet mysterious futuristic city night, no harsh dissonance, steady 90 BPM"
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
    target_files = [arg for arg in sys.argv[1:] if arg.endswith('.mp3')]
    tracks_to_generate = [t for t in BGM_TRACKS if not target_files or t["file"] in target_files]

    print("==================================================")
    print("Vertex AI (Lyria 3): シーン別BGM生成")
    print("==================================================")

    for i, track in enumerate(tracks_to_generate):
        filename = track["file"]
        title = track["title"]
        prompt = track["prompt"]
        final_path = output_dir / filename

        print(f"\n[{i+1}/{len(tracks_to_generate)}] 生成中: {title} -> {filename}")

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
