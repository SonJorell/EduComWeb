<template>
  <div class="bg-slate-800/70 rounded-xl p-5 border border-slate-700 hover:border-blue-500 transition duration-300">
    <h3 class="text-lg font-bold text-blue-400 mb-1">{{ notificacion.titulo }}</h3>
    <p class="text-sm text-slate-300 mb-2">{{ notificacion.mensaje }}</p>

    <div class="text-xs text-slate-400 mb-3">
      <p><span class="font-semibold text-blue-300">Tipo:</span> {{ notificacion.tipo }}</p>
      <p><span class="font-semibold text-blue-300">Emitido por:</span> {{ notificacion.emisor }}</p>
      <p><span class="font-semibold text-blue-300">Fecha:</span> {{ new Date(notificacion.fecha).toLocaleString('es-CL') }}</p>
    </div>

    <button
      @click="$emit('confirmar', notificacion.id)"
      :disabled="notificacion.confirmado"
      class="w-full py-2 rounded-lg font-semibold transition-all duration-300"
      :class="notificacion.confirmado
        ? 'bg-green-600/60 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700'"
    >
      {{ notificacion.confirmado ? 'Asistencia Confirmada ✅' : 'Confirmar Asistencia' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  notificacion: Object
})
</script>
