import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// =====================================================
// 📬 Enviar una notificación (individual o a curso)
// =====================================================
export async function enviarNotificacion(req, res) {
  try {
    const emisorId = req.user.sub // Profesor autenticado
    const { titulo, mensaje, tipo, apoderadoId, cursoId } = req.body

    if (!titulo || !mensaje || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    let destinatariosIds = []

    if (tipo === 'individual') {
      if (!apoderadoId) {
        return res.status(400).json({ error: 'apoderadoId es requerido' })
      }

      const apoderado = await prisma.apoderado.findUnique({
        where: { id: Number(apoderadoId) }
      })

      if (!apoderado) {
        return res.status(404).json({ error: 'Apoderado no encontrado' })
      }

      destinatariosIds = [apoderado.id]
    }

    if (tipo === 'curso') {
      if (!cursoId) {
        return res.status(400).json({ error: 'cursoId es requerido' })
      }

      // Buscar apoderados de los alumnos del curso
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

    // Crear notificación y recepciones en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const notif = await tx.notificacion.create({
        data: {
          titulo,
          mensaje,
          emisorId,
          activo: true
        }
      })

      await tx.recepcion.createMany({
        data: destinatariosIds.map(id => ({
          notificacionId: notif.id,
          apoderadoId: id,
          activo: true
        }))
      })

      return notif
    })

    res.status(201).json({ ok: true, id: result.id })
  } catch (err) {
    console.error('❌ enviarNotificacion error:', err)
    res.status(500).json({ error: 'Error interno al enviar la notificación' })
  }
}

// =====================================================
// 📋 Obtener notificaciones del profesor emisor
// =====================================================
export async function misNotificaciones(req, res) {
  try {
    const emisorId = req.user.sub

    const notifs = await prisma.notificacion.findMany({
      where: { emisorId, activo: true }, // ✅ solo activas
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { recepciones: true } },
        recepciones: {
          where: { activo: true },
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
    console.error('❌ misNotificaciones error:', err)
    res.status(500).json({ error: 'Error interno al obtener notificaciones' })
  }
}

// =====================================================
// 📊 Detalle de estados de lectura/confirmación
// =====================================================
export async function detalleEstados(req, res) {
  try {
    const id = Number(req.params.id)
    const notif = await prisma.notificacion.findUnique({
      where: { id },
      include: {
        recepciones: {
          where: { activo: true },
          include: {
            apoderado: { select: { id: true, nombre: true, email: true } }
          }
        }
      }
    })

    if (!notif || !notif.activo)
      return res.status(404).json({ error: 'Notificación no encontrada o inactiva' })

    if (notif.emisorId !== req.user.sub) {
      return res.status(403).json({ error: 'Sin permisos para ver esta notificación' })
    }

    const detalle = notif.recepciones.map(r => ({
      apoderadoId: r.apoderado.id,
      nombre: r.apoderado.nombre,
      email: r.apoderado.email,
      leidoAt: r.leidoAt,
      confirmadoAt: r.confirmadoAt
    }))

    res.json(detalle)
  } catch (err) {
    console.error('❌ detalleEstados error:', err)
    res.status(500).json({ error: 'Error interno al obtener detalle de estados' })
  }
}

// =====================================================
// 👁️ Marcar notificación como leída (Apoderado)
// =====================================================
export async function marcarLeido(req, res) {
  try {
    const userId = req.user.sub
    const id = Number(req.params.id)

    await prisma.recepcion.updateMany({
      where: {
        notificacionId: id,
        apoderado: { usuarioId: userId },
        leidoAt: null,
        activo: true
      },
      data: { leidoAt: new Date() }
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('❌ marcarLeido error:', err)
    res.status(500).json({ error: 'Error interno al marcar como leído' })
  }
}

// =====================================================
// ✅ Marcar notificación como confirmada (Apoderado)
// =====================================================
export async function marcarConfirmado(req, res) {
  try {
    const userId = req.user.sub
    const id = Number(req.params.id)

    await prisma.recepcion.updateMany({
      where: {
        notificacionId: id,
        apoderado: { usuarioId: userId },
        confirmadoAt: null,
        activo: true
      },
      data: { confirmadoAt: new Date() }
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('❌ marcarConfirmado error:', err)
    res.status(500).json({ error: 'Error interno al confirmar lectura' })
  }
}
