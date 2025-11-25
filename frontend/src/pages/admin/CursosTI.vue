<template>
  <div class="min-h-screen text-slate-200 p-6 font-sans">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
          <i data-lucide="book-open" class="text-emerald-400 w-8 h-8"></i>
          Gestión de Cursos
        </h1>
        <p class="text-slate-400 mt-1 text-sm">Administra niveles y asignaciones docentes.</p>
      </div>
      
      <button
        @click="abrirCrear"
        class="group relative px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
      >
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <i data-lucide="plus" class="w-5 h-5 relative z-10"></i>
        <span class="relative z-10">Nuevo Curso</span>
      </button>
    </div>

    <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th class="p-4 font-semibold">Nombre</th>
              <th class="p-4 font-semibold">Nivel</th>
              <th class="p-4 font-semibold">Jornada</th>
              <th class="p-4 font-semibold">Profesor Jefe</th> <th class="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="c in cursos" :key="c.id" class="hover:bg-slate-800/40 transition-colors group">
              <td class="p-4 font-bold text-white">{{ c.nombre }}</td>
              <td class="p-4 text-emerald-300">{{ c.nivel }}</td>
              <td class="p-4 text-slate-300">{{ c.jornada }}</td>
              
              <td class="p-4">
                <div v-if="obtenerJefe(c)" class="flex items-center gap-2 text-emerald-200 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                  <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                  <span class="text-xs font-medium">{{ obtenerJefe(c) }}</span>
                </div>
                <span v-else class="text-slate-500 text-xs italic flex items-center gap-1">
                  <i data-lucide="user-x" class="w-3 h-3"></i> Sin asignar
                </span>
              </td>

              <td class="p-4">
                <div class="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button @click="editar(c)" class="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors" title="Editar Datos del Curso">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                  </button>
                  
                  <button @click="abrirAsignarProfesor(c)" class="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="Gestionar Profesor Jefe">
                    <i data-lucide="user-cog" class="w-4 h-4"></i>
                  </button>

                  <button @click="eliminar(c)" class="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Borrar Curso (Solo si está vacío)">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="mostrarModalProfesor" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="cerrarModalProfesor">
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div class="p-6 border-b border-slate-800 bg-slate-950/50">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i data-lucide="user-cog" class="w-5 h-5 text-emerald-400"></i>
                  Gestión Docente
                </h3>
                <p class="text-xs text-slate-400 mt-1">Curso: <span class="text-emerald-300 font-semibold">{{ cursoSeleccionado?.nombre }}</span></p>
            </div>
            
            <div class="p-6 space-y-6">
                
                <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <p class="text-xs text-slate-400 uppercase font-bold mb-3 flex items-center justify-between">
                    Profesor Jefe Actual
                    <span v-if="obtenerJefe(cursoSeleccionado)" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </p>
                  
                  <div v-if="obtenerJefe(cursoSeleccionado)" class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <i data-lucide="user" class="w-4 h-4"></i>
                      </div>
                      <span class="text-sm text-white font-medium">{{ obtenerJefe(cursoSeleccionado) }}</span>
                    </div>
                    
                    <button 
                      @click="quitarProfesor"
                      class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition-colors flex items-center gap-1"
                    >
                      <i data-lucide="user-minus" class="w-3 h-3"></i> Quitar
                    </button>
                  </div>

                  <div v-else class="text-sm text-slate-500 italic flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4"></i> No hay profesor asignado.
                  </div>
                </div>

                <div class="relative pt-2">
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">
                      {{ obtenerJefe(cursoSeleccionado) ? 'Cambiar por:' : 'Seleccionar Profesor:' }}
                    </label>
                    <div class="relative group">
                      <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors w-4 h-4"></i>
                      <select v-model="profesorSeleccionadoId" class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-600">
                          <option disabled value="">-- Selecciona de la lista --</option>
                          <option v-for="p in profesores" :key="p.id" :value="p.id">
                              {{ p.nombre }} ({{ p.email }})
                          </option>
                      </select>
                      <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                <button @click="cerrarModalProfesor" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
                
                <button 
                  @click="asignarProfesor" 
                  :disabled="!profesorSeleccionadoId"
                  class="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Guardar Asignación
                </button>
            </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="mostrarModalCurso" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="cerrarModalCurso">
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div class="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i :data-lucide="editando ? 'pencil' : 'plus-circle'" class="w-5 h-5 text-emerald-400"></i>
              {{ editando ? 'Editar Curso' : 'Nuevo Curso' }}
            </h3>
            <button @click="cerrarModalCurso" class="text-slate-400 hover:text-white transition"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nombre</label>
              <input v-model="formCurso.nombre" type="text" placeholder="Ej: 1° Medio A" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nivel</label>
                    <input v-model="formCurso.nivel" type="text" placeholder="Ej: Media" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Jornada</label>
                    <select v-model="formCurso.jornada" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none cursor-pointer">
                        <option value="">Selecciona</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Completa">Completa</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Año</label>
                <input v-model.number="formCurso.anio" type="number" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none">
            </div>
          </div>
          <div class="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
            <button @click="cerrarModalCurso" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
            <button @click="guardarCurso" class="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg transition-all active:scale-95">
              {{ editando ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="toastType === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
          <i :data-lucide="toastType === 'success' ? 'check' : 'alert-triangle'" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ toastType === 'success' ? 'Éxito' : 'Error' }}</h4>
          <p class="text-xs text-slate-400">{{ toastMessage }}</p>
        </div>
      </div>
    </Transition>

    <div v-if="cargando" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

