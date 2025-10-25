<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <nav class="bg-blue-800 text-white shadow-md">
    <div class="container mx-auto flex justify-between items-center px-6 py-3">
      <h1 class="text-2xl font-bold">Colegio Arica</h1>
      <div>
        <router-link to="/" class="px-4 hover:text-blue-200">Inicio</router-link>
        <router-link to="/login" class="px-4 bg-white text-blue-800 font-semibold py-1 rounded hover:bg-gray-200">
          Iniciar Sesión
        </router-link>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
