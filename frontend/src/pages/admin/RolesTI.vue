<template>
  <div class="min-h-screen text-slate-200 p-6 font-sans">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-down">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
          <i data-lucide="shield-check" class="text-purple-400 w-8 h-8"></i>
          Roles y Permisos
        </h1>
        <p class="text-slate-400 mt-1 text-sm">Gestiona el acceso y privilegios de los usuarios activos.</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        <div class="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
                <i data-lucide="users" class="w-5 h-5 text-purple-400"></i> 
                <h3 class="font-bold text-white">Usuarios</h3>
                <span class="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">{{ usuariosFiltrados.length }}</span>
            </div>

            <div class="flex gap-2 w-full sm:w-auto">
                <div class="relative w-full sm:w-48 group">
                    <i data-lucide="search" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors"></i>
                    <input 
                        v-model="busqueda" 
                        type="text" 
                        placeholder="Buscar..." 
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none transition-all"
                    >
                </div>

                <div class="relative w-36">
                    <select 
                        v-model="filtroRol" 
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-300 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Todos</option>
                        <option v-for="r in roles" :key="r.id" :value="r.nombre">{{ r.nombre }}</option>
                    </select>
                    <i data-lucide="filter" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3 pointer-events-none"></i>
                </div>
            </div>
        </div>

        <div class="overflow-y-auto custom-scrollbar flex-1 relative">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10 bg-slate-900 shadow-sm">
              <tr class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th class="p-4 font-semibold bg-slate-900">Usuario</th>
                <th class="p-4 font-semibold bg-slate-900">Rol Actual</th>
                <th class="p-4 font-semibold bg-slate-900">Asignar Nuevo Rol</th>
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
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
                      {{ getInitials(u.nombre) }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-white text-sm truncate max-w-[150px]" :title="u.nombre">{{ u.nombre }}</p>
                      <p class="text-xs text-slate-500 truncate max-w-[150px]" :title="u.email">{{ u.email }}</p>
                    </div>
                  </div>
                </td>

                <td class="p-4">
                  <span 
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap"
                    :class="getRoleBadgeColor(u.rol?.nombre || u.rolNombre)"
                  >
                    {{ u.rol?.nombre || u.rolNombre || 'Sin Asignar' }}
                  </span>
                </td>

                <td class="p-4">
                  <div class="relative w-40">
                    <select
                        v-model="rolesUsuario[u.id]"
                        @change="actualizarRol(u)"
                        class="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 pl-3 pr-8 text-xs text-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-600"
                    >
                        <option disabled value="">Seleccionar...</option>
                        <option v-for="r in roles" :key="r.id" :value="r.id">
                        {{ r.nombre }}
                        </option>
                    </select>
                    <i data-lucide="chevron-down" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none"></i>
                  </div>
                </td>
              </tr>

              <tr v-if="usuariosFiltrados.length === 0 && !cargando">
                <td colspan="3" class="p-12 text-center text-slate-500">
                  <div class="flex flex-col items-center gap-2">
                      <i data-lucide="search-x" class="w-8 h-8 opacity-50"></i>
                      <p class="text-sm">No se encontraron usuarios.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        
        <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sticky top-6">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i data-lucide="database" class="w-5 h-5 text-cyan-400"></i> Roles Disponibles
            </h3>
            
            <div class="space-y-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                <div 
                    v-for="r in roles" 
                    :key="r.id" 
                    class="bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group hover:border-cyan-500/30 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-slate-900 rounded-lg text-cyan-400 border border-slate-800 group-hover:border-cyan-500/30">
                            <i data-lucide="key" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">{{ r.nombre }}</p>
                            <p class="text-[10px] text-slate-500">ID: {{ r.id }}</p>
                        </div>
                    </div>
                    <span class="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-800 uppercase font-bold">
                        Activo
                    </span>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl flex gap-3">
                <i data-lucide="info" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                <p class="text-xs text-blue-200/80 leading-relaxed">
                    Solo se muestran usuarios <strong>ACTIVOS</strong>. Los usuarios INACTIVOS no aparecen en esta lista por seguridad.
                </p>
            </div>
        </div>

      </div>

    </div>

    <div v-if="cargando" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
    </div>

    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="toastType === 'success' ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/20 text-red-400'">
          <i :data-lucide="toastType === 'success' ? 'check' : 'alert-triangle'" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ toastType === 'success' ? 'Éxito' : 'Error' }}</h4>
          <p class="text-xs text-slate-400">{{ toastMessage }}</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

