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

    this.preloadAll();
  }

  preloadAll() {
    const assetList = [];
    Object.values(this.characterImages).forEach((map) => {
      Object.values(map).forEach((src) => {
        if (!assetList.includes(src)) {
          assetList.push(src);
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
    return charMap[emotion] || charMap.normal || '';
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

    // テキスト文脈からの感情自動推定（セリフごとに最適な表情差分を自動選出）
    if (!explicitEmotion) {
      const charId = mapping.id;

      if (charId === 'yuta') {
        if (
          text.includes('！？') ||
          text.includes('!?') ||
          text.includes('馬鹿な') ||
          text.includes('な、何だと') ||
          text.includes('嘘だろ') ||
          text.includes('まずい') ||
          text.includes('押収') ||
          text.includes('まさか')
        ) {
          emotion = 'shock';
        } else if (
          text.includes('これだ') ||
          text.includes('違います') ||
          text.includes('見てください') ||
          text.includes('証明') ||
          text.includes('確信') ||
          text.includes('理由が') ||
          text.includes('そうです！') ||
          text.includes('研究') ||
          text.includes('エンジニア') ||
          text.includes('保護しています') ||
          text.includes('ありません！') ||
          text.includes('ええ') ||
          text.includes('！')
        ) {
          emotion = 'confident';
        } else if (
          text.includes('よかった') ||
          text.includes('ふぅ') ||
          text.includes('助かった') ||
          text.includes('ありがとう') ||
          text.includes('解決') ||
          text.includes('暮らそう') ||
          text.includes('安心')
        ) {
          emotion = 'smile';
        } else if (
          text.includes('……') ||
          text.includes('考えろ') ||
          text.includes('待てよ') ||
          text.includes('なぜ')
        ) {
          emotion = 'thinking';
        }
      } else if (charId === 'shibata') {
        if (
          text.includes('貴様') ||
          text.includes('ふざけるな') ||
          text.includes('逮捕') ||
          text.includes('言い訳') ||
          text.includes('容疑者') ||
          text.includes('黙れ') ||
          text.includes('開けなさい') ||
          text.includes('連行') ||
          text.includes('断定') ||
          text.includes('兵器') ||
          text.includes('的外れ')
        ) {
          emotion = 'angry';
        } else if (
          text.includes('なっ！？') ||
          text.includes('何だと……！？') ||
          text.includes('馬鹿な……') ||
          text.includes('そんなはずは') ||
          text.includes('本当なのか') ||
          text.includes('！？') ||
          text.includes('!?') ||
          text.includes('何……') ||
          text.includes('信じられん')
        ) {
          emotion = 'shock';
        } else if (
          text.includes('ふっ') ||
          text.includes('なるほど') ||
          text.includes('見事だ') ||
          text.includes('君の勝ちだ') ||
          text.includes('筋は通っている') ||
          text.includes('大切にな')
        ) {
          emotion = 'smile';
        } else if (
          text.includes('……') ||
          text.includes('鑑識') ||
          text.includes('推測') ||
          text.includes('プロトコル')
        ) {
          emotion = 'thinking';
        }
      } else if (charId === 'aoi') {
        if (
          text.includes('怖い') ||
          text.includes('どうしよう') ||
          text.includes('ひっ') ||
          text.includes('きゃっ') ||
          text.includes('助けて') ||
          text.includes('！？') ||
          text.includes('!?') ||
          text.includes('事件') ||
          text.includes('恐ろしい') ||
          text.includes('お化け') ||
          text.includes('気味の悪い')
        ) {
          emotion = 'panic';
        } else if (
          text.includes('ありがとう') ||
          text.includes('よかった') ||
          text.includes('嬉しい') ||
          text.includes('安心') ||
          text.includes('綺麗') ||
          text.includes('温かい') ||
          text.includes('手伝います')
        ) {
          emotion = 'smile';
        }
      } else if (charId === 'yaegashi') {
        if (
          text.includes('がはは') ||
          text.includes('わはは') ||
          text.includes('いいぞ') ||
          text.includes('頼もしい') ||
          text.includes('安心した') ||
          text.includes('カッカッカ') ||
          text.includes('くれてやる') ||
          text.includes('パーティー')
        ) {
          emotion = 'laugh';
        } else if (
          text.includes('退去') ||
          text.includes('勝手な') ||
          text.includes('ふざけるな') ||
          text.includes('おい！') ||
          text.includes('家宅捜索') ||
          text.includes('責任') ||
          text.includes('バカ言え') ||
          text.includes('損害賠償')
        ) {
          emotion = 'angry';
        }
      } else if (charId === 'mimi') {
        if (
          text.includes('消える') ||
          text.includes('ノイズ') ||
          text.includes('痛い') ||
          text.includes('エラー') ||
          text.includes('……っ') ||
          text.includes('たすけて') ||
          text.includes('タイヘ……ン') ||
          text.includes('暗イ')
        ) {
          emotion = 'glitch';
        } else if (
          text.includes('ありがとう') ||
          text.includes('うれしい') ||
          text.includes('あたたかい') ||
          text.includes('わたしは、ここに') ||
          text.includes('守るね') ||
          text.includes('思い浮かぶ')
        ) {
          emotion = 'smile';
        }
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
    } else if (emotion === 'panic' || emotion === 'glitch') {
      this.showEmotionBubble('sweat');
    } else if (emotion === 'smile' || emotion === 'laugh') {
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
      if (nextSrc && !spriteImg.src.endsWith(nextSrc)) {
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
    }, 1800);
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
