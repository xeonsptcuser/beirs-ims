import { endpoints } from '@/services/api/endpoints'
import { LoginRegisterService } from '@/services/api/http/login-register-service'
import type {
  BaseResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequestPayload,
  RegisterResponse,
} from '@/Types'

export const userLogin = async (data: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestLogin(data, endpoints.LOGIN)

  if (!response?.status_code || response.status_code !== 'success') {
    throw new Error('Failed to login user...')
  }

  return response
}

export const userRegistration = async (
  data: RegisterRequestPayload
): Promise<BaseResponse<RegisterResponse>> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestRegister(data, endpoints.REGISTRATION)

  if (!response?.status_code || response.status_code !== 'success') {
    throw new Error('Failed to register new user...')
  }

  return response
}
