import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ==========================================================
// 📩 Obtener notificaciones activas del apoderado
// ==========================================================
export const obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.sub

    // Buscar apoderado vinculado al usuario
    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    if (!apoderado) {
      return res.status(404).json({ error: 'Apoderado no encontrado' })
    }

    // Solo notificaciones activas y recepciones activas
    const recepciones = await prisma.recepcion.findMany({
      where: {
        apoderadoId: apoderado.id,
        activo: true,
        notificacion: { activo: true } // ✅ no mostrar deshabilitadas
      },
      include: {
        notificacion: {
          include: { emisor: true }
        }
      },
      orderBy: { notificacionId: 'desc' }
    })

    const data = recepciones.map(r => ({
      id: r.notificacion.id,
      titulo: r.notificacion.titulo,
      mensaje: r.notificacion.mensaje,
      tipo: r.notificacion.tipo,
      emisor: r.notificacion.emisor.nombre,
      fecha: r.notificacion.createdAt,
      leido: r.leido,
      confirmado: r.confirmado
    }))

    res.json(data)
  } catch (error) {
    console.error('❌ Error al obtener notificaciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ==========================================================
// 👁️ Marcar todas las notificaciones activas como leídas
// ==========================================================
export const marcarTodasLeidas = async (req, res) => {
  try {
    const userId = req.user.sub
    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    if (!apoderado) {
      return res.status(404).json({ error: 'Apoderado no encontrado' })
    }

    await prisma.recepcion.updateMany({
      where: {
        apoderadoId: apoderado.id,
        leido: false,
        activo: true,                      // ✅ solo las activas
        notificacion: { activo: true }     // ✅ y notific. activas
      },
      data: { leido: true, leidoAt: new Date() }
    })

    res.json({ message: 'Todas las notificaciones activas marcadas como leídas.' })
  } catch (error) {
    console.error('❌ Error al marcar leídas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ==========================================================
// ✅ Confirmar asistencia a una notificación activa
// ==========================================================
export const confirmarAsistencia = async (req, res) => {
  try {
    const userId = req.user.sub
    const notificacionId = parseInt(req.params.id)

    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    if (!apoderado) {
      return res.status(404).json({ error: 'Apoderado no encontrado' })
    }

    await prisma.recepcion.updateMany({
      where: {
        apoderadoId: apoderado.id,
        notificacionId,
        activo: true,                      // ✅ solo si está activa
        notificacion: { activo: true }
      },
      data: {
        confirmado: true,
        confirmadoAt: new Date()
      }
    })

    res.json({ message: 'Asistencia confirmada correctamente.' })
  } catch (error) {
    console.error('❌ Error al confirmar asistencia:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
