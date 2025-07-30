// src/router/routes/order.ts
import type { RouteRecordRaw } from 'vue-router'

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'OrderManagement', // 使用更具语义化的名称，例如 'OrderManagement'
    component: () => import('@/features/order/OrderListPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '订单管理',
      icon: 'ShoppingCart', // Element Plus 图标名称
      requiresAuth: true,
      roles: ['admin', 'user'],
    },
  },
]
