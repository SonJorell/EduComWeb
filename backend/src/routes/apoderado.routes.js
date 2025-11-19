import express from "express"
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"
import {
  obtenerNotificaciones,
  marcarTodasLeidas,
  confirmarAsistencia
} from "../controllers/apoderado.controller.js"

const router = express.Router()

router.get("/notificaciones", requireAuth, requireRole("Apoderado"), obtenerNotificaciones)
router.put("/notificaciones/leidas", requireAuth, requireRole("Apoderado"), marcarTodasLeidas)
router.put("/notificaciones/:id/confirmar", requireAuth, requireRole("Apoderado"), confirmarAsistencia)

export default router
