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
  build: {
    // Vendor separado del código de la app: las librerías cambian mucho
    // menos que las páginas, así el navegador las cachea a largo plazo
    // en vez de re-descargarlas en cada deploy.
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
});
