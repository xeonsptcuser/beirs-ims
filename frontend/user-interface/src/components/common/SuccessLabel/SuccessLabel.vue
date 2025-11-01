<script setup lang="ts">

defineProps({
  isSuccess: {
    type: Boolean,
    required: false,
    default: false
  },
  message: {
    type: String,
    required: false,
    default: ''
  }
})

</script>
<template>
  <div class="alert alert-success" :class="{ 'mb-4': isSuccess }" role="alert" v-if="isSuccess">
    <span class="text-md"><i class="bi bi-check-circle"></i> {{ message }}</span>
  </div>
</template>
