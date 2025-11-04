// ==========================================
// Rutas del módulo Profesor - EduCom
// ==========================================
import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'
import {
  cursosProfesor,
  resumenProfesor,
  notificacionesProfesor,
  apoderadosProfesor,
  enviarNotificacion,
  detalleNotificacion,
  comunicadosRecientes
} from '../controllers/profesor.controller.js'

const router = express.Router()

// ==========================================
// 🔹 RUTAS DEL DASHBOARD DEL PROFESOR
// ==========================================

// ✅ Obtener los cursos del profesor
router.get('/me/cursos', requireAuth, requireRole('Profesor'), cursosProfesor)

// ✅ Obtener resumen general del profesor
router.get('/me/resumen', requireAuth, requireRole('Profesor'), resumenProfesor)

// ✅ Obtener notificaciones enviadas
router.get('/me/notificaciones', requireAuth, requireRole('Profesor'), notificacionesProfesor)

// ✅ Obtener comunicados recientes (para vista principal)
router.get('/me/comunicados', requireAuth, requireRole('Profesor'), comunicadosRecientes)

// ✅ Obtener apoderados asociados a los cursos del profesor
router.get('/me/apoderados', requireAuth, requireRole('Profesor'), apoderadosProfesor)

// ✅ Enviar nueva notificación / comunicado
router.post('/notificaciones', requireAuth, requireRole('Profesor'), enviarNotificacion)

// ✅ Obtener detalle completo de una notificación específica
router.get('/notificaciones/:id', requireAuth, requireRole('Profesor'), detalleNotificacion)

export default router
