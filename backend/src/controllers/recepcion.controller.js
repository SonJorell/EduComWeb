// src/controllers/recepcion.controller.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 📩 Obtener notificaciones recibidas por el apoderado autenticado
export async function obtenerNotificacionesRecibidas(req, res) {
  try {
    const destinatarioId = req.user.sub // viene del JWT (id del usuario logueado)

    const recepciones = await prisma.recepcion.findMany({
      where: { destinatarioId },
      include: {
        notificacion: {
          include: {
            emisor: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    })

    // Formateamos el resultado para hacerlo más legible
    const resultado = recepciones.map(r => ({
      id: r.id,
      titulo: r.notificacion.titulo,
      mensaje: r.notificacion.mensaje,
      emisor: r.notificacion.emisor.nombre,
      emisorEmail: r.notificacion.emisor.email,
      fecha: r.notificacion.createdAt,
      leida: r.leida,
    }))

    res.json(resultado)
  } catch (error) {
    console.error('Error al obtener notificaciones recibidas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// 🟢 Marcar una notificación como leída
export async function marcarNotificacionLeida(req, res) {
  try {
    const { id } = req.params
    const destinatarioId = req.user.sub

    const recepcion = await prisma.recepcion.updateMany({
      where: { id: Number(id), destinatarioId },
      data: { leida: true },
    })

    if (recepcion.count === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada o no pertenece a este usuario' })
    }

    res.json({ message: '✅ Notificación marcada como leída' })
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
