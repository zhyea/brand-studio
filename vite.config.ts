import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

function classicExtensionHtml(): import('vite').Plugin {
  return {
    name: 'classic-extension-html',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /<script type="module"(?:\s+crossorigin)?\s+src=/,
        '<script defer src=',
      );
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [vue(), classicExtensionHtml()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        editor: resolve(__dirname, 'editor.html'),
      },
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
