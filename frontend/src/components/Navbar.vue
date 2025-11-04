<template>
  <header class="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl shadow-xl border-b border-slate-800/50 z-50">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Logo y título -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <i data-lucide="shield" class="w-6 h-6 text-white"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Panel Administración TI
            </h1>
            <p class="text-xs text-slate-500">Sistema de Gestión Educativa</p>
          </div>
        </div>
      </div>

      <!-- Búsqueda rápida (opcional) -->
      <div class="hidden lg:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
          <input
            type="text"
            placeholder="Buscar usuarios, logs, configuración..."
            class="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <!-- Acciones y perfil -->
      <div class="flex items-center gap-3">
        <!-- Notificaciones -->
        <button class="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all group">
          <i data-lucide="bell" class="w-5 h-5 group-hover:animate-pulse"></i>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <!-- Configuración rápida -->
        <button class="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all group">
          <i data-lucide="settings" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"></i>
        </button>

        <!-- Separador -->
        <div class="w-px h-8 bg-slate-700/50"></div>

        <!-- Perfil del usuario -->
        <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {{ authStore.user?.nombre || 'Administrador' }}
              </p>
              <p class="text-xs text-slate-500">Administrador TI</p>
            </div>
            <div class="relative">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-sm font-bold text-white">
                  {{ (authStore.user?.nombre || 'Admin')[0].toUpperCase() }}
                </span>
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
          </div>
          <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors"></i>
        </div>

        <!-- Botón de logout -->
        <button
          @click="logout"
          class="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold border border-red-500/20 hover:border-red-500 group"
        >
          <i data-lucide="log-out" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
          <span class="hidden md:inline text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>

    <!-- Barra de navegación secundaria (opcional) -->
    <div class="px-6 py-2 border-t border-slate-800/50 bg-slate-900/50 hidden xl:block">
      <nav class="flex items-center gap-6">
        <a
          v-for="item in quickLinks"
          :key="item.label"
          :href="item.href"
          class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-blue-500"
        >
          <i :data-lucide="item.icon" class="w-4 h-4"></i>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'

const authStore = useAuthStore()
const router = useRouter()

const quickLinks = [
  { label: 'Dashboard', href: '#', icon: 'layout-dashboard' },
  { label: 'Usuarios', href: '#', icon: 'users' },
  { label: 'Logs del Sistema', href: '#', icon: 'file-text' },
  { label: 'Backups', href: '#', icon: 'database' },
  { label: 'Reportes', href: '#', icon: 'bar-chart-3' }
]

const logout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  createIcons({ icons })
})
</script>
