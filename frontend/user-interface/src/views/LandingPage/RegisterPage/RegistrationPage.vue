<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { computed, ref, watch } from 'vue';
import { useRegisterAccount } from './composable/useRegisterAccount';
import FormInput from '@/components/common/FormInput/FormInput.vue';

const {
  form,
  errorMessages,
  validateForm
} = useRegisterAccount();

const handleRegisterAccount = async () => {
  try {
    const isValid = validateForm();
    if (isValid) {
      // PERFORM logic to register user here...
      console.log("FORM: ", form)
      hasError.value = false;
    } else {
      hasError.value = true;
    };
  } catch (error) {
    console.log("ERRORS: ", error)
  }
}

const hasError = ref<boolean>(false);
const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});

</script>
<template>
  <div class="my-4">
    <div class="bg-primary p-6 rounded">
      <FormContainer :has-error="hasError" title="Account Registration" :max-width="'750px'">
        <WarningLabel :has-error="hasError" :errors="filteredErrors" />
        <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleRegisterAccount">
          <div class="row g-2">
            <div class="col-md-4 col-sm-12">
              <FormInput type="text" label="First Name" placeholder="First Name" id="first_name"
                v-model="form.name.firstName" />
            </div>
            <div class="col-md-4 col-sm-12">
              <FormInput type="text" label="Last Name" placeholder="Last Name" id="last_name"
                v-model="form.name.lastName" />
            </div>
            <div class="col-md-4 col-sm-12">
              <FormInput type="text" label="Middle Name" :optional="true" placeholder="M.I (Optional)" id="middle_name"
                v-model="form.name.middleName" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-sm-12">
              <FormInput type="text" label="Email Address" placeholder="beirs@test.com" id="email"
                v-model="form.email" />
            </div>
            <div class="col-md-6 col-sm-12">
              <FormInput type="date" label="Date Of Birth" placeholder="beirs@test.com" id="birthday"
                v-model="form.date_of_birth" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-sm-12">
              <FormInput type="password" label="Password" placeholder="Password" id="password"
                v-model="form.password" />
            </div>
            <div class="col-md-6 col-sm-12">
              <FormInput type="password" label="Confirm Password" placeholder="Password Confirmation"
                id="passwordConfirm" v-model="form.passwordConfirmation" />
            </div>
          </div>

          <!-- Upload Front and Back or PhilSysID Here.. -->

          <button type="submit" class="btn btn-primary w-100 mt-2 py-2">Sign Up</button>
          <hr>
          <p class="text-center">Already have an account? <router-link to="/login">Login Now</router-link></p>
        </form>
      </FormContainer>
    </div>
  </div>
</template>
