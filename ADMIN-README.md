# Panel de Administración - Lu Art

## Descripción
Sistema completo de administración para gestionar productos de Lu Art sin depender del desarrollador.

## Características

### 🔐 Autenticación
- **Usuario**: `admin`
- **Contraseña**: `luart2024`
- Sesión persistente con localStorage
- Redirección automática si no está autenticado

### 📊 Dashboard
- Estadísticas en tiempo real:
  - Total de productos
  - Productos disponibles
  - Productos con stock bajo
  - Productos agotados
- Resumen de inventario por categorías
- Gráfico de estado del stock

### 🛍️ Gestión de Productos
- **Ver todos los productos** con información completa
- **Filtros avanzados**:
  - Búsqueda por nombre
  - Filtro por categoría (Tazas, Paletas, Snack Bowls)
  - Filtro por estado de stock
- **Edición rápida de stock** directamente desde la lista
- **Edición completa** de productos con modal
- **Eliminación** de productos con confirmación

### ➕ Agregar Productos
- Formulario completo para nuevos productos:
  - Nombre del producto
  - Categoría
  - Precio en colones
  - Stock inicial
  - **Carga de imagen desde computadora** (JPG, PNG, GIF - máx. 5MB)
  - URL de imagen alternativa
  - Descripción
- Validación de campos obligatorios
- Previsualización de imagen antes de guardar
- Integración automática con el sitio web

### ⚙️ Configuración
- Información de la empresa
- Exportar productos a JSON
- Crear respaldos de datos
- Limpiar todos los datos (con confirmación)

## Acceso

### Desde el sitio web:
1. Ir a cualquier página del sitio
2. Hacer scroll hasta el footer
3. Hacer clic en el enlace "Admin" (icono de engranaje)
4. Ingresar credenciales

### Acceso directo:
- URL: `admin-login.html`

## Funcionalidades Técnicas

### 🔄 Sincronización Automática
- Los cambios se guardan automáticamente en localStorage
- Las páginas públicas leen los datos actualizados
- No requiere recarga de página para ver cambios

### 💾 Persistencia de Datos
- Datos guardados en localStorage del navegador
- Respaldo automático al exportar
- Restauración desde archivos JSON

### 🎨 Diseño Responsivo
- Interfaz adaptada a móviles y desktop
- Estilos consistentes con el sitio principal
- Animaciones y transiciones suaves
- **Carga de imágenes con drag & drop visual**
- Previsualización instantánea de imágenes

## Estructura de Archivos

```
luArt/
├── admin-login.html          # Página de login
├── admin.html               # Panel principal
├── js/
│   └── admin.js            # Lógica del panel
└── [páginas públicas con enlaces al admin]
```

## Datos de Productos

### Estructura JSON:
```json
{
  "id": 1,
  "name": "Taza Tierra",
  "category": "tazas",
  "price": 13000,
  "stock": 5,
  "image": "assets/img/Lu Art Photos/IMG_0920.jpg",
  "description": "Taza artesanal con diseño de tierra"
}
```

### Categorías Disponibles:
- `tazas` - Tazas artesanales
- `paletas` - Paletas artesanales  
- `snackbowls` - Snack bowls artesanales

## Seguridad

### ⚠️ Consideraciones:
- Las credenciales están en el código (para desarrollo)
- En producción, implementar autenticación del servidor
- Los datos se almacenan localmente (no en servidor)

### 🔒 Recomendaciones:
- Cambiar credenciales por defecto
- Implementar HTTPS en producción
- Considerar base de datos externa para datos críticos

## Uso Diario

### Gestión de Stock:
1. Ir a la sección "Productos"
2. Buscar el producto por nombre o categoría
3. Cambiar el stock directamente en el campo numérico
4. Los cambios se aplican inmediatamente

### Agregar Productos:
1. Ir a "Agregar Producto"
2. Completar todos los campos obligatorios
3. Hacer clic en "Guardar Producto"
4. El producto aparece automáticamente en el sitio

### Monitoreo:
1. Revisar el Dashboard regularmente
2. Prestar atención a productos con stock bajo
3. Exportar respaldos periódicamente

## Soporte

Para problemas o mejoras, contactar al desarrollador o revisar la documentación técnica.

---
**Lu Art** - Panel de Administración v1.0
