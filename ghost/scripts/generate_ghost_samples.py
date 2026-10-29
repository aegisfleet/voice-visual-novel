"""
scripts/generate_ghost_samples.py - GHOST PROTOCOL キャラクターボイス生成スクリプト
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

OUTPUT_DIR = Path("ghost/assets/audio/samples")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATOR_TEXT = "2026年10月20日深夜。国内最大手の金融VPSクラウド基盤が、突如として未曾有のサイバー攻撃に見舞われた。26,739台のサーバーが沈黙し、口座残高が瞬時に蒸発していく。"
KEI_TEXT = "全26,739台のVPSを物理遮断した直後に、この挑発メッセージ……敵の仕掛けはまだ終わっていない！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！"
ARIA_TEXT = "マスター・ケイ、セキュアVM正常稼働。全26,739台のパケットトレースを開始します。暗号化された偽装プロキシの背後、絶対に逃しません！"
TAKAMIYA_TEXT = "ケイ、頼む、力を貸してくれ！ 俺たちのクラウド基盤26,739台が、何者かに一斉に乗っ取られた！ このままじゃ全国数万人の資産が焼き払われてしまう！"
KURODA_TEXT = "国家の盾は、企業のずさんな過失を免罪するための道具ではない。能動的サイバー防御を発動させたければ、法理上の『3つの壁』を突破する客観的証拠を揃えてみせろ。"
MIO_TEXT = "通信ログの多段偽装、ルーマニアのSOCKS5ブリッジを経由してオランダのTorリレーに繋がってます。……ふふっ、でも足跡消しが雑ですね。真のC2サーバー、もう丸見えですよ？"

SAMPLES = [
    # ====================================================
    # 1. ナレーション (narrator) - 4候補
    # ====================================================
    {
        "id": "narrator_sample1",
        "char_id": "narrator",
        "char_name": "ナレーション",
        "label": "候補1: Orus（重厚・社会派ドキュメンタリー調）",
        "voice": "Orus",
        "style": "calm, measured, intelligent documentary narrator, articulate, steady and natural storytelling in Japanese, deep authoritative tone",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample2",
        "char_id": "narrator",
        "char_name": "ナレーション",
        "label": "候補2: Fenrir（ハードボイルド・サスペンス低音）",
        "voice": "Fenrir",
        "style": "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation, serious tension",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample3",
        "char_id": "narrator",
        "char_name": "ナレーション",
        "label": "候補3: Charon（冷徹・本格サイバークライム調）",
        "voice": "Charon",
        "style": "deep, stern, authoritative, suspenseful cinematic narrator, composed and dramatic, cold forensic weight",
        "text": NARRATOR_TEXT
    },
    {
        "id": "narrator_sample4",
        "char_id": "narrator",
        "char_name": "ナレーション",
        "label": "候補4: Zephyr（洗練された知的記録調・電脳空間アナウンス）",
        "voice": "Zephyr",
        "style": "cool, intelligent, articulate, clear female system narrator, calm and authoritative announcement, transparent electronic clarity",
        "text": NARRATOR_TEXT
    },

    # ====================================================
    # 2. ナギサ ケイ (kei) - 主人公・4候補
    # ====================================================
    {
        "id": "kei_sample1",
        "char_id": "kei",
        "char_name": "ナギサ ケイ",
        "label": "候補1: Puck（明晰・快活な理知派青年エンジニア）",
        "voice": "Puck",
        "style": "youthful articulate young Japanese engineer in his late 20s, energetic, intellectual, sharp and determined, speaking up firmly and clearly",
        "text": KEI_TEXT
    },
    {
        "id": "kei_sample2",
        "char_id": "kei",
        "char_name": "ナギサ ケイ",
        "label": "候補2: Iapetus（沈着冷静・誠実で強い信念のエンジニア）",
        "voice": "Iapetus",
        "style": "calm, intellectual, thoughtful young Japanese specialist in his late 20s, precise, logical, sincere and composed, clear Japanese articulation",
        "text": KEI_TEXT
    },
    {
        "id": "kei_sample3",
        "char_id": "kei",
        "char_name": "ナギサ ケイ",
        "label": "候補3: Fenrir（熱血・硬派・立ち向かう強い正義感）",
        "voice": "Fenrir",
        "style": "passionate, determined young man standing his ground, gritty emotional conviction, resolute Japanese voice, urgent and fiery",
        "text": KEI_TEXT
    },
    {
        "id": "kei_sample4",
        "char_id": "kei",
        "char_name": "ナギサ ケイ",
        "label": "候補4: Pegasus（クール・シャープ・次世代スペシャリスト）",
        "voice": "Pegasus",
        "style": "cool, sharp, highly focused young tech expert in his 20s, analytical, crisp and decisive, confident tone in Japanese",
        "text": KEI_TEXT
    },

    # ====================================================
    # 3. アリア (ARIA) (aria) - 電脳鑑識AI・4候補
    # ====================================================
    {
        "id": "aria_sample1",
        "char_id": "aria",
        "char_name": "アリア (ARIA)",
        "label": "候補1: Zephyr（透明感・知性的でクリアな電脳美少女AI）",
        "voice": "Zephyr",
        "style": "clear, articulate, gentle ethereal cyber AI girl, sweet, transparent, softly emotional, speaking clearly in Japanese with subtle digital warmth",
        "text": ARIA_TEXT
    },
    {
        "id": "aria_sample2",
        "char_id": "aria",
        "char_name": "アリア (ARIA)",
        "label": "候補2: Leda（可憐・親しみやすく感情豊かなキュートAI）",
        "voice": "Leda",
        "style": "cute, melodic, youthful feminine cyber AI assistant, sweet and friendly, polite and expressive in Japanese, bright high tone",
        "text": ARIA_TEXT
    },
    {
        "id": "aria_sample3",
        "char_id": "aria",
        "char_name": "アリア (ARIA)",
        "label": "候補3: Autonoe（快活・ハキハキとした頼もしいナビゲーションAI）",
        "voice": "Autonoe",
        "style": "bright, energetic, crisp cyber navigation AI, lively, enthusiastic and dependable, crystal clear Japanese articulation",
        "text": ARIA_TEXT
    },
    {
        "id": "aria_sample4",
        "char_id": "aria",
        "char_name": "アリア (ARIA)",
        "label": "候補4: Kore（冷静沈着・クールで感情を抑えた防衛AI）",
        "voice": "Kore",
        "style": "cool, calm, slightly robotic precision, composed high-spec defense AI, mature, serious and disciplined tone in Japanese",
        "text": ARIA_TEXT
    },

    # ====================================================
    # 4. タカミヤ レン (takamiya) - CSIRTリーダー・4候補
    # ====================================================
    {
        "id": "takamiya_sample1",
        "char_id": "takamiya",
        "char_name": "タカミヤ レン",
        "label": "候補1: Aoede（若々しく焦燥と誠実さを宿す情熱的リーダー）",
        "voice": "Aoede",
        "style": "urgent, desperate young Japanese CSIRT team lead in his late 20s, pleading for help, sincere, passionate and emotional, clear Japanese speech",
        "text": TAKAMIYA_TEXT
    },
    {
        "id": "takamiya_sample2",
        "char_id": "takamiya",
        "char_name": "タカミヤ レン",
        "label": "候補2: Puck（ストレートで必死な叫び・親友への信頼）",
        "voice": "Puck",
        "style": "urgent, stressed young man reaching out to best friend, energetic, frantic yet earnest and determined, articulate Japanese",
        "text": TAKAMIYA_TEXT
    },
    {
        "id": "takamiya_sample3",
        "char_id": "takamiya",
        "char_name": "タカミヤ レン",
        "label": "候補3: Iapetus（苦悩と重い責任感を背負うシリアスリーダー）",
        "voice": "Iapetus",
        "style": "distressed, serious, burdened with heavy responsibility, earnest young incident commander, deep emotional concern in Japanese",
        "text": TAKAMIYA_TEXT
    },
    {
        "id": "takamiya_sample4",
        "char_id": "takamiya",
        "char_name": "タカミヤ レン",
        "label": "候補4: Fenrir（泥臭く熱い現場指揮官・闘志と悔しさ）",
        "voice": "Fenrir",
        "style": "gritty, raw emotion, passionate young engineer refusing to give up, desperate struggle against an unseen enemy, intense Japanese delivery",
        "text": TAKAMIYA_TEXT
    },

    # ====================================================
    # 5. クロダ統括官 (kuroda) - NCO審議官・4候補
    # ====================================================
    {
        "id": "kuroda_sample1",
        "char_id": "kuroda",
        "char_name": "クロダ統括官",
        "label": "候補1: Charon（重厚・威厳・冷徹な低音ベテラン指揮官）",
        "voice": "Charon",
        "style": "deep rough voice of an authoritative veteran Japanese government director in his 50s, stern, commanding, intimidating, cold and official",
        "text": KURODA_TEXT
    },
    {
        "id": "kuroda_sample2",
        "char_id": "kuroda",
        "char_name": "クロダ統括官",
        "label": "候補2: Orus（威厳・落ち着いた風格ある警察庁エリート高官）",
        "voice": "Orus",
        "style": "calm, deeply authoritative, mature high-ranking police commander, strict, stately and measured cadence in Japanese",
        "text": KURODA_TEXT
    },
    {
        "id": "kuroda_sample3",
        "char_id": "kuroda",
        "char_name": "クロダ統括官",
        "label": "候補3: Algenib（嗄れ感と現場の迫力を持つ叩き上げ指揮官）",
        "voice": "Algenib",
        "style": "raspy weathered veteran detective in his 50s, gritty and experienced, rough authority, imposing yet deeply principled in Japanese",
        "text": KURODA_TEXT
    },
    {
        "id": "kuroda_sample4",
        "char_id": "kuroda",
        "char_name": "クロダ統括官",
        "label": "候補4: Fenrir（鋭い眼光で迫る強面の特別執行指揮官）",
        "voice": "Fenrir",
        "style": "stern, forceful, imposing senior commander, intense conviction, sharp and unyielding Japanese articulation",
        "text": KURODA_TEXT
    },

    # ====================================================
    # 6. ミオ分析官 (mio) - NCO通信情報分析官・4候補
    # ====================================================
    {
        "id": "mio_sample1",
        "char_id": "mio",
        "char_name": "ミオ分析官",
        "label": "候補1: Leda（若く聡明・少し茶目っ気と余裕のある天才女性分析官）",
        "voice": "Leda",
        "style": "youthful, intelligent Japanese female intelligence analyst in her early 20s, cute yet savvy, confident playful smirk, melodic and clear Japanese",
        "text": MIO_TEXT
    },
    {
        "id": "mio_sample2",
        "char_id": "mio",
        "char_name": "ミオ分析官",
        "label": "候補2: Zephyr（クール・明晰・淡々とデータを読み解く理系エリート分析官）",
        "voice": "Zephyr",
        "style": "cool, crisp, highly analytical young woman, unemotional precision, sharp deductive tone in Japanese, modern tech elite",
        "text": MIO_TEXT
    },
    {
        "id": "mio_sample3",
        "char_id": "mio",
        "char_name": "ミオ分析官",
        "label": "候補3: Autonoe（快活・シャープ・スピード感のある鋭いアナリスト）",
        "voice": "Autonoe",
        "style": "bright, brisk, sharp-witted young investigator, confident and energetic, speaking rapidly and articulately in Japanese",
        "text": MIO_TEXT
    },
    {
        "id": "mio_sample4",
        "char_id": "mio",
        "char_name": "ミオ分析官",
        "label": "候補4: Kore（落ち着いた知性・低めのトーンで淡々と切り込む大人びた分析官）",
        "voice": "Kore",
        "style": "mature, composed young woman with slightly lower pitch, calm and observant, sardonic chuckle, intellectual depth in Japanese",
        "text": MIO_TEXT
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

    # ffmpegで軽量MP3に変換 (128kbps)
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
    print("GHOST PROTOCOL - Gemini 3.8 Flash TTS ボイスサンプル生成")
    print("==================================================")

    targets = [s for s in SAMPLES if not target_ids or s["id"] in target_ids]
    if not targets:
        print(f"指定されたIDが見つかりません: {target_ids}")
        return

    print(f"対象サンプル数: {len(targets)} 件")

    success_count = 0
    fail_count = 0

    for item in targets:
        try:
            generate_sample(item)
            success_count += 1
        except Exception as e:
            print(f"  [ERROR] 生成失敗: {e}")
            fail_count += 1

    print("\n==================================================")
    print(f"生成完了: 成功 {success_count} 件, 失敗 {fail_count} 件")
    print("==================================================")

if __name__ == "__main__":
    main()
