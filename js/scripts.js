/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// comments
document.addEventListener('DOMContentLoaded', function() {
    const comments = document.querySelectorAll('.comment');
    let counter = 0;

    // Solo ejecutar si hay comentarios en la página
    if (comments.length === 0) {
        return;
    }

    function showNextComment() {
        // Verificar que hay comentarios disponibles
        if (comments.length === 0) {
            return;
        }

        // Ocultar todos los comentarios
        comments.forEach(comment => {
            comment.classList.remove('active');
        });

        // Mostrar el siguiente comentario
        if (comments[counter]) {
        comments[counter].classList.add('active');
        }

        // Incrementar el contador
        counter = (counter + 1) % comments.length;
    }

    // Mostrar el primer comentario
    showNextComment();

    // Cambiar los comentarios automáticamente cada 3 segundos
    setInterval(showNextComment, 5000);
});

// Función para adjuntar listeners a los botones de agregar al carrito
function attachAddToCartListeners() {
    console.log('Adjuntando listeners a botones add-to-cart...');
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
      const id = this.dataset.id || Date.now().toString();
      const nombre = this.dataset.nombre || 'Producto';
      const precio = Number(this.dataset.precio) || 0;
      const stock = Number(this.dataset.stock) || 999; // Stock por defecto
  
      console.log('Agregando producto al carrito:', { id, nombre, precio, stock });
      console.log('=== DIAGNÓSTICO DETALLADO ===');
      console.log('Stock del producto:', stock);
      console.log('Tipo de stock:', typeof stock);
      console.log('Stock === 0:', stock === 0);
      console.log('Stock > 0:', stock > 0);
  
      // Obtener carrito actual
      let carrito = [];
      try {
        const carritoGuardado = localStorage.getItem('luArtCarrito');
        if (carritoGuardado) {
          carrito = JSON.parse(carritoGuardado);
        }
      } catch (e) {
        console.error('Error cargando carrito:', e);
        carrito = [];
      }
  
      // Verificar si el producto ya existe
      const productoExistente = carrito.find(item => item.id === id);
      
      // Solo bloquear si el stock está en 0
      if (stock === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Producto agotado',
          text: `${nombre} está fuera de stock`,
          timer: 2000
        });
        return;
      }
      
      if (productoExistente) {
        console.log('Producto existente en carrito:', {
          cantidadActual: productoExistente.cantidad,
          stockDisponible: stock,
          puedeAgregar: productoExistente.cantidad < stock
        });
        
        // Verificar si no excede el stock disponible
        // Permitir agregar hasta el límite del stock
        if (productoExistente.cantidad < stock) {
          productoExistente.cantidad++;
          console.log('Cantidad incrementada a:', productoExistente.cantidad);
        } else {
          console.log('=== STOCK MÁXIMO ALCANZADO ===');
          console.log('Cantidad actual en carrito:', productoExistente.cantidad);
          console.log('Stock disponible:', stock);
          console.log('Condición falló:', productoExistente.cantidad < stock);
          console.log('Mensaje que se mostrará:', `Solo hay ${stock} ${stock === 1 ? 'unidad' : 'unidades'} disponible${stock === 1 ? '' : 's'} de ${nombre}`);
          
          Swal.fire({
            icon: 'warning',
            title: 'Stock máximo alcanzado',
            text: `Ya tienes la cantidad máxima disponible (${stock} ${stock === 1 ? 'unidad' : 'unidades'}) de ${nombre}`,
            timer: 3000
          });
          return;
        }
      } else {
        // Solo agregar si hay stock disponible
        if (stock > 0) {
          carrito.push({ 
            id: id, 
            nombre: nombre, 
            precio: precio, 
            cantidad: 1, 
            stockOriginal: stock 
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Producto agotado',
            text: `${nombre} está fuera de stock`,
            timer: 2000
          });
          return;
        }
      }
  
      // Guardar carrito actualizado
      localStorage.setItem('luArtCarrito', JSON.stringify(carrito));
      
      // Actualizar contador del carrito y renderizar
      actualizarContadorCarrito();
      renderCarrito();
  
      Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        html: `<strong>${nombre}</strong><br>Precio: ₡${precio.toLocaleString()}`,
        showConfirmButton: false,
        timer: 2000
      });
      
      console.log('Producto agregado exitosamente. Carrito actual:', carrito);
    });
  });
}

// Llamar a la función inmediatamente para adjuntar los listeners iniciales
attachAddToCartListeners();

// Escuchar el evento productsUpdated para reanudar listeners cuando sync-products.js actualice los productos
document.addEventListener('productsUpdated', function() {
    console.log('Evento productsUpdated recibido, reanudando listeners...');
    attachAddToCartListeners();
});

  function actualizarMontoTotal(totalCompra) {
    const montoElement = document.getElementById("monto-total");
    if (montoElement) {
        montoElement.textContent = `₡${totalCompra.toFixed(2)}`;
    }
}

// Función para actualizar contador del carrito
function actualizarContadorCarrito() {
    console.log('=== ACTUALIZANDO CONTADOR CARRITO ===');
    const carrito = JSON.parse(localStorage.getItem('luArtCarrito') || '[]');
    const contador = document.getElementById('navbar-contador-carrito');
    if (contador) {
        contador.textContent = carrito.length;
        contador.style.display = carrito.length > 0 ? 'inline' : 'none';
    }
    console.log('Contador actualizado:', carrito.length);
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    const carrito = JSON.parse(localStorage.getItem('luArtCarrito') || '[]');
    let total = 0;
    
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    
    return total;
}

