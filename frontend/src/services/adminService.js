// src/services/adminService.js
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

// Función para manejar errores de forma centralizada
async function safeRequest(promise) {
  try {
    const response = await promise
    // Retornamos data y error null si todo sale bien
    return { data: response.data, error: null }
  } catch (err) {
    console.error('❌ Error en adminService:', err.response?.data || err.message)
    // Retornamos data null y el mensaje de error si falla
    return { 
      data: null, 
      error: err.response?.data?.error || 'Error de conexión con el servidor' 
    }
  }
}

export const adminService = {
  // ==========================================
  // 👤 USUARIOS
  // ==========================================
  obtenerUsuarios: () =>
    safeRequest(axios.get(`${API}/api/ti/usuarios`, { headers: authHeaders() })),

  crearUsuario: (data) =>
    safeRequest(axios.post(`${API}/api/ti/usuarios`, data, { headers: authHeaders() })),

  editarUsuario: (id, data) =>
    safeRequest(axios.put(`${API}/api/ti/usuarios/${id}`, data, { headers: authHeaders() })),

  eliminarUsuario: (id) =>
    safeRequest(axios.delete(`${API}/api/ti/usuarios/${id}`, { headers: authHeaders() })),

  // Resetear a contraseña por defecto
  resetearPassword: (id) =>
    safeRequest(axios.post(`${API}/api/ti/usuarios/${id}/reset`, {}, { headers: authHeaders() })),

  // ==========================================
  // 📚 CURSOS
  // ==========================================
  obtenerCursos: () =>
    safeRequest(axios.get(`${API}/api/ti/cursos`, { headers: authHeaders() })),

  crearCurso: (data) =>
    safeRequest(axios.post(`${API}/api/ti/cursos`, data, { headers: authHeaders() })),

  editarCurso: (id, data) =>
    safeRequest(axios.put(`${API}/api/ti/cursos/${id}`, data, { headers: authHeaders() })),

  eliminarCurso: (id) =>
    safeRequest(axios.delete(`${API}/api/ti/cursos/${id}`, { headers: authHeaders() })),

  // Asignar profesor (acepta rolInterno para definir si es JEFE)
  asignarProfesor: (cursoId, profesorId, rolInterno = 'ASIGNATURA') =>
    safeRequest(axios.post(`${API}/api/ti/cursos/${cursoId}/asignar-profesor`, { profesorId, rolInterno }, { headers: authHeaders() })),

  // Quitar profesor asignado
  desasignarProfesor: (cursoId) =>
    safeRequest(axios.delete(`${API}/api/ti/cursos/${cursoId}/desasignar-profesor`, { headers: authHeaders() })),

  // ==========================================
  // 🛡️ ROLES
  // ==========================================
  obtenerRoles: () =>
    safeRequest(axios.get(`${API}/api/ti/roles`, { headers: authHeaders() })),

  // Actualizar el rol de un usuario (PATCH)
  // Nota: El backend espera { rolNombre: string }
  actualizarRolUsuario: (usuarioId, rolNombre) =>
    safeRequest(axios.patch(`${API}/api/ti/usuarios/${usuarioId}/rol`, { rolNombre }, { headers: authHeaders() })),

  // ==========================================
  // ⚙️ SISTEMA & AUDITORÍA
  // ==========================================
  obtenerEstadoBD: () =>
    safeRequest(axios.get(`${API}/api/ti/sistema/db`, { headers: authHeaders() })),

  obtenerLogsSistema: () =>
    safeRequest(axios.get(`${API}/api/ti/sistema/logs`, { headers: authHeaders() })),

  obtenerAuditoria: () =>
    safeRequest(axios.get(`${API}/api/ti/auditoria`, { headers: authHeaders() }))
}