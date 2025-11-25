<template>
  <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-7 rounded-3xl border border-slate-800 shadow-2xl glass min-h-[180px] relative overflow-hidden">
    <!-- Fondo decorativo -->
    <div class="absolute -top-10 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute bottom-0 -left-8 w-20 h-14 bg-emerald-400/10 rounded-full blur-xl pointer-events-none"></div>
    <p class="text-[11px] text-blue-300 uppercase tracking-widest mb-2 font-bold relative z-10">
      Curso seleccionado
    </p>

    <div v-if="data" class="relative z-10">
      <h3 class="text-xl font-bold text-gradient mb-1 leading-tight">
        {{ data.curso || data.nombre || 'Curso' }}
      </h3>

      <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-slate-400 text-[11px] uppercase mb-0.5">Alumnos</p>
          <p class="text-lg font-extrabold text-white tracking-tight">
            {{ data.totalAlumnos ?? data.alumnos ?? 0 }}
          </p>
        </div>
        <div>
          <p class="text-slate-400 text-[11px] uppercase mb-0.5">Participación apoderados</p>
          <p class="text-lg font-extrabold text-emerald-300 tracking-tight">
            {{ data.participacionCurso ?? data.participacionApoderados ?? 0 }}%
          </p>
        </div>
      </div>

      <div class="mt-5 border-t border-slate-700/50 pt-4">
        <p class="text-[11px] text-blue-300 uppercase mb-2 font-semibold tracking-wide">
          Profesores asociados
        </p>
        <ul v-if="data.profesores?.length" class="text-[15px] font-medium space-y-1">
          <li v-for="(p, idx) in data.profesores" :key="idx" class="flex items-center gap-2">
            <i class="lucide lucide-user text-blue-400 w-4 h-4"></i>
            {{ p }}
          </li>
        </ul>
        <p v-else class="text-xs text-slate-500 mt-1">
          No hay profesores asociados en el registro.
        </p>
      </div>
    </div>

    <div v-else class="text-xs text-slate-500 mt-1 relative z-10 text-center p-4">
      Selecciona un curso para ver el detalle.
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.glass {
  background: rgba(29, 33, 57, 0.83);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.text-gradient {
  background: linear-gradient(90deg, #38bdf8, #5eead4 60%, #84cc16 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: detailGradient 7s ease-in-out infinite;
}
@keyframes detailGradient {
  0%,100%{background-position:0% 55%;}
  50%{background-position:100% 45%;}
}
</style>
