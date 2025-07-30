// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

// ✅ 导入所有模块化的路由数组
// 这些是你在 src/router/routes/ 目录下创建的文件
import { authRoutes } from './routes/auth'
import { dashboardRoutes } from './routes/dashboard'
import { userRoutes } from './routes/user'
import { roleRoutes } from './routes/role'
import { productRoutes } from './routes/product'
import { orderRoutes } from './routes/order'
import { aboutRoutes } from './routes/about'

// ✅ 定义系统级路由 (例如 404 页面)。
// 如果你希望将 404 路由放在单独的 system.ts 文件中，可以从那里导入。
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
    name: 'NotFound',
    component: () => import('@/views/not-found/NotFoundPage.vue'), // ✅ 指向你新的 404 页面路径
    meta: { title: '404 Not Found', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // ✅ 将所有模块化的路由和系统级路由合并
  routes: [
    ...authRoutes,
    ...dashboardRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...aboutRoutes,
    ...systemRoutes,
  ],
})

// 路由守卫逻辑 (从你旧的 index.ts 中提取并略作优化)
const setDocumentTitle = (title?: string) => {
  document.title = title ? `${title} - 企业级数据中心` : '企业级数据中心'
}

const initializeAuthState = async () => {
  const authStore = useAuthStore()
  // 仅在未初始化时调用 initializeAuth。Pinia Store 内部会处理 localStorage 读取。
  // 移除了冗余的 localStorage.getItem('auth_token') 检查
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }
  return authStore
}

router.beforeEach(async (to) => {
  setDocumentTitle(to.meta.title)
  const authStore = await initializeAuthState()

  if (to.path === '/login') {
    // 如果已认证，尝试重定向到仪表盘，否则允许访问登录页
    return authStore.isAuthenticated ? '/' : true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果需要认证但未认证，重定向到登录页
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 权限检查 (如果路由定义了 roles 并且用户角色不匹配)
  if (to.meta.requiresAuth && to.meta.roles && authStore.currentRole) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles]
    if (!requiredRoles.includes(authStore.currentRole)) {
      // 如果用户角色没有权限，重定向到首页 (或者如果你有 403 页面，可以重定向到 '/403')
      console.warn(
        `User role '${authStore.currentRole}' does not have required roles: ${requiredRoles.join(', ')} for path '${to.path}'`,
      )
      return { path: '/' }
    }
  }

  return true // 允许导航
})

export default router
