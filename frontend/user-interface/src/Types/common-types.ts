export interface NavItem {
  path: string
  label: string
}

// LOGIN REQUEST INTERFACE
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  username: string
  access_token: string
}
