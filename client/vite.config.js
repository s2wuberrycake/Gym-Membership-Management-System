import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // forward /uploads/* to your API server
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // rewrite the path if needed; not necessary here since both servers use /uploads
        // rewrite: (path) => path.replace(/^\/uploads/, "/uploads"),
      },
    },
  },
})
