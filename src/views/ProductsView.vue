<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts, type Product } from '@/api/product'
import { unwrap } from '@/utils/api'

interface searchForm {
  name: string
  category: string
  status: string
}
const statusMap = new Map([
  ['available', '正常'],
  ['low_stock', '库存低'],
  ['out-of-stock', '缺货'],
])
const ININ_PRODUCTS = Object.freeze({ name: "", category: "", status: "", })
const searchForm = reactive<searchForm>({ ...ININ_PRODUCTS })
const allProducts = ref<Product[]>([])
const loading = ref<boolean>(false)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)

const handleSearch = () => {
  currentPage.value = 1
}
const resetSearch = () => {
  Object.assign(searchForm, ININ_PRODUCTS)
  currentPage.value = 1
}

const filteredProducts = computed(() => {
  if (!allProducts.value?.length) return []

  const { name, category, status } = searchForm

  return allProducts.value.filter(product => {
    const nameMath = !name || (product.name && product.name.toLowerCase().includes(name.toLowerCase()))
    const categoryMath = !category || product.category === category
    const statusMath = !status || product.status === status
    return nameMath && categoryMath && statusMath
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
})
const fetchProducts = async () => {
  try {
    loading.value = true
    const productData = await unwrap(getProducts())
    allProducts.value = productData
    ElMessage.success('商品列表加载成功!')
  } catch (err) {
    ElMessage.error('商品列表加载失败!')
  } finally {
    loading.value = false
  }
}
const handleAddProduct = () => {
  ElMessage.info('功能正在开发中...')
}

const getProductStatusTagType = (status: Product['status']) => {
  switch (status) {
    case 'available':
      return 'success'
    case 'low_stock':
      return 'warning'
    case 'out-of-stock':
      return 'danger'
    default:
      return 'info'
  }
}
const getProductStatusText = (status: Product['status']) => {

  return statusMap.get(status) || '未知'
}

const handleEditProduct = () => {
  ElMessage.info('功能正在开发中...')
}
const handleDeleteProduct = () => {
  ElMessage.info('功能正在开发中...')
}

const handleSizeChange = (value: number) => {
  currentPage.value = 1
  pageSize.value = value
}
const handleCurrentChange = (value: number) => {
  currentPage.value = value
}

onMounted(() => {
  fetchProducts()
})
</script>
<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">产品管理</h1>

    <el-card class="mb-6 shadow-md">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="searchForm.name" placeholder="输入产品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="选择分类" clearable>
            <el-option label="Electronics" value="Electronics" />
            <el-option label="Accessories" value="Accessories" />
            <el-option label="Audio" value="Audio" />
            <el-option label="Storage" value="Storage" />
            <el-option label="Furniture" value="Furniture" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="有货" value="available" />
            <el-option label="库存不足" value="low_stock" />
            <el-option label="缺货" value="out_of_stock" />
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
        <h2 class="text-2xl font-semibold text-gray-800">产品列表</h2>
        <el-button type="success" @click="handleAddProduct">添加产品</el-button>
      </div>

      <el-table :data="paginatedProducts" style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="产品名称" width="200" />
        <el-table-column prop="category" label="分类" width="150" />
        <el-table-column prop="price" label="价格" width="120" sortable>
          <template #default="{ row }">
            ¥ {{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" sortable />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getProductStatusTagType(row.status)">
              {{ getProductStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditProduct(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteProduct(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-6">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredProducts.length" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
/* 样式 */
</style>