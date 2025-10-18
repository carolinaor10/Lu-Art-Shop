console.log('carrito.js cargado correctamente');
console.log('=== CARRITO.JS INICIANDO ===');

// Función de prueba simple
window.testCarrito = function() {
    console.log('Función de prueba testCarrito llamada');
    alert('Función de prueba funcionando');
};

// Función global para vaciar el carrito
function vaciarCarrito() {
    console.log('=== FUNCIÓN VACIAR CARRITO GLOBAL LLAMADA ===');
    alert('Función vaciarCarrito llamada');
}

// Hacer la función globalmente disponible
window.vaciarCarrito = vaciarCarrito;

console.log('carrito.js terminado correctamente');
