import { type UserSessionInfo } from './session-types'

export interface NavItem {
  path: string
  label: string
}

export interface LoginRequestPayload {
  email: string
  password: string
}

export interface LoginSuccessResponse {
  status: 'success'
  user: UserSessionInfo
  token: string
}

export interface OtpRequiredResponse {
  status: 'otp_required'
  user_id: number
  message: string
}

export type LoginResponse = LoginSuccessResponse | OtpRequiredResponse

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
  first_name: string
  last_name: string
  middle_name: string
  email: string
  password: string
  password_confirmation: string
  date_of_birth: string
  street_address: string
  mobile_number: string
}

export interface CommonResponse {
  status: string
  message: string
}

export interface ApiErrorResponse {
  message?: string
  status?: number
  errors?: Record<string, string[]>
}

export interface VerifyOtpPayload {
  user_id: number
  otp_code: string
}
