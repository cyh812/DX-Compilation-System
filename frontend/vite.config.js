import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global.structuredClone': (obj) => {
      return JSON.parse(JSON.stringify(obj));
    }
  },
  server: {
    proxy: {
      // 以 /api 开头的请求，转发到后端 8000 端口
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
