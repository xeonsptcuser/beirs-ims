import type { SuccessfulCreateUserResponse } from '@/Types'
import { ref } from 'vue'

const successResponse = ref<SuccessfulCreateUserResponse | null>(null)

const setSuccessResponse = (response: SuccessfulCreateUserResponse | null) => {
  successResponse.value = response
}

const clearSuccessResponse = () => {
  successResponse.value = null
}

export function useSharedAuthResponse() {
  return {
    successResponse,
    setSuccessResponse,
    clearSuccessResponse,
  }
}
