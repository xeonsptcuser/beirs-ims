<script setup lang="ts">
import type { IncidentType } from '@/Types';
import { computed } from 'vue';


const props = withDefaults(defineProps<{
  id: string
  options: Array<IncidentType | string | { label: string; value?: string; disabled?: boolean; isDivider?: boolean }>
  label?: string
  errorMessage?: string
  hasError?: boolean
  isDisabled?: boolean
  isOptional?: boolean
  isCapitalized?: boolean
}>(), {
  isOptional: false,
  isCapitalized: true
})

const model = defineModel<string | IncidentType>()

const capitalizeWords = (value: string) => {
  if (!value) return ''
  const lower = value.toLowerCase()
  return lower.replace(/\b\w/g, (char) => char.toUpperCase())
}

const formatOptionalLabel = computed(() => {
  return props.isOptional ? `${props.label}*` : `${props.label}`
})

const formattedOptions = computed(() =>
  props.options.map((option) => {
    if (typeof option === 'object' && 'id' in option) {
      const label = props.isCapitalized ? capitalizeWords(option.label) : option.label
      return { value: option.id, label, disabled: false }
    }

    if (typeof option === 'object' && 'label' in option) {
      const label = props.isCapitalized ? capitalizeWords(option.label) : option.label
      return { value: option.value ?? '', label, disabled: option.disabled ?? false, isDivider: option.isDivider ?? false }
    }

    const label = props.isCapitalized ? capitalizeWords(option) : option
    return { value: option, label, disabled: false }
  })
)
</script>
<template>
  <slot v-if="$slots.default" />
  <div class="form-floating">
    <select :id :name="id" class="form-select" :class="{ 'is-invalid': hasError }" v-model="model"
      :disabled="isDisabled">
      <option value="" selected>...</option>
      <option :value="option.value" v-for="option in formattedOptions" :key="option.label"
        :disabled="option.disabled" :class="{ 'text-muted fst-italic': option.disabled }">
        {{ option.label }}
      </option>
    </select>
    <label :for="id" class="form-label">{{ formatOptionalLabel }}</label>
    <div :id class="invalid-feedback" v-show="hasError">
      <small>{{ errorMessage }}</small>
    </div>
  </div>

</template>
