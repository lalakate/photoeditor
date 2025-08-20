import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    mockReset: true,
    exclude: [
      "emsdk/**",
      "node_modules/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "**/dist/**",
      "**/build/**",
    ],
  },
})
