<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { type Product } from '@/services/products'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';

// 定义类型
interface Props {
  modelValue: boolean
  productData?: Product
}

// 限制传参规则
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Omit<Product, 'id'> | Product, isEdit: boolean): void
  (e: 'cancel'): void
}

const FORMDATA = Object.freeze({
  name: '',
  category: '',
  price: 0,
  stock: 1,
  status: 'available',
})

// 逻辑
const emit = defineEmits<Emits>()
const props = defineProps<Props>()



// 数据
const dialogVisible = ref<boolean>(props.modelValue)

// 表单数据
const formData = reactive<Partial<Product>>({ ...FORMDATA })
const formRef = ref<FormInstance>()
const isEdit = ref<boolean>(false)

// 表单验证规则
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入产品名', trigger: 'blur' }],
  category: [{ required: true, message: '请输入分类', trigger: 'change' },],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue
  if (props.productData) {
    Object.assign(formData, props.productData)
    isEdit.value = true
  } else {
    Object.assign(formData, FORMDATA)
    isEdit.value = false
  }
  formRef.value?.clearValidate()
}, { immediate: true })

const handleCancel = () => {
  emit('update:modelValue', false)
}
const handleSubmit = async () => {
  if (!formRef.value) return
  formRef.value?.validate(valid => {
    if (valid) {
      emit('submit', { ...formData, price: Number(formData.price), stock: Number(formData.stock) } as Omit<Product, 'id'> | Product, isEdit.value)
    } else {
      ElMessage.error('请检查表单输入！');
    }
  })
}
const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="500px" :before-close="handleClose"
    destroy-on-close>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="产品名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入产品名"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%;">
          <el-option label="Electronics" value="Electronics" />
          <el-option label="Accessories" value="Accessories" />
          <el-option label="Audio" value="Audio" />
          <el-option label="Storage" value="Storage" />
          <el-option label="Furniture" value="Furniture" />
        </el-select>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="formData.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" placeholder="请输入库存"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%;">
          <el-option label="有货" value="available" />
          <el-option label="库存不足" value="low_stock" />
          <el-option label="缺货" value="out_of_stock" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? '保存' : '添加' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>