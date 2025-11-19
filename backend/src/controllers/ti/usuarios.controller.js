import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// =============================================
// 👤 Obtener todos los usuarios
// =============================================
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: true
      }
    })

    res.json(usuarios)
  } catch (error) {
    console.error("Error obtenerUsuarios:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// =============================================
// 👤 Crear usuario nuevo
// =============================================
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rolId } = req.body

    if (!nombre || !email || !password || !rolId) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

    const exists = await prisma.usuario.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ error: "El email ya está registrado" })

    const passwordHash = await bcrypt.hash(password, 10)

    const nuevo = await prisma.usuario.create({
      data: { nombre, email, passwordHash, rolId }
    })

    res.status(201).json(nuevo)
  } catch (error) {
    console.error("Error crearUsuario:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// =============================================
// 👤 Editar usuario
// =============================================
export const editarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nombre, email, rolId } = req.body

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, rolId }
    })

    res.json(actualizado)
  } catch (error) {
    console.error("Error editarUsuario:", error)
    res.status(500).json({ error: "Error interno" })
  }
}

// =============================================
// ❌ Eliminar usuario
// =============================================
export const eliminarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id)

    await prisma.usuario.delete({ where: { id } })

    res.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminarUsuario:", error)
    res.status(500).json({ error: "Error interno" })
  }
}

// =============================================
// 🔒 Resetear contraseña
// =============================================
export const resetearPassword = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const nuevoPassword = "Reset123" // puedes cambiarlo por generador

    const passwordHash = await bcrypt.hash(nuevoPassword, 10)

    await prisma.usuario.update({
      where: { id },
      data: { passwordHash }
    })

    res.json({
      message: "Contraseña reseteada correctamente",
      nuevaPassword: nuevoPassword
    })
  } catch (error) {
    console.error("Error resetearPassword:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}
