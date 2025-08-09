import { defineStore } from 'pinia'
import * as authApi from '../api/auth'
import type { LoginResponse, AuthState } from '../types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: authApi.getToken(),
    userRole: authApi.getRole() || 'guest',
    isInitialized: false,
    username: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => ({
      role: state.userRole,
      username: state.username,
    }),
    currentRole: (state) => state.userRole,
  },
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await authApi.login(credentials)
        
        // 保存认证数据到localStorage
        authApi.setAuthData(response.token, response.role, response.username)

        this.$patch({
          userRole: response.role,
          token: response.token,
          username: response.username,
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
        username: null,
        isInitialized: true,
      })
      authApi.clearAuthData()
    },
    initializeAuth() {
      // 从localStorage恢复认证信息
      const token = authApi.getToken()
      const role = authApi.getRole()
      
      if (token && role) {
        this.$patch({
          token,
          userRole: role,
        })
      }
      
      this.isInitialized = true // 标记为已初始化
    },
  },
})