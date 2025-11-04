// src/controllers/usuario.controller.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import bcrypt from 'bcryptjs'

export async function listarUsuarios(req, res) {
  const users = await prisma.usuario.findMany({ include: { rol: true } })
  res.json(users.map(u => ({
    id: u.id, nombre: u.nombre, email: u.email, rol: u.rol.nombre
  })))
}

export async function crearUsuario(req, res) {
  const { nombre, email, password, rol } = req.body
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'nombre, email, password y rol son requeridos' })
  }

  const rolDb = await prisma.rol.findFirst({ where: { nombre: rol } })
  if (!rolDb) return res.status(400).json({ error: 'Rol inválido' })

  const hash = await bcrypt.hash(password, 10)
  const u = await prisma.usuario.create({
    data: { nombre, email, password: hash, rolId: rolDb.id }
  })
  res.status(201).json({ id: u.id, nombre: u.nombre, email: u.email, rol })
}
