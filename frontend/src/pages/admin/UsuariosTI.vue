<template>
  <div class="min-h-screen text-slate-200 p-6 font-sans">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
          <i data-lucide="users-round" class="text-blue-400 w-8 h-8"></i>
          Gestión de Usuarios
        </h1>
        <p class="text-slate-400 mt-1 text-sm">Administra los accesos y roles de la plataforma.</p>
      </div>
      
      <button
        @click="abrirCrear"
        class="group relative px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
      >
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <i data-lucide="user-plus" class="w-5 h-5 relative z-10"></i>
        <span class="relative z-10">Nuevo Usuario</span>
      </button>
    </div>

    <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
      
      <div class="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1">
        <div class="relative w-full md:w-80 group">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors w-5 h-5"></i>
            <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre, email..."
            class="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
        </div>

        <div class="relative w-full md:w-48">
            <i data-lucide="filter" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
            <select
            v-model="filtroRol"
            class="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
            <option value="">Todos los roles</option>
            <option value="Administrador">Administrador</option>
            <option value="TI">Soporte TI</option>
            <option value="Profesor">Profesor</option>
            <option value="Apoderado">Apoderado</option>
            <option value="Director">Director</option>
            </select>
            <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"></i>
        </div>
      </div>

      <div class="flex items-center gap-3 bg-slate-950/30 px-4 py-2 rounded-xl border border-slate-700/50">
        <span class="text-sm text-slate-400 font-medium">Mostrar Inactivos</span>
        <button 
            @click="mostrarInactivos = !mostrarInactivos"
            class="relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none"
            :class="mostrarInactivos ? 'bg-blue-600' : 'bg-slate-700'"
        >
            <span 
                class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm"
                :class="mostrarInactivos ? 'translate-x-5' : 'translate-x-0'"
            ></span>
        </button>
      </div>

    </div>

    <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th class="p-4 font-semibold">Usuario</th>
              <th class="p-4 font-semibold">Rol</th>
              <th class="p-4 font-semibold text-center">Estado</th>
              <th class="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr 
              v-for="u in usuariosFiltrados" 
              :key="u.id" 
              class="hover:bg-slate-800/40 transition-colors group"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {{ getInitials(u.nombre) }}
                  </div>
                  <div>
                    <p class="font-medium text-white">{{ u.nombre }}</p>
                    <p class="text-xs text-slate-400">{{ u.email }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <span 
                  class="px-2.5 py-1 rounded-lg text-xs font-medium border"
                  :class="getRoleBadgeColor(u.rol?.nombre || u.rolNombre)"
                >
                  {{ u.rol?.nombre || u.rolNombre || 'Sin Asignar' }}
                </span>
              </td>

              <td class="p-4 text-center">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide"
                  :class="getEstadoColor(u.estado)"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ u.estado }}
                </span>
              </td>

              <td class="p-4">
                <div class="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="editar(u)" 
                    class="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                    title="Editar"
                  >
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                  </button>
                  
                  <button 
                    @click="resetear(u)" 
                    class="p-2 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors"
                    title="Generar nueva contraseña"
                  >
                    <i data-lucide="key-round" class="w-4 h-4"></i>
                  </button>

                  <button 
                    @click="eliminar(u)" 
                    class="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Deshabilitar / Eliminar"
                  >
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </td>
            </tr>
            
            <tr v-if="usuariosFiltrados.length === 0 && !cargando">
              <td colspan="4" class="p-12 text-center text-slate-500">
                <div class="flex flex-col items-center gap-3">
                  <i data-lucide="search-x" class="w-12 h-12 opacity-50"></i>
                  <p>No se encontraron usuarios.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="cargando" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <Transition name="modal">
      <div v-if="mostrarModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="cerrarModal">
        <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i :data-lucide="editando ? 'user-cog' : 'user-plus'" class="w-5 h-5 text-blue-400"></i>
              {{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h3>
            <button @click="cerrarModal" class="text-slate-400 hover:text-white transition"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>

          <div class="p-6 space-y-5 overflow-y-auto">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nombre Completo</label>
              <div class="relative">
                <i data-lucide="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
                <input 
                  v-model="form.nombre" 
                  type="text" 
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all"
                >
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Correo Institucional</label>
              <div class="relative flex items-center">
                <i data-lucide="mail" class="absolute left-3 z-10 text-slate-500 w-4 h-4"></i>
                <input 
                  v-model="form.usuarioEmail" 
                  type="text" 
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-32 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all"
                >
                <span class="absolute right-4 text-slate-500 text-sm select-none pointer-events-none">@colegioarica.cl</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Rol del Sistema</label>
              <div class="relative">
                <i data-lucide="shield" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
                <select 
                  v-model="form.rolNombre"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="TI">TI / Soporte</option>
                  <option value="Director">Director</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Apoderado">Apoderado</option>
                </select>
                <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  {{ editando ? 'Cambiar Contraseña (Opcional)' : 'Contraseña Inicial' }}
              </label>
              <div class="relative">
                <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
                <input 
                  v-model="form.password" 
                  type="text" 
                  :placeholder="editando ? 'Dejar vacía para no cambiar' : 'Escribe una contraseña'"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                >
              </div>
            </div>

            <div v-if="editando">
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Estado Actual</label>
              <div class="relative">
                <i data-lucide="activity" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4"></i>
                <select 
                  v-model="form.estado"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                    <option value="ACTIVO">🟢 Activo</option>
                    <option value="VACACIONES">🔵 Vacaciones</option>
                    <option value="LICENCIA">🟡 Licencia Médica</option>
                    <option value="INACTIVO">🔴 Inactivo (Bloqueado)</option>
                </select>
                <i data-lucide="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"></i>
              </div>
            </div>

          </div>

          <div class="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
            <button @click="cerrarModal" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
            <button @click="guardar" class="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg transition-all active:scale-95">
              {{ editando ? 'Guardar Cambios' : 'Crear Usuario' }}
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

    <Transition name="modal">
      <div v-if="mostrarPassModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="mostrarPassModal = false">
        <div class="bg-slate-900 border border-slate-600 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-scale-in">
          <h3 class="text-lg font-bold text-white mb-2">Contraseña Generada</h3>
          <div class="bg-slate-950 border border-slate-700 rounded-lg p-3 mb-6 font-mono text-lg text-emerald-400 tracking-wider select-all cursor-text">
            {{ nuevaPasswordGenerada }}
          </div>
          <button @click="mostrarPassModal = false" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-slate-600">Cerrar</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const usuarios = ref([])
const cargando = ref(false)
const busqueda = ref('')
const filtroRol = ref('')
const mostrarInactivos = ref(false) // Nuevo estado para el toggle

// Modales y Toasts
const mostrarModal = ref(false)
const editando = ref(false)
const usuarioEditando = ref(null)
const mostrarPassModal = ref(false)
const nuevaPasswordGenerada = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const form = ref({
  nombre: '',
  usuarioEmail: '', 
  rolNombre: '',
  password: '',
  estado: 'ACTIVO'
})

// Helpers
const lanzarToast = (msg, type = 'success') => {
  toastMessage.value = msg; toastType.value = type; showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}
const generarPassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#"
  let pass = ""; for(let i=0; i<10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
  return pass
}
const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
const getRoleBadgeColor = (rol) => {
  switch(rol) {
    case 'Administrador': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'TI': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    case 'Profesor': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'Apoderado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}
const getEstadoColor = (estado) => {
  switch(estado) {
    case 'ACTIVO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'VACACIONES': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'LICENCIA': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'INACTIVO': return 'bg-red-500/10 text-red-400 border-red-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}

// 🔥 COMPUTED: Filtrado inteligente
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    // 1. Filtro Inactivos
    if (!mostrarInactivos.value && u.estado === 'INACTIVO') return false
    
    // 2. Filtro Rol
    const coincideRol = filtroRol.value ? (u.rol?.nombre || u.rolNombre || '').toLowerCase() === filtroRol.value.toLowerCase() : true
    
    // 3. Filtro Texto
    const texto = (u.nombre + ' ' + u.email).toLowerCase()
    const coincideTexto = texto.includes(busqueda.value.toLowerCase())
    
    return coincideRol && coincideTexto
  })
})

// CRUD
const cargarUsuarios = async () => {
  cargando.value = true
  try {
    const res = await adminService.obtenerUsuarios()
    if (!res.error) usuarios.value = res.data || []
    else lanzarToast('Error al cargar usuarios', 'error')
  } catch (e) { lanzarToast('Error de conexión', 'error') }
  finally { cargando.value = false; nextTick(() => createIcons({ icons })) }
}

const abrirCrear = () => {
  editando.value = false; usuarioEditando.value = null
  form.value = { nombre: '', usuarioEmail: '', rolNombre: '', password: '', estado: 'ACTIVO' }
  mostrarModal.value = true
  nextTick(() => createIcons({ icons }))
}

const editar = (u) => {
  editando.value = true; usuarioEditando.value = u
  const emailParts = u.email ? u.email.split('@') : ['']
  form.value = { nombre: u.nombre, usuarioEmail: emailParts[0], rolNombre: u.rol?.nombre || u.rolNombre || '', password: '', estado: u.estado }
  mostrarModal.value = true
  nextTick(() => createIcons({ icons }))
}

const cerrarModal = () => { mostrarModal.value = false }

const guardar = async () => {
  if (!form.value.nombre || !form.value.usuarioEmail || !form.value.rolNombre) {
    lanzarToast('Completa los campos', 'error'); return
  }
  const finalEmail = `${form.value.usuarioEmail}@colegioarica.cl`
  try {
    if (editando.value) {
      const res = await adminService.editarUsuario(usuarioEditando.value.id, {
        nombre: form.value.nombre, email: finalEmail, rolNombre: form.value.rolNombre, estado: form.value.estado, password: form.value.password
      })
      if (!res.error) { lanzarToast('Usuario actualizado'); await cargarUsuarios(); cerrarModal() }
      else lanzarToast(res.error, 'error')
    } else {
      if (!form.value.password) { lanzarToast('Contraseña requerida', 'error'); return }
      const res = await adminService.crearUsuario({
        nombre: form.value.nombre, email: finalEmail, rolNombre: form.value.rolNombre, password: form.value.password
      })
      if (!res.error) { lanzarToast('Usuario creado'); await cargarUsuarios(); cerrarModal() }
      else lanzarToast(res.error, 'error')
    }
  } catch (e) { lanzarToast('Error', 'error') }
}

const resetear = async (u) => {
  if (!confirm(`¿Generar nueva contraseña para ${u.nombre}?`)) return
  const nuevaPass = generarPassword()
  const res = await adminService.resetearPassword(u.id, nuevaPass)
  if (!res.error) { nuevaPasswordGenerada.value = nuevaPass; mostrarPassModal.value = true; lanzarToast('Contraseña actualizada') }
  else lanzarToast('Error', 'error')
}

const eliminar = async (u) => {
  if (!confirm(`¿Deshabilitar a ${u.nombre}?`)) return
  const res = await adminService.eliminarUsuario(u.id)
  if (!res.error) { lanzarToast('Usuario deshabilitado'); await cargarUsuarios() }
  else lanzarToast('Error', 'error')
}

onMounted(() => { createIcons({ icons }); cargarUsuarios() })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active, .toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); }
::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
</style>