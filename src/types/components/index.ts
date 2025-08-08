// 基础组件 Props 类型
export interface BaseComponentProps {
  class?: string
  style?: string | Record<string, any>
}

// 按钮组件类型
export interface ButtonProps extends BaseComponentProps {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
  icon?: string
  round?: boolean
  circle?: boolean
}

// 表单组件类型
export interface FormProps extends BaseComponentProps {
  model?: Record<string, any>
  rules?: Record<string, any>
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
}

export interface FormItemProps extends BaseComponentProps {
  prop?: string
  label?: string
  required?: boolean
  rules?: any[]
  error?: string
}

// 输入框组件类型
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showPassword?: boolean
  size?: 'large' | 'default' | 'small'
  prefixIcon?: string
  suffixIcon?: string
}

// 表格组件类型
export interface TableProps extends BaseComponentProps {
  data?: any[]
  columns?: TableColumn[]
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  loading?: boolean
  height?: string | number
  maxHeight?: string | number
  showHeader?: boolean
  highlightCurrentRow?: boolean
}

export interface TableColumn {
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
}

// 分页组件类型
export interface PaginationProps extends BaseComponentProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  small?: boolean
  hideOnSinglePage?: boolean
}

// 对话框组件类型
export interface DialogProps extends BaseComponentProps {
  modelValue?: boolean
  title?: string
  width?: string
  fullscreen?: boolean
  top?: string
  modal?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
}

// 消息提示类型
export interface MessageOptions {
  message?: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  showClose?: boolean
  center?: boolean
  onClose?: () => void
}

// 通知类型
export interface NotificationOptions {
  title?: string
  message?: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose?: boolean
  onClose?: () => void
} 