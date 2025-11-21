import type { UserProfileEditStatus } from '@/Types'
import { useCreateUserAccount } from './useCreateUserAccount'
import { ref } from 'vue'

export function useEditUserAccount() {
  const {
    form,
    errors,
    errorMessages,
    roleOptions,
    addressOptions,
    validateForm,
    setServerErrors,
    successResponse,
    setSuccessResponse,
  } = useCreateUserAccount({
    requirePassword: false,
    requireGovernmentId: false,
  })

  const isNotEditableUser = ref<Record<keyof UserProfileEditStatus, boolean>>({
    name: true,
    role: true,
    email: true,
    password: true,
    passwordConfirmation: true,
    dateOfBirth: true,
    streetAddress: true,
    addressLine: true,
    mobileNumber: true,
    governmentIdentity: true,
  })

  const isEditableSubmit = ref<boolean>(true)

  const setisNotEditableUser = () => {
    for (const key of Object.keys(isNotEditableUser.value) as (keyof UserProfileEditStatus)[]) {
      if (key === 'role') continue
      isNotEditableUser.value[key] = !isNotEditableUser.value[key]
    }
    isEditableSubmit.value = !isEditableSubmit.value
  }

  return {
    form,
    errors,
    errorMessages,
    isNotEditableUser,
    roleOptions,
    addressOptions,
    isEditableSubmit,
    successResponse,
    validateForm,
    setServerErrors,
    setSuccessResponse,
    setisNotEditableUser,
  }
}
