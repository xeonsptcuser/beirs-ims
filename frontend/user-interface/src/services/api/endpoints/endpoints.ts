const API_CONFIG = {
  BASE_PATH: '/api',
  // Add modules here.
  // This are just subpaths available in the api [e.g auth, admin, residents, staff]
  MODULES: {
    AUTHENTICATION: 'auth',
  },
}

const AUTH_BASE = `${API_CONFIG.BASE_PATH}/ ${API_CONFIG.MODULES.AUTHENTICATION}`
const COMMON_BASE = `${API_CONFIG.BASE_PATH}` // will be used later on.

export const endpoints = {
  // AUTHENTICATION RELATED
  LOGIN: `${COMMON_BASE}/login`,
  REGISTRATION: `${COMMON_BASE}/register`,
}
