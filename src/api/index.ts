import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { ElMessage } from 'element-plus'

interface ApiResponse<T> {
  code?: number
  data?: T
  message?: string
  status?: number
}

const service: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    console.log('Axios Request Error', error)
    ElMessage.error('请求发送失败,请检查网络或配置!')
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.status === 200 || response.status === 201) {
      return response
    } else {
      return Promise.reject(new Error(response.data.message) || '未知错误')
    }
  },
  (error: AxiosError) => {
    console.log('Axios Response Error', error)
    let message = '请求失败,请稍后重试!'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误, 请检查您的参数!'
          break
        case 401:
          message = '未授权,请登录或检查权限!'
          break
        case 403:
          message = '拒绝访问:你没有权限访问该资源!'
          break
        case 404:
          message = '请求资源不存在!'
          break
        case 408:
          message = '请求超时,请重试!'
          break
        case 500:
          message = '服务器内部错误!'
          break
        case 502:
          message = '网关错误!'
          break
        case 503:
          message = '服务不可用!'
          break
        case 504:
          message = '网关超时!'
          break
        default:
          message = `网络异常${error.response.status}`
      }
    } else if (error.request) {
      message = '网络连接错误,请检查网络或防火墙配置!'
    } else {
      message = '发生未知错误,请联系管理员!'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  },
)

export default service
