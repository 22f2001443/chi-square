import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { localApi } from './server/dev/plugin'

export default defineConfig({
  // `localApi` answers /api on the dev server only, editing the site's files on
  // disk. A production build has no such plugin: there /api is the Vercel
  // Function in api/index.ts.
  plugins: [react(), tailwindcss(), localApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  // Keep the site's PostCSS configuration out of this app's build.
  css: { postcss: { plugins: [] } },
})
