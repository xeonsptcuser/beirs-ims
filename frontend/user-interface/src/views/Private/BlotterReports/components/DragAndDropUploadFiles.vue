<script setup lang="ts">
import { ref } from 'vue';


withDefaults(defineProps<{
  multiple: boolean
  accept: string
  isDisabled?: boolean
  hasError?: boolean
}>(), {
  multiple: false,
  accept: "",
  isDisabled: false,
  hasError: false
})

const emit = defineEmits(["files-selected"]);

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref<boolean>(false);

const openFileDialog = () => {
  fileInput.value?.click();
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  emit("files-selected", target.files);
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false;
}
const onDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (!event.dataTransfer?.files) return;

  emit("files-selected", event.dataTransfer.files)
}

</script>
<template>
  <div class="border rounded p-4 text-center"
    :class="['bg-blue', { 'border-primary bg-opacity': isDragging && !isDisabled, 'upload-box--disabled': isDisabled, 'border-danger bg-red': hasError }]"
    @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="!isDisabled && onDrop($event)"
    @click="!isDisabled && openFileDialog()" :style="{ cursor: isDisabled ? 'not-allowed' : 'pointer' }">
    <input ref="fileInput" type="file" class="d-none" :accept="accept" :multiple="multiple" @change="onFileSelect"
      :disabled="isDisabled">

    <div class="py-3">
      <i class="bi bi-cloud-upload text-primary fs-1"></i>
      <p class="mt-2 mb-0">
        <strong>Drag & Drop</strong> your file here or <span class="text-primary">browser</span>
      </p>
      <span class="text-muted small"> (e.g jpg, jpeg, png (max 5MB each) or mp4 (max 25MB each)) </span>
    </div>
  </div>
</template>

<style scoped>
.border-primary {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
}

.border-danger {
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.25);
}

.bg-opacity {
  opacity: 75%;
}

.bg-blue {
  background-color: #0d6dfd0e;
}

.bg-red {
  background-color: rgba(248, 137, 148, 0.25);
}

.upload-box--disabled {
  background-color: #f5f5f5;
  color: #45454567;
  border-color: #d4d4d4;
  opacity: 0.6;
  pointer-events: none;
}
</style>
