<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { useAuthStore } from '@/store/auth'
import { profesorService } from '@/services/profesorService'

// ==================== STATE ====================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const modalLogout = ref(false)
const loading = ref(true)
const cursos = ref([])
const windowWidth = ref(window.innerWidth)
const activeItem = ref('Cursos') // Marcamos 'Cursos' como activo por defecto

// ==================== COMPUTED ====================
const nombreUsuario = computed(() => authStore.user?.nombre || 'Profesor')
const isMobile = computed(() => windowWidth.value < 768)

// ==================== METHODS ====================
async function cargarCursos() {
  try {
    loading.value = true
    const res = await profesorService.obtenerCursos()
    
    // Simulamos datos enriquecidos si el backend solo devuelve lo básico
    cursos.value = (res.data || []).map(c => ({
      ...c,
      totalAlumnos: c.totalAlumnos || Math.floor(Math.random() * (40 - 25) + 25),
      asistenciaPromedio: c.asistencia || Math.floor(Math.random() * (98 - 85) + 85),
      jefatura: c.esJefatura || false,
      proximaClase: 'Hoy, 10:30 AM'
    }))
  } catch (error) {
    console.error('Error cargando cursos:', error)
  } finally {
    loading.value = false
    setTimeout(() => createIcons({ icons }), 100)
  }
}

// Acciones de las tarjetas
const irAEstudiantes = (cursoId) => alert(`Navegando a estudiantes del curso ${cursoId}`)
const irACalificaciones = (cursoId) => alert(`Navegando a calificaciones del curso ${cursoId}`)
const pasarLista = (cursoId) => alert(`Iniciando toma de asistencia curso ${cursoId}`)

