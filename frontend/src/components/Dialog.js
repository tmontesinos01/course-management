import { icon } from './Icons.js';

export const Dialog = ({ title, children, footer, size = 'default', onClose }) => {
  const sizeClasses = {
    default: 'max-w-lg',
    sm: 'max-w-sm',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm';
  overlay.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="${sizeClasses[size]} w-full bg-background rounded-lg border shadow-lg animate-fade-in">
        ${title ? `
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-semibold">${title}</h3>
            <button class="dialog-close rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              ${icon('x')}
            </button>
          </div>
        ` : ''}
        <div class="p-6">
          ${children}
        </div>
        ${footer ? `
          <div class="flex items-center justify-end gap-2 p-6 border-t bg-muted/50">
            ${footer}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Close handlers
  const cleanup = () => {
    overlay.remove();
    document.body.style.overflow = '';
    onClose?.();
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.dialog-close')) {
      cleanup();
    }
  });

  return { close: cleanup, overlay };
};

export const AlertDialog = ({ title, description, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel, variant = 'destructive' }) => {
  const variantClasses = {
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  };
  
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm';
  overlay.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="max-w-sm w-full bg-background rounded-lg border shadow-lg animate-fade-in">
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="${variant === 'destructive' ? 'text-destructive' : 'text-primary'}">
              ${icon(variant === 'destructive' ? 'alertCircle' : 'info')}
            </div>
            <div>
              <h3 class="text-lg font-semibold">${title}</h3>
              ${description ? `<p class="text-sm text-muted-foreground mt-2">${description}</p>` : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 p-6 border-t bg-muted/50">
          <button class="alert-cancel inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            ${cancelText}
          </button>
          <button class="alert-confirm inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variantClasses[variant]}">
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  return new Promise((resolve) => {
    overlay.querySelector('.alert-cancel').onclick = () => {
      overlay.remove();
      document.body.style.overflow = '';
      onCancel?.();
      resolve(false);
    };
    
    overlay.querySelector('.alert-confirm').onclick = () => {
      overlay.remove();
      document.body.style.overflow = '';
      onConfirm?.();
      resolve(true);
    };
  });
};

export const dialog = Dialog;
export const alertDialog = AlertDialog;
