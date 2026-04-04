/**
 * SCRIPT DE PRUEBA PARA VERIFICAR EL FIX DEL GAME OVER
 * Ejecutar este script en la consola del navegador (F12)
 * cuando estés en quiz-2.html
 * 
 * Este script simulará la pérdida de todas las vidas para verificar
 * que el Game Over se active correctamente
 */

(function() {
    console.log('=== PRUEBA DE GAME OVER INMEDIATO ===');
    
    // Función para simular una respuesta incorrecta
    function simularRespuestaIncorrecta() {
        console.log(`Vidas actuales: ${state.lives}`);
        
        // Buscar el botón de una respuesta incorrecta
        const q = state.questions[state.currentIdx];
        const opciones = document.querySelectorAll('.q-opt');
        const respuestaIncorrecta = Object.keys(q.opts).find(key => key !== q.answer);
        
        console.log(`Respuesta correcta: ${q.answer}`);
        console.log(`Respuesta incorrecta a seleccionar: ${respuestaIncorrecta}`);
        
        // Hacer clic en la respuesta incorrecta
        const botonIncorrecto = Array.from(opciones).find(btn => 
            btn.textContent.includes(q.opts[respuestaIncorrecta])
        );
        
        if (botonIncorrecto) {
            console.log('Haciendo clic en respuesta incorrecta...');
            botonIncorrecto.click();
        } else {
            console.error('No se encontró el botón de respuesta incorrecta');
        }
    }
    
    // Función para verificar el estado del juego
    function verificarEstado() {
        setTimeout(() => {
            console.log(`\nEstado actual:`);
            console.log(`- Vidas: ${state.lives}`);
            console.log(`- Timer activo: ${state.timerInterval ? 'Sí' : 'No'}`);
            console.log(`- Botones de opción: ${document.querySelector('.q-opt') ? 'Presentes' : 'No presentes'}`);
            console.log(`- Modal de Game Over: ${document.querySelector('#screen-gameover') ? 'Presente' : 'No presente'}`);
            
            // Verificar si apareció el Game Over
            const gameOverScreen = document.querySelector('#screen-gameover');
            if (gameOverScreen && gameOverScreen.style.display !== 'none') {
                console.log('✅ ¡GAME OVER ACTIVADO CORRECTAMENTE!');
                console.log('✅ El fix funciona: no se puede seguir jugando con 0 vidas');
            } else {
                console.log('⚠️ Game Over no detectado aún...');
            }
        }, 2000);
    }
    
    // Función principal de prueba
    function iniciarPrueba() {
        console.log('Iniciando prueba de Game Over...');
        console.log(`Dificultad actual: ${state.diff}`);
        console.log(`Vidas iniciales: ${state.lives}`);
        
        // Verificar que estemos en una dificultad con pocas vidas (Intenso = 2 vidas)
        if (state.lives > 2) {
            console.log('Cambiando a dificultad Intenso para prueba rápida...');
            setDiff('intenso');
        }
        
        console.log('\n=== PRIMER INTENTO ===');
        simularRespuestaIncorrecta();
        
        // Después de 3 segundos, intentar segunda respuesta incorrecta
        setTimeout(() => {
            if (state.lives === 1) {
                console.log('\n=== SEGUNDO INTENTO (debería activar Game Over) ===');
                simularRespuestaIncorrecta();
                verificarEstado();
            }
        }, 3000);
    }
    
    // Función auxiliar para cambiar dificultad
    function setDiff(d) {
        if (typeof setDiff === 'function') {
            setDiff(d);
        } else {
            console.log(`Simulando cambio a dificultad: ${d}`);
            state.diff = d;
            state.lives = DIFF_CONFIG[d].lives;
            console.log(`Vidas actualizadas a: ${state.lives}`);
        }
    }
    
    // Iniciar la prueba
    console.log('Ejecuta: iniciarPrueba()');
    console.log('O espera a que el quiz esté listo y ejecutaré automáticamente...');
    
    // Auto-iniciar cuando el quiz esté listo
    const intentarAutoInicio = setInterval(() => {
        if (typeof state !== 'undefined' && state.questions && state.questions.length > 0) {
            clearInterval(intentarAutoInicio);
            console.log('Quiz detectado como listo. Iniciando prueba automática...');
            setTimeout(iniciarPrueba, 2000);
        }
    }, 1000);
    
    // Hacer disponible globalmente
    window.iniciarPrueba = iniciarPrueba;
    
    console.log('=== INSTRUCCIONES ===');
    console.log('1. Asegúrate de estar en el Quiz 2');
    console.log('2. El quiz debe estar en pantalla de preguntas');
    console.log('3. Ejecuta: iniciarPrueba()');
    console.log('4. El script fallará 2 preguntas seguidas');
    console.log('5. Verifica que aparezca el Game Over');
    
})();