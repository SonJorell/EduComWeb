<template>
  <div class="chart-container bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-7 rounded-3xl border border-slate-800 shadow-2xl glass flex flex-col items-center relative overflow-hidden min-h-[340px]">
    <!-- Fondo decorativo animado -->
    <div class="absolute -top-10 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

    <div class="flex items-center w-full justify-between mb-5 z-10">
      <h2 class="text-base font-bold tracking-tight text-gradient drop-shadow">Tipos de notificación</h2>
      <p class="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-800/40 rounded">Distribución por tipo</p>
    </div>
    <div class="relative w-full flex-1 flex flex-col items-center justify-center">
      <canvas ref="canvas" class="!h-[210px] !w-[210px] mx-auto"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      labels: [],
      values: []
    })
  }
})

const chartColors = [
  'rgba(56,189,248,0.80)',
  'rgba(168,85,247,0.80)',
  'rgba(16,185,129,0.80)',
  'rgba(251,191,36,0.80)',
  'rgba(244,63,94,0.80)',
  'rgba(250,204,21,0.80)',
  'rgba(251,113,133,0.80)',
  'rgba(99,102,241,0.80)'
]

const hoverColors = [
  'rgba(56,189,248,1)',
  'rgba(168,85,247,1)',
  'rgba(16,185,129,1)',
  'rgba(251,191,36,1)',
  'rgba(244,63,94,1)',
  'rgba(250,204,21,1)',
  'rgba(251,113,133,1)',
  'rgba(99,102,241,1)'
]

const canvas = ref(null)
let chartInstance = null

function buildChart() {
  if (!canvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const labels =
    props.data?.labels?.length ? props.data.labels : ['REUNIÓN', 'AVISO', 'ANOTACIÓN', 'FELICITACIÓN']

  const values =
    props.data?.values?.length ? props.data.values : [40, 30, 20, 10]

  chartInstance = new Chart(canvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: chartColors,
          hoverBackgroundColor: hoverColors,
          borderColor: 'rgba(180,180,255,0.06)',
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#e2e8f0',
            usePointStyle: true,
            boxWidth: 12,
            padding: 18,
            font: { size: 13, family: "'Inter', sans-serif", weight: "bold" }
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: '#64748b',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#f3f4f6',
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: ctx => {
              const label = ctx.label || ''
              const value = ctx.parsed || 0
              const all = ctx.dataset?.data?.reduce((a, b) => a + b, 0) || 1
              const percent = ((value / all) * 100).toFixed(1)
              return `${label}: ${value} (${percent}%)`
            }
          }
        }
      },
      cutout: '70%',
      animation: {
        tension: {
          duration: 1100,
          easing: 'easeInOutCirc',
          from: 1,
          to: 0,
          loop: false
        }
      }
    }
  })
}

onMounted(buildChart)

watch(
  () => props.data,
  () => buildChart(),
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.glass {
  background: rgba(28,35,52,0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.text-gradient {
  background: linear-gradient(90deg, #38bdf8, #a855f7, #fb7185);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: animatedGradient 6s ease-in-out infinite;
}
@keyframes animatedGradient {
  0%,100% {background-position:0% 50%;}
  50% {background-position:100% 50%;}
}
</style>
