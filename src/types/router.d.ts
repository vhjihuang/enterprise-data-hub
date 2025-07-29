// types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 (必填) */
    title: string
    /** 是否在菜单中隐藏 (默认false) */
    hidden?: boolean
    /** 是否需要认证 (默认false) */
    requiresAuth?: boolean
    /** 允许访问的角色 (默认允许所有角色) */
    roles?: 'admin' | 'user' | 'guest' | string[]
    /** 菜单图标 */
    icon?: string
    /** 是否缓存页面 */
    keepAlive?: boolean
    /** 是否固定在 tabs-view 中 */
    affix?: boolean
    /** 是否显示在面包屑 */
    breadcrumb?: boolean
    /** 高亮菜单路径 */
    activeMenu?: string
  }
}
