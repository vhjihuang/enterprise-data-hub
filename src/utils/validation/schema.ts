// 验证模式定义
// 注意：这里使用基础的验证函数，如需 Zod 集成，请安装 zod 包

// 基础验证规则
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message?: string
  validator?: (value: any) => boolean | string
}

// 用户相关验证
export const userValidation = {
  username: {
    required: true,
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: '用户名长度为3-20位，只能包含字母、数字和下划线'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址'
  },
  password: {
    required: true,
    min: 6,
    max: 20,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    message: '密码至少6位，包含大小写字母和数字'
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码'
  }
}

// 商品相关验证
export const productValidation = {
  name: {
    required: true,
    min: 2,
    max: 100,
    message: '商品名称长度为2-100位'
  },
  price: {
    required: true,
    validator: (value: number) => {
      return value > 0 ? true : '价格必须大于0'
    }
  },
  stock: {
    required: true,
    validator: (value: number) => {
      return value >= 0 ? true : '库存不能为负数'
    }
  },
  category: {
    required: true,
    message: '请选择商品分类'
  }
}

// 订单相关验证
export const orderValidation = {
  userId: {
    required: true,
    validator: (value: number) => {
      return value > 0 ? true : '请选择用户'
    }
  },
  products: {
    required: true,
    validator: (value: any[]) => {
      return value && value.length > 0 ? true : '请选择商品'
    }
  }
}

// 通用验证函数
export function validateField(value: any, rule: ValidationRule): string | true {
  // 必填验证
  if (rule.required && (value === undefined || value === null || value === '')) {
    return rule.message || '此字段为必填项'
  }

  // 长度验证
  if (rule.min !== undefined && value && value.length < rule.min) {
    return rule.message || `最小长度为${rule.min}`
  }

  if (rule.max !== undefined && value && value.length > rule.max) {
    return rule.message || `最大长度为${rule.max}`
  }

  // 模式验证
  if (rule.pattern && value && !rule.pattern.test(value)) {
    return rule.message || '格式不正确'
  }

  // 自定义验证
  if (rule.validator) {
    const result = rule.validator(value)
    if (typeof result === 'string') {
      return result
    }
    if (!result) {
      return rule.message || '验证失败'
    }
  }

  return true
}

// 验证表单
export function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field in rules) {
    const value = data[field]
    const rule = rules[field]
    const result = validateField(value, rule)

    if (typeof result === 'string') {
      errors[field] = result
    }
  }

  return errors
}

// 验证单个字段
export function validateSingleField(value: any, rule: ValidationRule): string | true {
  return validateField(value, rule)
}

// 异步验证函数
export async function validateFieldAsync(
  value: any, 
  rule: ValidationRule & { asyncValidator?: (value: any) => Promise<boolean | string> }
): Promise<string | true> {
  // 先进行同步验证
  const syncResult = validateField(value, rule)
  if (typeof syncResult === 'string') {
    return syncResult
  }

  // 异步验证
  if (rule.asyncValidator) {
    try {
      const result = await rule.asyncValidator(value)
      if (typeof result === 'string') {
        return result
      }
      if (!result) {
        return rule.message || '验证失败'
      }
    } catch (error) {
      return '验证过程中发生错误'
    }
  }

  return true
}

// 导出验证规则
export const validationRules = {
  user: userValidation,
  product: productValidation,
  order: orderValidation
} 