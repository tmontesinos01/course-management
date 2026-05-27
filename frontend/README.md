# Course Manager - Frontend

Frontend moderno para el sistema de gestión de cursos, estudiantes e inscripciones.

## Características

- ⚡ **Vite** - Build tool ultrarrápido
- 🎨 **CSS Moderno** - Variables CSS, Flexbox, Grid
- 📦 **Módulos ES6** - Arquitectura modular
- 🔄 **Axios** - Cliente HTTP
- 📱 **Responsive** - Diseño adaptable
- 🛣️ **Router** - Navegación SPA sin framework

## Estructura del Proyecto

```
src/
├── api/
│   ├── client.js      # Cliente Axios configurado
│   └── services.js    # Servicios para cada recurso API
├── components/
│   ├── DataTable.js   # Componente de tabla reutilizable
│   ├── Modal.js       # Componente de modal
│   └── Pagination.js  # Componente de paginación
├── pages/
│   ├── DashboardPage.js      # Página de inicio
│   ├── CursosPage.js         # CRUD de Cursos
│   ├── EstudiantesPage.js    # CRUD de Estudiantes
│   ├── InscripcionesPage.js  # CRUD de Inscripciones
│   └── MediosPagoPage.js     # CRUD de Medios de Pago
├── styles/
│   ├── variables.css   # Variables CSS (colores, sombras, etc.)
│   ├── base.css        # Estilos base y layout
│   ├── components.css  # Estilos de componentes
│   └── dashboard.css   # Estilos específicos del dashboard
├── utils/
│   └── helpers.js      # Funciones utilitarias
└── main.js             # Punto de entrada
```

## Buenas Prácticas Aplicadas

### 1. Arquitectura Modular
- Separación de concerns: API, UI, páginas
- Módulos ES6 con imports/exports
- Componentes reutilizables

### 2. API Client
- Cliente Axios centralizado
- Interceptores para manejo de errores
- Servicios específicos por recurso

### 3. Componentes Reutilizables
- `DataTable`: Tabla con soporte para paginación y acciones
- `Modal`: Modal genérico con confirmación
- `Pagination`: Componente de paginación

### 4. Gestión de Estado
- Cada página maneja su propio estado
- Loading states
- Manejo de errores con toast notifications

### 5. UI/UX
- Diseño moderno con CSS variables
- Feedback visual (loading, toasts, confirmaciones)
- Responsive design
- Accesibilidad básica

## Instalación

```bash
npm install
```

## Configuración

Copiar `.env.example` a `.env` y configurar la URL de la API:

```bash
cp .env.example .env
```

Editar `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

## Desarrollo

```bash
npm run dev
```

## Build para Producción

```bash
npm run build
```

## Funcionalidades

### Dashboard
- Estadísticas de cursos, estudiantes e inscripciones
- Navegación a las diferentes secciones

### Cursos
- Listado paginado
- Crear, editar y eliminar cursos
- Campos: nombre, cupos, importe, fechas, estado, tipo

### Estudiantes
- Listado paginado
- Crear, editar y eliminar estudiantes
- Campos: nombre, DNI, matrícula, correo, teléfono, agremiado

### Inscripciones
- Listado paginado
- Crear inscripciones (relaciona cursos y estudiantes)
- Ver detalle de inscripción
- Eliminar inscripciones

### Medios de Pago
- Listado paginado
- Crear, editar y eliminar medios de pago
- Campos: nombre, descripción, estado activo/inactivo
