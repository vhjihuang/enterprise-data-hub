// 导出统一的 API 客户端
export { default as apiClient, http } from './api-client'

// 导出各模块的 API
export * as auth from '@/features/auth/api/auth'
export * as users from '@/features/user/api/users'
export * as products from '@/features/product/api/products'
export * as orders from '@/features/order/api/orders'
