<script setup lang="ts">
import FormContainer from '@/components/common/FormContainer/FormContainer.vue';
import FormInput from '@/components/common/FormInput/FormInput.vue';
import { useEditUserAccount } from './composable/useEditUserAccount';
import DropdownInput from '@/components/common/DropdownInput/DropdownInput.vue';
import FormButton from '@/components/common/FormButton/FormButton.vue';
import { fetchSingleUserProfile } from '@/Utils/userServices';
import { onMounted, ref } from 'vue';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/Types';

const props = defineProps<{
  id: string
}>()

const {
  form,
  errors,
  errorMessages,
  isEditableUser,
  roleOptions,
  validateForm,
  setIsEditableUser
} = useEditUserAccount()

const loading = ref<boolean>(false);
const handleUpdateUserAccount = async () => {
  // handle update here
  console.log(form);
}

const fetchUserProfile = async () => {
  loading.value = true
  try {
    const response = await fetchSingleUserProfile(props.id)
    const responseData = response.data

    const [firstAndLast = '', middle = ''] = (responseData.profile?.name ?? '').split(',')
    const [firstName = '', lastName = ''] = firstAndLast.trim().split(/\s+/, 2)

    form.name.firstName = firstName.trim()
    form.name.lastName = lastName.trim()
    form.name.middleName = middle.trim()

    form.email = responseData.email.trim()
    form.role = (responseData.role).trim()
    form.streetAddress = responseData.profile.street_address.trim()
    form.mobileNumber = responseData.profile.mobile_number.trim()
    form.date_of_birth = responseData.profile.date_of_birth.trim()

    console.log("RESPONSE: ", responseData)

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.log(axiosError)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>
<template>
  <div class="my-5 ">
    <FormContainer title="User Profile" :max-width="'750px'">
      <form class="d-flex flex-column gap-2 mt-auto mb-auto" @submit.prevent="handleUpdateUserAccount">
        <div class="row g-2">
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="First Name" placeholder="First Name" id="first_name"
              v-model="form.name.firstName" :error-message="errorMessages.name.error"
              :is-disabled="isEditableUser.name" />
          </div>
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="Last Name" placeholder="Last Name" id="last_name" v-model="form.name.lastName"
              :has-error="errors.name" :error-message="errorMessages.name.error" :is-disabled="isEditableUser.name" />
          </div>
          <div class="col-md-4 col-sm-12">
            <FormInput type="text" label="Middle Name" :optional="true" id="middle_name" v-model="form.name.middleName"
              :is-disabled="isEditableUser.name" />
          </div>
        </div>
        <div class="row g-2 mb-3 mb-md-0">
          <div class="col-md-6 col-sm-12">
            <FormInput type="email" label="Email Address" placeholder="beirs@test.com" id="email" v-model="form.email"
              :has-error="errors.email" :error-message="errorMessages.email.error"
              :is-disabled="isEditableUser.email" />
          </div>
          <div class="col-md-3 col-sm-12">
            <FormInput type="date" label="Date Of Birth" id="birthday" v-model="form.date_of_birth"
              :has-error="errors.date_of_birth" :error-message="errorMessages.date_of_birth.error"
              :is-disabled="isEditableUser.dateOfBirth" />
          </div>
          <div class="col-md-3 col-sm-12">
            <DropdownInput :options="roleOptions" label="Roles" id="select-roles" v-model="form.role"
              :error-message="errorMessages.role.error" :has-error="errors.role" :is-disabled="isEditableUser.role" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col-md-6 col-sm-12">
            <FormInput type="text" label="Mobile Number" id="phoneNumber" v-model="form.mobileNumber"
              :has-error="errors.mobileNumber" :error-message="errorMessages.mobileNumber.error"
              :is-disabled="isEditableUser.mobileNumber" />
          </div>
          <div class="col-md-6 col-sm-12">
            <FormInput type="text" label="Street Address" id="streetAddress" v-model="form.streetAddress"
              :has-error="errors.streetAddress" :error-message="errorMessages.streetAddress.error"
              :is-disabled="isEditableUser.streetAddress" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col-md-6 col-sm-12">
            <FormInput type="password" label="Password" placeholder="Password" id="password" v-model="form.password"
              :has-error="errors.password" :error-message="errorMessages.password.error"
              :is-disabled="isEditableUser.password" />
          </div>
          <div class="col-md-6 col-sm-12">
            <FormInput type="password" label="Confirm Password" placeholder="Password Confirmation" id="passwordConfirm"
              v-model="form.passwordConfirmation" :has-error="errors.passwordConfirmation"
              :error-message="errorMessages.passwordConfirmation.error"
              :is-disabled="isEditableUser.passwordConfirmation" />
          </div>
        </div>

        <div class="col-md-8 col-sm-12 mx-auto d-flex justify-items-center gap-2 align-items-center">
          <FormButton label="Submit" />
          <FormButton type="button" label="Edit" btn-display="secondary" :is-outlined="true"
            @Click.prevent="setIsEditableUser" />
        </div>

      </form>
    </FormContainer>
  </div>
</template>
