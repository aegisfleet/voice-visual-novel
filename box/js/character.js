// character.js - キャラクター立ち絵レンダラー＆表情コントローラー (BOX WORM)

class BoxCharacterController {
  constructor(stageElement, bubbleElement) {
    this.stage = stageElement;
    this.bubble = bubbleElement;
    this.currentCharId = null;
    this.currentEmotion = 'normal';
    this.bubbleTimeout = null;

    this.speakerMap = {
      'ユウタ': { id: 'yuta', emotion: 'normal' },
      'ユウタ（心の声）': { id: 'yuta', emotion: 'thinking' },
      'シバタ捜査官': { id: 'shibata', emotion: 'normal' },
      'シバタ': { id: 'shibata', emotion: 'normal' },
      'アオイ': { id: 'aoi', emotion: 'normal' },
      '隣人アオイ': { id: 'aoi', emotion: 'normal' },
      'ヤエガシ': { id: 'yaegashi', emotion: 'normal' },
      '大家のヤエガシ': { id: 'yaegashi', emotion: 'normal' },
      'MIMI': { id: 'mimi', emotion: 'normal' },
      'TVボックス': { id: 'mimi', emotion: 'normal' },
      '分散知性 MIMI': { id: 'mimi', emotion: 'glow' }
    };
  }

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

  hide() {
    this.currentCharId = null;
    this.hideEmotionBubble();
    this.stage.classList.remove('visible');
    this.stage.classList.add('hidden');
    setTimeout(() => {
      if (!this.currentCharId) {
        this.stage.innerHTML = '';
      }
    }, 250);
  }

  showForDialogue(dialogueItem) {
    if (!dialogueItem) return;

    const speaker = dialogueItem.speaker || '';
    const text = dialogueItem.text || '';
    const explicitEmotion = dialogueItem.emotion || null;

    if (speaker.includes('ナレーション')) {
      this.hide();
      return;
    }

    let mapping = null;
    for (const [key, val] of Object.entries(this.speakerMap)) {
      if (speaker.includes(key)) {
        mapping = val;
        break;
      }
    }

    if (!mapping) {
      this.hide();
      return;
    }

    let emotion = explicitEmotion || mapping.emotion;

    // テキスト内容からの感情自動推定
    if (!explicitEmotion) {
      if (text.includes('！？') || text.includes('馬鹿な') || text.includes('な、何だと')) {
        emotion = 'shock';
      } else if (text.includes('……') || text.includes('考えろ') || text.includes('待てよ')) {
        emotion = 'thinking';
      } else if (text.includes('！！') || text.includes('だ！') || text.includes('これだ')) {
        emotion = 'confident';
      } else if (text.includes('怖い') || text.includes('どうしよう') || text.includes('ひっ')) {
        emotion = 'panic';
      }
    }

    this.show(mapping.id, emotion);

    // 感情バルーンの表示
    if (emotion === 'shock' || text.includes('！？')) {
      this.showEmotionBubble('exclamation');
    } else if (emotion === 'thinking' || text.includes('……')) {
      this.showEmotionBubble('question');
    } else if (emotion === 'confident') {
      this.showEmotionBubble('lightbulb');
    }
  }

  setEmotion(emotion) {
    this.currentEmotion = emotion;
    const wrapper = this.stage.querySelector('.char-avatar');
    if (!wrapper) return;

    wrapper.classList.remove('emotion-normal', 'emotion-thinking', 'emotion-shock', 'emotion-confident', 'emotion-panic', 'emotion-glow');
    wrapper.classList.add(`emotion-${emotion}`);
  }

  playMotion(motion) {
    const wrapper = this.stage.querySelector('.char-avatar');
    if (!wrapper) return;

    wrapper.classList.remove('motion-enter', 'motion-shake', 'motion-nod', 'motion-jump');
    void wrapper.offsetWidth; // リフロー
    wrapper.classList.add(`motion-${motion}`);
  }

  showEmotionBubble(type) {
    if (!this.bubble) return;
    clearTimeout(this.bubbleTimeout);

    const icons = {
      lightbulb: '💡',
      exclamation: '❗',
      question: '❓',
      sweat: '💦',
      sparkle: '✨'
    };

    this.bubble.textContent = icons[type] || '❗';
    this.bubble.className = `emotion-bubble visible bubble-${type}`;

    this.bubbleTimeout = setTimeout(() => {
      this.hideEmotionBubble();
    }, 1800);
  }

