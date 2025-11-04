import axios from 'axios'
const API = 'http://localhost:3000'

function auth() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const NotifService = {
  enviar(payload) {
    // { titulo, mensaje, tipo, apoderadoId?, cursoId? }
    return axios.post(`${API}/notificaciones`, payload, auth())
  },
  mias() {
    return axios.get(`${API}/notificaciones/mias`, auth())
  },
  estados(id) {
    return axios.get(`${API}/notificaciones/${id}/estados`, auth())
  },
  marcarLeido(id) {
    return axios.post(`${API}/notificaciones/${id}/leido`, {}, auth())
  },
  marcarConfirmado(id) {
    return axios.post(`${API}/notificaciones/${id}/confirmado`, {}, auth())
  },
  cursosProfesor() {
    return axios.get(`${API}/profesores/me/cursos`, auth())
  },
  resumenProfesor() {
    return axios.get(`${API}/profesores/me/resumen`, auth())
  }
}
