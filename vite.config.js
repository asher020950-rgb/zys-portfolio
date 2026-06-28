import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/zys-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['three'],
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    exclude: ['three'],
  },
})
