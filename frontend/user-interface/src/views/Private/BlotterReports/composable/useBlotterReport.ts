import type { BlotterReport, IncidentType } from '@/Types/blotter-report-types'
import { ref } from 'vue'

export function useBlotterReports() {
  const incidentTypeOptions: IncidentType[] = [
    {
      id: 'personal-conflict',
      label: 'Personal Conflicts / Misunderstandings',
    },

    {
      id: 'noice-disturbance',
      label: 'Noise Disturbance',
    },
    {
      id: 'trespassing',
      label: 'Trespassing / Loitering',
    },
    {
      id: 'harrasment-threat',
      label: 'Threats / Harassment',
    },
    {
      id: 'physical-injury',
      label: 'Minor Physical Injury',
    },
    {
      id: 'vandalism',
      label: 'Vandalism / Property Damage',
    },
    {
      id: 'theft',
      label: 'Theft (Petty)',
    },
    {
      id: 'domestic-dispute',
      label: 'Domestic Disputes',
    },
    {
      id: 'animal-related',
      label: 'Animal-Related Concerns',
    },
    {
      id: 'curfew-violation',
      label: 'Curfew Violations (if applicable)',
    },
    {
      id: 'public-disturbance',
      label: 'Public Disturbance',
    },
    {
      id: 'lost-and-found',
      label: 'Lost & Found Reports',
    },
    {
      id: 'brgy-service-complaint',
      label: 'Complaints Regarding Barangay Services',
    },
    {
      id: 'others',
      label: 'Others',
    },
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

    if (form.value.evidences.length === 0) {
      errors.value.evidences = true
      errorMessages.value.evidences.error = 'Please provide evidences to support your claims.'
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
