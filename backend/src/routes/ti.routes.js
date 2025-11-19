// ==============================================
// 📘 Rutas del módulo TI / Administrador - EduCom
// ==============================================
import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

// 🔹 Controladores
import {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  resetearPassword
} from '../controllers/ti/usuarios.controller.js'

import {
  obtenerCursos,
  crearCurso,
  editarCurso,
  eliminarCurso,
  asignarProfesor
} from '../controllers/ti/cursos.controller.js'

import {
  obtenerRoles,
  actualizarRolUsuario
} from '../controllers/ti/roles.controller.js'

import {
  obtenerEstadoBD,
  obtenerLogsSistema
} from '../controllers/ti/sistema.controller.js'

import {
  obtenerAuditoria
} from '../controllers/ti/auditoria.controller.js'

// Configuración del router
const router = express.Router()

// Middlewares
const soloTI = [requireAuth, requireRole('Administrador', 'TI')]

// ==============================================
// 🔹 GESTIÓN DE USUARIOS
// ==============================================
router.get('/usuarios', soloTI, obtenerUsuarios)
router.post('/usuarios', soloTI, crearUsuario)
router.put('/usuarios/:id', soloTI, editarUsuario)
router.delete('/usuarios/:id', soloTI, eliminarUsuario)
router.put('/usuarios/:id/resetear-password', soloTI, resetearPassword)

// ==============================================
// 🔹 GESTIÓN DE CURSOS
// ==============================================
router.get('/cursos', soloTI, obtenerCursos)
router.post('/cursos', soloTI, crearCurso)
router.put('/cursos/:id', soloTI, editarCurso)
router.delete('/cursos/:id', soloTI, eliminarCurso)

// Asignar profesor a curso
router.post('/cursos/:cursoId/asignar-profesor', soloTI, asignarProfesor)

// ==============================================
// 🔹 ROLES Y PERMISOS
// ==============================================
router.get('/roles', soloTI, obtenerRoles)
router.put('/roles/usuarios/:id', soloTI, actualizarRolUsuario)

// ==============================================
// 🔹 ADMINISTRACIÓN DEL SISTEMA
// ==============================================
router.get('/sistema/db', soloTI, obtenerEstadoBD)
router.get('/sistema/logs', soloTI, obtenerLogsSistema)

// ==============================================
// 🔹 AUDITORÍA
// ==============================================
router.get('/auditoria', soloTI, obtenerAuditoria)

// Exportación
export default router
