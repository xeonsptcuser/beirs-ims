const API_CONFIG = {
  BASE_PATH: '/api',
  // Add modules here.
  // This are just subpaths available in the api [e.g auth, admin, residents, staff]
  MODULES: {
    AUTHENTICATION: 'auth',
  },
}

const AUTH_BASE = `${API_CONFIG.BASE_PATH}/${API_CONFIG.MODULES.AUTHENTICATION}`
const COMMON_BASE = `${API_CONFIG.BASE_PATH}` // will be used later on.

export const endpoints = {
  // PUBLIC ENDPOINTS
  LOGIN: `${COMMON_BASE}/login`,
  REGISTRATION: `${COMMON_BASE}/register`,

  // AUTHENTICATED ENDPOINTS
  LOGOUT: `${AUTH_BASE}/logout`,
  GET_ALL_USERS: `${AUTH_BASE}/users`,
  CREATE_USER_ACCOUNT: `${AUTH_BASE}/users`,
  TOGGLE_USER_ACCOUNT: (id: number | string) => `${AUTH_BASE}/users/${id}`,
}
