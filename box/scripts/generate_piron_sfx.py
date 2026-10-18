import wave
import subprocess
import numpy as np
from pathlib import Path

# 出力先
output_dir = Path("box/assets/audio")
output_dir.mkdir(parents=True, exist_ok=True)
scratch_dir = Path("scratch/piron_test")
scratch_dir.mkdir(parents=True, exist_ok=True)

SR = 44100

def create_bell_tone(freq, duration_sec, decay_rate=8.0, harmonics=[(1.0, 1.0), (2.0, 0.25), (3.0, 0.1), (4.2, 0.05)]):
    """ベル・チャイム特有の自然な減衰と澄んだ倍音を合成"""
    t = np.linspace(0.0, duration_sec, int(SR * duration_sec), endpoint=False)
    signal = np.zeros_like(t)
    envelope = np.exp(-decay_rate * t)

    for h_mult, h_amp in harmonics:
        # 倍音ごとに微妙に減衰率を変えて金属・ガラスの自然な響きを再現
        h_env = np.exp(-decay_rate * (1.0 + 0.3 * (h_mult - 1.0)) * t)
        signal += h_amp * np.sin(2.0 * np.pi * (freq * h_mult) * t) * h_env

    # 立ち上がりクリック防止 (アタック 2ms)
    attack_frames = int(SR * 0.003)
    if attack_frames > 0:
        signal[:attack_frames] *= np.linspace(0.0, 1.0, attack_frames)

    return signal

def export_mp3(signal, wav_path, mp3_path, target_lufs=-14.0):
    """ステレオWAV出力 & EBU R128ラウドネスノーマライズMP3エンコード"""
    # ステレオ化
    stereo = np.column_stack([signal, signal])
    stereo = np.clip(stereo * 32767.0 / np.max(np.abs(stereo)), -32767, 32767).astype(np.int16)

    with wave.open(str(wav_path), 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo.tobytes())

    cmd = [
        "ffmpeg", "-y", "-i", str(wav_path),
        "-af", f"loudnorm=I={target_lufs}:TP=-0.5",
        "-codec:a", "libmp3lame", "-b:a", "192k",
        str(mp3_path)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Generated: {mp3_path.name} ({mp3_path.stat().st_size} bytes)")

def add_signal(target, source, offset):
    end = min(len(target), offset + len(source))
    length = end - offset
    if length > 0:
        target[offset:end] += source[:length]

def generate_pattern_a():
    """パターンA: 王道ピロン (D6 -> A6, 完全5度上行の澄んだクリスタルチャイム)"""
    total_len = 0.8
    sig = np.zeros(int(SR * total_len))
    tone1 = create_bell_tone(1174.66, 0.4, decay_rate=14.0)
    tone2 = create_bell_tone(1760.00, 0.65, decay_rate=6.5)

    add_signal(sig, tone1 * 0.75, 0)
    add_signal(sig, tone2 * 1.0, int(SR * 0.075))
    return sig

def generate_pattern_b():
    """パターンB: 爽やかピロリン (E6 -> G#6 -> B6, 長3和音アルペジオのセレスタチャイム)"""
    total_len = 0.9
    sig = np.zeros(int(SR * total_len))
    tone1 = create_bell_tone(1318.51, 0.4, decay_rate=16.0) # E6
    tone2 = create_bell_tone(1661.22, 0.45, decay_rate=14.0) # G#6
    tone3 = create_bell_tone(1975.53, 0.7, decay_rate=6.0) # B6

    add_signal(sig, tone1 * 0.65, 0)
    add_signal(sig, tone2 * 0.85, int(SR * 0.065))
    add_signal(sig, tone3 * 1.0, int(SR * 0.13))
    return sig

def generate_pattern_c():
    """パターンC: 電脳サイバー・ピロン (C#6 -> F#6, ハイテクホログラムUIチャイム)"""
    total_len = 0.7
    sig = np.zeros(int(SR * total_len))
    tone1 = create_bell_tone(1108.73, 0.35, decay_rate=18.0, harmonics=[(1.0, 1.0), (2.0, 0.4), (3.1, 0.2)])
    tone2 = create_bell_tone(1479.98, 0.6, decay_rate=8.0, harmonics=[(1.0, 1.0), (2.0, 0.35), (3.0, 0.15), (4.5, 0.08)])

    add_signal(sig, tone1 * 0.7, 0)
    add_signal(sig, tone2 * 1.0, int(SR * 0.06))
    return sig

def generate_pattern_d():
    """パターンD: 優しいソフト・ピロン (A5 -> E6, 角の取れた温かいフェルト・ベル)"""
    total_len = 0.8
    sig = np.zeros(int(SR * total_len))
    tone1 = create_bell_tone(880.00, 0.4, decay_rate=12.0, harmonics=[(1.0, 1.0), (2.0, 0.15)])
    tone2 = create_bell_tone(1318.51, 0.65, decay_rate=5.5, harmonics=[(1.0, 1.0), (2.0, 0.2)])

    add_signal(sig, tone1 * 0.7, 0)
    add_signal(sig, tone2 * 1.0, int(SR * 0.08))
    return sig

if __name__ == "__main__":
    # ピロンSEの音量を小さめ(-19.0 LUFS)に設定して耳に優しく調整
    SFX_TARGET_LUFS = -19.0

    patterns = [
        ("sfx_evidence_a.mp3", generate_pattern_a(), "パターンA: 王道ピロン (Crystal 2-tone)"),
        ("sfx_evidence_b.mp3", generate_pattern_b(), "パターンB: 爽やかピロリン (Sparkle 3-tone)"),
        ("sfx_evidence_c.mp3", generate_pattern_c(), "パターンC: 電脳サイバー・ピロン (Cyber Hologram)"),
        ("sfx_evidence_d.mp3", generate_pattern_d(), "パターンD: 優しいソフト・ピロン (Warm Soft Bell)"),
    ]

    for fname, sig, desc in patterns:
        wav_p = scratch_dir / f"{Path(fname).stem}.wav"
        mp3_p = output_dir / fname
        export_mp3(sig, wav_p, mp3_p, target_lufs=SFX_TARGET_LUFS)

    # ユーザー要望に基づき「パターンB (爽やかピロリン♪)」を正式デフォルトとして採用
    default_evidence_mp3 = output_dir / "sfx_evidence.mp3"
    export_mp3(generate_pattern_b(), scratch_dir / "evidence_default.wav", default_evidence_mp3, target_lufs=SFX_TARGET_LUFS)
    print("\n証拠品SEのデフォルトを『パターンB: 爽やかピロリン♪』に更新完了！（音量: -19.0 LUFS）")

    # カットイン激突音 (sfx_cutin.mp3) も音量を約4.5dB下げてリマスター
    cutin_file = output_dir / "sfx_cutin.mp3"
    if cutin_file.exists():
        temp_cutin = scratch_dir / "cutin_attenuated.mp3"
        cmd = [
            "ffmpeg", "-y", "-i", str(cutin_file),
            "-filter:a", "volume=-4.5dB",
            "-codec:a", "libmp3lame", "-b:a", "192k",
            str(temp_cutin)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        temp_cutin.replace(cutin_file)
        print("sfx_cutin.mp3 の音量を -4.5dB 減衰してリマスター完了！")
