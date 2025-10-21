import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/welcome',
  server: {
    host: '0.0.0.0', // Binds to all interfaces, allowing access from other devices
    port: 5177, // Default port, can be changed if needed
  },
  build: {
    outDir: '../backend/dist' // Output directory
  },
});
