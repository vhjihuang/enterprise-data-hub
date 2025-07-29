<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { type User } from '@/services/users'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';

// 定义类型
interface Props {
  modelValue: boolean
  isEdit: boolean
  userData?: User
}

// 限制传参规则
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Omit<User, 'id'> | User, isEdit: boolean): void
  (e: 'cancel'): void
}

const FORMDATA = Object.freeze({
  name: '',
  email: '',
  role: '',
  status: 'active'
})

// 逻辑
const emit = defineEmits<Emits>()
const props = defineProps<Props>()



// 数据
const dialogVisible = ref<boolean>(props.modelValue)

// 表单数据
const formData = reactive<Partial<User>>({ ...FORMDATA })
const formRef = ref<FormInstance>()

// 表单验证规则
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }], email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue
  if (props.isEdit) {
    Object.assign(formData, props.userData)
  } else {
    Object.assign(formData, FORMDATA)
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
      emit('submit', { ...formData } as Omit<User, 'id'> | User, props.isEdit)
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
  <el-dialog v-model="dialogVisible" :title="props.isEdit ? '编辑用户' : '添加用户'" width="500px" :before-close="handleClose"
    destroy-on-close>
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%;">
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="普通用户" value="user"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%;">
          <el-option label="活跃" value="active"></el-option>
          <el-option label="禁用" value="inactive"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ props.isEdit ? '保存' : '添加' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>