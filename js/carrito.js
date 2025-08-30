let carrito = [];

// Seleccionar TODOS los botones con la clase .add-to-cart
document.querySelectorAll(".add-to-cart").forEach(boton => {
  boton.addEventListener("click", function () {
    const id = parseInt(this.dataset.id);
    const nombre = this.dataset.nombre;
    const precio = parseFloat(this.dataset.precio);

    agregarAlCarrito(id, nombre, precio);
  });
});

// Agregar producto al carrito
function agregarAlCarrito(id, nombre, precio) {
  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  renderCarrito();
}

// Eliminar producto
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderCarrito();
}

// Renderizar carrito
function renderCarrito() {
  const tbody = document.getElementById("carrito-body");
  tbody.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>₡${item.precio}</td>
      <td>
        <input type="number" value="${item.cantidad}" min="1" 
               class="form-control" 
               onchange="cambiarCantidad(${item.id}, this.value)">
      </td>
      <td>₡${item.precio * item.cantidad}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})"><i class="fa-solid fa-xmark"></i></button></td>
    `;

    tbody.appendChild(fila);
    total += item.precio * item.cantidad;
  });

  document.getElementById("total").innerText = "Total: ₡" + total;
}

// Cambiar cantidad
function cambiarCantidad(id, nuevaCantidad) {
  const producto = carrito.find(item => item.id === id);
  if (producto) {
    producto.cantidad = parseInt(nuevaCantidad);
    renderCarrito();
  }
}

  const carritoOverlay = document.getElementById('carrito-container');
  const abrirCarritoBtn = document.getElementById('abrir-carrito');
  const cerrarCarritoBtn = document.querySelector('.close-btn');

  abrirCarritoBtn.addEventListener('click', () => {
    carritoOverlay.style.display = 'flex';
  });

  cerrarCarritoBtn.addEventListener('click', () => {
    carritoOverlay.style.display = 'none';
  });

  // Cerrar si se hace clic fuera del contenedor
  carritoOverlay.addEventListener('click', (e) => {
    if (e.target === carritoOverlay) {
      carritoOverlay.style.display = 'none';
    }
  });

// Mostrar productos en el modal de pago
function actualizarModalPago() {
  const modalTotal = document.getElementById("monto-total");

  if (carrito.length === 0) {
    modalTotal.textContent = "No hay productos en su carrito";
    return;
  }

  // Crear listado de productos con cantidad
  const listaProductos = carrito.map(item => `${item.nombre} (x${item.cantidad})`).join(', ');

  // Calcular total
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  modalTotal.textContent = `${listaProductos} - ₡${total}`;
}

// Abrir modal de pago
// Botón de abrir carrito (solo muestra el overlay del carrito)
document.getElementById("abrir-carrito").addEventListener("click", function (e) {
  e.preventDefault();

  // Solo mostrar overlay del carrito, no abrir modal de pago
  const carritoOverlay = document.getElementById('carrito-container');
  carritoOverlay.style.display = 'flex';
});

// Botón de confirmar compra (abre modal de pago)
document.getElementById("confirmar-compra-btn").addEventListener("click", function () {
  // Actualizar monto total antes de abrir el modal
  const totalCompra = calcularTotalCarrito(); // función que ya tienes
  actualizarMontoTotal(totalCompra);

  // Opcional: si quieres mostrar los nombres de los productos en el modal
  const productosLista = carrito.map(item => `${item.cantidad} x ${item.nombre}`).join(', ');
  document.getElementById("productos-carrito").textContent = productosLista;

  // Bootstrap se encargará de abrir el modal porque ya tienes data-bs-toggle y data-bs-target
});

