<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
    
    <!-- Fondo animado -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/12 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/12 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-48 left-1/3 w-96 h-96 bg-purple-500/12 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:50px_50px]"></div>
    </div>

    <!-- Header con botón de cerrar sesión -->
    <header class="relative z-20 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl mb-8">
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

          <!-- Botones de acción -->
          <div class="flex items-center gap-3">
            <!-- Botón volver -->
            

            <!-- Cerrar sesión -->
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

    <!-- Contenido principal -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      
      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-down">
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i data-lucide="mail" class="w-6 h-6 text-blue-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ notificaciones.length }}</p>
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

      <!-- Estado de carga -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-400 text-sm animate-pulse">Cargando comunicados...</p>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="notificaciones.length === 0" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center">
          <i data-lucide="inbox" class="w-10 h-10 text-slate-500"></i>
        </div>
        <p class="text-xl font-bold mb-2 text-white">No hay comunicados</p>
        <p class="text-slate-400">No se encontraron notificaciones disponibles.</p>
      </div>

      <!-- Grid de comunicados -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ComunicadoCard
          v-for="(n, index) in notificaciones"
          :key="n.id"
          :notificacion="n"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-slide-up"
          @confirmar="confirmarAsistencia"
        />
      </div>
    </div>

    <!-- Modal de confirmación de logout -->
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
            <!-- Header del Modal -->
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

            <!-- Body del Modal -->
            <div class="p-6">
              <p class="text-slate-300 text-sm mb-2">
                Al cerrar sesión deberás ingresar tus credenciales nuevamente para acceder al sistema.
              </p>
            </div>

            <!-- Footer del Modal -->
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

    <!-- Toast de confirmación -->
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

// Estado
const notificaciones = ref([])
const loading = ref(true)
const modalLogout = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const nombreApoderado = ref(localStorage.getItem('nombre') || 'Apoderado')

// Computed
const confirmados = computed(() => {
  return notificaciones.value.filter(n => n.confirmado).length
})

const pendientes = computed(() => {
  return notificaciones.value.filter(n => !n.confirmado).length
})

// Methods
const obtenerNotificaciones = async () => {
  try {
    loading.value = true
    const res = await apoderadoService.obtenerNotificaciones()
    notificaciones.value = res.data

    // Marcar todas como leídas automáticamente
    await apoderadoService.marcarTodasLeidas()
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    mostrarToast('Error al cargar los comunicados', 'error')
  } finally {
    loading.value = false
    setTimeout(() => createIcons({ icons }), 100)
  }
}

const confirmarAsistencia = async (id) => {
  try {
    await apoderadoService.confirmarAsistencia(id)
    const notif = notificaciones.value.find(n => n.id === id)
    if (notif) notif.confirmado = true
    
    mostrarToast('Asistencia confirmada correctamente')
    setTimeout(() => createIcons({ icons }), 100)
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    mostrarToast('No se pudo confirmar la asistencia', 'error')
  }
}

const cerrarSesion = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    mostrarToast('Error al cerrar sesión', 'error')
  }
}

const mostrarToast = (mensaje, tipo = 'success') => {
  toastMessage.value = mensaje
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(() => {
  obtenerNotificaciones()
  createIcons({ icons })
})
</script>

<style scoped>
/* Animaciones */
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

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-left {
  from {
    opacity: 0;
    transform: translateX(100px);
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

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-blob {
  animation: blob 12s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-slide-down {
  animation: slide-down 0.5s ease-out forwards;
}

.animate-slide-left {
  animation: slide-left 0.4s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
