<template>
  <div class="min-h-screen bg-slate-950 text-white relative overflow-hidden">

    <!-- 🌌 Fondo Animado Mejorado -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      <div class="absolute top-1/4 -left-60 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute bottom-1/2 right-0 w-[430px] h-[430px] bg-violet-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute top-[60%] left-2/3 w-[350px] h-[150px] bg-cyan-400/10 rounded-full blur-2xl rotate-12"></div>
    </div>

    <!-- 🔷 Header glass -->
    <header class="relative z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg shadow-xl">
      <div class="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <i data-lucide="settings" class="w-6 h-6 text-white"></i>
          </div>
          <h1 class="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent tracking-wide animate-gradient drop-shadow">
            Panel de Administración TI
          </h1>
        </div>

        <button
          @click="logout"
          class="px-5 py-2.5 bg-gradient-to-r from-red-500/30 to-pink-600/30 hover:from-red-600/50 hover:to-pink-700/30 text-red-200 hover:text-red-100 rounded-2xl font-bold border border-red-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md"
        >
          <i data-lucide="log-out" class="w-5 h-5"></i>
          Salir
        </button>
      </div>
    </header>

    <!-- 📦 Contenido -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-14">

      <!-- 🧩 Gestión Principal -->
      <section>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
          Gestión Principal
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <CardTI
            title="Gestión de Usuarios"
            icon="user-cog"
            color="blue"
            desc="Crea nuevas credenciales, asigna roles y restablece contraseñas."
            @open="abrirModulo('usuarios')"
          />
          <CardTI
            title="Gestión de Cursos"
            icon="book"
            color="green"
            desc="Crea, edita o elimina cursos y asigna profesores jefes."
            @open="abrirModulo('cursos')"
          />
          <CardTI
            title="Roles y Permisos"
            icon="shield"
            color="purple"
            desc="Controla el acceso de los usuarios y permisos internos."
            @open="abrirModulo('roles')"
          />
        </div>
      </section>

      <!-- ⚙️ Administración del Sistema -->
      <section>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-300 bg-clip-text text-transparent flex items-center gap-3 mb-6">
          <i data-lucide="server-cog" class="w-6 h-6 text-cyan-300"></i>
          Administración del Sistema
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <CardTI
            title="Estado del Sistema"
            icon="server"
            color="cyan"
            desc="Revisa conexión a la base de datos y estado general del backend."
            @open="abrirModulo('sistema')"
          />
          <CardTI
            title="Auditoría y Registros"
            icon="clipboard-list"
            color="amber"
            desc="Consulta el historial de acciones de los usuarios."
            @open="abrirModulo('auditoria')"
          />
        </div>
      </section>

      <!-- 📍 Aquí se cargan los módulos -->
      <section class="pb-10">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { useAuthStore } from '@/store/auth'
import CardTI from '@/components/admin/CardTI.vue'

const router = useRouter()
const authStore = useAuthStore()

const abrirModulo = modulo => {
  router.push(`/dashboard-ti/${modulo}`)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  createIcons({ icons })
})
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.12); }
  66% { transform: translate(-40px, 20px) scale(0.91); }
}
.animate-blob {
  animation: blob 14s infinite ease-in-out;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animate-gradient {
  background-size: 200% 200%;
  animation: animatedGradient 9s ease-in-out infinite;
}
@keyframes animatedGradient {
  0%,100%{background-position:0% 50%;}
  50%{background-position:100% 50%;}
}
</style>
