<template>
  <aside class="bg-gray-800 text-white w-64 min-h-screen">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-6">企业数据中心</h2>
      
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          :class="{ 'bg-blue-600': $route.path === item.path }"
        >
          <el-icon class="mr-3">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  Odometer, 
  User, 
  ShoppingCart, 
  Document,
  Setting,
  QuestionCircle 
} from '@element-plus/icons-vue'

const menuItems = [
  { name: '仪表盘', path: '/', icon: 'Odometer' },
  { name: '用户管理', path: '/users', icon: 'User' },
  { name: '商品管理', path: '/products', icon: 'ShoppingCart' },
  { name: '订单管理', path: '/orders', icon: 'Document' },
  { name: '角色管理', path: '/roles', icon: 'Setting' },
  { name: '关于我们', path: '/about', icon: 'QuestionCircle' }
]
</script> 