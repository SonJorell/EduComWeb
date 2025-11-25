import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import {
  enviarNotificacion,
  misNotificaciones,
  detalleEstados,
  marcarLeido,
  marcarConfirmado
} from '../controllers/notificacion.controller.js'

const router = Router()

// Profesor: crear notificación (individual o por curso)
router.post(
  '/',
  requireAuth,
  requireRole('PROFESOR'),
  enviarNotificacion
)

// Profesor: ver sus notificaciones + métricas
router.get(
  '/mias',
  requireAuth,
  requireRole('PROFESOR'),
  misNotificaciones
)

// Profesor: ver estados por notificación
router.get(
  '/:id/estados',
  requireAuth,
  requireRole('PROFESOR'),
  detalleEstados
)

// Apoderado: marcar leído / confirmar
router.post(
  '/:id/leido',
  requireAuth,
  requireRole('APODERADO'),
  marcarLeido
)
router.post(
  '/:id/confirmado',
  requireAuth,
  requireRole('APODERADO'),
  marcarConfirmado
)

export default router
