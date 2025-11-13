<script setup lang="ts">
defineProps<{
  label: string
  dataValue: string
}>()
</script>
<template>
  <div class="row mx-2 border-bottom pb-3">
    <p class="font-bold px-2 pt-1 mb-0 text-capitalize col-12 col-md-3 align-self-center"> {{ label }}: </p>
    <p class="px-2 pt-1 mb-0 col-12 col-md-9">{{ dataValue }}</p>
  </div>
</template>
