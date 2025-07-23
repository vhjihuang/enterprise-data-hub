import { computed } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'

export function useMenuRoutes() {
  const router = useRouter()
  const menuRoutes = computed<RouteRecordRaw[]>(() => {
    return router
      .getRoutes()
      .filter((route) => route.meta?.title && !route.meta.hidden && route.children?.length === 0)
  })
  return { menuRoutes }
}
