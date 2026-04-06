/**
 * CONFIGURACIÓN DEL QUIZ — CAPÍTULO 2
 * Anatomía de las Derivaciones
 */
var QUIZ_CAPitulo = 'Capítulo 2 – Anatomía de las Derivaciones';
var QUIZ_Titulo = 'Quiz — Capítulo 2';
var QUIZ_Subtitulo = 'Anatomía de las Derivaciones ECG';
var QUIZ_Descripcion = 'Evalúa tu comprensión de las derivaciones, electrodos y territorios cardíacos.';

var QUIZ_PreguntasPorPartida = 10;
var QUIZ_TotalPreguntas = 15;
var QUIZ_TiempoPorPregunta = 30;

var QUIZ_BadgesKey = 'ecg_badges_cap2';
var QUIZ_LinkCapitulo = 'chapter-2.html';
var QUIZ_LinkSiguiente = 'chapter-3.html';
var QUIZ_LinkSiguienteTexto = 'Capítulo 3';

// ── BANCO DE PREGUNTAS (copiado íntegro) ──
var QUIZ_Questions = [
  {
    type: 'mcq',
    topic: 'electrodos',
    q: '¿Cuántos electrodos se colocan en el tórax para las derivaciones precordiales?',
    opts: { A: '4', B: '6', C: '3', D: '12' },
    answer: 'B',
    why_wrong: {
      A: '4 electrodos serían insuficientes para cubrir toda la superficie anterior del corazón. Se necesitan 6 para obtener una visión completa de los ventrículos.',
      C: '3 electrodos serían demasiado pocos y dejarían grandes áreas del corazón sin explorar. El estándar internacional es de 6 precordiales.',
      D: '12 electrodos corresponden al sistema de 12 derivaciones totales (6 precordiales + 6 extremidades), pero solo 6 son precordiales.'
    },
    reflection: '¿Por qué crees que se necesitan exactamente 6 derivaciones precordiales y no más ni menos?',
    reflection_yes: 'Exacto. Las 6 derivaciones precordiales (V1-V6) están diseñadas para cubrir toda la superficie anterior del corazón, desde el ápex hasta la base, permitiendo detectar patrones de isquemia y necrosis en diferentes territorios ventriculares.',
    reflection_partial: 'Las 6 derivaciones están estratégicamente ubicadas para cubrir toda la superficie anterior del corazón. Cada una explora un territorio diferente del ventrículo derecho e izquierdo.',
    reflection_no: 'Revisa la sección "Derivaciones Precordiales" del capítulo. Las 6 derivaciones (V1-V6) están diseñadas para cubrir toda la superficie anterior del corazón, permitiendo detectar patologías en diferentes territorios ventriculares.',
    reflection_yes_short: '¡Perfecto! Comprendes la importancia de las 6 derivaciones.',
    reflection_partial_short: 'Casi — recuerda que cada una cubre un territorio específico.',
    reflection_no_short: 'Revisa la sección de derivaciones precordiales.',
    points: 100
  },
  {
    type: 'mcq',
    topic: 'posicion',
    q: '¿En qué posición intercostal se coloca el electrodo V4?',
    opts: { A: '5º espacio intercostal, línea axilar media', B: '4º espacio intercostal, línea axilar media', C: '5º espacio intercostal, línea axilar anterior', D: '4º espacio intercostal, línea axilar anterior' },
    answer: 'A',
    why_wrong: {
      B: 'El 4º espacio intercostal es demasiado alto. V4 debe colocarse en el 5º espacio para estar a nivel del ápex del corazón.',
      C: 'La línea axilar anterior es demasiado anterior. V4 debe estar en la línea axilar media para explorar correctamente el ápex del ventrículo izquierdo.',
      D: 'Ambas referencias son incorrectas: debe ser 5º espacio intercostal y línea axilar media, no 4º espacio y línea axilar anterior.'
    },
    reflection: '¿Por qué es crítico que V4 esté exactamente en el 5º espacio intercostal y línea axilar media?',
    reflection_yes: 'Perfecto. V4 explora el ápex del ventrículo izquierdo, que es el área más grande y eléctricamente activa del corazón. Una posición incorrecta puede hacer que se pierdan signos de isquemia o infarto del ápex.',
    reflection_partial: 'V4 explora el ápex del corazón, que es una zona crítica. El 5º espacio intercostal asegura que estemos al nivel del ápex ventricular, mientras que la línea axilar media da la posición lateral correcta.',
    reflection_no: 'Revisa la sección "Colocación de Electrodos Precordiales" del capítulo. V4 explora el ápex del ventrículo izquierdo, que es el área más eléctricamente activa del corazón, por lo que su posición debe ser precisa.',
    reflection_yes_short: 'Excelente comprensión de la anatomía cardíaca.',
    reflection_partial_short: 'Buena intuición, pero revisa la anatomía del ápex.',
    reflection_no_short: 'La posición de V4 es crítica para explorar el ápex.',
    clinical_consequence: 'Una V4 mal posicionada puede hacer que se pierda un infarto del ápex del ventrículo izquierdo, que es una zona de alto riesgo para isquemia.',
    points: 120
  },
  {
    type: 'mcq',
    topic: 'territorios',
    q: '¿Qué exploran principalmente las derivaciones V1 y V2?',
    opts: { A: 'El ápex del ventrículo izquierdo', B: 'El ventrículo derecho y el septum interventricular', C: 'La pared lateral del ventrículo izquierdo', D: 'La pared inferior del corazón' },
    answer: 'B',
    why_wrong: {
      A: 'El ápex del ventrículo izquierdo es explorado principalmente por V5 y V6, no por V1 y V2 que están demasiado a la derecha.',
      C: 'La pared lateral del ventrículo izquierdo es explorada por V5 y V6, mientras que V1 y V2 están más orientadas hacia el septum y el VD.',
      D: 'La pared inferior del corazón es explorada por las derivaciones II, III y aVF, no por las precordiales V1 y V2.'
    },
    reflection: '¿Por qué V1 y V2 son tan importantes para detectar bloqueos de rama derecha?',
    reflection_yes: 'Excelente. V1 y V2 están directamente sobre el ventrículo derecho y el septum. En el bloqueo de rama derecha, el vector de despolarización terminal apunta hacia el VD, generando un patrón característico en estas derivaciones.',
    reflection_partial: 'V1 y V2 son clave porque exploran el ventrículo derecho y el septum. En los bloqueos de rama, el vector terminal apunta hacia el lado del bloqueo, generando cambios característicos en estas derivaciones.',
    reflection_no: 'Revisa la sección "Patrones de Bloqueo de Rama" del capítulo. V1 y V2 exploran el ventrículo derecho y el septum, siendo fundamentales para diagnosticar bloqueos de rama derecha por su posición anatómica.',
    reflection_yes_short: 'Perfecto — entiendes la importancia de V1/V2 en bloqueos.',
    reflection_partial_short: 'Vas por buen camino, pero revisa cómo afectan los bloqueos.',
    reflection_no_short: 'V1/V2 son clave para diagnosticar bloqueos de rama derecha.',
    clinical_consequence: 'No reconocer un bloqueo de rama derecha puede hacer que se pierda el diagnóstico de un infarto inferior o derecho, que requiere tratamiento urgente.',
    points: 110
  },
  {
    type: 'mcq',
    topic: 'derivaciones',
    q: '¿Cuál es la derivación precordial que se coloca más lateralmente?',
    opts: { A: 'V2', B: 'V4', C: 'V6', D: 'V1' },
    answer: 'C',
    why_wrong: {
      A: 'V2 está en el 4º espacio intercostal, línea esternal izquierda — es anterior, no lateral.',
      B: 'V4 está en la línea axilar media, pero V6 está más lateral en la línea axilar media también.',
      D: 'V1 está en el 4º espacio intercostal, margen esternal derecho — es la más medial de todas.'
    },
    reflection: '¿Por qué es importante la posición lateral de V6 para explorar el ventrículo izquierdo?',
    reflection_yes: 'Exacto. V6 está en la línea axilar media y explora la pared lateral del ventrículo izquierdo, siendo crucial para detectar infartos laterales.',
    reflection_partial: 'V6 es la más lateral y explora el ventrículo izquierdo, pero revisa exactamente qué territorio cubre.',
    reflection_no: 'V6 está en la línea axilar media y explora la pared lateral del ventrículo izquierdo.',
    reflection_yes_short: '¡Perfecto! V6 es clave para el territorio lateral.',
    reflection_partial_short: 'V6 es lateral, pero revisa qué territorio explora exactamente.',
    reflection_no_short: 'V6 es la más lateral — revisa su territorio de exploración.',
    points: 100
  },
  {
    type: 'mcq',
    topic: 'extremidades',
    q: '¿Qué derivaciones están formadas por los electrodos de extremidades?',
    opts: { A: 'I, II, III, aVR, aVL, aVF', B: 'V1, V2, V3, V4, V5, V6', C: 'aVL, aVR, aVF solamente', D: 'I, II, III solamente' },
    answer: 'A',
    why_wrong: {
      B: 'Estas son las 6 derivaciones precordiales, no las de extremidades.',
      C: 'Estas son las derivaciones aumentadas, pero faltan I, II, III.',
      D: 'Faltan las derivaciones aumentadas aVR, aVL, aVF.'
    },
    reflection: '¿Por qué las derivaciones de extremidades son fundamentales para determinar el eje eléctrico del corazón?',
    reflection_yes: 'Perfecto. Las derivaciones de extremidades forman el plano frontal y permiten calcular el eje eléctrico cardíaco usando el método de los vectores.',
    reflection_partial: 'Las derivaciones de extremidades son importantes para el eje, pero revisa exactamente cómo se calcula.',
    reflection_no: 'Las derivaciones de extremidades forman el plano frontal y permiten determinar el eje eléctrico del corazón.',
    reflection_yes_short: 'Excelente — entiendes la importancia del eje.',
    reflection_partial_short: 'El eje es importante, pero revisa cómo se calcula.',
    reflection_no_short: 'Las derivaciones de extremidades determinan el eje eléctrico.',
    points: 110
  },
  {
    type: 'mcq',
    topic: 'sistema_12',
    q: '¿Cuántas derivaciones forman el sistema estándar de 12 derivaciones ECG?',
    opts: { A: '6', B: '12', C: '15', D: '9' },
    answer: 'B',
    why_wrong: {
      A: '6 corresponde solo a las derivaciones precordiales o solo a las de extremidades.',
      C: '15 es un número incorrecto — el sistema estándar es de 12 derivaciones.',
      D: '9 no corresponde a ningún sistema estándar de derivaciones.'
    },
    reflection: '¿Por qué el sistema de 12 derivaciones se convirtió en el estándar mundial para el ECG?',
    reflection_yes: 'Excelente. El sistema de 12 derivaciones proporciona una visión completa tridimensional de la actividad eléctrica cardíaca, permitiendo detectar patologías en cualquier territorio.',
    reflection_partial: 'El sistema de 12 derivaciones es estándar, pero revisa exactamente qué cubre cada grupo.',
    reflection_no: 'El sistema de 12 derivaciones (6 extremidades + 6 precordiales) proporciona una visión completa del corazón en 3D.',
    reflection_yes_short: 'Perfecto — el sistema de 12 es el estándar mundial.',
    reflection_partial_short: 'El sistema de 12 es estándar, pero revisa por qué.',
    reflection_no_short: 'El sistema de 12 derivaciones es el estándar mundial.',
    points: 90
  },
  {
    type: 'mcq',
    topic: 'colocacion',
    q: '¿En qué espacio intercostal se coloca el electrodo V1?',
    opts: { A: '3º espacio intercostal', B: '4º espacio intercostal', C: '5º espacio intercostal', D: '2º espacio intercostal' },
    answer: 'B',
    why_wrong: {
      A: 'El 3º espacio es demasiado alto y estaría sobre el área pulmonar.',
      C: 'El 5º espacio es para V4-V6, no para V1.',
      D: 'El 2º espacio es demasiado alto y no exploraría el corazón adecuadamente.'
    },
    reflection: '¿Por qué es crítico colocar V1 exactamente en el 4º espacio intercostal?',
    reflection_yes: 'Perfecto. V1 debe estar en el 4º espacio intercostal para explorar correctamente el septum interventricular y el ventrículo derecho.',
    reflection_partial: 'V1 va en el 4º espacio, pero revisa exactamente qué estructuras explora.',
    reflection_no: 'V1 debe estar en el 4º espacio intercostal para explorar el septum y el ventrículo derecho.',
    reflection_yes_short: 'Excelente — conoces la anatomía de V1.',
    reflection_partial_short: 'V1 va en el 4º espacio, pero revisa qué explora.',
    reflection_no_short: 'V1 debe estar en el 4º espacio intercostal.',
    clinical_consequence: 'Un V1 mal posicionado puede hacer que se pierda el diagnóstico de un bloqueo de rama derecha o un infarto septal.',
    points: 110
  },
  {
    type: 'mcq',
    topic: 'exploracion',
    q: '¿Qué estructura anatómica explora principalmente la derivación V5?',
    opts: { A: 'El septum interventricular', B: 'La pared anterior del ventrículo izquierdo', C: 'El ventrículo derecho', D: 'La pared inferior del corazón' },
    answer: 'B',
    why_wrong: {
      A: 'El septum es explorado principalmente por V1, V2 y las derivaciones de extremidades.',
      C: 'El ventrículo derecho es explorado por V1, V2 y aVR.',
      D: 'La pared inferior es explorada por II, III y aVF.'
    },
    reflection: '¿Por qué V5 es tan importante para detectar infartos anteriores?',
    reflection_yes: 'Exacto. V5 explora la pared anterior del ventrículo izquierdo, que es un territorio común para infartos por enfermedad de la arteria descendente anterior.',
    reflection_partial: 'V5 explora el ventrículo izquierdo, pero revisa exactamente qué territorio.',
    reflection_no: 'V5 explora la pared anterior del ventrículo izquierdo, siendo crucial para detectar infartos anteriores.',
    reflection_yes_short: 'Perfecto — V5 es clave para infartos anteriores.',
    reflection_partial_short: 'V5 explora el VI, pero revisa qué territorio exactamente.',
    reflection_no_short: 'V5 explora la pared anterior del ventrículo izquierdo.',
    clinical_consequence: 'No reconocer un infarto anterior en V5 puede retrasar el tratamiento de una obstrucción de la arteria descendente anterior.',
    points: 120
  },
  {
    type: 'mcq',
    topic: 'aumentadas',
    q: '¿Qué representan las derivaciones aVR, aVL y aVF?',
    opts: { A: 'Derivaciones precordiales aumentadas', B: 'Derivaciones de extremidades aumentadas', C: 'Derivaciones unipolares de extremidades', D: 'Derivaciones bipolares de extremidades' },
    answer: 'C',
    why_wrong: {
      A: 'Las derivaciones precordiales son V1-V6, no las aumentadas.',
      B: 'Aunque involucran extremidades, no son simplemente "de extremidades" sino unipolares.',
      D: 'Son unipolares, no bipolares — miden potencial contra un punto central.'
    },
    reflection: '¿Por qué las derivaciones aumentadas son unipolares y qué ventaja tienen sobre las bipolares?',
    reflection_yes: 'Excelente. Las derivaciones aumentadas son unipolares y proporcionan vectores eléctricos más claros en el plano frontal, facilitando el cálculo del eje.',
    reflection_partial: 'Las aumentadas son unipolares, pero revisa exactamente qué ventajas tienen.',
    reflection_no: 'Las derivaciones aumentadas son unipolares y proporcionan vectores más claros para el análisis del eje.',
    reflection_yes_short: 'Perfecto — entiendes las ventajas de las unipolares.',
    reflection_partial_short: 'Son unipolares, pero revisa sus ventajas.',
    reflection_no_short: 'Las aumentadas son unipolares, no bipolares.',
    points: 130
  },
  {
    type: 'mcq',
    topic: 'planos',
    q: '¿En qué plano se encuentran las derivaciones de extremidades?',
    opts: { A: 'Plano horizontal', B: 'Plano frontal', C: 'Plano sagital', D: 'Plano coronal' },
    answer: 'B',
    why_wrong: {
      A: 'El plano horizontal es el de las derivaciones precordiales V1-V6.',
      C: 'El plano sagital no es relevante para el ECG.',
      D: 'El plano coronal es lo mismo que el frontal, pero no es la terminología estándar.'
    },
    reflection: '¿Por qué es importante que las derivaciones de extremidades estén en el plano frontal?',
    reflection_yes: 'Perfecto. Las derivaciones de extremidades en el plano frontal permiten calcular el eje eléctrico cardíaco en dos dimensiones.',
    reflection_partial: 'El plano frontal es importante, pero revisa exactamente para qué se usa.',
    reflection_no: 'Las derivaciones de extremidades están en el plano frontal para calcular el eje eléctrico.',
    reflection_yes_short: 'Excelente — el plano frontal es clave para el eje.',
    reflection_partial_short: 'El plano frontal es importante, revisa por qué.',
    reflection_no_short: 'Las de extremidades están en el plano frontal.',
    points: 100
  },
  {
    type: 'mcq',
    topic: 'colocacion_V6',
    q: '¿En qué línea axilar se coloca el electrodo V6?',
    opts: { A: 'Línea axilar anterior', B: 'Línea axilar media', C: 'Línea axilar posterior', D: 'Línea axilar media-lateral' },
    answer: 'B',
    why_wrong: {
      A: 'La línea axilar anterior es demasiado anterior para V6.',
      C: 'La línea axilar posterior es demasiado posterior y estaría sobre el músculo latissimus.',
      D: 'Esta no es una línea anatómica estándar.'
    },
    reflection: '¿Por qué V6 debe estar exactamente en la línea axilar media?',
    reflection_yes: 'Excelente. V6 en la línea axilar media explora la pared lateral del ventrículo izquierdo, completando el mapeo del territorio lateral.',
    reflection_partial: 'V6 va en la línea axilar media, pero revisa exactamente qué territorio explora.',
    reflection_no: 'V6 debe estar en la línea axilar media para explorar la pared lateral del ventrículo izquierdo.',
    reflection_yes_short: 'Perfecto — V6 completa el mapeo lateral.',
    reflection_partial_short: 'V6 va en línea axilar media, revisa qué explora.',
    reflection_no_short: 'V6 está en la línea axilar media.',
    points: 110
  },
  {
    type: 'mcq',
    topic: 'sistema_6',
    q: '¿Cuál es la diferencia entre las derivaciones V1-V3 y V4-V6?',
    opts: { A: 'V1-V3 son anteriores, V4-V6 son laterales', B: 'V1-V3 son laterales, V4-V6 son anteriores', C: 'V1-V3 son precordiales, V4-V6 son de extremidades', D: 'No hay diferencia funcional' },
    answer: 'A',
    why_wrong: {
      B: 'Está invertido — V1-V3 son más anteriores y V4-V6 más laterales.',
      C: 'Todas son derivaciones precordiales, no de extremidades.',
      D: 'Sí hay una diferencia clara en la orientación anatómica.'
    },
    reflection: '¿Por qué es importante esta diferencia para el diagnóstico de infartos?',
    reflection_yes: 'Exacto. V1-V3 exploran el septum y pared anterior, mientras que V4-V6 exploran el ápex y territorio lateral — cada grupo detecta infartos en territorios diferentes.',
    reflection_partial: 'La diferencia es importante, pero revisa exactamente qué territorios cubre cada grupo.',
    reflection_no: 'V1-V3 son más anteriores y exploran el septum y pared anterior, mientras que V4-V6 son laterales y exploran el ápex y territorio lateral.',
    reflection_yes_short: 'Perfecto — entiendes la diferencia territorial.',
    reflection_partial_short: 'Hay diferencia, pero revisa qué territorios.',
    reflection_no_short: 'V1-V3 son anteriores, V4-V6 son laterales.',
    clinical_consequence: 'Reconocer esta diferencia permite localizar el territorio del infarto y determinar qué arteria coronaria está comprometida.',
    points: 140
  },
  {
    type: 'mcq',
    topic: 'exploracion_completa',
    q: '¿Qué derivaciones exploran el ápex del corazón?',
    opts: { A: 'V1 y V2', B: 'V3 y V4', C: 'V5 y V6', D: 'II, III y aVF' },
    answer: 'C',
    why_wrong: {
      A: 'V1 y V2 exploran el septum y VD, no el ápex.',
      B: 'V3 y V4 están más orientadas hacia la pared anterior que el ápex.',
      D: 'Estas exploran la pared inferior, no el ápex.'
    },
    reflection: '¿Por qué el ápex es tan importante en la fisiología cardíaca?',
    reflection_yes: 'Excelente. El ápex es donde ocurre la mayor contracción ventricular y es el área más eléctricamente activa, por lo que sus alteraciones indican daño miocárdico significativo.',
    reflection_partial: 'El ápex es importante, pero revisa exactamente por qué desde el punto de vista fisiológico.',
    reflection_no: 'El ápex es la zona de mayor actividad eléctrica y contráctil del ventrículo izquierdo.',
    reflection_yes_short: 'Perfecto — el ápex es la zona de mayor actividad.',
    reflection_partial_short: 'El ápex es importante, revisa por qué exactamente.',
    reflection_no_short: 'V5 y V6 exploran el ápex del corazón.',
    clinical_consequence: 'No detectar alteraciones en el ápex puede hacer que se pierda el diagnóstico de un infarto extenso del ventrículo izquierdo.',
    points: 130
  }
];

