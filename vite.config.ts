import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/hooks': '/src/hooks',
      '@/services': '/src/services',
      '@/utils': '/src/utils',
      '@/types': '/src/types',
      '@/constants': '/src/constants',
      '@/contexts': '/src/contexts',
      '@/store': '/src/store',
      '@/styles': '/src/styles',
      '@/assets': '/src/assets',
      '@/lib': '/src/lib',
    },
  },
})
