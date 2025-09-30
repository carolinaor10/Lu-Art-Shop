let carrito = [];

// Agregar producto al carrito
function agregarAlCarrito(id, nombre, precio, stock) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        if (productoExistente.cantidad < stock) {
            productoExistente.cantidad++;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Stock máximo alcanzado',
                text: `Solo hay ${stock} unidades disponibles de ${nombre}.`,
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
                title: 'Cantidad no disponible',
                text: `Solo hay ${producto.stock} unidades de ${producto.nombre}.`,
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
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay productos en el carrito</td></tr>`;
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
document.querySelectorAll(".add-to-cart").forEach(boton => {
    boton.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        const nombre = this.dataset.nombre;
        const precio = parseFloat(this.dataset.precio);
        const stock = parseInt(this.dataset.stock);

        agregarAlCarrito(id, nombre, precio, stock);

        Swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            html: `<strong>${nombre}</strong><br>Precio: ₡${precio.toLocaleString()}`,
            showConfirmButton: false,
            timer: 1500
        });
    });
});

// Abrir modal de carrito
const carritoOverlay = document.getElementById('carrito-container');
const abrirCarritoBtn = document.getElementById('abrir-carrito');
const cerrarCarritoBtn = document.querySelector('.close-btn');

abrirCarritoBtn.addEventListener('click', () => {
    renderCarrito();
    carritoOverlay.style.display = 'flex';
});

cerrarCarritoBtn.addEventListener('click', () => {
    carritoOverlay.style.display = 'none';
});

carritoOverlay.addEventListener('click', (e) => {
    if (e.target === carritoOverlay) {
        carritoOverlay.style.display = 'none';
    }
});

// Confirmar compra - abrir modal de pago con lista + WhatsApp
const confirmarCompraBtn = document.getElementById('confirmar-compra-btn');
confirmarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito.',
            timer: 1500
        });
        return;
    }

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
});
