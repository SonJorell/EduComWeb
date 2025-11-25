import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

/**
 * 🔐 LOGIN DEPURADO
 */
export async function login(req, res) {
  try {
    console.log("------------------------------------------------")
    console.log("🔍 INTENTO DE LOGIN RECIBIDO")
    
    const { email, password } = req.body

    // 1. Validar que lleguen datos
    if (!email || !password) {
      console.log("❌ Faltan datos: email o password vacíos")
      return res.status(400).json({ error: 'Email y contraseña requeridos.' })
    }
    console.log(`📧 Email: ${email}`)

    // 2. Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    })

    // 3. Validar existencia
    if (!user) {
      console.log("❌ Usuario NO encontrado en la base de datos")
      return res.status(400).json({ error: 'Credenciales inválidas.' })
    }
    console.log(`✅ Usuario encontrado: ID ${user.id}`)

    // 4. Validar si tiene contraseña guardada
    if (!user.passwordHash) {
      console.log("❌ El usuario NO tiene contraseña configurada en la BD (campo vacío)")
      return res.status(400).json({ error: 'Usuario sin contraseña configurada.' })
    }

    // 5. Comparar contraseña (Bcrypt)
    const passwordValida = await bcrypt.compare(password, user.passwordHash)

    console.log(`🔑 Comparando passwords...`)
    console.log(`   - Input usuario: ${password}`)
    console.log(`   - Hash en BD:    ${user.passwordHash.substring(0, 15)}...`) // Solo mostramos el inicio por seguridad
    console.log(`   - ¿Coinciden?:   ${passwordValida ? 'SÍ' : 'NO'}`)

    if (!passwordValida) {
      return res.status(400).json({ error: 'Credenciales inválidas.' })
    }

    // 6. Verificar activo (Opcional, si usas el campo)
    if (user.estado === 'INACTIVO') {
       console.warn(`[AUTH] Usuario inactivo: ${email}`)
       return res.status(403).json({ error: 'Tu cuenta ha sido desactivada. Contacta al administrador.' })
    }

    // 7. Generar Token
    const payload = {
      sub: user.id,
      rol: user.rol?.nombre || 'Invitado',
      nombre: user.nombre,
      email: user.email
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'educom_super_secret_key',
      { expiresIn: '12h' }
    )

    console.log("🚀 Login exitoso. Token generado.")
    console.log("------------------------------------------------")

    return res.json({
      accessToken: token, // Para compatibilidad
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol?.nombre
      }
    })

  } catch (error) {
    console.error('🔥 ERROR CRÍTICO EN LOGIN:', error)
    res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

export async function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token faltante' })

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'educom_super_secret_key')

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.sub },
      include: { rol: true }
    })

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    return res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol?.nombre
      }
    })
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}