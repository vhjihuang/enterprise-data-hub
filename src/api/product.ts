import request from './index'
import type { AxiosPromise } from 'axios'
export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'available' | 'low_stock' | 'out-of-stock'
}

export const getProducts = (): AxiosPromise<Product[]> => request.get('/products')

const addProduct = (data: Omit<Product, 'id'>): AxiosPromise<Product> =>
  request.post('/products', data)

const patchProduct = (id: number, data: Partial<Product>): AxiosPromise<Product> =>
  request.patch(`/products/${id}`, data)

const deleteProduct = (id: number): AxiosPromise<void> => request.delete(`/products/${id}`)
