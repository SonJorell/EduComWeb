<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { profesorService } from '@/services/profesorService'

const route = useRoute()
const router = useRouter()
const comunicado = ref(null)
const cargando = ref(true)
const error = ref(null)
const filtroEstado = ref('Todos')

// Computed
const recepciones = computed(() => {
  if (!comunicado.value?.recepciones) return []
  
  if (filtroEstado.value === 'Todos') {
    return comunicado.value.recepciones
  } else if (filtroEstado.value === 'Leídos') {
    return comunicado.value.recepciones.filter(r => r.leido)
  } else if (filtroEstado.value === 'No leídos') {
    return comunicado.value.recepciones.filter(r => !r.leido)
  } else if (filtroEstado.value === 'Confirmados') {
    return comunicado.value.recepciones.filter(r => r.confirmado)
  } else if (filtroEstado.value === 'Pendientes') {
    return comunicado.value.recepciones.filter(r => !r.confirmado)
  }
  return comunicado.value.recepciones
})

const estadisticas = computed(() => {
  if (!comunicado.value?.recepciones) {
    return { leidos: 0, confirmados: 0, total: 0 }
  }
  
  const total = comunicado.value.recepciones.length
  const leidos = comunicado.value.recepciones.filter(r => r.leido).length
  const confirmados = comunicado.value.recepciones.filter(r => r.confirmado).length
  
  return {
    leidos: total > 0 ? Math.round((leidos / total) * 100) : 0,
    confirmados: total > 0 ? Math.round((confirmados / total) * 100) : 0,
    total
  }
})

const tipoConfig = computed(() => {
  const tipos = {
    'REUNION': { 
      color: 'from-indigo-500 to-purple-600', 
      bg: 'bg-indigo-500/20', 
      border: 'border-indigo-500/30', 
      text: 'text-indigo-300', 
      icon: 'calendar-check',
      gradient: 'from-indigo-500/10 via-purple-500/10 to-pink-500/10'
    },
    'AVISO': { 
      color: 'from-blue-500 to-cyan-600', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500/30', 
      text: 'text-blue-300', 
      icon: 'bell',
      gradient: 'from-blue-500/10 via-cyan-500/10 to-sky-500/10'
    },
    'ANOTACION': { 
      color: 'from-yellow-500 to-orange-600', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500/30', 
      text: 'text-yellow-300', 
      icon: 'alert-circle',
      gradient: 'from-yellow-500/10 via-orange-500/10 to-red-500/10'
    },
    'GENERAL': { 
      color: 'from-green-500 to-emerald-600', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30', 
      text: 'text-green-300', 
      icon: 'info',
      gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10'
    }
  }
  return tipos[comunicado.value?.tipo] || tipos['GENERAL']
})

// Methods
async function cargarComunicado() {
  try {
    cargando.value = true
    const id = route.params.id
    const res = await profesorService.obtenerComunicado(id)
    comunicado.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo cargar el comunicado.'
  } finally {
    cargando.value = false
    setTimeout(() => createIcons({ icons }), 100)
  }
}

