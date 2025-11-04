import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

import {
  obtenerNotificaciones,
  marcarTodasLeidas,
  confirmarAsistencia
} from '../controllers/apoderado.controller.js'

const router = express.Router()

router.use(requireAuth, requireRole('Apoderado'))

router.get('/notificaciones', obtenerNotificaciones)
router.put('/notificaciones/leidas', marcarTodasLeidas)
router.put('/notificaciones/:id/confirmar', confirmarAsistencia)

export default router
