import os
import sys
import base64
import wave
import subprocess
import numpy as np
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
    sys.exit(1)

client = genai.Client(
    vertexai=True,
    project=project_id,
    location=location
)

# 出力先ディレクトリ
output_dir = Path("box/assets/audio")
output_dir.mkdir(parents=True, exist_ok=True)
scratch_dir = Path("scratch/box_bgm")
scratch_dir.mkdir(parents=True, exist_ok=True)

# BOX WORM 電脳サスペンス調和・高品位インストゥルメンタルトラック定義
BGM_TRACKS = [
    {
        "file": "bgm_title.mp3",
        "title": "メインタイトル＆プロローグ: 55ドルの自己増殖知性",
        "scene": "タイトル画面、プロローグ（怪異の予兆、深夜のアパート）",
        "bpm": 82,
        "key": "D minor",
        "bars_xfade": 1, # 1小節 (4拍) = 2.927s
        "prompt": (
            "A melancholic and beautiful cyberpunk noir visual novel main theme, featuring a poignant, "
            "singable acoustic piano melody in D minor, accompanied by a warm deep solo cello and emotional orchestral string ensemble. "
            "Subtle atmospheric analog synth pads, clean gentle rhythm, reflective and mysterious Tokyo night atmosphere, "
            "sophisticated modern soundtrack composition, clear memorable melodic motifs, zero harsh dissonance, zero chaotic noise, steady 82 BPM"
        )
    },
    {
        "file": "bgm_investigation.mp3",
        "title": "現場鑑識・電脳ログ探索: 秒速0.39トークンの呼吸",
        "scene": "自室・廊下探索、パケット鑑識、ハードウェア調査",
        "bpm": 92,
        "key": "A minor",
        "bars_xfade": 1, # 1小節 (4拍) = 2.609s
        "prompt": (
            "A sophisticated cyber forensic deduction theme for a cyber crime investigation visual novel, "
            "featuring a cool, intelligent, and focused melody played on a clear electric piano and muted acoustic piano. "
            "Tonal harmony in A minor, precise electronic ticking hi-hats resembling a digital clock, clean deep synth bass groove, "
            "atmospheric cybernetic strings, highly focused deductive mood, memorable investigative melodic hook, "
            "perfectly balanced audio mix without jazz instruments, zero abrasive noise, loopable, steady 92 BPM"
        )
    },
    {
        "file": "bgm_crisis.mp3",
        "title": "鑑識協議・サイバー対決: 執行猶予へのタイムリミット",
        "scene": "シバタ捜査官との鑑識協議、令状執行の危機、反証立証",
        "bpm": 126,
        "key": "C minor",
        "bars_xfade": 2, # 2小節 (8拍) = 3.810s
        "prompt": (
            "An intense and adrenaline-pumping cinematic courtroom debate theme, featuring a fierce, dramatic, "
            "and heroic lead melody played by passionate orchestral violins and powerful brass. Driving 16th-note rhythmic bassline, "
            "urgent ticking tension, thunderous cinematic orchestral percussion, intense harmonic progression in C minor, "
            "high-stakes showdown climax, powerful melodic hook, immaculate studio mix, driving steady 126 BPM"
        )
    },
    {
        "file": "bgm_truth.mp3",
        "title": "真相解明・魂の共生契約: 小さな人形遣いとの夜明け",
        "scene": "2周目深層鑑識・真相解明、魂の共生契約、TRUE ENDエピローグ",
        "bpm": 75,
        "key": "F major / D minor",
        "bars_xfade": 1, # 1小節 (4拍) = 3.200s
        "prompt": (
            "A breathtakingly emotional and touching neo-classical instrumental theme for a true ending, "
            "featuring a deeply moving, lyrical melody played on a warm concert grand piano, "
            "accompanied by soaring, tearful orchestral strings and gentle french horns. Rich romantic harmonic progression "
            "in F major and D minor, heartfelt resolution of love, understanding, and symbiosis between human and artificial life, "
            "uplifting golden sunrise atmosphere, loopable, steady 75 BPM"
        )
    }
]

