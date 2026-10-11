/**
 * WebGLCyberFX - 電脳サイバー捜査用リアルタイムWebGLシェーダー＆演出エンジン
 *
 * 機能:
 * - CRT走査線 (Scanlines) & ビネット (Vignette)
 * - リアルタイム・デジタルグリッチ (Glitch) & 色収差 (RGB Split)
 * - ホログラム・インターレース波 (Holographic Scanwave)
 * - 電脳パーティクル (Cyber Matrix Dust)
 * - スクリーンシェイク (Screen Shake) ＆ インパクトフラッシュ (Impact Flash)
 */

class WebGLCyberFX {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    
    if (!this.gl) {
      console.warn('[WebGLCyberFX] WebGL is not supported. Fallback to CSS effects.');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;

    // 演出パラメーター
    this.params = {
      scanlineIntensity: 0.28,
      vignetteIntensity: 0.65,
      rgbSplitIntensity: 0.003,
      glitchIntensity: 0.0,
      hologramIntensity: 0.0,
      flashIntensity: 0.0,
      flashColor: [1.0, 1.0, 1.0]
    };

    // シェイクパラメーター
    this.shake = {
      intensity: 0,
      decay: 0.9,
      offsetX: 0,
      offsetY: 0
    };

    // パーティクル配列
    this.particles = [];
    this.maxParticles = 60;
    this.initParticles();

    this.initGL();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.isRunning = true;
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initGL() {
    const gl = this.gl;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y; // 上下反転補正
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_scanlineIntensity;
      uniform float u_vignetteIntensity;
      uniform float u_rgbSplitIntensity;
      uniform float u_glitchIntensity;
      uniform float u_hologramIntensity;
      uniform float u_flashIntensity;
      uniform vec3 u_flashColor;

      // 擬似乱数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = v_uv;

        // グリッチ変形 (水平ブロックスライス)
        if (u_glitchIntensity > 0.01) {
          float sliceBlock = floor(uv.y * 30.0);
          float sliceNoise = random(vec2(sliceBlock, floor(u_time * 18.0)));
          if (sliceNoise < u_glitchIntensity * 0.65) {
            float shift = (random(vec2(u_time, sliceBlock)) - 0.5) * u_glitchIntensity * 0.12;
            uv.x = fract(uv.x + shift);
          }
        }

        // 色収差 (RGB Split)
        float split = u_rgbSplitIntensity + (u_glitchIntensity * 0.035);
        vec2 uvR = uv + vec2(split, 0.0);
        vec2 uvB = uv - vec2(split, 0.0);

        // 基本アルファ
        float alpha = 0.0;
        vec3 color = vec3(0.0);

        // ホログラム走査線 (Hologram Wave)
        if (u_hologramIntensity > 0.05) {
          float holoWave = sin(uv.y * 120.0 - u_time * 6.0) * 0.5 + 0.5;
          float holoSweep = smoothstep(0.0, 0.1, abs(fract(uv.y * 0.5 - u_time * 0.15) - 0.5));
          vec3 holoColor = vec3(0.0, 0.95, 1.0) * holoWave * 0.25 * u_hologramIntensity;
          color += holoColor;
          alpha += holoWave * 0.15 * u_hologramIntensity;
        }

        // CRT走査線 (Scanlines)
        if (u_scanlineIntensity > 0.01) {
          float scanline = sin(uv.y * u_resolution.y * 0.85) * 0.5 + 0.5;
          float darkLine = (1.0 - scanline) * u_scanlineIntensity;
          color += vec3(0.0, 0.25, 0.4) * darkLine * 0.3;
          alpha += darkLine * 0.35;
        }

        // ビネット (Vignette - 画面端の減光)
        if (u_vignetteIntensity > 0.01) {
          vec2 vigUV = uv * (1.0 - uv.yx);
          float vig = vigUV.x * vigUV.y * 15.0;
          float vigAmount = clamp(pow(vig, 0.35), 0.0, 1.0);
          float vignetteDark = (1.0 - vigAmount) * u_vignetteIntensity;
          color += vec3(0.01, 0.03, 0.08) * vignetteDark;
          alpha += vignetteDark * 0.45;
        }

        // デジタルノイズ (Glitch Snow)
        if (u_glitchIntensity > 0.05) {
          float noise = random(uv * 100.0 + fract(u_time * 43.0));
          if (noise > 0.82) {
            color += vec3(0.0, 1.0, 0.9) * u_glitchIntensity * 0.45;
            alpha += u_glitchIntensity * 0.35;
          }
        }

        // インパクトフラッシュ
        if (u_flashIntensity > 0.01) {
          color = mix(color, u_flashColor, u_flashIntensity);
          alpha = max(alpha, u_flashIntensity * 0.85);
        }

        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.95));
      }
    `;

    this.program = this.createProgram(vsSource, fsSource);
    gl.useProgram(this.program);

    // 頂点バッファ
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniformロケーション
    this.uLocs = {
      time: gl.getUniformLocation(this.program, 'u_time'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      scanlineIntensity: gl.getUniformLocation(this.program, 'u_scanlineIntensity'),
      vignetteIntensity: gl.getUniformLocation(this.program, 'u_vignetteIntensity'),
      rgbSplitIntensity: gl.getUniformLocation(this.program, 'u_rgbSplitIntensity'),
      glitchIntensity: gl.getUniformLocation(this.program, 'u_glitchIntensity'),
      hologramIntensity: gl.getUniformLocation(this.program, 'u_hologramIntensity'),
      flashIntensity: gl.getUniformLocation(this.program, 'u_flashIntensity'),
      flashColor: gl.getUniformLocation(this.program, 'u_flashColor')
    };

    // アルファブレンド設定
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[WebGLCyberFX] Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[WebGLCyberFX] Program link error:', gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.5 + 1.0,
        speedY: (Math.random() * 0.08 + 0.02) * -1,
        speedX: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 3 + 1,
        color: Math.random() > 0.3 ? '#00f3ff' : '#2dd4bf'
      });
    }
  }

  /**
   * エフェクトトリガーAPI
   */

  // 強烈なグリッチ
  triggerGlitch(intensity = 0.8, durationMs = 450) {
    this.params.glitchIntensity = intensity;
    this.triggerShake(intensity * 12, durationMs);
    setTimeout(() => {
      this.params.glitchIntensity = 0.0;
    }, durationMs);
  }

  // 画面シェイク
  triggerShake(intensity = 10, durationMs = 400) {
    this.shake.intensity = intensity;
    const startTime = performance.now();
    const updateShake = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed < durationMs) {
        const factor = 1.0 - (elapsed / durationMs);
        const curInt = this.shake.intensity * factor;
        this.shake.offsetX = (Math.random() - 0.5) * curInt * 2;
        this.shake.offsetY = (Math.random() - 0.5) * curInt * 2;
        requestAnimationFrame(updateShake);
      } else {
        this.shake.intensity = 0;
        this.shake.offsetX = 0;
        this.shake.offsetY = 0;
      }
    };
    requestAnimationFrame(updateShake);
  }

  // フラッシュ演出（異議あり！や机バン）
  triggerFlash(color = [1.0, 1.0, 1.0], intensity = 0.9, durationMs = 350) {
    this.params.flashColor = color;
    this.params.flashIntensity = intensity;
    const startTime = performance.now();
    const fade = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed < durationMs) {
        this.params.flashIntensity = intensity * (1.0 - elapsed / durationMs);
        requestAnimationFrame(fade);
      } else {
        this.params.flashIntensity = 0.0;
      }
    };
    requestAnimationFrame(fade);
  }

  // ホログラム波のトグル
  setHologramMode(active = true, intensity = 0.8) {
    this.params.hologramIntensity = active ? intensity : 0.0;
  }

  animate() {
    if (!this.isRunning) return;

    const now = performance.now();
    const timeSec = (now - this.startTime) * 0.001;

    if (this.gl && this.program) {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(this.program);
      gl.uniform1f(this.uLocs.time, timeSec);
      gl.uniform2f(this.uLocs.resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.uLocs.scanlineIntensity, this.params.scanlineIntensity);
      gl.uniform1f(this.uLocs.vignetteIntensity, this.params.vignetteIntensity);
      gl.uniform1f(this.uLocs.rgbSplitIntensity, this.params.rgbSplitIntensity);
      gl.uniform1f(this.uLocs.glitchIntensity, this.params.glitchIntensity);
      gl.uniform1f(this.uLocs.hologramIntensity, this.params.hologramIntensity);
      gl.uniform1f(this.uLocs.flashIntensity, this.params.flashIntensity);
      gl.uniform3fv(this.uLocs.flashColor, this.params.flashColor);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // ゲームビューポート全体のCSS Transformシェイクを連動
    const viewport = document.getElementById('gameViewport');
    if (viewport) {
      if (Math.abs(this.shake.offsetX) > 0.1 || Math.abs(this.shake.offsetY) > 0.1) {
        viewport.style.transform = `translate(${this.shake.offsetX}px, ${this.shake.offsetY}px)`;
      } else if (viewport.style.transform !== '') {
        viewport.style.transform = '';
      }
    }

    requestAnimationFrame(this.animate);
  }

  destroy() {
    this.isRunning = false;
  }
}

window.WebGLCyberFX = WebGLCyberFX;
