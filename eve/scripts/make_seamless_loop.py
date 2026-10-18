import os
import sys
import subprocess
import wave
import numpy as np
from pathlib import Path

# UTF-8 出力を設定
sys.stdout.reconfigure(encoding='utf-8')

def create_seamless_loop(input_mp3: Path, output_mp3: Path, crossfade_sec: float = 3.5):
    """
    指定されたMP3音声の末尾と先頭をクロスフェードブレンドし、
    <audio loop> で完全につなぎ目のないシームレスループ音声を生成する。
    """
    temp_wav_in = input_mp3.parent / f"temp_in_{input_mp3.stem}.wav"
    temp_wav_out = input_mp3.parent / f"temp_out_{input_mp3.stem}.wav"

    try:
        # 1. MP3 -> WAV デコード (44.1kHz 16bit Stereo)
        cmd_decode = [
            "ffmpeg", "-y", "-i", str(input_mp3),
            "-ar", "44100", "-ac", "2", "-f", "wav", str(temp_wav_in)
        ]
        subprocess.run(cmd_decode, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # 2. WAV の読み込み
        with wave.open(str(temp_wav_in), "rb") as wf:
            params = wf.getparams()
            n_channels = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)

        # 16-bit PCM を numpy 配列に変換
        audio = np.frombuffer(raw_data, dtype=np.int16).reshape(-1, n_channels).astype(np.float32)

        fade_frames = int(crossfade_sec * framerate)
        if fade_frames * 2 >= len(audio):
            raise ValueError("クロスフェード秒数が音声の長さに対して長すぎます")

        # 3. 末尾 fade_frames と 先頭 fade_frames をクロスフェード
        # 等パワー（Equal Power）クロスフェード曲線で自然な音量を維持
        # t: 0.0 -> 1.0
        t = np.linspace(0.0, 1.0, fade_frames, endpoint=False)
        # linear または equal-power: cos/sin
        fade_out = np.cos(t * (np.pi / 2)) # 1.0 -> 0.0
        fade_in = np.sin(t * (np.pi / 2))  # 0.0 -> 1.0

        # チャンネルごとのブロードキャスト用
        fade_out = fade_out[:, np.newaxis]
        fade_in = fade_in[:, np.newaxis]

        head = audio[:fade_frames]
        tail = audio[-fade_frames:]
        middle = audio[fade_frames:-fade_frames]

        # 重ね合わせ（ブレンド）
        blended = tail * fade_out + head * fade_in

        # 新しいループ音声: blended (先頭兼末尾つなぎ部) + middle + ...
        # ループ時に末尾から先頭へ戻る際、tailの終わりからblendedの始まりへ繋がるため
        # 順番を [middle, blended] にすると、
        # 再生順: middle -> blended -> (ループ) -> middle ... となり、
        # blended の終端 (head[fade_frames] に等しい) が middle の先頭 (head[fade_frames] に等しい) と完璧に連続する！
        loop_audio = np.concatenate([middle, blended], axis=0)

        # int16 にクリッピングして書き戻し
        loop_audio = np.clip(loop_audio, -32768, 32767).astype(np.int16)

        with wave.open(str(temp_wav_out), "wb") as wf:
            wf.setparams(params)
            wf.setnframes(len(loop_audio))
            wf.writeframes(loop_audio.tobytes())

        # 4. WAV -> 高音質 MP3 (192kbps) にエンコード
        cmd_encode = [
            "ffmpeg", "-y", "-i", str(temp_wav_out),
            "-codec:a", "libmp3lame", "-b:a", "192k", str(output_mp3)
        ]
        subprocess.run(cmd_encode, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        print(f"-> シームレスループ化完了: {output_mp3.name} (元: {len(audio)/framerate:.1f}s -> ループ長: {len(loop_audio)/framerate:.1f}s)")

    finally:
        # 一時ファイルの削除
        if temp_wav_in.exists():
            temp_wav_in.unlink()
        if temp_wav_out.exists():
            temp_wav_out.unlink()

if __name__ == "__main__":
    audio_dir = Path("assets/audio")
    bgm_files = ["bgm_title.mp3", "bgm_investigation.mp3", "bgm_crisis.mp3", "bgm_truth.mp3"]

    print("==================================================")
    print("BGM シームレス・クロスフェードループ加工")
    print("==================================================")

    for bgm in bgm_files:
        p = audio_dir / bgm
        if p.exists():
            print(f"処理中: {bgm}")
            # 一時ファイルに出力してから置き換え
            out_p = audio_dir / f"seamless_{bgm}"
            create_seamless_loop(p, out_p, crossfade_sec=4.0)
            # 置き換え
            out_p.replace(p)
        else:
            print(f"見つかりません: {bgm}")

    print("\n全トラックのシームレスループ加工が完了しました！")
