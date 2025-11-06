import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// =====================================================
// 📚 Obtener cursos asignados al profesor
// =====================================================
export async function cursosProfesor(req, res) {
  try {
    const profesorId = req.user.sub

    const cursos = await prisma.profesorCurso.findMany({
      where: { profesorId },
      include: { curso: true }
    })

    if (!cursos.length) {
      return res.status(404).json({ message: 'No se encontraron cursos asignados.' })
    }

    res.json(cursos.map(pc => pc.curso))
  } catch (err) {
    console.error('cursosProfesor error:', err)
    res.status(500).json({ error: 'Error interno al obtener cursos.' })
  }
}

// =====================================================
// 📊 Resumen general del dashboard del profesor
// =====================================================
export async function resumenProfesor(req, res) {
  try {
    const profesorId = req.user.sub

    const cursos = await prisma.profesorCurso.findMany({
      where: { profesorId },
      select: { cursoId: true }
    })
    const cursoIds = cursos.map(c => c.cursoId)

    const totalAlumnos = await prisma.alumno.count({
      where: { cursoId: { in: cursoIds } }
    })

    const totalNotificaciones = await prisma.notificacion.count({
      where: { emisorId: profesorId }
    })

    const recepciones = await prisma.recepcion.findMany({
      where: { notificacion: { emisorId: profesorId } },
      select: { leido: true, confirmado: true }
    })

    const total = recepciones.length
    const leidas = recepciones.filter(r => r.leido).length
    const confirmadas = recepciones.filter(r => r.confirmado).length

    res.json({
      totalEnviados: totalNotificaciones,
      tasaConfirmacion: total ? Math.round((confirmadas / total) * 100) : 0,
      pendientes: total ? total - confirmadas : 0,
      cursos: cursoIds.length,
      alumnos: totalAlumnos
    })
  } catch (err) {
    console.error('resumenProfesor error:', err)
    res.status(500).json({ error: 'Error interno al generar el resumen.' })
  }
}

// =====================================================
// 📨 Listar notificaciones enviadas por el profesor
// =====================================================
export async function notificacionesProfesor(req, res) {
  try {
    const profesorId = req.user.sub

    const notificaciones = await prisma.notificacion.findMany({
      where: { emisorId: profesorId },
      orderBy: { createdAt: 'desc' },
      include: { recepciones: true }
    })

    const result = []
    for (const n of notificaciones) {
      const total = n.recepciones.length || 1
      const leidos = n.recepciones.filter(r => r.leido).length
      const confirmados = n.recepciones.filter(r => r.confirmado).length

      // Parsear cursosDestino
      let nombresCursos = []
      if (n.cursosDestino) {
        try {
          const ids = Array.isArray(n.cursosDestino)
            ? n.cursosDestino
            : JSON.parse(n.cursosDestino)
          const cursos = await prisma.curso.findMany({
            where: { id: { in: ids } },
            select: { nombre: true }
          })
          nombresCursos = cursos.map(c => c.nombre)
        } catch {
          nombresCursos = ['Sin curso asignado']
        }
      }

      result.push({
        id: n.id,
        titulo: n.titulo || '(Sin título)',
        mensaje: n.mensaje,
        tipo: n.tipo,
        fecha: n.createdAt.toISOString(),
        leido: Math.round((leidos / total) * 100),
        confirmado: Math.round((confirmados / total) * 100),
        cursos: nombresCursos
      })
    }

    res.json(result)
  } catch (err) {
    console.error('notificacionesProfesor error:', err)
    res.status(500).json({ error: 'Error interno al obtener notificaciones.' })
  }
}

// =====================================================
// 👨‍👩‍👧 Obtener apoderados vinculados a cursos del profesor
// =====================================================
export async function apoderadosProfesor(req, res) {
  try {
    const profesorId = req.user.sub

    const cursos = await prisma.profesorCurso.findMany({
      where: { profesorId },
      select: { cursoId: true }
    })
    const cursoIds = cursos.map(c => c.cursoId)

    const apoderados = await prisma.apoderado.findMany({
      where: { alumnos: { some: { cursoId: { in: cursoIds } } } },
      distinct: ['id'],
      select: { id: true, nombre: true, email: true, telefono: true, rut: true }
    })

    res.json(apoderados)
  } catch (err) {
    console.error('apoderadosProfesor error:', err)
    res.status(500).json({ error: 'Error interno al obtener apoderados.' })
  }
}

