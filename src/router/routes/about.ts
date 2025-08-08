// src/router/routes/about.ts
import type { RouteRecordRaw } from 'vue-router'

export const aboutRoutes: RouteRecordRaw[] = [
  {
    path: '/about',
    name: 'About', // 使用更具语义化的名称，例如 'About'
    component: () => import('@features/about/AboutPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '关于我们',
      icon: 'QuestionCircle', // Element Plus 图标名称
      requiresAuth: false, // 根据你的旧定义，这个页面不需要认证
      roles: ['admin', 'user', 'guest'], // 允许所有角色访问
    },
  },
]