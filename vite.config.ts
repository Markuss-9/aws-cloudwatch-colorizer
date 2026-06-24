import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tailwindcss(),
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
          src: 'img/aws_colorized_128x128.png',
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
    silent: 'passed-only',
  },
});
