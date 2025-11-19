// src/services/adminService.js
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

async function safeRequest(request) {
  try {
    return await request
  } catch (err) {
    console.error('❌ Error en adminService:', err.response?.data || err)
    return { data: null, error: err }
  }
}

export const adminService = {
  // Usuarios
  obtenerUsuarios: () =>
    safeRequest(axios.get(`${API}/api/ti/usuarios`, { headers: authHeaders() })),

  crearUsuario: (data) =>
    safeRequest(axios.post(`${API}/api/ti/usuarios`, data, { headers: authHeaders() })),

  editarUsuario: (id, data) =>
    safeRequest(axios.put(`${API}/api/ti/usuarios/${id}`, data, { headers: authHeaders() })),

  eliminarUsuario: (id) =>
    safeRequest(axios.delete(`${API}/api/ti/usuarios/${id}`, { headers: authHeaders() })),

  resetearPassword: (id) =>
    safeRequest(axios.put(`${API}/api/ti/usuarios/${id}/resetear-password`, {}, { headers: authHeaders() })),

  // Cursos
  obtenerCursos: () =>
    safeRequest(axios.get(`${API}/api/ti/cursos`, { headers: authHeaders() })),

  crearCurso: (data) =>
    safeRequest(axios.post(`${API}/api/ti/cursos`, data, { headers: authHeaders() })),

  editarCurso: (id, data) =>
    safeRequest(axios.put(`${API}/api/ti/cursos/${id}`, data, { headers: authHeaders() })),

  eliminarCurso: (id) =>
    safeRequest(axios.delete(`${API}/api/ti/cursos/${id}`, { headers: authHeaders() })),

  asignarProfesor: (cursoId, profesorId) =>
    safeRequest(axios.post(`${API}/api/ti/cursos/${cursoId}/asignar-profesor`, { profesorId }, { headers: authHeaders() })),

  // Roles
  obtenerRoles: () =>
    safeRequest(axios.get(`${API}/api/ti/roles`, { headers: authHeaders() })),

  actualizarRolUsuario: (usuarioId, rolId) =>
    safeRequest(axios.put(`${API}/api/ti/roles/usuarios/${usuarioId}`, { rolId }, { headers: authHeaders() })),

  // Sistema
  obtenerEstadoBD: () =>
    safeRequest(axios.get(`${API}/api/ti/sistema/db`, { headers: authHeaders() })),

  obtenerLogsSistema: () =>
    safeRequest(axios.get(`${API}/api/ti/sistema/logs`, { headers: authHeaders() })),

  // Auditoría
  obtenerAuditoria: () =>
    safeRequest(axios.get(`${API}/api/ti/auditoria`, { headers: authHeaders() }))
}
