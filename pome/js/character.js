// character.js - 全キャラクターSVG立ち絵＆パーツアニメーション・ミニアイコンコントローラー
// 主人公：オレンジセーブルで口元が黒いポメラニアン「パム」
// 全キャラクターをSVGで表現し、耳・尻尾・目パチ・口パク・首かしげ等のSVGアニメーションを実現します。

class PomeCharacterController {
  constructor(stageElement, bubbleElement) {
    this.stage = stageElement;
    this.bubble = bubbleElement;
    this.currentCharId = null;
    this.currentEmotion = 'normal';
    this.isTalking = false;
    this.bubbleTimeout = null;

    this.speakerMap = {
      パム: { id: 'pome', emotion: 'normal' },
      'パム（心の声）': { id: 'pome', emotion: 'thinking' },
      ポメ: { id: 'pome', emotion: 'normal' },
      'ポメ（心の声）': { id: 'pome', emotion: 'thinking' },
      トラ吉: { id: 'torakichi', emotion: 'normal' },
      管理人さん: { id: 'caretaker', emotion: 'normal' },
      管理人のおじいさん: { id: 'caretaker', emotion: 'normal' },
      ポッポ師匠: { id: 'poppo', emotion: 'normal' },
      ハトのポッポ師匠: { id: 'poppo', emotion: 'normal' },
      クロ: { id: 'kuro', emotion: 'normal' },
      見張り猫クロ: { id: 'kuro', emotion: 'normal' },
      見張り猫のクロ: { id: 'kuro', emotion: 'normal' },
      シマリスのチビ: { id: 'squirrel', emotion: 'panic' },
      ミケ: { id: 'mike', emotion: 'angry' },
      子猫たち: { id: 'kittens', emotion: 'smile' },
      飼い主さん: { id: 'owner', emotion: 'smile' },
    };

    this.emotionRules = [
      { keywords: ['！？', 'えええっ', 'ひゃっ', 'ニャにぃ'], emotion: 'shock' },
      { keywords: ['ワンッ', 'バウッ', '異議あり', 'やった', '大収穫'], emotion: 'confident' },
      { keywords: ['くぅ〜ん', '怒られ', 'しょんぼり', 'ごめんなさい'], emotion: 'sad' },
      { keywords: ['わーい', 'ぽかぽか', '仲良く', 'えへへ'], emotion: 'smile' },
    ];
  }

  normalizeCharId(charId) {
    if (charId === 'pam') return 'pome';
    return charId;
  }

  ensureStageRendered(charId, isNewChar) {
    if (!this.stage) return;
    const existing = this.stage.querySelector && this.stage.querySelector(`.char-wrapper-${charId}`);
    if (isNewChar || !existing) {
      this.stage.innerHTML = this.renderCharacterHtml(charId);
    }
  }

  show(rawCharId, emotion = 'normal', motion = null) {
    if (!rawCharId) {
      this.hide();
      return;
    }

    const charId = this.normalizeCharId(rawCharId);
    const isNewChar = this.currentCharId !== charId;
    this.currentCharId = charId;
    this.currentEmotion = emotion;

    this.ensureStageRendered(charId, isNewChar);
    this.setEmotion(emotion);

    const defaultMotion = ['enter', null][Number(!isNewChar)];
    const nextMotion = motion || defaultMotion;
    if (nextMotion) {
      this.playMotion(nextMotion);
    }

    if (this.stage && this.stage.classList) {
      this.stage.classList.remove('hidden');
      this.stage.classList.add('visible');
    }
  }

  hide() {
    this.currentCharId = null;
    this.stopTalking();
    this.hideEmotionBubble();
    if (this.stage && this.stage.classList) {
      this.stage.classList.remove('visible');
      this.stage.classList.add('hidden');
    }
    setTimeout(() => {
      if (!this.currentCharId && this.stage) {
        this.stage.innerHTML = '';
      }
    }, 250);
  }

  resolveSpeakerConfig(speaker) {
    for (const [key, val] of Object.entries(this.speakerMap)) {
      if (speaker.includes(key)) {
        return { charId: val.id, emotion: val.emotion };
      }
    }
    return { charId: 'pome', emotion: 'normal' };
  }

