<template>
  <div class="login-container bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 动态粒子背景（可选） -->
    <div class="particles absolute inset-0 overflow-hidden opacity-20 dark:opacity-10"></div>

    <el-card class="login-card relative bg-white dark:bg-gray-800 shadow-xl">
      <!-- 品牌标识 -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 mb-4 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
          <el-icon class="text-white text-2xl">
            <DataAnalysis />
          </el-icon>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">企业级数据中心</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">安全访问您的数据资产</p>
      </div>

      <el-form ref="loginForm" :model="form" :rules="rules" @submit.prevent="handleLogin" class="space-y-5">
        <el-form-item prop="username" class="!mb-6">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" class="custom-input" size="large" />
        </el-form-item>

        <el-form-item prop="password" class="!mb-6">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password
            class="custom-input" size="large" />
        </el-form-item>

        <el-form-item class="!mt-8">
          <el-button type="primary" native-type="submit" :loading="loading"
            class="w-full h-12 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <span class="font-medium">{{ loading ? '登录中...' : '登录系统' }}</span>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部信息 -->
      <div class="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
        <p>© 2023 企业数据中心 v{{ version }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { FormInstance, FormRules } from 'element-plus'

const version = __APP_VERSION__ // 来自vite配置

const router = useRouter()
const loginForm = ref<FormInstance>()
const loading = ref(false)
const authStore = useAuthStore()

const form = ref({
  username: 'admin',
  password: 'password'
})

const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleLogin = async () => {
  try {
    loading.value = true
    await loginForm.value?.validate()
    await authStore.login(form.value)
    const redirect = router.currentRoute.value.query.redirect as string || '/'
    router.replace(redirect)
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  @apply flex items-center justify-center min-h-screen p-4;
}

.login-card {
  @apply w-full max-w-md p-8 border-0;
  backdrop-filter: blur(8px);
}

.custom-input :deep(.el-input__wrapper) {
  @apply h-12 px-4 shadow-none rounded-lg border border-gray-200 dark:border-gray-600;
  background: theme('colors.white') !important;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  @apply ring-2 ring-blue-500 border-blue-500;
}

.dark .custom-input :deep(.el-input__wrapper) {
  background: theme('colors.gray.700') !important;
}

/* 粒子背景效果 */
.particles {
  background-image: radial-gradient(theme('colors.gray.400') 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark .particles {
  background-image: radial-gradient(theme('colors.gray.600') 1px, transparent 1px);
}
</style>