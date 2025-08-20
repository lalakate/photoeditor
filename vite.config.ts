import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/photoeditor/',
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
