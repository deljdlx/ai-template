import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'src/frontend'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/frontend/index.js'),
      name: 'UselessMachine',
      fileName: 'useless-machine',
    },
  },
});
