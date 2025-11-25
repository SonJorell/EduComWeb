// backend/src/routes/director.routes.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

const prisma = new PrismaClient()
const router = express.Router()

// Helper para porcentaje seguro
const pct = (num, den) => {
  if (!den || den === 0) return 0
  return Math.round((num / den) * 100)
}

// Helper semanas (últimas 5)
function buildWeekBuckets () {
  const now = new Date()
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const buckets = []

  for (let i = 4; i >= 0; i--) {
    const end = new Date(now.getTime() - i * 7 * MS_PER_DAY)
    const start = new Date(end.getTime() - 7 * MS_PER_DAY)
    buckets.push({ start, end })
  }

  return buckets
}

// =====================================
// 📌 1. Estadísticas generales (global)
// =====================================
router.get(
  '/estadisticas',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const totalProfesores = await prisma.usuario.count({
        where: { rol: { nombre: 'Profesor' } }
      })

      const profesoresActivos = await prisma.notificacion.groupBy({
        by: ['emisorId'],
        where: {
          emisor: {
            rol: {
              nombre: 'Profesor'
            }
          }
        }
      })

      const usoProfesores = pct(profesoresActivos.length, totalProfesores)

      const totalApoderados = await prisma.apoderado.count()

      const apoderadosLectores = await prisma.recepcion.findMany({
        where: { leido: true },
        distinct: ['apoderadoId'],
        select: { apoderadoId: true }
      })

      const participacionApoderados = pct(
        apoderadosLectores.length,
        totalApoderados
      )

      const totalRecepciones = await prisma.recepcion.count()
      const totalConfirmaciones = await prisma.recepcion.count({
        where: { confirmado: true }
      })

      const asistencia = pct(totalConfirmaciones, totalRecepciones)

      const [notifsSemana, profActivosSemana, apodLectoresSemana] =
        await Promise.all([
          prisma.notificacion.count({
            where: {
              createdAt: { gte: weekAgo }
            }
          }),
          prisma.notificacion.findMany({
            where: {
              createdAt: { gte: weekAgo },
              emisor: { rol: { nombre: 'Profesor' } }
            },
            distinct: ['emisorId'],
            select: { emisorId: true }
          }),
          prisma.recepcion.findMany({
            where: {
              leido: true,
              leidoAt: { gte: weekAgo }
            },
            distinct: ['apoderadoId'],
            select: { apoderadoId: true }
          })
        ])

      return res.json({
        usoProfesores,
        participacionApoderados,
        asistencia,
        totalNotificacionesSemana: notifsSemana,
        totalProfesoresActivosSemana: profActivosSemana.length,
        totalApoderadosLectoresSemana: apodLectoresSemana.length
      })
    } catch (error) {
      console.error('❌ Error en /api/director/estadisticas:', error)
      res.status(500).json({ error: 'Error al obtener estadísticas' })
    }
  }
)

// =====================================
// 📌 2. Historial de uso (últimas 5 semanas)
// =====================================
router.get(
  '/historial',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const buckets = buildWeekBuckets()
      const labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']

      const [totalProfesores, totalApoderados] = await Promise.all([
        prisma.usuario.count({ where: { rol: { nombre: 'Profesor' } } }),
        prisma.apoderado.count()
      ])

      const desde = buckets[0].start
      const notificaciones = await prisma.notificacion.findMany({
        where: {
          createdAt: { gte: desde },
          emisor: { rol: { nombre: 'Profesor' } }
        },
        select: { createdAt: true, emisorId: true }
      })

      const recepciones = await prisma.recepcion.findMany({
        where: {
          leido: true,
          leidoAt: { gte: desde }
        },
        select: { apoderadoId: true, leidoAt: true }
      })

      const now = new Date()
      const MS_PER_DAY = 1000 * 60 * 60 * 24

      const setsProfesores = [new Set(), new Set(), new Set(), new Set(), new Set()]
      const setsApoderados = [new Set(), new Set(), new Set(), new Set(), new Set()]

      for (const notif of notificaciones) {
        const diffDays = Math.floor((now - notif.createdAt) / MS_PER_DAY)
        const idx = Math.floor(diffDays / 7)
        if (idx >= 0 && idx < 5) {
          const bucketIndex = 4 - idx
          setsProfesores[bucketIndex].add(notif.emisorId)
        }
      }

      for (const rec of recepciones) {
        const diffDays = Math.floor((now - rec.leidoAt) / MS_PER_DAY)
        const idx = Math.floor(diffDays / 7)
        if (idx >= 0 && idx < 5) {
          const bucketIndex = 4 - idx
          setsApoderados[bucketIndex].add(rec.apoderadoId)
        }
      }

      const profesores = setsProfesores.map(
        s => pct(s.size, totalProfesores)
      )
      const apoderados = setsApoderados.map(
        s => pct(s.size, totalApoderados)
      )

      return res.json({
        profesores,
        apoderados,
        labels
      })
    } catch (error) {
      console.error('❌ Error en /api/director/historial:', error)
      res.status(500).json({ error: 'Error al obtener historial' })
    }
  }
)

