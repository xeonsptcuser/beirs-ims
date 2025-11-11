import type { UserProfile } from './user-related-types'

export interface CreateCertificateFormRequest {
  certificateRequestType: string
  startResidencyDate?: string
  endResidencyDate?: string
  certificateRequestReason: string
  isPresent?: boolean
}

export interface CreateCertificateRequestPayload {
  cert_request_type: string
  start_residency_date?: string
  end_residency_date?: string
  certificate_request_reason: string
}

export interface CertificateRequestsResponse {
  certificateId: number
  userProfile: UserProfile
  certificateRequestType: string
  startResidencyDate?: string
  endResidencyDate?: string
  certificateRequestReason: string
}
