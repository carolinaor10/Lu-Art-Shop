// Función para previsualizar imagen
function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const previewImg = preview.querySelector('img');
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validar tamaño del archivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo muy grande',
                text: 'La imagen debe ser menor a 5MB',
                timer: 2000
            });
            input.value = '';
            return;
        }
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Tipo de archivo inválido',
                text: 'Solo se permiten archivos de imagen (JPG, PNG, GIF)',
                timer: 2000
            });
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
}

// Función para eliminar imagen
function removeImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.value = '';
    preview.style.display = 'none';
}

// Función para convertir imagen a base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Función para obtener la imagen (archivo o URL)
async function getProductImage() {
    const fileInput = document.getElementById('productImageFile');
    const urlInput = document.getElementById('productImageUrl');
    
    // Priorizar archivo sobre URL
    if (fileInput.files && fileInput.files[0]) {
        try {
            return await convertImageToBase64(fileInput.files[0]);
        } catch (error) {
            console.error('Error converting image:', error);
            return urlInput.value.trim() || 'assets/img/logo/LU ART COLOR.png';
        }
    } else if (urlInput.value.trim()) {
        return urlInput.value.trim();
    } else {
        return 'assets/img/logo/LU ART COLOR.png'; // Imagen por defecto
    }
}

// Función para obtener la imagen en edición
async function getEditProductImage() {
    const fileInput = document.getElementById('editProductImageFile');
    const urlInput = document.getElementById('editProductImageUrl');
    
    // Priorizar archivo sobre URL
    if (fileInput.files && fileInput.files[0]) {
        try {
            return await convertImageToBase64(fileInput.files[0]);
        } catch (error) {
            console.error('Error converting image:', error);
            return urlInput.value.trim() || 'assets/img/logo/LU ART COLOR.png';
        }
    } else if (urlInput.value.trim()) {
        return urlInput.value.trim();
    } else {
        return 'assets/img/logo/LU ART COLOR.png'; // Imagen por defecto
    }
}

// Función para generar ID único
function generateUniqueId() {
    // Combinar timestamp con número aleatorio para garantizar unicidad
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = parseInt(timestamp.toString() + random.toString().padStart(3, '0'));
    
    // Verificar que no exista ya
    const existingIds = products.map(p => p.id);
    if (existingIds.includes(uniqueId)) {
        return generateUniqueId(); // Recursión si hay conflicto
    }
    
    console.log('ID único generado:', uniqueId);
    return uniqueId;
}

// Admin Panel JavaScript
let products = [];
let currentEditingProduct = null;

// Verificar autenticación
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Mostrar usuario actual
document.getElementById('adminUser').textContent = localStorage.getItem('adminUser') || 'Admin';

