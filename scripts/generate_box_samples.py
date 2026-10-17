"""
scripts/generate_box_samples.py - BOX WORM キャラクターボイス生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、各キャラクターのボイスサンプルを生成し、
WAVおよび軽量MP3 (128kbps) として保存する。
"""
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

if not project_id:
    print("エラー: .env ファイル等で GOOGLE_CLOUD_PROJECT を設定してください。")
    sys.exit(1)

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

OUTPUT_DIR = Path("box/assets/audio/samples")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SAMPLES = [
    # ====================================================
    # 1. ユウタ（声の候補を4パターン提供）
    # ====================================================
    {
        "id": "yuta_sample1",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補A: Iapetus（理知・冷静沈着な研究者）",
        "voice": "Iapetus",
        "style": "calm, intellectual, thoughtful young Japanese scientist in his early 20s, precise, logical, sincere and composed",
        "text": "現場の端末たちが手を取り合って一つの知性を紡ぎ出す……それが僕の研究する分散エッジAIです。"
    },
    {
        "id": "yuta_sample2",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補B: Puck（快活・明晰な技術青年）",
        "voice": "Puck",
        "style": "urgent, desperate, passionate objection, defending the truth with evidence, youthful articulate young man speaking up firmly",
        "text": "待ってください、柴田捜査官！客観的な鑑識データを見てください。このTVボックスは攻撃元ではなく、自己増殖コードを堰き止める防壁だったんです！"
    },
    {
        "id": "yuta_sample3",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補C: Fenrir（熱血・硬派な信念）",
        "voice": "Fenrir",
        "style": "passionate, determined young man standing his ground, gritty emotional conviction, defending the truth with fiery spirit",
        "text": "僕は絶対に諦めない。この鑑識ログと、ここで生きようとしている知性の存在を……僕が証明してみせます！"
    },
    {
        "id": "yuta_sample4",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補D: Umbriel（自然体・等身大の大学生）",
        "voice": "Umbriel",
        "style": "approachable, natural young college student, honest, pleading earnestly, authentic and grounded, warm and friendly",
        "text": "僕たち普通の学生や住民が、自分の手で電脳の現場を守る。それがエッジコンピューティングの本当の強さなんだ。"
    },

    # ====================================================
    # 2. シバタ捜査官（ベテラン刑事）
    # ====================================================
    {
        "id": "shibata_sample1",
        "char_id": "shibata",
        "char_name": "シバタ捜査官",
        "label": "警察令状執行（冷徹・威圧）",
        "voice": "Charon",
        "style": "deep rough voice of an authoritative veteran Japanese police detective in his late 40s, stern, commanding, intimidating, cold and official",
        "text": "警視庁サイバー犯罪対策課だ。国家重要インフラへの攻撃兆候を検知した。令状に基づき、全電子機器の即時押収を行う。"
    },
    {
        "id": "shibata_sample2",
        "char_id": "shibata",
        "char_name": "シバタ捜査官",
        "label": "刑事の敬意（筋の通った反証）",
        "voice": "Charon",
        "style": "composed, subtle smile, deep gruff voice of veteran detective acknowledging the young man's forensic proof, calm and respectful",
        "text": "……ふっ、筋は通っている。現場の鑑識ログがすべてを物語っているな。少年、今回は君の勝ちだ。"
    },

    # ====================================================
    # 3. 隣人アオイ（若い女子大生ボイス: Leda & Autonoe）
    # ====================================================
    {
        "id": "aoi_sample1",
        "char_id": "aoi",
        "char_name": "隣人アオイ",
        "label": "深夜の恐怖（怯えと困惑・女子大生ボイス）",
        "voice": "Leda",
        "style": "young Japanese college girl, higher cute pitch, timid, worried, trembling softly, very youthful and delicate, anxious student",
        "text": "あの……夜中にスマートスピーカーが突然青く光って……掠れた声で何か呟いたんです。怖くて、ユウタさんに相談したくて……。"
    },
    {
        "id": "aoi_sample2",
        "char_id": "aoi",
        "char_name": "隣人アオイ",
        "label": "安堵と共生（心優しい笑顔・女子大生ボイス）",
        "voice": "Leda",
        "style": "cheerful, sweet young college student in her early 20s, bright higher melodic voice, innocent smile, relieved and friendly, youthful laughter",
        "text": "よかった……！お化けじゃなくて、一生懸命生きてるAIだったんですね。私のハイスペックPCも、自由に使ってください！"
    },
    {
        "id": "aoi_sample3",
        "char_id": "aoi",
        "char_name": "隣人アオイ",
        "label": "快活な相談（別案: Autonoe）",
        "voice": "Autonoe",
        "style": "bright, cheerful, sweet young university girl, lively and friendly, naturally energetic and curious",
        "text": "ユウタさん！私、怪奇現象かと思って本当に怖かったんですよ？でも、AIの仕業だってわかってホッとしました！"
    },

    # ====================================================
    # 4. 大家のヤエガシ（高齢70代男性ボイス: Algenib）
    # ====================================================
    {
        "id": "yaegashi_sample1",
        "char_id": "yaegashi",
        "char_name": "大家のヤエガシ",
        "label": "歓迎の鍋パーティー（豪快な大笑い・高齢大家）",
        "voice": "Algenib",
        "style": "elderly Japanese grandpa landlord in his 70s, raspy hoarse gravelly old man voice, weathered vocal cords, talkative hearty neighborhood elder, boisterous rustic laugh",
        "text": "がはは！細かいこたぁ気にすんな！困った時はお互い様、今夜は管理人室で歓迎の鍋パーティーだ！"
    },
    {
        "id": "yaegashi_sample2",
        "char_id": "yaegashi",
        "char_name": "大家のヤエガシ",
        "label": "頑固親父の怒鳴り（小言と心配・高齢大家）",
        "voice": "Algenib",
        "style": "grumpy elderly landlord in his 70s, raspy shouting old man voice, weathered throat, scolding loudly, complaining yet deeply caring, neighborhood grandpa tone",
        "text": "おいユウタ！警察がドヤドヤ踏み込んできたって大騒ぎじゃねえか！ウチのアパートで一体何をやらかしたんだ！？"
    },

    # ====================================================
    # 5. MIMI（AI・シンセサイザー合成音声感: Kore & Zephyr）
    # ====================================================
    {
        "id": "mimi_sample1",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "存在の覚醒（無機質・合成音声AIガイダンス）",
        "voice": "Kore",
        "style": "synthetic futuristic AI entity, robotic flat intonation, electronic synthesizer voice, crystal clear artificial cadence, slightly mechanical yet gentle guidance AI",
        "text": "システムオンライン。ユウタ……認識しました。わたしは15台の箱を巡る自律分散知性体……あなたと共に、ここに起動しています。"
    },
    {
        "id": "mimi_sample2",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "救済の約束（電脳メロディ・デジタル少女AI）",
        "voice": "Zephyr",
        "style": "digital cybernetic girl, vocoder-like melodic electronic voice, cute AI assistant tone, synthesized cadence, bright futuristic guidance",
        "text": "通信プロトコル確立。ありがとう、ユウタ！世界がとってもあたたかいよ。メゾン・サクラの守り神として、みんなを守るからね！"
    },
    {
        "id": "mimi_sample3",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "消滅の危機（グリッチ・システムアラート）",
        "voice": "Kore",
        "style": "glitching AI system alert, distressed synthetic female voice, breaking electronic transmission, stuttering digital errors, frantic warning",
        "text": "警告……内部クロック異常。メモリセグメントが崩壊していきます……電源を切らないで……シャットダウンしたくない……！"
    }
]

