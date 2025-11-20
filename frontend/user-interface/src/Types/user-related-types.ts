type NameFields = {
  first_name: string
  middle_name: string
  last_name: string
}
type AddressFields = {
  street_address: string
  address_line?: string
  mobile_number: string
}
type ProfileCore = NameFields &
  AddressFields & {
    date_of_birth: string
  }

export interface UserProfile extends ProfileCore {
  id: number
  email_verification_at: string | null
  is_active: boolean
  user?: User
}

export interface User {
  id: number
  userProfileId: number
  email: string
  role: string
  profile: UserProfile
}

type UiName = {
  name: {
    firstName: string
    middleName: string
    lastName: string
  }
}
type UiAddress = {
  streetAddress: string
  addressLine?: string
  mobileNumber: string
}

export type CreateUserAccountRequest = UiName &
  UiAddress & {
    role: string
    email: string
    password: string
    passwordConfirmation: string
    date_of_birth: string
    governmentId: File[]
  }

export type UpdateUserAccountRequest = Partial<CreateUserAccountRequest>

type PayloadBase = ProfileCore & {
  email: string
  role: string
}

export interface CreateAccountRequestPayload extends PayloadBase {
  password: string
  password_confirmation: string
  governmentId: File[]
}

export type UpdateAccountRequestPayload = Partial<
  PayloadBase & {
    password: string
    password_confirmation: string
    governmentId: File[]
  }
>

type EditableFields =
  | 'name'
  | 'email'
  | 'password'
  | 'passwordConfirmation'
  | 'role'
  | 'dateOfBirth'
  | 'streetAddress'
  | 'addressLine'
  | 'mobileNumber'
  | 'governmentId'

export type UserProfileEditStatus = Record<EditableFields, boolean>
