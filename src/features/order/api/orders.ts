import { http } from '@/services/api-client'
import type { AxiosResponse } from 'axios'

import type { Order, OrderItem, OrderStatus } from '../types'

// 使用更明确的返回类型，而不是AxiosPromise
export const getOrders = (): Promise<AxiosResponse<Order[]>> => {
  return http.get('/orders')
}

// 使用更严格的类型，Omit掉不需要的字段
export const createOrder = (
  data: Omit<Order, 'id' | 'status'> & { status?: OrderStatus },
): Promise<AxiosResponse<Order>> => {
  return http.post('/orders', data)
}

// 使用Partial但排除不可更新字段
export const updateOrder = (
  id: string,
  data: Partial<Omit<Order, 'id' | 'userId' | 'userName' | 'orderDate'>>,
): Promise<AxiosResponse<Order>> => {
  return http.patch(`/orders/${id}`, data)
}

// 更明确的删除操作返回类型
export const deleteOrder = (id: string): Promise<AxiosResponse<void>> => {
  return http.delete(`/orders/${id}`)
}

// 可选：添加按状态查询订单的方法
export const getOrdersByStatus = (status: OrderStatus): Promise<AxiosResponse<Order[]>> => {
  return http.get('/orders', { params: { status } })
}
