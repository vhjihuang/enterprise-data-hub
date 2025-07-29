// src/router/routes/role.ts
import type { RouteRecordRaw } from 'vue-router'

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/roles',
    name: 'RoleManagement', // 使用更具语义化的名称，例如 'RoleManagement'
    component: () => import('@/views/role-management/RoleListPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '角色管理',
      icon: 'User', // Element Plus 图标名称
      requiresAuth: true,
      roles: ['admin'],
    },
  },
]
