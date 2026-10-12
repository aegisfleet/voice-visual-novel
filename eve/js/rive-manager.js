/**
 * RiveManager - Riveランタイム連携 ＆ サイバーHUDアニメーションエンジン
 *
 * モバイル最適化:
 * - @rive-app/canvas ランタイム対応
 * - Riveステートマシン入力制御（trigger, boolean, number）
 * - プロシージャル・サイバーHUDスキャナー（Rive未ロード時も即座に近未来アニメーションを提供）
 */

class RiveManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.riveInstance = null;
    this.isRiveLoaded = false;
    this.stateMachineInputs = new Map();

    // サイバーHUDアニメーション状態
    this.hudParams = {
      angle: 0,
      pulse: 0,
      activeScanner: true,
      analysisProgress: 0.75,
      alertLevel: 'normal', // 'normal', 'warning', 'critical'
    };

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.isRunning = true;
    this.animateHUD = this.animateHUD.bind(this);
    requestAnimationFrame(this.animateHUD);
  }

  handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 120;
    const h = rect.height || 120;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * 外部 .riv ファイルのロード (Rive Web Runtime)
   */
  async loadRiveFile(srcUrl, artboardName = null, stateMachineName = 'State Machine 1') {
    if (typeof rive === 'undefined') {
      console.warn('[RiveManager] @rive-app/canvas runtime is not loaded.');
      return false;
    }

    try {
      if (this.riveInstance) {
        this.riveInstance.cleanup();
      }

      return new Promise((resolve) => {
        this.riveInstance = new rive.Rive({
          src: srcUrl,
          canvas: this.canvas,
          artboard: artboardName,
          stateMachines: stateMachineName,
          autoplay: true,
          onLoad: () => {
            this.isRiveLoaded = true;
            // ステートマシン入力のキャッシュ
            const inputs = this.riveInstance.stateMachineInputs(stateMachineName);
            if (inputs) {
              inputs.forEach((input) => {
                this.stateMachineInputs.set(input.name, input);
              });
            }
            console.log('[RiveManager] Loaded Rive file successfully:', srcUrl);
            resolve(true);
          },
          onError: (err) => {
            console.warn('[RiveManager] Rive load failed, fallback to Procedural HUD:', err);
            this.isRiveLoaded = false;
            resolve(false);
          },
        });
      });
    } catch (e) {
      console.warn('[RiveManager] Error initializing Rive:', e);
      this.isRiveLoaded = false;
      return false;
    }
  }

  /**
   * Riveステートマシンのトリガー発火
   */
  fireTrigger(name) {
    if (!this.isRiveLoaded) return;
    const input = this.stateMachineInputs.get(name);
    if (input && typeof input.fire === 'function') {
      input.fire();
    }
  }

  /**
   * Riveブーリアン値の変更
   */
  setBool(name, value) {
    if (!this.isRiveLoaded) return;
    const input = this.stateMachineInputs.get(name);
    if (input) {
      input.value = Boolean(value);
    }
  }

  /**
   * サイバーHUDスキャナーのアニメーション描画 (Rive非同期時およびHUD常時稼働)
   */
  animateHUD() {
    if (!this.isRunning) return;

    if (!this.isRiveLoaded && this.ctx && this.canvas) {
      const ctx = this.ctx;
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || 120;
      const h = rect.height || 120;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 8;

      ctx.clearRect(0, 0, w, h);

      this.hudParams.angle += 0.025;
      this.hudParams.pulse += 0.05;

      const alertColors = {
        critical: '#ff0055',
        warning: '#f59e0b',
      };
      const mainColor = alertColors[this.hudParams.alertLevel] || '#00f3ff';

      // 外周リング
      ctx.save();
      ctx.translate(cx, cy);

      // 外周回転サークル
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4 + Math.sin(this.hudParams.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // 回転スキャンアーク1
      ctx.rotate(this.hudParams.angle);
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 0.6);
      ctx.stroke();

      // 回転スキャンアーク2 (逆回転)
      ctx.rotate(-this.hudParams.angle * 2);
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, Math.PI * 0.9);
      ctx.stroke();

      // 内側パルスノード
      ctx.rotate(this.hudParams.angle * 0.5);
      const innerR = r * 0.35 + Math.sin(this.hudParams.pulse * 1.5) * 3;
      ctx.fillStyle = mainColor;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(innerR, 2), 0, Math.PI * 2);
      ctx.fill();

      // 十字レティクル
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, 0);
      ctx.lineTo(r * 0.45, 0);
      ctx.moveTo(0, -r * 0.45);
      ctx.lineTo(0, r * 0.45);
      ctx.stroke();

      ctx.restore();
    }

    requestAnimationFrame(this.animateHUD);
  }

  setAlertLevel(level) {
    this.hudParams.alertLevel = level;
  }

  destroy() {
    this.isRunning = false;
    if (this.riveInstance) {
      this.riveInstance.cleanup();
    }
  }
}

window.RiveManager = RiveManager;
