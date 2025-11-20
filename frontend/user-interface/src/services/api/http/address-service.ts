import type { ApiResponse, BarangayAddress, BarangayAddressPayload } from '@/Types'
import { ApiService } from '../ApiService'

export class AddressService {
  private static instance: AddressService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }

    return AddressService.instance
  }

  async getAllAddresses(url: string): Promise<ApiResponse<BarangayAddress[]>> {
    return this.apiService.get(url)
  }

  async createAddress(url: string, data: BarangayAddressPayload): Promise<ApiResponse<BarangayAddress>> {
    return this.apiService.post(url, data)
  }

  async updateAddress(
    url: string,
    data: Partial<BarangayAddressPayload>
  ): Promise<ApiResponse<BarangayAddress>> {
    return this.apiService.patch(url, data)
  }

  async deleteAddress(url: string): Promise<ApiResponse<null>> {
    return this.apiService.delete(url)
  }
}
