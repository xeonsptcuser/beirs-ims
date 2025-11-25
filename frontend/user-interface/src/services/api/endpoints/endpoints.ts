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
const BLOTTER_API_ROUTES = `${AUTH_BASE}/blotter-reports`
const NOTIFICATIONS_ROUTE = `${COMMON_BASE}/notifications`
const PUBLIC_ADDRESSES_ROUTE = `${COMMON_BASE}/addresses`
const AUTH_ADDRESSES_ROUTE = `${AUTH_BASE}/addresses`

export const endpoints = {
  // PUBLIC ENDPOINTS
  LOGIN: `${COMMON_BASE}/login`,
  REQUEST_OTP: `${COMMON_BASE}/request-otp`,
  VERIFY_OTP: `${COMMON_BASE}/verify-otp`,
  REGISTRATION: `${COMMON_BASE}/register`,

  // AUTHENTICATED ENDPOINTS
  LOGOUT: `${AUTH_BASE}/logout`,
  AUTH_REQUEST_OTP: `${AUTH_BASE}/otp/request`,
  AUTH_VERIFY_OTP: `${AUTH_BASE}/otp/verify`,

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

  // BLOTTER REPORT RELATED
  GET_ALL_BLOTTER_REPORTS: `${BLOTTER_API_ROUTES}/all`,
  GET_ALL_BLOTTER_REPORTS_BY_ID: `${BLOTTER_API_ROUTES}/resident`,
  CREATE_BLOTTER_REPORT: (id: number | string) => `${BLOTTER_API_ROUTES}/${id}/create`,
  GET_BLOTTER_REPORT: (id: number | string) => `${BLOTTER_API_ROUTES}/${id}`,
  UPDATE_BLOTTER_REPORT: (id: number | string) => `${BLOTTER_API_ROUTES}/${id}`,

  // NOTIFICATIONS
  GET_NOTIFICATIONS: `${NOTIFICATIONS_ROUTE}`,
  MARK_NOTIFICATION: (id: string) => `${NOTIFICATIONS_ROUTE}/${id}`,

  // BARANGAY ADDRESSES
  GET_ALL_ADDRESSES: `${PUBLIC_ADDRESSES_ROUTE}`,
  CREATE_ADDRESS: `${AUTH_ADDRESSES_ROUTE}`,
  UPDATE_ADDRESS: (id: number | string) => `${AUTH_ADDRESSES_ROUTE}/${id}`,
  DELETE_ADDRESS: (id: number | string) => `${AUTH_ADDRESSES_ROUTE}/${id}`,

  // PDF GENERATE PREVIEW
  OPEN_CERTIFICATE_PDF: (id: string | number) => `${COMMON_BASE}/generate-certificate/${id}`,
  OPEN_BLOTTER_REPORT_PDF: (id: string | number) => `${COMMON_BASE}/generate-incident-report/${id}`,
}
