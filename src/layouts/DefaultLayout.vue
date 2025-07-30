    <!-- src/layouts/DefaultLayout.vue -->
    <script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useMenuRoutes } from '@/composables/useMenuRoutes'
    import { useAuthStore } from '@/features/auth/stores/useAuthStore'

    import {
      ElContainer, ElAside, ElHeader, ElMain, ElMenu, ElMenuItem, ElIcon, ElAvatar, ElButton,
    } from 'element-plus'
    import * as ElementPlusIconsVue from '@element-plus/icons-vue'

    // 导入 Element Plus Icons
    const {
      Fold,
      Expand,
      Bell,
      SwitchButton,
      // 根据你菜单中使用的图标，可能需要在这里添加更多 Element Plus Icons
      // 例如：HomeFilled, User, ShoppingCart, Odometer, QuestionCircle 等
      // 请根据 useMenuRoutes.ts 中路由 meta.icon 的值来补充
    } = ElementPlusIconsVue

    const { menuRoutes } = useMenuRoutes()
    const router = useRouter()
    const isCollapse = ref(false)
    const authStore = useAuthStore()

    // 获取当前用户角色，用于显示
    const currentRole = computed(() => authStore.currentRole)

    const handleChangeRouter = (index: string) => {
      router.push(index)
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }
</script>

    <template>
      <el-container class="h-screen">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="transition-all duration-300 bg-gray-800 shadow-xl">
          <div
            class="flex justify-center items-center h-16 bg-gray-900 text-white font-semibold border-b border-gray-700">
            <span v-if="!isCollapse">企业数据中心</span>
            <el-icon v-else class="text-2xl cursor-pointer text-gray-400" @click="isCollapse = !isCollapse">
              <Fold />
            </el-icon>
          </div>
          <el-menu :collapse="isCollapse" class="el-menu-vertical-demo !border-r-0" background-color="#1f2937"
            text-color="#fff" active-text-color="#409EFF" :default-active="$route.path" @select="handleChangeRouter">
            <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.path">
              <el-icon>
                <!-- 动态渲染 Element Plus Icon -->
                <component
                  :is="route.meta?.icon ? ElementPlusIconsVue[route.meta.icon as keyof typeof ElementPlusIconsVue] : ''" />
              </el-icon>
              <template #title>{{ route.meta?.title }}</template>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header class="bg-white flex items-center justify-between shadow-md">
            <div class="flex items-center">
              <el-icon class="text-2xl cursor-pointer text-gray-700 mr-4" @click="isCollapse = !isCollapse">
                <component :is="isCollapse ? 'Expand' : 'Fold'" />
              </el-icon>
              <span class="text-xl font-semibold text-gray-800">{{ $route.meta?.title || '企业数据中心' }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <el-icon class="text-xl text-gray-600">
                <Bell />
              </el-icon>
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
              </el-avatar>
              <span class="text-gray-700">{{ currentRole === 'admin' ? '管理员' : '用户' }}</span> <!-- 显示当前用户角色 -->
              <el-button type="danger" link @click="handleLogout">
                <el-icon class="mr-1">
                  <SwitchButton />
                </el-icon> 登出
              </el-button>
            </div>
          </el-header>
          <el-main class="bg-gray-100 p-6">
            <!-- 布局组件的 RouterView 用于渲染子路由内容 -->
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </template>

<style scoped>
/* 可以在这里添加 DefaultLayout 独有的样式 */
</style>
