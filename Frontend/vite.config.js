import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['localhost', 'a223-190-211-41-93.ngrok-free.app',
      '4f64-190-5-38-87.ngrok-free.app',
      '0629-190-5-38-87.ngrok-free.app'
    ]
  }
})
