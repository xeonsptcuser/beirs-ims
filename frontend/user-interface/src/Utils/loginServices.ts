import { endpoints } from '@/services/api/endpoints'
import { LoginRegisterService } from '@/services/api/http/login-register-service'
import type { BaseResponse, LoginRequest, LoginResponse } from '@/Types'

export const userLogin = async (data: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestLogin(data, endpoints.LOGIN)

  if (!response?.status_code || response.status_code !== 'success') {
    throw new Error('Failed to login user...')
  }

  return response
}
