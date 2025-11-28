
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
export default defineConfig({
  build:{ target:'es2018' },
  plugins: [react(), legacy({ targets: ['defaults','not IE 11','iOS >= 12','Safari >= 12'] })],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
