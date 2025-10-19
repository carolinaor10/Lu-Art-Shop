# Panel de Administración - Lu Art

## 📋 Descripción
Panel de administración completo para gestionar todos los productos de la tienda Lu Art. Permite visualizar, editar y administrar el inventario de productos desde una interfaz web intuitiva.

## 🚀 Funcionalidades

### 📊 Dashboard
- **Estadísticas en tiempo real**: Total de productos, disponibles, stock bajo y agotados
- **Distribución por categorías**: Conteo de productos por tipo (Tazas, Paletas, Snack Bowls)
- **Valor total del inventario**: Cálculo automático del valor monetario del stock
- **Productos que requieren atención**: Lista de productos con stock bajo o agotado

### 📦 Gestión de Productos
- **Lista completa de productos**: Tabla con todos los productos de la web
- **Filtros avanzados**: Por nombre, categoría y estado de stock
- **Acciones rápidas**: Editar, actualizar stock y ver detalles
- **Exportación**: Descargar datos en formato CSV

### 🔧 Características Técnicas
- **Base de datos integrada**: Todos los productos están definidos en `js/admin-products.js`
- **Actualización en tiempo real**: Las estadísticas se actualizan automáticamente
- **Interfaz responsiva**: Funciona en desktop, tablet y móvil
- **Alertas inteligentes**: Notificaciones para productos que requieren atención

## 📁 Estructura de Archivos

```
luArt/
├── admin.html              # Página principal del panel de administración
├── js/
│   ├── admin.js            # Funciones básicas del admin
│   └── admin-products.js   # Gestión de productos y estadísticas
└── ADMIN-README.md         # Este archivo
```

## 🎯 Productos Incluidos

### 🍽️ Tazas (9 productos)
- Taza Dos Ojos - ₡20,000
- Taza Bruma - ₡17,900
- Taza Bruma 2.0 - ₡17,900
- Taza Tierra - ₡13,000
- Taza Aurora - ₡12,000
- Taza Halley - ₡17,900
- Taza Amanecer - ₡16,000
- Taza Green Waves - ₡24,000 (Agotada)
- Taza Marito - ₡24,000 (Agotada)

### 🎨 Paletas (5 productos)
- Paleta Vainilla - ₡17,900
- Paleta pincelada - ₡17,900
- Paleta pincelada 2.0 - ₡17,900
- Paleta Verde - ₡17,900
- Paleta Verde 2.0 - ₡17,900

### 🥣 Snack Bowls (3 productos)
- Snack Bowl Pequeño - ₡12,900
- Snack Bowl Mediano - ₡15,900
- Snack Bowl Grande - ₡18,900

## 🔧 Cómo Usar

### 1. Acceder al Panel
- Abrir `admin.html` en el navegador
- El panel se carga automáticamente con todos los productos

### 2. Navegar por las Secciones
- **Dashboard**: Vista general con estadísticas
- **Productos**: Lista completa con filtros y acciones
- **Agregar Producto**: Formulario para nuevos productos
- **Configuración**: Ajustes del sistema

### 3. Gestionar Productos
- **Ver detalles**: Click en el ícono de ojo 👁️
- **Editar**: Click en el ícono de editar ✏️
- **Actualizar stock**: Click en el ícono de cajas 📦
- **Filtrar**: Usar los campos de búsqueda y filtros

### 4. Exportar Datos
- Click en "Exportar CSV" para descargar todos los productos
- El archivo incluye: ID, Nombre, Categoría, Precio, Stock, Descripción

## 📈 Estadísticas Automáticas

El sistema calcula automáticamente:
- **Total de productos**: Suma de todos los productos
- **Productos disponibles**: Con stock > 0
- **Stock bajo**: Productos con 1-2 unidades
- **Productos agotados**: Con stock = 0
- **Valor del inventario**: Precio × Stock de todos los productos

## 🎨 Personalización

### Agregar Nuevos Productos
1. Editar `js/admin-products.js`
2. Agregar el producto en la categoría correspondiente
3. Incluir: id, nombre, precio, stock, imagen, descripción

### Modificar Categorías
1. Actualizar el objeto `productosDatabase`
2. Agregar nuevas categorías en los filtros de `admin.html`
3. Actualizar las estadísticas del dashboard

## 🔄 Sincronización con la Web

Los productos mostrados en el panel de administración están sincronizados con los productos reales de la web:
- `paletas.html` → Productos de paletas
- `tazas.html` → Productos de tazas  
- `snackbowls.html` → Productos de snack bowls

## 🚨 Alertas Inteligentes

El sistema identifica automáticamente:
- **Productos agotados**: Stock = 0
- **Stock bajo**: Stock entre 1-2 unidades
- **Recomendaciones**: Botones para actualizar stock rápidamente

## 📱 Responsive Design

El panel está optimizado para:
- **Desktop**: Vista completa con todas las funcionalidades
- **Tablet**: Interfaz adaptada con navegación táctil
- **Móvil**: Vista compacta con funcionalidades esenciales

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **Bootstrap 5**: Framework responsivo
- **JavaScript ES6**: Funcionalidades dinámicas
- **SweetAlert2**: Alertas elegantes
- **Font Awesome**: Iconografía profesional

## 📞 Soporte

Para cualquier consulta o modificación del panel de administración, contactar al desarrollador del sistema.

---
**Desarrollado para Lu Art** 🎨✨