  inferEmotionFromText(text, charId, fallbackEmotion) {
    for (const rule of this.emotionRules) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.emotion;
      }
    }
    const isAngryText = ['フン', '退散', '威嚇', '立ち入り禁止'].some((kw) => text.includes(kw));
    const isCat = ['torakichi', 'mike', 'kuro'].includes(charId);
    if (isAngryText && isCat) {
      return 'angry';
    }
    return fallbackEmotion;
  }

  resolveMotionAndBubble(dialogueItem, emotion, text) {
    if (dialogueItem.shout || text.includes('ワンッ') || text.includes('バウッ')) {
      return { motion: 'jump', bubble: 'exclamation' };
    }
    const emotionMap = {
      shock: { motion: 'shake', bubble: 'question' },
      confident: { motion: 'jump', bubble: 'lightbulb' },
      sad: { motion: 'drop', bubble: 'sweat' },
      sweat: { motion: 'shake', bubble: 'sweat' },
      tear: { motion: 'drop', bubble: 'sweat' },
      panic: { motion: 'shake', bubble: 'sweat' },
      angry: { motion: 'bounce', bubble: 'anger' },
      smile: { motion: 'bounce', bubble: 'music' },
      thinking: { motion: 'talk', bubble: null },
    };
    return emotionMap[emotion] || { motion: 'talk', bubble: null };
  }

  showForDialogue(dialogueItem) {
    if (!dialogueItem) return;

    const speaker = dialogueItem.speaker || '';
    const text = dialogueItem.text || '';

    if (speaker.includes('？？？')) {
      this.show('torakichi', 'angry', 'bounce');
      this.showEmotionBubble('exclamation');
      return;
    }

    if (speaker.includes('ナレーション')) {
      this.hide();
      return;
    }

    const base = this.resolveSpeakerConfig(speaker);
    const emotion =
      dialogueItem.emotion || this.inferEmotionFromText(text, base.charId, base.emotion);
    const { motion, bubble } = this.resolveMotionAndBubble(dialogueItem, emotion, text);

    if (bubble) {
      this.showEmotionBubble(bubble);
    }
    this.show(base.charId, emotion, motion);
  }

  getWrapperElement() {
    if (!this.stage || !this.stage.querySelector) return null;
    return this.stage.querySelector('.char-wrapper');
  }

  hideAllEmotionLayers(wrapper) {
    if (!wrapper.querySelectorAll) return;
    wrapper.querySelectorAll('.emotion-layer').forEach((el) => {
      el.style.display = 'none';
    });
  }

  setEmotion(emotion) {
    this.currentEmotion = emotion;
    const wrapper = this.getWrapperElement();
    if (!wrapper) return;

    if (wrapper.dataset) {
      wrapper.dataset.emotion = emotion;
    }
    this.hideAllEmotionLayers(wrapper);

    if (!wrapper.querySelector) return;
    const target =
      wrapper.querySelector(`.emotion-${emotion}`) || wrapper.querySelector('.emotion-normal');
    if (target) {
      target.style.display = 'inline';
    }
  }

  playMotion(motion) {
    const wrapper = this.getWrapperElement();
    if (!wrapper || !wrapper.classList) return;

    wrapper.classList.remove(
      'motion-enter',
      'motion-bounce',
      'motion-jump',
      'motion-shake',
      'motion-nod',
      'motion-drop',
      'motion-talk',
    );
    if (typeof wrapper.offsetWidth !== 'undefined') {
      void wrapper.offsetWidth;
    }
    wrapper.classList.add(`motion-${motion}`);
  }

  startTalking() {
    this.isTalking = true;
    const wrapper = this.getWrapperElement();
    if (wrapper && wrapper.classList) {
      wrapper.classList.add('is-talking');
    }
  }

  stopTalking() {
    this.isTalking = false;
    const wrapper = this.getWrapperElement();
    if (wrapper && wrapper.classList) {
      wrapper.classList.remove('is-talking');
    }
  }

  showEmotionBubble(type) {
    if (!this.bubble) return;
    clearTimeout(this.bubbleTimeout);

    const svgMap = {
      exclamation: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 L21 21 L15 21 Z" fill="#e63946" stroke="#9d0208" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="18" cy="29" r="3.5" fill="#e63946" stroke="#9d0208" stroke-width="1.5"/>
        </svg>`,
      question: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12 C12 6, 24 6, 24 13 C24 18, 18 18, 18 23" fill="none" stroke="#2a9d8f" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="18" cy="30" r="3" fill="#2a9d8f"/>
        </svg>`,
      lightbulb: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="15" r="9" fill="#ffd166" stroke="#d48b00" stroke-width="2"/>
          <rect x="14" y="23" width="8" height="5" rx="2" fill="#8d99ae" stroke="#2b2d42" stroke-width="1.5"/>
          <line x1="18" y1="1" x2="18" y2="4" stroke="#f4a261" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="5" y1="8" x2="8" y2="10" stroke="#f4a261" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="31" y1="8" x2="28" y2="10" stroke="#f4a261" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,
      sweat: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 5 C18 5, 28 18, 28 24 C28 29.5, 23.5 33, 18 33 C12.5 33, 8 29.5, 8 24 C8 18, 18 5, 18 5 Z" fill="#4cc9f0" stroke="#0077b6" stroke-width="2"/>
          <ellipse cx="14" cy="22" rx="2" ry="4" fill="#ffffff" opacity="0.7"/>
        </svg>`,
      anger: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14 Q15 15 14 8 M22 8 Q21 15 28 14 M28 22 Q21 21 22 28 M14 28 Q15 21 8 22" fill="none" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
        </svg>`,
      music: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 26 L14 10 L28 7 L28 23" fill="none" stroke="#e76f51" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <ellipse cx="11" cy="26" rx="4.5" ry="3.5" fill="#e76f51"/>
          <ellipse cx="25" cy="23" rx="4.5" ry="3.5" fill="#e76f51"/>
        </svg>`,
      heart: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 30 C18 30, 5 21, 5 12 C5 7, 9 4, 13.5 4 C16 4, 18 6, 18 8 C18 6, 20 4, 22.5 4 C27 4, 31 7, 31 12 C31 21, 18 30, 18 30 Z" fill="#ff4d6d" stroke="#c9184a" stroke-width="1.5"/>
        </svg>`,
      sparkle: `
        <svg class="bubble-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3 L21 15 L33 18 L21 21 L18 33 L15 21 L3 18 L15 15 Z" fill="#ffd166" stroke="#f4a261" stroke-width="1.5"/>
        </svg>`,
    };

    const content = svgMap[type] || svgMap.sparkle;
    if (this.bubble.innerHTML !== undefined) {
      this.bubble.innerHTML = content;
    } else {
      this.bubble.textContent = type;
    }
    this.bubble.className = `emotion-bubble pop-in type-${type}`;
    this.bubble.classList.remove('hidden');

    this.bubbleTimeout = setTimeout(() => {
      this.hideEmotionBubble();
    }, 1800);
  }

  hideEmotionBubble() {
    if (!this.bubble) return;
    this.bubble.classList.add('hidden');
    this.bubble.classList.remove('pop-in');
  }

  renderCharacterHtml(rawCharId) {
    const charId = this.normalizeCharId(rawCharId);
    const generators = {
      pome: () => this.getPomeSvg(),
      torakichi: () => this.getTorakichiSvg(),
      caretaker: () => this.getCaretakerSvg(),
      poppo: () => this.getPoppoSvg(),
      kuro: () => this.getKuroSvg(),
      squirrel: () => this.getSquirrelSvg(),
      mike: () => this.getMikeSvg(),
      kittens: () => this.getKittensSvg(),
      owner: () => this.getOwnerSvg(),
    };
    const renderFn = generators[charId] || generators.pome;
    const svgBody = renderFn();

    return `
      <div class="char-wrapper char-wrapper-${charId}" id="char-${charId}" data-emotion="${this.currentEmotion}">
        <div class="char-ground-shadow"></div>
        <div class="char-svg-container">
          ${svgBody}
        </div>
      </div>
    `;
  }

  getPomeSvg() {
    return `
      <svg class="char-svg pam-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pamBodyGrad" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stop-color="#f4a259"/>
            <stop offset="70%" stop-color="#df8232"/>
            <stop offset="100%" stop-color="#b85d18"/>
          </radialGradient>
          <radialGradient id="pamChestGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#fff3e0"/>
            <stop offset="75%" stop-color="#FAD4A6"/>
            <stop offset="100%" stop-color="#eba865"/>
          </radialGradient>
          <radialGradient id="pamMuzzleGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#433028"/>
            <stop offset="65%" stop-color="#281c17"/>
            <stop offset="100%" stop-color="#1a110e"/>
          </radialGradient>
          <filter id="pamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#7a3e10" flood-opacity="0.32"/>
          </filter>
        </defs>

        <g class="pome-tail svg-tail">
          <ellipse cx="58" cy="182" rx="46" ry="44" fill="url(#pamBodyGrad)" stroke="#8a4412" stroke-width="3.5"/>
          <path d="M 32 165 Q 15 132 48 125 Q 78 142 62 188 Z" fill="#f7b267"/>
          <path d="M 24 152 Q 16 130 42 126 Q 54 136 45 156 Z" fill="#4a2c18" opacity="0.85"/>
        </g>

        <g class="pome-body svg-body">
          <ellipse cx="140" cy="222" rx="90" ry="74" fill="url(#pamBodyGrad)" stroke="#8a4412" stroke-width="4" filter="url(#pamGlow)"/>
          <ellipse cx="140" cy="222" rx="64" ry="52" fill="url(#pamChestGrad)"/>
          <circle cx="96" cy="215" r="32" fill="#f7b267" opacity="0.65"/>
          <circle cx="184" cy="215" r="32" fill="#f7b267" opacity="0.65"/>
          <circle cx="140" cy="252" r="32" fill="#fff0d9" opacity="0.75"/>

          <g class="svg-paws">
            <ellipse cx="108" cy="286" rx="20" ry="15" fill="#e58f3e" stroke="#8a4412" stroke-width="3"/>
            <ellipse cx="172" cy="286" rx="20" ry="15" fill="#e58f3e" stroke="#8a4412" stroke-width="3"/>
            <path d="M 102 289 Q 108 294 114 289" stroke="#5c2c0c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 166 289 Q 172 294 178 289" stroke="#5c2c0c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          </g>
        </g>

        <g class="pome-scarf svg-scarf">
          <path d="M 96 172 Q 140 192 184 172 Q 166 200 140 204 Q 114 200 96 172 Z" fill="#2a9d8f" stroke="#1b635a" stroke-width="2.5"/>
          <polygon points="134,200 146,200 150,222 140,216 130,222" fill="#2a9d8f" stroke="#1b635a" stroke-width="2"/>
          <circle cx="140" cy="196" r="8.5" fill="#ffd166" stroke="#b8860b" stroke-width="1.8"/>
          <circle cx="140" cy="196" r="3.2" fill="#ffffff"/>
        </g>

        <g class="pome-head-group svg-head">
          <g class="pome-ear-left svg-ear-l">
            <polygon points="82,96 102,34 130,96" fill="#df8232" stroke="#8a4412" stroke-width="3.5" stroke-linejoin="round"/>
            <polygon points="94,58 102,34 113,60" fill="#3d2314"/>
            <polygon points="93,88 103,52 121,90" fill="#f4acb7"/>
          </g>
          <g class="pome-ear-right svg-ear-r">
            <polygon points="150,96 178,34 198,96" fill="#df8232" stroke="#8a4412" stroke-width="3.5" stroke-linejoin="round"/>
            <polygon points="167,60 178,34 186,58" fill="#3d2314"/>
            <polygon points="159,90 177,52 187,88" fill="#f4acb7"/>
          </g>

          <g class="pome-head">
            <circle cx="140" cy="134" r="70" fill="url(#pamBodyGrad)" stroke="#8a4412" stroke-width="4"/>
            <circle cx="84" cy="136" r="30" fill="#e58f3e"/>
            <circle cx="196" cy="136" r="30" fill="#e58f3e"/>
            <circle cx="140" cy="84" r="29" fill="#ea9646"/>
            <ellipse cx="104" cy="154" rx="26" ry="20" fill="#f7b978" opacity="0.75"/>
            <ellipse cx="176" cy="154" rx="26" ry="20" fill="#f7b978" opacity="0.75"/>
            <ellipse cx="140" cy="170" rx="32" ry="20" fill="#FAD4A6" opacity="0.85"/>

            <ellipse cx="112" cy="108" rx="9" ry="5" fill="#ffe5b4" transform="rotate(-8 112 108)"/>
            <ellipse cx="168" cy="108" rx="9" ry="5" fill="#ffe5b4" transform="rotate(8 168 108)"/>

            <ellipse cx="96" cy="148" rx="13" ry="9" fill="#ff758f" opacity="0.55"/>
            <ellipse cx="184" cy="148" rx="13" ry="9" fill="#ff758f" opacity="0.55"/>

            <g class="pam-black-muzzle">
              <ellipse cx="140" cy="154" rx="25" ry="18" fill="url(#pamMuzzleGrad)"/>
              <circle cx="128" cy="154" r="13" fill="#2b1d16"/>
              <circle cx="152" cy="154" r="13" fill="#2b1d16"/>
              <ellipse cx="140" cy="144" rx="9" ry="6.5" fill="#0f0907" stroke="#4a352b" stroke-width="1"/>
              <ellipse cx="137" cy="142" rx="3.2" ry="1.8" fill="#ffffff" opacity="0.85"/>
            </g>
          </g>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <ellipse cx="108" cy="126" rx="10" ry="12.5" fill="#1f130e"/>
              <circle cx="104" cy="121" r="4.2" fill="#ffffff"/>
              <circle cx="112" cy="131" r="2" fill="#ffffff"/>
              <ellipse cx="172" cy="126" rx="10" ry="12.5" fill="#1f130e"/>
              <circle cx="168" cy="121" r="4.2" fill="#ffffff"/>
              <circle cx="176" cy="131" r="2" fill="#ffffff"/>
            </g>
            <g class="svg-mouth">
              <path d="M 130 154 Q 135 160 140 153 Q 145 160 150 154" stroke="#f8edeb" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path class="svg-tongue" d="M 134 157 Q 140 169 146 157 Z" fill="#ff758f" stroke="#d90429" stroke-width="1.2"/>
            </g>
          </g>

          <g class="emotion-layer emotion-thinking" style="display: none;">
            <g class="svg-eyes-blink">
              <ellipse cx="108" cy="122" rx="9.5" ry="11.5" fill="#1f130e"/>
              <circle cx="106" cy="117" r="4" fill="#ffffff"/>
              <ellipse cx="172" cy="122" rx="9.5" ry="11.5" fill="#1f130e"/>
              <circle cx="170" cy="117" r="4" fill="#ffffff"/>
            </g>
            <g class="svg-mouth">
              <path d="M 132 157 Q 140 152 148 157" stroke="#f8edeb" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </g>
            <g class="svg-fx svg-fx-float">
              <path d="M 192 78 C 192 70, 206 70, 206 79 C 206 84, 199 85, 199 90" fill="none" stroke="#2a9d8f" stroke-width="4" stroke-linecap="round"/>
              <circle cx="199" cy="97" r="2.8" fill="#2a9d8f"/>
            </g>
          </g>

          <g class="emotion-layer emotion-confident" style="display: none;">
            <g class="svg-eyes-blink">
              <ellipse cx="108" cy="125" rx="10" ry="12.5" fill="#1f130e"/>
              <polygon points="108,116 111,124 119,124 112,128 115,136 108,131 101,136 104,128 97,124 105,124" fill="#ffd166"/>
              <ellipse cx="172" cy="125" rx="10" ry="12.5" fill="#1f130e"/>
              <polygon points="172,116 175,124 183,124 176,128 179,136 172,131 165,136 168,128 161,124 169,124" fill="#ffd166"/>
            </g>
            <path d="M 96 108 L 118 114" stroke="#3d2314" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 184 108 L 162 114" stroke="#3d2314" stroke-width="3.5" stroke-linecap="round"/>
            <g class="svg-mouth">
              <path d="M 129 153 Q 140 163 151 153" stroke="#f8edeb" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse class="svg-tongue" cx="140" cy="161" rx="8" ry="6" fill="#ff758f"/>
            </g>
            <g class="svg-fx svg-fx-pulse">
              <path d="M 200 72 L 203 82 L 213 85 L 203 88 L 200 98 L 197 88 L 187 85 L 197 82 Z" fill="#ffd166" stroke="#f4a261" stroke-width="1"/>
            </g>
          </g>

          <g class="emotion-layer emotion-shock" style="display: none;">
            <circle cx="108" cy="125" r="14" fill="#ffffff" stroke="#1f130e" stroke-width="3"/>
            <circle cx="108" cy="125" r="5" fill="#1f130e"/>
            <circle cx="172" cy="125" r="14" fill="#ffffff" stroke="#1f130e" stroke-width="3"/>
            <circle cx="172" cy="125" r="5" fill="#1f130e"/>
            <g class="svg-mouth">
              <ellipse cx="140" cy="159" rx="9" ry="10" fill="#ff758f" stroke="#f8edeb" stroke-width="2"/>
            </g>
          </g>

          <g class="emotion-layer emotion-sad" style="display: none;">
            <path d="M 96 116 Q 108 109 118 116" stroke="#3d2314" stroke-width="3" stroke-linecap="round" fill="none"/>
            <path d="M 184 116 Q 172 109 162 116" stroke="#3d2314" stroke-width="3" stroke-linecap="round" fill="none"/>
            <g class="svg-eyes-blink">
              <ellipse cx="108" cy="129" rx="8.5" ry="10" fill="#1f130e"/>
              <circle cx="105" cy="125" r="3.2" fill="#ffffff"/>
              <ellipse cx="172" cy="129" rx="8.5" ry="10" fill="#1f130e"/>
              <circle cx="169" cy="125" r="3.2" fill="#ffffff"/>
            </g>
            <g class="svg-mouth">
              <path d="M 132 159 Q 140 153 148 159" stroke="#f8edeb" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </g>
            <g class="svg-fx svg-fx-float">
              <path d="M 72 98 C 72 98, 79 108, 79 113 C 79 117, 76 120, 72 120 C 68 120, 65 117, 65 113 C 65 108, 72 98, 72 98 Z" fill="#4cc9f0" stroke="#0077b6" stroke-width="1.5"/>
            </g>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 97 128 Q 108 116 119 128" stroke="#1f130e" stroke-width="4" stroke-linecap="round" fill="none"/>
            <path d="M 161 128 Q 172 116 183 128" stroke="#1f130e" stroke-width="4" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <path d="M 128 153 Q 140 168 152 153 Z" fill="#ff758f" stroke="#f8edeb" stroke-width="2"/>
            </g>
            <g class="svg-fx svg-fx-pulse">
              <path d="M 196 88 C 196 88, 186 81, 186 74 C 186 70, 189 68, 192.5 68 C 194.5 68, 196 69.5, 196 71 C 196 69.5, 197.5 68, 199.5 68 C 203 68, 206 70, 206 74 C 206 81, 196 88, 196 88 Z" fill="#ff4d6d"/>
            </g>
          </g>
        </g>
      </svg>
    `;
  }

  getTorakichiSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="toraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#a0522d" flood-opacity="0.35"/>
          </filter>
        </defs>

        <g class="tora-tail svg-tail">
          <path d="M 70 240 C 30 200 40 140 70 120 C 75 140 60 190 85 220 Z" fill="#e69d45" stroke="#ba681b" stroke-width="3"/>
          <path d="M 52 165 L 68 160 M 46 195 L 66 190" stroke="#68390d" stroke-width="3.5" stroke-linecap="round"/>
        </g>

        <g class="tora-body svg-body">
          <ellipse cx="140" cy="225" rx="80" ry="72" fill="#e69d45" stroke="#ba681b" stroke-width="4" filter="url(#toraGlow)"/>
          <ellipse cx="140" cy="235" rx="55" ry="50" fill="#fceadc"/>
          <path d="M 95 210 L 115 218 L 98 232" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 185 210 L 165 218 L 182 232" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
          <ellipse cx="112" cy="285" rx="18" ry="15" fill="#fceadc" stroke="#ba681b" stroke-width="3"/>
          <ellipse cx="168" cy="285" rx="18" ry="15" fill="#fceadc" stroke="#ba681b" stroke-width="3"/>
        </g>

        <g class="tora-collar">
          <path d="M 95 170 Q 140 195 185 170 L 175 185 Q 140 205 105 185 Z" fill="#e63946" stroke="#9d0208" stroke-width="2"/>
          <polygon points="105,185 175,185 140,225" fill="#e63946" stroke="#9d0208" stroke-width="2.5"/>
          <circle cx="140" cy="186" r="6" fill="#ffd166"/>
        </g>

        <g class="tora-head-group svg-head">
          <g class="svg-ear-l">
            <polygon points="75,95 90,32 125,90" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
            <polygon points="85,88 95,48 116,84" fill="#d47979"/>
          </g>
          <g class="svg-ear-r">
            <polygon points="155,90 190,32 205,95" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
            <polygon points="164,84 185,48 195,88" fill="#d47979"/>
          </g>

          <g class="tora-head">
            <ellipse cx="140" cy="132" rx="68" ry="58" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
            <path d="M 132 85 L 140 102 L 148 85" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 125 96 L 140 108 L 155 96" stroke="#68390d" stroke-width="4" stroke-linecap="round" fill="none"/>
            <ellipse cx="118" cy="155" rx="16" ry="12" fill="#fffdfa"/>
            <ellipse cx="162" cy="155" rx="16" ry="12" fill="#fffdfa"/>
            <polygon points="135,148 145,148 140,155" fill="#ff9999"/>
            <line x1="85" y1="145" x2="55" y2="140" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="85" y1="154" x2="52" y2="158" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="195" y1="145" x2="225" y2="140" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="195" y1="154" x2="228" y2="158" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
          </g>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <polygon points="100,125 124,130 105,142" fill="#ffe066" stroke="#2d1c14" stroke-width="2.5"/>
              <ellipse cx="112" cy="133" rx="3.5" ry="7" fill="#2d1c14"/>
              <polygon points="180,125 156,130 175,142" fill="#ffe066" stroke="#2d1c14" stroke-width="2.5"/>
              <ellipse cx="168" cy="133" rx="3.5" ry="7" fill="#2d1c14"/>
            </g>
            <g class="svg-mouth">
              <path d="M 132 158 Q 140 164 148 158" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
            </g>
          </g>

          <g class="emotion-layer emotion-angry" style="display: none;">
            <g class="svg-eyes-blink">
              <polygon points="98,120 126,132 102,142" fill="#ff4d4d" stroke="#2d1c14" stroke-width="2.5"/>
              <ellipse cx="114" cy="131" rx="3" ry="8" fill="#2d1c14"/>
              <polygon points="182,120 154,132 178,142" fill="#ff4d4d" stroke="#2d1c14" stroke-width="2.5"/>
              <ellipse cx="166" cy="131" rx="3" ry="8" fill="#2d1c14"/>
            </g>
            <g class="svg-mouth">
              <path d="M 126 156 L 140 163 L 154 156" stroke="#2d1c14" stroke-width="3" fill="none"/>
              <polygon points="130,157 134,166 138,158" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
              <polygon points="142,158 146,166 150,157" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
            </g>
            <g class="svg-fx svg-fx-pulse">
              <path d="M 184 74 Q 191 75 190 68 M 196 68 Q 195 75 202 74 M 202 82 Q 195 81 196 88 M 190 88 Q 191 81 184 82" fill="none" stroke="#e63946" stroke-width="3" stroke-linecap="round"/>
            </g>
          </g>

          <g class="emotion-layer emotion-shock" style="display: none;">
            <circle cx="110" cy="132" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="2.5"/>
            <circle cx="110" cy="132" r="3.5" fill="#2d1c14"/>
            <circle cx="170" cy="132" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="2.5"/>
            <circle cx="170" cy="132" r="3.5" fill="#2d1c14"/>
            <g class="svg-mouth">
              <ellipse cx="140" cy="166" rx="12" ry="13" fill="#68390d" stroke="#2d1c14" stroke-width="2"/>
            </g>
            <path d="M 75 90 L 95 105 M 205 90 L 185 105" stroke="#00b4d8" stroke-width="4" stroke-linecap="round"/>
          </g>

          <g class="emotion-layer emotion-sweat" style="display: none;">
            <g class="svg-eyes-blink">
              <ellipse cx="112" cy="133" rx="10" ry="12" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/>
              <circle cx="110" cy="133" r="4" fill="#2d1c14"/>
              <ellipse cx="168" cy="133" rx="10" ry="12" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/>
              <circle cx="166" cy="133" r="4" fill="#2d1c14"/>
            </g>
            <g class="svg-mouth">
              <path d="M 128 160 Q 135 155 140 162 Q 146 156 152 160" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
            </g>
            <g class="svg-fx svg-fx-float">
              <path d="M 196 86 C 196 86, 204 97, 204 102 C 204 106, 200 109, 196 109 C 192 109, 188 106, 188 102 C 188 97, 196 86, 196 86 Z" fill="#4cc9f0" stroke="#0077b6" stroke-width="1.5"/>
            </g>
          </g>

          <g class="emotion-layer emotion-tear" style="display: none;">
            <path d="M 100 134 Q 112 125 124 134" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
            <path d="M 156 134 Q 168 125 180 134" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <ellipse cx="140" cy="164" rx="11" ry="8" fill="#d47979" stroke="#2d1c14" stroke-width="2"/>
            </g>
            <path d="M 108 140 C 104 165 96 175 102 190" stroke="#00b4d8" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 172 140 C 176 165 184 175 178 190" stroke="#00b4d8" stroke-width="5" stroke-linecap="round" fill="none"/>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 100 132 Q 112 120 124 132" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 156 132 Q 168 120 180 132" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <path d="M 130 156 Q 140 166 150 156" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
            </g>
            <circle cx="100" cy="148" r="8" fill="#ffb4a2" opacity="0.6"/>
            <circle cx="180" cy="148" r="8" fill="#ffb4a2" opacity="0.6"/>
          </g>
        </g>
      </svg>
    `;
  }

  getCaretakerSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="caretaker-body svg-body">
          <ellipse cx="140" cy="240" rx="75" ry="65" fill="#457b9d" stroke="#1d3557" stroke-width="3.5"/>
          <path d="M 110 180 L 140 220 L 170 180" stroke="#f1faee" stroke-width="4" fill="none"/>
          <rect x="100" y="210" width="80" height="90" rx="8" fill="#2a9d8f" stroke="#1b635a" stroke-width="2.5"/>
          <circle cx="140" cy="235" r="4" fill="#ffffff"/>
        </g>

        <g class="caretaker-head-group svg-head">
          <ellipse cx="140" cy="85" rx="85" ry="24" fill="#eed971" stroke="#c4a520" stroke-width="3"/>
          <path d="M 90 85 C 90 40 190 40 190 85 Z" fill="#edd055" stroke="#c4a520" stroke-width="3"/>
          <path d="M 90 82 Q 140 92 190 82" stroke="#2a9d8f" stroke-width="6" fill="none"/>

          <g class="caretaker-head">
            <ellipse cx="140" cy="135" rx="55" ry="50" fill="#fdecd9" stroke="#d5bdaf" stroke-width="3"/>
            <ellipse cx="85" cy="135" rx="14" ry="18" fill="#ededed" stroke="#cccccc" stroke-width="2"/>
            <ellipse cx="195" cy="135" rx="14" ry="18" fill="#ededed" stroke="#cccccc" stroke-width="2"/>
            <ellipse cx="84" cy="140" rx="9" ry="12" fill="#fdecd9"/>
            <ellipse cx="196" cy="140" rx="9" ry="12" fill="#fdecd9"/>
            <path d="M 105 160 Q 140 195 175 160 Q 160 178 140 180 Q 120 178 105 160 Z" fill="#ffffff" stroke="#d9d9d9" stroke-width="2"/>
            <circle cx="140" cy="146" r="10" fill="#f5cac3"/>
          </g>

          <g class="emotion-layer emotion-normal">
            <path d="M 108 128 Q 118 120 128 128" stroke="#332722" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 152 128 Q 162 120 172 128" stroke="#332722" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 104 115 Q 118 110 128 118" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 152 118 Q 162 110 176 115" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <path d="M 130 162 Q 140 170 150 162" stroke="#332722" stroke-width="2.5" fill="none"/>
            </g>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 106 126 Q 118 114 130 126" stroke="#332722" stroke-width="4" stroke-linecap="round" fill="none"/>
            <path d="M 150 126 Q 162 114 174 126" stroke="#332722" stroke-width="4" stroke-linecap="round" fill="none"/>
            <path d="M 104 112 Q 118 106 128 114" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 152 114 Q 162 106 176 112" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <path d="M 128 160 Q 140 174 152 160 Z" fill="#e76f51" stroke="#332722" stroke-width="2"/>
            </g>
          </g>

          <g class="emotion-layer emotion-shock" style="display: none;">
            <circle cx="118" cy="126" r="6" fill="#332722"/>
            <circle cx="162" cy="126" r="6" fill="#332722"/>
            <path d="M 104 110 Q 118 104 128 112" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M 152 112 Q 162 104 176 110" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <ellipse cx="140" cy="165" rx="7" ry="8" fill="#332722"/>
            </g>
          </g>
        </g>
      </svg>
    `;
  }

  getPoppoSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="poppo-body svg-body">
          <ellipse cx="140" cy="205" rx="72" ry="85" fill="#8d99ae" stroke="#2b2d42" stroke-width="3.5"/>
          <g class="svg-ear-l">
            <path d="M 75 180 C 60 220 90 270 125 285 C 95 250 85 200 75 180 Z" fill="#6c757d" stroke="#2b2d42" stroke-width="2.5"/>
          </g>
          <g class="svg-ear-r">
            <path d="M 205 180 C 220 220 190 270 155 285 C 185 250 195 200 205 180 Z" fill="#6c757d" stroke="#2b2d42" stroke-width="2.5"/>
          </g>
          <path d="M 115 285 L 110 310 M 110 310 L 98 318 M 110 310 L 115 320 M 110 310 L 124 318" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 165 285 L 170 310 M 170 310 L 156 318 M 170 310 L 165 320 M 170 310 L 182 318" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
        </g>

        <g class="poppo-neck">
          <ellipse cx="140" cy="150" rx="38" ry="24" fill="#52b788"/>
          <ellipse cx="140" cy="154" rx="34" ry="16" fill="#7209b7" opacity="0.65"/>
        </g>

        <g class="poppo-head-group svg-head">
          <circle cx="140" cy="105" r="42" fill="#8d99ae" stroke="#2b2d42" stroke-width="3.5"/>
          <g class="svg-mouth">
            <polygon points="132,110 148,110 140,132" fill="#ffb703" stroke="#d48b00" stroke-width="2"/>
            <ellipse cx="140" cy="110" rx="5" ry="3" fill="#ffffff"/>
          </g>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <circle cx="112" cy="98" r="11" fill="#fb8500" stroke="#2b2d42" stroke-width="2"/>
              <circle cx="112" cy="98" r="4.5" fill="#000000"/>
              <circle cx="110" cy="95" r="2" fill="#ffffff"/>
              <circle cx="168" cy="98" r="11" fill="#fb8500" stroke="#2b2d42" stroke-width="2"/>
              <circle cx="168" cy="98" r="4.5" fill="#000000"/>
              <circle cx="166" cy="95" r="2" fill="#ffffff"/>
            </g>
            <path d="M 100 86 L 124 92" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 180 86 L 156 92" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round"/>
          </g>

          <g class="emotion-layer emotion-shock" style="display: none;">
            <circle cx="112" cy="98" r="13" fill="#ffffff" stroke="#2b2d42" stroke-width="2.5"/>
            <circle cx="112" cy="98" r="4" fill="#000000"/>
            <circle cx="168" cy="98" r="13" fill="#ffffff" stroke="#2b2d42" stroke-width="2.5"/>
            <circle cx="168" cy="98" r="4" fill="#000000"/>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 102 98 Q 112 88 122 98" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 158 98 Q 168 88 178 98" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          </g>
        </g>
      </svg>
    `;
  }

  getKuroSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="svg-tail">
          <path d="M 78 220 C 50 170 55 120 72 95 C 75 110 65 160 88 200 Z" fill="#1b1c1e"/>
        </g>
        <ellipse cx="140" cy="225" rx="68" ry="70" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>

        <path d="M 105 170 Q 140 188 175 170" stroke="#e63946" stroke-width="5" fill="none"/>
        <circle cx="140" cy="182" r="7" fill="#ffd166" stroke="#c99700" stroke-width="1.5"/>

        <g class="svg-head">
          <g class="svg-ear-l">
            <polygon points="85,92 98,38 128,88" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>
            <polygon points="94,84 102,52 120,80" fill="#3a3c40"/>
          </g>
          <g class="svg-ear-r">
            <polygon points="152,88 182,38 195,92" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>
            <polygon points="160,80 178,52 186,84" fill="#3a3c40"/>
          </g>

          <ellipse cx="140" cy="128" rx="60" ry="52" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <ellipse cx="114" cy="124" rx="13" ry="15" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
              <ellipse cx="114" cy="124" rx="4" ry="11" fill="#000000"/>
              <circle cx="111" cy="119" r="2.5" fill="#ffffff"/>
              <ellipse cx="166" cy="124" rx="13" ry="15" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
              <ellipse cx="166" cy="124" rx="4" ry="11" fill="#000000"/>
              <circle cx="163" cy="119" r="2.5" fill="#ffffff"/>
            </g>
            <line x1="88" y1="138" x2="58" y2="134" stroke="#ffffff" stroke-width="2"/>
            <line x1="88" y1="146" x2="56" y2="150" stroke="#ffffff" stroke-width="2"/>
            <line x1="192" y1="138" x2="222" y2="134" stroke="#ffffff" stroke-width="2"/>
            <line x1="192" y1="146" x2="224" y2="150" stroke="#ffffff" stroke-width="2"/>
            <g class="svg-mouth">
              <path d="M 134 148 Q 140 154 146 148" stroke="#ffffff" stroke-width="2" fill="none"/>
            </g>
          </g>

          <g class="emotion-layer emotion-angry" style="display: none;">
            <polygon points="102,118 126,128 106,136" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
            <ellipse cx="115" cy="127" rx="3.5" ry="8" fill="#000000"/>
            <polygon points="178,118 154,128 174,136" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
            <ellipse cx="165" cy="127" rx="3.5" ry="8" fill="#000000"/>
            <g class="svg-mouth">
              <path d="M 130 148 L 140 154 L 150 148" stroke="#ffffff" stroke-width="2" fill="none"/>
              <polygon points="133,149 136,155 139,150" fill="#ffffff"/>
              <polygon points="141,150 144,155 147,149" fill="#ffffff"/>
            </g>
            <line x1="88" y1="136" x2="56" y2="128" stroke="#ffffff" stroke-width="2"/>
            <line x1="88" y1="144" x2="54" y2="152" stroke="#ffffff" stroke-width="2"/>
            <line x1="192" y1="136" x2="224" y2="128" stroke="#ffffff" stroke-width="2"/>
            <line x1="192" y1="144" x2="226" y2="152" stroke="#ffffff" stroke-width="2"/>
          </g>

          <g class="emotion-layer emotion-shock" style="display: none;">
            <circle cx="114" cy="124" r="14" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <circle cx="114" cy="124" r="4" fill="#000000"/>
            <circle cx="166" cy="124" r="14" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <circle cx="166" cy="124" r="4" fill="#000000"/>
            <g class="svg-mouth">
              <ellipse cx="140" cy="154" rx="7" ry="8" fill="#ff758f" stroke="#ffffff" stroke-width="1.5"/>
            </g>
            <g class="svg-fx svg-fx-float">
              <path d="M 192 88 C 192 88, 199 98, 199 103 C 199 107, 196 110, 192 110 C 188 110, 185 107, 185 103 C 185 98, 192 88, 192 88 Z" fill="#4cc9f0" stroke="#0077b6" stroke-width="1.5"/>
            </g>
          </g>
        </g>
      </svg>
    `;
  }

  getSquirrelSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="squirrel-tail svg-tail">
          <path d="M 170 260 C 260 240 280 90 220 50 C 180 20 150 80 180 140 C 200 180 180 220 160 250 Z" fill="#a0522d" stroke="#68390d" stroke-width="3.5"/>
          <path d="M 220 50 Q 200 120 180 200" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.8"/>
        </g>

        <ellipse cx="130" cy="235" rx="55" ry="60" fill="#ba7a45" stroke="#68390d" stroke-width="3"/>
        <ellipse cx="120" cy="242" rx="35" ry="42" fill="#fff5eb"/>

        <g class="svg-head">
          <g class="svg-ear-l">
            <circle cx="90" cy="110" r="16" fill="#ba7a45" stroke="#68390d" stroke-width="2.5"/>
            <circle cx="90" cy="110" r="9" fill="#ffccd5"/>
          </g>
          <g class="svg-ear-r">
            <circle cx="155" cy="110" r="16" fill="#ba7a45" stroke="#68390d" stroke-width="2.5"/>
            <circle cx="155" cy="110" r="9" fill="#ffccd5"/>
          </g>
          <circle cx="125" cy="145" r="46" fill="#ba7a45" stroke="#68390d" stroke-width="3"/>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <circle cx="106" cy="142" r="11" fill="#2d1c14"/>
              <circle cx="104" cy="138" r="4" fill="#ffffff"/>
              <circle cx="144" cy="142" r="11" fill="#2d1c14"/>
              <circle cx="142" cy="138" r="4" fill="#ffffff"/>
            </g>
            <circle cx="95" cy="155" r="10" fill="#ffccd5" opacity="0.6"/>
            <circle cx="155" cy="155" r="10" fill="#ffccd5" opacity="0.6"/>
            <g class="svg-mouth">
              <rect x="122" y="156" width="6" height="7" rx="1" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
            </g>
          </g>

          <g class="emotion-layer emotion-sad" style="display: none;">
            <path d="M 96 130 Q 106 124 114 130" stroke="#2d1c14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 154 130 Q 144 124 136 130" stroke="#2d1c14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="106" cy="143" r="10" fill="#2d1c14"/>
            <circle cx="104" cy="140" r="3.5" fill="#ffffff"/>
            <circle cx="144" cy="143" r="10" fill="#2d1c14"/>
            <circle cx="142" cy="140" r="3.5" fill="#ffffff"/>
            <circle cx="98" cy="151" r="4" fill="#4cc9f0"/>
            <circle cx="152" cy="151" r="4" fill="#4cc9f0"/>
            <g class="svg-mouth">
              <ellipse cx="125" cy="160" rx="6" ry="5" fill="#ff758f" stroke="#2d1c14" stroke-width="1.5"/>
            </g>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 98 142 Q 106 132 114 142" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 136 142 Q 144 132 152 142" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="95" cy="155" r="10" fill="#ffccd5" opacity="0.75"/>
            <circle cx="155" cy="155" r="10" fill="#ffccd5" opacity="0.75"/>
            <g class="svg-mouth">
              <path d="M 118 156 Q 125 164 132 156" stroke="#2d1c14" stroke-width="2" fill="none"/>
            </g>
          </g>
        </g>

        <g class="acorn-held">
          <ellipse cx="125" cy="225" rx="16" ry="20" fill="#8d5b2d" stroke="#523215" stroke-width="2"/>
          <path d="M 110 215 Q 125 205 140 215 Z" fill="#523215"/>
          <circle cx="112" cy="225" r="8" fill="#fceadc"/>
          <circle cx="138" cy="225" r="8" fill="#fceadc"/>
        </g>
      </svg>
    `;
  }

  getMikeSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="mike-tail svg-tail">
          <path d="M 198 235 C 235 205 240 150 215 130 C 205 145 215 190 190 220 Z" fill="#ffffff" stroke="#d5bdaf" stroke-width="3"/>
          <ellipse cx="222" cy="152" rx="12" ry="16" fill="#e69d45"/>
          <ellipse cx="215" cy="185" rx="11" ry="14" fill="#332722"/>
        </g>

        <g class="mike-body svg-body">
          <ellipse cx="140" cy="228" rx="70" ry="66" fill="#ffffff" stroke="#d5bdaf" stroke-width="3.5"/>
          <circle cx="96" cy="212" r="24" fill="#e69d45"/>
          <circle cx="182" cy="225" r="22" fill="#332722"/>
          <ellipse cx="114" cy="285" rx="16" ry="14" fill="#ffffff" stroke="#d5bdaf" stroke-width="2.5"/>
          <ellipse cx="166" cy="285" rx="16" ry="14" fill="#ffffff" stroke="#d5bdaf" stroke-width="2.5"/>
        </g>

        <path d="M 102 174 Q 140 190 178 174" stroke="#ff758f" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="140" cy="185" r="7" fill="#ffd166" stroke="#c99700" stroke-width="1.5"/>

        <g class="svg-head">
          <g class="svg-ear-l">
            <polygon points="82,94 96,38 126,88" fill="#e69d45" stroke="#ba681b" stroke-width="3"/>
            <polygon points="92,84 100,52 118,82" fill="#ffccd5"/>
          </g>
          <g class="svg-ear-r">
            <polygon points="154,88 184,38 198,94" fill="#332722" stroke="#1f130e" stroke-width="3"/>
            <polygon points="162,82 180,52 188,84" fill="#ffccd5"/>
          </g>

          <ellipse cx="140" cy="130" rx="62" ry="52" fill="#ffffff" stroke="#d5bdaf" stroke-width="3.5"/>
          <path d="M 82 115 Q 105 90 125 102 Q 115 125 84 128 Z" fill="#e69d45"/>
          <path d="M 155 100 Q 178 90 198 118 Q 175 130 155 100 Z" fill="#332722"/>
          <polygon points="136,144 144,144 140,150" fill="#ff85a1"/>
          <line x1="88" y1="142" x2="60" y2="138" stroke="#5c4738" stroke-width="2"/>
          <line x1="88" y1="150" x2="58" y2="154" stroke="#5c4738" stroke-width="2"/>
          <line x1="192" y1="142" x2="220" y2="138" stroke="#5c4738" stroke-width="2"/>
          <line x1="192" y1="150" x2="222" y2="154" stroke="#5c4738" stroke-width="2"/>

          <g class="emotion-layer emotion-normal">
            <g class="svg-eyes-blink">
              <ellipse cx="114" cy="126" rx="10" ry="12" fill="#52b788" stroke="#2d1c14" stroke-width="2"/>
              <ellipse cx="114" cy="126" rx="3.5" ry="9" fill="#2d1c14"/>
              <circle cx="111" cy="122" r="2.5" fill="#ffffff"/>
              <ellipse cx="166" cy="126" rx="10" ry="12" fill="#52b788" stroke="#2d1c14" stroke-width="2"/>
              <ellipse cx="166" cy="126" rx="3.5" ry="9" fill="#2d1c14"/>
              <circle cx="163" cy="122" r="2.5" fill="#ffffff"/>
            </g>
            <g class="svg-mouth">
              <path d="M 132 154 Q 136 159 140 154 Q 144 159 148 154" stroke="#2d1c14" stroke-width="2.2" fill="none"/>
            </g>
          </g>

          <g class="emotion-layer emotion-angry" style="display: none;">
            <polygon points="102,120 126,128 106,136" fill="#52b788" stroke="#2d1c14" stroke-width="2"/>
            <ellipse cx="114" cy="128" rx="3" ry="8" fill="#2d1c14"/>
            <polygon points="178,120 154,128 174,136" fill="#52b788" stroke="#2d1c14" stroke-width="2"/>
            <ellipse cx="166" cy="128" rx="3" ry="8" fill="#2d1c14"/>
            <g class="svg-mouth">
              <polygon points="132,155 148,155 140,165" fill="#ff758f" stroke="#2d1c14" stroke-width="2"/>
            </g>
          </g>

          <g class="emotion-layer emotion-smile" style="display: none;">
            <path d="M 104 128 Q 114 118 124 128" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 156 128 Q 166 118 176 128" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
            <g class="svg-mouth">
              <path d="M 132 154 Q 140 162 148 154" stroke="#2d1c14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </g>
          </g>
        </g>
      </svg>
    `;
  }

  getKittensSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <g class="kitten-1 svg-head">
          <g class="svg-ear-l">
            <polygon points="78,155 86,128 104,150" fill="#e69d45" stroke="#ba681b" stroke-width="2"/>
          </g>
          <g class="svg-ear-r">
            <polygon points="106,150 122,128 128,155" fill="#332722" stroke="#1f130e" stroke-width="2"/>
          </g>
          <circle cx="104" cy="175" r="32" fill="#ffffff" stroke="#d5bdaf" stroke-width="2.5"/>
          <g class="svg-eyes-blink">
            <ellipse cx="94" cy="174" rx="5" ry="7" fill="#2d1c14"/>
            <circle cx="92" cy="171" r="2" fill="#ffffff"/>
            <ellipse cx="114" cy="174" rx="5" ry="7" fill="#2d1c14"/>
            <circle cx="112" cy="171" r="2" fill="#ffffff"/>
          </g>
          <g class="svg-mouth">
            <path d="M 99 183 Q 104 188 109 183" stroke="#ff758f" stroke-width="2" fill="none" stroke-linecap="round"/>
          </g>
        </g>

        <g class="kitten-2 svg-head">
          <g class="svg-ear-l">
            <polygon points="148,150 155,126 172,148" fill="#e69d45" stroke="#ba681b" stroke-width="2"/>
          </g>
          <g class="svg-ear-r">
            <polygon points="175,148 190,126 198,150" fill="#e69d45" stroke="#ba681b" stroke-width="2"/>
          </g>
          <circle cx="172" cy="172" r="33" fill="#e69d45" stroke="#ba681b" stroke-width="2.5"/>
          <path d="M 160 172 Q 166 164 172 172" stroke="#2d1c14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M 174 172 Q 180 164 186 172" stroke="#2d1c14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <g class="svg-mouth">
            <ellipse cx="172" cy="181" rx="5" ry="4" fill="#ff758f"/>
          </g>
        </g>

        <rect x="48" y="198" width="184" height="96" rx="8" fill="#d4a373" stroke="#8d5b2d" stroke-width="3.5"/>
        <path d="M 48 216 L 232 216" stroke="#a87648" stroke-width="2" stroke-dasharray="6 4"/>
        <circle cx="115" cy="252" r="14" fill="#f48c06" stroke="#c86400" stroke-width="2"/>
        <path d="M 115 236 Q 122 230 126 236 Q 120 240 115 236 Z" fill="#52b788"/>
        <rect x="138" y="242" width="56" height="8" rx="4" fill="#8d5b2d" opacity="0.6"/>
        <rect x="138" y="256" width="40" height="8" rx="4" fill="#8d5b2d" opacity="0.45"/>

        <g class="emotion-layer emotion-normal emotion-smile">
          <g class="svg-fx svg-fx-pulse">
            <path d="M 140 105 C 140 105, 126 95, 126 86 C 126 80, 130 77, 135 77 C 138 77, 140 79, 140 81 C 140 79, 142 77, 145 77 C 150 77, 154 80, 154 86 C 154 95, 140 105, 140 105 Z" fill="#ff4d6d"/>
          </g>
        </g>
      </svg>
    `;
  }

  getOwnerSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <path d="M 78 125 C 68 180 78 220 98 225 L 182 225 C 202 220 212 180 202 125 Z" fill="#5c3a21" stroke="#3d2314" stroke-width="3"/>

        <g class="owner-body svg-body">
          <path d="M 75 295 C 78 215 105 192 140 192 C 175 192 202 215 205 295 Z" fill="#f4a261" stroke="#b5651d" stroke-width="3.5"/>
          <polygon points="118,192 162,192 152,295 128,295" fill="#fffbf2"/>
          <circle cx="140" cy="215" r="6" fill="#2a9d8f"/>
        </g>

        <g class="owner-head-group svg-head">
          <ellipse cx="142" cy="82" rx="64" ry="24" fill="#e76f51" stroke="#9e3b24" stroke-width="3" transform="rotate(-5 142 82)"/>
          <circle cx="140" cy="56" r="6" fill="#9e3b24"/>

          <ellipse cx="140" cy="134" rx="50" ry="48" fill="#ffe5d9" stroke="#d5bdaf" stroke-width="3"/>
          <path d="M 88 122 C 92 82 188 82 192 122 C 172 104 155 112 140 102 C 125 112 108 104 88 122 Z" fill="#5c3a21" stroke="#3d2314" stroke-width="2.5"/>

          <circle cx="106" cy="146" r="9" fill="#ffb4a2" opacity="0.65"/>
          <circle cx="174" cy="146" r="9" fill="#ffb4a2" opacity="0.65"/>

          <g class="emotion-layer emotion-normal emotion-smile">
            <path d="M 108 132 Q 118 122 128 132" stroke="#3d2314" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 152 132 Q 162 122 172 132" stroke="#3d2314" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <g class="svg-mouth">
              <path d="M 131 154 Q 140 164 149 154" stroke="#e76f51" stroke-width="3" fill="none" stroke-linecap="round"/>
            </g>
          </g>
        </g>
      </svg>
    `;
  }

  getTorakichiMiniSvg(mood) {
    const eyeMap = {
      shock:
        '<circle cx="78" cy="80" r="10" fill="#ffffff" stroke="#2d1c14" stroke-width="2"/><circle cx="78" cy="80" r="3" fill="#2d1c14"/><circle cx="122" cy="80" r="10" fill="#ffffff" stroke="#2d1c14" stroke-width="2"/><circle cx="122" cy="80" r="3" fill="#2d1c14"/>',
      tear: '<path d="M 68 82 Q 78 72 88 82" stroke="#2d1c14" stroke-width="3" fill="none"/><path d="M 112 82 Q 122 72 132 82" stroke="#2d1c14" stroke-width="3" fill="none"/>',
      default:
        '<polygon points="68,75 88,80 72,88" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/><ellipse cx="78" cy="81" rx="2.5" ry="5" fill="#2d1c14"/><polygon points="132,75 112,80 128,88" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/><ellipse cx="122" cy="81" rx="2.5" ry="5" fill="#2d1c14"/>',
    };
    const eyes = eyeMap[mood] || eyeMap.default;
    const hasSweat = mood === 'sweat' || mood === 'tear';
    const sweatDrop = [
      '',
      '<path d="M 148 52 C 148 52, 154 62, 154 66 C 154 70, 151 72, 148 72 C 145 72, 142 70, 142 66 Z" fill="#4cc9f0"/>',
    ][Number(hasSweat)];

    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="134" rx="54" ry="46" fill="#e69d45" stroke="#ba681b" stroke-width="3"/>
        <g class="svg-ear-l"><polygon points="55,52 65,16 88,48" fill="#e69d45" stroke="#ba681b" stroke-width="3"/></g>
        <g class="svg-ear-r"><polygon points="112,48 135,16 145,52" fill="#e69d45" stroke="#ba681b" stroke-width="3"/></g>
        <ellipse cx="100" cy="82" rx="46" ry="40" fill="#e69d45" stroke="#ba681b" stroke-width="3"/>
        <path d="M 94 48 L 100 60 L 106 48" stroke="#68390d" stroke-width="4" stroke-linecap="round" fill="none"/>
        ${eyes}
        <polygon points="96,90 104,90 100,96" fill="#ff9999"/>
        <path d="M 92 100 Q 100 105 108 100" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
        <polygon points="75,116 125,116 100,140" fill="#e63946" stroke="#ba1826" stroke-width="2"/>
        ${sweatDrop}
      </svg>
    `;
  }

  getPamMiniSvg(mood) {
    const sparkleColor = ['#ffffff', '#ffd166'][Number(mood === 'confident')];
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g class="svg-tail"><ellipse cx="46" cy="118" rx="30" ry="30" fill="#df8232" stroke="#8a4412" stroke-width="3"/></g>
        <ellipse cx="100" cy="132" rx="62" ry="50" fill="#e58f3e" stroke="#8a4412" stroke-width="3"/>
        <ellipse cx="100" cy="136" rx="42" ry="34" fill="#FAD4A6"/>
        <g class="svg-ear-l">
          <polygon points="62,55 78,16 95,58" fill="#df8232" stroke="#8a4412" stroke-width="3"/>
          <polygon points="71,34 78,16 85,35" fill="#3d2314"/>
        </g>
        <g class="svg-ear-r">
          <polygon points="105,58 122,16 138,55" fill="#df8232" stroke="#8a4412" stroke-width="3"/>
          <polygon points="115,35 122,16 129,34" fill="#3d2314"/>
        </g>
        <circle cx="100" cy="86" r="48" fill="#e58f3e" stroke="#8a4412" stroke-width="3"/>
        <circle cx="74" cy="96" r="10" fill="#ff758f" opacity="0.55"/>
        <circle cx="126" cy="96" r="10" fill="#ff758f" opacity="0.55"/>
        <ellipse cx="100" cy="99" rx="18" ry="13" fill="#281c17"/>
        <ellipse cx="100" cy="92" rx="6.5" ry="4.5" fill="#0f0907"/>
        <path d="M 93 101 Q 100 107 107 101" stroke="#f8edeb" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="100" cy="106" rx="5" ry="4" fill="#ff758f"/>
        <g class="svg-eyes-blink">
          <ellipse cx="78" cy="82" rx="7" ry="9" fill="#1f130e"/>
          <ellipse cx="122" cy="82" rx="7" ry="9" fill="#1f130e"/>
          <circle cx="76" cy="79" r="3.2" fill="${sparkleColor}"/>
          <circle cx="120" cy="79" r="3.2" fill="${sparkleColor}"/>
        </g>
        <path d="M 70 118 Q 100 132 130 118 Q 118 136 100 138 Q 82 136 70 118 Z" fill="#2a9d8f" stroke="#1b635a" stroke-width="2"/>
        <circle cx="100" cy="132" r="5" fill="#ffd166"/>
      </svg>
    `;
  }

  getMiniAvatarSvg(rawCharId, mood = 'normal') {
    const charId = this.normalizeCharId(rawCharId);
    if (charId === 'torakichi') {
      return this.getTorakichiMiniSvg(mood);
    }
    return this.getPamMiniSvg(mood);
  }
}

window.PomeCharacterController = PomeCharacterController;
