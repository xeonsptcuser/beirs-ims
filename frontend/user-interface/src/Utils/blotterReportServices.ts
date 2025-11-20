import { endpoints } from '@/services/api/endpoints'
import { BlotterReportRelatedService } from '@/services/api/http/blotter-report-related-services'
import type {
  BlotterReportRequestPayload,
  PageInfo,
  UpdateBlotterReportRequestPayload,
} from '@/Types'

const blotterReportRelatedServices = BlotterReportRelatedService.getInstance()

const buildBlotterFormData = (data: BlotterReportRequestPayload) => {
  const formData = new FormData()

  formData.append('incident_type', data.incident_type)
  formData.append('incident_title', data.incident_title ?? '')
  formData.append('date_of_incident', data.date_of_incident)
  formData.append('time_of_incident', data.time_of_incident)
  formData.append('incident_street_address', data.incident_street_address ?? '')
  formData.append('incident_address_line', data.incident_address_line ?? '')
  formData.append('incident_description', data.incident_description)

  const appendStringArray = (key: string, values?: string[]) => {
    if (!values || !values.length) {
      return
    }

    values
      .filter((value) => !!value && value.trim().length > 0)
      .forEach((value) => formData.append(`${key}[]`, value.trim()))
  }

  appendStringArray('incident_people_involved', data.incident_people_involved)
  appendStringArray('incident_witnesses', data.incident_witnesses)

  data.evidences?.forEach((file) => {
    formData.append('evidences[]', file)
  })

  return formData
}

export const fetchAllBlotterReports = async (params?: PageInfo) => {
  const response = await blotterReportRelatedServices.getAllBlotterReports(
    endpoints.GET_ALL_BLOTTER_REPORTS,
    params
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to retrieve blotter reports.')
  }

  return response
}

export const fetchAllBlotterReportsById = async (params?: PageInfo) => {
  const response = await blotterReportRelatedServices.getAllBlotterReports(
    endpoints.GET_ALL_BLOTTER_REPORTS_BY_ID,
    params
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to retrieve blotter reports.')
  }

  return response
}

export const submitBlotterReport = async (data: BlotterReportRequestPayload, userId: string) => {
  const payload = buildBlotterFormData(data)
  const response = await blotterReportRelatedServices.createBlotterReports(
    payload,
    endpoints.CREATE_BLOTTER_REPORT(userId)
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to submit blotter report.')
  }

  return response
}

export const fetchBlotterReportInfo = async (userId: string) => {
  const response = await blotterReportRelatedServices.getSingleBlotterReport(
    endpoints.GET_BLOTTER_REPORT(userId)
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to fetch blotter report.')
  }

  return response
}

export const updateBlotterReport = async (
  userId: string,
  data: UpdateBlotterReportRequestPayload
) => {
  const response = await blotterReportRelatedServices.updateBlotterReport(
    endpoints.UPDATE_BLOTTER_REPORT(userId),
    data
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to update blotter report.')
  }

  return response
}
