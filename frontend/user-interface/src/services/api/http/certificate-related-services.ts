import type { ApiResponse, PageInfo, PaginatedData } from '@/Types'
import { ApiService } from '../ApiService'
import type {
  CertificateRequestsResponse,
  CreateCertificateRequestPayload,
  UpdateCertificateRequestPayload,
} from '@/Types/certificate-related-types'

export class CertificateRelatedService {
  private static instance: CertificateRelatedService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): CertificateRelatedService {
    if (!CertificateRelatedService.instance) {
      CertificateRelatedService.instance = new CertificateRelatedService()
    }
    return CertificateRelatedService.instance
  }

  async getAllCertificateRequests(
    url: string,
    params?: PageInfo
  ): Promise<ApiResponse<PaginatedData<CertificateRequestsResponse[]>>> {
    return this.apiService.get<ApiResponse<PaginatedData<CertificateRequestsResponse[]>>>(
      url,
      params
    )
  }

  async createCertificateRequest(
    data: CreateCertificateRequestPayload,
    url: string
  ): Promise<ApiResponse<CertificateRequestsResponse>> {
    return this.apiService.post(url, data)
  }

  async getSingleCertificateRequest(
    url: string
  ): Promise<ApiResponse<CertificateRequestsResponse>> {
    return this.apiService.get(url)
  }

  async updateSingleCertificateRequest(
    url: string,
    data: UpdateCertificateRequestPayload
  ): Promise<ApiResponse<CertificateRequestsResponse>> {
    return this.apiService.patch(url, data)
  }
}
