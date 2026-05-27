export const DataTable = ({ headers, rows, actions, loading, emptyMessage }) => {
  if (loading) {
    return `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  if (!rows || rows.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">📭</div>
        <div class="empty-state__title">Sin datos</div>
        <div class="empty-state__description">${emptyMessage || 'No hay registros para mostrar'}</div>
      </div>
    `;
  }

  const headerHtml = headers.map(h => `<th>${h.label}</th>`).join('') + (actions ? '<th>Acciones</th>' : '');
  
  const rowsHtml = rows.map((row, index) => {
    const cells = headers.map(h => {
      const value = h.render ? h.render(row[h.key], row) : row[h.key] || '-';
      return `<td>${value}</td>`;
    }).join('');
    
    const actionsHtml = actions ? `
      <td>
        <div class="table__actions">
          ${actions(row, index)}
        </div>
      </td>
    ` : '';
    
    return `<tr>${cells}${actionsHtml}</tr>`;
  }).join('');

  return `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
};
