import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import type { ApiResponse } from '@/Types'
import type {
  PdfBlotterReportDataResponse,
  PdfCertificateRequestDataResponse,
} from '@/Types/pdf-types'

const pdfService = PdfRelatedService.getInstance()

export const fetchOpenCertificatePreview = async (certId: string) => {
  return await pdfService.fetchPdfData<ApiResponse<PdfCertificateRequestDataResponse>>(
    endpoints.OPEN_CERTIFICATE_PDF(certId)
  )
}

export const fetchOpenBlotterReportPreview = async (blotterId: string) => {
  return await pdfService.fetchPdfData<ApiResponse<PdfBlotterReportDataResponse>>(
    endpoints.OPEN_BLOTTER_REPORT_PDF(blotterId)
  )
}
