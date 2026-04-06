# Guía de Electrocardiografía — Libro Digital

## 🫀 Descripción del Proyecto

Libro digital interactivo sobre Electrocardiografía, construido con **HTML5 + CSS3 + JavaScript puro**. Diseñado para estudiantes de medicina de la FISIOUANL. Incluye sistema gamificado de quizzes, autopercepción del aprendizaje y **envío automático de datos de sesión al profesor vía Google Sheets**.

---

## ✅ Funcionalidades Implementadas

### Libro
- ✅ Página de inicio con animación ECG SVG + tarjetas de capítulos
- ✅ Sidebar de navegación lateral con menú activo automático
- ✅ Modo oscuro/claro con persistencia en `localStorage`
- ✅ Búsqueda full-text en tiempo real sobre todos los capítulos
- ✅ Barra de progreso de lectura
- ✅ Tabla de contenidos lateral por capítulo (TOC sticky)
- ✅ Navegación entre capítulos (anterior / siguiente)
- ✅ Sidebar deslizable en móvil con overlay
- ✅ Diseño completamente responsive (mobile-first)
- ✅ 6 capítulos completos con contenido clínico de ECG

### Sistema de Sesión (`js/session.js`)
- ✅ **Modal de identificación** en la portada (nombre + matrícula)
- ✅ **Badge de identidad** en el header de todas las páginas
- ✅ Identidad persistente via `localStorage` (se mantiene entre sesiones)
- ✅ Datos de sesión en `sessionStorage` (quiz + Likert durante la sesión)
- ✅ Registro de autopercepción desde `likert-engine.js` cuando existe contenedor Likert
- ✅ Resumen de aprovechamiento por capítulo calculado en cliente

### Sistema de Envío al Profesor (`js/main.js` — `submitSession`)
- ✅ **Botón "Enviar"** visible en el header de **todas las páginas** (junto al 🌙)
- ✅ Se pone **verde** automáticamente cuando detecta actividad registrada en la sesión
- ✅ Modal con resumen de sesión: respuestas de quiz, autopercepción, nombre del alumno, hora de inicio
- ✅ Botón ✕ para cerrar el modal de forma intuitiva
- ✅ Validación de identidad antes de enviar (lee `localStorage` como fallback)
- ✅ Envío via HTTP POST a **Google Apps Script** → registra filas en Google Sheets automáticamente
- ✅ Compatible con cualquier dominio (CORS abierto en el Apps Script)
- 🔧 **Pendiente:** reemplazar `ENDPOINT` en `js/main.js` con tu URL real de Apps Script

### Quiz Gamificado (Cap. 1 — `quiz-1.html`)
- ✅ Banco de 15 preguntas (opción múltiple + completar espacio)
- ✅ 10 preguntas aleatorias por partida
- ✅ Tres niveles de dificultad: Suave / Medio / Intenso
- ✅ Sistema de vidas (❤️), racha, puntos y bono de velocidad
- ✅ Feedback por opción incorrecta (por qué esa opción está mal) — campo `why_wrong` por opción
- ✅ NPC Dr. ECG con pregunta de reflexión metacognitiva tras cada error
- ✅ No se avanza hasta acertar — reintentos ilimitados con penalización de puntos y energía
- ✅ Prevención de selección múltiple (solo una opción marcada por intento)
- ✅ Limpieza de estados en reintento (botones re-habilitados)
- ✅ Clase visual `selected` para resaltar la opción elegida
- ✅ Pantalla de resultado con insignias, desglose por pregunta e intentos
- ✅ Motor compartido `QuizEngine` (`js/quiz-engine.js`) + configuración en `js/quiz-config-1.js`
- ✅ Estilos compartidos del quiz en `css/quiz.css`
- ✅ Integrado con `session.js` (guarda cada respuesta automáticamente)

### Quiz Gamificado (Cap. 2 — `quiz-2.html`)
- ✅ Banco de preguntas sobre Anatomía de las Derivaciones ECG
- ✅ Mismo sistema gamificado que el quiz del Capítulo 1
- ✅ Preguntas sobre posición de electrodos, derivaciones precordiales y anatomía
- ✅ Sistema de dificultad adaptativo (Suave/Medio/Intenso)
- ✅ Configuración restaurada de dificultad/energía/insignias (DIFF_CONFIG, ENERGY_CONFIG, ALL_BADGES)
- ✅ Corrección del cálculo de energía al fallar preguntas
- ✅ Motor compartido `QuizEngine` (`js/quiz-engine.js`) + configuración en `js/quiz-config-2.js`
- ✅ Estilos compartidos del quiz en `css/quiz.css`
- ✅ Integración completa con el sistema de sesión y envío de datos

