/**
 * 🎨 SISTEMA DE TEMA Y DISEÑO - Course Manager
 * 
 * Edita este archivo para cambiar la paleta de colores y estilos
 * de toda la aplicación. Los cambios se aplicarán automáticamente.
 * 
 * Estructura:
 * - colors: Paleta de colores principales
 * - typography: Tamaños y pesos de fuente
 * - spacing: Espaciados consistentes
 * - components: Estilos por tipo de componente
 */

// ═══════════════════════════════════════════════════
// 🎨 PALETA DE COLORES
// ═══════════════════════════════════════════════════
export const colors = {
  // Marca principal - Cambia aquí el color principal de la app
  brand: {
    50: 'bg-blue-50',
    100: 'bg-blue-100',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
    700: 'bg-blue-700',
    text: 'text-blue-600',
    textDark: 'text-blue-800',
    textLight: 'text-blue-100',
    border: 'border-blue-200',
    borderActive: 'border-blue-500',
    ring: 'focus:ring-blue-500',
  },
  
  // Estados semánticos
  success: {
    bg: 'bg-green-100',
    bgLight: 'bg-green-50',
    text: 'text-green-800',
    textDark: 'text-green-900',
    border: 'border-green-200',
  },
  
  danger: {
    bg: 'bg-red-100',
    bgLight: 'bg-red-50',
    text: 'text-red-600',
    textDark: 'text-red-800',
    border: 'border-red-200',
  },
  
  warning: {
    bg: 'bg-yellow-100',
    bgLight: 'bg-yellow-50',
    text: 'text-yellow-800',
    textDark: 'text-yellow-900',
    border: 'border-yellow-200',
  },
  
  // Neutros (grises)
  neutral: {
    bg: 'bg-white',
    bgSubtle: 'bg-gray-50',
    bgMuted: 'bg-gray-100',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    textSubtle: 'text-gray-500',
    textDisabled: 'text-gray-400',
    border: 'border-gray-200',
    borderHover: 'hover:border-gray-300',
  },
};

// ═══════════════════════════════════════════════════
// 📐 TIPOGRAFÍA
// ═══════════════════════════════════════════════════
export const typography = {
  pageTitle: 'text-xl md:text-2xl font-semibold text-gray-900',
  pageSubtitle: 'text-sm md:text-base text-gray-500',
  sectionTitle: 'text-sm md:text-base font-medium text-gray-900',
  cardTitle: 'font-semibold text-gray-900 text-sm md:text-base',
  label: 'block text-sm font-medium text-gray-700',
  caption: 'text-xs text-gray-500',
  body: 'text-sm md:text-base text-gray-700',
};

// ═══════════════════════════════════════════════════
// 📏 ESPACIADO
// ═══════════════════════════════════════════════════
export const spacing = {
  page: 'space-y-4 md:space-y-6',
  section: 'p-3 md:p-4',
  card: 'p-3 md:p-4',
  formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
};

// ═══════════════════════════════════════════════════
// 🧩 COMPONENTES (clases reutilizables)
// ═══════════════════════════════════════════════════
export const components = {
  // Botones
  button: {
    primary: 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors',
    danger: 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors',
    ghost: 'inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors',
    icon: 'p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors',
    iconBlue: 'p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors',
    iconRed: 'p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors',
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-lg border shadow-sm',
    interactive: 'bg-white rounded-lg border shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all',
    header: 'p-3 md:p-4 border-b bg-gray-50 rounded-t-lg',
    body: 'p-3 md:p-4',
    footer: 'p-3 md:p-4 border-t bg-gray-50 rounded-b-lg',
  },
  
  // Inputs
  input: {
    base: 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base disabled:bg-gray-50 disabled:cursor-not-allowed',
    withIcon: 'w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    error: 'w-full px-3 py-2 border-red-500 rounded-lg focus:ring-2 focus:ring-red-500',
  },
  
  // Badges
  badge: {
    base: 'inline-flex px-2 py-1 text-xs font-medium rounded-full',
    success: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
    danger: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
    warning: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
    neutral: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800',
    brand: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
  },
  
  // Tablas
  table: {
    container: 'bg-white rounded-lg border shadow-sm overflow-hidden',
    wrapper: 'overflow-x-auto',
    base: 'w-full',
    head: 'bg-gray-50 border-b',
    headCell: 'px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap',
    body: 'divide-y divide-gray-100',
    row: 'border-b hover:bg-gray-50 transition-colors',
    cell: 'px-3 md:px-4 py-3 text-sm text-gray-900',
    cellMuted: 'px-3 md:px-4 py-3 text-sm text-gray-600',
  },
  
  // Modales
  modal: {
    overlay: 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-4',
    container: 'bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    header: 'p-3 md:p-4 border-b flex items-center justify-between sticky top-0 bg-white',
    body: 'p-3 md:p-4',
    footer: 'p-3 md:p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white',
  },
  
  // Empty States
  empty: {
    container: 'flex flex-col items-center justify-center text-center p-8 md:p-12',
    icon: 'w-16 h-16 mb-4 text-gray-300',
    title: 'text-base md:text-lg font-medium text-gray-900 mb-2',
    description: 'text-sm text-gray-500 mb-6 max-w-md',
  },
};

// ═══════════════════════════════════════════════════
// 🎯 HELPERS - Combinaciones comunes
// ═══════════════════════════════════════════════════
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const theme = {
  colors,
  typography,
  spacing,
  components,
  cn,
};

export default theme;
