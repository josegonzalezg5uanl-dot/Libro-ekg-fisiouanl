/**
 * SCRIPT DE PRUEBA PARA VERIFICAR TEXTOS PERSONALIZADOS DEL NPC
 * Ejecutar este script en la consola del navegador (F12)
 * cuando estés en quiz-2.html
 * 
 * Este script verifica que los botones del NPC muestren
 * los textos cortos personalizados de las preguntas
 */

(function() {
    console.log('=== PRUEBA DE TEXTOS PERSONALIZADOS DEL NPC ===');
    
    // Función para simular una respuesta incorrecta y verificar los textos
    function probarTextosNPC() {
        console.log('\n🧪 Probando textos personalizados del NPC...');
        
        // Verificar que el estado existe
        if (typeof state === 'undefined' || !state.questions) {
            console.error('❌ ERROR: state o state.questions no está definido');
            return;
        }
        
        // Obtener la pregunta actual
        const q = state.questions[state.currentIdx];
        if (!q) {
            console.error('❌ ERROR: No hay pregunta actual');
            return;
        }
        
        console.log(`Pregunta actual: ${q.q}`);
        console.log(`¿Tiene reflexión? ${q.reflection ? 'Sí' : 'No'}`);
        console.log(`¿Tiene textos cortos?`);
        console.log(`- reflection_yes_short: ${q.reflection_yes_short || 'No definido'}`);
        console.log(`- reflection_partial_short: ${q.reflection_partial_short || 'No definido'}`);
        console.log(`- reflection_no_short: ${q.reflection_no_short || 'No definido'}`);
        
        // Simular fallar una pregunta para ver el feedback
        if (typeof showFeedbackWrong === 'function') {
            console.log('\n📢 Ejecutando showFeedbackWrong()...');
            
            // Crear una respuesta incorrecta de prueba
            const respuestaIncorrecta = Object.keys(q.opts).find(key => key !== q.answer) || 'A';
            
            // Llamar a la función para mostrar el feedback
            showFeedbackWrong(-20, respuestaIncorrecta, q);
            
            // Verificar los botones del NPC después de un pequeño delay
            setTimeout(() => {
                const botonesNPC = document.querySelectorAll('.npc-btn');
                console.log(`\n🎯 Botones NPC encontrados: ${botonesNPC.length}`);
                
                if (botonesNPC.length > 0) {
                    botonesNPC.forEach((btn, i) => {
                        const tipos = ['Sí, entendí', 'Parcialmente', 'No entendí'];
                        const textoReal = btn.textContent.trim();
                        const textoEsperado = i === 0 ? (q.reflection_yes_short || '✅ Entiendo — el error tiene sentido ahora') :
                                              i === 1 ? (q.reflection_partial_short || '🤔 Entendí algo, pero necesito repasar') :
                                              (q.reflection_no_short || '❌ No lo veo aún, necesito más contexto');
                        
                        console.log(`\nBotón ${i + 1}:`);
                        console.log(`- Texto real: "${textoReal}"`);
                        console.log(`- Texto esperado: "${textoEsperado}"`);
                        console.log(`- ¿Coincide? ${textoReal === textoEsperado ? '✅ SÍ' : '❌ NO'}`);
                        
                        if (textoReal === textoEsperado) {
                            console.log(`✅ ¡Botón ${i + 1} tiene el texto personalizado correcto!`);
                        } else if (textoReal === tipos[i]) {
                            console.log(`❌ Botón ${i + 1} tiene texto genérico en lugar del personalizado`);
                        } else {
                            console.log(`⚠️ Botón ${i + 1} tiene un texto diferente al esperado`);
                        }
                    });
                    
                    // Verificar si el fix está funcionando
                    const todosCorrectos = Array.from(botonesNPC).every((btn, i) => {
                        const textoEsperado = i === 0 ? (q.reflection_yes_short || '✅ Entiendo — el error tiene sentido ahora') :
                                              i === 1 ? (q.reflection_partial_short || '🤔 Entendí algo, pero necesito repasar') :
                                              (q.reflection_no_short || '❌ No lo veo aún, necesito más contexto');
                        return btn.textContent.trim() === textoEsperado;
                    });
                    
                    if (todosCorrectos) {
                        console.log('\n🎉 ¡ÉXITO! Todos los botones NPC tienen textos personalizados correctos');
                        console.log('✅ El fix está funcionando perfectamente');
                    } else {
                        console.log('\n❌ ALGUNOS BOTONES TODAVÍA TIENEN TEXTOS GENÉRICOS');
                        console.log('⚠️ El fix puede no estar aplicado correctamente');
                    }
                } else {
                    console.log('❌ No se encontraron botones NPC');
                    console.log('💡 Asegúrate de que la pregunta tenga reflexión activada');
                }
            }, 500);
        } else {
            console.error('❌ showFeedbackWrong no es una función');
        }
    }
    
    // Función para verificar el estado actual
    function verificarEstadoActual() {
        console.log('\n📊 ESTADO ACTUAL DEL QUIZ:');
        if (typeof state !== 'undefined') {
            console.log(`- Pregunta actual: ${state.currentIdx + 1} de ${state.questions?.length || 0}`);
            console.log(`- Vidas: ${state.lives || 0}`);
            console.log(`- Pregunta actual tiene reflexión: ${state.questions?.[state.currentIdx]?.reflection ? 'Sí' : 'No'}`);
            
            const q = state.questions?.[state.currentIdx];
            if (q) {
                console.log(`- Texto de reflexión: ${q.reflection || 'No definido'}`);
                console.log(`- Textos cortos personalizados:`);
                console.log(`  * reflection_yes_short: ${q.reflection_yes_short || 'No definido'}`);
                console.log(`  * reflection_partial_short: ${q.reflection_partial_short || 'No definido'}`);
                console.log(`  * reflection_no_short: ${q.reflection_no_short || 'No definido'}`);
            }
        } else {
            console.error('❌ state no está definido');
        }
    }
    
    // Ejecutar pruebas
    console.log('Instrucciones:');
    console.log('1. Asegúrate de estar en el Quiz 2');
    console.log('2. El quiz debe estar en la pantalla de preguntas');
    console.log('3. Ejecuta: verificarEstadoActual() para ver el estado actual');
    console.log('4. Ejecuta: probarTextosNPC() para probar los textos personalizados');
    
    // Hacer disponible globalmente
    window.verificarEstadoActual = verificarEstadoActual;
    window.probarTextosNPC = probarTextosNPC;
    
    console.log('\n=== LISTO PARA PROBAR ===');
    
})();