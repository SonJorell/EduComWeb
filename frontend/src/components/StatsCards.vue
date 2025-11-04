<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
    <div
      v-for="(card, index) in cards"
      :key="card.title"
      :style="{ animationDelay: `${index * 100}ms` }"
      class="group relative bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-slate-700/70 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden cursor-pointer animate-slide-up"
    >
      <!-- Brillo superior -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <!-- Blob de fondo -->
      <div :class="`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`"></div>
      
      <div class="relative z-10">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wide truncate mb-1">
              {{ card.title }}
            </h3>
            <p class="text-xs text-slate-500">{{ card.description }}</p>
          </div>
          <div :class="`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0 ml-3`">
            <i :data-lucide="card.icon" class="text-white w-6 h-6"></i>
          </div>
        </div>
        
        <!-- Valor principal -->
        <div class="mb-3">
          <p class="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
            {{ card.value }}
          </p>
          <div class="flex items-center gap-2">
            <span
              :class="[
                'text-sm font-semibold inline-flex items-center gap-1',
                card.trend === 'up' ? 'text-green-400' : card.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
              ]"
            >
              <i 
                :data-lucide="card.trend === 'up' ? 'trending-up' : card.trend === 'down' ? 'trending-down' : 'minus'" 
                class="w-4 h-4"
              ></i>
              {{ card.subtitle }}
            </span>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            :class="`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out relative shadow-lg`"
            :style="{ width: card.progress + '%' }"
          >
            <div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>

        <!-- Info adicional -->
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{{ card.meta }}</span>
          <span class="font-semibold">{{ card.progress }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'

const props = defineProps({
  estadisticas: {
    type: Object,
    default: () => ({})
  }
})

const cards = computed(() => [
  {
    title: 'Total Enviados',
    description: 'Este Mes',
    value: props.estadisticas?.totalEnviados || '128',
    subtitle: '+5% vs mes anterior',
    meta: 'Meta: 120',
    icon: 'mail',
    gradient: 'from-blue-500 to-cyan-500',
    trend: 'up',
    progress: 85
  },
  {
    title: 'Tasa Confirmación',
    description: 'Promedio General',
    value: props.estadisticas?.tasaConfirmacion || '91%',
    subtitle: 'Meta alcanzada',
    meta: 'Meta: >90%',
    icon: 'check-check',
    gradient: 'from-green-500 to-emerald-500',
    trend: 'up',
    progress: 91
  },
  {
    title: 'Pendientes',
    description: 'Últimos 7 días',
    value: props.estadisticas?.pendientes || '15',
    subtitle: 'Requieren atención',
    meta: 'De 128 enviados',
    icon: 'alert-circle',
    gradient: 'from-yellow-500 to-orange-500',
    trend: 'neutral',
    progress: 12
  }
])

onMounted(() => {
  createIcons({ icons })
})
</script>

<style scoped>
/* Animaciones */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
