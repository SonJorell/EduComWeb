import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// =====================================================
// 🛠️ FUNCIÓN AYUDA: Limpiar IDs de cursos (Fix "set")
// =====================================================
function extraerIdsCursos(data) {
  let ids = [];
  if (!data) return [];
  if (typeof data === 'object' && !Array.isArray(data) && data.set) {
    data = data.set;
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.set) {
        data = parsed.set;
      } else {
        data = parsed;
      }
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(data)) {
    ids = data.map(id => Number(id)).filter(n => !isNaN(n));
  }
  return ids;
}

// =====================================================
// 📚 Obtener cursos asignados al profesor
// =====================================================
export async function cursosProfesor(req, res) {
  try {
    const profesorId = Number(req.user.sub);
    const asignaciones = await prisma.profesorCurso.findMany({
      where: { profesorId },
      include: { curso: true }
    });

    if (!asignaciones.length) {
      return res.status(404).json({ message: 'No se encontraron cursos asignados.' });
    }
    res.json(asignaciones.map(pc => pc.curso));
  } catch (err) {
    console.error('cursosProfesor error:', err);
    res.status(500).json({ error: 'Error interno al obtener cursos.' });
  }
}

// =====================================================
// 📊 Resumen general del dashboard del profesor
// =====================================================
export async function resumenProfesor(req, res) {
  try {
    const profesorId = Number(req.user.sub);
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
// 📨 Listar notificaciones enviadas (MODIFICADO)
// =====================================================
export async function notificacionesProfesor(req, res) {
  try {
    const profesorId = Number(req.user.sub);

    const notificaciones = await prisma.notificacion.findMany({
      where: { emisorId: profesorId, activo: true },
      orderBy: { createdAt: 'desc' },
      // 🔥 IMPORTANTE: Incluir apoderado para sacar el nombre
      include: { 
        recepciones: { 
          include: { apoderado: { select: { nombre: true } } } 
        } 
      }
    })

    const result = []
    for (const n of notificaciones) {
      const total = n.recepciones.length || 1
      const leidos = n.recepciones.filter(r => r.leido).length
      const confirmados = n.recepciones.filter(r => r.confirmado).length

      const idsCursos = extraerIdsCursos(n.cursosDestino);
      let destinatariosInfo = [];

      // LÓGICA DE VISUALIZACIÓN
      if (idsCursos.length > 0) {
        // Opción A: Es para Cursos
        const cursos = await prisma.curso.findMany({
          where: { id: { in: idsCursos } },
          select: { nombre: true }
        })
        destinatariosInfo = cursos.map(c => c.nombre)
      } else {
        // Opción B: Es para Apoderados individuales
        const nombresApoderados = n.recepciones.map(r => r.apoderado.nombre);
        
        if (nombresApoderados.length > 0) {
          // Si son pocos (ej. menos de 3), los mostramos todos
          if (nombresApoderados.length <= 3) {
            destinatariosInfo = nombresApoderados.map(nombre => `Apoderado: ${nombre}`);
          } else {
            // Si son muchos, mostramos resumen
            destinatariosInfo = [`${nombresApoderados.length} Apoderados`];
          }
        } else {
          destinatariosInfo = ['Sin destinatarios'];
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
        cursos: destinatariosInfo // Ahora devuelve cursos O nombres de apoderados
      })
    }

    res.json(result)
  } catch (err) {
    console.error('notificacionesProfesor error:', err)
    res.status(500).json({ error: 'Error interno al obtener notificaciones.' })
  }
}

// =====================================================
// 👨‍👩‍👧 Obtener apoderados vinculados
// =====================================================
export async function apoderadosProfesor(req, res) {
  try {
    const profesorId = Number(req.user.sub);
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
// ✉️ Enviar nueva notificación
// =====================================================
export async function enviarNotificacion(req, res) {
  try {
    const { titulo, mensaje, tipo, cursoIds = [], apoderadoIds = [] } = req.body;
    const profesorId = Number(req.user.sub);

    if (!mensaje || (!cursoIds.length && !apoderadoIds.length)) {
      return res.status(400).json({ error: 'Debe especificar un mensaje y al menos un destinatario.' });
    }

    const cursosLimpios = cursoIds.map(id => Number(id));

    const notificacion = await prisma.notificacion.create({
      data: {
        titulo: titulo || '(Sin título)',
        mensaje,
        tipo,
        activo: true,
        emisor: { connect: { id: profesorId } },
        cursosDestino: cursosLimpios 
      }
    });

    let apoderadosDestino = [];
    if (cursosLimpios.length > 0) {
      const alumnos = await prisma.alumno.findMany({
        where: { cursoId: { in: cursosLimpios } },
        include: { apoderado: true }
      });
      apoderadosDestino = alumnos.map(a => a.apoderado);
    }
    if (apoderadoIds.length > 0) {
      const apoderadosManuales = await prisma.apoderado.findMany({
        where: { id: { in: apoderadoIds.map(Number) } }
      });
      apoderadosDestino = [...apoderadosDestino, ...apoderadosManuales];
    }

    const apoderadoIdsUnicos = [...new Set(apoderadosDestino.map(a => a.id))];

    if (apoderadoIdsUnicos.length > 0) {
      await prisma.recepcion.createMany({
        data: apoderadoIdsUnicos.map(id => ({
          notificacionId: notificacion.id,
          apoderadoId: id
        }))
      });
    }

    res.status(201).json({
      message: 'Notificación enviada correctamente.',
      notificacionId: notificacion.id,
      destinatarios: apoderadoIdsUnicos.length
    });

  } catch (err) {
    console.error('enviarNotificacion error:', err);
    res.status(500).json({ error: 'Error interno al enviar notificación.' });
  }
}

// =====================================================
// 🧾 Detalle completo de una notificación
// =====================================================
export async function detalleNotificacion(req, res) {
  try {
    const profesorId = Number(req.user.sub);
    const notificacionId = Number(req.params.id);

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

    if (!notificacion || !notificacion.activo) return res.status(404).json({ error: 'Notificación no encontrada.' })
    if (notificacion.emisorId !== profesorId) return res.status(403).json({ error: 'No autorizado.' })

    const idsCursos = extraerIdsCursos(notificacion.cursosDestino);
    const cursos = await prisma.curso.findMany({
      where: { id: { in: idsCursos } },
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
    res.status(500).json({ error: 'Error interno al obtener detalle.' })
  }
}

// =====================================================
// 🕓 Comunicados recientes (MODIFICADO)
// =====================================================
export async function comunicadosRecientes(req, res) {
  try {
    const profesorId = Number(req.user.sub);

    const recientes = await prisma.notificacion.findMany({
      where: { emisorId: profesorId, activo: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      // 🔥 IMPORTANTE: Incluir el nombre del apoderado
      include: { 
        recepciones: { 
          select: { 
            leido: true, 
            confirmado: true,
            apoderado: { select: { nombre: true } } // <--- ESTO ES NUEVO
          } 
        } 
      }
    })

    const data = []
    
    for (const n of recientes) {
      const total = n.recepciones.length || 1
      const leidos = n.recepciones.filter(r => r.leido).length
      const confirmados = n.recepciones.filter(r => r.confirmado).length

      const idsCursos = extraerIdsCursos(n.cursosDestino);
      let destinatariosInfo = [];

      // ================================================
      // 🧠 LÓGICA INTELIGENTE DE NOMBRES
      // ================================================
      if (idsCursos.length > 0) {
        // CASO 1: Notificación a cursos completos
        try {
          const cursosData = await prisma.curso.findMany({
            where: { id: { in: idsCursos } },
            select: { nombre: true }
          })
          destinatariosInfo = cursosData.map(c => c.nombre)
        } catch (err) {
          destinatariosInfo = ['Error datos']
        }
      } else {
        // CASO 2: Notificación a apoderados individuales
        const nombres = n.recepciones.map(r => r.apoderado.nombre);

        if (nombres.length === 1) {
            // Solo uno: "Apoderado: Juan Perez"
            destinatariosInfo = [`Apoderado: ${nombres[0]}`];
        } else if (nombres.length > 1) {
            // Varios: "Apoderado: Juan Perez y 2 más" o listarlos todos si prefieres
            // Para que se vea bien en tu frontend (que muestra lista vertical):
            destinatariosInfo = nombres.map(nombre => `Apoderado: ${nombre}`);
        } else {
            destinatariosInfo = ['Notificación Personal'];
        }
      }
      // ================================================

      data.push({
        id: n.id,
        titulo: n.titulo || '(Sin título)',
        tipo: n.tipo || 'General',
        fecha: n.createdAt.toISOString(),
        porcentajeLeido: Math.round((leidos / total) * 100),
        porcentajeConfirmado: Math.round((confirmados / total) * 100),
        cursos: destinatariosInfo // El frontend renderizará esto como lista
      })
    }

    res.json(data)
  } catch (err) {
    console.error('comunicadosRecientes error:', err)
    res.status(500).json({ error: 'Error al obtener comunicados recientes.' })
  }
}

// ==========================
// 🧩 Deshabilitar Comunicado
// ==========================
export const deshabilitarComunicado = async (req, res) => {
  try {
    const { id } = req.params
    const profesorId = Number(req.user.sub);

    const comunicado = await prisma.notificacion.findUnique({ where: { id: Number(id) } })

    if (!comunicado) return res.status(404).json({ message: 'Comunicado no encontrado' })
    if (comunicado.emisorId !== profesorId) return res.status(403).json({ message: 'No autorizado' })

    await prisma.notificacion.update({ where: { id: Number(id) }, data: { activo: false } })
    await prisma.recepcion.updateMany({ where: { notificacionId: Number(id) }, data: { activo: false } })

    res.json({ ok: true, message: 'Comunicado deshabilitado' })
  } catch (error) {
    console.error('Error al deshabilitar:', error)
    res.status(500).json({ message: 'Error interno.' })
  }
}