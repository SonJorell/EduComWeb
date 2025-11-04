<template>
  <section class="glass bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden animate-slide-up">
    
    <!-- Header mejorado -->
    <div class="p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/30 backdrop-blur-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Título -->
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i data-lucide="file-text" class="w-5 h-5 text-blue-400"></i>
            </div>
            <span>Comunicados Recientes</span>
          </h2>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i data-lucide="layers" class="w-3.5 h-3.5"></i>
            Mostrando {{ comunicadosFiltrados.length }} de {{ notificaciones.length }} comunicados
          </p>
        </div>
        
        <!-- Filtros -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filtro por curso -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-400 font-medium whitespace-nowrap">Curso:</span>
            <div class="relative">
              <select
                v-model="filtro"
                class="bg-slate-800/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 px-3 py-2 pr-10 transition-all outline-none appearance-none cursor-pointer hover:bg-slate-700 backdrop-blur-sm"
              >
                <option value="Todos">Todos los cursos</option>
                <option v-for="curso in cursos" :key="curso" :value="curso">
                  {{ curso }}
                </option>
              </select>
              <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- Botón buscar -->
          <button
            class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
            title="Buscar"
          >
            <i data-lucide="search" class="w-4 h-4"></i>
          </button>

          <!-- Botón actualizar -->
          <button
            @click="actualizarDatos"
            :disabled="cargando"
            class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all disabled:opacity-50"
            title="Actualizar"
          >
            <i data-lucide="refresh-cw" :class="['w-4 h-4', cargando && 'animate-spin']"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Vista Desktop: Tabla -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider backdrop-blur-sm">
          <tr>
            <th class="px-6 py-4 font-semibold text-left">
              <div class="flex items-center gap-2">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                Título
              </div>
            </th>
            <th class="px-6 py-4 font-semibold text-left">
              <div class="flex items-center gap-2">
                <i data-lucide="users" class="w-3.5 h-3.5"></i>
                Destinatario(s)
              </div>
            </th>
            <th class="px-6 py-4 font-semibold text-left">
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                Fecha Envío
              </div>
            </th>
            <th class="px-6 py-4 font-semibold text-center">
              <div class="flex items-center justify-center gap-2">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                % Leído
              </div>
            </th>
            <th class="px-6 py-4 font-semibold text-center">
              <div class="flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                % Confirmado
              </div>
            </th>
            <th class="px-6 py-4 font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="!cargando">
          <tr
            v-for="n in comunicadosFiltrados"
            :key="n.id"
            class="bg-slate-900/30 border-b border-slate-800/50 hover:bg-slate-800/50 transition-all group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all"></div>
                <span class="font-semibold text-white group-hover:text-blue-400 transition-colors truncate max-w-xs">
                  {{ n.titulo }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-300">
              <span class="flex items-center gap-2">
                <i data-lucide="users-2" class="w-4 h-4 text-slate-500"></i>
                {{ n.destinatarios }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-400">
              <span class="flex items-center gap-2">
                <i data-lucide="calendar-days" class="w-4 h-4 text-slate-500"></i>
                {{ n.fecha }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
                  n.leido >= 90
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                    : n.leido >= 50
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                }`"
              >
                <i :data-lucide="n.leido >= 90 ? 'eye' : 'eye-off'" class="w-3.5 h-3.5"></i>
                {{ n.leido }}%
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
                  n.confirmado >= 90
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                    : n.confirmado >= 50
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                }`"
              >
                <i :data-lucide="n.confirmado >= 90 ? 'check-circle-2' : 'clock'" class="w-3.5 h-3.5"></i>
                {{ n.confirmado }}%
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="verDetalle(n)"
                  class="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all hover:scale-110 active:scale-100"
                  title="Ver detalle"
                >
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
                <button
                  @click="editarComunicado(n)"
                  class="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all hover:scale-110 active:scale-100"
                  title="Editar"
                >
                  <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button
                  @click="eliminarComunicado(n)"
                  class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 active:scale-100"
                  title="Eliminar"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loader para tabla -->
      <div v-if="cargando" class="p-12 flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-400 text-sm">Cargando comunicados...</p>
      </div>

      <!-- Estado vacío para tabla -->
      <div v-if="!cargando && !comunicadosFiltrados.length" class="p-12 text-center text-slate-400">
        <div class="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
          <i data-lucide="inbox" class="w-8 h-8 text-slate-500"></i>
        </div>
        <p class="text-lg font-semibold mb-1 text-white">No hay comunicados</p>
        <p class="text-sm text-slate-500">
          {{ filtro === 'Todos' ? 'No se encontraron comunicados.' : `No hay comunicados para el curso ${filtro}.` }}
        </p>
      </div>
    </div>

    <!-- Vista Móvil: Tarjetas -->
    <div class="lg:hidden">
      <div v-if="cargando" class="p-12 flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-slate-400 text-sm">Cargando comunicados...</p>
      </div>

      <div
        v-else-if="comunicadosFiltrados.length"
        v-for="n in comunicadosFiltrados"
        :key="n.id"
        class="p-5 border-b border-slate-800/50 hover:bg-slate-800/40 transition-all active:bg-slate-800/60"
      >
        <!-- Header de la tarjeta -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-white text-base mb-1 line-clamp-2">{{ n.titulo }}</h3>
            <p class="text-sm text-slate-400 flex items-center gap-1.5">
              <i data-lucide="calendar-days" class="w-3.5 h-3.5"></i>
              {{ n.fecha }}
            </p>
          </div>
          <button
            @click="verDetalle(n)"
            class="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all active:scale-95 flex-shrink-0"
          >
            <i data-lucide="eye" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Destinatarios -->
        <div class="flex items-center gap-2 mb-3 text-sm text-slate-300">
          <i data-lucide="users-2" class="w-4 h-4 text-slate-500 flex-shrink-0"></i>
          <span class="truncate">{{ n.destinatarios }}</span>
        </div>

        <!-- Badges de estado -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              n.leido >= 90
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`"
          >
            <i :data-lucide="n.leido >= 90 ? 'eye' : 'eye-off'" class="w-3.5 h-3.5"></i>
            Leído: {{ n.leido }}%
          </span>
          <span
            :class="`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              n.confirmado >= 90
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`"
          >
            <i :data-lucide="n.confirmado >= 90 ? 'check-circle-2' : 'clock'" class="w-3.5 h-3.5"></i>
            Confirmado: {{ n.confirmado }}%
          </span>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2 pt-3 border-t border-slate-700/50">
          <button
            @click="editarComunicado(n)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm font-medium"
          >
            <i data-lucide="edit" class="w-4 h-4"></i>
            Editar
          </button>
          <button
            @click="eliminarComunicado(n)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-lg transition-all text-sm font-medium"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            Eliminar
          </button>
        </div>
      </div>

      <!-- Estado vacío móvil -->
      <div v-if="!cargando && !comunicadosFiltrados.length" class="p-8 text-center text-slate-400">
        <div class="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
          <i data-lucide="inbox" class="w-8 h-8 text-slate-500"></i>
        </div>
        <p class="text-lg font-semibold mb-1 text-white">No hay comunicados</p>
        <p class="text-sm text-slate-500">
          {{ filtro === 'Todos' ? 'No se encontraron comunicados.' : `No hay comunicados para el curso ${filtro}.` }}
        </p>
      </div>
    </div>

    <!-- Footer con paginación -->
    <div v-if="comunicadosFiltrados.length" class="p-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
      <p class="text-slate-400 text-sm text-center sm:text-left">
        Mostrando <span class="text-white font-semibold">{{ comunicadosFiltrados.length }}</span> de <span class="text-white font-semibold">{{ notificaciones.length }}</span> comunicados
      </p>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="flex items-center gap-1">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Anterior</span>
          </span>
        </button>
        <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-100">
          <span class="flex items-center gap-1">
            <span class="hidden sm:inline">Siguiente</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'

// Props
const props = defineProps({
  notificaciones: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['ver-detalle', 'editar', 'eliminar', 'actualizar'])

// State
const filtro = ref('Todos')
const cargando = ref(false)
const cursos = ['1°A', '2°B', '3°C', '4°D', '5°E', '6°F', '7°G', '8°A']

// Computed
const comunicadosFiltrados = computed(() => {
  if (filtro.value === 'Todos') {
    return props.notificaciones
  }
  return props.notificaciones.filter(n => n.destinatarios.includes(filtro.value))
})

// Methods
function verDetalle(comunicado) {
  emit('ver-detalle', comunicado)
}

function editarComunicado(comunicado) {
  emit('editar', comunicado)
}

function eliminarComunicado(comunicado) {
  if (confirm(`¿Estás seguro de eliminar "${comunicado.titulo}"?`)) {
    emit('eliminar', comunicado)
  }
}

function actualizarDatos() {
  cargando.value = true
  emit('actualizar')
  setTimeout(() => {
    cargando.value = false
    createIcons({ icons })
  }, 1000)
}

// Lifecycle
onMounted(() => {
  createIcons({ icons })
})
</script>

<style scoped>
/* Glass morphism */
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animación slide-up */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

/* Tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
