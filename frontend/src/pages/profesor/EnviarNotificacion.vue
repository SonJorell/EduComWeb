<template>
  <div class="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950/80 rounded-2xl shadow-2xl border border-indigo-700/30 max-w-lg mx-auto p-8 mt-5 glassrelative">
    <h2 class="text-2xl font-extrabold mb-7 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-tight drop-shadow">
      Enviar Notificación
    </h2>

    <form @submit.prevent="enviar" class="space-y-6">
      <div>
        <label class="block text-blue-200 text-sm font-bold mb-2">Título</label>
        <input
          v-model="titulo"
          class="border-2 border-indigo-600/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-800/70 rounded-xl px-4 py-3 w-full text-base text-blue-100 font-semibold outline-none shadow transition"
          required
          placeholder="Título del comunicado"
        />
      </div>

      <div>
        <label class="block text-blue-200 text-sm font-bold mb-2">Mensaje</label>
        <textarea
          v-model="mensaje"
          class="border-2 border-indigo-600/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-800/70 rounded-xl px-4 py-3 w-full text-base text-blue-100 font-semibold outline-none shadow resize-none transition"
          rows="5"
          required
          placeholder="Escribe el contenido aquí…"
        ></textarea>
      </div>

      <div>
        <label class="block text-blue-200 text-sm font-bold mb-2">Tipo de envío</label>
        <select
          v-model="tipoEnvio"
          class="border-2 border-indigo-600/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-800/70 rounded-xl px-4 py-3 w-full text-base text-blue-100 font-semibold outline-none shadow transition"
        >
          <option value="individual">Individual (Apoderado específico)</option>
          <option value="curso">Por curso completo</option>
        </select>
      </div>

      <!-- Selector apoderado -->
      <div v-if="tipoEnvio === 'individual'">
        <label class="block text-blue-200 text-sm font-bold mb-2">ID Apoderado</label>
        <input
          v-model.number="apoderadoId"
          type="number"
          class="border-2 border-indigo-600/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-800/70 rounded-xl px-4 py-3 w-full text-base text-blue-100 font-semibold outline-none shadow transition"
          placeholder="Ej: 3"
        />
        <p class="text-xs text-blue-400 mt-1">
          (Próximamente buscador de apoderados por nombre/email)
        </p>
      </div>

      <!-- Selector curso -->
      <div v-else>
        <label class="block text-blue-200 text-sm font-bold mb-2">Curso</label>
        <select
          v-model.number="cursoId"
          class="border-2 border-indigo-600/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-800/70 rounded-xl px-4 py-3 w-full text-base text-blue-100 font-semibold outline-none shadow transition"
        >
          <option disabled :value="null">Selecciona un curso</option>
          <option v-for="c in notifs.cursos" :key="c.id" :value="c.id">
            {{ c.nombre }}
          </option>
        </select>
      </div>

      <div class="pt-2">
        <button
          class="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
        >
          Enviar Notificación
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificacionesStore } from '../../store/notificaciones'

const notifs = useNotificacionesStore()
const titulo = ref('')
const mensaje = ref('')
const tipoEnvio = ref('curso')
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
    ...(tipoEnvio.value === 'individual'
      ? { apoderadoId: apoderadoId.value }
      : { cursoId: cursoId.value })
  }
  await notifs.enviar(payload)
  titulo.value = ''
  mensaje.value = ''
  apoderadoId.value = null
  cursoId.value = null
  alert('Notificación enviada ✅')
}
</script>

<style scoped>
.glassrelative {
  background: rgba(31, 34, 61, 0.93);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
