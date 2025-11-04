<template>
  <div class="flex min-h-screen bg-gray-50">
    <SidebarProfesor />

    <div class="flex-1 flex flex-col">
      <Navbar />
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarProfesor from '../components/SidebarProfesor.vue'


const links = [
  { name: 'Usuarios', icon: '👥', path: '/dashboard-ti/usuarios' },
  { name: 'Notificaciones', icon: '📨', path: '/dashboard-ti/notificaciones' },
  { name: 'Cursos', icon: '📚', path: '/dashboard-ti/cursos' }
]
</script>
