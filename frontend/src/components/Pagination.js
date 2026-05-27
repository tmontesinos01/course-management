export const Pagination = ({ currentPage, lastPage, total, from, to, onPageChange }) => {
  if (lastPage <= 1) return '';

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(lastPage, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const pageButtons = pages.map(page => `
    <button 
      class="pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}"
      data-page="${page}"
      ${page === currentPage ? 'disabled' : ''}
    >${page}</button>
  `).join('');

  return `
    <div class="pagination">
      <div class="pagination__info">
        Mostrando ${from || 0} - ${to || 0} de ${total || 0} registros
      </div>
      <div class="pagination__actions">
        <button class="pagination__btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>←</button>
        ${pageButtons}
        <button class="pagination__btn" data-page="next" ${currentPage === lastPage ? 'disabled' : ''}>→</button>
      </div>
    </div>
  `;
};

export const attachPaginationEvents = (container, callback) => {
  container.addEventListener('click', (e) => {
    if (e.target.matches('[data-page]')) {
      const page = e.target.dataset.page;
      callback(page);
    }
  });
};
