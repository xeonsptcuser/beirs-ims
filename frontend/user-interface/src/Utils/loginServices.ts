import { endpoints } from '@/services/api/endpoints'
import { LoginRegisterService } from '@/services/api/http/login-register-service'
import type {
  LoginRequestPayload,
  LoginResponse,
  RegisterRequestPayload,
  CommonResponse,
  CommonResponse,
} from '@/Types'

export const userLogin = async (data: LoginRequestPayload): Promise<LoginResponse> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestLogin(data, endpoints.LOGIN)

  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to login user...')
  }

  return response
}

export const userRegistration = async (data: RegisterRequestPayload): Promise<CommonResponse> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestRegister(data, endpoints.REGISTRATION)
  if (!response?.status || response.status !== 'success') {
    throw new Error('Failed to register new user...')
  }

  return response
}

export const userLogout = async (): Promise<CommonResponse> => {
  const loginRegisterService = LoginRegisterService.getInstance()
  const response = await loginRegisterService.postRequestLogout(endpoints.LOGOUT)

  if (!response?.status || response.status !== 'success') {
    throw new Error(response?.message ?? 'Failed to logout user...')
  }

  return response
}
