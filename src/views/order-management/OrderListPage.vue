<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getOrders, createOrder, updateOrder, deleteOrder, type Order } from '@/services/orders';
import { unwrap } from '@/utils/api';
import OrderFormDialog from '@/components/OrderFormDialog.vue';

// ==================== 新增的类型定义 ====================
type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';

interface StatusInfo {
  text: string;
  type: 'warning' | 'success' | 'info' | 'danger';
}

const ORDER_STATUS_MAP: Record<OrderStatus, StatusInfo> = {
  pending: { text: '待处理', type: 'warning' },
  shipped: { text: '已发货', type: 'success' },
  completed: { text: '已完成', type: 'info' },
  cancelled: { text: '已取消', type: 'danger' }
} as const;

// ==================== 结束类型定义 ====================

interface SearchForm {
  id: string;
  userName: string;
  status: OrderStatus | '';
}

// 初始表单状态
const INIT_SEARCH_FORM: SearchForm = {
  id: '',
  userName: '',
  status: ''
};

// 响应式数据
const searchForm = reactive({ ...INIT_SEARCH_FORM });
const allOrders = ref<Order[]>([]);
const loading = ref(false);
const currentOrder = ref<Order | undefined>(undefined);
const dialogVisible = ref(false);
const currentMode = ref<'add' | 'edit' | 'view'>('add');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true;
    const data = await unwrap(getOrders());
    allOrders.value = data;
    ElMessage.success('订单列表加载成功');
  } catch (error) {
    ElMessage.error('订单加载失败');
    console.error('订单加载错误:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusTag = (status: OrderStatus) => {
  const info = ORDER_STATUS_MAP[status]; // 现在完全类型安全
  return {
    text: info.text,
    type: info.type
  };
};

// 过滤后的订单
const filteredOrders = computed(() => {
  if (!allOrders.value.length) return [];

  const { id, userName, status } = searchForm;
  const lowerId = id.toLowerCase();
  const lowerUserName = userName.toLowerCase();

  return allOrders.value.filter(order => {
    const idMatch = !id || order.id.toLowerCase().includes(lowerId);
    const nameMatch = !userName || (order.userName && order.userName.toLowerCase().includes(lowerUserName));
    const statusMatch = !status || order.status === status;

    return idMatch && nameMatch && statusMatch;
  });
});

// 分页订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredOrders.value.slice(start, start + pageSize.value);
});

// 搜索和重置
const handleSearch = () => currentPage.value = 1;
const resetSearch = () => {
  Object.assign(searchForm, INIT_SEARCH_FORM);
  handleSearch();
};

// 订单操作
const handleAddOrder = () => {
  dialogVisible.value = true;
  currentOrder.value = undefined;
  currentMode.value = 'add';
};

const handleViewDetails = (row: Order) => {
  dialogVisible.value = true;
  currentMode.value = 'view';
  currentOrder.value = { ...row };
};

const handleEditOrder = (row: Order) => {
  dialogVisible.value = true;
  currentMode.value = 'edit';
  currentOrder.value = { ...row };
};

const handleDeleteOrder = async (row: Order) => {
  try {
    await ElMessageBox.confirm(
      `确定删除订单 ${row.id}（客户：${row.userName}）吗？`,
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await deleteOrder(row.id);
    ElMessage.success('订单删除成功');
    fetchOrders();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 表单提交
const submit = async (data: Order | Omit<Order, 'id'>, isEdit: boolean) => {
  try {
    if (isEdit) {
      await updateOrder((data as Order).id, data);
      ElMessage.success('订单更新成功');
    } else {
      await createOrder(data as Omit<Order, 'id'>);
      ElMessage.success('订单添加成功');
    }

    fetchOrders();
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(isEdit ? '订单更新失败' : '订单添加失败');
    console.error('提交错误:', error);
  }
};

// 分页变化
const handleSizeChange = (size: number) => {
  currentPage.value = 1;
  pageSize.value = size;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 初始化加载
onMounted(fetchOrders);
</script>

<template>
  <div class="order-management-container p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">订单管理</h1>

    <!-- 搜索区域 -->
    <el-card class="search-card mb-6 shadow-md">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.id" placeholder="输入订单号" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.userName" placeholder="输入用户姓名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option v-for="[value, { text }] in Object.entries(ORDER_STATUS_MAP)" :key="value" :label="text"
              :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单表格 -->
    <el-card class="order-table-card shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">订单列表</h2>
        <el-button type="success" @click="handleAddOrder" :icon="Plus">
          添加订单
        </el-button>
      </div>

      <el-table :data="paginatedOrders" style="width: 100%" v-loading="loading" border stripe highlight-current-row>
        <el-table-column prop="id" label="订单号" width="160" fixed />
        <el-table-column prop="userName" label="客户姓名" width="120" />
        <el-table-column prop="orderDate" label="订单日期" width="120" sortable />
        <el-table-column label="总金额" width="120" sortable prop="totalAmount">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status).type">
              {{ getStatusTag(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewDetails(row)">详情</el-button>
            <el-button size="small" @click="handleEditOrder(row)" :disabled="row.status !== 'pending'">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteOrder(row)"
              :disabled="row.status === 'completed'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container mt-6 flex justify-center">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper" :total="filteredOrders.length" background />
      </div>
    </el-card>

    <!-- 订单表单对话框 -->
    <OrderFormDialog v-model="dialogVisible" :mode="currentMode" :order-data="currentOrder" @submit="submit" />
  </div>
</template>

<style scoped>
.order-management-container {
  max-width: 1600px;
  margin: 0 auto;
}

.search-card {
  background-color: #f8fafc;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.order-table-card {
  min-height: 500px;
}

.pagination-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 12px;
    width: 100%;
  }
}
</style>