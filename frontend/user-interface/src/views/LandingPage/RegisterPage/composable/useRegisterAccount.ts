import type { RegisterRequest } from '@/Types'
import { reactive, ref } from 'vue'

export function useRegisterAccount() {
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
  })

  const errors = ref<Record<keyof RegisterRequest, boolean>>({
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false,
    date_of_birth: false,
  })

  const errorMessages = ref<Record<keyof RegisterRequest, { error: string }>>({
    name: { error: '' },
    email: { error: '' },
    password: { error: '' },
    passwordConfirmation: { error: '' },
    date_of_birth: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof RegisterRequest)[]) {
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

    if (!form.password.trim()) {
      errors.value.password = true
      errorMessages.value.password = {
        error: 'Please enter your password.',
      }
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

    return isValid
  }

  return {
    form,
    errors,
    errorMessages,
    validateForm,
  }
}
