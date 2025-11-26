import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

async function safeRequest(promise) {
  try {
    const response = await promise
    return { data: response.data, error: null }
  } catch (err) {
    console.error('Error en servicio:', err)
    return { data: null, error: err.response?.data?.error || 'Error de conexión' }
  }
}

export const apoderadoService = {
  // Obtener notificaciones
  obtenerNotificaciones: () => 
    safeRequest(axios.get(`${API}/api/apoderado/notificaciones`, { headers: authHeaders() })),

  // Marcar todo como leído
  marcarTodasLeidas: () => 
    safeRequest(axios.put(`${API}/api/apoderado/notificaciones/leidas`, {}, { headers: authHeaders() })),

  // Confirmar asistencia
  confirmarAsistencia: (id) => 
    safeRequest(axios.put(`${API}/api/apoderado/notificaciones/${id}/confirmar`, {}, { headers: authHeaders() })),

  // 👇 ESTA ES LA QUE FALTABA 👇
  obtenerPerfil: () => 
    safeRequest(axios.get(`${API}/api/apoderado/perfil`, { headers: authHeaders() }))
}