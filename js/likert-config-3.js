/**
 * js/likert-config-3.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 3
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-3.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
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
  }
];

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 3';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 3';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap3_likert_badges';
