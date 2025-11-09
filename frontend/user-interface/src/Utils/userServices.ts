import { endpoints } from '@/services/api/endpoints'
import { UserRelatedService } from '@/services/api/http/user-related-service'
import type { CreateAccountRequestPayload, PageInfo, UpdateAccountRequestPayload } from '@/Types'

const userRelatedService = UserRelatedService.getInstance()

export const fetchAllUsers = async (params?: PageInfo) => {
  const response = await userRelatedService.getAllUsers(endpoints.GET_ALL_USERS, params)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to retrieve users...')
  }

  return response
}

export const userAccountCreation = async (data: CreateAccountRequestPayload) => {
  const response = await userRelatedService.createUserAccount(data, endpoints.CREATE_USER_ACCOUNT)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to create user account...')
  }

  return response
}

export const toggleUserAccountStatus = async (userId: number, isActive: boolean) => {
  const response = await userRelatedService.toggleUserAccount(
    endpoints.TOGGLE_USER_ACCOUNT(userId),
    { is_active: isActive }
  )

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to update user account status...')
  }

  return response
}

export const fetchSingleUserProfile = async (userId: string) => {
  const response = await userRelatedService.getSingleUserAccount(endpoints.GET_SINGLE_USER(userId))

  if (!response.status || response.status !== 'success') {
    throw new Error(`Failed to retrieve user with id ${userId}`)
  }

  return response
}

export const updateUserAccount = async (userId: string, data: UpdateAccountRequestPayload) => {
  const response = await userRelatedService.updateSingleUserAccount(
    endpoints.UPDATE_SINGLE_USER(userId),
    data
  )

  if (!response.status || response.status !== 'success') {
    throw new Error(`Failed to update user with id ${userId}`)
  }

  return response
}