// Función para renderizar el carrito en la tabla
function renderCarrito() {
    console.log('=== RENDERIZANDO CARRITO ===');
    
    const carritoBody = document.getElementById('carrito-body');
    const totalElement = document.getElementById('total');
    
    console.log('Elementos encontrados:', {
        carritoBody: !!carritoBody,
        totalElement: !!totalElement
    });
    
    if (!carritoBody) {
        console.error('Elemento carrito-body no encontrado');
        return;
    }
    
    const carrito = JSON.parse(localStorage.getItem('luArtCarrito') || '[]');
    console.log('Carrito a renderizar:', carrito);
    
    if (carrito.length > 0) {
        let html = '';
        let total = 0;
        
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            html += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>₡${item.precio.toLocaleString()}</td>
                    <td>
                        <div class="input-group input-group-sm" style="width: 100px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${index}, -1)">-</button>
                            <input type="number" class="form-control text-center" value="${item.cantidad}" min="1" onchange="cambiarCantidad(${index}, 0, this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td>₡${subtotal.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        carritoBody.innerHTML = html;
        
        // Actualizar total si existe el elemento
        if (totalElement) {
            totalElement.textContent = `Total: ₡${total.toLocaleString()}`;
            console.log('Total actualizado:', total);
        } else {
            console.error('Elemento total no encontrado para actualizar');
        }
        
        console.log('Carrito renderizado correctamente');
    } else {
        carritoBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay productos en el carrito</td></tr>';
        
        if (totalElement) {
            totalElement.textContent = 'Total: ₡0';
            console.log('Total reseteado a 0');
        } else {
            console.error('Elemento total no encontrado para resetear');
        }
        
        console.log('Carrito vacío renderizado');
    }
}

// Función para cambiar cantidad de productos
function cambiarCantidad(index, cambio, nuevaCantidad = null) {
    console.log('=== CAMBIANDO CANTIDAD ===', {index, cambio, nuevaCantidad});
    
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('luArtCarrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        console.error('Error cargando carrito:', e);
    }
    
    if (index >= 0 && index < carrito.length) {
        const producto = carrito[index];
        const stockDisponible = producto.stockOriginal || 999; // Usar stock original o 999 por defecto
        
        let nuevaCantidadCalculada;
        if (nuevaCantidad !== null) {
            nuevaCantidadCalculada = parseInt(nuevaCantidad) || 1;
        } else {
            nuevaCantidadCalculada = producto.cantidad + cambio;
        }
        
        // Validar que no exceda el stock disponible
        if (nuevaCantidadCalculada > stockDisponible) {
            console.log('No se puede exceder el stock disponible:', stockDisponible);
            Swal.fire({
                icon: 'warning',
                title: 'Stock máximo alcanzado',
                text: `Solo hay ${stockDisponible} ${stockDisponible === 1 ? 'unidad' : 'unidades'} disponible${stockDisponible === 1 ? '' : 's'} de ${producto.nombre}`,
                timer: 2000
            });
            return;
        }
        
        // Validar que no sea menor a 1
        if (nuevaCantidadCalculada < 1) {
            nuevaCantidadCalculada = 1;
        }
        
        producto.cantidad = nuevaCantidadCalculada;
        
        localStorage.setItem('luArtCarrito', JSON.stringify(carrito));
        renderCarrito();
        actualizarContadorCarrito();
        
        console.log('Cantidad actualizada:', producto);
    }
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(index) {
    console.log('=== ELIMINANDO PRODUCTO ===', index);
    
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('luArtCarrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        console.error('Error cargando carrito:', e);
    }
    
    if (index >= 0 && index < carrito.length) {
        const productoEliminado = carrito.splice(index, 1)[0];
        localStorage.setItem('luArtCarrito', JSON.stringify(carrito));
        renderCarrito();
        actualizarContadorCarrito();
        
        console.log('Producto eliminado:', productoEliminado);
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: `"${productoEliminado.nombre}" eliminado del carrito`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
}

// Botón de abrir carrito (solo para páginas con overlay, no para Bootstrap modals)
const abrirCarritoBtn = document.getElementById("abrir-carrito");
    const carritoOverlay = document.getElementById('carrito-container');

// Solo agregar event listener si existe carrito-container (páginas con overlay)
if (abrirCarritoBtn && carritoOverlay) {
    console.log('Agregando event listener para overlay del carrito');
    abrirCarritoBtn.addEventListener("click", function (e) {
        e.preventDefault();
        console.log('Mostrando overlay del carrito');
    carritoOverlay.style.display = 'flex';
});
} else if (abrirCarritoBtn && !carritoOverlay) {
    console.log('Botón abrir-carrito encontrado pero sin overlay - usando Bootstrap modal');
}

// Botón de confirmar compra (abre modal de pago)
const confirmarCompraBtn = document.getElementById("confirmar-compra-btn");
if (confirmarCompraBtn) {
    confirmarCompraBtn.addEventListener("click", function () {
    // Guardar timestamp cuando se hace clic en "Confirmar compra"
    const timestamp = Date.now();
    localStorage.setItem('luArtCarritoTimestamp', timestamp.toString());
    console.log('Timestamp guardado para expiración del carrito:', timestamp);
    
    // Actualizar monto total antes de abrir el modal
    const totalCompra = calcularTotalCarrito(); // función que ya tienes
    actualizarMontoTotal(totalCompra);

    // Opcional: si quieres mostrar los nombres de los productos en el modal
        const productosCarritoElement = document.getElementById("productos-carrito");
        if (productosCarritoElement) {
            const carrito = JSON.parse(localStorage.getItem('luArtCarrito') || '[]');
    const productosLista = carrito.map(item => `${item.cantidad} x ${item.nombre}`).join(', ');
            productosCarritoElement.textContent = productosLista;
        }

    // Bootstrap se encargará de abrir el modal porque ya tienes data-bs-toggle y data-bs-target
});
}





//search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchText = this.value.toLowerCase();
            const items = document.querySelectorAll('#productList .portfolio-item');

            items.forEach(item => {
                const titleElement = item.querySelector('.portfolio-caption-heading');
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase();
                    const col = item.closest('.col-lg-4'); // para ocultar el contenedor correctamente

                    if (title.includes(searchText)) {
                        col.style.display = '';
                    } else {
                        col.style.display = 'none';
                    }
                }
            });
        });
    }
});

