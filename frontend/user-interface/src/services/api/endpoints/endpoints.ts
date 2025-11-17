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
const USER_API_ROUTES = `${AUTH_BASE}/users`
const CERT_API_ROUTES = `${AUTH_BASE}/certificates`

export const endpoints = {
  // PUBLIC ENDPOINTS
  LOGIN: `${COMMON_BASE}/login`,
  REGISTRATION: `${COMMON_BASE}/register`,

  // AUTHENTICATED ENDPOINTS
  LOGOUT: `${AUTH_BASE}/logout`,

  // USER ACCOUNT RELATED
  GET_ALL_USERS: `${USER_API_ROUTES}`,
  CREATE_USER_ACCOUNT: `${USER_API_ROUTES}`,
  TOGGLE_USER_ACCOUNT: (id: number | string) => `${USER_API_ROUTES}/${id}`,
  GET_SINGLE_USER: (id: number | string) => `${USER_API_ROUTES}/${id}`,
  UPDATE_SINGLE_USER: (id: number | string) => `${USER_API_ROUTES}/${id}`,

  // CERTIFICATE RELATED
  GET_ALL_CERTIFICATE: `${CERT_API_ROUTES}/all`,
  GET_ALL_CERTIFICATE_BY_ID: `${CERT_API_ROUTES}/resident`,
  CREATE_CERTIFICATE: (id: number | string) => `${CERT_API_ROUTES}/${id}/create`,
  GET_CERTIFICATE: (id: number | string) => `${CERT_API_ROUTES}/${id}`,
  UPDATE_CERTIFICATE: (id: number | string) => `${CERT_API_ROUTES}/${id}`,
}
