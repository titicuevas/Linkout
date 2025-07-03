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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar librerías de UI y utilidades
          'ui-vendor': ['sweetalert2', 'react-confetti', 'react-paginate'],
          // Separar librerías de gráficos
          'charts-vendor': ['recharts'],
          // Separar Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // Separar utilidades
          'utils-vendor': ['dayjs', 'axios'],
        },
        // Optimizar nombres de archivos
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Configurar límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true,
      },
    },
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
