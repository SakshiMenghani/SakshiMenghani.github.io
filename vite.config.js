import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base works for both user sites (username.github.io) and project sites (username.github.io/repo).
export default defineConfig({
  base: './',
  plugins: [react()],
})
