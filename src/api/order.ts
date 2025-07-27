import request from '@/api/index'
import type { AxiosPromise } from 'axios'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}
export interface Order {
  id: string
  userId: string
  userName: string
  orderDate: string
  totalAmount: number | string
  status: 'pending' | 'shipped' | 'completed' | 'cancelled'
  items: OrderItem[]
}
export const getOrders = (): AxiosPromise<Order[]> => request.get('/orders')

export const addOrder = (data: Omit<Order, 'id'>): AxiosPromise<Order> =>
  request.post('/orders', data)

export const updateOrder = (id: string, data: Partial<Order>): AxiosPromise<Order> =>
  request.patch(`/orders/${id}`, data)
export const deleteOrder = (id: string): AxiosPromise<void> => request.delete(`/orders/${id}`)
