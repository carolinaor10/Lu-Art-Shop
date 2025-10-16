// Función para verificar y actualizar el estado de los botones según el stock
function actualizarEstadoBotones() {
    document.querySelectorAll(".add-to-cart").forEach(boton => {
        const stock = parseInt(boton.dataset.stock);
        const id = boton.dataset.id;
        const portfolioItem = boton.closest('.portfolio-item');
        
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

// Hacer la función disponible globalmente
window.actualizarEstadoBotones = actualizarEstadoBotones;

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

let carrito = [];

// Agregar producto al carrito
function agregarAlCarrito(id, nombre, precio, stock) {
    // Verificar si el producto está agotado
    if (stock === 0) {
        Swal.fire({
            icon: 'error',
            title: getTranslation('alert.product_sold_out'),
            text: getTranslation('alert.sold_out_message', { nombre: nombre }),
            timer: 3000
        });
        return;
    }

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        if (productoExistente.cantidad < stock) {
            productoExistente.cantidad++;
        } else {
            Swal.fire({
                icon: 'warning',
                title: getTranslation('alert.stock_max'),
                text: getTranslation('alert.stock_message', { stock: stock, nombre: nombre }),
                timer: 2000
            });
        }
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1, stock });
    }

    renderCarrito();
}

// Eliminar producto
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderCarrito();
}

// Cambiar cantidad
function cambiarCantidad(id, nuevaCantidad) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        const cantidadDeseada = parseInt(nuevaCantidad);
        if (cantidadDeseada > producto.stock) {
            Swal.fire({
                icon: 'warning',
                title: getTranslation('alert.quantity_unavailable'),
                text: getTranslation('alert.quantity_message', { stock: producto.stock, nombre: producto.nombre }),
                timer: 2000
            });
            producto.cantidad = producto.stock;
        } else if (cantidadDeseada < 1) {
            producto.cantidad = 1;
        } else {
            producto.cantidad = cantidadDeseada;
        }
        renderCarrito();
    }
}

// Renderizar carrito
function renderCarrito() {
    const tbody = document.getElementById("carrito-body");
    tbody.innerHTML = "";

    let total = 0;

    if(carrito.length === 0){
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">${getTranslation('cart.no_products')}</td></tr>`;
    }

    carrito.forEach(item => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>₡${item.precio.toLocaleString()}</td>
            <td>
                <input type="number" value="${item.cantidad}" min="1" max="${item.stock}"
                    class="form-control"
                    onchange="cambiarCantidad(${item.id}, this.value)">
            </td>
            <td>₡${(item.precio * item.cantidad).toLocaleString()}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">
                <i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        tbody.appendChild(fila);
        total += item.precio * item.cantidad;
    });

    document.getElementById("total").innerText = "Total: ₡" + total.toLocaleString();
}

// Event listener para botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', function() {
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
});
