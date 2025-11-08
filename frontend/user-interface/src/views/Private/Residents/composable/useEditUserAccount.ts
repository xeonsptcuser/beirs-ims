import type { UserProfileEditStatus } from '@/Types'
import { useCreateUserAccount } from './useCreateUserAccount'
import { ref } from 'vue'

export function useEditUserAccount() {
  const { form, errors, errorMessages, roleOptions, validateForm } = useCreateUserAccount()

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

  const setIsEditableUser = () => {
    isEditableUser.value.name = !isEditableUser.value.name
    isEditableUser.value.role = !isEditableUser.value.role
    isEditableUser.value.email = !isEditableUser.value.email
    isEditableUser.value.password = !isEditableUser.value.password
    isEditableUser.value.passwordConfirmation = !isEditableUser.value.passwordConfirmation
    isEditableUser.value.dateOfBirth = !isEditableUser.value.dateOfBirth
    isEditableUser.value.streetAddress = !isEditableUser.value.streetAddress
    isEditableUser.value.mobileNumber = !isEditableUser.value.mobileNumber
  }

  return {
    form,
    errors,
    errorMessages,
    isEditableUser,
    roleOptions,
    validateForm,
    setIsEditableUser,
  }
}
