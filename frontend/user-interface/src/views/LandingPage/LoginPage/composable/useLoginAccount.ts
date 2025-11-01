import { useSharedAuthResponse } from '@/composables/useSharedAuthResponse'
import type { LoginRequest } from '@/Types'
import { reactive, ref } from 'vue'

export function useLoginAccount() {
  const { successResponse, clearSuccessResponse } = useSharedAuthResponse()
  const isSuccessResponse = successResponse

  const form = reactive<LoginRequest>({
    username: '',
    password: '',
  })

  const errors = ref<Record<keyof LoginRequest, boolean>>({
    username: false,
    password: false,
  })

  const errorMessages = ref<Record<keyof LoginRequest, { error: string }>>({
    username: { error: '' },
    password: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof LoginRequest)[]) {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    }
  }

  const validateForm = () => {
    resetErrors()
    let isValid = true

    if (!form.username.trim()) {
      errors.value.username = true
      errorMessages.value.username = {
        error: 'Please enter your username or email address...',
      }
      isValid = false
    }

    if (!form.password.trim()) {
      errors.value.password = true
      errorMessages.value.password = {
        error: 'Please enter your password...',
      }
      isValid = false
    }

    return isValid
  }

  const resetForm = () => {
    form.username = ''
    form.password = ''
    resetErrors()
  }

  return {
    form,
    errors,
    errorMessages,
    isSuccessResponse,
    validateForm,
    resetForm,
    clearSuccessResponse,
  }
}
