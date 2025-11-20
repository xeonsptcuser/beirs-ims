import type { BlotterReport } from '@/Types/blotter-report-types'
import { ref } from 'vue'

export function useBlotterReports() {
  const incidentTypeOptions: string[] = [
    'Personal Conflicts / Misunderstandings',
    'Noise Disturbance',
    'Trespassing / Loitering',
    'Threats / Harassment',
    'Minor Physical Injury',
    'Vandalism / Property Damage',
    'Theft (Petty)',
    'Domestic Disputes',
    'Animal-Related Concerns',
    'Curfew Violations (if applicable)',
    'Public Disturbance',
    'Lost & Found Reports',
    'Complaints Regarding Barangay Services',
  ]

  const form = ref<BlotterReport>({
    incidentType: '',
    incidentTitle: '',
    dateOfIncident: '',
    timeOfIncident: '',
    incidentStreetAddress: '',
    incidentAddressLine: '',
    incidentPeopleInvolved: [''],
    incidentWitnesses: [''],
    incidentDescription: '',
    evidences: [],
  })

  const errors = ref<Record<keyof BlotterReport, boolean>>({
    incidentType: false,
    incidentTitle: false,
    dateOfIncident: false,
    timeOfIncident: false,
    incidentStreetAddress: false,
    incidentAddressLine: false,
    incidentPeopleInvolved: false,
    incidentWitnesses: false,
    incidentDescription: false,
    evidences: false,
  })

  const errorMessages = ref<Record<keyof BlotterReport, { error: string }>>({
    incidentType: { error: '' },
    incidentTitle: { error: '' },
    dateOfIncident: { error: '' },
    timeOfIncident: { error: '' },
    incidentStreetAddress: { error: '' },
    incidentAddressLine: { error: '' },
    incidentPeopleInvolved: { error: '' },
    incidentWitnesses: { error: '' },
    incidentDescription: { error: '' },
    evidences: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof BlotterReport)[]) {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    }
  }

  const validateForm = () => {
    resetErrors()

    let isValid = true

    if (!form.value.incidentType.trim()) {
      errors.value.incidentType = true
      errorMessages.value.incidentType.error = 'Incident type is required.'
      isValid = false
    }
    if (!form.value.incidentTitle.trim()) {
      errors.value.incidentTitle = true
      errorMessages.value.incidentTitle.error = 'Incident subject/title is required.'
      isValid = false
    }
    if (!form.value.dateOfIncident.trim()) {
      errors.value.dateOfIncident = true
      errorMessages.value.dateOfIncident.error = 'Date of the incident is required.'
      isValid = false
    }
    if (!form.value.timeOfIncident.trim()) {
      errors.value.timeOfIncident = true
      errorMessages.value.timeOfIncident.error = 'Time of the incident is required.'
      isValid = false
    }
    if (!form.value.incidentStreetAddress.trim() && !form.value.incidentAddressLine.trim()) {
      errors.value.incidentStreetAddress = true
      errors.value.incidentAddressLine = true
      errorMessages.value.incidentStreetAddress.error =
        'Please indicate where the incident took place.'
      errorMessages.value.incidentAddressLine.error =
        'Please indicate a landmark to pinpoint the scene of the incident'
      isValid = false
    }
    if (!form.value.incidentDescription.trim()) {
      errors.value.incidentDescription = true
      errorMessages.value.incidentDescription.error = 'Description of the incident is required.'
      isValid = false
    }

    return isValid
  }

  const setServerErrors = (apiErrors?: Record<string, string[]>, fallbackMessage?: string) => {
    resetErrors()

    const fieldMap: Record<string, keyof BlotterReport> = {
      incident_type: 'incidentType',
      incident_title: 'incidentTitle',
      date_of_incident: 'dateOfIncident',
      time_of_incident: 'timeOfIncident',
      incident_street_address: 'incidentStreetAddress',
      incident_address_line: 'incidentAddressLine',
      incident_people_involved: 'incidentPeopleInvolved',
      incident_witnesses: 'incidentWitnesses',
      incident_description: 'incidentDescription',
      evidences: 'evidences',
    }

    if (!apiErrors || Object.keys(apiErrors).length === 0) {
      if (fallbackMessage) {
        errorMessages.value.incidentType.error = fallbackMessage
        errors.value.incidentType = true
      }
      return
    }

    for (const [field, messages] of Object.entries(apiErrors)) {
      const key = fieldMap[field]
      if (!key) {
        continue
      }

      errors.value[key] = true
      errorMessages.value[key] = {
        error: messages?.[0] ?? fallbackMessage ?? 'Please review this field.',
      }
    }
  }

  return {
    form,
    errors,
    errorMessages,
    incidentTypeOptions,
    validateForm,
    setServerErrors,
  }
}
