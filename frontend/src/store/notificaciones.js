import { defineStore } from 'pinia'
import { NotifService } from '../services/notificacionesService'

export const useNotificacionesStore = defineStore('notifs', {
  state: () => ({
    enviadas: [],
    seleccionada: null,
    estados: [],
    resumen: { cursos: 0, alumnos: 0, notificaciones: 0 },
    cursos: []
  }),
  actions: {
    async cargarMias() {
      const { data } = await NotifService.mias()
      this.enviadas = data
    },
    async cargarEstados(notifId) {
      const { data } = await NotifService.estados(notifId)
      this.seleccionada = notifId
      this.estados = data
    },
    async enviar(payload) {
      await NotifService.enviar(payload)
      await this.cargarMias()
    },
    async cargarCursos() {
      const { data } = await NotifService.cursosProfesor()
      this.cursos = data
    },
    async cargarResumen() {
      const { data } = await NotifService.resumenProfesor()
      this.resumen = data
    }
  }
})
