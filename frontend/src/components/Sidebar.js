import { icon } from './Icons.js';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'cursos', label: 'Cursos', icon: 'bookOpen' },
  { key: 'estudiantes', label: 'Estudiantes', icon: 'users' },
  { key: 'inscripciones', label: 'Inscripciones', icon: 'fileText' },
  { key: 'medios-pago', label: 'Medios de Pago', icon: 'creditCard' },
  { key: 'inscripcion-curso', label: 'Inscribir a Curso', icon: 'target' },
  { key: 'cursos-publico', label: 'Vista Pública', icon: 'globe' },
];

export const Sidebar = ({ activeRoute = 'dashboard' }) => {
  const navItems = menuItems.map(item => {
    const isActive = item.key === activeRoute;
    return `
      <li>
        <a 
          href="#${item.key}" 
          data-route="${item.key}"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }"
        >
          <span class="${isActive ? 'text-primary-foreground' : 'text-sidebar-foreground'}">
            ${icon(item.icon)}
          </span>
          ${item.label}
        </a>
      </li>
    `;
  }).join('');

  return `
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div class="flex h-full flex-col">
        <!-- Brand -->
        <div class="flex h-16 items-center border-b border-sidebar-border px-6">
          <a href="#dashboard" class="flex items-center gap-2 font-bold text-lg text-sidebar-primary-foreground">
            <span class="text-sidebar-primary">${icon('bookOpen')}</span>
            Course Manager
          </a>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-auto py-4 px-3">
          <ul class="space-y-1">
            ${navItems}
          </ul>
        </nav>
        
        <!-- Footer -->
        <div class="border-t border-sidebar-border p-4">
          <p class="text-xs text-sidebar-foreground/60 text-center">
            © 2024 Course Manager
          </p>
        </div>
      </div>
    </aside>
  `;
};

export const sidebar = Sidebar;
