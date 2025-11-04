// src/services/profesorService.js
import axios from 'axios'

// Base URL de la API (usa la variable de entorno o fallback local)
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 🧠 Helper para agregar el token JWT a las cabeceras
function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const profesorService = {
  // ✅ Obtener resumen general del dashboard
  obtenerResumen: () =>
    axios.get(`${API}/profesores/me/resumen`, { headers: authHeaders() }),

  // ✅ Obtener notificaciones enviadas por el profesor
  obtenerNotificaciones: () =>
    axios.get(`${API}/profesores/me/notificaciones`, { headers: authHeaders() }),

  // ✅ Obtener comunicados recientes (para el dashboard)
  obtenerComunicadosRecientes: () =>
    axios.get(`${API}/profesores/me/comunicados`, { headers: authHeaders() }),

  // ✅ Obtener cursos asignados al profesor
  obtenerCursos: () =>
    axios.get(`${API}/profesores/me/cursos`, { headers: authHeaders() }),

  // ✅ Obtener apoderados vinculados a los cursos del profesor
  obtenerApoderados: () =>
    axios.get(`${API}/profesores/me/apoderados`, { headers: authHeaders() }),

  // ✅ Crear un nuevo comunicado / notificación
  crearComunicado: (data) =>
    axios.post(`${API}/profesores/notificaciones`, data, { headers: authHeaders() }),

  // ✅ Obtener detalle de una notificación específica
  obtenerComunicado: (id) =>
    axios.get(`${API}/profesores/notificaciones/${id}`, { headers: authHeaders() }),

  // ✅ Eliminar una notificación específica
  eliminarComunicado: (id) =>
    axios.delete(`${API}/profesores/notificaciones/${id}`, { headers: authHeaders() })
}
