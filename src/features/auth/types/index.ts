export interface LoginResponse {
  token: string
  role: 'admin' | 'user' | 'guest'
  username: string
}

export type AuthState = {
  token: string | null
  userRole: 'admin' | 'user' | 'guest' | null | string
  username: string | null
  isInitialized: boolean
}