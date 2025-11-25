<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// ==================== STATE ====================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// UI State
const sidebarOpen = ref(false)
const modalLogout = ref(false)
const windowWidth = ref(window.innerWidth)
const activeItem = ref('Configuracion') // Marcamos Configuración como activo
const loadingGuardar = ref(false)

// Datos (Simulados)
const perfil = ref({
  nombre: authStore.user?.nombre || 'Pedro',
  apellido: 'Torres Muñoz',
  email: 'pedro.torres@colegioarica.cl',
  telefono: '+56 9 1234 5678',
  bio: 'Profesor de Matemáticas y Física con 10 años de experiencia.'
})

const seguridad = ref({
  passwordActual: '',
  passwordNueva: '',
  confirmarPassword: ''
})

const notificaciones = ref({
  emailResumen: true,
  alertasPush: true,
  sonido: false,
  mensajesPadres: true
})

// ==================== COMPUTED ====================
const nombreUsuario = computed(() => authStore.user?.nombre || 'Profesor')
const isMobile = computed(() => windowWidth.value < 768)

// ==================== METHODS ====================

const guardarCambios = () => {
  loadingGuardar.value = true
  setTimeout(() => {
    loadingGuardar.value = false
    alert('✅ Cambios guardados correctamente')
  }, 1500)
}

