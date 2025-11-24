import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    // Increase limit to remove warnings
    chunkSizeWarningLimit: 1500, // 1.5 MB

    // Split large libraries into separate chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue core
          vue: ['vue', 'vue-router', 'pinia'],

          // PDF libraries (usually heavy!)
          pdf: ['jspdf', 'html2canvas', 'pdf-lib'],

          // Any frequently used libraries
          utils: ['axios'],
        },
      },
    },

    // Ensures optimal preload handling
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
  },
})
