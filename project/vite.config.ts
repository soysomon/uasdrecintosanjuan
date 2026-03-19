import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // si 5173 está ocupado, usa el siguiente disponible
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
