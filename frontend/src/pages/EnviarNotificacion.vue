<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Enviar Notificación</h2>

    <form @submit.prevent="enviar">
      <div class="mb-3">
        <label class="block font-semibold mb-1">Título</label>
        <input v-model="titulo" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Mensaje</label>
        <textarea v-model="mensaje" class="border rounded p-2 w-full h-28" required></textarea>
      </div>

      <div class="mb-4">
        <label class="font-semibold block mb-1">Tipo de envío</label>
        <select v-model="tipoEnvio" class="border rounded p-2 w-full">
          <option value="individual">Individual (Apoderado)</option>
          <option value="curso">Por curso completo</option>
        </select>
      </div>

      <div v-if="tipoEnvio === 'individual'" class="mb-4">
        <label class="font-semibold block mb-1">ID Apoderado</label>
        <input v-model.number="apoderadoId" type="number" class="border rounded p-2 w-full" placeholder="Ej: 3">
        <p class="text-sm text-gray-500 mt-1">*(Luego puedes reemplazar esto por un buscador/autocomplete.)</p>
      </div>

      <div v-else class="mb-4">
        <label class="font-semibold block mb-1">Curso</label>
        <select v-model.number="cursoId" class="border rounded p-2 w-full">
          <option v-for="c in notifs.cursos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </select>
      </div>

      <button class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Enviar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificacionesStore } from '../store/notificaciones'

const notifs = useNotificacionesStore()
const titulo = ref('')
const mensaje = ref('')
const tipoEnvio = ref('curso') // por defecto
const apoderadoId = ref(null)
const cursoId = ref(null)

onMounted(() => {
  notifs.cargarCursos()
})

const enviar = async () => {
  const payload = {
    titulo: titulo.value,
    mensaje: mensaje.value,
    tipo: tipoEnvio.value,
    ...(tipoEnvio.value === 'individual' ? { apoderadoId: apoderadoId.value } : { cursoId: cursoId.value })
  }
  await notifs.enviar(payload)
  titulo.value = ''
  mensaje.value = ''
  apoderadoId.value = null
  cursoId.value = null
  alert('Notificación enviada ✅')
}
</script>
