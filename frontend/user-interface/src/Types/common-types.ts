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
  passwordConfirmation: string
  date_of_birth: string
  street_address: string
  mobile_number: string
}

export interface RegisterResponse {
  status: string
  message: string
  access_token: string
}
