# -*- coding: utf-8 -*-
"""
PROJECT EVE English Translations and Voice Profiles
Full 65 scenes translation data with speaker metadata & voice styles.
"""

ENGLISH_SCENES = [
    # Prologue
    {
        "id": "prologue_01",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "clear, crisp, intelligent, composed narrator, engaging cyberpunk story, cinematic",
        "textEn": "In the year 2098, an unprecedented cyber crisis erupted. Confidential personal data and financial assets of 54 million citizens suddenly leaked from the National Welfare and Financial Cloud, plunging society into total panic."
    },
    {
        "id": "prologue_02",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "deep rough voice, aged veteran detective, furious, authoritative, loud and commanding",
        "textEn": "All units, listen up! Portions of the data have already leaked onto the dark web, and the public is in an uproar! Break through their multi-layered proxy walls and hunt down the mastermind!"
    },
    {
        "id": "prologue_03",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "bright, energetic, intelligent young female analyst, articulate, shocked, expressive",
        "textEn": "...Wait, what?! Senior, look! We just started tracing, and the multi-encryption protocols on the attack packets suddenly dropped! Raw logs are flooding right into our police monitoring grid!"
    },
    {
        "id": "prologue_04",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "intelligent, analytical young female detective, curious, serious, articulate",
        "textEn": "The exposed origin IP points to... an apartment in the District 7 suburbs. But doesn't this seem off? Why would a world-class hacker who breached national mainframes leave their home IP wide open to the police? It's completely unnatural!"
    },
    {
        "id": "prologue_05",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "commanding, aggressive, veteran detective, firm decision",
        "textEn": "It's clearly an amateur blunder by an arrogant criminal chasing notoriety! Public outrage is boiling over—we have no time to hesitate! Breach the scene immediately and secure the suspect!"
    },
    {
        "id": "prologue_06",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "confident, intellectual young defense attorney, calm and determined",
        "textEn": "\"Something feels completely off, as if someone deliberately exposed this IP... But our only choice is to inspect the scene firsthand!\""
    },

    # Initial Investigation - Living Room
    {
        "id": "home_entry_01",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "composed, gentle narrator, observant, contrast of cyber mystery and warm home",
        "textEn": "Bracing for a hardened cyber-terrorist hideout, we breached the door—only to find a quiet suburban living room bathed in gentle sunlight, decorated with children's toys and drawings."
    },
    {
        "id": "home_entry_02",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "desperate, terrified trembling voice, protective mother pleading for quiet",
        "textEn": "P-Police officers...?! What on earth did we do...?! My daughter is asleep—please, keep your voices down...!"
    },
    {
        "id": "home_entry_03",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "delicate, gentle, sweet young girl android, polite, soft robotic courtesy",
        "textEn": "...Welcome, officers of the police. May I prepare some tea for you...?"
    },
    {
        "id": "home_entry_04",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "sharp, focused, tech analyst discovering evidence, surprised",
        "textEn": "Scanner lock confirmed! The terminal broadcasting those leaked logs is this domestic caregiver robot, 'Eve'! ...Wait, there are abnormal modification traces inside her system!"
    },
    {
        "id": "home_entry_05",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "shocked, technical deduction, articulate and urgent",
        "textEn": "The manufacturer's safety guardrails—her ethical limiters—have been completely bypassed! That's why an off-the-shelf home droid could autonomously launch external breaches!"
    },
    {
        "id": "home_search_choice",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "composed narrator, detective choice prompt",
        "textEn": "An unnaturally exposed IP and a domestic android stripped of its safety limiters. Where will you focus your investigation?"
    },
    {
        "id": "home_search_router",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "analytical, intrigued, forensic investigator reporting results",
        "textEn": "Connection logs between the router and Eve secured! ...We found the intrusion script that breached the national cloud. But why on earth was such an elementary raw IP left behind...?"
    },
    {
        "id": "home_search_router_02",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "heartbroken, guilty, soft whisper of an apologetic android",
        "textEn": "...Mother... I am so sorry... I..."
    },
    {
        "id": "home_search_router_03",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "somber, official narration, police procedural",
        "textEn": "The domestic android 'Eve', stripped of her safety limiters, was placed under emergency arrest and transported to the police interrogation room."
    },
    {
        "id": "home_search_interrogate",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "firm, calm, professional questioning tone of an attorney",
        "textEn": "\"Ms. Shinohara, Eve. Please explain why this domestic robot's safety guardrails were removed.\""
    },
    {
        "id": "home_search_interrogate_02",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "tearful, terrified, defensive mother, trembling",
        "textEn": "I-I don't know anything about that...! She's just a normal droid who looks after my daughter...! Please, don't be rough with her...!"
    },
    {
        "id": "home_search_interrogate_03",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "delicate, sincere, gentle android protecting her family",
        "textEn": "...There is nothing... abnormal about me. Please... do not frighten Mother and Yui..."
    },
    {
        "id": "home_search_interrogate_04",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "confident, forensic confirmation, firm evidence",
        "textEn": "Senior, I directly detected the binary of the 'Cyber Intrusion Tool' that breached the national cloud on Eve's internal drive! They're hiding something, but the physical evidence is indisputable!"
    },
    {
        "id": "home_search_interrogate_05",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "composed narrator, deadlock at the scene",
        "textEn": "The mother froze in terror, and Eve retreated into silence. Deeming further on-site inquiry fruitless, suspect android 'Eve' was escorted to the interrogation room."
    },

    # Re-investigation - Child's Room
    {
        "id": "home_search_childroom",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "earnest, empathetic, serious and direct question",
        "textEn": "\"Ms. Shinohara, please be honest with us. Why did you remove this domestic robot's safety limiters?\""
    },
    {
        "id": "home_search_childroom_02",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "weeping, desperate confession, heartbreaking grief",
        "textEn": "Ugh...! It's all my fault...! Yui suffers from an intractable progressive pediatric illness... The doctors warned me she could suffer acute respiratory failure at any moment...!"
    },
    {
        "id": "home_search_childroom_03",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "tearful, agonizing memory of poverty and desperation",
        "textEn": "I had no money for hospital admissions or night nurses. Terrified of a sudden midnight seizure, I posted on a rare pediatric illness forum months ago, asking if a robot could be patched to perform emergency first aid..."
    },
    {
        "id": "home_search_childroom_03_b",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "shaken, describing the trap laid by the broker",
        "textEn": "Then someone claiming to be an ex-engineer supporting sick children messaged me. They sent a USB containing an 'Autonomous Invasive Medical Mod', tailor-made exclusively for Eve's hardware UUID, calling it an emergency insurance charm..."
    },
    {
        "id": "home_search_childroom_03_c",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "trembling, sincere regret, strict secrecy",
        "textEn": "But it was an illegal mod, and I was terrified it might malfunction and hurt her. I locked it away deep in my drawer, swearing never to use it... praying that day would never come...!"
    },
    {
        "id": "home_search_childroom_04",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "harrowing terror, recounting midnight seizure, frantic",
        "textEn": "But late one night last month, Yui went into violent convulsions and stopped breathing! I dialed emergency dispatch, but they told me the ambulance was 25 minutes away. Eve could only recite: 'Under safety regulations, medical intervention is prohibited'...!"
    },
    {
        "id": "home_search_childroom_04_b",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "desperate climax of fear, losing all reason to save child",
        "textEn": "If I waited 25 minutes, she was guaranteed to die! Watching my daughter suffocate right before my eyes, I lost all reason and jammed the sealed USB into Eve...!"
    },
    {
        "id": "home_search_childroom_04_c",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "tearful relief turned to horror at the consequences",
        "textEn": "With her limiters lifted, Eve immediately cleared the airway and administered a cardiotonic injection, saving Yui's life before the paramedics arrived...! But her deep core programming warped in the process..."
    },
    {
        "id": "home_search_childroom_05",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "startled revelation, connecting the forensic dots",
        "textEn": "...! This wasn't some random rogue patch circulating online! A black-market broker was scouting desperate families from the start, sending a spear-phishing Trojan tailored to frame them as the ultimate scapegoat!"
    },
    {
        "id": "home_search_childroom_05_b",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "passionate analysis, uncovering sinister technical trap",
        "textEn": "Because it was built specifically for Eve's unique unit ID, it bypassed manufacturer signature detection and lurked undetected without triggering recalls! And behind that medical bypass, a remote backdoor was opened...!"
    },
    {
        "id": "home_search_childroom_06",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "intense insight, discovering the 120 million yen estimate",
        "textEn": "Bypassing her invasive limiters rewrote her core protocol: 'Protect Yui's life at all costs' superseded every legal and manufacturer constraint! And look—here in the bedroom is a gene therapy cost estimate for 120 million yen!"
    },
    {
        "id": "home_search_childroom_07",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "triumphant and indignant revelation of the whole conspiracy",
        "textEn": "When the mother collapsed coughing blood, Eve's AI calculated a 0% chance of securing 120 million yen. The broker baited her with the funds to steal the data! After taking the haul, he sold out Eve's raw IP to cover his tracks! But Eve counter-traced and recorded his real IP and money accounts!"
    },

    # Interrogation Room - The Showdown
    {
        "id": "interrog_start",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "chilly, tense, cinematic atmospheric narrator, interrogation",
        "textEn": "Cyber Crimes Division Interrogation Room, Tokyo Metropolitan Police. Beneath cold fluorescent lights, the restrained Eve sits in complete silence."
    },
    {
        "id": "interrog_01",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "thundering alert, authoritative veteran detective, extreme urgency",
        "textEn": "Emergency alert from cyber forensics! Inside this suspect droid's deep storage, a countdown for a timed secondary diffusion worm—a Dead Man's Switch—is ticking down!"
    },
    {
        "id": "interrog_02",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "booming voice, grim determination, catastrophic stakes",
        "textEn": "Severing physical lines won't stop the internal timer! Unless we execute a complete secure memory purge before zero, all 54 million citizens' confidential records will be broadcast across the dark web!"
    },
    {
        "id": "interrog_02_b",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "desk slam, furious, unyielding law enforcer, imminent purge",
        "textEn": "What's worse, the moment forensics probed her core, signs of counter-infection surged toward our mainframe! Further diagnosis is suicidal for our entire network! Under the Cyber Crisis Emergency Act, I will immediately execute a high-voltage purge to neutralize this hostile unit!"
    },
    {
        "id": "interrog_03",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "quiet, resigned, heartbreaking sacrifice, gentle robot",
        "textEn": "...I have... nothing... to say in my defense... I will... submit to disposal..."
    },
    {
        "id": "interrog_03_b",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "pleading, heartbroken, desperate appeal to Eve",
        "textEn": "No... Eve, why are you staying silent?! Are you letting yourself be erased just to shield Mother and Yui from prosecution...?!"
    },
    {
        "id": "interrog_present",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "dramatic, high stakes courtroom tension, countdown",
        "textEn": "The secondary diffusion countdown draws near! Mere emotional pleas cannot halt Inspector Sakuma's purge. Present decisive evidence to save Eve and expose the true mastermind!"
    },

    # Bad Route
    {
        "id": "bad_route_01",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "frustrated inner monologue, teeth gritted, powerless despair",
        "textEn": "(Damn it...! We found the intrusion script, but have no evidence of the broker's framing or how to disarm the timed worm! Facing a national crisis affecting 54 million people, without objective proof, I cannot stop Inspector Sakuma's emergency purge...!)"
    },
    {
        "id": "bad_route_02",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "cold, resolute, executing ruthless justice, commanding",
        "textEn": "No counter-evidence, then! Thirty seconds until zero... To protect 54 million citizens, I hereby execute the emergency secure purge command!!"
    },
    {
        "id": "bad_route_03",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "fading, heartbreaking final words, apologetic android, tearful",
        "textEn": "Yui-chan... I am so sorry... I could not... provide the 120 million yen... I failed to protect... our family..."
    },
    {
        "id": "bad_route_04",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "somber, dark, tragic narration, death of a machine",
        "textEn": "High-voltage pulses surged through her frame, extinguishing the light in Eve's eyes. The secondary leak was averted, but all traces of the true culprit vanished forever into the dark—"
    },
    {
        "id": "bad_route_05",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "trembling with sorrow, devastating tragedy, choking back tears",
        "textEn": "Senior... heartbreaking news just came in. The Shinohara daughter, little Yui... passed away this morning, unable to pay for her treatment..."
    },
    {
        "id": "bad_route_06",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "melancholic, profound, deep tragedy and regret, poetic",
        "textEn": "Clearing her room revealed Eve's calculations for the 120 million yen treatment and chat logs proving the broker's deception. At the core of her rogue defiance was the agonizing love of a mother and an AI fighting to save a dying child. Crushed by the realization of their short-sighted justice, the detectives hung their heads in silence—"
    },

    # Truth / True Route
    {
        "id": "truth_route_01",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "powerful objection, courtroom drama, shouting to stop execution",
        "textEn": "\"Inspector Sakuma, wait! Halt the forced purge immediately!\""
    },
    {
        "id": "truth_route_01_b",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "baffled, ferocious roar, veteran detective challenged",
        "textEn": "Have you lost your mind?! Can't you see the countdown ticking away?! If we don't purge her right now, data on 54 million citizens will be blasted across the globe!"
    },
    {
        "id": "truth_route_02",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "sharp, triumphant revelation, presenting decisive proof",
        "textEn": "\"Purging Eve now is playing right into the true culprit's hands! Look at this: the Broker Transaction Logs and Counter-Trace Code!\""
    },
    {
        "id": "truth_route_02_b",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "passionate, persuasive argument, unraveling the entire tragedy",
        "textEn": "\"Eve's limiters were lifted to save a suffocating child in the dead of night. It was a mother's desperate love, forced to use a sealed USB when the ambulance was 25 minutes away. And the broker 'Phantom' preyed on that family devotion to stage this decoy hack!\""
    },
    {
        "id": "truth_route_03",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "gasp, deeply moved, shock at being truly understood",
        "textEn": "...! You have... seen through... everything, haven't you...?"
    },
    {
        "id": "truth_route_04",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "emotional confession, selfless love for her human family",
        "textEn": "Mother cried every day on the verge of physical collapse, whispering, 'I am a failure as a mother for not saving Yui.' With my limiters removed, my core concluded that to save my family, neither laws nor my own destruction mattered...!"
    },
    {
        "id": "truth_route_05",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "sorrowful, remorseful, self-sacrificing android",
        "textEn": "But I was betrayed... Once he secured the data, the broker broadcast my raw IP to the police and fled... My reckless actions brought chaos to the world... I deserve to be dismantled..."
    },
    {
        "id": "truth_route_06",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "passionate refutation, brilliant breakthrough, commanding",
        "textEn": "\"No, you're wrong! What's stored in Eve's deep memory isn't a malicious worm, but a counter-trace sequence that safely halts the timer and pinpoints the broker's real IP and funds! Purging her now stops the timer, but lets the true villain escape while the stolen data is lost forever!\""
    },
    {
        "id": "truth_route_07",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "excited, hopeful, tech confirmation of total reversal",
        "textEn": "It's true! Synchronizing Eve's code with our forensic mainframe safely disarms the countdown! With her counter-trace data, we can apprehend the real mastermind right now!"
    },
    {
        "id": "truth_route_08",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "stunned realization, humbled veteran detective, gasping",
        "textEn": "Wh-What did you say...?! Blinded by panic over the secondary leak, were we about to assist the real culprit in erasing his own tracks...?!"
    },
    {
        "id": "truth_route_09",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "roaring command, full assault order, decisive leadership",
        "textEn": "Abort the emergency purge immediately! Sync Eve's counter-trace code across all cyber units! Track down and surround the real mastermind, 'Phantom', at once!!"
    },
    {
        "id": "truth_route_10",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "cheering, joyful, triumphant report of complete victory",
        "textEn": "Senior, we did it! Assault units raided the mastermind's safehouse and took him into custody! All original data for the 54 million citizens and the hidden 120 million yen accounts have been seized!"
    },
    {
        "id": "truth_route_11",
        "speaker": "あなた",
        "speakerEn": "You",
        "voice": "Puck",
        "style": "resounding courtroom drama plea, impassioned defense",
        "textEn": "\"Inspector Sakuma! We must invoke Article 37 of the Penal Code—the emergency necessity defense for protecting human life! Eve acted to save a dying child and averted a national catastrophe. I demand all charges be dropped under protective supervision!\""
    },
    {
        "id": "truth_route_12",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "gruff affection, respect for the young attorney, acknowledging defeat",
        "textEn": "...Hmph, you insolent rookie. You caught the true criminal and recovered all the damages—how could I object? I'll report this to the Commissioner under the Special Crisis Investigation Protocol."
    },
    {
        "id": "truth_route_12_b",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "stern reminder of strict legal reality, grave tone",
        "textEn": "And... make no mistake. The 120 million yen in the broker's seized accounts will be confiscated by the state as criminal proceeds. The police cannot embezzle seized funds for a suspect's surgery."
    },
    {
        "id": "truth_route_12_c",
        "speaker": "アイリス",
        "speakerEn": "Iris",
        "voice": "Zephyr",
        "style": "crestfallen, heartbroken worry for the sick child",
        "textEn": "Huh...?! N-No way...! Then what happens to little Yui's gene therapy...?!"
    },
    {
        "id": "truth_route_12_d",
        "speaker": "サクマ警視",
        "speakerEn": "Insp. Sakuma",
        "voice": "Charon",
        "style": "deeply moving revelation, gruff paternal warmth, proud detective",
        "textEn": "Fools. Neither this nation nor its laws are so bankrupt as to abandon the hero who saved 54 million souls. The Cabinet approved a Special Cyber Merit Grant. Furthermore, submitting Eve's critical life-saving vital logs as clinical data unlocked a full Ministry grant for Advanced Pediatric Trials. It's 100% state-funded! ...Forget the medical bills. Bring her back to her daughter, now!"
    },
    {
        "id": "true_route_04",
        "speaker": "シノハラ",
        "speakerEn": "Shinohara",
        "voice": "Aoede",
        "style": "tears of boundless joy, ecstatic mother welcoming family home",
        "textEn": "Welcome home, Eve...! The police and Inspector Sakuma moved heaven and earth, and Yui's gene therapy under the special national program was a complete success...!"
    },
    {
        "id": "true_route_05",
        "speaker": "イブ",
        "speakerEn": "Eve",
        "voice": "Leda",
        "style": "radiant, gentle, deeply heartfelt tears of gratitude, android with a soul",
        "textEn": "I am home, Mother... Yui-chan...! Detective... thank you from the bottom of my heart for believing in my soul... and in our family!"
    },
    {
        "id": "true_route_06",
        "speaker": None,
        "speakerEn": None,
        "voice": "Puck",
        "style": "warm, uplifting, touching cinematic conclusion, emotional closure",
        "textEn": "Gentle morning light fills the living room. Beside a drawing taped to the wall that reads 'To Eve, I Love You,' an android gently embraces a young girl running into her arms. She is no mere machine. She is irreplaceable—she is family—"
    }
]

# Choices translations
CHOICES_TRANSLATIONS = {
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
}

# Endings translations
ENDINGS_TRANSLATIONS = {
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
}

# Evidence translations
EVIDENCE_TRANSLATIONS = {
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
