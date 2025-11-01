import { useSharedAuthResponse } from '@/composables/useSharedAuthResponse'
import type { LoginRequestPayload } from '@/Types'
import { reactive, ref } from 'vue'

export function useLoginAccount() {
  const { successResponse, clearSuccessResponse } = useSharedAuthResponse()
  const isSuccessResponse = successResponse

  const form = reactive<LoginRequestPayload>({
    email: '',
    password: '',
  })

  const errors = ref<Record<keyof LoginRequestPayload, boolean>>({
    email: false,
    password: false,
  })

  const errorMessages = ref<Record<keyof LoginRequestPayload, { error: string }>>({
    email: { error: '' },
    password: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof LoginRequestPayload)[]) {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    }
  }

  const validateForm = () => {
    resetErrors()
    let isValid = true

    if (!form.email.trim()) {
      errors.value.email = true
      errorMessages.value.email = {
        error: 'Please enter your email.',
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

    return isValid
  }

  const resetForm = () => {
    form.email = ''
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