// =====================================
// 📌 3. Lista de cursos
// =====================================
router.get(
  '/cursos',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const cursos = await prisma.curso.findMany({
        orderBy: { nombre: 'asc' }
      })

      const cursosLimpios = cursos.map(c => ({
        id: Number(c.id),
        nombre: c.nombre,
        nivel: c.nivel,
        jornada: c.jornada,
        anio: c.anio ?? null
      }))

      res.json(cursosLimpios)
    } catch (error) {
      console.error('❌ Error en /api/director/cursos:', error)
      res.status(500).json({ error: 'Error al obtener cursos' })
    }
  }
)

// =====================================
// 📌 4. Detalle de curso (CursoDetailCard)
// =====================================
router.get(
  '/curso/:id',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const cursoId = Number(req.params.id)

      const curso = await prisma.curso.findUnique({
        where: { id: cursoId }
      })

      if (!curso) {
        return res.status(404).json({ error: 'Curso no encontrado' })
      }

      const totalAlumnos = await prisma.alumno.count({
        where: { cursoId }
      })

      const apoderadosCurso = await prisma.apoderado.findMany({
        where: {
          alumnos: {
            some: { cursoId }
          }
        },
        select: { id: true }
      })

      const apoderadoIds = apoderadosCurso.map(a => a.id)
      const totalApoderadosCurso = apoderadoIds.length

      let participacionCurso = 0
      let asistenciaCurso = 0

      if (apoderadoIds.length > 0) {
        const apoderadosLectores = await prisma.recepcion.findMany({
          where: {
            apoderadoId: { in: apoderadoIds },
            leido: true
          },
          distinct: ['apoderadoId'],
          select: { apoderadoId: true }
        })

        participacionCurso = pct(
          apoderadosLectores.length,
          totalApoderadosCurso
        )

        const totalRecepCurso = await prisma.recepcion.count({
          where: {
            apoderadoId: { in: apoderadoIds }
          }
        })

        const totalConfCurso = await prisma.recepcion.count({
          where: {
            apoderadoId: { in: apoderadoIds },
            confirmado: true
          }
        })

        asistenciaCurso = pct(totalConfCurso, totalRecepCurso)
      }

      const profesoresCurso = await prisma.profesorCurso.findMany({
        where: { cursoId },
        include: {
          profesor: true
        }
      })

      const profesoresNombres = profesoresCurso.map(pc => pc.profesor.nombre)

      return res.json({
        curso: curso.nombre,
        totalAlumnos: Number(totalAlumnos),
        participacionCurso: Number(participacionCurso),
        asistencia: Number(asistenciaCurso),
        profesores: profesoresNombres
      })
    } catch (error) {
      console.error('❌ Error en /api/director/curso/:id:', error)
      res.status(500).json({ error: 'Error al obtener detalle del curso' })
    }
  }
)

