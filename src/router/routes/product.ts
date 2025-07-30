// src/router/routes/product.ts
import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'ProductManagement', // 使用更具语义化的名称，例如 'ProductManagement'
    component: () => import('@/features/product/ProductListPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '商品管理',
      icon: 'ShoppingCart', // Element Plus 图标名称
      requiresAuth: true,
      roles: ['admin', 'user'],
    },
  },
]
