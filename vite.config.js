import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react()
    ,
    tailwindcss(),
    ,
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Blog Application PWA',
        short_name: 'BlogApp',
        theme_color: '#2563eb',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
      }
    })
  ]
});