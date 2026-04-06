/**
 * ============================================================
 *  QUIZ CONFIG — CAPÍTULO 3: Componentes del ECG
 * ============================================================
 *
 *  ARCHIVO: js/quiz-config-3.js
 *  CAPÍTULO: 3 – Componentes del trazado electrocardiográfico
 *  PREGUNTAS: 13 (11 conceptuales + 2 mini-casos clínicos)
 *
 *  NOTAS PARA EL PROGRAMADOR:
 *  ─────────────────────────────────
 *  1. Este archivo define las variables globales que lee quiz-engine.js.
 *     NO cambiar los nombres de las variables globales (QUIZ_Questions, etc.).
 *
 *  2. Los tipos de pregunta soportados actualmente en el engine son:
 *       - 'mcq'        → Opción múltiple estándar
 *       - 'fitb'       → Completar el espacio en blanco
 *       - 'npc'        → Diálogo con NPC Dr. ECG
 *     El tipo 'mini_case' funciona igual que 'mcq' internamente,
 *     pero el engine puede usarlo para aplicar estilos diferentes
 *     (icono de caso clínico, badge especial, etc.).
 *     Si el engine no reconoce 'mini_case', tratarlo como 'mcq'.
 *
 *  3. ESTRUCTURA why_wrong (NUEVA en Cap. 3):
 *     Antes: un solo mensaje para cualquier respuesta incorrecta.
 *     Ahora: un objeto con la opción elegida como clave.
 *     El engine debe hacer: question.why_wrong[opcionElegida]
 *     Ejemplo: si el alumno elige 'B', mostrar question.why_wrong.B
 *     IMPORTANTE: why_wrong NO incluye la clave de la respuesta correcta.
 *
 *  4. Las 3 preguntas tipo 'image-mcq' fueron excluidas de esta versión.
 *     Se agregarán cuando las imágenes ECG estén disponibles:
 *       - ecg_cap3_pr_medicion.png
 *       - ecg_cap3_qt_medicion.png
 *       - ecg_cap3_st_q_patologica.png
 *     El engine necesitará soporte para 'image-mcq' en ese momento.
 *
 *  5. Preguntas pendientes (segunda tanda): se agregarán 15 preguntas más
 *     para completar el banco a 28 (13 actuales + 15 nuevas).
 *
 *  ============================================================
 */


/* ─────────────────────────────────────────────
   METADATOS DEL QUIZ
   ───────────────────────────────────────────── */

var QUIZ_CAPitulo          = 'Capítulo 3';
var QUIZ_Titulo            = 'Quiz: Componentes del ECG';
var QUIZ_Subtitulo         = 'Ondas, intervalos y segmentos fundamentales';
var QUIZ_Descripcion       = 'Evalúa tu comprensión de los componentes del trazado electrocardiográfico: onda P, intervalo PR, complejo QRS, segmento ST, intervalo QT y onda T. Incluye preguntas conceptuales y mini-casos clínicos.';
var QUIZ_PreguntasPorPartida = 10;
var QUIZ_TotalPreguntas    = 13;   // Actualizar a 28 cuando se agregue la segunda tanda
var QUIZ_TiempoPorPregunta = 30;   // Segundos por pregunta

/* ─────────────────────────────────────────────
   LINKS DE NAVEGACIÓN
   ───────────────────────────────────────────── */

var QUIZ_LinkCapitulo       = 'chapter-3.html';       // Página del capítulo en el libro
var QUIZ_LinkSiguiente      = 'chapter-4.html';        // Siguiente capítulo
var QUIZ_LinkSiguienteTexto = 'Capítulo 4';            // Texto del botón "siguiente"

/* ─────────────────────────────────────────────
   BADGES (INSIGNIAS)
   ─────────────────────────────────────────────
   Cada badge se desbloquea al cumplir la condición
   indicada en check(). El engine evalúa esta función
   después de cada pregunta.
   
   CLAVE BADGE_KEY: se usa en localStorage para persistir.
   Formato recomendado: 'cap{N}_{nombreBadge}'
   ───────────────────────────────────────────── */

var QUIZ_BadgesKey = 'cap3_badges';

