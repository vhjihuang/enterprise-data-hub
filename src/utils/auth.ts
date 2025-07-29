// src/utils/auth.ts
import { useAuthStore } from '@/stores/auth'

/**
 * 检查当前用户是否拥有某个角色。
 * @param requiredRoles 必需的角色列表。
 */
export function hasRole(requiredRoles: string[]): boolean {
  const authStore = useAuthStore()
  const currentUserRole = authStore.currentRole
  if (!currentUserRole) {
    return false
  }
  return requiredRoles.includes(currentUserRole)
}

// 可以添加其他如 checkPermission(permissionCode: string) 等函数
