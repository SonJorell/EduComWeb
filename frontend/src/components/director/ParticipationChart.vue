<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl glass w-full max-w-lg mx-auto relative overflow-hidden">
    <!-- Decorativos -->
    <div class="absolute top-0 left-0 w-20 h-8 bg-blue-500/15 blur-2xl rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-20 h-8 bg-purple-400/15 blur-2xl rounded-full pointer-events-none"></div>

    <h2 class="text-base font-extrabold mb-4 text-gradient relative z-10">
      Participación de apoderados (historial)
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
      apoderados: []
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
    props.data?.apoderados?.length ? props.data.apoderados : [0, 0, 0, 0, 0]

  chartInstance = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Apoderados participando (%)',
          data: values,
          borderWidth: 1.5,
          borderRadius: 6,
          backgroundColor: 'rgba(251,191,36,0.82)',          // amarillo ambar
          hoverBackgroundColor: 'rgba(139,92,246,0.95)'       // cambia a violeta en hover
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
            color: '#fbbf24',
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
            color: '#a5b4fc',
            font: { size: 12, weight: 'bold' }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#a5b4fc',
            callback: v => `${v}%`
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.1)'
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
  background: rgba(29, 33, 57, 0.90);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.text-gradient {
  background: linear-gradient(90deg, #a855f7 0%, #fbbf24 70%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: dashGradBar 7s ease-in-out infinite;
}
@keyframes dashGradBar {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
