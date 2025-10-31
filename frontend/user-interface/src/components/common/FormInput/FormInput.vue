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
    required: true,
    default: 'Placeholder...'
  },
  optional: {
    type: Boolean,
    required: false,
    default: false
  }
})

const model = defineModel<string>()

const formattedLabel = computed(() => {
  return props.optional ? `${props.label} (Optional)` : props.label
});
</script>

<template>
  <slot v-if="$slots.default" />
  <div class="mb-3 form-floating" v-else>
    <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" v-model="model" class="form-control">
    <label :for="id" class="form-label px-2" v-if="label">{{ formattedLabel }}</label>
  </div>
</template>
