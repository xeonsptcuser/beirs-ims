<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false, // optional – only if you don’t want them on the root element
});
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: 'input'
  },
  type: {
    type: String,
    required: true,
    default: 'text'
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Placeholder...'
  },
  optional: {
    type: Boolean,
    required: false,
    default: false
  },
  hasError: {
    type: Boolean,
    required: false,
    default: false
  },
  errorMessage: {
    type: String,
    required: false
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const model = defineModel<string>()

const formattedLabel = computed(() => {
  return props.optional ? `${props.label}` : `${props.label}*`
});
</script>

<template>
  <slot v-if="$slots.default" />
  <div class="mb-3 form-floating" v-else>
    <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" v-model="model" class="form-control text-sm"
      :class="{ 'is-invalid': hasError }" :disabled="isDisabled">
    <label :for="id" class="form-label px-2" :class="{ 'text-danger': hasError }" v-if="label">
      {{ formattedLabel }}
    </label>
    <div :id class="invalid-feedback" v-show="hasError">
      <small>{{ errorMessage }}</small>
    </div>
  </div>
</template>

<style scoped>
.text-sm {
  font-size: 12px;
}
</style>
