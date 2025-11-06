import { endpoints } from '@/services/api/endpoints'
import { UserRelatedService } from '@/services/api/http/user-related-service'
import type { PageInfo } from '@/Types'

export const fetchAllUsers = async (params?: PageInfo) => {
  const userRelatedService = UserRelatedService.getInstance()
  const response = await userRelatedService.getAllUsers(endpoints.GET_ALL_USERS, params)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to login user...')
  }

  return response
}
