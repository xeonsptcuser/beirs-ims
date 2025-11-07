import { endpoints } from '@/services/api/endpoints'
import { UserRelatedService } from '@/services/api/http/user-related-service'
import type { CreateAccountRequestPayload, PageInfo } from '@/Types'

export const fetchAllUsers = async (params?: PageInfo) => {
  const userRelatedService = UserRelatedService.getInstance()
  const response = await userRelatedService.getAllUsers(endpoints.GET_ALL_USERS, params)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to retrieve users...')
  }

  return response
}

export const userAccountCreation = async (data: CreateAccountRequestPayload) => {
  const userRelatedService = UserRelatedService.getInstance()
  const response = await userRelatedService.createUserAccount(data, endpoints.CREATE_USER_ACCOUNT)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to create user account...')
  }

  return response
}
