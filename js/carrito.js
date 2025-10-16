// Función para obtener productos desde el panel de administración
function getProductsFromAdmin() {
    const adminProducts = localStorage.getItem('luArtProducts');
    if (adminProducts) {
        try {
            return JSON.parse(adminProducts);
        } catch (e) {
            console.error('Error parsing admin products:', e);
            return null;
        }
    }
    return null;
}

// Función para sincronizar productos desde el admin
function syncProductsFromAdmin() {
    const adminProducts = getProductsFromAdmin();
    if (!adminProducts) return;
    
    // Obtener la categoría de la página actual
    const currentCategory = getCurrentPageCategory();
    if (!currentCategory) return;
    
    // Filtrar productos por categoría
    const categoryProducts = adminProducts.filter(product => product.category === currentCategory);
    
    console.log(`Sincronizando productos de categoría "${currentCategory}":`, categoryProducts.length);
    
    // Obtener la lista de productos actual en la página
    const productList = document.getElementById('productList');
    if (!productList) return;
    
    // Crear un mapa de productos existentes por ID
    const existingProducts = new Map();
    productList.querySelectorAll('.portfolio-item').forEach(item => {
        const id = item.getAttribute('data-id');
        if (id) {
            existingProducts.set(parseInt(id), item);
        }
    });
    
    // Verificar si hay productos nuevos del admin que no existen en la página
    categoryProducts.forEach(adminProduct => {
        if (!existingProducts.has(adminProduct.id)) {
            console.log(`Agregando nuevo producto de ${currentCategory}:`, adminProduct.name);
            addNewProductToPage(adminProduct);
        } else {
            // Actualizar producto existente
            updateExistingProduct(adminProduct, existingProducts.get(adminProduct.id));
        }
    });
}

// Función para agregar un nuevo producto a la página
function addNewProductToPage(product) {
    const productList = document.getElementById('productList');
    if (!productList) return;
    
    // Determinar la categoría para saber en qué página estamos
    const currentPage = getCurrentPageCategory();
    if (currentPage && product.category !== currentPage) {
        return; // No agregar productos de otras categorías
    }
    
    // Crear el HTML del nuevo producto
    const productHTML = createProductHTML(product);
    
    // Agregar al final de la lista
    productList.insertAdjacentHTML('beforeend', productHTML);
    
    // Agregar event listeners al nuevo botón y asegurar atributos
    const newButton = productList.querySelector(`[data-id="${product.id}"] .add-to-cart`);
    if (newButton) {
        // Asegurar que todos los atributos estén presentes
        newButton.setAttribute('data-id', product.id);
        newButton.setAttribute('data-nombre', product.name || 'Producto sin nombre');
        newButton.setAttribute('data-precio', product.price || 0);
        newButton.setAttribute('data-stock', product.stock || 0);
        newButton.setAttribute('data-categoria', product.category || 'general');
        newButton.setAttribute('data-imagen', product.image || 'assets/img/logo/LU ART COLOR.png');
        newButton.setAttribute('data-descripcion', product.description || '');
        
        console.log('Nuevo botón creado con atributos:', {
            id: product.id,
            nombre: product.name,
            precio: product.price,
            stock: product.stock,
            categoria: product.category,
            imagen: product.image,
            descripcion: product.description
        });
        
        addCartEventListener(newButton);
    }
}

// Función para actualizar un producto existente
function updateExistingProduct(adminProduct, existingElement) {
    // Actualizar imagen
    const imgElement = existingElement.querySelector('img');
    if (imgElement && adminProduct.image) {
        imgElement.src = adminProduct.image;
        imgElement.alt = adminProduct.name;
    }
    
    // Actualizar nombre
    const nameElement = existingElement.querySelector('.portfolio-caption-heading');
    if (nameElement) {
        nameElement.textContent = adminProduct.name;
    }
    
    // Actualizar precio
    const priceElement = existingElement.querySelector('.portfolio-caption-subheading');
    if (priceElement) {
        priceElement.textContent = `₡${adminProduct.price.toLocaleString()}`;
    }
    
    // Actualizar todos los atributos del botón
    const button = existingElement.querySelector('.add-to-cart');
    if (button) {
        button.setAttribute('data-id', adminProduct.id);
        button.setAttribute('data-nombre', adminProduct.name);
        button.setAttribute('data-precio', adminProduct.price);
        button.setAttribute('data-stock', adminProduct.stock);
        button.setAttribute('data-categoria', adminProduct.category);
        button.setAttribute('data-imagen', adminProduct.image);
        button.setAttribute('data-descripcion', adminProduct.description || '');
        
        console.log('Botón actualizado con atributos:', {
            id: adminProduct.id,
            nombre: adminProduct.name,
            precio: adminProduct.price,
            stock: adminProduct.stock,
            categoria: adminProduct.category,
            imagen: adminProduct.image,
            descripcion: adminProduct.description
        });
    }
}

