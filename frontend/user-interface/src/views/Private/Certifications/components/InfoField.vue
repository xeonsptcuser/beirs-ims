<script setup lang="ts">
defineProps<{
  label: string
  dataValue: string
}>()

</script>
<template>
  <div class="col-12 col-md-6 mb-1">
    <div class="row align-items-center border-bottom mx-2">
      <p class="font-bold px-2 py-2 mb-0 text-capitalize col-md-6 col-12 text-nowrap text-start">{{ label }}:</p>
      <p class="px-3 mb-md-0 text-capitalize col-md-6 col-12 text-nowrap text-start text-sm ">{{ dataValue }}</p>
    </div>
  </div>
</template>

<style scoped>
.font-bold {
  font-weight: 700;
}

.text-sm {
  font-size: 14px;
}
</style>
