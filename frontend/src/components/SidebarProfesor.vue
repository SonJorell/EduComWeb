<script setup>
import { ref, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)

const menu = [
  { icon: 'layout-dashboard', label: 'Dashboard', route: '/profesor/dashboard', badge: null, color: 'blue' },
  { icon: 'send', label: 'Comunicados', route: '/profesor/comunicados', badge: '3', color: 'indigo' },
  { icon: 'users', label: 'Apoderados', route: '/profesor/apoderados', badge: null, color: 'purple' },
  { icon: 'book-open', label: 'Cursos', route: '/profesor/cursos', badge: '5', color: 'cyan' },
  { icon: 'bar-chart-3', label: 'Reportes', route: '/profesor/reportes', badge: null, color: 'emerald' }
]

const tools = [
  { icon: 'settings', label: 'Configuración', action: 'settings' },
  { icon: 'help-circle', label: 'Ayuda', action: 'help' }
]

const isActive = (itemRoute) => {
  return route.path === itemRoute
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  // Tu lógica de logout
  console.log('Cerrando sesión...')
  router.push('/login')
}

onMounted(() => {
  createIcons({ icons })
})
</script>

<template>
  <aside
    :class="[
      'fixed top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col shadow-2xl z-40 transition-all duration-300',
      sidebarCollapsed ? 'w-20' : 'w-72'
    ]"
  >
    <!-- Efecto de brillo superior -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

    <!-- Header del Sidebar -->
    <div class="px-6 py-5 border-b border-slate-800/50 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
      <div class="flex items-center gap-3 mb-2">
        <div class="relative flex-shrink-0">
          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20">
            <span class="text-sm font-bold text-white">PR</span>
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse-subtle"></div>
        </div>
        <div v-if="!sidebarCollapsed" class="flex-1 min-w-0 animate-fade-in">
          <p class="text-sm font-bold text-white truncate">Prof. Rodríguez</p>
          <p class="text-xs text-slate-400">Docente · En línea</p>
        </div>
      </div>
    </div>

    <!-- Navegación Principal -->
    <nav class="flex-grow mt-2 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
      <div v-if="!sidebarCollapsed" class="px-3 py-2 mb-2">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Menú Principal</span>
      </div>

      <button
        v-for="(item, index) in menu"
        :key="item.route"
        @click="router.push(item.route)"
        :style="{ animationDelay: `${index * 50}ms` }"
        :class="[
          'group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 animate-slide-right',
          sidebarCollapsed ? 'justify-center' : '',
          isActive(item.route)
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-105'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1'
        ]"
        :title="sidebarCollapsed ? item.label : ''"
      >
        <!-- Indicador activo -->
        <div
          v-if="isActive(item.route)"
          class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full"
        ></div>

        <!-- Icono con contenedor -->
        <div
          :class="[
            'relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200',
            isActive(item.route) 
              ? 'bg-white/20' 
              : `bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20`
          ]"
        >
          <i
            :data-lucide="item.icon"
            :class="[
              'w-5 h-5 transition-transform duration-200',
              isActive(item.route) ? 'text-white scale-110' : `text-${item.color}-400 group-hover:scale-110`
            ]"
          ></i>
        </div>

        <!-- Label -->
        <span
          v-if="!sidebarCollapsed"
          :class="[
            'flex-1 text-left font-semibold text-sm transition-all',
            isActive(item.route) ? 'text-white' : 'text-slate-300 group-hover:text-white'
          ]"
        >
          {{ item.label }}
        </span>

        <!-- Badge de notificaciones -->
        <span
          v-if="item.badge && !sidebarCollapsed"
          :class="[
            'px-2 py-0.5 text-xs font-bold rounded-full transition-all',
            isActive(item.route)
              ? 'bg-white text-blue-600 shadow-lg'
              : 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white animate-pulse-subtle'
          ]"
        >
          {{ item.badge }}
        </span>

        <!-- Badge punto para collapsed -->
        <span
          v-if="item.badge && sidebarCollapsed"
          class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"
        ></span>

        <!-- Efecto hover -->
        <div
          v-if="!isActive(item.route)"
          class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 rounded-xl transition-all duration-300 pointer-events-none"
        ></div>
      </button>
    </nav>

    <!-- Sección de Herramientas -->
    <div class="px-3 py-3 border-t border-slate-800/50">
      <div v-if="!sidebarCollapsed" class="px-3 py-2 mb-2">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Herramientas</span>
      </div>

      <button
        v-for="tool in tools"
        :key="tool.action"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 group hover:translate-x-1 mb-1',
          sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="sidebarCollapsed ? tool.label : ''"
      >
        <div class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800/50 group-hover:bg-slate-700 transition-all">
          <i
            :data-lucide="tool.icon"
            :class="[
              'w-5 h-5 text-slate-500 group-hover:text-white transition-all',
              tool.icon === 'settings' && 'group-hover:rotate-90 duration-300'
            ]"
          ></i>
        </div>
        <span v-if="!sidebarCollapsed" class="flex-1 text-left font-medium text-sm">{{ tool.label }}</span>
      </button>
    </div>

    <!-- Footer con botón de collapse y logout -->
    <div class="border-t border-slate-800/50 p-4 bg-gradient-to-t from-slate-900 to-transparent">
      <!-- Botón de collapse -->
      <button
        v-if="!sidebarCollapsed"
        @click="toggleSidebar"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 text-sm font-medium group"
      >
        <i data-lucide="panel-left-close" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
        <span>Contraer menú</span>
      </button>

      <!-- Botón de expand (collapsed) -->
      <button
        v-else
        @click="toggleSidebar"
        class="w-full flex items-center justify-center px-4 py-2 mb-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
        title="Expandir menú"
      >
        <i data-lucide="panel-left-open" class="w-5 h-5"></i>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold border group',
          'text-red-400 hover:text-red-300 hover:bg-red-900/30 border-red-900/20 hover:border-red-800/50',
          'shadow-lg hover:shadow-red-500/20 hover:scale-105 active:scale-95',
          sidebarCollapsed ? 'justify-center' : ''
        ]"
        :title="sidebarCollapsed ? 'Cerrar sesión' : ''"
      >
        <div class="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all">
          <i data-lucide="log-out" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"></i>
        </div>
        <span v-if="!sidebarCollapsed" class="text-sm">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Animaciones */
@keyframes slide-right {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.animate-slide-right {
  animation: slide-right 0.3s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Scrollbar personalizado mejorado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #60a5fa, #818cf8);
}

/* Smooth scroll */
.custom-scrollbar {
  scroll-behavior: smooth;
}

/* Tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
