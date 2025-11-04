<template>
  <div v-if="mostrar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div class="bg-slate-800 w-full max-w-2xl rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-slate-700 flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Nuevo Comunicado</h2>
        <button @click="$emit('cerrar')" class="text-slate-400 hover:text-white">
          <i data-lucide="x"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="enviar" class="p-6 space-y-5">
        <!-- Título -->
        <div>
          <label class="block text-sm text-slate-300 mb-1">Título</label>
          <input v-model.trim="titulo" required
                 placeholder="Ej: Reunión general de apoderados"
                 class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Tipo -->
        <div>
          <label class="block text-sm text-slate-300 mb-1">Etiqueta / Tipo</label>
          <select v-model="tipo" required
                  class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500">
            <option disabled value="">Selecciona una etiqueta</option>
            <option value="REUNION">Reunión</option>
            <option value="AVISO">Evento / Aviso</option>
            <option value="ANOTACION">Citación</option>
            <option value="FELICITACION">Felicitación</option>
          </select>
        </div>

        <!-- Fecha + Hora -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Fecha</label>
            <input type="date" v-model="fecha" required
                   class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-1">Hora</label>
            <input type="time" v-model="hora"
                   class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <!-- Envío a: curso / grupo / individual -->
        <div>
          <label class="block text-sm text-slate-300 mb-2">Enviar comunicado a:</label>

          <div class="space-y-3">
            <!-- Opción curso completo -->
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="enviarCurso"
                     class="w-4 h-4 accent-blue-600 rounded border-slate-600" />
              <label class="text-slate-300 text-sm">Todo el curso seleccionado</label>
              <select v-model="cursoId" :disabled="!enviarCurso"
                      class="flex-1 p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                <option disabled value="">Selecciona un curso</option>
                <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
            </div>

            <!-- Opción grupo de apoderados -->
            <div class="flex flex-col gap-2">
              <label class="text-slate-300 text-sm">Grupo de apoderados (opcional)</label>
              <select multiple v-model="grupoApoderados"
                      class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500 h-28">
                <option v-for="a in apoderados" :key="a.id" :value="a.id">
                  {{ a.nombre }} — {{ a.correo }}
                </option>
              </select>
              <p class="text-xs text-slate-400">Mantén presionada CTRL (o CMD) para seleccionar varios.</p>
            </div>
          </div>
        </div>

        <!-- Mensaje -->
        <div>
          <label class="block text-sm text-slate-300 mb-1">Mensaje</label>
          <textarea v-model.trim="mensaje" required rows="5"
                    class="w-full p-2 bg-slate-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe el contenido del comunicado..."></textarea>
        </div>

        <!-- Botones -->
        <div class="pt-4 border-t border-slate-700 flex justify-end gap-2">
          <button type="button" @click="$emit('cerrar')"
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
            Cancelar
          </button>
          <button type="submit" :disabled="enviando"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60">
            <span v-if="!enviando">Enviar</span>
            <span v-else class="animate-pulse">Enviando...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { createIcons, icons } from 'lucide'
import { profesorService } from '@/services/profesorService'

const props = defineProps({
  mostrar: Boolean,
  cursos: { type: Array, default: () => [] }
})
const emit = defineEmits(['cerrar', 'actualizar'])

const titulo = ref('')
const tipo = ref('')
const mensaje = ref('')
const cursoId = ref('')
const fecha = ref(new Date().toISOString().slice(0, 10))
const hora = ref('08:00')
const enviando = ref(false)
const apoderados = ref([])
const enviarCurso = ref(false)
const grupoApoderados = ref([])

onMounted(async () => {
  createIcons({ icons })
  await cargarApoderados()
})
watch(() => props.mostrar, (v) => v && createIcons({ icons }))

async function cargarApoderados() {
  try {
    const { data } = await profesorService.obtenerApoderados()
    apoderados.value = data
  } catch (e) {
    console.error('Error cargando apoderados:', e)
  }
}

async function enviar() {
  if (!titulo.value || !tipo.value || !mensaje.value) return alert('Faltan campos obligatorios.')

  const cursoIds = enviarCurso.value && cursoId.value ? [Number(cursoId.value)] : []
  const apoderadoIds = grupoApoderados.value.map(id => Number(id))

  if (!cursoIds.length && !apoderadoIds.length) {
    return alert('Selecciona al menos un curso o uno o más apoderados.')
  }

  enviando.value = true
  try {
    await profesorService.crearComunicado({
      titulo: titulo.value,
      mensaje: mensaje.value,
      tipo: tipo.value,
      cursoIds,
      apoderadoIds
    })

    emit('actualizar')
    emit('cerrar')
  } catch (e) {
    console.error('Error al crear comunicado:', e)
    alert(e?.response?.data?.error || 'No se pudo crear el comunicado.')
  } finally {
    enviando.value = false
  }
}
</script>
