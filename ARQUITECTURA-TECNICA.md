# Arquitectura Técnica — Guía de Electrocardiografía
## Libro Digital Gamificado · FISIOUANL · 2025

> Este documento es el **registro definitivo** de la arquitectura que está funcionando correctamente.  
> Úsalo como referencia para replicar el sistema en nuevos capítulos o para diagnosticar futuros problemas.

---

## 1. Visión General del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    LIBRO DIGITAL ECG                        │
│                                                             │
│  index.html ──► chapter-1..6.html ──► quiz-1.html          │
│       │                │                    │               │
│       │          ecg-monitor.html    autopercepcion.html    │
│       │                                     │               │
│       └──────────── js/session.js ◄─────────┘               │
│                          │                                   │
│                    sessionStorage                           │
│                    localStorage                             │
└─────────────────────────────────────────────────────────────┘
```

**Stack tecnológico:**  
- HTML5 + CSS3 + JavaScript ES6+ (sin frameworks, sin bundlers)
- Google Fonts (Inter + Roboto Mono)
- Font Awesome 6.4 (CDN)
- `localStorage` / `sessionStorage` para persistencia

---

## 2. Mapa Completo de Archivos

```
📁 raíz del proyecto
│
├── index.html                → Portada + modal de identidad
├── chapter-1.html            → Cap.1 Fundamentos + 2 autopercep. inline
├── chapter-2.html            → Cap.2 Anatomía de Derivaciones
├── chapter-3.html            → Cap.3 Componentes del Trazado
├── chapter-4.html            → Cap.4 Metodología Sistemática
├── chapter-5.html            → Cap.5 Patologías y Patrones
├── chapter-6.html            → Cap.6 Talleres de Práctica
│
├── quiz-1.html               → Quiz Gamificado Cap.1 ⭐ ARQUITECTURA CLAVE
├── ecg-monitor.html          → Monitor ECG animado (Canvas)
├── autopercepcion.html       → Escala Likert + historial
├── descargar.html            → Página de descarga ZIP
│
├── css/
│   └── style.css             → Tema global (claro/oscuro + modal Enviar)
│
├── js/
│   ├── main.js               → Navegación, búsqueda, TOC, tema + Sistema de Envío
│   ├── session.js            → Módulo de sesión (identidad, clave: 'identity')
│   └── likert.js             → Componente Likert interactivo
│
├── README.md                 → Documentación funcional del proyecto
├── ARQUITECTURA-TECNICA.md   → Este archivo
├── MANUAL-GOOGLE-SHEETS.md   → Guía Apps Script paso a paso
└── INSTRUCCIONES-GITHUB-NETLIFY.md
```

---

## 3. Arquitectura del Quiz Gamificado (`quiz-1.html`)

Esta es la pieza más compleja del sistema. Todo vive en **un solo archivo HTML** con CSS inline y JS al final.

### 3.1 Estructura HTML del archivo

```
quiz-1.html
│
├── <head>
│   ├── Links CDN (fonts, fontawesome)
│   └── <style> — TODO el CSS del quiz (inline, ~550 líneas)
│
├── <body>
│   ├── <header class="site-header">  ← igual en todas las páginas
│   ├── <div class="overlay">         ← para sidebar móvil
│   ├── <div class="layout">
│   │   ├── <nav class="sidebar">     ← igual en todas las páginas
│   │   └── <main class="main-content">
│   │       │
│   │       ├── <!-- HUD --> div#quizHud  ← BARRA SUPERIOR DE ESTADO
│   │       │   ├── #hudPoints (⭐ puntos)
│   │       │   ├── #hudTimer  (⏱ segundos)
│   │       │   ├── #hudStreak (🔥 racha)
│   │       │   ├── #hudLives  (❤️ vidas) ⚠️ CRÍTICO — debe existir
│   │       │   ├── .energy-hud → #energyFill / #energyPct
│   │       │   └── .hud-progress → #hudProgFill / #hudProgLabel
│   │       │
│   │       └── div.quiz-wrap
│   │           ├── #screen-start   ← pantalla inicial
│   │           ├── #screen-quiz    ← pantalla de juego
│   │           │   ├── #qCard
│   │           │   │   ├── #qTypeBadge
│   │           │   │   ├── #qText
│   │           │   │   └── #qBody  ← se inyecta MCQ o FITB
│   │           │   ├── #clinicalBox   ← consecuencia clínica (oculto por defecto)
│   │           │   ├── #feedbackPanel ← feedback correcto/incorrecto
│   │           │   │   ├── #fbIcon, #fbTitle, #fbPoints
│   │           │   │   ├── #fbCorrectAnswer  (oculto por defecto)
│   │           │   │   ├── #fbWhy → #fbWhyText  (oculto por defecto)
│   │           │   │   ├── #npcBox → Dr. ECG (oculto por defecto)
│   │           │   │   │   ├── #npcQuestion
│   │           │   │   │   ├── #npcOpts    ← se inyectan dinámicamente
│   │           │   │   │   └── #reflectionResponse
│   │           │   │   └── #fbRetryHint  ← se crea dinámicamente
│   │           │   └── #btnNext  ← habilitado solo al acertar
│   │           ├── #screen-gameover
│   │           └── #screen-result
│   │
│   └── <script src="js/session.js">
│       <script src="js/main.js">
│       <script> ← TODO el JS del quiz (inline, ~860 líneas)
```

---

### 3.2 Flujo de Estado del Quiz

```
startQuiz()
    │
    ▼
