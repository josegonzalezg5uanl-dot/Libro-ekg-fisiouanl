/**
 * DIAGNÓSTICO ESPECÍFICO PARA QUIZ 2
 * Ejecutar este script en la consola del navegador (F12)
 * cuando estés en quiz-2.html
 * 
 * Este script identificará exactamente dónde está el problema
 */

(function() {
    console.clear();
    console.log('🔍 DIAGNÓSTICO ESPECÍFICO PARA QUIZ 2');
    console.log('=====================================');
    
    // Paso 1: Verificar el estado global
    console.log('\n1️⃣ VERIFICANDO ESTADO GLOBAL:');
    if (typeof state === 'undefined') {
        console.error('❌ CRÍTICO: state no está definido');
        console.log('Creando state de prueba...');
        window.state = {
            questions: [{
                q: "¿Cuántos electrodos se colocan en el tórax para las derivaciones precordiales?",
                opts: { A: "4", B: "6", C: "3", D: "12" },
                answer: "B",
                reflection: "¿Por qué crees que se necesitan exactamente 6 derivaciones precordiales?",
                reflection_yes_short: "¡Perfecto! Comprendes la importancia de las 6 derivaciones.",
                reflection_partial_short: "Entiendo parcialmente, pero necesito repasar el concepto.",
                reflection_no_short: "No lo tengo claro, necesito más explicación.",
                reflection_yes: "Excelente reflexión sobre las derivaciones.",
                reflection_partial: "Es comprensible tener dudas sobre las derivaciones.",
                reflection_no: "No te preocupes, es normal tener dificultades al principio."
            }],
            currentIdx: 0,
            lives: 3,
            earnedBadges: [],
            diff: 'medio'
        };
    } else {
        console.log('✅ state está definido');
        console.log('Contenido de state:', state);
    }
    
    // Paso 2: Verificar funciones críticas
    console.log('\n2️⃣ VERIFICANDO FUNCIONES CRÍTICAS:');
    const funciones = [
        'processAnswer',
        'showFeedbackWrong', 
        'showCharacterSheet',
        'selectNPCOption',
        'answerMCQ',
        'renderQuestion'
    ];
    
    funciones.forEach(nombre => {
        if (typeof window[nombre] === 'function') {
            console.log(`✅ ${nombre}: FUNCIONA`);
        } else {
            console.error(`❌ ${nombre}: NO DEFINIDA o NO ES FUNCIÓN`);
        }
    });
    
    // Paso 3: Probar la función específica que modificamos
    console.log('\n3️⃣ PROBANDO showFeedbackWrong() CON CORRECCIÓN:');
    
    if (typeof showFeedbackWrong === 'function') {
        try {
            // Crear elementos DOM necesarios si no existen
            const elementosNecesarios = [
                { id: 'fbIcon', tag: 'div' },
                { id: 'fbTitle', tag: 'div' },
                { id: 'fbPts', tag: 'div' },
                { id: 'fbCorrectAnswer', tag: 'div' },
                { id: 'fbReflection', tag: 'div' },
                { id: 'fbReflectionQ', tag: 'div' },
                { id: 'npcOpts', tag: 'div' },
                { id: 'feedbackPanel', tag: 'div' }
            ];
            
            elementosNecesarios.forEach(elem => {
                if (!document.getElementById(elem.id)) {
                    const div = document.createElement(elem.tag);
                    div.id = elem.id;
                    document.body.appendChild(div);
                    console.log(`📄 Creado elemento: ${elem.id}`);
                }
            });
            
            // Obtener la pregunta actual
            const q = state.questions[state.currentIdx];
            console.log('Pregunta actual:', q);
            
            // Verificar que tenga los textos de reflexión
            console.log('Textos de reflexión:', {
                reflection: q.reflection,
                reflection_yes_short: q.reflection_yes_short,
                reflection_partial_short: q.reflection_partial_short,
                reflection_no_short: q.reflection_no_short
            });
            
            // Ejecutar la función
            console.log('Ejecutando showFeedbackWrong("A", pregunta)...');
            showFeedbackWrong('A', q);
            
            // Verificar el resultado después de un delay
            setTimeout(() => {
                console.log('\n📋 RESULTADO DE LA FUNCIÓN:');
                const npcButtons = document.querySelectorAll('.npc-btn');
                console.log(`Botones NPC encontrados: ${npcButtons.length}`);
                
                if (npcButtons.length > 0) {
                    npcButtons.forEach((btn, i) => {
                        const texto = btn.textContent.trim();
                        console.log(`Botón ${i+1}: "${texto}"`);
                        
                        // Verificar si es el texto esperado
                        const textosEsperados = [
                            q.reflection_yes_short || '✅ Entiendo — el error tiene sentido ahora',
                            q.reflection_partial_short || '🤔 Entendí algo, pero necesito repasar',
                            q.reflection_no_short || '❌ No lo veo aún, necesito más contexto'
                        ];
                        
                        const esCorrecto = texto === textosEsperados[i];
                        console.log(`¿Texto correcto? ${esCorrecto ? '✅ SÍ' : '❌ NO'}`);
                    });
                    
                    console.log('\n🎉 VERIFICACIÓN COMPLETADA');
                    console.log('El problema debería estar identificado. Revisa los mensajes anteriores.');
                } else {
                    console.error('❌ No se crearon los botones NPC');
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ ERROR EN showFeedbackWrong():', error);
            console.error('Stack completo:', error.stack);
        }
    } else {
        console.error('❌ CRÍTICO: showFeedbackWrong no es una función');
    }
    
    // Paso 4: Verificar la sintaxis del template literal
    console.log('\n4️⃣ VERIFICANDO SINTAXIS DE TEMPLATE LITERALS:');
    
    // Crear un test de template literal
    try {
        const testTemplate = `Texto de prueba ${1 + 1} más texto`;
        console.log('✅ Template literals funcionan correctamente');
        console.log('Ejemplo:', testTemplate);
    } catch (error) {
        console.error('❌ ERROR con template literals:', error);
    }
    
    // Paso 5: Verificar si hay errores de variables no definidas
    console.log('\n5️⃣ VERIFICANDO VARIABLES CRÍTICAS:');
    
    const variablesCriticas = ['ENERGY_CONFIG', 'DIFF_CONFIG', 'ALL_BADGES'];
    variablesCriticas.forEach(varName => {
        if (typeof window[varName] === 'undefined') {
            console.error(`❌ ${varName} no está definida`);
        } else {
            console.log(`✅ ${varName} está definida`);
        }
    });
    
    console.log('\n=== DIAGNÓSTICO COMPLETADO ===');
    console.log('Revisa todos los mensajes anteriores para identificar el problema específico.');
    
})();