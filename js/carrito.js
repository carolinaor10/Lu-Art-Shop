// SCRIPT CARRITO.JS COMPLETAMENTE DESHABILITADO
// Este script estaba causando conflictos con los modales protegidos
console.log('🚫🚫🚫 CARRITO.JS DESHABILITADO - VERSIÓN 20241220 - NO DEBERÍA EJECUTARSE 🚫🚫🚫');
console.log('⚠️ CARRITO.JS DESHABILITADO - USANDO FUNCIONES DE INDEX.HTML ⚠️');

// Función básica de limpieza que respeta modales protegidos
window.limpiarTodo = function() {
    console.log('=== LIMPIEZA DE EMERGENCIA DESDE CARRITO.JS DESHABILITADO ===');
    
    // Verificar si hay modales protegidos abiertos
    const carritoAbierto = document.getElementById('carritoModal')?.classList.contains('show');
    const pagoAbierto = document.getElementById('modalPago')?.classList.contains('show');
    
    if (carritoAbierto || pagoAbierto) {
        console.log('🚫 NO limpiando - modales protegidos abiertos');
        return;
    }
    
    // Solo limpiar si no hay modales protegidos
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    console.log('✅ Limpieza completada');
};