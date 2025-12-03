<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'
import blotterForm from '../../../../assets/pdf/blotter-form.pdf'
import { useBlotterReports } from '../composable/useBlotterReport'
import { addOrdinalSuffix } from '@/Utils/helpers/formatters'
import { useRouter } from 'vue-router'

const props = defineProps<{
  blotterId: string
}>()

const pdfService = PdfRelatedService.getInstance()

const { incidentTypeOptions } = useBlotterReports();

// Static PDF template
const pdfTemplateUrl = blotterForm

const pdfUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const payload = ref<Record<string, any> | null>(null)
const router = useRouter()

type BlotterData = Record<string, any>

const positions = {
  case_number: { x: 460, y: 840, size: 12 },
  complainant: { x: 80, y: 840, size: 14 },
  people_involved: { x: 75, y: 728, size: 12 },
  incident_type: { x: 385, y: 811, size: 11 },
  location: { x: 140, y: 290, size: 12 },
  description: { x: 115, y: 562, size: 12 },
  incident_month: { x: 350, y: 230, size: 12 },
  incident_day: { x: 180, y: 230, size: 12 },
  incident_year: { x: 470, y: 230, size: 12 },
  file_month: { x: 350, y: 135, size: 12 },
  file_day: { x: 235, y: 135, size: 12 },
  file_year: { x: 470, y: 135, size: 12 },

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

    // Handle exceptionally long words by breaking them
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

const drawWrappedText = (
  page: any,
  font: any,
  key: keyof typeof positions,
  value: string | undefined | null,
  maxWidth: number,
  lineHeight: number
) => {
  if (!value) return
  const pos = positions[key]
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

const formatPeopleInvolved = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.filter((v) => !!v).join(', ')
  }
  if (typeof value === 'string') return value
  return ''
}

const buildPdfWithData = async (data: BlotterData) => {
  const templateBytes = await fetch(pdfTemplateUrl).then((res) => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)


  const incidentType = incidentTypeOptions.find(type => type.id === data.incident_type)
  const dateToday = new Date();
  const file_month = dateToday.toLocaleString('en-US', { month: 'long' }); // e.g. "December"
  const file_day = String(dateToday.getDate());                           // e.g. "30"
  const file_year = String(dateToday.getFullYear()).match(/.{1,2}/g)?.[1] ?? '';

  const formattedLocation = computed(() => {
    return `sitio ${data.location}`;
  });

  drawText(page, font, 'case_number', data.case_number)
  drawText(page, font, 'complainant', data.complainant)
  drawText(page, font, 'incident_type', incidentType?.label)
  drawWrappedText(page, font, 'description', data.description.toUpperCase(), 420, 27)
  drawWrappedText(page, font, 'people_involved', formatPeopleInvolved(data.person_involved), 220, 26)
  drawText(page, font, 'location', formattedLocation.value.toUpperCase())
  drawText(page, font, 'incident_month', file_month)
  drawText(page, font, 'incident_day', addOrdinalSuffix(file_day))
  drawText(page, font, 'incident_year', file_year)
  drawText(page, font, 'file_month', file_month)
  drawText(page, font, 'file_day', addOrdinalSuffix(file_day))
  drawText(page, font, 'file_year', file_year)

  const pdfBytes = await pdfDoc.save()
  if (pdfUrl.value) {
    globalThis.URL.revokeObjectURL(pdfUrl.value)
  }
  const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
  pdfUrl.value = globalThis.URL.createObjectURL(pdfBlob)
}

const iframeSrc = computed(() => (pdfUrl.value ? `${pdfUrl.value}#toolbar=0&navpanes=0&statusbar=0` : ''))


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

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="mt-3 d-flex flex-column gap-3">
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="goBack">
        <i class="bi bi-arrow-left me-1"></i>
        Back to blotter report
      </button>
    </div>
    <div class="d-flex justify-content-center mb-4">
      <p v-if="isLoading" class="text-muted mb-2">Loading PDF preview…</p>
      <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <iframe v-else-if="pdfUrl" :src="iframeSrc" title="pdf" width="100%" height="1380"
        style="border: 1px solid #ccc;"></iframe>
      <p v-else class="text-muted mb-0">No preview available.</p>
    </div>
  </div>
</template>
