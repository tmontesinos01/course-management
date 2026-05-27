const variants = {
  default: 'bg-primary/10 text-primary border-transparent hover:bg-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
  destructive: 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20',
  outline: 'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
  success: 'bg-green-100 text-green-800 border-transparent hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-transparent hover:bg-yellow-200',
};

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  return `
    <span class="${baseClasses} ${variants[variant]} ${className}">
      ${children}
    </span>
  `;
};

export const badge = Badge;
