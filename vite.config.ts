import {defineConfig} from 'vite'
import r from '@vitejs/plugin-react'
import tw from '@tailwindcss/vite'

export default defineConfig({ 
  plugins:[r(),tw()],
  
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'script.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})