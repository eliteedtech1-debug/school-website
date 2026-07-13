import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@elscholar-ui': path.resolve(__dirname, 'src/elscholar-ui'),
    },
  },
  define: {
    'process.env': {},
  },
})
