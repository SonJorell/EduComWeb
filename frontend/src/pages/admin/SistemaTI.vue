<template>
  <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i data-lucide="server-cog" class="w-5 h-5 text-cyan-400"></i>
          Estado del Sistema
        </h2>
        <p class="text-slate-400 text-sm">
          Información de la base de datos y logs básicos del backend (solo lectura).
        </p>
      </div>
      <button
        @click="refrescar"
        class="px-4 py-2 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
      >
        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
        Refrescar
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Estado BD -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 class="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
          <i data-lucide="database" class="w-4 h-4"></i>
          Base de Datos
        </h3>

        <div v-if="estadoBD">
          <p class="text-sm text-slate-200">
            Motor: <span class="text-slate-300">{{ estadoBD.provider }}</span>
          </p>
          <p class="text-sm text-slate-200">
            URL: <span class="text-slate-400 text-xs break-all">{{ estadoBD.url }}</span>
          </p>
          <p class="text-sm text-slate-200 mt-2">
            Estado:
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs border ml-1',
                estadoBD.ok
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-500/15 text-red-300 border-red-500/40'
              ]"
            >
              {{ estadoBD.ok ? 'Conectado' : 'Error de conexión' }}
            </span>
          </p>
          <p v-if="estadoBD.message" class="text-[11px] text-slate-500 mt-1">
            {{ estadoBD.message }}
          </p>
        </div>
        <p v-else class="text-sm text-slate-500">
          No se pudo obtener el estado de la base de datos.
        </p>
      </div>

      <!-- Logs -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 class="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
          <i data-lucide="file-terminal" class="w-4 h-4"></i>
          Logs recientes
        </h3>
        <div
          class="bg-slate-950/80 border border-slate-800 rounded-lg p-3 max-h-64 overflow-auto text-xs font-mono text-slate-300"
        >
          <template v-if="logs && logs.length">
            <div
              v-for="(log, idx) in logs"
              :key="idx"
              class="border-b border-slate-800 last:border-none pb-1 mb-1"
            >
              <span class="text-slate-500">
                [{{ log.timestamp || 's/fecha' }}]
              </span>
              <span class="ml-2 text-slate-200">
                {{ log.message || log }}
              </span>
            </div>
          </template>
          <p v-else class="text-slate-500">
            No hay logs disponibles o aún no se han registrado eventos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const estadoBD = ref(null)
const logs = ref([])

const cargarSistema = async () => {
  const [resBD, resLogs] = await Promise.all([
    adminService.obtenerEstadoBD(),
    adminService.obtenerLogsSistema()
  ])

  if (!resBD.error) {
    estadoBD.value = resBD.data || null
  }

  if (!resLogs.error) {
    logs.value = resLogs.data || []
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
