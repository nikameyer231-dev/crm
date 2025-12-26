import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/index.html')
      },
      output: {
        // preserve module structure that matches manifest service_worker path
      }
    }
  },
  server: {
    port: 5173
  }
})