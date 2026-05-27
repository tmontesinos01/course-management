import { icon } from './Icons.js';

export const DataTable = ({ 
  headers = [], 
  rows = [], 
  loading = false, 
  emptyMessage = 'No hay datos disponibles',
  keyExtractor = (row, index) => index,
}) => {
  if (loading) {
    return `
      <div class="flex items-center justify-center p-8">
        ${icon('loader')}
        <span class="ml-2 text-muted-foreground">Cargando...</span>
      </div>
    `;
  }

  if (!rows || rows.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <div class="text-muted-foreground mb-2">
          ${icon('info')}
        </div>
        <p class="text-muted-foreground">${emptyMessage}</p>
      </div>
    `;
  }

  const headerHtml = headers.map(h => `
    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
      ${h.label}
    </th>
  `).join('');
  
  const rowsHtml = rows.map((row, index) => {
    const key = keyExtractor(row, index);
    const cells = headers.map(h => {
      const value = h.render ? h.render(row[h.key], row) : row[h.key] || '-';
      return `<td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">${value}</td>`;
    }).join('');
    
    return `<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-key="${key}">${cells}</tr>`;
  }).join('');

  return `
    <div class="w-full overflow-auto">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:border-b">
          <tr class="border-b transition-colors hover:bg-muted/50">
            ${headerHtml}
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
};

export const TableActions = ({ actions = [] }) => {
  return `
    <div class="flex items-center gap-2">
      ${actions.map(action => `
        <button 
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${action.variant === 'destructive' ? 'text-destructive hover:bg-destructive/10' : 'hover:bg-accent hover:text-accent-foreground'} h-8 w-8 p-0"
          data-action="${action.key}"
          title="${action.label}"
        >
          ${icon(action.icon)}
        </button>
      `).join('')}
    </div>
  `;
};

export const dataTable = DataTable;
export const tableActions = TableActions;
