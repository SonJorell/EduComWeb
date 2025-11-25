import express from "express"
import { PrismaClient } from "@prisma/client"
import { requireAuth } from "../middlewares/auth.middleware.js"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const router = express.Router()

// ===============================================
// 🔐 Middleware TI
// ===============================================
router.use(requireAuth, (req, res, next) => {
  const rol = req.user.rol?.trim().toLowerCase().replace(/\s+/g, " ")
  const rolesPermitidos = ["admin", "administrador", "administrador ti", "ti"]

  if (rolesPermitidos.includes(rol)) return next()
  return res.status(403).json({ error: "Acceso denegado: Rol insuficiente" })
})

// ===============================================
// 📝 Auditoría Helper
// ===============================================
async function logAuditoria(usuarioId, accion, detalle) {
  try {
    await prisma.auditLog.create({
      data: {
        usuarioId,
        accion,
        descripcion: detalle,
        entidad: "TI"
      }
    })
  } catch (error) {
    console.error("Error registrando auditoría TI:", error)
  }
}

// ===================================================================
// 👤 GESTIÓN DE USUARIOS
// ===================================================================

// 1. Listar Usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { rol: true },
      orderBy: { id: 'desc' }
    })
    res.json(usuarios)
  } catch (e) { res.status(500).json({ error: "Error al obtener usuarios" }) }
})

// 2. Crear Usuario
router.post("/usuarios", async (req, res) => {
  try {
    const { nombre, email, password, rolNombre } = req.body
    const rol = await prisma.rol.findUnique({ where: { nombre: rolNombre } })
    if (!rol) return res.status(400).json({ error: "Rol no existe" })

    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) return res.status(400).json({ error: "El correo ya está registrado" })

    const passwordHash = await bcrypt.hash(password, 10)
    
    // Se crea con estado ACTIVO por defecto (definido en schema)
    const usuario = await prisma.usuario.create({
      data: { nombre, email, passwordHash, rolId: rol.id, estado: 'ACTIVO' }
    })
    await logAuditoria(req.user.id, "CREAR_USUARIO", `Usuario: ${email}`)
    res.status(201).json(usuario)
  } catch (e) { res.status(500).json({ error: "Error creando usuario" }) }
})

// 3. Editar Usuario (Actualiza Estado y Rol)
router.put("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nombre, email, rolNombre, estado } = req.body

    const dataUpdate = { nombre, email }
    
    // Si envían el estado (ACTIVO, VACACIONES, ETC), lo actualizamos
    if (estado) dataUpdate.estado = estado

    if (rolNombre) {
      const rol = await prisma.rol.findUnique({ where: { nombre: rolNombre } })
      if (rol) dataUpdate.rolId = rol.id
    }

    await prisma.usuario.update({ where: { id }, data: dataUpdate })
    await logAuditoria(req.user.id, "EDITAR_USUARIO", `Usuario ID ${id} editado`)
    res.json({ ok: true })
  } catch (e) { 
    console.error(e)
    res.status(500).json({ error: "Error editando usuario" }) 
  }
})

// 4. Eliminar Usuario (SOFT DELETE -> INACTIVO)
router.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)
    
    // No borramos el registro, solo cambiamos el estado a INACTIVO
    await prisma.usuario.update({
        where: { id },
        data: { estado: 'INACTIVO' }
    })

    await logAuditoria(req.user.id, "DESHABILITAR_USUARIO", `Usuario ID ${id} marcado como INACTIVO`)
    res.json({ ok: true, message: "Usuario deshabilitado correctamente" })
  } catch (e) { 
    console.error(e)
    res.status(500).json({ error: "Error al deshabilitar usuario" }) 
  }
})

// 5. Cambiar Rol (Ruta Específica)
router.patch("/usuarios/:id/rol", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { rolNombre } = req.body
    const rol = await prisma.rol.findUnique({ where: { nombre: rolNombre } })
    if (!rol) return res.status(400).json({ error: "Rol no existe" })

    const usuario = await prisma.usuario.update({ where: { id }, data: { rolId: rol.id } })
    await logAuditoria(req.user.id, "CAMBIO_ROL", `Usuario ${id} actualizado a ${rolNombre}`)
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: "Error interno al cambiar rol" })
  }
})

// 6. Reset Password
router.patch("/usuarios/:id/password", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { nuevaPassword } = req.body
    const passwordHash = await bcrypt.hash(nuevaPassword, 10)
    await prisma.usuario.update({ where: { id }, data: { passwordHash } })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: "Error reset password" }) }
})

// 7. Reset Default (POST)
router.post("/usuarios/:id/reset", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const tempPass = "Colegio123"
        const passwordHash = await bcrypt.hash(tempPass, 10)
        await prisma.usuario.update({ where: { id }, data: { passwordHash } })
        res.json({ ok: true, message: `Contraseña reseteada a: ${tempPass}` })
    } catch(e) { res.status(500).json({ error: "Error reset default" }) }
})

