import request from '@/api/index'
import type { AxiosPromise } from 'axios'

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}
export interface Order {
  id: string
  userId: number
  userName: string
  orderDate: string
  totalAmount: number
  status: 'pending' | 'shipped' | 'computed' | 'cancelled'
  items: OrderItem[]
}
export const getOrders = (): AxiosPromise<Order[]> => request.get('/orders')

export const addOrder = (data: Omit<Order, 'id'>): AxiosPromise<Order> =>
  request.post('/orders', data)

export const updateOrder = (id: number, data: Partial<Order>): AxiosPromise<Order> =>
  request.put(`/orders/${id}`, data)
export const deleteOrder = (id: string): AxiosPromise<void> => request.delete(`/orders/${id}`)
