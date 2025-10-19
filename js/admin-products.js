// Script para gestionar productos en el panel de administración
// Recopila todos los productos de las diferentes páginas y sincroniza con la web

// Base de datos de productos (se puede expandir)
let productosDatabase = {
    paletas: [
        {
            id: 1,
            nombre: "Paleta Vainilla",
            precio: 17900,
            stock: 7,
            categoria: "Paletas",
            imagen: "assets/img/Lu Art Photos/paletavainilla7.jpg",
            descripcion: "Paleta artesanal con diseño de vainilla"
        },
        {
            id: 2,
            nombre: "Paleta pincelada",
            precio: 17900,
            stock: 1,
            categoria: "Paletas",
            imagen: "assets/img/Lu Art Photos/paletapuntos.jpg",
            descripcion: "Paleta con diseño pincelado único"
        },
        {
            id: 3,
            nombre: "Paleta pincelada 2.0",
            precio: 17900,
            stock: 1,
            categoria: "Paletas",
            imagen: "assets/img/Lu Art Photos/paletapuntos2.jpg",
            descripcion: "Segunda versión del diseño pincelado"
        },
        {
            id: 4,
            nombre: "Paleta Verde",
            precio: 17900,
            stock: 1,
            categoria: "Paletas",
            imagen: "assets/img/Lu Art Photos/paletaverde1.jpg",
            descripcion: "Paleta con tonos verdes naturales"
        },
        {
            id: 5,
            nombre: "Paleta Verde 2.0",
            precio: 17900,
            stock: 1,
            categoria: "Paletas",
            imagen: "assets/img/Lu Art Photos/paletaverde2.jpg",
            descripcion: "Segunda versión del diseño verde"
        }
    ],
    tazas: [
        {
            id: 1,
            nombre: "Taza Dos Ojos",
            precio: 20000,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0920.jpg",
            descripcion: "Taza con diseño de dos ojos"
        },
        {
            id: 2,
            nombre: "Taza Bruma",
            precio: 17900,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0926.jpg",
            descripcion: "Taza con efecto bruma"
        },
        {
            id: 3,
            nombre: "Taza Bruma 2.0",
            precio: 17900,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0927.jpg",
            descripcion: "Segunda versión del diseño bruma"
        },
        {
            id: 4,
            nombre: "Taza Tierra",
            precio: 13000,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0930.jpg",
            descripcion: "Taza con tonos tierra"
        },
        {
            id: 5,
            nombre: "Taza Aurora",
            precio: 12000,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0932.jpg",
            descripcion: "Taza con diseño aurora"
        },
        {
            id: 6,
            nombre: "Taza Halley",
            precio: 17900,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0937.jpg",
            descripcion: "Taza con diseño Halley"
        },
        {
            id: 7,
            nombre: "Taza Amanecer",
            precio: 16000,
            stock: 1,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0939.jpg",
            descripcion: "Taza con diseño amanecer"
        },
        {
            id: 8,
            nombre: "Taza Green Waves",
            precio: 24000,
            stock: 0,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0948.jpg",
            descripcion: "Taza con ondas verdes"
        },
        {
            id: 9,
            nombre: "Taza Marito",
            precio: 24000,
            stock: 0,
            categoria: "Tazas",
            imagen: "assets/img/Lu Art Photos/IMG_0951.jpg",
            descripcion: "Taza con diseño Marito"
        }
    ],
    snackbowls: [
        {
            id: 1,
            nombre: "Snack Bowl Pequeño",
            precio: 12900,
            stock: 5,
            categoria: "Snack Bowls",
            imagen: "assets/img/pottery-8026823_1280.jpg",
            descripcion: "Bowl pequeño para snacks"
        },
        {
            id: 2,
            nombre: "Snack Bowl Mediano",
            precio: 15900,
            stock: 8,
            categoria: "Snack Bowls",
            imagen: "assets/img/pottery-8026823_1280.jpg",
            descripcion: "Bowl mediano para snacks"
        },
        {
            id: 3,
            nombre: "Snack Bowl Grande",
            precio: 18900,
            stock: 6,
            categoria: "Snack Bowls",
            imagen: "assets/img/pottery-8026823_1280.jpg",
            descripcion: "Bowl grande para snacks"
        }
    ]
};

// Función para cargar datos desde localStorage
function cargarDatosProductos() {
    try {
        const datosGuardados = localStorage.getItem('luArtProductosAdmin');
        if (datosGuardados) {
            productosDatabase = JSON.parse(datosGuardados);
            console.log('Datos de productos cargados desde localStorage');
        } else {
            console.log('Usando datos por defecto de productos');
            guardarDatosProductos(); // Guardar datos por defecto
        }
    } catch (error) {
        console.error('Error cargando datos de productos:', error);
    }
}

