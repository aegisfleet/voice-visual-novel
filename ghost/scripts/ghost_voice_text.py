# -*- coding: utf-8 -*-
"""GHOST PROTOCOL 音声生成用の読み上げテキスト正規化モジュール。"""

import re

VOICE_PROFILES = {
    "narrator": {
        "voice": "Fenrir",
        "style": (
            "gritty, mature, calm, noir detective narrator, atmospheric and steady low voice, "
            "clear Japanese articulation, serious tension"
        ),
    },
    "kei": {
        "voice": "Puck",
        "style": (
            "youthful articulate young Japanese engineer in his late 20s, energetic, intellectual, "
            "sharp and determined, speaking up firmly and clearly"
        ),
    },
    "aria": {
        "voice": "Zephyr",
        "style": (
            "clear, articulate, gentle ethereal cyber AI girl, sweet, transparent, softly emotional, "
            "speaking clearly in Japanese with subtle digital warmth"
        ),
    },
    "takamiya": {
        "voice": "Puck",
        "style": (
            "urgent, stressed young man reaching out to best friend, energetic, frantic yet earnest "
            "and determined, articulate Japanese"
        ),
    },
    "kuroda": {
        "voice": "Algenib",
        "style": (
            "raspy weathered veteran detective in his 50s, gritty and experienced, rough authority, "
            "imposing yet deeply principled in Japanese"
        ),
    },
    "mio": {
        "voice": "Leda",
        "style": (
            "youthful, intelligent Japanese female intelligence analyst in her early 20s, cute yet savvy, "
            "confident playful smirk, melodic and clear Japanese"
        ),
    },
}

# 長い表記から先に置換する（FT4/FT5 → FT4 の順序事故を防ぐ）
MIXED_TERMS = [
    ("AD（Active Directory）", "エーディー、アクティブディレクトリ"),
    ("AD (Active Directory)", "エーディー、アクティブディレクトリ"),
    ("Remote Desktop Protocol", "リモートデスクトッププロトコル"),
    ("GNOインターネットグループ", "ジーエヌオーインターネットグループ"),
    ("KPS Office", "ケーピーエスオフィス"),
    ("Cドライブ", "シードライブ"),
    ("Лист1", "リストいち"),
    (".rdp", "アールディーピー"),
    ("Office", "オフィス"),
    ("Hacking Team", "ハッキングチーム"),
    ("Bug Bounty", "バグバウンティ"),
    ("Tor Bridge Relay", "トーブリッジリレー"),
    ("Tor Exit Node", "トーイグジットノード"),
    ("ApexTrading", "エイペックストレーディング"),
    ("Dmitry Orlov", "ドミトリー・オルロフ"),
    ("Cybercrime", "サイバークライム"),
    ("Active Directory", "アクティブディレクトリ"),
    ("drivestoredirect:s:*", "ドライブストアダイレクト"),
    ("redirectclipboard:i:1", "リダイレクトクリップボード"),
    ("administrative session:i:1", "アドミニストレーティブセッション"),
    ("screen mode id:i:2", "スクリーンモード"),
    ("session:i:1", "セッション"),
    ("xl/workbook.xml", "エックスエル、ワークブックドットエックスエムエル"),
    ("samples.zip", "サンプルズドットジップ"),
    ("coronamng.store", "コロナマネージドットストア"),
    ("DNS/HTTP", "ディーエヌエス、エイチティーティーピー"),
    ("Sheet1", "シートワン"),
    ("IS8FX", "アイエスエイトエフエックス"),
    ("DEMOFASTLOSS", "デモファストロス"),
    ("Investor Password", "インベスターパスワード"),
    ("Login Data", "ログインデータ"),
    ("Root Cause", "ルートコーズ"),
    ("False Flag", "フォールスフラッグ"),
    ("Session Kill", "セッションキル"),
    ("GHOST PROTOCOL", "ゴーストプロトコル"),
    ("Ghost Protocol", "ゴーストプロトコル"),
    ("FINAL DEDUCTION", "ファイナルディダクション"),
    ("PoC", "ピーオーシー"),
    ("SQLite", "エスキューライト"),
    ("Chrome", "クローム"),
    ("Excel", "エクセル"),
    ("Windows", "ウィンドウズ"),
    ("Linux", "リナックス"),
    ("Web", "ウェブ"),
    ("Tor", "トー"),
    ("Orlov", "オルロフ"),
    ("Relay", "リレー"),
    ("Bridge", "ブリッジ"),
    ("Bounty", "バウンティ"),
    ("Administrative", "アドミニストレーティブ"),
    ("Session", "セッション"),
]

