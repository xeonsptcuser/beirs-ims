export interface UserSessionInfo {
  id: number
  email: string
  role: string
  profile: {
    first_name: string
    last_name: string
    middle_name: string
  }
}
