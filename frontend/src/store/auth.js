import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    // 🔐 Iniciar sesión
    async login(email, password) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password })

        // Puede venir como accessToken o token según backend
        const token = res.data.accessToken || res.data.token
        const user = res.data.user

        // Guarda en el estado
        this.token = token
        this.user = user

        // Guarda en localStorage para persistencia
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('role', user.rol || user.role || '')

        console.log('✅ Usuario autenticado:', user)

        return user
      } catch (error) {
        console.error('❌ Error al iniciar sesión:', error.response?.data || error.message)
        throw new Error(error.response?.data?.error || 'Error al iniciar sesión')
      }
    },

    // 🚪 Cerrar sesión
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    },

    // 🧠 Verificar si el usuario sigue autenticado
    isAuthenticated() {
      return !!this.token
    },

    // 🔎 Obtener rol actual (normalizado)
    getRole() {
      return (this.user?.rol || localStorage.getItem('role') || '').toLowerCase()
    }
  }
})
