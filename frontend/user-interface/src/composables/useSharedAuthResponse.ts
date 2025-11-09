import type { SuccessfulCreateUserResponse } from '@/Types'
import { ref } from 'vue'

const stored = sessionStorage.getItem('userProfileSuccess')
const initial = stored ? (JSON.parse(stored) as SuccessfulCreateUserResponse) : null
const successResponse = ref<SuccessfulCreateUserResponse | null>(initial)

const setSuccessResponse = (response: SuccessfulCreateUserResponse | null) => {
  successResponse.value = response
  if (response) {
    sessionStorage.setItem('userProfileSuccess', JSON.stringify(response))
  } else {
    sessionStorage.removeItem('userProfileSuccess')
  }
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
