import { inscripcionService, cursoService, estudianteService } from '../api/services.js';
import { formatDate, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';

export class InscripcionesPage {
  constructor(container) {
    this.container = container;
    this.inscripciones = [];
    this.cursos = [];
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Inscripciones</h1>
          <button onclick="window.inscripcionesPage.openModal()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            ${icon('plus')} Nueva Inscripción
          </button>
        </div>
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div class="p-3 md:p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 class="text-sm font-medium text-gray-700">Listado</h2>
          </div>
          <div class="overflow-x-auto" id="inscripciones-table-container">${this.renderTable()}</div>
        </div>
      </div>
    `;
    window.inscripcionesPage = this;
    await Promise.all([this.loadData(), this.loadCursos(), this.loadEstudiantes()]);
  }

  renderTable() {
    if (this.loading) return `<div class="p-8 text-center text-gray-500">Cargando...</div>`;
    if (!this.inscripciones?.length) return `<div class="p-8 text-center text-gray-500">No hay inscripciones registradas</div>`;

    const rows = this.inscripciones.map(i => `
      <tr class="border-b hover:bg-gray-50">
        <td class="px-4 py-3 text-sm text-gray-900">${i.curso?.nombre || '-'}</td>
        <td class="px-4 py-3 text-sm text-gray-900">${i.participante?.apellido_y_nombre || '-'}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${formatDate(i.fecha_alta)}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button onclick="window.inscripcionesPage.viewDetail(${i.id})" class="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">${icon('eye')}</button>
            <button onclick="window.inscripcionesPage.deleteInscripcion(${i.id})" class="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">${icon('trash')}</button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <table class="w-full min-w-[600px]">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Curso</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Participante</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Fecha</th>
            <th class="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap sticky right-0 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">${rows}</tbody>
      </table>
      ${this.pagination.lastPage > 1 ? this.renderPagination() : ''}
    `;
  }

  renderPagination() {
    return `
      <div class="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
        <p class="text-sm text-gray-600">Página ${this.pagination.currentPage} de ${this.pagination.lastPage}</p>
        <div class="flex gap-1">
          <button onclick="window.inscripcionesPage.loadData(${this.pagination.currentPage - 1})" class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50" ${this.pagination.currentPage === 1 ? 'disabled' : ''}>←</button>
          <button onclick="window.inscripcionesPage.loadData(${this.pagination.currentPage + 1})" class="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50" ${this.pagination.currentPage === this.pagination.lastPage ? 'disabled' : ''}>→</button>
        </div>
      </div>
    `;
  }

  attachEvents() {}

  async loadData(page = 1) {
    this.loading = true;
    this.updateTable();
    
    try {
      const response = await inscripcionService.getAll({ page, per_page: 10 });
      this.inscripciones = response.data || [];
      this.pagination = {
        currentPage: response.meta?.current_page || 1,
        lastPage: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
        from: response.meta?.from || 0,
        to: response.meta?.to || 0,
      };
    } catch (error) {
      showToast('Error al cargar inscripciones', 'error');
    } finally {
      this.loading = false;
      this.updateTable();
    }
  }

  async loadCursos() {
    try {
      const response = await cursoService.getAll({ per_page: 100 });
      this.cursos = response.data || [];
    } catch (error) {
      console.error('Error loading cursos:', error);
    }
  }

  async loadEstudiantes() {
    try {
      const response = await estudianteService.getAll({ per_page: 100 });
      this.estudiantes = response.data || [];
    } catch (error) {
      console.error('Error loading estudiantes:', error);
    }
  }

  updateTable() {
    const container = this.container.querySelector('#inscripciones-table-container');
    if (container) container.innerHTML = this.renderTable();
  }

  viewDetail(id) {
    const i = this.inscripciones.find(x => x.id == id);
    if (!i) return;
    alert(`Curso: ${i.curso?.nombre}\nParticipante: ${i.participante?.apellido_y_nombre}\nDNI: ${i.participante?.dni}\nFecha: ${formatDate(i.fecha_alta)}`);
  }

  openModal() {
    const cursosOptions = this.cursos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const estudiantesOptions = this.estudiantes.map(e => `<option value="${e.id}">${e.apellido_y_nombre}</option>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">Nueva Inscripción</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">${icon('x')}</button>
        </div>
        <form id="inscripcion-form" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
            <select name="id_curso" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccione...</option>
              ${cursosOptions}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Participante *</label>
            <select name="id_participante" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccione...</option>
              ${estudiantesOptions}
            </select>
          </div>
        </form>
        <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg">Cancelar</button>
          <button onclick="window.inscripcionesPage.saveInscripcion()" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  async saveInscripcion() {
    const form = document.getElementById('inscripcion-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    try {
      await inscripcionService.create(data);
      showToast('Inscripción creada');
      document.querySelector('.fixed.inset-0')?.remove();
      await this.loadData(this.pagination.currentPage);
    } catch (e) { showToast('Error al crear', 'error'); }
  }

  async deleteInscripcion(id) {
    if (!confirm('¿Eliminar esta inscripción?')) return;
    try {
      await inscripcionService.delete(id);
      showToast('Inscripción eliminada');
      await this.loadData(this.pagination.currentPage);
    } catch (e) { showToast('Error al eliminar', 'error'); }
  }
}
