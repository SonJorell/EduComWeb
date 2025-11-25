<script setup>
import { ref, onMounted, watch } from 'vue'
import { createIcons, icons } from 'lucide'
import { profesorService } from '@/services/profesorService'

// Props y Emits
const props = defineProps({
  mostrar: Boolean,
  cursos: { type: Array, default: () => [] }
})
const emit = defineEmits(['cerrar', 'actualizar'])

// Campos Reactivos
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

// Rango de fechas
const hoy = new Date()
const añoActual = hoy.getFullYear()
const minFecha = ref(hoy.toISOString().slice(0, 10))
const maxFecha = ref(new Date(añoActual, 11, 31).toISOString().slice(0, 10))

// Montaje y Watchers
onMounted(async () => {
  createIcons({ icons })
  await cargarApoderados()
})

watch(() => props.mostrar, (v) => {
  if (v) setTimeout(() => createIcons({ icons }), 50)
})

// Cargar Datos
async function cargarApoderados() {
  try {
    const { data } = await profesorService.obtenerApoderados()
    apoderados.value = data
  } catch (e) {
    console.error('Error cargando apoderados:', e)
  }
}

// Acción Enviar
async function enviar() {
  if (!titulo.value || !tipo.value || !mensaje.value) {
    return alert('Por favor, completa los campos obligatorios.')
  }

  if (fecha.value < minFecha.value || fecha.value > maxFecha.value) {
    return alert(`La fecha debe estar entre hoy y fin de año.`)
  }

  const cursoIds = enviarCurso.value && cursoId.value ? [Number(cursoId.value)] : []
  const apoderadoIds = grupoApoderados.value.map(id => Number(id))

  if (!cursoIds.length && !apoderadoIds.length) {
    return alert('Debes seleccionar al menos un destinatario (Curso o Apoderados).')
  }

  enviando.value = true
  try {
    await profesorService.crearComunicado({
      titulo: titulo.value,
      mensaje: mensaje.value,
      tipo: tipo.value,
      cursoIds,
      apoderadoIds,
      fecha: fecha.value,
      hora: hora.value
    })
    emit('actualizar')
    emit('cerrar')
    // Resetear campos básicos opcionalmente
    titulo.value = ''; mensaje.value = '';
  } catch (e) {
    console.error('Error:', e)
    alert('Hubo un error al enviar el comunicado.')
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="mostrar" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="$emit('cerrar')">
      
      <div class="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden transform transition-all relative flex flex-col max-h-[90vh]">
        
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div class="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur flex items-center justify-between shrink-0 z-10">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-600/20 rounded-xl text-blue-400">
              <i data-lucide="send" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Nuevo Comunicado</h2>
              <p class="text-xs text-slate-400">Redacta y notifica a tu comunidad</p>
            </div>
          </div>
          <button @click="$emit('cerrar')" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar space-y-6 relative z-10">
          
          <div class="grid sm:grid-cols-3 gap-5">
            <div class="sm:col-span-2 space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Título del mensaje</label>
              <div class="relative group">
                <i data-lucide="type" class="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <input
                  v-model.trim="titulo"
                  type="text"
                  required
                  placeholder="Ej: Reunión de Apoderados"
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tipo</label>
              <div class="relative group">
                <i data-lucide="tag" class="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <select
                  v-model="tipo"
                  required
                  class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-8 text-white appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option disabled value="">Elegir...</option>
                  <option value="REUNION">Reunión</option>
                  <option value="AVISO">Aviso</option>
                  <option value="ANOTACION">Citación</option>
                  <option value="FELICITACION">Felicitación</option>
                </select>
                <i data-lucide="chevron-down" class="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none"></i>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Fecha</label>
              <input
                type="date"
                v-model="fecha"
                :min="minFecha"
                :max="maxFecha"
                required
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Hora</label>
              <input
                type="time"
                v-model="hora"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div class="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <i data-lucide="users" class="w-4 h-4 text-blue-400"></i>
              <h3 class="text-sm font-bold text-white">Destinatarios</h3>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
              <input type="checkbox" v-model="enviarCurso" id="checkCurso" class="w-5 h-5 accent-blue-600 rounded border-slate-600 cursor-pointer" />
              <label for="checkCurso" class="text-sm text-slate-200 cursor-pointer flex-1">Todo el curso</label>
              
              <div class="relative w-1/2">
                <select
                  v-model="cursoId"
                  :disabled="!enviarCurso"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 pl-3 pr-8 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option disabled value="">Selecciona curso</option>
                  <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs text-slate-400 ml-1">O selecciona apoderados específicos:</label>
              <div class="relative">
                <select
                  multiple
                  v-model="grupoApoderados"
                  class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-32 custom-scrollbar"
                >
                  <option v-for="a in apoderados" :key="a.id" :value="a.id" class="p-2 hover:bg-blue-600/20 hover:text-blue-300 rounded cursor-pointer transition-colors border-b border-slate-800/50 last:border-0">
                    {{ a.nombre }} — {{ a.correo }}
                  </option>
                </select>
                <div class="absolute right-2 top-2 p-1 bg-slate-800 rounded text-xs text-slate-500 pointer-events-none border border-slate-700">
                  Ctrl + Click
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mensaje</label>
            <textarea
              v-model.trim="mensaje"
              required
              rows="5"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Escribe el contenido detallado del comunicado aquí..."
            ></textarea>
          </div>

        </div>

        <div class="p-6 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur flex justify-end gap-3 shrink-0 z-10">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="px-5 py-2.5 bg-transparent hover:bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all active:scale-95"
          >
            Cancelar
          </button>

          <button
            @click="enviar"
            :disabled="enviando"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="enviando" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <i v-else data-lucide="send" class="w-4 h-4"></i>
            {{ enviando ? 'Enviando...' : 'Publicar Comunicado' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animación del Modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollbar Personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>