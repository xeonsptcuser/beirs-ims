import type { ApiResponse, Section } from '@/Types'
import { ApiService } from '../ApiService'

export class HeatmapService {
  private static instance: HeatmapService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): HeatmapService {
    if (!HeatmapService.instance) {
      HeatmapService.instance = new HeatmapService()
    }

    return HeatmapService.instance
  }

  async getSections(url: string): Promise<ApiResponse<Section[]>> {
    return this.apiService.get(url)
  }
}
