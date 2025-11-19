import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany()
    res.json(roles)
  } catch (error) {
    console.error("Error obtenerRoles:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// Actualizar rol de un usuario
export const actualizarRolUsuario = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id)
    const { rolId } = req.body

    const actualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: { rolId }
    })

    res.json(actualizado)
  } catch (error) {
    console.error("Error actualizarRolUsuario:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}
