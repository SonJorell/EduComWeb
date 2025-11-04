<!-- src/pages/Bandeja.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import axios from 'axios'

const auth = useAuthStore()
const notificaciones = ref([])

const API_URL = 'http://localhost:3000/recepciones'

// Cargar notificaciones recibidas
async function cargarNotificaciones() {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  notificaciones.value = res.data
}

// Marcar como leída
async function marcarLeida(id) {
  await axios.patch(`${API_URL}/${id}/leida`, {}, {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  await cargarNotificaciones()
}

onMounted(cargarNotificaciones)
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📬 Bandeja de Notificaciones</h1>

    <div v-if="notificaciones.length === 0" class="text-gray-500">No tienes notificaciones.</div>

    <ul v-else>
      <li
        v-for="n in notificaciones"
        :key="n.id"
        class="border-b py-3 flex justify-between items-center"
      >
        <div>
          <strong>{{ n.titulo }}</strong>
          <p class="text-gray-700">{{ n.mensaje }}</p>
          <small>De: {{ n.emisor }} ({{ n.emisorEmail }})</small>
        </div>
        <button
          v-if="!n.leida"
          @click="marcarLeida(n.id)"
          class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Marcar leída
        </button>
      </li>
    </ul>
  </div>
</template>
