<template>
  <div class="p-8">
    <Navbar />
    <h1 class="text-3xl font-bold mb-4">Bienvenido, {{ auth.user?.nombre }}</h1>
    <p>Rol: {{ auth.user?.rol }}</p>
    <router-link to="/notificaciones" class="text-blue-600 underline">Ver Notificaciones</router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import Navbar from '../components/Navbar.vue'
const auth = useAuthStore()
</script>
