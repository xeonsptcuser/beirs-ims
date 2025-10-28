const API_CONFIG = {
  BASE_PATH: "/api",
  // Add modules here.
  // This are just subpaths available in the api [e.g auth, admin, residents, staff]
  MODULES: {
    AUTHENTICATION: "auth",
  },
};

const AUTH_BASE = `${API_CONFIG.BASE_PATH}/ ${API_CONFIG.MODULES.AUTHENTICATION}`;
const COMMON_BASE = `${API_CONFIG.BASE_PATH}`;

export const endpoints = {
  // AUTHENTICATION RELATED
  LOGIN: `${AUTH_BASE}/login`,
  REGISTRATION: `${AUTH_BASE}/register`,
};
