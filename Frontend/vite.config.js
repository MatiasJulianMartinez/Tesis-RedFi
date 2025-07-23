import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // esto habilita acceso desde otros dispositivos
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Red-Fi',
        short_name: 'Red-Fi',
        description: 'Conectividad óptima donde estés',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'redfi.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'redfi-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'redfi-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: { 
    alias: { '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs' }, 
  }, 
});