// Cargar productos desde localStorage o admin-products
function loadProducts() {
    const savedProducts = localStorage.getItem('luArtProducts');
    
    // Priorizar productos guardados en localStorage
    if (savedProducts) {
        try {
            products = JSON.parse(savedProducts);
            console.log('Productos cargados desde localStorage:', products.length);
            return;
        } catch (error) {
            console.error('Error parseando productos de localStorage:', error);
        }
    }
    
    // Si no hay productos en localStorage, usar admin-products.js
    if (typeof productosDatabase !== 'undefined') {
        console.log('Usando productos de admin-products.js');
        // Convertir productosDatabase a formato products
        const allProducts = [];
        
        // Paletas
        if (productosDatabase.paletas) {
            productosDatabase.paletas.forEach(p => {
                allProducts.push({
                    id: p.id,
                    name: p.nombre,
                    price: p.precio,
                    stock: p.stock,
                    category: 'paletas',
                    image: p.imagen,
                    description: p.descripcion
                });
            });
        }
        
        // Tazas
        if (productosDatabase.tazas) {
            productosDatabase.tazas.forEach(p => {
                allProducts.push({
                    id: p.id,
                    name: p.nombre,
                    price: p.precio,
                    stock: p.stock,
                    category: 'tazas',
                    image: p.imagen,
                    description: p.descripcion
                });
            });
        }
        
        // Snack Bowls
        if (productosDatabase.snackbowls) {
            productosDatabase.snackbowls.forEach(p => {
                allProducts.push({
                    id: p.id,
                    name: p.nombre,
                    price: p.precio,
                    stock: p.stock,
                    category: 'snackbowls',
                    image: p.imagen,
                    description: p.descripcion
                });
            });
        }
        
        products = allProducts;
        saveProducts();
    } else {
        // Productos por defecto
        products = [
            {
                id: 1,
                name: 'Taza Tierra',
                category: 'tazas',
                price: 13000,
                stock: 5,
                image: 'assets/img/Lu Art Photos/IMG_0920.jpg',
                description: 'Taza artesanal con diseño de tierra'
            },
            {
                id: 2,
                name: 'Taza Aurora',
                category: 'tazas',
                price: 15000,
                stock: 3,
                image: 'assets/img/Lu Art Photos/IMG_0926.jpg',
                description: 'Taza con diseño de aurora'
            },
            {
                id: 3,
                name: 'Taza Halley',
                category: 'tazas',
                price: 14000,
                stock: 0,
                image: 'assets/img/Lu Art Photos/IMG_0927.jpg',
                description: 'Taza con diseño Halley'
            },
            {
                id: 4,
                name: 'Taza Amanecer',
                category: 'tazas',
                price: 16000,
                stock: 2,
                image: 'assets/img/Lu Art Photos/IMG_0930.jpg',
                description: 'Taza con diseño de amanecer'
            },
            {
                id: 5,
                name: 'Taza Green Waves',
                category: 'tazas',
                price: 24000,
                stock: 0,
                image: 'assets/img/Lu Art Photos/IMG_0932.jpg',
                description: 'Taza con ondas verdes'
            },
            {
                id: 6,
                name: 'Taza Cosmos',
                category: 'tazas',
                price: 24000,
                stock: 1,
                image: 'assets/img/Lu Art Photos/IMG_0937.jpg',
                description: 'Taza con diseño cósmico'
            },
            {
                id: 7,
                name: 'Paleta Vainilla',
                category: 'paletas',
                price: 12000,
                stock: 0,
                image: 'assets/img/Lu Art Photos/paletavainilla7.jpg',
                description: 'Paleta artesanal de vainilla'
            },
            {
                id: 8,
                name: 'Paleta Verde',
                category: 'paletas',
                price: 12000,
                stock: 4,
                image: 'assets/img/Lu Art Photos/paletaverde1.jpg',
                description: 'Paleta artesanal verde'
            },
            {
                id: 9,
                name: 'Paleta Puntos',
                category: 'paletas',
                price: 12000,
                stock: 2,
                image: 'assets/img/Lu Art Photos/paletapuntos.jpg',
                description: 'Paleta artesanal con puntos'
            },
            {
                id: 10,
                name: 'Snack Bowl Pequeño',
                category: 'snackbowls',
                price: 8000,
                stock: 6,
                image: 'assets/img/Lu Art Photos/IMG_0939.jpg',
                description: 'Snack bowl pequeño artesanal'
            },
            {
                id: 11,
                name: 'Snack Bowl Mediano',
                category: 'snackbowls',
                price: 10000,
                stock: 3,
                image: 'assets/img/Lu Art Photos/IMG_0948.jpg',
                description: 'Snack bowl mediano artesanal'
            },
            {
                id: 12,
                name: 'Snack Bowl Grande',
                category: 'snackbowls',
                price: 12000,
                stock: 1,
                image: 'assets/img/Lu Art Photos/IMG_0951.jpg',
                description: 'Snack bowl grande artesanal'
            }
        ];
        saveProducts();
    }
    updateDashboard();
    renderProducts();
}

