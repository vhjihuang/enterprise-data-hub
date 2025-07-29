import service from '@/utils/request'
import type { AxiosPromise } from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}
/**
 * 获取所有用户列表
 * @returns 用户列表 Promise
 */ export const getUsers = (): AxiosPromise<User[]> => service.get('/users')

/**
 * 根据ID获取单个用户
 * @param id 用户ID
 * @returns 用户信息 Promise
 */
export const getUserById = (id: string) => {
  return service.get<User>(`/users/${id}`)
}

/**
 * 创建新用户
 * @param userData 用户数据
 * @returns 创建成功的用户信息 Promise
 */
export const addUser = (userData: Omit<User, 'id'>): AxiosPromise<User> =>
  service.post('/users', userData)

/**
 * 更新用户信息
 * @param id 用户ID
 * @param userData 更新的用户数据
 * @returns 更新后的用户信息 Promise
 */ export const updateUser = (id: string, userData: Partial<User>): AxiosPromise<User> =>
  service.patch(`/users/${id}`, userData)

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除操作的 Promise
 */ export const deleteUser = (id: string): AxiosPromise<void> => service.delete(`/users/${id}`)
