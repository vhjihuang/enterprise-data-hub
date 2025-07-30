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

const service: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // 根据你的 db.json 和 json-server 配置
  timeout: 5000,
})

// 请求拦截器：从 Pinia Store 获取 Token
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore() // 获取 auth store 实例
    if (authStore.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authStore.token}` // 从 store 获取 token
    }
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
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 检查 HTTP 状态码是否为 2xx
    if (response.status >= 200 && response.status < 300) {
      // 你也可以在这里根据后端返回的 `code` 字段判断业务成功或失败
      // 例如：if (response.data.code !== 0) { throw new Error(response.data.message); }
      return response
    }
    // 如果后端返回非 2xx 但依然是 JSON，根据业务 message 抛出错误
    const errorMessage = response.data?.message || '服务器返回业务错误'
    ElMessage.error(errorMessage)
    return Promise.reject(new Error(errorMessage)) // 拒绝 Promise，传递业务错误信息
  },
  (error: AxiosError<ApiResponse<any>>) => {
    console.error('Axios Response Error:', error)

    const authStore = useAuthStore() // 获取 auth store 实例
    let displayMessage: string // 用于显示给用户的错误信息

    // 1. 判断是否是网络错误（无响应）
    if (!error.response) {
      displayMessage = error.request
        ? '网络连接错误，请检查网络或防火墙配置'
        : '发生未知错误，请联系管理员'
    } else {
      // 2. 根据 HTTP 状态码处理错误
      const status = error.response.status
      const serverMessage = error.response.data?.message // 后端返回的错误消息

      if (status === 401) {
        // 401 Unauthorized: token 过期或无效
        displayMessage = serverMessage || '登录已过期，请重新登录'
        authStore.logout() // 调用 store 的 logout action，它会清除数据并重定向
      } else {
        // 其他 HTTP 错误码
        const messages: Record<number, string> = {
          400: '请求错误：参数无效或请求体错误',
          403: '拒绝访问：您没有权限执行此操作',
          404: '请求资源不存在',
          405: 'HTTP方法不允许',
          408: '请求超时，请重试',
          500: '服务器内部错误，请稍后重试',
          502: '网关错误',
          503: '服务不可用',
          504: '网关超时',
          // 可以根据你的项目需求添加更多错误码的处理
        }
        displayMessage = serverMessage || messages[status] || `发生错误：${status}`
      }
    }

    ElMessage.error(displayMessage) // 统一显示错误消息

    return Promise.reject(error)
  },
)

export default service
