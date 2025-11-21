<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { endpoints } from '@/services/api/endpoints'
import { PdfRelatedService } from '@/services/api/http/pdf-service'

const props = defineProps<{
  certificateId: string
}>()

const pdfService = PdfRelatedService.getInstance()

// Static PDF from assets
const pdfUrl = ref<string | null>(new URL('@/assets/pdf/affidavit.pdf', import.meta.url).href)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const payload = ref<Record<string, any> | null>(null)

const loadCertificateData = async () => {
  if (!props.certificateId) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await pdfService.fetchPdfData<Record<string, any>>(
      endpoints.OPEN_CERTIFICATE_PDF(props.certificateId)
    )
    if (response?.status !== 'success') {
      throw new Error(response?.message || 'Failed to load certificate data.')
    }
    payload.value = response.data
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
        <h6 class="fw-semibold mb-3">Certificate Data (from backend)</h6>
        <pre class="mb-0 bg-light p-3 rounded" style="white-space: pre-wrap;">{{ JSON.stringify(payload, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
