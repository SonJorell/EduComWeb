<template>
  <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i data-lucide="users" class="w-5 h-5 text-blue-400"></i>
          Gestión de Usuarios
        </h2>
        <p class="text-slate-400 text-sm">
          Crea, edita y administra credenciales y roles del sistema.
        </p>
      </div>
      <button
        @click="abrirCrear"
        class="px-4 py-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
      >
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-3 mb-4">
      <select
        v-model="filtroRol"
        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
      >
        <option value="">Todos los roles</option>
        <option value="Administrador">Administrador</option>
        <option value="TI">TI</option>
        <option value="Profesor">Profesor</option>
        <option value="Apoderado">Apoderado</option>
      </select>

      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre o correo..."
        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 flex-1 min-w-[200px]"
      />
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto rounded-xl border border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-800 text-slate-300 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nombre</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Rol</th>
            <th class="px-4 py-3 text-center">Estado</th>
            <th class="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in usuariosFiltrados"
            :key="u.id"
            class="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-slate-100">
              {{ u.nombre }}
            </td>
            <td class="px-4 py-3 text-slate-300">
              {{ u.email }}
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-200">
                {{ u.rol?.nombre || u.rolNombre || 'Sin rol' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs border',
                  u.activo
                    ? 'bg-green-500/15 text-green-300 border-green-500/40'
                    : 'bg-red-500/15 text-red-300 border-red-500/40'
                ]"
              >
                {{ u.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="editar(u)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300"
                  title="Editar usuario"
                >
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button
                  @click="resetear(u)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300"
                  title="Resetear contraseña"
                >
                  <i data-lucide="key-round" class="w-4 h-4"></i>
                </button>
                <button
                  @click="eliminar(u)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-red-700/80 text-red-300"
                  title="Eliminar usuario"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!usuariosFiltrados.length && !cargando">
            <td colspan="5" class="px-4 py-6 text-center text-slate-500">
              No hay usuarios que coincidan con la búsqueda.
            </td>
          </tr>
          <tr v-if="cargando">
            <td colspan="5" class="px-4 py-6 text-center text-slate-400">
              Cargando usuarios...
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <h3 class="text-lg font-bold mb-3">
          {{ editando ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Rol</label>
            <select
              v-model="form.rolNombre"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              <option disabled value="">Selecciona un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="TI">TI</option>
              <option value="Profesor">Profesor</option>
              <option value="Apoderado">Apoderado</option>
            </select>
          </div>

          <div v-if="!editando">
            <label class="block text-xs text-slate-400 mb-1">Contraseña temporal</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
            <p class="text-[11px] text-slate-500 mt-1">
              Esta contraseña deberá ser cambiada por el usuario después del primer acceso.
            </p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            @click="cerrarModal"
            class="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            Cancelar
          </button>
          <button
            @click="guardar"
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold"
          >
            {{ editando ? 'Guardar cambios' : 'Crear usuario' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const usuarios = ref([])
const cargando = ref(false)

const filtroRol = ref('')
const busqueda = ref('')

const mostrarModal = ref(false)
const editando = ref(false)
const usuarioEditando = ref(null)

const form = ref({
  nombre: '',
  email: '',
  rolNombre: '',
  password: ''
})

const cargarUsuarios = async () => {
  cargando.value = true
  const res = await adminService.obtenerUsuarios()
  if (!res.error) {
    usuarios.value = res.data || []
  }
  cargando.value = false
}

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const coincideRol = filtroRol.value
      ? (u.rol?.nombre || u.rolNombre || '').toLowerCase() === filtroRol.value.toLowerCase()
      : true

    const texto = (u.nombre + ' ' + u.email).toLowerCase()
    const coincideTexto = texto.includes(busqueda.value.toLowerCase())

    return coincideRol && coincideTexto
  })
})

const abrirCrear = () => {
  editando.value = false
  usuarioEditando.value = null
  form.value = {
    nombre: '',
    email: '',
    rolNombre: '',
    password: ''
  }
  mostrarModal.value = true
}

const editar = (u) => {
  editando.value = true
  usuarioEditando.value = u
  form.value = {
    nombre: u.nombre,
    email: u.email,
    rolNombre: u.rol?.nombre || u.rolNombre || '',
    password: ''
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardar = async () => {
  if (!form.value.nombre || !form.value.email || !form.value.rolNombre) {
    alert('Completa nombre, email y rol.')
    return
  }

  if (editando.value && usuarioEditando.value) {
    const res = await adminService.editarUsuario(usuarioEditando.value.id, {
      nombre: form.value.nombre,
      email: form.value.email,
      rolNombre: form.value.rolNombre
    })
    if (!res.error) {
      await cargarUsuarios()
      cerrarModal()
    }
  } else {
    if (!form.value.password) {
      alert('Debes indicar una contraseña temporal.')
      return
    }
    const res = await adminService.crearUsuario({
      nombre: form.value.nombre,
      email: form.value.email,
      rolNombre: form.value.rolNombre,
      password: form.value.password
    })
    if (!res.error) {
      await cargarUsuarios()
      cerrarModal()
    }
  }
}

const resetear = async (u) => {
  if (!confirm(`¿Resetear contraseña de ${u.nombre}?`)) return
  const res = await adminService.resetearPassword(u.id)
  if (!res.error) {
    alert('Contraseña reseteada correctamente.')
  }
}

const eliminar = async (u) => {
  if (!confirm(`¿Eliminar usuario "${u.nombre}"?`)) return
  const res = await adminService.eliminarUsuario(u.id)
  if (!res.error) {
    await cargarUsuarios()
  }
}

onMounted(async () => {
  createIcons({ icons })
  await cargarUsuarios()
})
</script>
