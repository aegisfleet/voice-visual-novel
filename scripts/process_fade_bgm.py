import os
import sys
import subprocess
import wave
import numpy as np
from pathlib import Path

# UTF-8 出力を設定
sys.stdout.reconfigure(encoding='utf-8')

def process_fade_out_bgm(input_mp3: Path, output_mp3: Path, fade_out_sec: float = 3.5, silence_tail_sec: float = 1.5, fade_in_sec: float = 0.5):
    """
    BGMの末尾を滑らかにフェードアウトさせ、自然な余韻・呼吸（静寂インターバル）を設ける。
    先頭にも微小なソフトフェードインを施し、不自然なアタック音やつなぎ目の違和感を完全に解消する。
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
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)

        audio = np.frombuffer(raw_data, dtype=np.int16).reshape(-1, n_channels).astype(np.float32)

        total_frames = len(audio)
        fade_in_frames = int(fade_in_sec * framerate)
        fade_out_frames = int(fade_out_sec * framerate)
        silence_frames = int(silence_tail_sec * framerate)

        # 3. 先頭ソフトフェードイン (0.0 -> 1.0)
        if fade_in_frames > 0 and fade_in_frames < total_frames:
            t_in = np.linspace(0.0, 1.0, fade_in_frames)[:, np.newaxis]
            # Smooth S-curve
            fade_in_curve = 0.5 * (1.0 - np.cos(np.pi * t_in))
            audio[:fade_in_frames] *= fade_in_curve

        # 4. 末尾フェードアウト (1.0 -> 0.0)
        # 滑らかに指数減衰・余弦カーブで完全無音へ導く
        if fade_out_frames > 0 and fade_out_frames < total_frames:
            t_out = np.linspace(0.0, 1.0, fade_out_frames)[:, np.newaxis]
            # Cosine decay: 1.0 -> 0.0
            fade_out_curve = 0.5 * (1.0 + np.cos(np.pi * t_out))
            audio[-fade_out_frames:] *= fade_out_curve

        # 5. 末尾に無音インターバルを追加 (余韻・ブレス)
        if silence_frames > 0:
            silence = np.zeros((silence_frames, n_channels), dtype=np.float32)
            processed_audio = np.concatenate([audio, silence], axis=0)
        else:
            processed_audio = audio

        # 16-bit PCM にクリップして書き出し
        processed_audio = np.clip(processed_audio, -32768, 32767).astype(np.int16)

        with wave.open(str(temp_wav_out), "wb") as wf:
            wf.setparams(params)
            wf.setnframes(len(processed_audio))
            wf.writeframes(processed_audio.tobytes())

        # 6. WAV -> 高音質 MP3 (192kbps) にエンコード
        cmd_encode = [
            "ffmpeg", "-y", "-i", str(temp_wav_out),
            "-codec:a", "libmp3lame", "-b:a", "192k", str(output_mp3)
        ]
        subprocess.run(cmd_encode, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        print(f"-> フェードアウト＆余韻加工完了: {output_mp3.name} (総再生時間: {len(processed_audio)/framerate:.1f}s)")

    finally:
        if temp_wav_in.exists():
            temp_wav_in.unlink()
        if temp_wav_out.exists():
            temp_wav_out.unlink()

if __name__ == "__main__":
    audio_dir = Path("assets/audio")
    bgm_files = ["bgm_title.mp3", "bgm_investigation.mp3", "bgm_crisis.mp3", "bgm_truth.mp3"]

    print("==================================================")
    print("BGM 自然フェードアウト＆余韻インターバル加工")
    print("==================================================")

    for bgm in bgm_files:
        p = audio_dir / bgm
        if p.exists():
            print(f"処理中: {bgm}")
            out_p = audio_dir / f"fade_{bgm}"
            process_fade_out_bgm(p, out_p, fade_out_sec=3.5, silence_tail_sec=1.5, fade_in_sec=0.6)
            out_p.replace(p)
        else:
            print(f"見つかりません: {bgm}")

    print("\n全トラックのフェードアウト加工が完了しました！")
