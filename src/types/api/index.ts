// API 基础响应类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  role?: string
  status?: 'active' | 'inactive'
}

// 商品相关类型
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
  status?: 'active' | 'inactive'
}

// 订单相关类型
export interface Order {
  id: number
  orderNumber: string
  userId: number
  products: OrderProduct[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderProduct {
  productId: number
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  userId: number
  products: OrderProduct[]
}

export interface UpdateOrderRequest {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
} 