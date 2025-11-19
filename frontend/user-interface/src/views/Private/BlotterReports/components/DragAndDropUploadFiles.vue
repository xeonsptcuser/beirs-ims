<script setup lang="ts">
import { ref } from 'vue';


withDefaults(defineProps<{
  multiple: boolean
  accept: string
}>(), {
  multiple: false,
  accept: ""
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
  <div class="border rounded p-4 text-center bg-blue"
    :class="{ 'border-primary': isDragging, 'bg-opacity': isDragging }" @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" @click="openFileDialog" style="cursor: pointer;">
    <input ref="fileInput" type="file" class="d-none" :accept="accept" :multiple="multiple" @change="onFileSelect">

    <div class="py-3">
      <i class="bi bi-cloud-upload text-primary fs-1"></i>
      <p class="mt-2 mb-0">
        <strong>Drag & Drop</strong> your file here or <span class="text-primary">browser</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.border-primary {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
}

.bg-opacity {
  opacity: 75%;
}

.bg-blue {
  background-color: #0d6dfd0e;
}
</style>
