<script setup lang="ts">
import FormButton from '@/components/common/FormButton/FormButton.vue';
import FormInputField from '@/components/common/FormInputField/FormInputField.vue';
import { useBlotterReports } from './composable/useBlotterReport';

defineProps<{ role: string }>();

const {
  form,
  errors,
  validateForm
} = useBlotterReports();

const handleSubmit = () => {

  let isValid = validateForm()
  if (isValid) {
    console.log("NAME:", form.value.name1)
    console.log("NAME:", form.value.name2)
  }
}
</script>
<template>
  <div class="my-5 vh-100">
    <div class="alert alert-success" role="alert">
      BLOTTER REPORTS VIEW PAGE HERE.... 🎉sasa Logged in as "{{ role }}"
    </div>

    <form @submit.prevent="handleSubmit">
      <FormInputField id="name1" label="SOMETHING" v-model="form.name1" />
      <FormInputField id="name2" label="SOMETHING" v-model="form.name2" />
      <FormButton type="submit" label="Submit" btn-display="warning" />
    </form>
  </div>
</template>
