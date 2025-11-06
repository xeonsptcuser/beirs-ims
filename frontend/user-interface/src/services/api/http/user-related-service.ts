import type { User } from '@/Types/user-related-types'
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
    console.log(params)
    return this.apiService.get<ApiResponse<PaginatedData<User[]>>>(url, params)
  }
}