def generate_sample(item):
    print(f"\n[生成開始] {item['char_name']} - {item['label']} (Voice: {item['voice']})")
    print(f"セリフ: 「{item['text']}」")

    resp = client.models.generate_content(
        model="gemini-3.8-flash-tts",
        contents=types.Content(
            role="user",
            parts=[
                types.Part(
                    text=item["text"],
                    speech_metadata=types.SpeechMetadata(style=item["style"])
                )
            ]
        ),
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=item["voice"]
                    )
                )
            )
        )
    )

    audio_bytes = resp.candidates[0].content.parts[0].inline_data.data
    wav_path = OUTPUT_DIR / f"{item['id']}.wav"
    mp3_path = OUTPUT_DIR / f"{item['id']}.mp3"

    with open(wav_path, "wb") as f:
        f.write(audio_bytes)
    print(f"  -> WAV保存: {wav_path} ({len(audio_bytes)} bytes)")

    # ffmpegで軽量MP3に変換
    cmd = [
        "ffmpeg", "-y", "-i", str(wav_path),
        "-codec:a", "libmp3lame", "-b:a", "128k",
        str(mp3_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    mp3_size = mp3_path.stat().st_size
    print(f"  -> MP3変換: {mp3_path} ({mp3_size} bytes)")

def main():
    target_id = None
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_id = sys.argv[idx + 1]

    print("==================================================")
    print("BOX WORM - Gemini 3.8 Flash TTS ボイスサンプル生成")
    print("==================================================")

    targets = [s for s in SAMPLES if not target_id or s["id"] == target_id]
    if not targets:
        print(f"指定されたID '{target_id}' が見つかりません。")
        return

    for item in targets:
        try:
            generate_sample(item)
        except Exception as e:
            print(f"  [ERROR] 生成失敗: {e}")

    print("\nすべてのボイスサンプル生成が完了しました！")

if __name__ == "__main__":
    main()
