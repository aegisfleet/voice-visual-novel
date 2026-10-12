// character.js - キャラクター立ち絵レンダラー＆表情・モーションコントローラー
// eveのように対話シーンでキャラクターをセンターに美しく表示し、生き生きとした表情と演出を提供します。

class PomeCharacterController {
  constructor(stageElement, bubbleElement) {
    this.stage = stageElement;
    this.bubble = bubbleElement;
    this.currentCharId = null;
    this.currentEmotion = 'normal';
    this.isTalking = false;
    this.talkInterval = null;
    this.bubbleTimeout = null;

    // 話者名からキャラクターIDとデフォルト感情を逆引きする辞書
    this.speakerMap = {
      'ポメ': { id: 'pome', emotion: 'normal' },
      'ポメ（心の声）': { id: 'pome', emotion: 'thinking' },
      'トラ吉': { id: 'torakichi', emotion: 'normal' },
      '管理人さん': { id: 'caretaker', emotion: 'normal' },
      '管理人のおじいさん': { id: 'caretaker', emotion: 'normal' },
      'ポッポ師匠': { id: 'poppo', emotion: 'normal' },
      'ハトのポッポ師匠': { id: 'poppo', emotion: 'normal' },
      'クロ': { id: 'kuro', emotion: 'normal' },
      '見張り猫クロ': { id: 'kuro', emotion: 'normal' },
      '見張り猫のクロ': { id: 'kuro', emotion: 'normal' },
      'シマリスのチビ': { id: 'squirrel', emotion: 'panic' },
      'ミケ': { id: 'torakichi', emotion: 'angry' },
      '子猫たち': { id: 'kittens', emotion: 'smile' },
      '飼い主さん': { id: 'caretaker', emotion: 'smile' }
    };
  }

  /**
   * キャラクターをセンターに表示する
   * @param {string} charId - キャラクターID ('pome', 'torakichi', 'caretaker', 'poppo', 'kuro', 'squirrel', 'kittens')
   * @param {string} emotion - 表情 ('normal', 'smile', 'angry', 'shock', 'thinking', 'confident', 'sad', 'sweat', 'tear', 'witness', 'panic')
   * @param {string} motion - 動作 ('bounce', 'jump', 'shake', 'nod', 'drop')
   */
  show(charId, emotion = 'normal', motion = null) {
    if (!charId) {
      this.hide();
      return;
    }

    const isNewChar = (this.currentCharId !== charId);
    this.currentCharId = charId;
    this.currentEmotion = emotion;

    if (isNewChar || !this.stage.querySelector(`.char-wrapper-${charId}`)) {
      this.stage.innerHTML = this.renderCharacterHtml(charId);
    }

    this.setEmotion(emotion);

    if (motion) {
      this.playMotion(motion);
    } else if (isNewChar) {
      this.playMotion('enter');
    }

    this.stage.classList.remove('hidden');
    this.stage.classList.add('visible');
  }

  /**
   * キャラクターを非表示にする
   */
  hide() {
    this.currentCharId = null;
    this.stopTalking();
    this.hideEmotionBubble();
    this.stage.classList.remove('visible');
    this.stage.classList.add('hidden');
    setTimeout(() => {
      if (!this.currentCharId) {
        this.stage.innerHTML = '';
      }
    }, 250);
  }

  /**
   * 話者名とセリフテキストから自動的に適切なキャラクターと表情を表示
   */
  showForDialogue(dialogueItem) {
    if (!dialogueItem) return;

    const speaker = dialogueItem.speaker || '';
    const text = dialogueItem.text || '';
    const explicitEmotion = dialogueItem.emotion || null;

    // ナレーションの場合はキャラクターをフェード（ただし直前のポメの心の声が続く場合などは自然に維持）
    if (speaker.includes('ナレーション') || speaker.includes('？？？')) {
      if (speaker.includes('？？？')) {
        // プロローグのトラ吉登場前
        this.show('torakichi', 'angry', 'bounce');
        this.showEmotionBubble('exclamation');
        return;
      }
      // 通常ナレーションはキャラクターを退場させる
      this.hide();
      return;
    }

    let charId = 'pome';
    let emotion = 'normal';

    for (const [key, val] of Object.entries(this.speakerMap)) {
      if (speaker.includes(key)) {
        charId = val.id;
        emotion = val.emotion;
        break;
      }
    }

    // セリフ内の感情・明示感情の上書き
    if (explicitEmotion) {
      emotion = explicitEmotion;
    } else {
      // テキスト内容からの感情推定
      if (text.includes('！？') || text.includes('えええっ') || text.includes('ヒャッ') || text.includes('ニャにぃ')) {
        emotion = 'shock';
      } else if (text.includes('ワンッ') || text.includes('バウッ') || text.includes('異議あり') || text.includes('やった')) {
        emotion = 'confident';
      } else if (text.includes('くぅ〜ん') || text.includes('怒られ') || text.includes('しょんぼり')) {
        emotion = 'sad';
      } else if (text.includes('フン') || text.includes('退散') || text.includes('威嚇') || text.includes('言いがかり')) {
        emotion = (charId === 'torakichi') ? 'angry' : emotion;
      } else if (text.includes('わーい') || text.includes('ぽかぽか') || text.includes('仲良く')) {
        emotion = 'smile';
      }
    }

    // モーションの選定
    let motion = 'talk';
    if (dialogueItem.shout || text.includes('ワンッ') || text.includes('バウッ')) {
      motion = 'jump';
      this.showEmotionBubble('exclamation');
    } else if (emotion === 'shock') {
      motion = 'shake';
      this.showEmotionBubble('question');
    } else if (emotion === 'confident') {
      motion = 'jump';
      this.showEmotionBubble('lightbulb');
    } else if (emotion === 'sad') {
      motion = 'drop';
      this.showEmotionBubble('sweat');
    } else if (emotion === 'angry') {
      motion = 'bounce';
      this.showEmotionBubble('anger');
    } else if (emotion === 'smile') {
      motion = 'bounce';
      this.showEmotionBubble('music');
    }

    this.show(charId, emotion, motion);
  }

