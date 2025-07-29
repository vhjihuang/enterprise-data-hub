// src/router/routes/dashboard.ts
import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/', // 对应你旧的 '/' 路径
    name: 'Dashboard', // 使用更具语义化的名称，例如 'Dashboard'
    component: () => import('@/views/dashboard/DashboardPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '仪表盘',
      icon: 'Odometer', // Element Plus 图标名称
      requiresAuth: true,
      roles: ['admin', 'user'],
    },
  },
]