  hideEmotionBubble() {
    if (!this.bubble) return;
    this.bubble.className = 'emotion-bubble hidden';
  }

  // ----------------------------------------------------
  // SVG レンダリング
  // ----------------------------------------------------
  renderCharacterHtml(charId) {
    switch (charId) {
      case 'yuta':
        return `
          <div class="char-avatar char-wrapper-yuta emotion-normal">
            <svg viewBox="0 0 200 240" class="avatar-svg">
              <!-- 体 / 青いパーカー -->
              <path d="M 50 180 Q 100 170 150 180 L 160 240 L 40 240 Z" fill="#2563eb" />
              <path d="M 85 180 L 100 210 L 115 180" stroke="#1d4ed8" stroke-width="4" fill="none" />
              <!-- 首 -->
              <rect x="88" y="145" width="24" height="25" fill="#fcd34d" />
              <!-- 頭 / 髪 -->
              <circle cx="100" cy="110" r="45" fill="#fcd34d" />
              <!-- 髪型 (黒髪ショート) -->
              <path d="M 55 110 Q 60 65 100 65 Q 140 65 145 110 Q 130 80 100 80 Q 70 80 55 110 Z" fill="#1e293b" />
              <!-- 前髪 -->
              <path d="M 65 85 Q 85 100 100 88 Q 115 100 135 85" stroke="#1e293b" stroke-width="8" stroke-linecap="round" fill="none" />
              <!-- 目 -->
              <ellipse cx="80" cy="115" rx="5" ry="6" fill="#0f172a" class="eye-left" />
              <circle cx="78" cy="113" r="2" fill="#fff" />
              <ellipse cx="120" cy="115" rx="5" ry="6" fill="#0f172a" class="eye-right" />
              <circle cx="118" cy="113" r="2" fill="#fff" />
              <!-- 口 -->
              <path d="M 92 135 Q 100 138 108 135" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round" class="mouth" />
            </svg>
          </div>
        `;
      case 'shibata':
        return `
          <div class="char-avatar char-wrapper-shibata emotion-normal">
            <svg viewBox="0 0 200 240" class="avatar-svg">
              <!-- 体 / 警察スーツ・黒コート -->
              <path d="M 45 170 Q 100 160 155 170 L 165 240 L 35 240 Z" fill="#0f172a" />
              <polygon points="90,170 100,205 110,170" fill="#dc2626" /> <!-- 赤ネクタイ -->
              <polygon points="75,170 100,195 125,170" fill="#f8fafc" /> <!-- 白シャツ -->
              <!-- 首 -->
              <rect x="88" y="135" width="24" height="25" fill="#fbcfe8" />
              <!-- 顔 -->
              <polygon points="65,95 100,155 135,95" fill="#fbcfe8" />
              <circle cx="100" cy="100" r="42" fill="#fbcfe8" />
              <!-- オールバックの髪 (白髪混じりの黒髪) -->
              <path d="M 58 95 Q 60 55 100 55 Q 140 55 142 95 Q 120 70 100 70 Q 80 70 58 95 Z" fill="#334155" />
              <!-- 銀縁眼鏡 -->
              <rect x="70" y="98" width="22" height="12" rx="2" fill="none" stroke="#94a3b8" stroke-width="2.5" />
              <rect x="108" y="98" width="22" height="12" rx="2" fill="none" stroke="#94a3b8" stroke-width="2.5" />
              <line x1="92" y1="104" x2="108" y2="104" stroke="#94a3b8" stroke-width="2" />
              <!-- 鋭い目 -->
              <line x1="74" y1="104" x2="88" y2="104" stroke="#0f172a" stroke-width="2" />
              <line x1="112" y1="104" x2="126" y2="104" stroke="#0f172a" stroke-width="2" />
              <!-- 厳格な口 -->
              <line x1="90" y1="135" x2="110" y2="135" stroke="#831843" stroke-width="2.5" stroke-linecap="round" class="mouth" />
            </svg>
          </div>
        `;
      case 'aoi':
        return `
          <div class="char-avatar char-wrapper-aoi emotion-normal">
            <svg viewBox="0 0 200 240" class="avatar-svg">
              <!-- 体 / クリーム色カーディガン -->
              <path d="M 55 180 Q 100 172 145 180 L 155 240 L 45 240 Z" fill="#fef08a" />
              <!-- 首 -->
              <rect x="89" y="145" width="22" height="25" fill="#fef3c7" />
              <!-- 顔 -->
              <circle cx="100" cy="112" r="40" fill="#fef3c7" />
              <!-- セミロングの茶髪 -->
              <path d="M 52 110 Q 55 60 100 60 Q 145 60 148 110 L 152 185 Q 135 170 135 130 Q 100 75 65 130 Q 65 170 48 185 Z" fill="#78350f" />
              <!-- ぱっつん前髪 -->
              <path d="M 68 88 Q 100 95 132 88" stroke="#78350f" stroke-width="7" stroke-linecap="round" fill="none" />
              <!-- くりっとした目 -->
              <circle cx="82" cy="116" r="6" fill="#451a03" />
              <circle cx="80" cy="113" r="2" fill="#fff" />
              <circle cx="118" cy="116" r="6" fill="#451a03" />
              <circle cx="116" cy="113" r="2" fill="#fff" />
              <!-- 困り眉 -->
              <line x1="75" y1="105" x2="88" y2="108" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
              <line x1="125" y1="105" x2="112" y2="108" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
              <!-- 口 -->
              <path d="M 94 136 Q 100 140 106 136" stroke="#b45309" stroke-width="2" fill="none" class="mouth" />
            </svg>
          </div>
        `;
      case 'yaegashi':
        return `
          <div class="char-avatar char-wrapper-yaegashi emotion-normal">
            <svg viewBox="0 0 200 240" class="avatar-svg">
              <!-- 作業着 -->
              <path d="M 45 175 Q 100 165 155 175 L 165 240 L 35 240 Z" fill="#047857" />
              <!-- 顔 -->
              <rect x="88" y="145" width="24" height="25" fill="#fde68a" />
              <circle cx="100" cy="115" r="44" fill="#fde68a" />
              <!-- 短髪＆ちょび髭 -->
              <path d="M 58 105 Q 60 70 100 70 Q 140 70 142 105 Z" fill="#475569" />
              <!-- 温和な細い目 -->
              <path d="M 75 116 Q 83 112 90 116" stroke="#1f2937" stroke-width="3" fill="none" />
              <path d="M 110 116 Q 117 112 125 116" stroke="#1f2937" stroke-width="3" fill="none" />
              <!-- 口髭＆笑顔 -->
              <ellipse cx="100" cy="132" rx="7" ry="2" fill="#334155" />
              <path d="M 92 138 Q 100 145 108 138" stroke="#78350f" stroke-width="2.5" fill="none" class="mouth" />
            </svg>
          </div>
        `;
      case 'mimi':
        return `
          <div class="char-avatar char-wrapper-mimi emotion-glow">
            <svg viewBox="0 0 200 240" class="avatar-svg">
              <!-- ホログラムパルス背景 -->
              <circle cx="100" cy="120" r="75" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" class="mimi-ring" />
              <!-- 55ドルの黒いTVボックス本体 -->
              <rect x="40" y="85" width="120" height="70" rx="8" fill="#090d16" stroke="#00f3ff" stroke-width="3" />
              <!-- 放熱スリット -->
              <line x1="55" y1="98" x2="145" y2="98" stroke="#1e293b" stroke-width="2" />
              <line x1="55" y1="106" x2="145" y2="106" stroke="#1e293b" stroke-width="2" />
              <!-- 青いステータスLED -->
              <circle cx="60" cy="135" r="4" fill="#00f3ff" class="mimi-led" />
              <!-- 液晶/ターミナル表示 -->
              <rect x="75" y="118" width="70" height="24" rx="3" fill="#020617" stroke="#00f3ff" stroke-width="1" />
              <text x="80" y="134" fill="#22d3ee" font-family="monospace" font-size="9" font-weight="bold">0.39 T/s</text>
              <!-- 接続アンテナ / 外部ケーブル -->
              <path d="M 100 85 L 100 65 L 115 50" stroke="#00f3ff" stroke-width="2.5" fill="none" />
              <circle cx="115" cy="50" r="3" fill="#22d3ee" />
            </svg>
          </div>
        `;
      default:
        return '';
    }
  }
}

window.BoxCharacterController = BoxCharacterController;
