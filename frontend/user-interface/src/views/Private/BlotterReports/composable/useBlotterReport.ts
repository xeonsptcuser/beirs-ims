import type { BlotterReport } from '@/Types/blotter-report-types'
import { ref } from 'vue'

export function useBlotterReports() {
  const form = ref<BlotterReport>({
    name1: '',
    name2: '',
  })

  const errors = {
    name1: false,
    name2: false,
  }

  const validateForm = () => {
    let isValid = true
    if (!form.value.name1.trim()) {
      errors.name1 = true
      isValid = false
    }
    if (!form.value.name2.trim()) {
      errors.name2 = true
      isValid = false
    }

    return isValid
  }

  return {
    form,
    errors,
    validateForm,
  }
}
