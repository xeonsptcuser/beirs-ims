export interface UserSessionInfo {
  id: BigInt
  email: string
  profile: { name: string; role: string }
}
