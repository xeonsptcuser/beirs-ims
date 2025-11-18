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

export interface BlotterReportResponse {
  // Update Keys: Types
  key: string
}

export interface UpdateBlotterReportRequestPayload {
  // Update Keys: Types
}