// Función para guardar datos en localStorage
function guardarDatosProductos() {
    try {
        localStorage.setItem('luArtProductosAdmin', JSON.stringify(productosDatabase));
        console.log('Datos de productos guardados en localStorage');
        
        // Notificar a las páginas web que los datos han cambiado
        localStorage.setItem('luArtProductosActualizados', Date.now().toString());
    } catch (error) {
        console.error('Error guardando datos de productos:', error);
    }
}

// Función para obtener todos los productos
function obtenerTodosLosProductos() {
    const todosLosProductos = [];
    
    Object.keys(productosDatabase).forEach(categoria => {
        productosDatabase[categoria].forEach(producto => {
            todosLosProductos.push({
                ...producto,
                categoria: categoria
            });
        });
    });
    
    return todosLosProductos;
}

// Función para renderizar la tabla de productos
function renderizarTablaProductos() {
    const productos = obtenerTodosLosProductos();
    const tbody = document.getElementById('productos-tbody');
    
    if (!tbody) {
        console.error('Elemento productos-tbody no encontrado');
        return;
    }
    
    let html = '';
    
    productos.forEach((producto, index) => {
        const estadoStock = producto.stock === 0 ? 'danger' : producto.stock <= 2 ? 'warning' : 'success';
        const textoStock = producto.stock === 0 ? 'Agotado' : producto.stock <= 2 ? 'Bajo Stock' : 'Disponible';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>₡${producto.precio.toLocaleString()}</td>
                <td>
                    <span class="badge bg-${estadoStock}">${producto.stock} unidades</span>
                    <br>
                    <small class="text-${estadoStock}">${textoStock}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${producto.id}, '${producto.categoria}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="actualizarStock(${producto.id}, '${producto.categoria}')">
                            <i class="fas fa-boxes"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="verDetalles(${producto.id}, '${producto.categoria}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Actualizar estadísticas
    actualizarEstadisticas(productos);
}

// Función para actualizar estadísticas
function actualizarEstadisticas(productos) {
    const totalProductos = productos.length;
    const productosDisponibles = productos.filter(p => p.stock > 0).length;
    const productosAgotados = productos.filter(p => p.stock === 0).length;
    const productosBajoStock = productos.filter(p => p.stock > 0 && p.stock <= 2).length;
    
    const valorTotalInventario = productos.reduce((total, producto) => {
        return total + (producto.precio * producto.stock);
    }, 0);
    
    // Contar por categorías
    const categorias = {
        tazas: productos.filter(p => p.categoria === 'tazas').length,
        paletas: productos.filter(p => p.categoria === 'paletas').length,
        snackbowls: productos.filter(p => p.categoria === 'snackbowls').length
    };
    
    // Actualizar elementos de estadísticas en la sección de productos
    const elementos = {
        'total-productos': totalProductos,
        'productos-disponibles': productosDisponibles,
        'productos-agotados': productosAgotados,
        'productos-bajo-stock': productosBajoStock,
        'valor-inventario': valorTotalInventario
    };
    
    Object.keys(elementos).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'valor-inventario') {
                elemento.textContent = `₡${elementos[id].toLocaleString()}`;
            } else {
                elemento.textContent = elementos[id];
            }
        }
    });
    
    // Actualizar dashboard
    actualizarDashboard(productos, categorias, valorTotalInventario);
}

// Función para actualizar el dashboard
function actualizarDashboard(productos, categorias, valorTotalInventario) {
    // Actualizar estadísticas principales del dashboard
    const elementosDashboard = {
        'totalProducts': productos.length,
        'availableProducts': productos.filter(p => p.stock > 0).length,
        'lowStockProducts': productos.filter(p => p.stock > 0 && p.stock <= 2).length,
        'soldOutProducts': productos.filter(p => p.stock === 0).length,
        'totalInventoryValue': valorTotalInventario
    };
    
    Object.keys(elementosDashboard).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'totalInventoryValue') {
                elemento.textContent = `₡${elementosDashboard[id].toLocaleString()}`;
            } else {
                elemento.textContent = elementosDashboard[id];
            }
        }
    });
    
    // Actualizar contadores de categorías
    const elementosCategorias = {
        'tazas-count': categorias.tazas,
        'paletas-count': categorias.paletas,
        'snackbowls-count': categorias.snackbowls
    };
    
    Object.keys(elementosCategorias).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = elementosCategorias[id];
        }
    });
    
    // Actualizar productos que requieren atención
    actualizarProductosAtencion(productos);
}

