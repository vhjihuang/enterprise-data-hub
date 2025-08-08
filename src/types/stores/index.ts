// Store 基础类型
export interface BaseStore {
  $id: string
  $reset: () => void
  $patch: (partialStateOrMutator: any) => void
  $dispose: () => void
}

// 认证 Store 类型
export interface AuthStore extends BaseStore {
  // State
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean

  // Getters
  currentUser: User | null
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  initializeAuth: () => void
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  permissions: string[]
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 用户管理 Store 类型
export interface UserStore extends BaseStore {
  // State
  users: User[]
  currentUser: User | null
  loading: boolean
  total: number
  page: number
  pageSize: number

  // Getters
  getUserById: (id: number) => User | undefined
  getUsersByRole: (role: string) => User[]

  // Actions
  fetchUsers: (params?: FetchUsersParams) => Promise<void>
  createUser: (userData: CreateUserData) => Promise<void>
  updateUser: (id: number, userData: UpdateUserData) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  setCurrentUser: (user: User) => void
}

export interface FetchUsersParams {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  status?: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  role?: string
  status?: string
}

// 商品管理 Store 类型
export interface ProductStore extends BaseStore {
  // State
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  total: number
  page: number
  pageSize: number

  // Getters
  getProductById: (id: number) => Product | undefined
  getProductsByCategory: (category: string) => Product[]

  // Actions
  fetchProducts: (params?: FetchProductsParams) => Promise<void>
  createProduct: (productData: CreateProductData) => Promise<void>
  updateProduct: (id: number, productData: UpdateProductData) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  setCurrentProduct: (product: Product) => void
}

export interface FetchProductsParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  status?: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  stock?: number
  category?: string
  status?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: string
  createdAt: string
  updatedAt: string
}

// 订单管理 Store 类型
export interface OrderStore extends BaseStore {
  // State
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  total: number
  page: number
  pageSize: number

  // Getters
  getOrderById: (id: number) => Order | undefined
  getOrdersByStatus: (status: string) => Order[]

  // Actions
  fetchOrders: (params?: FetchOrdersParams) => Promise<void>
  createOrder: (orderData: CreateOrderData) => Promise<void>
  updateOrder: (id: number, orderData: UpdateOrderData) => Promise<void>
  deleteOrder: (id: number) => Promise<void>
  setCurrentOrder: (order: Order) => void
}

export interface FetchOrdersParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  userId?: number
}

export interface CreateOrderData {
  userId: number
  products: OrderProduct[]
}

export interface UpdateOrderData {
  status?: string
  products?: OrderProduct[]
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  products: OrderProduct[]
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface OrderProduct {
  productId: number
  quantity: number
  price: number
}

// 全局状态 Store 类型
export interface RootStore extends BaseStore {
  // State
  globalLoading: boolean
  globalError: string | null
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  userPreferences: UserPreferences

  // Getters
  currentTheme: string
  isSidebarCollapsed: boolean
  getUserPreferences: UserPreferences

  // Actions
  setGlobalLoading: (loading: boolean) => void
  setGlobalError: (error: string | null) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  initializeApp: () => void
}

export interface UserPreferences {
  language: string
  timezone: string
  notifications: boolean
  autoSave: boolean
} 