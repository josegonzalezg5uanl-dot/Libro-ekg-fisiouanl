/* ═══════════════════════════════════
   CONFIGURACIÓN Y ESTADO DEL QUIZ
═══════════════════════════════════ */
const DIFF_CONFIG = {
  suave:   { time: 60, lives: 3, bonus_mult: 1.0 },
  medio:   { time: 30, lives: 3, bonus_mult: 1.5 },
  intenso: { time: 15, lives: 2, bonus_mult: 2.0 }
};

/* ── BARRA DE ENERGÍA (Potencial de Acción) ──
   Empieza en 100. Cada error baja según la dificultad.
   Si el alumno responde 'yes' en el NPC, recupera 50% de lo perdido (Potion). */
const ENERGY_CONFIG = {
  suave:   { loss: 15, recover: 7  },
  medio:   { loss: 20, recover: 10 },
  intenso: { loss: 30, recover: 12 }
};

/* ── INSIGNIAS DE ESPECIALISTA ── */
const ALL_BADGES = [
  {
    id: 'maestro_iones',
    icon: '⚡',
    name: 'Maestro de Iones',
    desc: 'Respondiste todas las preguntas sobre fases del potencial de acción correctamente a la primera.',
    check: (s) => s.log.filter(l => l.topic === 'ion').every(l => l.intentos === 1)
  },
  {
    id: 'reloj_precision',
    icon: '⏱️',
    name: 'Reloj de Precisión',
    desc: 'Respondiste preguntas de tiempo/intervalos en menos de 10 segundos.',
    check: (s) => s.log.filter(l => l.topic === 'tiempo').some(l => l.tiempoUsado <= 10 && l.intentos === 1)
  },
  {
    id: 'brujula_cardiaca',
    icon: '🧭',
    name: 'Brújula Cardíaca',
    desc: 'No fallaste ninguna pregunta de vectores y deflexiones.',
    check: (s) => s.log.filter(l => l.topic === 'vector').every(l => l.intentos === 1)
  },
  {
    id: 'primer_intento',
    icon: '🌟',
    name: 'Primer Intento',
    desc: 'Respondiste 5 preguntas seguidas correctas a la primera.',
    check: (s) => { let max=0,cur=0; s.log.forEach(l=>{if(l.intentos===1){cur++;max=Math.max(max,cur);}else cur=0;}); return max>=5; }
  },
  {
    id: 'energia_plena',
    icon: '💪',
    name: 'Energía Plena',
    desc: 'Terminaste el quiz con más del 80% de energía.',
    check: (s) => s.energyFinal >= 80
  },
  {
    id: 'reflexivo',
    icon: '🧠',
    name: 'Reflexivo',
    desc: 'Usaste el Duelo de Reflexión y respondiste "Sí entendí" al menos 3 veces.',
    check: (s) => (s.npcYesCount || 0) >= 3
  }
];

/* ── INSIGNIAS GUARDADAS (localStorage) ── */
function getBadgeKey() { return window.BADGE_KEY || 'ecg_badges_default'; }

function loadEarnedBadges() {
  try { return JSON.parse(localStorage.getItem(getBadgeKey()) || '[]'); } catch { return []; }
}
function saveEarnedBadges(ids) {
  localStorage.setItem(getBadgeKey(), JSON.stringify(ids));
}

let state = {
  diff: 'medio',
  questions: [],
  currentIdx: 0,
  points: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeLeft: 30,
  timerInterval: null,
  answered: false,
  startTime: null,
  totalTime: 0,
  log: [],
  intentosPorPregunta: {},
  energy: 100,           // Potencial de Acción (0-100)
  energyFinal: 100,
  npcYesCount: 0,        // cuantas veces eligió 'Sí entendí' en el NPC
  earnedBadges: []       // insignias ganadas en esta partida
};

/* ── Seleccionar dificultad ── */
function setDiff(d) {
  state.diff = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`.diff-btn.${d}`).classList.add('selected');
  document.getElementById('statTime').textContent  = DIFF_CONFIG[d].time + 's';
  document.getElementById('statLives').textContent = DIFF_CONFIG[d].lives;
}