# ASCII英数字のみの用語は、英単語の一部を誤置換しないよう境界判定付きで置換する
LATIN_TERMS = [
    ("FT4/FT5", "エフティーフォー、エフティーファイブ"),
    ("SOCKS5", "ソックスファイブ"),
    ("CSIRT", "シーサート"),
    ("NCO", "エヌシーオー"),
    ("KPS", "ケーピーエス"),
    ("GNO", "ジーエヌオー"),
    ("VPS", "ブイピーエス"),
    ("RPC", "アールピーシー"),
    ("API", "エーピーアイ"),
    ("TCP", "ティーシーピー"),
    ("SMTP", "エスエムティーピー"),
    ("HTML", "エイチティーエムエル"),
    ("XML", "エックスエムエル"),
    ("HTTP", "エイチティーティーピー"),
    ("DNS", "ディーエヌエス"),
    ("SNS", "エスエヌエス"),
    ("FAX", "ファックス"),
    ("ECN", "イーシーエヌ"),
    ("F12", "エフじゅうに"),
    ("FT4", "エフティーフォー"),
    ("FT5", "エフティーファイブ"),
    ("RDP", "アールディーピー"),
    ("C2", "シーツー"),
    ("AI", "エーアイ"),
    ("VM", "ブイエム"),
    ("AD", "エーディー"),
    ("OS", "オーエス"),
    ("DB", "ディービー"),
    ("PC", "ピーシー"),
    ("IP", "アイピー"),
    ("FX", "エフエックス"),
    ("4G", "フォージー"),
    ("5G", "ファイブジー"),
]

BRACKET_RE = re.compile(r"[『』「」【】《》（）\[\]〔〕]")
ELLIPSIS_RE = re.compile(r"(?:…{2,}|―{2,}|—{2,}|──+|-\s*-)")
IP_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
TS_CLIENT_RE = re.compile(r"\\{1,4}tsclient\\{1,4}C", re.IGNORECASE)
SPACE_RE = re.compile(r"[ \t\u3000]+")
PAUSE_RE = re.compile(r"[、,]{2,}")


def _replace_latin_terms(text: str) -> str:
    for term, reading in LATIN_TERMS:
        pattern = re.compile(rf"(?<![A-Za-z0-9]){re.escape(term)}(?![A-Za-z0-9])")
        text = pattern.sub(reading, text)
    return text


def _replace_ip_address(match: re.Match) -> str:
    digit_readings = {
        "0": "ゼロ",
        "1": "いち",
        "2": "に",
        "3": "さん",
        "4": "よん",
        "5": "ご",
        "6": "ろく",
        "7": "なな",
        "8": "はち",
        "9": "きゅう",
    }
    parts = match.group(0).split(".")
    return "てん、".join("".join(digit_readings[d] for d in part) for part in parts)


def normalize_for_tts(text: str) -> str:
    """表示テキストを、誤読しにくい読み上げ用テキストへ変換する。"""
    cleaned = text.strip()

    # 外側を囲む引用符・鉤括弧は読み上げ時の余計な抑揚を避けるため除去
    for opening, closing in (("『", "』"), ("「", "」"), ("【", "】"), ("《", "》")):
        if cleaned.startswith(opening) and cleaned.endswith(closing):
            cleaned = cleaned[1:-1].strip()
            break

    cleaned = TS_CLIENT_RE.sub("ティーエスクライアント・シードライブ", cleaned)
    cleaned = IP_RE.sub(_replace_ip_address, cleaned)

    for term, reading in MIXED_TERMS:
        cleaned = cleaned.replace(term, reading)

    cleaned = _replace_latin_terms(cleaned)

    # 記号・括弧類を自然な間（ポーズ）へ変換
    cleaned = BRACKET_RE.sub("、", cleaned)
    cleaned = cleaned.replace("%", "パーセント")
    cleaned = cleaned.replace("℃", "度")
    cleaned = cleaned.replace("&", "と")
    cleaned = cleaned.replace("：", "、")
    cleaned = cleaned.replace(":", "、")
    cleaned = cleaned.replace("/", "、")
    cleaned = ELLIPSIS_RE.sub("、", cleaned)
    cleaned = cleaned.replace("……", "、")
    cleaned = cleaned.replace("——", "、")
    cleaned = cleaned.replace("—", "、")

    cleaned = cleaned.replace("\n", "、").replace("\r", "、")
    cleaned = SPACE_RE.sub(" ", cleaned)
    cleaned = PAUSE_RE.sub("、", cleaned)
    cleaned = re.sub(r"、\s*、", "、", cleaned)
    cleaned = re.sub(r"([、。！？])\1+", r"\1", cleaned)
    cleaned = cleaned.strip(" 、")

    return cleaned
