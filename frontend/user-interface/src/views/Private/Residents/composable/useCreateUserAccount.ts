import { useSharedAuthResponse } from '@/composables/useSharedAuthResponse'
import type { CreateUserAccountRequest } from '@/Types'
import { reactive, ref } from 'vue'

export function useCreateUserAccount(options?: { requirePassword: boolean }) {
  const requiredPassword = options?.requirePassword ?? true
  const { successResponse, setSuccessResponse } = useSharedAuthResponse()
  const form = reactive<CreateUserAccountRequest>({
    name: {
      firstName: '',
      lastName: '',
      middleName: '',
    },
    role: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    date_of_birth: '',
    streetAddress: '',
    addressLine: '',
    mobileNumber: '',
  })

  const errors = ref<Record<keyof CreateUserAccountRequest, boolean>>({
    name: false,
    email: false,
    password: false,
    role: false,
    passwordConfirmation: false,
    date_of_birth: false,
    streetAddress: false,
    addressLine: false,
    mobileNumber: false,
  })

  const errorMessages = ref<Record<keyof CreateUserAccountRequest, { error: string }>>({
    name: { error: '' },
    role: { error: '' },
    email: { error: '' },
    password: { error: '' },
    passwordConfirmation: { error: '' },
    date_of_birth: { error: '' },
    streetAddress: { error: '' },
    addressLine: { error: '' },
    mobileNumber: { error: '' },
  })

  const roleOptions = ['admin', 'resident', 'staff']

  const addressOptions = [
    'pulang bukid',
    'mabolo 1',
    'mabolo 2',
    'liong',
    'sacred heart',
    'sapang daan',
    'sumbrero',
    'kalubihan',
    'abbra',
    'hiland',
    'tres rosas',
    'ura',
    'tinago a',
    'tinago b',
    'tinago c',
    'battiler',
    'sudlon',
    'cenapro',
    'perez',
    'mayol',
  ]

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof CreateUserAccountRequest)[]) {
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
    const shouldValidatePassword =
      requiredPassword || passwordVal.length > 0 || passwordConfirmationVal.length > 0

    if (shouldValidatePassword) {
      if (!passwordVal.length) {
        errors.value.password = true
        errorMessages.value.password = {
          error: 'Please enter your password.',
        }
        isValid = false
      } else if (passwordVal.length < 8) {
        errors.value.password = true
        errorMessages.value.password = {
          error: 'Password must be atleast 8 characters.',
        }
        isValid = false
      }

      if (form.password.trim() !== form.passwordConfirmation.trim()) {
        errors.value.passwordConfirmation = true
        errorMessages.value.passwordConfirmation = {
          error: 'Password confirmation does not match with password...',
        }
        isValid = false
      }
    }

    if (!form.email.trim()) {
      errors.value.email = true
      errorMessages.value.email = {
        error: 'Please enter your email.',
      }
      isValid = false
    }

    if (!form.role.trim()) {
      errors.value.role = true
      errorMessages.value.role = {
        error: 'Please select account role.',
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
        error: 'Please enter mobile number',
      }
      isValid = false
    }

    if (!form.streetAddress.trim()) {
      errors.value.streetAddress = true
      errorMessages.value.streetAddress = {
        error: 'Please select your street address',
      }
      isValid = false
    }

    return isValid
  }

  const setServerErrors = (apiErrors?: Record<string, string[]>, fallbackMessage?: string) => {
    resetErrors()

    const fieldMap: Record<string, keyof CreateUserAccountRequest> = {
      name: 'name',
      email: 'email',
      password: 'password',
      password_confirmation: 'passwordConfirmation',
      role: 'role',
      date_of_birth: 'date_of_birth',
      street_address: 'streetAddress',
      mobile_number: 'mobileNumber',
    }

    if (!apiErrors || Object.keys(apiErrors).length === 0) {
      if (fallbackMessage) {
        errorMessages.value.email = { error: fallbackMessage }
        errors.value.email = true
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
    errorMessages,
    successResponse,
    roleOptions,
    addressOptions,
    validateForm,
    setServerErrors,
    setSuccessResponse,
  }
}
