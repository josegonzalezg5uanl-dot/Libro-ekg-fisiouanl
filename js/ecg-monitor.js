// ============================================================
//  SIMULADOR ECG — Motor de generación de trazos
//  Genera ondas P, QRS, T matemáticamente en tiempo real
// ============================================================

class ECGMonitor {
  constructor(canvasId, options = {}) {
    this.canvas  = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx     = this.canvas.getContext('2d');

    // Opciones configurables
    this.opts = Object.assign({
      rhythm:    'normal',   // normal | tachy | brady | afib | flutter | pvc
      speed:     1.0,        // velocidad de barrido
      showGrid:  true,
      showLabels: true,
      darkMode:  document.body.classList.contains('dark'),
    }, options);

    // Estado interno
    this.running   = false;
    this.x         = 0;           // posición horizontal actual
    this.phase     = 0;           // fase del ciclo cardíaco (0-1)
    this.lastTime  = null;
    this.animFrame = null;
    this.trailBuffer = [];        // buffer de puntos ya dibujados

    // Parámetros de ritmo
    this.rhythmParams = {
      normal:  { bpm: 72,  pAmp: 0.15, prSeg: 0.16, qrsW: 0.08, tAmp: 0.30, noise: 0.005 },
      tachy:   { bpm: 140, pAmp: 0.14, prSeg: 0.13, qrsW: 0.07, tAmp: 0.28, noise: 0.005 },
      brady:   { bpm: 42,  pAmp: 0.16, prSeg: 0.18, qrsW: 0.09, tAmp: 0.32, noise: 0.004 },
      afib:    { bpm: 110, pAmp: 0.00, prSeg: 0.00, qrsW: 0.08, tAmp: 0.28, noise: 0.025, irregular: true },
      flutter: { bpm: 150, pAmp: 0.12, prSeg: 0.20, qrsW: 0.08, tAmp: 0.20, noise: 0.005, flutter: true },
      pvc:     { bpm: 70,  pAmp: 0.15, prSeg: 0.16, qrsW: 0.08, tAmp: 0.30, noise: 0.005, pvcEvery: 4 },
    };

    this.beatCount  = 0;
    this.cycleLen   = 0;   // longitud del ciclo en px (calculada)
    this.cyclePhase = 0;   // fase dentro del ciclo actual (0..cycleLen px)

    this._calcCycle();
    this._bindTheme();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  // ---- Calcular longitud del ciclo -------------------------
  _calcCycle() {
    const p = this.rhythmParams[this.opts.rhythm];
    // RR interval en segundos
    let rr = 60 / p.bpm;
    if (p.irregular) rr += (Math.random() - 0.5) * 0.3;
    // px/seg = velocidad de barrido * ancho canvas / 10 seg visibles
    this.pxPerSec  = (this.canvas ? this.canvas.width : 800) / 8 * this.opts.speed;
    this.cycleLen  = rr * this.pxPerSec;
  }

  // ---- Observar cambios de tema ----------------------------
  _bindTheme() {
    const obs = new MutationObserver(() => {
      this.opts.darkMode = document.body.classList.contains('dark');
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ---- Resize adaptativo ----------------------------------
  resize() {
    if (!this.canvas) return;
    const container = this.canvas.parentElement;
    this.canvas.width  = container.clientWidth  || 800;
    this.canvas.height = container.clientHeight || 220;
    this.pxPerSec = this.canvas.width / 8 * this.opts.speed;
    this.cycleLen = (60 / this.rhythmParams[this.opts.rhythm].bpm) * this.pxPerSec;
    this._drawGrid();
  }

  // ---- Colores según tema ----------------------------------
  get colors() {
    const dark = this.opts.darkMode;
    return {
      bg:       dark ? '#0d1117' : '#f0fff0',
      grid:     dark ? '#1a3a1a' : '#c8e6c9',
      gridMain: dark ? '#2a5a2a' : '#81c784',
      trace:    dark ? '#00e676' : '#00897b',
      traceGlow:dark ? 'rgba(0,230,118,0.35)' : 'rgba(0,137,123,0.25)',
      label:    dark ? '#69f0ae' : '#00695c',
      text:     dark ? '#b0bec5' : '#37474f',
      alert:    '#ef5350',
    };
  }

  // ---- Dibujar cuadrícula ECG ------------------------------
  _drawGrid() {
    if (!this.canvas) return;
    const { ctx, canvas } = this;
    const c = this.colors;
    const W = canvas.width, H = canvas.height;

    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    if (!this.opts.showGrid) return;

    const sm = 10; // cuadro pequeño en px
    const lg = 50; // cuadro grande en px

    // Cuadros pequeños
    ctx.strokeStyle = c.grid;
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += sm) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += sm) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Cuadros grandes
    ctx.strokeStyle = c.gridMain;
    ctx.lineWidth   = 1;
    for (let x = 0; x < W; x += lg) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += lg) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  // ---- Función de forma de onda ECG -----------------------
  // Devuelve amplitud normalizada (-1 a +1) para una posición
  // dentro del ciclo (t = 0..1)
  _ecgWave(t) {
    const p   = this.rhythmParams[this.opts.rhythm];
    let val   = 0;

    // Ruido de base
    val += (Math.random() - 0.5) * p.noise;

    // --- Onda P ---
    if (!p.irregular) {
      const pCenter = 0.10;
      const pWidth  = 0.04;
      val += p.pAmp * Math.exp(-Math.pow((t - pCenter) / pWidth, 2));
    } else {
      // FA: ondas f irregulares de pequeña amplitud
      val += 0.04 * Math.sin(t * Math.PI * 60 + Math.random() * 2);
    }

    // Flutter: ondas en sierra antes del QRS
    if (p.flutter && t < 0.30 && t > 0.02) {
      val += 0.08 * Math.sin(t * Math.PI * 28);
    }

    // --- Segmento PR (isoeléctrico) ---
    // (solo ruido, ya incluido arriba)

    // --- Complejo QRS ---
    const qrsCenter = p.irregular ? 0.25 + (Math.random() - 0.5) * 0.04 : 0.25;

    // Onda Q
    val -= 0.10 * Math.exp(-Math.pow((t - (qrsCenter - 0.025)) / 0.008, 2));
    // Onda R
    val += 1.00 * Math.exp(-Math.pow((t - qrsCenter) / 0.012, 2));
    // Onda S
    val -= 0.20 * Math.exp(-Math.pow((t - (qrsCenter + 0.022)) / 0.010, 2));

    // PVC: cada N latidos, QRS ancho y bizarro
    if (p.pvcEvery && this.beatCount % p.pvcEvery === 0) {
      val  = (Math.random() - 0.5) * p.noise;
      val += 0.8  * Math.exp(-Math.pow((t - 0.28) / 0.030, 2));
      val -= 0.35 * Math.exp(-Math.pow((t - 0.31) / 0.025, 2));
      val -= 0.25 * Math.exp(-Math.pow((t - 0.24) / 0.020, 2));
      // T invertida
      val -= 0.40 * Math.exp(-Math.pow((t - 0.50) / 0.055, 2));
      return val;
    }

    // --- Segmento ST ---
    // (isoeléctrico con leve ruido)

    // --- Onda T ---
    const tCenter = 0.55;
    const tWidth  = 0.055;
    val += p.tAmp * Math.exp(-Math.pow((t - tCenter) / tWidth, 2));

    return val;
  }

  // ---- Loop principal de animación ------------------------
  _animate(timestamp) {
    if (!this.running) return;
    if (!this.lastTime) this.lastTime = timestamp;

    const dt      = (timestamp - this.lastTime) / 1000; // seg transcurridos
    this.lastTime = timestamp;

    const { ctx, canvas } = this;
    const W = canvas.width, H = canvas.height;
    const c = this.colors;
    const mid = H / 2;
    const amp = H * 0.38; // amplitud máxima en px

    // Borrar franja adelante del cursor (efecto barrido)
    const eraseW = 18;
    ctx.fillStyle = c.bg;
    ctx.fillRect(this.x, 0, eraseW + 2, H);

    // Redibujar grid en esa zona
    this._redrawGridStrip(this.x, eraseW + 2);

    // Línea vertical del cursor
    ctx.strokeStyle = c.traceGlow;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 1, 0);
    ctx.lineTo(this.x + 1, H);
    ctx.stroke();

    // Cuántos px avanzar este frame
    const pxStep = this.pxPerSec * dt;

    // Dibujar segmento de traza
    ctx.strokeStyle = c.trace;
    ctx.lineWidth   = 2.2;
    ctx.shadowColor = c.traceGlow;
    ctx.shadowBlur  = 6;
    ctx.beginPath();

    let px = this.x;
    const steps = Math.max(1, Math.ceil(pxStep * 2));

    for (let i = 0; i <= steps; i++) {
      const curX = this.x + (pxStep * i / steps);
      const t    = this.cyclePhase / this.cycleLen;
      const y    = mid - this._ecgWave(t) * amp;

      if (i === 0) ctx.moveTo(curX % W, y);
      else         ctx.lineTo(curX % W, y);

      this.cyclePhase += pxStep / steps;

      // Fin de ciclo → nuevo latido
      if (this.cyclePhase >= this.cycleLen) {
        this.cyclePhase -= this.cycleLen;
        this.beatCount++;
        this._calcCycle(); // recalcular (para ritmos irregulares)
        this._updateBPM();
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Avanzar cursor
    this.x = (this.x + pxStep) % W;

    this.animFrame = requestAnimationFrame(ts => this._animate(ts));
  }

  // ---- Redibujar cuadrícula en una franja -----------------
  _redrawGridStrip(startX, width) {
    const { ctx, canvas } = this;
    const c  = this.colors;
    const H  = canvas.height;
    const sm = 10, lg = 50;

    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, 0, width + eraseW, H);
    ctx.clip();

    // pequeños
    ctx.strokeStyle = c.grid;
    ctx.lineWidth   = 0.5;
    for (let x = Math.floor(startX / sm) * sm; x < startX + width + 2; x += sm) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += sm) {
      ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + width + 2, y); ctx.stroke();
    }
    // grandes
    ctx.strokeStyle = c.gridMain;
    ctx.lineWidth   = 1;
    for (let x = Math.floor(startX / lg) * lg; x < startX + width + 2; x += lg) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += lg) {
      ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + width + 2, y); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- Actualizar display de BPM --------------------------
  _updateBPM() {
    const el = document.getElementById(this.canvas.id + '-bpm');
    if (!el) return;
    const p = this.rhythmParams[this.opts.rhythm];
    let bpm = p.bpm;
    if (p.irregular) bpm += Math.round((Math.random() - 0.5) * 20);
    el.textContent = bpm + ' lpm';
  }

  // ---- API pública ----------------------------------------
  start() {
    if (this.running) return;
    this.running  = true;
    this.lastTime = null;
    this._drawGrid();
    this.animFrame = requestAnimationFrame(ts => this._animate(ts));
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  toggle() {
    this.running ? this.stop() : this.start();
  }

  setRhythm(rhythm) {
    this.opts.rhythm    = rhythm;
    this.beatCount      = 0;
    this.cyclePhase     = 0;
    this._calcCycle();
    this._updateBPM();
  }

  setSpeed(speed) {
    this.opts.speed = speed;
    this._calcCycle();
  }
}

// Corrección de variable no declarada en _redrawGridStrip
const eraseW = 18;