// Función para mostrar productos que requieren atención
function actualizarProductosAtencion(productos) {
    const productosAtencion = productos.filter(p => p.stock === 0 || p.stock <= 2);
    const contenedor = document.getElementById('attentionProducts');
    
    if (!contenedor) return;
    
    if (productosAtencion.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> 
                ¡Excelente! Todos los productos tienen stock suficiente.
            </div>
        `;
    } else {
        let html = '';
        productosAtencion.forEach(producto => {
            const tipoAlerta = producto.stock === 0 ? 'danger' : 'warning';
            const icono = producto.stock === 0 ? 'fa-times-circle' : 'fa-exclamation-triangle';
            const mensaje = producto.stock === 0 ? 'Agotado' : 'Stock bajo';
            
            html += `
                <div class="alert alert-${tipoAlerta} mb-2">
                    <i class="fas ${icono}"></i> 
                    <strong>${producto.nombre}</strong> - ${mensaje} (${producto.stock} unidades)
                    <button class="btn btn-sm btn-outline-${tipoAlerta} ms-2" onclick="actualizarStock(${producto.id}, '${producto.categoria}')">
                        Actualizar Stock
                    </button>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }
}

// Función para editar producto
function editarProducto(id, categoria) {
    const producto = productosDatabase[categoria].find(p => p.id === id);
    if (producto) {
        console.log('Editando producto:', producto);
        // Aquí se puede abrir un modal de edición
        alert(`Editando: ${producto.nombre}`);
    }
}

// Función para actualizar stock
function actualizarStock(id, categoria) {
    const producto = productosDatabase[categoria].find(p => p.id === id);
    if (producto) {
        const nuevoStock = prompt(`Nuevo stock para ${producto.nombre}:\nStock actual: ${producto.stock}`);
        if (nuevoStock !== null && !isNaN(nuevoStock) && nuevoStock >= 0) {
            producto.stock = parseInt(nuevoStock);
            
            // Guardar cambios en localStorage
            guardarDatosProductos();
            
            // Actualizar la tabla
            renderizarTablaProductos();
            
            console.log(`Stock actualizado para ${producto.nombre}: ${producto.stock}`);
            console.log('Cambios sincronizados con las páginas web');
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Stock actualizado',
                    text: `${producto.nombre}: ${producto.stock} unidades\nLos cambios se reflejarán en la web`,
                    timer: 3000
                });
            }
        }
    }
}

// Función para ver detalles
function verDetalles(id, categoria) {
    const producto = productosDatabase[categoria].find(p => p.id === id);
    if (producto) {
        const detalles = `
            <strong>${producto.nombre}</strong><br>
            <strong>Categoría:</strong> ${producto.categoria}<br>
            <strong>Precio:</strong> ₡${producto.precio.toLocaleString()}<br>
            <strong>Stock:</strong> ${producto.stock} unidades<br>
            <strong>Descripción:</strong> ${producto.descripcion}
        `;
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Detalles del Producto',
                html: detalles,
                imageUrl: producto.imagen,
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: producto.nombre
            });
        } else {
            alert(detalles);
        }
    }
}

// Función para filtrar productos
function filtrarProductos() {
    const filtro = document.getElementById('filtro-productos').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value;
    const filas = document.querySelectorAll('#productos-tbody tr');
    
    filas.forEach(fila => {
        const nombre = fila.cells[2].textContent.toLowerCase();
        const categoriaProducto = fila.cells[3].textContent.toLowerCase();
        
        const coincideNombre = nombre.includes(filtro);
        const coincideCategoria = categoria === '' || categoriaProducto === categoria.toLowerCase();
        
        if (coincideNombre && coincideCategoria) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Función para exportar datos
function exportarProductos() {
    const productos = obtenerTodosLosProductos();
    const csv = [
        ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Descripción'],
        ...productos.map(p => [p.id, p.nombre, p.categoria, p.precio, p.stock, p.descripcion])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos-lu-art.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ADMIN PRODUCTOS CARGADO ===');
    
    // Cargar datos desde localStorage
    cargarDatosProductos();
    
    // Renderizar la tabla
    renderizarTablaProductos();
    
    // Configurar filtros
    const filtroProductos = document.getElementById('filtro-productos');
    const filtroCategoria = document.getElementById('filtro-categoria');
    
    if (filtroProductos) {
        filtroProductos.addEventListener('input', filtrarProductos);
    }
    
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filtrarProductos);
    }
});
