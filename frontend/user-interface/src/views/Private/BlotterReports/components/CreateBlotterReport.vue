<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';

defineProps<{
  role: string
}>()


const handleCreateBlotterReport = async () => {
  // HANDLE CREATE BLOTTER REPORT HERE
}

</script>
<template>
  <div class="my-5">
    <FormContainer title="Report Form" max-width="750px">
      <h3 class="text-center">FORM FIELDS HERE</h3>
    </FormContainer>

  </div>
</template>
