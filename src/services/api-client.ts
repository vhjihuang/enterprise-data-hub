import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

interface ApiResponse<T> {
  code?: number
  data?: T
  message?: string
  status?: number
}

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：从 Pinia Store 获取 Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证 token
    const authStore = useAuthStore() // 获取 auth store 实例
    if (authStore.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authStore.token}` // 从 store 获取 token
    }

    // 添加请求 ID 用于追踪
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    return config
  },
  (error: AxiosError) => {
    console.error('Axios Request Error:', error)
    ElMessage.error('请求发送失败，请检查网络或配置')
    // 请求拦截器中的错误，通常直接拒绝 Promise
    return Promise.reject(error)
  },
)

// 响应拦截器：统一处理成功响应和错误响应
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 检查 HTTP 状态码是否为 2xx
    if (response.status >= 200 && response.status < 300) {
      // 处理成功响应（如果你的后端有业务 code，可在这里统一判断）
      const data: any = response.data
      if (data && typeof data === 'object' && 'code' in data && data.code !== 200) {
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      return response
    }
    // 如果后端返回非 2xx 但依然是 JSON，根据业务 message 抛出错误
    const errorMessage = response.data?.message || '服务器返回业务错误'
    ElMessage.error(errorMessage)
    return Promise.reject(new Error(errorMessage)) // 拒绝 Promise，传递业务错误信息
  },
  (error: AxiosError<ApiResponse<any>>) => {
    console.error('Axios Response Error:', error)

    // 处理错误响应
    const { response } = error

    if (response) {
      const status = response.status
      const data: any = response.data || {}
      const authStore = useAuthStore() // 获取 auth store 实例

      switch (status) {
        case 400:
          ElMessage.error(data.message || '请求参数错误')
          break
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          authStore.logout() // 调用 store 的 logout action，它会清除数据并重定向
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

// 常用方法（保持 AxiosResponse 返回类型）
export const http = {
  get: <T = any>(url: string, config?: any) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => apiClient.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: any) => apiClient.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: any) => apiClient.patch<T>(url, data, config),
}

export default apiClient