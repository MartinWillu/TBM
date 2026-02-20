import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      // Provide an explicit app-level constant derived from an env var.
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [react()],
    preview: {
      port: Number(env.FRONTEND_PORT) || 80,
      strictPort: true,
      allowedHosts: env.FRONTEND_HOSTNAME ? [env.FRONTEND_HOSTNAME] : ["localhost"]
    },
    server: {
      port: 80,
      strictPort: true,
      host: true,
      origin: `http://0.0.0.0:${Number(env.FRONTEND_PORT) || 80}`,
      proxy: {
        "/api": {
          target: env.BACKEND_API_HOST || "http://localhost:5200",
          changeOrigin: true,
        }
      }
    },
    optimizeDeps: {
      exclude: ["msw", "@mswjs/interceptors"]
    }
  }
})