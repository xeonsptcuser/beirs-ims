<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  dataValue?: string
  styles?: string
}>(), {
  dataValue: '-'
})

</script>
<template>
  <div class="col-12 col-md-6 mb-1">
    <div class="row align-items-center mx-2">
      <p class="font-bold px-2 py-2 mb-0 text-capitalize col-md-6 col-12 text-start">{{ label }}:</p>
      <p class="ps-3 pe-0 mb-md-0 text-capitalize col-md-6 col-12 text-start text-sm">
        <span v-if="styles" class="badge fs-6" :class="styles">{{ dataValue }} </span>
        <span v-else>{{ dataValue }} </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.font-bold {
  font-weight: 700;
}

.text-sm {
  font-size: 14px;
}
</style>
