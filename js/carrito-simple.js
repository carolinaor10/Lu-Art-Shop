console.log('=== CARRITO-SIMPLE.JS INICIANDO ===');

// Función básica de prueba
function testCarritoSimple() {
    console.log('Función testCarritoSimple ejecutada');
    alert('Carrito simple funcionando');
}

// Hacer la función global
window.testCarritoSimple = testCarritoSimple;

// Event listener básico
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded EN CARRITO-SIMPLE ===');
    console.log('Documento cargado en carrito-simple.js');
    
    // Verificar elementos básicos
    console.log('Elemento carritoModal:', document.getElementById('carritoModal'));
    console.log('Elemento modalPago:', document.getElementById('modalPago'));
    console.log('Bootstrap disponible:', typeof bootstrap !== 'undefined');
});

console.log('=== CARRITO-SIMPLE.JS COMPLETAMENTE CARGADO ===');
