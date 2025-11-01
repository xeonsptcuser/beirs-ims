import type {
  LoginRequestPayload,
  LoginResponse,
  RegisterRequestPayload,
  CommonResponse,
  CommonResponse,
} from '@/Types'
import { ApiService } from '../ApiService'

export class LoginRegisterService {
  private static instance: LoginRegisterService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): LoginRegisterService {
    if (!LoginRegisterService.instance) {
      LoginRegisterService.instance = new LoginRegisterService()
    }
    return LoginRegisterService.instance
  }

  async postRequestLogin(payload: LoginRequestPayload, endpoint: string): Promise<LoginResponse> {
    return this.apiService.post(endpoint, payload)
  }

  async postRequestRegister(
    payload: RegisterRequestPayload,
    endpoint: string
  ): Promise<CommonResponse> {
    return this.apiService.post(endpoint, payload)
  }

  async postRequestLogout(endpoint: string): Promise<CommonResponse> {
    return this.apiService.post(endpoint)
  }
}
