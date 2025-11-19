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
  comunicadosRecientes,
  deshabilitarComunicado
} from '../controllers/profesor.controller.js'

// ==========================================
// 🚀 Inicialización del router
// ==========================================
const router = express.Router()

// ==========================================
// 🧭 Grupo de rutas protegidas para PROFESOR
// ==========================================

// ✅ Obtener los cursos asignados al profesor
// GET /api/profesores/me/cursos
router.get(
  '/me/cursos',
  requireAuth,
  requireRole('Profesor'),
  cursosProfesor
)

// ✅ Obtener resumen general del dashboard del profesor
// GET /api/profesores/me/resumen
router.get(
  '/me/resumen',
  requireAuth,
  requireRole('Profesor'),
  resumenProfesor
)

// ✅ Listar todas las notificaciones enviadas por el profesor
// GET /api/profesores/me/notificaciones
router.get(
  '/me/notificaciones',
  requireAuth,
  requireRole('Profesor'),
  notificacionesProfesor
)

// ✅ Obtener comunicados recientes (para el dashboard)
// GET /api/profesores/me/comunicados
router.get(
  '/me/comunicados',
  requireAuth,
  requireRole('Profesor'),
  comunicadosRecientes
)

// ✅ Obtener los apoderados asociados a los cursos del profesor
// GET /api/profesores/me/apoderados
router.get(
  '/me/apoderados',
  requireAuth,
  requireRole('Profesor'),
  apoderadosProfesor
)

// ✅ Crear una nueva notificación o comunicado
// POST /api/profesores/notificaciones
router.post(
  '/notificaciones',
  requireAuth,
  requireRole('Profesor'),
  enviarNotificacion
)

// ✅ Obtener el detalle completo de una notificación específica
// GET /api/profesores/notificaciones/:id
router.get(
  '/notificaciones/:id',
  requireAuth,
  requireRole('Profesor'),
  detalleNotificacion
)

// ✅ Deshabilitar (soft delete) un comunicado sin eliminarlo físicamente
// PUT /api/profesores/notificaciones/:id/deshabilitar
router.put(
  '/notificaciones/:id/deshabilitar',
  requireAuth,
  requireRole('Profesor'),
  deshabilitarComunicado
)

// ==========================================
// 🧩 Exportar router
// ==========================================
export default router
