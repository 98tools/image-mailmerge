import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

const assetDir = 'mf/image-mailmerge/base/assets'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isHTTPS = process.env.npm_lifecycle_event === 'dev:https'

  return {
    plugins: [
      react(),
      federation({
        name: 'imageMailMerge',
        filename: 'remoteEntry.js',
        exposes: {
          './ImageMailMerge': './src/ImageMailMerge.tsx'
        },
        remotes: {
          feMain: env.VITE_FE_MAIN_MF ? `${env.VITE_FE_MAIN_MF}/assets/remoteEntry.js` : 'http://localhost:5173/assets/remoteEntry.js'
        },
        shared: {
          react: {
            version: '19.1.0',
          },
          'react-dom': {
            version: '19.1.0',
          },
        },
      }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        output: {
          // Avoid `[name]-[hash]` so lazy chunks and assets are not labeled by source path / component name.
          chunkFileNames: `${assetDir}/[hash].js`,
          entryFileNames: `${assetDir}/[hash].js`,
          assetFileNames: `${assetDir}/[hash][extname]`,
        },
      },
      target: 'esnext',
    },
    server: {
      port: 9811,
      watch: {
        usePolling: true,
        interval: 300,
      },
      ...(isHTTPS
        ? {
          https: {
            key: './localhost-key.pem',
            cert: './localhost.pem',
          },
        }
        : {}),
    },
  };
})