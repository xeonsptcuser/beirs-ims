<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import { addOrdinalSuffix, computeAge } from '@/Utils/helpers/formatters'
import { useSessionStore } from '@/Utils/store/useSessionStore'


const props = defineProps<{
  certificateId: string,
  certificateType?: string,
}>()

const pdfService = PdfRelatedService.getInstance()
const session = useSessionStore();

const certBrgyClearance = computed(() => {
  if (session.isRoleResident()) {
    return new URL('../../../../assets/pdf/cert-clearance-w.pdf', import.meta.url).href
  }
  return new URL('../../../../assets/pdf/cert-clearance.pdf', import.meta.url).href
})

const certIndigency = computed(() => {
  if (session.isRoleResident()) {
    return new URL('../../../../assets/pdf/cert-indigency-w.pdf', import.meta.url).href
  }
  return new URL('../../../../assets/pdf/cert-indigency-w.pdf', import.meta.url).href
})

const certResidency = computed(() => {
  if (session.isRoleResident()) {
    return new URL('../../../../assets/pdf/cert-residency-w.pdf', import.meta.url).href
  }
  return new URL('../../../../assets/pdf/cert-residency.pdf', import.meta.url).href
})


const templateMap: Record<string, string> = {
  clearance: certBrgyClearance.value,
  indigency: certIndigency.value,
  residency: certResidency.value,
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
const router = useRouter()


type CertificateData = Record<string, any>

const iframeSrc = computed(() => (pdfUrl.value && session.isRoleResident() ? `${pdfUrl.value}#toolbar=0&navpanes=0&statusbar=0` : `${pdfUrl.value}`))

type CertificateField = 'full_name' | 'address' | 'age' | 'month' | 'day' | 'last_name' | 'purpose'
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
    purpose: { x: 200, y: 402, size: 12 },
    month: { x: 380, y: 305, size: 12 },
    day: { x: 305, y: 305, size: 10 },
  },
  residency: {
    full_name: { x: 300, y: 515, size: 12 },
    address: { x: 238, y: 500, size: 9 },
    age: { x: 480, y: 515, size: 12 },
    purpose: { x: 200, y: 415, size: 12 },
    month: { x: 275, y: 260, size: 12 },
    day: { x: 223, y: 260, size: 12 },
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

const wrapText = (text: string, maxWidth: number, font: any, size: number): string[] => {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (font.widthOfTextAtSize(testLine, size) <= maxWidth) {
      currentLine = testLine
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      let chunk = ''
      for (const char of word) {
        const testChunk = `${chunk}${char}`
        if (font.widthOfTextAtSize(testChunk, size) <= maxWidth) {
          chunk = testChunk
        } else {
          lines.push(chunk)
          chunk = char
        }
      }
      currentLine = chunk
    } else {
      currentLine = word
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

const drawWrappedText = (
  page: any,
  font: any,
  key: CertificateField,
  value: string | undefined | null,
  maxWidth: number,
  lineHeight: number
) => {
  if (!value) return
  const pos = resolvedPositions.value[key]
  if (!pos) return
  const lines = wrapText(String(value), maxWidth, font, pos.size)
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: pos.x,
      y: pos.y - index * lineHeight,
      size: pos.size,
      font,
    })
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
  const purpose = data.purpose

  drawText(page, font, 'full_name', fullName)
  drawText(page, font, 'last_name', lastName.value)
  drawText(page, font, 'address', homeAddress)
  drawWrappedText(page, font, 'purpose', purpose, 380, 14)
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
    console.log(payload.value)
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

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="my-4 d-flex flex-column gap-3">
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="goBack">
        <i class="bi bi-arrow-left me-1"></i>
        Back to certificate
      </button>
    </div>
    <div class="d-flex justify-content-center mb-4">
      <p v-if="isLoading" class="text-muted mb-2">Loading PDF preview…</p>
      <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <iframe v-else-if="pdfUrl" :src="iframeSrc" title="pdf" width="100%" height="1080"
        style="border: 1px solid #ccc;"></iframe>
      <p v-else class="text-muted mb-0">No preview available.</p>
    </div>
  </div>
</template>
