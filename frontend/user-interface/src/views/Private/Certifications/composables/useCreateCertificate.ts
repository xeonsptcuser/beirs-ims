import type { CreateCertificateFormRequest } from '@/Types/certificate-related-types'
import { reactive, ref } from 'vue'

export function useCreateCertificate() {
  const form = reactive<CreateCertificateFormRequest>({
    certificateRequestType: '',
    startResidencyDate: '',
    endResidencyDate: '',
    isPresent: false,
    certificateRequestReason: '',
  })

  const certificateOptions = ref<string[]>(['residency', 'indigency', 'clearance', 'marriage'])

  const errors = ref<Record<keyof CreateCertificateFormRequest, boolean>>({
    certificateRequestType: false,
    certificateRequestReason: false,
    startResidencyDate: false,
    isPresent: false,
    endResidencyDate: false,
  })

  const errorMessages = ref<Record<keyof CreateCertificateFormRequest, { error: string }>>({
    certificateRequestType: { error: '' },
    certificateRequestReason: { error: '' },
    startResidencyDate: { error: '' },
    endResidencyDate: { error: '' },
    isPresent: { error: '' },
  })

  const resetErrors = () => {
    for (const key of Object.keys(errors.value) as (keyof CreateCertificateFormRequest)[]) {
      errors.value[key] = false
      errorMessages.value[key] = { error: '' }
    }
  }

  const validateCertificateForm = () => {
    resetErrors()
    let isValid = true

    if (!form.certificateRequestType.trim()) {
      errors.value.certificateRequestType = true
      errorMessages.value.certificateRequestType = {
        error: 'Please select type of certificate you want to request.',
      }
      isValid = false
    }

    if (!form.certificateRequestReason.trim()) {
      errors.value.certificateRequestReason = true
      errorMessages.value.certificateRequestReason = {
        error: 'Please enter purpose for requesting certificate',
      }

      isValid = false
    }

    return isValid
  }

  const setServerErrors = (apiErrors?: Record<string, string[]>, fallbackMessage?: string) => {
    resetErrors()

    const fieldMap: Record<string, keyof CreateCertificateFormRequest> = {
      certificateRequestType: 'certificateRequestType',
      startResidencyDate: 'startResidencyDate',
      endResidencyDate: 'endResidencyDate',
      certificateRequestReason: 'certificateRequestReason',
    }

    if (!apiErrors || Object.keys(apiErrors).length === 0) {
      if (fallbackMessage) {
        errorMessages.value.certificateRequestType = { error: fallbackMessage }
        errors.value.certificateRequestType = true
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
    certificateOptions,
    validateCertificateForm,
    setServerErrors,
  }
}