// Event listener adicional para cerrar modal específico (solo si existe modalCarrito)
const abrirCarritoElement = document.getElementById("abrir-carrito");
const modalCarrito = document.getElementById("modalCarrito");

if (abrirCarritoElement && modalCarrito) {
    console.log('Agregando event listener adicional para cerrar modalCarrito');
    abrirCarritoElement.addEventListener("click", function () {
    // Cierra el modal del carrito si está abierto
        var modalInstance = bootstrap.Modal.getInstance(modalCarrito);
        if (modalInstance) {
            modalInstance.hide();
        }
    });
} else if (abrirCarritoElement && !modalCarrito) {
    console.log('Botón abrir-carrito encontrado pero sin modalCarrito - usando Bootstrap modal normal');
}

function mostrarMontoEnModal(total) {
    const montoElement = document.getElementById("monto-total");
    if (montoElement) {
        montoElement.textContent = total.toFixed(2);
    }
}

// Función para mostrar productos en el modal de pago
// Hacer disponible globalmente para que todas las páginas puedan usarla
window.mostrarProductosEnPago = function() {
    console.log('=== MOSTRANDO PRODUCTOS EN PAGO ===');
    
    // Función auxiliar para buscar elementos con múltiples intentos
    function buscarElementos(intento = 0) {
        const maxIntentos = 5;
        const delay = 100; // 100ms entre intentos
        
        // Buscar elementos dentro del modal específicamente
        const modalPago = document.getElementById('modalPago');
        let productosContainer = null;
        let montoTotal = null;
        
        if (modalPago) {
            // Buscar dentro del modal
            productosContainer = modalPago.querySelector('#productos-seleccionados');
            // Buscar el span dentro del h5 que contiene el monto total
            montoTotal = modalPago.querySelector('#monto-total-pago');
            // Si no se encuentra con el ID, buscar el H5 que contiene "Monto total a pagar"
            if (!montoTotal) {
                const h5Monto = Array.from(modalPago.querySelectorAll('h5')).find(h5 => 
                    h5.textContent.includes('Monto total') || h5.textContent.includes('total a pagar')
                );
                if (h5Monto) {
                    // Buscar el span dentro del H5
                    montoTotal = h5Monto.querySelector('span#monto-total-pago');
                    // Si no existe el span, buscar cualquier span dentro del H5
                    if (!montoTotal) {
                        montoTotal = h5Monto.querySelector('span');
                    }
                    // Si aún no existe, crear un span dentro del H5
                    if (!montoTotal) {
                        montoTotal = document.createElement('span');
                        montoTotal.id = 'monto-total-pago';
                        // El H5 probablemente tiene el formato "Monto total a pagar: ₡0"
                        // Necesitamos insertar el span después del texto
                        const textoH5 = h5Monto.textContent;
                        const partes = textoH5.split(':');
                        if (partes.length > 1) {
                            h5Monto.innerHTML = partes[0] + ': <span id="monto-total-pago">₡0</span>';
                            montoTotal = h5Monto.querySelector('#monto-total-pago');
                        } else {
                            h5Monto.appendChild(montoTotal);
                            montoTotal.textContent = '₡0';
                        }
                    }
                }
            }
        }
        
        // Si no se encuentran dentro del modal, buscar globalmente
        if (!productosContainer) {
            productosContainer = document.getElementById('productos-seleccionados');
        }
        if (!montoTotal) {
            montoTotal = document.getElementById('monto-total-pago');
            // Si aún no se encuentra, buscar por el texto del H5
            if (!montoTotal) {
                const h5Monto = Array.from(document.querySelectorAll('h5')).find(h5 => 
                    h5.textContent.includes('Monto total') || h5.textContent.includes('total a pagar')
                );
                if (h5Monto) {
                    montoTotal = h5Monto.querySelector('span#monto-total-pago') || h5Monto.querySelector('span');
                    // Si no existe, crear el span
                    if (!montoTotal) {
                        montoTotal = document.createElement('span');
                        montoTotal.id = 'monto-total-pago';
                        const textoH5 = h5Monto.textContent;
                        const partes = textoH5.split(':');
                        if (partes.length > 1) {
                            h5Monto.innerHTML = partes[0] + ': <span id="monto-total-pago">₡0</span>';
                            montoTotal = h5Monto.querySelector('#monto-total-pago');
                        } else {
                            h5Monto.appendChild(montoTotal);
                            montoTotal.textContent = '₡0';
                        }
                    }
                }
            }
        }
        
        console.log(`Intento ${intento + 1}: Elementos encontrados:`, {
            productosContainer: !!productosContainer,
            montoTotal: !!montoTotal,
            modalPago: !!modalPago
        });
        
        // Debug adicional si no se encuentra montoTotal
        if (!montoTotal && modalPago) {
            const allSpans = modalPago.querySelectorAll('span');
            const allH5s = modalPago.querySelectorAll('h5');
            console.log('Debug - Spans encontrados en modal:', allSpans.length);
            console.log('Debug - H5s encontrados en modal:', allH5s.length);
            if (allH5s.length > 0) {
                console.log('Debug - Contenido de H5s:', Array.from(allH5s).map(h5 => h5.textContent));
            }
        }
        
        if (productosContainer && montoTotal) {
            mostrarProductosEnPagoContenido(productosContainer, montoTotal);
            return true;
        }
        
        // Si no se encontraron y aún hay intentos disponibles, reintentar
        if (intento < maxIntentos - 1) {
            setTimeout(function() {
                buscarElementos(intento + 1);
            }, delay);
            return false;
        } else {
            console.error('No se pudieron encontrar los elementos del modal de pago después de', maxIntentos, 'intentos');
            return false;
        }
    }
    
    // Iniciar búsqueda
    buscarElementos();
};

