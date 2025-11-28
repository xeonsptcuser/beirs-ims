<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import blotterForm from '@/assets/images/pdf/blotter-form.pdf'

const props = defineProps<{
  blotterId: string
}>()

const pdfService = PdfRelatedService.getInstance()

// Static PDF template
const pdfTemplateUrl = blotterForm

const pdfUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const payload = ref<Record<string, any> | null>(null)

type BlotterData = Record<string, any>

const positions = {
  case_number: { x: 80, y: 700, size: 12 },
  complainant: { x: 140, y: 660, size: 14 },
  contact: { x: 140, y: 640, size: 12 },
  address: { x: 140, y: 620, size: 12 },
  incident_title: { x: 140, y: 590, size: 12 },
  incident_datetime: { x: 140, y: 570, size: 12 },
  location: { x: 140, y: 550, size: 12 },
  landmark: { x: 140, y: 530, size: 12 },
  description: { x: 140, y: 300, size: 12 },
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

const buildPdfWithData = async (data: BlotterData) => {
  const templateBytes = await fetch(pdfTemplateUrl).then((res) => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  drawText(page, font, 'case_number', data.case_number)
  drawText(page, font, 'complainant', data.complainant)
  drawText(page, font, 'contact', data.contact)
  drawText(page, font, 'address', data.address)
  drawText(page, font, 'incident_title', data.incident_title)
  drawText(page, font, 'incident_datetime', data.incident_datetime)
  drawText(page, font, 'location', data.location)
  drawText(page, font, 'landmark', data.landmark)
  drawText(page, font, 'description', data.description)

  const pdfBytes = await pdfDoc.save()
  if (pdfUrl.value) {
    globalThis.URL.revokeObjectURL(pdfUrl.value)
  }
  const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
  pdfUrl.value = globalThis.URL.createObjectURL(pdfBlob)
}

const loadBlotterData = async () => {
  if (!props.blotterId) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await pdfService.fetchPdfData<BlotterData>(
      endpoints.OPEN_BLOTTER_REPORT_PDF(props.blotterId)
    )
    if (response?.status !== 'success') {
      throw new Error(response?.message || 'Failed to load blotter report data.')
    }
    payload.value = response.data
    await buildPdfWithData(response.data)
  } catch (error: any) {
    errorMessage.value = error?.message ?? 'Failed to load blotter report data.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadBlotterData)

watch(
  () => props.blotterId,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loadBlotterData()
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
      <iframe v-else-if="pdfUrl" :src="pdfUrl" title="pdf" width="100%" height="800"
        style="border: 1px solid #ccc;"></iframe>
      <p v-else class="text-muted mb-0">No preview available.</p>
    </div>

    <div v-if="payload" class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-semibold mb-3">Blotter Report Data (from backend)</h6>
        <pre class="mb-0 bg-light p-3 rounded"
          style="white-space: pre-wrap;">{{ JSON.stringify(payload, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
