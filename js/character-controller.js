/**
 * CharacterController (3キャラクター対応版)
 * - アイリス (Iris): 相棒のサイバー捜査・分析官
 * - イブ (Eve): 事件の被疑者AI（ホログラムアバター）
 * - キリシマ (Kirishima): セキュリティ開発主任
 *
 * 各キャラクターで呼吸・自動まばたき・リップシンク・感情アクション・マウス追従を制御
 */
class CharacterController {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentCharacterId = null;
    this.currentExpression = 'normal';
    this.isTalking = false;
    this.blinkTimer = null;

    this.setupMouseTracking();
  }

  /**
   * 表示するキャラクターと表情をセット
   */
  show(charId, expression = 'normal', motion = null) {
    if (!charId) {
      this.hide();
      return;
    }

    this.container.style.opacity = '1';

    // キャラクターが変わった場合は再描画
    if (this.currentCharacterId !== charId) {
      this.currentCharacterId = charId;
      this.renderCharacter(charId);
      this.bindElements();
      this.startBlinking();
    }

    this.setExpression(expression);
    if (motion) {
      this.playMotion(motion);
    }
  }

  hide() {
    this.currentCharacterId = null;
    this.container.style.opacity = '0';
    clearTimeout(this.blinkTimer);
  }

  renderCharacter(charId) {
    let svgContent = '';
    switch (charId) {
      case 'eve':
        svgContent = this.getEveSVG();
        break;
      case 'kirishima':
        svgContent = this.getKirishimaSVG();
        break;
      case 'iris':
      default:
        svgContent = this.getIrisSVG();
        break;
    }

    this.container.innerHTML = `
      <div class="live2d-character-wrapper char-${charId}" id="live2dWrapper">
        ${svgContent}
      </div>
    `;
  }

  bindElements() {
    this.wrapper = document.getElementById('live2dWrapper');
    this.partHead = document.getElementById('partHead');
    this.partEyes = document.getElementById('partEyes');
    this.eyesClosed = document.getElementById('eyesClosed');
    this.eyeLeft = document.getElementById('eyeLeft');
    this.eyeRight = document.getElementById('eyeRight');
    this.pupilLeft = document.getElementById('pupilLeft');
    this.pupilRight = document.getElementById('pupilRight');
    this.mouthClosed = document.getElementById('mouthClosed');
    this.mouthOpen = document.getElementById('mouthOpen');
    this.partBlush = document.getElementById('partBlush');
  }

  /**
   * キャラクター1: アイリス (Iris) - 捜査官・相棒
   */
  getIrisSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="irisHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff758c" />
            <stop offset="100%" stop-color="#ff7eb3" />
          </linearGradient>
          <linearGradient id="irisSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff5eb" />
            <stop offset="100%" stop-color="#fee3d4" />
          </linearGradient>
          <linearGradient id="irisJacket" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1f2839" />
            <stop offset="100%" stop-color="#0e131d" />
          </linearGradient>
        </defs>

        <g class="part-back-hair">
          <path d="M 170 230 C 130 310 130 500 150 600 C 180 500 200 450 200 400 Z" fill="url(#irisHair)"/>
          <path d="M 330 230 C 370 310 370 500 350 600 C 320 500 300 450 300 400 Z" fill="url(#irisHair)"/>
          <path d="M 160 200 Q 250 160 340 200 C 370 320 370 500 330 620 C 290 580 210 580 170 620 C 130 500 130 320 160 200 Z" fill="url(#irisHair)"/>
        </g>

        <!-- 体・捜査官ジャケット -->
        <g class="part-body" id="partBody">
          <path d="M 230 310 L 230 370 L 270 370 L 270 310 Z" fill="url(#irisSkin)" />
          <path d="M 170 370 Q 250 350 330 370 L 375 580 L 125 580 Z" fill="url(#irisJacket)" />
          <!-- ネオンライン & バッジ -->
          <line x1="250" y1="370" x2="250" y2="580" stroke="#00f3ff" stroke-width="3" />
          <polygon points="200,420 220,410 220,430" fill="#00f3ff" />
          <rect x="235" y="375" width="30" height="20" fill="#ff758c" rx="4" />
        </g>

        <!-- 頭部 -->
        <g class="part-head" id="partHead">
          <path d="M 180 230 Q 180 330 250 350 Q 320 330 320 230 Q 320 160 250 160 Q 180 160 180 230 Z" fill="url(#irisSkin)" />
          
          <!-- サイバーイヤーピース/インカム -->
          <rect x="165" y="240" width="12" height="25" rx="4" fill="#00f3ff" />
          <circle cx="171" cy="252" r="3" fill="#ffffff" />

          <!-- 頬のチーク -->
          <g class="part-blush" id="partBlush">
            <ellipse cx="205" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.4" />
            <ellipse cx="295" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.4" />
          </g>

          <!-- 眉毛 -->
          <g class="part-eyebrows" id="partEyebrows">
            <path class="eyebrow-left" d="M 195 218 Q 215 210 230 220" stroke="#7a342a" stroke-width="3.5" stroke-linecap="round" fill="none" />
            <path class="eyebrow-right" d="M 270 220 Q 285 210 305 218" stroke="#7a342a" stroke-width="3.5" stroke-linecap="round" fill="none" />
          </g>

          <!-- 目 -->
          <g class="part-eyes" id="partEyes">
            <g class="eye eye-left" id="eyeLeft">
              <ellipse class="eye-white" cx="215" cy="245" rx="18" ry="20" fill="#ffffff" />
              <ellipse class="eye-iris" id="pupilLeft" cx="216" cy="245" rx="12" ry="16" fill="#00bcd4" />
              <circle class="eye-pupil" cx="216" cy="245" r="6" fill="#0b3842" />
              <circle class="eye-highlight1" cx="212" cy="238" r="4.5" fill="#ffffff" />
              <path class="eyelash" d="M 195 240 Q 215 220 235 242" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
            <g class="eye eye-right" id="eyeRight">
              <ellipse class="eye-white" cx="285" cy="245" rx="18" ry="20" fill="#ffffff" />
              <ellipse class="eye-iris" id="pupilRight" cx="284" cy="245" rx="12" ry="16" fill="#00bcd4" />
              <circle class="eye-pupil" cx="284" cy="245" r="6" fill="#0b3842" />
              <circle class="eye-highlight1" cx="280" cy="238" r="4.5" fill="#ffffff" />
              <path class="eyelash" d="M 265 242 Q 285 220 305 240" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
            <g class="eyes-closed" id="eyesClosed" style="display: none;">
              <path d="M 196 244 Q 215 258 234 244" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
              <path d="M 266 244 Q 285 258 304 244" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
          </g>

          <circle cx="250" cy="265" r="1.5" fill="#d89682" />

          <!-- 口 -->
          <g class="part-mouth" id="partMouth">
            <path class="mouth-closed" id="mouthClosed" d="M 242 290 Q 250 293 258 290" stroke="#7a342a" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path class="mouth-open" id="mouthOpen" d="M 240 288 Q 250 306 260 288 Z" fill="#cf4343" stroke="#7a342a" stroke-width="2" style="display: none;" />
          </g>

          <!-- 前髪 -->
          <g class="part-front-hair">
            <path d="M 180 200 Q 160 300 175 350 Q 185 300 190 250 Z" fill="url(#irisHair)" />
            <path d="M 320 200 Q 340 300 325 350 Q 315 300 310 250 Z" fill="url(#irisHair)" />
            <path d="M 180 180 Q 250 140 320 180 Q 310 230 290 235 Q 270 210 250 240 Q 230 210 210 235 Q 190 230 180 180 Z" fill="url(#irisHair)" />
            <path class="hair-ahoge" d="M 250 155 Q 265 110 280 125 Q 260 135 250 155" fill="url(#irisHair)" />
          </g>
        </g>
      </svg>
    `;
  }

  /**
   * キャラクター2: イブ (Eve) - 被疑者AI (青白いサイバーホログラム)
   */
  getEveSVG() {
    return `
      <svg class="character-svg holo-character" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eveHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#b8f2e6" />
            <stop offset="100%" stop-color="#5eead4" />
          </linearGradient>
          <linearGradient id="eveSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e6fffa" />
            <stop offset="100%" stop-color="#ccfbf1" />
          </linearGradient>
          <linearGradient id="eveDress" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f766e" />
            <stop offset="100%" stop-color="#115e59" />
          </linearGradient>
        </defs>

        <!-- ホログラム粒子・後ろ髪 -->
        <g class="part-back-hair" opacity="0.9">
          <path d="M 160 200 C 100 350 80 550 120 700 C 160 550 200 450 200 400 Z" fill="url(#eveHair)"/>
          <path d="M 340 200 C 400 350 420 550 380 700 C 340 550 300 450 300 400 Z" fill="url(#eveHair)"/>
          <path d="M 150 190 Q 250 140 350 190 C 410 350 410 600 350 720 C 290 660 210 660 150 720 C 90 600 90 350 150 190 Z" fill="url(#eveHair)" opacity="0.7"/>
        </g>

        <!-- ホログラム体 -->
        <g class="part-body" id="partBody">
          <path d="M 235 310 L 235 370 L 265 370 L 265 310 Z" fill="url(#eveSkin)" />
          <path d="M 180 370 Q 250 350 320 370 L 360 580 L 140 580 Z" fill="url(#eveDress)" />
          <!-- サイバーサークル発光 -->
          <circle cx="250" cy="450" r="30" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="8,4" />
          <line x1="200" y1="450" x2="300" y2="450" stroke="#5eead4" stroke-width="1.5" />
        </g>

        <!-- 頭部 -->
        <g class="part-head" id="partHead">
          <path d="M 180 230 Q 180 330 250 350 Q 320 330 320 230 Q 320 160 250 160 Q 180 160 180 230 Z" fill="url(#eveSkin)" />
          
          <!-- AIリング（頭上のフローティングヘイロー） -->
          <ellipse cx="250" cy="130" rx="90" ry="20" fill="none" stroke="#2dd4bf" stroke-width="3" opacity="0.85" />

          <g class="part-blush" id="partBlush">
            <ellipse cx="205" cy="275" rx="14" ry="7" fill="#2dd4bf" opacity="0.25" />
            <ellipse cx="295" cy="275" rx="14" ry="7" fill="#2dd4bf" opacity="0.25" />
          </g>

          <g class="part-eyebrows" id="partEyebrows">
            <path class="eyebrow-left" d="M 195 218 Q 215 215 230 220" stroke="#0f766e" stroke-width="3" stroke-linecap="round" fill="none" />
            <path class="eyebrow-right" d="M 270 220 Q 285 215 305 218" stroke="#0f766e" stroke-width="3" stroke-linecap="round" fill="none" />
          </g>

          <g class="part-eyes" id="partEyes">
            <g class="eye eye-left" id="eyeLeft">
              <ellipse class="eye-white" cx="215" cy="245" rx="18" ry="20" fill="#f0fdfa" />
              <ellipse class="eye-iris" id="pupilLeft" cx="216" cy="245" rx="13" ry="17" fill="#0d9488" />
              <circle class="eye-pupil" cx="216" cy="245" r="7" fill="#115e59" />
              <circle class="eye-highlight1" cx="212" cy="238" r="4.5" fill="#ccfbf1" />
              <path class="eyelash" d="M 195 240 Q 215 222 235 242" stroke="#134e4a" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
            <g class="eye eye-right" id="eyeRight">
              <ellipse class="eye-white" cx="285" cy="245" rx="18" ry="20" fill="#f0fdfa" />
              <ellipse class="eye-iris" id="pupilRight" cx="284" cy="245" rx="13" ry="17" fill="#0d9488" />
              <circle class="eye-pupil" cx="284" cy="245" r="7" fill="#115e59" />
              <circle class="eye-highlight1" cx="280" cy="238" r="4.5" fill="#ccfbf1" />
              <path class="eyelash" d="M 265 242 Q 285 222 305 240" stroke="#134e4a" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
            <g class="eyes-closed" id="eyesClosed" style="display: none;">
              <path d="M 196 244 Q 215 258 234 244" stroke="#134e4a" stroke-width="3.5" stroke-linecap="round" fill="none" />
              <path d="M 266 244 Q 285 258 304 244" stroke="#134e4a" stroke-width="3.5" stroke-linecap="round" fill="none" />
            </g>
          </g>

          <circle cx="250" cy="265" r="1.5" fill="#5eead4" />

          <g class="part-mouth" id="partMouth">
            <path class="mouth-closed" id="mouthClosed" d="M 242 290 Q 250 293 258 290" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path class="mouth-open" id="mouthOpen" d="M 240 288 Q 250 306 260 288 Z" fill="#14b8a6" stroke="#0f766e" stroke-width="2" style="display: none;" />
          </g>

          <g class="part-front-hair">
            <path d="M 175 190 Q 150 290 160 370 Q 175 300 185 240 Z" fill="url(#eveHair)" />
            <path d="M 325 190 Q 350 290 340 370 Q 325 300 315 240 Z" fill="url(#eveHair)" />
            <path d="M 175 170 Q 250 140 325 170 Q 305 230 285 235 Q 265 210 250 238 Q 235 210 215 235 Q 195 230 175 170 Z" fill="url(#eveHair)" />
          </g>
        </g>
      </svg>
    `;
  }

  /**
   * キャラクター3: キリシマ主任 (Kirishima) - セキュリティ責任者 (眼鏡・スーツ)
   */
  getKirishimaSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kiriHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#374151" />
            <stop offset="100%" stop-color="#1f2937" />
          </linearGradient>
          <linearGradient id="kiriSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff1e6" />
            <stop offset="100%" stop-color="#fcd5ce" />
          </linearGradient>
          <linearGradient id="kiriSuit" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#111827" />
            <stop offset="100%" stop-color="#030712" />
          </linearGradient>
        </defs>

        <!-- 体・スーツとネクタイ -->
        <g class="part-body" id="partBody">
          <path d="M 225 300 L 225 365 L 275 365 L 275 300 Z" fill="url(#kiriSkin)" />
          <path d="M 155 365 Q 250 340 345 365 L 390 580 L 110 580 Z" fill="url(#kiriSuit)" />
          <!-- ワイシャツとネクタイ -->
          <polygon points="210,365 290,365 250,450" fill="#f9fafb" />
          <polygon points="243,380 257,380 262,490 250,510 238,490" fill="#dc2626" />
        </g>

        <!-- 頭部 -->
        <g class="part-head" id="partHead">
          <path d="M 180 220 Q 180 325 250 345 Q 320 325 320 220 Q 320 150 250 150 Q 180 150 180 220 Z" fill="url(#kiriSkin)" />

          <!-- 眉毛（厳格・焦燥感） -->
          <g class="part-eyebrows" id="partEyebrows">
            <path class="eyebrow-left" d="M 195 212 L 232 218" stroke="#1f2937" stroke-width="4" stroke-linecap="round" />
            <path class="eyebrow-right" d="M 268 218 L 305 212" stroke="#1f2937" stroke-width="4" stroke-linecap="round" />
          </g>

          <!-- 目 -->
          <g class="part-eyes" id="partEyes">
            <g class="eye eye-left" id="eyeLeft">
              <ellipse class="eye-white" cx="215" cy="240" rx="16" ry="14" fill="#ffffff" />
              <ellipse class="eye-iris" id="pupilLeft" cx="215" cy="240" rx="10" ry="12" fill="#4b5563" />
              <circle class="eye-pupil" cx="215" cy="240" r="5" fill="#111827" />
              <circle class="eye-highlight1" cx="212" cy="236" r="3.5" fill="#ffffff" />
            </g>
            <g class="eye eye-right" id="eyeRight">
              <ellipse class="eye-white" cx="285" cy="240" rx="16" ry="14" fill="#ffffff" />
              <ellipse class="eye-iris" id="pupilRight" cx="285" cy="240" rx="10" ry="12" fill="#4b5563" />
              <circle class="eye-pupil" cx="285" cy="240" r="5" fill="#111827" />
              <circle class="eye-highlight1" cx="282" cy="236" r="3.5" fill="#ffffff" />
            </g>
            <g class="eyes-closed" id="eyesClosed" style="display: none;">
              <line x1="198" y1="240" x2="232" y2="240" stroke="#111827" stroke-width="3.5" />
              <line x1="268" y1="240" x2="302" y2="240" stroke="#111827" stroke-width="3.5" />
            </g>
          </g>

          <!-- 眼鏡フレーム -->
          <rect x="190" y="226" width="50" height="28" rx="4" fill="none" stroke="#9ca3af" stroke-width="2.5" />
          <rect x="260" y="226" width="50" height="28" rx="4" fill="none" stroke="#9ca3af" stroke-width="2.5" />
          <line x1="240" y1="238" x2="260" y2="238" stroke="#9ca3af" stroke-width="2.5" />

          <!-- 頬（通常は透明） -->
          <g class="part-blush" id="partBlush">
            <ellipse cx="205" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.1" />
            <ellipse cx="295" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.1" />
          </g>

          <circle cx="250" cy="265" r="2" fill="#d1a08f" />

          <!-- 口 -->
          <g class="part-mouth" id="partMouth">
            <path class="mouth-closed" id="mouthClosed" d="M 238 290 L 262 290" stroke="#4b5563" stroke-width="3" stroke-linecap="round" />
            <path class="mouth-open" id="mouthOpen" d="M 236 288 Q 250 304 264 288 Z" fill="#b91c1c" stroke="#4b5563" stroke-width="2" style="display: none;" />
          </g>

          <!-- 短髪・前髪 -->
          <g class="part-front-hair">
            <path d="M 170 210 Q 160 140 250 140 Q 340 140 330 210 Q 320 180 300 185 Q 270 190 250 170 Q 230 190 200 185 Q 180 180 170 210 Z" fill="url(#kiriHair)" />
          </g>
        </g>
      </svg>
    `;
  }

  setExpression(expression) {
    this.currentExpression = expression;
    this.resetExpressionStyle();

    switch (expression) {
      case 'smile':
        if (this.eyesClosed) this.eyesClosed.style.display = 'block';
        if (this.eyeLeft) this.eyeLeft.style.display = 'none';
        if (this.eyeRight) this.eyeRight.style.display = 'none';
        if (this.partBlush) this.partBlush.style.opacity = '0.7';
        break;

      case 'shocked':
      case 'surprised':
        if (this.eyeLeft) this.eyeLeft.style.transform = 'scale(1.2)';
        if (this.eyeRight) this.eyeRight.style.transform = 'scale(1.2)';
        break;

      case 'serious':
        if (this.eyeLeft) this.eyeLeft.style.transform = 'scaleY(0.85)';
        if (this.eyeRight) this.eyeRight.style.transform = 'scaleY(0.85)';
        break;

      case 'sad':
        if (this.partBlush) this.partBlush.style.opacity = '0.2';
        break;

      case 'normal':
      default:
        break;
    }
  }

  resetExpressionStyle() {
    if (this.eyesClosed) this.eyesClosed.style.display = 'none';
    if (this.eyeLeft) {
      this.eyeLeft.style.display = 'block';
      this.eyeLeft.style.transform = 'none';
    }
    if (this.eyeRight) {
      this.eyeRight.style.display = 'block';
      this.eyeRight.style.transform = 'none';
    }
    if (this.partBlush) this.partBlush.style.opacity = '0.3';
  }

  setTalking(isTalking) {
    this.isTalking = isTalking;
    if (!this.wrapper || !this.mouthClosed || !this.mouthOpen) return;
    if (isTalking) {
      this.wrapper.classList.add('is-talking');
    } else {
      this.wrapper.classList.remove('is-talking');
      this.mouthOpen.style.display = 'none';
      this.mouthClosed.style.display = 'block';
    }
  }

  playMotion(motion) {
    if (!motion || !this.wrapper) return;
    this.wrapper.classList.remove('motion-nod', 'motion-shake', 'motion-hop', 'motion-tilt');
    void this.wrapper.offsetWidth;
    this.wrapper.classList.add(`motion-${motion}`);

    setTimeout(() => {
      if (this.wrapper) this.wrapper.classList.remove(`motion-${motion}`);
    }, 1200);
  }

  startBlinking() {
    clearTimeout(this.blinkTimer);
    const doBlink = () => {
      if (this.currentExpression !== 'smile' && this.eyeLeft && this.eyeRight) {
        this.eyeLeft.classList.add('blink-active');
        this.eyeRight.classList.add('blink-active');

        setTimeout(() => {
          if (this.eyeLeft && this.eyeRight) {
            this.eyeLeft.classList.remove('blink-active');
            this.eyeRight.classList.remove('blink-active');
          }
        }, 180);
      }

      const nextTime = 2500 + Math.random() * 3200;
      this.blinkTimer = setTimeout(doBlink, nextTime);
    };

    this.blinkTimer = setTimeout(doBlink, 2800);
  }

  setupMouseTracking() {
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      if (this.pupilLeft && this.pupilRight) {
        this.pupilLeft.style.transform = `translate(${deltaX * 3.5}px, ${deltaY * 2.5}px)`;
        this.pupilRight.style.transform = `translate(${deltaX * 3.5}px, ${deltaY * 2.5}px)`;
      }

      if (this.partHead) {
        this.partHead.style.transform = `translate(${deltaX * 3.5}px, 0px) rotate(${deltaX * 1.8}deg)`;
      }
    });
  }
}

window.CharacterController = CharacterController;
