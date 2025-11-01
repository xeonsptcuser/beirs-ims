import axios, { type AxiosRequestHeaders } from 'axios'
const SESSION_STORAGE_KEY = 'session'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const storedSession =
    globalThis.window === undefined
      ? null
      : globalThis.window.sessionStorage.getItem(SESSION_STORAGE_KEY)

  let token: string | null = null

  if (storedSession) {
    try {
      const parsed = JSON.parse(storedSession)
      token = parsed?.token ?? null
    } catch (error) {
      console.error('Failed to parse session from storage', error)
    }
  }

  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders
    }
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

export default api
