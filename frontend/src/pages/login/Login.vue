<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 relative overflow-hidden">
    
    <!-- Efectos de fondo animados -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-48 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      <!-- Grid de puntos decorativo -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.05)_1px,transparent_0)] [background-size:40px_40px]"></div>
    </div>

    <!-- Container del formulario -->
    <div class="relative z-10 w-full max-w-lg">
      
      <!-- Card principal UNIFICADO -->
      <div class="bg-slate-900/90 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800/50 animate-slide-up relative overflow-hidden">
        
        <!-- Brillo superior decorativo -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <!-- Logo del Colegio -->
        <div class="text-center mb-8">
          <div class="inline-block mb-5 relative">
            <!-- Anillo decorativo exterior -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-2xl opacity-20 animate-pulse-slow"></div>
            
            <!-- Container del logo -->
            <div class="relative w-28 h-28 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 mx-auto border-2 border-slate-700/30 p-3">
              <img 
                src="https://i.postimg.cc/nrQmRMvz/logo-Colegio-Arica.png" 
                alt="Logo Colegio Arica"
                class="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <!-- Nombre del colegio -->
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Colegio Arica</h2>
          <p class="text-slate-400 text-sm">Accede con tus credenciales institucionales</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          
          <!-- Campo Email -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-slate-300 flex items-center gap-2">
              <i data-lucide="mail" class="w-4 h-4 text-blue-400"></i>
              <span>Correo electrónico</span>
            </label>
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 blur transition duration-300"></div>
              <input
                id="email"
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="username"
                placeholder="profesor@colegioarica.cl"
                class="relative w-full bg-slate-800/60 border-2 border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all duration-300 hover:border-slate-600 text-base"
                required
              />
            </div>
          </div>

          <!-- Campo Password -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-slate-300 flex items-center gap-2">
              <i data-lucide="lock" class="w-4 h-4 text-blue-400"></i>
              <span>Contraseña</span>
            </label>
            
            <!-- Input de contraseña -->
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 blur transition duration-300"></div>
              <input
                id="password"
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                class="relative w-full bg-slate-800/60 border-2 border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all duration-300 hover:border-slate-600 text-base"
                required
              />
            </div>

            <!-- Botón mostrar/ocultar -->
            <button
              type="button"
              class="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors font-medium group mt-2"
              @click="showPass = !showPass"
            >
              <i :data-lucide="showPass ? 'eye-off' : 'eye'" class="w-4 h-4 group-hover:scale-110 transition-transform"></i>
              <span>{{ showPass ? 'Ocultar contraseña' : 'Mostrar contraseña' }}</span>
            </button>
          </div>

          <!-- Recordar sesión y recuperar contraseña -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <label class="flex items-center gap-2.5 cursor-pointer group">
              <div class="relative flex-shrink-0">
                <input 
                  type="checkbox" 
                  class="peer w-4 h-4 text-blue-600 bg-slate-800 border-2 border-slate-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                />
                <i data-lucide="check" class="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></i>
              </div>
              <span class="text-slate-400 group-hover:text-slate-300 transition-colors font-medium text-sm">Recordar sesión</span>
            </label>
            <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors font-semibold hover:underline decoration-2 underline-offset-4 text-sm">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Botón de inicio de sesión -->
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 relative overflow-hidden group mt-6',
              loading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl shadow-blue-600/40 hover:shadow-2xl hover:shadow-blue-600/60 hover:scale-[1.02] active:scale-[0.98]'
            ]"
          >
            <!-- Animación de ondas -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span v-if="!loading" class="relative flex items-center justify-center gap-2">
              <i data-lucide="log-in" class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"></i>
              <span class="tracking-wide">Iniciar Sesión</span>
            </span>
            <span v-else class="relative flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Verificando...</span>
            </span>
          </button>

          <!-- Mensaje de error -->
          <Transition name="error-fade">
            <div v-if="errorMsg" class="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-3.5 flex items-start gap-3 animate-shake backdrop-blur-sm mt-4">
              <div class="w-7 h-7 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i data-lucide="alert-circle" class="w-4 h-4 text-red-400"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-red-400 text-sm font-semibold mb-1">Error de autenticación</p>
                <p class="text-red-300/80 text-xs break-words">{{ errorMsg }}</p>
              </div>
            </div>
          </Transition>

          <!-- Footer integrado -->
          <div class="pt-5 mt-5 border-t border-slate-800/50">
            <p class="text-xs text-slate-400 text-center mb-3">
              ¿Problemas para acceder? 
              <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors font-semibold ml-1 inline-flex items-center gap-1">
                Contacta soporte
                <i data-lucide="arrow-right" class="w-3 h-3"></i>
              </a>
            </p>
            
            <!-- Badges de seguridad integrados -->
            <div class="flex items-center justify-center gap-4 text-xs text-slate-500 mb-3">
              <div class="flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-green-500"></i>
                <span>SSL</span>
              </div>
              <div class="w-1 h-1 bg-slate-700 rounded-full"></div>
              <div class="flex items-center gap-1.5">
                <i data-lucide="lock" class="w-3.5 h-3.5 text-blue-500"></i>
                <span>256-bit</span>
              </div>
            </div>
            
            <!-- Versión -->
            <p class="text-xs text-slate-600 text-center">EduCom Web v2.0.1 • © 2025</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'

const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const user = await authStore.login(email.value, password.value)

    // ✅ Corrección principal: obtén correctamente el nombre del rol
    const rol = user?.rol?.nombre || user?.rol || ''
    const rolLower = rol.toLowerCase()

    // ✅ Redirecciones seguras según el rol
    if (rolLower.includes('ti') || rolLower.includes('admin')) {
      router.push('/dashboard-ti')
    } else if (rolLower.includes('profesor')) {
      router.push('/dashboard-profesor')
    } else if (rolLower.includes('apoderado')) {
      router.push('/dashboard-apoderado')
    } else {
      router.push('/') // fallback por si no tiene rol asignado
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMsg.value = 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.'
    setTimeout(() => {
      errorMsg.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  createIcons({ icons })
})
</script>


<style scoped>
/* Animaciones */
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
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-shake {
  animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.error-fade-enter-active {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

button[type="submit"]:not(:disabled) {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
