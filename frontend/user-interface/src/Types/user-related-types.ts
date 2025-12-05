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
  mobile_verified_at?: string | null
  is_active: boolean
  user?: User
  government_identity?: GovernmentIdentity | null
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
    govtIdentityType: string
    governmentIdentity: File[]
  }

export type UpdateUserAccountRequest = Partial<CreateUserAccountRequest>

type PayloadBase = ProfileCore & {
  email: string
  role: string
}

export interface CreateAccountRequestPayload extends PayloadBase {
  password: string
  password_confirmation: string
}

export type UpdateAccountRequestPayload = Partial<
  PayloadBase & {
    password: string
    password_confirmation: string
    government_identity_type: string
    government_identity: File[] | FileList | null
    is_active: boolean
  }
>

export interface GovernmentIdentity {
  id: number
  user_profile_id: number
  storage_path: string
  identity_type: string
  original_name: string
  mime_type: string
  size: number
  created_at: string
  updated_at: string
}

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
  | 'governmentIdentity'

export type UserProfileEditStatus = Record<EditableFields, boolean>
