import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

// 请求拦截器配置
export function setupRequestInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加认证 token
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 添加请求 ID 用于追踪
      config.headers['X-Request-ID'] = generateRequestId()

      return config
    },
    (error: AxiosError) => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    },
  )
}

// 响应拦截器配置
export function setupResponseInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      // 处理成功响应（如果你的后端有业务 code，可在这里统一判断）
      const data: any = response.data
      if (data && typeof data === 'object' && 'code' in data && data.code !== 200) {
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      return response
    },
    (error: AxiosError<any>) => {
      // 处理错误响应
      const { response } = error

      if (response) {
        const status = response.status
        const data: any = response.data || {}

        switch (status) {
          case 400:
            ElMessage.error(data.message || '请求参数错误')
            break
          case 401:
            ElMessage.error('登录已过期，请重新登录')
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
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
}

// 生成请求 ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}