renderQuestion()  ◄──────────────────────────────────────┐
    │                                                     │
    ├── Limpia: feedbackPanel, fbCorrectAnswer,           │
    │           fbWhy, npcBox, reflectionResponse,        │
    │           clinicalBox, fbRetryHint                  │
    ├── Inyecta HTML de opciones MCQ o input FITB         │
    ├── updateHUD()                                       │
    ├── state.answered = false                            │
    └── startTimer(cfg.time)                              │
                                                          │
         Usuario responde                                 │
              │                                           │
    ┌─────────┴──────────┐                                │
    ▼                    ▼                                │
answerMCQ()          answerFITB()                         │
    │                    │                                │
    └────────┬───────────┘                                │
             ▼                                            │
       ¿Es correcta?                                      │
             │                                            │
    ┌────────┴────────┐                                   │
    ▼ SÍ              ▼ NO                                │
                                                          │
clearInterval()    showFeedbackWrong()  ← PRIMERO         │
state.answered=true    │                                  │
                   loseLife()           ← DESPUÉS         │
processAnswer(true)    │                                  │
    │              ¿vidas > 0?                            │
    │                  │                                  │
    │              startTimer(retryTime) ← 60% del tiempo │
    ▼                                                     │
showFeedbackCorrect()                                     │
btnNext.disabled = false                                  │
                                                          │
         Usuario hace click en "Siguiente"                │
                   nextQuestion()                         │
                        │                                 │
               ¿Más preguntas?                            │
               ├── SÍ ──────────────────────────────────►┘
               └── NO ──► showResult()
```

---

### 3.3 Variables de Estado Globales

```javascript
let state = {
  diff:              'medio',    // 'suave' | 'medio' | 'intenso'
  questions:         [],         // 10 preguntas aleatorias del banco
  currentIdx:        0,          // índice de pregunta actual (0-9)
  points:            0,          // puntos acumulados
  lives:             3,          // vidas restantes
  streak:            0,          // racha actual de correctas
  bestStreak:        0,          // mejor racha de la partida
  correctCount:      0,          // preguntas acertadas
  wrongCount:        0,          // total de respuestas incorrectas
  timeLeft:          30,         // segundos restantes del timer
  timerInterval:     null,       // referencia al setInterval
  answered:          false,      // ⚠️ CRÍTICO — bloquea respuestas duplicadas
  startTime:         null,       // Date.now() al iniciar
  totalTime:         0,          // segundos totales al terminar
  log:               [],         // array de {qText, correct, pts, answer, intentos, topic, tiempoUsado}
  intentosPorPregunta: {},       // { [idx]: número } — intentos fallidos por pregunta
  energy:            100,        // barra de "Potencial de Acción" (0-100)
  energyFinal:       100,        // energía al terminar (para insignias)
  npcYesCount:       0,          // veces que eligió "Sí entendí" en el NPC
  earnedBadges:      []          // insignias ganadas esta partida
}
```

---

### 3.4 Configuración de Dificultad

```javascript
const DIFF_CONFIG = {
  suave:   { time: 60, lives: 3, bonus_mult: 1.0 },
  medio:   { time: 30, lives: 3, bonus_mult: 1.5 },
  intenso: { time: 15, lives: 2, bonus_mult: 2.0 }
};

