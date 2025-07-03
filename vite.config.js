import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Configurar límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
  },
})
