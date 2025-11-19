// Estado de Base de Datos
export const obtenerEstadoBD = async (req, res) => {
  try {
    res.json({
      conectado: true,
      motor: "MySQL/MariaDB",
      host: process.env.DATABASE_URL
    })
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado de BD" })
  }
}

// Logs del sistema (fake)
export const obtenerLogsSistema = (req, res) => {
  res.json([
    "Servidor iniciado correctamente",
    "Prisma conectado",
    "Backend escuchando en puerto 3000"
  ])
}
