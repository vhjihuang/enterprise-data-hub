<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue'
import type { Order, OrderItem } from '../api/order'
import { getUsers, type User } from '../api/user'
import { getProducts, type Product } from '../api/product'
import type { FormInstance, FormRules, FormItemRule } from 'element-plus'
import { ElMessage, ElLoading } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { unwrap } from '@/utils/api'
import dayjs from 'dayjs'

// ==================== 类型定义 ====================
interface Props {
  modelValue: boolean
  orderData?: Order
  mode: 'view' | 'edit' | 'add'
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Order, isEdit: boolean): void
  (e: 'cancel'): void
}

// ==================== 常量定义 ====================
const ORDER_STATUS_OPTIONS = [
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '已发货', value: 'shipped' },
  { label: '已取消', value: 'cancelled' }
]

const EMPTY_ORDER_ITEM: OrderItem = {
  productId: '',
  productName: '',
  quantity: 1,
  price: 0
}

const DEFAULT_FORM_DATA: Order = {
  id: '',
  userId: '',
  userName: '',
  orderDate: dayjs().format('YYYY-MM-DD'),
  totalAmount: 0,
  status: 'pending',
  items: []
}

// ==================== 组件逻辑 ====================
const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const loading = ref(false)
const usersList = ref<User[]>([])
const productsList = ref<Product[]>([])

const formData = reactive<Order>({ ...DEFAULT_FORM_DATA })
const isEditMode = computed(() => props.mode === 'edit')
const isViewMode = computed(() => props.mode === 'view')

// ==================== 计算属性 ====================
const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) =>
    sum + (item.quantity || 0) * (item.price || 0), 0).toFixed(2)
})

// ==================== 表单验证 ====================
const rules = reactive<FormRules>({
  userId: [{
    required: true,
    message: '请选择用户',
    trigger: 'change'
  }],
  orderDate: [{
    required: true,
    message: '请选择订单日期',
    trigger: 'change'
  }],
  status: [{
    required: true,
    message: '请选择状态',
    trigger: 'change'
  }],
  items: [{
    type: 'array',
    required: true,
    validator: (_, val, callback) =>
      callback(val?.length ? undefined : new Error('至少添加一个商品'))
  }]
})

// ==================== 生命周期 ====================
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) initFormData()
})

onMounted(() => {
  fetchData()
})

// ==================== 核心方法 ====================
const fetchData = async () => {
  // 创建加载指示器（添加更多配置选项）
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '数据加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // 使用 Promise.all 并行请求（添加类型注解）
    const [usersResponse, productsResponse]: [User[], Product[]] = await Promise.all([
      unwrap(getUsers()).then(users =>
        users.map(user => ({
          ...user,
          id: String(user.id), // 确保ID类型统一为string
        }))
      ),
      unwrap(getProducts()).then(products =>
        products.map(product => ({
          ...product,
          id: String(product.id), // 确保ID类型统一为string
          price: Number(product.price) || 0 // 确保价格是数字
        }))
      )
    ]);

    // 赋值响应式数据
    usersList.value = usersResponse;
    productsList.value = productsResponse;

    // 成功提示（添加更多上下文）
    ElMessage.success({
      message: `加载成功，共 ${usersResponse.length} 个用户和 ${productsResponse.length} 个商品`,
      duration: 3000
    });

  } catch (err) {
    // 增强错误处理
    console.error('数据加载失败:', err);
    ElMessage.error({
      message: '数据加载失败，请检查网络连接或稍后重试',
      duration: 5000,
      showClose: true
    });

  } finally {
    // 确保加载指示器关闭（添加延迟避免闪烁）
    setTimeout(() => loadingInstance.close(), 300);
  }
};

const initFormData = () => {
  if (props.orderData) {
    Object.assign(formData, deepCopy(props.orderData))
  } else {
    resetForm()
    formData.items = [{ ...EMPTY_ORDER_ITEM }]
  }
}

