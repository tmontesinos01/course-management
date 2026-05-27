import { icon } from './Icons.js';
import { components } from '../styles/theme.js';

/**
 * Empty State - Componente para mostrar estados vacíos con CTA
 * 
 * @param {string} iconName - Nombre del ícono Lucide
 * @param {string} title - Título principal
 * @param {string} description - Descripción
 * @param {object} action - { label, onClick } para botón de acción
 * @param {string} variant - 'default' | 'warning' | 'info'
 */
export const EmptyState = ({ 
  iconName = 'info', 
  title, 
  description, 
  action,
  variant = 'default' 
}) => {
  const variantStyles = {
    default: {
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-400',
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    info: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  };

  const style = variantStyles[variant];

  return `
    <div class="${components.empty.container}">
      <div class="w-16 h-16 md:w-20 md:h-20 ${style.iconBg} ${style.iconColor} rounded-full flex items-center justify-center mb-4">
        <div class="scale-150">${icon(iconName)}</div>
      </div>
      <h3 class="${components.empty.title}">${title}</h3>
      ${description ? `<p class="${components.empty.description}">${description}</p>` : ''}
      ${action ? `
        <button onclick="${action.onClick}" class="${components.button.primary}">
          ${action.iconName ? icon(action.iconName) : ''}
          ${action.label}
        </button>
      ` : ''}
    </div>
  `;
};

export default EmptyState;
