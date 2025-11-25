import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function registrarLog({
  usuarioId,
  accion,
  descripcion,
  entidad,
  entidadId,
  antes = null,
  despues = null,
  ip = null
}) {
  try {
    await prisma.auditLog.create({
      data: {
        usuarioId,
        accion,
        descripcion,
        entidad,
        entidadId,
        antes,
        despues,
        ip
      }
    })
  } catch (err) {
    console.error('Error registrando auditoría:', err)
  }
}
