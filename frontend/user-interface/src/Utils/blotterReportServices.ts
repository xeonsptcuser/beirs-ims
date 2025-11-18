import { endpoints } from '@/services/api/endpoints'
import { BlotterReportRelatedService } from '@/services/api/http/blotter-report-related-services'
import type {
  BlotterReportRequestPayload,
  PageInfo,
  UpdateBlotterReportRequestPayload,
} from '@/Types'

const blotterReportRelatedServices = BlotterReportRelatedService.getInstance()

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
    endpoints.GET_ALL_CERTIFICATE_BY_ID,
    params
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to retrieve blotter reports.')
  }

  return response
}

export const submitBlotterReport = async (data: BlotterReportRequestPayload, userId: string) => {
  const response = await blotterReportRelatedServices.createBlotterReports(
    data,
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
    endpoints.UPDATE_CERTIFICATE(userId),
    data
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to update blotter report.')
  }

  return response
}
