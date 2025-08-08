<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoading = computed(() => !authStore.isInitialized)

// 后面可以优化错误边界处理（App.vue）

onMounted(() => {
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
  <DefaultLayout v-else-if="isAuthenticated" />
  <RouterView v-else />
</template>

<style scoped></style>
