/**
 * CharacterController
 * - Live2Dライクなアニメーション制御（呼吸、自動まばたき、リップシンク、感情アクション、視線追従）
 * - プロトタイプ用SVGキャラクター描画
 */
class CharacterController {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentExpression = 'normal';
    this.isTalking = false;
    this.blinkTimer = null;

    this.render();
    this.bindElements();
    this.startBlinking();
    this.setupMouseTracking();
  }

  /**
   * プロトタイプ用SVGキャラクターのレンダリング
   */
  render() {
    this.container.innerHTML = `
      <div class="live2d-character-wrapper" id="live2dWrapper">
        <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- 髪のグラデーション -->
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ff9a8b" />
              <stop offset="100%" stop-color="#ff6a88" />
            </linearGradient>
            <!-- 肌のグラデーション -->
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fff5eb" />
              <stop offset="100%" stop-color="#fee3d4" />
            </linearGradient>
            <!-- 制服/衣装グラデーション -->
            <linearGradient id="clothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3a405a" />
              <stop offset="100%" stop-color="#242838" />
            </linearGradient>
            <!-- リボン -->
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f24343" />
              <stop offset="100%" stop-color="#c91818" />
            </linearGradient>
          </defs>

          <!-- 背面の髪 (後ろ髪) -->
          <g class="part-back-hair">
            <path d="M 170 230 C 120 300 110 500 130 650 C 160 520 200 450 200 400 Z" fill="url(#hairGrad)"/>
            <path d="M 330 230 C 380 300 390 500 370 650 C 340 520 300 450 300 400 Z" fill="url(#hairGrad)"/>
            <path d="M 160 200 Q 250 160 340 200 C 390 350 390 580 340 680 C 290 620 210 620 160 680 C 110 580 110 350 160 200 Z" fill="url(#hairGrad)" opacity="0.95"/>
          </g>

          <!-- 体・衣装（呼吸モーションで上下・伸縮） -->
          <g class="part-body" id="partBody">
            <!-- 首 -->
            <path d="M 230 310 L 230 370 L 270 370 L 270 310 Z" fill="url(#skinGrad)" />
            <!-- 肩・制服 -->
            <path d="M 170 370 Q 250 350 330 370 L 370 560 L 130 560 Z" fill="url(#clothGrad)" />
            <!-- 襟元（白シャツ） -->
            <polygon points="215,370 285,370 250,440" fill="#ffffff" />
            <polygon points="225,370 275,370 250,410" fill="#f0ede6" />
            <!-- リボンタイ -->
            <polygon points="238,405 262,405 270,440 250,430 230,440" fill="url(#ribbonGrad)" />
            <circle cx="250" cy="405" r="7" fill="#d92525" />
          </g>

          <!-- 頭部・顔（視線や傾き、表情） -->
          <g class="part-head" id="partHead">
            <!-- 輪郭・肌 -->
            <path d="M 180 230 Q 180 330 250 350 Q 320 330 320 230 Q 320 160 250 160 Q 180 160 180 230 Z" fill="url(#skinGrad)" />

            <!-- 頬のチーク（照れ・通常） -->
            <g class="part-blush" id="partBlush">
              <ellipse cx="205" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.4" />
              <ellipse cx="295" cy="275" rx="14" ry="7" fill="#ff7070" opacity="0.4" />
            </g>

            <!-- 眉毛 -->
            <g class="part-eyebrows" id="partEyebrows">
              <path class="eyebrow-left" d="M 195 218 Q 215 212 230 220" stroke="#7a342a" stroke-width="3" stroke-linecap="round" fill="none" />
              <path class="eyebrow-right" d="M 270 220 Q 285 212 305 218" stroke="#7a342a" stroke-width="3" stroke-linecap="round" fill="none" />
            </g>

            <!-- 目（左目・右目）: まばたきと表情 -->
            <g class="part-eyes" id="partEyes">
              <!-- 左目 -->
              <g class="eye eye-left" id="eyeLeft">
                <ellipse class="eye-white" cx="215" cy="245" rx="18" ry="20" fill="#ffffff" />
                <ellipse class="eye-iris" id="pupilLeft" cx="216" cy="245" rx="12" ry="16" fill="#3a6073" />
                <circle class="eye-pupil" cx="216" cy="245" r="6" fill="#1b2e38" />
                <circle class="eye-highlight1" cx="212" cy="238" r="4.5" fill="#ffffff" />
                <circle class="eye-highlight2" cx="221" cy="251" r="2.5" fill="#ffffff" opacity="0.8" />
                <!-- 上まつげ -->
                <path class="eyelash" d="M 195 240 Q 215 220 235 242" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
              </g>

              <!-- 右目 -->
              <g class="eye eye-right" id="eyeRight">
                <ellipse class="eye-white" cx="285" cy="245" rx="18" ry="20" fill="#ffffff" />
                <ellipse class="eye-iris" id="pupilRight" cx="284" cy="245" rx="12" ry="16" fill="#3a6073" />
                <circle class="eye-pupil" cx="284" cy="245" r="6" fill="#1b2e38" />
                <circle class="eye-highlight1" cx="280" cy="238" r="4.5" fill="#ffffff" />
                <circle class="eye-highlight2" cx="289" cy="251" r="2.5" fill="#ffffff" opacity="0.8" />
                <!-- 上まつげ -->
                <path class="eyelash" d="M 265 242 Q 285 220 305 240" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
              </g>

              <!-- 笑顔用・閉じ目（smile表情時用） -->
              <g class="eyes-closed" id="eyesClosed" style="display: none;">
                <path d="M 196 244 Q 215 258 234 244" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
                <path d="M 266 244 Q 285 258 304 244" stroke="#2c1a17" stroke-width="3.5" stroke-linecap="round" fill="none" />
              </g>
            </g>

            <!-- 鼻 -->
            <circle cx="250" cy="265" r="1.5" fill="#d89682" />

            <!-- 口（リップシンク連動） -->
            <g class="part-mouth" id="partMouth">
              <!-- 通常（閉じ口） -->
              <path class="mouth-closed" id="mouthClosed" d="M 242 290 Q 250 293 258 290" stroke="#7a342a" stroke-width="2.5" stroke-linecap="round" fill="none" />
              <!-- 開き口（発話・笑顔） -->
              <path class="mouth-open" id="mouthOpen" d="M 240 288 Q 250 306 260 288 Z" fill="#cf4343" stroke="#7a342a" stroke-width="2" style="display: none;" />
            </g>

            <!-- 前髪・横髪 -->
            <g class="part-front-hair">
              <!-- サイドヘア -->
              <path d="M 180 200 Q 160 300 175 360 Q 185 300 190 250 Z" fill="url(#hairGrad)" />
              <path d="M 320 200 Q 340 300 325 360 Q 315 300 310 250 Z" fill="url(#hairGrad)" />
              <!-- 前髪 -->
              <path d="M 180 180 Q 250 140 320 180 Q 310 230 290 235 Q 270 210 250 240 Q 230 210 210 235 Q 190 230 180 180 Z" fill="url(#hairGrad)" />
              <!-- アホ毛（呼吸・モーションで微細に揺れる） -->
              <path class="hair-ahoge" d="M 250 155 Q 265 110 280 125 Q 260 135 250 155" fill="url(#hairGrad)" />
            </g>
          </g>
        </svg>
      </div>
    `;
  }

  bindElements() {
    this.wrapper = document.getElementById('live2dWrapper');
    this.partHead = document.getElementById('partHead');
    this.partBody = document.getElementById('partBody');
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
   * 表情変更
   * @param {'normal'|'smile'|'surprised'|'shy'} expression
   */
  setExpression(expression) {
    this.currentExpression = expression;
    this.resetExpressionStyle();

    switch (expression) {
      case 'smile':
        this.eyesClosed.style.display = 'block';
        this.eyeLeft.style.display = 'none';
        this.eyeRight.style.display = 'none';
        this.partBlush.style.opacity = '0.7';
        break;

      case 'surprised':
        this.eyeLeft.style.transform = 'scale(1.15)';
        this.eyeRight.style.transform = 'scale(1.15)';
        this.partBlush.style.opacity = '0.1';
        break;

      case 'shy':
        this.partBlush.style.opacity = '0.9';
        break;

      case 'normal':
      default:
        this.partBlush.style.opacity = '0.4';
        break;
    }
  }

  resetExpressionStyle() {
    this.eyesClosed.style.display = 'none';
    this.eyeLeft.style.display = 'block';
    this.eyeRight.style.display = 'block';
    this.eyeLeft.style.transform = 'none';
    this.eyeRight.style.transform = 'none';
    this.partBlush.style.opacity = '0.4';
  }

  /**
   * リップシンク（音声再生に同期した口パク開始/終了）
   */
  setTalking(isTalking) {
    this.isTalking = isTalking;
    if (isTalking) {
      this.wrapper.classList.add('is-talking');
    } else {
      this.wrapper.classList.remove('is-talking');
      this.mouthOpen.style.display = 'none';
      this.mouthClosed.style.display = 'block';
    }
  }

  /**
   * アクションモーション再生
   * @param {'nod'|'shake'|'hop'|'tilt'} motion
   */
  playMotion(motion) {
    if (!motion) return;
    this.wrapper.classList.remove('motion-nod', 'motion-shake', 'motion-hop', 'motion-tilt');
    // リフロー強制でアニメーションを再実行
    void this.wrapper.offsetWidth;
    this.wrapper.classList.add(`motion-${motion}`);

    setTimeout(() => {
      this.wrapper.classList.remove(`motion-${motion}`);
    }, 1200);
  }

  /**
   * 自動まばたき（Live2Dの特徴であるランダム瞬き）
   */
  startBlinking() {
    const doBlink = () => {
      // 笑顔の閉じ目状態のときは瞬きをスキップ
      if (this.currentExpression !== 'smile') {
        this.eyeLeft.classList.add('blink-active');
        this.eyeRight.classList.add('blink-active');

        setTimeout(() => {
          this.eyeLeft.classList.remove('blink-active');
          this.eyeRight.classList.remove('blink-active');
        }, 180);
      }

      // 次の瞬きは2.5〜5.5秒後
      const nextTime = 2500 + Math.random() * 3000;
      this.blinkTimer = setTimeout(doBlink, nextTime);
    };

    this.blinkTimer = setTimeout(doBlink, 3000);
  }

  /**
   * マウス追従（視線・頭部の微細な追従）
   */
  setupMouseTracking() {
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX; // -1.0 ~ 1.0
      const deltaY = (e.clientY - centerY) / centerY; // -1.0 ~ 1.0

      // 瞳の追従
      if (this.pupilLeft && this.pupilRight) {
        const pupilShiftX = deltaX * 3.5;
        const pupilShiftY = deltaY * 2.5;
        this.pupilLeft.style.transform = `translate(${pupilShiftX}px, ${pupilShiftY}px)`;
        this.pupilRight.style.transform = `translate(${pupilShiftX}px, ${pupilShiftY}px)`;
      }

      // 頭部全体の微細な傾き
      if (this.partHead) {
        const headAngle = deltaX * 2.0; // 最大2度
        const headShiftX = deltaX * 4;
        this.partHead.style.transform = `translate(${headShiftX}px, 0px) rotate(${headAngle}deg)`;
      }
    });
  }
}

window.CharacterController = CharacterController;
