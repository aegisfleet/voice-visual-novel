"""
scripts/generate_ghost_prologue.py - GHOST PROTOCOL プロローグ全ボイス生成スクリプト
Google Gemini 3.8 Flash TTS (Vertex AI) を用いて、プロローグ全18セリフの音声を生成し、
軽量MP3 (128kbps) として保存する。WAV一時ファイルは生成後に自動削除する。

声のブレ防止（一貫性確保）:
- 採用決定されたボイスモデル・スタイル定義を厳格に共通化・固定。
- セリフごとにスタイル記述がブレないようにベースプロファイルを完全統一。

読み間違い対策（誤読防止）:
- 専門用語（API, VPS, RPC, FT4/FT5, CSIRT, AD, Active Directory, VM, Windows）の平仮名・カタカナ化。
- 数字（2026年10月20日、23時45分、26,739台、午前4時等）および難読語（断末魔、未曾有）を補正。
- 記号（『』《》【】等）の除去と自然な息継ぎ（ポーズ）の調整。
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

OUTPUT_DIR = Path("ghost/assets/audio/prologue")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ----------------------------------------------------
# 採用決定ボイス＆統一基本スタイル定義 (一貫性の担保)
# ----------------------------------------------------
# ナレーション: narrator_sample2 (Voice: Fenrir)
STYLE_NARRATOR = "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, clear Japanese articulation, serious tension"

# ナギサ ケイ: kei_sample2 (Voice: Iapetus)
STYLE_KEI = "calm, intellectual, thoughtful young Japanese specialist in his late 20s, precise, logical, sincere and composed, clear Japanese articulation"

# アリア (ARIA): aria_sample1 (Voice: Zephyr)
STYLE_ARIA = "clear, articulate, gentle ethereal cyber AI girl, sweet, transparent, softly emotional, speaking clearly in Japanese with subtle digital warmth"

# タカミヤ レン: takamiya_sample2 (Voice: Puck)
STYLE_TAKAMIYA = "urgent, stressed young man reaching out to best friend, energetic, frantic yet earnest and determined, articulate Japanese"

# クロダ統括官: kuroda_sample3 (Voice: Algenib)
STYLE_KURODA = "raspy weathered veteran detective in his 50s, gritty and experienced, rough authority, imposing yet deeply principled in Japanese"

# ミオ分析官: mio_sample1 (Voice: Leda)
STYLE_MIO = "youthful, intelligent Japanese female intelligence analyst in her early 20s, cute yet savvy, confident playful smirk, melodic and clear Japanese"

PROLOGUE_LINES = [
    # 01
    {
        "id": "prologue_01",
        "speaker": "narrator",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "2026年10月20日、火曜日、深夜23時45分。",
        "speech_text": "にせんにじゅうろくねん、じゅうがつはつか、かようび、しんやにじゅうさんじ、よんじゅうごふん。"
    },
    # 02
    {
        "id": "prologue_02",
        "speaker": "narrator",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "都内の静まり返った自室で、独立系金融インフラエンジニア・ナギサ ケイの監視モニターが突如、断末魔のようなエラーログを吹き鳴らした。",
        "speech_text": "とないのしずまりかえったじしつで、どくりつけいきんゆうインフラエンジニア、なぎさけいの、かんしモニターがとつじょ、だんまつまのようなエラーログをふきならした。"
    },
    # 03
    {
        "id": "prologue_03",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "……なんだ？ 自前の自動取引アルゴリズム監視サーバーから、全APIの異常切断アラートが連続で出ている……！？",
        "speech_text": "…なんだ？ じまえのじどうとりひきアルゴリズムかんしサーバーから、ぜんエーピーアイのいじょうせつだんアラートが、れんぞくででている…！？"
    },
    # 04
    {
        "id": "prologue_04",
        "speaker": "aria",
        "voice": "Zephyr",
        "style": STYLE_ARIA,
        "text": "マスター、緊急事態です！ 接続先の金融VPSクラウド基盤……国内最大手『ネオドットコム デスクトップクラウド』の全インスタンスで、一斉に内部RPCエラーが検知されました！",
        "speech_text": "マスター、きんきゅうじたいです！ せつぞくさきの、きんゆうブイピーエスクラウドきばん…こくないさいおおて、ネオドットコム、デスクトップクラウドの、ぜんインスタンスで、いっせいにないぶアールピーシーエラーが、けんちされました！"
    },
    # 05
    {
        "id": "prologue_05",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "全インスタンスだと！？ あのクラウドは、全国数万人規模の個人トレーダーが24時間体制で金融自動売買（FT4/FT5）を動かしている国内屈指の巨大基盤だぞ！",
        "speech_text": "ぜんインスタンスだと！？ あのクラウドは、ぜんこくすうまんにんきぼのこじんトレーダーが、にじゅうよじかんたいせいで、きんゆうじどうばいばい、エフティーフォー、エフティーファイブをうごかしている、こくないくっしのきょだいきばんだぞ！"
    },
    # 06
    {
        "id": "prologue_06",
        "speaker": "aria",
        "voice": "Zephyr",
        "style": STYLE_ARIA,
        "text": "はい。稼働仮想マシン総数は26,739台……そのほぼすべてが管理ネットワークから次々と蒸発し、応答を喪失しつつあります！",
        "speech_text": "はい。かどう、かそうマシンそうすうは、にまんろくせんななひゃくさんじゅうきゅうだい…そのほぼすべてが、かんりネットワークからつぎつぎとじょうはつし、おうとうをそうしつしつつあります！"
    },
    # 07
    {
        "id": "prologue_07",
        "speaker": "narrator",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "その直後、ケイの私用スマートフォンが狂ったように震え出した。発信元は——クラウド運用本部CSIRT現場リーダーであり、大学時代からの親友、タカミヤ レン。",
        "speech_text": "そのちょくご、けいのしようスマートフォンが、くるったようにふるえだした。はっしんもとは、クラウドうんようほんぶシーサートげんばリーダーであり、だいがくじだいからのしんゆう、たかみやれん。"
    },
    # 08
    {
        "id": "prologue_08",
        "speaker": "takamiya",
        "voice": "Puck",
        "style": STYLE_TAKAMIYA,
        "text": "『ケイ……！ 頼む、助けてくれ！ 現場のAD（Active Directory）管理プレーンが……全部乗っ取られた！』",
        "speech_text": "ケイ…！ たのむ、たすけてくれ！ げんばのエーディー、アクティブディレクトリかんりプレーンが…ぜんぶのっとられた！"
    },
    # 09
    {
        "id": "prologue_09",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "レン！？ 落ち着け、一体何が起きてるんだ！？",
        "speech_text": "レン！？ おちつけ、いったいなにがおきてるんだ！？"
    },
    # 10
    {
        "id": "prologue_10",
        "speaker": "takamiya",
        "voice": "Puck",
        "style": STYLE_TAKAMIYA,
        "text": "『深夜、管理基盤の深部に侵入された……！ 2万6千台のWindows VPSのマスターパスワードが吸い出され、顧客の口座情報が……裏コマンドから次々と書き換えられている！』",
        "speech_text": "しんや、かんりきばんのしんぶにしんにゅうされた…！ にまんろくせんだいの、ウィンドウズ、ブイピーエスの、マスターパスワードがすいだされ、こきゃくのこうざじょうほうがおもてから…うらコマンドからつぎつぎとかきかえられている！"
    },
    # 11
    {
        "id": "prologue_11",
        "speaker": "takamiya",
        "voice": "Puck",
        "style": STYLE_TAKAMIYA,
        "text": "『このまま夜が明ければ、数万人の顧客資産が全滅する……！ 我々は午前4時をもって、26,739台すべての【全回線切断・強制シャットダウン】を決断する！』",
        "speech_text": "このままよがあければ、すうまんにんのこきゃくしさんがぜんめつする…！ われわれは、ごぜんよじをもって、にまんろくせんななひゃくさんじゅうきゅうだいすべての、ぜんかいせんせつだん、きょうせいシャットダウンをけつだんする！"
    },
    # 12
    {
        "id": "prologue_12",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "26,739台の全停止……！ 日本の金融インフラを揺るがす未曾有のインシデントになるぞ……！",
        "speech_text": "にまんろくせんななひゃくさんじゅうきゅうだいの、ぜんていし…！ にほんのきんゆうインフラをゆるがす、みぞうのインシデントになるぞ…！"
    },
    # 13
    {
        "id": "prologue_13",
        "speaker": "narrator",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "深夜の死闘の末、運命の午前4時00分が訪れた。対策本部は苦渋の決断として、全仮想マシンの強制回線切断に踏み切った。",
        "speech_text": "しんやのしとうのすえ、うんめいのごぜんよじが、おとずれた。たいさくほんぶはくじゅうのけつだんとして、ぜんかそうマシンの、きょうせいかいせんせつだんに、ふみきった。"
    },
    # 14
    {
        "id": "prologue_14",
        "speaker": "aria",
        "voice": "Zephyr",
        "style": STYLE_ARIA,
        "text": "マスター、シャットダウンが執行されました。全サーバーが沈黙……ですが、不吉なデータを受信しました！",
        "speech_text": "マスター、シャットダウンがしっこうされました。ぜんサーバーがちんもく…ですが、ふきつなデータをじゅしんしました！"
    },
    # 15
    {
        "id": "prologue_15",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "……なんだ、このメッセージは？",
        "speech_text": "…なんだ、このメッセージは？"
    },
    # 16
    {
        "id": "prologue_16",
        "speaker": "narrator",
        "voice": "Fenrir",
        "style": STYLE_NARRATOR,
        "text": "ブラックアウトした画面の中央に、攻撃者からの暗号化メッセージが浮かび上がった。《シャットダウンご苦労様。だが、本当のゲームはこれからだ》。",
        "speech_text": "ブラックアウトしたがめんのちゅうおうに、こうげきしゃからのあんごうかメッセージが、うかびあがった。シャットダウンごくろうさま。だが、ほんとうのゲームは、これからだ。"
    },
    # 17
    {
        "id": "prologue_17",
        "speaker": "kei",
        "voice": "Iapetus",
        "style": STYLE_KEI,
        "text": "全26,739台のVPSを物理遮断した直後に、この挑発メッセージ……敵の仕掛けはまだ終わっていない！ アリア、セキュアVMを展開しろ！ これよりクラウド緊急対策本部の支援に入る！",
        "speech_text": "ぜんにまんろくせんななひゃくさんじゅうきゅうだいの、ブイピーエスを、ぶつりしゃだんしたちょくごに、このちょうはつメッセージ…てきのしかけは、まだおわっていない！ アリア、セキュアブイエムをてんかいしろ！ これより、クラウドきんきゅうたいさくほんぶのしえんにはいる！"
    },
    # 18
    {
        "id": "prologue_18",
        "speaker": "aria",
        "voice": "Zephyr",
        "style": STYLE_ARIA,
        "text": "了解しました、マスター。沈黙した26,739台の背後に潜む『亡霊の通信規約（ゴースト・プロトコル）』——命を削る電脳戦争の幕開けです！",
        "speech_text": "りょうかいしました、マスター。ちんもくした、にまんろくせんななひゃくさんじゅうきゅうだいの、はいごにひそむ、ぼうれいのつうしんきやく、ゴーストプロトコル。いのちをけずる、でんのうせんそうの、まくあけです！"
    }
]

def generate_line(item):
    print(f"\n[生成開始] {item['id']} ({item['speaker']}) - Voice: {item['voice']}")
    print(f"表示テキスト: 「{item['text']}」")
    print(f"発話テキスト: 「{item['speech_text']}」")

    resp = client.models.generate_content(
        model="gemini-3.8-flash-tts",
        contents=types.Content(
            role="user",
            parts=[
                types.Part(
                    text=item["speech_text"],
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

    # ffmpegで軽量MP3に変換 (128kbps)
    cmd = [
        "ffmpeg", "-y", "-i", str(wav_path),
        "-codec:a", "libmp3lame", "-b:a", "128k",
        str(mp3_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    mp3_size = mp3_path.stat().st_size
    print(f"  -> MP3保存成功: {mp3_path} ({mp3_size} bytes)")

    # 一時WAVファイル削除
    if wav_path.exists():
        wav_path.unlink()

def main():
    target_ids = []
    if "--id" in sys.argv:
        idx = sys.argv.index("--id")
        if idx + 1 < len(sys.argv):
            target_ids = sys.argv[idx + 1].split(",")

    print("==================================================")
    print("GHOST PROTOCOL - プロローグ全18セリフ音声一括生成")
    print("==================================================")

    targets = [s for s in PROLOGUE_LINES if not target_ids or s["id"] in target_ids]
    if not targets:
        print(f"指定されたIDが見つかりません: {target_ids}")
        return

    print(f"対象セリフ数: {len(targets)} 件")

    success_count = 0
    fail_count = 0

    for item in targets:
        try:
            generate_line(item)
            success_count += 1
        except Exception as e:
            print(f"  [ERROR] {item['id']} 生成失敗: {e}")
            fail_count += 1

    print("\n==================================================")
    print(f"生成完了: 成功 {success_count} 件, 失敗 {fail_count} 件")
    print("==================================================")

if __name__ == "__main__":
    main()

