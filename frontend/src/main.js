import './index.css';

import { DashboardPage } from './pages/DashboardPage.js';
import { CursosPage } from './pages/CursosPage.js';
import { EstudiantesPage } from './pages/EstudiantesPage.js';
import { InscripcionesPage } from './pages/InscripcionesPage.js';
import { MediosPagoPage } from './pages/MediosPagoPage.js';
import { InscripcionCursoPage } from './pages/InscripcionCursoPage.js';
import { CursosLandingPage } from './pages/CursosLandingPage.js';
import { Sidebar } from './components/Sidebar.js';
import { icon } from './components/Icons.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.currentPage = null;
    this.currentRoute = 'dashboard';
    this.routes = {
      'dashboard': DashboardPage,
      'cursos': CursosPage,
      'estudiantes': EstudiantesPage,
      'inscripciones': InscripcionesPage,
      'medios-pago': MediosPagoPage,
      'inscripcion-curso': InscripcionCursoPage,
      'cursos-publico': CursosLandingPage,
    };
  }

  init() {
    this.renderLayout();
    this.setupNavigation();
    
    // Check initial hash
    const initialRoute = window.location.hash.slice(1) || 'dashboard';
    this.navigate(initialRoute);
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="flex min-h-screen">
        <div id="sidebar-container"></div>
        <main class="flex-1 ml-64 p-6" id="main-content"></main>
      </div>
    `;
    
    this.renderSidebar();
  }

  renderSidebar() {
    const sidebarContainer = this.container.querySelector('#sidebar-container');
    sidebarContainer.innerHTML = Sidebar({ activeRoute: this.currentRoute });
  }

  setupNavigation() {
    const sidebar = this.container.querySelector('#sidebar-container');
    
    sidebar.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (!link) return;

      e.preventDefault();
      const route = link.dataset.route;
      this.navigate(route);
    });

    window.addEventListener('hashchange', () => {
      const route = window.location.hash.slice(1) || 'dashboard';
      this.navigate(route);
    });
  }

  navigate(route) {
    const mainContent = this.container.querySelector('#main-content');
    const PageClass = this.routes[route];
    
    if (!PageClass) {
      this.navigate('dashboard');
      return;
    }

    this.currentRoute = route;
    this.renderSidebar();
    
    this.currentPage = new PageClass(mainContent);
    this.currentPage.render();
    window.location.hash = route;
    
    // Update document title
    const titles = {
      'dashboard': 'Dashboard - Course Manager',
      'cursos': 'Cursos - Course Manager',
      'estudiantes': 'Estudiantes - Course Manager',
      'inscripciones': 'Inscripciones - Course Manager',
      'medios-pago': 'Medios de Pago - Course Manager',
      'inscripcion-curso': 'Inscribir a Curso - Course Manager',
      'cursos-publico': 'Cursos - Course Manager',
    };
    document.title = titles[route] || 'Course Manager';
  }
}

const app = new App();
app.init();
