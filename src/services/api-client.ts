import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

// 与旧版 utils/request.ts 行为保持一致：
// - 返回 AxiosResponse，业务层自行使用 response.data
// - 统一处理错误与 401 跳转

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // 与旧实现一致：直接返回响应对象
    return response
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status
    const msg = error.response?.data?.message || error.message || '网络错误'

    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    } else {
      ElMessage.error(msg)
    }

    return Promise.reject(error)
  },
)

// 常用方法（保持 AxiosResponse 返回类型）
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
}

export default apiClient