const ENERGY_CONFIG = {
  suave:   { loss: 15, recover: 7  },
  medio:   { loss: 20, recover: 10 },
  intenso: { loss: 30, recover: 12 }
};
```

---

### 3.5 Estructura de Cada Pregunta (QUESTIONS array)

```javascript
{
  type:    'mcq' | 'fitb',     // múltiple opción | completar espacio
  q:       'Texto de la pregunta…',
  topic:   'ion' | 'vector' | 'tiempo' | 'general',  // para insignias

  // Solo MCQ:
  opts:    { A: '…', B: '…', C: '…', D: '…' },
  answer:  'B',                // letra correcta

  // Solo FITB:
  answer:      '0.20',         // respuesta exacta
  alt_answers: ['0,20', '0.2', '200 ms', …],  // variantes aceptadas

  // Retroalimentación educativa por opción incorrecta:
  why_wrong: {
    A: 'Explicación de por qué A está mal…',
    B: '…',   // (solo las opciones incorrectas)
    D: '…'
    // Para FITB: why_wrong es un string único
  },

  // NPC Dr. ECG — reflexión metacognitiva:
  reflection:         '¿Pregunta de reflexión para el estudiante?',
  reflection_yes:     'Respuesta si eligió "Sí entendí" …',
  reflection_partial: 'Respuesta si eligió "Más o menos" …',
  reflection_no:      'Respuesta si eligió "No lo veo" …',

  // Atajos opcionales para los botones del NPC:
  reflection_yes_short:     '✅ Texto corto para el botón',
  reflection_partial_short: '🤔 Texto corto para el botón',
  reflection_no_short:      '❌ Texto corto para el botón',

  // Consecuencia clínica opcional (aparece en banner especial):
  clinical_consequence: '<strong>⚠️ Error clínico:</strong> explicación…',

  points: 100   // puntos base (80 para FITB de cálculo)
}
```

---

### 3.6 Funciones JavaScript y sus Responsabilidades

| Función | Descripción | ⚠️ Notas críticas |
|---|---|---|
| `setDiff(d)` | Cambia dificultad y actualiza UI | — |
| `startQuiz()` | Inicializa estado, baraja preguntas, muestra HUD | Llama `renderLives()` — necesita `#hudLives` en el DOM |
| `shuffle(arr)` | Fisher-Yates in-place | — |
| `renderQuestion()` | Limpia todo y renderiza la pregunta actual | Debe limpiar `fbRetryHint` manualmente (creado dinámicamente) |
| `startTimer(s)` | Inicia countdown con `setInterval` | Siempre llama `clearInterval` primero para evitar timers dobles |
| `updateTimerUI()` | Actualiza display y clases warning/danger | — |
| `timeOut()` | Al agotarse el tiempo: revela respuesta, habilita Siguiente | No llama `startTimer()` de nuevo — el alumno avanza directamente |
| `answerMCQ(key,btn)` | Valida opción MCQ | **Solo detiene el timer si es correcta.** Si es incorrecta, el timer sigue |
| `answerFITB()` | Valida input de texto | Si es incorrecta: flash rojo, limpia input, foco de vuelta |
| `processAnswer(correct,given,q)` | Calcula puntos, actualiza estado, llama feedback | **Orden crítico en error:** `showFeedbackWrong()` → `loseLife()` → `startTimer()` |
| `showFeedbackCorrect(pts,q)` | Muestra panel verde con título dinámico | Aplica clase `.correct` al `feedbackPanel` (activa CSS `display:block`) |
| `showFeedbackWrong(pts,given,q)` | Muestra panel rojo + explicación por opción + NPC | Crea `#fbRetryHint` dinámicamente si no existe |
| `showClinicalConsequence(text)` | Muestra banner clínico | Solo si `q.clinical_consequence` existe |
| `showNPCDuel(q)` | Renderiza el diálogo del Dr. ECG | Inyecta botones NPC en `#npcOpts` |
| `answerNPC(type,btn,idx)` | Procesa respuesta del NPC | Si `type==='yes'` recupera energía y muestra potion toast |
| `showPotionToast(amount)` | Toast flotante de recuperación de energía | Se auto-elimina a los 3s |
| `answerReflection(type,btn)` | Alias de `answerNPC` | Compatibilidad con HTML antiguo |
| `nextQuestion()` | Avanza índice → `renderQuestion()` o `showResult()` | — |
| `loseLife()` | Decrementa `state.lives`, llama `renderLives()` | Si `lives=0`: pone `state.answered=true`, deshabilita botones, `setTimeout(showGameOver, 1800)` |
| `renderLives()` | Actualiza corazones en `#hudLives` | **`#hudLives` debe existir en el DOM** — sin él toda la app se rompe silenciosamente |
| `updateHUD()` | Actualiza puntos, racha, barra de progreso | — |
| `updateEnergyBar()` | Actualiza barra de Potencial de Acción | Aplica clases `.low` / `.crit` según porcentaje |
| `floatPoints(text,isGood)` | Animación de puntos flotantes | Se auto-elimina a los 1.3s |
| `showGameOver()` | Muestra pantalla de fin de vidas | Guarda `totalTime` |
| `showResult()` | Muestra pantalla final con stats, insignias, desglose | Llama `checkBadges()` |
| `checkBadges()` | Evalúa insignias ganadas, persiste en localStorage | — |
| `showCharacterSheet()` | Modal de Ficha de Personaje | Crea overlay dinámicamente |
| `restartQuiz()` | Vuelve a pantalla de inicio | — |
| `exportarCSV()` | Llama `ECGSession.exportCSV()` | Avisa si no hay sesión activa |

