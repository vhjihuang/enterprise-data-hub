// src/composables/useMenuRoutes.ts
import { ref, watchEffect } from 'vue' // ✅ 确保 ref 已导入
import { useRouter, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

// ✅ 导入所有模块化的路由数组
// 这些路由文件位于 src/router/routes/ 目录下
// 这样可以确保菜单是根据你明确定义的路由源生成的，而不是依赖 router.getRoutes()
import { dashboardRoutes } from '@/router/routes/dashboard'
import { userRoutes } from '@/router/routes/user'
import { roleRoutes } from '@/router/routes/role'
import { productRoutes } from '@/router/routes/product'
import { orderRoutes } from '@/router/routes/order'
import { aboutRoutes } from '@/router/routes/about'
// 你可能不希望登录路由或 404 路由出现在主菜单中，所以这里不需要导入 authRoutes 和 systemRoutes

export function useMenuRoutes() {
  const router = useRouter() // 仍然需要 useRouter 来进行路由跳转
  const authStore = useAuthStore() // 获取 auth store 实例，只获取一次

  // ✅ 定义一个基础的菜单路由列表，它是所有你希望显示在菜单中的模块化路由的集合
  const baseMenuRoutes: RouteRecordRaw[] = [
    ...dashboardRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...aboutRoutes,
    // 你可以根据需要添加或移除其他模块的路由
  ]

  // 用于过滤和映射路由以生成菜单项的函数
  const filterMenuRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const isAuthenticated = authStore.isAuthenticated // 从 Pinia Store 获取认证状态
    const currentRole = authStore.currentRole // 从 Pinia Store 获取用户角色

    // 递归处理子路由（如果你的菜单需要多级嵌套）
    return routes.filter((route) => {
      // 1. 检查 meta.title 是否存在（用于菜单显示），且不是隐藏的
      const hasTitle = !!route.meta?.title
      const isHidden = !!route.meta?.hidden
      if (!hasTitle || isHidden) {
        return false // 没有标题或被隐藏，不显示
      }

      // 2. 检查认证要求
      const requiresAuth = route.meta?.requiresAuth ?? false // ✅ 如果未定义，默认为 false (不要求认证)
      if (requiresAuth && !isAuthenticated) {
        return false // 需要认证但用户未登录，不显示
      }

      // 3. 检查角色权限
      if (route.meta?.roles && currentRole) {
        const requiredRoles = Array.isArray(route.meta.roles)
          ? route.meta.roles
          : [route.meta.roles]
        if (!requiredRoles.includes(currentRole)) {
          return false // 用户角色不匹配所需权限，不显示
        }
      }

      // ✅ 移除 route.children?.length === 0 限制
      // 这样父级路由（即使有子路由）也可以作为菜单项显示。
      // 如果你的菜单需要支持嵌套，这里还需要进一步处理 route.children
      // 例如：如果 route.children 存在，你可能需要递归调用 filterMenuRoutes 处理子路由
      // 但对于 App.vue 中扁平的 el-menu-item 结构，当前这样处理是足够的。

      return true // 满足所有条件，显示此路由
    })
    // 如果需要嵌套菜单，这里可以进一步 map 处理 children，例如：
    // .map(route => ({
    //   ...route,
    //   children: route.children ? filterMenuRoutes(route.children) : undefined
    // }))
  }

  // 响应式的菜单路由列表
  const menuRoutes = ref<RouteRecordRaw[]>(filterMenuRoutes(baseMenuRoutes))

  // 当认证状态或用户角色变化时，重新计算菜单
  // watchEffect 会自动追踪 authStore.isAuthenticated 和 authStore.currentRole 的变化
  watchEffect(() => {
    menuRoutes.value = filterMenuRoutes(baseMenuRoutes)
  })

  return { menuRoutes }
}
