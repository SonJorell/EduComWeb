<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Resumen</h2>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white p-4 shadow rounded text-center">
        <div class="text-3xl font-bold text-indigo-600">{{ notifs.resumen.cursos }}</div>
        <div class="text-gray-500">Cursos asignados</div>
      </div>
      <div class="bg-white p-4 shadow rounded text-center">
        <div class="text-3xl font-bold text-green-600">{{ notifs.resumen.alumnos }}</div>
        <div class="text-gray-500">Alumnos totales</div>
      </div>
      <div class="bg-white p-4 shadow rounded text-center">
        <div class="text-3xl font-bold text-blue-600">{{ notifs.resumen.notificaciones }}</div>
        <div class="text-gray-500">Notificaciones enviadas</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificacionesStore } from '../../store/notificaciones'
const notifs = useNotificacionesStore()

onMounted(() => notifs.cargarResumen())
</script>
