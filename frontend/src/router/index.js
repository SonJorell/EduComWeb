import { createRouter, createWebHistory } from 'vue-router'

// 🌟 Páginas públicas
import Home from '../pages/Home.vue'
import Login from '../pages/login/Login.vue'

// 🧠 Dashboards
import DashboardTI from '../pages/admin/DashboardTI.vue'
import DashboardProfesor from '../pages/profesor/DashboardProfesor.vue'
import DashboardApoderado from '../pages/apoderado/DashboardApoderado.vue'

// 🧩 Módulos TI
import UsuariosTI from '../pages/admin/UsuariosTI.vue'
import CursosTI from '../pages/admin/CursosTI.vue'
import RolesTI from '../pages/admin/RolesTI.vue'
import SistemaTI from '../pages/admin/SistemaTI.vue'
import AuditoriaTI from '../pages/admin/AuditoriaTI.vue'

// 👨‍🏫 Módulos adicionales profesor
import CursosProfesor from '../pages/profesor/CursosProfesor.vue'

const routes = [
  // ============================
  // 🌟 Home
  // ============================
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  // ============================
  // 🔐 Login
  // ============================
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
    meta: { requiresAuth: true, role: ['Administrador', 'TI'] },
    children: [
      { path: 'usuarios', name: 'UsuariosTI', component: UsuariosTI },
      { path: 'cursos', name: 'CursosTI', component: CursosTI },
      { path: 'roles', name: 'RolesTI', component: RolesTI },
      { path: 'sistema', name: 'SistemaTI', component: SistemaTI },
      { path: 'auditoria', name: 'AuditoriaTI', component: AuditoriaTI }
    ]
  },

  // ============================
  // 👨‍🏫 Dashboard Profesor
  // ============================
  {
    path: '/dashboard-profesor',
    name: 'DashboardProfesor',
    component: DashboardProfesor,
    meta: { requiresAuth: true, role: ['Profesor'] }
  },

  // ============================
  // 👨‍👩‍👧 Dashboard Apoderado
  // ============================
  {
    path: '/dashboard-apoderado',
    name: 'DashboardApoderado',
    component: DashboardApoderado,
    meta: { requiresAuth: true, role: ['Apoderado'] }
  },

  // ============================
  // 📄 Ver comunicado (Profesor)
  // ============================
  {
    path: '/profesor/comunicados/:id',
    name: 'VerComunicado',
    component: () => import('@/pages/profesor/VerComunicado.vue'),
    meta: { requiresAuth: true, role: ['Profesor'] }
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

  // Si requiere autenticación y no hay token → login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Si ya está logueado y quiere ir al login o home → mándalo a su dashboard
  if (token && (to.path === '/' || to.path === '/login')) {
    if (role.includes('administrador') || role.includes('ti')) {
      return next('/dashboard-ti')
    }
    if (role.includes('profesor')) {
      return next('/dashboard-profesor')
    }
    if (role.includes('apoderado')) {
      return next('/dashboard-apoderado')
    }
  }

  // Validación de rol
  if (to.meta.role) {
    const rolesPermitidos = to.meta.role.map(r => r.toLowerCase())
    if (!rolesPermitidos.includes(role)) {
      return next('/') // acceso denegado → Home
    }
  }

  next()
})

export default router
