import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Configurar límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales
    minify: 'esbuild', // Usar esbuild que es más estable
    // Optimizar assets
    assetsInlineLimit: 4096, // Inline assets menores a 4KB
  },
  // Optimizar desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'sweetalert2',
      'recharts',
      'react-paginate',
      'dayjs',
    ],
  },
})
