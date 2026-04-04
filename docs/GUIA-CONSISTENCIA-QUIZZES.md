# GUIA DE CONSISTENCIA PARA QUIZZES

## 📋 PROBLEMA RESUELTO
Se identificaron inconsistencias entre el Quiz 1 y Quiz 2:
- Diferentes tiempos y vidas por dificultad
- Estilos visuales distintos (recuadros grises)
- Configuraciones duplicadas y desactualizadas

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. ARCHIVO DE CONFIGURACIÓN COMPARTIDA
Se creó `js/quiz-config.js` que centraliza:
- `DIFF_CONFIG`: Tiempos, vidas y multiplicadores de bonus
- `ENERGY_CONFIG`: Sistema de energía por dificultad
- `ALL_BADGES`: Insignias disponibles
- Estilos CSS compartidos

### 2. CONFIGURACIÓN ESTÁNDAR
TODOS los quizzes deben usar:
```javascript
// Dificultad    Tiempo    Vidas    Multiplicador
suave:   { time: 60,  lives: 3, bonus_mult: 1.0 }
medio:   { time: 30,  lives: 3, bonus_mult: 1.5 }
intenso: { time: 15,  lives: 2, bonus_mult: 2.0 }
```

### 3. ESTILOS VISUALES UNIFICADOS
- Botones de dificultad con emojis y formato consistente
- Sin fondos en `.qs-stat` (eliminar recuadros grises)
- Mismo formato de información (tiempo + vidas)

## 📝 PROTOCOLO PARA FUTUROS QUIZZES

### PASO 1: INCLUIR CONFIGURACIÓN
```html
<!-- Antes de cualquier script de quiz -->
<script src="js/quiz-config.js"></script>
```

### PASO 2: USAR CONFIGURACIÓN COMPARTIDA
```javascript
// NO definir DIFF_CONFIG localmente
// Usar las variables globales del archivo compartido:
const cfg = DIFF_CONFIG[state.diff]; // ✅ Correcto
```

### PASO 3: FORMATO DE BOTONES ESTÁNDAR
```html
<button class="diff-btn suave">😌 Suave (60s · 3 vidas)</button>
<button class="diff-btn medio">😤 Medio (30s · 3 vidas)</button>
<button class="diff-btn intenso">🔥 Intenso (15s · 2 vidas)</button>
```

### PASO 4: ESTADÍSTICAS DE INICIO
```javascript
function setDiff(d) {
  state.diff = d;
  // Actualizar con valores de DIFF_CONFIG compartido
  document.getElementById('statTime').textContent = DIFF_CONFIG[d].time + 's';
  document.getElementById('statLives').textContent = DIFF_CONFIG[d].lives;
}
```

### PASO 5: VERIFICACIÓN DE CONSISTENCIA
Antes de publicar un nuevo quiz, verificar:
- [ ] ¿Usa `js/quiz-config.js`?
- [ ] ¿Tienen los mismos tiempos y vidas?
- [ ] ¿Los botones tienen el mismo formato?
- [ ] ¿No hay fondos oscuros en `.qs-stat`?
- [ ] ¿La función `setDiff` actualiza correctamente?

## 🔄 MANTENIMIENTO
Si se necesita cambiar configuraciones:
1. **Siempre** modificar `js/quiz-config.js`
2. **Nunca** definir configuraciones locales
3. **Todos** los quizzes heredarán los cambios automáticamente

## 📊 BENEFICIOS
- ✅ Consistencia garantizada entre quizzes
- ✅ Mantenimiento centralizado
- ✅ Reducción de errores
- ✅ Facilita agregar nuevos quizzes
- ✅ Cambios se propagan a todos los quizzes

## 🎯 EJEMPLO COMPLETO
Ver `quiz-2.html` después de esta actualización para ver la implementación correcta.