// =====================================
// 📌 5. Ranking de cursos con problemas
// =====================================
router.get(
  '/ranking',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const cursos = await prisma.curso.findMany({
        orderBy: { nombre: 'asc' }
      })

      const resultado = []

      for (const curso of cursos) {
        const cursoId = Number(curso.id)

        const profesoresCurso = await prisma.profesorCurso.findMany({
          where: { cursoId },
          select: { profesorId: true }
        })

        const profesorIds = profesoresCurso.map(p => p.profesorId)
        let usoProfesores = 0

        if (profesorIds.length > 0) {
          const profesoresActivos = await prisma.notificacion.groupBy({
            by: ['emisorId'],
            where: {
              emisorId: { in: profesorIds }
            }
          })

          usoProfesores = pct(
            profesoresActivos.length,
            profesorIds.length
          )
        }

        const apoderadosCurso = await prisma.apoderado.findMany({
          where: {
            alumnos: {
              some: { cursoId }
            }
          },
          select: { id: true }
        })

        const apoderadoIds = apoderadosCurso.map(a => a.id)
        const totalApoderadosCurso = apoderadoIds.length

        let participacionApoderados = 0
        let asistencia = 0

        if (apoderadoIds.length > 0) {
          const apoderadosLectores = await prisma.recepcion.findMany({
            where: {
              apoderadoId: { in: apoderadoIds },
              leido: true
            },
            distinct: ['apoderadoId'],
            select: { apoderadoId: true }
          })

          participacionApoderados = pct(
            apoderadosLectores.length,
            totalApoderadosCurso
          )

          const totalRecepCurso = await prisma.recepcion.count({
            where: {
              apoderadoId: { in: apoderadoIds }
            }
          })

          const totalConfCurso = await prisma.recepcion.count({
            where: {
              apoderadoId: { in: apoderadoIds },
              confirmado: true
            }
          })

          asistencia = pct(totalConfCurso, totalRecepCurso)
        }

        const score = (usoProfesores + participacionApoderados + asistencia) / 3

        resultado.push({
          id: Number(curso.id),
          nombre: curso.nombre,
          usoProfesores: isNaN(usoProfesores) ? 0 : usoProfesores,
          participacionApoderados: isNaN(participacionApoderados)
            ? 0
            : participacionApoderados,
          asistencia: isNaN(asistencia) ? 0 : asistencia,
          score
        })
      }

      resultado.sort((a, b) => a.score - b.score)

      res.json(resultado)
    } catch (error) {
      console.error('❌ Error en /api/director/ranking:', error)
      res.status(500).json({ error: 'Error al obtener ranking de cursos' })
    }
  }
)

// =====================================
// 📌 6. Tipos de notificación (para nuevo gráfico)
// =====================================
router.get(
  '/tipos-notificacion',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const grouped = await prisma.notificacion.groupBy({
        by: ['tipo'],
        _count: { _all: true }
      })

      const labels = []
      const counts = []

      for (const item of grouped) {
        labels.push(item.tipo || 'SIN_TIPO')
        counts.push(item._count._all ?? item._count)
      }

      res.json({ labels, counts })
    } catch (error) {
      console.error('❌ Error en /api/director/tipos-notificacion:', error)
      res.status(500).json({ error: 'Error al obtener tipos de notificación' })
    }
  }
)

// =====================================
// 📌 7. Mapa de calor por nivel
// =====================================
router.get(
  '/heatmap-niveles',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const cursos = await prisma.curso.findMany({
        include: {
          alumnos: {
            include: { apoderado: true }
          },
          profesorCursos: {
            include: { profesor: true }
          }
        }
      })

      const nivelesMap = {}

      for (const curso of cursos) {
        const nivel = curso.nivel

        if (!nivelesMap[nivel]) {
          nivelesMap[nivel] = {
            nivel,
            usoProfesores: [],
            participacionApoderados: [],
            asistencia: []
          }
        }

        const profesorIds = curso.profesorCursos.map(p => p.profesorId)

        const profesoresActivos = await prisma.notificacion.groupBy({
          by: ['emisorId'],
          where: {
            emisorId: { in: profesorIds }
          }
        })

        const usoProfesores = pct(
          profesoresActivos.length,
          profesorIds.length
        )

        const apoderadoIds = curso.alumnos.map(a => a.apoderadoId)
        const totalApoderados = apoderadoIds.length

        const apoderadosLectores = await prisma.recepcion.findMany({
          where: {
            apoderadoId: { in: apoderadoIds },
            leido: true
          },
          distinct: ['apoderadoId'],
          select: { apoderadoId: true }
        })

        const participacion = pct(
          apoderadosLectores.length,
          totalApoderados
        )

        const totalRecep = await prisma.recepcion.count({
          where: { apoderadoId: { in: apoderadoIds } }
        })

        const totalConf = await prisma.recepcion.count({
          where: {
            apoderadoId: { in: apoderadoIds },
            confirmado: true
          }
        })

        const asistencia = pct(totalConf, totalRecep)

        nivelesMap[nivel].usoProfesores.push(usoProfesores)
        nivelesMap[nivel].participacionApoderados.push(participacion)
        nivelesMap[nivel].asistencia.push(asistencia)
      }

      const resultado = Object.values(nivelesMap).map(n => {
        const avgUso = Math.round(n.usoProfesores.reduce((a, b) => a + b, 0) / n.usoProfesores.length)
        const avgPart = Math.round(n.participacionApoderados.reduce((a, b) => a + b, 0) / n.participacionApoderados.length)
        const avgAsis = Math.round(n.asistencia.reduce((a, b) => a + b, 0) / n.asistencia.length)

        return {
          nivel: n.nivel,
          usoProfesores: avgUso,
          participacionApoderados: avgPart,
          asistencia: avgAsis,
          score: (avgUso + avgPart + avgAsis) / 3
        }
      })

      res.json(resultado)
    } catch (error) {
      console.error('❌ Error en /api/director/heatmap-niveles:', error)
      res.status(500).json({ error: 'Error al generar mapa de calor' })
    }
  }
)

