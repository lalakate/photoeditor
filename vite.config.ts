import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: '/photoeditor/',
  plugins: [react()],
  server: {
    open: true,
    host: 'localhost',
    port: 5174,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  },
  assetsInclude: ['**/*.wasm'],
  define: {
    global: 'globalThis',
  }
})
