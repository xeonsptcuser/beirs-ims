<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
<template>
  <button type="submit" class="btn btn-primary w-100 mt-2 py-2"> {{ label }}</button>
</template>
