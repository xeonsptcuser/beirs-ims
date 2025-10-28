import type { BaseResponse } from "@/Types/base-response";
import type { AxiosInstance } from "axios";
import api from "./axios";

interface IApiService {
  get<T>(url: string): Promise<BaseResponse<T>>;
  post<T>(url: string, data?: any): Promise<BaseResponse<T>>;
  get<T>(url: string, data?: any): Promise<BaseResponse<T>>;
  get<T>(url: string, data?: any): Promise<BaseResponse<T>>;
  get<T>(url: string): Promise<BaseResponse<T>>;
}

export class ApiService implements IApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = api;
  }
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T>(url: string): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.get<BaseResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.put<BaseResponse<T>>(url, data);
    return response.data ? response.data : (response as any).response?.data;
  }

  async put<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.put<BaseResponse<T>>(url, data);
    return response.data ? response.data : (response as any).response?.data;
  }
  async patch<T>(url: string, data?: any): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.put<BaseResponse<T>>(url, data);
    return response.data;
  }
  async delete<T>(url: string): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.delete<BaseResponse<T>>(url);
    return response.data;
  }
}
