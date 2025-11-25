export const requireRoles = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado.' })
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user.id },
        include: { rol: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' })
      }

      const userRole = usuario.rol.nombre.toUpperCase()
      const allowed = allowedRoles.map(r => r.toUpperCase())

      if (!allowed.includes(userRole)) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' })
      }

      next()

    } catch (err) {
      console.error('❌ Error en requireRoles:', err.message)
      res.status(500).json({ error: 'Error interno al validar roles.' })
    }
  }
}
