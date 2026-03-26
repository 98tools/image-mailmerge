import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'imageMailMerge',
      filename: 'remoteEntry.js',
      exposes: {
        './ImageMailMerge': './src/microfrontend.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.1.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.1.0',
        },
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'esnext',
  },
})