### Quiz Gamificado (Cap. 3 — `quiz-3.html`)
- ✅ Banco de preguntas sobre componentes del ECG (ondas, segmentos e intervalos)
- ✅ Configuración en `js/quiz-config-3.js` con 13 preguntas y mini-casos
- ✅ Soporte en `QuizEngine` para tipo `mini_case` y `why_wrong` por opción
- ✅ Estilos compartidos del quiz en `css/quiz.css`
- ✅ Motor compartido `QuizEngine` (`js/quiz-engine.js`)

### Quiz Gamificado (Cap. 4 — `quiz-4.html`)
- ✅ Interfaz unificada con el template del Capítulo 1 (HUD, feedback, NPC y resultados)
- ✅ Banco de preguntas embebido (`QUESTIONS`) con `DIFF_CONFIG` y `ENERGY_CONFIG`
- ✅ Integración con `QuizEngine` + registro en `session.js`

### Quiz Gamificado (Cap. 5 — `quiz-5.html`)
- ✅ Interfaz unificada con el template del Capítulo 1
- ✅ Banco de preguntas embebido (`QUESTIONS`) con ajustes de dificultad
- ✅ Integración con `QuizEngine` + envío de datos de sesión

### Quiz Gamificado (Cap. 6 — `quiz-6.html`)
- ✅ Interfaz unificada con el template del Capítulo 1
- ✅ Banco de preguntas embebido (`QUESTIONS`) con ajustes de dificultad
- ✅ Integración con `QuizEngine` y pantalla de resultados completa

### Autopercepción en capítulos (`chapter-1.html` … `chapter-6.html`)
- ✅ Contenedor vacío `<div id="likert-container">` renderizado por `js/likert-engine.js`
- ✅ Configuración por capítulo en `js/likert-config-1.js` … `js/likert-config-6.js`
- ✅ Escala Likert de 5 puntos definida por config (labels estándar 1–5)
- ✅ Guardado/restauración en `localStorage` con claves `cap{N}_likert_badges`
- ✅ Registro en sesión mediante `ECGSession.logLikert()` para envío al profesor

### Página de Autopercepción (`autopercepcion.html`)
- ✅ Explicación de la función y objetivos de la autopercepción
- ✅ Cuestionario completo renderizado por `js/likert-engine.js` + `js/likert-config-full.js`
- ✅ Panel de resultados dinámico (promedio, respondidas, % completitud)
- ✅ Botones de acción: ver progreso (`LikertEngine.mostrarResultados`) y exportar CSV
- ✅ Registro en sesión mediante `ECGSession.logLikert()` para envío/CSV
- ✅ Panel de identidad del estudiante visible con opción de editar
- ✅ Aviso si no hay sesión iniciada con botón para identificarse

### Simulador
- ✅ Monitor ECG interactivo animado (`ecg-monitor.html`) con 6 ritmos
- ✅ Integrado con `session.js` y sección Aprendizaje en sidebar

### ❌ Funcionalidades no implementadas aún
- ⛔ Panel analítico avanzado de progreso (gráficas por capítulo/tiempo)
- ⛔ Consolidación de resultados de autopercepción en un dashboard global
- ⛔ Publicación automática del sitio (requiere acción en la pestaña Publish)

### 🧭 Próximos pasos recomendados
- Añadir gráficas de progreso en `autopercepcion.html` (Chart.js/ECharts)
- Mover estilos inline restantes a archivos CSS compartidos
- Normalizar textos de capítulos y validar consistencia de claves de storage
- Mover los bancos de preguntas de `quiz-4.html` a `quiz-6.html` a archivos `js/quiz-config-4.js` … `js/quiz-config-6.js`

### 🌐 URLs públicas
- Producción: **Pendiente de publicación** (usa la pestaña **Publish**)
- Endpoint Google Apps Script: **Definir en `js/main.js` → ENDPOINT**

---

## 📁 Estructura de Archivos

