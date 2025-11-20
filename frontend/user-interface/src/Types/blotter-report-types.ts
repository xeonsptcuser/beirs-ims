import type { UserProfile } from './user-related-types'

export interface BlotterReport {
  incidentType: string
  incidentTitle: string
  dateOfIncident: string
  timeOfIncident: string
  incidentStreetAddress: string
  incidentAddressLine: string
  incidentPeopleInvolved: string[]
  incidentWitnesses: string[]
  incidentDescription: string
  evidences: File[]
}

export type BlotterReportStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'rejected'
  | 'cancelled'
  | 'released'
  | 'done'

export interface BlotterReportRequestPayload {
  incident_type: string
  incident_title: string
  date_of_incident: string
  time_of_incident: string
  incident_street_address: string
  incident_address_line: string
  incident_people_involved: string[]
  incident_witnesses: string[]
  incident_description: string
  evidences: File[]
}

export interface BlotterEvidence {
  id: number
  blotter_report_id: number
  storage_path: string
  original_name: string
  mime_type: string
  size: number
  created_at: string
  updated_at: string
}

export interface BlotterReportResponse {
  id: number
  incident_type: string
  incident_title?: string | null
  datetime_of_incident: string
  location: string
  landmark?: string | null
  person_involved?: string[] | null
  witnesses?: string[] | null
  description: string
  remarks?: string | null
  status: BlotterReportStatus
  profile: UserProfile
  handler?: UserProfile | null
  created_at: string
  updated_at: string
  evidence?: BlotterEvidence[]
}

export interface UpdateBlotterReportRequestPayload {
  status: BlotterReportStatus
}
