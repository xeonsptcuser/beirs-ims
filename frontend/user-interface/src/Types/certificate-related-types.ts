import type { UserProfile } from './user-related-types'

export interface CreateCertificateFormRequest {
  certificateRequestType: string
  startResidencyDate?: string
  endResidencyDate?: string
  certificateRequestReason: string
  isCurrent?: boolean
}

export interface CreateCertificateRequestPayload {
  cert_request_type: string
  start_residency_date?: string | null
  end_residency_date?: string | null
  cert_request_reason: string
}

export interface CertificateRequestsResponse {
  id: number
  profile: UserProfile
  cert_request_type: string
  start_residency_date?: string
  end_residency_date?: string
  cert_request_reason: string
  created_at: string
  status: string
}
