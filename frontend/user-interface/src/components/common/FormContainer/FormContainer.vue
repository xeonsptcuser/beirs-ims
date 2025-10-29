<script setup lang="ts">
defineProps({
  maxWidth: {
    type: String,
    default: '480px'
  }
})
</script>
<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-sm"
      :style="{ width: '100%', maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center mb-3">Account Login</h5>
        <slot />
      </div>
    </div>
  </div>
</template>
