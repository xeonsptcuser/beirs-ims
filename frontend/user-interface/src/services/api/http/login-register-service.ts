import { endpoints } from './../endpoints/endpoints'
import type { BaseResponse, LoginRequest, LoginResponse } from '@/Types'
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

  async postUserLogin(
    payload: LoginRequest,
    endpoint: string,
    params?: object
  ): Promise<BaseResponse<LoginResponse>> {
    return this.apiService.post(endpoint, payload)
  }
}