/* ── Iniciar quiz ── */
function startQuiz() {
  const cfg = DIFF_CONFIG[state.diff];
  state.questions           = shuffle([...QUESTIONS]).slice(0, 10);
  state.currentIdx          = 0;
  state.points              = 0;
  state.lives               = cfg.lives;
  state.streak              = 0;
  state.bestStreak          = 0;
  state.correctCount        = 0;
  state.wrongCount          = 0;
  state.answered            = false;
  state.startTime           = Date.now();
  state.log                 = [];
  state.intentosPorPregunta = {};
  state.energy              = 100;
  state.energyFinal         = 100;
  state.npcYesCount         = 0;
  state.earnedBadges        = [];
  updateEnergyBar();

  document.getElementById('screen-start').style.display = 'none';
  document.getElementById('screen-quiz').style.display  = 'block';
  document.getElementById('quizHud').style.display      = 'flex';

  renderLives();
  renderQuestion();
}

/* ── Barajar preguntas ── */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Renderizar pregunta ── */
function renderQuestion() {
  const q   = state.questions[state.currentIdx];
  const cfg = DIFF_CONFIG[state.diff];

  // Limpiar feedback y paneles auxiliares
  const fp = document.getElementById('feedbackPanel');
  fp.className = 'feedback-panel';
  fp.style.display = 'none';
  document.getElementById('fbCorrectAnswer').style.display = 'none';
  document.getElementById('fbWhy').style.display           = 'none';
  document.getElementById('npcBox').style.display          = 'none';
  document.getElementById('reflectionResponse').style.display = 'none';
  document.getElementById('clinicalBox').style.display     = 'none';

  // Limpiar hint de reintentar
  const retryHint = document.getElementById('fbRetryHint');
  if (retryHint) retryHint.style.display = 'none';

  // Resetear NPC opciones
  document.querySelectorAll('.npc-opt').forEach(b => {
    b.classList.remove('chosen-correct','chosen-wrong');
    b.disabled = false;
  });

  // Tipo
  const badge = document.getElementById('qTypeBadge');
  if (q.type === 'mcq') {
    badge.innerHTML = '<i class="fas fa-list"></i> Opción múltiple';
  } else {
    badge.innerHTML = '<i class="fas fa-pencil-alt"></i> Completar espacio';
  }

  // Texto
  document.getElementById('qText').innerHTML = q.q;

  // Cuerpo de la pregunta
  const body = document.getElementById('qBody');
  if (q.type === 'mcq') {
    body.innerHTML = `<div class="q-options">${
      Object.entries(q.opts).map(([k,v]) =>
        `<button class="q-opt" onclick="answerMCQ('${k}',this)" data-key="${k}">
           <span class="opt-letter">${k}</span><span>${v}</span>
         </button>`
      ).join('')
    }</div>`;
  } else {
    body.innerHTML = `
      <div class="fitb-wrap">
        <input class="fitb-input" id="fitbInput" placeholder="Escribe tu respuesta..."
               onkeydown="if(event.key==='Enter') answerFITB()"/>
        <button class="fitb-btn" onclick="answerFITB()">
          <i class="fas fa-check"></i> Responder
        </button>
      </div>`;
    setTimeout(() => document.getElementById('fitbInput')?.focus(), 100);
  }

  // HUD
  updateHUD();

  // Botón siguiente deshabilitado
  const btnNext = document.getElementById('btnNext');
  btnNext.disabled = true;
  btnNext.innerHTML = 'Siguiente pregunta <i class="fas fa-arrow-right"></i>';

  state.answered = false;

  // Iniciar temporizador
  startTimer(cfg.time);
}

/* ── Temporizador ── */
function startTimer(seconds) {
  clearInterval(state.timerInterval);
  state.timeLeft = seconds;
  updateTimerUI();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) timeOut();
    }
  }, 1000);
}

function updateTimerUI() {
  const el = document.getElementById('hudTimer');
  el.textContent = state.timeLeft;
  el.className   = 'hud-val timer-val';
  if (state.timeLeft <= 5)  el.classList.add('danger');
  else if (state.timeLeft <= 10) el.classList.add('warning');
}

