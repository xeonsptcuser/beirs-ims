<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import { addOrdinalSuffix, computeAge } from '@/Utils/helpers/formatters'
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

type CertificateField = 'full_name' | 'address' | 'age' | 'month' | 'day' | 'last_name'
type CertificateFieldMap = Partial<Record<CertificateField, FieldPosition>>

type FieldPosition = {
  x: number,
  y: number,
  size: number,
}

const basePositions: CertificateFieldMap = {
  full_name: { x: 290, y: 536, size: 12 },
  last_name: { x: 417, y: 402, size: 10 },
  age: { x: 495, y: 536, size: 12 },
  address: { x: 295, y: 515, size: 7.8 },
  month: { x: 215, y: 218, size: 12 },
  day: { x: 540, y: 240, size: 12 },

}

const positionMap: Record<string, CertificateFieldMap> = {
  clearance: basePositions,
  indigency: {
    full_name: { x: 270, y: 532, size: 12 },
    address: { x: 160, y: 510, size: 7.7 },
    month: { x: 380, y: 361, size: 12 },
    day: { x: 305, y: 361, size: 10 },
  },
  residency: {
    full_name: { x: 300, y: 515, size: 12 },
    address: { x: 238, y: 500, size: 9 },
    age: { x: 480, y: 515, size: 12 },
    month: { x: 275, y: 302, size: 12 },
    day: { x: 223, y: 302, size: 12 },
  },
}

const resolvedPositions = computed<CertificateFieldMap>(() => {
  const payloadType = payload.value?.cert_request_type?.toLowerCase()
  const requestedType = props.certificateType?.toLowerCase()
  const certificateType = requestedType || payloadType

  return (certificateType && positionMap[certificateType]) || basePositions
})

const drawText = (
  page: any,
  font: any,
  key: CertificateField,
  value: string | undefined | null
) => {
  if (!value) return
  const pos = resolvedPositions.value[key]
  if (!pos) return
  page.drawText(String(value), {
    x: pos.x,
    y: pos.y,
    size: pos.size,
    font,
  })
}

const separateDate = (dateStr: string) => {

  if (!dateStr) return;

  const month = dateStr.split(/[ ,]+/)[0]
  const day = dateStr.split(/[ ,]+/)[1]
  const year = dateStr.split(/[ ,]+/)[2]

  return { day, month, year }
}



const buildPdfWithData = async (data: CertificateData) => {
  const templateBytes = await fetch(pdfTemplateUrl.value).then((res) => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const fullName = data.full_name.toUpperCase()
  const splitName = fullName.split(' ');
  const lastName = computed(() => {
    return `Mr/Ms ${splitName[splitName.length - 1]}`
  });
  const homeAddress = data.address.toUpperCase()
  const fullDate = data.issued_at;
  const age = computeAge(data.date_of_birth)
  const splitDate = separateDate(fullDate);

  drawText(page, font, 'full_name', fullName)
  drawText(page, font, 'last_name', lastName.value)
  drawText(page, font, 'address', homeAddress)
  drawText(page, font, 'day', addOrdinalSuffix(splitDate?.day ?? 0))
  drawText(page, font, 'month', splitDate?.month)
  drawText(page, font, 'age', age)

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
  <div class="my-4 d-flex flex-column gap-3">
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
