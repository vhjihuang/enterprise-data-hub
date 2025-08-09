// src/api/auth.ts
import { http } from '@/services/api-client'
import type { LoginResponse } from '../types/index'

const AUTH_TOKEN_KEY = 'auth_token'
const USER_ROLE_KEY = 'user_role'
const USERNAME_KEY = 'username'

export const login = async (credentials: {
  username: string
  password: string
}): Promise<LoginResponse> => {
  try {
    // 使用真实的API调用
    const response = await http.post<LoginResponse>('/login', credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

export const setAuthData = (token: string, role: string, username: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(USER_ROLE_KEY, role)
  localStorage.setItem(USERNAME_KEY, username)
}

export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export const getRole = (): 'admin' | 'user' | 'guest' | string | null => {
  const role = localStorage.getItem(USER_ROLE_KEY)
  // 确保返回的类型符合预期
  if (role === 'admin' || role === 'user' || role === 'guest') {
    return role
  }
  return role // 如果是其他字符串，也直接返回
}

export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_KEY)
}

export const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY)

export const logout = (): void => {
  clearAuthData()
}