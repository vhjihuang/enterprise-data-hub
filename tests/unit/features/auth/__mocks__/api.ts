import { vi } from 'vitest'
export const login = vi.fn(async (credentials) => {
  if (credentials.username === 'admin') {
    return {
      token: 'mock-token',
      role: 'admin',
    }
  }
  throw new Error('Invalid credentials')
})

export const getToken = vi.fn(() => 'mock-token')
export const getRole = vi.fn(() => 'admin')
export const clearAuthData = vi.fn()
