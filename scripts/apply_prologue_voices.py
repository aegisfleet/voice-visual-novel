import re

target_file = 'box/js/scenario.js'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# まず、シバタの分割セリフを1つに統合
old_shibata_lines = """    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「エッジAIのプロなら話が早い。令状班が突入してくるまで猶予は10分だ。あの小箱や君のPCがサイバー攻撃の首謀者ではなく、未知の何かに巻き込まれた被害者である客観的証拠を提示しろ」',
    },
    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「納得のいく説明ができなければ、直ちに貴室の全機器を押収し、署まで連行する！」',
    },"""

new_shibata_lines = """    {
      speaker: 'シバタ捜査官',
      emotion: 'angry',
      text: '「エッジAIのプロなら話が早い。令状班が突入してくるまで猶予は10分だ。あの小箱や君のPCがサイバー攻撃の首謀者ではなく、未知の何かに巻き込まれた被害者である客観的証拠を提示しろ。納得のいく説明ができなければ、直ちに貴室の全機器を押収し、署まで連行する！」',
    },"""

if old_shibata_lines in content:
    content = content.replace(old_shibata_lines, new_shibata_lines)
    print("Merged Shibata's deadline lines into one.")

# prologue: [ から prologueLoop2: [ までの間を置換
pattern = re.compile(r'(prologue:\s*\[)(.*?)(\],\s*// -+\s*// 2周目専用プロローグ)', re.DOTALL)

match = pattern.search(content)
if not match:
    print("Error: prologue block not found")
    exit(1)

header = match.group(1)
body = match.group(2)
footer = match.group(3)

# 各オブジェクトブロック { ... } を抽出
obj_pattern = re.compile(r'(\{[^{}]*?\})', re.DOTALL)
items = obj_pattern.findall(body)
print(f"Found {len(items)} dialogue items in prologue.")

if len(items) != 23:
    print(f"Error: Expected 23 items, but found {len(items)}")
    exit(1)

new_items = []
for i, item in enumerate(items, 1):
    num_str = f"{i:02d}"
    voice_url_line = f"      voiceUrl: 'assets/audio/prologue/prologue_{num_str}.mp3',\n"
    # voiceUrlが既にあれば置換、無ければ最後の } の直前に挿入
    if 'voiceUrl:' in item:
        new_item = re.sub(r"voiceUrl:\s*'.*?',?\n?", voice_url_line.strip() + '\n', item)
    else:
        # text: '...' の後ろに挿入
        new_item = re.sub(r"(text:\s*'.*?',?\n)", r"\1" + voice_url_line, item)
    new_items.append(new_item)

# 新しいbodyを構築
new_body = "\n" + ",\n".join([it.rstrip(',\n') for it in new_items]) + ",\n  "
new_content = content[:match.start()] + header + new_body + footer + content[match.end():]

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated box/js/scenario.js with prologue voiceUrls!")
