import { reactive, ref } from 'vue'

interface OtpForm {
  otp_code: string
}

export function useOtpForm() {
  const form = reactive<OtpForm>({
    otp_code: '',
  })

  const errors = ref<Record<keyof OtpForm, boolean>>({
    otp_code: false,
  })

  const errorMessages = ref<Record<keyof OtpForm, { error: string }>>({
    otp_code: { error: '' },
  })

  const resetErrors = () => {
    (Object.keys(errors.value) as (keyof OtpForm)[]).forEach((key) => {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    })
  }

  const validateForm = () => {
    resetErrors()
    let isValid = true

    if (!form.otp_code.trim()) {
      errors.value.otp_code = true
      errorMessages.value.otp_code = {
        error: 'Please enter the OTP sent to your number.',
      }
      isValid = false
    }

    return isValid
  }

  const resetForm = () => {
    form.otp_code = ''
    resetErrors()
  }

  return {
    form,
    errors,
    errorMessages,
    validateForm,
    resetForm,
  }
}
