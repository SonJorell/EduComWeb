<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
    <!-- Fondo animado -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/12 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/12 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-48 left-1/3 w-96 h-96 bg-purple-500/12 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:50px_50px]"></div>
    </div>

    <!-- Header -->
    <header class="relative z-20 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <i data-lucide="bell" class="w-6 h-6 text-white"></i>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Comunicados del Colegio
              </h1>
              <p class="text-sm text-slate-400">{{ nombreApoderado }}</p>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex items-center gap-3">
            <button
              @click="router.push('/apoderado/dashboard')"
              class="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700 hover:border-blue-500 active:scale-95 font-semibold"
              title="Volver al inicio"
            >
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span class="hidden sm:inline text-sm">Volver</span>
            </button>

            <button
              @click="modalLogout = true"
              class="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all border border-red-500/30 hover:border-red-500/50 active:scale-95 font-semibold"
            >
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span class="hidden sm:inline text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

      <!-- Barra de filtros -->
      <section class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <!-- Curso -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-medium">Curso</label>
            <div class="relative">
              <select
                v-model="cursoSeleccionado"
                class="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 px-3 py-2.5 pr-10 transition-all outline-none appearance-none cursor-pointer hover:bg-slate-700"
              >
                <option :value="TODOS">Todos</option>
                <option
                  v-for="c in cursosDisponibles"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.nombre }}
                </option>
              </select>
              <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- Tipo -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-medium">Tipo</label>
            <div class="relative">
              <select
                v-model="tipoSeleccionado"
                class="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 px-3 py-2.5 pr-10 transition-all outline-none appearance-none cursor-pointer hover:bg-slate-700"
              >
                <option :value="TODOS">Todos</option>
                <option value="REUNION">Reunión</option>
                <option value="AVISO">Aviso</option>
                <option value="ANOTACION">Anotación</option>
                <option value="FELICITACION">Felicitación</option>
              </select>
              <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- Desde -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-medium">Desde</label>
            <input
              type="date"
              v-model="fechaDesde"
              class="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 px-3 py-2.5 transition-all outline-none hover:bg-slate-700"
            />
          </div>

          <!-- Hasta + limpiar -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-medium">Hasta</label>
            <div class="flex gap-2">
              <input
                type="date"
                v-model="fechaHasta"
                class="flex-1 bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 px-3 py-2.5 transition-all outline-none hover:bg-slate-700"
              />
              <button
                @click="resetFiltros"
                class="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 flex items-center gap-1.5 active:scale-95"
                title="Limpiar filtros"
              >
                <i data-lucide="eraser" class="w-4 h-4"></i>
                <span class="hidden sm:inline text-xs">Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Estadísticas rápidas (sobre el conjunto filtrado) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-slide-down">
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i data-lucide="mail" class="w-6 h-6 text-blue-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ notificacionesFiltradas.length }}</p>
              <p class="text-xs text-slate-400">Total Comunicados</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-green-500/50 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i data-lucide="check-circle" class="w-6 h-6 text-green-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ confirmados }}</p>
              <p class="text-xs text-slate-400">Confirmados</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <i data-lucide="clock" class="w-6 h-6 text-yellow-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ pendientes }}</p>
              <p class="text-xs text-slate-400">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-400 text-sm animate-pulse">Cargando comunicados...</p>
      </div>

      <!-- Vacío -->
      <div v-else-if="notificacionesFiltradas.length === 0" class="text-center py-16 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center">
          <i data-lucide="inbox" class="w-10 h-10 text-slate-500"></i>
        </div>
        <p class="text-xl font-bold mb-2 text-white">No hay comunicados</p>
        <p class="text-slate-400">No se encontraron notificaciones con los filtros aplicados.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ComunicadoCard
          v-for="(n, index) in notificacionesFiltradas"
          :key="n.id"
          :notificacion="n"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-slide-up"
          @confirmar="confirmarAsistencia"
        />
      </div>
    </div>

    <!-- Modal Logout -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modalLogout"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          @click.self="modalLogout = false"
        >
          <div
            class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl w-full max-w-md shadow-2xl shadow-red-500/10 transform transition-all animate-scale-in"
            @click.stop
          >
            <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center border-2 border-red-400/20 shadow-lg shadow-red-500/30">
                  <i data-lucide="log-out" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">Cerrar Sesión</h3>
                  <p class="text-sm text-slate-400 mt-1">¿Estás seguro que deseas salir?</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <p class="text-slate-300 text-sm mb-2">
                Al cerrar sesión deberás ingresar tus credenciales nuevamente para acceder al sistema.
              </p>
            </div>

            <div class="p-6 border-t border-slate-700/50 bg-slate-900/50 flex gap-3">
              <button
                @click="modalLogout = false"
                class="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-semibold border border-slate-700 hover:border-slate-600 active:scale-95"
              >
                Cancelar
              </button>
              <button
                @click="cerrarSesion"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-bold shadow-xl shadow-red-600/30 hover:shadow-red-600/60 hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
              >
                <i data-lucide="log-out" class="w-4 h-4"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="showToast"
          class="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-600/30 flex items-center gap-3 animate-slide-left"
        >
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <i data-lucide="check-circle-2" class="w-5 h-5"></i>
          </div>
          <div>
            <p class="font-bold text-sm">¡Éxito!</p>
            <p class="text-xs opacity-90">{{ toastMessage }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { apoderadoService } from '../../services/apoderadoService'
import { useAuthStore } from '@/store/auth'
import ComunicadoCard from '../../components/apoderado/ComunicadoCard.vue'

const router = useRouter()
const authStore = useAuthStore()

// Constante para "Todos"
const TODOS = 'TODOS'

// Estado base
const notificaciones = ref([])             // Normalizadas
const loading = ref(true)
const modalLogout = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const nombreApoderado = ref(localStorage.getItem('nombre') || 'Apoderado')

// Filtros
const cursoSeleccionado = ref(TODOS)       // id (string) o 'TODOS'
const tipoSeleccionado = ref(TODOS)        // 'REUNION' | 'AVISO' | ... | 'TODOS'
const fechaDesde = ref('')
const fechaHasta = ref('')

// Helpers
const fmt = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

function parseFecha(fecha) {
  // Acepta Date | string | number; retorna Date válido o null
  if (!fecha) return null
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  return isNaN(d.getTime()) ? null : d
}

function normalizarNotificacion(n) {
  // Ajusta estos campos si tu backend usa otros nombres
  const id = n.id
  const tipo = (n.tipo || 'AVISO').toUpperCase()
  // Preferencia: createdAt -> fecha -> programadaPara
  const rawFecha = n.createdAt || n.fecha || n.programadaPara
  const fechaObj = parseFecha(rawFecha)
  const fechaISO = fechaObj ? fechaObj.toISOString() : null
  const fechaLabel = fechaObj ? fmt.format(fechaObj) : '—'

  // Curso: puede venir como cursoId/cursoNombre o arreglo cursos[]
  let cursoId = null
  let cursoNombre = 'General'
  if (Array.isArray(n.cursos) && n.cursos.length) {
    cursoNombre = n.cursos.join(', ')
    // si no hay id, generamos hash estable por nombre
    cursoId = `C:${cursoNombre}`
  } else {
    cursoId = n.cursoId ?? null
    cursoNombre = n.cursoNombre ?? (cursoId ? `Curso #${cursoId}` : 'General')
  }

  return {
    id,
    titulo: n.titulo || '(Sin título)',
    mensaje: n.mensaje || '',
    tipo,
    // Flags del apoderado:
    leido: Boolean(n.leido),
    confirmado: Boolean(n.confirmado),
    // Fechas:
    fechaISO,            // para filtros
    fechaLabel,          // para mostrar
    // Curso:
    cursoId: cursoId !== null ? String(cursoId) : null, // normalizamos a string
    cursoNombre
  }
}

// Cursos disponibles para el filtro (derivados de notificaciones)
const cursosDisponibles = computed(() => {
  const mapa = new Map()
  for (const n of notificaciones.value) {
    if (!n.cursoId) continue
    if (!mapa.has(n.cursoId)) mapa.set(n.cursoId, { id: n.cursoId, nombre: n.cursoNombre })
  }
  return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
})

// Conjunto filtrado
const notificacionesFiltradas = computed(() => {
  return notificaciones.value.filter(n => {
    // Curso
    if (cursoSeleccionado.value !== TODOS) {
      if (!n.cursoId || String(n.cursoId) !== String(cursoSeleccionado.value)) return false
    }
    // Tipo
    if (tipoSeleccionado.value !== TODOS && n.tipo !== tipoSeleccionado.value) return false
    // Fecha
    if (fechaDesde.value) {
      const d = parseFecha(fechaDesde.value + 'T00:00:00')
      if (d && n.fechaISO && new Date(n.fechaISO) < d) return false
    }
    if (fechaHasta.value) {
      const h = parseFecha(fechaHasta.value + 'T23:59:59')
      if (h && n.fechaISO && new Date(n.fechaISO) > h) return false
    }
    return true
  })
})

// Contadores basados en el conjunto filtrado
const confirmados = computed(() => notificacionesFiltradas.value.filter(n => n.confirmado).length)
const pendientes = computed(() => notificacionesFiltradas.value.filter(n => !n.confirmado).length)

// Métodos
async function obtenerNotificaciones() {
  try {
    loading.value = true
    const res = await apoderadoService.obtenerNotificaciones()
    const lista = Array.isArray(res.data) ? res.data : []

    // Normalizar y ordenar por fecha desc
    notificaciones.value = lista
      .map(normalizarNotificacion)
      .sort((a, b) => {
        const da = a.fechaISO ? new Date(a.fechaISO).getTime() : 0
        const db = b.fechaISO ? new Date(b.fechaISO).getTime() : 0
        return db - da
      })

    // Marcar como leídas automáticamente
    try {
      await apoderadoService.marcarTodasLeidas()
      // Reflejar en UI
      notificaciones.value = notificaciones.value.map(n => ({ ...n, leido: true }))
    } catch (e) {
      // no romper UI si falla el marcado
      console.warn('No se pudieron marcar todas como leídas:', e?.message || e)
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    mostrarToast('Error al cargar los comunicados', 'error')
  } finally {
    loading.value = false
    setTimeout(() => createIcons({ icons }), 100)
  }
}

async function confirmarAsistencia(id) {
  try {
    await apoderadoService.confirmarAsistencia(id)
    const idx = notificaciones.value.findIndex(n => n.id === id)
    if (idx !== -1) notificaciones.value[idx].confirmado = true
    mostrarToast('Asistencia confirmada correctamente')
    setTimeout(() => createIcons({ icons }), 100)
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    mostrarToast('No se pudo confirmar la asistencia', 'error')
  }
}

async function cerrarSesion() {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    mostrarToast('Error al cerrar sesión', 'error')
  }
}

function resetFiltros() {
  cursoSeleccionado.value = TODOS
  tipoSeleccionado.value = TODOS
  fechaDesde.value = ''
  fechaHasta.value = ''
}

function mostrarToast(mensaje) {
  toastMessage.value = mensaje
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

onMounted(async () => {
  await obtenerNotificaciones()
  createIcons({ icons })
})
</script>

<style scoped>
/* Animaciones (sin cambios) */
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(30px, -50px) scale(1.1) rotate(5deg); }
  66% { transform: translate(-20px, 20px) scale(0.9) rotate(-5deg); }
}
@keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slide-left { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes scale-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }

.animate-blob { animation: blob 12s ease-in-out infinite; }
.animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
.animate-slide-left { animation: slide-left 0.4s ease-out forwards; }
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
.animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100px); }

* { -webkit-tap-highlight-color: transparent; }
</style>
