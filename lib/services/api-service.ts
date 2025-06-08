import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import { useAuthStore } from "@/lib/store/auth-store"

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private async handleAuthError() {
    // Clear auth state
    const authStore = useAuthStore.getState()
    await authStore.signOut()
    
    // // Redirect to login
    // if (typeof window !== "undefined") {
    //   window.location.href = "/auth/signin"
    // }
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 and other auth-related errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          await this.handleAuthError()
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.get<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error
      
      // Handle auth errors
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        this.handleAuthError()
      }

      return error?.response?.data
    }
    return error
  }
}

export const apiService = new ApiService() 