---

### 3.7 CSS — Cómo Funciona el Panel de Feedback

El `#feedbackPanel` es **siempre oculto por defecto** con `display:none`.  
Se activa **vía clase CSS** (no vía `style.display`):

```css
.feedback-panel           { display: none; }  /* base: oculto */
.feedback-panel.correct   { display: block; background: #0d2e1a; }
.feedback-panel.wrong     { display: block; background: #1a0a0a; }
```

Por eso al limpiar en `renderQuestion()` se hace:
```javascript
const fp = document.getElementById('feedbackPanel');
fp.className     = 'feedback-panel';    // remueve .correct / .wrong → CSS oculta
fp.style.display = 'none';             // fuerza reset del inline style
```

Y al mostrar feedback:
```javascript
fp.className     = 'feedback-panel correct';  // CSS activa display:block
fp.style.display = '';                         // limpia el inline style de override
```

---

## 4. Sistema de Autopercepción Inline (`chapter-1.html`)

Las marcas de autopercepción son componentes **auto-contenidos** dentro de cada capítulo. Todo el CSS y JS vive inline en el propio archivo HTML.

### 4.1 Posiciones en Capítulo 1

| Marca | Posición en el contenido | Concepto evaluado |
|---|---|---|
| **Punto 1 de 2** | Justo después de la tabla de fases del potencial de acción | Fases 0–4 e iones responsables |
| **Punto 2 de 2** | Justo después del info-box de vectores/deflexiones | Regla acercamiento/alejamiento/perpendicular |

### 4.2 Anatomia del Componente

```
Dentro del chapter-*.html
│
├── <style> inline ← ~200 líneas de CSS para:
│   ├── .ap-trigger       ← botón disparador full-width con animación de pulso
│   ├── .ap-modal-overlay ← fondo oscuro con backdrop-filter
│   ├── .ap-modal         ← caja del modal con animación de entrada
│   ├── .ap-likert-opt    ← 5 opciones de respuesta
│   └── .ap-response      ← respuesta personalizada tras elegir
│
├── HTML del disparador (en el cuerpo del capítulo)
│   ├── <button class="ap-trigger" onclick="openAPModal('ap1')">
│   ├── <span id="ap1-done">  ← badge "✅ Respondido" (oculto por defecto)
│   └── id según posición: 'ap1' y 'ap2'
│
├── HTML de los modales (al final del body)
│   ├── <div id="ap1-overlay">… escala Likert de 5 niveles …</div>
│   └── <div id="ap2-overlay">… escala Likert de 5 niveles …</div>
│
└── <script> inline al final del body
    ├── AP_RESPONSES = { ap1: {1:…,2:…,3:…,4:…,5:…}, ap2: {…} }  ← 10 textos únicos
    ├── openAPModal(id)        ← añade clase .open al overlay
    ├── closeAPModal(id)       ← quita clase .open
    ├── closeAPModalOnBg(e,id) ← cierra si clic en el fondo
    ├── selectAP(id, level, btn)
    │   ├── Marca opción seleccionada + deshabilita todas
    │   ├── Muestra texto de respuesta personalizado
    │   ├── Muestra badge "✅ Respondido" en el disparador
    │   ├── Llama ECGSession.logLikert() si existe
    │   └── Guarda en localStorage: 'ecg_cap1_ap1' / 'ecg_cap1_ap2'
    └── restoreAPState()       ← IIFE que restaura badges al recargar la página
```

### 4.3 Patrón para agregar marcas en Capítulos 2–6

1. Copiar el bloque `<style>` del `chapter-1.html` al nuevo capítulo
2. Insertar los botones disparadores en posiciones estratégicas del contenido
3. Copiar los dos modales al final del body, cambiar `ap1`/`ap2` → `ap1`/`ap2` (mismo nombre es válido por página)
4. Copiar el bloque `<script>` y ajustar:
   - `AP_RESPONSES.ap1` y `AP_RESPONSES.ap2` con textos del nuevo concepto
   - `conceptMap` con los nombres de concepto del nuevo capítulo
   - `localStorage` keys: `'ecg_cap2_ap1'`, `'ecg_cap2_ap2'` etc.
   - `capitulo: 'Capítulo 2 – ...'` en la llamada a `logLikert()`

