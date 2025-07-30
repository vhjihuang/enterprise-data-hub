// 类型定义更清晰，添加文档注释
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  orderDate: string
  totalAmount: number
  status: OrderStatus
  items: OrderItem[]
}

export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled'
