<template>
  <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mt-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i data-lucide="shield" class="w-5 h-5 text-purple-400"></i>
          Roles y Permisos
        </h2>
        <p class="text-slate-400 text-sm">
          Controla qué puede ver y hacer cada usuario dentro del sistema.
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-[2fr,1fr] gap-6">
      <!-- Usuarios y sus roles -->
      <div>
        <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <i data-lucide="users" class="w-4 h-4 text-slate-400"></i>
          Usuarios del sistema
        </h3>

        <div class="overflow-x-auto rounded-xl border border-slate-800">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 text-left">Nombre</th>
                <th class="px-4 py-3 text-left">Email</th>
                <th class="px-4 py-3 text-left">Rol actual</th>
                <th class="px-4 py-3 text-center">Nuevo rol</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in usuarios"
                :key="u.id"
                class="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
              >
                <td class="px-4 py-3 text-slate-100 font-medium">{{ u.nombre }}</td>
                <td class="px-4 py-3 text-slate-300">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-200">
                    {{ u.rol?.nombre || u.rolNombre || 'Sin rol' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <select
                    v-model="rolesUsuario[u.id]"
                    @change="actualizarRol(u)"
                    class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100"
                  >
                    <option disabled value="">Seleccionar rol</option>
                    <option
                      v-for="r in roles"
                      :key="r.id"
                      :value="r.id"
                    >
                      {{ r.nombre }}
                    </option>
                  </select>
                </td>
              </tr>

              <tr v-if="!usuarios.length && !cargando">
                <td colspan="4" class="px-4 py-6 text-center text-slate-500">
                  No hay usuarios registrados.
                </td>
              </tr>
              <tr v-if="cargando">
                <td colspan="4" class="px-4 py-6 text-center text-slate-400">
                  Cargando usuarios y roles...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Lista de roles -->
      <div>
        <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <i data-lucide="lock" class="w-4 h-4 text-slate-400"></i>
          Roles disponibles
        </h3>

        <ul class="space-y-2">
          <li
            v-for="r in roles"
            :key="r.id"
            class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between"
          >
            <div>
              <p class="text-slate-100 text-sm font-semibold">{{ r.nombre }}</p>
              <p class="text-[11px] text-slate-500">
                ID: {{ r.id }}
              </p>
            </div>
          </li>
        </ul>

        <p class="text-[11px] text-slate-500 mt-4">
          * La definición fina de permisos puede manejarse más adelante con un sistema de scopes o claims.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createIcons, icons } from 'lucide'
import { adminService } from '@/services/adminService'

const usuarios = ref([])
const roles = ref([])
const rolesUsuario = ref({})
const cargando = ref(false)

const cargarDatos = async () => {
  cargando.value = true

  const [resUsuarios, resRoles] = await Promise.all([
    adminService.obtenerUsuarios(),
    adminService.obtenerRoles()
  ])

  if (!resUsuarios.error) {
    usuarios.value = resUsuarios.data || []
  }

  if (!resRoles.error) {
    roles.value = resRoles.data || []
  }

  // Inicializar select con el rol actual de cada usuario
  rolesUsuario.value = {}
  usuarios.value.forEach(u => {
    const rolId = u.rolId || u.rol?.id || null
    if (rolId) {
      rolesUsuario.value[u.id] = rolId
    }
  })

  cargando.value = false
}

const actualizarRol = async (usuario) => {
  const nuevoRolId = rolesUsuario.value[usuario.id]
  if (!nuevoRolId) return

  const res = await adminService.actualizarRolUsuario(usuario.id, nuevoRolId)
  if (!res.error) {
    await cargarDatos()
  }
}

onMounted(async () => {
  createIcons({ icons })
  await cargarDatos()
})
</script>
