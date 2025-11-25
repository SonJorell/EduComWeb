<template>
  <div class="min-h-screen text-slate-200 p-6 font-sans">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
          <i data-lucide="server-cog" class="text-cyan-400 w-8 h-8"></i>
          Estado del Sistema
        </h1>
        <p class="text-slate-400 mt-1 text-sm">Monitoreo de base de datos y registros de auditoría.</p>
      </div>
      
      <button
        @click="refrescar"
        :disabled="cargando"
        class="group relative px-5 py-2.5 bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i data-lucide="refresh-cw" class="w-4 h-4 transition-transform duration-700" :class="{ 'animate-spin': cargando }"></i>
        <span>{{ cargando ? 'Actualizando...' : 'Refrescar Datos' }}</span>
      </button>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">

      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div class="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 class="font-bold text-white flex items-center gap-2">
                <i data-lucide="database" class="w-5 h-5 text-cyan-400"></i> Base de Datos
            </h3>
            <div class="flex items-center gap-2">
                <span class="relative flex h-2.5 w-2.5">
                  <span v-if="estadoBD?.ok" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="estadoBD?.ok ? 'bg-emerald-500' : 'bg-red-500'"></span>
                </span>
                <span class="text-xs font-medium" :class="estadoBD?.ok ? 'text-emerald-400' : 'text-red-400'">
                    {{ estadoBD?.ok ? 'Conectado' : 'Desconectado' }}
                </span>
            </div>
        </div>

        <div class="p-8 flex-1 flex flex-col justify-center items-center gap-6 relative">
             <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>

             <div class="grid grid-cols-2 gap-4 w-full">
                <div class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                    <p class="text-xs text-slate-400 uppercase font-bold mb-1">Motor</p>
                    <p class="text-lg font-bold text-white flex items-center justify-center gap-2">
                        <i data-lucide="hard-drive" class="w-4 h-4 text-cyan-400"></i> MySQL
                    </p>
                </div>
                <div class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                    <p class="text-xs text-slate-400 uppercase font-bold mb-1">Tablas</p>
                    <p class="text-lg font-bold text-white">
                        {{ estadoBD?.tablas?.length || 0 }}
                    </p>
                </div>
             </div>

             <div class="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 h-48 overflow-y-auto custom-scrollbar">
                <p class="text-xs text-slate-500 mb-2 uppercase font-bold sticky top-0 bg-slate-950/90 py-1 backdrop-blur">Estructura detectada:</p>
                <ul class="space-y-1">
                    <li v-for="(t, i) in estadoBD?.tablas" :key="i" class="text-xs text-cyan-200/80 flex items-center gap-2">
                        <i data-lucide="table" class="w-3 h-3 text-slate-600"></i>
                        {{ Object.values(t)[0] }}
                    </li>
                </ul>
             </div>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        <div class="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 class="font-bold text-white flex items-center gap-2">
                <i data-lucide="file-clock" class="w-5 h-5 text-pink-400"></i> Auditoría Reciente
            </h3>
            <span class="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{{ logs.length }} eventos</span>
        </div>

        <div class="flex-1 overflow-y-auto p-0 custom-scrollbar relative">
            <div v-if="logs.length" class="relative pl-8 pr-6 py-6 space-y-6">
                <div class="absolute left-[29px] top-6 bottom-6 w-0.5 bg-slate-800"></div>

                <div v-for="log in logs" :key="log.id" class="relative">
                    <div class="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 shadow" :class="getColorDot(log.accion)"></div>

                    <div class="flex flex-col gap-1">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold tracking-wide" :class="getColorText(log.accion)">
                                {{ log.accion }}
                            </span>
                            <span class="text-[10px] text-slate-500 font-mono">
                                {{ formatFecha(log.timestamp) }}
                            </span>
                        </div>
                        <p class="text-sm text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                            {{ log.descripcion }}
                        </p>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <i data-lucide="user" class="w-3 h-3 text-slate-500"></i>
                            <span class="text-xs text-slate-400">
                                Usuario: <span class="text-sky-300">{{ log.usuario?.nombre || 'Sistema' }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="h-full flex flex-col items-center justify-center text-slate-500">
                <i data-lucide="activity" class="w-12 h-12 opacity-20 mb-3"></i>
                <p>No hay registros de actividad.</p>
            </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { createIcons, icons } from "lucide"
import { adminService } from "@/services/adminService"

const estadoBD = ref(null)
const logs = ref([])
const cargando = ref(false)

// --- UTILS ---
const formatFecha = (ts) => {
  if (!ts) return "s/fecha"
  return new Date(ts).toLocaleString("es-CL", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  })
}

const getColorDot = (accion) => {
  const a = (accion || '').toUpperCase()
  if (a.includes("CREAR") || a.includes("ASIGNAR")) return "bg-emerald-500"
  if (a.includes("ELIMINAR") || a.includes("DESASIGNAR")) return "bg-red-500"
  if (a.includes("EDITAR") || a.includes("CAMBIO")) return "bg-yellow-400"
  return "bg-blue-500"
}

const getColorText = (accion) => {
  const a = (accion || '').toUpperCase()
  if (a.includes("CREAR") || a.includes("ASIGNAR")) return "text-emerald-400"
  if (a.includes("ELIMINAR") || a.includes("DESASIGNAR")) return "text-red-400"
  if (a.includes("EDITAR") || a.includes("CAMBIO")) return "text-yellow-300"
  return "text-blue-400"
}

// --- API ---
const cargarSistema = async () => {
  cargando.value = true
  try {
      const [resBD, resLogs] = await Promise.all([
        adminService.obtenerEstadoBD(),
        adminService.obtenerLogsSistema()
      ])

      if (!resBD.error) estadoBD.value = resBD.data
      if (!resLogs.error) logs.value = resLogs.data || []

  } catch (e) {
      console.error(e)
  } finally {
      cargando.value = false
      nextTick(() => createIcons({ icons }))
  }
}

const refrescar = async () => {
  await cargarSistema()
}

onMounted(async () => {
  createIcons({ icons })
  await cargarSistema()
})
</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>