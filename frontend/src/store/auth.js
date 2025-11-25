import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        })

        const token = res.data.token || res.data.accessToken
        const user = res.data.user

        // 🔥 Normalización del rol
        const normalRol = (user.rol?.nombre || user.rol || user.role || '').toUpperCase()

        this.user = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: normalRol
        }

        this.token = token

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', token)
        localStorage.setItem('role', normalRol)

        console.log("🔥 Usuario autenticado:", this.user)

        return this.user

      } catch (error) {
        console.error('❌ Error al iniciar sesión:', error)
        throw new Error(error.response?.data?.error || 'Error al iniciar sesión')
      }
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    },

    isAuthenticated() {
      return !!this.token
    },

    getRole() {
      return (this.user?.rol || localStorage.getItem('role') || '').toLowerCase()
    }
  }
})
