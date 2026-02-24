import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: React + Tailwind CSS v4 (no separate tailwind.config.js needed)
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // SPA fallback: on refresh (or direct link) to /level/3, /final, etc., serve index.html
    // so the client router can show the correct page instead of 404 or redirecting to main.
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          const isAsset = url.startsWith('/src/') || url.startsWith('/node_modules/') || url.startsWith('/@') || url.includes('.')
          if (!isAsset && url !== '/' && !url.startsWith('/vite.svg')) {
            req.url = '/index.html'
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          if (!url.startsWith('/assets/') && !url.includes('.') && url !== '/') {
            req.url = '/index.html'
          }
          next()
        })
      },
    },
  ],
})
