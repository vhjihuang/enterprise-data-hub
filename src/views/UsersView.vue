<script setup lang="ts">
import { ref, reactive, toRefs, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'; // Element Plus 组件和消息框
import { getUsers, deleteUser, type User } from '@/api/user'; // 确保引入了 deleteUser 和 User 类型
import { unwrap } from '@/utils/api'; // 引入 unwrap 函数

interface SearchForm {
  name: string
  role: string
  status: string
}

const INIT_SEARCH_FORM = Object.freeze({
  name: '',
  role: '',
  status: ''
})

const searchForm = reactive<SearchForm>({ ...INIT_SEARCH_FORM })

const allUsers = ref<User[]>([])
const loading = ref<boolean>(false)

const currentPage = ref<number>(1)
const pageSize = ref<number>(10)

// 计算属性: 过滤后的用户列表(用于筛选和查找)
const filteredUsers = computed(() => {

  if (!allUsers.value?.length) return []

  let { name, role, status } = searchForm

  return allUsers.value.filter(user => {
    const nameMath = !name || (user.name && user.name.toLowerCase().includes(name.toLowerCase()))
    const roleMath = !role || user.role === role
    const statusMath = !status || user.status === status
    return nameMath && roleMath && statusMath
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  console.log('filteredUsers', filteredUsers.value)
  return filteredUsers.value.slice(start, end);
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const allUserData = await unwrap(getUsers())
    allUsers.value = allUserData
    console.log('allUsers', allUsers.value)
    ElMessage.success('用户列表加载成功!')
  } catch (err) {
    ElMessage.error('用户列表加载失败!')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const resetSearch = () => {
  Object.assign(searchForm, INIT_SEARCH_FORM)
  currentPage.value = 1
}

const handleAddUser = () => {
  ElMessage.info('添加用户功能暂未实现')
}

const handleEditUser = (row: User) => {
  ElMessage.info(`编辑用户:${row.name}(ID: ${row.id})-功能暂未实现`)
}

const handleDeleteUser = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户${row.name}(ID: ${row.id})吗?`, '删除后不可恢复!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success(`用户 ${row.name}(ID: ${row.id}) 删除成功`)
    } catch (err: any) {
      ElMessage.error(`删除用户 ${row.name}(ID: ${row.id}) 失败`)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleSizeChange = (value: number) => {
  currentPage.value = 1
  pageSize.value = value
}

const handleCurrentChange = (value: number) => {
  currentPage.value = value
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* 样式 */
</style>
<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">用户管理</h1>

    <el-card class="mb-6 shadow-md">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="输入姓名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">用户列表</h2>
        <el-button type="success" @click="handleAddUser">添加用户</el-button>
      </div>

      <el-table :data="paginatedUsers" style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'success' : 'info'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'primary' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-6">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredUsers.length" />
      </div>
    </el-card>
  </div>
</template>