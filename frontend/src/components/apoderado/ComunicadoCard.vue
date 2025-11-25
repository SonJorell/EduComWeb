<script setup>
import { computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'

const props = defineProps({
  notificacion: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirmar'])

// Colores dinámicos según tipo
const tipoClase = computed(() => {
  switch (props.notificacion.tipo) {
    case 'REUNION': return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    case 'FELICITACION': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    case 'ANOTACION': return 'text-red-400 bg-red-500/10 border-red-500/20'
    default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  }
})

// Icono dinámico
const iconoTipo = computed(() => {
  switch (props.notificacion.tipo) {
    case 'REUNION': return 'users'
    case 'FELICITACION': return 'star'
    case 'ANOTACION': return 'alert-circle'
    default: return 'bell'
  }
})

onMounted(() => {
  createIcons({ icons })
})
</script>

<template>
  <div
    class="group relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-900/20 hover:-translate-y-1 overflow-hidden"
  >
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

    <div class="flex justify-between items-start mb-4 relative z-10">
      <span :class="`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${tipoClase}`">
        <i :data-lucide="iconoTipo" class="w-3 h-3"></i>
        {{ notificacion.tipo }}
      </span>
      
      <span class="text-xs text-slate-500 flex items-center gap-1 bg-slate-950/30 px-2 py-1 rounded-lg border border-slate-800">
        <i data-lucide="calendar" class="w-3 h-3"></i>
        {{ notificacion.fecha }}
      </span>
    </div>

    <div class="mb-6 relative z-10">
      <h3 class="text-lg font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">
        {{ notificacion.titulo }}
      </h3>
      <p class="text-sm text-slate-400 leading-relaxed line-clamp-3">
        {{ notificacion.mensaje }}
      </p>
      
      <div v-if="notificacion.emisor" class="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <i data-lucide="user-circle" class="w-4 h-4 text-slate-400"></i>
        <span>Por: <span class="text-slate-300 font-medium">{{ notificacion.emisor }}</span></span>
      </div>
    </div>

    <div class="relative z-10 mt-auto">
      <button
        @click="$emit('confirmar', notificacion.id)"
        :disabled="notificacion.confirmado"
        class="w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 border"
        :class="notificacion.confirmado
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
          : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 text-white hover:from-emerald-600 hover:to-teal-600 hover:border-emerald-500 hover:shadow-lg shadow-black/20 active:scale-95'"
      >
        <template v-if="notificacion.confirmado">
          <i data-lucide="check-check" class="w-4 h-4"></i>
          Asistencia Confirmada
        </template>
        <template v-else>
          <i data-lucide="pen-tool" class="w-4 h-4"></i>
          Confirmar Lectura
        </template>
      </button>
    </div>
    
  </div>
</template>