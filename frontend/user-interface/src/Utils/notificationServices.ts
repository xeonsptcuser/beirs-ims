import { endpoints } from '@/services/api/endpoints'
import { NotificationService } from '@/services/api/http/notification-service'
import type { UserNotification } from '@/Types'

const notificationService = NotificationService.getInstance()

export const fetchNotifications = async (): Promise<UserNotification[]> => {
  const response = await notificationService.fetchNotifications(endpoints.GET_NOTIFICATIONS)

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to fetch notifications.')
  }

  return response.data ?? []
}

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await notificationService.markAsRead(endpoints.MARK_NOTIFICATION(notificationId))

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to update notification.')
  }

  return response
}
