import { defineStore } from 'pinia'

interface RootState {
  // 全局加载状态
  globalLoading: boolean
  // 全局错误信息
  globalError: string | null
  // 应用主题
  theme: 'light' | 'dark'
  // 侧边栏折叠状态
  sidebarCollapsed: boolean
  // 用户偏好设置
  userPreferences: {
    language: string
    timezone: string
  }
}

export const useRootStore = defineStore('root', {
  state: (): RootState => ({
    globalLoading: false,
    globalError: null,
    theme: 'light',
    sidebarCollapsed: false,
    userPreferences: {
      language: 'zh-CN',
      timezone: 'Asia/Shanghai'
    }
  }),

  getters: {
    // 获取当前主题
    currentTheme: (state) => state.theme,
    
    // 获取侧边栏状态
    isSidebarCollapsed: (state) => state.sidebarCollapsed,
    
    // 获取用户偏好
    getUserPreferences: (state) => state.userPreferences
  },

  actions: {
    // 设置全局加载状态
    setGlobalLoading(loading: boolean) {
      this.globalLoading = loading
    },

    // 设置全局错误
    setGlobalError(error: string | null) {
      this.globalError = error
    },

    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      // 保存到 localStorage
      localStorage.setItem('theme', this.theme)
    },

    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置侧边栏状态
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },

    // 更新用户偏好
    updateUserPreferences(preferences: Partial<RootState['userPreferences']>) {
      this.userPreferences = { ...this.userPreferences, ...preferences }
      // 保存到 localStorage
      localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences))
    },

    // 初始化应用状态
    initializeApp() {
      // 从 localStorage 恢复主题
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
      if (savedTheme) {
        this.theme = savedTheme
      }

      // 从 localStorage 恢复用户偏好
      const savedPreferences = localStorage.getItem('userPreferences')
      if (savedPreferences) {
        try {
          this.userPreferences = JSON.parse(savedPreferences)
        } catch (error) {
          console.warn('Failed to parse user preferences:', error)
        }
      }
    }
  }
}) 