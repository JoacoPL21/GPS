import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: ['localhost', 'eccomerce-cyizlkvn3-tyrf1ngs-projects.vercel.app','b896-190-5-38-87.ngrok-free.app']
  }
})