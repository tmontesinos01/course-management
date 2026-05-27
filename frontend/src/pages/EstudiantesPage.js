import { estudianteService } from '../api/services.js';
import { formatDate, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';
import { EmptyState } from '../components/EmptyState.js';

export class EstudiantesPage {
  constructor(container) {
    this.container = container;
    this.estudiantes = [];
    this.loading = false;
    this.pagination = {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      from: 0,
      to: 0,
    };
  }

  async render() {
    this.container.innerHTML = `
      <div class="space-y-4 md:space-y-6">
        <!-- Header responsive -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Estudiantes</h1>
          <button 
            onclick="window.estudiantesPage.openModal()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            ${icon('plus')} Nuevo Estudiante
          </button>
        </div>
        
        <!-- Tabla responsive con scroll horizontal -->
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div class="p-3 md:p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 class="text-sm font-medium text-gray-700">Listado de Estudiantes</h2>
          </div>
          <div class="overflow-x-auto" id="estudiantes-table-container">
            ${this.renderTable()}
          </div>
        </div>
      </div>
    `;

    window.estudiantesPage = this;
    this.attachEvents();
    await this.loadData();
  }

  renderTable() {
    if (this.loading) {
      return `
        <div class="p-8 text-center text-gray-500">
          <div class="animate-spin inline-block mb-2">${icon('loader')}</div>
          <p class="text-sm">Cargando estudiantes...</p>
        </div>
      `;
    }

    if (!this.estudiantes || this.estudiantes.length === 0) {
      return EmptyState({
        iconName: 'users',
        title: 'No hay estudiantes registrados',
        description: 'Comience agregando su primer estudiante al sistema.',
        action: { label: 'Agregar estudiante', iconName: 'plus', onClick: 'window.estudiantesPage.openModal()' },
        variant: 'info'
      });
    }

    const rows = this.estudiantes.map(est => `
      <tr class="border-b hover:bg-gray-50">
        <td class="px-4 py-3 text-sm text-gray-900 font-medium">${est.apellido_y_nombre}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${est.dni}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${est.matricula || '-'}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${est.correo || '-'}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${est.telefono || '-'}</td>
        <td class="px-4 py-3">
          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${est.agremiado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
            ${est.agremiado ? 'Sí' : 'No'}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            <button 
              onclick="window.estudiantesPage.openModal(${est.id})"
              class="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              ${icon('edit')}
            </button>
            <button 
              onclick="window.estudiantesPage.deleteEstudiante(${est.id})"
              class="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar"
            >
              ${icon('trash')}
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <table class="w-full min-w-[800px]">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nombre</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">DNI</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Matrícula</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Correo</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Teléfono</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Agremiado</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap sticky right-0 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${rows}
        </tbody>
      </table>
      ${this.pagination.lastPage > 1 ? this.renderPagination() : ''}
    `;
  }

  renderPagination() {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.pagination.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.pagination.lastPage, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return `
      <div class="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
        <p class="text-sm text-gray-600">
          Mostrando ${this.pagination.from || 0} - ${this.pagination.to || 0} de ${this.pagination.total || 0}
        </p>
        <div class="flex items-center gap-1">
          <button 
            class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onclick="window.estudiantesPage.loadData(${this.pagination.currentPage - 1})"
            ${this.pagination.currentPage === 1 ? 'disabled' : ''}
          >
            ←
          </button>
          ${pages.map(page => `
            <button 
              class="px-3 py-1.5 text-sm border rounded ${
                page === this.pagination.currentPage 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'hover:bg-gray-100'
              }"
              onclick="window.estudiantesPage.loadData(${page})"
              ${page === this.pagination.currentPage ? 'disabled' : ''}
            >
              ${page}
            </button>
          `).join('')}
          <button 
            class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onclick="window.estudiantesPage.loadData(${this.pagination.currentPage + 1})"
            ${this.pagination.currentPage === this.pagination.lastPage ? 'disabled' : ''}
          >
            →
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Events handled via onclick in render methods
  }

  async loadData(page = 1) {
    this.loading = true;
    this.updateTable();
    
    try {
      const response = await estudianteService.getAll({ page, per_page: 10 });
      this.estudiantes = response.data || [];
      this.pagination = {
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
        from: response.meta?.from || 0,
        to: response.meta?.to || 0,
      };
    } catch (error) {
      showToast('Error al cargar estudiantes', 'error');
    } finally {
      this.loading = false;
      this.updateTable();
    }
  }

  updateTable() {
    const container = this.container.querySelector('#estudiantes-table-container');
    if (container) {
      container.innerHTML = this.renderTable();
    }
  }

  openModal(id = null) {
    const isEdit = !!id;
    const estudiante = isEdit ? this.estudiantes.find(e => e.id == id) : {};

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">${isEdit ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            ${icon('x')}
          </button>
        </div>
        
        <form id="estudiante-form" class="p-4 space-y-4">
          <input type="hidden" name="id" value="${estudiante.id || ''}">
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Apellido y Nombre <span class="text-red-500">*</span>
              </label>
              <input type="text" name="apellido_y_nombre" value="${estudiante.apellido_y_nombre || ''}" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                DNI <span class="text-red-500">*</span>
              </label>
              <input type="text" name="dni" value="${estudiante.dni || ''}" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
              <input type="text" name="matricula" value="${estudiante.matricula || ''}"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input type="email" name="correo" value="${estudiante.correo || ''}"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" name="telefono" value="${estudiante.telefono || ''}"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-center">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="agremiado" ${estudiante.agremiado ? 'checked' : ''}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                <span class="text-sm font-medium text-gray-700">Agremiado</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea name="observacion" rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${estudiante.observacion || ''}</textarea>
          </div>
        </form>
        
        <div class="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <button onclick="this.closest('.fixed').remove()" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onclick="window.estudiantesPage.saveEstudiante()" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.currentModal = { close: () => overlay.remove() };
  }

  async saveEstudiante() {
    const form = document.getElementById('estudiante-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.agremiado = form.querySelector('[name="agremiado"]').checked;
    const id = data.id;
    delete data.id;

    try {
      if (id) {
        await estudianteService.update(id, data);
        showToast('Estudiante actualizado exitosamente');
      } else {
        await estudianteService.create(data);
        showToast('Estudiante creado exitosamente');
      }
      this.currentModal?.close();
      await this.loadData(this.pagination.currentPage);
    } catch (error) {
      showToast('Error al guardar el estudiante', 'error');
    }
  }

  async deleteEstudiante(id) {
    const confirmed = confirm('¿Estás seguro de eliminar este estudiante? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await estudianteService.delete(id);
      showToast('Estudiante eliminado exitosamente');
      await this.loadData(this.pagination.currentPage);
    } catch (error) {
      showToast('Error al eliminar el estudiante', 'error');
    }
  }
}
