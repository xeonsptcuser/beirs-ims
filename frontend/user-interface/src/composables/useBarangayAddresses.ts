import { computed, ref } from 'vue'
import type { BarangayAddress } from '@/Types'
import { fetchBarangayAddresses } from '@/Utils/addressServices'
import { orderedOptions } from '@/Utils/helpers/formatters'

const addresses = ref<BarangayAddress[]>([])
const isLoading = ref(false)
const hasFetched = ref(false)
const errorMessage = ref('')

export function useBarangayAddresses() {
  const loadBarangayAddresses = async (forceRefresh = false) => {
    if (isLoading.value) return
    if (hasFetched.value && !forceRefresh) return

    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await fetchBarangayAddresses()
      addresses.value = response.data
      hasFetched.value = true
    } catch (error: any) {
      errorMessage.value = error?.message ?? 'Failed to load barangay addresses.'
    } finally {
      isLoading.value = false
    }
  }

  const addressOptions = computed(() => {
    const activeAddresses = addresses.value
      .filter((address) => address.is_active && !address.deleted_at)
      .map((address) => address.name)

    return orderedOptions(activeAddresses)
  })

  return {
    addresses,
    addressOptions,
    isLoadingAddresses: computed(() => isLoading.value),
    addressError: computed(() => errorMessage.value),
    loadBarangayAddresses,
    refreshBarangayAddresses: () => loadBarangayAddresses(true),
  }
}
