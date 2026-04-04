/**
 * VERIFICADOR DE SINTAXIS - QUIZ 2
 * Ejecutar en consola (F12) cuando estés en quiz-2.html
 * 
 * Este script verifica específicamente la sintaxis de los
 * template literals que fueron modificados
 */

(function() {
    console.clear();
    console.log('🔍 VERIFICADOR DE SINTAXIS - QUIZ 2');
    console.log('=====================================');
    
    console.log('\n📋 PASOS A SEGUIR:');
    console.log('1. Abre esta página: https://tusitio.com/quiz-2.html');
    console.log('2. Presiona F12 para abrir la consola');
    console.log('3. Copia y pega TODO este script en la consola');
    console.log('4. Presiona Enter y observa los resultados');
    
    console.log('\n🎯 OBJETIVO: Identificar errores de sintaxis específicos');
    
    // Paso 1: Verificar la función específica que mencionamos
    console.log('\n1️⃣ ANALIZANDO LA FUNCIÓN showFeedbackWrong():');
    
    if (typeof showFeedbackWrong === 'function') {
        try {
            // Obtener el código fuente de la función
            const codigoFuncion = showFeedbackWrong.toString();
            console.log('Código de la función:');
            console.log('%c' + codigoFuncion, 'color: #c8d8e8; background: #1e2d40; padding: 10px;');
            
            // Buscar template literals específicos
            const templateLiterals = codigoFuncion.match(/`[^`]*\$\{[^}]*\}[^`]*`/g) || [];
            console.log(`\nTemplate literals encontrados: ${templateLiterals.length}`);
            
            templateLiterals.forEach((template, i) => {
                console.log(`\nTemplate ${i+1}:`);
                console.log('%c' + template, 'color: #22c55e; background: #0d2e1a; padding: 8px; border-radius: 4px;');
                
                // Verificar si el template tiene la sintaxis correcta
                try {
                    // Intentar evaluar el template en un contexto seguro
                    const testEval = new Function('return ' + template)();
                    console.log(`✅ Template ${i+1}: SINTAXIS CORRECTA`);
                } catch (e) {
                    console.error(`❌ Template ${i+1}: ERROR DE SINTAXIS`);
                    console.error('Detalles del error:', e.message);
                }
            });
            
        } catch (error) {
            console.error('❌ Error al analizar la función:', error);
        }
    } else {
        console.error('❌ CRÍTICO: showFeedbackWrong no es una función');
    }
    
    // Paso 2: Probar con datos reales
    console.log('\n2️⃣ PROBANDO CON DATOS REALES:');
    
    // Crear un estado de prueba si no existe
    if (typeof state === 'undefined') {
        console.warn('⚠️ state no existe, creando uno de prueba...');
        window.state = {
            questions: [{
                q: "¿Cuántos electrodos se colocan en el tórax?",
                opts: { A: "4", B: "6", C: "3", D: "12" },
                answer: "B",
                reflection: "¿Por qué crees que se necesitan 6 derivaciones?",
                reflection_yes_short: "¡Perfecto! Comprendes la importancia de las 6 derivaciones.",
                reflection_partial_short: "Entiendo parcialmente, necesito repasar.",
                reflection_no_short: "No lo tengo claro, necesito más explicación."
            }],
            currentIdx: 0
        };
    }
    
    // Probar el template literal específico
    console.log('\n3️⃣ PROBANDO EL TEMPLATE LITERAL ESPECÍFICO:');
    
    try {
        const q = state.questions[state.currentIdx];
        const yesText = q.reflection_yes_short || '✅ Entiendo — el error tiene sentido ahora';
        const partialText = q.reflection_partial_short || '🤔 Entendí algo, pero necesito repasar';
        const noText = q.reflection_no_short || '❌ No lo veo aún, necesito más contexto';
        
        // Este es exactamente el template que modificamos
        const templatePrueba = `
      <button class="npc-btn" onclick="selectNPCOption('yes')">${yesText}</button>
      <button class="npc-btn" onclick="selectNPCOption('partial')">${partialText}</button>
      <button class="npc-btn" onclick="selectNPCOption('no')">${noText}</button>
    `;
        
        console.log('Template de prueba:');
        console.log('%c' + templatePrueba, 'color: #f97316; background: #2a1d0a; padding: 8px; border-radius: 4px;');
        
        // Verificar la sintaxis
        try {
            new Function('return `' + templatePrueba.replace(/`/g, '\`') + '`')();
            console.log('✅ SINTAXIS DEL TEMPLATE: CORRECTA');
        } catch (e) {
            console.error('❌ ERROR DE SINTAXIS EN TEMPLATE:', e.message);
        }
        
    } catch (error) {
        console.error('❌ Error en prueba de template:', error);
    }
    
    // Paso 4: Verificar si hay errores de variables no definidas
    console.log('\n4️⃣ VERIFICANDO VARIABLES NO DEFINIDAS:');
    
    // Verificar si las variables que usamos están definidas
    const variablesNecesarias = ['q', 'yesText', 'partialText', 'noText'];
    variablesNecesarias.forEach(varName => {
        try {
            // Intentar acceder a la variable en el contexto
            if (typeof eval(varName) === 'undefined') {
                console.warn(`⚠️ La variable ${varName} podría no estar definida`);
            } else {
                console.log(`✅ Variable ${varName}: DEFINIDA`);
            }
        } catch (e) {
            console.error(`❌ Variable ${varName}: NO DEFINIDA (${e.message})`);
        }
    });
    
    // Paso 5: Probar la función completa
    console.log('\n5️⃣ PROBANDO LA FUNCIÓN COMPLETA:');
    
    if (typeof showFeedbackWrong === 'function') {
        console.log('Ejecutando showFeedbackWrong con respuesta incorrecta...');
        
        // Crear elementos DOM necesarios si no existen
        const elementosDOM = ['fbIcon', 'fbTitle', 'fbPts', 'fbReflection', 'fbReflectionQ', 'npcOpts', 'feedbackPanel'];
        elementosDOM.forEach(id => {
            if (!document.getElementById(id)) {
                const elem = document.createElement('div');
                elem.id = id;
                document.body.appendChild(elem);
                console.log(`📄 Creado elemento DOM: ${id}`);
            }
        });
        
        try {
            showFeedbackWrong('A', state.questions[state.currentIdx]);
            console.log('✅ FUNCIÓN EJECUTADA SIN ERRORES');
            
            // Verificar el resultado
            setTimeout(() => {
                const botones = document.querySelectorAll('.npc-btn');
                console.log(`\n📋 RESULTADO FINAL:`);
                console.log(`Botones creados: ${botones.length}`);
                botones.forEach((btn, i) => {
                    console.log(`Botón ${i+1}: "${btn.textContent.trim()}"`);
                });
                
                if (botones.length > 0) {
                    console.log('\n🎉 ¡LA FUNCIÓN FUNCIONA! El problema debe estar en otro lugar.');
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ ERROR AL EJECUTAR showFeedbackWrong():', error);
            console.error('Stack completo:', error.stack);
        }
    } else {
        console.error('❌ CRÍTICO: showFeedbackWrong no está disponible');
    }
    
    console.log('\n=== DIAGNÓSTICO COMPLETADO ===');
    console.log('Revisa todos los mensajes para identificar el problema específico.');
    console.log('Si la sintaxis es correcta, el problema puede estar en:');
    console.log('- Variables no definidas');
    console.log('- Orden de carga de scripts');
    console.log('- Conflicto con otros scripts');
    
})();