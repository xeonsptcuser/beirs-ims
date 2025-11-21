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
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import { maxDate } from '@/Utils/helpers/formatters';
import { useBarangayAddresses } from '@/composables/useBarangayAddresses';

const {
  form,
  errorMessages,
  errors,
  validateForm,
  setServerErrors,
  setSuccessResponse,
} = useRegisterAccount();
const {
  addressOptions: barangayAddressOptions,
  isLoadingAddresses,
  loadBarangayAddresses
} = useBarangayAddresses();
loadBarangayAddresses();

const router = useRouter();
const hasError = ref<boolean>(false);
const navigation = useGlobalLoadingStore();


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
  <div class="register-hero py-5">
    <div class="container py-4">
      <div class="row align-items-center g-4">
        <div class="col-lg-5 text-white ps-5">
          <p class="text-uppercase small fw-semibold mb-2 text-primary">Get Started</p>
          <h1 class="display-6 fw-bold mb-3 text-dark">Create Your Barangay Account</h1>
          <p class="text-muted mb-4">
            Submit certificate requests, track blotter reports, and receive updates from your barangay office.
          </p>
          <ul class="list-unstyled text-white-50 small mb-0">
            <li class="mb-2"><i class="bi bi-check-circle me-2"></i> 24/7 access to your records</li>
            <li class="mb-2"><i class="bi bi-check-circle me-2"></i> Faster processing of documents</li>
            <li><i class="bi bi-check-circle me-2"></i> Secure management of household information</li>
          </ul>
        </div>
        <div class="col-lg-7 ms-auto">
          <FormContainer :has-error="hasError" title="Account Registration" :max-width="'750px'">
            <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
            <form class="d-flex flex-column gap-3" @submit.prevent="handleRegisterAccount">
              <div class="row g-3">
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
              <div class="row g-3">
                <div class="col-md-6 col-sm-12">
                  <FormFloatingInput type="email" label="Email Address" placeholder="beirs@test.com" id="email"
                    v-model="form.email" :has-error="errors.email" :error-message="errorMessages.email.error" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <FormFloatingInput type="date" label="Date Of Birth" id="birthday" v-model="form.date_of_birth"
                    :has-error="errors.date_of_birth" :max="maxDate()"
                    :error-message="errorMessages.date_of_birth.error" />
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-6 col-sm-12">
                  <FormFloatingInput type="password" label="Password" placeholder="Password" id="password"
                    v-model="form.password" :has-error="errors.password"
                    :error-message="errorMessages.password.error" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <FormFloatingInput type="password" label="Confirm Password" placeholder="Password Confirmation"
                    id="passwordConfirm" v-model="form.passwordConfirmation" :has-error="errors.passwordConfirmation"
                    :error-message="errorMessages.passwordConfirmation.error" />
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-6 col-sm-12">
                  <FormFloatingInput type="text" label="Mobile Number" placeholder="09..." id="mobile-number"
                    v-model="form.mobileNumber" :has-error="errors.mobileNumber"
                    :error-message="errorMessages.mobileNumber.error" />
                </div>
                <div class="col-md-6 col-sm-12">
                  <DropdownInput :options="barangayAddressOptions" label="Street Address" id="street-address"
                    v-model="form.streetAddress" :has-error="errors.streetAddress"
                    :error-message="errorMessages.streetAddress.error" :is-disabled="isLoadingAddresses" />
                </div>
              </div>
              <div class="col-md-10 col-sm-12 mx-auto">
                <FormButton label="Create Account" />
              </div>
              <div class="text-center border-top pt-3">
                <p class="mb-0">Already have an account?
                  <router-link to="/login" class="text-dark fw-semibold">Login now</router-link>
                </p>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-hero {
  background: #fff;
}
</style>