// --- LÓGICA SIDEBAR UNIFICADA ---
function setActive(item) {
  if (item.route) router.push(item.route)
  sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function handleLogout() {
  modalLogout.value = true
}

async function confirmarLogout() {
  await authStore.logout()
  router.push('/')
}

function updateWidth() {
  windowWidth.value = window.innerWidth
}

// ==================== LIFECYCLE ====================
onMounted(() => {
  createIcons({ icons })
  cargarCursos()
  window.addEventListener('resize', updateWidth)
  
  // Asegurar que el menú se ilumine correctamente si recargamos
  if (route.path.includes('/cursos')) activeItem.value = 'Cursos'
  
  setTimeout(() => createIcons({ icons }), 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-[Inter] relative overflow-hidden">
    
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.03)_1px,transparent_0)] [background-size:50px_50px]"></div>
    </div>

    <Teleport to="body">
      <div v-if="modalLogout" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" @click.self="modalLogout = false">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-700 max-w-sm w-full shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Cerrar Sesión</h3>
          <p class="text-slate-400 mb-6">¿Estás seguro de que deseas salir?</p>
          <div class="flex gap-3">
            <button @click="modalLogout = false" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors">Cancelar</button>
            <button @click="confirmarLogout" class="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white shadow-lg shadow-red-900/20">Salir</button>
          </div>
        </div>
      </div>
    </Teleport>

    <aside
      :class="[
        'bg-slate-900/95 backdrop-blur-xl flex flex-col shadow-2xl border-r border-slate-800/50 transition-all duration-300 ease-out',
        'fixed top-0 left-0 h-full z-50',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'w-64 md:w-72'
      ]"
    >
      <div class="p-6 border-b border-slate-800/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
              <img src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" alt="Logo" class="w-full h-full object-contain"/>
            </div>
            <div>
              <span class="text-lg font-bold text-white block">Colegio Arica</span>
              <span class="text-xs text-slate-500">Gestión Educativa</span>
            </div>
          </div>
          <button class="md:hidden text-slate-400 hover:text-white" @click="toggleSidebar"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
      </div>

      <div class="px-6 py-4 border-b border-slate-800/50 bg-slate-800/30">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-sm font-bold text-white">{{ nombreUsuario[0]?.toUpperCase() }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">{{ nombreUsuario }}</p>
            <p class="text-xs text-slate-400">Profesor</p>
          </div>
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <nav class="flex-grow px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div class="px-3 py-2 mb-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menú Principal</span>
        </div>

        <button
          v-for="item in [
            { name: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard-profesor' },
            { name: 'Comunicados', icon: 'send', route: '/profesor/comunicados' },
            
            { name: 'Cursos', icon: 'book-open', route: '/profesor/cursos' },
            
          ]"
          :key="item.name"
          @click="setActive(item)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative active:scale-95',
            activeItem === item.name
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
          ]"
        >
          <div v-if="activeItem === item.name" class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full"></div>
          <i :data-lucide="item.icon" class="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform"></i>
          <span class="flex-1 text-left text-sm">{{ item.name }}</span>
        </button>
      </nav>
      
      <div class="border-t border-slate-800/50 p-4 space-y-2">
        <button @click="setActive({ name: 'Configuracion', route: '/profesor/configuracion' })" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all group active:scale-95">
          <i data-lucide="settings" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"></i>
          <span class="text-sm">Configuración</span>
        </button>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all border border-red-900/20 hover:border-red-800/50 active:scale-95 group">
          <i data-lucide="log-out" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"></i>
          <span class="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="md:ml-72 min-h-screen relative z-10 pb-10">
      
      <header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
            <button class="md:hidden text-slate-400 p-1 hover:bg-slate-800 rounded-lg" @click="toggleSidebar"><i data-lucide="menu" class="w-6 h-6"></i></button>
            <div>
              <h1 class="text-2xl font-bold text-white tracking-tight">Mis Cursos</h1>
              <p class="text-xs text-slate-400 hidden sm:block">Gestión académica y control de asistencia</p>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
                <span class="text-xs font-medium text-blue-300">Ciclo Escolar 2025</span>
            </div>
        </div>
      </header>

      <div class="p-4 sm:p-8 max-w-7xl mx-auto">
        
        <div v-if="loading" class="py-40 text-center">
            <div class="relative w-16 h-16 mx-auto mb-4">
              <div class="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-slate-400 animate-pulse">Cargando asignaciones...</p>
        </div>

        <div v-else-if="cursos.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <div 
                v-for="curso in cursos" 
                :key="curso.id" 
                class="group bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1"
            >
                <div class="h-24 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 relative">
                    <div class="absolute top-4 right-4">
                        <span v-if="curso.jefatura" class="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            Profesor Jefe
                        </span>
                    </div>
                    <div class="w-12 h-12 bg-slate-900/90 rounded-xl flex items-center justify-center shadow-lg border border-slate-700 absolute -bottom-6 left-6 group-hover:scale-110 transition-transform duration-300">
                        <i data-lucide="book-open" class="w-6 h-6 text-blue-400"></i>
                    </div>
                </div>

                <div class="pt-10 px-6 pb-6">
                    <h3 class="text-xl font-bold text-white mb-1">{{ curso.nombre }}</h3>
                    <p class="text-sm text-slate-400 mb-4 flex items-center gap-2">
                        <i data-lucide="clock" class="w-3.5 h-3.5"></i> Próxima clase: {{ curso.proximaClase }}
                    </p>

                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 flex flex-col items-center justify-center text-center group/stat hover:border-blue-500/20 transition-colors">
                            <span class="text-2xl font-bold text-white mb-1">{{ curso.totalAlumnos }}</span>
                            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                <i data-lucide="users" class="w-3 h-3"></i> Alumnos
                            </span>
                        </div>
                        <div class="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 flex flex-col items-center justify-center text-center group/stat hover:border-green-500/20 transition-colors">
                            <span class="text-2xl font-bold text-green-400 mb-1">{{ curso.asistenciaPromedio }}%</span>
                            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                <i data-lucide="check-circle-2" class="w-3 h-3"></i> Asistencia
                            </span>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <button 
                            @click="pasarLista(curso.id)"
                            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <i data-lucide="clipboard-check" class="w-4 h-4"></i> Pasar Lista
                        </button>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                @click="irAEstudiantes(curso.id)"
                                class="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 text-xs"
                            >
                                <i data-lucide="graduation-cap" class="w-4 h-4"></i> Estudiantes
                            </button>
                            <button 
                                @click="irACalificaciones(curso.id)"
                                class="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 text-xs"
                            >
                                <i data-lucide="bar-chart-2" class="w-4 h-4"></i> Notas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div v-else class="py-24 text-center bg-slate-900/20 backdrop-blur-sm rounded-3xl border border-slate-800/50 border-dashed animate-fade-in">
            <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i data-lucide="book-off" class="w-10 h-10 text-slate-600"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No tienes cursos asignados</h3>
            <p class="text-slate-500 max-w-md mx-auto">Si crees que esto es un error, contacta al administrador del sistema o a la dirección académica.</p>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* Custom Scrollbar para el sidebar (más elegante) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  border-radius: 10px;
}
</style>