---

## 5. Sistema de Envío al Profesor

### 5.1 Flujo completo

```
Alumno hace clic en botón "Enviar" (header)
        │
        ▼
openSendModal()  [main.js]
  └─ Lee sessionStorage('ecg_session')
  └─ Lee localStorage('ecg_identity') como fallback
  └─ Muestra resumen: quiz N, likert N, nombre, hora inicio
        │
        ▼
Alumno hace clic en "Enviar mi sesión"
        │
        ▼
submitSession()  [main.js]
  ├─ Verifica: hay datos (quiz > 0 o likert > 0)
  ├─ Verifica: hay identidad con nombre válido
  │   Lee: session.identity || session.identidad || localStorage('ecg_identity')
  ├─ Construye payload JSON
  ├─ fetch(ENDPOINT, { method:'POST', body: JSON.stringify(payload) })
        │
        ▼ HTTP POST
        │
Google Apps Script  (doPost)
  ├─ Parsea JSON
  ├─ Abre hoja 'Sesiones'
  ├─ Crea encabezados si la hoja está vacía
  ├─ Una fila por quizEvent
  ├─ Una fila por likertEvent
  └─ Responde { ok: true, filas: N }
        │
        ▼
submitSession recibe respuesta
  ├─ ok: true  → muestra "✅ Sesión enviada"
  └─ ok: false → muestra "Error" + texto
```

### 5.2 Estructura del Payload JSON enviado

```javascript
{
  timestamp:    '2025-03-29T16:31:00.000Z',  // momento del envio
  nombre:       'Ana García',
  matricula:    '2150234',
  inicio:       '2025-03-29T15:45:00.000Z',  // inicio de la sesión

  quizEvents: [
    {
      tipo:                'quiz',
      timestamp:           '...',
      capitulo:            'Capítulo 1 – Fundamentos Fisiológicos',
      pregunta_num:        1,
      pregunta_texto:      '¿Cuál es el potencial de membrana…',
      respuesta_dada:      'B. –90 mV',
      fue_correcta:        'SI',          // string, no boolean
      respuesta_correcta:  'B. –90 mV',
      tiempo_seg:          12,
      reflexion_elegida:   'Sí entendí',  // vacío si fue correcta a la primera
      puntos:              145,
      racha:               1
    },
    // ... más eventos
  ],

  likertEvents: [
    {
      tipo:        'autopercepcion',
      timestamp:   '...',
      capitulo:    'Capítulo 1 – Fundamentos Fisiológicos',
      concepto:    'Potencial de Acción Cardíaco (fases e iones)',
      nivel_num:   4,
      nivel_texto: 'Con pequeñas dudas'
    }
  ],

  resumen: [
    { capitulo: 'Capítulo 1…', correctas: 8, total: 10, pct: '80%', puntos: 920 }
  ]
}
```

### 5.3 Elementos del DOM del Modal de Envío

| ID | Descripción | Controlado por |
|---|---|---|
| `btnSendSession` | Botón "Enviar" en el header | HTML de cada página |
| `sendModalOverlay` | Overlay del modal | `injectSendModal()` (IIFE en main.js) |
| `sendStatQuiz` | Contador de respuestas quiz | `openSendModal()` |
| `sendStatLikert` | Contador de autopercepción | `openSendModal()` |
| `sendStatName` | Nombre del alumno (solo primer nombre) | `openSendModal()` |
| `sendStatTime` | Hora de inicio de la sesión | `openSendModal()` |
| `sendStatus` | Mensaje de estado (loading/success/error) | `submitSession()` |
| `sendBtn` | Botón "Enviar mi sesión" | `submitSession()` |

### 5.4 Dónde cambiar el ENDPOINT

```javascript
// js/main.js — línea ~368
// Cambiar esta línea con la URL real del Apps Script:
const ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```

Ver `MANUAL-GOOGLE-SHEETS.md` para obtener esa URL.

### 5.5 Comportamiento del botón "Enviar" en el header

- **Normal** (sin datos): fondo semitransparente blanco
- **has-data** (hay quiz o likert registrados): fondo verde — clase `.has-data` activada por `updateSendBtnIndicator()`
- `updateSendBtnIndicator()` se llama en `DOMContentLoaded` y en `visibilitychange` (cuando el alumno regresa a la pestaña)

---

## 6. Módulo de Sesión (`js/session.js`)

### 4.1 Almacenamiento

