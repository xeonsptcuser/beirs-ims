import type {
  LoginRequestPayload,
  LoginResponse,
  VerifyOtpPayload,
  LoginSuccessResponse,
} from '@/Types'
import { ApiService } from '../ApiService'

export class OtpService {
  private static instance: OtpService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): OtpService {
    if (!OtpService.instance) {
      OtpService.instance = new OtpService()
    }
    return OtpService.instance
  }

  async requestOtp(payload: LoginRequestPayload, endpoint: string): Promise<LoginResponse> {
    return this.apiService.post(endpoint, payload)
  }

  async verifyOtp(payload: VerifyOtpPayload, endpoint: string): Promise<LoginSuccessResponse> {
    return this.apiService.post(endpoint, payload)
  }
}
