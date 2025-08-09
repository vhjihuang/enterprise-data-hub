import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
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
      expect(store.userRole).toBe('guest')
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

      expect(store.token).toBe('fake-jwt-token')
      expect(store.userRole).toBe('admin')
      expect(store.isInitialized).toBe(true)
    })
  })

  describe('Logout Action', () => {
    it('should clear state on logout', async () => {
      const store = useAuthStore()
      await store.login({ username: 'admin', password: '123456' })
      expect(store.token).toBe('fake-jwt-token')
      expect(store.userRole).toBe('admin')

      store.logout()
      expect(store.token).toBeNull()
      expect(store.userRole).toBe('guest')
    })
  })

  describe('Initialization', () => {
    it('should initialize from localStorage', async () => {
      // 设置本地存储
      localStorage.setItem('auth_token', 'stored-token')
      localStorage.setItem('user_role', 'user')

      const store = useAuthStore()
      await store.initializeAuth()

      expect(store.token).toBe('stored-token')
      expect(store.userRole).toBe('user')
      expect(store.isInitialized).toBe(true)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      const store = useAuthStore()
      await store.login({ username: 'admin', password: '123456' })
      expect(store.isAuthenticated).toBe(true)
    })

    it('should return false when no token', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})
