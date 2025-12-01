<script setup lang="ts">
withDefaults(defineProps<{
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
    <textarea class="form-control border-base"
      :class="[{ 'resize-none': !isResizeable }, { 'is-invalid border-error': hasError }]" :id :rows="maxRows"
      :placeholder v-model="model" v-bind="$attrs"></textarea>
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
  border: 0.7px solid grey;
}

.border-error {
  border: 0.7px solid #DC3545;
}
</style>
