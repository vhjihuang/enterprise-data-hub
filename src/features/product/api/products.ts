import { http } from '@/services/api-client'
import type { AxiosResponse } from 'axios'
import type { Product } from '../types'

export const getProducts = (): Promise<AxiosResponse<Product[]>> => http.get('/products')

export const addProduct = (data: Omit<Product, 'id'>): Promise<AxiosResponse<Product>> =>
  http.post('/products', data)

export const patchProduct = (id: string, data: Partial<Product>): Promise<AxiosResponse<Product>> =>
  http.patch(`/products/${id}`, data)

export const deleteProduct = (id: string): Promise<AxiosResponse<void>> => http.delete(`/products/${id}`)
