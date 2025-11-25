import { createRouter, createWebHistory } from 'vue-router'

// ============================
// 🌟 Páginas públicas
// ============================
import Home from '../pages/Home.vue'
import Login from '../pages/login/Login.vue'

// ============================
// 🧠 Dashboards Principales
// ============================
import DashboardTI from '../pages/admin/DashboardTI.vue'
import DashboardProfesor from '../pages/profesor/DashboardProfesor.vue'
import DashboardApoderado from '../pages/apoderado/DashboardApoderado.vue'
import DirectorDashboard from '../pages/director/DirectorDashboard.vue'

// ============================
// 🧩 Módulos TI (Admin)
// ============================
import UsuariosTI from '../pages/admin/UsuariosTI.vue'
import CursosTI from '../pages/admin/CursosTI.vue'
import RolesTI from '../pages/admin/RolesTI.vue'
import SistemaTI from '../pages/admin/SistemaTI.vue'
import AuditoriaTI from '../pages/admin/AuditoriaTI.vue'

// ============================
// 👨‍🏫 Módulos Profesor (¡NUEVOS AGREGADOS!)
// ============================
import ComunicadosProfesor from '../pages/profesor/ComunicadosProfesor.vue'
import CursosProfesor from '../pages/profesor/CursosProfesor.vue'
import ReportesProfesor from '../pages/profesor/ReportesProfesor.vue'
import ConfiguracionProfesor from '../pages/profesor/ConfiguracionProfesor.vue'
// Nota: Si creas "ApoderadosProfesor.vue" impórtalo aquí. Por ahora usaré Cursos como ejemplo.

// ============================
// 👔 Layouts
// ============================
import DirectorLayout from '../layouts/director/DirectorLayout.vue'


const routes = [
  // ============================
  // 🌟 Home & Login
  // ============================
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // ============================
  // 🧠 Dashboard TI / Administrador
  // ============================
  {
    path: '/dashboard-ti',
    name: 'DashboardTI',
    component: DashboardTI,
    meta: { requiresAuth: true, role: ['ADMIN'] },
    children: [
      { path: 'usuarios', name: 'UsuariosTI', component: UsuariosTI },
      { path: 'cursos', name: 'CursosTI', component: CursosTI },
      { path: 'roles', name: 'RolesTI', component: RolesTI },
      { path: 'sistema', name: 'SistemaTI', component: SistemaTI },
      { path: 'auditoria', name: 'AuditoriaTI', component: AuditoriaTI }
    ]
  },

  // ============================
  // 👨‍🏫 RUTAS PROFESOR (CORREGIDAS)
  // ============================
  
  // 1. Dashboard Principal
  {
    path: '/dashboard-profesor',
    name: 'DashboardProfesor',
    component: DashboardProfesor,
    meta: { requiresAuth: true, role: ['PROFESOR'] },
  },

  // 2. Módulo Comunicados
  {
    path: '/profesor/comunicados',
    name: 'ProfesorComunicados',
    component: ComunicadosProfesor,
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },

  // 3. Módulo Cursos
  {
    path: '/profesor/cursos',
    name: 'ProfesorCursos',
    component: CursosProfesor,
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },

  // 4. Módulo Reportes
  {
    path: '/profesor/reportes',
    name: 'ProfesorReportes',
    component: ReportesProfesor,
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },

  // 5. Configuración
  {
    path: '/profesor/configuracion',
    name: 'ProfesorConfiguracion',
    component: ConfiguracionProfesor,
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },

  // 6. Ver comunicado individual (Detalle)
  {
    path: '/profesor/comunicados/:id',
    name: 'VerComunicado',
    component: () => import('@/pages/profesor/VerComunicado.vue'),
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },

  // Nota: Como no vi el archivo "ApoderadosProfesor.vue" en tu foto, 
  // redirigiré a Cursos temporalmente. Cuando lo crees, cambia el component.
  {
    path: '/profesor/apoderados',
    name: 'ProfesorApoderados',
    component: CursosProfesor, // <--- CAMBIAR POR ApoderadosProfesor CUANDO EXISTA
    meta: { requiresAuth: true, role: ['PROFESOR'] }
  },


  // ============================
  // 👨‍👩‍👧 Dashboard Apoderado
  // ============================
  {
    path: '/dashboard-apoderado',
    name: 'DashboardApoderado',
    component: DashboardApoderado,
    meta: { requiresAuth: true, role: ['APODERADO'] }
  },

  // ============================
  // 👔 Dashboard Director
  // ============================
  {
    path: '/director',
    component: DirectorLayout,
    meta: { requiresAuth: true, role: ['DIRECTOR'] },
    children: [
      {
        path: '',
        name: 'DirectorDashboard',
        component: DirectorDashboard
      }
    ]
  }
]

// ============================================
// 🧭 Configuración del Router
// ============================================
const router = createRouter({
  history: createWebHistory(),
  routes
})

// ============================================
// 🔒 Middleware de autenticación y roles
// ============================================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = (localStorage.getItem('role') || '').toLowerCase()

  // 1. Si requiere auth y no hay token -> Login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // 2. Redirección inteligente si ya está logueado e intenta ir a Home o Login
  if (token && (to.path === '/' || to.path === '/login')) {
    if (role === 'admin') return next('/dashboard-ti')
    if (role === 'profesor') return next('/dashboard-profesor')
    if (role === 'apoderado') return next('/dashboard-apoderado')
    if (role === 'director') return next('/director')
  }

  // 3. Validación estricta de Roles
  if (to.meta.role) {
    // Normalizamos roles a minúsculas para comparar
    const rolesPermitidos = to.meta.role.map(r => r.toLowerCase())
    
    if (!rolesPermitidos.includes(role)) {
      // Si intenta entrar a un sitio sin permiso
      console.warn(`Acceso denegado. Rol usuario: ${role}, Roles requeridos: ${rolesPermitidos}`)
      return next('/') // O podrías mandarlo a una página 403
    }
  }

  next()
})

export default router