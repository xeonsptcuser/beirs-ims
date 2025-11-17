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
  is_current?: boolean
}

export interface UpdateCertificateRequestPayload {
  status: StatusOptions
}
export interface CertificateRequestsResponse {
  id: number
  profile: UserProfile
  cert_request_type: string
  start_residency_date?: string
  end_residency_date?: string
  cert_request_reason: string
  handler: UserProfile
  is_current?: boolean
  created_at: string
  updated_at?: string
  status: string
}

export type StatusOptions = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'released' | 'done'
