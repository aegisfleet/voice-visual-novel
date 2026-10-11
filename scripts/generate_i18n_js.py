# -*- coding: utf-8 -*-
"""
Generate eve/js/i18n.js from scripts.english_translations
"""

import json
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.english_translations import (
    ENGLISH_SCENES,
    CHOICES_TRANSLATIONS,
    ENDINGS_TRANSLATIONS,
    EVIDENCE_TRANSLATIONS
)

def main():
    scenes_map = {}
    for s in ENGLISH_SCENES:
        scenes_map[s["id"]] = {
            "speakerEn": s["speakerEn"],
            "textEn": s["textEn"],
            "voiceFileEn": f"assets/audio/en/{s['id']}.mp3"
        }

    ui_texts = {
        "ja": {
            "cyberBadge": "CYBER FORENSICS INVESTIGATION OS",
            "titleLogo": "PROJECT<span class=\"logo-accent\">EVE</span>",
            "titleSub": "〜 家族のためのハッキング 〜",
            "startBtn": "事件の捜査を開始する",
            "startNotice": "※スマートフォン最適化・フルボイス＆シーン別BGM対応（3分〜5分）<br><span style=\"display: inline-block; margin-top: 4px; font-size: 0.78rem; color: #94a3b8; letter-spacing: 0.02em;\">※iPhone等で音が出ない場合は、本体側面の消音モード（マナーモード）をオフにしてください</span>",
            "portalLink": "🏠 ゲームポータル（作品一覧）へ",
            "reinvestBanner": "🔓 【FILE RE-OPEN】再捜査モード解放中！<br><small>初動捜査で新たな手掛かりを調査可能になりました</small>",
            "badgeBadCleared": "❌ BAD END: 達成済",
            "badgeBadUncleared": "❌ BAD END: 未達成",
            "badgeTrueCleared": "🌟 TRUE END: 達成済",
            "badgeTrueUncleared": "🌟 TRUE END: 未達成",
            "extraLocked": "🔒 EXTRA: TRUE END到達でおまけ（試聴室・小説版）が解放",
            "extraUnlocked": "🎁 【CLEAR BONUS】EXTRAモード解放中！",
            "btnExtraSamples": "🎧 ボイス＆BGM試聴室",
            "btnExtraNovel": "📖 トゥルーエンド小説版",
            "btnEvidence": "証拠品",
            "evidenceArchiveTitle": "📁 証拠品アーカイブ",
            "evidenceEmpty": "現在所持している証拠品はありません。",
            "btnBack": "◀ 戻る",
            "btnClose": "閉じる",
            "btnReturnTitle": "タイトルへ戻る",
            "logTitle": "捜査・調書ログ (Log)",
            "evidencePopupPrefix": "証拠品入手: ",
            "evidencePopupDefault": "証拠品を入手しました",
            "presentBanner": "⚡ 【証拠品をつきつけて真実を立証せよ！】 ⚡",
            "giveUpBtnText": "⚠️ 「……サクマ警視を止める客観的証拠はない」（初期化を容認）",
            "reinvestTag": "【再捜査 FILE RE-OPEN】",
            "endingExtraAnnounce": "🎉 クリア特典がアンロックされました！",
            "endingExtraNovel": "📖 トゥルーエンド小説版を読む",
            "endingExtraSamples": "🎧 ボイス＆BGM試聴室へ",
            "speakerYou": "あなた",
            "speakerScene": "状況",
            "langToggleLabel": "言語 / Language",
            "hudLangBtn": "EN"
        },
        "en": {
            "cyberBadge": "CYBER FORENSICS INVESTIGATION OS",
            "titleLogo": "PROJECT<span class=\"logo-accent\">EVE</span>",
            "titleSub": "~ Hacking for Family ~",
            "startBtn": "Start Investigation",
            "startNotice": "* Optimized for mobile / Full voice & scene BGM (3-5 min)<br><span style=\"display: inline-block; margin-top: 4px; font-size: 0.78rem; color: #94a3b8; letter-spacing: 0.02em;\">* If no audio on iPhone, please turn off Silent Mode</span>",
            "portalLink": "🏠 Game Portal (Archive)",
            "reinvestBanner": "🔓 [FILE RE-OPEN] Re-investigation Mode Unlocked!<br><small>New clues can now be investigated during initial inquiry</small>",
            "badgeBadCleared": "❌ BAD END: Cleared",
            "badgeBadUncleared": "❌ BAD END: Incomplete",
            "badgeTrueCleared": "🌟 TRUE END: Cleared",
            "badgeTrueUncleared": "🌟 TRUE END: Incomplete",
            "extraLocked": "🔒 EXTRA: Reach TRUE END to unlock Voice Room & Novel",
            "extraUnlocked": "🎁 [CLEAR BONUS] EXTRA Mode Unlocked!",
            "btnExtraSamples": "🎧 Voice & BGM Room",
            "btnExtraNovel": "📖 True End Novel",
            "btnEvidence": "Evidence",
            "evidenceArchiveTitle": "📁 Evidence Archive",
            "evidenceEmpty": "No evidence currently in possession.",
            "btnBack": "◀ Back",
            "btnClose": "Close",
            "btnReturnTitle": "Return to Title",
            "logTitle": "Investigation Log",
            "evidencePopupPrefix": "Evidence Obtained: ",
            "evidencePopupDefault": "Evidence obtained",
            "presentBanner": "⚡ [Present evidence to prove the truth!] ⚡",
            "giveUpBtnText": "⚠️ \"...No objective evidence to stop Insp. Sakuma\" (Accept purge)",
            "reinvestTag": "[FILE RE-OPEN]",
            "endingExtraAnnounce": "🎉 Clear bonus unlocked!",
            "endingExtraNovel": "📖 Read True End Novel",
            "endingExtraSamples": "🎧 Go to Voice & BGM Room",
            "speakerYou": "You",
            "speakerScene": "Scene",
            "langToggleLabel": "Language / 言語",
            "hudLangBtn": "JP"
        }
    }

    speakers_map = {
        "サクマ警視": "Insp. Sakuma",
        "アイリス": "Iris",
        "シノハラ": "Shinohara",
        "イブ": "Eve",
        "あなた": "You"
    }

    content = f"""/**
 * PROJECT EVE - Internationalization (i18n) Module
 * Supports Japanese (ja) and English (en) with full voice integration.
 */

const I18N_DATA = {{
  currentLang: 'ja',
  ui: {json.dumps(ui_texts, ensure_ascii=False, indent=2)},
  scenes: {json.dumps(scenes_map, ensure_ascii=False, indent=2)},
  speakers: {json.dumps(speakers_map, ensure_ascii=False, indent=2)},
  choices: {json.dumps(CHOICES_TRANSLATIONS, ensure_ascii=False, indent=2)},
  endings: {json.dumps(ENDINGS_TRANSLATIONS, ensure_ascii=False, indent=2)},
  evidence: {json.dumps(EVIDENCE_TRANSLATIONS, ensure_ascii=False, indent=2)}
}};

if (typeof window !== 'undefined') {{
  window.I18N_DATA = I18N_DATA;
}}
"""

    out_file = Path("eve/js/i18n.js")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {out_file} successfully.")

if __name__ == "__main__":
    main()
