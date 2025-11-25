<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Mis Notificaciones</h2>

    <table class="min-w-full bg-white shadow rounded overflow-hidden">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-3">Título</th>
          <th class="p-3">Fecha</th>
          <th class="p-3">Destinatarios</th>
          <th class="p-3">Leídos</th>
          <th class="p-3">Confirmados</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in notifs.enviadas" :key="n.id" class="border-t">
          <td class="p-3">{{ n.titulo }}</td>
          <td class="p-3">{{ new Date(n.createdAt).toLocaleString() }}</td>
          <td class="p-3">{{ n.totalDestinatarios }}</td>
          <td class="p-3">
            {{ n.leidos }} ({{ n.pctLeidos }}%)
          </td>
          <td class="p-3">
            {{ n.confirmados }} ({{ n.pctConfirmados }}%)
          </td>
          <td class="p-3">
            <button class="text-indigo-600 hover:underline" @click="verEstados(n.id)">Ver estados</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="notifs.seleccionada" class="mt-6">
      <h3 class="font-semibold mb-2">Detalle destinatarios</h3>
      <ul class="space-y-1">
        <li v-for="r in notifs.estados" :key="r.destinatarioId" class="text-sm">
          <span class="font-medium">{{ r.destinatario }}</span> — 
          leído: <b>{{ r.leidoAt ? new Date(r.leidoAt).toLocaleString() : 'No' }}</b>, 
          confirmado: <b>{{ r.confirmadoAt ? new Date(r.confirmadoAt).toLocaleString() : 'No' }}</b>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificacionesStore } from '../../store/notificaciones'

const notifs = useNotificacionesStore()
onMounted(() => notifs.cargarMias())

const verEstados = async (id) => {
  await notifs.cargarEstados(id)
}
</script>
