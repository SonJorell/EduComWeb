<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { createIcons, icons } from 'lucide'
import { profesorService } from '@/services/profesorService'
import ModalComunicado from '@/components/ModalComunicado.vue'

const router = useRouter()

const modalAbierto = ref(false)
const comunicados = ref([])
const cursos = ref([])
const cursoFiltro = ref('Todos')
const tipoFiltro = ref('Todos')
const cargando = ref(false)
const error = ref(null)

// 🔄 Cargar comunicados y cursos
async function cargarDatos() {
  try {
    cargando.value = true
    const [resNotifs, resCursos] = await Promise.all([
      profesorService.obtenerNotificaciones(),
      profesorService.obtenerCursos(),
    ])
    comunicados.value = resNotifs.data || []
    cursos.value = resCursos.data || []

    // Re-pintar íconos una vez el DOM se actualiza
    await nextTick()
    createIcons({ icons })
  } catch (err) {
    console.error(err)
    error.value = 'Error al cargar los comunicados.'
  } finally {
    cargando.value = false
  }
}

// 🧩 Filtrar comunicados
const comunicadosFiltrados = computed(() => {
  return (comunicados.value || []).filter((c) => {
    // Filtro por tipo
    const okTipo =
      tipoFiltro.value === 'Todos' ||
      (c.tipo && String(c.tipo).toUpperCase() === tipoFiltro.value.toUpperCase())

    // Filtro por curso (si el backend incluye nombres de cursos)
    // Soporta: c.curso?.nombre (un curso) o c.cursos? (array de cursos)
    let okCurso = true
    if (cursoFiltro.value !== 'Todos') {
      if (c.curso?.nombre) {
        okCurso = c.curso.nombre === cursoFiltro.value
      } else if (Array.isArray(c.cursos)) {
        okCurso = c.cursos.some((cu) => cu?.nombre === cursoFiltro.value)
      }
    }

    return okTipo && okCurso
  })
})

// 🗑️ Eliminar comunicado
async function eliminarComunicado(id) {
  const confirmar = confirm('¿Deseas eliminar este comunicado? Esta acción no se puede deshacer.')
  if (!confirmar) return
  try {
    await profesorService.eliminarComunicado(id)
    comunicados.value = comunicados.value.filter((c) => c.id !== id)
    await nextTick()
    createIcons({ icons })
  } catch (err) {
    console.error(err)
    alert('Error al eliminar el comunicado.')
  }
}

// 👁️ Ver detalle
function verComunicado(id) {
  router.push(`/profesor/comunicados/${id}`)
}

onMounted(async () => {
  await cargarDatos()
  createIcons({ icons })
})
</script>

