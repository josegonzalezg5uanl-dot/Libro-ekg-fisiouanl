/**
 * js/likert-config-2.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 2
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-2.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
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
  }
];

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 2';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 2';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap2_likert_badges';
