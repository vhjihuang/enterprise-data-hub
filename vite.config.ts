import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dirs: ['./src/composables'],
      dts: './auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/components', 'src/views'],
      resolvers: [ElementPlusResolver()],
      dts: './components.d.ts',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // 监听所有网络接口
    port: 5173, // 明确指定端口
    strictPort: true, // 端口占用直接报错
    open: true, // 自动打开浏览器
  },
})
