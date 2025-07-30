import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@auth-store/useAuthStore'
import * as authApi from '@features/auth/api/auth'
import { nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'

// 模拟API
vi.mock('../../../../src/features/auth/api/auth')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const store = useAuthStore()
      expect(store.token).toBeNull()
      expect(store.userRole).toBeNull()
      expect(store.isInitialized).toBe(false)
    })
  })

  describe('Login Action', () => {
    it('should update state on successful login', async () => {
      const store = useAuthStore()
      await store.login({ username: 'admin', password: '123456' })

      expect(authApi.login).toHaveBeenCalledWith({
        username: 'admin',
        password: '123456',
      })
      expect(store.token).toBe('mock-token')
      expect(store.userRole).toBe('admin')
      expect(store.isInitialized).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
    })

    it('should handle login failure', async () => {
      vi.mocked(authApi.login).mockRejectedValueOnce(new Error('Invalid credentials'))
      const store = useAuthStore()

      await expect(store.login({ username: 'wrong', password: 'wrong' })).rejects.toThrow(
        'Invalid credentials',
      )

      expect(store.token).toBeNull()
      expect(store.userRole).toBeNull()
      expect(authApi.clearAuthData).toHaveBeenCalled()
    })
  })

  describe('Logout Action', () => {
    it('should clear auth data', async () => {
      const store = useAuthStore()
      store.$patch({ token: 'existing-token', userRole: 'admin' })

      store.logout()

      expect(store.token).toBeNull()
      expect(store.userRole).toBeNull()
      expect(authApi.clearAuthData).toHaveBeenCalled()
    })
  })

  describe('Getters', () => {
    it('isAuthenticated should return true when token exists', () => {
      const store = useAuthStore()
      store.$patch({ token: 'test-token' })
      expect(store.isAuthenticated).toBe(true)
    })

    it('currentRole should return user role', () => {
      const store = useAuthStore()
      store.$patch({ userRole: 'admin' })
      expect(store.currentRole).toBe('admin')
    })
  })
})
