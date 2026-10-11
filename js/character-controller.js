/**
 * CharacterController (高品質SVG・完全座標保証版)
 *
 * ブラウザの transform 座標ズレによる崩壊を根絶するため、
 * 表情変更は SVG 内部の専用グループの表示切替 (display) のみで安全に制御。
 *
 * キャラクター一覧:
 * - iris: 相棒・サイバーフォレンジック分析官（ピンク髪・特捜制服）
 * - eve: 被疑AI・家庭用シッターロボット（ミントホログラム少女）
 * - sakuma: 特捜部長・警視（威厳のある年配幹部）
 * - shinohara: 母親・女性社員（心労の母性ボブ）
 * - kirishima: 主任エンジニア（メガネ捜査官）
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

  show(charId, expression = 'normal', motion = null) {
    if (!charId) {
      this.hide();
      return;
    }

    this.container.style.opacity = '1';

    if (this.currentCharacterId !== charId) {
      this.currentCharacterId = charId;
      this.renderCharacter(charId);
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
      case 'sakuma':
        svgContent = this.getSakumaSVG();
        break;
      case 'shinohara':
        svgContent = this.getShinoharaSVG();
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

  /* ========================================================
     キャラクター1: アイリス (IRIS) - 相棒・フォレンジック捜査官
     ======================================================== */
  getIrisSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="irisHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff758c"/><stop offset="60%" stop-color="#ff8da1"/><stop offset="100%" stop-color="#ffa0b4"/>
          </linearGradient>
          <linearGradient id="irisHairShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e65c75"/><stop offset="100%" stop-color="#d64963"/>
          </linearGradient>
          <linearGradient id="irisSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff8f2"/><stop offset="100%" stop-color="#fdece2"/>
          </linearGradient>
          <linearGradient id="irisEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#006699"/><stop offset="50%" stop-color="#00b4d8"/><stop offset="100%" stop-color="#90e0ef"/>
          </linearGradient>
          <linearGradient id="irisSuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>

        <!-- 1. 後ろ髪 -->
        <g class="layer-back-hair">
          <path d="M 130 260 C 100 380 90 560 130 680 C 160 560 190 440 210 380 Z" fill="url(#irisHairShadow)"/>
          <path d="M 370 260 C 400 380 410 560 370 680 C 340 560 310 440 290 380 Z" fill="url(#irisHairShadow)"/>
          <path d="M 140 250 C 100 360 80 540 120 670 C 160 540 180 420 200 360 Z" fill="url(#irisHairGrad)"/>
          <path d="M 360 250 C 400 360 420 540 380 670 C 340 540 320 420 300 360 Z" fill="url(#irisHairGrad)"/>
          <path d="M 170 220 C 120 340 150 560 180 640 C 230 660 270 660 320 640 C 350 560 380 340 330 220 Z" fill="url(#irisHairGrad)"/>
        </g>

        <!-- 2. 体・特捜制服 -->
        <g class="layer-body" id="partBody">
          <path d="M 232 300 L 232 370 L 268 370 L 268 300 Z" fill="url(#irisSkinGrad)"/>
          <path d="M 232 300 Q 250 325 268 300 L 268 320 Q 250 340 232 320 Z" fill="#fbcfe8" opacity="0.6"/>
          <polygon points="220,360 280,360 250,420" fill="#ffffff"/>
          <polygon points="244,375 256,375 260,460 250,475 240,460" fill="#00f3ff"/>
          <path d="M 160 365 Q 250 345 340 365 L 390 580 L 110 580 Z" fill="url(#irisSuitGrad)"/>
          <path d="M 195 365 L 230 460 L 250 460 L 270 460 L 305 365" stroke="#334155" stroke-width="3" fill="none"/>
          <polygon points="180,410 195,400 200,420 185,430" fill="#00f3ff"/>
          <circle cx="192" cy="415" r="3" fill="#ffffff"/>
        </g>

        <!-- 3. 頭部・顔パーツ (中心 x=250) -->
        <g class="layer-head" id="partHead">
          <path d="M 175 210 C 175 320 215 360 250 360 C 285 360 325 320 325 210 C 325 150 175 150 175 210 Z" fill="url(#irisSkinGrad)"/>
          <!-- 通信インカム -->
          <rect x="162" y="235" width="10" height="28" rx="4" fill="#00f3ff"/>
          <circle cx="167" cy="249" r="2.5" fill="#ffffff"/>
          <!-- チーク -->
          <g id="partBlush"><ellipse cx="205" cy="285" rx="14" ry="7" fill="#ff70a0" opacity="0.45"/><ellipse cx="295" cy="285" rx="14" ry="7" fill="#ff70a0" opacity="0.45"/></g>
          <!-- 鼻 -->
          <circle cx="250" cy="275" r="1.5" fill="#f472b6"/>
          <!-- 眉毛 -->
          <path d="M 195 215 Q 212 206 228 215" stroke="#e11d48" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M 272 215 Q 288 206 305 215" stroke="#e11d48" stroke-width="3" stroke-linecap="round" fill="none"/>

          <!-- 表情A: 通常目 (eyesNormal) -->
          <g id="eyesNormal">
            <g class="eye-left">
              <ellipse cx="212" cy="245" rx="20" ry="22" fill="#ffffff"/>
              <ellipse cx="213" cy="246" rx="14" ry="18" fill="url(#irisEyeGrad)"/>
              <circle cx="213" cy="245" r="6" fill="#032830"/>
              <circle cx="208" cy="238" r="4.5" fill="#ffffff"/>
              <circle cx="218" cy="254" r="2.5" fill="#ffffff" opacity="0.8"/>
              <path d="M 190 240 Q 212 218 234 240" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
              <path d="M 230 236 L 236 230" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M 200 258 Q 212 264 224 258" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            </g>
            <g class="eye-right">
              <ellipse cx="288" cy="245" rx="20" ry="22" fill="#ffffff"/>
              <ellipse cx="287" cy="246" rx="14" ry="18" fill="url(#irisEyeGrad)"/>
              <circle cx="287" cy="245" r="6" fill="#032830"/>
              <circle cx="283" cy="238" r="4.5" fill="#ffffff"/>
              <circle cx="293" cy="254" r="2.5" fill="#ffffff" opacity="0.8"/>
              <path d="M 266 240 Q 288 218 310 240" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
              <path d="M 270 236 L 264 230" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M 276 258 Q 288 264 300 258" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            </g>
          </g>

          <!-- 表情B: 笑顔目 (eyesSmile) -->
          <g id="eyesSmile" style="display: none;">
            <path d="M 192 245 Q 212 262 232 245" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
            <path d="M 268 245 Q 288 262 308 245" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
          </g>

          <!-- 表情C: 驚き見開き目 (eyesShocked) -->
          <g id="eyesShocked" style="display: none;">
            <ellipse cx="212" cy="243" rx="23" ry="25" fill="#ffffff"/>
            <ellipse cx="213" cy="244" rx="13" ry="16" fill="url(#irisEyeGrad)"/>
            <circle cx="213" cy="244" r="5" fill="#032830"/>
            <circle cx="207" cy="236" r="5" fill="#ffffff"/>
            <circle cx="219" cy="251" r="3" fill="#ffffff"/>
            <path d="M 188 238 Q 212 214 236 238" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>

            <ellipse cx="288" cy="243" rx="23" ry="25" fill="#ffffff"/>
            <ellipse cx="287" cy="244" rx="13" ry="16" fill="url(#irisEyeGrad)"/>
            <circle cx="287" cy="244" r="5" fill="#032830"/>
            <circle cx="283" cy="236" r="5" fill="#ffffff"/>
            <circle cx="293" cy="251" r="3" fill="#ffffff"/>
            <path d="M 264 238 Q 288 214 312 238" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
          </g>

          <!-- 口パーツ -->
          <g class="mouth-group">
            <path id="mouthClosed" d="M 242 302 Q 250 306 258 302" stroke="#be123c" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path id="mouthOpen" d="M 241 300 Q 250 318 259 300 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2" style="display: none;"/>
          </g>

          <!-- 冷や汗 -->
          <path id="sweatDrop" d="M 315 220 C 325 235 320 250 310 248 C 302 245 306 230 315 220 Z" fill="#38bdf8" opacity="0.9" style="display: none;"/>

          <!-- 4. 前髪 -->
          <g class="front-hair">
            <path d="M 175 190 Q 155 280 168 340 Q 178 290 185 240 Z" fill="url(#irisHairGrad)"/>
            <path d="M 325 190 Q 345 280 332 340 Q 322 290 315 240 Z" fill="url(#irisHairGrad)"/>
            <path d="M 170 170 Q 250 130 330 170 Q 315 225 295 230 Q 275 200 255 235 Q 235 200 215 230 Q 195 225 170 170 Z" fill="url(#irisHairGrad)"/>
            <path d="M 195 180 Q 250 155 305 180" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5"/>
            <path class="hair-ahoge" d="M 250 145 Q 268 95 285 110 Q 265 125 250 145" fill="url(#irisHairGrad)"/>
          </g>
        </g>
      </svg>
    `;
  }

  /* ========================================================
     キャラクター2: イブ (EVE) - 家庭用ケア・シッターロボット
     ======================================================== */
  getEveSVG() {
    return `
      <svg class="character-svg holo-character" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eveHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#bbf7d0"/><stop offset="50%" stop-color="#5eead4"/><stop offset="100%" stop-color="#14b8a6"/>
          </linearGradient>
          <linearGradient id="eveSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="eveEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f766e"/><stop offset="60%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#a7f3d0"/>
          </linearGradient>
          <linearGradient id="eveApronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f1f5f9"/>
          </linearGradient>
          <linearGradient id="eveDressUnderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0d9488"/><stop offset="100%" stop-color="#115e59"/>
          </linearGradient>
        </defs>

        <!-- 1. 後ろ髪 (柔らかいミントグリーンのツインテール) -->
        <g class="layer-back-hair" opacity="0.9">
          <path d="M 140 230 C 80 360 70 580 110 710 C 150 560 180 440 200 370 Z" fill="url(#eveHairGrad)"/>
          <path d="M 360 230 C 420 360 430 580 390 710 C 350 560 320 440 300 370 Z" fill="url(#eveHairGrad)"/>
          <path d="M 160 210 C 120 340 140 560 170 650 C 220 670 280 670 330 650 C 360 560 380 340 340 210 Z" fill="url(#eveHairGrad)" opacity="0.65"/>
        </g>

        <!-- 2. 体・家庭用シッターロボットユニフォーム（エプロンドレス） -->
        <g class="layer-body" id="partBody">
          <!-- ロボット首部（関節シリンダー＆接続ポート） -->
          <path d="M 234 300 L 234 365 L 266 365 L 266 300 Z" fill="url(#eveSkinGrad)"/>
          <rect x="236" y="325" width="28" height="4" rx="2" fill="#94a3b8"/>
          <rect x="238" y="335" width="24" height="3" rx="1.5" fill="#2dd4bf" opacity="0.8"/>
          <!-- 首の型番刻印 -->
          <rect x="242" y="345" width="16" height="5" rx="1" fill="#cbd5e1"/>

          <!-- インナードレス -->
          <path d="M 165 365 Q 250 345 335 365 L 375 600 L 125 600 Z" fill="url(#eveDressUnderGrad)"/>

          <!-- 肩の球体関節（ロボットショルダー） -->
          <circle cx="150" cy="385" r="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="150" cy="385" r="7" fill="#2dd4bf" opacity="0.6"/>
          <circle cx="350" cy="385" r="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="350" cy="385" r="7" fill="#2dd4bf" opacity="0.6"/>

          <!-- ホワイトケアエプロン -->
          <path d="M 195 365 L 305 365 L 330 600 L 170 600 Z" fill="url(#eveApronGrad)" stroke="#cbd5e1" stroke-width="1.5"/>
          <path d="M 195 365 L 210 460 L 290 460 L 305 365" stroke="#2dd4bf" stroke-width="2.5" fill="none"/>

          <!-- エプロン胸元のケアバッジ（ホームケアAIエンブレム） -->
          <circle cx="250" cy="415" r="18" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
          <circle cx="250" cy="415" r="12" fill="#ccfbf1"/>
          <!-- ハートケアマーク -->
          <path d="M 246 412 C 246 408 250 408 250 411 C 250 408 254 408 254 412 C 254 416 250 419 250 421 C 250 419 246 416 246 412 Z" fill="#0d9488"/>

          <!-- エプロンのお世話ツールポケット -->
          <rect x="215" y="490" width="70" height="45" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="215" y1="500" x2="285" y2="500" stroke="#2dd4bf" stroke-width="2"/>
        </g>

        <!-- 3. 頭部・顔パーツ (中心 x=250) -->
        <g class="layer-head" id="partHead">
          <!-- ロボットカチューシャ（ヘッドインターフェース） -->
          <path d="M 165 210 Q 250 145 335 210" stroke="#f8fafc" stroke-width="9" stroke-linecap="round" fill="none"/>
          <path d="M 165 210 Q 250 145 335 210" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" fill="none"/>

          <!-- 左右の耳型オーディオセンサーユニット（家庭用ロボットイヤーポッド） -->
          <g class="ear-pod-left">
            <rect x="150" y="225" width="16" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
            <circle cx="158" cy="244" r="5" fill="#2dd4bf"/>
            <circle cx="158" cy="244" r="2.5" fill="#ffffff"/>
          </g>
          <g class="ear-pod-right">
            <rect x="334" y="225" width="16" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
            <circle cx="342" cy="244" r="5" fill="#2dd4bf"/>
            <circle cx="342" cy="244" r="2.5" fill="#ffffff"/>
          </g>

          <!-- 輪郭（陶器のような白く滑らかなアンドロイド肌） -->
          <path d="M 175 210 C 175 320 215 360 250 360 C 285 360 325 320 325 210 C 325 150 175 150 175 210 Z" fill="url(#eveSkinGrad)"/>

          <!-- 頬のロボットジョイント・スリットライン -->
          <path d="M 185 270 Q 188 285 195 295" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
          <path d="M 315 270 Q 312 285 305 295" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>

          <!-- チークLED（温かな淡いミントピンクのステータス発光） -->
          <g id="partBlush">
            <ellipse cx="205" cy="285" rx="14" ry="7" fill="#f43f5e" opacity="0.25"/>
            <ellipse cx="295" cy="285" rx="14" ry="7" fill="#f43f5e" opacity="0.25"/>
          </g>

          <!-- 鼻 -->
          <circle cx="250" cy="275" r="1.5" fill="#14b8a6"/>

          <!-- 眉毛 -->
          <path d="M 195 216 Q 212 210 228 216" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <path d="M 272 216 Q 288 210 305 216" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round" fill="none"/>

          <!-- 表情A: 通常目（デジタルグラスアイ） (eyesNormal) -->
          <g id="eyesNormal">
            <g class="eye-left">
              <ellipse cx="212" cy="245" rx="20" ry="22" fill="#ffffff"/>
              <!-- デジタル光彩サークル -->
              <ellipse cx="213" cy="246" rx="14" ry="18" fill="url(#eveEyeGrad)"/>
              <ellipse cx="213" cy="246" rx="11" ry="14" fill="none" stroke="#5eead4" stroke-width="1" stroke-dasharray="3,2"/>
              <circle cx="213" cy="245" r="6" fill="#042f2e"/>
              <circle cx="208" cy="238" r="4.5" fill="#ffffff"/>
              <circle cx="218" cy="254" r="2.5" fill="#ccfbf1" opacity="0.9"/>
              <path d="M 190 240 Q 212 220 234 240" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </g>
            <g class="eye-right">
              <ellipse cx="288" cy="245" rx="20" ry="22" fill="#ffffff"/>
              <!-- デジタル光彩サークル -->
              <ellipse cx="287" cy="246" rx="14" ry="18" fill="url(#eveEyeGrad)"/>
              <ellipse cx="287" cy="246" rx="11" ry="14" fill="none" stroke="#5eead4" stroke-width="1" stroke-dasharray="3,2"/>
              <circle cx="287" cy="245" r="6" fill="#042f2e"/>
              <circle cx="283" cy="238" r="4.5" fill="#ffffff"/>
              <circle cx="293" cy="254" r="2.5" fill="#ccfbf1" opacity="0.9"/>
              <path d="M 266 240 Q 288 220 310 240" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </g>
          </g>

          <!-- 表情B: 笑顔目 (eyesSmile) -->
          <g id="eyesSmile" style="display: none;">
            <path d="M 192 245 Q 212 260 232 245" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 268 245 Q 288 260 308 245" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          </g>

          <!-- 表情C: 驚き目 (eyesShocked) -->
          <g id="eyesShocked" style="display: none;">
            <ellipse cx="212" cy="243" rx="23" ry="25" fill="#ffffff"/>
            <ellipse cx="213" cy="244" rx="13" ry="16" fill="url(#eveEyeGrad)"/>
            <circle cx="213" cy="244" r="5" fill="#042f2e"/>
            <circle cx="207" cy="236" r="5" fill="#ffffff"/>
            <path d="M 188 238 Q 212 214 236 238" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>

            <ellipse cx="288" cy="243" rx="23" ry="25" fill="#ffffff"/>
            <ellipse cx="287" cy="244" rx="13" ry="16" fill="url(#eveEyeGrad)"/>
            <circle cx="287" cy="244" r="5" fill="#042f2e"/>
            <circle cx="283" cy="236" r="5" fill="#ffffff"/>
            <path d="M 264 238 Q 288 214 312 238" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          </g>

          <!-- 口パーツ -->
          <g class="mouth-group">
            <path id="mouthClosed" d="M 242 302 Q 250 305 258 302" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path id="mouthOpen" d="M 241 300 Q 250 316 259 300 Z" fill="#14b8a6" stroke="#0f766e" stroke-width="2" style="display: none;"/>
          </g>

          <path id="sweatDrop" d="M 315 220 C 325 235 320 250 310 248 C 302 245 306 230 315 220 Z" fill="#2dd4bf" opacity="0.9" style="display: none;"/>

          <!-- 4. 前髪 -->
          <g class="front-hair">
            <path d="M 175 185 Q 155 275 165 340 Q 175 285 185 235 Z" fill="url(#eveHairGrad)"/>
            <path d="M 325 185 Q 345 275 335 340 Q 325 285 315 235 Z" fill="url(#eveHairGrad)"/>
            <path d="M 170 165 Q 250 130 330 165 Q 310 220 290 230 Q 270 200 250 232 Q 230 200 210 230 Q 190 220 170 165 Z" fill="url(#eveHairGrad)"/>
          </g>
        </g>
      </svg>
    `;
  }

  /* ========================================================
     キャラクター3: サクマ警視 (SAKUMA) - 特捜部長・年配幹部
     ======================================================== */
  getSakumaSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sakumaHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="sakumaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/><stop offset="100%" stop-color="#fba86b"/>
          </linearGradient>
          <linearGradient id="sakumaSuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>

        <g class="layer-body" id="partBody">
          <path d="M 220 305 L 220 370 L 280 370 L 280 305 Z" fill="url(#sakumaSkinGrad)"/>
          <path d="M 140 370 Q 250 340 360 370 L 415 600 L 85 600 Z" fill="url(#sakumaSuitGrad)"/>
          <polygon points="200,370 300,370 250,470" fill="#f8fafc"/>
          <polygon points="240,380 260,380 266,510 250,530 234,510" fill="#dc2626"/>
          <!-- 警察庁 旭日章ピンバッジ -->
          <circle cx="170" cy="410" r="9" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
          <polygon points="170,404 172,408 176,408 173,411 174,415 170,412 166,415 167,411 164,408 168,408" fill="#ffffff"/>
        </g>

        <g class="layer-head" id="partHead">
          <path d="M 175 210 C 175 320 215 360 250 360 C 285 360 325 320 325 210 C 325 140 175 140 175 210 Z" fill="url(#sakumaSkinGrad)"/>
          <!-- 威厳あるシワ・ほうれい線 -->
          <path d="M 215 285 Q 210 305 218 325" stroke="#ea580c" stroke-width="2.5" fill="none" opacity="0.4"/>
          <path d="M 285 285 Q 290 305 282 325" stroke="#ea580c" stroke-width="2.5" fill="none" opacity="0.4"/>
          <!-- 鼻筋 -->
          <path d="M 246 265 L 254 270 L 246 278" stroke="#c2410c" stroke-width="3" fill="none"/>

          <!-- 威圧的な太眉 -->
          <path d="M 195 210 L 235 222" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
          <path d="M 265 222 L 305 210" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>

          <!-- 表情A: 鋭い眼光 (eyesNormal) -->
          <g id="eyesNormal">
            <g class="eye-left">
              <ellipse cx="215" cy="242" rx="17" ry="13" fill="#ffffff"/>
              <ellipse cx="215" cy="242" rx="8" ry="10" fill="#0f172a"/>
              <circle cx="213" cy="239" r="2.5" fill="#ffffff"/>
              <path d="M 197 236 L 233 241" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <g class="eye-right">
              <ellipse cx="285" cy="242" rx="17" ry="13" fill="#ffffff"/>
              <ellipse cx="285" cy="242" rx="8" ry="10" fill="#0f172a"/>
              <circle cx="283" cy="239" r="2.5" fill="#ffffff"/>
              <path d="M 267 241 L 303 236" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
            </g>
          </g>

          <g id="eyesSmile" style="display: none;">
            <line x1="198" y1="242" x2="232" y2="242" stroke="#0f172a" stroke-width="4"/>
            <line x1="268" y1="242" x2="302" y2="242" stroke="#0f172a" stroke-width="4"/>
          </g>

          <g id="eyesShocked" style="display: none;">
            <ellipse cx="215" cy="240" rx="19" ry="16" fill="#ffffff"/>
            <circle cx="215" cy="240" r="7" fill="#0f172a"/>
            <ellipse cx="285" cy="240" rx="19" ry="16" fill="#ffffff"/>
            <circle cx="285" cy="240" r="7" fill="#0f172a"/>
          </g>

          <g class="mouth-group">
            <path id="mouthClosed" d="M 235 304 Q 250 296 265 304" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path id="mouthOpen" d="M 232 300 Q 250 326 268 300 Z" fill="#991b1b" stroke="#450a0a" stroke-width="2.5" style="display: none;"/>
          </g>

          <path id="sweatDrop" d="M 315 220 C 325 235 320 250 310 248 C 302 245 306 230 315 220 Z" fill="#38bdf8" style="display: none;"/>

          <!-- 白髪交じりのオールバック -->
          <g class="front-hair">
            <path d="M 175 190 Q 165 110 250 110 Q 335 110 325 190 Q 315 150 280 155 Q 250 135 220 155 Q 185 150 175 190 Z" fill="url(#sakumaHairGrad)"/>
          </g>
        </g>
      </svg>
    `;
  }

  /* ========================================================
     キャラクター4: シノハラ (SHINOHARA) - 母親・女性社員
     ======================================================== */
  getShinoharaSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shinoHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="shinoSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#fed7aa"/>
          </linearGradient>
          <linearGradient id="shinoBlouseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
        </defs>

        <g class="layer-back-hair">
          <path d="M 160 220 C 130 320 130 460 165 530 C 200 450 210 400 210 350 Z" fill="url(#shinoHairGrad)"/>
          <path d="M 340 220 C 370 320 370 460 335 530 C 300 450 290 400 290 350 Z" fill="url(#shinoHairGrad)"/>
        </g>

        <g class="layer-body" id="partBody">
          <path d="M 230 300 L 230 370 L 270 370 L 270 300 Z" fill="url(#shinoSkinGrad)"/>
          <path d="M 165 370 Q 250 355 335 370 L 375 580 L 125 580 Z" fill="url(#shinoBlouseGrad)"/>
          <!-- 青いペンダント (家族の形見) -->
          <line x1="250" y1="370" x2="250" y2="430" stroke="#94a3b8" stroke-width="2"/>
          <polygon points="244,430 256,430 250,442" fill="#0284c7"/>
        </g>

        <g class="layer-head" id="partHead">
          <path d="M 175 210 C 175 320 215 360 250 360 C 285 360 325 320 325 210 C 325 150 175 150 175 210 Z" fill="url(#shinoSkinGrad)"/>
          <g id="partBlush"><ellipse cx="205" cy="285" rx="14" ry="7" fill="#f43f5e" opacity="0.3"/><ellipse cx="295" cy="285" rx="14" ry="7" fill="#f43f5e" opacity="0.3"/></g>
          <circle cx="250" cy="275" r="1.5" fill="#ea580c"/>

          <!-- 困り眉 (娘を心配する母の眉) -->
          <path d="M 195 214 Q 215 224 230 218" stroke="#334155" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M 270 218 Q 285 224 305 214" stroke="#334155" stroke-width="3" stroke-linecap="round" fill="none"/>

          <g id="eyesNormal">
            <g class="eye-left">
              <ellipse cx="212" cy="245" rx="18" ry="19" fill="#ffffff"/>
              <ellipse cx="213" cy="246" rx="11" ry="14" fill="#3b82f6"/>
              <circle cx="213" cy="245" r="5" fill="#1e3a8a"/>
              <circle cx="209" cy="240" r="4" fill="#ffffff"/>
              <path d="M 194 242 Q 212 226 230 244" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </g>
            <g class="eye-right">
              <ellipse cx="288" cy="245" rx="18" ry="19" fill="#ffffff"/>
              <ellipse cx="287" cy="246" rx="11" ry="14" fill="#3b82f6"/>
              <circle cx="287" cy="245" r="5" fill="#1e3a8a"/>
              <circle cx="283" cy="240" r="4" fill="#ffffff"/>
              <path d="M 270 244 Q 288 226 306 242" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </g>
          </g>

          <g id="eyesSmile" style="display: none;">
            <path d="M 194 246 Q 212 260 230 246" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            <path d="M 270 246 Q 288 260 306 246" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          </g>

          <g id="eyesShocked" style="display: none;">
            <ellipse cx="212" cy="242" rx="20" ry="22" fill="#ffffff"/>
            <ellipse cx="213" cy="243" rx="10" ry="13" fill="#3b82f6"/>
            <ellipse cx="288" cy="242" rx="20" ry="22" fill="#ffffff"/>
            <ellipse cx="287" cy="243" rx="10" ry="13" fill="#3b82f6"/>
          </g>

          <g class="mouth-group">
            <path id="mouthClosed" d="M 242 302 Q 250 298 258 302" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path id="mouthOpen" d="M 240 298 Q 250 314 260 298 Z" fill="#ef4444" stroke="#9a3412" stroke-width="2" style="display: none;"/>
          </g>

          <path id="sweatDrop" d="M 315 220 C 325 235 320 250 310 248 C 302 245 306 230 315 220 Z" fill="#38bdf8" style="display: none;"/>

          <g class="front-hair">
            <path d="M 175 190 Q 155 290 170 340 Q 180 290 185 240 Z" fill="url(#shinoHairGrad)"/>
            <path d="M 325 190 Q 345 290 330 340 Q 320 290 315 240 Z" fill="url(#shinoHairGrad)"/>
            <path d="M 175 170 Q 250 140 325 170 Q 310 220 285 225 Q 260 210 245 235 Q 230 210 210 225 Q 190 220 175 170 Z" fill="url(#shinoHairGrad)"/>
          </g>
        </g>
      </svg>
    `;
  }

  /* ========================================================
     キャラクター5: キリシマ (KIRISHIMA) - 主任エンジニア
     ======================================================== */
  getKirishimaSVG() {
    return `
      <svg class="character-svg" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kiriHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#374151"/><stop offset="100%" stop-color="#1f2937"/>
          </linearGradient>
          <linearGradient id="kiriSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff1e6"/><stop offset="100%" stop-color="#fcd5ce"/>
          </linearGradient>
          <linearGradient id="kiriSuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>

        <g class="layer-body" id="partBody">
          <path d="M 225 300 L 225 365 L 275 365 L 275 300 Z" fill="url(#kiriSkinGrad)"/>
          <path d="M 155 365 Q 250 340 345 365 L 390 580 L 110 580 Z" fill="url(#kiriSuitGrad)"/>
          <polygon points="210,365 290,365 250,450" fill="#f8fafc"/>
          <polygon points="243,380 257,380 262,490 250,510 238,490" fill="#0284c7"/>
        </g>

        <g class="layer-head" id="partHead">
          <path d="M 175 210 C 175 320 215 355 250 355 C 285 355 325 320 325 210 C 325 150 175 150 175 210 Z" fill="url(#kiriSkinGrad)"/>
          <circle cx="250" cy="275" r="1.5" fill="#ea580c"/>

          <!-- 眉毛 -->
          <path d="M 195 212 L 232 218" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
          <path d="M 268 218 L 305 212" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>

          <g id="eyesNormal">
            <g class="eye-left">
              <ellipse cx="215" cy="240" rx="16" ry="14" fill="#ffffff"/>
              <ellipse cx="215" cy="240" rx="10" ry="12" fill="#4b5563"/>
              <circle cx="215" cy="240" r="5" fill="#111827"/>
              <circle cx="212" cy="236" r="3.5" fill="#ffffff"/>
            </g>
            <g class="eye-right">
              <ellipse cx="285" cy="240" rx="16" ry="14" fill="#ffffff"/>
              <ellipse cx="285" cy="240" rx="10" ry="12" fill="#4b5563"/>
              <circle cx="285" cy="240" r="5" fill="#111827"/>
              <circle cx="282" cy="236" r="3.5" fill="#ffffff"/>
            </g>
          </g>

          <g id="eyesSmile" style="display: none;">
            <line x1="198" y1="240" x2="232" y2="240" stroke="#111827" stroke-width="3.5"/>
            <line x1="268" y1="240" x2="302" y2="240" stroke="#111827" stroke-width="3.5"/>
          </g>

          <g id="eyesShocked" style="display: none;">
            <ellipse cx="215" cy="238" rx="18" ry="16" fill="#ffffff"/>
            <circle cx="215" cy="238" r="7" fill="#111827"/>
            <ellipse cx="285" cy="238" rx="18" ry="16" fill="#ffffff"/>
            <circle cx="285" cy="238" r="7" fill="#111827"/>
          </g>

          <!-- 銀縁メガネ (左右対称) -->
          <rect x="190" y="226" width="50" height="28" rx="4" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
          <rect x="260" y="226" width="50" height="28" rx="4" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
          <line x1="240" y1="238" x2="260" y2="238" stroke="#94a3b8" stroke-width="2.5"/>

          <g class="mouth-group">
            <path id="mouthClosed" d="M 238 296 L 262 296" stroke="#4b5563" stroke-width="3" stroke-linecap="round"/>
            <path id="mouthOpen" d="M 236 294 Q 250 310 264 294 Z" fill="#b91c1c" stroke="#4b5563" stroke-width="2" style="display: none;"/>
          </g>

          <g class="front-hair">
            <path d="M 170 210 Q 160 140 250 140 Q 340 140 330 210 Q 320 180 300 185 Q 270 190 250 170 Q 230 190 200 185 Q 180 180 170 210 Z" fill="url(#kiriHairGrad)"/>
          </g>
        </g>
      </svg>
    `;
  }

  /* ========================================================
     表情制御 (display切替による100%安全制御)
     ======================================================== */
  setExpression(expression) {
    this.currentExpression = expression;
    this.resetExpressionStyle();

    const eyesNormal = this.container.querySelector('#eyesNormal');
    const eyesSmile = this.container.querySelector('#eyesSmile');
    const eyesShocked = this.container.querySelector('#eyesShocked');
    const sweatDrop = this.container.querySelector('#sweatDrop');
    const blush = this.container.querySelector('#partBlush');

    switch (expression) {
      case 'smile':
        if (eyesNormal && eyesSmile) {
          eyesNormal.style.display = 'none';
          eyesSmile.style.display = 'block';
        }
        if (blush) blush.style.opacity = '0.7';
        break;

      case 'shocked':
      case 'surprised':
        if (eyesNormal && eyesShocked) {
          eyesNormal.style.display = 'none';
          eyesShocked.style.display = 'block';
        }
        if (sweatDrop) sweatDrop.style.display = 'block';
        break;

      case 'worried':
      case 'sad':
        if (sweatDrop) sweatDrop.style.display = 'block';
        break;

      case 'angry':
      case 'serious':
      case 'normal':
      default:
        // eyesNormal shows by default
        break;
    }
  }

  resetExpressionStyle() {
    const eyesNormal = this.container.querySelector('#eyesNormal');
    const eyesSmile = this.container.querySelector('#eyesSmile');
    const eyesShocked = this.container.querySelector('#eyesShocked');
    const sweatDrop = this.container.querySelector('#sweatDrop');
    const blush = this.container.querySelector('#partBlush');

    if (eyesNormal) eyesNormal.style.display = 'block';
    if (eyesSmile) eyesSmile.style.display = 'none';
    if (eyesShocked) eyesShocked.style.display = 'none';
    if (sweatDrop) sweatDrop.style.display = 'none';
    if (blush) blush.style.opacity = '0.35';
  }

  /* ========================================================
     リップシンク (音声連動口パク)
     ======================================================== */
  setTalking(isTalking) {
    this.isTalking = isTalking;
    const wrapper = this.container.querySelector('#live2dWrapper');
    const mouthClosed = this.container.querySelector('#mouthClosed');
    const mouthOpen = this.container.querySelector('#mouthOpen');

    if (!wrapper || !mouthClosed || !mouthOpen) return;

    if (isTalking) {
      wrapper.classList.add('is-talking');
    } else {
      wrapper.classList.remove('is-talking');
      mouthOpen.style.display = 'none';
      mouthClosed.style.display = 'block';
    }
  }

  /* ========================================================
     モーション (アクションアニメーション)
     ======================================================== */
  playMotion(motion) {
    const wrapper = this.container.querySelector('#live2dWrapper');
    if (!motion || !wrapper) return;

    wrapper.classList.remove('motion-nod', 'motion-shake', 'motion-hop', 'motion-tilt', 'motion-desk-slam');
    void wrapper.offsetWidth;
    wrapper.classList.add(`motion-${motion}`);

    setTimeout(() => {
      if (wrapper) wrapper.classList.remove(`motion-${motion}`);
    }, 1200);
  }

  /* ========================================================
     自動まばたき (瞬き時のパーツ切り替え)
     ======================================================== */
  startBlinking() {
    clearTimeout(this.blinkTimer);
    const doBlink = () => {
      const eyesNormal = this.container.querySelector('#eyesNormal');
      const eyesSmile = this.container.querySelector('#eyesSmile');

      if (this.currentExpression === 'normal' && eyesNormal && eyesSmile) {
        eyesNormal.style.display = 'none';
        eyesSmile.style.display = 'block';

        setTimeout(() => {
          if (this.currentExpression === 'normal' && eyesNormal && eyesSmile) {
            eyesNormal.style.display = 'block';
            eyesSmile.style.display = 'none';
          }
        }, 150);
      }

      const nextTime = 2600 + Math.random() * 3000;
      this.blinkTimer = setTimeout(doBlink, nextTime);
    };

    this.blinkTimer = setTimeout(doBlink, 2500);
  }

  /* ========================================================
     マウストラッキング (安全な微細チルト)
     ======================================================== */
  setupMouseTracking() {
    window.addEventListener('mousemove', (e) => {
      const partHead = this.container.querySelector('#partHead');
      if (!partHead) return;

      const centerX = window.innerWidth / 2;
      const deltaX = (e.clientX - centerX) / centerX;

      // 崩壊を防ぐため、頭部全体をごく自然に 1.2度 傾けるのみにする
      partHead.style.transformOrigin = '250px 320px';
      partHead.style.transform = `rotate(${deltaX * 1.5}deg)`;
    });
  }
}

window.CharacterController = CharacterController;
