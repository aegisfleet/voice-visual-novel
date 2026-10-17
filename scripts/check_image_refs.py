import re
from pathlib import Path

exts = ['.html', '.js', '.css']
for f in Path('box').rglob('*'):
    if f.suffix in exts:
        text = f.read_text(encoding='utf-8')
        matches = re.findall(r'[\'\"](assets/[^\'\"]+\.(?:png|jpg|svg)[^\'\"]*)[\'\"]', text)
        if matches:
            print(f"=== {f} ===")
            for m in sorted(set(matches)):
                print(f"  {m}")
