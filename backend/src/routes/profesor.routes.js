// ==========================================
// 📘 Rutas del módulo Profesor - EduCom
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

// ==========================================
// 🚀 Inicialización del router
// ==========================================
const router = express.Router()

// ==========================================
// 🧭 Grupo de rutas protegidas para PROFESOR
// ==========================================

// ✅ Obtener los cursos asignados al profesor
// Ejemplo: GET /profesores/me/cursos
router.get(
  '/me/cursos',
  requireAuth,
  requireRole('Profesor'),
  cursosProfesor
)

// ✅ Obtener el resumen general del dashboard
// Ejemplo: GET /profesores/me/resumen
router.get(
  '/me/resumen',
  requireAuth,
  requireRole('Profesor'),
  resumenProfesor
)

// ✅ Listar todas las notificaciones enviadas por el profesor
// Ejemplo: GET /profesores/me/notificaciones
router.get(
  '/me/notificaciones',
  requireAuth,
  requireRole('Profesor'),
  notificacionesProfesor
)

// ✅ Obtener comunicados recientes (para el dashboard principal)
// Ejemplo: GET /profesores/me/comunicados
router.get(
  '/me/comunicados',
  requireAuth,
  requireRole('Profesor'),
  comunicadosRecientes
)

// ✅ Obtener los apoderados asociados a los cursos del profesor
// Ejemplo: GET /profesores/me/apoderados
router.get(
  '/me/apoderados',
  requireAuth,
  requireRole('Profesor'),
  apoderadosProfesor
)

// ✅ Enviar una nueva notificación o comunicado
// Ejemplo: POST /profesores/notificaciones
router.post(
  '/notificaciones',
  requireAuth,
  requireRole('Profesor'),
  enviarNotificacion
)

// ✅ Obtener el detalle completo de una notificación específica
// Ejemplo: GET /profesores/notificaciones/:id
router.get(
  '/notificaciones/:id',
  requireAuth,
  requireRole('Profesor'),
  detalleNotificacion
)

// ==========================================
// 🧩 Exportar router
// ==========================================
export default router
