export interface UserProfile {
  id: number
  name: string
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
