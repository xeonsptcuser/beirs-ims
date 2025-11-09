import type { UserProfileEditStatus } from '@/Types'
import { useCreateUserAccount } from './useCreateUserAccount'
import { ref } from 'vue'

export function useEditUserAccount() {
  const {
    form,
    errors,
    errorMessages,
    roleOptions,
    validateForm,
    setServerErrors,
    successResponse,
    setSuccessResponse,
  } = useCreateUserAccount({
    requirePassword: false,
  })

  const isEditableUser = ref<Record<keyof UserProfileEditStatus, boolean>>({
    name: true,
    role: true,
    email: true,
    password: true,
    passwordConfirmation: true,
    dateOfBirth: true,
    streetAddress: true,
    mobileNumber: true,
  })

  const isEditableSubmit = ref<boolean>(true)

  const setIsEditableUser = () => {
    for (const key of Object.keys(isEditableUser.value) as (keyof UserProfileEditStatus)[]) {
      if (key === 'role') continue
      isEditableUser.value[key] = !isEditableUser.value[key]
    }
    isEditableSubmit.value = !isEditableSubmit.value
  }

  return {
    form,
    errors,
    errorMessages,
    isEditableUser,
    roleOptions,
    isEditableSubmit,
    successResponse,
    validateForm,
    setServerErrors,
    setSuccessResponse,
    setIsEditableUser,
  }
}
