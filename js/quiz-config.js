/**
 * CONFIGURACIÓN UNIFICADA DE QUIZZES
 * Este archivo centraliza todas las configuraciones para mantener consistencia
 * entre todos los quizzes del proyecto.
 */

// Configuración de dificultad - ESTANDARIZADA para todos los quizzes
const DIFF_CONFIG = {
  suave:   { time: 60, lives: 3, bonus_mult: 1.0 },
  medio:   { time: 30, lives: 3, bonus_mult: 1.5 },
  intenso: { time: 15, lives: 2, bonus_mult: 2.0 }
};

// Configuración de energía - ESTANDARIZADA
const ENERGY_CONFIG = {
  max: 100,
  regenPerCorrect: 15,
  regenPerReflection: 25,
  lowThreshold: 30,
  critThreshold: 15,
  pulseDuration: 600,
  // Configuración por dificultad
  suave:   { loss: 15, recover: 7 },
  medio:   { loss: 20, recover: 10 },
  intenso: { loss: 30, recover: 12 }
};

// Configuración de insignias - ESTANDARIZADA
const ALL_BADGES = [
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    icon: '🏆',
    description: 'Responde todas las preguntas correctamente',
    check: (state) => state.wrongCount === 0 && state.correctCount === 10
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    icon: '🔥',
    description: 'Alcanza una racha de 5 o más respuestas correctas',
    check: (state) => state.bestStreak >= 5
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Completa el quiz en menos de 5 minutos',
    check: (state) => state.totalTime && state.totalTime <= 300
  },
  {
    id: 'energy_saver',
    name: 'Energy Saver',
    icon: '💚',
    description: 'Termina con más del 80% de energía',
    check: (state) => state.energy >= 80
  },
  {
    id: 'reflection_master',
    name: 'Reflection Master',
    icon: '🤔',
    description: 'Responde "Sí, entendí" al NPC 3 o más veces',
    check: (state) => state.npcYesCount >= 3
  }
];

// Estilos CSS compartidos - para importar consistentemente
const QUIZ_SHARED_STYLES = `
  /* Botones de dificultad - ESTANDARIZADOS */
  .diff-btn {
    padding: 12px 24px; border-radius: 8px; cursor: pointer;
    font-family: inherit; font-size: .88rem; font-weight: 600;
    border: 2px solid transparent; transition: all .2s;
    min-width: 160px; text-align: center;
  }
  .diff-btn.suave   { background: #0d2e1a; border-color: #22c55e; color: #22c55e; }
  .diff-btn.medio   { background: #2a1d0a; border-color: #f97316; color: #f97316; }
  .diff-btn.intenso { background: #2a0a0a; border-color: #ef4444; color: #ef4444; }
  .diff-btn.selected,
  .diff-btn:hover   { filter: brightness(1.3); transform: scale(1.04); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .diff-btn:active  { transform: scale(0.98); }
  .diff-btn.selected {
    box-shadow: 0 0 20px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.1);
  }
  
  /* Estadísticas - SIN FONDO para consistencia */
  .qs-stat {
    border-radius: 10px; padding: 14px 20px; text-align: center;
  }
  .qs-stat-num   { display: block; font-size: 1.4rem; font-weight: 700; color: #60c8ff; }
  .qs-stat-label { font-size: .75rem; color: #607080; }
`;

// Función para inicializar configuración en cualquier quiz
function initQuizConfig() {
  // Actualizar estadísticas en pantalla de inicio
  function updateStartStats(difficulty = 'medio') {
    const cfg = DIFF_CONFIG[difficulty];
    document.getElementById('statTime').textContent = cfg.time + 's';
    document.getElementById('statLives').textContent = cfg.lives;
  }
  
  return {
    DIFF_CONFIG,
    ENERGY_CONFIG,
    ALL_BADGES,
    updateStartStats
  };
}