export interface UserNotification {
  id: string
  type: string
  data: Record<string, any>
  read_at: string | null
  created_at: string
  updated_at: string
}
