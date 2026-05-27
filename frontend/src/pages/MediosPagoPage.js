import { medioPagoService } from '../api/services.js';
import { formatDate, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';

export class MediosPagoPage {
  constructor(container) {
    this.container = container;
    this.mediosPago = [];
    this.loading = false;
    this.pagination = { currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 };
  }

  async render() {
    this.container.innerHTML = `
      <div class="space-y-4 md:space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Medios de Pago</h1>
          <button onclick="window.mediosPagoPage.openModal()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            ${icon('plus')} Nuevo
          </button>
        </div>
        
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div class="p-3 md:p-4 border-b bg-gray-50" rounded-t-lg">
            <h2 class="text-sm font-medium text-gray-700">Listado de Medios de Pago</h2>
          </div>
          <div class="overflow-x-auto" id="medios-table-container">${this.renderTable()}</div>
        </div>
      </div>
    `;
    
    window.mediosPagoPage = this;
    await this.loadData();
  }

  renderTable() {
    if (this.loading) return `<div class="p-8 text-center text-gray-500">Cargando...</div>`;
    if (!this.mediosPago?.length) return `<div class="p-8 text-center text-gray-500">No hay medios de pago</div>`;

    const rows = this.mediosPago.map(m => `
      <tr class="border-b hover:bg-gray-50">
        <td class="px-4 py-3 text-sm text-gray-900 font-medium">${m.nombre}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${m.descripcion || '-'}</td>
        <td class="px-4 py-3">
          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${m.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
            ${m.activo ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button onclick="window.mediosPagoPage.openModal(${m.id})" class="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
              ${icon('edit')}
            </button>
            <button onclick="window.mediosPagoPage.deleteMedio(${m.id})" class="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
              ${icon('trash')}
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <table class="w-full min-w-[500px]">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nombre</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Descripción</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Estado</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap sticky right-0 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${this.pagination.lastPage > 1 ? this.renderPagination() : ''}
    `;
  }

  renderPagination() {
    return `
      <div class="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
        <p class="text-sm text-gray-600">Página ${this.pagination.currentPage} de ${this.pagination.lastPage}</p>
        <div class="flex gap-1">
          <button onclick="window.mediosPagoPage.loadData(${this.pagination.currentPage - 1})" 
            class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50" 
            ${this.pagination.currentPage === 1 ? 'disabled' : ''}>?</button>
          <button onclick="window.mediosPagoPage.loadData(${this.pagination.currentPage + 1})" 
            class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
            ${this.pagination.currentPage === this.pagination.lastPage ? 'disabled' : ''}>?</button>
        </div>
      </div>
    `;
  }

  async loadData(page = 1) {
    this.loading = true;
    this.updateTable();
    try {
      const res = await medioPagoService.getAll({ page, per_page: 10 });
      this.mediosPago = res.data || [];
      this.pagination = { currentPage: res.meta?.current_page || 1, lastPage: res.meta?.last_page || 1, total: res.meta?.total || 0, from: res.meta?.from || 0, to: res.meta?.to || 0 };
    } catch (e) { showToast('Error al cargar', 'error'); }
    finally { this.loading = false; this.updateTable(); }
  }

  updateTable() {
    const c = this.container.querySelector('#medios-table-container');
    if (c) c.innerHTML = this.renderTable();
  }

  openModal(id = null) {
    const isEdit = !!id;
    const m = isEdit ? this.mediosPago.find(x => x.id == id) : {};

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">${isEdit ? 'Editar' : 'Nuevo'} Medio de Pago</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">${icon('x')}</button>
        </div>
        <form id="medio-form" class="p-4 space-y-4">
          <input type="hidden" name="id" value="${m.id || ''}">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input type="text" name="nombre" value="${m.nombre || ''}" required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="2" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">${m.descripcion || ''}</textarea>
          </div>
          <div class="flex items-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="activo" ${m.activo !== false ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded">
              <span class="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>
        </form>
        <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg">Cancelar</button>
          <button onclick="window.mediosPagoPage.saveMedio()" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full sm:w-auto">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  async saveMedio() {
    const form = document.getElementById('medio-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    data.activo = form.querySelector('[name="activo"]').checked;
    const id = data.id;
    delete data.id;
    try {
      if (id) await medioPagoService.update(id, data);
      else await medioPagoService.create(data);
      showToast(id ? 'Actualizado' : 'Creado');
      document.querySelector('.fixed.inset-0')?.remove();
      await this.loadData(this.pagination.currentPage);
    } catch (e) { showToast('Error al guardar', 'error'); }
  }

  async deleteMedio(id) {
    if (!confirm('¿Eliminar este medio de pago?')) return;
    try {
      await medioPagoService.delete(id);
      showToast('Eliminado');
      await this.loadData(this.pagination.currentPage);
    } catch (e) { showToast('Error al eliminar', 'error'); }
  }
}

