export interface NotificationHandler {
  id: number
  name: string
  role: string
}

export interface NotificationData {
  certificate_id: number
  status: string
  handler: NotificationHandler
  message: string
}

export interface UserNotification {
  id: string
  type: string
  notifiable_type: string
  notifiable_id: number
  data: NotificationData
  read_at: string | null
  created_at: string
  updated_at: string
}
