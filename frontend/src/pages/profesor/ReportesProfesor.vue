<script setup>
import { onMounted, computed, ref } from 'vue'
import { useNotificacionesStore } from '@/store/notificaciones' // Asegúrate de que la ruta sea correcta
import { createIcons, icons } from 'lucide'

// ==================== STATE ====================
const notifs = useNotificacionesStore()
const loading = ref(true)

// ==================== COMPUTED ====================
// Mapeamos los datos del store a un formato visual para iterar en el template
const statsCards = computed(() => [
  {
    id: 1,
    title: 'Cursos Asignados',
    value: notifs.resumen?.cursos || 0,
    icon: 'book-open',
    color: 'from-blue-500 to-cyan-500',
    bgIcon: 'bg-blue-500/10 text-blue-400',
    desc: 'Grupos activos'
  },
  {
    id: 2,
    title: 'Alumnos Totales',
    value: notifs.resumen?.alumnos || 0,
    icon: 'users',
    color: 'from-green-500 to-emerald-500',
    bgIcon: 'bg-green-500/10 text-green-400',
    desc: 'Matrícula vigente'
  },
  {
    id: 3,
    title: 'Notificaciones',
    value: notifs.resumen?.notificaciones || 0,
    icon: 'send',
    color: 'from-purple-500 to-pink-500',
    bgIcon: 'bg-purple-500/10 text-purple-400',
    desc: 'Enviadas este ciclo'
  }
])

// ==================== LIFECYCLE ====================
onMounted(async () => {
  try {
    loading.value = true
    await notifs.cargarResumen()
  } catch (error) {
    console.error("Error cargando resumen:", error)
  } finally {
    loading.value = false
    // Inicializamos iconos después de cargar
    setTimeout(() => createIcons({ icons }), 100)
  }
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-indigo-500/10 rounded-lg">
            <i data-lucide="bar-chart-2" class="w-6 h-6 text-indigo-400"></i>
        </div>
        <div>
            <h2 class="text-xl font-bold text-white">Resumen Académico</h2>
            <p class="text-sm text-slate-400">Vista general de tu actividad</p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      <template v-if="loading">
        <div v-for="n in 3" :key="n" class="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 animate-pulse">
            <div class="flex justify-between items-start mb-4">
                <div class="h-4 w-24 bg-slate-800 rounded"></div>
                <div class="h-10 w-10 bg-slate-800 rounded-xl"></div>
            </div>
            <div class="h-8 w-16 bg-slate-800 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-800 rounded"></div>
        </div>
      </template>

      <template v-else>
        <div 
          v-for="(card, index) in statsCards" 
          :key="card.id"
          class="group bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 relative overflow-hidden"
        >
          <div :class="`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`"></div>

          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wide">{{ card.title }}</h3>
                </div>
                <div :class="`p-2.5 rounded-xl ${card.bgIcon} shadow-lg`">
                    <i :data-lucide="card.icon" class="w-5 h-5"></i>
                </div>
            </div>

            <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white tracking-tight">{{ card.value }}</span>
            </div>
            
            <div class="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <div :class="`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color}`"></div>
                {{ card.desc }}
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>