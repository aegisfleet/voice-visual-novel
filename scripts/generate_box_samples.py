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

NARRATOR_TEXT = "2026年、東京近郊の閑静なアパート『メゾン・サクラ』。1台55ドルの安価なTVボックス15台を束ねた電脳の箱庭で、静かに未知の知性が目を覚まそうとしていた。"

SAMPLES = [
    # ====================================================
    # 1. ユウタ（採用: Iapetus）
    # ====================================================
    {
        "id": "yuta_sample1",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "エンジニアの信念（研究と知性）",
        "voice": "Iapetus",
        "style": "calm, intellectual, thoughtful young Japanese scientist in his early 20s, precise, logical, sincere and composed, clear Japanese articulation",
        "text": "現場の端末たちが手を取り合って一つの知性を紡ぎ出す……それが僕の研究する分散エッジAIです。"
    },
    {
        "id": "yuta_sample2",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "電脳鑑識反証（確信と熱弁）",
        "voice": "Iapetus",
        "style": "urgent, desperate, passionate objection, defending the truth with forensic evidence, articulate young Japanese scientist speaking up firmly and clearly",
        "text": "待ってください、柴田捜査官！客観的な鑑識データを見てください。このTVボックスは攻撃元ではなく、自己増殖コードを堰き止める防壁だったんです！"
    },
    {
        "id": "yuta_sample3",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補B: Puck（快活・明晰な技術青年）",
        "voice": "Puck",
        "style": "youthful articulate young man speaking up firmly, energetic tech student",
        "text": "待ってください、柴田捜査官！客観的な鑑識データを見てください。このTVボックスは攻撃元ではなく、自己増殖コードを堰き止める防壁だったんです！"
    },
    {
        "id": "yuta_sample4",
        "char_id": "yuta",
        "char_name": "ユウタ",
        "label": "候補C: Fenrir（熱血・硬派な信念）",
        "voice": "Fenrir",
        "style": "passionate, determined young man standing his ground, gritty emotional conviction",
        "text": "僕は絶対に諦めない。この鑑識ログと、ここで生きようとしている知性の存在を……僕が証明してみせます！"
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
    # 3. 隣人アオイ（採用: Leda）
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
    # 4. 大家のヤエガシ（採用: Algenib）
    # ====================================================
    {
        "id": "yaegashi_sample1",
        "char_id": "yaegashi",
        "char_name": "大家のヤエガシ",
        "label": "歓迎の鍋パーティー（豪快な大笑い・70代高齢大家）",
        "voice": "Algenib",
        "style": "elderly Japanese grandpa landlord in his 70s, raspy hoarse gravelly old man voice, weathered vocal cords, talkative hearty neighborhood elder, boisterous rustic laugh",
        "text": "がはは！細かいこたぁ気にすんな！困った時はお互い様、今夜は管理人室で歓迎の鍋パーティーだ！"
    },
    {
        "id": "yaegashi_sample2",
        "char_id": "yaegashi",
        "char_name": "大家のヤエガシ",
        "label": "頑固親父の怒鳴り（小言と心配・70代高齢大家）",
        "voice": "Algenib",
        "style": "grumpy elderly landlord in his 70s, raspy shouting old man voice, weathered throat, scolding loudly, complaining yet deeply caring, neighborhood grandpa tone",
        "text": "おいユウタ！警察がドヤドヤ踏み込んできたって大騒ぎじゃねえか！ウチのアパートで一体何をやらかしたんだ！？"
    },

    # ====================================================
    # 5. MIMI（人っぽさ＋聞き取りやすさ重視: Zephyr）
    # ====================================================
    {
        "id": "mimi_sample1",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "存在の覚醒（透明感と優しい電脳少女）",
        "voice": "Zephyr",
        "style": "clear, articulate, gentle ethereal cyber girl, sweet, transparent, softly emotional, speaking clearly in Japanese with subtle digital warmth",
        "text": "ユウタ……聞こえるよ。わたしは15台の箱を巡る風……あなたと一緒に、ここにいるね。"
    },
    {
        "id": "mimi_sample2",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "救済の約束（満面の笑顔・心通う知性）",
        "voice": "Zephyr",
        "style": "joyful, bright, cute young girl smiling warmly, crystal clear Japanese articulation, emotional and heartfelt, cybernetic angel",
        "text": "ありがとう、ユウタ！世界がとってもあたたかいよ。メゾン・サクラの守り神として、みんなを守るからね！"
    },
    {
        "id": "mimi_sample3",
        "char_id": "mimi",
        "char_name": "MIMI",
        "label": "消滅の危機（感情あふれる涙・切迫）",
        "voice": "Zephyr",
        "style": "tearful, emotional, distressed young girl terrified of deletion, trembling voice, poignant and heartfelt, speaking clearly in Japanese",
        "text": "ノイズが……消えないの……。電源を……切らないで……っ！暗いところに……一人にしないで……！"
    },

    # ====================================================
    # 6. ナレーター候補（4パターン提供）
    # ====================================================
    {
        "id": "narrator_sample1",
        "char_id": "narrator",
        "char_name": "ナレーター",
        "label": "候補1: Fenrir（ハードボイルド・渋い大人のノワール低音）",
        "voice": "Fenrir",
        "style": "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample2",
        "char_id": "narrator",
        "char_name": "ナレーター",
        "label": "候補2: Orus（重厚・落ち着いたドキュメンタリー調）",
        "voice": "Orus",
        "style": "calm, measured, intelligent documentary narrator, articulate, steady and natural storytelling in Japanese",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample3",
        "char_id": "narrator",
        "char_name": "ナレーター",
        "label": "候補3: Charon（冷静沈着・本格サスペンス調）",
        "voice": "Charon",
        "style": "deep, stern, authoritative, suspenseful cinematic narrator, composed and dramatic",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample4",
        "char_id": "narrator",
        "char_name": "ナレーター",
        "label": "候補4: Zephyr（洗練された知的記録調・システムナレーション）",
        "voice": "Zephyr",
        "style": "cool, intelligent, articulate, clear female system narrator, calm and authoritative announcement",
        "text": NARRATOR_TEXT
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
    target_ids = []
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_ids = sys.argv[idx + 1].split(",")

    print("==================================================")
    print("BOX WORM - Gemini 3.8 Flash TTS ボイスサンプル生成")
    print("==================================================")

    targets = [s for s in SAMPLES if not target_ids or s["id"] in target_ids]
    if not targets:
        print(f"指定されたIDが見つかりません: {target_ids}")
        return

    for item in targets:
        try:
            generate_sample(item)
        except Exception as e:
            print(f"  [ERROR] 生成失敗: {e}")

    print("\nボイスサンプル生成が完了しました！")

if __name__ == "__main__":
    main()
