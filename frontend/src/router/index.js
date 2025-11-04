import { createRouter, createWebHistory } from 'vue-router'

// 🔹 Páginas principales
import Home from '../pages/Home.vue'
import Login from '../pages/login/Login.vue'

// 🔹 Dashboards
import DashboardTI from '../pages/admin/DashboardTI.vue'
import DashboardProfesor from '../pages/profesor/DashboardProfesor.vue'
import DashboardApoderado from '../pages/apoderado/DashboardApoderado.vue'

// 🔹 Subpáginas (solo para TI)
import Usuarios from '../pages/Usuarios.vue'
import Notificaciones from '../pages/Notificaciones.vue'
import CursosProfesor from '../pages/profesor/CursosProfesor.vue'

const routes = [
  // 🌟 Página principal
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  // 🔐 Página de Login
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // 🧠 Dashboard TI
  {
    path: '/dashboard-ti',
    name: 'DashboardTI',
    component: DashboardTI,
    meta: { requiresAuth: true, role: 'Administrador' },
    children: [
      { path: 'usuarios', name: 'Usuarios', component: Usuarios },
      { path: 'notificaciones', name: 'Notificaciones', component: Notificaciones },
      { path: 'cursos', name: 'CursosProfesor', component: CursosProfesor }
    ]
  },

  // 👨‍🏫 Dashboard Profesor
  {
    path: '/dashboard-profesor',
    name: 'DashboardProfesor',
    component: DashboardProfesor,
    meta: { requiresAuth: true, role: 'Profesor' }
  },

  // 👨‍👩‍👧 Dashboard Apoderado
  {
    path: '/dashboard-apoderado',
    name: 'DashboardApoderado',
    component: DashboardApoderado,
    meta: { requiresAuth: true, role: 'Apoderado' }
  },

  // 📄 Ver comunicado (profesor)
  {
    path: '/profesor/comunicados/:id',
    name: 'VerComunicado',
    component: () => import('@/pages/profesor/VerComunicado.vue'),
    meta: { requiresAuth: true, role: 'Profesor' }
  }
]

// 🧭 Crear router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🧩 Middleware de autenticación y control de roles
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')?.toLowerCase() || ''

  // 🔒 Si requiere autenticación y no hay token → redirige al login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // 🚫 Si el usuario está autenticado e intenta ir al login o al home
  if (token && (to.path === '/' || to.path === '/login')) {
    // Redirigir al dashboard según el rol
    if (role.includes('administrador') || role.includes('ti')) {
      return next('/dashboard-ti')
    } else if (role.includes('profesor')) {
      return next('/dashboard-profesor')
    } else if (role.includes('apoderado')) {
      return next('/dashboard-apoderado')
    }
  }

  // 🚫 Si la ruta tiene restricción de rol y no coincide
  if (to.meta.role && to.meta.role.toLowerCase() !== role) {
    return next('/')
  }

  next()
})

export default router
