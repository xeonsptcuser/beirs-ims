<script setup lang="ts">
const props = defineProps<{ role: string }>();
</script>
<template>
  <div class="my-5 vh-100">
    <div class="alert alert-warning" role="alert">
      DASHBOARD PAGE HERE... Logged In as "<span class=" capitalize">{{ props.role }}</span>" 🎉
    </div>
  </div>
</template>