var QUIZ_Badges = [
  {
    id: 'cap3_lector_ritmo',
    name: 'Lector de Ritmo',
    icon: '💓',
    desc: 'Respondiste correctamente la pregunta sobre ritmo sinusal',
    check: function(state) {
      // Se desbloquea si la pregunta de ritmo_sinusal fue respondida correctamente
      return state.answers && state.answers.ritmo_sinusal === true;
    }
  },
  {
    id: 'cap3_experto_ondas',
    name: 'Experto en Ondas',
    icon: '🌊',
    desc: 'Acertaste todas las preguntas sobre ondas P, T y Q',
    check: function(state) {
      return state.answers &&
             state.answers.onda_p === true &&
             state.answers.onda_t === true &&
             state.answers.onda_q === true;
    }
  },
  {
    id: 'cap3_maestro_intervalos',
    name: 'Maestro de Intervalos',
    icon: '📏',
    desc: 'Dominaste los intervalos PR y QT',
    check: function(state) {
      return state.answers &&
             state.answers.intervalo_pr === true &&
             state.answers.qtc === true &&
             state.answers.qt_medicion === true;
    }
  },
  {
    id: 'cap3_ojo_clinico',
    name: 'Ojo Clínico',
    icon: '🔬',
    desc: 'Resolviste correctamente ambos mini-casos',
    check: function(state) {
      return state.answers &&
             state.answers.caso_bav1 === true &&
             state.answers.caso_qtc === true;
    }
  },
  {
    id: 'cap3_perfecto',
    name: 'Perfecto en Capítulo 3',
    icon: '🏆',
    desc: 'Obtuviste el 100% en una partida completa',
    check: function(state) {
      return state.perfectScore === true;
    }
  }
];


/* ═══════════════════════════════════════════════
   BANCO DE PREGUNTAS — 13 PREGUNTAS
   ═══════════════════════════════════════════════
   
   Distribución:
     6  → Base conceptual (memoria)
     3  → Interpretación aplicada
     2  → Mini-casos clínicos
     2  → Reservadas (se completarán con la segunda tanda)
   
   Puntos:
     mcq        → 100 pts
     mini_case  → 120 pts

   NOTA IMPORTANTE sobre why_wrong:
   ─────────────────────────────────────
   why_wrong es un objeto donde la clave es la letra de la opción
   INCORRECTA. NO se incluye la clave de la respuesta correcta.
   El engine debe mostrar: question.why_wrong[opcionElegida]
   
   Esto es diferente al quiz 1 y 2, que usaban un string único
   para cualquier respuesta incorrecta.
   ═══════════════════════════════════════════════ */

