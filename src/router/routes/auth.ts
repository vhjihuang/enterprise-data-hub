// src/router/routes/auth.ts
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login', // 路由名称，与 LoginPage.vue 对应
    component: () => import('@/features/auth/LoginPage.vue'), // ✅ 指向新的页面路径
    meta: {
      title: '登录',
      requiresAuth: false, // 登录页面不需要认证
      hidden: true, // 登录页面通常不在菜单中显示
      roles: ['guest'], // 仅限未登录用户访问
    },
  },
  // 如果未来有注册、忘记密码等页面，可以添加到这里
]
