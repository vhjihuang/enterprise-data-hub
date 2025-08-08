import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'

// 全局样式
import 'element-plus/dist/index.css'
import '@/assets/main.css'

// Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function bootstrap() {
  const app = createApp(App)

  // 注册 Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 注册全局组件和插件
  app.use(createPinia())
  app.use(router)

  return app
}

export function mount(app: ReturnType<typeof createApp>) {
  app.mount('#app')
} 