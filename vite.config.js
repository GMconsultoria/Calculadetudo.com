import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // No root slash prefix to ensure assets resolve properly during static build
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  }
});
