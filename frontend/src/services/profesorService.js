// src/services/profesorService.js
import axios from 'axios'

// Base URL de la API
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 🧠 Helper para agregar el token JWT
function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

// 🧩 Helper genérico para manejar errores
async function safeRequest(request) {
  try {
    const res = await request
    return res
  } catch (err) {
    console.error('❌ Error en profesorService:', err)
    return { data: null, error: err }
  }
}

export const profesorService = {
  obtenerResumen: () =>
    safeRequest(axios.get(`${API}/profesores/me/resumen`, { headers: authHeaders() })),

  obtenerNotificaciones: () =>
    safeRequest(axios.get(`${API}/profesores/me/notificaciones`, { headers: authHeaders() })),

  obtenerComunicadosRecientes: () =>
    safeRequest(axios.get(`${API}/profesores/me/comunicados`, { headers: authHeaders() })),

  obtenerCursos: () =>
    safeRequest(axios.get(`${API}/profesores/me/cursos`, { headers: authHeaders() })),

  obtenerApoderados: () =>
    safeRequest(axios.get(`${API}/profesores/me/apoderados`, { headers: authHeaders() })),

  crearComunicado: (data) =>
    safeRequest(axios.post(`${API}/profesores/notificaciones`, data, { headers: authHeaders() })),

  obtenerComunicado: (id) =>
    safeRequest(axios.get(`${API}/profesores/notificaciones/${id}`, { headers: authHeaders() })),

  eliminarComunicado: (id) =>
    safeRequest(axios.delete(`${API}/profesores/notificaciones/${id}`, { headers: authHeaders() }))
}
