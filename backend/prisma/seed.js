import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { fakerES as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando generación de datos ficticios...')

  // ====================================
  // 1️⃣ CREAR ROLES
  // ====================================
  const [adminRol, profesorRol, apoderadoRol] = await Promise.all([
    prisma.rol.upsert({
      where: { nombre: 'Administrador' },
      update: {},
      create: { nombre: 'Administrador' }
    }),
    prisma.rol.upsert({
      where: { nombre: 'Profesor' },
      update: {},
      create: { nombre: 'Profesor' }
    }),
    prisma.rol.upsert({
      where: { nombre: 'Apoderado' },
      update: {},
      create: { nombre: 'Apoderado' }
    })
  ])
  console.log('✅ Roles creados.')

  // ====================================
  // 2️⃣ CREAR USUARIOS
  // ====================================
  const passwordHash = await bcrypt.hash('123456', 10)

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@colegioarica.cl' },
    update: {},
    create: {
      nombre: 'Administrador General',
      email: 'admin@colegioarica.cl',
      passwordHash,
      rolId: adminRol.id
    }
  })

  const profesores = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.usuario.create({
        data: {
          nombre: faker.person.fullName(),
          email: `profesor${i + 1}@colegioarica.cl`,
          passwordHash,
          rolId: profesorRol.id
        }
      })
    )
  )
  console.log(`👩‍🏫 Profesores creados (${profesores.length}).`)

  // ====================================
  // 3️⃣ CREAR CURSOS
  // ====================================
  const niveles = [
    '1° Básico', '2° Básico', '3° Básico', '4° Básico',
    '5° Básico', '6° Básico', '7° Básico', '8° Básico',
    '1° Medio', '2° Medio', '3° Medio', '4° Medio'
  ]
  const secciones = ['A', 'B']
  const cursos = []

  for (const nivel of niveles) {
    for (const seccion of secciones) {
      const curso = await prisma.curso.create({
        data: {
          nombre: `${nivel} ${seccion}`,
          nivel
        }
      })
      cursos.push(curso)
    }
  }
  console.log(`🏫 Cursos creados (${cursos.length}).`)

  // ====================================
  // 4️⃣ ASIGNAR PROFESORES A CURSOS
  // ====================================
  let i = 0
  for (const curso of cursos) {
    await prisma.profesorCurso.create({
      data: {
        profesorId: profesores[i % profesores.length].id,
        cursoId: curso.id
      }
    })
    i++
  }
  console.log('📘 Profesores asignados a cursos.')

  // ====================================
  // 5️⃣ CREAR APODERADOS Y ALUMNOS
  // ====================================
  const apoderados = []
  for (let i = 0; i < 200; i++) {
    const user = await prisma.usuario.create({
      data: {
        nombre: faker.person.fullName(),
        email: `apoderado${i + 1}@colegioarica.cl`,
        passwordHash,
        rolId: apoderadoRol.id
      }
    })

    const apoderado = await prisma.apoderado.create({
      data: {
        usuarioId: user.id,
        nombre: user.nombre,
        rut: faker.string.alphanumeric(8).toUpperCase(),
        telefono: faker.phone.number('+56 9 #### ####'),
        email: user.email
      }
    })

    apoderados.push(apoderado)
  }
  console.log(`👨‍👩‍👧‍👦 Apoderados creados (${apoderados.length}).`)

  for (const curso of cursos) {
    const alumnosPorCurso = faker.number.int({ min: 25, max: 35 })
    const alumnos = Array.from({ length: alumnosPorCurso }).map(() => ({
      nombre: faker.person.fullName(),
      cursoId: curso.id,
      apoderadoId: faker.helpers.arrayElement(apoderados).id
    }))

    await prisma.alumno.createMany({ data: alumnos, skipDuplicates: true })
  }
  console.log('🧒 Alumnos creados y asignados a cursos.')

  // ====================================
  // 6️⃣ GENERAR NOTIFICACIONES MASIVAS POR PROFESOR
  // ====================================
  const tipos = ['REUNION', 'AVISO', 'ANOTACION', 'FELICITACION']

  for (const profesor of profesores) {
    const cursosDelProfesor = await prisma.profesorCurso.findMany({
      where: { profesorId: profesor.id },
      include: { curso: true }
    })

    const cantidad = faker.number.int({ min: 5, max: 10 })
    for (let n = 0; n < cantidad; n++) {
      const curso = faker.helpers.arrayElement(cursosDelProfesor)?.curso
      if (!curso) continue

      const tipo = faker.helpers.arrayElement(tipos)

      const notificacion = await prisma.notificacion.create({
        data: {
          titulo:
            tipo === 'REUNION'
              ? 'Reunión de Apoderados'
              : tipo === 'AVISO'
              ? 'Aviso importante'
              : tipo === 'ANOTACION'
              ? 'Observación de comportamiento'
              : 'Felicitación especial',
          mensaje:
            tipo === 'REUNION'
              ? 'Se cita a reunión el próximo martes a las 18:00 hrs.'
              : tipo === 'AVISO'
              ? 'Se recuerda el inicio de evaluaciones la próxima semana.'
              : tipo === 'ANOTACION'
              ? 'Se informa una observación de conducta.'
              : 'Felicitamos al curso por su participación destacada.',
          tipo,
          emisorId: profesor.id,
          programadaPara: faker.date.soon({ days: 15 })
        }
      })

      const alumnos = await prisma.alumno.findMany({
        where: { cursoId: curso.id },
        include: { apoderado: true }
      })

      const recepciones = alumnos.map(a => ({
        notificacionId: notificacion.id,
        apoderadoId: a.apoderado.id,
        leido: faker.datatype.boolean({ probability: 0.7 }),
        confirmado: faker.datatype.boolean({ probability: 0.5 }),
        leidoAt: faker.date.recent({ days: 15 }),
        confirmadoAt: faker.date.recent({ days: 10 })
      }))

      // Evita errores de clave única
      const datosUnicos = [
        ...new Map(recepciones.map(r => [`${r.notificacionId}-${r.apoderadoId}`, r])).values()
      ]

      await prisma.recepcion.createMany({
        data: datosUnicos,
        skipDuplicates: true
      })
    }
  }

  console.log('📢 Notificaciones generadas correctamente.')
  console.log('✅ Seed completado con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('✅ Conexión cerrada.')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
