<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-7 border border-slate-800 shadow-2xl glass">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500/60 to-orange-400/60 flex items-center justify-center shadow">
          <i class="lucide lucide-bar-chart-3 text-white w-4 h-4"></i>
        </div>
        <h2 class="text-base font-bold tracking-tight text-gradient drop-shadow">Ranking cursos con alertas</h2>
      </div>
      <span class="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-800/50 rounded">
        De mayor riesgo a más estable
      </span>
    </div>

    <p class="text-xs text-slate-400 mb-4">
      Considera: <span class="font-semibold text-blue-300">Uso docente</span>, <span class="font-semibold text-purple-300">participación apoderados</span> y <span class="font-semibold text-green-300">asistencia confirmada</span>.
      Los cursos <span class="text-red-400 font-semibold">en rojo</span> requieren máxima atención.
    </p>

    <div v-if="!sortedData.length" class="text-sm text-slate-500 py-12 text-center">
      <i class="lucide lucide-info w-7 h-7 text-blue-400 mb-1"></i>
      <p>No hay datos suficientes para generar el ranking.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-xs table-auto rounded-2xl overflow-hidden">
        <thead>
          <tr class="text-slate-400 border-b border-slate-700 text-xs uppercase bg-slate-800/60">
            <th class="pb-2 pt-1 px-4 text-left font-semibold">Curso</th>
            <th class="pb-2 pt-1 px-4 text-center font-semibold">Docentes</th>
            <th class="pb-2 pt-1 px-4 text-center font-semibold">Apoderados</th>
            <th class="pb-2 pt-1 px-4 text-center font-semibold">Asistencia</th>
            <th class="pb-2 pt-1 px-4 text-left font-semibold">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="curso in sortedData"
            :key="curso.id"
            :class="[
              'border-b border-slate-800 transition duration-200',
              curso.score < 40 ? 'bg-red-900/20' : curso.score < 65 ? 'bg-yellow-800/10' : 'bg-emerald-800/5',
              'hover:bg-slate-800/35'
            ]"
          >
            <td class="py-3 px-4">
              <span class="font-medium text-slate-100 text-sm">{{ curso.nombre }}</span>
            </td>

            <td class="py-3 px-4 text-center">
              <span :class="['font-semibold', getColor(curso.usoProfesores)]">
                <i class="lucide lucide-users-2 w-4 h-4 inline align-middle mr-1"></i>
                {{ curso.usoProfesores || 0 }}%
              </span>
            </td>

            <td class="py-3 px-4 text-center">
              <span :class="['font-semibold', getColor(curso.participacionApoderados)]">
                <i class="lucide lucide-mail w-4 h-4 inline align-middle mr-1"></i>
                {{ curso.participacionApoderados || 0 }}%
              </span>
            </td>

            <td class="py-3 px-4 text-center">
              <span :class="['font-semibold', getColor(curso.asistencia)]">
                <i class="lucide lucide-check-circle-2 w-4 h-4 inline align-middle mr-1"></i>
                {{ curso.asistencia || 0 }}%
              </span>
            </td>

            <td class="py-3 px-4 text-left">
              <span
                :class="[
                  'font-bold text-xs px-2 py-1 rounded',
                  curso.score < 40 ? 'bg-red-500/20 text-red-400' : 
                  curso.score < 65 ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-emerald-500/15 text-emerald-400'
                ]"
              >
                {{ curso.score !== undefined ? curso.score.toFixed(1) : '--' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

// Si usas Lucide icons globales, solo déjalos así; si no, importa local:
// import { createIcons } from 'lucide'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

function getColor(valor) {
  if (valor < 40) return 'text-red-400'
  if (valor < 70) return 'text-yellow-400'
  return 'text-emerald-400'
}

const sortedData = computed(() => {
  if (!props.data?.length) return []
  const clone = [...props.data]
  clone.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  // Top 6 cursos:
  // return clone.slice(0, 6)
  return clone
})

// onMounted(() => createIcons())
</script>

<style scoped>
.glass {
  background: rgba(27, 33, 53, 0.77);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.text-gradient {
  background: linear-gradient(90deg,#fa5252,#fab005 45%,#40c057 90%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glintGradient 6s ease-in-out infinite;
}
@keyframes glintGradient {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
