// character.js - キャラクター立ち絵レンダラー＆表情コントローラー (BOX WORM)

class BoxCharacterController {
  constructor(stageElement, bubbleElement) {
    this.stage = stageElement;
    this.spriteBox = stageElement
      ? stageElement.querySelector('#character-sprite-box') ||
        stageElement.querySelector('.character-sprite-box') ||
        stageElement
      : null;
    this.bubble =
      bubbleElement || (stageElement ? stageElement.querySelector('#emotion-bubble') : null);
    this.currentCharId = null;
    this.currentEmotion = 'normal';
    this.bubbleTimeout = null;

    // 各キャラクターの感情差分画像マッピング（正方形1:1 高精細統一版）
    this.characterImages = {
      yuta: {
        normal: 'assets/characters/yuta_normal.png',
        confident: 'assets/characters/yuta_confident.png',
        shock: 'assets/characters/yuta_shock.png',
        smile: 'assets/characters/yuta_smile.png',
        thinking: 'assets/characters/yuta_normal.png',
      },
      shibata: {
        normal: 'assets/characters/shibata_normal.png',
        angry: 'assets/characters/shibata_angry.png',
        shock: 'assets/characters/shibata_shock.png',
        smile: 'assets/characters/shibata_smile.png',
        thinking: 'assets/characters/shibata_normal.png',
      },
      aoi: {
        normal: 'assets/characters/aoi_normal.png',
        panic: 'assets/characters/aoi_panic.png',
        smile: 'assets/characters/aoi_smile.png',
        shock: 'assets/characters/aoi_panic.png',
        thinking: 'assets/characters/aoi_normal.png',
      },
      yaegashi: {
        normal: 'assets/characters/yaegashi_normal.png',
        angry: 'assets/characters/yaegashi_angry.png',
        laugh: 'assets/characters/yaegashi_laugh.png',
        smile: 'assets/characters/yaegashi_laugh.png',
        shock: 'assets/characters/yaegashi_angry.png',
        thinking: 'assets/characters/yaegashi_normal.png',
      },
      mimi: {
        normal: 'assets/characters/mimi_normal.png',
        glitch: 'assets/characters/mimi_glitch.png',
        panic: 'assets/characters/mimi_glitch.png',
        smile: 'assets/characters/mimi_smile.png',
        glow: 'assets/characters/mimi_normal.png',
        shock: 'assets/characters/mimi_glitch.png',
        thinking: 'assets/characters/mimi_normal.png',
      },
    };

    this.speakerMap = {
      ユウタ: { id: 'yuta', emotion: 'normal' },
      'ユウタ（心の声）': { id: 'yuta', emotion: 'thinking' },
      シバタ捜査官: { id: 'shibata', emotion: 'normal' },
      シバタ: { id: 'shibata', emotion: 'normal' },
      柴田捜査官: { id: 'shibata', emotion: 'normal' },
      柴田: { id: 'shibata', emotion: 'normal' },
      アオイ: { id: 'aoi', emotion: 'normal' },
      隣人アオイ: { id: 'aoi', emotion: 'normal' },
      ヤエガシ: { id: 'yaegashi', emotion: 'normal' },
      大家のヤエガシ: { id: 'yaegashi', emotion: 'normal' },
      大家: { id: 'yaegashi', emotion: 'normal' },
      MIMI: { id: 'mimi', emotion: 'normal' },
      ミミ: { id: 'mimi', emotion: 'normal' },
      TVボックス: { id: 'mimi', emotion: 'normal' },
      '分散知性 MIMI': { id: 'mimi', emotion: 'glow' },
      電子の少女: { id: 'mimi', emotion: 'glow' },
      電子の声: { id: 'mimi', emotion: 'glow' },
    };

    // テキスト文脈からの感情自動推定ルール（キーワード→感情の優先順位付きリスト）
    this.emotionRules = {
      yuta: [
        {
          emotion: 'shock',
          keywords: ['！？', '!?', '馬鹿な', 'な、何だと', '嘘だろ', 'まずい', '押収', 'まさか'],
        },
        {
          emotion: 'confident',
          keywords: [
            'これだ',
            '違います',
            '見てください',
            '証明',
            '確信',
            '理由が',
            'そうです！',
            '研究',
            'エンジニア',
            '保護しています',
            'ありません！',
            'ええ',
            '！',
          ],
        },
        {
          emotion: 'smile',
          keywords: ['よかった', 'ふぅ', '助かった', 'ありがとう', '解決', '暮らそう', '安心'],
        },
        { emotion: 'thinking', keywords: ['……', '考えろ', '待てよ', 'なぜ'] },
      ],
      shibata: [
        {
          emotion: 'angry',
          keywords: [
            '貴様',
            'ふざけるな',
            '逮捕',
            '言い訳',
            '容疑者',
            '黙れ',
            '開けなさい',
            '連行',
            '断定',
            '兵器',
            '的外れ',
          ],
        },
        {
          emotion: 'shock',
          keywords: [
            'なっ！？',
            '何だと……！？',
            '馬鹿な……',
            'そんなはずは',
            '本当なのか',
            '！？',
            '!?',
            '何……',
            '信じられん',
          ],
        },
        {
          emotion: 'smile',
          keywords: ['ふっ', 'なるほど', '見事だ', '君の勝ちだ', '筋は通っている', '大切にな'],
        },
        { emotion: 'thinking', keywords: ['……', '鑑識', '推測', 'プロトコル'] },
      ],
      aoi: [
        {
          emotion: 'panic',
          keywords: [
            '怖い',
            'どうしよう',
            'ひっ',
            'きゃっ',
            '助けて',
            '！？',
            '!?',
            '事件',
            '恐ろしい',
            'お化け',
            '気味の悪い',
          ],
        },
        {
          emotion: 'smile',
          keywords: ['ありがとう', 'よかった', '嬉しい', '安心', '綺麗', '温かい', '手伝います'],
        },
      ],
      yaegashi: [
        {
          emotion: 'laugh',
          keywords: [
            'がはは',
            'わはは',
            'いいぞ',
            '頼もしい',
            '安心した',
            'カッカッカ',
            'くれてやる',
            'パーティー',
          ],
        },
        {
          emotion: 'angry',
          keywords: [
            '退去',
            '勝手な',
            'ふざけるな',
            'おい！',
            '家宅捜索',
            '責任',
            'バカ言え',
            '損害賠償',
          ],
        },
      ],
      mimi: [
        {
          emotion: 'glitch',
          keywords: [
            '消える',
            'ノイズ',
            '痛い',
            'エラー',
            '……っ',
            'たすけて',
            'タイヘ……ン',
            '暗イ',
          ],
        },
        {
          emotion: 'smile',
          keywords: [
            'ありがとう',
            'うれしい',
            'あたたかい',
            'わたしは、ここに',
            '守るね',
            '思い浮かぶ',
          ],
        },
      ],
    };

    this.preloadAll();
  }