// Guardar productos en localStorage
function saveProducts() {
    try {
        localStorage.setItem('luArtProducts', JSON.stringify(products));
        console.log('Productos guardados exitosamente:', products.length);
        console.log('Datos guardados:', products);
        
        // Sincronizar con las páginas públicas
        updateHTMLPages();
    } catch (error) {
        console.error('Error guardando productos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'No se pudieron guardar los productos',
            timer: 2000
        });
    }
}

// Actualizar páginas HTML con los datos del admin
function updateHTMLPages() {
    // Actualizar datos en localStorage para que las páginas públicas los usen
    // Las páginas públicas usarán localStorage.getItem('luArtProducts') para obtener los productos
    console.log('Productos actualizados:', products);
    console.log('Los productos ahora están disponibles para las páginas públicas');
}

// Mostrar sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remover clase active de todos los nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    document.getElementById(sectionName + '-section').style.display = 'block';
    
    // Activar nav-link correspondiente
    event.target.classList.add('active');
    
    // Actualizar datos si es necesario
    if (sectionName === 'dashboard') {
        updateDashboard();
    } else if (sectionName === 'products') {
        renderProducts();
    }
}

// Actualizar dashboard
function updateDashboard() {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.stock > 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 3).length;
    const soldOutProducts = products.filter(p => p.stock === 0).length;
    
    const totalProductsEl = document.getElementById('totalProducts');
    const availableProductsEl = document.getElementById('availableProducts');
    const lowStockProductsEl = document.getElementById('lowStockProducts');
    const soldOutProductsEl = document.getElementById('soldOutProducts');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (availableProductsEl) availableProductsEl.textContent = availableProducts;
    if (lowStockProductsEl) lowStockProductsEl.textContent = lowStockProducts;
    if (soldOutProductsEl) soldOutProductsEl.textContent = soldOutProducts;
    
    // Generar resumen de inventario
    const inventorySummary = document.getElementById('inventorySummary');
    if (inventorySummary) {
        const progressWidth = totalProducts > 0 ? (availableProducts/totalProducts)*100 : 0;
        inventorySummary.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Categorías:</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-coffee text-primary"></i> Tazas: ${products.filter(p => p.category === 'tazas').length}</li>
                    <li><i class="fas fa-palette text-success"></i> Paletas: ${products.filter(p => p.category === 'paletas').length}</li>
                    <li><i class="fas fa-bowl-food text-warning"></i> Snack Bowls: ${products.filter(p => p.category === 'snackbowls').length}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Estado del Stock:</h6>
                <div class="progress mb-2">
                    <div class="progress-bar bg-success" style="width: ${progressWidth}%"></div>
                </div>
                <small class="text-muted">${availableProducts} de ${totalProducts} productos disponibles</small>
            </div>
        </div>
    `;
    }
}

// Force cache bust
console.log('Admin.js version: 2.3 loaded at', new Date().toISOString());

// Renderizar productos
function renderProducts() {
    console.log('=== RENDERIZANDO PRODUCTOS ===');
    console.log('Versión: 3.3.1');
    
    const productsList = document.getElementById('productos-tbody');
    const searchProducts = document.getElementById('filtro-productos');
    const filterCategory = document.getElementById('filterCategory');
    const filterStock = document.getElementById('filterStock');
    
    if (!productsList) {
        console.error('Elemento productos-tbody no encontrado');
        return;
    }
    
    console.log('Elemento productos-tbody encontrado:', productsList);
    
    const searchTerm = searchProducts ? searchProducts.value.toLowerCase() : '';
    const categoryFilter = filterCategory ? filterCategory.value : '';
    const stockFilter = filterStock ? filterStock.value : '';
    
    console.log('Total productos:', products.length);
    console.log('Término de búsqueda:', searchTerm);
    console.log('Filtro de categoría:', categoryFilter);
    console.log('Filtro de stock:', stockFilter);
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        let matchesStock = true;
        
        if (stockFilter) {
            switch(stockFilter) {
                case 'high': matchesStock = product.stock > 10; break;
                case 'medium': matchesStock = product.stock > 3 && product.stock <= 10; break;
                case 'low': matchesStock = product.stock > 0 && product.stock <= 3; break;
                case 'zero': matchesStock = product.stock === 0; break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    console.log('Productos filtrados:', filteredProducts.length);
    console.log('Productos filtrados detalle:', filteredProducts.map(p => p.name));
    
    if (filteredProducts.length === 0) {
        if (productsList) {
            productsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No se encontraron productos</h5>
                <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        }
        return;
    }
    
    if (productsList) {
        console.log('Limpiando lista de productos...');
        // Limpiar la lista primero
        productsList.innerHTML = '';
        
        console.log('Generando HTML para', filteredProducts.length, 'productos');
        // Generar nuevas filas
        const productHTML = filteredProducts.map(product => {
        const stockClass = getStockClass(product.stock);
        const stockText = getStockText(product.stock);
        
        return `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='assets/img/logo/LU ART COLOR.png'">
                </td>
                <td>
                    <h6 class="mb-0">${product.name}</h6>
                    <small class="text-muted">${getCategoryName(product.category)}</small>
                </td>
                <td>
                    <span class="text-muted">${product.description || 'Sin descripción'}</span>
                </td>
                <td class="text-center">
                    <h6 class="mb-1">₡${product.price.toLocaleString()}</h6>
                </td>
                <td class="text-center">
                    <span class="stock-badge ${stockClass}">${stockText}</span>
                    <br>
                    <small class="text-muted">Stock: ${product.stock}</small>
                </td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm" 
                           value="${product.stock}" min="0" 
                           data-product-id="${product.id}"
                           onchange="console.log('Campo cambió - ID:', ${product.id}, 'Valor:', this.value); updateStock(${product.id}, this.value)"
                           style="max-width: 80px; margin: 0 auto;">
                </td>
                <td class="text-end">
                    <button class="btn btn-primary btn-sm me-1" 
                            onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" 
                            onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Asignar el HTML generado
    console.log('Asignando HTML a la lista, longitud:', productHTML.length);
    console.log('Primeros 200 caracteres del HTML:', productHTML.substring(0, 200));
    productsList.innerHTML = productHTML;
    console.log('Lista actualizada, productos en DOM:', productsList.querySelectorAll('tr').length);
    console.log('Verificando stock en primera fila:', productsList.querySelector('input[type="number"]')?.value);
    }
}

