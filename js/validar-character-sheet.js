/**
 * VALIDADOR DE showCharacterSheet() PARA QUIZ 2
 * Ejecutar este script en la consola del navegador (F12)
 * cuando estés en quiz-2.html
 */

(function() {
    console.log('=== VALIDADOR DE showCharacterSheet() ===');
    
    // Verificar que la función existe
    if (typeof showCharacterSheet !== 'function') {
        console.error('❌ ERROR: showCharacterSheet no está definida');
        return;
    }
    console.log('✅ showCharacterSheet está definida');
    
    // Verificar que ALL_BADGES existe
    if (typeof ALL_BADGES === 'undefined') {
        console.error('❌ ERROR: ALL_BADGES no está definida');
        return;
    }
    console.log('✅ ALL_BADGES está definida');
    
    // Verificar que state existe
    if (typeof state === 'undefined') {
        console.error('❌ ERROR: state no está definido');
        return;
    }
    console.log('✅ state está definido');
    
    // Probar la función
    console.log('🧪 Probando showCharacterSheet()...');
    try {
        // Ejecutar la función
        showCharacterSheet();
        console.log('✅ showCharacterSheet() ejecutada sin errores');
        
        // Verificar que se creó el modal
        const modal = document.querySelector('.character-modal');
        if (modal) {
            console.log('✅ Modal creado exitosamente');
            
            // Verificar contenido del modal
            const content = modal.querySelector('.character-content');
            if (content) {
                console.log('✅ Contenido del modal encontrado');
                
                // Verificar avatar
                const avatar = content.querySelector('.character-avatar');
                if (avatar && avatar.textContent === '🧑‍⚕️') {
                    console.log('✅ Avatar encontrado');
                }
                
                // Verificar stats
                const stats = content.querySelectorAll('.stat-item');
                console.log(`✅ Encontrados ${stats.length} stats`);
                
                // Verificar insignias
                const badges = content.querySelectorAll('.badge-item');
                console.log(`✅ Encontradas ${badges.length} insignias`);
                
                // Verificar que las insignias tienen la estructura correcta
                badges.forEach((badge, i) => {
                    const icon = badge.querySelector('.badge-icon');
                    const name = badge.querySelector('.badge-name');
                    const desc = badge.querySelector('.badge-desc');
                    
                    if (icon && name && desc) {
                        console.log(`✅ Insignia ${i + 1}: estructura completa`);
                    } else {
                        console.warn(`⚠️ Insignia ${i + 1}: estructura incompleta`);
                    }
                });
                
                console.log('🎉 VALIDACIÓN COMPLETADA: showCharacterSheet() funciona correctamente');
                
                // Cerrar el modal
                setTimeout(() => {
                    const closeBtn = content.querySelector('.character-close');
                    if (closeBtn) {
                        closeBtn.click();
                        console.log('✅ Modal cerrado exitosamente');
                    }
                }, 3000);
                
            } else {
                console.error('❌ No se encontró el contenido del modal');
            }
            
        } else {
            console.error('❌ No se creó el modal');
        }
        
    } catch (error) {
        console.error('❌ ERROR al ejecutar showCharacterSheet():', error);
        console.error('Stack trace:', error.stack);
    }
    
    console.log('=== FIN DE VALIDACIÓN ===');
})();