```
index.html              → Portada del libro (modal de identificación)
chapter-1.html          → Fundamentos Fisiológicos y Técnicos + contenedor Likert
chapter-2.html          → Anatomía de las Derivaciones
chapter-3.html          → Componentes del Trazado Normal
chapter-4.html          → Metodología de Interpretación
chapter-5.html          → Patologías Básicas y Patrones
chapter-6.html          → Talleres de Práctica
quiz-1.html             → Quiz gamificado Capítulo 1 (15 preguntas, banco)
quiz-2.html             → Quiz gamificado Capítulo 2 (derivaciones)
quiz-3.html             → Quiz gamificado Capítulo 3 (componentes del ECG)
ecg-monitor.html        → Monitor ECG Interactivo (Canvas)
autopercepcion.html     → Página de Autopercepción del Aprendizaje
descargar.html          → Descarga del proyecto ZIP (oculta del menú)
css/style.css           → Estilos globales (tema claro/oscuro + modal Enviar)
css/quiz.css            → Estilos compartidos de los quizzes
css/likert.css          → Estilos compartidos del sistema Likert
js/main.js              → Navegación, búsqueda, tema, TOC + modal Enviar + submitSession()
js/session.js           → Módulo de sesión: identidad (clave: 'identity'), quiz log, Likert
js/likert-engine.js     → Motor compartido para cuestionarios Likert por ítems
js/likert-config-1.js   → Preguntas de autopercepción Cap. 1
js/likert-config-2.js   → Preguntas de autopercepción Cap. 2
js/likert-config-3.js   → Preguntas de autopercepción Cap. 3
js/likert-config-4.js   → Preguntas de autopercepción Cap. 4
js/likert-config-5.js   → Preguntas de autopercepción Cap. 5
js/likert-config-6.js   → Preguntas de autopercepción Cap. 6
js/likert-config-full.js→ Preguntas de autopercepción (todos los capítulos)
js/likert.js            → (Legacy) motor previo de autopercepción, sin uso en capítulos actuales
js/quiz-engine.js       → Motor unificado `QuizEngine` para quizzes
js/quiz-config-1.js     → Banco de preguntas y config del Quiz Cap. 1
js/quiz-config-2.js     → Banco de preguntas y config del Quiz Cap. 2
js/quiz-config-3.js     → Banco de preguntas y config del Quiz Cap. 3
diagnostico-quiz-seleccion.html → Prueba automática de selección única (quiz 1–3)
diagnostico-likert-engine.html  → Diagnóstico del motor Likert
README.md               → Documentación funcional del proyecto
ARQUITECTURA-TECNICA.md → Arquitectura interna, flujos, bugs, IDs del DOM
MANUAL-GOOGLE-SHEETS.md → Guía paso a paso para configurar Apps Script
```

---

## 🔗 URIs del Proyecto (entradas funcionales)

> Todas las rutas son estáticas y no requieren parámetros.

| Ruta | Descripción |
|---|---|
| `/index.html` | Portada del libro |
| `/chapter-1.html` | Cap. 1 – Fundamentos Fisiológicos |
| `/chapter-2.html` | Cap. 2 – Anatomía de Derivaciones |
| `/chapter-3.html` | Cap. 3 – Componentes del Trazado |
| `/chapter-4.html` | Cap. 4 – Metodología Sistemática |
| `/chapter-5.html` | Cap. 5 – Patologías y Patrones |
| `/chapter-6.html` | Cap. 6 – Talleres de Práctica |
| `/quiz-1.html` | Quiz Gamificado Capítulo 1 |
| `/quiz-2.html` | Quiz Gamificado Capítulo 2 – Anatomía de Derivaciones |
| `/quiz-3.html` | Quiz Gamificado Capítulo 3 – Componentes del ECG |
| `/diagnostico-quiz-seleccion.html` | Diagnóstico automático de selección única (quiz 1–3) |
| `/ecg-monitor.html` | Monitor ECG Interactivo |
| `/autopercepcion.html` | Autopercepción del Aprendizaje |
| `/diagnostico-likert-engine.html` | Diagnóstico del motor Likert |
| `/descargar.html` | Descarga ZIP (no enlazada en menú) |

---

## 🧩 Modelos de datos, estructuras y almacenamiento

- **localStorage**: `ecg_identity`, `ecg-theme`, `cap1_likert_badges` … `cap6_likert_badges`, `likert_full_badges` (autopercepción).
- **sessionStorage**: `ecg_session` con respuestas de quiz y autopercepción en la sesión actual.
- **Google Sheets (Apps Script)**: persistencia de respuestas al profesor vía POST.

## 📊 Modelo de Datos — Google Sheets

Columnas que llegan al Google Sheet con cada envío (una fila por respuesta de quiz + una por Likert):

