import express from "express"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"
import {
  obtenerNotificaciones,
  marcarTodasLeidas,
  confirmarAsistencia
} from "../controllers/apoderado.controller.js"

const router = express.Router()

// 📥 Obtener todas las notificaciones del apoderado
router.get(
  "/notificaciones",
  requireAuth,
  requireRole("APODERADO"),
  obtenerNotificaciones
)

// 📘 Marcar todas como leídas
router.put(
  "/notificaciones/leidas",
  requireAuth,
  requireRole("APODERADO"),
  marcarTodasLeidas
)

// 🟩 Confirmar asistencia a una notificación
router.put(
  "/notificaciones/:id/confirmar",
  requireAuth,
  requireRole("APODERADO"),
  confirmarAsistencia
)

export default router
