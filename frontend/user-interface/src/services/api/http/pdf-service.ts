import type { ApiResponse } from '@/Types'
import { ApiService } from '../ApiService'

export class PdfRelatedService {
  private static instance: PdfRelatedService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): PdfRelatedService {
    if (!PdfRelatedService.instance) {
      PdfRelatedService.instance = new PdfRelatedService()
    }
    return PdfRelatedService.instance
  }

  async fetchPdfData<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.apiService.get<ApiResponse<T>>(url, params)
  }

  async fetchPdfBlob(url: string): Promise<Blob> {
    // Use the shared ApiService but override responseType to get the raw PDF stream
    const response = await this.apiService.get<Blob>(url, undefined, { responseType: 'blob' })
    return response
  }

  async openPdfInNewTab(url: string): Promise<void> {
    const blob = await this.fetchPdfBlob(url)
    const blobUrl = globalThis.URL.createObjectURL(
      new Blob([blob], { type: 'application/pdf' })
    )
    window.open(blobUrl, '_blank')
  }
}
