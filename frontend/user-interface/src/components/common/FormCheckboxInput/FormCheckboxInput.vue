<script setup lang="ts">
import { computed } from 'vue';


const props = withDefaults(defineProps<{
  id: string,
  label: string
  modelValue?: boolean
}>(), {
  modelValue: false
})

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

</script>
<template>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" :id v-model="localValue">
    <label class="form-check-label" :for="id">
      {{ label }}
    </label>
  </div>
</template>
