import express from "express"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"
import {
  obtenerNotificaciones,
  marcarTodasLeidas,
  confirmarAsistencia,
  obtenerPerfil 
} from "../controllers/apoderado.controller.js"

const router = express.Router()

// 👤 Obtener perfil (nombre del apoderado y alumno)
router.get(
  "/perfil",
  requireAuth,
  requireRole("APODERADO"),
  obtenerPerfil
)

// 📥 Obtener todas las notificaciones
router.get(
  "/notificaciones",
  requireAuth,
  requireRole("APODERADO"),
  obtenerNotificaciones
)

// 📘 Marcar todas como leídas (Auto-lectura)
router.put(
  "/notificaciones/leidas",
  requireAuth,
  requireRole("APODERADO"),
  marcarTodasLeidas
)

// 🟩 Confirmar asistencia
router.put(
  "/notificaciones/:id/confirmar",
  requireAuth,
  requireRole("APODERADO"),
  confirmarAsistencia
)

export default router