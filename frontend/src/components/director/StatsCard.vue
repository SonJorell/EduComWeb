<template>
  <div
    class="p-6 rounded-2xl glass border border-slate-800 shadow-xl overflow-hidden group
      relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl"
  >
    <!-- Blob decorativo de fondo -->
    <div :class="['absolute -top-8 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none transition duration-500 group-hover:opacity-30 opacity-15', color]" />
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 group-hover:opacity-80 transition-opacity"></div>

    <div class="relative z-10">
      <p class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
        {{ title }}
      </p>
      <p class="mt-1 text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow">
        {{ value }}
      </p>
      <p v-if="subtitle" class="mt-2 text-xs text-slate-400 font-medium">
        {{ subtitle }}
      </p>
      <!-- Barra de progreso o énfasis -->
      <div :class="['h-2 mt-5 rounded-full bg-gradient-to-r shadow-inner transition-all', color]" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'from-blue-500 to-cyan-500'
  }
})
</script>

<style scoped>
.glass {
  background: rgba(29, 33, 57, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
