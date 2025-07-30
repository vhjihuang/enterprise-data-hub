import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import path from 'node:path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@features': path.resolve(__dirname, './src/features'),
        '@auth-store': path.resolve(__dirname, './src/features/auth/stores'),
        '@features/auth/api/auth': path.resolve(
          __dirname,
          './tests/unit/features/auth/__mocks__/api.ts',
        ),
      },
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts', 'vitest.config.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: ['./tests//unit/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
  }),
)
