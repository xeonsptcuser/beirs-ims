import { ApiService } from '../ApiService'
import type { ApiResponse, UserNotification } from '@/Types'

export class NotificationService {
  private static instance: NotificationService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async fetchNotifications(url: string) {
    return this.apiService.get<ApiResponse<UserNotification[]>>(url)
  }

  async markAsRead(url: string) {
    return this.apiService.patch<ApiResponse<unknown>>(url)
  }
}
