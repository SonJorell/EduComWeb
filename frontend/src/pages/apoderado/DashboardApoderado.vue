<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { useAuthStore } from '@/store/auth'
import { apoderadoService } from '@/services/apoderadoService'
import ComunicadoCard from '@/components/apoderado/ComunicadoCard.vue'

const router = useRouter()
const authStore = useAuthStore()

// ==================== STATE ====================
const notificaciones = ref([])
const loading = ref(true)
const modalLogout = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Datos usuario
const nombreApoderado = computed(() => authStore.user?.nombre || 'Apoderado')
const nombreAlumno = ref('Cargando alumno...') // Estado inicial
const resumen = ref({ nuevos: 0, pendientes: 0, asistencia: 0 })

// Control
let intervaloActualizacion = null
let idsConocidos = new Set()

// ==================== METHODS ====================

// 1. CARGAR PERFIL (Para ver nombre del alumno)
const cargarPerfil = async () => {
  try {
    // Verificamos que el servicio exista
    if (apoderadoService.obtenerPerfil) {
        const res = await apoderadoService.obtenerPerfil()
        if (res.data && res.data.nombreAlumno) {
            nombreAlumno.value = res.data.nombreAlumno
        } else {
            nombreAlumno.value = 'Sin alumno asignado'
        }
    }
  } catch (error) {
    console.error('Error cargando perfil:', error)
    nombreAlumno.value = 'Alumno'
  }
}

// 📅 2. FIX FECHA (Método Manual - Infalible)
const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return 'Sin fecha';

  try {
    // Aseguramos que sea string ISO
    let fechaStr = fechaRaw;
    if (fechaRaw instanceof Date) {
        fechaStr = fechaRaw.toISOString();
    }

    // 1. Tomamos la parte de la fecha antes de la 'T' (2025-11-25)
    const soloFecha = fechaStr.toString().split('T')[0]; 
    
    // 2. Separamos Año, Mes y Día
    const [anio, mes, dia] = soloFecha.split('-');

    // 3. Retornamos ordenado (dd-mm-yyyy)
    return `${dia}-${mes}-${anio}`;
    
  } catch (error) {
    console.error("Error fecha:", fechaRaw);
    return 'Fecha inválida';
  }
};

// 🔔 3. PUSH NOTIFICATIONS
const solicitarPermisoPush = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

const dispararPush = (titulo, cuerpo) => {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const notif = new Notification(titulo, {
        body: cuerpo,
        icon: '/favicon.ico',
        vibrate: [200, 100, 200]
      });
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); 
      notif.onclick = () => { window.focus(); notif.close(); };
    } catch (e) { console.error(e); }
  }
}

// 🧠 4. AUTO-LECTURA
const procesarLecturaAutomatica = async (datos) => {
  if (document.visibilityState === 'visible') {
    const sinLeer = datos.filter(n => !n.leido)
    if (sinLeer.length > 0) {
      try {
        if (apoderadoService.marcarTodasLeidas) {
          await apoderadoService.marcarTodasLeidas()
          datos.forEach(n => n.leido = true)
        }
      } catch (e) { console.error(e) }
    }
  }
  return datos
}

// 🔄 5. CARGAR DATOS
async function cargarDatos(backgroundUpdate = false) {
  try {
    if (!backgroundUpdate) loading.value = true

    const res = await apoderadoService.obtenerNotificaciones()
    let datosRaw = res.data || []

    // Detectar nuevos para Push
    if (backgroundUpdate) {
      const nuevos = datosRaw.filter(n => !idsConocidos.has(n.id))
      if (nuevos.length > 0) {
        const ultimo = nuevos[0]
        dispararPush("Nuevo Comunicado", ultimo.titulo || "Tienes información nueva.")
        mostrarToast(`¡Tienes ${nuevos.length} comunicado(s) nuevo(s)!`)
      }
    }
    datosRaw.forEach(n => idsConocidos.add(n.id))

    // Mapeo de Datos con FIX DE FECHA
    let notificacionesProcesadas = datosRaw.map(n => ({
      ...n,
      id: n.id,
      titulo: n.titulo || '(Sin título)',
      tipo: n.tipo || 'GENERAL',
      fecha: formatearFecha(n.createdAt || n.fecha), // 👈 Aquí se aplica el fix
      leido: n.leido ?? false,
      confirmado: n.confirmado ?? false
    }))

    // Auto-lectura
    notificacionesProcesadas = await procesarLecturaAutomatica(notificacionesProcesadas)

    // Guardar
    notificaciones.value = notificacionesProcesadas

    // Resumen
    resumen.value = {
      nuevos: notificaciones.value.filter(n => !n.leido).length,
      pendientes: notificaciones.value.filter(n => !n.confirmado && (n.tipo === 'REUNION' || n.tipo === 'CITACION')).length,
      asistencia: 95 
    }

  } catch (error) {
    console.error('Error cargando datos:', error)
    if (!backgroundUpdate) mostrarToast('Error de conexión', 'error')
  } finally {
    if (!backgroundUpdate) {
      loading.value = false
      setTimeout(() => createIcons({ icons }), 100)
    }
  }
}

