export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'available' | 'low_stock' | 'out_of_stock'
}
