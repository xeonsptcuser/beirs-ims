import type {
  CreateAccountRequestPayload,
  UpdateAccountRequestPayload,
  User,
} from '@/Types/user-related-types'
import { ApiService } from '../ApiService'
import type { ApiResponse, PageInfo, PaginatedData } from '@/Types'

export class UserRelatedService {
  private static instance: UserRelatedService
  private readonly apiService: ApiService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  public static getInstance(): UserRelatedService {
    if (!UserRelatedService.instance) {
      UserRelatedService.instance = new UserRelatedService()
    }
    return UserRelatedService.instance
  }

  async getAllUsers(url: string, params?: PageInfo): Promise<ApiResponse<PaginatedData<User[]>>> {
    return this.apiService.get<ApiResponse<PaginatedData<User[]>>>(url, params)
  }

  async createUserAccount(
    url: string,
    data: CreateAccountRequestPayload | FormData
  ): Promise<ApiResponse<User>> {
    return this.apiService.post<ApiResponse<User>>(url, data)
  }

  async toggleUserAccount(url: string, data: { is_active: boolean }): Promise<ApiResponse<User>> {
    return this.apiService.patch<ApiResponse<User>>(url, data)
  }

  async getSingleUserAccount(url: string): Promise<ApiResponse<User>> {
    return this.apiService.get(url)
  }

  async updateSingleUserAccount(
    url: string,
    data: UpdateAccountRequestPayload | FormData
  ): Promise<ApiResponse<User>> {
    if (data instanceof FormData) {
      data.append('_method', 'PATCH') // PHP populates $_FILES only on POST
      return this.apiService.post(url, data)
    }

    return this.apiService.patch(url, data)
  }

  async deleteUserAccount(url: string): Promise<ApiResponse<User>> {
    return this.apiService.delete<ApiResponse<User>>(url)
  }
}
