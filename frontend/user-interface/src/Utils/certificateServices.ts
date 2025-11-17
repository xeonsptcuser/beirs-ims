import { endpoints } from '@/services/api/endpoints'
import { CertificateRelatedService } from '@/services/api/http/certificate-related-services'
import type { PageInfo } from '@/Types'
import type {
  CreateCertificateRequestPayload,
  UpdateCertificateRequestPayload,
} from '@/Types/certificate-related-types'

const certificateRelatedServices = CertificateRelatedService.getInstance()

export const fetchAllCertificates = async (params?: PageInfo) => {
  const response = await certificateRelatedServices.getAllCertificateRequests(
    endpoints.GET_ALL_CERTIFICATE,
    params
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to retrieve certificate requests.')
  }

  return response
}
export const fetchAllCertificatesById = async (params?: PageInfo) => {
  const response = await certificateRelatedServices.getAllCertificateRequests(
    endpoints.GET_ALL_CERTIFICATE_BY_ID,
    params
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to retrieve certificate requests.')
  }

  return response
}

export const submitCertificationRequest = async (
  data: CreateCertificateRequestPayload,
  userId: string
) => {
  const response = await certificateRelatedServices.createCertificateRequest(
    data,
    endpoints.CREATE_CERTIFICATE(userId)
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to submit certificate request.')
  }

  return response
}

export const fetchCertificateInfo = async (userId: string) => {
  const response = await certificateRelatedServices.getSingleCertificateRequest(
    endpoints.GET_CERTIFICATE(userId)
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to fetch certificate request.')
  }

  return response
}

export const updateCertificateRequest = async (
  userId: string,
  data: UpdateCertificateRequestPayload
) => {
  const response = await certificateRelatedServices.updateSingleCertificateRequest(
    endpoints.UPDATE_CERTIFICATE(userId),
    data
  )

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to submit certificate request.')
  }

  return response
}
