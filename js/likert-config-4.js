/**
 * js/likert-config-4.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 4
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-4.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
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
  }
];

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 4';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 4';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap4_likert_badges';
