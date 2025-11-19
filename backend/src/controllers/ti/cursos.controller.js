import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// =============================================
// 🎓 Obtener cursos
// =============================================
export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      include: { profesorCursos: true }
    })
    res.json(cursos)
  } catch (error) {
    console.error("Error obtenerCursos:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// =============================================
// 🎓 Crear curso
// =============================================
export const crearCurso = async (req, res) => {
  try {
    const { nombre, nivel, jornada, anio } = req.body

    if (!nombre || !nivel) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

    const creado = await prisma.curso.create({
      data: { nombre, nivel, jornada, anio }
    })

    res.status(201).json(creado)
  } catch (error) {
    console.error("Error crearCurso:", error)
    res.status(500).json({ error: "Error interno" })
  }
}

// =============================================
// 🎓 Editar curso
// =============================================
export const editarCurso = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nombre, nivel, jornada, anio } = req.body

    const actualizado = await prisma.curso.update({
      where: { id },
      data: { nombre, nivel, jornada, anio }
    })

    res.json(actualizado)
  } catch (error) {
    console.error("Error editarCurso:", error)
    res.status(500).json({ error: "Error interno" })
  }
}

// =============================================
// ❌ Eliminar curso
// =============================================
export const eliminarCurso = async (req, res) => {
  try {
    const id = Number(req.params.id)

    await prisma.curso.delete({ where: { id } })

    res.json({ message: "Curso eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminarCurso:", error)
    res.status(500).json({ error: "Error interno" })
  }
}

// =============================================
// ➕ Asignar profesor a curso
// =============================================
export const asignarProfesor = async (req, res) => {
  try {
    const cursoId = Number(req.params.cursoId)
    const { profesorId } = req.body

    const asignacion = await prisma.profesorCurso.create({
      data: {
        cursoId,
        profesorId,
        rolInterno: "JEFE"
      }
    })

    res.json(asignacion)
  } catch (error) {
    console.error("Error asignarProfesor:", error)
    res.status(500).json({ error: "Error interno" })
  }
}
