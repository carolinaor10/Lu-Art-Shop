// Script de sincronización para páginas web
// Permite que las páginas web lean los datos actualizados desde el panel de administración

console.log('=== ADMIN-SYNC.JS CARGADO ===');

// Función para obtener datos de productos desde el admin
function obtenerProductosDesdeAdmin() {
    try {
        // Intentar leer de luArtProducts (formato del admin)
        const datosAdmin = localStorage.getItem('luArtProducts');
        if (datosAdmin) {
            const products = JSON.parse(datosAdmin);
            console.log('Productos cargados desde luArtProducts:', products.length);
            
            // Convertir al formato esperado por el script
            const datosAdminFormateados = {
                paletas: products.filter(p => p.category === 'paletas').map(p => ({
                    id: p.id,
                    nombre: p.name,
                    precio: p.price,
                    stock: p.stock,
                    categoria: 'paletas',
                    imagen: p.image,
                    descripcion: p.description
                })),
                tazas: products.filter(p => p.category === 'tazas').map(p => ({
                    id: p.id,
                    nombre: p.name,
                    precio: p.price,
                    stock: p.stock,
                    categoria: 'tazas',
                    imagen: p.image,
                    descripcion: p.description
                })),
                snackbowls: products.filter(p => p.category === 'snackbowls').map(p => ({
                    id: p.id,
                    nombre: p.name,
                    precio: p.price,
                    stock: p.stock,
                    categoria: 'snackbowls',
                    imagen: p.image,
                    descripcion: p.description
                }))
            };
            
            return datosAdminFormateados;
        }
    } catch (error) {
        console.error('Error cargando datos del admin:', error);
    }
    return null;
}

// Función para obtener el stock de un producto específico
function obtenerStockProducto(id, categoria) {
    const datosAdmin = obtenerProductosDesdeAdmin();
    if (datosAdmin && datosAdmin[categoria]) {
        const producto = datosAdmin[categoria].find(p => p.id === id);
        return producto ? producto.stock : null;
    }
    return null;
}

// Función para verificar si un producto está disponible
function esProductoDisponible(id, categoria) {
    const stock = obtenerStockProducto(id, categoria);
    return stock !== null && stock > 0;
}

// Función para actualizar botones de productos según el stock
function actualizarBotonesProductos() {
    console.log('=== SINCRONIZANDO PRODUCTOS CON ADMIN ===');
    
    const datosAdmin = obtenerProductosDesdeAdmin();
    if (!datosAdmin) {
        console.log('No hay datos del admin disponibles');
        return;
    }
    
    console.log('Datos del admin cargados:', datosAdmin);
    
    // Actualizar botones de paletas
    if (datosAdmin.paletas) {
        console.log('Actualizando botones de paletas...');
        datosAdmin.paletas.forEach(producto => {
            const boton = document.querySelector(`[data-id="${producto.id}"][data-categoria="paletas"]`);
            if (boton) {
                console.log(`Actualizando paleta: ${producto.nombre} - Stock: ${producto.stock}`);
                // Solo actualizar el atributo data-stock, no el HTML
                boton.dataset.stock = producto.stock;
                boton.disabled = producto.stock === 0;
                
                console.log(`✅ Paleta actualizada: ${producto.nombre} - Stock: ${producto.stock}`);
            } else {
                console.log(`❌ Botón no encontrado para paleta: ${producto.nombre} (ID: ${producto.id})`);
            }
        });
    }
    
    // Actualizar botones de tazas
    if (datosAdmin.tazas) {
        console.log('Actualizando botones de tazas...');
        datosAdmin.tazas.forEach(producto => {
            const boton = document.querySelector(`[data-id="${producto.id}"][data-categoria="tazas"]`);
            if (boton) {
                console.log(`Actualizando taza: ${producto.nombre} - Stock: ${producto.stock}`);
                // Solo actualizar el atributo data-stock, no el HTML
                boton.dataset.stock = producto.stock;
                boton.disabled = producto.stock === 0;
                
                console.log(`✅ Taza actualizada: ${producto.nombre} - Stock: ${producto.stock}`);
            } else {
                console.log(`❌ Botón no encontrado para taza: ${producto.nombre} (ID: ${producto.id})`);
            }
        });
    }
    
    // Actualizar botones de snack bowls
    if (datosAdmin.snackbowls) {
        console.log('Actualizando botones de snack bowls...');
        datosAdmin.snackbowls.forEach(producto => {
            const boton = document.querySelector(`[data-id="${producto.id}"][data-categoria="snackbowls"]`);
            if (boton) {
                console.log(`Actualizando snack bowl: ${producto.nombre} - Stock: ${producto.stock}`);
                // Solo actualizar el atributo data-stock, no el HTML
                boton.dataset.stock = producto.stock;
                boton.disabled = producto.stock === 0;
                
                console.log(`✅ Snack bowl actualizado: ${producto.nombre} - Stock: ${producto.stock}`);
            } else {
                console.log(`❌ Botón no encontrado para snack bowl: ${producto.nombre} (ID: ${producto.id})`);
            }
        });
    }
    
    console.log('=== SINCRONIZACIÓN COMPLETADA ===');
}

// Función para escuchar cambios en el admin
function escucharCambiosAdmin() {
    let ultimaActualizacion = localStorage.getItem('luArtProductosActualizados');
    
    setInterval(() => {
        const nuevaActualizacion = localStorage.getItem('luArtProductosActualizados');
        if (nuevaActualizacion && nuevaActualizacion !== ultimaActualizacion) {
            console.log('Cambios detectados en el admin, sincronizando...');
            actualizarBotonesProductos();
            ultimaActualizacion = nuevaActualizacion;
        }
    }, 2000); // Verificar cada 2 segundos
}

// Función para mostrar notificación de sincronización
function mostrarNotificacionSincronizacion() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Sincronizado',
            text: 'Los productos se han actualizado desde el panel de administración',
            timer: 2000,
            showConfirmButton: false
        });
    }
}


// Inicializar sincronización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO SINCRONIZACIÓN CON ADMIN ===');
    console.log('URL actual:', window.location.pathname);
    console.log('Botones en la página:', document.querySelectorAll('.add-to-cart').length);
    
    // Esperar a que sync-products.js actualice los productos
    setTimeout(function() {
        console.log('Sincronizando botones después de actualización de productos...');
        console.log('Botones encontrados:', document.querySelectorAll('.add-to-cart').length);
        
        // Sincronizar después de que sync-products.js haya actualizado la lista
        actualizarBotonesProductos();
        
        // Escuchar cambios futuros
        escucharCambiosAdmin();
        
        console.log('Sistema de sincronización activado');
    }, 1000);
});

// Log inmediatamente (antes de DOMContentLoaded)
console.log('Admin-sync.js ejecutado antes de DOMContentLoaded - Versión: 2.0');
console.log('Timestamp:', new Date().toISOString());