function timeOut() {
  const q = state.questions[state.currentIdx];

  // Cuando se acaba el tiempo: bloquear todas las opciones y revelar la correcta
  state.answered = true;
  document.querySelectorAll('.q-opt').forEach(b => {
    b.disabled = true;
    if (b.dataset.key === q.answer) b.classList.add('correct');
  });
  const fitbInput = document.getElementById('fitbInput');
  if (fitbInput) { fitbInput.disabled = true; fitbInput.classList.add('wrong'); }
  const fitbBtn = document.querySelector('.fitb-btn');
  if (fitbBtn) fitbBtn.disabled = true;

  // Mostrar feedback de timeout con respuesta revelada
  processAnswer(false, null, q);

  // Timeout revela la respuesta correcta (no hay opción de reintentar)
  const ca = document.getElementById('fbCorrectAnswer');
  ca.style.display = 'block';
  ca.innerHTML = `<strong>⏱️ Tiempo agotado.</strong> La respuesta correcta era: <strong>${
    q.type === 'mcq' ? `${q.answer}. ${q.opts[q.answer]}` : q.answer
  }</strong>`;

  // Ocultar el hint de reintentar si apareció
  const retryHint = document.getElementById('fbRetryHint');
  if (retryHint) retryHint.style.display = 'none';

  // Habilitar siguiente directamente
  const btnNext = document.getElementById('btnNext');
  btnNext.disabled = false;
  if (state.currentIdx >= state.questions.length - 1) {
    btnNext.innerHTML = '🏁 Ver resultados <i class="fas fa-flag-checkered"></i>';
  }
}

/* ── Responder MCQ ── */
function answerMCQ(key, btn) {
  if (state.answered) return;

  const q       = state.questions[state.currentIdx];
  const correct = key === q.answer;

  if (correct) {
    // Acertó — detener timer y bloquear todo
    clearInterval(state.timerInterval);
    state.answered = true;
    document.querySelectorAll('.q-opt').forEach(b => {
      b.disabled = true;
      if (b.dataset.key === q.answer) b.classList.add('correct');
    });
    processAnswer(true, key, q);
  } else {
    // Erró — NO detener el timer (sigue corriendo mientras lee la explicación)
    btn.classList.add('wrong');
    btn.disabled = true;  // bloquear solo la opción elegida, las demás siguen activas
    processAnswer(false, key, q);
    // state.answered sigue false → puede seguir intentando
  }
}

/* ── Responder Fill in the blank ── */
function answerFITB() {
  if (state.answered) return;

  const q     = state.questions[state.currentIdx];
  const input = document.getElementById('fitbInput');
  const val   = input.value.trim().toLowerCase();
  const alts  = (q.alt_answers || []).map(a => a.toLowerCase());
  const correct = val === q.answer.toLowerCase() || alts.includes(val);

  if (correct) {
    clearInterval(state.timerInterval);  // detener timer solo al acertar
    state.answered = true;
    input.disabled = true;
    input.classList.add('correct');
    document.querySelector('.fitb-btn').disabled = true;
    processAnswer(true, val, q);
  } else {
    // Error: marcar en rojo brevemente, limpiar y dejar reintentar sin detener el timer
    input.classList.add('wrong');
    setTimeout(() => {
      input.classList.remove('wrong');
      input.value = '';
      input.focus();
    }, 900);
    processAnswer(false, val, q);
    // state.answered sigue false → puede seguir intentando
  }
}