| Clave | Dónde | Qué guarda | Duración |
|---|---|---|---|
| `ecg_identity` | `localStorage` | `{ nombre, matricula }` | Permanente |
| `ecg_session` | `sessionStorage` | `{ identity, startTime, quizEvents[], likertEvents[] }` | Mientras la pestaña está abierta |
| `ecg_badges_cap1` | `localStorage` | Array de IDs de insignias ganadas | Permanente |

### Google Sheets — Estructura de pestañas

| Pestaña | Color encabezado | Columnas principales |
|---|---|---|
| `Quizes` | 🔵 Azul (`#1565c0`) | Timestamp, Nombre, Matricula, Capitulo, Pregunta, Respuesta_Dada, Fue_Correcta, Puntos, Racha |
| `Autopercepcion` | 🟢 Verde (`#2e7d32`) | Timestamp, Nombre, Matricula, Capitulo, Concepto, Nivel_Num, Nivel_Texto |

### 4.2 API Pública (`window.ECGSession`)

```javascript
ECGSession.isIdentified()          // → boolean
ECGSession.getIdentity()           // → { nombre, matricula }
ECGSession.saveIdentity(n, m)      // guarda en localStorage + sessionStorage
ECGSession.logQuizAnswer({         // registra una respuesta de quiz
  capitulo, pregunta_num, pregunta_texto,
  respuesta_dada, fue_correcta, respuesta_correcta,
  tiempo_seg, reflexion_elegida, puntos, racha
})
ECGSession.logLikert({             // registra un evento Likert
  capitulo, concepto, nivel_num, nivel_texto
})
ECGSession.calcAprovechamiento()   // → array por capítulo con stats
ECGSession.exportCSV()             // descarga ECG_<matricula>_<fecha>.csv
ECGSession.clearSession()          // limpia sessionStorage
ECGSession.showIdentityModal()     // muestra modal de identificación
ECGSession.renderIdentityBadge()   // muestra badge en el header
```

### 4.3 Cómo Integrar `session.js` en una Nueva Página

```html
<!-- 1. Cargar ANTES de main.js y del script de la página -->
<script src="js/session.js"></script>
<script src="js/main.js"></script>

<!-- 2. Registrar una respuesta de quiz -->
<script>
if (window.ECGSession) {
  window.ECGSession.logQuizAnswer({
    capitulo: 'Capítulo 2 – Anatomía de Derivaciones',
    pregunta_num: 1,
    pregunta_texto: q.q,
    respuesta_dada: dada,
    fue_correcta: true,
    respuesta_correcta: q.opts[q.answer],
    tiempo_seg: tiempoUsado,
    reflexion_elegida: '',   // se actualiza luego en answerNPC()
    puntos: pts,
    racha: state.streak
  });
}
</script>
```

---

## 7. Patrón para Crear un Nuevo Quiz (Capítulos 2–6)

Para crear `quiz-2.html` siguiendo exactamente la misma arquitectura:

### Paso 1 — Copiar quiz-1.html
```
cp quiz-1.html quiz-2.html
```

### Paso 2 — Cambiar metadatos en el `<head>`
```html
<title>Quiz Cap. 2 – Anatomía de Derivaciones | Guía ECG</title>
```

### Paso 3 — Actualizar la sidebar (clase `active`)
```html
<a href="chapter-2.html" class="nav-link active">
```

### Paso 4 — Cambiar el título en `#screen-start`
```html
<div class="qs-title">Quiz — Capítulo 2</div>
<div class="qs-sub">Anatomía de las Derivaciones…</div>
```

### Paso 5 — Reemplazar el array QUESTIONS con las preguntas del nuevo capítulo
Cada pregunta debe seguir la **estructura completa** definida en la sección 3.5:
- `type`, `q`, `opts`, `answer` (campos base)
- `why_wrong` para cada opción incorrecta (clave del aprendizaje)
- `reflection`, `reflection_yes`, `reflection_partial`, `reflection_no`
- `points` (100 para MCQ, 80 para FITB de cálculo)

### Paso 6 — Actualizar el capítulo origen (`logQuizAnswer`)
```javascript
capitulo: 'Capítulo 2 – Anatomía de Derivaciones',
```

### Paso 7 — Actualizar el nombre del badge de localStorage
```javascript
localStorage.getItem('ecg_badges_cap2')
```

### Paso 8 — Agregar el enlace al quiz en `chapter-2.html`
```html
<a href="quiz-2.html" class="btn-primary">
  <i class="fas fa-gamepad"></i> Quiz del Capítulo
</a>
```

---

## 8. Bugs Históricos Resueltos

