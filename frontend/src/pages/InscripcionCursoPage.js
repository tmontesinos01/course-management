import { cursoService, estudianteService, inscripcionService } from '../api/services.js';
import { formatCurrency, formatDate, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';
import { EmptyState } from '../components/EmptyState.js';
import { components, typography, spacing } from '../styles/theme.js';

export class InscripcionCursoPage {
  constructor(container) {
    this.container = container;
    this.cursos = [];
    this.selectedCurso = null;
    this.loading = false;
  }

  async render() {
    const cursoPreseleccionado = localStorage.getItem('cursoPreseleccionado');
    if (cursoPreseleccionado && !this.selectedCurso) {
      await this.loadCurso(cursoPreseleccionado);
      localStorage.removeItem('cursoPreseleccionado');
    }

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto ${spacing.page}">
        <!-- Header -->
        <div class="border-b pb-4">
          <h1 class="${typography.pageTitle}">Inscripción a Curso</h1>
          <p class="${typography.pageSubtitle} mt-1">${this.selectedCurso ? 'Complete sus datos para inscribirse' : 'Seleccione un curso para comenzar'}</p>
        </div>

        ${this.selectedCurso ? this.renderCursoSeleccionado() : this.renderSeleccionCurso()}

        ${this.selectedCurso ? this.renderFormulario() : ''}
      </div>
    `;

    window.inscripcionPage = this;
    if (!this.selectedCurso) {
      await this.loadCursos();
      this.attachEventsSeleccion();
    }
  }

  renderCursoSeleccionado() {
    const precio = this.selectedCurso.importe_agremiado || this.selectedCurso.importe;
    const tieneAgremiado = this.selectedCurso.importe_agremiado && this.selectedCurso.importe_agremiado !== this.selectedCurso.importe;
    const sinCupos = this.selectedCurso.cupos === 0;
    
    return `
      <div class="bg-blue-50 rounded-lg border border-blue-200 p-3 md:p-4">
        <div class="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div class="flex-1">
            <h2 class="text-base md:text-lg font-semibold text-blue-900">${this.selectedCurso.nombre}</h2>
            <p class="text-sm text-blue-700 mt-1">${this.selectedCurso.tipo_curso || 'Curso'}</p>
            <div class="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs md:text-sm text-blue-600">
              <span class="flex items-center gap-1">${icon('calendar')} ${formatDate(this.selectedCurso.fecha_desde)}</span>
              <span class="flex items-center gap-1">${icon('users')} ${this.selectedCurso.cupos} cupos</span>
            </div>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-lg md:text-xl font-bold text-blue-700">${formatCurrency(precio)}</p>
            ${tieneAgremiado ? `<p class="text-xs text-blue-500 line-through">${formatCurrency(this.selectedCurso.importe)}</p>` : ''}
          </div>
        </div>
        <button onclick="window.inscripcionPage.cambiarCurso()" class="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
          ${icon('arrowLeft')} Cambiar curso
        </button>
      </div>
    `;
  }

  renderSeleccionCurso() {
    return `
      <div class="${components.card.base}">
        <div class="${components.card.header}">
          <h2 class="${typography.sectionTitle}">Seleccione un Curso</h2>
        </div>
        <div class="${components.card.body}">
          <div class="relative mb-4">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ${icon('search')}
            </div>
            <input type="text" id="buscar-curso" placeholder="Buscar curso..."
              class="${components.input.withIcon}">
          </div>
          <div id="cursos-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="col-span-full p-8 text-center text-gray-500">
              <div class="animate-spin inline-block mb-2">${icon('loader')}</div>
              <p class="text-sm">Cargando cursos...</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderFormulario() {
    return `
      <div class="${components.card.base}">
        <div class="${components.card.header}">
          <h2 class="${typography.sectionTitle}">Datos del Estudiante</h2>
        </div>
        <div class="${components.card.body}">
          <form id="inscripcion-form" class="${spacing.formGrid}">
            <div>
              <label class="${typography.label} mb-1">Apellido y Nombre *</label>
              <input type="text" name="apellido_y_nombre" required class="${components.input.base}">
            </div>
            <div>
              <label class="${typography.label} mb-1">DNI *</label>
              <input type="text" name="dni" required class="${components.input.base}">
            </div>
            <div>
              <label class="${typography.label} mb-1">Correo *</label>
              <input type="email" name="correo" required class="${components.input.base}">
            </div>
            <div>
              <label class="${typography.label} mb-1">Teléfono</label>
              <input type="text" name="telefono" class="${components.input.base}">
            </div>
            <div>
              <label class="${typography.label} mb-1">Matrícula (si es agremiado)</label>
              <input type="text" name="matricula" class="${components.input.base}">
            </div>
            <div class="flex items-center">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="agremiado" class="w-4 h-4 text-blue-600 rounded">
                <span class="text-sm font-medium text-gray-700">Soy agremiado</span>
              </label>
            </div>
          </form>
          <button onclick="window.inscripcionPage.confirmarInscripcion()" 
            class="mt-4 w-full py-3 ${components.button.primary} justify-center">
            ${icon('check')} Completar Inscripción
          </button>
        </div>
      </div>
    `;
  }

  async loadCurso(id) {
    try {
      const res = await cursoService.getById(id);
      this.selectedCurso = res.data || res;
    } catch (e) { showToast('Error al cargar el curso', 'error'); }
  }

  async loadCursos() {
    try {
      this.cursos = (await cursoService.getAll({ per_page: 100 })).data || [];
      this.renderGrid();
    } catch (e) {
      const grid = this.container.querySelector('#cursos-grid');
      if (grid) {
        grid.innerHTML = `<div class="col-span-full">${EmptyState({
          iconName: 'alertCircle',
          title: 'Error al cargar cursos',
          description: 'No pudimos conectar con el servidor.',
          action: { label: 'Reintentar', onClick: 'window.inscripcionPage.loadCursos()' },
          variant: 'danger'
        })}</div>`;
      }
    }
  }

  renderGrid(filter = '') {
    const grid = this.container.querySelector('#cursos-grid');
    if (!grid) return;
    
    const filtered = filter ? this.cursos.filter(c => c.nombre.toLowerCase().includes(filter.toLowerCase())) : this.cursos;
    const conCupos = filtered.filter(c => c.cupos > 0);
    
    if (!this.cursos.length) {
      grid.innerHTML = `<div class="col-span-full">${EmptyState({
        iconName: 'bookOpen',
        title: 'No hay cursos disponibles',
        description: 'Aún no se han publicado cursos.',
        variant: 'info'
      })}</div>`;
      return;
    }
    
    if (!filtered.length) {
      grid.innerHTML = `<div class="col-span-full">${EmptyState({
        iconName: 'search',
        title: 'Sin resultados',
        description: 'No se encontraron cursos con su búsqueda.',
        variant: 'default'
      })}</div>`;
      return;
    }

    if (!conCupos.length) {
      grid.innerHTML = `<div class="col-span-full">${EmptyState({
        iconName: 'alertCircle',
        title: 'No hay cupos disponibles',
        description: 'Los cursos disponibles no tienen cupos en este momento. Vuelva pronto.',
        variant: 'warning'
      })}</div>`;
      return;
    }

    grid.innerHTML = filtered.map(c => {
      const precio = c.importe_agremiado || c.importe;
      const sinCupos = c.cupos === 0;
      
      return `
        <div onclick="${sinCupos ? '' : `window.inscripcionPage.selectCurso(${c.id})`}" 
          class="p-3 md:p-4 border rounded-lg ${sinCupos ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-md cursor-pointer'} transition-all">
          <h3 class="${typography.cardTitle}">${c.nombre}</h3>
          <p class="text-xs md:text-sm text-gray-500 mt-1">${c.tipo_curso || 'Curso'}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs ${sinCupos ? 'text-red-600 font-medium' : 'text-gray-500'}">
              ${sinCupos ? 'Sin cupos' : `${c.cupos} cupos`}
            </span>
            <span class="font-semibold text-blue-600 text-sm md:text-base">${formatCurrency(precio)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectCurso(id) {
    this.selectedCurso = this.cursos.find(c => c.id === id);
    this.render();
  }

  cambiarCurso() {
    this.selectedCurso = null;
    this.render();
  }

  async confirmarInscripcion() {
    const form = document.getElementById('inscripcion-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    
    const formData = new FormData(form);
    const estudianteData = Object.fromEntries(formData);
    estudianteData.agremiado = form.querySelector('[name="agremiado"]').checked;

    try {
      const estudianteRes = await estudianteService.create(estudianteData);
      const idEstudiante = estudianteRes.data?.id || estudianteRes.id;

      await inscripcionService.create({
        id_curso: this.selectedCurso.id,
        id_participante: idEstudiante
      });

      showToast('Inscripción completada exitosamente');
      this.selectedCurso = null;
      setTimeout(() => window.location.hash = 'cursos-publico', 1500);
    } catch (e) {
      showToast('Error al completar la inscripción', 'error');
    }
  }

  attachEventsSeleccion() {
    this.container.querySelector('#buscar-curso')?.addEventListener('input', (e) => {
      this.renderGrid(e.target.value);
    });
  }
}
