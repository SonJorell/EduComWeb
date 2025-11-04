import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'
import {
  cursosProfesor,
  resumenProfesor,
  notificacionesProfesor,
  enviarNotificacion
} from '../controllers/profesor.controller.js'

const router = express.Router()

// ✅ Obtener cursos del profesor
router.get('/me/cursos', requireAuth, requireRole('Profesor'), cursosProfesor)

// ✅ Obtener resumen general del dashboard
router.get('/me/resumen', requireAuth, requireRole('Profesor'), resumenProfesor)

// ✅ Obtener notificaciones enviadas por el profesor
router.get('/me/notificaciones', requireAuth, requireRole('Profesor'), notificacionesProfesor)

// ✅ Enviar nueva notificación (comunicado)
router.post('/me/notificaciones', requireAuth, requireRole('Profesor'), enviarNotificacion)

export default router
