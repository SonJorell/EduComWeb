<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 rounded-3xl border border-slate-800 shadow-2xl glass text-xs min-h-[370px] relative overflow-hidden">

    <!-- Decorativos premium -->
    <div class="absolute -top-10 left-0 w-44 h-20 bg-blue-400/15 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute -bottom-7 right-0 w-44 h-20 bg-pink-400/20 rounded-full blur-2xl pointer-events-none"></div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8 z-10 relative">
      <div>
        <h3 class="text-2xl font-extrabold text-gradient leading-tight">Comparación entre cursos</h3>
        <p class="text-[12px] text-slate-400 font-medium mt-1">
          Compare uso docente, participación de apoderados y asistencia institucional entre dos cursos.
        </p>
      </div>
      <div class="flex flex-wrap gap-2 items-center mt-3 md:mt-0">
        <select
          v-model="cursoAId"
          class="bg-slate-950 border-2 border-blue-700/40 rounded-xl px-3 py-2 text-[13px] min-w-[140px] font-semibold shadow-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option disabled value="">Curso A</option>
          <option
            v-for="c in cursos"
            :key="c.id"
            :value="c.id"
          >
            {{ c.nombre }}
          </option>
        </select>
        <span class="font-bold text-lg text-slate-400 select-none">&#8646;</span>
        <select
          v-model="cursoBId"
          class="bg-slate-950 border-2 border-pink-600/40 rounded-xl px-3 py-2 text-[13px] min-w-[140px] font-semibold shadow-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        >
          <option disabled value="">Curso B</option>
          <option
            v-for="c in cursos"
            :key="c.id"
            :value="c.id"
          >
            {{ c.nombre }}
          </option>
        </select>
        <button
          @click="loadComparacion"
          :disabled="!cursoAId || !cursoBId || cursoAId === cursoBId"
          class="text-[12.5px] px-4 py-2 ml-1 rounded-xl border border-slate-700 font-bold bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow hover:from-blue-700 hover:to-pink-600 transition disabled:opacity-50 disabled:pointer-events-none"
        >
          Comparar
        </button>
      </div>
    </div>

    <div v-if="!comparacion" class="text-slate-500 p-6 text-center relative z-10">
      Selecciona dos cursos y presiona <strong>Comparar</strong> para ver los resultados.
    </div>

    <div v-else class="space-y-7 relative z-10">
      <!-- Tarjetas comparativas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
        <!-- Curso A -->
        <div class="relative p-6 bg-gradient-to-br from-blue-900 to-blue-800/60 border border-blue-900/50 rounded-3xl shadow-lg hover:scale-[1.025] group transition">
          <div class="absolute top-0 right-3 w-2 h-10 rounded-full bg-blue-500/20 group-hover:bg-blue-500/35 blur-lg rotate-[8deg]"></div>
          <p class="text-[11.5px] text-blue-300 uppercase mb-1 font-bold tracking-wide">Curso A</p>
          <h4 class="text-lg font-bold mb-2 text-blue-100">{{ comparacion.cursoA.nombre }}</h4>
          <div class="space-y-1.5">
            <div><span class="text-slate-400 font-medium">Nivel:</span> <span class="font-bold text-blue-100">{{ comparacion.cursoA.nivel }}</span></div>
            <div><span class="text-slate-400 font-medium">Alumnos:</span> <span class="font-bold text-blue-100">{{ comparacion.cursoA.totalAlumnos }}</span></div>
            <div><span class="text-slate-400 font-medium">Uso docentes:</span> <span class="font-extrabold text-blue-200">{{ comparacion.cursoA.usoProfesores }}%</span></div>
            <div><span class="text-slate-400 font-medium">Participación apoderados:</span> <span class="font-extrabold text-blue-200">{{ comparacion.cursoA.participacionApoderados }}%</span></div>
            <div><span class="text-slate-400 font-medium">Asistencia:</span> <span class="font-extrabold text-blue-200">{{ comparacion.cursoA.asistencia }}%</span></div>
          </div>
        </div>
        <!-- Curso B -->
        <div class="relative p-6 bg-gradient-to-br from-pink-900 to-pink-800/55 border border-pink-900/60 rounded-3xl shadow-lg hover:scale-[1.025] group transition">
          <div class="absolute top-0 right-3 w-2 h-10 rounded-full bg-pink-400/20 group-hover:bg-pink-400/35 blur-lg rotate-[8deg]"></div>
          <p class="text-[11.5px] text-pink-300 uppercase mb-1 font-bold tracking-wide">Curso B</p>
          <h4 class="text-lg font-bold mb-2 text-pink-100">{{ comparacion.cursoB.nombre }}</h4>
          <div class="space-y-1.5">
            <div><span class="text-slate-400 font-medium">Nivel:</span> <span class="font-bold text-pink-100">{{ comparacion.cursoB.nivel }}</span></div>
            <div><span class="text-slate-400 font-medium">Alumnos:</span> <span class="font-bold text-pink-100">{{ comparacion.cursoB.totalAlumnos }}</span></div>
            <div><span class="text-slate-400 font-medium">Uso docentes:</span> <span class="font-extrabold text-pink-200">{{ comparacion.cursoB.usoProfesores }}%</span></div>
            <div><span class="text-slate-400 font-medium">Participación apoderados:</span> <span class="font-extrabold text-pink-200">{{ comparacion.cursoB.participacionApoderados }}%</span></div>
            <div><span class="text-slate-400 font-medium">Asistencia:</span> <span class="font-extrabold text-pink-200">{{ comparacion.cursoB.asistencia }}%</span></div>
          </div>
        </div>
      </div>

      <!-- Tabla comparativa visual y clara -->
      <div class="overflow-x-auto rounded-2xl shadow-inner">
        <table class="w-full text-[13px] border-separate border-spacing-y-2">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 bg-slate-800/90 backdrop-blur">
              <th class="pb-3 pt-2 px-2 text-left rounded-tl-2xl">Indicador</th>
              <th class="pb-3 pt-2 px-2 text-center">{{ comparacion.cursoA.nombre }}</th>
              <th class="pb-3 pt-2 px-2 text-center">{{ comparacion.cursoB.nombre }}</th>
              <th class="pb-3 pt-2 px-2 text-center rounded-tr-2xl">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tablaComparativa" :key="row.label" class="border-b border-slate-900 hover:bg-slate-900/40 transition">
              <td class="py-2 px-2 text-left text-slate-200 font-semibold">{{ row.label }}</td>
              <td class="py-2 px-2 text-center font-bold text-blue-200 bg-blue-500/10 rounded-lg">{{ row.a }}</td>
              <td class="py-2 px-2 text-center font-bold text-pink-200 bg-pink-400/10 rounded-lg">{{ row.b }}</td>
              <td class="py-2 px-2 text-center">
                <span :class="['px-4 py-1 rounded-xl font-bold text-base inline-block transition shadow-lg backdrop-blur-sm', row.diffClass]">
                  {{ row.diffTexto }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  cursos: {
    type: Array,
    default: () => []
  }
})

