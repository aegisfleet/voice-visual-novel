import os
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

output_dir = Path("assets/audio/samples")
output_dir.mkdir(parents=True, exist_ok=True)

TEXT = "西暦2098年、未曾有のサイバークライシスが発生。国家厚生・金融クラウドから機密データが突如流出した。"

NARRATOR_CANDIDATES = [
    {
        "id": "sample_narrator_orus_doc",
        "name": "案1: Orus (知的・落ち着いたドキュメンタリー調)",
        "voice": "Orus",
        "style": "calm, measured, intelligent documentary narrator, articulate, steady and natural storytelling",
        "desc": "現行のOrusの重低音を活かしつつ、誇張した重厚感を抑えて落ち着いた知的な語り口にしたスタイル"
    },
    {
        "id": "sample_narrator_puck",
        "name": "案2: Puck (明晰・若々しいストーリーテラー)",
        "voice": "Puck",
        "style": "clear, crisp, intelligent, composed young narrator, engaging cyberpunk story",
        "desc": "重々しさを払拭し、クリアでテンポが良く聴き取りやすい現代的なトーン"
    },
    {
        "id": "sample_narrator_fenrir",
        "name": "案3: Fenrir (ハードボイルド・渋い大人のノワール低音)",
        "voice": "Fenrir",
        "style": "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice",
        "desc": "渋みとハスキーさを帯びた大人の低音。サイバーパンク・ノワール映画のような雰囲気"
    },
    {
        "id": "sample_narrator_zephyr",
        "name": "案4: Zephyr (洗練された知的女性AI・アナウンス調)",
        "voice": "Zephyr",
        "style": "cool, intelligent, articulate, clear female system narrator, calm and authoritative announcement",
        "desc": "女性ナレーター案。透明感と知性があり、高度AIシステムによるニュース・記録調の語り口"
    },
    {
        "id": "sample_narrator_kore",
        "name": "案5: Kore (静謐・冷徹なオブザーバーAI / 女性)",
        "voice": "Kore",
        "style": "solemn, serene, detached, mysterious cyberpunk AI observer, steady and precise",
        "desc": "感情を抑えた静謐な女性AI。世界を客観的に観察・記録する電脳アーカイブ調"
    }
]

def main():
    print("==================================================")
    print("ナレーター音声 新規比較サンプル生成")
    print("==================================================")

    for cand in NARRATOR_CANDIDATES:
        output_path = output_dir / f"{cand['id']}.wav"
        print(f"\n生成中: {cand['name']} (Voice: {cand['voice']})")
        print(f"指示スタイル: {cand['style']}")
        
        resp = client.models.generate_content(
            model="gemini-3.8-flash-tts",
            contents=types.Content(
                role="user",
                parts=[
                    types.Part(
                        text=TEXT,
                        speech_metadata=types.SpeechMetadata(style=cand["style"])
                    )
                ]
            ),
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=cand["voice"]
                        )
                    )
                )
            )
        )

        audio_bytes = resp.candidates[0].content.parts[0].inline_data.data
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        print(f"-> 完了: {output_path} ({len(audio_bytes)} bytes)")

    print("\nナレーター比較サンプルの生成が完了しました！")

if __name__ == "__main__":
    main()
