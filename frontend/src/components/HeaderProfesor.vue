<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const showMenu = ref(false)
const showNotifications = ref(false)
const profesorNombre = ref(localStorage.getItem('nombre') || 'Profesor')
const notificaciones = ref([
  { id: 1, titulo: 'Nueva reunión programada', fecha: 'Hace 5 min', leida: false },
  { id: 2, titulo: 'Comunicado enviado exitosamente', fecha: 'Hace 1 hora', leida: false },
  { id: 3, titulo: 'Apoderado confirmó asistencia', fecha: 'Hace 2 horas', leida: true }
])

const notificacionesNoLeidas = ref(notificaciones.value.filter(n => !n.leida).length)

function toggleMenu() {
  showMenu.value = !showMenu.value
  showNotifications.value = false
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showMenu.value = false
}

function handleLogout() {
  showMenu.value = false
  // Aquí tu lógica de logout
  authStore.logout()
  router.push('/')
}

function handleClickOutside(event) {
  if (!event.target.closest('.menu-container') && !event.target.closest('.notifications-container')) {
    showMenu.value = false
    showNotifications.value = false
  }
}

onMounted(() => {
  createIcons({ icons })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="fixed top-0 left-0 w-full h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 flex justify-between items-center px-4 sm:px-6 z-50 shadow-2xl">
    
    <!-- Logo y título -->
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer group">
        <span class="text-lg font-black text-white transform -rotate-12 group-hover:rotate-0 transition-transform">EC</span>
      </div>
      <div>
        <h1 class="text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          Web EduCom
        </h1>
        <p class="text-xs text-slate-500 hidden sm:block">Gestión Educativa</p>
      </div>
    </div>

    <!-- Acciones del usuario -->
    <div class="flex items-center gap-3 sm:gap-4">
      
      <!-- Botón de notificaciones -->
      <div class="relative notifications-container">
        <button
          @click="toggleNotifications"
          class="relative p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-blue-500 active:scale-95 group"
          title="Notificaciones"
        >
          <i data-lucide="bell" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
          <span
            v-if="notificacionesNoLeidas > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-lg shadow-red-500/50 animate-pulse-subtle"
          >
            {{ notificacionesNoLeidas }}
          </span>
        </button>

        <!-- Dropdown de notificaciones -->
        <Transition name="dropdown">
          <div
            v-if="showNotifications"
            class="absolute top-14 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl w-80 sm:w-96 max-h-96 overflow-hidden animate-scale-in"
          >
            <!-- Header -->
            <div class="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white">Notificaciones</h3>
                <span class="text-xs text-slate-400">{{ notificacionesNoLeidas }} nuevas</span>
              </div>
            </div>

            <!-- Lista de notificaciones -->
            <div class="max-h-80 overflow-y-auto custom-scrollbar">
              <div
                v-for="notif in notificaciones"
                :key="notif.id"
                :class="[
                  'p-4 border-b border-slate-800/50 hover:bg-slate-800/50 transition-all cursor-pointer',
                  !notif.leida && 'bg-blue-500/5'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div :class="`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.leida ? 'bg-slate-600' : 'bg-blue-500 animate-pulse'}`"></div>
                  <div class="flex-1 min-w-0">
                    <p :class="`text-sm mb-1 ${notif.leida ? 'text-slate-400' : 'text-white font-semibold'}`">
                      {{ notif.titulo }}
                    </p>
                    <p class="text-xs text-slate-500">{{ notif.fecha }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-3 border-t border-slate-800 bg-slate-900/50">
              <button class="w-full text-center text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Perfil del usuario -->
      <div class="relative menu-container">
        <button
          @click="toggleMenu"
          class="flex items-center gap-2 sm:gap-3 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 hover:border-blue-500 active:scale-95 group"
        >
          <!-- Avatar -->
          <div class="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
              class="w-9 h-9 rounded-full border-2 border-blue-500 shadow-lg group-hover:scale-110 transition-transform"
              alt="Avatar"
            />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          
          <!-- Nombre -->
          <div class="hidden sm:block text-left">
            <p class="font-semibold text-white text-sm leading-tight">{{ profesorNombre }}</p>
            <p class="text-xs text-slate-400">Profesor</p>
          </div>

          <!-- Chevron -->
          <i
            data-lucide="chevron-down"
            :class="[
              'w-4 h-4 text-slate-400 transition-transform duration-300',
              showMenu && 'rotate-180'
            ]"
          ></i>
        </button>

        <!-- Menú desplegable -->
        <Transition name="dropdown">
          <div
            v-if="showMenu"
            class="absolute top-14 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl w-56 overflow-hidden animate-scale-in"
          >
            <!-- Info del usuario -->
            <div class="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <p class="font-bold text-white text-sm mb-1">{{ profesorNombre }}</p>
              <p class="text-xs text-slate-400">profesor@educom.cl</p>
            </div>

            <!-- Opciones del menú -->
            <div class="p-2">
              <button
                class="w-full px-4 py-3 text-left hover:bg-slate-800 text-slate-300 hover:text-white text-sm flex items-center gap-3 rounded-xl transition-all group"
              >
                <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <i data-lucide="user" class="w-4 h-4 text-blue-400"></i>
                </div>
                <span class="font-medium">Mi Perfil</span>
              </button>
              
              <button
                class="w-full px-4 py-3 text-left hover:bg-slate-800 text-slate-300 hover:text-white text-sm flex items-center gap-3 rounded-xl transition-all group"
              >
                <div class="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <i data-lucide="settings" class="w-4 h-4 text-indigo-400"></i>
                </div>
                <span class="font-medium">Configuración</span>
              </button>

              <button
                class="w-full px-4 py-3 text-left hover:bg-slate-800 text-slate-300 hover:text-white text-sm flex items-center gap-3 rounded-xl transition-all group"
              >
                <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <i data-lucide="help-circle" class="w-4 h-4 text-purple-400"></i>
                </div>
                <span class="font-medium">Ayuda</span>
              </button>
            </div>

            <!-- Cerrar sesión -->
            <div class="p-2 border-t border-slate-800">
              <button
                @click="handleLogout"
                class="w-full px-4 py-3 text-left hover:bg-red-900/30 text-red-400 hover:text-red-300 text-sm flex items-center gap-3 rounded-xl transition-all border border-red-900/20 hover:border-red-800/50 group font-semibold"
              >
                <div class="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <i data-lucide="log-out" class="w-4 h-4 text-red-400"></i>
                </div>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Animaciones */
@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
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

.animate-scale-in {
  animation: scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Transiciones de dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
