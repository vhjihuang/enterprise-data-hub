// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

// 导入各模块路由
import { authRoutes } from './routes/auth'
import { dashboardRoutes } from './routes/dashboard'
import { userRoutes } from './routes/user'
import { roleRoutes } from './routes/role'
import { productRoutes } from './routes/product'
import { orderRoutes } from './routes/order'
import { aboutRoutes } from './routes/about'

// 系统级路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@features/not-found/NotFoundPage.vue'),
    meta: { title: '404 Not Found', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 业务路由
    ...authRoutes,
    ...dashboardRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...aboutRoutes,
    // 系统路由放在最后
    ...systemRoutes,
  ],
})

// 路由守卫逻辑
const setDocumentTitle = (title?: string) => {
  document.title = title ? `${title} - 企业级数据中心` : '企业级数据中心'
}

router.beforeEach(async (to) => {
  setDocumentTitle(to.meta.title as string)
  const authStore = useAuthStore()

  // 初始化认证状态
  if (!authStore.isInitialized) {
    authStore.initializeAuth()
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' }
  }

  // 检查角色权限
  if (
    authStore.isAuthenticated &&
    to.meta.roles &&
    authStore.userRole &&
    !to.meta.roles.includes(authStore.userRole)
  ) {
    // 根据用户角色重定向到合适的默认页面
    const defaultPath = authStore.userRole === 'admin' ? '/dashboard' : '/about'
    return { path: defaultPath }
  }

  // 登录成功后重定向到首页或其他页面
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return { path: '/' }
  }
  
  return true
})

export default router