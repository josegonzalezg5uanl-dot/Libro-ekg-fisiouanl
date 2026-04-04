/**
 * =====================================================
 * COMPONENTE LIKERT — Autoevaluación de comprensión
 * Libro Digital de ECG
 * =====================================================
 *
 * USO EN HTML:
 *   <span class="concept-check" data-concept="Potencial de Acción"></span>
 *
 * El componente inyecta automáticamente:
 *   - Ícono 💡 clicable junto al concepto
 *   - Modal con slider Likert 0-4 (Nada → Mucho)
 *   - Guardado de respuestas en localStorage
 *   - Resumen acumulado accesible desde cualquier página
 * =====================================================
 */

(function () {
  'use strict';

  // ── Etiquetas de la escala Likert ──────────────────
  const LABELS = ['Nada', 'Poco', 'Algo', 'Bastante', 'Mucho'];
  const EMOJIS = ['😕', '🤔', '🙂', '😊', '🎯'];
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  // ── Clave de almacenamiento ────────────────────────
  const STORAGE_KEY = 'ecg_likert_responses';

  // ── Cargar respuestas guardadas ────────────────────
  function loadResponses() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  // ── Guardar una respuesta ──────────────────────────
  function saveResponse(concept, value) {
    const all = loadResponses();
    all[concept] = {
      value,
      label: LABELS[value],
      emoji: EMOJIS[value],
      timestamp: new Date().toISOString(),
      page: document.title
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  // ── Obtener respuesta previa ───────────────────────
  function getPrevious(concept) {
    return loadResponses()[concept] || null;
  }

  // ── Crear e inyectar el modal en el DOM ───────────
  function injectModal() {
    if (document.getElementById('likert-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'likert-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="lk-backdrop"></div>
      <div class="lk-box">
        <button class="lk-close" aria-label="Cerrar">&times;</button>

        <div class="lk-header">
          <span class="lk-bulb-big">💡</span>
          <div>
            <p class="lk-pre">¿Qué tan bien entendiste el concepto</p>
            <h3 class="lk-concept-name" id="lk-concept-name"></h3>
          </div>
        </div>

        <div class="lk-emoji-row" id="lk-emoji-row">
          ${EMOJIS.map((e, i) => `<span class="lk-emoji" data-idx="${i}">${e}</span>`).join('')}
        </div>

        <div class="lk-slider-wrap">
          <input type="range" id="lk-slider" min="0" max="4" step="1" value="2"
                 aria-label="Nivel de comprensión"/>
        </div>

        <div class="lk-track">
          ${LABELS.map((l, i) => `<span class="lk-tick" data-idx="${i}">${l}</span>`).join('')}
        </div>

        <div class="lk-feedback" id="lk-feedback"></div>

        <div class="lk-prev" id="lk-prev" style="display:none"></div>

        <button class="lk-save-btn" id="lk-save-btn">
          <i class="fas fa-check"></i> Guardar respuesta
        </button>

        <button class="lk-history-btn" id="lk-history-btn">
          <i class="fas fa-chart-bar"></i> Ver mi progreso
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    // ── Eventos del modal ──────────────────────────
    overlay.querySelector('.lk-backdrop').addEventListener('click', closeModal);
    overlay.querySelector('.lk-close').addEventListener('click', closeModal);

    const slider = overlay.querySelector('#lk-slider');
    slider.addEventListener('input', () => updateSliderUI(parseInt(slider.value)));

    // Click en emojis
    overlay.querySelectorAll('.lk-emoji').forEach(em => {
      em.addEventListener('click', () => {
        slider.value = em.dataset.idx;
        updateSliderUI(parseInt(em.dataset.idx));
      });
    });

    overlay.querySelector('#lk-save-btn').addEventListener('click', onSave);
    overlay.querySelector('#lk-history-btn').addEventListener('click', showHistory);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── Actualizar UI del slider ───────────────────────
  function updateSliderUI(val) {
    const overlay = document.getElementById('likert-modal');
    if (!overlay) return;

    const color  = COLORS[val];
    const label  = LABELS[val];
    const emoji  = EMOJIS[val];
    const slider = overlay.querySelector('#lk-slider');

    // Colorear slider
    const pct = (val / 4) * 100;
    slider.style.background =
      `linear-gradient(to right, ${color} ${pct}%, #1e2d40 ${pct}%)`;

    // Resaltar emoji activo
    overlay.querySelectorAll('.lk-emoji').forEach((em, i) => {
      em.classList.toggle('lk-emoji-active', i === val);
    });

    // Resaltar etiqueta activa
    overlay.querySelectorAll('.lk-tick').forEach((t, i) => {
      t.classList.toggle('lk-tick-active', i === val);
      t.style.color = i === val ? color : '';
    });

    // Texto de feedback
    const feedbackTexts = [
      '¡No te preocupes! Repasa el concepto y vuelve a intentarlo.',
      'Vas por buen camino. Revisa los puntos clave una vez más.',
      'Buen progreso. Practica con los talleres para afianzarlo.',
      '¡Muy bien! Estás dominando el concepto.',
      '¡Excelente! Dominas este concepto completamente. 🏆'
    ];
    overlay.querySelector('#lk-feedback').innerHTML =
      `<span style="color:${color}">${emoji} ${feedbackTexts[val]}</span>`;
  }

  // ── Abrir modal ────────────────────────────────────
  function openModal(concept) {
    injectModal();
    const overlay = document.getElementById('likert-modal');
    const slider  = overlay.querySelector('#lk-slider');
    const nameEl  = overlay.querySelector('#lk-concept-name');
    const prevEl  = overlay.querySelector('#lk-prev');
    const saveBtn = overlay.querySelector('#lk-save-btn');

    // Nombre del concepto
    nameEl.textContent = `"${concept}"?`;

    // Guardar concepto activo en dataset
    overlay.dataset.concept = concept;

    // ¿Ya respondió antes?
    const prev = getPrevious(concept);
    if (prev) {
      slider.value = prev.value;
      prevEl.style.display = 'block';
      prevEl.innerHTML =
        `<i class="fas fa-history"></i> Última respuesta: <strong>${prev.emoji} ${prev.label}</strong>`;
      saveBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar respuesta';
    } else {
      slider.value = 2;
      prevEl.style.display = 'none';
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Guardar respuesta';
    }

    updateSliderUI(parseInt(slider.value));

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('lk-open');
    document.body.style.overflow = 'hidden';

    // Focus accesible
    setTimeout(() => slider.focus(), 100);
  }

  // ── Cerrar modal ───────────────────────────────────
  function closeModal() {
    const overlay = document.getElementById('likert-modal');
    if (!overlay) return;
    overlay.classList.remove('lk-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Guardar respuesta ──────────────────────────────
  function onSave() {
    const overlay  = document.getElementById('likert-modal');
    const concept  = overlay.dataset.concept;
    const val      = parseInt(overlay.querySelector('#lk-slider').value);
    const saveBtn  = overlay.querySelector('#lk-save-btn');

    saveResponse(concept, val);

    // Animación de confirmación
    saveBtn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Guardado!';
    saveBtn.style.background = COLORS[val];
    saveBtn.style.borderColor = COLORS[val];

    // Actualizar ícono del concepto en la página
    updateConceptIcon(concept, val);

    setTimeout(() => {
      closeModal();
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Guardar respuesta';
      saveBtn.style.background = '';
      saveBtn.style.borderColor = '';
    }, 1200);
  }

  // ── Actualizar ícono tras guardar ──────────────────
  function updateConceptIcon(concept, val) {
    document.querySelectorAll(`.concept-check[data-concept="${CSS.escape(concept)}"]`)
      .forEach(el => {
        el.dataset.answered = val;
        el.title = `${EMOJIS[val]} ${LABELS[val]} — clic para actualizar`;
        const btn = el.querySelector('.lk-icon-btn');
        if (btn) {
          btn.style.background = COLORS[val] + '33';
          btn.style.borderColor = COLORS[val];
          btn.querySelector('.lk-dot').style.display = 'block';
          btn.querySelector('.lk-dot').style.background = COLORS[val];
        }
      });
  }

  // ── Panel de historial / progreso ─────────────────
  function showHistory() {
    const responses = loadResponses();
    const keys = Object.keys(responses);

    if (keys.length === 0) {
      alert('Aún no has evaluado ningún concepto.');
      return;
    }

    // Crear panel de historial
    injectHistoryPanel(responses);
  }

  function injectHistoryPanel(responses) {
    let panel = document.getElementById('lk-history-panel');
    if (panel) { panel.remove(); }

    const keys  = Object.keys(responses);
    const total = keys.length;
    const avg   = (keys.reduce((s, k) => s + responses[k].value, 0) / total).toFixed(1);
    const avgLabel = LABELS[Math.round(parseFloat(avg))];

    // Agrupar por nivel
    const counts = [0, 0, 0, 0, 0];
    keys.forEach(k => counts[responses[k].value]++);

    const bars = counts.map((c, i) => `
      <div class="lk-hist-bar-row">
        <span class="lk-hist-bar-label">${EMOJIS[i]} ${LABELS[i]}</span>
        <div class="lk-hist-bar-track">
          <div class="lk-hist-bar-fill" style="width:${total ? (c/total*100).toFixed(0) : 0}%;background:${COLORS[i]}"></div>
        </div>
        <span class="lk-hist-bar-count" style="color:${COLORS[i]}">${c}</span>
      </div>
    `).join('');

    const rows = keys.map(k => {
      const r = responses[k];
      return `
        <tr>
          <td>${r.emoji}</td>
          <td class="lk-hist-concept">${k}</td>
          <td style="color:${COLORS[r.value]};font-weight:600">${r.label}</td>
          <td class="lk-hist-page">${r.page || '—'}</td>
        </tr>`;
    }).join('');

    panel = document.createElement('div');
    panel.id = 'lk-history-panel';
    panel.innerHTML = `
      <div class="lk-backdrop"></div>
      <div class="lk-hist-box">
        <button class="lk-close" onclick="document.getElementById('lk-history-panel').remove()">
          &times;
        </button>
        <h2 class="lk-hist-title"><i class="fas fa-chart-bar"></i> Mi Progreso de Comprensión</h2>

        <div class="lk-hist-summary">
          <div class="lk-hist-stat">
            <span class="lk-hist-stat-num">${total}</span>
            <span class="lk-hist-stat-label">Conceptos evaluados</span>
          </div>
          <div class="lk-hist-stat">
            <span class="lk-hist-stat-num" style="color:${COLORS[Math.round(parseFloat(avg))]}">${avg}</span>
            <span class="lk-hist-stat-label">Promedio (0–4)</span>
          </div>
          <div class="lk-hist-stat">
            <span class="lk-hist-stat-num">${EMOJIS[Math.round(parseFloat(avg))]}</span>
            <span class="lk-hist-stat-label">${avgLabel}</span>
          </div>
        </div>

        <div class="lk-hist-bars">${bars}</div>

        <div class="lk-hist-table-wrap">
          <table class="lk-hist-table">
            <thead>
              <tr>
                <th></th>
                <th>Concepto</th>
                <th>Nivel</th>
                <th>Capítulo</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <button class="lk-clear-btn" onclick="clearHistory()">
          <i class="fas fa-trash-alt"></i> Borrar historial
        </button>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.lk-backdrop').addEventListener('click', () => panel.remove());
    setTimeout(() => panel.classList.add('lk-open'), 10);
  }

  // Exponer globalmente para el botón inline
  window.clearHistory = function () {
    if (confirm('¿Seguro que deseas borrar todo el historial de comprensión?')) {
      localStorage.removeItem(STORAGE_KEY);
      document.getElementById('lk-history-panel')?.remove();
      // Resetear íconos en la página
      document.querySelectorAll('.concept-check[data-answered]').forEach(el => {
        delete el.dataset.answered;
        const btn = el.querySelector('.lk-icon-btn');
        if (btn) {
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.querySelector('.lk-dot').style.display = 'none';
        }
      });
    }
  };

  // ── Inicializar todos los .concept-check ──────────
  function initConceptChecks() {
    document.querySelectorAll('.concept-check').forEach(el => {
      if (el.dataset.initialized) return;
      el.dataset.initialized = 'true';

      const concept = el.dataset.concept || 'Concepto';
      const prev    = getPrevious(concept);

      // Crear botón ícono
      const btn = document.createElement('button');
      btn.className   = 'lk-icon-btn';
      btn.title       = prev
        ? `${prev.emoji} ${prev.label} — clic para actualizar`
        : `Evalúa tu comprensión: "${concept}"`;
      btn.setAttribute('aria-label', `Autoevaluación: ${concept}`);
      btn.innerHTML   = `💡<span class="lk-dot"></span>`;

      if (prev) {
        btn.style.background  = COLORS[prev.value] + '33';
        btn.style.borderColor = COLORS[prev.value];
        btn.querySelector('.lk-dot').style.display     = 'block';
        btn.querySelector('.lk-dot').style.background  = COLORS[prev.value];
        el.dataset.answered = prev.value;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(concept);
      });

      el.appendChild(btn);
    });
  }

  // ── Inicializar al cargar el DOM ───────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConceptChecks);
  } else {
    initConceptChecks();
  }

  // ── API pública ────────────────────────────────────
  window.LikertCheck = { open: openModal, history: showHistory };

})();
