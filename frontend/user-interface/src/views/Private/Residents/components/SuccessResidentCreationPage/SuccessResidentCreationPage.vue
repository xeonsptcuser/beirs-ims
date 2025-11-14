<script setup lang="ts">
import successLogo from '@/assets/images/check-icon.png'

defineProps<{
  role: string
}>()

</script>
<template>
  <div class="container text-center my-5">
    <div class="col-12 col-md-6 mx-auto">
      <img :src="successLogo" alt="success-logo" class="img-fluid">
    </div>
    <p class="lead mb-2 display-5">Successfully Registered User Account! </p>
    <p class="lead mb-5 h1">Go Back to View Registered Account </p>
    <router-link :to="{
      name: 'Residents',
      params: { role }
    }" class="btn btn-primary">
      <i class="bi bi-arrow-left me-2"></i>Back
    </router-link>
  </div>
</template>

<style scoped>
.container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