// Función para crear el HTML de un producto
function createProductHTML(product) {
    const modalId = `portfolioModal${product.id}`;
    const modalTarget = `#${modalId}`;
    
    // Asegurar que todos los campos tengan valores por defecto
    const safeProduct = {
        id: product.id || 'unknown',
        name: product.name || 'Producto sin nombre',
        price: parseInt(product.price) || 0,
        stock: parseInt(product.stock) || 0,
        category: product.category || 'general',
        image: product.image || 'assets/img/logo/LU ART COLOR.png',
        description: product.description || ''
    };
    
    return `
        <div class="col-lg-4 col-sm-6 mb-4">
            <div class="portfolio-item" data-id="${safeProduct.id}">
                <a class="portfolio-link" data-bs-toggle="modal" href="${modalTarget}">
                    <div class="portfolio-hover">
                        <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                    </div>
                    <img class="img-fluid" src="${safeProduct.image}" alt="${safeProduct.name}" />
                </a>
                <div class="portfolio-caption">
                    <div class="portfolio-caption-heading">${safeProduct.name}</div>
                    <div class="portfolio-caption-subheading text-muted">₡${safeProduct.price.toLocaleString()}</div>
                    <button class="btn btn-primary btn-xl text-uppercase add-to-cart" 
                        type="button"
                        data-id="${safeProduct.id}" 
                        data-nombre="${safeProduct.name}" 
                        data-precio="${safeProduct.price}"
                        data-stock="${safeProduct.stock}"
                        data-categoria="${safeProduct.category}"
                        data-imagen="${safeProduct.image}"
                        data-descripcion="${safeProduct.description}"
                        data-translate="shop.add_to_cart">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para determinar la categoría de la página actual
function getCurrentPageCategory() {
    const path = window.location.pathname;
    if (path.includes('tazas.html')) return 'tazas';
    if (path.includes('paletas.html')) return 'paletas';
    if (path.includes('snackbowls.html')) return 'snackbowls';
    return null;
}

// Función para agregar event listener a un botón de carrito
function addCartEventListener(button) {
    button.addEventListener('click', function() {
        const id = this.dataset.id;
        const nombre = this.dataset.nombre || 'Producto sin nombre';
        const precio = parseInt(this.dataset.precio) || 0;
        const stock = parseInt(this.dataset.stock) || 0;
        const categoria = this.dataset.categoria || 'general';
        const imagen = this.dataset.imagen || 'assets/img/logo/LU ART COLOR.png';
        const descripcion = this.dataset.descripcion || '';
        
        console.log('Botón de carrito clickeado:', {
            id, nombre, precio, stock, categoria, imagen, descripcion
        });
        
        // Validar que los datos básicos estén presentes
        if (!id || !nombre || precio <= 0) {
            console.error('Datos del producto incompletos:', { id, nombre, precio });
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Datos del producto incompletos. Por favor, recarga la página.',
                    timer: 3000
                });
            }
            return;
        }
        
        if (this.disabled || stock === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: getTranslation('alert.product_sold_out'),
                    text: getTranslation('alert.sold_out_message', { nombre: nombre }),
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            return;
        }
        
        agregarAlCarrito(id, nombre, precio, stock);
    });
}

// Función para verificar y actualizar el estado de los botones según el stock
function actualizarEstadoBotones() {
    // Obtener productos del admin si están disponibles
    const adminProducts = getProductsFromAdmin();
    
    // Obtener la categoría de la página actual
    const currentCategory = getCurrentPageCategory();
    
    // Filtrar productos por categoría si hay productos del admin
    let categoryProducts = adminProducts;
    if (adminProducts && currentCategory) {
        categoryProducts = adminProducts.filter(product => product.category === currentCategory);
    }
    
    // Sincronizar productos desde el admin (incluye agregar nuevos productos)
    syncProductsFromAdmin();
    
    document.querySelectorAll(".add-to-cart").forEach(boton => {
        let stock = parseInt(boton.dataset.stock);
        const id = boton.dataset.id;
        const portfolioItem = boton.closest('.portfolio-item');
        
        // Si hay productos del admin, usar esos datos
        if (categoryProducts) {
            const adminProduct = categoryProducts.find(p => p.id == id);
            if (adminProduct) {
                stock = adminProduct.stock;
                // Actualizar el data-stock del botón
                boton.dataset.stock = stock;
            }
        }
        
        if (stock === 0) {
            // Producto agotado - deshabilitar botón y cambiar texto
            boton.disabled = true;
            boton.classList.add('disabled');
            boton.innerHTML = getTranslation('shop.sold_out');
            boton.style.opacity = '0.6';
            boton.style.cursor = 'not-allowed';
            
            // Agregar clase CSS para estilo de agotado
            boton.classList.add('btn-sold-out');
            
            // Agregar etiqueta de agotado traducible
            if (portfolioItem && !portfolioItem.querySelector('.sold-out-label')) {
                const soldOutLabel = document.createElement('div');
                soldOutLabel.className = 'sold-out-label';
                soldOutLabel.textContent = getTranslation('shop.sold_out_label');
                soldOutLabel.style.position = 'absolute';
                soldOutLabel.style.top = '10px';
                soldOutLabel.style.right = '10px';
                soldOutLabel.style.backgroundColor = '#dc3545';
                soldOutLabel.style.color = 'white';
                soldOutLabel.style.padding = '4px 8px';
                soldOutLabel.style.borderRadius = '4px';
                soldOutLabel.style.fontSize = '0.7em';
                soldOutLabel.style.fontWeight = 'bold';
                soldOutLabel.style.zIndex = '10';
                portfolioItem.style.position = 'relative';
                portfolioItem.style.opacity = '0.7';
                portfolioItem.appendChild(soldOutLabel);
            } else if (portfolioItem && portfolioItem.querySelector('.sold-out-label')) {
                // Actualizar texto de etiqueta existente
                const existingLabel = portfolioItem.querySelector('.sold-out-label');
                existingLabel.textContent = getTranslation('shop.sold_out_label');
            }
        } else {
            // Producto disponible - asegurar que esté habilitado
            boton.disabled = false;
            boton.classList.remove('disabled', 'btn-sold-out');
            boton.innerHTML = getTranslation('shop.add_to_cart');
            boton.style.opacity = '1';
            boton.style.cursor = 'pointer';
            
            // Remover etiqueta de agotado si existe
            if (portfolioItem) {
                const soldOutLabel = portfolioItem.querySelector('.sold-out-label');
                if (soldOutLabel) {
                    soldOutLabel.remove();
                }
                portfolioItem.style.opacity = '1';
            }
        }
    });
}

// Hacer las funciones disponibles globalmente
window.actualizarEstadoBotones = actualizarEstadoBotones;
window.syncProductsFromAdmin = syncProductsFromAdmin;

// Listener para cambios en localStorage (sincronización automática)
window.addEventListener('storage', function(e) {
    if (e.key === 'luArtProducts') {
        console.log('Cambios detectados en productos del admin, sincronizando...');
        setTimeout(() => {
            syncProductsFromAdmin();
            actualizarEstadoBotones();
        }, 100);
    }
});

// Sincronización periódica cada 5 segundos (para cambios en la misma pestaña)
setInterval(() => {
    syncProductsFromAdmin();
}, 5000);

// Función para obtener traducción
function getTranslation(key, replacements = {}) {
    if (window.translations && window.currentLanguage) {
        let translation = window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key] 
            ? window.translations[window.currentLanguage][key] 
            : key;
        
        // Reemplazar placeholders
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
        
        return translation;
    }
    return key;
}

// Función para actualizar el mensaje de WhatsApp
function actualizarMensajeWhatsApp() {
    // Leer el total del carrito (removiendo texto innecesario)
    const totalTexto = document.getElementById("total").textContent.replace("Total: ₡", "").trim();

    let mensajeWhatsApp = getTranslation('whatsapp.greeting') + "\n";

    carrito.forEach(item => {
        // Agregar al mensaje de WhatsApp
        mensajeWhatsApp += `- ${item.nombre} (${item.cantidad}) = ₡${(item.precio * item.cantidad).toLocaleString()}\n`;
    });

    mensajeWhatsApp += `${getTranslation('whatsapp.total')} ₡${totalTexto}\n\n`;
    mensajeWhatsApp += `${getTranslation('whatsapp.shipping_address')}\n`;
    mensajeWhatsApp += `${getTranslation('whatsapp.province')} ${document.getElementById('provincia').selectedOptions[0]?.text || getTranslation('whatsapp.not_selected')}\n`;
    mensajeWhatsApp += `${getTranslation('whatsapp.canton')} ${document.getElementById('canton').selectedOptions[0]?.text || getTranslation('whatsapp.not_selected')}\n`;
    mensajeWhatsApp += `${getTranslation('whatsapp.district')} ${document.getElementById('distrito').selectedOptions[0]?.text || getTranslation('whatsapp.not_selected')}\n`;
    mensajeWhatsApp += `${getTranslation('whatsapp.address')} ${document.getElementById('direccion').value || getTranslation('whatsapp.not_specified')}\n`;
    if (document.getElementById('indicaciones').value) {
        mensajeWhatsApp += `${getTranslation('whatsapp.instructions')} ${document.getElementById('indicaciones').value}\n`;
    }
    mensajeWhatsApp += `\n${document.getElementById('facturaElectronica').checked ? getTranslation('whatsapp.invoice_required') : getTranslation('whatsapp.invoice_not_required')}\n`;

    // Actualizar el link de WhatsApp con lista + total + dirección
    const numero = "50670605427";
    const enlaceWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    document.querySelector("#modalPago a.btn-whatsapp").setAttribute("href", enlaceWhatsApp);
}

// Inicializar carrito desde localStorage
let carrito = [];

// Función para cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('luArtCarrito');
    console.log('Intentando cargar carrito desde localStorage:', carritoGuardado);
    
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            console.log('Carrito cargado exitosamente desde localStorage:', carrito);
            console.log('Total de productos en carrito:', carrito.length);
        } catch (e) {
            console.error('Error cargando carrito desde localStorage:', e);
            carrito = [];
        }
    } else {
        console.log('No hay carrito guardado en localStorage, inicializando vacío');
        carrito = [];
    }
}

// Función para actualizar contador de carrito en todas las páginas
function actualizarContadorCarrito() {
    // Actualizar contador del botón "Ver Carrito" (si existe)
    const contadorCarrito = document.getElementById('contador-carrito');
    if (contadorCarrito) {
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        contadorCarrito.textContent = totalProductos;
        contadorCarrito.style.display = totalProductos > 0 ? 'inline' : 'none';
    }
    
    // Actualizar contador del navbar (si existe)
    const navbarContador = document.getElementById('navbar-contador-carrito');
    if (navbarContador) {
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        navbarContador.textContent = totalProductos;
        navbarContador.style.display = totalProductos > 0 ? 'inline' : 'none';
    }
}

// Función para guardar carrito en localStorage
function guardarCarritoEnStorage() {
    try {
        localStorage.setItem('luArtCarrito', JSON.stringify(carrito));
        console.log('Carrito guardado exitosamente en localStorage:', carrito);
        console.log('Total de productos guardados:', carrito.length);
    } catch (e) {
        console.error('Error guardando carrito en localStorage:', e);
    }
}

// Agregar producto al carrito
function agregarAlCarrito(id, nombre, precio, stock) {
    // Verificar si el producto está agotado
    if (stock === 0) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: getTranslation('alert.product_sold_out'),
                text: getTranslation('alert.sold_out_message', { nombre: nombre }),
                timer: 3000
            });
        }
        return;
    }

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        if (productoExistente.cantidad < stock) {
            productoExistente.cantidad++;
        } else {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: getTranslation('alert.stock_max'),
                    text: getTranslation('alert.stock_message', { stock: stock, nombre: nombre }),
                    timer: 2000
                });
            }
        }
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1, stockOriginal: stock });
    }

    renderCarrito();
    guardarCarritoEnStorage(); // Guardar carrito en localStorage
    actualizarContadorCarrito(); // Actualizar contador
    
    // Mostrar SweetAlert de éxito
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: getTranslation('alert.product_added'),
            text: getTranslation('alert.product_added_message', { nombre: nombre }),
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// Eliminar producto
function eliminarDelCarrito(id) {
    console.log('Eliminando producto con ID:', id, 'Tipo:', typeof id);
    console.log('Carrito antes:', carrito.map(item => ({ id: item.id, tipo: typeof item.id, nombre: item.nombre })));
    
    carrito = carrito.filter(item => {
        const match = item.id == id; // Usar == para comparación flexible
        console.log(`Comparando ${item.id} (${typeof item.id}) con ${id} (${typeof id}): ${match}`);
        return !match;
    });
    
    console.log('Carrito después:', carrito.map(item => ({ id: item.id, tipo: typeof item.id, nombre: item.nombre })));
    renderCarrito();
    guardarCarritoEnStorage(); // Guardar carrito en localStorage
    actualizarContadorCarrito(); // Actualizar contador
}

// Cambiar cantidad
function cambiarCantidad(id, nuevaCantidad) {
    console.log('Cambiando cantidad para ID:', id, 'Tipo:', typeof id, 'Nueva cantidad:', nuevaCantidad);
    const producto = carrito.find(item => item.id == id); // Usar == para comparación flexible
    if (producto) {
        console.log('Producto encontrado:', producto.nombre, 'Cantidad actual:', producto.cantidad);
        const cantidadDeseada = parseInt(nuevaCantidad);
        const stockDisponible = producto.stockOriginal || producto.stock;
        if (cantidadDeseada > stockDisponible) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: getTranslation('alert.stock_max'),
                    text: getTranslation('alert.stock_message', { stock: stockDisponible, nombre: producto.nombre }),
                    timer: 2000
                });
            }
            producto.cantidad = stockDisponible;
        } else if (cantidadDeseada < 1) {
            producto.cantidad = 1;
        } else {
            producto.cantidad = cantidadDeseada;
        }
        console.log('Nueva cantidad:', producto.cantidad);
        renderCarrito();
        guardarCarritoEnStorage(); // Guardar carrito en localStorage
        actualizarContadorCarrito(); // Actualizar contador
    } else {
        console.log('Producto no encontrado en el carrito');
    }
}

// Renderizar carrito
function renderCarrito() {
    console.log('Renderizando carrito con', carrito.length, 'productos');
    const tbody = document.getElementById("carrito-body");
    if (!tbody) {
        console.error('No se encontró el elemento carrito-body');
        return;
    }
    
    tbody.innerHTML = "";

    let total = 0;

    if(carrito.length === 0){
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">${getTranslation('cart.no_products')}</td></tr>`;
        console.log('Carrito vacío');
    } else {
        carrito.forEach((item, index) => {
            console.log(`Producto ${index + 1}:`, item.nombre, 'Precio:', item.precio, 'Cantidad:', item.cantidad);
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            console.log(`Subtotal: ₡${subtotal.toLocaleString()}`);
            
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td>₡${item.precio.toLocaleString()}</td>
                <td>
                    <input type="number" value="${item.cantidad}" min="1" max="${item.stockOriginal || item.stock}"
                        class="form-control"
                        onchange="cambiarCantidad('${item.id}', this.value)">
                </td>
                <td>₡${subtotal.toLocaleString()}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${item.id}')">
                    <i class="fa-solid fa-xmark"></i></button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    console.log('Total calculado: ₡' + total.toLocaleString());
    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "Total: ₡" + total.toLocaleString();
        console.log('Total actualizado en el DOM');
    } else {
        console.error('No se encontró el elemento total');
    }
}

// Event listener para botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage al inicializar
    cargarCarritoDesdeStorage();
    
    // Renderizar carrito inicial
    renderCarrito();
    actualizarContadorCarrito(); // Actualizar contador inicial
    
    document.querySelectorAll(".add-to-cart").forEach(boton => {
        boton.addEventListener("click", function () {
            const id = parseInt(this.dataset.id);
            const nombre = this.dataset.nombre;
            const precio = parseFloat(this.dataset.precio);
            const stock = parseInt(this.dataset.stock);

            // Verificar si el botón está deshabilitado (producto agotado)
            if (this.disabled || stock === 0) {
                Swal.fire({
                    icon: 'error',
                    title: getTranslation('alert.product_sold_out'),
                    text: getTranslation('alert.sold_out_message', { nombre: nombre }),
                    timer: 3000
                });
                return;
            }

            agregarAlCarrito(id, nombre, precio, stock);

            Swal.fire({
                icon: 'success',
                title: getTranslation('alert.product_added'),
                html: `<strong>${nombre}</strong><br>Precio: ₡${precio.toLocaleString()}`,
                showConfirmButton: false,
                timer: 1500
            });
        });
    });

    // Función para cerrar el modal del carrito
    function cerrarModalCarrito() {
        const carritoOverlay = document.getElementById('carrito-container');
        if (carritoOverlay) {
            carritoOverlay.style.display = 'none';
        }
    }

    // Abrir modal de carrito
    const carritoOverlay = document.getElementById('carrito-container');
    const abrirCarritoBtn = document.getElementById('abrir-carrito');
    const cerrarCarritoBtn = document.querySelector('.close-btn');

    if (abrirCarritoBtn && carritoOverlay) {
        abrirCarritoBtn.addEventListener('click', () => {
            renderCarrito();
            carritoOverlay.style.display = 'flex';
        });
    }

    if (cerrarCarritoBtn && carritoOverlay) {
        cerrarCarritoBtn.addEventListener('click', cerrarModalCarrito);
    }

    if (carritoOverlay) {
        carritoOverlay.addEventListener('click', (e) => {
            if (e.target === carritoOverlay) {
                cerrarModalCarrito();
            }
        });
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && carritoOverlay && carritoOverlay.style.display === 'flex') {
            cerrarModalCarrito();
        }
    });

    // Confirmar compra - abrir modal de pago con lista + WhatsApp
    const confirmarCompraBtn = document.getElementById('confirmar-compra-btn');
    if (confirmarCompraBtn) {
        confirmarCompraBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: getTranslation('alert.cart_empty'),
                    text: getTranslation('alert.cart_empty_message'),
                    timer: 1500
                });
                return;
            }

            // Cerrar el modal del carrito antes de abrir el modal de pago
            cerrarModalCarrito();

            const listaProductosPago = document.getElementById('productos-en-pago');
            listaProductosPago.innerHTML = '';

            let total = 0;
            let mensajeWhatsApp = "Hola, quiero confirmar la compra de:\n";

            carrito.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.nombre} - ${item.cantidad} x ₡${item.precio.toLocaleString()} = ₡${(item.cantidad * item.precio).toLocaleString()}`;
                listaProductosPago.appendChild(li);

                mensajeWhatsApp += `- ${item.nombre} (${item.cantidad})\n`;
                total += item.cantidad * item.precio;
            });

            document.getElementById("monto-total").textContent = `₡${total.toLocaleString()}`;
            mensajeWhatsApp += `Total: ₡${total.toLocaleString()}`;

            // Actualizar link de WhatsApp
            const whatsappBtn = document.getElementById('whatsapp-btn');
            whatsappBtn.href = `https://wa.me/50670605427?text=${encodeURIComponent(mensajeWhatsApp)}`;

            // Abrir modal de pago
            const modalPago = new bootstrap.Modal(document.getElementById('modalPago'));
            modalPago.show();

            // Actualizar mensaje de WhatsApp inicial
            actualizarMensajeWhatsApp();
        });
    }

    // Actualizar mensaje cuando cambien los campos de dirección
    const provinciaSelect = document.getElementById('provincia');
    const cantonSelect = document.getElementById('canton');
    const distritoSelect = document.getElementById('distrito');
    const direccionInput = document.getElementById('direccion');
    const indicacionesInput = document.getElementById('indicaciones');
    const facturaCheckbox = document.getElementById('facturaElectronica');

    if (provinciaSelect) provinciaSelect.addEventListener('change', actualizarMensajeWhatsApp);
    if (cantonSelect) cantonSelect.addEventListener('change', actualizarMensajeWhatsApp);
    if (distritoSelect) distritoSelect.addEventListener('change', actualizarMensajeWhatsApp);
    if (direccionInput) direccionInput.addEventListener('input', actualizarMensajeWhatsApp);
    if (indicacionesInput) indicacionesInput.addEventListener('input', actualizarMensajeWhatsApp);
    if (facturaCheckbox) facturaCheckbox.addEventListener('change', actualizarMensajeWhatsApp);
    
    // Actualizar estado de botones según stock disponible
    actualizarEstadoBotones();
    
    // Event listener para el botón del carrito en el navbar
    const navbarCarritoBtn = document.getElementById('navbar-carrito-btn');
    if (navbarCarritoBtn) {
        navbarCarritoBtn.addEventListener('click', function() {
            // Buscar el botón "Ver Carrito" en la página actual y hacer clic
            const verCarritoBtn = document.getElementById('abrir-carrito');
            if (verCarritoBtn) {
                verCarritoBtn.click();
            } else {
                // Si no hay botón "Ver Carrito" en la página actual, mostrar un mensaje
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'info',
                        title: getTranslation('cart.no_cart_available'),
                        text: getTranslation('cart.go_to_products'),
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }
    
    // Sincronizar carrito entre pestañas del navegador
    window.addEventListener('storage', function(e) {
        if (e.key === 'luArtCarrito') {
            console.log('Carrito actualizado desde otra pestaña');
            cargarCarritoDesdeStorage();
            renderCarrito();
            actualizarContadorCarrito(); // Actualizar contador
        }
    });
});
