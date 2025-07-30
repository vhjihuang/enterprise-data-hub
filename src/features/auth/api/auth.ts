// src/api/auth.ts
import service from '@/utils/request'
import type { LoginResponse } from '../types/index'

const AUTH_TOKEN_KEY = 'auth_token'
const USER_ROLE_KEY = 'user_role'

export const login = async (credentials: {
  username: string
  password: string
}): Promise<LoginResponse> => {
  try {
    const response = await service.post<LoginResponse>('/login', credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

export const setAuthData = (token: string, role: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(USER_ROLE_KEY, role)
}

export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
}

export const getRole = (): 'admin' | 'user' | 'guest' | string | null => {
  const role = localStorage.getItem(USER_ROLE_KEY)
  // 确保返回的类型符合预期
  if (role === 'admin' || role === 'user' || role === 'guest') {
    return role
  }
  return role // 如果是其他字符串，也直接返回
}

export const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY)

export const logout = (): void => {
  clearAuthData()
  service.post('/logout')
}