/* ── Procesar respuesta (correcta o incorrecta) ── */
function processAnswer(correct, given, q) {
  const cfg      = DIFF_CONFIG[state.diff];
  const ecfg     = ENERGY_CONFIG[state.diff];
  const timeBonus= Math.floor(state.timeLeft * cfg.bonus_mult);
  let   pts      = 0;

  if (correct) {
    pts = q.points + timeBonus;
    state.points += pts;
    state.correctCount++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    showFeedbackCorrect(pts, q);

    // Log local al acertar
    const intentosPrevios = state.intentosPorPregunta[state.currentIdx] || 0;
    state.log.push({
      qText:      q.q.substring(0, 60) + '…',
      correct:    true,
      pts,
      answer:     q.type === 'mcq' ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
      intentos:   intentosPrevios + 1,
      topic:      q.topic || 'general',
      tiempoUsado: cfg.time - state.timeLeft
    });

    // Sesión global
    if (window.ECGSession) {
      window.ECGSession.logQuizAnswer({
        capitulo: window.CHAPTER_NAME || 'Capítulo Desconocido',
        pregunta_num: state.currentIdx + 1,
        pregunta_texto: q.q,
        respuesta_dada: q.type === 'mcq' ? `${given}. ${q.opts[given] || given}` : given,
        fue_correcta: true,
        respuesta_correcta: q.type === 'mcq' ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
        tiempo_seg: cfg.time - state.timeLeft,
        reflexion_elegida: '',
        puntos: pts, racha: state.streak
      });
    }

    // Habilitar "Siguiente"
    const btnNext = document.getElementById('btnNext');
    btnNext.disabled = false;
    if (state.currentIdx >= state.questions.length - 1) {
      btnNext.innerHTML = '🏁 Ver resultados <i class="fas fa-flag-checkered"></i>';
    }

  } else {
    // — Respuesta incorrecta —
    pts = -Math.floor(q.points * 0.3);
    state.points  = Math.max(0, state.points + pts);
    state.wrongCount++;
    state.streak  = 0;

    // Contar intento fallido
    state.intentosPorPregunta[state.currentIdx] =
      (state.intentosPorPregunta[state.currentIdx] || 0) + 1;

    // Bajar barra de energía
    state.energy = Math.max(0, state.energy - ecfg.loss);
    updateEnergyBar();

    // Mostrar consecuencia clínica si la pregunta la tiene
    if (q.clinical_consequence) showClinicalConsequence(q.clinical_consequence);

    // Mostrar feedback PRIMERO para que el alumno vea la explicación
    showFeedbackWrong(pts, given, q);

    // Después quitar vida
    loseLife();

    // Si aún tiene vidas (no game over), reiniciar timer con tiempo reducido para el reintento
    if (!state.answered) {   // state.answered lo pone loseLife() en true si vidas=0
      const retryTime = Math.max(15, Math.floor(cfg.time * 0.6)); // 60% del tiempo original, mín 15s
      startTimer(retryTime);
    }

    // Sesión global
    if (window.ECGSession) {
      window.ECGSession.logQuizAnswer({
        capitulo: window.CHAPTER_NAME || 'Capítulo Desconocido',
        pregunta_num: state.currentIdx + 1,
        pregunta_texto: q.q,
        respuesta_dada: q.type === 'mcq' ? `${given}. ${q.opts[given] || given}` : given,
        fue_correcta: false,
        respuesta_correcta: q.type === 'mcq' ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
        tiempo_seg: cfg.time - state.timeLeft,
        reflexion_elegida: '',
        puntos: pts, racha: 0
      });
    }
  }

  updateHUD();
  floatPoints(correct ? `+${pts}` : `${pts}`, correct);
}

/* ── Feedback CORRECTO ── */
function showFeedbackCorrect(pts, q) {
  const fp = document.getElementById('feedbackPanel');
  fp.className = 'feedback-panel correct';
  fp.style.display = '';

  const intentos = state.intentosPorPregunta[state.currentIdx] || 0;
  const racha    = state.streak;

  let titulo;
  if      (intentos === 0 && racha >= 3) titulo = `¡Correcto! 🔥 Racha x${racha} — ¡Imparable!`;
  else if (intentos === 0 && racha > 1)  titulo = `¡Correcto! 🔥 Racha de ${racha}`;
  else if (intentos === 0)               titulo = '¡Correcto! Perfecto a la primera ⭐';
  else if (intentos === 1)               titulo = '¡Correcto! Lo lograste en el 2º intento 💪';
  else                                   titulo = `¡Correcto! Después de ${intentos + 1} intentos 📚`;

  document.getElementById('fbIcon').textContent  = '✅';
  document.getElementById('fbTitle').textContent = titulo;

  const pb = document.getElementById('fbPoints');
  pb.className   = 'points-badge gained';
  pb.textContent = `+${pts} pts de conducción`;

  // Si hubo intentos, mostrar nota de consolidación
  const ca = document.getElementById('fbCorrectAnswer');
  if (intentos > 0) {
    ca.style.display = 'block';
    ca.innerHTML = `<i class="fas fa-check-circle" style="color:#22c55e"></i> 
      <strong>Respuesta consolidada.</strong> Recuerda el razonamiento que te llevó a la respuesta correcta — eso es lo que importa.`;
  } else {
    ca.style.display = 'none';
  }

  document.getElementById('fbWhy').style.display   = 'none';
  document.getElementById('npcBox').style.display   = 'none';
  document.getElementById('clinicalBox').style.display = 'none';
}

