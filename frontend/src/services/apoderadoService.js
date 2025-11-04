import axios from 'axios'

const API_URL = 'http://localhost:3000/apoderado'

const token = () => localStorage.getItem('token')

export const apoderadoService = {
  obtenerNotificaciones() {
    return axios.get(`${API_URL}/notificaciones`, {
      headers: { Authorization: `Bearer ${token()}` }
    })
  },

  marcarTodasLeidas() {
    return axios.put(`${API_URL}/notificaciones/leidas`, {}, {
      headers: { Authorization: `Bearer ${token()}` }
    })
  },

  confirmarAsistencia(notificacionId) {
    return axios.put(`${API_URL}/notificaciones/${notificacionId}/confirmar`, {}, {
      headers: { Authorization: `Bearer ${token()}` }
    })
  }
}
