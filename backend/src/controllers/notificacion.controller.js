import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * POST /notificaciones
 * body:
 *   { titulo, mensaje, tipo: 'individual'|'curso', apoderadoId?, cursoId? }
 */
export async function enviarNotificacion(req, res) {
  try {
    const emisorId = req.user.sub // profesor logueado
    const { titulo, mensaje, tipo, apoderadoId, cursoId } = req.body

    if (!titulo || !mensaje || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    let destinatariosIds = []

    if (tipo === 'individual') {
      if (!apoderadoId) return res.status(400).json({ error: 'apoderadoId es requerido' })
      const apo = await prisma.usuario.findFirst({ where: { id: Number(apoderadoId), rol: { nombre: 'Apoderado' } } })
      if (!apo) return res.status(404).json({ error: 'Apoderado no encontrado' })
      destinatariosIds = [apo.id]
    }

    if (tipo === 'curso') {
      if (!cursoId) return res.status(400).json({ error: 'cursoId es requerido' })
      // apoderados del curso (a partir de alumnos de ese curso)
      const alumnos = await prisma.alumno.findMany({
        where: { cursoId: Number(cursoId) },
        select: { apoderadoId: true }
      })
      destinatariosIds = [
        ...new Set(alumnos.map(a => a.apoderadoId).filter(Boolean))
      ]
      if (destinatariosIds.length === 0) {
        return res.status(400).json({ error: 'El curso no tiene apoderados asociados' })
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const notif = await tx.notificacion.create({
        data: {
          titulo,
          mensaje,
          emisorId
        }
      })

      await tx.recepcion.createMany({
        data: destinatariosIds.map(destId => ({
          notificacionId: notif.id,
          destinatarioId: destId
        }))
      })

      return notif
    })

    res.status(201).json({ ok: true, id: result.id })
  } catch (err) {
    console.error('enviarNotificacion error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}

/**
 * GET /notificaciones/mias
 * Lista las notificaciones emitidas por el profesor, con métricas
 */
export async function misNotificaciones(req, res) {
  try {
    const emisorId = req.user.sub

    const notifs = await prisma.notificacion.findMany({
      where: { emisorId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { recepciones: true } },
        recepciones: {
          select: { leidoAt: true, confirmadoAt: true }
        }
      }
    })

    const data = notifs.map(n => {
      const total = n._count.recepciones
      const leidos = n.recepciones.filter(r => r.leidoAt).length
      const confirmados = n.recepciones.filter(r => r.confirmadoAt).length
      return {
        id: n.id,
        titulo: n.titulo,
        mensaje: n.mensaje,
        createdAt: n.createdAt,
        totalDestinatarios: total,
        leidos,
        confirmados,
        pctLeidos: total ? Math.round((leidos / total) * 100) : 0,
        pctConfirmados: total ? Math.round((confirmados / total) * 100) : 0
      }
    })

    res.json(data)
  } catch (err) {
    console.error('misNotificaciones error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}

/**
 * GET /notificaciones/:id/estados
 * Detalle de recepciones por destinatario para una notificación
 */
export async function detalleEstados(req, res) {
  try {
    const id = Number(req.params.id)
    const notif = await prisma.notificacion.findUnique({
      where: { id },
      include: {
        recepciones: {
          include: {
            destinatario: { select: { id: true, nombre: true, email: true } }
          }
        }
      }
    })
    if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' })

    // (Opcional) validar que el emisor sea el dueño
    if (notif.emisorId !== req.user.sub) {
      return res.status(403).json({ error: 'Sin permisos' })
    }

    const detalle = notif.recepciones.map(r => ({
      destinatarioId: r.destinatario.id,
      destinatario: r.destinatario.nombre,
      email: r.destinatario.email,
      leidoAt: r.leidoAt,
      confirmadoAt: r.confirmadoAt
    }))
    res.json(detalle)
  } catch (err) {
    console.error('detalleEstados error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}

/**
 * POST /notificaciones/:id/leido  (Apoderado)
 */
export async function marcarLeido(req, res) {
  try {
    const userId = req.user.sub // apoderado
    const id = Number(req.params.id)
    await prisma.recepcion.updateMany({
      where: { notificacionId: id, destinatarioId: userId, leidoAt: null },
      data: { leidoAt: new Date() }
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('marcarLeido error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}

/**
 * POST /notificaciones/:id/confirmado  (Apoderado)
 */
export async function marcarConfirmado(req, res) {
  try {
    const userId = req.user.sub
    const id = Number(req.params.id)
    await prisma.recepcion.updateMany({
      where: { notificacionId: id, destinatarioId: userId, confirmadoAt: null },
      data: { confirmadoAt: new Date() }
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('marcarConfirmado error:', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
