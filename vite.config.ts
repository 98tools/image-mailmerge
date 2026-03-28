import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
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
      target: 'esnext',
    },
    server: getServerConfig(),
  };
})

function getServerConfig(): import('vite').ServerOptions {
  const serverConfig: import('vite').ServerOptions = {
    host: true,
    port: 5173,
    cors: true,
  };

  return serverConfig;
}