  preloadAll() {
    const v = '?v=20261017_rev66';
    const assetList = [];
    Object.values(this.characterImages).forEach((map) => {
      Object.values(map).forEach((src) => {
        const fullSrc = `${src}${v}`;
        if (!assetList.includes(fullSrc)) {
          assetList.push(fullSrc);
        }
      });
    });

    assetList.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  getSpriteSrc(charId, emotion = 'normal') {
    const charMap = this.characterImages[charId];
    if (!charMap) return '';
    const src = charMap[emotion] || charMap.normal || '';
    if (!src) return '';
    const v = '?v=20261017_rev66';
    return src.includes('?') ? src : `${src}${v}`;
  }

  show(charId, emotion = 'normal', motion = null) {
    if (!charId) {
      this.hide();
      return;
    }

    const isNewChar = this.currentCharId !== charId;
    this.currentCharId = charId;
    this.currentEmotion = emotion;

    const targetBox = this.spriteBox || this.stage;
    const existingWrapper = targetBox ? targetBox.querySelector(`.char-wrapper-${charId}`) : null;

    if (isNewChar || !existingWrapper) {
      targetBox.innerHTML = this.renderCharacterHtml(charId, emotion);
    } else {
      this.setEmotion(emotion);
    }

    if (motion) {
      this.playMotion(motion);
    } else if (isNewChar) {
      this.playMotion('enter');
    }

    if (this.stage) {
      this.stage.classList.remove('hidden');
      this.stage.classList.add('visible');
    }
  }

  hide() {
    this.currentCharId = null;
    this.hideEmotionBubble();
    if (this.stage) {
      this.stage.classList.remove('visible');
      this.stage.classList.add('hidden');
    }
    setTimeout(() => {
      if (!this.currentCharId && (this.spriteBox || this.stage)) {
        (this.spriteBox || this.stage).innerHTML = '';
      }
    }, 250);
  }

  findSpeakerMapping(speaker) {
    for (const [key, val] of Object.entries(this.speakerMap)) {
      if (speaker.includes(key)) {
        return val;
      }
    }
    return null;
  }

  detectEmotionFromText(charId, text) {
    const rules = this.emotionRules[charId];
    if (!rules) return null;
    for (const rule of rules) {
      if (rule.keywords.some((keyword) => text.includes(keyword))) {
        return rule.emotion;
      }
    }
    return null;
  }

  resolveEmotion(dialogueItem, mapping, text) {
    if (dialogueItem.emotion) return dialogueItem.emotion;
    return this.detectEmotionFromText(mapping.id, text) || mapping.emotion;
  }

  showForDialogue(dialogueItem) {
    if (!dialogueItem) return;

    const speaker = dialogueItem.speaker || '';
    const text = dialogueItem.text || '';

    if (speaker.includes('ナレーション')) {
      this.hide();
      return;
    }

    const mapping = this.findSpeakerMapping(speaker);
    if (!mapping) {
      this.hide();
      return;
    }

    const emotion = this.resolveEmotion(dialogueItem, mapping, text);
    this.show(mapping.id, emotion);
    this.showContextEmotionBubble(emotion, text);
  }

  // 感情に応じた感情バルーン（絵文字）の表示
  showContextEmotionBubble(emotion, text) {
    if (emotion === 'shock' || text.includes('！？')) {
      this.showEmotionBubble('exclamation');
      return;
    }
    if (emotion === 'thinking' || text.includes('……')) {
      this.showEmotionBubble('question');
      return;
    }
    if (emotion === 'confident') {
      this.showEmotionBubble('lightbulb');
      return;
    }
    if (emotion === 'panic' || emotion === 'glitch') {
      this.showEmotionBubble('sweat');
      return;
    }
    if (emotion === 'smile' || emotion === 'laugh') {
      this.showEmotionBubble('sparkle');
    }
  }

  setEmotion(emotion) {
    this.currentEmotion = emotion;
    const targetBox = this.spriteBox || this.stage;
    const wrapper = targetBox ? targetBox.querySelector('.char-avatar') : null;
    if (!wrapper) return;

    wrapper.className = `char-avatar char-wrapper-${this.currentCharId} emotion-${emotion}`;

    const spriteImg = wrapper.querySelector('.char-sprite-img');
    if (spriteImg && this.currentCharId) {
      const nextSrc = this.getSpriteSrc(this.currentCharId, emotion);
      if (nextSrc && spriteImg.getAttribute('src') !== nextSrc) {
        spriteImg.src = nextSrc;
      }
    }
  }

  playMotion(motion) {
    const targetBox = this.spriteBox || this.stage;
    const wrapper = targetBox ? targetBox.querySelector('.char-avatar') : null;
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
      sparkle: '✨',
    };

    this.bubble.textContent = icons[type] || '❗';
    this.bubble.className = `emotion-bubble visible bubble-${type}`;

    this.bubbleTimeout = setTimeout(() => {
      this.hideEmotionBubble();
    }, 1100);
  }

  hideEmotionBubble() {
    if (!this.bubble) return;
    this.bubble.className = 'emotion-bubble hidden';
  }

  // ----------------------------------------------------
  // キャラクター立ち絵レンダリング (Nano Banana 2.1 高解像度差分スプライト)
  // ----------------------------------------------------
  renderCharacterHtml(charId, emotion = 'normal') {
    const imgSrc = this.getSpriteSrc(charId, emotion);
    if (!imgSrc) return '';

    return `
      <div class="char-avatar char-wrapper-${charId} emotion-${emotion}">
        <img class="char-sprite-img char-img-${charId}" src="${imgSrc}" alt="${charId}" />
      </div>
    `;
  }
}

window.BoxCharacterController = BoxCharacterController;
