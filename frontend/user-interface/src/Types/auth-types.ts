import { type UserSessionInfo } from './session-types'

export interface NavItem {
  path: string
  label: string
}

export interface LoginRequestPayload {
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  user: UserSessionInfo
  token: string
}

export interface RegisterRequest {
  name: Fullname
  email: string
  password: string
  passwordConfirmation: string
  date_of_birth: string
  streetAddress: string
  mobileNumber: string
}

interface Fullname {
  firstName: ''
  lastName: ''
  middleName: ''
}

export interface RegisterRequestPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  date_of_birth: string
  street_address: string
  mobile_number: string
}

export interface RegisterResponse {
  status: string
  message: string
}

export interface ApiErrorResponse {
  message?: string
  status?: number
  errors?: Record<string, string[]>
}
