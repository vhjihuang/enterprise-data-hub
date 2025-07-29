<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { type User, getUsers, addUser, updateUser, deleteUser } from '@/services/users'
import { ElMessage, ElMessageBox, ElAlert } from 'element-plus'

import { unwrap } from '@/utils/api'

const users = ref<User[]>([])
const error = ref<string | null>(null)

// 获取用户列表
const fetchUsers = async () => {
  try {
    error.value = null; // 清除之前的错误

    // *** 关键修改：直接等待 getUsers() 的结果，不使用 unwrap ***
    const response = await unwrap(getUsers());

    if (Array.isArray(response)) {
      users.value = response; // 赋值给 ref
      ElMessage.success('用户数据获取成功！');

    } else {
      // 如果数据不是数组，说明格式不符合预期
      console.error('API 返回的数据不是数组格式:', response);
      ElMessage.error('API 返回的数据格式不正确！');
      error.value = 'API 返回数据格式错误。';
    }
  } catch (err: any) {
    error.value = '获取用户数据失败,请查看控制台和网路请求'
  }
}

// 添加新用户
const addNewUser = async () => {
  const newUser = {
    name: `新用户${Math.floor(Math.random() * 1000)}`,
    email: `newuser${Math.floor(Math.random() * 1000)}@example.com`,
    role: 'guest',
    status: 'pending'
  }
  try {
    await addUser(newUser)
    await fetchUsers()
  } catch (err: any) {
    ElMessage.error('添加用户失败')
  }
}

// 更新已有用户
const updateExistingUser = async (id: number) => {
  const currentUser = users.value.find((user) => user.id === id)
  if (!currentUser) return
  const updataStatus = currentUser.status === 'active' ? 'inactive' : 'active'
  const updateData = {
    email: `updated-${Math.floor(Math.random() * 1000)}@example.com`,
    status: updataStatus
  }
  try {
    await updateUser(id, updateData)
    ElMessage.success(`用户 ID:${id}}状态更新为 ${updataStatus}!`)
    await fetchUsers()

  } catch (err: any) {
    ElMessage.error(`更新用户 ID:${id} 失败`)
  }
}

// 删除用户
const deleteExistingUser = async (id: number) => {

  ElMessageBox.confirm(`确定要删除用户 ID:${id}吗? 此操作不可逆`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(id)
      ElMessage.success(`用户 ID: ${id}}删除成功`)
      await fetchUsers()
    } catch (err: any) {
      ElMessage.error(`删除用户 ID: ${id}失败`)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })

}
// onMounted(() => {
fetchUsers()
// })

</script>

<template>
  <div class="p-8 bg-gray-50 min-h-full">
    <h1 class="text-4xl font-bold text-blue-600 mb-6">企业级智能数据中心 - API 测试</h1>
    <el-button type="primary" size="large" @click="fetchUsers">获取用户列表</el-button>
    <el-button type="success" plain @click="addNewUser">添加用户</el-button>
    <div v-if="users.length" class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">用户列表</h2>
      <ul class="space-y-4">
        <li v-for="user in users" :key="user.id"
          class="p-3 border rounded-md bg-white shandow-md flex justify-between items-center">
          <span class="text-gray-900">{{ user.name }} ({{ user.email }}) - {{ user.role }}({{ user.status }})</span>
          <div class="ml-4">
            <el-button type="warning" size="small" @click="updateExistingUser(user.id)">更新</el-button>
            <el-button type="danger" size="small" @click="deleteExistingUser(user.id)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>
    <el-alert v-else-if="error" :title="error" class="mt-8" show-icon></el-alert>
    <el-alert v-else type="info" title="点击按钮获取或添加用户数据" class="mt-8" show-icon></el-alert>

  </div>
  <!-- <main>
    <TheWelcome />
  </main> -->
</template>