// ── INSIGNIAS ESPECÍFICAS DE ESTE CAPÍTULO ──
var QUIZ_Badges = [
  {
    id: 'perfect_score',
    icon: '🏆',
    name: 'Perfect Score',
    desc: 'Responde todas las preguntas correctamente.',
    check: function(s) { return s.wrongCount === 0 && s.correctCount === 10; }
  },
  {
    id: 'streak_master',
    icon: '🔥',
    name: 'Streak Master',
    desc: 'Alcanza una racha de 5 o más respuestas correctas.',
    check: function(s) { return s.bestStreak >= 5; }
  },
  {
    id: 'speed_demon',
    icon: '⚡',
    name: 'Speed Demon',
    desc: 'Completa el quiz en menos de 5 minutos.',
    check: function(s) { return s.totalTime && s.totalTime <= 300; }
  },
  {
    id: 'energy_saver',
    icon: '💚',
    name: 'Energy Saver',
    desc: 'Termina con más del 80% de energía.',
    check: function(s) { return s.energyFinal >= 80; }
  },
  {
    id: 'reflection_master',
    icon: '🤔',
    name: 'Reflection Master',
    desc: 'Responde "Sí, entendí" al NPC 3 o más veces.',
    check: function(s) { return (s.npcYesCount || 0) >= 3; }
  }
];
