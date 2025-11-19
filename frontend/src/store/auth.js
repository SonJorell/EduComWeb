import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    // 🔐 Iniciar sesión
    async login(email, password) {
      try {
        // ⛔️ Ruta corregida → /api/auth/login
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        })

        const token = res.data.token || res.data.accessToken
        const user = res.data.user

        // Guardar en estado
        this.token = token
        this.user = user

        // Guardar en localStorage
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

    // 🧠 Verificar si sigue autenticado
    isAuthenticated() {
      return !!this.token
    },

    // 🔍 Obtener rol normalizado
    getRole() {
      return (this.user?.rol || localStorage.getItem('role') || '').toLowerCase()
    }
  }
})
