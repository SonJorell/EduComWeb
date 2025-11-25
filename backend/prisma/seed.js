// prisma/seed.js
import { PrismaClient, TipoNotificacion } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TOTAL_ALUMNOS = 800
const BCRYPT_ROUNDS = 10

// =======================================================
// 🔧 Helpers
// =======================================================
function randomRut() {
  return `${Math.floor(10000000 + Math.random() * 89999999)}-${Math.floor(Math.random() * 9)}`
}

function randomPhone() {
  return `+56 9 ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`
}

function randomName() {
  const nombres = ['Juan', 'María', 'Pedro', 'Lucía', 'Javier', 'Sofía', 'Diego', 'Camila', 'Andrés', 'Valentina']
  const apellidos = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Araya', 'Torres', 'Castillo', 'Vera', 'Pérez', 'Fuentes']

  const n = nombres[Math.floor(Math.random() * nombres.length)]
  const a1 = apellidos[Math.floor(Math.random() * apellidos.length)]
  const a2 = apellidos[Math.floor(Math.random() * apellidos.length)]
  return `${n} ${a1} ${a2}`
}

function slugEmail(nombre) {
  return nombre.toLowerCase().replace(/\s+/g, '.')
}

// Garantiza que los correos NO se dupliquen
async function uniqueEmail(base) {
  let counter = 0
  let email = `${base}@colegioarica.cl`

  while (await prisma.usuario.findUnique({ where: { email } })) {
    counter++
    email = `${base}.${counter}@colegioarica.cl`
  }

  return email
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDateWithin(days = 60) {
  const now = new Date()
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
}

// =======================================================
// CURSOS
// =======================================================
const cursosList = [
  ...Array.from({ length: 8 }, (_, i) => [`${i + 1}° Básico A`, `${i + 1}° Básico B`]).flat(),
  ...Array.from({ length: 4 }, (_, i) => [`${i + 1}° Medio A`, `${i + 1}° Medio B`]).flat()
]

// =======================================================
// 🚀 MAIN
// =======================================================
async function main() {
  console.log('🧹 Limpiando base de datos...')

  await prisma.auditLog.deleteMany()
  await prisma.recepcion.deleteMany()
  await prisma.notificacion.deleteMany()
  await prisma.profesorCurso.deleteMany()
  await prisma.alumno.deleteMany()
  await prisma.apoderado.deleteMany()
  await prisma.curso.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.rol.deleteMany()

  console.log('📌 Creando roles...')
  const [rolAdmin, rolDirector, rolProfesor, rolApoderado] = await Promise.all([
    prisma.rol.create({ data: { nombre: 'ADMIN' } }),
    prisma.rol.create({ data: { nombre: 'DIRECTOR' } }),
    prisma.rol.create({ data: { nombre: 'PROFESOR' } }),
    prisma.rol.create({ data: { nombre: 'APODERADO' } })
  ])

  console.log('👤 Creando usuarios clave...')
  await prisma.usuario.create({
    data: {
      nombre: 'Administrador TI',
      email: 'admin.ti@colegioarica.cl',
      passwordHash: await bcrypt.hash('admin123', BCRYPT_ROUNDS),
      rolId: rolAdmin.id
    }
  })

  await prisma.usuario.create({
    data: {
      nombre: 'Director General',
      email: 'director@colegioarica.cl',
      passwordHash: await bcrypt.hash('director123', BCRYPT_ROUNDS),
      rolId: rolDirector.id
    }
  })

  console.log('🏫 Creando cursos...')
  const cursos = await Promise.all(
    cursosList.map(nombre =>
      prisma.curso.create({
        data: {
          nombre,
          nivel: nombre.split(' ')[0],
          jornada: 'Mañana',
          anio: 2024
        }
      })
    )
  )

  console.log('👨‍🏫 Creando profesores...')
  const profesores = []

  for (const curso of cursos) {
    const nombre = randomName()
    const emailBase = slugEmail(nombre)
    const email = await uniqueEmail(emailBase)

    const profesor = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash: await bcrypt.hash('profesor123', BCRYPT_ROUNDS),
        rolId: rolProfesor.id
      }
    })

    profesores.push(profesor)

    await prisma.profesorCurso.create({
      data: {
        profesorId: profesor.id,
        cursoId: curso.id,
        rolInterno: 'JEFE'
      }
    })
  }

  console.log('👨‍👩‍👧 Creando alumnos y apoderados...')
  const alumnosPerCurso = Math.floor(TOTAL_ALUMNOS / cursos.length)
  let total = 0
  const apoderadosPool = []

  for (const curso of cursos) {
    for (let i = 0; i < alumnosPerCurso; i++) {
      if (total >= TOTAL_ALUMNOS) break

      const alumnoName = randomName()

      let apoderado
      if (apoderadosPool.length > 0 && Math.random() < 0.2) {
        apoderado = randomFromArray(apoderadosPool)
      } else {
        const apName = randomName()
        const emailBase = slugEmail(apName)
        const email = await uniqueEmail(emailBase)

        const usuarioAp = await prisma.usuario.create({
          data: {
            nombre: apName,
            email,
            passwordHash: await bcrypt.hash('apoderado123', BCRYPT_ROUNDS),
            rolId: rolApoderado.id
          }
        })

        apoderado = await prisma.apoderado.create({
          data: {
            usuarioId: usuarioAp.id,
            nombre: apName,
            rut: randomRut(),
            telefono: randomPhone(),
            email
          }
        })

        apoderadosPool.push(apoderado)
      }

      await prisma.alumno.create({
        data: {
          nombre: alumnoName,
          cursoId: curso.id,
          apoderadoId: apoderado.id
        }
      })

      total++
    }
  }

  console.log(`✔ ${total} alumnos creados.`)

  console.log('📨 Generando notificaciones...')

  const tipos = Object.values(TipoNotificacion)

  for (const prof of profesores) {
    const cursosProf = await prisma.profesorCurso.findMany({
      where: { profesorId: prof.id }
    })

    const cursoIds = cursosProf.map(c => c.cursoId)
    if (!cursoIds.length) continue

    const count = 2 + Math.floor(Math.random() * 2)

    for (let i = 0; i < count; i++) {
      const cursoDestinoId = randomFromArray(cursoIds)
      const curso = cursos.find(c => c.id === cursoDestinoId)

      const createdAt = randomDateWithin(45)

      const notif = await prisma.notificacion.create({
        data: {
          titulo: `Comunicado ${i + 1} - ${curso.nombre}`,
          mensaje: `Estimados apoderados del curso ${curso.nombre}, este es un comunicado informativo.`,
          tipo: randomFromArray(tipos),
          prioridad: Math.random() < 0.25 ? 'ALTA' : 'NORMAL',
          emisorId: prof.id,
          createdAt,
          cursosDestino: [cursoDestinoId],
          activo: true
        }
      })

      const alumnosCurso = await prisma.alumno.findMany({
        where: { cursoId: cursoDestinoId },
        include: { apoderado: true }
      })

      const apods = [...new Map(alumnosCurso.map(a => [a.apoderado.id, a.apoderado])).values()]

      const recepciones = apods.map(ap => ({
        notificacionId: notif.id,
        apoderadoId: ap.id,
        leido: Math.random() < 0.7,
        confirmado: Math.random() < 0.5,
        leidoAt: randomDateWithin(20),
        confirmadoAt: randomDateWithin(10),
        activo: true
      }))

      await prisma.recepcion.createMany({ data: recepciones })
    }
  }

  console.log('✨ Seed completado con éxito.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
