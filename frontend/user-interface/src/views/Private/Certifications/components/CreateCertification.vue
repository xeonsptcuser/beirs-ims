<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';

defineProps<{
  role: string
}>();

</script>
<template>
  <div class="my-5">
    <FormContainer title="Certification Request Form" max-width="750px">
      <h3 class="text-center">Insert Form Fields Here...</h3>
    </FormContainer>
  </div>
</template>