| Columna | Tipo de fila | Descripción |
|---|---|---|
| Timestamp_Envio | Ambas | Fecha y hora del envío (zona Monterrey) |
| Nombre | Ambas | Nombre del estudiante |
| Matricula | Ambas | Matrícula / ID del estudiante |
| Inicio_Sesion | Ambas | ISO timestamp del inicio de la sesión |
| Tipo | Ambas | `Quiz` o `Likert` |
| Capitulo | Ambas | Capítulo donde ocurrió la actividad |
| Pregunta_Concepto | Ambas | Texto de la pregunta (Quiz) o concepto (Likert) |
| Respuesta_Dada | Quiz | Opción elegida por el alumno |
| Fue_Correcta | Quiz | `SI` / `NO` |
| Respuesta_Correcta | Quiz | Respuesta esperada |
| Tiempo_seg | Quiz | Segundos usados para responder |
| Reflexion_Elegida | Quiz | Reflexión elegida tras error (NPC Dr. ECG) |
| Puntos | Quiz | Puntos obtenidos (negativos si fue error) |
| Racha | Quiz | Racha de correctas consecutivas |
| Nivel_Likert | Likert | Nivel numérico (1–5) |
| Nivel_Texto | Likert | Etiqueta del nivel (ej: "Lo domino") |

> **Nota técnica:** La identidad se guarda en `localStorage` con clave `ecg_identity` y en `sessionStorage` con clave `ecg_session → identity` (campo `identity`, no `identidad`).

---

## 📐 Documentación Técnica

### Arquitectura interna
👉 **[ARQUITECTURA-TECNICA.md](./ARQUITECTURA-TECNICA.md)**
- Mapa completo de archivos y estructura HTML del quiz
- Diagrama de flujo de estado del juego
- Tabla de todas las funciones JS y sus responsabilidades
- Estructura completa de cada pregunta (MCQ + FITB)
- Sistema de envío: modal, `submitSession()`, payload JSON
- Registro de bugs históricos con causa raíz y solución
- Glosario de todos los IDs del DOM
- Patrón paso a paso para crear `quiz-2.html` ... `quiz-6.html`

### Configurar Google Sheets
👉 **[MANUAL-GOOGLE-SHEETS.md](./MANUAL-GOOGLE-SHEETS.md)**
- Diagrama del flujo completo alumno → Sheets
- Código completo del Apps Script listo para pegar
- 6 pasos ilustrados para publicar como Web App
- Cómo conectar el libro con tu Sheet (1 línea en `main.js`)
- Solución de problemas frecuentes
- Cómo filtrar y analizar los datos del grupo

---

## 🔧 Pendiente / Próximos Pasos (features no implementadas)


### 🔴 Acción inmediata requerida
- [ ] **Configurar Google Sheets** siguiendo `MANUAL-GOOGLE-SHEETS.md` y reemplazar el `ENDPOINT` en `js/main.js`

### 📚 Contenido
- [ ] Agregar 2 marcas de autopercepción en Capítulos 2–6 (mismo patrón que Cap. 1)
- [ ] Agregar quizzes para Capítulos 3–6 (mismo formato gamificado que `quiz-1.html`)
- [ ] Agregar más imágenes clínicas de trazados ECG reales
- [ ] Quiz integrador final (preguntas de todos los capítulos)

### ⚙️ Técnico
- [ ] Verificar que `fue_correcta` llegue como `SI/NO` string (no boolean) al Apps Script
- [ ] Versión imprimible de capítulos (CSS de impresión)
- [ ] Migración a Supabase cuando se use con más de 1 grupo

---

## 🧭 Recomendaciones de desarrollo

- Completar autopercepción en Cap. 2–6 para reforzar el aprendizaje metacognitivo.
- Crear quizzes para Cap. 3–6 con el mismo patrón gamificado.
- Añadir imágenes clínicas de ECG y casos reales.

## 🚀 Despliegue

- **Desarrollo**: https://wgihdlsm.gensparkspace.com
- **Producción**: Deploy en Netlify — ver `INSTRUCCIONES-GITHUB-NETLIFY.md`

## ⚡ Inicio Rápido para Configurar el Envío

```
1. Seguir MANUAL-GOOGLE-SHEETS.md (Pasos 1–4) → obtener URL del Apps Script
2. Abrir js/main.js → buscar la línea con ENDPOINT (~línea 368)
3. Reemplazar la URL placeholder por tu URL real
4. Subir main.js a Netlify (o GitHub → deploy automático)
5. Probar: libro → identificarse → quiz → clic "Enviar" → verificar Sheet
```