### Bug #1 — `hudLives` inexistente *(detectado: 2025-03-29)*
**Síntoma:** El quiz no respondía al hacer clic en las opciones. Sin errores visibles en consola.  
**Causa raíz:** `renderLives()` hacía `document.getElementById('hudLives').innerHTML = ...` pero el elemento `#hudLives` nunca existió en el HTML del HUD. El error era silencioso (`TypeError` al acceder `.innerHTML` de `null`).  
**Efecto en cascada:** `startQuiz()` → `renderLives()` → crash silencioso → el estado del quiz nunca se inicializó correctamente → todas las funciones de respuesta fallaban.  
**Solución:** Agregar el div al HUD:
```html
<div class="hud-item" id="hudLivesWrap">
  <span class="hud-icon">❤️</span>
  <div class="lives-display" id="hudLives"></div>
</div>
```
**Lección:** Siempre agregar `if (!el) return;` como guard en funciones que acceden al DOM por ID.

---

### Bug #2 — Orden incorrecto feedback/timer/loseLife *(detectado: 2025-03-29)*
**Síntoma:** En la última vida, el feedback desaparecía y el quiz mostraba Game Over antes de que el alumno pudiera leer la explicación.  
**Causa raíz:** El orden era `loseLife()` → `startTimer()` → `showFeedbackWrong()`. Cuando `loseLife()` ponía `state.answered = true` (última vida), el timer que arrancaba inmediatamente después no tenía a quién servir, y el feedback se mostraba brevemente antes de ser eliminado por el Game Over.  
**Solución:** Reordenar a `showFeedbackWrong()` → `loseLife()` → `startTimer()` (solo si `!state.answered`).  
**Lección:** El feedback siempre debe construirse ANTES de modificar el estado del juego.

---

### Bug #3 — Timer duplicado en respuestas incorrectas *(detectado: sesiones anteriores)*
**Síntoma:** El timer se congelaba o saltaba al hacer clic en una opción incorrecta.  
**Causa raíz:** `clearInterval(state.timerInterval)` se ejecutaba al inicio de `answerMCQ()` independientemente de si era correcta o incorrecta.  
**Solución:** Solo llamar `clearInterval` cuando la respuesta es correcta. En el caso incorrecto, el timer continúa corriendo.

---

### Bug #4 — `identity` vs `identidad` — clave inconsistente *(detectado: 2025-03-29)*
**Síntoma:** El modal de envío decía "necesitas identificarte" aunque el badge del header mostraba el nombre correctamente.  
**Causa raíz:** `session.js` guarda la identidad con la clave `identity` (línea 28 de session.js: `identity: { nombre, matricula }`). El código en `main.js` la buscaba como `identidad` (con **d** al final) — siempre `undefined`.  
**Por qué el badge sí funcionaba:** El badge lo renderiza `session.js` directamente, que sí conoce su propia clave `identity`. El error solo afectaba a `main.js` que intentaba leer el sessionStorage manualmente.  
**Solución:** `main.js` ahora lee con triple fallback:
```javascript
const identidad = sessionData.identity       // clave correcta de session.js
               || sessionData.identidad      // compatibilidad hacia atrás
               || JSON.parse(localStorage.getItem('ecg_identity') || '{}'); // fallback permanente
```
**Lección:** Cuando `main.js` necesite leer datos guardados por `session.js`, usar `ECGSession.getIdentity()` en lugar de leer `sessionStorage` directamente. Evita la dependencia en el nombre exacto de la clave interna.

---

## 9. Reglas de Oro del Proyecto

1. **`#hudLives` debe existir en el HTML antes de llamar `startQuiz()`** — es el elemento más crítico del HUD.

2. **Siempre limpiar el `feedbackPanel` con doble reset:**
   ```javascript
   fp.className = 'feedback-panel';   // quita clases .correct/.wrong
   fp.style.display = 'none';         // sobreescribe cualquier inline style
   ```

3. **El orden correcto en respuesta incorrecta es:**
   `showFeedbackWrong()` → `loseLife()` → `startTimer()` (si quedan vidas)

4. **Nunca detener el timer en una respuesta incorrecta** — el alumno necesita tiempo para leer el feedback y reintentar con el timer como presión natural.

5. **`state.answered = false` en MCQ incorrecta** — el alumno puede y debe intentar de nuevo. Solo se pone `true` cuando acierta o cuando el timer expira.

6. **Cargar `session.js` ANTES que `main.js`** en el orden de scripts.

7. **`#fbRetryHint` no está en el HTML** — se crea dinámicamente en `showFeedbackWrong()` y se debe limpiar manualmente en `renderQuestion()`.

