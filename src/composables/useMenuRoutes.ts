// src/composables/useMenuRoutes.ts
import { ref, watchEffect } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

// 导入所有模块化的路由数组
import { dashboardRoutes } from '@/router/routes/dashboard'
import { userRoutes } from '@/router/routes/user'
import { roleRoutes } from '@/router/routes/role'
import { productRoutes } from '@/router/routes/product'
import { orderRoutes } from '@/router/routes/order'
import { aboutRoutes } from '@/router/routes/about'

export function useMenuRoutes() {
  const router = useRouter()
  const authStore = useAuthStore()

  // 定义一个基础的菜单路由列表
  const baseMenuRoutes: RouteRecordRaw[] = [
    ...dashboardRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...aboutRoutes,
  ]

  // 用于过滤和映射路由以生成菜单项的函数
  const filterMenuRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const isAuthenticated = authStore.isAuthenticated
    const currentRole = authStore.currentRole

    return routes.filter((route) => {
      // 1. 检查 meta.title 是否存在，且不是隐藏的
      const hasTitle = !!route.meta?.title
      const isHidden = !!route.meta?.hidden
      if (!hasTitle || isHidden) {
        return false
      }

      // 2. 检查认证要求
      const requiresAuth = route.meta?.requiresAuth ?? false
      if (requiresAuth && !isAuthenticated) {
        return false
      }

      // 3. 检查角色权限
      if (route.meta?.roles && currentRole) {
        const requiredRoles = Array.isArray(route.meta.roles)
          ? route.meta.roles
          : [route.meta.roles]
        if (!requiredRoles.includes(currentRole)) {
          return false
        }
      }

      return true
    })
  }

  // 响应式的菜单路由列表
  const menuRoutes = ref<RouteRecordRaw[]>(filterMenuRoutes(baseMenuRoutes))

  // 当认证状态或用户角色变化时，重新计算菜单
  watchEffect(() => {
    menuRoutes.value = filterMenuRoutes(baseMenuRoutes)
  })

  return { menuRoutes }
}
