import { cursoService, estudianteService, inscripcionService } from '../api/services.js';
import { showToast } from '../utils/helpers.js';
import { icon } from '../components/Icons.js';

export class DashboardPage {
  constructor(container) {
    this.container = container;
    this.stats = {
      cursos: 0,
      estudiantes: 0,
      inscripciones: 0,
    };
    this.loading = true;
  }

  async render() {
    this.container.innerHTML = `
      <div class="space-y-4 md:space-y-6">
        <!-- Header simple -->
        <div class="border-b pb-4">
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <!-- Stats simples - responsive: 1 col mobile, 2 col tablet, 3 col desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div class="bg-white rounded-lg border p-3 md:p-4 shadow-sm">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-blue-100 rounded-lg text-blue-600">${icon('bookOpen')}</div>
              <div>
                <p class="text-xs md:text-sm text-gray-600">Cursos</p>
                <p class="text-xl md:text-2xl font-bold text-gray-900" id="stat-cursos">-</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-3 md:p-4 shadow-sm">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-green-100 rounded-lg text-green-600">${icon('users')}</div>
              <div>
                <p class="text-xs md:text-sm text-gray-600">Estudiantes</p>
                <p class="text-xl md:text-2xl font-bold text-gray-900" id="stat-estudiantes">-</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-3 md:p-4 shadow-sm">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-purple-100 rounded-lg text-purple-600">${icon('fileText')}</div>
              <div>
                <p class="text-xs md:text-sm text-gray-600">Inscripciones</p>
                <p class="text-xl md:text-2xl font-bold text-gray-900" id="stat-inscripciones">-</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas - responsive -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <a href="#inscripcion-curso" class="block bg-blue-600 text-white rounded-lg p-3 md:p-4 hover:bg-blue-700 transition-colors">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-white/20 rounded-lg">${icon('target')}</div>
              <div>
                <h3 class="font-semibold text-sm md:text-base">Nueva Inscripción</h3>
                <p class="text-xs md:text-sm text-blue-100 hidden sm:block">Inscribir estudiante</p>
              </div>
            </div>
          </a>
          <a href="#cursos" class="block bg-white border rounded-lg p-3 md:p-4 hover:border-blue-500 transition-colors">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-blue-50 rounded-lg text-blue-600">${icon('bookOpen')}</div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm md:text-base">Gestionar Cursos</h3>
                <p class="text-xs md:text-sm text-gray-500 hidden sm:block">Ver y editar</p>
              </div>
            </div>
          </a>
          <a href="#estudiantes" class="block bg-white border rounded-lg p-3 md:p-4 hover:border-blue-500 transition-colors">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="p-1.5 md:p-2 bg-blue-50 rounded-lg text-blue-600">${icon('users')}</div>
              <div>
                <h3 class="font-semibold text-gray-900 text-sm md:text-base">Gestionar Estudiantes</h3>
                <p class="text-xs md:text-sm text-gray-500 hidden sm:block">Ver y editar</p>
              </div>
            </div>
          </a>
        </div>

        <!-- Info - responsive -->
        <div class="bg-white rounded-lg border shadow-sm">
          <div class="p-3 md:p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 class="text-sm font-medium text-gray-700">Bienvenido al Sistema</h2>
          </div>
          <div class="p-3 md:p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div class="flex items-start gap-3">
                <div class="p-1.5 bg-blue-50 rounded text-blue-600">${icon('bookOpen')}</div>
                <div>
                  <h4 class="font-medium text-gray-900">Cursos</h4>
                  <p class="text-sm text-gray-500">Crear, editar y eliminar cursos</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-1.5 bg-blue-50 rounded text-blue-600">${icon('users')}</div>
                <div>
                  <h4 class="font-medium text-gray-900">Estudiantes</h4>
                  <p class="text-sm text-gray-500">Administrar participantes</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-1.5 bg-blue-50 rounded text-blue-600">${icon('fileText')}</div>
                <div>
                  <h4 class="font-medium text-gray-900">Inscripciones</h4>
                  <p class="text-sm text-gray-500">Gestionar inscripciones</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="p-1.5 bg-blue-50 rounded text-blue-600">${icon('creditCard')}</div>
                <div>
                  <h4 class="font-medium text-gray-900">Medios de Pago</h4>
                  <p class="text-sm text-gray-500">Configurar pagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    await this.loadStats();
  }

  async loadStats() {
    try {
      const [cursosRes, estudiantesRes, inscripcionesRes] = await Promise.all([
        cursoService.getAll({ per_page: 1 }),
        estudianteService.getAll({ per_page: 1 }),
        inscripcionService.getAll({ per_page: 1 }),
      ]);

      this.stats = {
        cursos: cursosRes.meta?.total || 0,
        estudiantes: estudiantesRes.meta?.total || 0,
        inscripciones: inscripcionesRes.meta?.total || 0,
      };

      this.updateStats();
    } catch (error) {
      showToast('Error al cargar estadísticas', 'error');
    }
  }

  updateStats() {
    const cursosEl = this.container.querySelector('#stat-cursos');
    const estudiantesEl = this.container.querySelector('#stat-estudiantes');
    const inscripcionesEl = this.container.querySelector('#stat-inscripciones');

    if (cursosEl) cursosEl.textContent = this.stats.cursos;
    if (estudiantesEl) estudiantesEl.textContent = this.stats.estudiantes;
    if (inscripcionesEl) inscripcionesEl.textContent = this.stats.inscripciones;
  }
}
