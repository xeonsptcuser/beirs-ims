<script setup lang="ts">

defineProps<{
  id: string
  options: Array<string>
  label: string
  errorMessage?: string
  hasError?: boolean
  isDisabled?: boolean
}>()

const model = defineModel<string>()

</script>
<template>
  <slot v-if="$slots.default" />
  <div class="form-floating">
    <select class="form-select text-capitalize" :class="{ 'is-invalid': hasError }" v-model="model"
      :disabled="isDisabled">
      <option value="" selected>...</option>
      <option :value="option" v-for="option in options" :key="option" class="text-capitalize">{{ option }}
      </option>
    </select>
    <label :for="id" class="form-label">{{ label }}</label>
    <div :id class="invalid-feedback" v-show="hasError">
      <small>{{ errorMessage }}</small>
    </div>
  </div>

</template>
