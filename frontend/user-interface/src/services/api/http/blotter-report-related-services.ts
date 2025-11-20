import type {
  ApiResponse,
  BlotterReportRequestPayload,
  BlotterReportResponse,
  PageInfo,
  PaginatedData,
  UpdateBlotterReportRequestPayload,
} from '@/Types'
import { ApiService } from './../ApiService'
export class BlotterReportRelatedService {
  private static instance: BlotterReportRelatedService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): BlotterReportRelatedService {
    if (!BlotterReportRelatedService.instance) {
      BlotterReportRelatedService.instance = new BlotterReportRelatedService()
    }
    return BlotterReportRelatedService.instance
  }

  // update type string to actual type
  async getAllBlotterReports(
    url: string,
    params?: PageInfo
  ): Promise<ApiResponse<PaginatedData<BlotterReportResponse[]>>> {
    return this.apiService.get<ApiResponse<PaginatedData<BlotterReportResponse[]>>>(url, params)
  }

  async createBlotterReports(
    data: BlotterReportRequestPayload | FormData,
    url: string
  ): Promise<ApiResponse<BlotterReportResponse>> {
    return this.apiService.post(url, data)
  }

  async getSingleBlotterReport(url: string): Promise<ApiResponse<BlotterReportResponse>> {
    return this.apiService.get(url)
  }

  async updateBlotterReport(
    url: string,
    data: UpdateBlotterReportRequestPayload
  ): Promise<ApiResponse<BlotterReportResponse>> {
    return this.apiService.patch(url, data)
  }
}
