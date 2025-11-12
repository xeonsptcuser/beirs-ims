<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import FormInput from '@/components/common/FormInput/FormInput.vue';
import WarningLabel from '@/components/common/WarningLabel/WarningLabel.vue';
import { useCreateUserAccount } from './composable/useCreateUserAccount';
import { computed, ref } from 'vue';
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import type { ApiErrorResponse, CommonResponse, CreateAccountRequestPayload } from '@/Types';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { userAccountCreation } from '@/Utils/userServices';
import { useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';

const props = defineProps<{
  role: string
}>()

const {
  form,
  errorMessages,
  errors,
  roleOptions,
  validateForm,
  setSuccessResponse,
  setServerErrors
} = useCreateUserAccount();

const hasError = ref<boolean>(false);
const router = useRouter();

const formatRole = computed(() => {
  return form.role.toLowerCase();
})

const navigation = useGlobalLoadingStore();

const handleCreateUserAccount = async () => {
  navigation.startNavigation();
  try {
    const isValid = validateForm();

    if (isValid) {

      const requestPayload: CreateAccountRequestPayload = {
        first_name: form.name.firstName,
        last_name: form.name.lastName,
        middle_name: form.name.middleName,
        email: form.email,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
        role: formatRole.value,
        date_of_birth: form.date_of_birth,
        street_address: form.streetAddress,
        mobile_number: form.mobileNumber,
      }
      const response = await userAccountCreation(requestPayload);

      if (response.status !== 'success') {
        throw response;
      }

      setSuccessResponse({
        status: response.status,
        message: response?.message || ''
      });

      hasError.value = false;
      router.push({ name: 'Residents', params: { role: props.role } })

    } else {
      hasError.value = true
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
}

const filteredErrors = computed(() => {
  return Object.values(errorMessages.value).filter(msg => msg.error && msg.error.trim() !== '');
});
</script>
<template>
  <div class="my-5">
    <div class="my-4">
      <div class="p-6 rounded">
        <FormContainer :has-error="hasError" title="Create Account" :max-width="'750px'">
          <WarningLabel :has-error="hasError && filteredErrors.length > 0" :errors="filteredErrors" />
          <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleCreateUserAccount">
            <div class="row g-2">
              <div class="col-md-4 col-sm-12">
                <FormInput type="text" label="First Name" placeholder="First Name" id="first_name"
                  v-model="form.name.firstName" :has-error="errors.name" :error-message="errorMessages.name.error" />
              </div>
              <div class="col-md-4 col-sm-12">
                <FormInput type="text" label="Last Name" placeholder="Last Name" id="last_name"
                  v-model="form.name.lastName" :has-error="errors.name" :error-message="errorMessages.name.error" />
              </div>
              <div class="col-md-4 col-sm-12">
                <FormInput type="text" label="Middle Name" :optional="true" id="middle_name"
                  v-model="form.name.middleName" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col-md-6 col-sm-12">
                <FormInput type="email" label="Email Address" placeholder="beirs@test.com" id="email"
                  v-model="form.email" :has-error="errors.email" :error-message="errorMessages.email.error" />
              </div>
              <div class="col-md-3 col-sm-12">
                <FormInput type="date" label="Date Of Birth" placeholder="beirs@test.com" id="birthday"
                  v-model="form.date_of_birth" :has-error="errors.date_of_birth"
                  :error-message="errorMessages.date_of_birth.error" />
              </div>
              <div class="col-md-3 col-sm-12">
                <DropdownInput :options="roleOptions" label="Roles" id="select-roles" v-model="form.role"
                  :error-message="errorMessages.role.error" :has-error="errors.role" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col-md-6 col-sm-12">
                <FormInput type="text" label="Mobile Number" id="phoneNumber" v-model="form.mobileNumber"
                  :has-error="errors.mobileNumber" :error-message="errorMessages.mobileNumber.error" />
              </div>
              <div class="col-md-6 col-sm-12">
                <FormInput type="text" label="Street Address" id="streetAddress" v-model="form.streetAddress"
                  :has-error="errors.streetAddress" :error-message="errorMessages.streetAddress.error" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col-md-6 col-sm-12">
                <FormInput type="password" label="Password" placeholder="Password" id="password" v-model="form.password"
                  :has-error="errors.password" :error-message="errorMessages.password.error" />
              </div>
              <div class="col-md-6 col-sm-12">
                <FormInput type="password" label="Confirm Password" placeholder="Password Confirmation"
                  id="passwordConfirm" v-model="form.passwordConfirmation" :has-error="errors.passwordConfirmation"
                  :error-message="errorMessages.passwordConfirmation.error" />
              </div>
            </div>

            <div class="col-md-6 col-sm-12 mx-auto">
              <FormButton label="Submit" />
            </div>
          </form>
        </FormContainer>
      </div>
    </div>
  </div>
</template>