  /**
   * 表情を切り替える
   */
  setEmotion(emotion) {
    this.currentEmotion = emotion;
    const wrapper = this.stage?.querySelector?.('.char-wrapper');
    if (!wrapper) return;

    // 全ての表情グループの非表示
    const allEmotions = wrapper.querySelectorAll?.('.emotion-layer') || [];
    allEmotions.forEach(el => {
      if (el && el.style) el.style.display = 'none';
    });

    // 指定表情を表示（なければデフォルト）
    const target = wrapper.querySelector?.(`.emotion-${emotion}`) || wrapper.querySelector?.('.emotion-normal');
    if (target && target.style) {
      target.style.display = 'inline';
    }
  }

  /**
   * アニメーションモーションを実行
   */
  playMotion(motion) {
    const wrapper = this.stage?.querySelector?.('.char-wrapper');
    if (!wrapper || !wrapper.classList) return;

    wrapper.classList.remove('motion-enter', 'motion-bounce', 'motion-jump', 'motion-shake', 'motion-nod', 'motion-drop', 'motion-talk');
    // リフロー強制
    if (typeof wrapper.offsetWidth !== 'undefined') {
      void wrapper.offsetWidth;
    }
    wrapper.classList.add(`motion-${motion}`);
  }

  /**
   * セリフ発話中の口パク＆小刻みバウンスを開始
   */
  startTalking() {
    this.isTalking = true;
    const wrapper = this.stage?.querySelector?.('.char-wrapper');
    if (wrapper && wrapper.classList) {
      wrapper.classList.add('is-talking');
    }
  }

  /**
   * 発話停止
   */
  stopTalking() {
    this.isTalking = false;
    const wrapper = this.stage?.querySelector?.('.char-wrapper');
    if (wrapper && wrapper.classList) {
      wrapper.classList.remove('is-talking');
    }
  }

