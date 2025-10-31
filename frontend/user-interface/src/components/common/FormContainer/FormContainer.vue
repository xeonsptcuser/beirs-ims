<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  maxWidth: {
    type: String,
    default: '480px'
  },
  hasError: {
    type: Boolean,
    required: false,
    default: false
  },
  title: {
    type: String,
    required: false,
    default: ''
  }
})


</script>
<template>
  <div class="min-vh-75 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-sm"
      :style="{ width: '100%', maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }">
      <div class="card-body d-flex flex-column py-5">
        <h4 class="card-title text-center" :class="{ 'mb-5': !hasError, 'mb-3': hasError }">{{ title }}</h4>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-75 {
  min-height: 75vh !important;
}
</style>
