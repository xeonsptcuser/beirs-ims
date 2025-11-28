<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import certBrgyClearancePdf from '../../../../assets/pdf/cert-clearance.pdf'
import certIndigencyPdf from '../../../../assets/pdf/cert-indigency.pdf'
import certResidencyPdf from '../../../../assets/pdf/cert-residency.pdf'


const props = defineProps<{
  certificateId: string,
  certificateType?: string,
}>()

const pdfService = PdfRelatedService.getInstance()

const certBrgyClearance = certBrgyClearancePdf
const certIndigency = certIndigencyPdf
const certResidency = certResidencyPdf

const templateMap: Record<string, string> = {
  clearance: certBrgyClearance,
  indigency: certIndigency,
  residency: certResidency,
}

const pdfTemplateUrl = computed(() => {
  const requestedType = props.certificateType?.toLowerCase()
  const payloadType = payload.value?.cert_request_type?.toLowerCase()
  const resolvedType = requestedType || payloadType

  return (resolvedType && templateMap[resolvedType]) || certBrgyClearance
})

const pdfUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const payload = ref<Record<string, any> | null>(null)

type CertificateData = Record<string, any>

const iframeSrc = computed(() => (pdfUrl.value ? `${pdfUrl.value}#toolbar=0&navpanes=0&statusbar=0` : ''))

const positions = {
  full_name: { x: 140, y: 640, size: 14 },
  address: { x: 140, y: 610, size: 12 },
  purpose: { x: 140, y: 580, size: 12 },
  issued_at: { x: 140, y: 550, size: 12 },
}

const drawText = (
  page: any,
  font: any,
  key: keyof typeof positions,
  value: string | undefined | null
) => {
  if (!value) return
  const pos = positions[key]
  page.drawText(String(value), {
    x: pos.x,
    y: pos.y,
    size: pos.size,
    font,
  })
}

const buildPdfWithData = async (data: CertificateData) => {
  const templateBytes = await fetch(pdfTemplateUrl.value).then((res) => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  drawText(page, font, 'full_name', data.full_name)
  drawText(page, font, 'address', data.address)
  drawText(page, font, 'purpose', data.purpose)
  drawText(page, font, 'issued_at', data.issued_at)

  const pdfBytes = await pdfDoc.save()
  if (pdfUrl.value) {
    globalThis.URL.revokeObjectURL(pdfUrl.value)
  }
  const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
  pdfUrl.value = globalThis.URL.createObjectURL(pdfBlob)
}

const loadCertificateData = async () => {
  if (!props.certificateId) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await pdfService.fetchPdfData<CertificateData>(
      endpoints.OPEN_CERTIFICATE_PDF(props.certificateId)
    )
    if (response?.status !== 'success') {
      throw new Error(response?.message || 'Failed to load certificate data.')
    }
    payload.value = response.data
    await buildPdfWithData(response.data)
  } catch (error: any) {
    errorMessage.value = error?.message ?? 'Failed to load certificate data.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCertificateData)

watch(
  () => props.certificateId,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loadCertificateData()
    }
  }
)

watch(
  () => props.certificateType,
  (newVal, oldVal) => {
    if (newVal !== oldVal && payload.value) {
      buildPdfWithData(payload.value)
    }
  }
)

onBeforeUnmount(() => {
  if (pdfUrl.value) {
    globalThis.URL.revokeObjectURL(pdfUrl.value)
  }
})
</script>

<template>
  <div class="mt-3 d-flex flex-column gap-3">
    <div>
      <p v-if="isLoading" class="text-muted mb-2">Loading PDF preview…</p>
      <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <iframe v-else-if="pdfUrl" :src="iframeSrc" title="pdf" width="100%" height="800"
        style="border: 1px solid #ccc;"></iframe>
      <p v-else class="text-muted mb-0">No preview available.</p>
    </div>

    <div v-if="payload" class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-semibold mb-3">Certificate Data (from backend)</h6>
        <pre class="mb-0 bg-light p-3 rounded"
          style="white-space: pre-wrap;">{{ JSON.stringify(payload, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
