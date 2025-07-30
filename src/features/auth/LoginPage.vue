// src/views/LoginView.vue
<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>企业级数据中心</h2>
      <el-form ref="loginForm" :model="form" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" class="login-btn">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 导入 Pinia 的 Auth Store
import { useAuthStore } from '@/features/auth/stores/useAuthStore' // 确保路径正确
import type { FormInstance, FormRules } from 'element-plus'

// 移除或注释掉这行：
// console.log('LoginView mounted')

const router = useRouter()
const loginForm = ref<FormInstance>()
const loading = ref(false)

// 获取 Auth Store 实例
const authStore = useAuthStore()

const form = ref({
  username: '', // 移除 'admin'
  password: ''  // 移除 'password'
})

const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleLogin = async () => {
  try {
    loading.value = true
    // 1. 表单验证
    await loginForm.value?.validate()

    // 2. 调用 Auth Store 的 login action
    // Auth Store 的 login action 内部会处理 API 调用和 token/role 的存储
    await authStore.login(form.value)

    // 3. 登录成功后跳转
    const redirect = router.currentRoute.value.query.redirect as string
    router.replace(redirect || '/') // 优化：改为 replace，防止回退到登录页
  } catch (error) {
    // 错误处理：Axios 拦截器已经通过 ElMessage 显示错误消息了，
    // 这里可以进行一些组件内部的额外处理，例如重置表单或显示更具体的错误给用户。
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 30px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 30px;
  color: #333;
}

.login-btn {
  width: 100%;
}
</style>