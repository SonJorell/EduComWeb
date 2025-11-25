<template>
  <div class="min-h-screen text-slate-200 p-6 font-sans">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center gap-3">
          <i data-lucide="history" class="text-amber-400 w-8 h-8"></i>
          Auditoría del Sistema
        </h1>
        <p class="text-slate-400 mt-1 text-sm">Registro detallado de todas las acciones realizadas en la plataforma.</p>
      </div>
      
      <button
        @click="cargarAuditoria"
        :disabled="cargando"
        class="group relative px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i data-lucide="refresh-cw" class="w-4 h-4 transition-transform duration-700" :class="{ 'animate-spin': cargando }"></i>
        <span>{{ cargando ? 'Actualizando...' : 'Refrescar Registros' }}</span>
      </button>
    </div>

    <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
      
      <div class="relative w-full md:w-1/2 group">
        <i data-lucide="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors w-4 h-4"></i>
        <input
          v-model="buscarUsuario"
          type="text"
          placeholder="Buscar por usuario..."
          class="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
      </div>

      <div class="relative w-full md:w-1/2 group">
        <i data-lucide="activity" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors w-4 h-4"></i>
        <input
          v-model="buscarAccion"
          type="text"
          placeholder="Filtrar por acción (ej: CREAR, ELIMINAR)..."
          class="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
      </div>
    </div>

    <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-240px)]">
      <div class="overflow-y-auto custom-scrollbar flex-1">
        <table class="w-full text-left border-collapse relative">
          <thead class="sticky top-0 z-10">
            <tr class="bg-slate-950/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 backdrop-blur-md shadow-sm">
              <th class="p-4 font-semibold w-40">Fecha</th>
              <th class="p-4 font-semibold w-48">Usuario</th>
              <th class="p-4 font-semibold w-32 text-center">Rol</th>
              <th class="p-4 font-semibold w-40 text-center">Acción</th>
              <th class="p-4 font-semibold">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr 
              v-for="reg in auditoriaFiltrada" 
              :key="reg.id" 
              class="hover:bg-slate-800/40 transition-colors group"
            >
              <td class="p-4 text-xs font-mono text-slate-400">
                {{ formatearFecha(reg.timestamp || reg.createdAt) }}
              </td>

              <td class="p-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {{ (reg.usuario?.nombre || 'S')[0] }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-white">{{ reg.usuario?.nombre || 'Sistema' }}</span>
                    <span class="text-[10px] text-slate-500">{{ reg.usuario?.email || 'N/A' }}</span>
                  </div>
                </div>
              </td>

              <td class="p-4 text-center">
                <span class="text-xs px-2 py-1 rounded border bg-slate-900/50 border-slate-700 text-slate-400">
                    {{ reg.usuario?.rol?.nombre || 'System' }}
                </span>
              </td>

              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm uppercase"
                  :class="getBadgeColor(reg.accion)"
                >
                  {{ reg.accion }}
                </span>
              </td>

              <td class="p-4 text-sm text-slate-300 leading-relaxed max-w-md truncate hover:whitespace-normal hover:bg-slate-900/90 hover:absolute hover:z-20 hover:shadow-xl hover:rounded-lg hover:border hover:border-slate-700 transition-all duration-200">
                {{ reg.descripcion || reg.detalle || '-' }}
              </td>
            </tr>

            <tr v-if="auditoriaFiltrada.length === 0 && !cargando">
              <td colspan="5" class="p-12 text-center text-slate-500">
                <div class="flex flex-col items-center gap-3">
                  <i data-lucide="search-x" class="w-12 h-12 opacity-50"></i>
                  <p>No se encontraron registros.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-3 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-500 text-right">
        Mostrando {{ auditoriaFiltrada.length }} registros
      </div>
    </div>

    <div v-if="cargando && !auditoria.length" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const auditoria = ref([])
const cargando = ref(false)
const buscarUsuario = ref('')
const buscarAccion = ref('')

// --- UTILS ---
const formatearFecha = (f) => {
  if (!f) return 's/fecha'
  return new Date(f).toLocaleString('es-CL', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const getBadgeColor = (accion) => {
  const a = (accion || '').toUpperCase()
  if (a.includes("ELIMINAR") || a.includes("BORRAR")) return "bg-red-500/10 text-red-400 border-red-500/20"
  if (a.includes("CREAR") || a.includes("NUEVO")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  if (a.includes("EDITAR") || a.includes("UPDATE") || a.includes("CAMBIO")) return "bg-amber-500/10 text-amber-400 border-amber-500/20"
  if (a.includes("LOGIN") || a.includes("ACCESO")) return "bg-blue-500/10 text-blue-400 border-blue-500/20"
  return "bg-slate-700/30 text-slate-300 border-slate-600/30"
}

// --- API ---
const cargarAuditoria = async () => {
  cargando.value = true
  try {
      const res = await adminService.obtenerAuditoria()
      if (!res.error) {
        auditoria.value = res.data || []
      }
  } catch(e) {
      console.error(e)
  } finally {
      cargando.value = false
      nextTick(() => createIcons({ icons }))
  }
}

const auditoriaFiltrada = computed(() => {
  return auditoria.value.filter(reg => {
    const u = (reg.usuario?.nombre || 'Sistema').toLowerCase()
    const a = (reg.accion || '').toLowerCase()
    
    const fU = buscarUsuario.value.toLowerCase()
    const fA = buscarAccion.value.toLowerCase()
    
    return u.includes(fU) && a.includes(fA)
  })
})

onMounted(async () => {
  createIcons({ icons })
  await cargarAuditoria()
})
</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
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