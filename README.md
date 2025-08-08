# 🚗 Kanban Taller de Coches

Aplicación web desarrollada con **React + Vite** para la gestión de reparaciones en un taller de coches, utilizando **Firebase** como backend para autenticación y base de datos en tiempo real.

## 📸 Capturas de pantalla

### Tablero Kanban
![Tablero Kanban](/public/captura-tablero.png)

### Entregados Hoy
![Entregados Hoy](/public/captura-entregados-hoy.png)

### Dashboard de métricas
![Dashboard](/public/captura-dashboard.png)
---

## ✨ Características principales

- **Autenticación de usuarios** con Firebase Authentication.
- **Filtrado por técnico autenticado** para mostrar solo sus vehículos.
- **Gestión de estados** de los vehículos: Entrada → Diagnóstico → Reparación → Entrega.
- **Columna especial** para vehículos entregados hoy.
- **Dashboard de métricas** para analizar rendimiento y carga de trabajo.
- **Datos en tiempo real** con Firestore (`onSnapshot`).
- **UI optimizada** con Tailwind CSS.
- **Navegación entre páginas** con React Router.

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Firebase Authentication + Firestore
- **Routing**: React Router DOM
- **Estado**: Hooks personalizados (`useVehiculos`)
- **Notificaciones**: react-toastify

---

## 🚀 Instalación y uso

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/kanban-taller.git
   cd kanban-taller
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Activa Authentication (Email/Password) y Firestore Database.
   - Copia tu configuración en el archivo:
     ```
     src/firebaseConfig.js
     ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   ```

---

## 📂 Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
├── hooks/            # Hooks personalizados
├── pages/            # Páginas (Tablero, EntregadosHoy, Dashboard)
├── firebaseConfig.js # Configuración de Firebase
└── App.jsx           # Rutas principales
public/
├── captura-tablero.png
├── captura-entregados-hoy.png
└── captura-dashboard.png
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## ✍️ Autoría

Proyecto desarrollado por **Antonio Jesús Padilla**  
📅 Versión inicial: Agosto 2025  
