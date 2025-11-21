export interface PdfBlotterReportDataResponse {
  case_number: string
  complainant: string
  contact: string
  address: string
  incident_title: string
  incident_type: string
  incident_datetime: string
  location: string
  landmark: string | null
  person_involved: string[] // array of strings
  witnesses: string[] // array of strings
  description: string
  remarks: string | null
  handled_by: string
}

export interface PdfCertificateRequestDataResponse {
  full_name: string
  address: string
  date_of_birth: string | null
  cert_request_type: string
  purpose: string
  residency_start: string
  residency_end: string
  issued_at: string
  is_current: boolean
}
