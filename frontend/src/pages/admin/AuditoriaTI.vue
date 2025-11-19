<template>
  <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i data-lucide="history" class="w-5 h-5 text-amber-400"></i>
          Auditoría y Registros
        </h2>
        <p class="text-slate-400 text-sm">
          Revisa acciones críticas realizadas por los usuarios en el sistema.
        </p>
      </div>
      <button
        @click="cargarAuditoria"
        class="px-4 py-2 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
      >
        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
        Actualizar
      </button>
    </div>

    <!-- Filtros simples -->
    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="buscarUsuario"
        type="text"
        placeholder="Filtrar por usuario..."
        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
      />
      <input
        v-model="buscarAccion"
        type="text"
        placeholder="Filtrar por acción..."
        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
      />
    </div>

    <div class="overflow-x-auto rounded-xl border border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-300 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Fecha</th>
            <th class="px-4 py-3 text-left">Usuario</th>
            <th class="px-4 py-3 text-left">Rol</th>
            <th class="px-4 py-3 text-left">Acción</th>
            <th class="px-4 py-3 text-left">Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="reg in auditoriaFiltrada"
            :key="reg.id"
            class="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
          >
            <td class="px-4 py-3 text-slate-300">
              {{ formatearFecha(reg.fecha || reg.createdAt) }}
            </td>
            <td class="px-4 py-3 text-slate-100 font-medium">
              {{ reg.usuarioNombre || reg.usuario?.nombre || 'N/D' }}
            </td>
            <td class="px-4 py-3 text-slate-300">
              {{ reg.usuarioRol || reg.usuario?.rol?.nombre || '-' }}
            </td>
            <td class="px-4 py-3 text-slate-200">
              {{ reg.accion }}
            </td>
            <td class="px-4 py-3 text-slate-400 text-xs max-w-xs whitespace-pre-wrap">
              {{ reg.detalle || reg.detalles || '-' }}
            </td>
          </tr>

          <tr v-if="!auditoriaFiltrada.length && !cargando">
            <td colspan="5" class="px-4 py-6 text-center text-slate-500">
              No se encontraron registros de auditoría con los filtros aplicados.
            </td>
          </tr>
          <tr v-if="cargando">
            <td colspan="5" class="px-4 py-6 text-center text-slate-400">
              Cargando registros de auditoría...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const auditoria = ref([])
const cargando = ref(false)

const buscarUsuario = ref('')
const buscarAccion = ref('')

const cargarAuditoria = async () => {
  cargando.value = true
  const res = await adminService.obtenerAuditoria()
  if (!res.error) {
    auditoria.value = res.data || []
  }
  cargando.value = false
}

const auditoriaFiltrada = computed(() => {
  return auditoria.value.filter(reg => {
    const u = (reg.usuarioNombre || reg.usuario?.nombre || '').toLowerCase()
    const a = (reg.accion || '').toLowerCase()
    const fU = buscarUsuario.value.toLowerCase()
    const fA = buscarAccion.value.toLowerCase()

    return u.includes(fU) && a.includes(fA)
  })
})

const formatearFecha = (f) => {
  if (!f) return 's/fecha'
  const d = new Date(f)
  if (isNaN(d)) return f
  return d.toLocaleString('es-CL')
}

onMounted(async () => {
  createIcons({ icons })
  await cargarAuditoria()
})
</script>
