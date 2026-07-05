import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from https://parthpatelsj.github.io/satsang-diksha-games/
  base: '/satsang-diksha-games/',
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173 },
})
