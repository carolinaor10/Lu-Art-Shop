// Sincronizar productos desde localStorage con las páginas públicas
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== SINCRONIZANDO PRODUCTOS DESDE LOCALSTORAGE ===');
    
    // Obtener productos desde localStorage
    const savedProducts = localStorage.getItem('luArtProducts');
    
    if (!savedProducts) {
        console.log('No hay productos en localStorage, usando productos hardcodeados');
        return;
    }
    
    try {
        const products = JSON.parse(savedProducts);
        console.log('Productos cargados desde localStorage:', products.length);
        
        // Detectar la página actual
        const currentPage = window.location.pathname;
        let category = null;
        
        if (currentPage.includes('paletas.html')) {
            category = 'paletas';
        } else if (currentPage.includes('tazas.html')) {
            category = 'tazas';
        } else if (currentPage.includes('snackbowls.html')) {
            category = 'snackbowls';
        }
        
        if (!category) {
            console.log('No es una página de producto específica');
            return;
        }
        
        // Filtrar productos por categoría
        const categoryProducts = products.filter(p => p.category === category);
        console.log(`Productos de ${category}:`, categoryProducts.length);
        
        if (categoryProducts.length === 0) {
            console.log('No hay productos en esta categoría');
            return;
        }
        
        // Actualizar la lista de productos en el HTML
        updateProductList(categoryProducts, category);
        
    } catch (error) {
        console.error('Error sincronizando productos:', error);
    }
});

function updateProductList(products, category) {
    const productList = document.getElementById('productList');
    
    if (!productList) {
        console.error('No se encontró el elemento productList');
        return;
    }
    
    console.log('Actualizando lista de productos...');
    
    // Generar HTML para cada producto
    const productHTML = products.map(product => {
        const stockDisplay = product.stock > 0 ? product.stock : 'Agotado';
        const stockClass = product.stock > 0 ? '' : 'text-danger';
        
        console.log(`Producto: ${product.name}, Stock: ${product.stock}, Display: ${stockDisplay}`);
        
        return `
            <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
                <div class="portfolio-item" data-id="${product.id}">
                    <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal${product.id}">
                        <div class="portfolio-hover">
                            <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                        </div>
                        <img class="img-fluid" src="${product.image}" alt="${product.name}" />
                    </a>
                    <div class="portfolio-caption">
                        <div class="portfolio-caption-heading">${product.name}</div>
                        <div class="portfolio-caption-subheading text-muted">₡${product.price.toLocaleString()}</div>
                        <div class="portfolio-caption-subheading ${stockClass}">Stock: ${stockDisplay}</div>
                        <button class="btn btn-primary btn-xl text-uppercase add-to-cart" 
                            type="button"
                            data-id="${product.id}" 
                            data-categoria="${product.category}"
                            data-nombre="${product.name}" 
                            data-precio="${product.price}"
                            data-stock="${product.stock}"
                            data-translate="shop.add_to_cart"
                            ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Actualizar el HTML
    productList.innerHTML = productHTML;
    
    console.log('Lista de productos actualizada');
    
    // Disparar evento para que scripts.js reanude los listeners
    const event = new Event('productsUpdated');
    document.dispatchEvent(event);
    console.log('Evento productsUpdated disparado');
}

