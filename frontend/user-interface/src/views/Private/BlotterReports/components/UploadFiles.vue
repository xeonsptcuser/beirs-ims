<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import DragAndDropUploadFiles from './DragAndDropUploadFiles.vue'

type FilePreview = {
  id: string
  name: string
  displayName: string
  size: number
  url: string | null
}

withDefaults(defineProps<{
  isDisabled?: boolean
  multiple?: boolean
  accept?: string
}>(), {
  isDisabled: false,
  multiple: true,
  accept: '.png,.jpg,.jpeg,.pdf,.mp4'
})

const files = defineModel<File[]>({ default: [] })
const filePreviews = ref<FilePreview[]>([])

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
  files.value = [...files.value, ...uploads]
}

const removeFile = (index: number) => {
  files.value = files.value.filter((_, fileIndex) => fileIndex !== index)
}

const formatFileSize = (bytes: number) => {
  if (!bytes) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
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