// =====================================
// 📌 7. Comparación entre dos cursos
// =====================================
router.get(
  '/comparacion',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const { cursoA, cursoB } = req.query

      if (!cursoA || !cursoB) {
        return res.status(400).json({ error: 'Debe enviar cursoA y cursoB' })
      }

      const ids = [Number(cursoA), Number(cursoB)]

      const cursos = await prisma.curso.findMany({
        where: { id: { in: ids } },
        include: {
          alumnos: {
            include: { apoderado: true }
          },
          profesorCursos: {
            include: { profesor: true }
          }
        }
      })

      if (cursos.length !== 2) {
        return res.status(404).json({ error: 'Uno o ambos cursos no existen' })
      }

      const buildCursoData = async (curso) => {

        const profesorIds = curso.profesorCursos.map(p => p.profesorId)

        let usoProfesores = 0
        if (profesorIds.length > 0) {
          const activos = await prisma.notificacion.groupBy({
            by: ['emisorId'],
            where: { emisorId: { in: profesorIds } }
          })
          usoProfesores = pct(activos.length, profesorIds.length)
        }

        const apoderadoIds = curso.alumnos.map(a => a.apoderadoId)
        const totalApoderados = apoderadoIds.length

        let participacion = 0
        let asistencia = 0

        if (apoderadoIds.length > 0) {
          const lectores = await prisma.recepcion.findMany({
            where: {
              apoderadoId: { in: apoderadoIds },
              leido: true
            },
            distinct: ['apoderadoId']
          })

          participacion = pct(lectores.length, totalApoderados)

          const totalRecep = await prisma.recepcion.count({
            where: { apoderadoId: { in: apoderadoIds } }
          })

          const totalConf = await prisma.recepcion.count({
            where: {
              apoderadoId: { in: apoderadoIds },
              confirmado: true
            }
          })

          asistencia = pct(totalConf, totalRecep)
        }

        return {
          id: curso.id,
          nombre: curso.nombre,
          nivel: curso.nivel,
          totalAlumnos: curso.alumnos.length,
          usoProfesores,
          participacionApoderados: participacion,
          asistencia
        }
      }

      const cursoAData = await buildCursoData(cursos[0])
      const cursoBData = await buildCursoData(cursos[1])

      return res.json({
        cursoA: cursoAData,
        cursoB: cursoBData
      })

    } catch (error) {
      console.error('❌ Error en /api/director/comparacion:', error)
      res.status(500).json({ error: 'Error al comparar cursos' })
    }
  }
)

// =====================================
// 📌 8. Tabla alumnos/apoderados por curso
// =====================================
router.get(
  '/curso/:id/alumnos',
  requireAuth,
  requireRole('DIRECTOR'),
  async (req, res) => {
    try {
      const cursoId = Number(req.params.id)

      const alumnos = await prisma.alumno.findMany({
        where: { cursoId },
        include: {
          apoderado: true
        }
      })

      const apoderadoIds = alumnos.map(a => a.apoderadoId)

      const recepciones = await prisma.recepcion.findMany({
        where: {
          apoderadoId: { in: apoderadoIds }
        }
      })

      const rows = alumnos.map(alumno => {
        const recs = recepciones.filter(r => r.apoderadoId === alumno.apoderadoId)

        const total = recs.length
        const leidas = recs.filter(r => r.leido).length
        const confirmadas = recs.filter(r => r.confirmado).length

        let riesgo = "Bajo"

        const pctLectura = total > 0 ? Math.round((leidas / total) * 100) : 0

        if (pctLectura < 30) riesgo = "Alto"
        else if (pctLectura < 60) riesgo = "Medio"

        return {
          id: alumno.id,
          nombreAlumno: alumno.nombre,
          apoderado: alumno.apoderado?.nombre || "Sin apoderado",
          totalNotificaciones: total,
          leidas,
          confirmadas,
          riesgo
        }
      })

      res.json(rows)

    } catch (error) {
      console.error("❌ Error en /api/director/curso/:id/alumnos:", error)
      res.status(500).json({ error: "Error al obtener alumnos del curso" })
    }
  }
)

export default router
