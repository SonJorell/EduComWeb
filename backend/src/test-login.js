import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const test = async () => {
  const user = await prisma.usuario.findUnique({
    where: { email: 'ti@colegioarica.cl' }
  })
  console.log('Usuario encontrado:', user)

  const ok = await bcrypt.compare('123456', user.password)
  console.log('Contraseña válida?', ok)
}

test()
