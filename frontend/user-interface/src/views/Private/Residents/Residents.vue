<script setup lang="ts">

defineProps<{ role: string }>();

</script>
<template>
  <div class="my-5 vh-100">
    <div class="alert alert-primary" role="alert">
      RESIDENTS PAGE HERE.... 🎉sasa Logged in as "{{ role }}"
    </div>
  </div>
</template>
