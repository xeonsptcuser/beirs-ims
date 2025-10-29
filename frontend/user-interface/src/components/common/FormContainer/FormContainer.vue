<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  maxWidth: {
    type: String,
    default: '480px'
  }
})

const title = ref('Account Login');
</script>
<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-sm"
      :style="{ width: '100%', maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }">
      <div class="card-body d-flex flex-column">
        <h4 class="card-title text-center mb-4">{{ title }}</h4>
        <slot />
      </div>
    </div>
  </div>
</template>
