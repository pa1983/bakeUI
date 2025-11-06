import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// reference: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['./node_modules'],
      },
    },
  },
})