// Función auxiliar para mostrar el contenido del modal de pago
function mostrarProductosEnPagoContenido(productosContainer, montoTotal) {
    
    // Obtener carrito desde localStorage
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('luArtCarrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        console.error('Error cargando carrito:', e);
    }
    
    console.log('Carrito cargado para mostrar:', carrito);
    
    if (carrito.length === 0) {
        productosContainer.innerHTML = '<p class="text-muted mb-0">No hay productos seleccionados</p>';
        montoTotal.textContent = '₡0';
        console.log('Carrito vacío, mostrando mensaje');
        return;
    }
    
    let total = 0;
    let productosHTML = '';
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        productosHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.nombre} - ${item.cantidad} x ₡${item.precio.toLocaleString()}</span>
                <strong>₡${subtotal.toLocaleString()}</strong>
            </div>
        `;
    });
    
    productosContainer.innerHTML = productosHTML;
    montoTotal.textContent = `₡${total.toLocaleString()}`;
    
    console.log('Productos mostrados correctamente, total:', total);
}

// Función para enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    console.log('=== ENVIANDO PEDIDO POR WHATSAPP ===');
    
    // Obtener datos del formulario
    const provincia = document.getElementById('provincia')?.value;
    const canton = document.getElementById('canton')?.value;
    const distrito = document.getElementById('distrito')?.value;
    const direccionExacta = document.getElementById('direccion-exacta')?.value;
    const indicaciones = document.getElementById('indicaciones')?.value;
    const facturaElectronica = document.getElementById('factura-electronica')?.checked;
    const emailFactura = document.getElementById('email-factura')?.value;
    
    // Validar campos requeridos
    if (!provincia || !canton || !distrito || !direccionExacta) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    // Validar correo electrónico si se requiere factura
    if (facturaElectronica && !emailFactura) {
        alert('Por favor ingrese su correo electrónico para la factura');
        return;
    }
    
    // Obtener carrito
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('luArtCarrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        console.error('Error cargando carrito:', e);
        alert('Error al cargar el carrito');
        return;
    }
    
    if (carrito.length === 0) {
        alert('No hay productos en el carrito');
        return;
    }
    
    // Calcular total
    let total = 0;
    let productosTexto = '';
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        productosTexto += `• ${item.nombre} - ${item.cantidad} x ₡${item.precio.toLocaleString()} = ₡${subtotal.toLocaleString()}\n`;
    });
    
    // Crear mensaje
    const mensaje = `🛒 *PEDIDO LU ART* 🛒

 *PRODUCTOS:*
${productosTexto}

 *TOTAL: ₡${total.toLocaleString()}*

 *DIRECCIÓN DE ENVÍO:*
• Provincia: ${provincia}
• Cantón: ${canton}
• Distrito: ${distrito}
• Dirección: ${direccionExacta}
${indicaciones ? `• Indicaciones: ${indicaciones}` : ''}

${facturaElectronica ? ` *FACTURA ELECTRÓNICA REQUERIDA*\n• Correo electrónico: ${emailFactura}` : ''}

