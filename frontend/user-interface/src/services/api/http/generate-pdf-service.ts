import api from '@/services/api/axios'

export const openCertificatePdf = async (certificateId: string) => {
  const response = await api.get(`/api/pdf/certificates/${certificateId}/preview`, {
    responseType: 'blob',
  })
  const blobUrl = globalThis.URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' })
  )
  window.open(blobUrl, '_blank')
}

export const openBlotterPdf = async (blotterId: string) => {
  const response = await api.get(`/api/pdf/blotter/${blotterId}/preview`, {
    responseType: 'blob',
  })
  const blobUrl = globalThis.URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' })
  )
  window.open(blobUrl, '_blank')
}
