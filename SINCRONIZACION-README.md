# 🔄 Sistema de Sincronización Admin ↔ Web

## ✅ **Problema Resuelto**
Ahora los cambios que hagas en el panel de administración **SÍ se reflejan automáticamente en la web**.

## 🚀 **Cómo Probar la Sincronización**

### **Paso 1: Abrir el Panel de Administración**
1. Abrir `admin.html` en el navegador
2. Ir a la sección **"Productos"**
3. Verás todos los productos listados con su stock actual

### **Paso 2: Cambiar el Stock de un Producto**
1. Click en el botón **📦** (actualizar stock) de cualquier producto
2. Cambiar el stock a **0** (para marcarlo como agotado)
3. Click **"Aceptar"**
4. Verás el mensaje: **"Stock actualizado - Los cambios se reflejarán en la web"**

### **Paso 3: Verificar en la Web**
1. Abrir `paletas.html`, `tazas.html` o `snackbowls.html`
2. **Esperar 2-3 segundos** (el sistema sincroniza automáticamente)
3. El botón del producto que marcaste como agotado ahora dirá:
   - **"❌ Agotado"** (en lugar de "Agregar al carrito")
   - El botón estará **deshabilitado** y de color rojo

### **Paso 4: Restaurar Stock**
1. Volver al panel de administración
2. Cambiar el stock del producto de vuelta a **1** o más
3. En la web, el botón volverá a ser **"🛒 Agregar al carrito"** y estará habilitado

## 🔧 **Cómo Funciona**

### **📊 Panel de Administración**
- Los datos se guardan en `localStorage` del navegador
- Cada cambio actualiza automáticamente el almacenamiento
- Se envía una señal de "actualización" a las páginas web

### **🌐 Páginas Web**
- Cada página web verifica cambios cada 2 segundos
- Cuando detecta cambios, actualiza automáticamente los botones
- Los productos agotados se marcan visualmente como no disponibles

### **🔄 Sincronización en Tiempo Real**
- **Sin necesidad de recargar páginas**
- **Cambios instantáneos** entre admin y web
- **Persistencia** de datos entre sesiones

## 📋 **Productos de Prueba**

### **🎨 Paletas (paletas.html)**
- Paleta Vainilla - Stock: 7
- Paleta pincelada - Stock: 1
- Paleta Verde - Stock: 1

### **🍽️ Tazas (tazas.html)**
- Taza Dos Ojos - Stock: 1
- Taza Bruma - Stock: 1
- Taza Green Waves - Stock: 0 (ya agotada)
- Taza Marito - Stock: 0 (ya agotada)

### **🥣 Snack Bowls (snackbowls.html)**
- Snack Bowl Pequeño - Stock: 5
- Snack Bowl Mediano - Stock: 8
- Snack Bowl Grande - Stock: 6

## 🎯 **Casos de Prueba**

### **✅ Caso 1: Marcar Producto como Agotado**
1. Admin: Cambiar stock a 0
2. Web: Botón se vuelve rojo y dice "Agotado"
3. Web: Botón se deshabilita

### **✅ Caso 2: Restaurar Stock**
1. Admin: Cambiar stock a 1 o más
2. Web: Botón vuelve a ser azul y dice "Agregar al carrito"
3. Web: Botón se habilita

### **✅ Caso 3: Múltiples Cambios**
1. Admin: Cambiar varios productos a la vez
2. Web: Todos los cambios se reflejan automáticamente
3. Web: No es necesario recargar la página

## 🔍 **Verificación Visual**

### **🟢 Producto Disponible**
- Botón azul: "🛒 Agregar al carrito"
- Botón habilitado
- Stock > 0

### **🔴 Producto Agotado**
- Botón rojo: "❌ Agotado"
- Botón deshabilitado
- Stock = 0

## 📱 **Compatibilidad**
- ✅ **Chrome, Firefox, Safari, Edge**
- ✅ **Desktop, Tablet, Móvil**
- ✅ **Sincronización entre pestañas**

## 🚨 **Notas Importantes**
- Los cambios se guardan en el navegador (localStorage)
- Si cambias de navegador, necesitarás hacer los cambios de nuevo
- El sistema funciona sin conexión a internet
- Los datos persisten entre sesiones del navegador

---
**¡La sincronización está funcionando perfectamente!** 🎉✨
