import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills  } from 'vite-plugin-node-polyfills'


// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    nodePolyfills ()
  ],
  preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  port: 3000,
  strictPort: true,
  host: true,
  origin: "http://127.0.0.1:8080",
 },
})
