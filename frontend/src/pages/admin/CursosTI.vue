<template>
  <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i data-lucide="book-open" class="w-5 h-5 text-green-400"></i>
          Gestión de Cursos
        </h2>
        <p class="text-slate-400 text-sm">
          Administra cursos, niveles, jornadas y asigna profesores jefes.
        </p>
      </div>
      <button
        @click="abrirCrear"
        class="px-4 py-2 bg-green-600/80 hover:bg-green-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
      >
        <i data-lucide="plus" class="w-4 h-4"></i>
        Nuevo Curso
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto rounded-xl border border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-300 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nombre</th>
            <th class="px-4 py-3 text-left">Nivel</th>
            <th class="px-4 py-3 text-left">Jornada</th>
            <th class="px-4 py-3 text-left">Año</th>
            <th class="px-4 py-3 text-left">Profesor Jefe</th>
            <th class="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in cursos"
            :key="c.id"
            class="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-slate-100">{{ c.nombre }}</td>
            <td class="px-4 py-3 text-slate-300">{{ c.nivel }}</td>
            <td class="px-4 py-3 text-slate-300">{{ c.jornada }}</td>
            <td class="px-4 py-3 text-slate-300">{{ c.anio }}</td>
            <td class="px-4 py-3 text-slate-300">
              {{ c.profesorJefe?.nombre || 'No asignado' }}
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="editar(c)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300"
                >
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button
                  @click="abrirAsignarProfesor(c)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300"
                >
                  <i data-lucide="user-round" class="w-4 h-4"></i>
                </button>
                <button
                  @click="eliminar(c)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-red-700/80 text-red-300"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!cursos.length && !cargando">
            <td colspan="6" class="px-4 py-6 text-center text-slate-500">
              No hay cursos registrados.
            </td>
          </tr>
          <tr v-if="cargando">
            <td colspan="6" class="px-4 py-6 text-center text-slate-400">
              Cargando cursos...
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear / Editar Curso -->
    <div
      v-if="mostrarModalCurso"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <h3 class="text-lg font-bold mb-3">
          {{ editando ? 'Editar Curso' : 'Crear Curso' }}
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre</label>
            <input
              v-model="formCurso.nombre"
              type="text"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Nivel</label>
              <input
                v-model="formCurso.nivel"
                type="text"
                placeholder="Ej: 1° Básico"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Jornada</label>
              <select
                v-model="formCurso.jornada"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="">Selecciona</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Año</label>
            <input
              v-model.number="formCurso.anio"
              type="number"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            @click="cerrarModalCurso"
            class="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            Cancelar
          </button>
          <button
            @click="guardarCurso"
            class="px-4 py-2 text-sm bg-green-600 hover:bg-green-500 rounded-xl font-semibold"
          >
            {{ editando ? 'Guardar cambios' : 'Crear curso' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Asignar Profesor -->
    <div
      v-if="mostrarModalProfesor"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <h3 class="text-lg font-bold mb-3">
          Asignar Profesor a {{ cursoSeleccionado?.nombre }}
        </h3>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Profesor</label>
          <select
            v-model="profesorSeleccionadoId"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
          >
            <option disabled value="">Selecciona un profesor</option>
            <option
              v-for="p in profesores"
              :key="p.id"
              :value="p.id"
            >
              {{ p.nombre }} - {{ p.email }}
            </option>
          </select>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            @click="cerrarModalProfesor"
            class="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            Cancelar
          </button>
          <button
            @click="asignarProfesor"
            class="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold"
          >
            Asignar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const cursos = ref([])
const profesores = ref([])
const cargando = ref(false)

const mostrarModalCurso = ref(false)
const mostrarModalProfesor = ref(false)
const editando = ref(false)
const cursoEditando = ref(null)
const cursoSeleccionado = ref(null)

const formCurso = ref({
  nombre: '',
  nivel: '',
  jornada: '',
  anio: new Date().getFullYear()
})

const profesorSeleccionadoId = ref('')

const cargarCursos = async () => {
  cargando.value = true
  const res = await adminService.obtenerCursos()
  if (!res.error) {
    cursos.value = res.data || []
  }
  cargando.value = false
}

const cargarProfesores = async () => {
  const res = await adminService.obtenerUsuarios()
  if (!res.error) {
    profesores.value = (res.data || []).filter(
      u => (u.rol?.nombre || u.rolNombre || '').toLowerCase() === 'profesor'
    )
  }
}

const abrirCrear = () => {
  editando.value = false
  cursoEditando.value = null
  formCurso.value = {
    nombre: '',
    nivel: '',
    jornada: '',
    anio: new Date().getFullYear()
  }
  mostrarModalCurso.value = true
}

const editar = (c) => {
  editando.value = true
  cursoEditando.value = c
  formCurso.value = {
    nombre: c.nombre,
    nivel: c.nivel,
    jornada: c.jornada || '',
    anio: c.anio || new Date().getFullYear()
  }
  mostrarModalCurso.value = true
}

const cerrarModalCurso = () => {
  mostrarModalCurso.value = false
}

const guardarCurso = async () => {
  if (!formCurso.value.nombre || !formCurso.value.nivel) {
    alert('Completa al menos nombre y nivel.')
    return
  }

  if (editando.value && cursoEditando.value) {
    const res = await adminService.editarCurso(cursoEditando.value.id, formCurso.value)
    if (!res.error) {
      await cargarCursos()
      cerrarModalCurso()
    }
  } else {
    const res = await adminService.crearCurso(formCurso.value)
    if (!res.error) {
      await cargarCursos()
      cerrarModalCurso()
    }
  }
}

const eliminar = async (c) => {
  if (!confirm(`¿Eliminar el curso "${c.nombre}"?`)) return
  const res = await adminService.eliminarCurso(c.id)
  if (!res.error) {
    await cargarCursos()
  }
}

const abrirAsignarProfesor = async (c) => {
  cursoSeleccionado.value = c
  profesorSeleccionadoId.value = ''
  await cargarProfesores()
  mostrarModalProfesor.value = true
}

const cerrarModalProfesor = () => {
  mostrarModalProfesor.value = false
}

const asignarProfesor = async () => {
  if (!cursoSeleccionado.value || !profesorSeleccionadoId.value) {
    alert('Debes seleccionar un profesor.')
    return
  }
  const res = await adminService.asignarProfesor(cursoSeleccionado.value.id, profesorSeleccionadoId.value)
  if (!res.error) {
    await cargarCursos()
    cerrarModalProfesor()
  }
}

onMounted(async () => {
  createIcons({ icons })
  await cargarCursos()
})
</script>
