/**
 * js/likert-config-full.js
 * ═════════════════════════════════════════
 * TODAS las preguntas de autopercepción
 * ═════════════════════════════════════════
 *
 * Para la página autopercepcion.html
 * Se genera juntando los contenidos de:
 *   - likert-config-1.js
 *   - likert-config-2.js
 *   - likert-config-3.js
 *   - likert-config-4.js
 *   - likert-config-5.js
 *   - likert-config-6.js
 */

var LIKERT_Items = [

  /* ═══════════════════════════════════
     CAPÍTULO 1
     ═══════════════════════════════════ */
  {
    id: 'cap1_auto_1',
    categoria: 'confianza',
    texto: '¿Qué tan claro tienes las fases del potencial de acción?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap1_auto_2',
    categoria: 'confianza',
    texto: '¿Puedes aplicar la regla de vectores a cualquier derivación?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },

  /* ═══════════════════════════════════
     CAPÍTULO 2
     ═══════════════════════════════════ */
  {
    id: 'cap2_auto_1',
    categoria: 'confianza',
    texto: '¿Puedo identificar las 6 derivaciones de miembros y su ángulo en el plano frontal?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap2_auto_2',
    categoria: 'confianza',
    texto: '¿Entiendo la colocación correcta de los electrodos precordiales V1–V6 y la progresión normal de la onda R?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },

  /* ═══════════════════════════════════
     CAPÍTULO 3
     ═══════════════════════════════════ */
  {
    id: 'cap3_auto_1',
    categoria: 'confianza',
    texto: '¿Puedo describir la onda P, el QRS y la onda T con sus valores normales de duración y amplitud?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap3_auto_2',
    categoria: 'confianza',
    texto: '¿Entiendo el significado clínico del intervalo PR, el QTc y el segmento ST?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },

  /* ═══════════════════════════════════
     CAPÍTULO 4
     ═══════════════════════════════════ */
  {
    id: 'cap4_auto_1',
    categoria: 'confianza',
    texto: '¿Puedo calcular la frecuencia cardíaca con la regla de los 300 e identificar el ritmo sinusal?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap4_auto_2',
    categoria: 'confianza',
    texto: '¿Podría aplicar el checklist de los 5 pasos para interpretar un ECG de forma sistemática?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },

  /* ═══════════════════════════════════
     CAPÍTULO 5
     ═══════════════════════════════════ */
  {
    id: 'cap5_auto_1',
    categoria: 'confianza',
    texto: '¿Qué tan seguro/a te sientes identificando bloqueos de rama y arritmias en el ECG?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap5_auto_2',
    categoria: 'confianza',
    texto: '¿Qué tan preparado/a te sientes para reconocer isquemia, infarto y alteraciones electrolíticas?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },

  /* ═══════════════════════════════════
     CAPÍTULO 6
     ═══════════════════════════════════ */
  {
    id: 'cap6_auto_1',
    categoria: 'confianza',
    texto: '¿Qué tan seguro/a te sientes resolviendo casos clínicos con ECG usando el algoritmo sistemático?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap6_auto_2',
    categoria: 'confianza',
    texto: 'Reflexión final: ¿Cómo evalúas tu dominio general de la Guía de ECG completa?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  }

];

var LIKERT_Capitulo      = 'General';
var LIKERT_Titulo        = 'Autopercepción General';
var LIKERT_Descripcion   = 'Evalúa tu nivel de confianza en todos los temas del libro.';
var LIKERT_BadgesKey     = 'likert_full_badges';