function exportarCSV() {
  if (!comunicado.value?.recepciones) return
  
  const headers = ['Apoderado', 'Leído', 'Confirmado', 'Fecha Confirmación']
  const rows = comunicado.value.recepciones.map(r => [
    r.apoderado?.nombre || 'N/A',
    r.leido ? 'Sí' : 'No',
    r.confirmado ? 'Sí' : 'No',
    r.fechaConfirmacion ? new Date(r.fechaConfirmacion).toLocaleString('es-CL') : 'N/A'
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comunicado_${comunicado.value.id}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function imprimirDetalle() {
  window.print()
}

onMounted(async () => {
  await cargarComunicado()
  createIcons({ icons })
})
</script>

<template>
  <div class="bg-slate-950 text-slate-200 min-h-screen font-[Inter] relative">
    
    <!-- Efectos de fondo con colores sólidos -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:40px_40px]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
      
      <!-- Header mejorado -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-down">
        <div class="flex items-center gap-4">
          <button
            @click="router.back()"
            class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-blue-500 active:scale-95 group shadow-lg"
            title="Volver atrás"
          >
            <i data-lucide="arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i data-lucide="file-text" class="w-5 h-5 text-white"></i>
              </div>
              Detalle del Comunicado
            </h1>
            <p class="text-sm text-slate-400 mt-1">Información completa y estadísticas detalladas</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            @click="imprimirDetalle"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:scale-105 active:scale-100 border border-slate-700 hover:border-slate-600"
            title="Imprimir"
          >
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Imprimir</span>
          </button>
          <button
            @click="exportarCSV"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-green-600/30 hover:scale-105 active:scale-100"
            title="Exportar a CSV"
          >
            <i data-lucide="download" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-400 text-sm animate-pulse">Cargando comunicado...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-8 text-center animate-slide-up backdrop-blur-sm">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
          <i data-lucide="alert-circle" class="w-8 h-8 text-red-400"></i>
        </div>
        <p class="text-red-300 text-lg font-semibold mb-2">Error al cargar el comunicado</p>
        <p class="text-red-400/80 text-sm mb-4">{{ error }}</p>
        <button
          @click="cargarComunicado"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:scale-105 active:scale-100"
        >
          <i data-lucide="refresh-cw" class="w-4 h-4 inline mr-2"></i>
          Reintentar
        </button>
      </div>

      <!-- Contenido -->
      <div v-else class="space-y-6 animate-slide-up">
        
        <!-- Info principal con diseño premium -->
        <div class="bg-slate-900 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header del card con gradiente dinámico -->
          <div :class="`p-6 border-b border-slate-800 bg-gradient-to-r ${tipoConfig.gradient}`">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-white mb-3 leading-tight">{{ comunicado.titulo }}</h2>
                <div class="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span class="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    {{ new Date(comunicado.createdAt).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </span>
                  <span class="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                    <i data-lucide="clock" class="w-4 h-4"></i>
                    {{ new Date(comunicado.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-col items-end gap-2">
                <span :class="`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl ${tipoConfig.bg} ${tipoConfig.border} border-2 ${tipoConfig.text} shadow-lg`">
                  <i :data-lucide="tipoConfig.icon" class="w-4 h-4"></i>
                  {{ comunicado.tipo }}
                </span>
                <span class="text-sm text-slate-400 flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                  <i data-lucide="school" class="w-3.5 h-3.5"></i>
                  {{ comunicado.curso?.nombre || 'General' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Mensaje -->
          <div class="p-6 bg-slate-900/50">
            <div class="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div class="flex items-center gap-2 mb-3 text-slate-400">
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span class="text-sm font-semibold uppercase tracking-wide">Mensaje del Comunicado</span>
              </div>
              <p class="text-slate-200 leading-relaxed whitespace-pre-line">{{ comunicado.mensaje }}</p>
            </div>
          </div>
        </div>

        <!-- Estadísticas mejoradas -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <!-- Total Destinatarios -->
          <div class="bg-slate-900 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-all hover:scale-[1.03] group shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <i data-lucide="users" class="w-7 h-7 text-white"></i>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400 uppercase font-bold tracking-wide">Total</p>
              </div>
            </div>
            <h3 class="text-5xl font-black text-white mb-2">{{ estadisticas.total }}</h3>
            <p class="text-slate-400 text-sm font-medium">Apoderados destinatarios</p>
          </div>

          <!-- Leídos -->
          <div class="bg-slate-900 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-green-500/50 transition-all hover:scale-[1.03] group shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <i data-lucide="eye" class="w-7 h-7 text-white"></i>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400 uppercase font-bold tracking-wide">Leídos</p>
              </div>
            </div>
            <h3 class="text-5xl font-black text-white mb-2">{{ estadisticas.leidos }}%</h3>
            <div class="h-2.5 bg-slate-800 rounded-full overflow-hidden mt-3 shadow-inner">
              <div
                class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 shadow-lg"
                :style="{ width: estadisticas.leidos + '%' }"
              ></div>
            </div>
          </div>

          <!-- Confirmados -->
          <div class="bg-slate-900 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:scale-[1.03] group shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <i data-lucide="check-check" class="w-7 h-7 text-white"></i>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400 uppercase font-bold tracking-wide">Confirmados</p>
              </div>
            </div>
            <h3 class="text-5xl font-black text-white mb-2">{{ estadisticas.confirmados }}%</h3>
            <div class="h-2.5 bg-slate-800 rounded-full overflow-hidden mt-3 shadow-inner">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-lg"
                :style="{ width: estadisticas.confirmados + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Tabla de apoderados mejorada -->
        <section class="bg-slate-900 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header de la tabla -->
          <div class="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <div class="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <i data-lucide="users-2" class="w-5 h-5 text-purple-400"></i>
                  </div>
                  Estado por Apoderado
                </h2>
                <p class="text-sm text-slate-400 flex items-center gap-2">
                  <i data-lucide="filter" class="w-3.5 h-3.5"></i>
                  {{ recepciones.length }} de {{ estadisticas.total }} mostrados
                </p>
              </div>

              <!-- Filtro de estado -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-400 font-medium whitespace-nowrap">Filtrar:</span>
                <div class="relative">
                  <select
                    v-model="filtroEstado"
                    @change="createIcons({ icons })"
                    class="bg-slate-800 border-2 border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 pr-10 transition-all outline-none appearance-none cursor-pointer hover:bg-slate-700 hover:border-slate-600 font-medium"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Leídos">Leídos</option>
                    <option value="No leídos">No leídos</option>
                    <option value="Confirmados">Confirmados</option>
                    <option value="Pendientes">Pendientes</option>
                  </select>
                  <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Desktop: Tabla -->
          <div class="hidden lg:block overflow-x-auto bg-slate-900/50">
            <table class="w-full text-sm">
              <thead class="bg-slate-800 text-xs text-slate-300 uppercase tracking-wider border-b-2 border-slate-700">
                <tr>
                  <th class="px-6 py-4 font-bold text-left">
                    <div class="flex items-center gap-2">
                      <i data-lucide="user" class="w-4 h-4"></i>
                      Apoderado
                    </div>
                  </th>
                  <th class="px-6 py-4 font-bold text-center">
                    <div class="flex items-center justify-center gap-2">
                      <i data-lucide="eye" class="w-4 h-4"></i>
                      Leído
                    </div>
                  </th>
                  <th class="px-6 py-4 font-bold text-center">
                    <div class="flex items-center justify-center gap-2">
                      <i data-lucide="check-circle" class="w-4 h-4"></i>
                      Confirmado
                    </div>
                  </th>
                  <th class="px-6 py-4 font-bold text-center">
                    <div class="flex items-center justify-center gap-2">
                      <i data-lucide="clock" class="w-4 h-4"></i>
                      Fecha Confirmación
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-slate-900">
                <tr
                  v-for="r in recepciones"
                  :key="r.id"
                  class="border-b border-slate-800 hover:bg-slate-800 transition-all"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span class="text-sm font-bold text-white">{{ r.apoderado?.nombre?.charAt(0)?.toUpperCase() }}</span>
                      </div>
                      <span class="font-semibold text-white">{{ r.apoderado?.nombre || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${
                        r.leido 
                          ? 'bg-green-500/20 text-green-300 border-2 border-green-500/40 shadow-lg shadow-green-500/20' 
                          : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                      }`"
                    >
                      <i :data-lucide="r.leido ? 'check-circle-2' : 'circle'" class="w-4 h-4"></i>
                      {{ r.leido ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${
                        r.confirmado 
                          ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/40 shadow-lg shadow-blue-500/20' 
                          : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                      }`"
                    >
                      <i :data-lucide="r.confirmado ? 'check-check' : 'clock'" class="w-4 h-4"></i>
                      {{ r.confirmado ? 'Sí' : 'Pendiente' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center text-slate-300 font-medium">
                    {{ r.fechaConfirmacion ? new Date(r.fechaConfirmacion).toLocaleString('es-CL') : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vista Móvil: Cards -->
          <div class="lg:hidden bg-slate-900/50">
            <div
              v-for="r in recepciones"
              :key="r.id"
              class="p-5 border-b border-slate-800 hover:bg-slate-800 transition-all"
            >
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-sm font-bold text-white">{{ r.apoderado?.nombre?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-white truncate text-base">{{ r.apoderado?.nombre || 'N/A' }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${
                    r.leido 
                      ? 'bg-green-500/20 text-green-300 border-2 border-green-500/40' 
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                  }`"
                >
                  <i :data-lucide="r.leido ? 'check-circle-2' : 'circle'" class="w-4 h-4"></i>
                  Leído: {{ r.leido ? 'Sí' : 'No' }}
                </span>
                <span
                  :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg ${
                    r.confirmado 
                      ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/40' 
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                  }`"
                >
                  <i :data-lucide="r.confirmado ? 'check-check' : 'clock'" class="w-4 h-4"></i>
                  Confirmado: {{ r.confirmado ? 'Sí' : 'No' }}
                </span>
              </div>

              <p class="text-sm text-slate-400 flex items-center gap-1.5 bg-slate-800/50 px-3 py-2 rounded-lg">
                <i data-lucide="calendar" class="w-4 h-4"></i>
                {{ r.fechaConfirmacion ? new Date(r.fechaConfirmacion).toLocaleString('es-CL') : 'Sin confirmar' }}
              </p>
            </div>
          </div>

          <!-- Estado vacío -->
          <div v-if="!recepciones.length" class="p-16 text-center text-slate-400 bg-slate-900/50">
            <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700">
              <i data-lucide="inbox" class="w-10 h-10 text-slate-500"></i>
            </div>
            <p class="text-xl font-bold mb-2 text-white">No hay resultados</p>
            <p class="text-sm text-slate-500">No se encontraron apoderados con los filtros seleccionados.</p>
            <button
              @click="filtroEstado = 'Todos'"
              class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-slide-down {
  animation: slide-down 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

/* Scrollbar mejorado */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #6366f1);
  border-radius: 10px;
  border: 2px solid #0f172a;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2563eb, #4f46e5);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

* {
  -webkit-tap-highlight-color: transparent;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
