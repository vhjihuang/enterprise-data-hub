import request from './index'
import type { AxiosPromise } from 'axios'
export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'available' | 'low_stock' | 'out-of-stock'
}

export const getProducts = (): AxiosPromise<Product[]> => request.get('/products')

export const addProduct = (data: Omit<Product, 'id'>): AxiosPromise<Product> =>
  request.post('/products', data)

export const patchProduct = (id: number, data: Partial<Product>): AxiosPromise<Product> =>
  request.patch(`/products/${id}`, data)

export const deleteProduct = (id: string): AxiosPromise<void> => request.delete(`/products/${id}`)
