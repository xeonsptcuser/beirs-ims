export interface UserProfile {
  id: number
  first_name: string
  middle_name: string
  last_name: string
  street_address: string
  mobile_number: string
  date_of_birth: string
  email_verification_at: string | null
  is_active: boolean
}

export interface User {
  id: number
  userProfileId: number
  email: string
  role: string
  profile: UserProfile
}

interface FullName {
  firstName: string
  lastName: string
  middleName: string
}
export interface CreateUserAccountRequest {
  name: FullName
  role: string
  email: string
  password: string
  passwordConfirmation: string
  date_of_birth: string
  streetAddress: string
  mobileNumber: string
}

export interface CreateAccountRequestPayload {
  first_name: string
  last_name: string
  middle_name: string
  email: string
  password: string
  password_confirmation: string
  role: string
  date_of_birth: string
  street_address: string
  mobile_number: string
}

export interface UpdateAccountRequest {
  name?: FullName
  role?: string
  email?: string
  password?: string
  passwordConfirmation?: string
  date_of_birth?: string
  streetAddress?: string
  mobileNumber?: string
}
export interface UpdateAccountRequestPayload {
  first_name: string
  last_name: string
  middle_name: string
  email: string
  password?: string
  password_confirmation?: string
  role: string
  date_of_birth: string
  street_address: string
  mobile_number: string
}

export interface UserProfileEditStatus {
  name: boolean
  email: boolean
  password: boolean
  passwordConfirmation: boolean
  role: boolean
  dateOfBirth: boolean
  streetAddress: boolean
  mobileNumber: boolean
}