// Obtener clase CSS para el stock
function getStockClass(stock) {
    if (stock === 0) return 'stock-zero';
    if (stock <= 3) return 'stock-low';
    if (stock <= 10) return 'stock-medium';
    return 'stock-high';
}

// Obtener texto para el stock
function getStockText(stock) {
    if (stock === 0) return 'Agotado';
    if (stock <= 3) return 'Stock Bajo';
    if (stock <= 10) return 'Stock Medio';
    return 'Stock Alto';
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const names = {
        'tazas': 'Tazas',
        'paletas': 'Paletas',
        'snackbowls': 'Snack Bowls'
    };
    return names[category] || category;
}

// Actualizar stock
function updateStock(productId, newStock) {
    console.log('Actualizando stock - ID:', productId, 'Nuevo stock:', newStock);
    console.log('Productos disponibles:', products.length);
    
    const product = products.find(p => p.id == productId);
    console.log('Producto encontrado:', product);
    
    if (product) {
        product.stock = parseInt(newStock);
        console.log('Stock actualizado, producto actual:', product);
        
        saveProducts();
        updateDashboard();
        renderProducts();
        
        Swal.fire({
            icon: 'success',
            title: 'Stock actualizado',
            text: `El stock de ${product.name} se actualizó a ${newStock}`,
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        console.error('Producto no encontrado con ID:', productId);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Producto no encontrado',
            timer: 2000
        });
    }
}

