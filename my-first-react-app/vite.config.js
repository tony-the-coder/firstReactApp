import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Only the react plugin is needed here
  // You can remove base and root if they aren't strictly necessary for your specific deployment path
  // base: '/',
  // root: '.',
})