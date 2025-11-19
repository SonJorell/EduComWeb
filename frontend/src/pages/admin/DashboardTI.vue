<template>
  <div class="min-h-screen bg-slate-950 text-white relative overflow-hidden">
    
    <!-- 🌌 Fondo Animado -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
    </div>

    <!-- 🔷 Header -->
    <header class="relative z-20 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <i data-lucide="settings" class="w-5 h-5 text-white"></i>
          </div>

          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wide">
            Panel de Administración TI
          </h1>
        </div>

        <button
          @click="logout"
          class="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-xl font-semibold border border-red-500/40
                 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-red-900/20"
        >
          <i data-lucide="log-out" class="w-4 h-4"></i>
          Salir
        </button>

      </div>
    </header>

    <!-- 📦 Contenido -->
    <main class="relative z-10 max-w-7xl mx-auto p-6 space-y-12">

      <!-- 🧩 Gestión Principal -->
      <section>
        <h2 class="text-xl font-semibold text-slate-200 mb-4">
          Gestión Principal
        </h2>

        <div class="grid md:grid-cols-3 gap-6">

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
        <h2 class="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <i data-lucide="server-cog" class="w-5 h-5 text-slate-400"></i>
          Administración del Sistema
        </h2>

        <div class="grid md:grid-cols-2 gap-6">

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
            color="red"
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

// Abrir módulo dentro del dashboard TI
const abrirModulo = (modulo) => {
  router.push(`/dashboard-ti/${modulo}`)
}

// Logout
const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  createIcons({ icons })
})
</script>



<style scoped>
/* Animación suave de las burbujas de fondo */
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.15); }
  66% { transform: translate(-40px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 12s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
