import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],        // 修正：缺少方括号和多了一个括号
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})