import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

/**
 * 🔐 Controlador de inicio de sesión
 * Valida credenciales, genera token JWT y devuelve información del usuario.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // 🧩 Validación de entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos.' })
    }

    // 🔎 Buscar usuario por email (con su rol asociado)
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    })

    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas.' })
    }

    // 🔑 Verificar contraseña
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(400).json({ error: 'Credenciales inválidas.' })
    }

    // 🧾 Crear payload del JWT
    const payload = {
      sub: user.id,
      rol: user.rol.nombre, // 👈 ejemplo: "Profesor", "Administrador", "Apoderado"
      nombre: user.nombre,
      email: user.email
    }

    // 🔐 Generar token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '1d'
    })

    // ✅ Responder al frontend con datos coherentes
    return res.json({
      accessToken: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol.nombre
      }
    })
  } catch (error) {
    console.error('❌ Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

/**
 * 🧠 (Opcional) Ruta de verificación del token
 * Permite validar si un usuario sigue autenticado sin volver a loguearse.
 */
export async function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado.' })

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar usuario actual
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.sub },
      include: { rol: true }
    })

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' })

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol.nombre
      }
    })
  } catch (error) {
    console.error('Error en verifyToken:', error)
    res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}
