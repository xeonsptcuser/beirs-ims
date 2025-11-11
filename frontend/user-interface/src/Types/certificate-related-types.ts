export interface CreateCertificateFormRequest {
  certificateRequestType: string
  startResidencyDate?: string
  endResidencyDate?: string
  isPresent?: boolean
  certificateRequestReason: string
}
