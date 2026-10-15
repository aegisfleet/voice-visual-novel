// character.js - キャラクター立ち絵レンダラー＆表情コントローラー (BOX WORM)

class BoxCharacterController {
  constructor(stageElement, bubbleElement) {
    this.stage = stageElement;
    this.spriteBox = stageElement ? (stageElement.querySelector('#character-sprite-box') || stageElement.querySelector('.character-sprite-box') || stageElement) : null;
    this.bubble = bubbleElement || (stageElement ? stageElement.querySelector('#emotion-bubble') : null);
    this.currentCharId = null;
    this.currentEmotion = 'normal';
    this.bubbleTimeout = null;

    this.speakerMap = {
      'ユウタ': { id: 'yuta', emotion: 'normal' },
      'ユウタ（心の声）': { id: 'yuta', emotion: 'thinking' },
      'シバタ捜査官': { id: 'shibata', emotion: 'normal' },
      'シバタ': { id: 'shibata', emotion: 'normal' },
      '柴田捜査官': { id: 'shibata', emotion: 'normal' },
      '柴田': { id: 'shibata', emotion: 'normal' },
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

    const targetBox = this.spriteBox || this.stage;
    if (isNewChar || !targetBox.querySelector(`.char-wrapper-${charId}`)) {
      targetBox.innerHTML = this.renderCharacterHtml(charId);
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
      if (!this.currentCharId && (this.spriteBox || this.stage)) {
        (this.spriteBox || this.stage).innerHTML = '';
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
    const targetBox = this.spriteBox || this.stage;
    const wrapper = targetBox ? targetBox.querySelector('.char-avatar') : null;
    if (!wrapper) return;

    wrapper.classList.remove('emotion-normal', 'emotion-thinking', 'emotion-shock', 'emotion-confident', 'emotion-panic', 'emotion-glow');
    wrapper.classList.add(`emotion-${emotion}`);
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
  // キャラクター立ち絵レンダリング (Nano Banana 2.1 高解像度スプライト)
  // ----------------------------------------------------
  renderCharacterHtml(charId) {
    const assetMap = {
      yuta: 'assets/characters/yuta.png',
      shibata: 'assets/characters/shibata.png',
      aoi: 'assets/characters/aoi.png',
      yaegashi: 'assets/characters/yaegashi.png',
      mimi: 'assets/characters/mimi.png'
    };

    const imgSrc = assetMap[charId];
    if (!imgSrc) return '';

    return `
      <div class="char-avatar char-wrapper-${charId} emotion-normal">
        <img class="char-sprite-img char-img-${charId}" src="${imgSrc}" alt="${charId}" />
      </div>
    `;
  }
}

window.BoxCharacterController = BoxCharacterController;