// State
const usuarios = ref([])
const roles = ref([])
const rolesUsuario = ref({})
const cargando = ref(false)
const busqueda = ref('')
const filtroRol = ref('')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// --- COMPUTED: FILTROS Y BÚSQUEDA ---
const usuariosFiltrados = computed(() => {
    return usuarios.value.filter(u => {
        // Filtro de texto (Nombre o Email)
        const texto = (u.nombre + ' ' + u.email).toLowerCase()
        const coincideTexto = texto.includes(busqueda.value.toLowerCase())
        
        // Filtro por Rol
        let coincideRol = true
        if (filtroRol.value) {
            const rolUsuario = (u.rol?.nombre || u.rolNombre || '').toLowerCase()
            coincideRol = rolUsuario === filtroRol.value.toLowerCase()
        }

        return coincideTexto && coincideRol
    })
})

// --- UTILS ---
const lanzarToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleBadgeColor = (rol) => {
  switch(rol) {
    case 'Administrador': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'TI': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    case 'Profesor': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'Apoderado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}

// --- LOGIC ---
const cargarDatos = async () => {
  cargando.value = true
  try {
    const [resUsuarios, resRoles] = await Promise.all([
        adminService.obtenerUsuarios(),
        adminService.obtenerRoles()
    ])

    // 🔥 FILTRO BASE: Solo mostramos usuarios que NO sean INACTIVOS
    if (!resUsuarios.error) {
        usuarios.value = (resUsuarios.data || []).filter(u => u.estado !== 'INACTIVO')
    } else {
        lanzarToast('Error cargando usuarios', 'error')
    }

    if (!resRoles.error) roles.value = resRoles.data || []
    else lanzarToast('Error cargando roles', 'error')

    // Inicializar selects con valor actual
    rolesUsuario.value = {}
    usuarios.value.forEach(u => {
        const rolId = u.rolId || u.rol?.id || null
        if (rolId) {
            rolesUsuario.value[u.id] = rolId
        }
    })

  } catch(e) {
      console.error(e)
      lanzarToast('Error de conexión', 'error')
  } finally {
      cargando.value = false
      nextTick(() => createIcons({ icons }))
  }
}

// Envía el NOMBRE del rol
const actualizarRol = async (usuario) => {
  const nuevoRolId = rolesUsuario.value[usuario.id]
  if (!nuevoRolId) return

  const rolEncontrado = roles.value.find(r => r.id === nuevoRolId)
  if (!rolEncontrado) return

  try {
      const res = await adminService.actualizarRolUsuario(usuario.id, rolEncontrado.nombre)
      
      if (!res.error) {
          lanzarToast(`Rol actualizado a ${rolEncontrado.nombre}`)
          // Recargar para asegurar consistencia (opcional, pero recomendado)
          await cargarDatos()
      } else {
          lanzarToast('Error al actualizar rol', 'error')
      }
  } catch(e) {
      lanzarToast('Error en el servidor', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  createIcons({ icons })
  await cargarDatos()
})
</script>

<style scoped>
/* Transiciones */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Scrollbar Fino y Elegante */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6366f1; /* Indigo-500 */
  border-radius: 10px;
  border: 2px solid rgba(15, 23, 42, 0.3); /* Genera efecto padding */
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>