<script setup lang="ts">

defineProps<{ role: string }>();

</script>
<template>
  <div class="my-5 vh-100">
    <div class="alert alert-warning" role="alert">
      CERTIFICATION VIEW PAGE HERE.... 🎉sasa Logged in as "{{ role }}"
    </div>
  </div>
</template>