// ===================================================================
// 🛡️ GESTIÓN DE ROLES
// ===================================================================
router.get("/roles", async (req, res) => {
    try {
        const roles = await prisma.rol.findMany({ orderBy: { id: 'asc' } })
        res.json(roles)
    } catch (error) {
        res.status(500).json({ error: "Error interno al obtener roles" })
    }
})

// ===================================================================
// 📚 GESTIÓN DE CURSOS
// ===================================================================

router.get("/cursos", async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        profesorCursos: {
          where: { rolInterno: { in: ['JEFE', 'PROFESOR JEFE'] } },
          include: { profesor: true }
        },
        _count: { select: { alumnos: true } }
      },
      orderBy: { nombre: 'asc' }
    })
    const cursosFormateados = cursos.map(c => ({
      ...c,
      profesorJefe: c.profesorCursos[0]?.profesor || null,
      totalAlumnos: c._count.alumnos
    }))
    res.json(cursosFormateados)
  } catch (e) { res.status(500).json({ error: "Error obteniendo cursos" }) }
})

router.post("/cursos", async (req, res) => {
  try {
    const { nombre, nivel, jornada, anio } = req.body
    const curso = await prisma.curso.create({ data: { nombre, nivel, jornada, anio } })
    await logAuditoria(req.user.id, "CREAR_CURSO", `Curso: ${nombre}`)
    res.status(201).json(curso)
  } catch (e) { res.status(500).json({ error: "Error creando curso" }) }
})

router.put("/cursos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.curso.update({ where: { id }, data: req.body })
    await logAuditoria(req.user.id, "EDITAR_CURSO", `Curso ID ${id} editado`)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: "Error editando curso" }) }
})

// 🛑 ELIMINAR CURSO (Protegido)
router.delete("/cursos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)

    // 1. Verificar Alumnos
    const tieneAlumnos = await prisma.alumno.count({ where: { cursoId: id } })
    if (tieneAlumnos > 0) return res.status(400).json({ error: `No se puede borrar: Hay ${tieneAlumnos} alumnos inscritos.` })
    
    // 2. Verificar Profesor
    const tieneProfesor = await prisma.profesorCurso.count({ where: { cursoId: id } })
    if (tieneProfesor > 0) return res.status(400).json({ error: "No se puede borrar: Tiene profesor asignado. Quítalo primero." })

    // 3. Borrar
    await prisma.curso.delete({ where: { id } })
    await logAuditoria(req.user.id, "ELIMINAR_CURSO", `Curso ID ${id} eliminado`)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: "Error eliminando curso" }) }
})

// Asignar Profesor
router.post("/cursos/:cursoId/asignar-profesor", async (req, res) => {
  try {
    const cursoId = Number(req.params.cursoId)
    const { profesorId, rolInterno = "JEFE" } = req.body

    await prisma.$transaction(async (tx) => {
        if (rolInterno === 'JEFE' || rolInterno === 'PROFESOR JEFE') {
            await tx.profesorCurso.deleteMany({
                where: { cursoId, rolInterno: { in: ['JEFE', 'PROFESOR JEFE'] } }
            })
        }
        await tx.profesorCurso.create({
            data: { profesorId: Number(profesorId), cursoId, rolInterno }
        })
    })
    await logAuditoria(req.user.id, "ASIGNAR_PROFESOR", `Profesor ${profesorId} a curso ${cursoId}`)
    res.json({ ok: true })
  } catch (error) { res.status(500).json({ error: "Error al asignar profesor" }) }
})

// Desasignar Profesor
router.delete("/cursos/:cursoId/desasignar-profesor", async (req, res) => {
  try {
    const cursoId = Number(req.params.cursoId)
    const resultado = await prisma.profesorCurso.deleteMany({
      where: { cursoId, rolInterno: { in: ['JEFE', 'PROFESOR JEFE'] } }
    })
    if (resultado.count === 0) return res.status(404).json({ error: "No hay profesor jefe para quitar." })
    
    await logAuditoria(req.user.id, "DESASIGNAR_PROFESOR", `Profesor quitado del curso ${cursoId}`)
    res.json({ ok: true })
  } catch (error) { res.status(500).json({ error: "Error al quitar profesor" }) }
})

// ===============================================
// ⚙️ SISTEMA & AUDITORÍA
// ===============================================

router.get("/sistema/db", async (req, res) => {
    try {
        const tablas = await prisma.$queryRaw`SHOW TABLES`
        res.json({ ok: true, tablas })
    } catch { res.status(500).json({ error: "Error DB" }) }
})

router.get("/sistema/logs", async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({ 
            orderBy: { timestamp: "desc" }, 
            take: 50,
            include: { usuario: true }
        })
        res.json(logs)
    } catch { res.status(500).json({ error: "Error Logs" }) }
})

router.get("/auditoria", async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({ 
            include: { usuario: true }, 
            orderBy: { timestamp: "desc" }
        })
        res.json(logs)
    } catch { res.status(500).json({ error: "Error Auditoría" }) }
})

export default router