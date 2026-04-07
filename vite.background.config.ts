import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/** 与主构建分开：Rollup 多入口时不允许共用 inlineDynamicImports */
export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/background.ts'),
      name: 'showcaseBg',
      formats: ['iife'],
      fileName: () => 'background',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
      },
    },
  },
});
