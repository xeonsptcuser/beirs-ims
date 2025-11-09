<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  type?: 'submit' | 'button' | 'reset'
  btnDisplay?: 'primary' | 'warning' | 'success' | 'danger' | 'secondary'
  isOutlined?: boolean
  isDisabled?: boolean
}>(), {
  type: 'submit',
  btnDisplay: 'primary',
  isOutlined: false,
  isDisabled: false
})
</script>
<template>
  <button :type="type" class="btn w-100 mt-2 py-2"
    :class="[isOutlined ? `btn-outline-${btnDisplay}` : `btn-${btnDisplay}`]" :disabled="isDisabled"> {{ label
    }}</button>
</template>
