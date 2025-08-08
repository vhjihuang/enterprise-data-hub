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
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { FormInstance, FormRules } from 'element-plus'

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

    // 登录成功后跳转到指定页面或默认页面
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