<script setup>
import { ref, computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { profesorService } from '@/services/profesorService'
import ModalComunicado from '@/components/profesor/ModalComunicado.vue'

// ==================== STATE ====================
const router = useRouter()
const route = useRoute() // Para marcar activo según URL
const authStore = useAuthStore()

const cargando = ref(true)
const error = ref(null)
const cursos = ref([])
const comunicados = ref([])

// Filtros
const cursoFiltro = ref('Todos')
const tipoFiltro = ref('Todos')

// UI State
const sidebarOpen = ref(false)
const modalAbierto = ref(false)
const modalLogout = ref(false)
const windowWidth = ref(window.innerWidth)
const activeItem = ref('Comunicados') // Marcado por defecto

// ==================== COMPUTED ====================
const nombreUsuario = computed(() => authStore.user?.nombre || 'Profesor')
const isMobile = computed(() => windowWidth.value < 768)

// Lógica de filtros ROBUSTA (Soluciona el problema de que no se veían reflejados)
const comunicadosFiltrados = computed(() => {
  return comunicados.value.filter(c => {
    // 1. Filtro por Curso (Comparación segura String vs Number)
    let pasaCurso = true
    if (cursoFiltro.value !== 'Todos') {
        const idFiltro = Number(cursoFiltro.value)
        // Verificamos si alguno de los IDs del comunicado coincide
        pasaCurso = c.cursoIds.some(id => Number(id) === idFiltro)
    }

    // 2. Filtro por Tipo
    let pasaTipo = true
    if (tipoFiltro.value !== 'Todos') {
        pasaTipo = c.tipo === tipoFiltro.value
    }
    
    return pasaCurso && pasaTipo
  })
})

// Helpers de estilo
const getTipoEstilo = (tipo) => {
    switch(tipo) {
        case 'REUNION': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        case 'AVISO': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        case 'CITACION': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
}

const getIconoTipo = (tipo) => {
    switch(tipo) {
        case 'REUNION': return 'users'
        case 'CITACION': return 'alert-circle'
        default: return 'bell'
    }
}

// ==================== METHODS ====================
async function cargarDatos() {
  try {
    cargando.value = true
    const [rCursos, rComunicados] = await Promise.all([
      profesorService.obtenerCursos(),
      profesorService.obtenerNotificaciones()
    ])

    cursos.value = rCursos.data || []
    
    // Mapeo seguro de datos
    comunicados.value = (rComunicados.data || []).map(c => {
        // Normalización de IDs de cursos (puede venir como JSON string o array)
        let rawIds = c.cursoIds || c.cursosDestino || []
        if (typeof rawIds === 'string') {
            try { rawIds = JSON.parse(rawIds) } catch { rawIds = [] }
        }
        if (rawIds && typeof rawIds === 'object' && rawIds.set) {
            rawIds = rawIds.set
        }

        return {
            id: c.id,
            titulo: c.titulo || 'Sin título',
            mensaje: c.mensaje,
            tipo: c.tipo || 'General',
            fecha: c.fecha ? new Date(c.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) : 'Sin fecha',
            leido: c.leido || 0,
            confirmado: c.confirmado || 0,
            cursoNombre: Array.isArray(c.cursos) ? c.cursos.join(', ') : 'Varios',
            cursoIds: Array.isArray(rawIds) ? rawIds : [] 
        }
    })

  } catch (e) {
    console.error('Error cargando datos:', e)
    error.value = 'Error de conexión.'
  } finally {
    cargando.value = false
    setTimeout(() => createIcons({ icons }), 100)
  }
}

function verDetalle(id) {
  router.push(`/profesor/comunicados/${id}`)
}

async function eliminarComunicado(id) {
  if(!confirm('¿Deshabilitar este comunicado?')) return
  try {
    await profesorService.deshabilitarComunicado(id)
    await cargarDatos()
  } catch (e) {
    alert('No se pudo eliminar')
  }
}

// --- LÓGICA SIDEBAR (IGUAL AL DASHBOARD) ---
function setActive(item) {
  // Actualizamos visualmente
  activeItem.value = item.name
  sidebarOpen.value = false
  
  // Navegamos
  if (item.route) {
    router.push(item.route)
  }
}

function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
function handleLogout() { modalLogout.value = true }
async function confirmarLogout() { await authStore.logout(); router.push('/') }

// ==================== LIFECYCLE ====================
onMounted(async () => {
  createIcons({ icons })
  await cargarDatos()
  window.addEventListener('resize', () => windowWidth.value = window.innerWidth)
  
  // Detectar ruta actual para iluminar el botón correcto si recarga la página
  const path = route.path
  if(path.includes('comunicados')) activeItem.value = 'Comunicados'
  
  setTimeout(() => createIcons({ icons }), 500)
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
      <ModalComunicado :mostrar="modalAbierto" :cursos="cursos" @cerrar="modalAbierto = false" @actualizar="cargarDatos" />
    </Teleport>

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
            { name: 'Comunicados', icon: 'send', badge: comunicados.length, route: '/profesor/comunicados' },
            
            { name: 'Cursos', icon: 'book-open', badge: cursos.length, route: '/profesor/cursos' },
            
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
          
          <span v-if="item.badge" :class="['px-2 py-0.5 text-xs font-bold rounded-full transition-all', activeItem === item.name ? 'bg-white text-blue-600 shadow-sm' : 'bg-blue-500/20 text-blue-400 animate-pulse-subtle']">
            {{ item.badge }}
          </span>
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

    <main class="md:ml-72 min-h-screen relative z-10">
      
      <header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
            <button class="md:hidden text-slate-400 hover:text-white" @click="toggleSidebar"><i data-lucide="menu" class="w-6 h-6"></i></button>
            <div>
              <h1 class="text-2xl font-bold text-white tracking-tight">Comunicados</h1>
              <p class="text-xs text-slate-400 hidden sm:block">Gestiona los anuncios y circulares</p>
            </div>
        </div>
        <button @click="modalAbierto = true" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95">
            <i data-lucide="plus" class="w-5 h-5"></i> <span class="hidden sm:inline">Redactar Nuevo</span>
        </button>
      </header>

      <div class="p-6 max-w-7xl mx-auto space-y-6">
        
        <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-1.5 flex flex-col sm:flex-row gap-2 shadow-xl">
            <div class="flex-1 relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <i data-lucide="filter" class="w-4 h-4"></i>
                </div>
                <select v-model="cursoFiltro" class="w-full bg-slate-950/50 border-0 rounded-xl py-3 pl-10 pr-10 text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-slate-800/50 transition-colors appearance-none">
                    <option value="Todos">Todos los Cursos</option>
                    <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
                  <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </div>
            </div>
            
            <div class="flex-1 relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <i data-lucide="tag" class="w-4 h-4"></i>
                </div>
                <select v-model="tipoFiltro" class="w-full bg-slate-950/50 border-0 rounded-xl py-3 pl-10 pr-10 text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer hover:bg-slate-800/50 transition-colors appearance-none">
                    <option value="Todos">Todos los Tipos</option>
                    <option value="REUNION">Reunión</option>
                    <option value="AVISO">Aviso</option>
                    <option value="CITACION">Citación</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
                  <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </div>
            </div>
        </div>

        <div v-if="cargando" class="py-32 text-center">
            <div class="relative w-16 h-16 mx-auto mb-4">
              <div class="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-slate-400 animate-pulse">Sincronizando...</p>
        </div>

        <div v-else-if="comunicadosFiltrados.length > 0" class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <div 
              v-for="item in comunicadosFiltrados" 
              :key="item.id" 
              class="group bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden"
            >
                <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div class="flex justify-between items-start mb-4 relative z-10">
                    <div class="flex items-center gap-2">
                        <span :class="`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${getTipoEstilo(item.tipo)}`">
                            <i :data-lucide="getIconoTipo(item.tipo)" class="w-3 h-3"></i>
                            {{ item.tipo }}
                        </span>
                        <span class="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700/50">
                           {{ item.fecha }}
                        </span>
                    </div>
                    
                    <button @click="eliminarComunicado(item.id)" class="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="flex-1 mb-4 relative z-10">
                    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{{ item.titulo }}</h3>
                    <p class="text-slate-400 text-sm line-clamp-2 leading-relaxed">{{ item.mensaje }}</p>
                </div>

                <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div class="flex gap-4">
                       <div class="flex flex-col">
                          <span class="text-[10px] uppercase text-slate-500 font-bold">Leído</span>
                          <div class="flex items-center gap-1.5">
                             <div class="w-1.5 h-1.5 rounded-full" :class="item.leido > 0 ? 'bg-green-400 shadow-green-400/50 shadow-sm' : 'bg-slate-700'"></div>
                             <span class="text-sm font-medium text-slate-200">{{ item.leido }}%</span>
                          </div>
                       </div>
                       <div class="flex flex-col">
                          <span class="text-[10px] uppercase text-slate-500 font-bold">Conf.</span>
                          <div class="flex items-center gap-1.5">
                             <div class="w-1.5 h-1.5 rounded-full" :class="item.confirmado > 0 ? 'bg-blue-400 shadow-blue-400/50 shadow-sm' : 'bg-slate-700'"></div>
                             <span class="text-sm font-medium text-slate-200">{{ item.confirmado }}%</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      @click="verDetalle(item.id)" 
                      class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
                    >
                       Ver Detalle <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="py-24 text-center bg-slate-900/20 backdrop-blur-sm rounded-3xl border border-slate-800/50 border-dashed animate-fade-in">
            <div class="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="inbox" class="w-10 h-10 text-slate-600"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No se encontraron comunicados</h3>
            <p class="text-slate-500 mb-6">No hay registros que coincidan con los filtros.</p>
            <button @click="cursoFiltro='Todos'; tipoFiltro='Todos'" class="text-blue-400 hover:text-blue-300 text-sm font-medium underline underline-offset-4">
                Limpiar filtros
            </button>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Animations pulse */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}
.animate-pulse-subtle { animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3b82f6, #6366f1); border-radius: 10px; border: 2px solid rgba(15, 23, 42, 0.5); transition: all 0.3s ease; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #60a5fa, #818cf8); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>