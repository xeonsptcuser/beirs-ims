<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { computed, ref } from 'vue';
import { useRegisterAccount } from './composable/useRegisterAccount';
import type { ApiErrorResponse, RegisterRequestPayload, CommonResponse } from '@/Types';
import { userRegistration } from '@/Utils/loginServices';
import { useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';
import FormFloatingInput from '@/components/common/FormFloatingInput/FormFloatingInput.vue';

const {
  form,
  errorMessages,
  errors,
  validateForm,
  setServerErrors,
  setSuccessResponse,
  clearSuccessResponse
} = useRegisterAccount();

const router = useRouter();
const hasError = ref<boolean>(false);
const navigation = useGlobalLoadingStore();
const maxBirthDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
});

const handleRegisterAccount = async () => {
  navigation.startNavigation();
  try {
    const isValid = validateForm();
    if (isValid) {
      const requestPayload: RegisterRequestPayload = {
        first_name: form.name.firstName,
        last_name: form.name.lastName,
        middle_name: form.name.middleName,
        email: form.email,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
        date_of_birth: form.date_of_birth,
        street_address: form.streetAddress,
        mobile_number: form.mobileNumber
      };

      const response = await userRegistration(requestPayload);

      if (response.status !== 'success') {
        throw response;
      }

      setSuccessResponse({
        status: response.status,
        message: response.message
      });

      hasError.value = false;
      router.push({ name: 'LoginPage' });
    } else {
      hasError.value = true;
    }
  } catch (error) {
    setSuccessResponse(null);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    if (axiosError?.isAxiosError) {
      const responseData = axiosError.response?.data;
      setServerErrors(responseData?.errors, responseData?.message);
    } else if (fallbackResponse?.message) {
      setServerErrors(undefined, fallbackResponse.message);
    } else {
      setServerErrors(undefined, 'Failed to register new user.');
    }

    hasError.value = true;
  } finally {
    navigation.endNavigation();
  }
};

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});

</script>
<template>
  <div class="my-4">
    <div class="p-6 rounded">
      <FormContainer :has-error="hasError" title="Account Registration" :max-width="'750px'">
        <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
        <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleRegisterAccount">
          <div class="row g-2">
            <div class="col-md-4 col-sm-12">
              <FormFloatingInput type="text" label="First Name" placeholder="First Name" id="first_name"
                v-model="form.name.firstName" :has-error="errors.name" :error-message="errorMessages.name.error" />
            </div>
            <div class="col-md-4 col-sm-12">
              <FormFloatingInput type="text" label="Last Name" placeholder="Last Name" id="last_name"
                v-model="form.name.lastName" :has-error="errors.name" :error-message="errorMessages.name.error" />
            </div>
            <div class="col-md-4 col-sm-12">
              <FormFloatingInput type="text" label="Middle Name" :optional="true" id="middle_name"
                v-model="form.name.middleName" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-sm-12">
              <FormFloatingInput type="email" label="Email Address" placeholder="beirs@test.com" id="email"
                v-model="form.email" :has-error="errors.email" :error-message="errorMessages.email.error" />
            </div>
            <div class="col-md-6 col-sm-12">
              <FormFloatingInput type="date" label="Date Of Birth" placeholder="beirs@test.com" id="birthday"
                v-model="form.date_of_birth" :has-error="errors.date_of_birth" :max="maxBirthDate"
                :error-message="errorMessages.date_of_birth.error" />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 col-sm-12">
              <FormFloatingInput type="password" label="Password" placeholder="Password" id="password"
                v-model="form.password" :has-error="errors.password" :error-message="errorMessages.password.error" />
            </div>
            <div class="col-md-6 col-sm-12">
              <FormFloatingInput type="password" label="Confirm Password" placeholder="Password Confirmation"
                id="passwordConfirm" v-model="form.passwordConfirmation" :has-error="errors.passwordConfirmation"
                :error-message="errorMessages.passwordConfirmation.error" />
            </div>
          </div>

          <!-- Upload Front and Back or PhilSysID Here.. -->

          <div class="col-md-10 col-sm-12 mx-auto">
            <FormButton label="Sign Up" />
          </div>
          <hr>
          <p class="text-center">Already have an account? <router-link to="/login">Login Now</router-link></p>
        </form>
      </FormContainer>
    </div>
  </div>
</template>
