import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)

  // Actions
  const login = (userData: User, jwtToken: string) => {
    user.value = userData
    token.value = jwtToken
    isAuthenticated.value = true
    localStorage.setItem('token', jwtToken) // Optional: persist token
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, login, logout }
})
