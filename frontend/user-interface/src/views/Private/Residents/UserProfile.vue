<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import FormInput from '@/components/common/FormInput/FormInput.vue';
import { useEditUserAccount } from './composable/useEditUserAccount';
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { fetchSingleUserProfile, updateUserAccount } from '@/Utils/userServices';
import { computed, ref, watchEffect } from 'vue';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, CommonResponse, UpdateAccountRequestPayload, User } from '@/Types';
import { useSessionStore } from '@/Utils/store/useSessionStore';
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore';

const props = defineProps<{
  id: string
}>()

const responseData = ref<User>();
const hasError = ref<boolean>(false);
const useSession = useSessionStore();

const {
  form,
  errors,
  errorMessages,
  isNotEditableUser,
  roleOptions,
  isEditableSubmit,
  successResponse,
  setServerErrors,
  validateForm,
  setSuccessResponse,
  setisNotEditableUser
} = useEditUserAccount()

const navigation = useGlobalLoadingStore();
const isPasswordChangeable = ref<boolean>(false);

const setNameFieldsFromProfile = (fullName?: string) => {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  const first = parts.shift() ?? ''
  const last = parts.length > 0 ? parts.pop() ?? '' : ''
  const middle = parts.join(' ')

  form.name.firstName = first
  form.name.middleName = middle
  form.name.lastName = last
}

const handleUpdateUserAccount = async () => {
  navigation.startNavigation();

  try {
    hasError.value = false
    setSuccessResponse(null)
    const isValid = validateForm();

    const nameSegments = [form.name.firstName, form.name.middleName, form.name.lastName]
      .map((segment) => segment.trim())
      .filter(Boolean)

    if (isValid) {
      hasError.value = false
      const requestPayload: UpdateAccountRequestPayload = {
        name: nameSegments.join(' '),
        email: form.email,
        role: form.role,
        street_address: form.streetAddress,
        mobile_number: form.mobileNumber,
        date_of_birth: form.date_of_birth,
      }

      const trimmedPassword = form.password.trim()
      const trimmedPasswordConfirmation = form.passwordConfirmation.trim()

      if (trimmedPassword.length || trimmedPasswordConfirmation.length) {
        requestPayload.password = trimmedPassword
        requestPayload.password_confirmation = trimmedPasswordConfirmation
      }

      const response = await updateUserAccount(props.id, requestPayload)
      responseData.value = response.data

      setNameFieldsFromProfile(responseData.value.profile?.name ?? '')
      form.email = responseData.value.email
      form.date_of_birth = responseData.value.profile.date_of_birth
      form.role = responseData.value.role
      form.streetAddress = responseData.value.profile.street_address
      form.mobileNumber = responseData.value.profile.mobile_number

      setSuccessResponse({
        status: response.status ?? 'success',
        message: response.message ?? 'User updated successfully.',
      })

      setisNotEditableUser()
      if (useSession.id === response.data.id) {
        useSession.updateUserName(response.data.profile.name)
      }

      globalThis.location.reload();

    } else {
      hasError.value = true
    }

  } catch (error) {
    hasError.value = true
    setSuccessResponse(null)
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    setServerErrors(axiosError.response?.data?.errors, axiosError.response?.data?.message ?? fallbackResponse.message)
  } finally {
    navigation.endNavigation();
  }
}

const fetchUserProfile = async () => {
  navigation.startNavigation()

  try {
    const response = await fetchSingleUserProfile(props.id)
    responseData.value = response.data

    setNameFieldsFromProfile(responseData.value.profile?.name ?? '')

    form.email = responseData.value.email.trim()
    form.role = (responseData.value.role).trim()
    form.streetAddress = responseData.value.profile.street_address.trim()
    form.mobileNumber = responseData.value.profile.mobile_number.trim()
    form.date_of_birth = responseData.value.profile.date_of_birth.trim()

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const fallbackResponse = error as CommonResponse;

    const apiErrorResponse = axiosError.response?.data?.errors

    setServerErrors(apiErrorResponse, fallbackResponse.message);
  } finally {
    navigation.endNavigation();
  }
}

const handleShowPasswordChange = () => {
  isPasswordChangeable.value = !isPasswordChangeable.value;
  setisNotEditableUser();
}

