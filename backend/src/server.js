// ==========================================
// 🌐 Servidor Principal - EduCom Backend
// ==========================================
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Inicializar variables de entorno
dotenv.config()

// Crear servidor Express
const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// Resolver rutas absolutas (necesario para ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ==========================================
// 📌 Importar rutas
// ==========================================
import authRoutes from './routes/auth.routes.js'
import profesorRoutes from './routes/profesor.routes.js'
import apoderadoRoutes from './routes/apoderado.routes.js'
import tiRoutes from './routes/ti.routes.js'
import directorRoutes from "./routes/director.routes.js"
// ==========================================
// 🛣️ Montar rutas
// ==========================================
app.use('/api/auth', authRoutes)
app.use('/api/profesores', profesorRoutes)
app.use('/api/apoderado', apoderadoRoutes)
app.use('/api/ti', tiRoutes)
app.use("/api/director", directorRoutes)

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'EduCom Backend funcionando correctamente 🚀'
  })
})

// ==========================================
// 🔥 Iniciar servidor
// ==========================================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor EduCom corriendo en http://localhost:${PORT}`)
})

export default app
