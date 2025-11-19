import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcrypt'
const prisma = new PrismaClient()

// =============================
// 👤 USUARIOS
// =============================
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { rol: true }
    })
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rolId } = req.body

    const passwordHash = await hash(password, 10)

    const nuevo = await prisma.usuario.create({
      data: { nombre, email, passwordHash, rolId }
    })

    res.status(201).json(nuevo)
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

export const editarUsuario = async (req, res) => {
  try {
    const { nombre, email, rolId } = req.body
    const { id } = req.params

    const actualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, email, rolId }
    })

    res.json(actualizado)
  } catch (err) {
    res.status(500).json({ error: 'Error al editar usuario' })
  }
}

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.usuario.delete({ where: { id: Number(id) } })

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
}

export const resetearPassword = async (req, res) => {
  try {
    const { id } = req.params
    const passwordHash = await hash('123456', 10)

    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { passwordHash }
    })

    res.json({ message: 'Contraseña reiniciada a 123456' })
  } catch (err) {
    res.status(500).json({ error: 'Error al resetear password' })
  }
}

// =============================
// 🎓 CURSOS
// =============================
export const obtenerCursos = async (_, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        profesorCursos: { include: { profesor: true } },
        alumnos: true
      }
    })
    res.json(cursos)
  } catch {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

export const crearCurso = async (req, res) => {
  try {
    const curso = await prisma.curso.create({ data: req.body })
    res.status(201).json(curso)
  } catch {
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

export const editarCurso = async (req, res) => {
  try {
    const { id } = req.params
    const curso = await prisma.curso.update({
      where: { id: Number(id) },
      data: req.body
    })
    res.json(curso)
  } catch {
    res.status(500).json({ error: 'Error al editar curso' })
  }
}

export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.curso.delete({ where: { id: Number(id) } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Error al eliminar curso' })
  }
}

export const asignarProfesor = async (req, res) => {
  try {
    const { id } = req.params
    const { profesorId, rolInterno } = req.body

    const resultado = await prisma.profesorCurso.create({
      data: {
        cursoId: Number(id),
        profesorId,
        rolInterno: rolInterno || 'ASIGNATURA'
      }
    })

    res.json(resultado)
  } catch {
    res.status(500).json({ error: 'Error asignando profesor' })
  }
}

// =============================
// 🔐 ROLES
// =============================
export const obtenerRoles = async (_, res) => {
  try {
    const roles = await prisma.rol.findMany()
    res.json(roles)
  } catch {
    res.status(500).json({ error: 'Error al obtener roles' })
  }
}

export const actualizarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { rolId } = req.body

    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { rolId }
    })

    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Error al actualizar rol' })
  }
}

// =============================
// 🖥️ SISTEMA
// =============================
export const obtenerEstadoBD = async (_, res) => {
  res.json({ conectado: true }) // Se puede mejorar con ping real
}

export const obtenerLogsSistema = async (_, res) => {
  res.json({ logs: ['Log 1', 'Log 2', 'Log 3'] })
}

// =============================
// 📑 AUDITORÍA
// =============================
export const obtenerAuditoria = async (_, res) => {
  res.json({ auditoria: [] })
}