const userAge = computed(() => {
  return Math.floor((Date.now() - new Date(form.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toString();
});

watchEffect(() => {
  fetchUserProfile()
  setTimeout(() => {
    setSuccessResponse(null);
  }, 3000);
})
</script>
<template>
  <div class="my-5 ">
    <div v-if="successResponse" class="alert alert-success" role="alert">
      {{ successResponse.message }}
    </div>
    <div v-else-if="hasError" class="alert alert-danger" role="alert">
      Something went wrong while saving changes.
    </div>
    <FormContainer title="User Profile" :max-width="'750px'">
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleUpdateUserAccount">
        <div class="row g-2">
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="First Name" placeholder="First Name" id="first_name"
              v-model="form.name.firstName" :error-message="errorMessages.name.error"
              :is-disabled="isNotEditableUser.name" />
          </div>
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="Middle Name" :optional="true" id="middle_name" v-model="form.name.middleName"
              :is-disabled="isNotEditableUser.name" />
          </div>
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="Last Name" placeholder="Last Name" id="last_name" v-model="form.name.lastName"
              :has-error="errors.name" :error-message="errorMessages.name.error"
              :is-disabled="isNotEditableUser.name" />
          </div>
        </div>
        <div class="row g-2 mb-3 mb-md-0">
          <div class="col-md-6 col-sm-12">
            <FormInput type="email" label="Email Address" placeholder="beirs@test.com" id="email" v-model="form.email"
              :has-error="errors.email" :error-message="errorMessages.email.error"
              :is-disabled="isNotEditableUser.email" />
          </div>
          <div class="col-md-3 col-sm-12">
            <FormInput v-if="!isNotEditableUser.dateOfBirth" type="date" label="Date Of Birth" id="birthday"
              v-model="form.date_of_birth" :has-error="errors.date_of_birth"
              :error-message="errorMessages.date_of_birth.error" />
            <FormInput type="text" label="Age" id="user-age" v-model="userAge"
              :is-disabled="isNotEditableUser.dateOfBirth" v-else />
          </div>
          <div class="col-md-3 col-sm-12">
            <DropdownInput :options="roleOptions" label="Roles" id="select-roles" v-model="form.role"
              :error-message="errorMessages.role.error" :has-error="errors.role"
              :is-disabled="isNotEditableUser.role" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col-md-6 col-sm-12">
            <FormInput type="text" label="Mobile Number" id="phoneNumber" v-model="form.mobileNumber"
              :has-error="errors.mobileNumber" :error-message="errorMessages.mobileNumber.error"
              :is-disabled="isNotEditableUser.mobileNumber" />
          </div>
          <div class="col-md-6 col-sm-12">
            <FormInput type="text" label="Street Address" id="streetAddress" v-model="form.streetAddress"
              :has-error="errors.streetAddress" :error-message="errorMessages.streetAddress.error"
              :is-disabled="isNotEditableUser.streetAddress" />
          </div>
        </div>
        <div class="row g-2" v-show="isPasswordChangeable">
          <div class="col-md-6 col-sm-12">
            <FormInput type="password" label="Password" placeholder="Password" id="password" v-model="form.password"
              :has-error="errors.password" :error-message="errorMessages.password.error"
              :is-disabled="isNotEditableUser.password" />
          </div>
          <div class="col-md-6 col-sm-12">
            <FormInput type="password" label="Confirm Password" placeholder="Password Confirmation" id="passwordConfirm"
              v-model="form.passwordConfirmation" :has-error="errors.passwordConfirmation"
              :error-message="errorMessages.passwordConfirmation.error"
              :is-disabled="isNotEditableUser.passwordConfirmation" />
          </div>
        </div>
        <div class="ms-md-auto text-center">
          <a href="#" class="text-dark fs-6" @click="handleShowPasswordChange"><i
              class="bi bi-shield-lock-fill  me-1"></i>Change
            Password </a>
        </div>
        <div class="col-md-8 col-sm-12 mx-auto d-flex justify-items-center gap-2 align-items-center">
          <FormButton label="Submit" :is-disabled="isEditableSubmit"
            :btn-display="isEditableSubmit ? 'secondary' : 'primary'" />
          <FormButton type="button" label="Edit" btn-display="danger" :is-outlined="true"
            @Click.prevent="setisNotEditableUser" />
        </div>
      </form>
    </FormContainer>
  </div>
</template>
