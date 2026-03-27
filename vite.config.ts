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
    server: getServerConfig(env),
  };
})

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some(allowedOrigin => {
    if (allowedOrigin.includes('*')) {
      // Convert wildcard pattern to regex
      // e.g., 'https://*.98.tools' -> /^https:\/\/.*\.98\.tools$/
      const pattern = allowedOrigin
        .replace(/\./g, '\\.')
        .replace(/\*/g, '[a-zA-Z0-9-]*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(origin);
    } else {
      // Exact match
      return origin === allowedOrigin;
    }
  });
}

function getServerConfig(env: Record<string, string>): import('vite').ServerOptions | undefined {
  // Parse allowed origins from environment variable
  const allowedOriginsStr = env.VITE_ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsStr
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

  const serverConfig: import('vite').ServerOptions = {
    host: true,
    port: 5173,
    middleware: [(req, res, next) => {
      const origin = req.headers.origin || '';
      
      // Check if origin is allowed
      if (allowedOrigins.length > 0 && isOriginAllowed(origin, allowedOrigins)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    }],
  };

  return serverConfig;
}