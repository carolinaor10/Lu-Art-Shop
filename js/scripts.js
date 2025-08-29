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

    function showNextComment() {
        // Ocultar todos los comentarios
        comments.forEach(comment => {
            comment.classList.remove('active');
        });

        // Mostrar el siguiente comentario
        comments[counter].classList.add('active');

        // Incrementar el contador
        counter = (counter + 1) % comments.length;
    }

    // Mostrar el primer comentario
    showNextComment();

    // Cambiar los comentarios automáticamente cada 3 segundos
    setInterval(showNextComment, 5000);
});

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const nombre = this.dataset.nombre || 'Producto';
      const precio = Number(this.dataset.precio); // <- directo
  
      // fallback por si viniera mal
      const precioFinal = Number.isFinite(precio) ? precio : 0;
  
      Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        html: `<strong>${nombre}</strong><br>Precio: ₡${precioFinal.toLocaleString()}`,
        showConfirmButton: false,
        timer: 2000
      });
    });
  });

  
  

//search input
document.getElementById('searchInput').addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    const items = document.querySelectorAll('#productList .portfolio-item');

    items.forEach(item => {
        const title = item.querySelector('.portfolio-caption-heading').textContent.toLowerCase();
        const col = item.closest('.col-lg-4'); // para ocultar el contenedor correctamente

        if (title.includes(searchText)) {
            col.style.display = '';
        } else {
            col.style.display = 'none';
        }
    });
});