<script setup>
import { computed, onMounted, watch } from 'vue'
import { createIcons, icons } from 'lucide'

const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  icon: { type: String, default: 'circle' },
  color: { type: String, default: 'blue' } // blue | green | purple | red | cyan | orange
})

defineEmits(['open'])

// Configuración de Temas (Centralizada para fácil edición)
const themes = {
  blue: {
    blob: 'from-blue-600 to-cyan-500',
    iconBg: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    borderHover: 'group-hover:border-blue-500/50',
    button: 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
  },
  green: {
    blob: 'from-emerald-500 to-teal-500',
    iconBg: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderHover: 'group-hover:border-emerald-500/50',
    button: 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
  },
  purple: {
    blob: 'from-purple-600 to-pink-500',
    iconBg: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    borderHover: 'group-hover:border-purple-500/50',
    button: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10'
  },
  red: {
    blob: 'from-red-600 to-orange-600',
    iconBg: 'from-red-500/20 to-orange-500/20 text-red-400',
    borderHover: 'group-hover:border-red-500/50',
    button: 'text-red-400 border-red-500/30 hover:bg-red-500/10'
  },
  cyan: {
    blob: 'from-cyan-500 to-blue-500',
    iconBg: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    borderHover: 'group-hover:border-cyan-500/50',
    button: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10'
  },
  orange: {
    blob: 'from-orange-500 to-yellow-500',
    iconBg: 'from-orange-500/20 to-yellow-500/20 text-orange-400',
    borderHover: 'group-hover:border-orange-500/50',
    button: 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10'
  }
}

// Seleccionar el tema actual o usar 'blue' por defecto
const currentTheme = computed(() => themes[props.color] || themes.blue)

onMounted(() => {
  createIcons({ icons })
})
</script>

<template>
  <div
    class="group relative bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 overflow-hidden cursor-pointer flex flex-col h-full"
    :class="currentTheme.borderHover"
    @click="$emit('open')"
  >
    <div 
      class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none"
      :class="currentTheme.blob"
    ></div>

    <div class="relative z-10 flex items-start gap-4 mb-4">
      <div 
        class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br border border-white/5 shadow-inner shrink-0 transition-transform group-hover:scale-110 duration-300"
        :class="currentTheme.iconBg"
      >
        <i :data-lucide="icon" class="w-6 h-6"></i>
      </div>
      
      <div>
        <h2 class="text-lg font-bold text-white group-hover:text-white transition-colors leading-tight mb-1">
          {{ title }}
        </h2>
        <div class="w-8 h-1 rounded-full bg-slate-700 group-hover:bg-white/20 transition-colors"></div>
      </div>
    </div>

    <p class="relative z-10 text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
      {{ desc }}
    </p>

    <div class="relative z-10 mt-auto">
      <button
        class="w-full py-2.5 px-4 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-95"
        :class="currentTheme.button"
      >
        Abrir módulo
        <i data-lucide="arrow-right" class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"></i>
      </button>
    </div>

  </div>
</template>