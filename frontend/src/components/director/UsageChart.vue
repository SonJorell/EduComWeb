<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl glass w-full max-w-lg mx-auto relative overflow-hidden">
    <!-- Decorativos -->
    <div class="absolute top-0 left-0 w-20 h-8 bg-sky-400/20 blur-2xl rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-20 h-8 bg-cyan-400/20 blur-2xl rounded-full pointer-events-none"></div>

    <h2 class="text-base font-extrabold mb-4 text-gradient relative z-10">
      Uso de profesores (historial)
    </h2>
    <div class="relative z-10 flex items-center justify-center w-full">
      <canvas ref="canvas" style="height:170px;width:100%"></canvas>
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
      profesores: []
    })
  }
})

const canvas = ref(null)
let chartInstance = null

function buildChart () {
  if (!canvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const labels =
    props.data?.labels?.length ? props.data.labels : ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']

  const values =
    props.data?.profesores?.length ? props.data.profesores : [0, 0, 0, 0, 0]

  chartInstance = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Profesores activos (%)',
          data: values,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          backgroundColor: 'rgba(34,211,238, 0.18)',      // azul cielo
          borderColor: 'rgba(56,189,248,1)',              // azul celeste
          pointBackgroundColor: 'rgba(56,189,248,0.9)',
          pointBorderColor: 'rgba(8,145,178,1)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#38bdf8',
            boxWidth: 12
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#22d3ee',
            font: { size: 12, weight: 'bold' }
          },
          grid: {
            color: 'rgba(56,189,248,0.07)'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#22d3ee',
            callback: v => `${v}%`
          },
          grid: {
            color: 'rgba(56,189,248,0.07)'
          }
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
  background: rgba(28, 33, 57, 0.91);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.text-gradient {
  background: linear-gradient(90deg, #38bdf8 35%, #06b6d4 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: dashGradient 7s ease-in-out infinite;
}
@keyframes dashGradient {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