8. **Cada pregunta DEBE tener `why_wrong`** — es el núcleo pedagógico del sistema. Sin él el feedback muestra un texto genérico que no enseña nada.

---

## 10. Glosario de IDs del DOM (Quiz)

| ID | Elemento | Cuándo es visible |
|---|---|---|
| `quizHud` | Barra HUD sticky | Durante el juego (`display:flex`) |
| `hudPoints` | Contador de puntos | Siempre en el HUD |
| `hudTimer` | Countdown en segundos | Siempre en el HUD |
| `hudStreak` | Contador de racha | Siempre en el HUD |
| `hudLives` | Contenedor de corazones ❤️ | Siempre en el HUD |
| `energyFill` | Barra de Potencial de Acción | Siempre en el HUD |
| `energyPct` | Porcentaje de energía | Siempre en el HUD |
| `hudProgFill` | Barra de progreso de preguntas | Siempre en el HUD |
| `hudProgLabel` | "Pregunta X de 10" | Siempre en el HUD |
| `screen-start` | Pantalla de inicio | Antes de empezar |
| `screen-quiz` | Pantalla de juego | Durante el juego |
| `screen-gameover` | Pantalla sin vidas | Al perder todas las vidas |
| `screen-result` | Pantalla de resultados | Al terminar 10 preguntas |
| `qCard` | Tarjeta de pregunta | Durante el juego |
| `qTypeBadge` | Badge "Opción múltiple / Completar espacio" | Durante el juego |
| `qText` | Texto de la pregunta | Durante el juego |
| `qBody` | Contenedor de opciones / input | Durante el juego |
| `feedbackPanel` | Panel de feedback | Tras responder |
| `fbIcon` | Emoji ✅/❌ del feedback | Tras responder |
| `fbTitle` | Título del feedback | Tras responder |
| `fbPoints` | Badge de puntos ganados/perdidos | Tras responder |
| `fbCorrectAnswer` | Cuadro con respuesta correcta | Solo en timeout / correcto-con-intentos |
| `fbWhy` | Bloque "¿Por qué está mal?" | Solo en respuesta incorrecta |
| `fbWhyText` | Texto del why_wrong | Solo en respuesta incorrecta |
| `clinicalBox` | Banner de consecuencia clínica | Si la pregunta tiene `clinical_consequence` |
| `clinicalText` | Texto de la consecuencia | Si la pregunta tiene `clinical_consequence` |
| `npcBox` | Cuadro del Dr. ECG | Solo en respuesta incorrecta |
| `npcQuestion` | Pregunta de reflexión del NPC | Solo en respuesta incorrecta |
| `npcOpts` | Contenedor de botones NPC | Solo en respuesta incorrecta |
| `reflectionResponse` | Respuesta del NPC tras elección | Tras responder al NPC |
| `fbRetryHint` | Hint "Lee y elige otra opción" | Solo en respuesta incorrecta — **creado dinámicamente** |
| `btnNext` | Botón "Siguiente pregunta" | Solo habilitado tras acertar o timeout |
| `resultIcon` | Emoji del resultado final | Pantalla de resultado |
| `resultTitle` | Título del resultado | Pantalla de resultado |
| `resultSub` | Subtítulo del resultado | Pantalla de resultado |
| `resultScore` | Puntos totales | Pantalla de resultado |
| `resultEnergyBar` | Barra de energía final | Pantalla de resultado |
| `resultBadgesGrid` | Grid de insignias ganadas | Pantalla de resultado |
| `rCorrect` | Número de correctas | Pantalla de resultado |
| `rWrong` | Total de intentos fallidos | Pantalla de resultado |
| `rStreak` | Mejor racha | Pantalla de resultado |
| `rTime` | Tiempo total en segundos | Pantalla de resultado |
| `resultBreakdown` | Desglose por pregunta | Pantalla de resultado |
| `goPoints` | Puntos en pantalla Game Over | Pantalla de Game Over |

---

## 11. Índice de Documentos del Proyecto

| Archivo | Propósito | Cuándo consultarlo |
|---|---|---|
| `README.md` | Estado actual del proyecto, funcionalidades, URIs, modelo de datos | Primera revisión general |
| `ARQUITECTURA-TECNICA.md` | Este archivo: arquitectura interna, flujos, bugs, IDs | Al desarrollar o depurar |
| `MANUAL-GOOGLE-SHEETS.md` | Cómo configurar Apps Script para recibir envíos | Al configurar el destino de datos |
| `INSTRUCCIONES-GITHUB-NETLIFY.md` | Cómo desplegar en producción | Al publicar el libro |

---

*Última actualización: 2025-03-29 — Versión estable y funcionando correctamente.*
