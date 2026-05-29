import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/scripts/*.json',
          dest: '',
          rename: { stripBase: true },
        },
        {
          src: 'src/scripts/*.css',
          dest: '',
          rename: { stripBase: true },
        },
        {
          src: 'img/*.png',
          dest: 'img',
          rename: { stripBase: true },
        },
        {
          src: 'LICENSE',
          dest: '',
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'js/[name].[hash].[ext]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/scripts/tests/setup.ts'],
  },
});
