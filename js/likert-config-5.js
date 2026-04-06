/**
 * js/likert-config-5.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 5
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-5.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
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
  }
];

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 5';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 5';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap5_likert_badges';
