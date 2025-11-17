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
  },
  alertType: {
    type: String,
    required: false,
    default: 'success'
  }
})

</script>
<template>
  <div class="alert" :class="[{ 'my-4': isSuccess }, `alert-${alertType}`]" role="alert" v-if="isSuccess">
    <span class="text-md"><i class="bi bi-check-circle"></i> {{ message }}</span>
  </div>
</template>
