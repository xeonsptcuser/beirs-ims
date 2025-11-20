import { endpoints } from '@/services/api/endpoints'
import { AddressService } from '@/services/api/http/address-service'
import type { ApiResponse, BarangayAddress, BarangayAddressPayload } from '@/Types'

const addressService = AddressService.getInstance()

export const fetchBarangayAddresses = async () => {
  const response = await addressService.getAllAddresses(endpoints.GET_ALL_ADDRESSES)

  if (!response.status || response.status !== 'success') {
    throw new Error('Failed to load barangay addresses.')
  }

  return response
}

export const createBarangayAddress = async (payload: BarangayAddressPayload) => {
  const response = await addressService.createAddress(endpoints.CREATE_ADDRESS, payload)

  if (!response.status || response.status !== 'success') {
    throw new Error(response.message ?? 'Failed to save barangay address.')
  }

  return response
}

export const updateBarangayAddress = async (
  addressId: number | string,
  payload: Partial<BarangayAddressPayload>
): Promise<ApiResponse<BarangayAddress>> => {
  const response = await addressService.updateAddress(endpoints.UPDATE_ADDRESS(addressId), payload)

  if (!response.status || response.status !== 'success') {
    throw new Error(response.message ?? 'Failed to update barangay address.')
  }

  return response
}

export const deleteBarangayAddress = async (addressId: number | string) => {
  const response = await addressService.deleteAddress(endpoints.DELETE_ADDRESS(addressId))

  if (!response.status || response.status !== 'success') {
    throw new Error(response.message ?? 'Failed to delete barangay address.')
  }

  return response
}