/* ── Feedback INCORRECTO ── */
function showFeedbackWrong(pts, given, q) {
  const fp = document.getElementById('feedbackPanel');
  fp.className = 'feedback-panel wrong';
  fp.style.display = '';

  const intentos = state.intentosPorPregunta[state.currentIdx] || 0;

  document.getElementById('fbIcon').textContent  = '❌';
  document.getElementById('fbTitle').textContent =
    intentos === 1 ? '⚡ Energía baja — vuelve a intentarlo'
    : `⚡ Intento ${intentos} — cada error cuesta energía`;

  const pb = document.getElementById('fbPoints');
  pb.className   = 'points-badge lost';
  pb.textContent = `${pts} pts`;

  document.getElementById('fbCorrectAnswer').style.display = 'none';

  // Por qué ESTA opción está mal
  const why = document.getElementById('fbWhy');
  why.style.display = 'block';
  const whyText = q.type === 'mcq' && given && q.why_wrong && q.why_wrong[given]
    ? q.why_wrong[given]
    : (typeof q.why_wrong === 'string' ? q.why_wrong : 'Esa opción no es correcta. Revisa el razonamiento e intenta de nuevo.');
  document.getElementById('fbWhyText').textContent = whyText;

  // NPC Duelo de Reflexión (reemplaza al panel de reflexión anterior)
  showNPCDuel(q);

  // Hint de reintentar
  let retryHint = document.getElementById('fbRetryHint');
  if (!retryHint) {
    retryHint = document.createElement('div');
    retryHint.id = 'fbRetryHint';
    retryHint.style.cssText = `
      margin-top:12px; padding:10px 14px;
      background:#0d1f12; border:1px dashed #22c55e;
      border-radius:8px; font-size:.84rem;
      color:#86efac; text-align:center;
    `;
    fp.appendChild(retryHint);
  }
  retryHint.innerHTML = `
    <i class="fas fa-redo" style="margin-right:6px"></i>
    Lee la explicación del Dr. ECG, luego elige otra opción.
    <span style="color:#607080;font-size:.76rem;display:block;margin-top:3px">
      Intento ${intentos} &bull; ${pts} pts &bull; ⚡ Energía: ${state.energy}%
    </span>
  `;
  retryHint.style.display = 'block';
}

/* ── Consecuencia clínica ── */
function showClinicalConsequence(text) {
  const box = document.getElementById('clinicalBox');
  document.getElementById('clinicalText').innerHTML = text;
  box.style.display = 'flex';
}

/* ── Barra de Potencial de Acción ── */
function updateEnergyBar() {
  const pct  = Math.max(0, Math.min(100, state.energy));
  const fill = document.getElementById('energyFill');
  const pctEl= document.getElementById('energyPct');
  if (!fill) return;
  fill.style.width = pct + '%';
  fill.className = 'energy-fill' +
    (pct <= 20 ? ' crit' : pct <= 50 ? ' low' : '');
  if (pctEl) pctEl.textContent = pct + '%';
}

/* ── NPC Duelo de Reflexión ── */
function showNPCDuel(q) {
  const box = document.getElementById('npcBox');
  document.getElementById('npcQuestion').textContent = q.reflection;
  document.getElementById('reflectionResponse').style.display = 'none';

  // Generar opciones NPC a partir de las respuestas de reflexión de la pregunta
  const optsEl = document.getElementById('npcOpts');
  const npcOptions = [
    { type: 'yes',     text: q.reflection_yes_short     || '✅ Entiendo — el error tiene sentido ahora' },
    { type: 'partial', text: q.reflection_partial_short  || '🤔 Entendí algo, pero necesito repasar' },
    { type: 'no',      text: q.reflection_no_short       || '❌ No lo veo aún, necesito más contexto' }
  ];

  optsEl.innerHTML = npcOptions.map((o, i) =>
    `<button class="npc-opt" onclick="answerNPC('${o.type}',this,${i})">${o.text}</button>`
  ).join('');

  box.style.display = 'flex';
}