Por favor confirmar el pedido y enviar comprobante de pago.`;
    
    // Enviar por WhatsApp
    const numeroWhatsApp = '50670605427';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Limpiar timestamp cuando se completa la compra
    localStorage.removeItem('luArtCarritoTimestamp');
    
    console.log('Mensaje enviado por WhatsApp');
}

// Función para verificar si el carrito ha expirado (25 minutos)
function verificarExpiracionCarrito() {
    const timestampGuardado = localStorage.getItem('luArtCarritoTimestamp');
    
    // Si no hay timestamp, no hay expiración activa
    if (!timestampGuardado) {
        return false;
    }
    
    const timestamp = parseInt(timestampGuardado);
    const ahora = Date.now();
    const tiempoTranscurrido = ahora - timestamp;
    const tiempoLimite = 25 * 60 * 1000; // 25 minutos en milisegundos
    
    if (tiempoTranscurrido >= tiempoLimite) {
        console.log('Carrito expirado después de 25 minutos, vaciando...');
        localStorage.removeItem('luArtCarrito');
        localStorage.removeItem('luArtCarritoTimestamp');
        renderCarrito();
        actualizarContadorCarrito();
        
        // Mostrar notificación si SweetAlert está disponible
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Carrito expirado',
                text: 'Tu carrito ha sido vaciado automáticamente después de 25 minutos de inactividad',
                timer: 3000,
                showConfirmButton: false
            });
        }
        
        return true;
    }
    
    return false;
}

// Función para vaciar el carrito
function vaciarCarrito() {
    console.log('=== VACIANDO CARRITO ===');
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se eliminarán todos los productos del carrito',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('luArtCarrito');
                localStorage.removeItem('luArtCarritoTimestamp'); // Limpiar también el timestamp
                renderCarrito();
                actualizarContadorCarrito();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Carrito vaciado',
                    text: 'Todos los productos han sido eliminados',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    } else {
        // Fallback si SweetAlert no está disponible
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            localStorage.removeItem('luArtCarrito');
            localStorage.removeItem('luArtCarritoTimestamp'); // Limpiar también el timestamp
            renderCarrito();
            actualizarContadorCarrito();
            alert('Carrito vaciado');
        }
    }
}

// Función para abrir modal de pago desde el carrito
function abrirModalPago() {
    console.log('Abriendo modal de pago desde carrito...');
    
    // Cerrar el modal del carrito primero
    const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
    if (modalCarrito) {
        modalCarrito.hide();
    }
    
    // Esperar un momento y luego abrir el modal de pago
    setTimeout(function() {
        const modalPago = new bootstrap.Modal(document.getElementById('modalPago'));
        modalPago.show();
        console.log('Modal de pago abierto');
    }, 300);
}

// Event listener para mostrar productos cuando se abre el modal de pago
document.addEventListener('DOMContentLoaded', function() {
    // Verificar expiración del carrito al cargar la página
    verificarExpiracionCarrito();
    
    // Inicializar carrito
    actualizarContadorCarrito();
    renderCarrito();
    
    // Verificar expiración cada minuto
    setInterval(function() {
        verificarExpiracionCarrito();
    }, 60000); // Verificar cada 60 segundos (1 minuto)
    
    const modalPago = document.getElementById('modalPago');
    if (modalPago) {
        console.log('Modal de pago encontrado, agregando event listener');
        // Usar 'shown.bs.modal' en lugar de 'show.bs.modal' para asegurar que el modal esté completamente renderizado
        // Agregar el listener - la función ya está disponible globalmente
        modalPago.addEventListener('shown.bs.modal', function() {
            console.log('Modal de pago completamente visible, mostrando productos (scripts.js)');
            if (typeof window.mostrarProductosEnPago === 'function') {
                window.mostrarProductosEnPago();
            } else {
                console.error('Función mostrarProductosEnPago no está disponible');
            }
        });
    } else {
        console.log('Modal de pago no encontrado en esta página');
    }
});

// Datos de provincias, cantones y distritos de Costa Rica
const datosCostaRica = {
    'san-jose': {
        nombre: 'San José',
        cantones: {
            'san-jose': { nombre: 'San José', distritos: ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco de Dos Ríos', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián'] },
            'escazu': { nombre: 'Escazú', distritos: ['Escazú', 'San Antonio', 'San Rafael'] },
            'desamparados': { nombre: 'Desamparados', distritos: ['Desamparados', 'San Miguel', 'San Juan de Dios', 'San Rafael Arriba', 'San Antonio', 'Frailes', 'Patarrá', 'San Cristóbal', 'Rosario', 'Damas', 'San Rafael Abajo', 'Gravilias', 'Los Guido'] },
            'puriscal': { nombre: 'Puriscal', distritos: ['Santiago', 'Mercedes Sur', 'Barbacoas', 'Grifo Alto', 'San Rafael', 'Candelarita', 'Desamparaditos', 'San Antonio', 'Chires'] },
            'tarrazu': { nombre: 'Tarrazú', distritos: ['San Marcos', 'San Lorenzo', 'San Carlos'] },
            'aserri': { nombre: 'Aserrí', distritos: ['Aserrí', 'Tarbaca', 'Vuelta de Jorco', 'San Gabriel', 'Legua', 'Monterrey', 'Salitrillos'] },
            'mora': { nombre: 'Mora', distritos: ['Colón', 'Guayabo', 'Tabarcia', 'Piedras Negras', 'Picagres', 'Jaris', 'Quitirrisí'] },
            'goicoechea': { nombre: 'Goicoechea', distritos: ['Guadalupe', 'San Francisco', 'Calle Blancos', 'Mata de Plátano', 'Ipís', 'Rancho Redondo', 'Purral'] },
            'santa-ana': { nombre: 'Santa Ana', distritos: ['Santa Ana', 'Salitral', 'Pozos', 'Uruca', 'Piedades', 'Brasil'] },
            'alajuelita': { nombre: 'Alajuelita', distritos: ['Alajuelita', 'San Josecito', 'San Antonio', 'Concepción', 'San Felipe', 'San Isidro'] },
            'coronado': { nombre: 'Coronado', distritos: ['San Isidro', 'San Rafael', 'Dulce Nombre de Jesús', 'Patalillo', 'Cascajal'] },
            'acosta': { nombre: 'Acosta', distritos: ['San Ignacio', 'Guaitil', 'Palmichal', 'Cangrejal', 'Sabanillas'] },
            'tibas': { nombre: 'Tibás', distritos: ['San Juan', 'Cinco Esquinas', 'Anselmo Llorente', 'León XIII', 'Colima'] },
            'moravia': { nombre: 'Moravia', distritos: ['San Vicente', 'San Jerónimo', 'La Trinidad'] },
            'montes-de-oca': { nombre: 'Montes de Oca', distritos: ['San Pedro', 'Sabanilla', 'Mercedes', 'San Rafael'] },
            'turrubares': { nombre: 'Turrubares', distritos: ['San Pablo', 'San Pedro', 'San Juan de Mata', 'San Luis', 'Carara'] },
            'dota': { nombre: 'Dota', distritos: ['Santa María', 'Jardín', 'Copey'] },
            'curridabat': { nombre: 'Curridabat', distritos: ['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases'] },
            'perez-zeledon': { nombre: 'Pérez Zeledón', distritos: ['San Isidro de El General', 'General', 'Daniel Flores', 'Rivas', 'San Pedro', 'Platanares', 'Pejibaye', 'Cajón', 'Barú', 'Río Nuevo', 'Páramo', 'La Amistad'] },
            'leon-cortes': { nombre: 'León Cortés', distritos: ['San Pablo', 'San Andrés', 'Llano Bonito', 'San Isidro', 'Santa Cruz', 'San Antonio'] }
        }
    },
    'cartago': {
        nombre: 'Cartago',
        cantones: {
            'cartago': { nombre: 'Cartago', distritos: ['Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente', 'Guadalupe', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla'] },
            'paraiso': { nombre: 'Paraíso', distritos: ['Paraíso', 'Santiago', 'Orosi', 'Cachí', 'Llanos de Santa Lucía'] },
            'la-union': { nombre: 'La Unión', distritos: ['Tres Ríos', 'San Diego', 'San Juan', 'San Rafael', 'Concepción', 'Dulce Nombre', 'San Ramón', 'Río Azul'] },
            'jimenez': { nombre: 'Jiménez', distritos: ['Juan Viñas', 'Tucurrique', 'Pejibaye'] },
            'turrialba': { nombre: 'Turrialba', distritos: ['Turrialba', 'La Suiza', 'Peralta', 'Santa Cruz', 'Santa Teresita', 'Pavones', 'Tuis', 'Tayutic', 'Santa Rosa', 'Tres Equis', 'La Isabel', 'Chirripó'] },
            'alvarado': { nombre: 'Alvarado', distritos: ['Pacayas', 'Cervantes', 'Capellades'] },
            'oreamuno': { nombre: 'Oreamuno', distritos: ['San Rafael', 'Cot', 'Potrero Cerrado', 'Cipreses', 'Santa Rosa'] },
            'el-guarco': { nombre: 'El Guarco', distritos: ['El Tejar', 'San Isidro', 'Tobosi', 'Patio de Agua'] }
        }
    },
    'heredia': {
        nombre: 'Heredia',
        cantones: {
            'heredia': { nombre: 'Heredia', distritos: ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'] },
            'barva': { nombre: 'Barva', distritos: ['Barva', 'San Pedro', 'San Pablo', 'San Roque', 'Santa Lucía', 'San José de la Montaña'] },
            'santo-domingo': { nombre: 'Santo Domingo', distritos: ['Santo Domingo', 'San Vicente', 'San Miguel', 'Paracito', 'Santo Tomás', 'Santa Rosa', 'Tures', 'Pará'] },
            'santa-barbara': { nombre: 'Santa Bárbara', distritos: ['Santa Bárbara', 'San Pedro', 'San Juan', 'Jesús', 'Santo Domingo del Roble', 'Purabá'] },
            'san-rafael': { nombre: 'San Rafael', distritos: ['San Rafael', 'San Josecito', 'Santiago', 'Ángeles', 'Concepción'] },
            'san-isidro': { nombre: 'San Isidro', distritos: ['San Isidro', 'San José', 'Concepción', 'San Francisco'] },
            'belen': { nombre: 'Belén', distritos: ['San Antonio', 'La Ribera', 'La Asunción'] },
            'flores': { nombre: 'Flores', distritos: ['San Joaquín', 'Barrantes', 'Llorente'] },
            'san-pablo': { nombre: 'San Pablo', distritos: ['San Pablo', 'Rincón de Sabanilla'] },
            'sarapiqui': { nombre: 'Sarapiquí', distritos: ['Puerto Viejo', 'La Virgen', 'Horquetas', 'Llanuras del Gaspar', 'Cureña'] }
        }
    },
    'alajuela': {
        nombre: 'Alajuela',
        cantones: {
            'alajuela': { nombre: 'Alajuela', distritos: ['Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima', 'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrúcares', 'Tambor', 'Garita', 'Sarapiquí'] },
            'san-ramon': { nombre: 'San Ramón', distritos: ['San Ramón', 'Santiago', 'San Juan', 'Piedades Norte', 'Piedades Sur', 'San Rafael', 'San Isidro', 'Ángeles', 'Alfaro', 'Volio', 'Concepción', 'Zapotal', 'Peñas Blancas', 'San Lorenzo'] },
            'grecia': { nombre: 'Grecia', distritos: ['Grecia', 'San Isidro', 'San José', 'San Roque', 'Tacares', 'Río Cuarto', 'Puente de Piedra', 'Bolívar'] },
            'san-mateo': { nombre: 'San Mateo', distritos: ['San Mateo', 'Desmonte', 'Jesús María', 'Labrador'] },
            'atenas': { nombre: 'Atenas', distritos: ['Atenas', 'Jesús', 'Mercedes', 'San Isidro', 'Concepción', 'San José', 'Santa Eulalia', 'Escobal'] },
            'naranjo': { nombre: 'Naranjo', distritos: ['Naranjo', 'San Miguel', 'San José', 'Cirrí', 'San Jerónimo', 'San Juan', 'El Rosario', 'Palmitos'] },
            'palmares': { nombre: 'Palmares', distritos: ['Palmares', 'Zaragoza', 'Buenos Aires', 'Santiago', 'Candelaria', 'Esquipulas', 'La Granja'] },
            'poas': { nombre: 'Poás', distritos: ['San Pedro', 'San Juan', 'San Rafael', 'Carrillos', 'Sabana Redonda'] },
            'orotina': { nombre: 'Orotina', distritos: ['Orotina', 'El Mastate', 'Hacienda Vieja', 'Coyolar', 'La Ceiba'] },
            'san-carlos': { nombre: 'San Carlos', distritos: ['Quesada', 'Florencia', 'Buenavista', 'Peñas Blancas', 'La Fortuna', 'La Tigra', 'La Palmera', 'Venecia', 'Aguas Zarcas', 'Venado', 'Cutris', 'Monterrey', 'Pocosol', 'Pital', 'La Cureña', 'Santa Rosa', 'Buenos Aires', 'San Jerónimo', 'San Luis', 'San Rafael', 'San Isidro', 'San José', 'San Miguel', 'San Pedro', 'San Ramón', 'Santa Clara', 'Santa María', 'Santa Rosa', 'Santo Domingo', 'Sitio Mata'] },
            'zarcero': { nombre: 'Zarcero', distritos: ['Zarcero', 'Laguna', 'Tapezco', 'Guadalupe', 'Palmira', 'Zapote', 'Brisas'] },
            'valverde-vega': { nombre: 'Valverde Vega', distritos: ['Sarchí Norte', 'Sarchí Sur', 'Toro Amarillo', 'San Pedro', 'Rodriguez', 'San Juan'] },
            'upala': { nombre: 'Upala', distritos: ['Upala', 'Aguas Claras', 'San José', 'Bijagua', 'Delicias', 'Dos Ríos', 'Yolillal', 'Canalete'] },
            'guatuso': { nombre: 'Guatuso', distritos: ['San Rafael', 'Buenavista', 'Cote', 'Katira'] },
            'rio-cuarto': { nombre: 'Río Cuarto', distritos: ['Río Cuarto', 'Santa Isabel', 'Santa Rita'] }
        }
    },
    'guanacaste': {
        nombre: 'Guanacaste',
        cantones: {
            'liberia': { nombre: 'Liberia', distritos: ['Liberia', 'Cañas Dulces', 'Mayorga', 'Nacascolo', 'Curubandé'] },
            'nicoya': { nombre: 'Nicoya', distritos: ['Nicoya', 'Mansión', 'San Antonio', 'Quebrada Honda', 'Sámara', 'Nosara', 'Belén de Nosarita'] },
            'santa-cruz': { nombre: 'Santa Cruz', distritos: ['Santa Cruz', 'Bolsón', 'Veintisiete de Abril', 'Tempate', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Cabo Velas', 'Tamarindo'] },
            'bagaces': { nombre: 'Bagaces', distritos: ['Bagaces', 'Fortuna', 'Mogote', 'Río Naranjo'] },
            'carrillo': { nombre: 'Carrillo', distritos: ['Filadelfia', 'Palmira', 'Sardinal', 'Belén'] },
            'canas': { nombre: 'Cañas', distritos: ['Cañas', 'Palmira', 'San Miguel', 'Bebedero', 'Porozal'] },
            'abangares': { nombre: 'Abangares', distritos: ['Las Juntas', 'Sierra', 'San Juan', 'Colorado'] },
            'tilaran': { nombre: 'Tilarán', distritos: ['Tilarán', 'Quebrada Grande', 'Tronadora', 'Santa Rosa', 'Líbano', 'Tierras Morenas', 'Arenal'] },
            'nandayure': { nombre: 'Nandayure', distritos: ['Carmona', 'Santa Rita', 'Zapotal', 'San Pablo', 'Porvenir', 'Bejuco'] },
            'la-cruz': { nombre: 'La Cruz', distritos: ['La Cruz', 'Santa Cecilia', 'Garita', 'Santa Elena'] },
            'hojancha': { nombre: 'Hojancha', distritos: ['Hojancha', 'Monte Romo', 'Puerto Carrillo', 'Huacas'] }
        }
    },
    'puntarenas': {
        nombre: 'Puntarenas',
        cantones: {
            'puntarenas': { nombre: 'Puntarenas', distritos: ['Puntarenas', 'Pitahaya', 'Chomes', 'Lepanto', 'Paquera', 'Manzanillo', 'Guacimal', 'Barranca', 'Monte Verde', 'Isla del Coco', 'Cóbano', 'Chacarita', 'Chira', 'Acapulco', 'El Roble', 'Arancibia'] },
            'esparza': { nombre: 'Esparza', distritos: ['Espíritu Santo', 'San Juan Grande', 'Macacona', 'San Rafael', 'San Jerónimo'] },
            'buenos-aires': { nombre: 'Buenos Aires', distritos: ['Buenos Aires', 'Volcán', 'Potrero Grande', 'Boruca', 'Pilas', 'Colinas', 'Changena', 'Biolley', 'Brunka'] },
            'montes-de-oro': { nombre: 'Montes de Oro', distritos: ['Miramar', 'La Unión', 'San Isidro'] },
            'osa': { nombre: 'Osa', distritos: ['Puerto Cortés', 'Palmar', 'Sierpe', 'Bahía Ballena', 'Piedras Blancas', 'Bahía Drake'] },
            'quepos': { nombre: 'Quepos', distritos: ['Quepos', 'Savegre', 'Naranjito'] },
            'golfito': { nombre: 'Golfito', distritos: ['Golfito', 'Puerto Jiménez', 'Guaycará', 'Pavón'] },
            'coto-brus': { nombre: 'Coto Brus', distritos: ['San Vito', 'Sabalito', 'Aguabuena', 'Limón', 'Pittier', 'Gutiérrez Braun'] },
            'parrita': { nombre: 'Parrita', distritos: ['Parrita'] },
            'corredores': { nombre: 'Corredores', distritos: ['Corredor', 'La Cuesta', 'Paso Canoas', 'Laurel'] },
            'garabito': { nombre: 'Garabito', distritos: ['Jacó', 'Tárcoles'] }
        }
    },
    'limon': {
        nombre: 'Limón',
        cantones: {
            'limon': { nombre: 'Limón', distritos: ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama'] },
            'pococi': { nombre: 'Pococí', distritos: ['Guápiles', 'Jiménez', 'Rita', 'Roxana', 'Cariari', 'Colorado', 'La Colonia'] },
            'siquirres': { nombre: 'Siquirres', distritos: ['Siquirres', 'Pacuarito', 'Florida', 'Germania', 'Cairo', 'Alegría'] },
            'talamanca': { nombre: 'Talamanca', distritos: ['Bratsi', 'Sixaola', 'Cahuita', 'Telire'] },
            'matina': { nombre: 'Matina', distritos: ['Matina', 'Batán', 'Carrandi'] },
            'guacimo': { nombre: 'Guácimo', distritos: ['Guácimo', 'Mercedes', 'Pocora', 'Río Jiménez', 'Duacarí'] }
        }
    }
};

// Función para cargar cantones según la provincia seleccionada
function cargarCantones() {
    const provinciaSelect = document.getElementById('provincia');
    const cantonSelect = document.getElementById('canton');
    const distritoSelect = document.getElementById('distrito');
    
    if (!provinciaSelect || !cantonSelect || !distritoSelect) return;
    
    const provinciaSeleccionada = provinciaSelect.value;
    
    // Limpiar cantones y distritos
    cantonSelect.innerHTML = '<option value="">Seleccionar cantón</option>';
    distritoSelect.innerHTML = '<option value="">Seleccionar distrito</option>';
    
    if (provinciaSeleccionada && datosCostaRica[provinciaSeleccionada]) {
        const cantones = datosCostaRica[provinciaSeleccionada].cantones;
        
        Object.keys(cantones).forEach(cantonKey => {
            const canton = cantones[cantonKey];
            const option = document.createElement('option');
            option.value = cantonKey;
            option.textContent = canton.nombre;
            cantonSelect.appendChild(option);
        });
    }
}

// Función para cargar distritos según el cantón seleccionado
function cargarDistritos() {
    const provinciaSelect = document.getElementById('provincia');
    const cantonSelect = document.getElementById('canton');
    const distritoSelect = document.getElementById('distrito');
    
    if (!provinciaSelect || !cantonSelect || !distritoSelect) return;
    
    const provinciaSeleccionada = provinciaSelect.value;
    const cantonSeleccionado = cantonSelect.value;
    
    // Limpiar distritos
    distritoSelect.innerHTML = '<option value="">Seleccionar distrito</option>';
    
    if (provinciaSeleccionada && cantonSeleccionado && 
        datosCostaRica[provinciaSeleccionada] && 
        datosCostaRica[provinciaSeleccionada].cantones[cantonSeleccionado]) {
        
        const distritos = datosCostaRica[provinciaSeleccionada].cantones[cantonSeleccionado].distritos;
        
        distritos.forEach(distrito => {
            const option = document.createElement('option');
            option.value = distrito.toLowerCase().replace(/\s+/g, '-');
            option.textContent = distrito;
            distritoSelect.appendChild(option);
        });
    }
}

// Configurar event listeners para el formulario de dirección
document.addEventListener('DOMContentLoaded', function() {
    const provinciaSelect = document.getElementById('provincia');
    const cantonSelect = document.getElementById('canton');
    const distritoSelect = document.getElementById('distrito');
    
    if (provinciaSelect) {
        provinciaSelect.addEventListener('change', cargarCantones);
        console.log('Event listener agregado a provincia');
    }
    
    if (cantonSelect) {
        cantonSelect.addEventListener('change', cargarDistritos);
        console.log('Event listener agregado a cantón');
    }
    
    console.log('Event listeners configurados para formulario de dirección');
});