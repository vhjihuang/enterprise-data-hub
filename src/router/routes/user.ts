// src/router/routes/user.ts
import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UserManagement', // 使用更具语义化的名称，例如 'UserManagement'
    component: () => import('@/features/user/UserListPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '用户管理',
      icon: 'User', // Element Plus 图标名称
      requiresAuth: true,
      roles: ['admin'],
    },
  },
]