/* ── Responder NPC (Duelo de Reflexión) ── */
function answerNPC(type, btn, idx) {
  // Deshabilitar todos los botones NPC
  document.querySelectorAll('.npc-opt').forEach(b => b.disabled = true);
  btn.classList.add(type === 'yes' ? 'chosen-correct' : 'chosen-wrong');

  const q   = state.questions[state.currentIdx];
  const res = document.getElementById('reflectionResponse');

  const msgs = {
    yes:     { text: q.reflection_yes,     bg: '#0d2e1a', border: '#22c55e', recover: true  },
    partial: { text: q.reflection_partial, bg: '#1a1200', border: '#f97316', recover: false },
    no:      { text: q.reflection_no,      bg: '#1a0a0a', border: '#ef4444', recover: false }
  };
  const m = msgs[type];

  res.style.cssText = `display:block;background:${m.bg};border-left:3px solid ${m.border};
    border-radius:0 8px 8px 0;padding:10px 14px;margin-top:10px;
    font-size:.85rem;color:#c8d8e8;line-height:1.6`;
  res.textContent = m.text;

  // Si entiende (´yes´), recupera energía (Potion)
  if (type === 'yes') {
    const ecfg    = ENERGY_CONFIG[state.diff];
    const recover = ecfg.recover;
    const prev    = state.energy;
    state.energy  = Math.min(100, state.energy + recover);
    state.npcYesCount++;
    updateEnergyBar();
    if (state.energy > prev) showPotionToast(recover);
  }

  // Guardar reflexión en sesión global
  if (window.ECGSession) {
    const s = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
    if (s.quizEvents && s.quizEvents.length > 0) {
      const labels = { yes: 'Sí entendí', partial: 'Más o menos', no: 'No lo veo' };
      for (let i = s.quizEvents.length - 1; i >= 0; i--) {
        if (s.quizEvents[i].pregunta_num === state.currentIdx + 1) {
          s.quizEvents[i].reflexion_elegida = labels[type] || type;
          break;
        }
      }
      sessionStorage.setItem('ecg_session', JSON.stringify(s));
    }
  }
}

