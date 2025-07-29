<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

import { ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElMenuItem, ElIcon, ElAvatar } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useMenuRoutes } from '@/composables/useMenuRoutes'
import { useAuthStore } from '@/stores/auth'

const { menuRoutes } = useMenuRoutes()
const router = useRouter()
const isCollapse = ref(false)
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoading = computed(() => !authStore.isInitialized)
const handleChangeRouter = (index: string) => {
  router.push(index)
}
const handleLogout = async () => {

  await authStore.logout()
  router.push('/login')
}

// 后面可以优化错误边界处理（App.vue）

onMounted(() => {
  console.log('isAuthenticated:', isAuthenticated)
  if (!authStore.isInitialized) {
    authStore.initializeAuth()
  }
})
</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white z-50">
    <el-icon class="animate-spin text-4xl text-blue-500">
      <Loading />
    </el-icon>
  </div>
  <div v-if="isAuthenticated" class="common-layout">
    <el-container class="h-screen">
      <el-aside :width="isCollapse ? '64px' : '200px'" class="transition-all duration-300 bg-gray-800 shadow-xl">
        <div
          class="flex justify-center items-center h-16 bg-gray-900 text-white font-semibold border-b border-gray-700">
          <span v-if="!isCollapse">企业数据中心</span>
          <el-icon v-else class="text-2xl cursor-pointer text-gray-400" @click="isCollapse = !isCollapse">
            <Fold />
          </el-icon>
        </div>
        <el-menu :collapse="isCollapse" class="el-menu-vertical-demo !border-r-0" background-color="#1f2937"
          text-color="#fff" active-text-color="#409EFF" :default-active="$route.path" @select="handleChangeRouter">
          <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.path">
            <el-icon>
              <component
                :is="route.meta?.icon ? ElementPlusIconsVue[route.meta.icon as keyof typeof ElementPlusIconsVue] : ''" />
            </el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="bg-white flex items-center justify-between shadow-md">
          <div class="flex items-center">
            <el-icon class="text-2xl cursor-pointer text-gray-700 mr-4" @click="isCollapse = !isCollapse">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
            <span class="text-xl font-semibold text-gray-800">{{ $route.meta?.title || '企业数据中心' }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <el-icon class="text-xl text-gray-600">
              <Bell />
            </el-icon>
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
            </el-avatar>
            <span class="text-gray-700">管理员</span>
            <el-button type="danger" link @click="handleLogout">
              <el-icon class="mr-1">
                <SwitchButton />
              </el-icon> 登出
            </el-button>
          </div>
        </el-header>
        <el-main class="bg-gray-100 p-6">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>

  <RouterView v-else />
</template>

<style scoped></style>
