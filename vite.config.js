import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@context': path.resolve(import.meta.dirname, './src/context'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@services': path.resolve(import.meta.dirname, './src/services'),
      '@data': path.resolve(import.meta.dirname, './src/data'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@constants': path.resolve(import.meta.dirname, './src/constants'),
      '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
      '@styles': path.resolve(import.meta.dirname, './src/styles'),
    }
  },
  server: {
    port: 5173,
  }
})
