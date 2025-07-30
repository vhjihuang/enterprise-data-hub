import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'
console.log('Resolved path:', path.resolve(__dirname, './src/features'))
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
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@auth-store': path.resolve(__dirname, './src/features/auth/stores'),
      '@features/auth/api/auth': path.resolve(
        __dirname,
        './tests/unit/features/auth/__mocks__/api.ts',
      ),
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  server: {
    host: true, // 监听所有网络接口
    port: 5173, // 明确指定端口
    strictPort: true, // 端口占用直接报错
    open: true, // 自动打开浏览器
  },
})