// State
const cursos = ref([])
const profesores = ref([])
const cargando = ref(false)

// Modales
const mostrarModalCurso = ref(false)
const mostrarModalProfesor = ref(false)
const editando = ref(false)
const cursoEditando = ref(null)
const cursoSeleccionado = ref(null)
const profesorSeleccionadoId = ref('')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const formCurso = ref({ nombre: '', nivel: '', jornada: '', anio: new Date().getFullYear() })

// --- UTILS ---
const lanzarToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const obtenerJefe = (curso) => {
  if (!curso || !curso.profesorCursos || !Array.isArray(curso.profesorCursos)) return null
  const relacionJefe = curso.profesorCursos.find(pc => pc.rolInterno === 'JEFE' || pc.rolInterno === 'PROFESOR JEFE')
  return relacionJefe?.profesor?.nombre || null
}

// --- CRUD ---
const cargarCursos = async () => {
  cargando.value = true
  try {
    const res = await adminService.obtenerCursos()
    if (!res.error) cursos.value = res.data || []
    else lanzarToast('Error al cargar cursos', 'error')
  } catch(e) { lanzarToast('Error de conexión', 'error') }
  finally { 
      cargando.value = false 
      nextTick(() => createIcons({ icons }))
  }
}

const cargarProfesores = async () => {
  const res = await adminService.obtenerUsuarios()
  if (!res.error) {
    profesores.value = (res.data || []).filter(
      u => (u.rol?.nombre || u.rolNombre || '').toLowerCase() === 'profesor'
    )
  }
}

// --- GESTIÓN DE PROFESOR JEFE ---
const abrirAsignarProfesor = async (c) => {
  cursoSeleccionado.value = c
  profesorSeleccionadoId.value = ''
  await cargarProfesores()
  mostrarModalProfesor.value = true
  nextTick(() => createIcons({ icons }))
}

const cerrarModalProfesor = () => { mostrarModalProfesor.value = false }

// ✅ ASIGNAR
const asignarProfesor = async () => {
  if (!cursoSeleccionado.value || !profesorSeleccionadoId.value) {
    lanzarToast('Selecciona un profesor', 'error')
    return
  }
  try {
      const res = await adminService.asignarProfesor(cursoSeleccionado.value.id, profesorSeleccionadoId.value, 'JEFE')
      if (!res.error) {
        lanzarToast('Profesor asignado correctamente')
        await cargarCursos()
        cerrarModalProfesor()
      } else lanzarToast(res.error, 'error')
  } catch(e) { lanzarToast('Error al asignar', 'error') }
}

// 🔥 QUITAR (DESASIGNAR)
const quitarProfesor = async () => {
  if (!confirm(`¿Seguro que quieres quitar al profesor jefe de ${cursoSeleccionado.value.nombre}?`)) return
  
  try {
      const res = await adminService.desasignarProfesor(cursoSeleccionado.value.id)
      
      if (!res.error) {
        lanzarToast('Profesor desvinculado del curso')
        await cargarCursos()
        cerrarModalProfesor() // Cerramos el modal porque ya cambió el estado
      } else {
        lanzarToast(res.error, 'error')
      }
  } catch(e) {
    console.error(e)
    lanzarToast('Error al quitar profesor', 'error')
  }
}

// --- GESTIÓN DE CURSO (CREAR / EDITAR / BORRAR CURSO) ---
const abrirCrear = () => {
  editando.value = false
  cursoEditando.value = null
  formCurso.value = { nombre: '', nivel: '', jornada: '', anio: new Date().getFullYear() }
  mostrarModalCurso.value = true
  nextTick(() => createIcons({ icons }))
}

const editar = (c) => {
  editando.value = true
  cursoEditando.value = c
  formCurso.value = { nombre: c.nombre, nivel: c.nivel, jornada: c.jornada || '', anio: c.anio || new Date().getFullYear() }
  mostrarModalCurso.value = true
  nextTick(() => createIcons({ icons }))
}

const cerrarModalCurso = () => { mostrarModalCurso.value = false }

const guardarCurso = async () => {
  if (!formCurso.value.nombre || !formCurso.value.nivel) {
    lanzarToast('Nombre y Nivel son obligatorios', 'error')
    return
  }
  try {
      if (editando.value && cursoEditando.value) {
        const res = await adminService.editarCurso(cursoEditando.value.id, formCurso.value)
        if (!res.error) { lanzarToast('Curso actualizado'); await cargarCursos(); cerrarModalCurso() }
        else lanzarToast(res.error, 'error')
      } else {
        const res = await adminService.crearCurso(formCurso.value)
        if (!res.error) { lanzarToast('Curso creado'); await cargarCursos(); cerrarModalCurso() }
        else lanzarToast(res.error, 'error')
      }
  } catch(e) { lanzarToast('Error en el servidor', 'error') }
}

const eliminar = async (c) => {
  if (!confirm(`¿Eliminar EL CURSO COMPLETO "${c.nombre}"? (Esto no se puede deshacer)`)) return
  try {
      const res = await adminService.eliminarCurso(c.id)
      if (!res.error) { lanzarToast('Curso eliminado'); await cargarCursos() }
      else lanzarToast(res.error, 'error') // Mostrará el error si tiene alumnos o profesor
  } catch(e) { lanzarToast('Error de conexión', 'error') }
}

onMounted(async () => {
  createIcons({ icons })
  await cargarCursos()
})
</script>

<style scoped>
/* Animaciones y Transiciones */
.modal-enter-active, .modal-leave-active, .toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
::-webkit-scrollbar-thumb { background: #10b981; border-radius: 4px; }
</style>