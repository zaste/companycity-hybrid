import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'core': ['./src/core/index.js'],
          'components': ['./src/components/index.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three']
  }
});