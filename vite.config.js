import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/EcoLife/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../',
    emptyOutDir: false,
  },
})
