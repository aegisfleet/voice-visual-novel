"""
scripts/speedup_prologue_voices.py - プロローグ音声を 1.18倍速 (テンポ感向上) に変換するスクリプト
ピッチ（声の高さ）を変えずに話速だけを 1.18倍速にすることで、早口で歯切れの良いテンポを実現する。
"""
import subprocess
from pathlib import Path

DIR = Path("box/assets/audio/prologue")
TEMPO = 1.18

mp3_files = sorted(DIR.glob("prologue_*.mp3"))
print(f"対象ファイル数: {len(mp3_files)} 件")

for f in mp3_files:
    temp_f = DIR / f"{f.stem}_fast.mp3"
    cmd = [
        "ffmpeg", "-y", "-i", str(f),
        "-filter:a", f"atempo={TEMPO}",
        "-codec:a", "libmp3lame", "-b:a", "128k",
        str(temp_f)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    temp_f.replace(f)
    print(f"  -> {f.name} を {TEMPO}倍速に変換完了 ({f.stat().st_size} bytes)")

print("\n全プロローグ音声を早口テンポに変換しました！")
