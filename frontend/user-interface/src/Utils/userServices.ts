import { endpoints } from '@/services/api/endpoints'
import { UserRelatedService } from '@/services/api/http/user-related-service'
import { OtpService } from '@/services/api/http/otp-service'
import type {
  CreateAccountRequestPayload,
  PageInfo,
  UpdateAccountRequestPayload,
} from '@/Types'

const userRelatedService = UserRelatedService.getInstance()
const otpService = OtpService.getInstance()

export const fetchAllUsers = async (params?: PageInfo) => {
  const response = await userRelatedService.getAllUsers(endpoints.GET_ALL_USERS, params)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to retrieve users...')
  }

  return response
}

export const userAccountCreation = async (data: CreateAccountRequestPayload) => {
  const formData = new FormData()
  const appendIfPresent = (key: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value as any)
  }

  appendIfPresent('first_name', data.first_name)
  appendIfPresent('middle_name', data.middle_name)
  appendIfPresent('last_name', data.last_name)
  appendIfPresent('email', data.email)
  appendIfPresent('role', data.role)
  appendIfPresent('street_address', data.street_address)
  appendIfPresent('address_line', data.address_line)
  appendIfPresent('mobile_number', data.mobile_number)
  appendIfPresent('date_of_birth', data.date_of_birth)
  appendIfPresent('password', data.password)
  appendIfPresent('password_confirmation', data.password_confirmation)
  appendIfPresent('government_identity_type', data.government_identity_type)

  const response = await userRelatedService.createUserAccount(
    endpoints.CREATE_USER_ACCOUNT,
    formData
  )

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
  const formData = new FormData()
  const appendIfPresent = (key: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value.trim() === '') return
    formData.append(key, value as any)
  }

  appendIfPresent('first_name', data.first_name)
  appendIfPresent('middle_name', data.middle_name)
  appendIfPresent('last_name', data.last_name)
  appendIfPresent('email', data.email)
  appendIfPresent('role', data.role)
  appendIfPresent('street_address', data.street_address)
  appendIfPresent('address_line', data.address_line)
  appendIfPresent('mobile_number', data.mobile_number)
  appendIfPresent('date_of_birth', data.date_of_birth)
  appendIfPresent('password', data.password)
  appendIfPresent('password_confirmation', data.password_confirmation)

  const governmentIdentityRaw = data.government_identity ?? []
  const governmentIdentity = Array.isArray(governmentIdentityRaw)
    ? governmentIdentityRaw
    : Array.from(governmentIdentityRaw)

  for (const file of governmentIdentity) {
    formData.append('government_identity', file)
  }

  const response = await userRelatedService.updateSingleUserAccount(
    endpoints.UPDATE_SINGLE_USER(userId),
    formData
  )

  if (!response.status || response.status !== 'success') {
    throw new Error(`Failed to update user with id ${userId}`)
  }

  return response
}

export const requestMobileVerificationOtp = async () => {
  const response = await otpService.requestOtpAuthenticated(endpoints.AUTH_REQUEST_OTP)

  if (!response.status) {
    throw new Error('Failed to request OTP for mobile verification.')
  }

  return response
}

export const verifyMobileVerificationOtp = async (otp_code: string) => {
  const response = await otpService.verifyOtpAuthenticated({ otp_code }, endpoints.AUTH_VERIFY_OTP)

  if (!response.status || response.status !== 'success') {
    throw new Error(response.message ?? 'Failed to verify OTP for mobile number.')
  }

  return response
}
