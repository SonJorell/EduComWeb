// ==========================================
// 🌐 Servidor principal - EduCom API
// ==========================================

import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// ==========================================
// 🔹 Importación de Rutas
// ==========================================
import authRoutes from './routes/auth.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import notificacionRoutes from './routes/notificacion.routes.js'
import profesorRoutes from './routes/profesor.routes.js'
import apoderadoRoutes from './routes/apoderado.routes.js'

// ==========================================
// 🚀 Inicialización de Express
// ==========================================
const app = express()

// ==========================================
// 🔒 Middlewares globales
// ==========================================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json())

// ==========================================
// 🏠 Ruta base (verificación del servidor)
// ==========================================
app.get('/', (_, res) => {
  res.json({
    ok: true,
    name: 'EduCom API',
    version: '1.0.0',
    author: 'J2N Software',
    status: 'running'
  })
})

// ==========================================
// 📦 Rutas principales del sistema
// ==========================================
app.use('/auth', authRoutes)
app.use('/users', usuarioRoutes)
app.use('/notificaciones', notificacionRoutes)
app.use('/profesores', profesorRoutes)
app.use('/apoderado', apoderadoRoutes)

// ==========================================
// ⚠️ Manejo global de errores
// ==========================================
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err)
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// ==========================================
// 🟢 Inicio del servidor
// ==========================================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor EduCom corriendo en http://localhost:${PORT}`)
})
