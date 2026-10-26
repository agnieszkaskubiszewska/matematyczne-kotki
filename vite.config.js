import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ścieżki względne – strona działa na GitHub Pages pod /<nazwa-repo>/
  base: './',
})
