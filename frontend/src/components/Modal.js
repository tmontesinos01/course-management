export const Modal = ({ title, content, onClose, onConfirm, confirmText = 'Guardar', cancelText = 'Cancelar', showConfirm = true, large = false }) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  overlay.innerHTML = `
    <div class="modal ${large ? 'modal--large' : ''}">
      <div class="modal__header">
        <h3 class="modal__title">${title}</h3>
        <button class="modal__close" data-action="close">&times;</button>
      </div>
      <div class="modal__body">
        ${content}
      </div>
      <div class="modal__actions">
        <button class="btn btn--secondary" data-action="close">${cancelText}</button>
        ${showConfirm ? `<button class="btn btn--primary" data-action="confirm">${confirmText}</button>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const cleanup = () => {
    overlay.remove();
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.dataset.action === 'close') {
      cleanup();
      onClose?.();
    }
    if (e.target.dataset.action === 'confirm') {
      onConfirm?.();
    }
  });

  return { close: cleanup, overlay };
};
