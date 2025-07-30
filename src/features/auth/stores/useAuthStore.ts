import { defineStore } from 'pinia'
import * as authApi from '../api/auth'
import type { LoginResponse, AuthState } from '../types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: authApi.getToken(),
    userRole: authApi.getRole(),
    isInitialized: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentRole: (state) => state.userRole,
  },
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await authApi.login(credentials)

        this.$patch({
          userRole: response.role,
          token: response.token,
        })

        this.isInitialized = true
        return response
      } catch (error) {
        // 登录失败，确保状态被清理
        this.logout()
        throw error // 重新抛出错误以便组件处理
      }
    },
    logout() {
      this.$patch({
        userRole: 'guest',
        token: null,
        isInitialized: true,
      })
      authApi.clearAuthData()
    },
    initializeAuth() {
      this.isInitialized = true // 标记为已初始化
    },
  },
})
