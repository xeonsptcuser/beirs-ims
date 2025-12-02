<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import DragAndDropUploadFiles from './DragAndDropUploadFiles.vue'

type FilePreview = {
  id: string
  name: string
  displayName: string
  size: number
  url: string | null
}

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  multiple?: boolean
  accept?: string
  maxFiles?: number
  enforceEvidenceRules?: boolean
  maxImageSizeBytes?: number
  maxVideoSizeBytes?: number
  allowedImageTypes?: string[]
  allowedVideoTypes?: string[]
}>(), {
  isDisabled: false,
  multiple: true,
  accept: '.png,.jpg,.jpeg,.mp4',
  maxFiles: 10,
  enforceEvidenceRules: true,
  maxImageSizeBytes: 5 * 1024 * 1024,
  maxVideoSizeBytes: 100 * 1024 * 1024,
  allowedImageTypes: () => ['image/jpeg', 'image/png', 'image/jpg'],
  allowedVideoTypes: () => ['video/mp4'],
})

const files = defineModel<File[]>({ default: [] })
const filePreviews = ref<FilePreview[]>([])
const uploadError = ref<string>('')

const allowedMimeTypes = computed(() => [...props.allowedImageTypes, ...props.allowedVideoTypes])
const slotsRemaining = computed(() => Math.max(0, props.maxFiles - files.value.length))

const buildPreviewId = (file: File, index: number) =>
  `${file.name}-${file.lastModified}-${file.size}-${index}`

const extractDisplayName = (fileName: string) => {
  const trimmed = fileName.trim()
  if (!trimmed.includes('.')) {
    return trimmed
  }

  const segments = trimmed.split('.')
  segments.pop()

  const stripped = segments.join('.')
  return stripped.length ? stripped : trimmed
}

const updatePreviews = () => {

  for (const preview of filePreviews.value) {
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
  }

  filePreviews.value = files.value.map((file, index) => {
    const isImage = file.type?.startsWith('image/')
    return {
      id: buildPreviewId(file, index),
      name: file.name,
      displayName: extractDisplayName(file.name),
      size: file.size,
      url: isImage ? URL.createObjectURL(file) : null,
    }
  })
}

const handleFiles = (selectedFiles: FileList | File[]) => {
  const uploads = Array.from(selectedFiles)

  if (slotsRemaining.value === 0) {
    uploadError.value = `You have reached the maximum of ${props.maxFiles} file(s).`
    return
  }

  if (!props.enforceEvidenceRules) {
    const allowed = uploads.slice(0, slotsRemaining.value)
    files.value = [...files.value, ...allowed]
    uploadError.value = uploads.length > allowed.length ? `Only ${slotsRemaining.value} more file(s) can be added.` : ''
    return
  }

  const validFiles: File[] = []
  const rejected: string[] = []

  for (const file of uploads) {
    if (!allowedMimeTypes.value.includes(file.type)) {
      rejected.push(`${file.name}: Only JPG/JPEG/PNG images or MP4 videos are allowed.`)
      continue
    }

    if (props.allowedImageTypes.includes(file.type) && file.size > props.maxImageSizeBytes) {
      rejected.push(`${file.name}: Images must be 5MB or smaller.`)
      continue
    }

    if (props.allowedVideoTypes.includes(file.type) && file.size > props.maxVideoSizeBytes) {
      rejected.push(`${file.name}: Videos must be 100MB or smaller.`)
      continue
    }

    validFiles.push(file)
  }

  if (validFiles.length > slotsRemaining.value) {
    rejected.push(`Only ${slotsRemaining.value} more file(s) can be added.`)
    validFiles.splice(slotsRemaining.value)
  }

  files.value = [...files.value, ...validFiles]
  uploadError.value = rejected.join(' ')
}

const removeFile = (index: number) => {
  files.value = files.value.filter((_, fileIndex) => fileIndex !== index)
}

const formatFileSize = (bytes: number) => {
  if (!bytes) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

watch(files, updatePreviews, { deep: true, immediate: true })

onBeforeUnmount(() => {
  for (const preview of filePreviews.value) {
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
  }
})
</script>

<template>
  <div class="bg-white p-3 border rounded">
    <DragAndDropUploadFiles :accept :multiple @files-selected="handleFiles" :is-disabled="isDisabled" />
    <p v-if="uploadError" class="text-danger small mt-2 mb-0">{{ uploadError }}</p>

    <div v-if="filePreviews.length" class="mt-3">
      <p class="fw-semibold text-secondary mb-2">Selected files</p>
      <div class="d-flex flex-wrap gap-3">
        <div v-for="(preview, index) in filePreviews" :key="preview.id"
          class="border rounded p-2 pe-5 position-relative d-flex align-items-center file-preview-tile">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-2" aria-label="Remove file"
            @click="removeFile(index)"></button>
          <div class="me-2">
            <img v-if="preview.url" :src="preview.url" class="img-thumbnail object-fit-cover" alt="Preview"
              style="width: 64px; height: 64px;" />
            <div v-else class="d-flex justify-content-center align-items-center bg-light rounded"
              style="width: 64px; height: 64px;">
              <i class="bi bi-file-earmark-text fs-3 text-secondary"></i>
            </div>
          </div>
          <div class="grow lh-sm">
            <p class="mb-1 text-truncate text-wrap" style="font-size: 0.9rem;" :title="preview.name">
              {{ preview.displayName }}
            </p>

            <small class="text-muted">{{ formatFileSize(preview.size) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
