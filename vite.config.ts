import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 神绘简历 - Vite 配置
// 开发模式下 /api 代理到本地 server.mjs（3001 端口），生产环境由 server.mjs 同源托管。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
})
