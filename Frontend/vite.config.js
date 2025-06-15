import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['localhost', 'a223-190-211-41-93.ngrok-free.app',
      '59fc-190-5-35-38.ngrok-free.app',
      '0db0-190-5-35-38.ngrok-free.app'
    ]
  }
})
