<script setup lang="ts">
import { computed } from 'vue';


const props = withDefaults(defineProps<{
  id: string
  options: Array<string>
  label: string
  errorMessage?: string
  hasError?: boolean
  isDisabled?: boolean
  isOptional?: boolean
}>(), {
  isOptional: false
})

const model = defineModel<string>()

const formatOptionalLabel = computed(() => {
  return props.isOptional ? `${props.label}*` : `${props.label}`
})

const orderedOptions = (optionsList: string[]) => {
  return [...optionsList].sort((a, b) => {
    return a.localeCompare(b)
  })
}
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
    <label :for="id" class="form-label">{{ formatOptionalLabel }}</label>
    <div :id class="invalid-feedback" v-show="hasError">
      <small>{{ errorMessage }}</small>
    </div>
  </div>

</template>
