import service from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { Product } from '../types'

export const getProducts = (): AxiosPromise<Product[]> => service.get('/products')

export const addProduct = (data: Omit<Product, 'id'>): AxiosPromise<Product> =>
  service.post('/products', data)

export const patchProduct = (id: string, data: Partial<Product>): AxiosPromise<Product> =>
  service.patch(`/products/${id}`, data)

export const deleteProduct = (id: string): AxiosPromise<void> => service.delete(`/products/${id}`)