// Editar producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        currentEditingProduct = product;
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductImageUrl').value = product.image;
        document.getElementById('editProductDescription').value = product.description || '';
        
        // Mostrar imagen actual si existe
        const preview = document.getElementById('editProductImagePreview');
        const previewImg = document.getElementById('editPreviewImg');
        if (product.image && product.image !== 'assets/img/logo/LU ART COLOR.png') {
            previewImg.src = product.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
        
        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    }
}

// Guardar edición de producto
async function saveProductEdit() {
    const productId = parseInt(document.getElementById('editProductId').value);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        product.name = document.getElementById('editProductName').value;
        product.category = document.getElementById('editProductCategory').value;
        product.price = parseInt(document.getElementById('editProductPrice').value);
        product.stock = parseInt(document.getElementById('editProductStock').value);
        product.image = await getEditProductImage();
        product.description = document.getElementById('editProductDescription').value;
        
        saveProducts();
        renderProducts();
        updateDashboard();
        
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        
        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'Los cambios se guardaron correctamente',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// Eliminar producto
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar "${product.name}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== productId);
            saveProducts();
            renderProducts();
            updateDashboard();
            
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: 'El producto se eliminó correctamente',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Cerrar sesión
function logout() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUser');
            window.location.href = 'admin-login.html';
        }
    });
}

// Funciones de configuración
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'luart-products.json';
    link.click();
    URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Exportación exitosa',
        text: 'Los productos se exportaron correctamente',
        timer: 1500,
        showConfirmButton: false
    });
}

function backupData() {
    const backup = {
        products: products,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luart-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Respaldo creado',
        text: 'El respaldo se creó correctamente',
        timer: 1500,
        showConfirmButton: false
    });
}

function clearAllData() {
    Swal.fire({
        title: '¿Eliminar todos los datos?',
        text: 'Esta acción eliminará TODOS los productos. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar',
        input: 'text',
        inputPlaceholder: 'Escribe "CONFIRMAR" para proceder',
        inputValidator: (value) => {
            if (value !== 'CONFIRMAR') {
                return 'Debes escribir "CONFIRMAR" para proceder';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            products = [];
            saveProducts();
            renderProducts();
            updateDashboard();
            
            Swal.fire({
                icon: 'success',
                title: 'Datos eliminados',
                text: 'Todos los productos se eliminaron correctamente',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Configurar formulario de agregar producto
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Formulario enviado');
        console.log('Productos actuales:', products.length);
        
        // Validar campos requeridos
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        
        if (!name || !category || !price || !stock) {
            Swal.fire({
                icon: 'error',
                title: 'Campos requeridos',
                text: 'Por favor completa todos los campos obligatorios',
                timer: 2000
            });
            return;
        }
        
        const newProduct = {
            id: generateUniqueId(),
            name: name,
            category: category,
            price: parseInt(price),
            stock: parseInt(stock),
            image: 'assets/img/logo/LU ART COLOR.png',
            description: document.getElementById('productDescription').value.trim()
        };
        
        console.log('Nuevo producto:', newProduct);
        
        products.push(newProduct);
        console.log('Productos después de agregar:', products.length);
        
        saveProducts();
        renderProducts();
        updateDashboard();
        
        // Limpiar formulario
        document.getElementById('addProductForm').reset();
        
        // Limpiar preview de imagen
        document.getElementById('productImagePreview').style.display = 'none';
        
        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${newProduct.name} se agregó correctamente`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            showSection('products');
        });
    });
    
    // Configurar filtros de búsqueda
    const searchProductsEl = document.getElementById('filtro-productos');
    if (searchProductsEl) {
        searchProductsEl.addEventListener('input', renderProducts);
    }
    
    const filterCategoryEl = document.getElementById('filterCategory');
    if (filterCategoryEl) {
        filterCategoryEl.addEventListener('change', renderProducts);
    }
    
    const filterStockEl = document.getElementById('filterStock');
    if (filterStockEl) {
        filterStockEl.addEventListener('change', renderProducts);
    }
});