const resetForm = () => {
  Object.assign(formData, deepCopy(DEFAULT_FORM_DATA))
}

const handleUserSelect = (userId: string) => {
  const user = usersList.value.find(u => u.id === userId)
  if (user) {
    formData.userName = user.name
    formData.userId = user.id
  }
}

const handleProductChange = (productId: string, index: number) => {
  const product = productsList.value.find(p => p.id === productId)
  if (product) {
    const item = formData.items[index]
    item.productName = product.name
    item.price = product.price
  }
}

const addItem = () => {
  formData.items.push({ ...EMPTY_ORDER_ITEM })
  nextTick(() => {
    const lastInput = document.querySelector<HTMLInputElement>(
      `.product-select:last input`
    )
    lastInput?.focus()
  })
}

const removeItem = (index: number) => {
  if (formData.items.length <= 1) {
    ElMessage.warning('至少保留一个商品项')
    return
  }
  formData.items.splice(index, 1)
  formRef.value?.validateField('items')
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true
    formData.totalAmount = parseFloat(totalAmount.value)

    emit('submit', deepCopy(formData), isEditMode.value)
    dialogVisible.value = false
  } catch (err) {
    console.error('表单提交错误:', err)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleClose = () => {
  emit('update:modelValue', false)
}

// ==================== 工具函数 ====================
const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑订单' : '新建订单'" width="800px" :before-close="handleClose"
    destroy-on-close>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" label-position="top">
      <!-- 用户信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户" prop="userId">
            <el-select v-model="formData.userId" placeholder="请选择用户" :disabled="isViewMode" @change="handleUserSelect"
              filterable style="width: 100%">
              <el-option v-for="user in usersList" :key="user.id" :label="user.name" :value="user.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="订单日期" prop="orderDate">
            <el-date-picker v-model="formData.orderDate" type="date" placeholder="选择日期" :disabled="isViewMode"
              value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 订单状态 -->
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" :disabled="isViewMode" style="width: 100%">
          <el-option v-for="status in ORDER_STATUS_OPTIONS" :key="status.value" :label="status.label"
            :value="status.value" />
        </el-select>
      </el-form-item>

      <!-- 商品列表 -->
      <el-divider content-position="left">商品清单</el-divider>
      <div v-for="(item, index) in formData.items" :key="index" class="order-item">
        <el-row :gutter="20" align="middle">
          <el-col :span="10">
            <el-form-item :label="`商品 ${index + 1}`" :prop="`items.${index}.productId`" :rules="{
              required: true,
              message: '请选择商品',
              trigger: 'change'
            }">
              <el-select v-model="item.productId" placeholder="选择商品" :disabled="isViewMode"
                @change="(val) => handleProductChange(val, index)" class="product-select" filterable
                style="width: 100%">
                <el-option v-for="product in productsList" :key="product.id" :label="product.name"
                  :value="product.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="数量" :prop="`items.${index}.quantity`" :rules="{
              required: true,
              type: 'number',
              min: 1,
              message: '请输入有效数量',
              trigger: 'blur'
            }">
              <el-input-number v-model="item.quantity" :min="1" :disabled="isViewMode" controls-position="right"
                style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="单价">
              <el-input v-model="item.price" disabled style="width: 100%" />
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-button type="danger" :icon="Delete" circle :disabled="isViewMode || formData.items.length <= 1"
              @click="removeItem(index)" />
          </el-col>
        </el-row>
      </div>

      <el-button type="primary" :icon="Plus" @click="addItem" :disabled="isViewMode">
        添加商品
      </el-button>

      <!-- 订单汇总 -->
      <el-divider content-position="left">订单汇总</el-divider>
      <el-form-item label="总金额">
        <el-input v-model="totalAmount" disabled style="width: 200px">
          <template #append>元</template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading" :disabled="isViewMode">
        {{ isEditMode ? '保存修改' : '提交订单' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.order-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-lighter);
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>