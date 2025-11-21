import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'

const pdfService = PdfRelatedService.getInstance()

export const fetchOpenCertificatePreview = async (certId: string) => {
  await pdfService.fetchPdfData(endpoints.OPEN_CERTIFICATE_PDF(certId))
}

export const fetchOpenBlotterReportPreview = async (blotterId: string) => {
  await pdfService.fetchPdfData(endpoints.OPEN_BLOTTER_REPORT_PDF(blotterId))
}
