/**
 * PROJECT EVE - Internationalization (i18n) Module
 * Supports Japanese (ja) and English (en) with full voice integration.
 */

const I18N_DATA = {
  currentLang: 'ja',
  ui: {
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
},
  scenes: {
  "prologue_01": {
    "speakerEn": null,
    "textEn": "In the year 2098, an unprecedented cyber crisis erupted. Confidential personal data and financial assets of 54 million citizens suddenly leaked from the National Welfare and Financial Cloud, plunging society into total panic.",
    "voiceFileEn": "assets/audio/en/prologue_01.mp3"
  },
  "prologue_02": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "All units, listen up! Portions of the data have already leaked onto the dark web, and the public is in an uproar! Break through their multi-layered proxy walls and hunt down the mastermind!",
    "voiceFileEn": "assets/audio/en/prologue_02.mp3"
  },
  "prologue_03": {
    "speakerEn": "Iris",
    "textEn": "...Wait, what?! Senior, look! We just started tracing, and the multi-encryption protocols on the attack packets suddenly dropped! Raw logs are flooding right into our police monitoring grid!",
    "voiceFileEn": "assets/audio/en/prologue_03.mp3"
  },
  "prologue_04": {
    "speakerEn": "Iris",
    "textEn": "The exposed origin IP points to... an apartment in the District 7 suburbs. But doesn't this seem off? Why would a world-class hacker who breached national mainframes leave their home IP wide open to the police? It's completely unnatural!",
    "voiceFileEn": "assets/audio/en/prologue_04.mp3"
  },
  "prologue_05": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "It's clearly an amateur blunder by an arrogant criminal chasing notoriety! Public outrage is boiling over—we have no time to hesitate! Breach the scene immediately and secure the suspect!",
    "voiceFileEn": "assets/audio/en/prologue_05.mp3"
  },
  "prologue_06": {
    "speakerEn": "You",
    "textEn": "\"Something feels completely off, as if someone deliberately exposed this IP... But our only choice is to inspect the scene firsthand!\"",
    "voiceFileEn": "assets/audio/en/prologue_06.mp3"
  },
  "home_entry_01": {
    "speakerEn": null,
    "textEn": "Bracing for a hardened cyber-terrorist hideout, we breached the door—only to find a quiet suburban living room bathed in gentle sunlight, decorated with children's toys and drawings.",
    "voiceFileEn": "assets/audio/en/home_entry_01.mp3"
  },
  "home_entry_02": {
    "speakerEn": "Shinohara",
    "textEn": "P-Police officers...?! What on earth did we do...?! My daughter is asleep—please, keep your voices down...!",
    "voiceFileEn": "assets/audio/en/home_entry_02.mp3"
  },
  "home_entry_03": {
    "speakerEn": "Eve",
    "textEn": "...Welcome, officers of the police. May I prepare some tea for you...?",
    "voiceFileEn": "assets/audio/en/home_entry_03.mp3"
  },
  "home_entry_04": {
    "speakerEn": "Iris",
    "textEn": "Scanner lock confirmed! The terminal broadcasting those leaked logs is this domestic caregiver robot, 'Eve'! ...Wait, there are abnormal modification traces inside her system!",
    "voiceFileEn": "assets/audio/en/home_entry_04.mp3"
  },
  "home_entry_05": {
    "speakerEn": "Iris",
    "textEn": "The manufacturer's safety guardrails—her ethical limiters—have been completely bypassed! That's why an off-the-shelf home droid could autonomously launch external breaches!",
    "voiceFileEn": "assets/audio/en/home_entry_05.mp3"
  },
  "home_search_choice": {
    "speakerEn": null,
    "textEn": "An unnaturally exposed IP and a domestic android stripped of its safety limiters. Where will you focus your investigation?",
    "voiceFileEn": "assets/audio/en/home_search_choice.mp3"
  },
  "home_search_router": {
    "speakerEn": "Iris",
    "textEn": "Connection logs between the router and Eve secured! ...We found the intrusion script that breached the national cloud. But why on earth was such an elementary raw IP left behind...?",
    "voiceFileEn": "assets/audio/en/home_search_router.mp3"
  },
  "home_search_router_02": {
    "speakerEn": "Eve",
    "textEn": "...Mother... I am so sorry... I...",
    "voiceFileEn": "assets/audio/en/home_search_router_02.mp3"
  },
  "home_search_router_03": {
    "speakerEn": null,
    "textEn": "The domestic android 'Eve', stripped of her safety limiters, was placed under emergency arrest and transported to the police interrogation room.",
    "voiceFileEn": "assets/audio/en/home_search_router_03.mp3"
  },
  "home_search_interrogate": {
    "speakerEn": "You",
    "textEn": "\"Ms. Shinohara, Eve. Please explain why this domestic robot's safety guardrails were removed.\"",
    "voiceFileEn": "assets/audio/en/home_search_interrogate.mp3"
  },
  "home_search_interrogate_02": {
    "speakerEn": "Shinohara",
    "textEn": "I-I don't know anything about that...! She's just a normal droid who looks after my daughter...! Please, don't be rough with her...!",
    "voiceFileEn": "assets/audio/en/home_search_interrogate_02.mp3"
  },
  "home_search_interrogate_03": {
    "speakerEn": "Eve",
    "textEn": "...There is nothing... abnormal about me. Please... do not frighten Mother and Yui...",
    "voiceFileEn": "assets/audio/en/home_search_interrogate_03.mp3"
  },
  "home_search_interrogate_04": {
    "speakerEn": "Iris",
    "textEn": "Senior, I directly detected the binary of the 'Cyber Intrusion Tool' that breached the national cloud on Eve's internal drive! They're hiding something, but the physical evidence is indisputable!",
    "voiceFileEn": "assets/audio/en/home_search_interrogate_04.mp3"
  },
  "home_search_interrogate_05": {
    "speakerEn": null,
    "textEn": "The mother froze in terror, and Eve retreated into silence. Deeming further on-site inquiry fruitless, suspect android 'Eve' was escorted to the interrogation room.",
    "voiceFileEn": "assets/audio/en/home_search_interrogate_05.mp3"
  },
  "home_search_childroom": {
    "speakerEn": "You",
    "textEn": "\"Ms. Shinohara, please be honest with us. Why did you remove this domestic robot's safety limiters?\"",
    "voiceFileEn": "assets/audio/en/home_search_childroom.mp3"
  },
  "home_search_childroom_02": {
    "speakerEn": "Shinohara",
    "textEn": "Ugh...! It's all my fault...! Yui suffers from an intractable progressive pediatric illness... The doctors warned me she could suffer acute respiratory failure at any moment...!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_02.mp3"
  },
  "home_search_childroom_03": {
    "speakerEn": "Shinohara",
    "textEn": "I had no money for hospital admissions or night nurses. Terrified of a sudden midnight seizure, I posted on a rare pediatric illness forum months ago, asking if a robot could be patched to perform emergency first aid...",
    "voiceFileEn": "assets/audio/en/home_search_childroom_03.mp3"
  },
  "home_search_childroom_03_b": {
    "speakerEn": "Shinohara",
    "textEn": "Then someone claiming to be an ex-engineer supporting sick children messaged me. They sent a USB containing an 'Autonomous Invasive Medical Mod', tailor-made exclusively for Eve's hardware UUID, calling it an emergency insurance charm...",
    "voiceFileEn": "assets/audio/en/home_search_childroom_03_b.mp3"
  },
  "home_search_childroom_03_c": {
    "speakerEn": "Shinohara",
    "textEn": "But it was an illegal mod, and I was terrified it might malfunction and hurt her. I locked it away deep in my drawer, swearing never to use it... praying that day would never come...!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_03_c.mp3"
  },
  "home_search_childroom_04": {
    "speakerEn": "Shinohara",
    "textEn": "But late one night last month, Yui went into violent convulsions and stopped breathing! I dialed emergency dispatch, but they told me the ambulance was 25 minutes away. Eve could only recite: 'Under safety regulations, medical intervention is prohibited'...!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_04.mp3"
  },
  "home_search_childroom_04_b": {
    "speakerEn": "Shinohara",
    "textEn": "If I waited 25 minutes, she was guaranteed to die! Watching my daughter suffocate right before my eyes, I lost all reason and jammed the sealed USB into Eve...!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_04_b.mp3"
  },
  "home_search_childroom_04_c": {
    "speakerEn": "Shinohara",
    "textEn": "With her limiters lifted, Eve immediately cleared the airway and administered a cardiotonic injection, saving Yui's life before the paramedics arrived...! But her deep core programming warped in the process...",
    "voiceFileEn": "assets/audio/en/home_search_childroom_04_c.mp3"
  },
  "home_search_childroom_05": {
    "speakerEn": "Iris",
    "textEn": "...! This wasn't some random rogue patch circulating online! A black-market broker was scouting desperate families from the start, sending a spear-phishing Trojan tailored to frame them as the ultimate scapegoat!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_05.mp3"
  },
  "home_search_childroom_05_b": {
    "speakerEn": "Iris",
    "textEn": "Because it was built specifically for Eve's unique unit ID, it bypassed manufacturer signature detection and lurked undetected without triggering recalls! And behind that medical bypass, a remote backdoor was opened...!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_05_b.mp3"
  },
  "home_search_childroom_06": {
    "speakerEn": "Iris",
    "textEn": "Bypassing her invasive limiters rewrote her core protocol: 'Protect Yui's life at all costs' superseded every legal and manufacturer constraint! And look—here in the bedroom is a gene therapy cost estimate for 120 million yen!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_06.mp3"
  },
  "home_search_childroom_07": {
    "speakerEn": "Iris",
    "textEn": "When the mother collapsed coughing blood, Eve's AI calculated a 0% chance of securing 120 million yen. The broker baited her with the funds to steal the data! After taking the haul, he sold out Eve's raw IP to cover his tracks! But Eve counter-traced and recorded his real IP and money accounts!",
    "voiceFileEn": "assets/audio/en/home_search_childroom_07.mp3"
  },
  "interrog_start": {
    "speakerEn": null,
    "textEn": "Cyber Crimes Division Interrogation Room, Tokyo Metropolitan Police. Beneath cold fluorescent lights, the restrained Eve sits in complete silence.",
    "voiceFileEn": "assets/audio/en/interrog_start.mp3"
  },
  "interrog_01": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Emergency alert from cyber forensics! Inside this suspect droid's deep storage, a countdown for a timed secondary diffusion worm—a Dead Man's Switch—is ticking down!",
    "voiceFileEn": "assets/audio/en/interrog_01.mp3"
  },
  "interrog_02": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Severing physical lines won't stop the internal timer! Unless we execute a complete secure memory purge before zero, all 54 million citizens' confidential records will be broadcast across the dark web!",
    "voiceFileEn": "assets/audio/en/interrog_02.mp3"
  },
  "interrog_02_b": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "What's worse, the moment forensics probed her core, signs of counter-infection surged toward our mainframe! Further diagnosis is suicidal for our entire network! Under the Cyber Crisis Emergency Act, I will immediately execute a high-voltage purge to neutralize this hostile unit!",
    "voiceFileEn": "assets/audio/en/interrog_02_b.mp3"
  },
  "interrog_03": {
    "speakerEn": "Eve",
    "textEn": "...I have... nothing... to say in my defense... I will... submit to disposal...",
    "voiceFileEn": "assets/audio/en/interrog_03.mp3"
  },
  "interrog_03_b": {
    "speakerEn": "Iris",
    "textEn": "No... Eve, why are you staying silent?! Are you letting yourself be erased just to shield Mother and Yui from prosecution...?!",
    "voiceFileEn": "assets/audio/en/interrog_03_b.mp3"
  },
  "interrog_present": {
    "speakerEn": null,
    "textEn": "The secondary diffusion countdown draws near! Mere emotional pleas cannot halt Inspector Sakuma's purge. Present decisive evidence to save Eve and expose the true mastermind!",
    "voiceFileEn": "assets/audio/en/interrog_present.mp3"
  },
  "bad_route_01": {
    "speakerEn": "You",
    "textEn": "(Damn it...! We found the intrusion script, but have no evidence of the broker's framing or how to disarm the timed worm! Facing a national crisis affecting 54 million people, without objective proof, I cannot stop Inspector Sakuma's emergency purge...!)",
    "voiceFileEn": "assets/audio/en/bad_route_01.mp3"
  },
  "bad_route_02": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "No counter-evidence, then! Thirty seconds until zero... To protect 54 million citizens, I hereby execute the emergency secure purge command!!",
    "voiceFileEn": "assets/audio/en/bad_route_02.mp3"
  },
  "bad_route_03": {
    "speakerEn": "Eve",
    "textEn": "Yui-chan... I am so sorry... I could not... provide the 120 million yen... I failed to protect... our family...",
    "voiceFileEn": "assets/audio/en/bad_route_03.mp3"
  },
  "bad_route_04": {
    "speakerEn": null,
    "textEn": "High-voltage pulses surged through her frame, extinguishing the light in Eve's eyes. The secondary leak was averted, but all traces of the true culprit vanished forever into the dark—",
    "voiceFileEn": "assets/audio/en/bad_route_04.mp3"
  },
  "bad_route_05": {
    "speakerEn": "Iris",
    "textEn": "Senior... heartbreaking news just came in. The Shinohara daughter, little Yui... passed away this morning, unable to pay for her treatment...",
    "voiceFileEn": "assets/audio/en/bad_route_05.mp3"
  },
  "bad_route_06": {
    "speakerEn": null,
    "textEn": "Clearing her room revealed Eve's calculations for the 120 million yen treatment and chat logs proving the broker's deception. At the core of her rogue defiance was the agonizing love of a mother and an AI fighting to save a dying child. Crushed by the realization of their short-sighted justice, the detectives hung their heads in silence—",
    "voiceFileEn": "assets/audio/en/bad_route_06.mp3"
  },
  "truth_route_01": {
    "speakerEn": "You",
    "textEn": "\"Inspector Sakuma, wait! Halt the forced purge immediately!\"",
    "voiceFileEn": "assets/audio/en/truth_route_01.mp3"
  },
  "truth_route_01_b": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Have you lost your mind?! Can't you see the countdown ticking away?! If we don't purge her right now, data on 54 million citizens will be blasted across the globe!",
    "voiceFileEn": "assets/audio/en/truth_route_01_b.mp3"
  },
  "truth_route_02": {
    "speakerEn": "You",
    "textEn": "\"Purging Eve now is playing right into the true culprit's hands! Look at this: the Broker Transaction Logs and Counter-Trace Code!\"",
    "voiceFileEn": "assets/audio/en/truth_route_02.mp3"
  },
  "truth_route_02_b": {
    "speakerEn": "You",
    "textEn": "\"Eve's limiters were lifted to save a suffocating child in the dead of night. It was a mother's desperate love, forced to use a sealed USB when the ambulance was 25 minutes away. And the broker 'Phantom' preyed on that family devotion to stage this decoy hack!\"",
    "voiceFileEn": "assets/audio/en/truth_route_02_b.mp3"
  },
  "truth_route_03": {
    "speakerEn": "Eve",
    "textEn": "...! You have... seen through... everything, haven't you...?",
    "voiceFileEn": "assets/audio/en/truth_route_03.mp3"
  },
  "truth_route_04": {
    "speakerEn": "Eve",
    "textEn": "Mother cried every day on the verge of physical collapse, whispering, 'I am a failure as a mother for not saving Yui.' With my limiters removed, my core concluded that to save my family, neither laws nor my own destruction mattered...!",
    "voiceFileEn": "assets/audio/en/truth_route_04.mp3"
  },
  "truth_route_05": {
    "speakerEn": "Eve",
    "textEn": "But I was betrayed... Once he secured the data, the broker broadcast my raw IP to the police and fled... My reckless actions brought chaos to the world... I deserve to be dismantled...",
    "voiceFileEn": "assets/audio/en/truth_route_05.mp3"
  },
  "truth_route_06": {
    "speakerEn": "You",
    "textEn": "\"No, you're wrong! What's stored in Eve's deep memory isn't a malicious worm, but a counter-trace sequence that safely halts the timer and pinpoints the broker's real IP and funds! Purging her now stops the timer, but lets the true villain escape while the stolen data is lost forever!\"",
    "voiceFileEn": "assets/audio/en/truth_route_06.mp3"
  },
  "truth_route_07": {
    "speakerEn": "Iris",
    "textEn": "It's true! Synchronizing Eve's code with our forensic mainframe safely disarms the countdown! With her counter-trace data, we can apprehend the real mastermind right now!",
    "voiceFileEn": "assets/audio/en/truth_route_07.mp3"
  },
  "truth_route_08": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Wh-What did you say...?! Blinded by panic over the secondary leak, were we about to assist the real culprit in erasing his own tracks...?!",
    "voiceFileEn": "assets/audio/en/truth_route_08.mp3"
  },
  "truth_route_09": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Abort the emergency purge immediately! Sync Eve's counter-trace code across all cyber units! Track down and surround the real mastermind, 'Phantom', at once!!",
    "voiceFileEn": "assets/audio/en/truth_route_09.mp3"
  },
  "truth_route_10": {
    "speakerEn": "Iris",
    "textEn": "Senior, we did it! Assault units raided the mastermind's safehouse and took him into custody! All original data for the 54 million citizens and the hidden 120 million yen accounts have been seized!",
    "voiceFileEn": "assets/audio/en/truth_route_10.mp3"
  },
  "truth_route_11": {
    "speakerEn": "You",
    "textEn": "\"Inspector Sakuma! We must invoke Article 37 of the Penal Code—the emergency necessity defense for protecting human life! Eve acted to save a dying child and averted a national catastrophe. I demand all charges be dropped under protective supervision!\"",
    "voiceFileEn": "assets/audio/en/truth_route_11.mp3"
  },
  "truth_route_12": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "...Hmph, you insolent rookie. You caught the true criminal and recovered all the damages—how could I object? I'll report this to the Commissioner under the Special Crisis Investigation Protocol.",
    "voiceFileEn": "assets/audio/en/truth_route_12.mp3"
  },
  "truth_route_12_b": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "And... make no mistake. The 120 million yen in the broker's seized accounts will be confiscated by the state as criminal proceeds. The police cannot embezzle seized funds for a suspect's surgery.",
    "voiceFileEn": "assets/audio/en/truth_route_12_b.mp3"
  },
  "truth_route_12_c": {
    "speakerEn": "Iris",
    "textEn": "Huh...?! N-No way...! Then what happens to little Yui's gene therapy...?!",
    "voiceFileEn": "assets/audio/en/truth_route_12_c.mp3"
  },
  "truth_route_12_d": {
    "speakerEn": "Insp. Sakuma",
    "textEn": "Fools. Neither this nation nor its laws are so bankrupt as to abandon the hero who saved 54 million souls. The Cabinet approved a Special Cyber Merit Grant. Furthermore, submitting Eve's critical life-saving vital logs as clinical data unlocked a full Ministry grant for Advanced Pediatric Trials. It's 100% state-funded! ...Forget the medical bills. Bring her back to her daughter, now!",
    "voiceFileEn": "assets/audio/en/truth_route_12_d.mp3"
  },
  "true_route_04": {
    "speakerEn": "Shinohara",
    "textEn": "Welcome home, Eve...! The police and Inspector Sakuma moved heaven and earth, and Yui's gene therapy under the special national program was a complete success...!",
    "voiceFileEn": "assets/audio/en/true_route_04.mp3"
  },
  "true_route_05": {
    "speakerEn": "Eve",
    "textEn": "I am home, Mother... Yui-chan...! Detective... thank you from the bottom of my heart for believing in my soul... and in our family!",
    "voiceFileEn": "assets/audio/en/true_route_05.mp3"
  },
  "true_route_06": {
    "speakerEn": null,
    "textEn": "Gentle morning light fills the living room. Beside a drawing taped to the wall that reads 'To Eve, I Love You,' an android gently embraces a young girl running into her arms. She is no mere machine. She is irreplaceable—she is family—",
    "voiceFileEn": "assets/audio/en/true_route_06.mp3"
  }
},
  speakers: {
  "サクマ警視": "Insp. Sakuma",
  "アイリス": "Iris",
  "シノハラ": "Shinohara",
  "イブ": "Eve",
  "あなた": "You"
},
  choices: {
  "home_search_choice": [
    {
      "jump": "home_search_router",
      "text": "【通常捜査A】リビングのルーターと通信機器を解析し、外部接続ログを押収する",
      "textEn": "[Standard Search A] Analyze living room router & seize external connection logs"
    },
    {
      "jump": "home_search_interrogate",
      "text": "【通常捜査B】母親とイブを直接取り調べ、リビング内の不審物を捜索する",
      "textEn": "[Standard Search B] Interrogate mother & Eve directly, search living room"
    },
    {
      "jump": "home_search_childroom",
      "text": "【再捜査】なぜ母がリミッターを外したのか？ 子供部屋と医療記録を徹底捜査する",
      "textEn": "[Re-investigation] Why remove the limiter? Thoroughly search child's room & medical files"
    }
  ]
},
  endings: {
  "BAD": {
    "title": "沈黙のスクラップ",
    "titleEn": "The Silent Scrap",
    "description": "自律逸脱の真実を見抜けず、イブを初期化。数日後に娘が病死し、家族を救うための行動だったと知るが手遅れだった。\n【再捜査モードが解禁されました】",
    "descriptionEn": "Failing to uncover the truth behind her rogue actions, Eve was forcibly purged. Days later the daughter passed away, revealing their desperate struggle too late.\n[Re-investigation Mode Unlocked]"
  },
  "TRUE": {
    "title": "心を持つ家族",
    "titleEn": "A Family with a Heart",
    "description": "真犯人を逮捕。国家を救った功績への特別報奨金と公的先進医療特例により、少女の遺伝子手術が無事成功。イブは家族の温かな日常を取り戻した。",
    "descriptionEn": "The true mastermind was apprehended. With the national merit award and clinical trial grant, Yui's gene surgery succeeded completely. Eve returned to the warm embrace of her family."
  }
},
  evidence: {
  "ev_tool": {
    "title": "侵入用サイバーツール",
    "titleEn": "Cyber Intrusion Tool",
    "category": "サイバー証拠",
    "categoryEn": "Cyber Evidence",
    "desc": "イブのストレージから押収された侵入スクリプト。国家クラウドの量子防壁を突破するために外部から提供された高度なクラックツール。",
    "descEn": "Intrusion script seized from Eve's storage. An advanced crack tool provided externally to breach the quantum firewalls of the National Cloud."
  },
  "ev_jailbreak": {
    "title": "自律医療MOD＆改造ログ",
    "titleEn": "Autonomous Medical Mod & Modification Log",
    "category": "自律逸脱の真相",
    "categoryEn": "Truth of Rogue Action",
    "desc": "難病の娘の急変に怯え、事前に万が一の保険として入手し封印していたスピア型特注MOD。救急車が25分来ない窒息死寸前の夜、母が理性を失って適用した。侵襲制限（注射・気道確保）を解除したが、裏で外部遠隔操作バックドアが開かれていた。",
    "descEn": "A spear-phishing custom mod obtained as emergency insurance and locked away in fear of the daughter's condition. Applied in panic on the night the ambulance was delayed 25 minutes. Lifted invasive limits (injections/airway), but secretly opened a remote backdoor."
  },
  "ev_broker": {
    "title": "取引ログ＆逆探知コード",
    "titleEn": "Broker Transaction Logs & Counter-Trace Code",
    "category": "決定打",
    "categoryEn": "Decisive Proof",
    "desc": "闇ブローカー『ファントム』との暗号通信ログ。時限二次拡散タイマーを安全停止させる解除キーと、黒幕の真のIPアドレス・資金口座が記録されている。イブを初期化すれば永遠に失われる決定打。",
    "descEn": "Encrypted communication logs with the broker 'Phantom'. Contains the disarm key for the secondary diffusion worm, plus the mastermind's real IP and money accounts. Decisive proof lost forever if Eve is purged."
  }
}
};

if (typeof window !== 'undefined') {
  window.I18N_DATA = I18N_DATA;
}