<template>
  <div class="bg-slate-900 text-slate-200 min-h-screen font-[Inter] flex">
    <!-- Sidebar fija -->
    <aside class="hidden md:flex flex-col bg-slate-800 w-64 p-6 border-r border-slate-700">
      <div class="flex items-center gap-3 mb-8">
        <div
          class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-slate-700"
        >
          <span class="text-lg font-black text-white transform -rotate-12">J2N</span>
        </div>
        <span class="text-xl font-bold">EduCom</span>
      </div>

      <nav class="flex-grow space-y-2">
        <a href="/profesor/dashboard" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700">
          <i data-lucide="layout-dashboard"></i> Dashboard
        </a>
        <a
          href="#"
          class="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow"
        >
          <i data-lucide="send"></i> Comunicados
        </a>
        <a href="/profesor/cursos" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700">
          <i data-lucide="book-open"></i> Cursos
        </a>
      </nav>

      <div class="pt-4 border-t border-slate-700">
        <a href="/configuracion" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700">
          <i data-lucide="settings"></i> Configuración
        </a>
      </div>
    </aside>

    <!-- Contenido -->
    <main class="flex-1 p-6 md:p-8 overflow-x-auto">
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-white">Comunicados</h1>
          <p class="text-slate-400">Gestión de mensajes y avisos enviados.</p>
        </div>

        <button
          @click="modalAbierto = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <i data-lucide="plus"></i>
          Nuevo Comunicado
        </button>
      </div>

      <!-- Filtros -->
      <section
        class="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 flex flex-wrap gap-4 items-center"
      >
        <div>
          <label class="text-sm text-slate-400 mr-2">Curso:</label>
          <select v-model="cursoFiltro" class="bg-slate-700 text-white rounded-lg p-2">
            <option>Todos</option>
            <option v-for="c in cursos" :key="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-slate-400 mr-2">Tipo:</label>
          <select v-model="tipoFiltro" class="bg-slate-700 text-white rounded-lg p-2">
            <option>Todos</option>
            <option>REUNION</option>
            <option>AVISO</option>
            <option>ANOTACION</option>
            <option>FELICITACION</option>
          </select>
        </div>
      </section>

      <!-- Estado -->
      <div v-if="cargando" class="text-center text-slate-400 py-10">Cargando comunicados...</div>
      <div v-else-if="error" class="text-center text-red-400 py-10">{{ error }}</div>

      <!-- Tabla -->
      <section v-else class="bg-slate-800 rounded-xl shadow border border-slate-700 overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-700/50 text-slate-400 uppercase text-xs">
            <tr>
              <th class="px-6 py-3">Título</th>
              <th class="px-6 py-3">Tipo</th>
              <th class="px-6 py-3 hidden md:table-cell">Curso</th>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3">Destinatarios</th>
              <th class="px-6 py-3 text-center">% Leído</th>
              <th class="px-6 py-3 text-center">% Confirmado</th>
              <th class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="n in comunicadosFiltrados"
              :key="n.id"
              class="border-b border-slate-700 hover:bg-slate-700/30 transition"
            >
              <td class="px-6 py-3 font-medium text-white">{{ n.titulo || '(Sin título)' }}</td>

              <td class="px-6 py-3">
                <span
                  :class="[
                    'text-xs px-2.5 py-0.5 rounded-full font-medium',
                    n.tipo === 'REUNION'
                      ? 'bg-indigo-900 text-indigo-300'
                      : n.tipo === 'AVISO'
                      ? 'bg-blue-900 text-blue-300'
                      : n.tipo === 'ANOTACION'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-green-900 text-green-300',
                  ]"
                >
                  {{ n.tipo || '—' }}
                </span>
              </td>

              <td class="px-6 py-3 hidden md:table-cell">
                <!-- Muestra 1 curso, varios, o guión si no viene del backend -->
                <span v-if="n.curso?.nombre">{{ n.curso.nombre }}</span>
                <span v-else-if="Array.isArray(n.cursos) && n.cursos.length">
                  {{ n.cursos.map(c => c?.nombre).filter(Boolean).join(', ') }}
                </span>
                <span v-else>—</span>
              </td>

              <td class="px-6 py-3 text-slate-400">
                {{ n.fecha || (n.createdAt ? n.createdAt.slice(0,10) : '—') }}
              </td>

              <td class="px-6 py-3 text-slate-300">
                {{ n.destinatarios != null ? (n.destinatarios === 1 ? '1 apoderado' : `${n.destinatarios} apoderados`) : '—' }}
              </td>

              <td class="px-6 py-3 text-center">{{ n.leido ?? 0 }}%</td>
              <td class="px-6 py-3 text-center">{{ n.confirmado ?? 0 }}%</td>

              <td class="px-6 py-3">
                <div class="flex justify-center gap-3">
                  <button
                    title="Ver"
                    class="text-blue-400 hover:text-blue-300"
                    @click="verComunicado(n.id)"
                  >
                    <i data-lucide="eye"></i>
                  </button>
                  <button
                    title="Eliminar"
                    class="text-red-400 hover:text-red-300"
                    @click="eliminarComunicado(n.id)"
                  >
                    <i data-lucide="trash-2"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="!comunicadosFiltrados.length && !cargando"
          class="p-6 text-center text-slate-400"
        >
          No hay comunicados para mostrar.
        </div>
      </section>
    </main>

    <!-- Modal -->
    <ModalComunicado
      :mostrar="modalAbierto"
      :cursos="cursos"
      @cerrar="modalAbierto=false"
      @actualizar="cargarDatos"
    />
  </div>
</template>

<style scoped>
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #2563eb; }
</style>
