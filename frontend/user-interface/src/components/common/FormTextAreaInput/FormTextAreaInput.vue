<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string,
  label?: string
  maxRows?: string
  isResizeable?: boolean
  placeholder?: string
  hasError?: boolean
  errorMessage?: string
}>(), {
  isResizeable: true,
  maxRows: '3',
  hasError: false
})

const model = defineModel<string>()

</script>
<template>
  <div class="mb-3">
    <label :for="id" class="form-label" v-if="label">{{ label }}</label>
    <textarea class="form-control border-base" :class="[{ 'resize-none': !isResizeable }, { 'is-invalid': hasError }]"
      :id :rows="maxRows" :placeholder v-model="model"></textarea>
    <div class="invalid-feedback" v-show="hasError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.resize-none {
  resize: none;
}

.border-base {
  border: 1px solid grey;
}
</style>
