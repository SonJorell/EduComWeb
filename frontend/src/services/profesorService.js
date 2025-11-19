// src/services/profesorService.js
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Token JWT
function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

async function safeRequest(request) {
  try {
    return await request
  } catch (err) {
    console.error("❌ Error en profesorService:", err)
    return { data: null, error: err }
  }
}

export const profesorService = {
  obtenerResumen: () =>
    safeRequest(axios.get(`${API}/api/profesores/me/resumen`, { headers: authHeaders() })),

  obtenerNotificaciones: () =>
    safeRequest(axios.get(`${API}/api/profesores/me/notificaciones`, { headers: authHeaders() })),

  obtenerComunicadosRecientes: () =>
    safeRequest(axios.get(`${API}/api/profesores/me/comunicados`, { headers: authHeaders() })),

  obtenerCursos: () =>
    safeRequest(axios.get(`${API}/api/profesores/me/cursos`, { headers: authHeaders() })),

  obtenerApoderados: () =>
    safeRequest(axios.get(`${API}/api/profesores/me/apoderados`, { headers: authHeaders() })),

  crearComunicado: (data) =>
    safeRequest(axios.post(`${API}/api/profesores/notificaciones`, data, { headers: authHeaders() })),

  obtenerComunicado: (id) =>
    safeRequest(axios.get(`${API}/api/profesores/notificaciones/${id}`, { headers: authHeaders() })),

  deshabilitarComunicado: (id) =>
    safeRequest(axios.put(`${API}/api/profesores/notificaciones/${id}/deshabilitar`, {}, { headers: authHeaders() }))
}
