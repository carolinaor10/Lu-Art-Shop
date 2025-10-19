console.log('=== CARRITO-NUEVO.JS INICIANDO ===');

// Variables globales
let carrito = [];

// Función básica para obtener productos
function getProductsFromAdmin() {
    const adminProducts = localStorage.getItem('luArtProducts');
    if (adminProducts) {
        try {
            return JSON.parse(adminProducts);
        } catch (e) {
            console.error('Error parseando productos:', e);
            return [];
        }
    }
    return [];
}

// Función básica para renderizar carrito
function renderCarrito() {
    console.log('=== RENDERIZANDO CARRITO ===');
    console.log('Carrito tiene', carrito.length, 'productos');
    
    // Buscar elemento del carrito
    let tbody = document.getElementById("carrito-body");
    if (!tbody) {
        tbody = document.querySelector("#carritoModal tbody");
    }
    if (!tbody) {
        tbody = document.querySelector(".modal-body tbody");
    }
    
    if (!tbody) {
        console.warn('No se encontró elemento para renderizar carrito');
        return;
    }
    
    console.log('Elemento encontrado:', tbody);
    
    // Limpiar contenido
    tbody.innerHTML = "";
    
    if (carrito.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos en el carrito</td></tr>';
    } else {
        carrito.forEach(item => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td>₡${item.precio.toLocaleString()}</td>
                <td>${item.cantidad}</td>
                <td>₡${(item.precio * item.cantidad).toLocaleString()}</td>
                <td>
                    <button onclick="eliminarDelCarrito(${item.id})" class="btn btn-sm btn-danger">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.textContent = `Total: ₡${total.toLocaleString()}`;
    }
    
    console.log('Carrito renderizado correctamente');
}

// Función para vaciar carrito
function vaciarCarrito() {
    console.log('=== VACIANDO CARRITO ===');
    carrito = [];
    localStorage.removeItem('luArtCarrito');
    renderCarrito();
    console.log('Carrito vaciado');
}

// Función para eliminar del carrito
function eliminarDelCarrito(id) {
    console.log('Eliminando producto con ID:', id);
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('luArtCarrito', JSON.stringify(carrito));
    renderCarrito();
}

// Función para limpiar estado de modales
function limpiarEstadoModales() {
    console.log('=== LIMPIANDO ESTADO DE MODALES ===');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    console.log('Estado de modales limpiado');
}

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.limpiarEstadoModales = limpiarEstadoModales;
window.renderCarrito = renderCarrito;

// Event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded EN CARRITO-NUEVO ===');
    
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('luArtCarrito');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            console.log('Carrito cargado desde localStorage:', carrito.length, 'productos');
        } catch (e) {
            console.error('Error cargando carrito:', e);
            carrito = [];
        }
    }
    
    // Event listeners para modales
    const carritoModal = document.getElementById('carritoModal');
    if (carritoModal) {
        carritoModal.addEventListener('show.bs.modal', function() {
            console.log('Modal de carrito abriéndose');
            renderCarrito();
        });
        
        carritoModal.addEventListener('hidden.bs.modal', function() {
            console.log('Modal de carrito cerrado');
            limpiarEstadoModales();
        });
    }
    
    const modalPago = document.getElementById('modalPago');
    if (modalPago) {
        modalPago.addEventListener('hidden.bs.modal', function() {
            console.log('Modal de pago cerrado');
            limpiarEstadoModales();
        });
    }
    
    console.log('=== CARRITO-NUEVO CONFIGURADO ===');
});

console.log('=== CARRITO-NUEVO.JS COMPLETAMENTE CARGADO ===');