// Lógica de Navegación (IGUAL AL DASHBOARD)
function setActive(item) {
  if (item.route) {
    router.push(item.route)
  }
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
  window.addEventListener('resize', updateWidth)
  setTimeout(() => createIcons({ icons }), 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-[Inter] relative overflow-hidden">
    
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-20 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.03)_1px,transparent_0)] [background-size:50px_50px]"></div>
    </div>

    <Teleport to="body">
      <div v-if="modalLogout" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" @click.self="modalLogout = false">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-700 max-w-sm w-full shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Cerrar Sesión</h3>
          <p class="text-slate-400 mb-6">¿Estás seguro de que deseas salir?</p>
          <div class="flex gap-3">
            <button @click="modalLogout = false" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">Cancelar</button>
            <button @click="confirmarLogout" class="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl text-white font-medium shadow-lg shadow-red-900/20">Salir</button>
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
        <button 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group active:scale-95 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20 shadow-sm"
        >
          <i data-lucide="settings" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"></i>
          <span class="text-sm font-medium">Configuración</span>
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
              <h1 class="text-2xl font-bold text-white tracking-tight">Configuración</h1>
              <p class="text-xs text-slate-400 hidden sm:block">Administra tu perfil y preferencias</p>
            </div>
        </div>
        <div class="flex gap-3">
            <button 
              @click="router.push('/dashboard-profesor')" 
              class="hidden sm:flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors items-center gap-2"
            >
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Volver
            </button>
            <button 
              @click="guardarCambios" 
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="loadingGuardar"
            >
                <span v-if="loadingGuardar" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <i v-else data-lucide="save" class="w-4 h-4"></i> 
                {{ loadingGuardar ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
        </div>
      </header>

      <div class="p-4 sm:p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
            
            <section class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <div class="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><i data-lucide="user" class="w-5 h-5"></i></div>
                    Información Personal
                </h2>
                
                <div class="flex flex-col sm:flex-row gap-6 mb-6 items-start">
                    <div class="relative group cursor-pointer mx-auto sm:mx-0">
                        <div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center relative">
                            <span class="text-3xl font-bold text-slate-500">{{ perfil.nombre[0] }}</span>
                            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <i data-lucide="camera" class="w-6 h-6 text-white"></i>
                            </div>
                        </div>
                        <span class="text-[10px] text-center block mt-2 text-blue-400 group-hover:underline">Cambiar foto</span>
                    </div>

                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <div class="space-y-1">
                            <label class="text-xs text-slate-400 font-medium uppercase">Nombre</label>
                            <input v-model="perfil.nombre" type="text" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs text-slate-400 font-medium uppercase">Apellidos</label>
                            <input v-model="perfil.apellido" type="text" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1 sm:col-span-2">
                            <label class="text-xs text-slate-400 font-medium uppercase">Biografía</label>
                            <textarea v-model="perfil.bio" rows="2" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                    <div class="space-y-1">
                        <label class="text-xs text-slate-400 font-medium uppercase">Email</label>
                        <div class="relative">
                            <i data-lucide="mail" class="w-4 h-4 absolute left-3 top-3 text-slate-500"></i>
                            <input v-model="perfil.email" type="email" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs text-slate-400 font-medium uppercase">Teléfono</label>
                        <div class="relative">
                            <i data-lucide="phone" class="w-4 h-4 absolute left-3 top-3 text-slate-500"></i>
                            <input v-model="perfil.telefono" type="tel" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <div class="p-1.5 bg-orange-500/10 rounded-lg text-orange-400"><i data-lucide="shield-check" class="w-5 h-5"></i></div>
                    Seguridad
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1 sm:col-span-2">
                        <label class="text-xs text-slate-400 font-medium uppercase">Contraseña Actual</label>
                        <input v-model="seguridad.passwordActual" type="password" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs text-slate-400 font-medium uppercase">Nueva Contraseña</label>
                        <input v-model="seguridad.passwordNueva" type="password" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs text-slate-400 font-medium uppercase">Confirmar Contraseña</label>
                        <input v-model="seguridad.confirmarPassword" type="password" class="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all">
                    </div>
                </div>
            </section>

        </div>

        <div class="space-y-6">
            <section class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
                <h2 class="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <div class="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><i data-lucide="bell" class="w-5 h-5"></i></div>
                    Notificaciones
                </h2>
                
                <div class="space-y-6">
                    
                    <div class="flex items-center justify-between group">
                        <div>
                            <p class="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Resumen por Email</p>
                            <p class="text-xs text-slate-500">Recibe un resumen semanal.</p>
                        </div>
                        <button 
                            @click="notificaciones.emailResumen = !notificaciones.emailResumen"
                            class="w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5"
                            :class="notificaciones.emailResumen ? 'bg-purple-600' : 'bg-slate-700'"
                        >
                            <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" :class="notificaciones.emailResumen ? 'translate-x-5' : 'translate-x-0'"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between group">
                        <div>
                            <p class="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Alertas Push</p>
                            <p class="text-xs text-slate-500">Notificaciones en el navegador.</p>
                        </div>
                        <button 
                            @click="notificaciones.alertasPush = !notificaciones.alertasPush"
                            class="w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5"
                            :class="notificaciones.alertasPush ? 'bg-purple-600' : 'bg-slate-700'"
                        >
                            <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" :class="notificaciones.alertasPush ? 'translate-x-5' : 'translate-x-0'"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between group">
                        <div>
                            <p class="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Sonidos</p>
                            <p class="text-xs text-slate-500">Reproducir sonido al recibir mensajes.</p>
                        </div>
                        <button 
                            @click="notificaciones.sonido = !notificaciones.sonido"
                            class="w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5"
                            :class="notificaciones.sonido ? 'bg-purple-600' : 'bg-slate-700'"
                        >
                            <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" :class="notificaciones.sonido ? 'translate-x-5' : 'translate-x-0'"></div>
                        </button>
                    </div>

                    <div class="pt-6 border-t border-slate-800/50">
                        <div class="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                            <div class="flex gap-3">
                                <i data-lucide="info" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                                <div>
                                    <p class="text-sm font-medium text-blue-200">¿Necesitas ayuda?</p>
                                    <p class="text-xs text-blue-300/70 mt-1">Contacta al departamento de TI si necesitas cambiar tu correo institucional.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
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
  animation: fade-in 0.3s ease-out forwards;
}

/* Scrollbar */
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
</style>