const confirmarAsistencia = async (id) => {
  try {
    await apoderadoService.confirmarAsistencia(id)
    const notif = notificaciones.value.find(n => n.id === id)
    if (notif) {
        notif.confirmado = true
        notif.leido = true
    }
    mostrarToast('Confirmación enviada correctamente')
    cargarDatos(true) 
  } catch (error) {
    mostrarToast('No se pudo confirmar', 'error')
  }
}

// Auth
function handleLogout() { modalLogout.value = true }
async function confirmarLogout() { await authStore.logout(); router.push('/') }

const mostrarToast = (mensaje) => {
  toastMessage.value = mensaje
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// ==================== LIFECYCLE ====================
onMounted(async () => {
  createIcons({ icons })
  await solicitarPermisoPush()
  
  // Carga inicial paralela
  await Promise.all([
      cargarDatos(false),
      cargarPerfil()
  ])

  // Polling cada 5 segundos
  intervaloActualizacion = setInterval(() => {
    if (document.visibilityState === 'visible') {
        cargarDatos(true)
    }
  }, 5000)

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") cargarDatos(true)
  });

  setTimeout(() => createIcons({ icons }), 100)
})

onUnmounted(() => {
  if (intervaloActualizacion) clearInterval(intervaloActualizacion)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-[Inter] relative overflow-x-hidden">
    
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:50px_50px]"></div>
    </div>

    <Teleport to="body">
      <div v-if="modalLogout" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" @click.self="modalLogout = false">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-700 max-w-sm w-full shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Cerrar Sesión</h3>
          <p class="text-slate-400 mb-6">¿Estás seguro de que deseas salir?</p>
          <div class="flex gap-3">
            <button @click="modalLogout = false" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors">Cancelar</button>
            <button @click="confirmarLogout" class="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl text-white shadow-lg shadow-red-900/20">Salir</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <Transition name="toast">
        <div v-if="showToast" class="fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-left">
          <i data-lucide="info" class="w-5 h-5 text-emerald-400"></i>
          <span>{{ toastMessage }}</span>
        </div>
      </Transition>
    </Teleport>

    <header class="relative z-20 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <img src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" alt="Logo" class="w-8 h-8 object-contain"/>
            </div>
            <div class="flex flex-col">
              <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                {{ nombreApoderado }}
              </h1>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="text-xs text-slate-400">Alumno:</span>
                <span class="text-sm font-semibold text-emerald-400">{{ nombreAlumno }}</span>
              </div>
            </div>
          </div>

          <button 
            @click="modalLogout = true" 
            class="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all border border-red-500/30 font-semibold"
          >
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span class="hidden sm:inline text-sm">Salir</span>
          </button>
        </div>
      </div>
    </header>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      
      <div v-if="loading" class="py-40 text-center">
          <div class="relative w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-slate-400 animate-pulse">Sincronizando...</p>
      </div>

      <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-down">
            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                  <i data-lucide="mail" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-white">{{ resumen.nuevos }}</p>
                  <p class="text-xs text-slate-400">Sin Leer</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-green-500/50 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                  <i data-lucide="check-circle" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-white">{{ notificaciones.length - resumen.pendientes }}</p>
                  <p class="text-xs text-slate-400">Confirmados</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                  <i data-lucide="clock" class="w-6 h-6"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-white">{{ resumen.pendientes }}</p>
                  <p class="text-xs text-slate-400">Pendientes</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <i data-lucide="inbox" class="w-5 h-5 text-emerald-400"></i> 
                  Bandeja de Entrada
              </h2>
              <div class="flex items-center gap-2">
                  <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span class="text-xs text-slate-400 font-medium">Actualizando (5s)</span>
              </div>
          </div>

          <div v-if="notificaciones.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ComunicadoCard
              v-for="(n, index) in notificaciones"
              :key="n.id"
              :notificacion="n"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="animate-slide-up"
              @confirmar="confirmarAsistencia"
            />
          </div>

          <div v-else class="py-24 text-center bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
              <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <i data-lucide="mail-open" class="w-10 h-10"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Todo al día</h3>
              <p class="text-slate-400">No tienes nuevos comunicados por revisar.</p>
          </div>

      </template>

    </div>
  </div>
</template>

<style scoped>
.animate-blob { animation: blob 12s ease-in-out infinite; }
.animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
.animate-slide-left { animation: slide-left 0.4s ease-out forwards; }
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }

@keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); } 33% { transform: translate(30px, -50px) scale(1.1) rotate(5deg); } 66% { transform: translate(-20px, 20px) scale(0.9) rotate(-5deg); } }
@keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slide-left { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100px); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>