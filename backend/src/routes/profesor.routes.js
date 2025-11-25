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

// GET /api/profesores/me/cursos
router.get(
  '/me/cursos',
  requireAuth,
  requireRole('PROFESOR'),
  cursosProfesor
)

// GET /api/profesores/me/resumen
router.get(
  '/me/resumen',
  requireAuth,
  requireRole('PROFESOR'),
  resumenProfesor
)

// GET /api/profesores/me/notificaciones
router.get(
  '/me/notificaciones',
  requireAuth,
  requireRole('PROFESOR'),
  notificacionesProfesor
)

// GET /api/profesores/me/comunicados
router.get(
  '/me/comunicados',
  requireAuth,
  requireRole('PROFESOR'),
  comunicadosRecientes
)

// GET /api/profesores/me/apoderados
router.get(
  '/me/apoderados',
  requireAuth,
  requireRole('PROFESOR'),
  apoderadosProfesor
)

// POST /api/profesores/notificaciones
router.post(
  '/notificaciones',
  requireAuth,
  requireRole('PROFESOR'),
  enviarNotificacion
)

// GET /api/profesores/notificaciones/:id
router.get(
  '/notificaciones/:id',
  requireAuth,
  requireRole('PROFESOR'),
  detalleNotificacion
)

// PUT /api/profesores/notificaciones/:id/deshabilitar
router.put(
  '/notificaciones/:id/deshabilitar',
  requireAuth,
  requireRole('PROFESOR'),
  deshabilitarComunicado
)

// ==========================================
// 🧩 Exportar router
// ==========================================
export default router
