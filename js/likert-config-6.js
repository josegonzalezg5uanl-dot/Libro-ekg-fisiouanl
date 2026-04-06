/**
 * js/likert-config-6.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 6
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-6.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
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

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 6';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 6';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap6_likert_badges';
