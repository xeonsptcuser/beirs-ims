<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})

</script>
<template>
  <div class="input-group">
    <span class="input-group-text" id="search-icon"><i class="bi bi-search"></i></span>
    <input type="text" class="form-control" placeholder="search" id="search-by-request-name"
      aria-describedby="search-icon" v-model="localValue">
  </div>
</template>
