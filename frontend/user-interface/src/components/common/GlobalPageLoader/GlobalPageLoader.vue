<script setup lang="ts"></script>
<template>
  <div class="global-loader-overlay">
    <output class="spinner-border text-danger" style="width: 4rem; height: 4rem;" aria-live="polite">
      <span class="visually-hidden">Loading...</span>
    </output>
    <p class="text-light mt-3 fs-5">Loading, please wait...</p>
  </div>
</template>

<style scoped>
.global-loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.464);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
</style>
