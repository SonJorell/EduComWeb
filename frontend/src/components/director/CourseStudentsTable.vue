<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl glass text-xs min-h-[340px] relative overflow-hidden">

    <!-- Decos de fondo -->
    <div class="absolute -top-8 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-36 h-16 bg-yellow-400/15 rounded-full blur-xl pointer-events-none"></div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7 relative z-10">
      <div>
        <h3 class="text-lg font-extrabold text-gradient leading-tight mb-1">Alumnos y apoderados</h3>
        <p class="text-[11.5px] text-slate-400 font-medium">
          Tabla interactiva del curso: uso de comunicados y nivel de riesgo de seguimiento.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <label class="text-[11px] text-slate-400 font-semibold">Filtrar por riesgo:</label>
        <select
          v-model="filtroRiesgo"
          class="bg-slate-900 border-2 border-emerald-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition"
        >
          <option value="">Todos</option>
          <option value="Alto">Alto</option>
          <option value="Medio">Medio</option>
          <option value="Bajo">Bajo</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl shadow-inner relative z-10 min-h-[200px]">
      <table class="w-full min-w-[700px] border-separate border-spacing-y-1.5">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 bg-slate-800/70 backdrop-blur">
            <th class="pb-3 pt-2 pl-4 text-left font-semibold uppercase tracking-wide text-xs rounded-tl-xl cursor-pointer select-none" @click="sortBy('nombreAlumno')">
              Alumno
              <span v-if="sortField === 'nombreAlumno'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
            <th class="pb-3 pt-2 text-left font-semibold uppercase tracking-wide text-xs cursor-pointer select-none" @click="sortBy('apoderado')">
              Apoderado
              <span v-if="sortField === 'apoderado'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wide text-xs cursor-pointer select-none" @click="sortBy('totalNotificaciones')">
              Notificaciones
              <span v-if="sortField === 'totalNotificaciones'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wide text-xs cursor-pointer select-none" @click="sortBy('leidas')">
              Leídas
              <span v-if="sortField === 'leidas'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wide text-xs cursor-pointer select-none" @click="sortBy('confirmadas')">
              Confirmadas
              <span v-if="sortField === 'confirmadas'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wide text-xs rounded-tr-xl cursor-pointer select-none" @click="sortBy('riesgo')">
              Riesgo
              <span v-if="sortField === 'riesgo'" class="inline ml-1 align-middle">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 13l3-3 3 3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 20 20">
                  <path d="M7 7l3 3 3-3" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filasFiltradas"
            :key="row.id"
            class="border-b border-slate-900 hover:bg-slate-900/40 transition duration-100"
          >
            <td class="py-2 pl-4 font-bold text-slate-200">{{ row.nombreAlumno }}</td>
            <td class="py-2 font-semibold text-blue-200">{{ row.apoderado }}</td>
            <td class="py-2 text-center text-slate-100 font-semibold">{{ row.totalNotificaciones }}</td>
            <td class="py-2 text-center text-cyan-300 font-bold">{{ row.leidas }}</td>
            <td class="py-2 text-center text-emerald-300 font-bold">{{ row.confirmadas }}</td>
            <td class="py-2 text-center">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold border shadow', badgeClass(row.riesgo)
                ]"
              >
                {{ row.riesgo }}
              </span>
            </td>
          </tr>
          <tr v-if="filasFiltradas.length === 0">
            <td colspan="6" class="py-7 text-center text-slate-500">
              No hay registros para este filtro.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  cursoId: {
    type: Number,
    required: true
  }
})

const filas = ref([])
const filtroRiesgo = ref('')
const sortField = ref('nombreAlumno')
const sortDir = ref('asc')
const token = () => localStorage.getItem('token')
const API_URL = 'http://localhost:3000/api/director'

async function loadData () {
  if (!props.cursoId) return
  try {
    const res = await fetch(`${API_URL}/curso/${props.cursoId}/alumnos`, {
      headers: {
        Authorization: `Bearer ${token()}`
      }
    })
    if (!res.ok) return
    filas.value = await res.json()
  } catch (err) {
    console.error('❌ Error al cargar alumnos del curso', err)
  }
}

function badgeClass (riesgo) {
  if (riesgo === 'Alto') return 'bg-red-500/20 text-red-400 border-red-300'
  if (riesgo === 'Medio') return 'bg-yellow-400/15 text-yellow-300 border-yellow-300'
  return 'bg-emerald-500/20 text-emerald-400 border-emerald-400'
}

function sortBy (field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
}

const filasFiltradas = computed(() => {
  let data = [...filas.value]
  if (filtroRiesgo.value) {
    data = data.filter(f => f.riesgo === filtroRiesgo.value)
  }
  data.sort((a, b) => {
    const va = a[sortField.value]
    const vb = b[sortField.value]
    if (va < vb) return sortDir.value === 'asc' ? -1 : 1
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
  return data
})

watch(
  () => props.cursoId,
  () => loadData(),
  { immediate: true }
)
</script>

<style scoped>
.glass {
  background: rgba(29, 33, 57, 0.83);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.text-gradient {
  background: linear-gradient(90deg, #22d3ee, #a3e635 70%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: headerGrad 7s ease-in-out infinite;
}
@keyframes headerGrad {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
