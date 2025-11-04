import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 📩 Obtener notificaciones del apoderado
export const obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.sub
    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    const recepciones = await prisma.recepcion.findMany({
      where: { apoderadoId: apoderado.id },
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
    console.error('Error al obtener notificaciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// 👁️ Marcar todas como leídas al entrar
export const marcarTodasLeidas = async (req, res) => {
  try {
    const userId = req.user.sub
    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    await prisma.recepcion.updateMany({
      where: { apoderadoId: apoderado.id, leido: false },
      data: { leido: true, leidoAt: new Date() }
    })

    res.json({ message: 'Todas las notificaciones marcadas como leídas.' })
  } catch (error) {
    console.error('Error al marcar leídas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ✅ Confirmar asistencia a notificación
export const confirmarAsistencia = async (req, res) => {
  try {
    const userId = req.user.sub
    const notificacionId = parseInt(req.params.id)

    const apoderado = await prisma.apoderado.findUnique({
      where: { usuarioId: userId }
    })

    await prisma.recepcion.updateMany({
      where: {
        apoderadoId: apoderado.id,
        notificacionId
      },
      data: {
        confirmado: true,
        confirmadoAt: new Date()
      }
    })

    res.json({ message: 'Asistencia confirmada correctamente.' })
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
