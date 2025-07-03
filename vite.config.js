import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y React DOM
          'react-vendor': ['react', 'react-dom'],
          // Separar React Router
          'router-vendor': ['react-router-dom'],
          // Separar librerías de UI
          'ui-vendor': ['sweetalert2', 'react-confetti'],
          // Separar librerías de gráficos
          'charts-vendor': ['recharts'],
          // Separar Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // Configurar límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales
    minify: 'esbuild', // Cambiar a esbuild que es más estable
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
