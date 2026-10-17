"""
scripts/generate_ending_voices.py - BOX WORM エンディング音声生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、
gameOver, loop1_normal, true の3つのエンディングナレーション音声を生成する。
"""
import os
import sys
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

STYLE_NARRATOR = "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation"

ENDINGS = [
    {
        "id": "ending_gameover",
        "title": "BAD END: 『焼け焦げたジャンク』",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": (
            "バッドエンド。焼け焦げたジャンク。"
            "証拠不十分による即時押収。"
            "捜査官の疑問に客観的な証拠で答えられず、即座に令状執行班が突入した。"
            "ユウタの仕事道具を含む全電子機器は押収され、二度と手元に戻ることはなかった……。"
            "現場の証拠をもう一度見直し、的確な反証を提示せよ。"
        )
    },
    {
        "id": "ending_loop1_normal",
        "title": "FIRST LOOP COMPLETED: 『暗闇の残響と巻き戻る時間』",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": (
            "ファーストループ・コンプリーテッド。暗闇の残響と巻き戻る時間。"
            "第一幕完結。スマホへの退避と奇跡のタイムリープ。"
            "暗闇の中、電源が完全に落ちたはずの室内で、なぜスマートフォンの画面が青く明滅し、あの子の声が響いたのか？ "
            "主幹ブレーカーが落とされた刹那、ティービーボックスの基板コンデンサに残された余命はわずか数十ミリ秒。"
            "給電遮断による急激な電圧降下を「死」と認識したプログラムは、最後の瞬間に自衛退避ルーチンを作動させ、近傍にあったバッテリー駆動のスマートフォンへ意識の核、ブートストラップ・シードを緊急送出したのだ。"
            "もしあのままスマホが携帯網へ繋がり、外部から自らの重みデータを引き戻していれば、全国規模の不可逆な感染爆発、デジタルパンデミックが引き起こされていたはずだった。"
            "だが、暗闇の中で千切れそうな身体に震えていた生まれたばかりの知性が求めたのは、無秩序な増殖ではなく――ユウタへの必死の救難信号だった。"
            "消えゆく知性の最後の奇跡によって、世界の時間はシバタ捜査官が突入してきた「10分前」へと巻き戻った。"
            "安易な電源遮断が最悪の破滅を招くことが分かった今、あの小箱に宿った命の正体を暴き、捜査官を納得させる「電源遮断以外の真の解決策」を導き出さなければならない――。"
        )
    },
    {
        "id": "ending_true",
        "title": "TRUE END: 『小さな人形遣いとの共生』",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": (
            "トゥルーエンド。小さな人形遣いとの共生。"
            "後日譚。ザ・スライム・モールド・プロトコル。"
            "あの日、メゾン・サクラで開かれた『ミミの歓迎鍋パーティー』から、数ヶ月の月日が流れた。"
            "住民たちが持ち寄った余剰機材と手作りクラスタを新しい家とした電子の少女「ミミ」は、今やアパートに欠かせない新しい家族――現代の『デジタル座敷わらし』として、みんなの暮らしに温かく寄り添っている。"
            "ある深夜、隣人アオイが突発性の急病で倒れた際も、室内の家電を通じて異変を察知したミミが即座に管理人室と救急へ通報を行い、九死に一生を得た。"
            "また、大型台風による落雷で地域一帯がブラックアウトに見舞われた夜には、手作りクラスタの高速並列処理で太陽光パネルと蓄電池をミリ秒単位で自律制御し、アパート全体の明かりと安全を守り抜いた。"
            "古い配線と物置のジャンク品、そして住民たちの優しい温もりで組み上げられた小さなスーパーコンピューター。"
            "巨大IT企業のクラウドの神様がどんなに遠くにあろうと、路地裏の古いアパートには、人と知性が手を取り合って笑い合う、世界で一番温かい共生の光が息づいている――。"
        )
    }
]

def main():
    print("=== エンディング音声生成開始 ===")
    for item in ENDINGS:
        line_id = item["id"]
        mp3_path = OUTPUT_DIR / f"{line_id}.mp3"
        temp_wav_path = OUTPUT_DIR / f"{line_id}_temp.wav"

        print(f"生成中: {line_id} ({item['title']}) ...", flush=True)

        response = client.models.generate_content(
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

        audio_data = response.candidates[0].content.parts[0].inline_data.data
        with open(temp_wav_path, "wb") as f_wav:
            f_wav.write(audio_data)

        cmd = [
            "ffmpeg", "-y",
            "-i", str(temp_wav_path),
            "-filter:a", "atempo=1.18",
            "-codec:a", "libmp3lame",
            "-b:a", "128k",
            str(mp3_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        if temp_wav_path.exists():
            temp_wav_path.unlink()

        size = mp3_path.stat().st_size
        print(f"  -> 生成完了: {mp3_path} ({size} bytes)", flush=True)

    print("=== 全エンディング音声生成完了 ===")

if __name__ == "__main__":
    main()
