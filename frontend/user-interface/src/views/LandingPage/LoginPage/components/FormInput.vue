<script setup lang="ts">
defineOptions({
  inheritAttrs: false, // optional – only if you don’t want them on the root element
});
defineProps({
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
  }
})
const model = defineModel<string>()
</script>

<template>
  <slot v-if="$slots.default" />
  <div class="mb-3 form-floating" v-else>
    <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" v-model="model">
    <label :for="id" class="form-label" v-if="label">{{ label }}</label>
  </div>
</template>
