import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 🛡️ Middleware que valida el token JWT y adjunta los datos del usuario autenticado.
 * 
 * Este middleware se debe usar antes de las rutas protegidas.
 * Ejemplo:
 *    router.get('/ruta-protegida', requireAuth, controlador)
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // 🔸 Verificar si se envió encabezado de autorización
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado.' })
    }

    const token = authHeader.split(' ')[1]

    // 🔸 Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'educom_super_secret_key')

    // 🔸 Adjuntar información del usuario decodificada al request
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      rol: decoded.rol,
      nombre: decoded.nombre || ''
    }

    next()
  } catch (error) {
    console.error('❌ Error en requireAuth:', error.message)
    res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}

/**
 * 🧩 Middleware que valida si el usuario tiene un rol específico.
 * 
 * @param {string} roleName - Nombre exacto del rol (ej: "Profesor", "Administrador", "Apoderado").
 * 
 * Ejemplo:
 *    router.get('/panel-ti', requireAuth, requireRole('Administrador'), controlador)
 */
export const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.sub

      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' })
      }

      // 🔹 Consultar el rol real desde la BD (evita falsificación del token)
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { rol: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' })
      }

      // 🔸 Verificar coincidencia de rol
      if (usuario.rol?.nombre !== roleName) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' })
      }

      next()
    } catch (err) {
      console.error('❌ Error en requireRole:', err.message)
      res.status(500).json({ error: 'Error interno al validar rol.' })
    }
  }
}
