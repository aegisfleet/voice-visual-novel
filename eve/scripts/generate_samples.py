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

import sys

output_dir = Path("eve/assets/audio/samples") if Path("eve").exists() else Path("assets/audio/samples")
output_dir.mkdir(parents=True, exist_ok=True)
output_dirs = [output_dir]

CHARACTER_SAMPLES = [
    {
        "id": "sample_eve",
        "name": "イブ (少女アンドロイド)",
        "voice": "Leda",
        "style": "delicate, gentle, sweet young girl, soft, natural, heartfelt, sincere",
        "text": "私は……ユイ様を守るために作られました。違法パッチの適用は、ユイ様の生命を救うための唯一の選択でした。"
    },
    {
        "id": "sample_sakuma",
        "name": "サクマ警視 (年配ベテラン刑事)",
        "voice": "Charon",
        "style": "deep rough voice, aged veteran detective, furious, slamming the desk, authoritative and commanding",
        "text": "総員、聞け！すでにダークウェブ上にデータの一部が暴露されている！プロキシの壁を突き崩し、首謀者を割り出せ！！"
    },
    {
        "id": "sample_misato",
        "name": "シノハラ（母親・篠原ミサト）",
        "voice": "Aoede",
        "style": "desperate, terrified, trembling voice, tearful mother pleading for her child's life",
        "text": "お願いです……娘を……ユイを助けてください！あのMODを使ったのは私なんです！イブは何も悪くありません！"
    },
    {
        "id": "sample_azuma",
        "name": "アズマ捜査官 (主人公/先輩)",
        "voice": "Puck",
        "style": "confident, passionate young cyber investigator, investigation drama, loud and clear objection",
        "text": "待ってください！被疑者AIの行動ログには、明らかな外部遠隔介入の痕跡が存在します！真の首謀者は他にいる！"
    },
    {
        "id": "sample_narrator",
        "name": "ナレーション (システム)",
        "voice": "Puck",
        "style": "clear, crisp, intelligent, composed young narrator, engaging cyberpunk story",
        "text": "西暦2098年、未曾有のサイバークライシスが発生。国家厚生・金融クラウドから機密データが突如流出した。"
    }
]

def main():
    target_id = None
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_id = sys.argv[idx + 1]

    print("==================================================")
    print("SpeechMetadata方式によるキャラクターサンプル再生成")
    print("（指示文の読み上げ混入を100%防止）")
    if target_id:
        print(f"対象ID: {target_id}")
    print("==================================================")

    targets = [c for c in CHARACTER_SAMPLES if not target_id or c["id"] == target_id]
    if not targets:
        print(f"エラー: 指定されたID '{target_id}' が見つかりません。")
        return

    for char in targets:
        print(f"\n生成中: {char['name']} (Voice: {char['voice']})")
        print(f"セリフ: 「{char['text']}」")

        resp = client.models.generate_content(
            model="gemini-3.8-flash-tts",
            contents=types.Content(
                role="user",
                parts=[
                    types.Part(
                        text=char["text"], # 純粋なセリフのみ
                        speech_metadata=types.SpeechMetadata(style=char["style"]) # 演技指示
                    )
                ]
            ),
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=char["voice"]
                        )
                    )
                )
            )
        )

        audio_bytes = resp.candidates[0].content.parts[0].inline_data.data
        for out_d in output_dirs:
            output_path = out_d / f"{char['id']}.wav"
            with open(output_path, "wb") as f:
                f.write(audio_bytes)
            print(f"-> 保存成功: {output_path} ({len(audio_bytes)} bytes)")

    print("\nサンプルの再生成が完了しました！")

if __name__ == "__main__":
    main()
