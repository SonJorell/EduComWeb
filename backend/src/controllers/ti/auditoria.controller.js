let auditoria = [] // Temporal, puedes guardarlo en BD si quieres

// Registrar acción (puedes llamarlo desde cualquier parte)
export const registrarAccion = (usuarioId, descripcion) => {
  auditoria.push({
    usuarioId,
    descripcion,
    fecha: new Date()
  })
}

// Obtener auditoría
export const obtenerAuditoria = (req, res) => {
  res.json(auditoria)
}
