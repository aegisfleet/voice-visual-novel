"""
scripts/generate_box_prologue.py - BOX WORM プロローグ（シナリオ前半）全ボイス生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、プロローグの全23台詞の音声を生成し、
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

OUTPUT_DIR = Path("box/assets/audio/prologue")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROLOGUE_LINES = [
    {
        "id": "prologue_01",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation",
        "text": "都内の単身向けアパート『メゾン・サクラ』201号室。AIスタートアップでエッジAI・分散推論基盤のエンジニアを務めるユウタの部屋のドアが、夕刻、激しくノックされた。"
    },
    {
        "id": "prologue_02",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "harsh, commanding, authoritative, shouting through the door, stern detective",
        "text": "開けなさい！ 警視庁サイバー犯罪対策課、シバタ警部補だ。"
    },
    {
        "id": "prologue_03",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": "calm, atmospheric, noir narrator, steady tone",
        "text": "警察手帳を突きつけて入室してきたのは、鋭い眼光を放つコート姿のベテラン捜査官だった。"
    },
    {
        "id": "prologue_04",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "shocked, surprised, bewildered young engineer, urgent tone",
        "text": "サイバー犯罪対策課……！？ 一体何の話ですか！？"
    },
    {
        "id": "prologue_05",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "serious, deep low voice, stern veteran detective, official and cold",
        "text": "昨夜の深夜2時、このアパートの回線で、国家監視網を揺るがす未知の暗号化通信が検知された。新型の自律型サイバー兵器の疑いがある。"
    },
    {
        "id": "prologue_06",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": "observant, composed, atmospheric narrator",
        "text": "シバタ捜査官はデスクを一瞥した。3画面のマルチモニターにはLinuxターミナルが走り、エッジクラスタの負荷ログやArXivのAI論文が開かれている。"
    },
    {
        "id": "prologue_07",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "suspicious, perceptive, calm gruff detective",
        "text": "……ふん。部屋中にマルチモニターと開発環境。君はエッジAIや機械学習のインフラを専門にするエンジニアだな。"
    },
    {
        "id": "prologue_08",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "upright, sincere, clear young Japanese engineer speaking truth",
        "text": "ええ、そうです！ AIのベンチャー企業でエンジニアをしています。"
    },
    {
        "id": "prologue_09",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "passionate, articulate, explaining technical concept clearly, intellectual",
        "text": "巨大なコンピューターセンターじゃなく、家電やスマホみたいな『小さな機械』で手分けしてAIを動かす仕組み……エッジ分散推論を研究しているんです。"
    },
    {
        "id": "prologue_10",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "firm denial, honest and confident, defensive yet polite, earnest",
        "text": "企業の大事なAIデータをお預かりしているのに、テロなんてとんでもありません！ 仕事用のPCは自前のファイアウォールで厳重に保護しています！"
    },
    {
        "id": "prologue_11",
        "speaker": "ナレーション",
        "voice": "Fenrir",
        "style": "tense, dramatic, noir narrator, sharp atmosphere",
        "text": "その時、シバタ捜査官が構えたサーモグラフィ付きの捜査用スキャナーが、甲高いビープ音を鳴らしながら赤く点滅した。"
    },
    {
        "id": "prologue_12",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "grim, sharp, investigative detection, commanding tone",
        "text": "……おい。待機状態のはずのテレビ横から、尋常ではない高周波の電磁ノイズと、80℃近い異常な表面熱が検知されているぞ。"
    },
    {
        "id": "prologue_13",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "questioning, suspicious, pressing, sharp tone",
        "text": "あのテレビ横の怪しげな黒い小箱は何だ？ 待機ランプの点滅周期が通常の家電と明らかに違うな。"
    },
    {
        "id": "prologue_14",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "flustered, hurried explanation, innocent young man",
        "text": "あれは先月、大家さんから『全室に動画端末を安く置きたい』と相談されて、俺が選定した1台55ドルのノーブランドTVボックスです！"
    },
    {
        "id": "prologue_15",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "explaining fact, calm and truthful",
        "text": "アパート全15室に同じものが備え付けられています。"
    },
    {
        "id": "prologue_16",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "earnest, convincing, sincere defense",
        "text": "住民がネット動画を見るためのただの市販プレイヤーで、俺は改造も特別なアプリも一切入れていません！"
    },
    {
        "id": "prologue_17",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "desperate, bewildered, defending innocence",
        "text": "昨夜から触ってすらいません！ そんなただの動画プレイヤーが異常発熱したり激しい電磁ノイズを出しているなんて、何かの故障か間違いです！"
    },
    {
        "id": "prologue_18",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "cold, relentless authority, heavy reality check",
        "text": "外見はただの格安家電だが、待機中の端末が異常な高負荷でフル稼働しているのは動かぬ事実だ。昨夜の怪通信を受け、上層部はすでに重大なテロ工作と断定している。"
    },
    {
        "id": "prologue_19",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "intimidation, official warning, grim detective",
        "text": "すでに本隊の令状執行班がこちらへ向かっている。貴室の全電子機器を押収し、サイバーテロ容疑で君に任意同行を求める準備が進んでいる。"
    },
    {
        "id": "prologue_20",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "panicked, frantic objection, high stakes, desperate",
        "text": "全電子機器の押収！？ 待ってください！ クライアントの機密データが入ったPCやスマホを押収されたら仕事も信用も全て失います！"
    },
    {
        "id": "prologue_21",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "reasonable, fair-minded veteran detective, lowering voice slightly",
        "text": "君自身がテロリストに見えないのは確かだ。何者かに端末を乗っ取られた被害者である可能性もある。"
    },
    {
        "id": "prologue_22",
        "speaker": "シバタ捜査官",
        "voice": "Charon",
        "style": "authoritative ultimatum, firm deadline, commanding police detective",
        "text": "エッジAIのプロなら話が早い。令状班が突入してくるまで猶予は10分だ。あの小箱や君のPCがサイバー攻撃の首謀者ではなく、未知の何かに巻き込まれた被害者である客観的証拠を提示しろ。納得のいく説明ができなければ、直ちに貴室の全機器を押収し、署まで連行する！"
    },
    {
        "id": "prologue_23",
        "speaker": "ユウタ",
        "voice": "Iapetus",
        "style": "inner determination, resolved young engineer, fiery motivation, passionate resolve",
        "text": "全機器押収も逮捕も絶対に阻止しなきゃならない！ 自分の専門知識をフル回転させて、あの小箱やルーター、アパートの設備を調べて、客観的な鑑識データを掴むんだ！"
    }
]

def generate_line(item):
    print(f"\n[生成開始] {item['id']} ({item['speaker']} / Voice: {item['voice']})")
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

    # ffmpegで軽量MP3に変換
    cmd = [
        "ffmpeg", "-y", "-i", str(wav_path),
        "-codec:a", "libmp3lame", "-b:a", "128k",
        str(mp3_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    mp3_size = mp3_path.stat().st_size
    print(f"  -> MP3生成成功: {mp3_path} ({mp3_size} bytes)")

def main():
    target_ids = []
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_ids = sys.argv[idx + 1].split(",")

    print("==================================================")
    print("BOX WORM - プロローグ全台詞ボイス生成 (Gemini 3.8 Flash TTS)")
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

    print("\nプロローグ全ボイス生成が完了しました！")

if __name__ == "__main__":
    main()
