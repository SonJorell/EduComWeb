import axios from 'axios'
const API = 'http://localhost:3000/api'

function auth() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const NotifService = {
  // ✉️ Enviar comunicado (PROFESOR)
  enviar(payload) {
    return axios.post(`${API}/profesores/notificaciones`, payload, auth())
  },

  // 📩 Comunicados enviados por el profesor
  mias() {
    return axios.get(`${API}/profesores/me/notificaciones`, auth())
  },

  // 📊 Estados / destinatarios de la notificación
  estados(id) {
    return axios.get(`${API}/notificaciones/${id}/estados`, auth())
  },

  // 👁️‍🗨️ Marcar como leído (APODERADO)
  marcarLeido(id) {
    return axios.post(`${API}/notificaciones/${id}/leido`, {}, auth())
  },

  // ✔️ Marcar como confirmado (APODERADO)
  marcarConfirmado(id) {
    return axios.post(`${API}/notificaciones/${id}/confirmado`, {}, auth())
  },

  // 📚 Cursos asignados al profesor
  cursosProfesor() {
    return axios.get(`${API}/profesores/me/cursos`, auth())
  },

  // 📈 Resumen del profesor
  resumenProfesor() {
    return axios.get(`${API}/profesores/me/resumen`, auth())
  }
}
