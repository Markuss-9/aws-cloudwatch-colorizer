import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/scripts/main.ts')
      },
      output: {
        format: 'iife',
        entryFileNames: 'main.js',
        inlineDynamicImports: true
      }
    }
  }
});