const API_URL = 'http://localhost:3000/api/director'
const token = () => localStorage.getItem('token')
const cursoAId = ref('')
const cursoBId = ref('')
const comparacion = ref(null)

async function loadComparacion () {
  if (!cursoAId.value || !cursoBId.value || cursoAId.value === cursoBId.value) return
  const url = `${API_URL}/comparacion?cursoA=${cursoAId.value}&cursoB=${cursoBId.value}`
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token()}`
      }
    })
    if (!res.ok) return
    comparacion.value = await res.json()
  } catch (err) {
    console.error('❌ Error en /comparacion', err)
  }
}

const tablaComparativa = computed(() => {
  if (!comparacion.value) return []
  const a = comparacion.value.cursoA
  const b = comparacion.value.cursoB
  const rows = [
    {
      label: 'Uso docentes (%)',
      a: `${a.usoProfesores}%`,
      b: `${b.usoProfesores}%`,
      diff: a.usoProfesores - b.usoProfesores
    },
    {
      label: 'Participación apoderados (%)',
      a: `${a.participacionApoderados}%`,
      b: `${b.participacionApoderados}%`,
      diff: a.participacionApoderados - b.participacionApoderados
    },
    {
      label: 'Asistencia (%)',
      a: `${a.asistencia}%`,
      b: `${b.asistencia}%`,
      diff: a.asistencia - b.asistencia
    },
    {
      label: 'Alumnos',
      a: a.totalAlumnos,
      b: b.totalAlumnos,
      diff: a.totalAlumnos - b.totalAlumnos
    }
  ]
  return rows.map(r => {
    let diffTexto = ''
    let diffClass = 'bg-slate-600/20 text-slate-200'
    if (r.diff > 0) {
      diffTexto = `+${r.diff}`
      diffClass = 'bg-emerald-500/20 text-emerald-400 ring ring-emerald-300/20'
    } else if (r.diff < 0) {
      diffTexto = `${r.diff}`
      diffClass = 'bg-rose-500/15 text-red-400 ring ring-rose-200/20'
    } else {
      diffTexto = '0'
      diffClass = 'bg-slate-800/50 text-slate-300'
    }
    return { ...r, diffTexto, diffClass }
  })
})
</script>

<style scoped>
.glass {
  background: rgba(29, 33, 57, 0.90);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
}
.text-gradient {
  background: linear-gradient(90deg, #38bdf8, #fb7185 80%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradComp 6s ease-in-out infinite;
}
@keyframes gradComp {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
