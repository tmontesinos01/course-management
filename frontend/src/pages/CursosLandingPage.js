import { cursoService, medioPagoService } from '../api/services.js';
import { formatCurrency, formatDate, showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';
import { EmptyState } from '../components/EmptyState.js';
import { components, typography, spacing } from '../styles/theme.js';

export class CursosLandingPage {
  constructor(container) {
    this.container = container;
    this.cursos = [];
    this.mediosPago = [];
    this.loading = true;
    this.filtroTexto = '';
  }

  async render() {
    this.container.innerHTML = `
      <div class="${spacing.page}">
        <!-- Header -->
        <div class="text-center py-4 md:py-8 border-b">
          <h1 class="text-xl md:text-3xl font-bold text-gray-900">Course Manager</h1>
          <p class="text-sm md:text-base text-gray-600 mt-2">Descubre nuestros cursos y comienza tu formación</p>
        </div>

        <!-- Búsqueda -->
        <div class="${components.card.base} ${components.card.body}">
          <div class="relative w-full">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ${icon('search')}
            </div>
            <input type="text" id="buscar-curso" placeholder="Buscar curso por nombre o tipo..." 
              class="${components.input.withIcon}">
          </div>
        </div>

        <!-- Grid de Cursos -->
        <div id="cursos-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div class="col-span-full ${components.empty.container}">
            <div class="animate-spin">${icon('loader')}</div>
            <p class="mt-3 text-sm text-gray-500">Cargando cursos...</p>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    await this.loadData();
  }

  async loadData() {
    try {
      const [cursosRes, mediosRes] = await Promise.all([
        cursoService.getAll({ per_page: 100 }),
        medioPagoService.getAll({ per_page: 100 }).catch(() => ({ data: [] }))
      ]);
      this.cursos = cursosRes.data || [];
      this.mediosPago = mediosRes.data || [];
      this.loading = false;
      this.renderGrid();
    } catch (e) {
      this.loading = false;
      const grid = this.container.querySelector('#cursos-grid');
      if (grid) {
        grid.innerHTML = `<div class="col-span-full">${EmptyState({
          iconName: 'alertCircle',
          title: 'Error al cargar cursos',
          description: 'No pudimos conectar con el servidor. Verifique su conexión e intente nuevamente.',
          action: { label: 'Reintentar', iconName: 'loader', onClick: 'window.landingPage.loadData()' },
          variant: 'danger'
        })}</div>`;
      }
    }
  }

  renderGrid() {
    const grid = this.container.querySelector('#cursos-grid');
    
    let filtered = this.cursos.filter(c => 
      c.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
      (c.tipo_curso && c.tipo_curso.toLowerCase().includes(this.filtroTexto.toLowerCase()))
    );

    // Empty state: Sin cursos en absoluto
    if (!this.cursos.length) {
      grid.innerHTML = `<div class="col-span-full">${EmptyState({
        iconName: 'bookOpen',
        title: 'No hay cursos disponibles',
        description: 'Aún no se han publicado cursos. Vuelve pronto para descubrir nuestras nuevas propuestas.',
        variant: 'info'
      })}</div>`;
      return;
    }

    // Empty state: Búsqueda sin resultados
    if (!filtered.length) {
      grid.innerHTML = `<div class="col-span-full">${EmptyState({
        iconName: 'search',
        title: 'Sin resultados',
        description: 'No se encontraron cursos que coincidan con su búsqueda. Intente con otros términos.',
        action: { label: 'Limpiar búsqueda', onClick: 'window.landingPage.limpiarBusqueda()' },
        variant: 'default'
      })}</div>`;
      return;
    }

    grid.innerHTML = filtered.map(c => this.renderCursoCard(c)).join('');
  }

  renderCursoCard(c) {
    const precio = c.importe_agremiado || c.importe;
    const tieneAgremiado = c.importe_agremiado && c.importe_agremiado !== c.importe;
    const sinCupos = c.cupos === 0 || c.cupos === null;
    const cuposBajos = c.cupos > 0 && c.cupos <= 3;
    
    return `
      <div class="${components.card.base} ${sinCupos ? 'opacity-75' : 'hover:shadow-md'} transition-shadow overflow-hidden flex flex-col">
        <div class="${components.card.body} flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="${typography.cardTitle} line-clamp-2 flex-1">${c.nombre}</h3>
            ${tieneAgremiado ? `<span class="${components.badge.brand} flex-shrink-0">Agremiado</span>` : ''}
          </div>
          <p class="text-xs md:text-sm text-gray-500 mb-3 line-clamp-1">${c.tipo_curso || 'Curso'}</p>
          
          <div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              ${icon('calendar')} 
              ${formatDate(c.fecha_desde)}
            </span>
            <span class="flex items-center gap-1 ${sinCupos ? 'text-red-600 font-medium' : cuposBajos ? 'text-orange-600 font-medium' : ''}">
              ${icon('users')} 
              ${sinCupos ? 'Sin cupos' : `${c.cupos} ${cuposBajos ? '¡Últimos!' : 'cupos'}`}
            </span>
          </div>
          
          <div class="flex items-center justify-between pt-2 md:pt-3 border-t mt-auto">
            <div class="flex flex-col">
              <span class="text-base md:text-lg font-bold text-blue-600">${formatCurrency(precio)}</span>
              ${tieneAgremiado ? `<span class="text-xs text-gray-400 line-through">${formatCurrency(c.importe)}</span>` : ''}
            </div>
            <div class="flex gap-1.5 md:gap-2">
              <button onclick="window.landingPage.verDetalle(${c.id})" 
                class="px-2.5 md:px-3 py-1.5 text-xs md:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                Ver más
              </button>
              ${sinCupos ? `
                <button disabled class="px-2.5 md:px-3 py-1.5 text-xs md:text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                  Sin cupos
                </button>
              ` : `
                <button onclick="window.landingPage.inscribirse(${c.id})" 
                  class="px-2.5 md:px-3 py-1.5 text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Inscribirme
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  verDetalle(id) {
    const curso = this.cursos.find(c => c.id === id);
    if (!curso) return;
    
    const precio = curso.importe_agremiado || curso.importe;
    const tieneAgremiado = curso.importe_agremiado && curso.importe_agremiado !== curso.importe;
    const sinCupos = curso.cupos === 0 || curso.cupos === null;
    
    const overlay = document.createElement('div');
    overlay.className = components.modal.overlay;
    overlay.innerHTML = `
      <div class="${components.modal.container} ${components.modal.md}">
        <div class="${components.modal.header}">
          <h3 class="text-base md:text-lg font-semibold pr-4">${curso.nombre}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 flex-shrink-0">${icon('x')}</button>
        </div>
        <div class="${components.modal.body} space-y-3 md:space-y-4">
          <p class="text-sm md:text-base text-gray-600">${curso.descripcion || 'Sin descripción'}</p>
          <div class="grid grid-cols-2 gap-2 md:gap-3">
            <div class="p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500">Inicio</p>
              <p class="font-medium text-sm md:text-base">${formatDate(curso.fecha_desde)}</p>
            </div>
            <div class="p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500">Fin</p>
              <p class="font-medium text-sm md:text-base">${formatDate(curso.fecha_hasta)}</p>
            </div>
            <div class="p-2.5 md:p-3 ${sinCupos ? 'bg-red-50' : 'bg-gray-50'} rounded-lg">
              <p class="text-xs text-gray-500">Cupos</p>
              <p class="font-medium text-sm md:text-base ${sinCupos ? 'text-red-600' : ''}">${sinCupos ? 'Sin cupos' : curso.cupos}</p>
            </div>
            <div class="p-2.5 md:p-3 bg-blue-50 rounded-lg">
              <p class="text-xs text-blue-600">Precio${tieneAgremiado ? ' agremiado' : ''}</p>
              <p class="font-medium text-sm md:text-base text-blue-700">${formatCurrency(precio)}</p>
            </div>
          </div>
        </div>
        <div class="${components.modal.footer}">
          <button onclick="this.closest('.fixed').remove()" class="${components.button.secondary} flex-1">Cerrar</button>
          ${sinCupos ? `
            <button disabled class="flex-1 px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">Sin cupos</button>
          ` : `
            <button onclick="window.landingPage.inscribirse(${curso.id}); this.closest('.fixed').remove()" class="${components.button.primary} flex-1">Inscribirme</button>
          `}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  inscribirse(id) {
    window.location.hash = 'inscripcion-curso';
    localStorage.setItem('cursoPreseleccionado', id);
    showToast('Redirigiendo al formulario de inscripción...');
  }

  limpiarBusqueda() {
    this.filtroTexto = '';
    const input = this.container.querySelector('#buscar-curso');
    if (input) input.value = '';
    this.renderGrid();
  }

  attachEvents() {
    window.landingPage = this;
    
    this.container.querySelector('#buscar-curso')?.addEventListener('input', (e) => {
      this.filtroTexto = e.target.value;
      this.renderGrid();
    });
  }
}
