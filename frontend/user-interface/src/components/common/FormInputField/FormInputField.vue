<script setup lang="ts">
defineProps<{
  id: string,
  label: string,
}>()

const modelValue = defineModel<string>();
</script>
<template>
  <!-- ADD VALIDATION BEHAVIOUR -->
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input type="text" class="form-control" v-model="modelValue" :id>
  </div>
</template>
