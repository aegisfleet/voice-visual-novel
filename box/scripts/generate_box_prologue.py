"""
scripts/generate_box_prologue.py - BOX WORM プロローグ（シナリオ前半）全ボイス生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、プロローグの全23台詞の音声を生成し、
軽量MP3 (128kbps) として保存する。WAV一時ファイルは生成後に自動削除する。

キャラクターごとの声質ブレを防止するため、各キャラクターのスタイル定義を厳格に共通化・統一する。
また、「甲高い」を「こうだかい」と誤読する問題等の読み仮名補正を適用する。
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

OUTPUT_DIR = Path("box/assets/audio/prologue")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ----------------------------------------------------
# キャラクターごとの統一基本スタイル定義 (一貫性の担保)
# ----------------------------------------------------
# セリフごとにスタイル記述がブレるとTTSが別人として生成してしまうため、
# キャラクターごとのベースプロファイルを厳格に統一する。
STYLE_NARRATOR = "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation"
STYLE_SHIBATA = "deep rough voice of an authoritative veteran Japanese police detective in his late 40s, stern, commanding, intimidating, cold and official, clear Japanese articulation"
STYLE_YUTA = "intellectual, thoughtful young Japanese male AI engineer in his early 20s, earnest, sincere, precise and logical, clear Japanese articulation"

# ----------------------------------------------------
# 読み仮名・誤読補正辞書
# ----------------------------------------------------
PRONUNCIATION_FIXES = {
    "甲高い": "かんだかい",
}

def fix_pronunciation(text: str) -> str:
    result = text
    for word, reading in PRONUNCIATION_FIXES.items():
        result = result.replace(word, reading)
    return result

PROLOGUE_LINES = [
    # 01
    {
        "id": "prologue_01",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "都内の単身向けアパート『メゾン・サクラ』201号室。AIスタートアップでエッジAI・分散推論基盤のエンジニアを務めるユウタの部屋のドアが、夕刻、激しくノックされた。"
    },
    # 02
    {
        "id": "prologue_02",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "開けなさい！ 警視庁サイバー犯罪対策課、シバタ警部補だ。"
    },
    # 03
    {
        "id": "prologue_03",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "警察手帳を突きつけて入室してきたのは、鋭い眼光を放つコート姿のベテラン捜査官だった。"
    },
    # 04
    {
        "id": "prologue_04",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "サイバー犯罪対策課……！？ 一体何の話ですか！？"
    },
    # 05
    {
        "id": "prologue_05",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "昨夜の深夜2時、このアパートの回線で、国家監視網を揺るがす未知の暗号化通信が検知された。新型の自律型サイバー兵器の疑いがある。"
    },
    # 06
    {
        "id": "prologue_06",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "シバタ捜査官はデスクを一瞥した。3画面のマルチモニターにはLinuxターミナルが走り、エッジクラスタの負荷ログやArXivのAI論文が開かれている。"
    },
    # 07
    {
        "id": "prologue_07",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "……ふん。部屋中にマルチモニターと開発環境。君はエッジAIや機械学習のインフラを専門にするエンジニアだな。"
    },
    # 08
    {
        "id": "prologue_08",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "ええ、そうです！ AIのベンチャー企業でエンジニアをしています。"
    },
    # 09
    {
        "id": "prologue_09",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "巨大なコンピューターセンターじゃなく、家電やスマホみたいな『小さな機械』で手分けしてAIを動かす仕組み……エッジ分散推論を研究しているんです。"
    },
    # 10
    {
        "id": "prologue_10",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "企業の大事なAIデータをお預かりしているのに、テロなんてとんでもありません！ 仕事用のPCは自前のファイアウォールで厳重に保護しています！"
    },
    # 11
    {
        "id": "prologue_11",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "その時、シバタ捜査官が構えたサーモグラフィ付きの捜査用スキャナーが、甲高いビープ音を鳴らしながら赤く点滅した。"
    },
    # 12
    {
        "id": "prologue_12",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "……おい。待機状態のはずのテレビ横から、尋常ではない高周波の電磁ノイズと、80℃近い異常な表面熱が検知されているぞ。"
    },
    # 13
    {
        "id": "prologue_13",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "あのテレビ横の怪しげな黒い小箱は何だ？ 待機ランプの点滅周期が通常の家電と明らかに違うな。"
    },
    # 14
    {
        "id": "prologue_14",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "あれは先月、大家さんから『全室に動画端末を安く置きたい』と相談されて、俺が選定した1台55ドルのノーブランドTVボックスです！"
    },
    # 15
    {
        "id": "prologue_15",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "アパート全15室に同じものが備え付けられています。"
    },
    # 16
    {
        "id": "prologue_16",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "住民がネット動画を見るためのただの市販プレイヤーで、俺は改造も特別なアプリも一切入れていません！"
    },
    # 17
    {
        "id": "prologue_17",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "昨夜から触ってすらいません！ そんなただの動画プレイヤーが異常発熱したり激しい電磁ノイズを出しているなんて、何かの故障か間違いです！"
    },
    # 18
    {
        "id": "prologue_18",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "外見はただの格安家電だが、待機中の端末が異常な高負荷でフル稼働しているのは動かぬ事実だ。昨夜の怪通信を受け、上層部はすでに重大なテロ工作と断定している。"
    },
    # 19
    {
        "id": "prologue_19",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "すでに本隊の令状執行班がこちらへ向かっている。貴室の全電子機器を押収し、サイバーテロ容疑で君に任意同行を求める準備が進んでいる。"
    },
    # 20
    {
        "id": "prologue_20",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "全電子機器の押収！？ 待ってください！ クライアントの機密データが入ったPCやスマホを押収されたら仕事も信用も全て失います！"
    },
    # 21
    {
        "id": "prologue_21",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "君自身がテロリストに見えないのは確かだ。何者かに端末を乗っ取られた被害者である可能性もある。"
    },
    # 22
    {
        "id": "prologue_22",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": STYLE_SHIBATA,
        "text": "エッジAIのプロなら話が早い。令状班が突入してくるまで猶予は10分だ。あの小箱や君のPCがサイバー攻撃の首謀者ではなく、未知の何かに巻き込まれた被害者である客観的証拠を提示しろ。納得のいく説明ができなければ、直ちに貴室の全機器を押収し、署まで連行する！"
    },
    # 23
    {
        "id": "prologue_23",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": STYLE_YUTA,
        "text": "全機器押収も逮捕も絶対に阻止しなきゃならない！ 自分の専門知識をフル回転させて、あの小箱やルーター、アパートの設備を調べて、客観的な鑑識データを掴むんだ！"
    }
]

def generate_line(item):
    tts_text = fix_pronunciation(item["text"])
    print(f"\n[生成開始] {item['id']} ({item['speaker']} / Voice: {item['voice']})")
    print(f"セリフ: 「{item['text']}」")
    if tts_text != item["text"]:
        print(f"  (発音補正後: 「{tts_text}」)")

    resp = client.models.generate_content(
        model="gemini-3.8-flash-tts",
        contents=types.Content(
            role="user",
            parts=[
                types.Part(
                    text=tts_text,
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
    wav_path = OUTPUT_DIR / f"{item['id']}_temp.wav"
    mp3_path = OUTPUT_DIR / f"{item['id']}.mp3"

    try:
        with open(wav_path, "wb") as f:
            f.write(audio_bytes)

        # ffmpegで軽量MP3に変換 (atempo=1.18で早口・歯切れの良いテンポに)
        cmd = [
            "ffmpeg", "-y", "-i", str(wav_path),
            "-filter:a", "atempo=1.18",
            "-codec:a", "libmp3lame", "-b:a", "128k",
            str(mp3_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        mp3_size = mp3_path.stat().st_size
        print(f"  -> MP3生成成功: {mp3_path} ({mp3_size} bytes)")
    finally:
        # WAV一時ファイルは直ちに削除
        if wav_path.exists():
            wav_path.unlink()

def main():
    target_ids = []
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_ids = sys.argv[idx + 1].split(",")

    print("==================================================")
    print("BOX WORM - プロローグ全台詞ボイス生成 (スタイル統一・誤読補正版)")
    print("==================================================")

    targets = [l for l in PROLOGUE_LINES if not target_ids or l["id"] in target_ids]
    total = len(targets)
    print(f"対象セリフ数: {total} 件\n")

    for i, item in enumerate(targets, 1):
        print(f"進捗: [{i}/{total}]")
        try:
            generate_line(item)
        except Exception as e:
            print(f"  [ERROR] 生成失敗: {e}")

    print("\nプロローグ全ボイス生成が完了しました！(WAVファイルは残さず削除済)")

if __name__ == "__main__":
    main()
