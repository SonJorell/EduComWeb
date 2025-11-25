import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 🛡️ Valida el token y carga req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado.' })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'educom_super_secret_key')

    // Cargar usuario desde BD
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.sub },
      include: { rol: true }
    })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    // Attach user
    req.user = {
      sub: usuario.id,        // 🔥 ahora sí
      id: usuario.id,         // alias
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol.nombre // "PROFESOR" / "DIRECTOR" / "ADMIN"
    }

    next()
  } catch (err) {
    console.error('❌ Error en requireAuth:', err.message)
    res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}


/**
 * 🔑 Validación de UN rol requerido
 */
export const requireRole = (roleName = '') => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'No autenticado.' })

      if (req.user.rol !== roleName) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' })
      }

      next()
    } catch (err) {
      console.error('❌ Error en requireRole:', err.message)
      res.status(500).json({ error: 'Error interno al validar rol.' })
    }
  }
}


/**
 * 🔑 Validación de múltiples roles permitidos
 */
export const requireRoles = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'No autenticado.' })

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' })
      }

      next()
    } catch (err) {
      console.error('❌ Error en requireRoles:', err.message)
      res.status(500).json({ error: 'Error interno al validar roles.' })
    }
  }
}
