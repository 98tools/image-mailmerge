import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/microfrontend.tsx'),
      formats: ['es'],
      fileName: 'image-mailmerge-mf',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})