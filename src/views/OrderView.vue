<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getOrders, deleteOrder, type Order } from '@/api/order'; // 引入 Order 类型和 getOrders
import { unwrap } from '@/utils/api'; // 请确保这个路径是正确的

const statusMap = new Map([
  ['pending', '待处理'],
  ['shipped', '已发货'],
  ['computed', '已完成'],
  ['cancelled', '已取消'],
]);

interface SearchForm {
  id: string;
  userName: string;
  status: string;
}

const INIT_SEARCH_FORM = Object.freeze({
  id: '',
  userName: '',
  status: '',
})
const searchForm = reactive<SearchForm>({ ...INIT_SEARCH_FORM })
const allOrders = ref<Order[]>([])
const loading = ref<boolean>(false)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)

const fetchOrders = async () => {
  try {
    loading.value = true
    const orderData = await unwrap(getOrders())
    allOrders.value = orderData
    ElMessage.success('订单列表加载成功!')
  } catch (err) {
    ElMessage.error('订单列表加载失败!')
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  if (!allOrders.value?.length) return []

  const { id, userName, status } = searchForm
  return allOrders.value.filter(order => {
    const idMath = !id || (id && order.id.toLowerCase().includes(id.toLowerCase()))
    const userNameMath = !userName || (order.userName && order.userName.toLowerCase().includes(userName.toLowerCase()))
    const statusMath = !status || order.status === status
    return idMath && userNameMath && statusMath
  })
})
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredOrders.value.slice(start, end);
})
const handleSearch = () => {
  currentPage.value = 1
}
const resetSearch = () => {
  Object.assign(searchForm, INIT_SEARCH_FORM)
  currentPage.value = 1
}
const handleAddOrder = () => {
  ElMessage.info('功能正在开发中...')
}
const handleViewDetails = (row: Order) => {
  ElMessage.info('功能正在开发中...')
}
const handleEditOrder = (row: Order) => {
  ElMessage.info('功能正在开发中...')
}
const handleDeleteOrder = (row: Order) => {
  ElMessageBox.confirm(`确定要删除用户${row.userName}(ID: ${row.id})吗?`, '删除后不可恢复!', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteOrder(row.id)
      ElMessage.success(`用户 ${row.userName}(ID: ${row.id}) 删除成功`)
    } catch (err: any) {
      ElMessage.error(`删除用户 ${row.userName}(ID: ${row.id}) 失败`)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
const getOrderStatusTagType = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'shipped':
      return 'success';
    case 'computed':
      return 'info';
    case 'cancelled':
      return 'danger';
  }
}
const getOrderStatusText = (status: Order['status']) => {
  return statusMap.get(status) || '未知'
}
const handleSizeChange = (size: number) => {
  currentPage.value = 1
  pageSize.value = size
}
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  fetchOrders()
})
</script>
<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">订单管理</h1>

    <el-card class="mb-6 shadow-md">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.id" placeholder="输入订单号" clearable />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.userName" placeholder="输入用户姓名" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已完成" value="completed" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已取消" value="cancelled" />
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
        <h2 class="text-2xl font-semibold text-gray-800">订单列表</h2>
        <el-button type="success" @click="handleAddOrder">添加订单</el-button>
      </div>

      <el-table :data="paginatedOrders" style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="userName" label="用户姓名" width="150" />
        <el-table-column prop="orderDate" label="订单日期" width="120" sortable />
        <el-table-column prop="totalAmount" label="总金额" width="120" sortable>
          <template #default="{ row }">
            ¥ {{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusTagType(row.status)">
              {{ getOrderStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewDetails(row)">详情</el-button>
            <el-button size="small" @click="handleEditOrder(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteOrder(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-6">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredOrders.length" />
      </div>
    </el-card>
  </div>
</template>
<style scoped></style>