  /**
   * エモーションバブル（！、？、💡など）を頭上にポップアップ
   */
  showEmotionBubble(type) {
    if (!this.bubble) return;
    clearTimeout(this.bubbleTimeout);

    const icons = {
      exclamation: '❗️',
      question: '❓',
      lightbulb: '💡',
      sweat: '💧',
      anger: '💢',
      music: '🎵',
      heart: '❤️',
      sparkle: '✨'
    };

    this.bubble.textContent = icons[type] || '✨';
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

  /**
   * キャラクターHTML（リッチSVGアート）の生成
   */
  renderCharacterHtml(charId) {
    let svgBody = '';
    switch (charId) {
      case 'pome':
        svgBody = this.getPomeSvg();
        break;
      case 'torakichi':
        svgBody = this.getTorakichiSvg();
        break;
      case 'caretaker':
        svgBody = this.getCaretakerSvg();
        break;
      case 'poppo':
        svgBody = this.getPoppoSvg();
        break;
      case 'kuro':
        svgBody = this.getKuroSvg();
        break;
      case 'squirrel':
        svgBody = this.getSquirrelSvg();
        break;
      case 'kittens':
        svgBody = this.getKittensSvg();
        break;
      default:
        svgBody = this.getPomeSvg();
        break;
    }

    return `
      <div class="char-wrapper char-wrapper-${charId}" id="char-${charId}">
        <div class="char-ground-shadow"></div>
        <div class="char-svg-container">
          ${svgBody}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 1. ポメラニアン（名探偵ポメ）SVG
  // ==========================================
  getPomeSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pomeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#ddbea9" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- ふわふわ尻尾（後ろ） -->
        <g class="pome-tail">
          <ellipse cx="60" cy="180" rx="46" ry="46" fill="#ffffff" stroke="#f0e6d2" stroke-width="3"/>
          <path d="M 40 170 Q 20 140 50 130 Q 75 150 60 190 Z" fill="#fff5e6"/>
        </g>

        <!-- もふもふの胴体 -->
        <g class="pome-body">
          <ellipse cx="140" cy="220" rx="90" ry="76" fill="#ffffff" stroke="#f0e6d2" stroke-width="4" filter="url(#pomeGlow)"/>
          <circle cx="95" cy="215" r="38" fill="#fffcf5"/>
          <circle cx="185" cy="215" r="38" fill="#fffcf5"/>
          <circle cx="140" cy="255" r="35" fill="#fffcf5"/>
          
          <!-- 前足 -->
          <ellipse cx="110" cy="285" rx="19" ry="16" fill="#ffffff" stroke="#f0e6d2" stroke-width="3"/>
          <ellipse cx="170" cy="285" rx="19" ry="16" fill="#ffffff" stroke="#f0e6d2" stroke-width="3"/>
          <!-- 肉球ライン -->
          <path d="M 105 288 Q 110 292 115 288" stroke="#f3c6ba" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M 165 288 Q 170 292 175 288" stroke="#f3c6ba" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>

        <!-- 探偵スカーフ（首元） -->
        <g class="pome-scarf">
          <path d="M 98 170 Q 140 190 182 170 Q 165 198 140 202 Q 115 198 98 170 Z" fill="#e76f51" stroke="#ba482d" stroke-width="2"/>
          <polygon points="135,198 145,198 148,220 140,215 132,220" fill="#e76f51" stroke="#ba482d" stroke-width="1.5"/>
          <!-- 探偵バッジ（肉球メダル） -->
          <circle cx="140" cy="195" r="8" fill="#ffd166" stroke="#c99700" stroke-width="1.5"/>
          <circle cx="140" cy="195" r="3" fill="#ffffff"/>
        </g>

        <!-- もふもふのお耳 -->
        <g class="pome-ears">
          <!-- 左耳 -->
          <polygon points="85,95 105,35 130,98" fill="#fceadc" stroke="#f0e6d2" stroke-width="3.5"/>
          <polygon points="95,88 106,50 122,92" fill="#ffccd5"/>
          <!-- 右耳 -->
          <polygon points="150,98 175,35 195,95" fill="#fceadc" stroke="#f0e6d2" stroke-width="3.5"/>
          <polygon points="158,92 174,50 185,88" fill="#ffccd5"/>
        </g>

        <!-- 頭部（もふもふ顔輪郭） -->
        <g class="pome-head">
          <circle cx="140" cy="135" r="70" fill="#ffffff" stroke="#f0e6d2" stroke-width="4"/>
          <circle cx="85" cy="135" r="30" fill="#ffffff"/>
          <circle cx="195" cy="135" r="30" fill="#ffffff"/>
          <circle cx="140" cy="85" r="28" fill="#ffffff"/>
          <circle cx="140" cy="172" r="26" fill="#ffffff"/>

          <!-- ほんのりチーク（共通） -->
          <circle cx="102" cy="152" r="14" fill="#ffccd5" opacity="0.65"/>
          <circle cx="178" cy="152" r="14" fill="#ffccd5" opacity="0.65"/>

          <!-- 鼻（共通） -->
          <ellipse cx="140" cy="148" rx="8" ry="7" fill="#2d1c14"/>
        </g>

        <!-- ================= 表情差分レイヤー ================= -->

        <!-- 1. 通常表情 (emotion-normal) -->
        <g class="emotion-layer emotion-normal">
          <!-- つぶらな瞳 -->
          <ellipse cx="108" cy="128" rx="9" ry="12" fill="#2d1c14"/>
          <circle cx="105" cy="124" r="4" fill="#ffffff"/>
          <circle cx="111" cy="133" r="2" fill="#ffffff"/>
          <ellipse cx="172" cy="128" rx="9" ry="12" fill="#2d1c14"/>
          <circle cx="169" cy="124" r="4" fill="#ffffff"/>
          <circle cx="175" cy="133" r="2" fill="#ffffff"/>
          <!-- にこやかなお口 -->
          <path d="M 132 156 Q 140 162 148 156" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="140" cy="163" rx="7" ry="5.5" fill="#ff85a1"/>
        </g>

        <!-- 2. 考え中 / 心の声 (emotion-thinking) -->
        <g class="emotion-layer emotion-thinking" style="display: none;">
          <!-- 上を見つめる瞳 -->
          <ellipse cx="108" cy="122" rx="9" ry="11" fill="#2d1c14"/>
          <circle cx="106" cy="117" r="4" fill="#ffffff"/>
          <ellipse cx="172" cy="122" rx="9" ry="11" fill="#2d1c14"/>
          <circle cx="170" cy="117" r="4" fill="#ffffff"/>
          <!-- むむむ口 -->
          <path d="M 133 158 Q 140 154 147 158" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <!-- 思考の「？」マーク -->
          <text x="188" y="90" font-size="28" font-weight="900" fill="#2a9d8f">❓</text>
        </g>

        <!-- 3. ひらめき / 自信 / 立証 (emotion-confident) -->
        <g class="emotion-layer emotion-confident" style="display: none;">
          <!-- キリッとした瞳・キラキラ -->
          <ellipse cx="108" cy="126" rx="9" ry="12" fill="#2d1c14"/>
          <polygon points="108,118 111,126 119,126 112,130 115,138 108,133 101,138 104,130 97,126 105,126" fill="#ffd166"/>
          <ellipse cx="172" cy="126" rx="9" ry="12" fill="#2d1c14"/>
          <polygon points="172,118 175,126 183,126 176,130 179,138 172,133 165,138 168,130 161,126 169,126" fill="#ffd166"/>
          <!-- 凛々しい眉 -->
          <path d="M 98 110 L 118 115" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 182 110 L 162 115" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round"/>
          <!-- 誇らしげなお口 -->
          <path d="M 130 155 Q 140 164 150 155" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="140" cy="164" rx="8" ry="6" fill="#ff85a1"/>
        </g>

        <!-- 4. 驚き / ショック (emotion-shock) -->
        <g class="emotion-layer emotion-shock" style="display: none;">
          <!-- まん丸びっくり目 -->
          <circle cx="108" cy="126" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="3"/>
          <circle cx="108" cy="126" r="5" fill="#2d1c14"/>
          <circle cx="172" cy="126" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="3"/>
          <circle cx="172" cy="126" r="5" fill="#2d1c14"/>
          <!-- お口ぽかん -->
          <ellipse cx="140" cy="162" rx="10" ry="12" fill="#e76f51" stroke="#2d1c14" stroke-width="2.5"/>
        </g>

        <!-- 5. 困り / しょんぼり (emotion-sad) -->
        <g class="emotion-layer emotion-sad" style="display: none;">
          <!-- 困り眉とお目々 -->
          <path d="M 96 116 Q 108 110 118 116" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M 184 116 Q 172 110 162 116" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
          <ellipse cx="108" cy="130" rx="8" ry="10" fill="#2d1c14"/>
          <circle cx="106" cy="126" r="3" fill="#ffffff"/>
          <ellipse cx="172" cy="130" rx="8" ry="10" fill="#2d1c14"/>
          <circle cx="170" cy="126" r="3" fill="#ffffff"/>
          <!-- へにょ口 -->
          <path d="M 132 160 Q 140 154 148 160" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <!-- 汗しずく -->
          <text x="65" y="115" font-size="24">💧</text>
        </g>

        <!-- 6. にっこり笑顔 (emotion-smile) -->
        <g class="emotion-layer emotion-smile" style="display: none;">
          <!-- 満面の笑み（糸目） -->
          <path d="M 98 130 Q 108 118 118 130" stroke="#2d1c14" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M 162 130 Q 172 118 182 130" stroke="#2d1c14" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- おおきなお口・舌ペロ -->
          <path d="M 128 154 Q 140 168 152 154 Z" fill="#ff85a1" stroke="#2d1c14" stroke-width="2.5"/>
          <text x="185" y="95" font-size="24">🎵</text>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 2. ボス猫 トラ吉 SVG
  // ==========================================
  getTorakichiSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="toraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#a0522d" flood-opacity="0.35"/>
          </filter>
        </defs>

        <!-- ピンと立った尻尾 -->
        <g class="tora-tail">
          <path d="M 70 240 C 30 200 40 140 70 120 C 75 140 60 190 85 220 Z" fill="#e69d45" stroke="#ba681b" stroke-width="3"/>
          <path d="M 52 165 L 68 160 M 46 195 L 66 190" stroke="#68390d" stroke-width="3.5" stroke-linecap="round"/>
        </g>

        <!-- どっしりした体 -->
        <g class="tora-body">
          <ellipse cx="140" cy="225" rx="80" ry="72" fill="#e69d45" stroke="#ba681b" stroke-width="4" filter="url(#toraGlow)"/>
          <ellipse cx="140" cy="235" rx="55" ry="50" fill="#fceadc"/>
          <!-- 虎柄模様（体） -->
          <path d="M 95 210 L 115 218 L 98 232" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 185 210 L 165 218 L 182 232" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
          <!-- 前足 -->
          <ellipse cx="112" cy="285" rx="18" ry="15" fill="#fceadc" stroke="#ba681b" stroke-width="3"/>
          <ellipse cx="168" cy="285" rx="18" ry="15" fill="#fceadc" stroke="#ba681b" stroke-width="3"/>
        </g>

        <!-- ボス猫の赤いバンダナ（首輪） -->
        <g class="tora-collar">
          <path d="M 95 170 Q 140 195 185 170 L 175 185 Q 140 205 105 185 Z" fill="#e63946" stroke="#9d0208" stroke-width="2"/>
          <polygon points="105,185 175,185 140,225" fill="#e63946" stroke="#9d0208" stroke-width="2.5"/>
          <circle cx="140" cy="186" r="6" fill="#ffd166"/>
        </g>

        <!-- ピンと尖った猫耳 -->
        <g class="tora-ears">
          <polygon points="75,95 90,32 125,90" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
          <polygon points="85,88 95,48 116,84" fill="#d47979"/>
          <polygon points="155,90 190,32 205,95" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
          <polygon points="164,84 185,48 195,88" fill="#d47979"/>
        </g>

        <!-- 頭部輪郭 -->
        <g class="tora-head">
          <ellipse cx="140" cy="132" rx="68" ry="58" fill="#e69d45" stroke="#ba681b" stroke-width="4"/>
          <!-- 額の虎模様 -->
          <path d="M 132 85 L 140 102 L 148 85" stroke="#68390d" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 125 96 L 140 108 L 155 96" stroke="#68390d" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- ほっぺの白毛 -->
          <ellipse cx="118" cy="155" rx="16" ry="12" fill="#fffdfa"/>
          <ellipse cx="162" cy="155" rx="16" ry="12" fill="#fffdfa"/>
          <!-- ピンクの鼻 -->
          <polygon points="135,148 145,148 140,155" fill="#ff9999"/>
          <!-- ピンとしたヒゲ -->
          <line x1="85" y1="145" x2="55" y2="140" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="85" y1="154" x2="52" y2="158" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="195" y1="145" x2="225" y2="140" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="195" y1="154" x2="228" y2="158" stroke="#2d1c14" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- ================= 表情差分レイヤー ================= -->

        <!-- 1. 通常表情 (emotion-normal / 堂々・ふてぶてしい) -->
        <g class="emotion-layer emotion-normal">
          <polygon points="100,125 124,130 105,142" fill="#ffe066" stroke="#2d1c14" stroke-width="2.5"/>
          <ellipse cx="112" cy="133" rx="3.5" ry="7" fill="#2d1c14"/>
          <polygon points="180,125 156,130 175,142" fill="#ffe066" stroke="#2d1c14" stroke-width="2.5"/>
          <ellipse cx="168" cy="133" rx="3.5" ry="7" fill="#2d1c14"/>
          <!-- ふんっ、とした口 -->
          <path d="M 132 158 Q 140 164 148 158" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
        </g>

        <!-- 2. 怒り / 威嚇 (emotion-angry) -->
        <g class="emotion-layer emotion-angry" style="display: none;">
          <!-- 吊り上がった鋭い目 -->
          <polygon points="98,120 126,132 102,142" fill="#ff4d4d" stroke="#2d1c14" stroke-width="2.5"/>
          <ellipse cx="114" cy="131" rx="3" ry="8" fill="#2d1c14"/>
          <polygon points="182,120 154,132 178,142" fill="#ff4d4d" stroke="#2d1c14" stroke-width="2.5"/>
          <ellipse cx="166" cy="131" rx="3" ry="8" fill="#2d1c14"/>
          <!-- 牙を剥く怒り口 -->
          <path d="M 126 156 L 140 162 L 154 156" stroke="#2d1c14" stroke-width="3" fill="none"/>
          <polygon points="130,157 134,166 138,158" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
          <polygon points="142,158 146,166 150,157" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
          <!-- 怒りマーク -->
          <text x="180" y="85" font-size="28">💢</text>
        </g>

        <!-- 3. 動揺 / ショック (emotion-shock) -->
        <g class="emotion-layer emotion-shock" style="display: none;">
          <!-- まん丸白目と縮んだ瞳孔 -->
          <circle cx="110" cy="132" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="2.5"/>
          <circle cx="110" cy="132" r="3.5" fill="#2d1c14"/>
          <circle cx="170" cy="132" r="14" fill="#ffffff" stroke="#2d1c14" stroke-width="2.5"/>
          <circle cx="170" cy="132" r="3.5" fill="#2d1c14"/>
          <!-- 顎が外れたような口 -->
          <ellipse cx="140" cy="168" rx="12" ry="14" fill="#68390d" stroke="#2d1c14" stroke-width="2"/>
          <path d="M 75 90 L 95 105 M 205 90 L 185 105" stroke="#00b4d8" stroke-width="4"/>
        </g>

        <!-- 4. 冷や汗 / 焦り (emotion-sweat) -->
        <g class="emotion-layer emotion-sweat" style="display: none;">
          <ellipse cx="112" cy="133" rx="10" ry="12" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/>
          <circle cx="110" cy="133" r="4" fill="#2d1c14"/>
          <ellipse cx="168" cy="133" rx="10" ry="12" fill="#ffe066" stroke="#2d1c14" stroke-width="2"/>
          <circle cx="166" cy="133" r="4" fill="#2d1c14"/>
          <!-- 引きつり口 -->
          <path d="M 128 160 Q 135 155 140 162 Q 146 156 152 160" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
          <text x="185" y="105" font-size="28">💧</text>
        </g>

        <!-- 5. 涙 / 白状・降参 (emotion-tear) -->
        <g class="emotion-layer emotion-tear" style="display: none;">
          <path d="M 100 134 Q 112 125 124 134" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M 156 134 Q 168 125 180 134" stroke="#2d1c14" stroke-width="3" stroke-linecap="round" fill="none"/>
          <ellipse cx="140" cy="165" rx="11" ry="8" fill="#d47979" stroke="#2d1c14" stroke-width="2"/>
          <!-- 滝のような涙 -->
          <path d="M 108 140 C 104 165 96 175 102 190" stroke="#00b4d8" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 172 140 C 176 165 184 175 178 190" stroke="#00b4d8" stroke-width="5" stroke-linecap="round" fill="none"/>
        </g>

        <!-- 6. 笑顔 / 和解 (emotion-smile) -->
        <g class="emotion-layer emotion-smile" style="display: none;">
          <path d="M 100 132 Q 112 120 124 132" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M 156 132 Q 168 120 180 132" stroke="#2d1c14" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M 130 156 Q 140 166 150 156" stroke="#2d1c14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="100" cy="148" r="8" fill="#ffb4a2" opacity="0.6"/>
          <circle cx="180" cy="148" r="8" fill="#ffb4a2" opacity="0.6"/>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 3. 管理人のおじいさん SVG
  // ==========================================
  getCaretakerSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <!-- 麦わら帽子（つば） -->
        <ellipse cx="140" cy="85" rx="85" ry="24" fill="#eed971" stroke="#c4a520" stroke-width="3"/>
        <path d="M 90 85 C 90 40 190 40 190 85 Z" fill="#edd055" stroke="#c4a520" stroke-width="3"/>
        <!-- 帽子のリボン -->
        <path d="M 90 82 Q 140 92 190 82" stroke="#2a9d8f" stroke-width="6" fill="none"/>

        <!-- 体（作業着） -->
        <g class="caretaker-body">
          <ellipse cx="140" cy="240" rx="75" ry="65" fill="#457b9d" stroke="#1d3557" stroke-width="3.5"/>
          <path d="M 110 180 L 140 220 L 170 180" stroke="#f1faee" stroke-width="4" fill="none"/>
          <!-- エプロン -->
          <rect x="100" y="210" width="80" height="90" rx="8" fill="#2a9d8f" stroke="#1b635a" stroke-width="2.5"/>
          <circle cx="140" cy="235" r="4" fill="#ffffff"/>
        </g>

        <!-- 頭部・白髪・顔 -->
        <g class="caretaker-head">
          <ellipse cx="140" cy="135" rx="55" ry="50" fill="#fdecd9" stroke="#d5bdaf" stroke-width="3"/>
          <!-- 白髪（耳の横） -->
          <ellipse cx="85" cy="135" rx="14" ry="18" fill="#ededed" stroke="#cccccc" stroke-width="2"/>
          <ellipse cx="195" cy="135" rx="14" ry="18" fill="#ededed" stroke="#cccccc" stroke-width="2"/>
          <!-- お耳 -->
          <ellipse cx="84" cy="140" rx="9" ry="12" fill="#fdecd9"/>
          <ellipse cx="196" cy="140" rx="9" ry="12" fill="#fdecd9"/>
          <!-- 豊かな白いおヒゲ -->
          <path d="M 105 160 Q 140 195 175 160 Q 160 178 140 180 Q 120 178 105 160 Z" fill="#ffffff" stroke="#d9d9d9" stroke-width="2"/>
          <!-- 大きめのお鼻 -->
          <circle cx="140" cy="146" r="10" fill="#f5cac3"/>
        </g>

        <!-- 表情：温和・笑顔 (emotion-normal) -->
        <g class="emotion-layer emotion-normal">
          <!-- 優しい目尻のシワと細めた目 -->
          <path d="M 108 128 Q 118 120 128 128" stroke="#332722" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M 152 128 Q 162 120 172 128" stroke="#332722" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <!-- 白い眉毛 -->
          <path d="M 104 115 Q 118 110 128 118" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 152 118 Q 162 110 176 115" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path d="M 130 162 Q 140 170 150 162" stroke="#332722" stroke-width="2.5" fill="none"/>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 4. ハトのポッポ師匠 SVG
  // ==========================================
  getPoppoSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <!-- 鳩の丸い体 -->
        <g class="poppo-body">
          <ellipse cx="140" cy="205" rx="72" ry="85" fill="#8d99ae" stroke="#2b2d42" stroke-width="3.5"/>
          <!-- 翼 -->
          <path d="M 75 180 C 60 220 90 270 125 285 C 95 250 85 200 75 180 Z" fill="#6c757d" stroke="#2b2d42" stroke-width="2.5"/>
          <path d="M 205 180 C 220 220 190 270 155 285 C 185 250 195 200 205 180 Z" fill="#6c757d" stroke="#2b2d42" stroke-width="2.5"/>
          <!-- 足（赤いハト足） -->
          <path d="M 115 285 L 110 310 M 110 310 L 98 318 M 110 310 L 115 320 M 110 310 L 124 318" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 165 285 L 170 310 M 170 310 L 156 318 M 170 310 L 165 320 M 170 310 L 182 318" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
        </g>

        <!-- 首の光沢模様（エメラルド＆パープル） -->
        <g class="poppo-neck">
          <ellipse cx="140" cy="150" rx="38" ry="24" fill="#52b788"/>
          <ellipse cx="140" cy="154" rx="34" ry="16" fill="#7209b7" opacity="0.65"/>
        </g>

        <!-- 頭部・嘴 -->
        <g class="poppo-head">
          <circle cx="140" cy="105" r="42" fill="#8d99ae" stroke="#2b2d42" stroke-width="3.5"/>
          <!-- 嘴 -->
          <polygon points="132,110 148,110 140,132" fill="#ffb703" stroke="#d48b00" stroke-width="2"/>
          <ellipse cx="140" cy="110" rx="5" ry="3" fill="#ffffff"/>
        </g>

        <!-- 表情：長老の眼光 (emotion-normal / emotion-witness) -->
        <g class="emotion-layer emotion-normal">
          <!-- 鋭いオレンジの瞳 -->
          <circle cx="112" cy="98" r="11" fill="#fb8500" stroke="#2b2d42" stroke-width="2"/>
          <circle cx="112" cy="98" r="4.5" fill="#000000"/>
          <circle cx="110" cy="95" r="2" fill="#ffffff"/>
          <circle cx="168" cy="98" r="11" fill="#fb8500" stroke="#2b2d42" stroke-width="2"/>
          <circle cx="168" cy="98" r="4.5" fill="#000000"/>
          <circle cx="166" cy="95" r="2" fill="#ffffff"/>
          <!-- 威厳ある眉羽 -->
          <path d="M 100 86 L 124 92" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 180 86 L 156 92" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round"/>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 5. 見張り猫 クロ SVG
  // ==========================================
  getKuroSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <!-- しなやかな黒猫の体 -->
        <ellipse cx="140" cy="225" rx="68" ry="70" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>
        <path d="M 78 220 C 50 170 55 120 72 95 C 75 110 65 160 88 200 Z" fill="#1b1c1e"/>

        <!-- 首輪（黄色い鈴） -->
        <path d="M 105 170 Q 140 188 175 170" stroke="#e63946" stroke-width="5" fill="none"/>
        <circle cx="140" cy="182" r="7" fill="#ffd166" stroke="#c99700" stroke-width="1.5"/>

        <!-- ピンと尖った耳 -->
        <polygon points="85,92 98,38 128,88" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>
        <polygon points="94,84 102,52 120,80" fill="#3a3c40"/>
        <polygon points="152,88 182,38 195,92" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>
        <polygon points="160,80 178,52 186,84" fill="#3a3c40"/>

        <!-- 頭部 -->
        <ellipse cx="140" cy="128" rx="60" ry="52" fill="#1b1c1e" stroke="#000000" stroke-width="3"/>

        <!-- 表情：輝く金色の瞳 (emotion-normal) -->
        <g class="emotion-layer emotion-normal">
          <ellipse cx="114" cy="124" rx="13" ry="15" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
          <ellipse cx="114" cy="124" rx="4" ry="11" fill="#000000"/>
          <circle cx="111" cy="119" r="2.5" fill="#ffffff"/>
          <ellipse cx="166" cy="124" rx="13" ry="15" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
          <ellipse cx="166" cy="124" rx="4" ry="11" fill="#000000"/>
          <circle cx="163" cy="119" r="2.5" fill="#ffffff"/>
          <!-- 白いヒゲ -->
          <line x1="88" y1="138" x2="58" y2="134" stroke="#ffffff" stroke-width="2"/>
          <line x1="88" y1="146" x2="56" y2="150" stroke="#ffffff" stroke-width="2"/>
          <line x1="192" y1="138" x2="222" y2="134" stroke="#ffffff" stroke-width="2"/>
          <line x1="192" y1="146" x2="224" y2="150" stroke="#ffffff" stroke-width="2"/>
          <path d="M 134 148 Q 140 154 146 148" stroke="#ffffff" stroke-width="2" fill="none"/>
        </g>

        <!-- 表情：威嚇・怒り (emotion-angry) -->
        <g class="emotion-layer emotion-angry" style="display: none;">
          <polygon points="102,118 126,128 106,136" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
          <ellipse cx="115" cy="127" rx="3.5" ry="8" fill="#000000"/>
          <polygon points="178,118 154,128 174,136" fill="#f9c74f" stroke="#000000" stroke-width="2"/>
          <ellipse cx="165" cy="127" rx="3.5" ry="8" fill="#000000"/>
          <!-- キバ -->
          <path d="M 130 148 L 140 154 L 150 148" stroke="#ffffff" stroke-width="2" fill="none"/>
          <polygon points="133,149 136,155 139,150" fill="#ffffff"/>
          <polygon points="141,150 144,155 147,149" fill="#ffffff"/>
          <!-- 白いヒゲ（逆立ち） -->
          <line x1="88" y1="136" x2="56" y2="128" stroke="#ffffff" stroke-width="2"/>
          <line x1="88" y1="144" x2="54" y2="152" stroke="#ffffff" stroke-width="2"/>
          <line x1="192" y1="136" x2="224" y2="128" stroke="#ffffff" stroke-width="2"/>
          <line x1="192" y1="144" x2="226" y2="152" stroke="#ffffff" stroke-width="2"/>
        </g>

        <!-- 表情：ショック・動揺・ギクッ (emotion-shock) -->
        <g class="emotion-layer emotion-shock" style="display: none;">
          <circle cx="114" cy="124" r="14" fill="#ffffff" stroke="#000000" stroke-width="2"/>
          <circle cx="114" cy="124" r="4" fill="#000000"/>
          <circle cx="166" cy="124" r="14" fill="#ffffff" stroke="#000000" stroke-width="2"/>
          <circle cx="166" cy="124" r="4" fill="#000000"/>
          <ellipse cx="140" cy="154" rx="7" ry="8" fill="#2d1c14" stroke="#ffffff" stroke-width="1.5"/>
          <!-- 冷や汗 -->
          <text x="182" y="105" font-size="24">💧</text>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 6. シマリスのチビ（真犯人） SVG
  // ==========================================
  getSquirrelSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <!-- ふさふさの大きな尻尾（背後） -->
        <g class="squirrel-tail">
          <path d="M 170 260 C 260 240 280 90 220 50 C 180 20 150 80 180 140 C 200 180 180 220 160 250 Z" fill="#a0522d" stroke="#68390d" stroke-width="3.5"/>
          <path d="M 220 50 Q 200 120 180 200" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.8"/>
        </g>

        <!-- 体 -->
        <ellipse cx="130" cy="235" rx="55" ry="60" fill="#ba7a45" stroke="#68390d" stroke-width="3"/>
        <ellipse cx="120" cy="242" rx="35" ry="42" fill="#fff5eb"/>

        <!-- 頭部 -->
        <circle cx="125" cy="145" r="46" fill="#ba7a45" stroke="#68390d" stroke-width="3"/>
        <!-- 丸い耳 -->
        <circle cx="90" cy="110" r="16" fill="#ba7a45" stroke="#68390d" stroke-width="2.5"/>
        <circle cx="90" cy="110" r="9" fill="#ffccd5"/>
        <circle cx="155" cy="110" r="16" fill="#ba7a45" stroke="#68390d" stroke-width="2.5"/>
        <circle cx="155" cy="110" r="9" fill="#ffccd5"/>

        <!-- 両手で抱えたドングリ -->
        <g class="acorn-held">
          <ellipse cx="125" cy="225" rx="16" ry="20" fill="#8d5b2d" stroke="#523215" stroke-width="2"/>
          <path d="M 110 215 Q 125 205 140 215 Z" fill="#523215"/>
          <!-- 小さな前足 -->
          <circle cx="112" cy="225" r="8" fill="#fceadc"/>
          <circle cx="138" cy="225" r="8" fill="#fceadc"/>
        </g>

        <!-- 表情：くりくり丸目＆びっくり (emotion-normal / panic) -->
        <g class="emotion-layer emotion-normal">
          <circle cx="106" cy="142" r="11" fill="#2d1c14"/>
          <circle cx="104" cy="138" r="4" fill="#ffffff"/>
          <circle cx="144" cy="142" r="11" fill="#2d1c14"/>
          <circle cx="142" cy="138" r="4" fill="#ffffff"/>
          <!-- ぷっくりほっぺ -->
          <circle cx="95" cy="155" r="10" fill="#ffccd5" opacity="0.6"/>
          <circle cx="155" cy="155" r="10" fill="#ffccd5" opacity="0.6"/>
          <!-- 前歯 -->
          <rect x="122" y="156" width="6" height="7" rx="1" fill="#ffffff" stroke="#2d1c14" stroke-width="1.5"/>
        </g>
      </svg>
    `;
  }

  // ==========================================
  // 7. 子猫たち（TRUE END） SVG
  // ==========================================
  getKittensSvg() {
    return `
      <svg class="char-svg" viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg">
        <!-- ダンボール箱 -->
        <rect x="50" y="200" width="180" height="95" rx="6" fill="#c49a6c" stroke="#8d6338" stroke-width="3"/>
        <text x="70" y="255" font-size="20" font-weight="900" fill="#5c3c1e">みかん箱 🍊</text>

        <!-- 子猫1（白三毛） -->
        <g class="kitten-1">
          <circle cx="100" cy="175" r="30" fill="#ffffff" stroke="#d5bdaf" stroke-width="2"/>
          <polygon points="82,155 88,135 102,152" fill="#e69d45"/>
          <polygon points="105,152 118,135 122,155" fill="#332722"/>
          <ellipse cx="94" cy="175" rx="5" ry="7" fill="#2d1c14"/>
          <circle cx="92" cy="173" r="2" fill="#ffffff"/>
          <ellipse cx="112" cy="175" rx="5" ry="7" fill="#2d1c14"/>
          <circle cx="110" cy="173" r="2" fill="#ffffff"/>
        </g>

        <!-- 子猫2（茶トラ子猫） -->
        <g class="kitten-2">
          <circle cx="170" cy="170" r="32" fill="#e69d45" stroke="#ba681b" stroke-width="2"/>
          <polygon points="148,150 155,130 170,148" fill="#e69d45"/>
          <polygon points="175,148 188,130 195,150" fill="#e69d45"/>
          <path d="M 160 172 Q 170 162 180 172" stroke="#2d1c14" stroke-width="2.5" fill="none"/>
        </g>
        <text x="180" y="110" font-size="28">❤️</text>
      </svg>
    `;
  }
}

window.PomeCharacterController = PomeCharacterController;