// =====================================================
// ✉️ Enviar nueva notificación (a curso o apoderado)
// =====================================================
export async function enviarNotificacion(req, res) {
  try {
    const { titulo, mensaje, tipo, cursoIds = [], apoderadoIds = [] } = req.body
    const profesorId = req.user.sub

    if (!mensaje || (!cursoIds.length && !apoderadoIds.length)) {
      return res.status(400).json({
        error: 'Debe especificar un mensaje y al menos un destinatario (curso o apoderado).'
      })
    }

    const notificacion = await prisma.notificacion.create({
      data: {
        titulo: titulo || '(Sin título)',
        mensaje,
        tipo,
        emisorId: profesorId,
        cursosDestino: cursoIds.length ? cursoIds : null
      }
    })

    let apoderadosDestino = []

    if (cursoIds.length > 0) {
      const alumnos = await prisma.alumno.findMany({
        where: { cursoId: { in: cursoIds } },
        include: { apoderado: true }
      })
      apoderadosDestino = alumnos.map(a => a.apoderado)
    }

    if (apoderadoIds.length > 0) {
      const apods = await prisma.apoderado.findMany({
        where: { id: { in: apoderadoIds } }
      })
      apoderadosDestino = [...apoderadosDestino, ...apods]
    }

    const apoderadoIdsUnicos = [...new Set(apoderadosDestino.map(a => a.id))]

    if (apoderadoIdsUnicos.length > 0) {
      await prisma.recepcion.createMany({
        data: apoderadoIdsUnicos.map(id => ({
          notificacionId: notificacion.id,
          apoderadoId: id
        }))
      })
    }

    res.status(201).json({
      message: 'Notificación enviada exitosamente.',
      notificacionId: notificacion.id,
      cursosDestino: cursoIds,
      destinatarios: apoderadoIdsUnicos.length
    })
  } catch (err) {
    console.error('enviarNotificacion error:', err)
    res.status(500).json({ error: 'Error interno al enviar la notificación.' })
  }
}

// =====================================================
// 🧾 Detalle completo de una notificación
// =====================================================
export async function detalleNotificacion(req, res) {
  try {
    const profesorId = req.user.sub
    const notificacionId = Number(req.params.id)

    const notificacion = await prisma.notificacion.findUnique({
      where: { id: notificacionId },
      include: {
        recepciones: {
          include: {
            apoderado: {
              include: { alumnos: { include: { curso: true } } }
            }
          }
        }
      }
    })

    if (!notificacion)
      return res.status(404).json({ error: 'Notificación no encontrada.' })

    if (notificacion.emisorId !== profesorId)
      return res.status(403).json({ error: 'No autorizado.' })

    const cursoIds = Array.isArray(notificacion.cursosDestino)
      ? notificacion.cursosDestino
      : []

    const cursos = await prisma.curso.findMany({
      where: { id: { in: cursoIds } },
      select: { nombre: true }
    })

    const apoderados = notificacion.recepciones.map(r => ({
      id: r.apoderado.id,
      nombre: r.apoderado.nombre,
      correo: r.apoderado.email,
      telefono: r.apoderado.telefono,
      leido: r.leido,
      confirmado: r.confirmado,
      leidoAt: r.leidoAt ? r.leidoAt.toISOString() : null,
      confirmadoAt: r.confirmadoAt ? r.confirmadoAt.toISOString() : null
    }))

    res.json({
      id: notificacion.id,
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      tipo: notificacion.tipo,
      fecha: notificacion.createdAt.toISOString(),
      cursos: cursos.map(c => c.nombre),
      totalDestinatarios: notificacion.recepciones.length,
      apoderados
    })
  } catch (err) {
    console.error('detalleNotificacion error:', err)
    res.status(500).json({ error: 'Error interno al obtener detalle del comunicado.' })
  }
}

// =====================================================
// 🕓 Comunicados recientes del profesor (para dashboard)
// =====================================================
export async function comunicadosRecientes(req, res) {
  try {
    const profesorId = req.user.sub

    const recientes = await prisma.notificacion.findMany({
      where: { emisorId: profesorId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { recepciones: { select: { leido: true, confirmado: true } } }
    })

    const data = []
    for (const n of recientes) {
      const total = n.recepciones.length || 1
      const leidos = n.recepciones.filter(r => r.leido).length
      const confirmados = n.recepciones.filter(r => r.confirmado).length

      let cursos = []
      if (n.cursosDestino) {
        try {
          const ids = Array.isArray(n.cursosDestino)
            ? n.cursosDestino
            : JSON.parse(n.cursosDestino)
          const cursosData = await prisma.curso.findMany({
            where: { id: { in: ids } },
            select: { nombre: true }
          })
          cursos = cursosData.map(c => c.nombre)
        } catch {
          cursos = ['Sin curso asignado']
        }
      }

      data.push({
        id: n.id,
        titulo: n.titulo || '(Sin título)',
        tipo: n.tipo || 'General',
        fecha: n.createdAt.toISOString(),
        porcentajeLeido: Math.round((leidos / total) * 100),
        porcentajeConfirmado: Math.round((confirmados / total) * 100),
        cursos
      })
    }

    res.json(data)
  } catch (err) {
    console.error('comunicadosRecientes error:', err)
    res.status(500).json({ error: 'Error al obtener comunicados recientes.' })
  }
}
