import type { AxiosInstance } from 'axios'
import api from './axios'

interface IApiService {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data?: any): Promise<T>
  put<T>(url: string, data?: any): Promise<T>
  patch<T>(url: string, data?: any): Promise<T>
  delete<T>(url: string, data?: any): Promise<T>
}

export class ApiService implements IApiService {
  private static instance: ApiService
  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = api
  }
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    const response = await this.axiosInstance.post<T>(url, data, config)
    return response.data ? response.data : (response as any).response?.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    const response = await this.axiosInstance.put<T>(url, data, config)
    return response.data ? response.data : (response as any).response?.data
  }
  async patch<T>(url: string, data?: any): Promise<T> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    const response = await this.axiosInstance.patch<T>(url, data, config)
    return response.data
  }
  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url)
    return response.data
  }
}