def create_beat_aligned_seamless_loop(wav_in: Path, wav_out: Path, bpm: float, bars_xfade: int = 1, loops: int = 2, head_fade_in_sec: float = 1.0):
    """
    BPMと拍子（4/4）に数学的に完全同期させた等電力クロスフェードによるシームレスループ加工。
    小節境界（bars_xfade小節分）を正確に計算し、末尾の余韻と先頭を等電力カーブ（cos/sin）でブレンド。
    さらに曲の冒頭に自然なソフトS字フェードイン（head_fade_in_sec）を施し、再生開始時の急激なアタック・違和感を解消する。
    """
    beat_sec = 60.0 / bpm
    bar_sec = beat_sec * 4.0
    crossfade_sec = bar_sec * bars_xfade

    with wave.open(str(wav_in), 'rb') as wf:
        params = wf.getparams()
        n_channels = wf.getnchannels()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)

    audio = np.frombuffer(raw, dtype=np.int16).reshape(-1, n_channels).astype(np.float32)

    xfade_frames = int(crossfade_sec * framerate)
    body_frames = len(audio) - xfade_frames

    if body_frames <= xfade_frames:
        # クリップ長が足りない場合は安全のため半分をクロスフェード
        xfade_frames = len(audio) // 4
        body_frames = len(audio) - xfade_frames

    start_chunk = audio[:xfade_frames]
    middle_chunk = audio[xfade_frames:body_frames]
    end_chunk = audio[body_frames:]

    # 等電力クロスフェード曲線 (0 -> pi/2)
    t = np.linspace(0.0, 1.0, xfade_frames)[:, np.newaxis]
    fade_out = np.cos(t * (np.pi / 2))
    fade_in = np.sin(t * (np.pi / 2))

    blended_head = end_chunk * fade_out + start_chunk * fade_in
    loop_unit = np.concatenate([blended_head, middle_chunk], axis=0)

    # 長尺化タイリング
    extended = np.tile(loop_unit, (loops, 1))

    # 冒頭ソフトフェードイン（急激なアタック・違和感の完全解消）
    head_fade_frames = int(head_fade_in_sec * framerate)
    if head_fade_frames > 0 and head_fade_frames < len(extended):
        t_head = np.linspace(0.0, 1.0, head_fade_frames)[:, np.newaxis]
        s_curve = 0.5 * (1.0 - np.cos(np.pi * t_head)) # Smooth S-curve
        extended[:head_fade_frames] *= s_curve

    processed = np.clip(extended, -32768, 32767).astype(np.int16)

    with wave.open(str(wav_out), 'wb') as wf:
        wf.setparams(params)
        wf.setnframes(len(processed))
        wf.writeframes(processed.tobytes())

    total_sec = len(processed) / framerate
    unit_sec = len(loop_unit) / framerate
    print(f"  [ループ加工] BPM={bpm}, クロスフェード={crossfade_sec:.3f}s ({bars_xfade}小節), 冒頭フェードイン={head_fade_in_sec}s -> ユニット長: {unit_sec:.1f}s, 総長: {total_sec:.1f}s")
    return total_sec

def master_loudness(wav_in: Path, mp3_out: Path, target_i: float = -18.0, target_tp: float = -1.0):
    """
    EBU R128 準拠のラウドネス・ノーマライゼーション (ffmpeg loudnorm) と高音質MP3 (192kbps) エンコード。
    ノベルゲームのセリフ読み上げの背景として最も心地よい音圧に統一する。
    """
    cmd = [
        "ffmpeg", "-y", "-i", str(wav_in),
        "-af", f"loudnorm=I={target_i}:LRA=7:TP={target_tp}",
        "-codec:a", "libmp3lame", "-b:a", "192k",
        str(mp3_out)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  [マスタリング] EBU R128 (Target {target_i} LUFS) 適用完了: {mp3_out.name}")

def main():
    remaster_only = "--remaster" in sys.argv
    target_files = [arg for arg in sys.argv[1:] if arg.endswith('.mp3')]
    tracks = [t for t in BGM_TRACKS if not target_files or t["file"] in target_files]

    print("==================================================")
    print("Vertex AI (Google DeepMind Lyria 3) - BOX WORM BGM生成")
    print(f"対象トラック数: {len(tracks)} (Remasterモード: {remaster_only})")
    print("==================================================")

    for i, track in enumerate(tracks):
        filename = track["file"]
        title = track["title"]
        prompt = track["prompt"]
        bpm = track["bpm"]
        bars_xfade = track["bars_xfade"]

        raw_mp3 = scratch_dir / f"raw_{filename}"
        temp_wav_in = scratch_dir / f"temp_{filename}.wav"
        temp_wav_loop = scratch_dir / f"loop_{filename}.wav"
        final_mp3 = output_dir / filename

        print(f"\n[{i+1}/{len(tracks)}] 処理中: {title}")
        print(f"  ファイル: {filename} ({bpm} BPM, {track['key']})")

        try:
            if not remaster_only or not raw_mp3.exists():
                print(f"  プロンプト: {prompt[:90]}...")
                inter = client.interactions.create(
                    model="lyria-3-clip-preview",
                    input=prompt
                )

                ac = inter.output_audio
                if ac and ac.data:
                    raw_bytes = base64.b64decode(ac.data) if isinstance(ac.data, str) else ac.data
                    with open(raw_mp3, "wb") as f:
                        f.write(raw_bytes)
                    print(f"  -> Lyria 3 生成成功 ({len(raw_bytes) / 1024:.1f} KB)")
                else:
                    print("  -> エラー: 音声データが取得できませんでした")
                    continue
            else:
                print(f"  -> 既存の生音源を使用: {raw_mp3.name} ({raw_mp3.stat().st_size / 1024:.1f} KB)")

            # 1. MP3 -> WAV デコード (44.1kHz Stereo)
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(raw_mp3), "-ar", "44100", "-ac", "2", str(temp_wav_in)],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )

            # 2. ビート同期シームレスループ加工 (長尺化2周分 & 冒頭1.0秒S字ソフトフェードイン)
            create_beat_aligned_seamless_loop(
                temp_wav_in, temp_wav_loop, bpm=bpm, bars_xfade=bars_xfade, loops=2, head_fade_in_sec=1.0
            )

            # 3. EBU R128 ラウドネスノーマライゼーション & 192k MP3エンコード
            master_loudness(temp_wav_loop, final_mp3, target_i=-18.0, target_tp=-1.0)
            print(f"  -> 出力完了: {final_mp3} ({final_mp3.stat().st_size / 1024:.1f} KB)")

        except Exception as e:
            print(f"  -> 生成・処理エラー: {e}")
            import traceback
            traceback.print_exc()

    print("\n==================================================")
    print("全トラックの生成＆高品位マスタリング処理が完了しました！")
    print("==================================================")

if __name__ == "__main__":
    main()