var QUIZ_Questions = [


  /* ─── PREGUNTA 1: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'ritmo_sinusal',
    points: 100,
    q: 'En un ECG de 12 derivaciones, la onda P es positiva en II y negativa en aVR, con una P antes de cada QRS. ¿Cuál es la interpretación más probable?',
    opts: {
      A: 'Ritmo sinusal',
      B: 'Ritmo de la unión AV',
      C: 'Taquicardia ventricular',
      D: 'Fibrilación auricular'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ese origen suele alterar la relación habitual entre la activación auricular y el vector esperado de la onda P.',
      C: 'Ese diagnóstico requiere otras alteraciones del QRS y del ritmo que aquí no se describen.',
      D: 'En ese contexto esperarías ausencia de ondas P organizadas y un patrón irregular.'
    },
    reflection: '¿Qué dato adicional te da más seguridad para hablar de ritmo sinusal además de la polaridad de la onda P?',
    reflection_yes: 'Correcto: además de la polaridad esperada, debe haber una onda P antes de cada QRS, con relación 1:1 y PR constante.',
    reflection_partial: 'Vas bien: no basta con mirar una sola onda. También importa la relación P-QRS y la regularidad del ritmo.',
    reflection_no: 'Para llamar sinusal a un ritmo, conviene integrar varios datos: P con polaridad esperada, una P antes de cada QRS y conducción AV constante.'
  },


  /* ─── PREGUNTA 2: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'onda_p',
    points: 100,
    q: '¿Cuál de los siguientes hallazgos describe mejor una onda P normal en adultos?',
    opts: {
      A: 'Duración ≤ 0.12 s y amplitud ≤ 2.5 mm en derivaciones de miembros',
      B: 'Duración ≤ 0.20 s y amplitud ≤ 5 mm',
      C: 'Duración 0.12–0.20 s y siempre bifásica en II',
      D: 'Duración ≤ 0.10 s y siempre negativa en aVF'
    },
    answer: 'A',
    why_wrong: {
      B: 'Esos límites abarcan medidas que ya obligan a pensar en otras estructuras o en alteraciones de la conducción auricular.',
      C: 'Combina un intervalo que no corresponde solo a la onda P con una morfología que no es la habitual en esa derivación.',
      D: 'Esa combinación no coincide con el patrón esperado del impulso auricular originado en el nodo sinusal.'
    },
    reflection: '¿Qué cambio estructural te haría pensar en una onda P alta y picuda en derivación II?',
    reflection_yes: 'Correcto: una P alta y picuda en II orienta a crecimiento de aurícula derecha.',
    reflection_partial: 'Buena dirección: una P muy prominente en derivaciones inferiores suele relacionarse con sobrecarga auricular derecha.',
    reflection_no: 'Una onda P alta y picuda en II debe hacer pensar en crecimiento de aurícula derecha.'
  },


  /* ─── PREGUNTA 3: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'intervalo_pr',
    points: 100,
    q: 'Un paciente tiene ondas P visibles antes de cada QRS. El intervalo PR mide 240 ms en varios latidos consecutivos y no se pierden complejos. ¿Qué hallazgo describe mejor este ECG?',
    opts: {
      A: 'Bloqueo AV de primer grado',
      B: 'Síndrome de preexcitación',
      C: 'Bloqueo AV completo',
      D: 'Ritmo sinusal normal'
    },
    answer: 'A',
    why_wrong: {
      B: 'En ese escenario la conducción auriculoventricular no está acelerada, sino enlentecida.',
      C: 'Ese trastorno implica disociación entre actividad auricular y ventricular, no una conducción 1:1 estable.',
      D: 'La conducción AV no está dentro del rango habitual descrito para adultos.'
    },
    reflection: '¿Qué diferencia clave separa este hallazgo de un bloqueo AV de segundo grado?',
    reflection_yes: 'Correcto: aquí todos los impulsos auriculares se conducen; en segundo grado algunas ondas P no logran conducir al ventrículo.',
    reflection_partial: 'Bien encaminado: la clave es que en este patrón no se "caen" QRS.',
    reflection_no: 'En el bloqueo AV de primer grado todos los impulsos conducen, aunque con retraso; en el segundo grado algunas ondas P no se conducen.'
  },


  /* ─── PREGUNTA 4: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'pr_corto',
    points: 100,
    q: '¿Qué hallazgo debe hacerte pensar en un PR corto patológico más que en una simple variación normal?',
    opts: {
      A: 'PR < 0.12 s con sospecha de activación ventricular precoz',
      B: 'PR de 0.16 s con QRS estrecho',
      C: 'PR estable entre 0.14 y 0.18 s',
      D: 'PR algo más largo durante bradicardia sinusal'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ese valor todavía cae dentro de un rango habitual en muchos adultos.',
      C: 'No describe por sí mismo una alteración de la conducción AV.',
      D: 'Ese comportamiento puede observarse sin implicar necesariamente una vía accesoria.'
    },
    reflection: 'Si sospechas preexcitación, ¿qué otro hallazgo buscarías en el QRS inicial?',
    reflection_yes: 'Correcto: buscarías una onda delta, que sugiere activación ventricular inicial por una vía accesoria.',
    reflection_partial: 'Buena idea: además del PR corto, conviene revisar si el inicio del QRS pierde su ascenso habitual nítido.',
    reflection_no: 'Ante sospecha de preexcitación, además del PR corto conviene buscar onda delta y cambios en el inicio del QRS.'
  },


  /* ─── PREGUNTA 5: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'qrs',
    points: 100,
    q: '¿Cuál de las siguientes opciones describe mejor un QRS normal en un adulto?',
    opts: {
      A: '0.06–0.10 s',
      B: '0.12–0.20 s',
      C: 'Siempre menor de 0.04 s',
      D: 'Mayor de 0.12 s si el ritmo es sinusal'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ese rango ya entra en valores que deben hacer pensar en alteración de la conducción intraventricular.',
      C: 'Ese tiempo sería demasiado breve para representar la activación ventricular habitual.',
      D: 'El origen sinusal del ritmo no justifica por sí solo un ensanchamiento ventricular.'
    },
    reflection: 'Cuando el QRS está ancho, ¿qué problema general debes considerar primero?',
    reflection_yes: 'Correcto: un QRS ancho obliga a pensar en conducción intraventricular anormal o en origen ventricular del ritmo.',
    reflection_partial: 'Vas bien: antes de etiquetar el ritmo, conviene considerar si la activación ventricular está siendo anómala.',
    reflection_no: 'Un QRS ancho suele orientar a bloqueo de rama, estimulación ventricular, preexcitación o ritmo de origen ventricular.'
  },


  /* ─── PREGUNTA 6: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'onda_t',
    points: 100,
    q: '¿Qué enunciado describe mejor la onda T normal?',
    opts: {
      A: 'Representa la repolarización ventricular y suele ser concordante con el QRS en varias derivaciones',
      B: 'Representa la despolarización ventricular y siempre tiene la misma amplitud que el QRS',
      C: 'Representa la repolarización auricular y suele verse mejor en V1',
      D: 'Representa el retraso del nodo AV antes del QRS'
    },
    answer: 'A',
    why_wrong: {
      B: 'Confunde el proceso eléctrico representado y además asume una relación fija de amplitud que no existe.',
      C: 'Ese evento normalmente no se identifica como una onda independiente en el ECG estándar.',
      D: 'Ese fenómeno corresponde a otra parte del trazado.'
    },
    reflection: '¿Por qué la onda T puede ser positiva en derivaciones donde el QRS también es positivo?',
    reflection_yes: 'Correcto: por la secuencia espacial de la repolarización ventricular, el vector resultante suele mantener concordancia con el QRS en varias derivaciones.',
    reflection_partial: 'Bien: aunque despolarización y repolarización no son lo mismo, el vector final puede apuntar de forma semejante en varias derivaciones.',
    reflection_no: 'La repolarización ventricular tiene una secuencia espacial particular; por eso la T suele ser concordante con el QRS en varias derivaciones normales.'
  },


  /* ─── PREGUNTA 7: Interpretación aplicada ─── */
  {
    type: 'mcq',
    topic: 'qtc',
    points: 100,
    q: 'En un ECG con frecuencia de 120 lpm, el estudiante reporta "QT normal" sin corregir por la frecuencia. ¿Cuál es el principal problema de esa conclusión?',
    opts: {
      A: 'El QT depende de la frecuencia cardíaca y debe valorarse con una corrección',
      B: 'El QT nunca cambia con la frecuencia',
      C: 'El QT solo debe revisarse si hay elevación del ST',
      D: 'El QT no se interpreta en adultos'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ignora una relación fisiológica básica entre repolarización ventricular y frecuencia cardíaca.',
      C: 'Limitarlo a ese contexto deja fuera uno de sus usos clínicos más importantes.',
      D: 'Ese intervalo sí tiene utilidad clínica relevante en población adulta.'
    },
    reflection: '¿Qué riesgo clínico aumenta cuando el QTc se prolonga de forma importante?',
    reflection_yes: 'Correcto: un QTc muy prolongado aumenta el riesgo de arritmias ventriculares como torsades de pointes.',
    reflection_partial: 'Vas bien: el problema principal no es solo "que esté largo", sino el riesgo arrítmico que eso puede implicar.',
    reflection_no: 'La prolongación importante del QTc se asocia a mayor riesgo de arritmias ventriculares, especialmente torsades de pointes.'
  },


  /* ─── PREGUNTA 8: Interpretación aplicada ─── */
  {
    type: 'mcq',
    topic: 'qt_medicion',
    points: 100,
    q: 'Al medir el QT, un estudiante incluye una onda U prominente dentro de la medición. ¿Cuál es el error conceptual principal?',
    opts: {
      A: 'Está prolongando artificialmente la medición al no identificar bien el final de la onda T',
      B: 'El QT debe medirse desde el inicio de la onda P',
      C: 'La onda U reemplaza a la onda T en la mayoría de los adultos',
      D: 'El QT solo se mide en derivaciones con QRS negativo'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ese punto de inicio corresponde a otro intervalo del ECG.',
      C: 'Eso no describe el comportamiento habitual del trazado normal.',
      D: 'La medición no depende de ese criterio.'
    },
    reflection: '¿Por qué este error puede ser clínicamente importante?',
    reflection_yes: 'Correcto: porque puede simular una prolongación del QT y llevar a sobreestimar el riesgo arrítmico.',
    reflection_partial: 'Exacto en esencia: un error técnico en la medición puede cambiar la interpretación clínica.',
    reflection_no: 'Si incluyes la onda U por error, puedes sobreestimar el QT y concluir erróneamente que existe prolongación clínicamente relevante.'
  },


  /* ─── PREGUNTA 9: Interpretación aplicada ─── */
  {
    type: 'mcq',
    topic: 'segmento_pr',
    points: 100,
    q: '¿Cuál de las siguientes afirmaciones diferencia mejor el segmento PR del intervalo PR?',
    opts: {
      A: 'El segmento PR excluye la onda P; el intervalo PR la incluye',
      B: 'Son exactamente lo mismo y se usan de forma intercambiable',
      C: 'El segmento PR empieza al inicio del QRS y termina al final de la T',
      D: 'El intervalo PR solo se usa cuando el ritmo no es sinusal'
    },
    answer: 'A',
    why_wrong: {
      B: 'Confundirlos lleva a errores de medición y de interpretación fisiológica.',
      C: 'Esa descripción corresponde a otra parte del trazado ventricular.',
      D: 'La utilidad del intervalo no depende de ese criterio.'
    },
    reflection: '¿Por qué el segmento PR suele servir como referencia isoeléctrica al valorar el ST?',
    reflection_yes: 'Correcto: porque representa un periodo eléctricamente más estable desde la superficie, útil como línea de comparación.',
    reflection_partial: 'Bien: se usa como referencia práctica porque suele aproximar la línea isoeléctrica mejor que otras partes del trazado.',
    reflection_no: 'El segmento PR suele emplearse como referencia isoeléctrica para valorar desplazamientos del ST.'
  },


  /* ─── PREGUNTA 10: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'st',
    points: 100,
    q: 'Respecto al segmento ST, ¿cuál es la mejor afirmación en un contexto docente inicial?',
    opts: {
      A: 'Debe ser aproximadamente isoeléctrico, aunque pequeñas variaciones pueden observarse según la derivación y el contexto',
      B: 'Toda elevación del ST significa infarto agudo',
      C: 'Toda depresión del ST es efecto farmacológico',
      D: 'El ST normal siempre está por encima de la línea de base'
    },
    answer: 'A',
    why_wrong: {
      B: 'Esa interpretación pasa por alto variantes normales y otros diagnósticos diferenciales importantes.',
      C: 'Ese hallazgo tiene varias posibles explicaciones y necesita contexto.',
      D: 'Generaliza de forma inapropiada un segmento que normalmente se valora frente a una línea de referencia.'
    },
    reflection: '¿Por qué conviene ser prudente antes de concluir que un ST elevado corresponde a un síndrome coronario agudo?',
    reflection_yes: 'Correcto: porque la morfología, la derivación, la clínica y los cambios recíprocos importan; no toda elevación del ST tiene el mismo significado.',
    reflection_partial: 'Vas bien: mirar solo "elevado o no elevado" puede llevar a errores si no integras el contexto.',
    reflection_no: 'La elevación del ST debe interpretarse con contexto clínico, derivaciones contiguas, morfología y otros hallazgos del ECG.'
  },


  /* ─── PREGUNTA 11: Base conceptual ─── */
  {
    type: 'mcq',
    topic: 'onda_q',
    points: 100,
    q: '¿Qué enunciado es más correcto sobre las ondas Q?',
    opts: {
      A: 'No toda onda Q es patológica; importa su tamaño, duración, derivación y contexto',
      B: 'Cualquier onda Q implica necrosis miocárdica',
      C: 'La onda Q solo puede aparecer en derivaciones inferiores',
      D: 'Si existe una onda Q, el QRS necesariamente es ancho'
    },
    answer: 'A',
    why_wrong: {
      B: 'Eso ignora las pequeñas deflexiones septales que pueden ser variantes normales.',
      C: 'Restringe de forma incorrecta un hallazgo que puede verse en distintas localizaciones.',
      D: 'Mezcla dos conceptos distintos del análisis electrocardiográfico.'
    },
    reflection: '¿Qué error frecuente cometen los principiantes al evaluar ondas Q?',
    reflection_yes: 'Correcto: muchos estudiantes etiquetan como patológica cualquier deflexión negativa inicial sin revisar anchura, profundidad y derivación.',
    reflection_partial: 'Muy bien: el problema suele ser sobrediagnosticar patología sin aplicar criterios de tamaño y contexto.',
    reflection_no: 'Un error frecuente es asumir que toda onda Q es patológica, sin revisar duración, profundidad, derivación y correlación clínica.'
  },


  /* ─── PREGUNTA 12: Mini-caso clínico ─── */
  {
    type: 'mini_case',
    topic: 'caso_bav1',
    points: 120,
    q: 'Paciente de 68 años, asintomático, con frecuencia de 58 lpm. En el ECG: ondas P sinusales, un QRS por cada P y PR constante de 220 ms. ¿Cuál es la interpretación más probable?',
    opts: {
      A: 'Bloqueo AV de primer grado',
      B: 'Bloqueo AV de segundo grado Mobitz II',
      C: 'Fibrilación auricular con respuesta lenta',
      D: 'Taquicardia supraventricular'
    },
    answer: 'A',
    why_wrong: {
      B: 'Falta el hallazgo clave de pérdida intermitente de conducción auriculoventricular.',
      C: 'El ritmo descrito conserva organización auricular y relación estable entre P y QRS.',
      D: 'La frecuencia reportada no apoya ese escenario.'
    },
    reflection: 'En este contexto, ¿qué dato tranquiliza más respecto a estabilidad de la conducción?',
    reflection_yes: 'Correcto: que cada onda P conduce a un QRS y que el PR se mantiene constante.',
    reflection_partial: 'Buena observación: la relación 1:1 entre aurícula y ventrículo es una pista muy útil.',
    reflection_no: 'La estabilidad se apoya en que todas las ondas P conducen y el PR es constante, aunque esté prolongado.'
  },


  /* ─── PREGUNTA 13: Mini-caso clínico ─── */
  {
    type: 'mini_case',
    topic: 'caso_qtc',
    points: 120,
    q: 'Mujer de 32 años con palpitaciones y uso reciente de un macrólido. El QTc calculado es de 510 ms. ¿Cuál es la preocupación clínica principal?',
    opts: {
      A: 'Mayor riesgo de arritmia ventricular polimórfica',
      B: 'Crecimiento auricular izquierdo',
      C: 'Bloqueo AV completo inminente',
      D: 'Hipertrofia ventricular derecha aislada'
    },
    answer: 'A',
    why_wrong: {
      B: 'Ese hallazgo se evalúa con otros componentes del ECG, no principalmente con este intervalo.',
      C: 'Ese trastorno afecta la relación auriculoventricular, no se deduce directamente de esta medición.',
      D: 'Ese diagnóstico requiere otros criterios de eje, voltaje y morfología.'
    },
    reflection: '¿Qué dos pasos prácticos suelen ser prioritarios cuando encuentras un QTc claramente prolongado?',
    reflection_yes: 'Correcto: revisar fármacos/electrolitos y valorar el riesgo arrítmico según contexto clínico.',
    reflection_partial: 'Bien: no basta con anotar el número; hay que buscar causas reversibles y valorar riesgo.',
    reflection_no: 'Ante QTc prolongado, conviene revisar medicamentos, electrolitos y contexto clínico por el riesgo de arritmia ventricular.'
  }

  /* ─────────────────────────────────────────────
     FIN DEL BANCO DE PREGUNTAS
     ─────────────────────────────────────────────
     Total actual: 13 preguntas
       - mcq:        11 preguntas (100 pts c/u)
       - mini_case:   2 preguntas (120 pts c/u)
     
     PENDIENTE — Segunda tanda (15 preguntas más):
       - Se agregarán al final de este array
       - Incluirá 3 preguntas image-mcq cuando las imágenes estén listas
       - Actualizar QUIZ_TotalPreguntas a 28
     ───────────────────────────────────────────── */
];
