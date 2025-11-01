import type { LoginResponse } from '@/Types'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'session'

export const useSessionStore = defineStore('session', {
  state: () => ({
    status: '' as string,
    id: null as BigInt | null,
    name: '' as string,
    token: '' as string,
    role: '' as string,
  }),

  actions: {
    setSession(data: LoginResponse) {
      const user = data.user
      const token = data.token

      if (!user) {
        console.error('Login response missing user info')
        return
      }

      this.status = data.status
      this.id = user.id ?? null
      this.name = user.profile?.name ?? ''
      this.token = token ?? ''
      this.token = data.user.profile.role

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: this.status,
          id: this.id,
          name: this.name,
          token: this.token,
          role: this.role,
        })
      )
    },
    loadFromSession() {
      const savedSession = sessionStorage.getItem(STORAGE_KEY)
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession)
        this.status = parsedSession.status
        this.id = parsedSession.id
        this.name = parsedSession.name
        this.token = parsedSession.token
        this.role = parsedSession.role
      }
    },

    clearSession() {
      this.status = ''
      this.id = null
      this.name = ''
      this.token = ''
      this.role = ''
      sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})
