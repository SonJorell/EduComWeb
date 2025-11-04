// src/store/profesorStore.js
import { defineStore } from 'pinia'
import { profesorService } from '@/services/profesorService'

export const useProfesorStore = defineStore('profesor', {
  state: () => ({
    resumen: null,
    cursos: [],
    notificaciones: [],
    cargando: false,
    error: null,
  }),
  actions: {
    async cargarDatos() {
      this.cargando = true
      try {
        const [resResumen, resCursos, resNotifs] = await Promise.all([
          profesorService.obtenerResumen(),
          profesorService.obtenerCursos(),
          profesorService.obtenerNotificaciones(),
        ])
        this.resumen = resResumen.data
        this.cursos = resCursos.data
        this.notificaciones = resNotifs.data
      } catch (e) {
        this.error = e?.response?.data?.error || 'Error al cargar datos.'
      } finally {
        this.cargando = false
      }
    },
  },
})
