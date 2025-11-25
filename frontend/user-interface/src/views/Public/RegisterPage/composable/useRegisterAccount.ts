import { useSharedAuthResponse } from '@/composables/useSharedAuthResponse'
import type { RegisterRequest } from '@/Types'
import { reactive, ref } from 'vue'

type RegisterErrorKey = keyof RegisterRequest | 'general'

export function useRegisterAccount() {
  const { successResponse, setSuccessResponse, clearSuccessResponse } = useSharedAuthResponse()
  const form = reactive<RegisterRequest>({
    name: {
      firstName: '',
      lastName: '',
      middleName: '',
    },
    email: '',
    password: '',
    passwordConfirmation: '',
    date_of_birth: '',
    streetAddress: '',
    mobileNumber: '',
  })

  const errors = ref<Record<RegisterErrorKey, boolean>>({
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false,
    date_of_birth: false,
    streetAddress: false,
    mobileNumber: false,
    general: false,
  })

  const errorMessages = ref<Record<RegisterErrorKey, { error: string }>>({
    name: { error: '' },
    email: { error: '' },
    password: { error: '' },
    passwordConfirmation: { error: '' },
    date_of_birth: { error: '' },
    streetAddress: { error: '' },
    mobileNumber: { error: '' },
    general: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as RegisterErrorKey[]) {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    }
  }

  const validateForm = () => {
    resetErrors()

    let isValid = true

    if (!form.name.firstName.trim() || !form.name.lastName.trim()) {
      errors.value.name = true
      errorMessages.value.name = {
        error: 'Please enter your full name.',
      }
      isValid = false
    }

    const passwordVal = form.password.trim()
    const passwordConfirmationVal = form.passwordConfirmation.trim()

    if (!passwordVal) {
      errors.value.password = true
      errorMessages.value.password = {
        error: 'Please enter your password.',
      }
      isValid = false
    }

    if (!passwordConfirmationVal) {
      errors.value.passwordConfirmation = true
      errorMessages.value.passwordConfirmation = {
        error: 'Please confirm your password.',
      }
      isValid = false
    }

    if (passwordVal && passwordConfirmationVal && passwordVal !== passwordConfirmationVal) {
      errors.value.password = true
      errors.value.passwordConfirmation = true
      const message = { error: 'Passwords do not match.' }
      errorMessages.value.password = message
      errorMessages.value.passwordConfirmation = message
      isValid = false
    }

    if (!form.email.trim()) {
      errors.value.email = true
      errorMessages.value.email = {
        error: 'Please enter your email.',
      }
      isValid = false
    }

    if (!form.date_of_birth.trim()) {
      errors.value.date_of_birth = true
      errorMessages.value.date_of_birth = {
        error: 'Please enter your birthday.',
      }
      isValid = false
    }

    if (!form.mobileNumber.trim()) {
      errors.value.mobileNumber = true
      errorMessages.value.mobileNumber = {
        error: 'Mobile number is required.',
      }
      isValid = false
    }

    return isValid
  }

  const setServerErrors = (apiErrors?: Record<string, string[]>, fallbackMessage?: string) => {
    resetErrors()

    const fieldMap: Record<string, keyof RegisterRequest> = {
      name: 'name',
      email: 'email',
      password: 'password',
      password_confirmation: 'passwordConfirmation',
      date_of_birth: 'date_of_birth',
      street_address: 'streetAddress',
      mobile_number: 'mobileNumber',
    }

    if (!apiErrors || Object.keys(apiErrors).length === 0) {
      if (fallbackMessage) {
        errorMessages.value.general = { error: fallbackMessage }
        errors.value.general = true
      }
      return
    }

    for (const [field, messages] of Object.entries(apiErrors)) {
      const key = fieldMap[field]
      if (!key) {
        continue
      }

      errors.value[key] = true
      errorMessages.value[key] = {
        error: messages?.[0] ?? fallbackMessage ?? 'An unexpected error occurred.',
      }
    }
  }

  return {
    form,
    errors,
    successResponse,
    errorMessages,
    validateForm,
    setServerErrors,
    setSuccessResponse,
    clearSuccessResponse,
  }
}
