import { defineStore } from 'pinia'
import { auth } from '@/services'
interface AuthState {
  token: string | null
  userRole: 'admin' | 'user' | 'guest' | string | null
  isInitialized: boolean
}

// 定义 localStorage 的键名，集中管理
const AUTH_TOKEN_KEY = 'auth_token'
const USER_ROLE_KEY = 'user_role'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: auth.getToken(),
    userRole: auth.getRole(),
    isInitialized: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentRole: (state) => state.userRole,
  },
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await auth.login(credentials)

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
      auth.clearAuthData()
    },
    initializeAuth() {
      this.isInitialized = true // 标记为已初始化
    },
  },
})
