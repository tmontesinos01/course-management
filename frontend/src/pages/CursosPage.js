import { cursoService } from '../api/services.js';
import { formatDate, formatCurrency, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';
import { EmptyState } from '../components/EmptyState.js';
import { components, typography, spacing } from '../styles/theme.js';

export class CursosPage {
  constructor(container) {
    this.container = container;
    this.cursos = [];
    this.loading = false;
    this.pagination = {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      from: 0,
      to: 0,
    };
    this.currentModal = null;
  }

  async render() {
    this.container.innerHTML = `
      <div class="space-y-4 md:space-y-6">
        <!-- Header responsive -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Cursos</h1>
          <button 
            onclick="window.cursosPage.openModal()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            ${icon('plus')} Nuevo Curso
          </button>
        </div>
        
        <!-- Tabla responsive con scroll horizontal en móvil -->
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div class="p-3 md:p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 class="text-sm font-medium text-gray-700">Listado de Cursos</h2>
          </div>
          <div class="overflow-x-auto" id="cursos-table-container">
            ${this.renderTable()}
          </div>
        </div>
      </div>
    `;

    // Store reference for onclick handlers
    window.cursosPage = this;
    
    this.attachEvents();
    await this.loadData();
  }

  renderTable() {
    if (this.loading) {
      return `
        <div class="p-8 text-center text-gray-500">
          <div class="animate-spin inline-block mb-2">${icon('loader')}</div>
          <p class="text-sm">Cargando cursos...</p>
        </div>
      `;
    }

    if (!this.cursos || this.cursos.length === 0) {
      return EmptyState({
        iconName: 'bookOpen',
        title: 'No hay cursos registrados',
        description: 'Comience creando su primer curso para gestionar inscripciones.',
        action: { label: 'Crear curso', iconName: 'plus', onClick: 'window.cursosPage.openModal()' },
        variant: 'info'
      });
    }

    const rows = this.cursos.map(curso => {
      const estadoClass = {
        'activo': 'bg-green-100 text-green-800',
        'inactivo': 'bg-gray-100 text-gray-800',
        'completado': 'bg-blue-100 text-blue-800',
      }[curso.estado] || 'bg-gray-100 text-gray-800';

      return `
        <tr class="border-b hover:bg-gray-50">
          <td class="px-4 py-3 text-sm text-gray-900">${curso.nombre}</td>
          <td class="px-4 py-3 text-sm text-gray-600">${curso.cupos}</td>
          <td class="px-4 py-3 text-sm text-gray-900 font-medium">${formatCurrency(curso.importe)}</td>
          <td class="px-4 py-3 text-sm text-gray-600">${formatDate(curso.fecha_desde)}</td>
          <td class="px-4 py-3 text-sm text-gray-600">${formatDate(curso.fecha_hasta)}</td>
          <td class="px-4 py-3">
            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${estadoClass}">
              ${curso.estado}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <button 
                onclick="window.cursosPage.openModal(${curso.id})"
                class="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Editar"
              >
                ${icon('edit')}
              </button>
              <button 
                onclick="window.cursosPage.deleteCurso(${curso.id})"
                class="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Eliminar"
              >
                ${icon('trash')}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <table class="w-full min-w-[700px]">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nombre</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Cupos</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Importe</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Inicio</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Fin</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Estado</th>
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
            onclick="window.cursosPage.loadData(${this.pagination.currentPage - 1})"
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
              onclick="window.cursosPage.loadData(${page})"
              ${page === this.pagination.currentPage ? 'disabled' : ''}
            >
              ${page}
            </button>
          `).join('')}
          <button 
            class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onclick="window.cursosPage.loadData(${this.pagination.currentPage + 1})"
            ${this.pagination.currentPage === this.pagination.lastPage ? 'disabled' : ''}
          >
            →
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Events are handled in render methods via onclick
  }

  async loadData(page = 1) {
    this.loading = true;
    this.updateTable();
    
    try {
      const response = await cursoService.getAll({ page, per_page: 10 });
      this.cursos = response.data || [];
      this.pagination = {
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
        from: response.meta?.from || 0,
        to: response.meta?.to || 0,
      };
    } catch (error) {
      showToast('Error al cargar cursos', 'error');
    } finally {
      this.loading = false;
      this.updateTable();
    }
  }

  updateTable() {
    const container = this.container.querySelector('#cursos-table-container');
    if (container) {
      container.innerHTML = this.renderTable();
    }
  }

  openModal(id = null) {
    const isEdit = !!id;
    const curso = isEdit ? this.cursos.find(c => c.id == id) : {};

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">${isEdit ? 'Editar Curso' : 'Nuevo Curso'}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            ${icon('x')}
          </button>
        </div>
        
        <form id="curso-form" class="p-4 space-y-4">
          <input type="hidden" name="id" value="${curso.id || ''}">
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input type="text" name="nombre" value="${curso.nombre || ''}" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Cupos <span class="text-red-500">*</span>
              </label>
              <input type="number" name="cupos" value="${curso.cupos || ''}" required min="1"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Importe <span class="text-red-500">*</span>
              </label>
              <input type="number" name="importe" value="${curso.importe || ''}" required min="0" step="0.01"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Curso</label>
              <input type="text" name="tipo_curso" value="${curso.tipo_curso || ''}"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio <span class="text-red-500">*</span>
              </label>
              <input type="date" name="fecha_desde" value="${curso.fecha_desde || ''}" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin <span class="text-red-500">*</span>
              </label>
              <input type="date" name="fecha_hasta" value="${curso.fecha_hasta || ''}" required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select name="estado" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="activo" ${curso.estado === 'activo' ? 'selected' : ''}>Activo</option>
              <option value="inactivo" ${curso.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
              <option value="completado" ${curso.estado === 'completado' ? 'selected' : ''}>Completado</option>
            </select>
          </div>
        </form>
        
        <div class="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <button onclick="this.closest('.fixed').remove()" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onclick="window.cursosPage.saveCurso()" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.currentModal = { close: () => overlay.remove() };
  }

  async saveCurso() {
    const form = document.getElementById('curso-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;

    try {
      if (id) {
        await cursoService.update(id, data);
        showToast('Curso actualizado exitosamente');
      } else {
        await cursoService.create(data);
        showToast('Curso creado exitosamente');
      }
      this.currentModal?.close();
      await this.loadData(this.pagination.currentPage);
    } catch (error) {
      showToast('Error al guardar el curso', 'error');
    }
  }

  async deleteCurso(id) {
    const confirmed = confirm('¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await cursoService.delete(id);
      showToast('Curso eliminado exitosamente');
      await this.loadData(this.pagination.currentPage);
    } catch (error) {
      showToast('Error al eliminar el curso', 'error');
    }
  }
}
