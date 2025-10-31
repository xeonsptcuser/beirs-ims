export interface NavItem {
  path: string
  label: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  username: string
  access_token: string
}

export interface RegisterRequest {
  name: Fullname
  email: string
  password: string
  passwordConfirmation: string
  date_of_birth: string
}

interface Fullname {
  firstName: ''
  lastName: ''
  middleName: ''
}
