<script setup>
// ==================== IMPORTS ====================
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { profesorService } from '@/services/profesorService'
import ModalComunicado from '@/components/ModalComunicado.vue'

// ==================== REACTIVE STATE ====================
const authStore = useAuthStore()
const router = useRouter()

// Modales
const modalAbierto = ref(false)
const modalDetalle = ref(false)
const modalLogout = ref(false)

// UI State
const sidebarOpen = ref(false)
const activeItem = ref('Dashboard')
const windowWidth = ref(window.innerWidth)
const isLoading = ref(true)
const cargandoDetalle = ref(false)

// Data del backend
const cursos = ref([])
const resumen = ref(null)
const notificaciones = ref([])
const comunicados = ref([])
const comunicadoSeleccionado = ref(null)
const cursoSeleccionado = ref('Todos')

// ==================== COMPUTED PROPERTIES ====================
const isMobile = computed(() => windowWidth.value < 768)
const nombreUsuario = computed(() => authStore.user?.nombre || 'Profesor')

const comunicadosFiltrados = computed(() => {
  if (cursoSeleccionado.value === 'Todos') return comunicados.value
  return comunicados.value.filter(c => c.cursoId === cursoSeleccionado.value)
})

// ==================== METHODS ====================
async function cargarDatos() {
  try {
    isLoading.value = true
    const [rResumen, rNotif, rCursos, rComunicados] = await Promise.all([
      profesorService.obtenerResumen(),
      profesorService.obtenerNotificaciones(),
      profesorService.obtenerCursos(),
      profesorService.obtenerComunicadosRecientes()
    ])

    // --- Resumen (Tarjetas de arriba)
    resumen.value = {
      totalEnviados: rResumen.data?.totalEnviados ?? 0,
      tasaConfirmacion: rResumen.data?.tasaConfirmacion ?? 0,
      pendientes: rResumen.data?.pendientes ?? 0
    }

    // --- Notificaciones y cursos
    notificaciones.value = rNotif.data || []
    cursos.value = rCursos.data || []

    // --- Comunicados recientes (con formato corregido)
    comunicados.value = (rComunicados.data || []).map(c => {
      const fechaValida = c.fecha
        ? new Date(c.fecha)
        : null

      return {
        id: c.id,
        titulo: c.titulo || 'Sin título',
        tipo: c.tipo || 'General',
        fecha: fechaValida && !isNaN(fechaValida)
          ? fechaValida.toLocaleDateString('es-CL', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Sin fecha',
        porcentajeLeido: Number(c.porcentajeLeido ?? 0),
        porcentajeConfirmado: Number(c.porcentajeConfirmado ?? 0),
        cursoNombre: Array.isArray(c.cursos) ? c.cursos.join(', ') : 'Todos',
        cursoId: c.cursoId ?? null
      }
    })
  } catch (err) {
    console.error('Error al cargar datos:', err)
  } finally {
    isLoading.value = false
  }
}



async function verDetalle(id) {
  try {
    cargandoDetalle.value = true
    const res = await profesorService.obtenerComunicado(id)
    comunicadoSeleccionado.value = res.data
    modalDetalle.value = true
    
    setTimeout(() => createIcons({ icons }), 100)
  } catch (err) {
    console.error('Error al obtener detalle:', err)
    alert('No se pudo cargar el detalle del comunicado.')
  } finally {
    cargandoDetalle.value = false
  }
}

function cerrarDetalle() {
  modalDetalle.value = false
  comunicadoSeleccionado.value = null
}

function handleLogout() {
  modalLogout.value = true
}

async function confirmarLogout() {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

function setActive(item) {
  activeItem.value = item
  sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function updateWidth() {
  windowWidth.value = window.innerWidth
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    if (modalLogout.value) {
      modalLogout.value = false
    } else if (modalDetalle.value) {
      cerrarDetalle()
    } else if (sidebarOpen.value) {
      sidebarOpen.value = false
    }
  }
}

// ==================== LIFECYCLE HOOKS ====================
onMounted(async () => {
  createIcons({ icons })
  await cargarDatos()
  
  window.addEventListener('resize', updateWidth)
  window.addEventListener('keydown', handleEscape)
  
  setTimeout(() => {
    createIcons({ icons })
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div class="dashboard-container">
    
    <!-- Modal Nuevo Comunicado -->
    <Teleport to="body">
      <ModalComunicado 
        :mostrar="modalAbierto" 
        :cursos="cursos"
        @cerrar="modalAbierto = false"
        @actualizar="cargarDatos"
      />
    </Teleport>

    <!-- Modal Detalle Comunicado MEJORADO -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="modalDetalle" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          @click.self="cerrarDetalle"
        >
          <div 
            class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-3xl shadow-2xl shadow-blue-500/10 transform transition-all animate-slide-up overflow-hidden"
            @click.stop
          >
            <!-- Header del Modal -->
            <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i data-lucide="file-text" class="w-6 h-6 text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white">Detalle del Comunicado</h3>
                    <p class="text-sm text-slate-400">Información completa</p>
                  </div>
                </div>
                <button 
                  @click="cerrarDetalle" 
                  class="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95 group"
                  aria-label="Cerrar"
                >
                  <i data-lucide="x" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"></i>
                </button>
              </div>
            </div>

            <!-- Body del Modal -->
            <div v-if="cargandoDetalle" class="p-12 flex flex-col items-center justify-center">
              <div class="relative">
                <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
                <div class="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p class="mt-4 text-slate-400 text-sm">Cargando información...</p>
            </div>

            <div v-else-if="comunicadoSeleccionado" class="p-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <!-- Título destacado -->
              <div class="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
                <h4 class="text-xl font-bold text-white mb-2">{{ comunicadoSeleccionado.titulo }}</h4>
                <p class="text-slate-300 leading-relaxed whitespace-pre-line">{{ comunicadoSeleccionado.mensaje }}</p>
              </div>

              <!-- Grid de información -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                  <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="tag" class="w-4 h-4 text-blue-400"></i>
                    <p class="text-xs text-slate-400 uppercase font-semibold">Tipo</p>
                  </div>
                  <p class="text-white font-semibold text-lg">{{ comunicadoSeleccionado.tipo }}</p>
                </div>
                <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                  <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="calendar" class="w-4 h-4 text-indigo-400"></i>
                    <p class="text-xs text-slate-400 uppercase font-semibold">Fecha</p>
                  </div>
                  <p class="text-white font-semibold text-lg">{{ comunicadoSeleccionado.fecha }}</p>
                </div>
              </div>

              <!-- Cursos involucrados -->
              <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <div class="flex items-center gap-2 mb-3">
                  <i data-lucide="school" class="w-5 h-5 text-purple-400"></i>
                  <p class="text-sm text-slate-300 font-semibold">Cursos Involucrados</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(curso, idx) in (comunicadoSeleccionado.cursos || ['General'])" 
                    :key="idx"
                    class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium text-white"
                  >
                    {{ curso }}
                  </span>
                </div>
              </div>

              <!-- Tabla de apoderados -->
              <div v-if="comunicadoSeleccionado.apoderados?.length" class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <i data-lucide="users" class="w-5 h-5 text-green-400"></i>
                    <p class="text-sm text-slate-300 font-semibold">Apoderados</p>
                  </div>
                  <span class="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-bold text-green-300">
                    {{ comunicadoSeleccionado.apoderados.length }} Total
                  </span>
                </div>
                
                <div class="max-h-64 overflow-y-auto custom-scrollbar border border-slate-700 rounded-xl">
                  <table class="w-full text-sm">
                    <thead class="bg-slate-800/80 text-slate-300 uppercase text-xs sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th class="px-4 py-3 text-left font-semibold">Nombre</th>
                        <th class="px-4 py-3 text-center font-semibold">Leído</th>
                        <th class="px-4 py-3 text-center font-semibold">Confirmado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="ap in comunicadoSeleccionado.apoderados"
                        :key="ap.id"
                        class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                      >
                        <td class="px-4 py-3 text-slate-200 font-medium">{{ ap.nombre }}</td>
                        <td class="px-4 py-3 text-center">
                          <div class="flex justify-center">
                            <span :class="ap.leido ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'" class="px-2 py-1 rounded-lg border inline-flex items-center gap-1.5">
                              <i :data-lucide="ap.leido ? 'check-circle-2' : 'circle'" class="w-3.5 h-3.5"></i>
                              <span class="text-xs font-semibold">{{ ap.leido ? 'Sí' : 'No' }}</span>
                            </span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <div class="flex justify-center">
                            <span :class="ap.confirmado ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600'" class="px-2 py-1 rounded-lg border inline-flex items-center gap-1.5">
                              <i :data-lucide="ap.confirmado ? 'check-check' : 'clock'" class="w-3.5 h-3.5"></i>
                              <span class="text-xs font-semibold">{{ ap.confirmado ? 'Sí' : 'Pendiente' }}</span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Footer del Modal -->
            <div class="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center">
              <div class="text-xs text-slate-400">
                <i data-lucide="info" class="w-3.5 h-3.5 inline mr-1"></i>
                Información actualizada
              </div>
              <button
                @click="cerrarDetalle"
                class="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl transition-all font-semibold border border-slate-600 hover:border-slate-500 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Confirmación Logout -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="modalLogout" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          @click.self="modalLogout = false"
        >
          <div 
            class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-md shadow-2xl shadow-red-500/10 transform transition-all animate-slide-up overflow-hidden"
            @click.stop
          >
            <!-- Header del Modal -->
            <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center border-2 border-red-400/20 shadow-lg shadow-red-500/30">
                  <i data-lucide="log-out" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">Cerrar Sesión</h3>
                  <p class="text-sm text-slate-400 mt-1">Esta acción requiere confirmación</p>
                </div>
              </div>
            </div>

            <!-- Body del Modal -->
            <div class="p-6 space-y-4">
              <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p class="text-slate-200 text-sm mb-2 flex items-center gap-2">
                  <i data-lucide="user" class="w-4 h-4 text-blue-400"></i>
                  Usuario: <span class="font-semibold text-white ml-1">{{ nombreUsuario }}</span>
                </p>
                <p class="text-slate-400 text-sm flex items-start gap-2">
                  <i data-lucide="alert-triangle" class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0"></i>
                  <span>Al cerrar sesión deberás ingresar tus credenciales nuevamente para acceder al sistema.</span>
                </p>
              </div>
            </div>

            <!-- Footer del Modal -->
            <div class="p-6 border-t border-slate-700/50 bg-slate-900/50 flex gap-3">
              <button
                @click="modalLogout = false"
                class="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-semibold border border-slate-700 hover:border-slate-600 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Cancelar
              </button>
              <button
                @click="confirmarLogout"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-bold shadow-xl shadow-red-600/30 hover:shadow-red-600/60 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 group"
              >
                <i data-lucide="log-out" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 min-h-screen font-[Inter] relative overflow-hidden">
      
      <!-- Efectos de fondo animados -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-48 left-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        <!-- Grid decorativo -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.03)_1px,transparent_0)] [background-size:50px_50px]"></div>
      </div>

      <!-- ==================== SIDEBAR ==================== -->
      <aside
        :class="[
          'bg-slate-900/95 backdrop-blur-xl flex flex-col shadow-2xl border-r border-slate-800/50 transition-all duration-300 ease-out',
          'fixed top-0 left-0 h-full z-50',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'w-64 md:w-72'
        ]"
      >
        <!-- Logo y título -->
        <div class="p-6 border-b border-slate-800/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
                <span class="text-lg font-black text-white transform -rotate-12">EC</span>
              </div>
              <div>
                <span class="text-lg font-bold text-white block">Web EduCom</span>
                <span class="text-xs text-slate-500">Gestión Educativa</span>
              </div>
            </div>

            <button 
              class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all active:scale-95" 
              @click="toggleSidebar"
              aria-label="Cerrar menú"
            >
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Perfil del usuario -->
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

        <!-- Navegación -->
        <nav class="flex-grow px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div class="px-3 py-2 mb-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menú Principal</span>
          </div>

          <button
            v-for="item in [
              { name: 'Dashboard', icon: 'layout-dashboard' },
              { name: 'Comunicados', icon: 'send', badge: notificaciones.length || comunicados.length },
              { name: 'Apoderados', icon: 'users' },
              { name: 'Cursos', icon: 'book-open', badge: cursos.length },
              { name: 'Reportes', icon: 'bar-chart-3' }
            ]"
            :key="item.name"
            @click="setActive(item.name)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative active:scale-95',
              activeItem === item.name
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
            ]"
          >
            <div
              v-if="activeItem === item.name"
              class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full"
            ></div>

            <i :data-lucide="item.icon" class="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform"></i>
            <span class="flex-1 text-left text-sm">{{ item.name }}</span>
            
            <span
              v-if="item.badge"
              :class="[
                'px-2 py-0.5 text-xs font-bold rounded-full transition-all',
                activeItem === item.name
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-blue-500/20 text-blue-400 animate-pulse-subtle'
              ]"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>

        <!-- Footer del sidebar -->
        <div class="border-t border-slate-800/50 p-4 space-y-2">
          <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all group active:scale-95">
            <i data-lucide="settings" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"></i>
            <span class="text-sm">Configuración</span>
          </button>
          
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all border border-red-900/20 hover:border-red-800/50 active:scale-95 group"
          >
            <i data-lucide="log-out" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"></i>
            <span class="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Overlay móvil -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          @click="toggleSidebar"
        ></div>
      </Transition>

      <!-- ==================== CONTENIDO PRINCIPAL ==================== -->
      <main class="md:ml-72 min-h-screen relative z-10">
        
        <!-- Header fijo -->
        <header class="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
          <div class="px-4 sm:px-6 py-4">
            <div class="flex items-center justify-between gap-3">
              <button 
                class="md:hidden p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:scale-95"
                @click="toggleSidebar"
                aria-label="Abrir menú"
              >
                <i data-lucide="menu" class="w-6 h-6"></i>
              </button>

              <div class="flex-1 min-w-0">
                <h1 class="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-400 bg-clip-text text-transparent truncate animate-gradient">
                  {{ isMobile ? 'Dashboard' : `Bienvenido, ${nombreUsuario}` }}
                </h1>
                <p class="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
                  <i data-lucide="calendar" class="w-3 h-3 sm:w-4 sm:h-4"></i>
                  <span class="truncate">Panel de gestión · {{ new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
                </p>
              </div>

              <span class="hidden sm:flex bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20 relative overflow-hidden">
                <span class="absolute inset-0 bg-green-500/20 animate-ping"></span>
                <span class="relative flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  En línea
                </span>
              </span>

              <button 
                @click="modalAbierto = true"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-3 sm:px-5 rounded-xl inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-100 group"
              >
                <i data-lucide="plus" class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300"></i>
                <span class="hidden sm:inline text-sm">Nuevo</span>
              </button>

              <button
                @click="handleLogout"
                class="md:hidden p-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-xl transition-all active:scale-95"
                aria-label="Cerrar sesión"
              >
                <i data-lucide="log-out" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Contenido del dashboard -->
        <div class="p-4 sm:p-6 md:p-8">
          
          <!-- Loader -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p class="mt-4 text-slate-400 text-sm">Cargando dashboard...</p>
          </div>

          <template v-else>
            <!-- Tarjetas estadísticas MEJORADAS -->
            <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div
                v-for="(card, idx) in [
                  { 
                    title: 'Total Enviados', 
                    subtitle: 'Este Mes', 
                    value: resumen?.totalEnviados ?? 0, 
                    sub: '+5%', 
                    color: 'from-blue-500 to-cyan-500', 
                    icon: 'mail', 
                    trend: 'up' 
                  },
                  { 
                    title: 'Tasa Confirmación', 
                    subtitle: 'Promedio', 
                    value: resumen?.tasaConfirmacion ? resumen.tasaConfirmacion + '%' : '0%',
                    sub: 'Meta: >90%', 
                    color: 'from-green-500 to-emerald-500', 
                    icon: 'check-check', 
                    trend: 'up' 
                  },
                  { 
                    title: 'Pendientes', 
                    subtitle: 'Últimos 7 días', 
                    value: resumen?.pendientes ?? 0, 
                    sub: 'Requieren atención', 
                    color: 'from-yellow-500 to-orange-500', 
                    icon: 'alert-circle', 
                    trend: 'down' 
                  }
                ]"
                :key="idx"
                :style="{ animationDelay: `${idx * 100}ms` }"
                class="glass bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-800/50 hover:border-slate-700/70 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/10 group relative overflow-hidden cursor-pointer animate-slide-up"
              >
                <!-- Brillo superior -->
                <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <!-- Blob de fondo -->
                <div :class="`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`"></div>
                
                <div class="relative z-10">
                  <div class="flex items-start justify-between mb-3 sm:mb-4">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wide truncate">{{ card.title }}</h3>
                      <p class="text-xs text-slate-500 mt-0.5">{{ card.subtitle }}</p>
                    </div>
                    <div :class="`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`">
                      <i :data-lucide="card.icon" class="text-white w-4 h-4 sm:w-5 sm:h-5"></i>
                    </div>
                  </div>
                  
                  <div class="mb-2 sm:mb-3">
                    <p class="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1.5 tracking-tight">{{ card.value }}</p>
                    <span
                      :class="[
                        'text-xs sm:text-sm font-semibold inline-flex items-center gap-1',
                        card.trend === 'up' ? 'text-green-400' : 'text-orange-400'
                      ]"
                    >
                      <i :data-lucide="card.trend === 'up' ? 'trending-up' : 'trending-down'" class="w-3 h-3 sm:w-4 sm:h-4"></i>
                      {{ card.sub }}
                    </span>
                  </div>

                  <!-- Barra de progreso mejorada -->
                  <div class="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      :class="`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 ease-out relative`"
                      :style="{ width: (card.value.toString().replace('%', '')) + '%' || '70%' }"
                    >
                      <div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tabla de comunicados MEJORADA -->
            <section class="glass bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden animate-slide-up" style="animation-delay: 300ms;">
              
              <!-- Header de la tabla -->
              <div class="p-4 sm:p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/30 backdrop-blur-sm">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div class="flex-1 min-w-0">
                    <h2 class="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <i data-lucide="file-text" class="w-5 h-5 text-blue-400 flex-shrink-0"></i>
                      </div>
                      <span class="truncate">Comunicados Recientes</span>
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                      <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                      Mostrando {{ comunicadosFiltrados.length }} comunicados
                    </p>
                  </div>
                  
                  
                </div>
              </div>

              <!-- Vista Desktop: Tabla -->
              <div class="hidden lg:block overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider backdrop-blur-sm">
                    <tr>
                      <th class="px-6 py-4 font-semibold text-left">Título</th>
                      <th class="px-6 py-4 font-semibold text-left">Destinatario(s)</th>
                      <th class="px-6 py-4 font-semibold text-left">Fecha</th>
                      <th class="px-6 py-4 font-semibold text-center">% Leído</th>
                      <th class="px-6 py-4 font-semibold text-center">% Confirmado</th>
                      <th class="px-6 py-4 font-semibold text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in comunicadosFiltrados"
                      :key="item.id"
                      class="bg-slate-900/30 border-b border-slate-800/50 hover:bg-slate-800/50 transition-all group"
                    >
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all"></div>
                          <span class="font-semibold text-white group-hover:text-blue-400 transition-colors truncate max-w-xs">{{ item.titulo }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-slate-300">
                        <span class="flex items-center gap-2">
                          <i data-lucide="users-2" class="w-4 h-4 text-slate-500"></i>
                          <span class="truncate">{{ item.cursoNombre }}</span>
                        </span>
                      </td>
                      <td class="px-6 py-4 text-slate-400">
                        <span class="flex items-center gap-2">
                          <i data-lucide="calendar-days" class="w-4 h-4 text-slate-500"></i>
                          {{ item.fecha }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span
                          :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
                            item.porcentajeLeido >= 90
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
                          }`"
                        >
                          <i :data-lucide="item.porcentajeLeido >= 90 ? 'eye' : 'eye-off'" class="w-3.5 h-3.5"></i>
                          {{ item.porcentajeLeido.toFixed(0) }}%

                        </span>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span
                          :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
                            item.porcentajeConfirmado >= 90
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                          }`"
                        >
                          <i :data-lucide="item.porcentajeConfirmado >= 90 ? 'check-circle-2' : 'clock'" class="w-3.5 h-3.5"></i>
                          {{ item.porcentajeConfirmado }}%
                        </span>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <button 
                          @click="verDetalle(item.id)"
                          class="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all hover:scale-110 active:scale-100 group/btn"
                        >
                          <i data-lucide="eye" class="w-4 h-4 group-hover/btn:scale-110 transition-transform"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Vista Móvil: Tarjetas -->
              <div class="lg:hidden">
                <div
                  v-for="item in comunicadosFiltrados"
                  :key="item.id"
                  class="p-4 sm:p-5 border-b border-slate-800/50 hover:bg-slate-800/40 transition-all active:bg-slate-800/60 active:scale-[0.99]"
                >
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-white text-sm sm:text-base mb-1 line-clamp-2">{{ item.titulo }}</h3>
                      <p class="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                        <i data-lucide="calendar-days" class="w-3.5 h-3.5"></i>
                        {{ item.fecha }}
                      </p>
                    </div>
                    <button 
                      @click="verDetalle(item.id)"
                      class="p-2.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all active:scale-95 flex-shrink-0"
                    >
                      <i data-lucide="eye" class="w-5 h-5"></i>
                    </button>
                  </div>

                  <div class="flex items-center gap-2 mb-3 text-xs sm:text-sm text-slate-300">
                    <i data-lucide="users-2" class="w-4 h-4 text-slate-500 flex-shrink-0"></i>
                    <span class="truncate">{{ item.cursoNombre }}</span>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <span
                      :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                        item.porcentajeLeido >= 90
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`"
                    >
                      <i :data-lucide="item.porcentajeLeido >= 90 ? 'eye' : 'eye-off'" class="w-3.5 h-3.5"></i>
                      Leído: {{ item.porcentajeLeido.toFixed(0) }}%

                    </span>
                    <span
                      :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                        item.porcentajeConfirmado >= 90
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`"
                    >
                      <i :data-lucide="item.porcentajeConfirmado >= 90 ? 'check-circle-2' : 'clock'" class="w-3.5 h-3.5"></i>
                      Confirmado: {{ item.porcentajeConfirmado }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Estado vacío -->
              <div v-if="!comunicadosFiltrados.length" class="p-12 text-center text-slate-400">
                <div class="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                  <i data-lucide="inbox" class="w-8 h-8 text-slate-500"></i>
                </div>
                <p class="text-lg font-semibold mb-1 text-white">No hay comunicados</p>
                <p class="text-sm text-slate-500">{{ cursoSeleccionado === 'Todos' ? 'Aún no has enviado comunicados.' : 'No hay comunicados para este curso.' }}</p>
              </div>

              
            </section>
          </template>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ==============================
   🎨 Scrollbar Premium
   ============================== */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  border-radius: 10px;
  border: 2px solid rgba(15, 23, 42, 0.5);
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #60a5fa, #818cf8);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  border-radius: 10px;
  border: 2px solid #0f172a;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #4f46e5);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
}

* {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #0f172a;
}

/* ==============================
   🎯 Utilidades
   ============================== */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

* {
  -webkit-tap-highlight-color: transparent;
}

/* Glass morphism */
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* ==============================
   ✨ Animaciones
   ============================== */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9) rotate(-5deg);
  }
}

@keyframes gradient {
  0%, 100% {
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
  50% {
    background-size: 200% 200%;
    background-position: 100% 50%;
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-blob {
  animation: blob 12s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* ==============================
   🎭 Transiciones
   ============================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  animation: modal-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  animation: modal-leave 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes modal-enter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  50% {
    transform: scale(1.02) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

/* ==============================
   📱 Responsive
   ============================== */
@media (max-width: 768px) {
  .animate-slide-up {
    animation-duration: 0.4s;
  }
  
  .animate-blob {
    animation-duration: 8s;
  }
}

/* ==============================
   ♿ Accesibilidad
   ============================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ==============================
   🎨 Selección
   ============================== */
::selection {
  background: rgba(59, 130, 246, 0.3);
  color: white;
}

::-moz-selection {
  background: rgba(59, 130, 246, 0.3);
  color: white;
}
</style>
