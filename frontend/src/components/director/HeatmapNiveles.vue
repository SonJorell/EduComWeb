<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl glass text-xs min-h-[265px] relative overflow-hidden">

    <!-- FONDOS DECORATIVOS -->
    <div class="absolute -top-10 left-0 w-20 h-20 bg-rose-400/10 blur-2xl rounded-full pointer-events-none"></div>
    <div class="absolute -bottom-8 right-0 w-36 h-20 bg-emerald-400/15 blur-2xl rounded-full pointer-events-none"></div>

    <p class="text-[12px] text-slate-300 mb-4 leading-relaxed font-medium relative z-10">
      <span class="font-bold text-lg text-gradient">Promedios por nivel</span>.<br>
      El color indica el riesgo general considerando uso docente,
      participación de apoderados y asistencia.
    </p>

    <div v-if="!data || !data.length" class="text-slate-500 py-16 text-center relative z-10">
      <i class="lucide lucide-blockquote w-8 h-8 text-slate-700 mb-2"></i>
      <p>No hay datos suficientes para generar el mapa de calor.</p>
    </div>

    <div v-else class="overflow-x-auto shadow-inner rounded-xl relative z-10">
      <table class="w-full min-w-[500px] border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 bg-slate-800/70 backdrop-blur">
            <th class="pb-3 pt-2 pl-4 text-left font-semibold uppercase tracking-wider text-xs rounded-tl-lg">Nivel</th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wider text-xs">Uso <span class="hidden sm:inline">docentes</span></th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wider text-xs">Participación</th>
            <th class="pb-3 pt-2 text-center font-semibold uppercase tracking-wider text-xs">Asistencia</th>
            <th class="pb-3 pt-2 pr-4 text-center font-semibold uppercase tracking-wider text-xs rounded-tr-lg">Score global</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="nivel in dataOrdenada"
            :key="nivel.nivel"
            class="border-b border-slate-900 hover:bg-slate-800/30 transition duration-150"
          >
            <td class="py-3 pl-4 text-left text-slate-200 font-semibold text-[14px]">
              {{ nivel.nivel }}
            </td>
            <td class="py-3 text-center">
              <span :class="['px-2 py-1 inline-block rounded font-semibold shadow transition', cellClass(nivel.usoProfesores)]">
                {{ nivel.usoProfesores ?? 0 }}%
              </span>
            </td>
            <td class="py-3 text-center">
              <span :class="['px-2 py-1 inline-block rounded font-semibold shadow transition', cellClass(nivel.participacionApoderados)]">
                {{ nivel.participacionApoderados ?? 0 }}%
              </span>
            </td>
            <td class="py-3 text-center">
              <span :class="['px-2 py-1 inline-block rounded font-semibold shadow transition', cellClass(nivel.asistencia)]">
                {{ nivel.asistencia ?? 0 }}%
              </span>
            </td>
            <td class="py-3 pr-4 text-center">
              <span :class="['px-2 py-1 inline-block rounded-xl font-bold transition text-base shadow', cellClass(nivel.score)]">
                {{ nivel.score !== undefined ? nivel.score.toFixed(1) : '--' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const dataOrdenada = computed(() => {
  const clone = [...props.data]
  return clone.sort((a, b) => a.nivel.localeCompare(b.nivel))
})

function cellClass (valor) {
  if (valor < 40) return 'bg-red-500/20 text-red-300 border border-red-500/20'
  if (valor < 70) return 'bg-yellow-400/15 text-yellow-200 border border-yellow-400/20'
  return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
}
</script>

<style scoped>
.glass {
  background: rgba(29, 33, 57, 0.84);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
}
.text-gradient {
  background: linear-gradient(90deg, #fa5252 0%, #fab005 55%, #40c057 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradMap 7s ease-in-out infinite;
}
@keyframes gradMap {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