/* ── Toast de Potion (recuperación de energía) ── */
function showPotionToast(amount) {
  const t = document.createElement('div');
  t.className = 'potion-toast';
  t.innerHTML = `🦪 <span>+${amount}% Energía recuperada — ¡La reflexión te cura!</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* answerReflection — compatibilidad (ya no se usa en el NPC, pero se conserva) */
function answerReflection(type, btn) { answerNPC(type, btn, 0); }

/* ── Siguiente pregunta ── */
function nextQuestion() {
  state.currentIdx++;
  if (state.currentIdx >= state.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

/* ── Perder vida ── */
function loseLife() {
  state.lives--;
  renderLives();
  if (state.lives <= 0) {
    clearInterval(state.timerInterval);
    state.answered = true;  // bloquear nuevos intentos mientras aparece game over
    // Deshabilitar todas las opciones para que no sigan respondiendo
    document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
    const fitbBtn = document.querySelector('.fitb-btn');
    if (fitbBtn) fitbBtn.disabled = true;
    setTimeout(showGameOver, 1800);  // dar tiempo a ver el último feedback
  }
}

function renderLives() {
  const total = DIFF_CONFIG[state.diff].lives;
  const el    = document.getElementById('hudLives');
  if (!el) return;
  let html = '';
  for (let i = 0; i < total; i++) {
    html += `<span class="life${i >= state.lives ? ' lost' : ''}">❤️</span>`;
  }
  el.innerHTML = html;
}

/* ── Actualizar HUD ── */
function updateHUD() {
  document.getElementById('hudPoints').textContent = state.points;

  const streakEl = document.getElementById('hudStreak');
  streakEl.textContent = state.streak;
  if (state.streak > 0) {
    streakEl.classList.add('active');
    setTimeout(() => streakEl.classList.remove('active'), 600);
  }

  const total = state.questions.length;
  const done  = state.currentIdx;
  document.getElementById('hudProgFill').style.width = `${(done/total)*100}%`;
  document.getElementById('hudProgLabel').textContent = `Pregunta ${done+1} de ${total}`;
}

/* ── Puntos flotantes ── */
function floatPoints(text, isGood) {
  const el  = document.createElement('div');
  el.className   = 'float-points';
  el.textContent = text;
  el.style.color = isGood ? '#22c55e' : '#ef4444';
  el.style.left  = `${40 + Math.random() * 20}%`;
  el.style.top   = '80px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/* ── Game Over ── */
function showGameOver() {
  document.getElementById('screen-quiz').style.display    = 'none';
  document.getElementById('quizHud').style.display        = 'none';
  document.getElementById('screen-gameover').style.display= 'block';
  document.getElementById('goPoints').textContent = state.points + ' pts';
  state.totalTime = Math.floor((Date.now() - state.startTime) / 1000);
}

/* ── Calcular y mostrar insignias ganadas ── */
function checkBadges() {
  state.energyFinal = state.energy;
  const earned = ALL_BADGES.filter(b => {
    try { return b.check(state); } catch { return false; }
  });
  state.earnedBadges = earned.map(b => b.id);

  // Persistir en localStorage junto con las ya ganadas anteriormente
  const prev = loadEarnedBadges();
  const merged = [...new Set([...prev, ...state.earnedBadges])];
  saveEarnedBadges(merged);
  return earned;
}

/* ── Resultado final ── */
function showResult() {
  clearInterval(state.timerInterval);
  state.totalTime = Math.floor((Date.now() - state.startTime) / 1000);
  state.energyFinal = state.energy;
  const pct = Math.round(state.correctCount / state.questions.length * 100);

  document.getElementById('screen-quiz').style.display   = 'none';
  document.getElementById('quizHud').style.display       = 'none';
  document.getElementById('screen-result').style.display = 'block';

  // Mensaje según energía final + acierto
  let icon, title, sub;
  const eng = state.energyFinal;
  if      (pct >= 90 && eng >= 80) { icon='🏆'; title='¡Maestro de Conducción!'; sub='Dominaste el capítulo con alta energía y precisión.'; }
  else if (pct >= 90)              { icon='🎯'; title='¡Gran dominio!'; sub='Acertaste casi todo, aunque el potencial de acción quedó bajo.'; }
  else if (pct >= 70 && eng >= 60) { icon='📚'; title='¡Buen ritmo!'; sub='Buen manejo, con espacio para mejorar la eficiencia.'; }
  else if (pct >= 70)              { icon='💪'; title='¡Resististe!'; sub='Acertaste la mayoría, pero los errores te costaron energía.'; }
  else if (pct >= 50)              { icon='📡'; title='Señal débil'; sub='Necesitas repasar los conceptos clave del capítulo.'; }
  else                             { icon='🔋'; title='Potencial bajo'; sub='El capítulo necesita otro repaso completo antes del siguiente quiz.'; }

  document.getElementById('resultIcon').textContent  = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent   = sub;
  document.getElementById('resultScore').textContent = state.points;

  // Barra de energía final
  const engPct = Math.round(state.energyFinal);
  document.getElementById('resultEnergyBar').style.width = engPct + '%';
  document.getElementById('resultEnergyBar').style.background =
    engPct > 60 ? 'linear-gradient(90deg,#22c55e,#84cc16)'
    : engPct > 30 ? 'linear-gradient(90deg,#f97316,#fbbf24)'
    : 'linear-gradient(90deg,#ef4444,#f97316)';
  document.getElementById('resultEnergyPct').textContent =
    `Potencial de Acción restante: ${engPct}%`;

  // Insignias
  const earned = checkBadges();
  const grid   = document.getElementById('resultBadgesGrid');
  if (earned.length === 0) {
    grid.innerHTML = `<p style="color:#607080;font-size:.85rem">No ganaste insignias esta partida. ¡Sigue practicando!</p>`;
  } else {
    grid.innerHTML = earned.map(b =>
      `<div class="badge-chip earned">
        <span class="badge-icon">${b.icon}</span>
        <div><div class="badge-name">${b.name}</div>
        <div style="font-size:.7rem;color:#a78bfa;margin-top:1px">${b.desc}</div></div>
      </div>`
    ).join('');
  }

  // Stats
  const totalIntentosFallidos = Object.values(state.intentosPorPregunta)
    .reduce((acc, v) => acc + v, 0);
  document.getElementById('rCorrect').textContent = state.correctCount;
  document.getElementById('rWrong').textContent   = totalIntentosFallidos;
  document.getElementById('rStreak').textContent  = state.bestStreak;
  document.getElementById('rTime').textContent    = state.totalTime + 's';

  // Desglose
  const bd = document.getElementById('resultBreakdown');
  bd.innerHTML = state.log.map(l => {
    const intentos = l.intentos || 1;
    const badge = intentos === 1
      ? `<span style="font-size:.72rem;color:#22c55e;margin-left:6px">✨ 1er intento</span>`
      : `<span style="font-size:.72rem;color:#f97316;margin-left:6px">⚠️ ${intentos} intentos</span>`;
    return `
    <div class="rb-row">
      <span class="rb-icon">✅</span>
      <span class="rb-text"><strong>${l.qText}</strong>${badge}<br/>
        <span style="color:#607080;font-size:.8rem">Respuesta correcta: ${l.answer}</span>
      </span>
      <span class="rb-pts pos">+${l.pts}</span>
    </div>`;
  }).join('');
}

/* ── Ficha de Personaje ── */
function showCharacterSheet() {
  if (document.getElementById('char-modal-overlay')) return;

  const allEarned  = loadEarnedBadges();
  const id         = window.ECGSession ? window.ECGSession.getIdentity() : { nombre: 'Estudiante', matricula: '' };
  const nivel       = allEarned.length >= 5 ? 'Especialista ECG' :
                      allEarned.length >= 3 ? 'Residente Cardíaco' :
                      allEarned.length >= 1 ? 'Interno Aprendiz' : 'Novato';
  const engColor    = state.energyFinal >= 80 ? 'linear-gradient(90deg,#22c55e,#84cc16)'
                    : state.energyFinal >= 40 ? 'linear-gradient(90deg,#f97316,#fbbf24)'
                    : 'linear-gradient(90deg,#ef4444,#f97316)';

  const overlay = document.createElement('div');
  overlay.id    = 'char-modal-overlay';
  overlay.className = 'char-modal-overlay';
  overlay.innerHTML = `
    <div class="char-modal">
      <div class="char-header">
        <div class="char-avatar">🧑‍⚕️</div>
        <div class="char-name">${id.nombre || 'Estudiante'}</div>
        ${id.matricula ? `<div style="color:#607080;font-size:.82rem;margin-bottom:6px">${id.matricula}</div>` : ''}
        <span class="char-level">🎮 ${nivel}</span>
      </div>

      <div class="char-energy-section">
        <div class="char-energy-label">⚡ Potencial de Acción (esta partida)</div>
        <div class="char-energy-bar">
          <div class="char-energy-fill" style="width:${state.energyFinal}%;background:${engColor}"></div>
        </div>
        <div style="font-size:.78rem;color:#607080;margin-top:4px">${Math.round(state.energyFinal)}% restante</div>
      </div>

      <div class="char-stats-grid">
        <div class="char-stat">
          <span class="char-stat-num">${state.correctCount || 0}</span>
          <span class="char-stat-label">Respuestas correctas</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.bestStreak || 0}</span>
          <span class="char-stat-label">Mejor racha</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.points || 0}</span>
          <span class="char-stat-label">Puntos de conducción</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.npcYesCount || 0}</span>
          <span class="char-stat-label">Reflexiones superadas</span>
        </div>
      </div>

      <div class="char-badges-title">🏅 Insignias desbloqueadas (acumuladas)</div>
      <div class="badges-grid">
        ${ALL_BADGES.map(b => {
          const ok = allEarned.includes(b.id);
          return `<div class="badge-chip ${ok ? 'earned' : ''}">
            <span class="badge-icon">${b.icon}</span>
            <div>
              <div class="badge-name">${b.name}</div>
              ${ok
                ? `<div style="font-size:.68rem;color:#86efac">✅ Desbloqueada</div>`
                : `<div class="badge-locked">${b.desc.substring(0,45)}…</div>`
              }
            </div>
          </div>`;
        }).join('')}
      </div>

      <button class="char-close-btn" onclick="document.getElementById('char-modal-overlay').remove()">
        <i class="fas fa-times"></i> Cerrar Ficha
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* ── Reiniciar ── */
function restartQuiz() {
  document.getElementById('screen-gameover').style.display = 'none';
  document.getElementById('screen-result').style.display   = 'none';
  document.getElementById('screen-start').style.display    = 'block';
  document.getElementById('quizHud').style.display         = 'none';
}

/* ── Exportar CSV de la sesión ── */
function exportarCSV() {
  if (window.ECGSession) {
    window.ECGSession.exportCSV();
  } else {
    alert('No hay datos de sesión guardados. Asegúrate de identificarte en la portada primero.');
  }
}
