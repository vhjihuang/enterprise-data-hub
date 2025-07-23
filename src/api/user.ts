import request from './index'
import type { AxiosPromise } from 'axios'

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

// 获取用户列表
export const getUsers = (): AxiosPromise<User[]> => request.get('/users')

// 添加用户
export const addUser = (data: Omit<User, 'id'>): AxiosPromise<User> => request.post('/users', data)

// 更新用户
export const updateUser = (id: number, data: Partial<User>): AxiosPromise<User> =>
  request.put(`/users/${id}`, data)

// 删除用户
export const deleteUser = (id: number): AxiosPromise<void> => request.delete(`/users/${id}`)
