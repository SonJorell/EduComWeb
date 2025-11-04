// src/routes/usuario.routes.js
import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import { crearUsuario, listarUsuarios } from '../controllers/usuario.controller.js'

const router = Router()

// Solo TI puede crear/listar usuarios
router.get('/', requireAuth, requireRole('Administrador TI'), listarUsuarios)
router.post('/', requireAuth, requireRole('Administrador TI'), crearUsuario)

export default router
